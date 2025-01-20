import { _decorator, Component, CCBoolean, ParticleSystem, Node, Animation, ParticleSystem2D, sp, MotionStreak } from "cc";
import { NodePools } from "core/NodePools";
import { ObjectPool, IPoolObject } from "core/ObjectPool";
import { TransformByTarget } from "core/TransformByTarget";
import { ConstValue } from "modules/common/ConstValue";
import { Timer, TYPE_TIMER } from "modules/time/Timer";
import { CocSyncParticle } from "../../../ccomponent/CocSyncParticle";



const { ccclass, property } = _decorator;
@ccclass("UIEffectConf")
export class UIEffectConf extends Component {
    @property({ tooltip: "粒子特效根节点", type: Node })
    EffectNode: Node;
    @property({ tooltip: "Animation配置", type: Animation })
    Anim: Animation;
    @property({ tooltip: "用于播放激活，停止隐藏的节点", type: Node })
    ShowNode: Node;
    @property(CCBoolean)
    playOnAwake: boolean = false;
    @property({ tooltip: "播放时长" })
    playTime: number = 0;
    @property({ tooltip: "延迟几秒开始播放" })
    delayPlayTime: number = 0;

    @property({ tooltip: "播放完自动销毁" })
    destroyAuto: boolean = false;

    @property({ tooltip: "父节点销毁时自动回收" })
    onPoolByParent: boolean = false;

    @property({ tooltip: "回收时重置位置" })
    onPoolReSetPos: boolean = false;

    private _arr_particle: UIEffectParticle[];
    private _ani: Animation;
    private _comp: Function;
    private _tByTarget: TransformByTarget;
    private _cocSync: CocSyncParticle;
    public target: Node;
    public isOnPool = false;

    public get arr_particle(): UIEffectParticle[] {
        return this._arr_particle;
    }

    protected onLoad() {
        if (!this._arr_particle) {
            this.init(this.playOnAwake);
        }
    }

    private onParentChange: Function;
    public onLoadByUI() {
        this.isOnPool = false;
        if (this.onPoolByParent) {
            let p = this.node.parent;
            this.onParentChange = () => {
                if (p) {
                    p.off(Node.EventType.NODE_DESTROYED, this.doOnPoolByParent, this);
                    p = undefined
                }
                if (this.node.parent) {
                    p = this.node.parent;
                    this.node.parent.once(Node.EventType.NODE_DESTROYED, this.doOnPoolByParent, this)
                }
            }
            this.node.on(Node.EventType.PARENT_CHANGED, this.onParentChange)
        }
    }



    protected onEnable(): void {
        this.isOnPool = false;
        if (this.playOnAwake) {
            this.play();
        }
    }

    init(playOnAwake = false) {
        this._arr_particle = [];
        let effect_id = this.node.name;
        let p_effect;
        if (this.EffectNode) {
            p_effect = this.EffectNode;
        } else {
            p_effect = this.EffectNode = this.node.getChildByName(ConstValue.NameEffect + effect_id);
        }

        if (p_effect) {
            this._ani = this.Anim || p_effect.getComponent(Animation);
            if (this._ani) {
                this._ani.playOnLoad = playOnAwake;
            }
            if (p_effect) {
                let fun = (children: readonly Node[]) => {
                    if (children && children.length) {
                        children.forEach(node_effect => {
                            let particle = node_effect.getComponent(ParticleSystem);
                            if (particle) {
                                particle.playOnAwake = playOnAwake;
                                this._arr_particle.push(ObjectPool.Get(UIEffectParticle, particle));
                            } else {
                                let particle2D = node_effect.getComponent(ParticleSystem2D);
                                if (particle2D) {
                                    particle2D.playOnLoad = playOnAwake;
                                    this._arr_particle.push(ObjectPool.Get(UIEffectParticle, particle2D));
                                } else {
                                    let skel = node_effect.getComponent(sp.Skeleton);
                                    if (skel) {
                                        this._arr_particle.push(ObjectPool.Get(UIEffectParticle, skel));
                                    } else {
                                        let montion = node_effect.getComponent(MotionStreak);
                                        if (montion) {
                                            this._arr_particle.push(ObjectPool.Get(UIEffectParticle, montion));
                                        }
                                        else
                                            fun(node_effect.children)
                                    }
                                }
                            }
                        });
                    }
                }
                fun(p_effect.children)
            }
        } else {
            this._ani = this.Anim
        }
        this._tByTarget = this.node.getComponent(TransformByTarget);
        this._cocSync = this.node.getComponent(CocSyncParticle);


    }

    public clean() {
        if (this.isOnPool) {
            return
        }
        this.isOnPool = true;
        NodePools.Inst().Put(this.node);
    }

    protected onDestroy() {
        // this.setDirX(SpineObjDirX.LEFT);
        this._arr_particle.forEach(element => {
            ObjectPool.Push(element);
        });
        this._arr_particle = undefined;
        this._ani = undefined;
        if (this._tByTarget) {
            this._tByTarget.target = undefined;
        }
        if (this._ht) {
            Timer.Inst().CancelTimer(this._ht);
            this._ht = undefined;
        }
        if (this._ht_dealy) {
            Timer.Inst().CancelTimer(this._ht_dealy);
            this._ht_dealy = undefined;
        }
    }

    public setComp() {
        if (this._ani)
            this._ani.on(Animation.EventType.STOP, this.onComp, this);
        // this._arr_particle.forEach(element => {
        //     element.particle.set
        // });
    }

    private onComp() {

    }
    private _ht_dealy: TYPE_TIMER;
    private _ht: TYPE_TIMER;
    public play(node?: Node, name?: string) {
        if (this.delayPlayTime) {
            if (this._ht_dealy) {
                this.stop();
                Timer.Inst().CancelTimer(this._ht_dealy);
            }
            this._ht_dealy = Timer.Inst().AddRunTimer(this.doPlay.bind(this, node), this.delayPlayTime, 1, false);
            return;
        }
        this.doPlay(node)
        this.checkPlay();
    }

    protected checkPlay() {
        if (this._cocSync) {
            this._cocSync.onPlay();
        }
    }

    protected doPlay(node?: Node, name?: string) {
        this.node.active = true;
        if (node) {
            node.addChild(this.node);
        }
        if (this._ani) {
            this._ani.play();
        }
        if (this._arr_particle) {
            this._arr_particle.forEach(element => {
                element.play();
            });
        }

        if (this.ShowNode) {
            this.ShowNode.active = true;
        }

        if (this._tByTarget) {
            this._tByTarget.target = this.target;
        }
        if (this.playTime) {
            if (this._ht) {
                Timer.Inst().CancelTimer(this._ht);
            }
            this._ht = Timer.Inst().AddRunTimer(this.stop.bind(this), this.playTime, 1, false);
        }
    }

    public stop() {
        // this.node.active = false;
        if (this._ani) {
            this._ani.stop();
        }
        if (this._arr_particle)
            this._arr_particle.forEach(element => {
                element.stop();
            });

        if (this.ShowNode) {
            this.ShowNode.active = false;
        }

        if (this._ht) {
            Timer.Inst().CancelTimer(this._ht);
            this._ht = undefined;
        }
        if (this._ht_dealy) {
            Timer.Inst().CancelTimer(this._ht_dealy);
            this._ht_dealy = undefined;
        }
        if (this.destroyAuto) {
            this.destroyBySelf();
        }
        // this.node.active = true;

        if (this.stopCallback) {
            this.stopCallback();
        }
    }

    public destroyBySelf() {
        if (this.isOnPool) {
            return
        }
        this.isOnPool = true;
        let result = NodePools.Inst().Put(this.node, true);
        if (!result) {
            if (this.node.parent) {
                this.node.parent = undefined;
            }
        }
    }

    public rePlay() {
        this.stop();
        this.doPlay();
    }

    protected stopCallback: Function;
    SetStopCallback(func: Function) {
        this.stopCallback = func;
    }

    doOnPoolByParent() {
        let parent = this.node.parent;
        this.node.off(Node.EventType.PARENT_CHANGED, this.onParentChange)
        if (parent) {
            this.node.parent = undefined;
            const removeAt = parent.children.indexOf(this.node);
            parent.children.splice(removeAt, 1);
        }
        this.doOnPoolReSetPos();
        this.stop();
        this.destroyBySelf();
    }

    doOnPoolReSetPos() {
        if (this.onPoolReSetPos) {
            this.node.setPosition(0, 0)
        }
    }

    // setDirX(x: SpineObjDirX) {
    //     if (this._dirX == x) {
    //         return;
    //     }
    //     let cx = -1;
    //     this._dirX = x;
    //     // this.EffectNode.scale = this.EffectNode.scale.multiply3f(cx, cx, 1);
    //     this._arr_particle.forEach(element => {
    //         if (element.particle._rotationOvertimeModule && element.particle._rotationOvertimeModule.enable) {
    //             element.particle._rotationOvertimeModule.z.constant *= cx;
    //         }
    //     });
    // }
}


class UIEffectParticle implements IPoolObject {
    private _particle: ParticleSystem | ParticleSystem2D | sp.Skeleton | MotionStreak;
    public get particle(): ParticleSystem | ParticleSystem2D | sp.Skeleton | MotionStreak {
        return this._particle;
    }
    private comp: 0 | 1;
    private _play: Function;
    private _stop: Function;
    reInit?(particle: ParticleSystem | ParticleSystem2D | sp.Skeleton | MotionStreak): void {
        this._particle = particle;
        if ((particle as ParticleSystem).stop) {
            this._stop = (particle as ParticleSystem).stop.bind(particle);
            this._play = (particle as ParticleSystem).play.bind(particle);
        } else if ((particle as ParticleSystem2D).stopSystem) {
            this._stop = (particle as ParticleSystem2D).stopSystem.bind(particle);
            this._play = (particle as ParticleSystem2D).resetSystem.bind(particle);
        } else if ((particle as sp.Skeleton)._skeleton) {
            let sp = particle as sp.Skeleton;
            this._play = () => {
                (particle as sp.Skeleton).setAnimation(0, sp.animation, sp.loop)
            }
            this._stop = () => {
                if (sp.isAnimationCached()) {
                    sp._frameCache && sp._frameCache.end();
                } else {
                    sp.clearTracks();
                }
            }
        } else if ((particle as MotionStreak).reset) {
            this._stop = (particle as MotionStreak).reset.bind(particle);
        }
    }
    onPoolReset(): void {
        this._particle = undefined;
        this._play = undefined;
        this._stop = undefined;
        this.comp = 0;
    }
    constructor(particle: ParticleSystem | ParticleSystem2D | sp.Skeleton | MotionStreak) {
        this.reInit(particle);
    }
    play() {
        this._play && this._play();
    }
    stop() {
        this._stop && this._stop();
    }

}
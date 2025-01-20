import { CCBoolean, CCInteger, Component, Node, NodePool, Pool, _decorator, log, sp } from "cc";
import { EDITOR } from "cc/env";
import { LogError } from "core/Debugger";
import { NodePools } from "core/NodePools";
import { SpSkeletonBase, spine } from "core/SpSkeletonBase";
import { TYPE_TIMER, Timer } from "modules/time/Timer";
import { UIEffectConf } from "./UIEffectConf";
import { ObjectPool } from "core/ObjectPool";
const { ccclass, property } = _decorator;

@ccclass("UISPineConf")
export class UISPineConf extends UIEffectConf {
    @property({ tooltip: "spine的Node配置", type: sp.Skeleton })
    skeleton: sp.Skeleton;
    @property({ tooltip: "开启onEnable逻辑" })
    on_enable: boolean = true;

    @property({ tooltip: "动画持续时间" })
    get aniTime(): number {
        let time = 0;
        if (this.skeleton && this.skeleton.skeletonData) {
            const animationName = (this.skeleton as any).defaultAnimation;
            if (animationName) {
                const animsEnum = this.skeleton.skeletonData.getRuntimeData(true).animations;
                if (animsEnum) {
                    animsEnum.forEach(element => {
                        if (element.name == animationName) {
                            time = element.duration;
                        }
                    });
                }
            }
        }
        return time
    }


    protected stopCallback: Function;

    private _htPlay: TYPE_TIMER;
    private _htEnd: TYPE_TIMER;
    protected onLoad(): void {
    }
    protected onEnable(): void {
        this.isOnPool = false;
        if (this.on_enable) {
            if (this.playOnAwake) {
                this.play();
            } else {
                this.skeleton.animation = "";
                if (!this.skeleton.isAnimationCached()) {
                    this.skeleton.clearTracks();
                }
            }
        }
    }

    play(node?: Node, name?: string) {
        if (this.delayPlayTime) {
            this._htPlay = Timer.Inst().AddRunTimer(this.doPlay.bind(this, node, name), this.delayPlayTime, 1, false);
        } else {
            this.doPlay(node, name);
        }
    }

    protected doPlay(node?: Node, name?: string) {
        if (!this.skeleton || !this.skeleton.skeletonData) {
            this.node && LogError("!!!!no skeleton ID:" + this.node.name);
            return
        }
        this.cancelTimer();
        if (!name) {
            const animationName = (this.skeleton as any).defaultAnimation;
            if (animationName) {
                name = animationName;
            } else {
                name = this.skeleton.skeletonData.getRuntimeData(true).animations[0].name
            }
        }
        this.skeleton.animation = name;
        if (this.playTime) {
            this._htEnd = Timer.Inst().AddRunTimer(this.stopByAuto.bind(this), this.playTime, 1, false);
        } else {
            this.skeleton.setCompleteListener(this.stopByAuto.bind(this));
        }
        super.checkPlay();
    }

    private cancelTimer() {
        if (this._htPlay) {
            Timer.Inst().CancelTimer(this._htPlay)
            this._htPlay = undefined;
        }
        if (this._htEnd) {
            Timer.Inst().CancelTimer(this._htEnd);
            this._htEnd = undefined;
        }
    }

    SetStopCallback(func: Function) {
        this.stopCallback = func;
    }

    private stopByAuto() {
        this.cancelTimer();
        if (this.destroyAuto) {
            if (this.skeleton) {
                if (this.skeleton.isAnimationCached()) {
                    this.skeleton._frameCache && this.skeleton._frameCache.end();
                } else {
                    this.skeleton.clearTracks();
                }
            }
            this.destroyBySelf();
        }
        if (this.stopCallback) {
            this.stopCallback();
        }
    }

    public stop() {
        this.cancelTimer();

        if (this.skeleton) {
            if (this.skeleton.isAnimationCached()) {
                this.skeleton._frameCache && this.skeleton._frameCache.end();
            } else {
                this.skeleton.clearTracks();
            }
        }

        if (this.destroyAuto) {
            this.destroyBySelf();
        }
        if (this.stopCallback) {
            this.stopCallback();
        }
    }

    protected onDisable(): void {
        this.cancelTimer();
    }
    protected onDestroy(): void {
        this.cancelTimer();
    }
}
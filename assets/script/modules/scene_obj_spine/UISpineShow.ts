import { Animation, CCObject, Node, UITransform, isValid, path } from "cc";
import { NodePools } from "core/NodePools";
import { IPoolObject, ObjectPool } from "core/ObjectPool";
import { SpSkeleton } from "core/SpSkeleton";
import { SpSkeletonBase } from "core/SpSkeletonBase";
import { GComponent } from "fairygui-cc";
import { UISPineConf } from "./Effect/UISPineConf";
import { SPINE_ANI_SLOT } from "./ObjSpineConfig";
import { UIEffectShow } from "./UIEffectShow";
import { UIEffectConf } from "./Effect/UIEffectConf";
export class UISpinePlayData implements IPoolObject {
    reInit(): void {
        this.onPoolReset();
    }
    onPoolReset(): void {
        let t = this;
        t.name = "ani1";
        t.loop = false;
        t.comp = undefined;
        t.start = NaN;
        t.check = false;
        t.end = NaN;
        t.timeScale = 1;
    }
    constructor() {
        this.reInit();
    }
    public check: boolean;
    public name: string;
    public loop: boolean;
    public comp: Function;
    public start: number;
    public end: number;
    public timeScale: number;
}
export class UISpineShow extends GComponent implements IPoolObject {
    static creat(path?: string, playAwake = true) {
        let obj = ObjectPool.Get(UISpineShow, path, playAwake);
        obj._isIPool = true;
        return obj;
    }
    reInit(path?: string, playAwake = true, onLoad?: (obj: Node | undefined) => void, setBySelf = false): void {
        this.LoadSpine(path, playAwake, onLoad, setBySelf);
        this._container.once(Node.EventType.NODE_DESTROYED, () => {
            this.StopAllEff();
        }, this);
    }
    onPoolReset(): void {
        let t = this;
        t.resetNode();
        t._path = undefined;
        t._onLoadNode = undefined;
        t._compFunc = undefined;
    }
    get isplay() {
        return this._isPlaying;
    }
    private resetNode(claenPlayData = true) {
        let t = this;
        // t._container.removeFromParent();
        if (isValid(t._container))
            t._container.removeAllChildren();
        if (t._node_spine) {
            if (isValid(t._node_spine)) {
                let conf = t._node_spine.getComponent(UIEffectConf)
                if (conf) {
                    conf.doOnPoolReSetPos();
                }
                if (!conf || !conf.isOnPool) {
                    NodePools.Inst().Put(t._node_spine);
                }
            }
            t._node_spine = undefined;
        }
        if (t._ske) {
            t._ske.setCompleteListener(undefined);
            t._ske = undefined
        }
        if (claenPlayData && t._playData) {
            ObjectPool.Push(t._playData);
            t._playData = undefined;
        }
        this._active = true;
    }

    private _active = true;
    public get active() {
        return this._active;
    }
    public set active(value: boolean) {
        this._active = value;
        if (this._node_spine) {
            this._node_spine.active = value;
        }
    }
    private _path: string;
    private _onLoadNode: Function;
    private _onLoadSke: Function;
    private _node_spine: Node;
    private _compFunc: Function;
    private _playData: UISpinePlayData = undefined;
    private _funSetBySelf = Function;
    private _playAwake: boolean;
    _isIPool = false;
    _isPlaying = false;
    public get node_spine(): Node {
        return this._node_spine;
    }
    private _ske: SpSkeletonBase;

    constructor(path?: string, playAwake = true, onLoad?: (obj: Node | undefined) => void, setBySelf = false) {
        super();
        this.reInit(path, playAwake, onLoad, setBySelf);
    }

    /**
     * 加载spine
     * @param path 预设路径 
     * @param playAwake 加载完后是否自动播放
     * @param onLoad 加载完成回调
     * @param setBySelf 是否自行添加到显示队列 默认挂载UISpineShow控件下
     */
    public LoadSpine(path: string, playAwake = true, onLoad?: Function, setBySelf = false) {
        let t = this;
        t._playAwake = playAwake;
        if (!onLoad) {
            setBySelf = false
        }
        if (path && path != undefined && t._path != path) {
            // if (!path.indexOf || path.indexOf("1208038") == -1) {
            //     if (path.indexOf("denglu") == -1)
            //         return
            // }
            if (t._node_spine && !setBySelf) {
                t.onPoolReset();
            }
            t._path = path;
            t._onLoadNode = onLoad;
            NodePools.Inst().Get(t._path, (obj: Node) => {
                if (t._path == path) {      //在加载的时候外部请求了其它加载
                    if (setBySelf) {
                        this._funSetBySelf = this.onLoaded.bind(this, obj)
                        t._onLoadNode && t._onLoadNode(undefined);
                    } else
                        t.onLoaded(obj);
                }
            });
        }
    }

    public setRect(obj: Node, Anch?: { x: number, y: number }) {
        let tran = obj.getComponent(UITransform);
        this.width = tran.width;
        this.height = tran.height;
        this.setPivot(Anch.x, Anch.y);
    }

    public setBySelf(claenPlayData = true) {
        let t = this;
        if (t._node_spine) {
            t.resetNode(claenPlayData);
        }
        t._funSetBySelf && t._funSetBySelf();
    }

    private onLoaded(obj: Node) {
        let t = this;
        if (obj) {
            obj.active = t.active;
            t._node_spine = obj;
            let conf = obj.getComponent(UISPineConf);
            if (conf) {
                t._ske = conf.skeleton as SpSkeletonBase;
                conf.onLoadByUI();
            } else {
                t._ske = t._node_spine.getComponent(SpSkeletonBase);
            }
            if (t._container.parent) {
                if (isValid(t._container)) {
                    t.node_spine.setParent(t._container)
                }
            }
            else {
                if (isValid(t.node)) {
                    t.node_spine.setParent(t.node)
                }
            }
            if (t._ske) {
                t._ske.setCompleteListener(t.onComp.bind(t));
                t._ske.setOnPreLoad && t._ske.setOnPreLoad(() => {
                    if (!this._playAwake) {
                        this._ske.paused = true;
                        this._ske.setToSetupPose()
                    }
                    if (t.active) {
                        if (t._playData) {
                            t.play(t._playData);
                        }
                    }
                })
            }
            t._onLoadNode && t._onLoadNode(obj);
        }
    }

    private onComp(track: { animation: Animation }) {
        let t = this;
        this._isPlaying = false;
        let name = track.animation.name;
        if (t._playData && name == t._playData.name) {
            t._playData.comp && t._playData.comp();
        }
        t._compFunc && t._compFunc();

    }

    public setCompFunc(compFunc: Function) {
        this._compFunc = compFunc;
    }
    public play(play_data: UISpinePlayData, stop = false) {
        let t = this;
        if (t._playData && play_data != t._playData) {
            ObjectPool.Push(t._playData);
            t._playData = undefined;
        }
        t._playData = play_data;
        if (t._ske) {
            let check = play_data.check;
            if (check) {
                let now_name = t._ske.animation;
                if (now_name == play_data.name) {
                    return;
                }
            }
            this._ske.paused = false;
            if (stop) {
                this._ske.clearTracks();
            }
            let entry = t._ske.addAnimation(0, play_data.name, play_data.loop);
            if (!entry) {
                return
            }
            t._ske.timeScale = play_data.timeScale;
            if (!isNaN(play_data.start)) {
                entry.animationStart = play_data.start;
            }
            if (!isNaN(play_data.end)) {
                entry.animationEnd = play_data.end <= entry.animationEnd ? play_data.end : entry.animationEnd;
            }
            this._isPlaying = true;
            // ObjectPool.Push(play_data);
        }
    }

    public addEffect(effect: UIEffectShow, pName: string) {
        let eff_node = pName ? this._node_spine.getChildByName(pName) : this._node_spine;
        if (eff_node) {
            eff_node.addChild(effect._container);
        }
    }

    public addObj(pName: string, obj: any) {
        let node = this._node_spine.getChildByName(pName)
        node = node ? (node.getChildByName("Node") ?? node) : node
        if (node) {
            obj.setParent(node);
        }
    }

    public changSkin(name_slot: SPINE_ANI_SLOT, tex_src: string) {
        let t = this;
        if (t._ske) {
            (<SpSkeleton>t._ske).changSkin(name_slot, tex_src)
        }
    }

    StopAllEff() {
        if (this._isIPool) {
            ObjectPool.Push(this);
        } else {
            this.onPoolReset();
        }
    }

    public onDestroy(): void {
        this.StopAllEff();
    }
}
import { _decorator, Prefab, NodePool, instantiate, CCString, macro, Node, game } from "cc";
import { DEBUG } from "cc/env";
import { ResManager } from "manager/ResManager";
import { Debugger, LogError } from "./Debugger";
import { SingletonCom } from "./SingletonCom";
import { PackageData } from "preload/PkgData";

const { ccclass, property } = _decorator;

type _CompleteFunc = (obj: Node | null) => void;

//time=s
type Strategy = {
    cacheReleaseTime: number,  //0表示不做间隔，达到条件直接销毁
    cacheMinCount: number,     //0表示一个都不留，小于0(-1)表示一个都不销毁
    poolReleaseTime: number,   //0表示引用数为0时立即销毁，小于0(-1)表示池子永远不销毁
};

let defaultStrategy: Strategy = {
    cacheReleaseTime: 1000,
    cacheMinCount: 15,
    poolReleaseTime: 40000
}

export interface IPreloadPool {
    PreloadPut: () => any;
    IsPreloaded: () => boolean;
    preloadCount: number;
}

class Pool implements IPreloadPool {
    private path;
    private original: Prefab;
    private ccPool: NodePool;
    private state: "none" | "loading" | "loaded" | "error" | "release" = "none";
    private waitLoadingFuncs: Set<_CompleteFunc> = null;
    private strategy: Strategy = defaultStrategy;

    private lastReleaseCacheTime: number = 0;  //最后一次释放单个cache的时间
    private refNullTime: number = 0;           //外部引用数置0的时间
    private refCount: number = 0;
    public preloadCount: number;

    constructor(path: string) {
        this.preloadCount = 0;
        // this.strategy
        this.ccPool = new NodePool();
        this.state = "loading";
        this.path = path;
        if (this.isMonster) {
            this.strategy = {
                cacheReleaseTime: 1000,
                cacheMinCount: 30,
                poolReleaseTime: 400000,
            }
        }
        ResManager.Inst().Load<Prefab>(path, (err, prefab) => {
            if (this.state == "loading") {
                if (err != null || prefab == null) {
                    this.state = "error";
                    LogError("Pool创建异常", err);
                }
                this.original = prefab;
                this.state = "loaded";
                // this.strategy = defaultStrategy;
                if (this.waitLoadingFuncs != null) {
                    this.waitLoadingFuncs.forEach((com) => {
                        this.Get(com, false);
                    });
                    this.waitLoadingFuncs.clear();
                    this.waitLoadingFuncs = null;
                }
            }
            else if (this.state == "release") {
                if (this.waitLoadingFuncs != null) {
                    this.waitLoadingFuncs.forEach((com) => {
                        com(null);
                    });
                    this.waitLoadingFuncs.clear();
                    this.waitLoadingFuncs = null;
                }
            }
        });
    }

    public IsLoaded(): boolean {
        return this.state == "loaded";
    }

    Get(onCom: _CompleteFunc, isRef: boolean = true) {
        if (this.state == "loaded") {
            if (isRef == true) {
                this.refCount++;
            }
            onCom(this.GetSync());
        }
        else if (this.state == "loading") {
            ++this.refCount;
            if (this.waitLoadingFuncs == null) {
                this.waitLoadingFuncs = new Set<_CompleteFunc>();
            }
            this.waitLoadingFuncs.add(onCom);
        }
        else if (this.state == "release") {
            onCom(null);
        }
    }

    GetSync(): Node {
        if (this.state == "loaded") {
            let reObj: Node;
            if (this.ccPool.size() > 0) {
                reObj = this.ccPool.get();
                if (!reObj.isValid && this.original) {
                    reObj = instantiate(this.original);
                    if (DEBUG) {
                        console.log("对象池实例化对象", this.path);
                    }
                }
            }
            else {
                if (this.original) {
                    reObj = instantiate(this.original);
                    if (DEBUG) {
                        console.log("对象池实例化对象", this.path);
                    }
                }
            }
            return reObj;
        }
        return null;
    }

    Put(obj: Node) {
        if (!obj || !obj.isValid) {
            return;
        }
        this.ccPool.put(obj);
        if (this.refCount > 0) {
            if (--this.refCount == 0) {
                this.lastReleaseCacheTime = game.totalTime;
            }
        }
    }

    private _isMonster: boolean;
    private get isMonster(): boolean {
        if (this._isMonster == null) {
            let strs = this.path.split("/");
            this._isMonster = false;
            strs.forEach(str => {
                if (str == "monster") {
                    this._isMonster = true;
                }
            })
        }
        return this._isMonster;
    }

    //return 是否需要释放池子
    Check(now: number): boolean {
        if (this.preloadCount > 0) {
            if (this.ccPool.size() > this.strategy.cacheMinCount) {
                let obj = this.ccPool.get();
                obj.destroy();
                this.lastReleaseCacheTime = now;
            }
            return false;
        }

        if (this.refCount == 0) {
            if ((now - this.lastReleaseCacheTime) >= this.strategy.poolReleaseTime) {
                return true;
            }
        }
        if (this.ccPool.size() > this.strategy.cacheMinCount) {
            let obj = this.ccPool.get();
            obj.destroy();
            this.lastReleaseCacheTime = now;
        }
        return false;
    }

    Release() {
        if (this.refCount != 0) {
            Debugger.LogError(`Call release but ref is not 0!refCount=${this.refCount}`, this);
        }
        this.original = null;
        this.ccPool.clear();
        this.ccPool = null;
        this.state = "release";
    }

    //提前put对象
    PreloadPut() {
        if (this.original == null) {
            return;
        }
        if (this.preloadCount < 1) {
            return;
        }
        if (this.ccPool.size() >= this.preloadCount) {
            return;
        }
        let obj = instantiate(this.original);
        //console.log("提前预加载", this.path);
        this.Put(obj);
    }

    IsPreloaded(): boolean {
        if (this.ccPool == null) {
            //cons("池子还未创建", this.path);
            return false;
        }
        return this.ccPool.size() >= this.preloadCount;
    }

    PrintInfo() {
        console.log(this.path, this.refCount, this.ccPool.size());
    }
}

@ccclass('NodePools')
export class NodePools extends SingletonCom {

    @property({ type: [CCString] })
    ResidentRes: string[] = [];

    private pools: Map<string, Pool> = new Map<string, Pool>();

    private objToPool: Map<Node, Pool> = new Map<Node, Pool>();

    private initCom: () => void = null;

    onLoad() {
        super.onLoad();
        this.schedule(() => {
            let now = game.totalTime;
            this.pools.forEach((pool, key, map) => {
                if (pool.Check(now)) {
                    pool.Release();
                    this.pools.delete(key);
                }
            });
        }, 10, macro.REPEAT_FOREVER);
    }

    public CreatePool(path: string): Pool {
        let pool: Pool = null;
        if (this.pools.has(path)) {
            pool = this.pools.get(path);
        }
        else {
            pool = new Pool(path);
            this.pools.set(path, pool);
        }
        return pool;
    }

    public IsLoaded(path: string): boolean {
        return this.pools.has(path);
    }

    public Get(path: string, onCom: _CompleteFunc) {
        if (!path) { return }
        if (PackageData.Inst().g_UserInfo.changRes[path]) {
            path = PackageData.Inst().g_UserInfo.changRes[path];
        }
        let pool: Pool = null;
        if (this.pools.has(path)) {
            pool = this.pools.get(path);
        }
        else {
            pool = new Pool(path);
            this.pools.set(path, pool);
        }

        pool.Get((obj) => {
            if (obj) {
                this.objToPool.set(obj, pool);
                onCom(obj);
            } else {
                LogError("！！！注意！！！无法找到资源：" + path, "位置：" + onCom.toString())
            }
        });
    }

    public GetSync(path: string, par?: Node): Node {
        if (this.pools.has(path)) {
            let pool = this.pools.get(path);
            let obj = pool.GetSync();
            if (par) {
                obj.setParent(par);
            }
            // else{}
            // let scene = director.getScene();
            // (<BaseNode>obj).setParent(scene);
            this.objToPool.set(obj, pool);
            return obj;
        }
        return null;
    }

    /**
     * 预设使用完后Put到ccPools
     * @param obj 预设
     * @param destory 如果预设不是通过ccPools获取的，是否自动销毁
     * @returns boolean 是否成功回收到ccPools
     */
    public Put(obj: Node, destory: boolean = true): boolean {
        if (!obj || !obj.isValid) {
            return false
        }
        if (this.objToPool.has(obj)) {
            this.objToPool.get(obj).Put(obj);
            this.objToPool.delete(obj);
            return true;
        } else if (destory) {
            Debugger.LogError(`存入未知nodeCant find put pool|obj=${obj}`, obj);
            obj.destroy();
        }
        return false;
    }

    public Init(onCom?: () => void) {
        this.initCom = onCom;
        this.ResidentRes.forEach((path, idx, arr) => {
            this.registerResidentRes(path);
        })

    }


    update() {
        if (this.initCom != null) {
            let allCom = true;
            for (let path of this.ResidentRes) {
                let pool = this.pools.get(path);
                if (pool.IsLoaded() == false) {
                    allCom = false;
                    break;
                }
            }
            if (allCom) {
                this.initCom();
                this.initCom = null;
            }
        }
    }


    private registerResidentRes(path: string) {
        let pool = new Pool(path);
        this.pools.set(path, pool);
    }

    PrintPoolInfo() {
        this.pools.forEach((pool) => {
            pool.PrintInfo();
        })
    }

    // public Release(path:string){
    //     if(this.pools.has(path)){
    //         let pool = this.pools.get(path);
    //         pool.Release();
    //         this.pools.delete(path);
    //     }
    //     else{
    //         LogError(`Cant find release pool|path=${path}`,this);
    //     }
    // }
} 
import { game, instantiate, Node } from "cc";
import { UtilHelper } from "../helpers/UtilHelper";
import { INodeGetPool } from "./NodeCreateFunc";
import { IPreloadPool } from "./NodePools";
var FrameRate = 0.1;
export class SmallObjPool<T> implements IPreloadPool,INodeGetPool
{

    // private static poolList:SmallObjPool<any>[] = [];
    // private static updateTime = 0;
    // private static preloadIndex:number = 0;

    // static Update(dt:number){
    //     this.updateTime += dt;
    //     if(this.updateTime >= FrameRate){
    //         this.CheckUpdate();
    //         this.updateTime = 0;
    //     }
    // }

    // private static CheckUpdate(){
    //     if(this.poolList.length == 0){
    //         return
    //     }
    //     if(this.preloadIndex >= this.poolList.length){
    //         return;
    //     }
    //     let pool:SmallObjPool<any> = this.poolList[this.preloadIndex];
    //     if(pool.preloadCount > 0 && pool.isCanPreload){
    //         pool.PreloadPut();
    //     }
    //     this.preloadIndex++;
    //     if(this.preloadIndex >= this.poolList.length){
    //         this.preloadIndex = 0;
    //     }
    // }

    private sourceObj:T;

    private maxCount:number;

    private objStack:Set<T> = new Set<T>();
    private refList:Set<T> = new Set<T>();

    private createFunc:(obj?:T)=>T;
    private destroyFunc:(obj:T)=>void;

    private _parent:Node;
    get parent():Node{
        return this._parent;
    };
    set parent(node:Node){
        this._parent = node;
    }

    path:string;
    preloadCount:number;
    isNode:boolean = true;


    constructor(obj:T, maxCount:number = 30, parent?:Node){
        this.sourceObj = obj;
        this.maxCount = maxCount;
        this.createFunc = this.DefaultCreate.bind(this);
        this.destroyFunc = this.DefaultDestroy.bind(this);
        if(obj instanceof Node){
            let _obj = <Node>obj;
            _obj.active = false;
        }
        this.preloadCount = 0;
        this.parent = parent;
        //SmallObjPool.poolList.push(this);
    }

    SetSourceObj(obj:T){
        this.sourceObj = obj;
    }
    GetSourceObj(){
        return this.sourceObj;
    }

    GetStack():Set<T>{
        return this.objStack;
    }

    //默认的生成方法
    private DefaultCreate(obj:T){
        let _obj:Node = instantiate(obj) as Node;
        if(this._parent){
            _obj.setParent(this._parent);
        }
        return _obj;
    }
    //默认的销毁方法
    private DefaultDestroy(obj:T){
        let _obj = <Node>obj
        _obj.destroy();
    }

    SetCreateFunc(func:(obj?:T)=>T){
        this.createFunc = func;
    }
    SetDestroyFunc(func:(obj:T)=>void){
        this.destroyFunc = func;
    }


    // 获取
    Get():T{
        let obj:T;
        if(this.objStack.size == 0){
            obj = this.createFunc(this.sourceObj);
        }else{
            obj = this.objStack.values().next().value as T;
            this.objStack.delete(obj);
        }
        if(this.isNode){
            let _obj = <Node>obj;
            _obj.active = true;
        }
        this.refList.add(obj);
        return obj;
    }
    // 回收
    Put(obj:T, isRef:boolean = true){
        if(isRef && this.refList.has(obj)){
            this.refList.delete(obj);
        }
        if(this.objStack.size >= this.maxCount){
            this.destroyFunc(obj);
            return;
        }
        this.objStack.add(obj);
        if(this.isNode){
            let _obj = <Node>obj;
            _obj.active = false;
        }
       
    }

    // 全部释放
    Clear(){
        if(this.objStack){
            for(var obj of this.objStack){
                this.destroyFunc(obj);
                this.objStack = null;
            }
        }
        this.sourceObj = null;
    }

    ClearRefList(){
        this.refList.forEach(obj=>{
            this.Put(obj, false);
        })
        this.refList.clear();
    }

    //提前put对象
    PreloadPut(){
        if(this.sourceObj === null){
            return;
        }
        if(this.preloadCount < 1){
            return;
        }
        if(this.objStack.size >= this.preloadCount){
            return;
        }
        let obj = this.createFunc(this.sourceObj);
        this.Put(obj);
    }

    IsPreloaded():boolean{
        return this.objStack.size >= this.preloadCount;
    }

    GetHasNode():T{
        if(this.objStack.size > 0){
            return this.Get();
        }
    }

    IsHas(): boolean {
        return this.objStack.size > 0;
    }

}
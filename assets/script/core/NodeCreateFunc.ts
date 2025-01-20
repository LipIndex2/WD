import { _decorator, Component, game, instantiate, math, Node, Prefab } from 'cc';
import { Looper } from 'manager/Looper';
import { Singleton } from './Singleton';
const { ccclass, property } = _decorator;

export interface INodeGetPool{
    GetHasNode():any;
    IsHas():boolean;
}

export class NodeGetTask{
    node:Node|Prefab;
    timeMark:number;
    call:(obj:Node)=>any;
    pool:INodeGetPool;
    constructor(node:Node|Prefab, time:number, call:(obj:Node)=>any, pool?:INodeGetPool){
        this.node = node;
        this.timeMark = time;
        this.call = call;
        this.pool = pool;
    }
}

export class NodeCreateFunc extends Singleton {

    private queue:NodeGetTask[] = [];
    private handleTime = 3;

    constructor(){
        super();
        Looper.Inst().BeginLoop(this.update.bind(this));
    }

    update(): void {
        if(this.queue.length == 0) return;
        let time = game.totalTime;
        let isLoop = true;
        while(this.queue.length > 0 && isLoop){
            let task = this.queue.shift();
            if(task){
                this.handleTask(task);
                if(game.totalTime - time >= this.handleTime){
                    isLoop = false;
                }
            }
        }

        if(this.queue.length > 0){
            this.checkAllTask();
        }
    }

    private checkAllTask(){
        this.queue.forEach(this.foreachTask.bind(this));
    }
    private foreachTask(task:NodeGetTask, index:number, arr:NodeGetTask[]){
        if(task == null){
            return;
        }
        if((task.timeMark > 0 && game.totalTime >= task.timeMark)
        || (task.pool != null && task.pool.IsHas())){
            this.handleTask(task);
            arr[index] = null;
        }
    }
    private handleTask(task:NodeGetTask){
        if(task.pool){
            let obj = task.pool.GetHasNode();
            if(obj){
                task.call(obj);
                return;
            }
        }
        let obj = <Node>instantiate(task.node);
        task.call(obj);
    }

    CloneObj(node:Node|Prefab, time:number, call:(obj:Node)=>any, pool:INodeGetPool){
        if(time >= 0){
            time = game.totalTime + time;
        }
        let task = new NodeGetTask(node, time, call, pool);
        this.queue.push(task);
    }
}


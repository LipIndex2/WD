// 队列播放器
export interface IQueuePlayFuncItem{
    out_time:number;
}

export class QueuePlayFunc{
    private t:number;
    private queue:IQueuePlayFuncItem[];
    private index:number;
    private onPlay:(data:IQueuePlayFuncItem)=>void;
    private onFinish:(queue:QueuePlayFunc)=>void;
    private isLoop:boolean = false;

    constructor(datas?:IQueuePlayFuncItem[]){
        this.Reset(datas);
    }

    private Play(curData:IQueuePlayFuncItem){
        if(this.onPlay){
            this.onPlay(curData);
        }
    }

    Update(dt:number){
        if(this.IsFinish()){
            if(this.onFinish){
                this.onFinish(this);
                this.onFinish = null;
            }
            return;
        }
        let curData = this.queue[this.index];
        this.t += dt;
        if(this.t >= curData.out_time){
            this.Play(curData);
            this.t = 0;
            this.index++;

            if(this.isLoop && this.index >= this.queue.length){
                this.index = 0;
            }
            this.Update(0);
        }
    }

    PushData(data:IQueuePlayFuncItem){
        this.queue.push(data);
    }

    IsFinish():boolean{
        return this.index >= this.queue.length;
    }

    Reset(datas?:IQueuePlayFuncItem[]){
        this.queue = datas ?? [];
        this.index = 0;
        this.t = 9999;
    }

    OnPlay(func:(data:IQueuePlayFuncItem)=>void){
        this.onPlay = func;
    }

    OnFinish(finish:(queue:QueuePlayFunc)=>void){
        this.onFinish = finish;
    }

    Clear(){
        this.index = 0;
        this.queue.length = 0;
    }

    SetLoop(v:boolean){
        this.isLoop = v;
    }
}
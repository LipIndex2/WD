import { _decorator, Component, EventTouch, Input, Vec2, game } from 'cc';
import { ChannelAgent } from '../../../proload/ChannelAgent';
//玩家输入决策
export class PlayerInputDecision extends Component {
    private _isOpen:boolean = false;

    // 长按相关
    private touchFlag:boolean = false;
    private startTouchPos:Vec2;
    longPressCondition:number = 1.3;      //长按条件
    private pressTime:number = 0;       //当前按了多长时间
    private isStartPress:boolean = true;
    private isMoved:boolean = false;


    get isOpen():boolean{
        return this._isOpen;
    }

    protected onLoad(): void {
        this.Open();
    }

    update(dt:number){
        if(!this._isOpen){
            return;
        }
        if(this.touchFlag){
            if(this.isStartPress && this.pressTime > 0.2){
                this.TouchLongPressStart();
                this.isStartPress = false;
            }
            this.pressTime += dt;
            if(!this.isStartPress && this.pressTime >= this.longPressCondition){
                this.pressTime = 0;
                this.TouchLongPress();
                this.TouchLongPressEnd();
            }
        }

        if(this.moveTimeMark && !this.isStartPress){
            let time = game.totalTime - this.moveTimeMark;
            if(time >= 200){
                this.TouchUp(null);
            }
        }
    }

    Open(){
        if(this._isOpen){
            return;
        }
        this._isOpen = true;
        this.node.on(Input.EventType.TOUCH_START, this.TouchDown, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.node.on(Input.EventType.TOUCH_CANCEL, this.TouchUp, this);
        this.node.on(Input.EventType.TOUCH_END, this.TouchEnd, this);
    }

    Close(){
        if(!this._isOpen){
            return;
        }
        this._isOpen = false;
        this.node.off(Input.EventType.TOUCH_START, this.TouchDown, this);
        this.node.off(Input.EventType.TOUCH_MOVE, this.TouchMove, this);
        this.node.off(Input.EventType.TOUCH_CANCEL, this.TouchUp, this);
        this.node.off(Input.EventType.TOUCH_END, this.TouchEnd, this);
    }

    protected onDestroy(): void {
        this.Close();
    }

    private TouchDown(event:EventTouch){
        this.touchFlag = true;
        this.isStartPress = true;
        this.startTouchPos = event.getUILocation();
        this.pressTime = 0;
        this.isMoved = false;
        //console.log("TouchDown");
        if(this.onTouchDownFunc == null){
            return
        }
        this.onTouchDownFunc(event);
    }

    private moveTimeMark:number;
    private TouchMove(event:EventTouch){
        if(ChannelAgent.Inst().system == "Windows"){
            this.moveTimeMark = game.totalTime;
        }
        if(this.touchFlag){
            if(!this.CheckPress(event)){
                this.TouchLongPressEnd();
            }
        }
        if(this.onTouchMoveFunc == null){
            return
        }
        this.onTouchMoveFunc(event);
    }

    private TouchUp(event:EventTouch){
        this.moveTimeMark = null;
        this.TouchLongPressEnd();
        if(this.onTouchUpFunc == null){
            return
        }
        this.onTouchUpFunc(event);
    }

    private TouchEnd(event:EventTouch){
        this.TouchUp(event);

        if(this.onClickFunc){
            let pos = event.getUILocation();
            let distance = Vec2.distance(pos, this.startTouchPos);
            if(distance <= 10 && !this.isMoved){
                this.onClickFunc(event);
            }
        }
    }

    private TouchLongPress(){
        if(this.onTouchLongPressFunc == null){
            return
        }
        this.onTouchLongPressFunc();
    }

    private TouchLongPressStart(){
        if(this.onTouchLongPressFuncStart == null){
            return
        }
        this.onTouchLongPressFuncStart();
    }

    private TouchLongPressEnd(){
        this.touchFlag = false;
        this.pressTime = 0;
        this.isStartPress = false;
        if(this.onTouchLongPressFuncEnd == null){
            return
        }
        this.onTouchLongPressFuncEnd();
    }


    private onTouchDownFunc:(event:EventTouch)=>void;
    OnTouchDown(func:(event:EventTouch)=>void){
        this.onTouchDownFunc = func;
    }

    private onTouchMoveFunc:(event:EventTouch)=>void;
    OnTouchMove(func:(event:EventTouch)=>void){
        this.onTouchMoveFunc = func;
    }

    private onTouchUpFunc:(event:EventTouch)=>void;
    OnTouchUp(func:(event:EventTouch)=>void){
        this.onTouchUpFunc = func;
    }

    //长按完成事件
    private onTouchLongPressFunc:Function;
    OnTouchLongPress(func:Function){
        this.onTouchLongPressFunc = func;
    }

    private onTouchLongPressFuncStart:Function;
    //开始长按
    OnTouchLongPressStart(func:Function){
        this.onTouchLongPressFuncStart = func;
    }
    //结束长按
    private onTouchLongPressFuncEnd:Function;
    OnTouchLongPressEnd(func:Function){
        this.onTouchLongPressFuncEnd = func;
    }

    //长按检测
    private CheckPress(event:EventTouch):boolean{
        if(!this.touchFlag || this.startTouchPos == null){
            return false;
        }
        let pos = event.getUILocation();
        let distance = Vec2.distance(pos, this.startTouchPos);
        if(distance > 10){
            this.isMoved = true;
            return false;
        }
        return true;
    }

    //点击事件
    private onClickFunc:Function;
    OnClick(func:Function){
        this.onClickFunc = func;
    }
}


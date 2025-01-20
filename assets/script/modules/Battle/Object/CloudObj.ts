import { _decorator, Component, Node, Animation, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloudObj')
export class CloudObj extends Component {
    @property(Animation)
    anima:Animation;
    @property(Sprite)
    sprite:Sprite;
    @property([SpriteFrame])
    icons:SpriteFrame[] = [];

    private movedFunc:(mono:CloudObj)=>void;

    SetTimeScale(num:number){
        this.anima.defaultClip.speed = num;
    }

    Play(index:number){
        let clip = this.anima.clips[index];
        this.anima.defaultClip = clip;
        this.anima.play();
    }

    SetIcon(index:number){
        this.sprite.spriteFrame = this.icons[index]
    }

    OnMoveFinish(){
        if(this.movedFunc){
            this.movedFunc(this);
        }
    }

    SetMovedFunc(movedFunc:(mono:CloudObj)=>void){
        this.movedFunc = movedFunc;
    }

}



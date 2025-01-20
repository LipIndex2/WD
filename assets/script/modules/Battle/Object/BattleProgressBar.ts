import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BattleProgressBar')
export class BattleProgressBar extends Component {

    @property(Sprite)
    img:Sprite;


    SetValue(value:number){
        this.img.fillRange = value;
    }

    SetActive(value:boolean){
        if(this.node.active != value){
            this.node.active = value;
        }
    }

}


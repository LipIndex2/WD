import { _decorator, Component, Node, Skeleton, sp } from 'cc';
import { BattleCtrl } from '../BattleCtrl';
import { EventCtrl } from 'modules/common/EventCtrl';
import { BattleEventType } from '../BattleConfig';
import { BattleData } from '../BattleData';
const { ccclass, property } = _decorator;

@ccclass('SceneSpeedChange')
export class SceneSpeedChange extends Component {
    @property(sp.Skeleton)
    skeleton:sp.Skeleton;

    onEnable() {
        this.FlushSpeed();
        EventCtrl.Inst().on(BattleEventType.Speed, this.FlushSpeed, this);
    }

    setSkeletonScale(scale:number){
        if(this.skeleton){
            this.skeleton.timeScale = scale;
        }
    }

    FlushSpeed(){
        let scene = BattleCtrl.Inst().adapterBattleScene;
        if(scene){
            this.setSkeletonScale(BattleData.Inst().battleInfo.globalTimeScale);
        }else{
            this.setSkeletonScale(1);
        }
    }

    protected onDestroy(): void {
        EventCtrl.Inst().off(BattleEventType.Speed, this.FlushSpeed, this);
    }
}



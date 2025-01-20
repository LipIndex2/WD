import { _decorator, Component, Node, CCInteger } from 'cc';
import { BattleCtrl } from '../BattleCtrl';
import * as fgui from "fairygui-cc";
import { SkillFunc } from './SkillFunc';
import { BattleTweenerType } from '../BattleDynamic';
import { IS_BATTLE_TWEENER_AUTO } from '../BattleConfig';
const { ccclass, property } = _decorator;

@ccclass('SkillRotate')
export class SkillRotate extends SkillFunc {

    //旋转度数
    @property(CCInteger)
    rotationValue:number = 360;

    //初始角度
    @property(CCInteger)
    startAngle:number = 0;

    private roundNum:number = 1;

    Reset(){
        super.Reset();
        this.startAngle = 0;
        this.rotationValue = 360;
    }

    Play(){
        if(this.playTime == 0){
            return;
        }
        this.roundNum = 1;
        this.playPos = this.playNode.worldPosition;
        this.tweener = fgui.GTween.to(this.startAngle,this.rotationValue + this.startAngle, this.playTime * (this.rotationValue / 360), IS_BATTLE_TWEENER_AUTO);
        this.tweener.setEase(fgui.EaseType.Linear);
        this.tweener.onUpdate((tweener: fgui.GTweener)=>{
            let angle = tweener.value.x;
            this.playNode.setRotationFromEuler(0,0,angle);
            if(angle > this.roundNum * 360 + this.startAngle){
                this.ClearExclude();
                this.roundNum++;
            }
        })
        this.tweener.onComplete(()=>{
            this.StopSkill(this);
        })
        this.scene.dynamic.AddTweenr(BattleTweenerType.Skill, this.tweener);
    }
}


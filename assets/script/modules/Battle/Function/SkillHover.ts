import { _decorator, Component, Node, CCInteger } from 'cc';
import { BattleCtrl } from '../BattleCtrl';
import * as fgui from "fairygui-cc";
import { SkillFunc } from './SkillFunc';
import { BattleTweenerType } from '../BattleDynamic';
import { UtilHelper } from '../../../helpers/UtilHelper';
import { IS_BATTLE_TWEENER_AUTO } from '../BattleConfig';
const { ccclass, property } = _decorator;



// 盘旋在角色周围  示例：毁灭菇，德古拉
@ccclass('SkillHover')
export class SkillHover extends SkillFunc {

    //飞出多高
    height:number;
    //飞几圈
    roundCount:number;
    //驶出的角度
    startAngle:number;

    private roundNum:number = 1;
    Reset(){
        super.Reset();
        this.height = 80;
        this.roundCount = 1;
        this.startAngle = 0;
    }
    
    Play(){
        this.playPos = this.playNode.worldPosition;
        this.tweenerList = []
        let tweener = fgui.GTween.to2(0, 90, -this.height, 0, this.playTime / 10, IS_BATTLE_TWEENER_AUTO);
        tweener.setEase(fgui.EaseType.Linear)
        tweener.onUpdate((tweener: fgui.GTweener)=>{
            this.playNode.setPosition(0, tweener.value.x);
            this.playNode.setRotationFromEuler(0,0,tweener.value.y);
        })
        this.tweenerList.push(tweener);

        //盘旋
        let playTime = this.playTime * this.roundCount;
        let angleNum = 360 * this.roundCount + this.startAngle;
        let tweener2 = fgui.GTween.to(angleNum, this.startAngle, playTime, IS_BATTLE_TWEENER_AUTO);
        tweener2.setEase(fgui.EaseType.Linear)
        tweener2.onUpdate((tweener2: fgui.GTweener)=>{
            this.node.setRotationFromEuler(0,0,tweener2.value.x);
            if(Math.floor(tweener2.value.x) > this.roundNum * 360){
                this.ClearExclude();
                this.roundNum++;
            }
        })
        tweener2.onComplete(()=>{
            this.StopSkill(this);
        })
        this.tweenerList.push(tweener2);

        // //飞回
        tweener = fgui.GTween.to2(-this.height, 0, 0, 90, this.playTime / 10, IS_BATTLE_TWEENER_AUTO);
        tweener.setDelay(playTime - this.playTime / 10);
        tweener.setEase(fgui.EaseType.Linear)
        tweener.onUpdate((tweener: fgui.GTweener)=>{
            this.playNode.setPosition(0, tweener.value.x);
        })
        this.tweenerList.push(tweener);

        this.tweenerList.forEach(tw=>{
            this.scene.dynamic.AddTweenr(BattleTweenerType.Skill, tw);
        })
    }
}


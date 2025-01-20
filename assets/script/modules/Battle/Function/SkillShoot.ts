import { _decorator, CCInteger, Component, Node, Vec3 } from 'cc';
import { SkillFunc } from './SkillFunc';
import * as fgui from "fairygui-cc";
import { BattleCtrl } from '../BattleCtrl';
import { MonsterObj } from '../Object/MonsterObj';
import { BattleTweenerType } from '../BattleDynamic';
import { IS_BATTLE_TWEENER_AUTO } from '../BattleConfig';
const { ccclass, property } = _decorator;

@ccclass('SkillShoot')
export class SkillShoot extends SkillFunc {
    @property(CCInteger)
    shootLength:number = 1500;     //射程

    shootDir:Vec3 = Vec3.UP;      //发射方向

    startPos:Vec3;

    private defaultShootLength:number;
    onLoad(){
        super.onLoad();
        this.defaultShootLength = this.shootLength;
    }

    Play(){
        if(this.playTime == 0){
            return;
        }
        this.playPos = this.playNode.worldPosition;
        let startPos = this.startPos ?? new Vec3();
        let targetPos = new Vec3();
        Vec3.scaleAndAdd(targetPos, startPos, this.shootDir, this.shootLength * this.scale);
        this.tweener = fgui.GTween.to2(startPos.x, startPos.y, targetPos.x, targetPos.y, this.playTime * this.scale, IS_BATTLE_TWEENER_AUTO);
        this.tweener.setEase(fgui.EaseType.Linear)
        this.tweener.onUpdate((tweener: fgui.GTweener)=>{
            this.playNode.setPosition(tweener.value.x, tweener.value.y,0);
        })
        this.tweener.onComplete(()=>{
            this.StopSkill(this);
        })
        this.scene.dynamic.AddTweenr(BattleTweenerType.Skill, this.tweener);
    }

    Reset(){
        super.Reset();
        this.shootLength = this.defaultShootLength;
        this.startPos = null;
    }
}


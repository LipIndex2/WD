import { _decorator, Component, Node, Vec3 } from 'cc';
import { FIGHT_CELL_WIDTH, IS_BATTLE_TWEENER_AUTO } from '../BattleConfig';
import { SkillFunc } from './SkillFunc';
import * as fgui from "fairygui-cc";
import { BattleCtrl } from '../BattleCtrl';
import { BattleTweenerType } from '../BattleDynamic';
const { ccclass, property } = _decorator;


// 技能绕一个点移动
@ccclass('SkillRoundMove')
export class SkillRoundMove extends SkillFunc {

    //半径
    radius:number;
    //转几圈
    playRoundNum:number;

    //开始角度 释放多个飓风的时候用到
    initAngel:number;

    private initRadian:number = 0;      //开始弧度
    private roundNum:number = 1;
    Reset(){
        super.Reset();
        this.radius = FIGHT_CELL_WIDTH;
        this.playRoundNum = 1;
        this.initAngel = 0;
    }

    Play(){
        this.initRadian = this.initAngel * Math.PI / 180;

        this.roundNum = 1;
        //弧度
        let radian = this.playRoundNum * Math.PI * 2 + this.initRadian;
        let time = this.playTime * this.playRoundNum;
        
        this.playPos = this.playNode.worldPosition;
        this.tweener = fgui.GTween.to(this.initRadian,radian, time, IS_BATTLE_TWEENER_AUTO);
        this.tweener.setEase(fgui.EaseType.Linear);
        this.tweener.onUpdate((tweener: fgui.GTweener)=>{
            let angle = tweener.value.x;    //这是弧度
            this.playNode.setRotationFromEuler(0,0,angle);
            if(angle >= this.roundNum * Math.PI + this.initRadian){
                this.ClearExclude();
                this.roundNum++;
            }
            let x = this.radius * Math.cos(angle) + this.node.worldPosition.x;
            let y = this.radius * Math.sin(angle) + this.node.worldPosition.y;
            this.playNode.setWorldPosition(x,y,0);
        })
        this.tweener.onComplete(()=>{
            this.StopSkill(this);
        })
        this.scene.dynamic.AddTweenr(BattleTweenerType.Skill, this.tweener);
    }
}


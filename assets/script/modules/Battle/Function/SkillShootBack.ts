import { _decorator, CCInteger, Vec3 } from 'cc';
import * as fgui from "fairygui-cc";
import { IS_BATTLE_TWEENER_AUTO } from '../BattleConfig';
import { BattleCtrl } from '../BattleCtrl';
import { BattleTweenerType } from '../BattleDynamic';
import { SkillFunc } from './SkillFunc';
const { ccclass, property } = _decorator;

@ccclass('SkillShootBack')
export class SkillShootBack extends SkillFunc {
    @property(CCInteger)
    shootLength: number = 1500;     //射程

    shootDir: Vec3 = Vec3.UP;       //发射方向

    isBack: boolean = false;        //是否回旋
    touNum: number = 0;             //穿透数量

    Play() {
        if (this.playTime == 0) {
            return;
        }
        this.tweenerList = []
        this.playPos = this.playNode.worldPosition;
        let startPos = new Vec3();
        let targetPos = new Vec3();
        Vec3.scaleAndAdd(targetPos, startPos, this.shootDir, this.shootLength);
        let tweener1 = fgui.GTween.to2(startPos.x, startPos.y, targetPos.x, targetPos.y, this.playTime, IS_BATTLE_TWEENER_AUTO)
            .setEase(fgui.EaseType.Linear)
            .onUpdate((tweener: fgui.GTweener) => {
                if (this.playNode) {
                    this.playNode.setPosition(tweener.value.x, tweener.value.y, 0);
                }
            })
            .onComplete(() => {
                if (this.isBack) {
                    this.ClearExclude();
                    let tweener2 = fgui.GTween.to2(targetPos.x, targetPos.y, startPos.x, startPos.y + 50, this.playTime, IS_BATTLE_TWEENER_AUTO)
                        .setEase(fgui.EaseType.Linear)
                        .onUpdate((tweener: fgui.GTweener) => {
                            if (this.playNode) {
                                this.playNode.setPosition(tweener.value.x, tweener.value.y, 0);
                            }
                        })
                        .onComplete(() => {
                            this.StopSkill(this);
                        })
                    this.tweenerList.push(tweener2);
                    this.scene.dynamic.AddTweenr(BattleTweenerType.Skill, tweener2);
                } else {
                    this.StopSkill(this);
                }
            })

        this.tweenerList.push(tweener1);
        this.scene.dynamic.AddTweenr(BattleTweenerType.Skill, tweener1);
    }
}


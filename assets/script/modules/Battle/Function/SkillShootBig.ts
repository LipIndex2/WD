import { _decorator, CCInteger, Vec3 } from 'cc';
import * as fgui from "fairygui-cc";
import { IS_BATTLE_TWEENER_AUTO } from '../BattleConfig';
import { BattleCtrl } from '../BattleCtrl';
import { BattleTweenerType } from '../BattleDynamic';
import { SkillFunc } from './SkillFunc';
const { ccclass, property } = _decorator;

@ccclass('SkillShootBig')
export class SkillShootBig extends SkillFunc {
    @property(CCInteger)
    shootLength: number = 1500;     //射程

    shootDir: Vec3 = Vec3.UP;      //发射方向

    isBig: boolean = false;         //是否变大
    bigScale: number = 1;           //是否变大
    bigVal: number = 1500;          //变大时间

    private defaultShootLength: number;
    onLoad() {
        super.onLoad();
        this.defaultShootLength = this.shootLength;
        this.bigScale = 1
    }

    Play() {
        if (this.playTime == 0) {
            return;
        }
        this.playPos = this.playNode.worldPosition;
        let startPos = new Vec3();
        let targetPos = new Vec3();
        Vec3.scaleAndAdd(targetPos, startPos, this.shootDir, this.shootLength * this.scale);
        this.tweener = fgui.GTween.to2(startPos.x, startPos.y, targetPos.x, targetPos.y, this.playTime * this.scale, IS_BATTLE_TWEENER_AUTO);
        this.tweener.setEase(fgui.EaseType.Linear)
        this.tweener.onUpdate((tweener: fgui.GTweener) => {
            this.playNode.setPosition(tweener.value.x, tweener.value.y, 0);
            if (this.isBig) {
                this.bigScale = 1 + tweener.value.y / this.bigVal
                this.playNode.setScale(this.bigScale, this.bigScale)
            }
        })
        this.tweener.onComplete(() => {
            this.StopSkill(this);
        })
        this.scene.dynamic.AddTweenr(BattleTweenerType.Skill, this.tweener);
    }

    Reset() {
        super.Reset();
        this.shootLength = this.defaultShootLength;
    }
}


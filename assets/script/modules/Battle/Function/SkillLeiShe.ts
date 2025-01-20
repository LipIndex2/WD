import { _decorator, CCInteger, Component, Node, toDegree, UITransform, v2, Vec3 } from 'cc';
import { SkillFunc } from './SkillFunc';
import * as fgui from "fairygui-cc";
import { IS_BATTLE_TWEENER_AUTO } from '../BattleConfig';
import { BattleCtrl } from '../BattleCtrl';
import { MathHelper } from '../../../helpers/MathHelper';
import { LogError } from 'core/Debugger';
const { ccclass, property } = _decorator;

@ccclass('SkillLeiShe')
export class SkillLeiShe extends SkillFunc {
    startPoint: Vec3;
    endPoint: Vec3;
    private height: number;

    onLoad() {
        super.onLoad();
        let trans = this.node.getComponent(UITransform);
        this.height = trans.height
    }

    Play() {
        this.startPoint = this.node.worldPosition;
        let dis = new Vec3(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y, 0);
        let dist = Vec3.len(dis);
        let line_lenght = dist / this.height;
        this.playNode.setScale(1, line_lenght);
        this.tweener = fgui.GTween.to(0, 1, this.playTime * this.scale, IS_BATTLE_TWEENER_AUTO);
        this.tweener.setEase(fgui.EaseType.Linear);
        this.hitEvent && this.hitEvent(undefined);
        this.tweener.onComplete(() => {
            this.playNode.setScale(1, 0);
            this.StopSkill(this);
        })
        let angle = 360 - MathHelper.GetVecAngle(this.endPoint, this.startPoint);
        this.SetPlayNodeEulerAngle(angle);
    }

    Reset() {
        super.Reset();
        this.playNode.setScale(1, 0);
    }
}


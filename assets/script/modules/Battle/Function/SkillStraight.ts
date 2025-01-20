import { _decorator, Component, Node, CCInteger, Vec2 } from 'cc';
import { BattleCtrl } from '../BattleCtrl';
import { BattleData } from '../BattleData';
import { SkillFunc } from './SkillFunc';
const { ccclass, property } = _decorator;

@ccclass('SkillStraight')
export class SkillStraight extends SkillFunc {
    @property(CCInteger)
    speed : number = 500;     //移动速度

    moveTime: number = 0;

    Reset(){
        super.Reset();
        this.moveTime = 0;
    }

    update(deltaTime: number) {
        if(BattleData.Inst().battleInfo.isPause){
            return;
        }
        deltaTime *= BattleData.Inst().battleInfo.globalTimeScale;
        let moveLen = this.speed * deltaTime * this.scale;
        let moveVec = new Vec2(this.node.up.x * moveLen,this.node.up.y * moveLen);
        this.node.setWorldPosition(this.node.worldPosition.x + moveVec.x,
            this.node.worldPosition.y + moveVec.y,0);
        this.moveTime += deltaTime;
        if(this.moveTime >= this.playTime){
            this.StopSkill(this);
        }
    }
}


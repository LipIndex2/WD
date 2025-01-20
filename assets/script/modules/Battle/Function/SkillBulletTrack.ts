import { _decorator, Component, Node, CCInteger, Vec2, Vec3, IVec2Like } from 'cc';
import { MathHelper } from '../../../helpers/MathHelper';
import { BattleCtrl } from '../BattleCtrl';
import { BattleData } from '../BattleData';
import { SkillFunc } from './SkillFunc';
const { ccclass, property } = _decorator;

@ccclass('SkillBulletTrack')
export class SkillBulletTrack extends SkillFunc {
    @property(CCInteger)
    speed : number = 500;     //移动速度
    
    @property(CCInteger)
    rotSpeed : number = 180;    //旋转速度 度/秒

    moveTime: number = 0;

    private trackNode : Node  = null;

    public SetTrackNode(node:Node) : void{
        this.trackNode = node;
    }

    public GetTrackNode() : Node{
        return this.trackNode;
    }

    update(deltaTime: number) {   
        if(BattleData.Inst().battleInfo.isPause){
            return;
        }     
        deltaTime *= BattleData.Inst().battleInfo.globalTimeScale;

        if(this.trackNode){
            // let targetDir  = new Vec2();
            // // Vec2.subtract()
            // targetDir = new Vec2(this.trackNode.worldPosition.x - this.node.worldPosition.x,
            //     this.trackNode.worldPosition.y - this.node.worldPosition.y);
            let targetDirX = this.trackNode.worldPosition.x - this.node.worldPosition.x;
            let targetDirY = this.trackNode.worldPosition.y - this.node.worldPosition.y;
            // let upVec2 = new Vec2(this.node.up.x,this.node.up.y);
            // let radian = targetDir.signAngle(upVec2);
            let angle = MathHelper.SignAngle(this.node.up.x,this.node.up.y,targetDirX,targetDirY); //radian * 180 / Math.PI;
            if(Math.abs(angle) > 3){
                let turnDir = Math.sign(angle);
                let turnAngle = this.rotSpeed * deltaTime * turnDir;
                let curEuler = this.GetEulerAngle();
                this.SetEulerAngle(curEuler + turnAngle);
            }

        }

        this.moveTime += deltaTime;
        let moveLen = this.speed * deltaTime;
        let moveVec = new Vec2(this.node.up.x * moveLen,this.node.up.y * moveLen);
        this.node.setWorldPosition(this.node.worldPosition.x + moveVec.x,
            this.node.worldPosition.y + moveVec.y,0);

        if(this.moveTime >= this.playTime){
            this.StopSkill(this);
        }
    }

    Reset(){
        super.Reset();
        this.moveTime = 0;
    }
}


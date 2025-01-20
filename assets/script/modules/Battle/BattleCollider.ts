////   弃用 ////////////

import { Vec2, Vec3, math } from "cc";

export interface IColliderNode{
    range:number,
    worldPosition:Vec3,
}
export interface IColliderLine{
    worldPosition:Vec3,
    endPos:Vec3,
    range?:number,
}
export interface IColliderRectNode{
    w:number,
    worldPosition:Vec3,
    h:number,
}
//场景中的触发检测
export class BattleCollider{
    // 两个圆形的触碰检测
    static IsRoundTrigger(obj:IColliderNode, targer:IColliderNode):boolean{
        let dis = Vec3.distance(obj.worldPosition, targer.worldPosition)
        if(dis <= (obj.range + targer.range)){
            return true
        }
        return false;
    }

    // 圆对矩形碰撞
    static IsRoundRectTrigger(obj:IColliderNode, target:IColliderRectNode):boolean{
        let points:Vec2[] = []
        let objPoint = new Vec2(obj.worldPosition.x, obj.worldPosition.y);
        let offsetX = target.w / 2;
        let targetX = target.worldPosition.x;
        let targetY = target.worldPosition.y;
        points[0] = new Vec2(targetX + offsetX, targetY);
        points[1] = new Vec2(targetX - offsetX, targetY);
        points[2] = new Vec2(targetX + offsetX, targetY + target.h);
        points[3] = new Vec2(targetX - offsetX, targetY + target.h);

        //判断圆心是否在矩阵内部
        if(objPoint.x >= points[1].x && objPoint.x <= points[0].x && (objPoint.y >= targetY && objPoint.y <= points[2].y || 
            objPoint.y <= targetY && objPoint.y >= points[2].y)){
            return true;
        }


        for(var point of points){
             let dis = Vec2.distance(objPoint, point)
            if(dis <= obj.range){
                return true
            }
        }
        return false;
    }

    // 线对矩形的触碰检测 尽量减少计算
    static IsLineRectTrigger(obj:IColliderLine, targer:IColliderRectNode):boolean{
        return false;
    }

    // 线对圆的触碰检测 尽量减少计算 
    static IsLineRoundTrigger(obj:IColliderLine, targer:IColliderNode):boolean{
        if(obj.range == null){
            obj.range = Vec3.distance(obj.endPos, obj.worldPosition);
        }
        let dis = Vec3.distance(obj.worldPosition, targer.worldPosition)
        if(dis > obj.range){
            return false;
        }

        // // obj.endPos.x = 1;
        // // obj.endPos.y = 1;

        // // targer.worldPosition.x = 0;
        // // targer.worldPosition.y = 0;

        // //得到两点的垂直点，在通过垂直点判断距离
        // let bPos = targer.worldPosition;
        // let aPos = obj.endPos;
        // let xM = (bPos.x + aPos.x) * 0.5;
        // let yM = (bPos.y + aPos.y) * 0.5;
        // //斜率
        // let k = (bPos.y - aPos.y) / (bPos.x - aPos.x);
        // let x = (k * (xM - yM) + aPos.x / k + bPos.x / k + aPos.y - bPos.y) / (2/(k * k) + 1)
        // let y = (-1 / k) * (x - xM) + yM;
        // console.log(x,y);
        // let p = new Vec3(x,y,0);
        // dis = Vec3.distance(p, targer.worldPosition)
        // if(dis > targer.radius){
        //     return false;
        // }
        // return true;

        // 弧度 * 180 / PI
        // let dir = new Vec2(targer.worldPosition.x - obj.originPos.x, targer.worldPosition.y - obj.originPos.y);
        // let len = dir.length();
        // //let nor = dir.normalize();
        // let angle = Math.atan2(dir.x, dir.y) * 180 / Math.PI;
        // console.log("Angle", angle, Math.sin(angle), len * Math.sin(angle));
        // if(angle < 0){
        //     angle = 360 + angle;
        // }
        // console.log("Ang", angle, Math.sin(angle), len * Math.sin(angle));

        let aDir = new Vec2(targer.worldPosition.x - obj.worldPosition.x, targer.worldPosition.y - obj.worldPosition.y);
        let bDir = new Vec2(obj.endPos.x - obj.worldPosition.x, obj.endPos.y - obj.worldPosition.y);

        let angle = Vec2.angle(aDir, bDir); //注意，这个是弧度
        dis = obj.range * Math.tan(angle);
        if(dis > targer.range){
            return false;
        }
        return true;

        // let angleValue = angle * 180 / Math.PI;
        // let dis = Vec3.distance(obj.originPos, targer.worldPosition)
        // console.log(angle,angleValue, Math.tan(angle), dis * Math.tan(angle));

        //return false;
    }
}
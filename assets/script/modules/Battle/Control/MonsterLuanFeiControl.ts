import { Vec3 } from "cc";
import { MathHelper } from "../../../helpers/MathHelper";
import { FIGHT_CELL_WIDTH, MAP_COL } from "../BattleConfig";
import { BattleCtrl } from "../BattleCtrl";
import { IMoveFuncData, IMovePosInfo } from "../Function/MoveFunc";
import { MonsterControl } from "./MonsterControl";

// 怪物行为：左右乱飞浮度大点 视频编号11008-11009
export class MonsterLuanFeiControl extends MonsterControl {
    //定制攻击路线
    GetRoute(): IMoveFuncData {
        let homePos = this.homePos;
        let curPos = this.node.worldPosition;
        let centerPos = this.scene.node.worldPosition;   //屏幕中心位置
        let clipCount = this.creatInfo.cfg_ctrl.param as number; //一共5段移动
        let bg = this.scene.battleBG;
        let mapLeftX = bg.GetMapLeftX();    //地图左边的位置x
        let mapRightX = bg.GetMapRightX();   //地图右边的位置x 
        let luanEnd = homePos.y + FIGHT_CELL_WIDTH;
        let distY = (luanEnd - curPos.y)
        let moveY = distY / clipCount;

        let maxCol = bg.maxCol ?? MAP_COL;
        let col = MathHelper.GetRandomNum(0, maxCol - 1);
        let moveX = bg.GetWorldPos(0, col).x;

        //在中心左边的，往右先走，反之左边先走
        let targetPosList: IMovePosInfo[] = []
        let dir = curPos.x < centerPos.x ? 0 : 1;
        let y: number = curPos.y;
        let x: number;
        for (let i = 1; i <= clipCount; i++) {
            if (i == clipCount) {
                y = luanEnd;
            } else {
                let hafMoveY = moveY * MathHelper.GetRandomFloat(0.5, 1);
                y += MathHelper.GetRandomFloat(hafMoveY, moveY);
            }
            if (i % 2 == dir) {
                x = mapLeftX;
            } else {
                x = mapRightX;
            }
            let posInfo = <IMovePosInfo>{
                speed: this.monsterObj.speed,
                pos: new Vec3(x, y, 0),
            }
            targetPosList.push(posInfo);
        }

        let posInfo = <IMovePosInfo>{
            speed: this.monsterObj.speed,
            pos: new Vec3(moveX, this.homePos.y, 0),
        }
        targetPosList.push(posInfo);


        //console.log("怪物路线",targetPosList);

        let data = <IMoveFuncData>{
            node: this.node,
            targetPosList: targetPosList,
            ComleteFunc: this.MoveComlete.bind(this),
        }
        return data;
    }
}


import { Vec3 } from "cc";
import { MathHelper } from "../../../helpers/MathHelper";
import { MAP_COL, ENUM_BATTLE_MOVE_TYPE } from "../BattleConfig";
import { BattleCtrl } from "../BattleCtrl";
import { IMoveFuncData, IMovePosInfo } from "../Function/MoveFunc";
import { MonsterControl } from "./MonsterControl";


// 怪物行为：怪物两边 抛物线 入场 视频编号11009
export class MonsterPingYiARCControl extends MonsterControl {
    // 定制攻击路线
    GetRoute(): IMoveFuncData {
        let homePos = this.homePos;
        let bg = this.scene.battleBG;
        let mapLeftX = bg.GetMapLeftX();    //地图左边的位置x
        let mapRightX = bg.GetMapRightX();   //地图右边的位置x  
        let mapTopY = bg.GetMapTopY();

        let dist = mapRightX - mapLeftX;
        // let moveX = Math.random() * dist + mapLeftX;
        let maxCol = bg.maxCol ?? MAP_COL;
        let col = MathHelper.GetRandomNum(0, maxCol - 1);
        let moveX = bg.GetWorldPos(0, col).x;

        let moveY = homePos.y;
        // this.monsterObj.speed = this.monsterObj.speed * 3;
        let targetPosList: IMovePosInfo[] = [];
        let posInfo = <IMovePosInfo>{
            speed: this.monsterObj.speed,
            pos: new Vec3(moveX, mapTopY, 0),
            type: ENUM_BATTLE_MOVE_TYPE.ARC,
        }

        targetPosList.push(posInfo);

        let posInfo2 = <IMovePosInfo>{
            speed: this.monsterObj.speed,
            pos: new Vec3(moveX, moveY, 0),
        }

        targetPosList.push(posInfo2);

        let data = <IMoveFuncData>{
            node: this.node,
            targetPosList: targetPosList,
            ComleteFunc: this.MoveComlete.bind(this),
        }
        return data;
    }
}


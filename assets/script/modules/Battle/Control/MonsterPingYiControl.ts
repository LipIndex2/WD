import { Vec3 } from "cc";
import { BattleCtrl } from "../BattleCtrl";
import { IMoveFuncData, IMovePosInfo } from "../Function/MoveFunc";
import { MonsterControl } from "./MonsterControl";


// 怪物行为：怪物平移 视频编号11007
export class MonsterPingYiControl extends MonsterControl {
    // 定制攻击路线
    GetRoute(): IMoveFuncData {
        let homePos = this.homePos;
        let endPoint = this.creatInfo.cfg_ctrl.param;
        let moveX;
        let moveY;
        if (endPoint && endPoint != "") {
            let movePoint = (endPoint as string).split(",").map(Number);
            let scenePoint = this.scene.battleBG.GetWorldPos(movePoint[0], movePoint[1]);
            moveX = scenePoint.x;
            if (movePoint[1] == -1) {
                moveY = homePos.y;
            } else {
                moveY = scenePoint.y;
            }
        } else {
            let bg = this.scene.battleBG;
            let mapLeftX = bg.GetMapLeftX();    //地图左边的位置x
            let mapRightX = bg.GetMapRightX();   //地图右边的位置x  

            let dist = mapRightX - mapLeftX;
            moveX = Math.random() * dist + mapLeftX;
            moveY = homePos.y;
        }
        let targetPosList: IMovePosInfo[] = []
        let posInfo = <IMovePosInfo>{
            speed: this.monsterObj.speed,
            pos: new Vec3(moveX, moveY, 0),
        }
        targetPosList.push(posInfo);

        let data = <IMoveFuncData>{
            node: this.node,
            targetPosList: targetPosList,
            ComleteFunc: this.MoveComlete.bind(this),
        }
        return data;
    }
}


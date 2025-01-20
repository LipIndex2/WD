import { Vec3 } from "cc";
import { FIGHT_CELL_WIDTH } from "../BattleConfig";
import { BattleCtrl } from "../BattleCtrl";
import { IMoveFuncData, IMovePosInfo } from "../Function/MoveFunc";
import { MonsterControl } from "./MonsterControl";


// 怪物行为：怪物从外围出场 视频编号11024
export class MonsterRoundOutSideControl extends MonsterControl {
    // 定制攻击路线
    GetRoute(): IMoveFuncData {
        let homePos = this.homePos;
        let curPos = this.node.worldPosition;
        let bg = this.scene.battleBG;
        let centerPos = this.scene.node.worldPosition;   //屏幕中心位置
        let mapLeftX = bg.GetMapLeftX() - FIGHT_CELL_WIDTH / 2;    //地图左边的位置x
        let mapRightX = bg.GetMapRightX() + FIGHT_CELL_WIDTH / 2;   //地图右边的位置x  
        let mapTopY = bg.GetMapTopY();

        let moveX = curPos.x > centerPos.x ? mapRightX : mapLeftX;
        let moveY = homePos.y;


        let targetPosList: IMovePosInfo[] = [];
        /**测试代码 */
        // this.monsterObj.speed = this.monsterObj.speed * 3;
        // let posInfo = <IMovePosInfo>{
        //     speed: this.monsterObj.speed,
        //     pos: new Vec3(moveXtemp, moveY / 2, 0),
        // }
        // targetPosList.push(posInfo);
        /**测试代码 */

        // let posInfo2 = <IMovePosInfo>{
        //     speed: this.monsterObj.speed,
        //     pos: new Vec3(curPos.x, mapTopY, 0),
        // }

        // targetPosList.push(posInfo2);

        let posInfo3 = <IMovePosInfo>{
            speed: this.monsterObj.speed,
            pos: new Vec3(moveX, curPos.y, 0),
        }

        targetPosList.push(posInfo3);

        let posInfo4 = <IMovePosInfo>{
            speed: this.monsterObj.speed,
            pos: new Vec3(moveX, moveY, 0),
        }

        targetPosList.push(posInfo4);


        let data = <IMoveFuncData>{
            node: this.node,
            targetPosList: targetPosList,
            ComleteFunc: this.MoveComlete.bind(this),
        }
        return data;
    }
}


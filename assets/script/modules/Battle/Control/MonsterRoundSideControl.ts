import { Vec3 } from "cc";
import { MathHelper } from "../../../helpers/MathHelper";
import { FIGHT_CELL_WIDTH, MAP_COL } from "../BattleConfig";
import { BattleCtrl } from "../BattleCtrl";
import { IMoveFuncData, IMovePosInfo } from "../Function/MoveFunc";
import { MonsterControl } from "./MonsterControl";


// 怪物行为：怪物从外围入场 视频编号11008-11009
export class MonsterRoundSideControl extends MonsterControl {
    // 定制攻击路线
    GetRoute(): IMoveFuncData {
        let homePos = this.homePos;
        let curPos = this.node.worldPosition;
        let centerPos = this.scene.node.worldPosition;   //屏幕中心位置
        let bg = this.scene.battleBG;
        let mapLeftX = bg.GetMapLeftX() - FIGHT_CELL_WIDTH / 2;    //地图左边的位置x
        let mapRightX = bg.GetMapRightX() + FIGHT_CELL_WIDTH / 2;  //地图右边的位置x  
        let mapTopY = bg.GetMapTopY();

        let dist = mapRightX - mapLeftX;
        let moveXtemp = curPos.x > centerPos.x ? mapRightX : mapLeftX;
        let hero_point = this.creatInfo.hero_point;
        let col: number;
        let maxCol = bg.maxCol ?? MAP_COL;
        if (hero_point) {
            let index = MathHelper.GetRandomNum(0, hero_point.length - 1);
            col = hero_point[index][0];
        }
        else
            col = MathHelper.GetRandomNum(0, maxCol - 1);
        let moveX = bg.GetWorldPos(0, col).x;
        // let moveX = Math.random() * dist + mapLeftX;
        let moveY = homePos.y;


        let targetPosList: IMovePosInfo[] = [];
        /**测试代码 */
        // this.monsterObj.speed = this.monsterObj.speed * 5;
        // this.monsterObj.speed = this.monsterObj.speed * 2;

        // let posInfo = <IMovePosInfo>{
        //     speed: this.monsterObj.speed,
        //     pos: new Vec3(moveXtemp, moveY / 2, 0),
        // }
        // targetPosList.push(posInfo);

        /**测试代码 */

        let posInfo2 = <IMovePosInfo>{
            speed: this.monsterObj.speed,
            pos: new Vec3(moveXtemp, mapTopY, 0),
        }
        targetPosList.push(posInfo2);

        let posInfo3 = <IMovePosInfo>{
            speed: this.monsterObj.speed,
            pos: new Vec3(moveX, mapTopY, 0),
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


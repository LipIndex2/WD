import { Node, Vec3 } from "cc";
import * as fgui from "fairygui-cc";
import { UtilHelper } from "../../../helpers/UtilHelper";
import { BattleCtrl } from "../BattleCtrl";
import { BattleData, BattleInfo } from "../BattleData";
import { BattleTweenerType } from "../BattleDynamic";
import { BattleObjTag, CELL_WIDTH, ENUM_BATTLE_MOVE_TYPE, FIGHT_CELL_WIDTH, IS_BATTLE_TWEENER_AUTO, MAP_COL } from "../BattleConfig";
import TGA from "tga-js";
import { LogError } from "core/Debugger";
import { IBattleScene } from "../BattleScene";

export interface IMovePosInfo {
    pos: Vec3;
    speed: number;
    type: ENUM_BATTLE_MOVE_TYPE | 0;
    moveComleteFunc?: Function;
}

export interface IMoveFuncData {
    node: Node;
    targetPosList: IMovePosInfo[];
    ComleteFunc?: Function;
}

export class MoveFunc {
    private tweener: fgui.GTweener;
    private posIndex: number;
    data: IMoveFuncData;
    private _curPoint: Vec3;
    private dir: number;


    private _paused: boolean = false;
    private _paused_num: number = 0;
    private _totalTimeScale: number = 1;
    private _direction: 1 | -1 = 1;

    tag: BattleObjTag;

    get scene(): IBattleScene {
        return BattleCtrl.Inst().GetBattleScene(this.tag);
    }

    get battleInfo(): BattleInfo {
        return BattleData.Inst().GetBattleInfo(this.tag);
    }

    constructor(data: IMoveFuncData, tag: BattleObjTag) {
        this.tag = tag;
        this.SetData(data);
    }


    SetData(data: IMoveFuncData) {
        this.data = data;
        this.dir = 0;
    }

    SetDir(dir: 1 | -1) {
        this.dir += dir;
        let todir: 1 | -1 = this.dir >= 0 ? 1 : -1;
        this.tweener.setDirection(todir);
    }

    //开始移动
    start() {
        this.posIndex = 0;
        this.Move();
    }

    Stop() {
        if (this.tweener == null || this.tweener.completed) {
            return
        }
        this.scene.dynamic.RemoveTweenr(BattleTweenerType.Monster, this.tweener);
        this.tweener = null;
    }

    //暂停
    Pause(isPause: boolean) {
        if (this.tweener) {
            this.tweener.setPausedNUM(isPause);
            this._paused_num += isPause ? 1 : -1;
        }
    }

    //销毁
    Delete() {
        if (this.tweener && !this.tweener._killed) {
            this.scene.dynamic.RemoveTweenr(BattleTweenerType.Monster, this.tweener);
            this.tweener = null;
            this._paused = false;
            this._paused_num = 0;
            this._totalTimeScale = 1;
            this._direction = 1;
        }
        this.index_back = NaN;
    }

    Move(isBuff: boolean = false, p_posInfo?: IMovePosInfo, keppLast: boolean = true, saveLast = true) {
        if (!isBuff && this.posIndex >= this.data.targetPosList.length) {
            if (this.data.ComleteFunc) {
                this.data.ComleteFunc();
            }
            return;
        }
        let posInfo: IMovePosInfo
        if (p_posInfo) {
            posInfo = p_posInfo
        } else {
            posInfo = this.data.targetPosList[this.posIndex];
        }

        let _paused = this._paused;
        let _paused_num = this._paused_num;
        let _totalTimeScale = this._totalTimeScale;
        let _direction = this._direction;

        if (this.tweener != null) {
            if (saveLast) {
                this._paused = this.tweener._paused;
                // this._paused_num = this.tweener._paused_num;
                this._totalTimeScale = this.tweener._totalTimeScale;
                this._direction = this.tweener._direction;
            }
            this.scene.dynamic.RemoveTweenr(BattleTweenerType.Monster, this.tweener);
        }
        let curPos = this._curPoint = this.data.node.getWorldPosition();
        let tPos = posInfo.pos;
        let time = Vec3.distance(curPos, tPos) / posInfo.speed;
        if (posInfo.type == ENUM_BATTLE_MOVE_TYPE.ARC) {
            this.tweener = fgui.GTween.to(0, 1, time, IS_BATTLE_TWEENER_AUTO);
            this.tweener.onUpdate(this.TweenerUpdate2.bind(this));
        } else {
            this.tweener = fgui.GTween.to2(curPos.x, curPos.y, posInfo.pos.x, posInfo.pos.y, time, IS_BATTLE_TWEENER_AUTO);
            this.tweener.onUpdate(this.TweenerUpdate.bind(this));
        }
        let speedScale = this.battleInfo.skillAttri.monsterMoveParcent;
        if (keppLast) {
            this.tweener._paused = _paused;
            this.tweener._paused_num = _paused_num;
            this.tweener._totalTimeScale = _totalTimeScale;
            this.tweener._direction = _direction;
        }

        this.tweener.setTimeScale(speedScale)
        this.tweener.setEase(fgui.EaseType.Linear)
        this.tweener.onComplete(this.StageMoveComplete.bind(this));
        this.scene.dynamic.AddTweenr(BattleTweenerType.Monster, this.tweener);
    }

    SetSpeedScale(speedScale: number) {
        this.tweener.setTimeScale(speedScale)
    }

    TweenerUpdate(tweener: fgui.GTweener) {
        this.data.node.setWorldPosition(tweener.value.x, tweener.value.y, 0);
    }

    TweenerUpdate2(tweener: fgui.GTweener) {
        let value = tweener.value.x;
        if (value >= 1) {
            return;
        }
        let posInfo = this.data.targetPosList[this.posIndex];
        let point1 = this._curPoint;
        let point3 = posInfo.pos;
        let Point2X = point1.x + (point3.x - point1.x) / 2;
        let Point2Y = point1.y + (point3.y - point1.y) / 2;;

        let p_value = 1 - value;
        let pv_pow = Math.pow(p_value, 2);
        let v_pow = Math.pow(value, 2);
        let x = pv_pow * point1.x + 2 * value * p_value * Point2X + v_pow * point3.x;
        let y = pv_pow * point1.y + 2 * value * p_value * Point2Y + v_pow * point3.y;

        this.data.node.setWorldPosition(x, y, 0);
    }
    private index_back = NaN;
    backX(x: number) {
        if (this.tweener) {
            let speed = Math.abs(this.tweener.endValue.x - this.tweener.startValue.x) / this.tweener.duration;
            if (speed == 0) {
                return
            }
            let time = x / speed;
            (this.tweener as any)._elapsedTime -= time;
        }
    }

    backY(moveY: number, speed: number = 5000) {
        if (!moveY) {
            moveY = -FIGHT_CELL_WIDTH
            LogError("！！！击退值不应为 undefined")
        }
        if (this.tweener) {
            let curPos = this.data.node.getWorldPosition();
            let endY = curPos.y + moveY;
            let topPos = this.scene.GetTopPos();
            if (topPos == null) {
                return;
            }
            let top = topPos.y + 70;
            let bottom = this.scene.GetHomePos();
            endY = endY > top ? top : endY;
            if (endY <= bottom.y) {
                return
            }
            let posInfo_back = <IMovePosInfo>{
                speed: speed,
                pos: new Vec3(curPos.x, endY, 0),
            }
            if (isNaN(this.index_back)) {
                this.index_back = this.nextPoint(this.posIndex, endY);
            }
            this.Move(false, posInfo_back, false, true)
        }
    }

    private nextPoint(index: number, endY: number): number {
        let posInfo = this.data.targetPosList[index];
        let next = index + 1
        let posInfo_next = this.data.targetPosList[next];
        if (posInfo_next) {
            let distY = posInfo_next.pos.y - posInfo.pos.y;
            if (distY > 0 && endY > posInfo_next.pos.y) {
                return this.nextPoint(next, endY);
            }
        }
        return index;
    }

    backYByCell(cell: number, speed: number = 5000) {
        this.backY(cell * FIGHT_CELL_WIDTH, speed)
    }

    StageMoveComplete() {

        if (!isNaN(this.index_back)) {
            this.posIndex = this.index_back;
            this.index_back = NaN;
        } else {
            let posInfo = this.data.targetPosList[this.posIndex];
            if (posInfo && posInfo.moveComleteFunc) {
                posInfo.moveComleteFunc();
            }
            this.posIndex += 1;
        }
        this.Move();
    }
}
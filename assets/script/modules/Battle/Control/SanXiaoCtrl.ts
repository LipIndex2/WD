import { _decorator, Component, EventTouch, Node, Vec2, Vec3 } from 'cc';
import * as fgui from "fairygui-cc";
import { HeroObj } from '../Object/HeroObj';
import { PlayerInputDecision } from '../Decision/PlayerInputDecision';
import { BattleObj } from '../Object/BattleObj';
import { BattleCtrl } from '../BattleCtrl';
import { BaseControl } from './BaseControl';
import { BattleScene } from '../BattleScene';
import { IS_BATTLE_TWEENER_AUTO, MAP_COL } from '../BattleConfig';
import { BattleData } from '../BattleData';
import { BattleTweenerType } from '../BattleDynamic';
import { UISPineConf } from 'modules/scene_obj_spine/Effect/UISPineConf';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { UH } from '../../../helpers/UIHelper';

// 三消行为
export class SanXiaoCtrl extends BaseControl {

    private inputDecision: PlayerInputDecision;
    private heroObj: HeroObj;
    private _maxDragRadius:number = 140;
    //最大拖拽半径
    get maxDragRadius():number{
        return this._maxDragRadius;
    }    

    private initToTweenr: fgui.GTweener;
    private moveTweenr: fgui.GTweener;

    private scene: BattleScene;
    private longPressEffect: UISPineConf;    //长按特效
    private isLongPress:boolean = false;

    isCanClick:boolean = true;

    start() {
        this.scene = BattleCtrl.Inst().battleScene;

        this.heroObj = this.node.getComponent(HeroObj);
        this.inputDecision = this.node.addComponent(PlayerInputDecision);

        this.inputDecision.OnTouchDown(this.TouchDown.bind(this));
        this.inputDecision.OnTouchMove(this.TouchMove.bind(this));
        this.inputDecision.OnTouchUp(this.TouchUp.bind(this));
        this.inputDecision.OnClick(this.ClickEvent.bind(this));

        this.inputDecision.OnTouchLongPress(this.TouchLongPress.bind(this));
        this.inputDecision.OnTouchLongPressStart(() => {
            if (!this.scene.isCanCtrl || !this.isMove) {
                return
            }
            //console.log("长按开始");
            this.isLongPress = true;
            SceneEffect.Inst().Play(SceneEffectConfig.ChangAn, BattleCtrl.Inst().battleScene.node, this.node.worldPosition, (obj) => {
                this.longPressEffect = obj.getComponent(UISPineConf);
                if(!this.isLongPress || this.node == null){
                    this.longPressEffect.destroyBySelf();
                    this.longPressEffect = null;
                    return true;
                }
            });
        })
        this.inputDecision.OnTouchLongPressEnd(() => {
            //console.log("长按结束");
            this.isLongPress = false;
            if (this.longPressEffect) {
                this.longPressEffect.destroyBySelf();
                this.longPressEffect = null;
            }
        })
    }

    private isMove: boolean = false;
    private offsetPos: Vec2;
    TouchDown(event: EventTouch) {
        if (!this.scene.isCanCtrl) {
            return
        }
        if (!BattleData.Inst().battleInfo.HasStep()) {
            return
        }
        if(!this.isCanClick){
            return
        }
        this.isMove = true;
        let selfPos = this.node.getWorldPosition();
        let mouse_pos = event.getUILocation();
        this.offsetPos = mouse_pos.subtract(new Vec2(selfPos.x, selfPos.y));
        this.node.setSiblingIndex(this.node.parent.children.length);
    }

    private movePos:Vec3 = new Vec3();
    private moveDir:Vec2 = new Vec2();
    TouchMove(event: EventTouch) {
        if (this.isMove) {
            let mouse_pos = event.getUILocation();
            mouse_pos = mouse_pos.subtract(this.offsetPos);
            this.movePos.x = mouse_pos.x;
            this.movePos.y = mouse_pos.y;

            this.moveDir.x = mouse_pos.x - this.heroObj.initWorldPos.x;
            this.moveDir.y = mouse_pos.y - this.heroObj.initWorldPos.y;

            let len = this.moveDir.length();
            if (len >= this.maxDragRadius) {
                let nor = this.moveDir.normalize();
                let addPos = new Vec3(nor.x * this.maxDragRadius, nor.y * this.maxDragRadius, 0);
                this.movePos = Vec3.add(this.movePos, this.heroObj.initWorldPos, addPos);
            }
            this.node.setWorldPosition(this.movePos);
        }
    }

    TouchUp(event: EventTouch) {
        if (this.isMove) {

            this.isMove = false;
            //交换英雄
            let item = this.GetSwapItem();
            if (item) {
                if (item == this.heroObj) {
                    let curPos = item.node.position;
                    let initPos = item.initPos;
                    let dir = new Vec3(curPos.x - initPos.x, curPos.y - initPos.y, 0).normalize();
                    let dot = Vec3.dot(dir, new Vec3(0, -1, 0))
                    if (dot >= 0.5) {
                        this.ToInitPos();
                    } else {
                        BattleCtrl.Inst().battleScene.DiscardHero(item);
                    }
                } else {
                    BattleCtrl.Inst().battleScene.SwapHero(this.heroObj, item, () => {
                        BattleCtrl.Inst().battleScene.CheckSanXiao();
                    });
                    BattleData.Inst().battleInfo.AddStepNum(-1);
                }
            } else {
                this.ToInitPos();
            }
        }
    }

    // 长按事件
    TouchLongPress() {
        if (this.isMove && !BattleData.Inst().IsGuide()) {
            this.isMove = false;
            BattleCtrl.Inst().battleScene.DiscardHero(this.heroObj);
        }
    }

    // 点击事件
    ClickEvent(){
        this.scene.OnTouchSingleHero(this.heroObj)
    }


    ToInitPos() {
        if (this.initToTweenr) {
            BattleCtrl.Inst().battleScene.dynamic.RemoveTweenr(BattleTweenerType.Hero, this.initToTweenr);
            this.initToTweenr = null;
        }
        let curPos = this.node.getPosition();
        let gtweenr = fgui.GTween.to2(curPos.x, curPos.y, this.heroObj.initPos.x, this.heroObj.initPos.y, 0.1, IS_BATTLE_TWEENER_AUTO);
        gtweenr.setEase(fgui.EaseType.Linear);
        this.initToTweenr = gtweenr;
        this.scene.dynamic.AddTweenr(BattleTweenerType.Hero, this.initToTweenr);
        gtweenr.onUpdate((tweener: fgui.GTweener) => {
            this.node.setPosition(tweener.value.x, tweener.value.y);
        })
        gtweenr.onComplete(() => {
            if (this.initToTweenr) {
                BattleCtrl.Inst().battleScene.dynamic.RemoveTweenr(BattleTweenerType.Hero, this.initToTweenr);
                this.initToTweenr = null;
            }
        })
    }

    MovePos(vec3: Vec3, finishFunc?: Function, time: number = 0.2, easeType: fgui.EaseType = fgui.EaseType.SineOut) {
        if(this.moveTweenr){
            BattleCtrl.Inst().battleScene.dynamic.RemoveTweenr(BattleTweenerType.Hero, this.moveTweenr);
            this.moveTweenr = null;
        }
        let curPos = this.node.getPosition();
        let gtweenr = fgui.GTween.to2(curPos.x, curPos.y, vec3.x, vec3.y, time, IS_BATTLE_TWEENER_AUTO);
        this.moveTweenr = gtweenr;
        BattleCtrl.Inst().battleScene.dynamic.AddTweenr(BattleTweenerType.Hero, this.moveTweenr);
        //gtweenr.setEase(fgui.EaseType.Linear)
        gtweenr.setEase(easeType);
        gtweenr.onUpdate((tweener: fgui.GTweener) => {
            if(this.node == null){
                return;
            }
            this.node.setPosition(tweener.value.x, tweener.value.y);
        })
        gtweenr.onComplete(() => {
            if(this.node == null){
                return;
            }
            if (finishFunc) {
                finishFunc();
            }
            if(this.moveTweenr){
                BattleCtrl.Inst().battleScene.dynamic.RemoveTweenr(BattleTweenerType.Hero, this.moveTweenr);
                this.moveTweenr = null;
            }
        })
    }

    //获取交换的英雄，如果是自己说明拖到外面去了，需要移除
    GetSwapItem(): HeroObj {
        let hero: HeroObj;
        if (BattleData.Inst().battleInfo.skillAttri.isCanXieJiao) {
            hero = this.XieJiaoSwap();
        } else {
            let limitLen = 60;
            if(BattleData.Inst().IsGuide()){
                let curGuideCfg = BattleData.Inst().GetGuideStepCfg();
                if(curGuideCfg && curGuideCfg.guide_id == 2){
                    limitLen = 20;
                }
            }
            hero = this.NormarSwap(limitLen);
        }
        // 指引时，判断操作是否合法
        if (hero && BattleData.Inst().IsGuide()) {
            let curGuideCfg = BattleData.Inst().GetGuideStepCfg();
            if (curGuideCfg) {
                if (curGuideCfg.guide_id == 1) {
                    let a_ij = curGuideCfg.step_param_1.toString().split(",")
                    let ai = Number(a_ij[1]);
                    let aj = Number(a_ij[0]);
                    if (this.heroObj.i != ai || this.heroObj.j != aj) {
                        return null;
                    }
                    let b_ij = curGuideCfg.step_param_2.toString().split(",")
                    let bi = Number(b_ij[1]);
                    let bj = Number(b_ij[0]);
                    if (hero.i != bi || hero.j != bj) {
                        return null;
                    }
                } else if (curGuideCfg.guide_id == 2) {
                    if(hero != this.heroObj){
                        return null;
                    }
                    let a_ij = curGuideCfg.step_param_1.toString().split(",")
                    let ai = Number(a_ij[1]);
                    let aj = Number(a_ij[0]);
                    if (hero.i != ai || hero.j != aj) {
                        return null;
                    }
                }
            }
        }
        return hero;
    }

    //正常交换
    private NormarSwap(limitLen:number = 60): HeroObj {
        let curPos = this.node.getPosition();
        let dir = new Vec3(curPos.x - this.heroObj.initPos.x, curPos.y - this.heroObj.initPos.y, 0);
        if (dir == null || dir.length() < limitLen) {
            return null;
        }
        // 弧度 * 180 / PI
        let nor = dir.normalize();
        let angle = Math.atan2(nor.x, nor.y) * 180 / Math.PI;
        if (angle < 0) {
            angle = 360 + angle;
        }
        let index = Math.ceil(((angle + 45) % 360) / 90);

        let i, j;
        switch (index) {
            case 1: i = this.heroObj.i + 1, j = this.heroObj.j + 0; break;
            case 2: i = this.heroObj.i + 0, j = this.heroObj.j + 1; break;
            case 3: i = this.heroObj.i - 1, j = this.heroObj.j + 0; break;
            case 4: i = this.heroObj.i + 0, j = this.heroObj.j - 1; break;
        }
        let maxRow = BattleCtrl.Inst().battleScene.battleBG.Row;
        if (i < 0 || j < 0 || i >= maxRow || j >= MAP_COL) {
            return this.heroObj;
        }

        return BattleCtrl.Inst().battleScene.GetHero(i, j);
    }

    //斜角交换
    private XieJiaoSwap(): HeroObj {
        let curPos = this.node.getPosition();
        let dir = new Vec3(curPos.x - this.heroObj.initPos.x, curPos.y - this.heroObj.initPos.y, 0);
        if (dir == null || dir.length() < 60) {
            return null;
        }
        // 弧度 * 180 / PI
        let nor = dir.normalize();
        let angle = Math.atan2(nor.x, nor.y) * 180 / Math.PI;
        if (angle < 0) {
            angle = 360 + angle;
        }
        let index = Math.ceil(((angle + 22.5) % 360) / 45);

        let i, j;
        switch (index) {
            case 1: i = this.heroObj.i + 1, j = this.heroObj.j + 0; break;
            case 2: i = this.heroObj.i + 1, j = this.heroObj.j + 1; break;
            case 3: i = this.heroObj.i + 0, j = this.heroObj.j + 1; break;
            case 4: i = this.heroObj.i - 1, j = this.heroObj.j + 1; break;
            case 5: i = this.heroObj.i - 1, j = this.heroObj.j + 0; break;
            case 6: i = this.heroObj.i - 1, j = this.heroObj.j - 1; break;
            case 7: i = this.heroObj.i + 0, j = this.heroObj.j - 1; break;
            case 8: i = this.heroObj.i + 1, j = this.heroObj.j - 1; break;
        }
        let maxRow = BattleCtrl.Inst().battleScene.battleBG.Row;
        if (i < 0 || j < 0 || i >= maxRow || j >= MAP_COL) {
            return this.heroObj;
        }

        return BattleCtrl.Inst().battleScene.GetHero(i, j);
    }

    Delete(){
        super.Delete();
        UH.SetSpriteMatActive(this.node, false);
        if (this.initToTweenr) {
            BattleCtrl.Inst().battleScene.dynamic.RemoveTweenr(BattleTweenerType.Hero, this.initToTweenr);
            this.initToTweenr = null;
        }
        if (this.moveTweenr) {
            BattleCtrl.Inst().battleScene.dynamic.RemoveTweenr(BattleTweenerType.Hero, this.moveTweenr);
            this.moveTweenr = null;
        }

        this.inputDecision.destroy();
        this.inputDecision = null;
    }
}


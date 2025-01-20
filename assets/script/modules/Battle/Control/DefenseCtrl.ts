import { _decorator, Component, Node, EventTouch, Vec2, Vec3, view } from 'cc';
import { PlayerInputDecision } from '../Decision/PlayerInputDecision';
import { HeroObj } from '../Object/HeroObj';
import { BaseControl } from './BaseControl';
import * as fgui from "fairygui-cc";
import { BattleCtrl } from '../BattleCtrl';
import { DefBattleScene } from '../DefBattleScene';
import { EventCtrl } from 'modules/common/EventCtrl';
import { BattleEventType, BattleState } from '../BattleConfig';
import { BattleData } from '../BattleData';
import { BattleDefGuideView } from '../View/BattleDefGuideView';
import { ViewManager } from 'manager/ViewManager';

// 守护后院操作
export class DefenseCtrl extends BaseControl {
    private inputDecision: PlayerInputDecision;
    private heroObj: HeroObj;

    private get scene():DefBattleScene{
        return BattleCtrl.Inst().battleSceneDef;
    }

    isCanClick:boolean = true;

    start() {
        this.heroObj = this.node.getComponent(HeroObj);
        this.inputDecision = this.node.addComponent(PlayerInputDecision);

        this.inputDecision.OnTouchDown(this.TouchDown.bind(this));
        this.inputDecision.OnTouchMove(this.TouchMove.bind(this));
        this.inputDecision.OnTouchUp(this.TouchUp.bind(this));
        this.inputDecision.OnClick(this.OnClick.bind(this));
    }

    update(deltaTime: number) {
        
    }

    Delete(): void {
        super.Delete();
        this.inputDecision.destroy();
        this.inputDecision = null;
    }


    private isMove: boolean = false;
    private offsetPos: Vec2;
    TouchDown(event: EventTouch) {
        if (!this.scene.isCanCtrl) {
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
        EventCtrl.Inst().emit(BattleEventType.Pause, true);
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

            this.node.setWorldPosition(this.movePos);
        }
    }

    TouchUp() {
        if (this.isMove) {
            let mouse_pos = this.heroObj.node.worldPosition;
            this.isMove = false;
            //改变位置
            let ij = this.scene.GetSwapHeroIJ(mouse_pos, this.heroObj);
            if(ij == this.heroObj.ijNum){
                EventCtrl.Inst().emit(BattleEventType.Pause, false);
                this.scene.SwapHero(this.heroObj.ijNum, ij);
            }else{
                this.scene.SwapHero(this.heroObj.ijNum, ij, ()=>{
                    EventCtrl.Inst().emit(BattleEventType.Pause, false);
                });
            }
        }
    }

    OnClick(){
        if(BattleData.Inst().IsGuide()){
            EventCtrl.Inst().emit(BattleEventType.ClickHero, this.heroObj);
            return;
        }

        if(BattleData.Inst().battleInfo.GetBattleState() != BattleState.SanXiao){
            return;
        }

        if (!this.scene.isCanCtrl) {
            return
        }

        this.scene.RemoveHero(this.heroObj);
    }
}



import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BattleHelper } from "../BattleHelper";
import { BattleEventType, DEF_CELL_WIDTH } from "../BattleConfig";
import { Vec2, Vec3 } from "cc";
import { UtilHelper } from "../../../helpers/UtilHelper";
import { BattleCtrl } from "../BattleCtrl";
import { HeroObj } from "../Object/HeroObj";
import { UH } from "../../../helpers/UIHelper";
import { ViewManager } from "manager/ViewManager";
import { BattleData } from "../BattleData";
import { RoleCtrl } from "modules/role/RoleCtrl";
import { ROLE_SETTING_TYPE } from "modules/common/CommonEnum";
import { EventCtrl } from "modules/common/EventCtrl";
import { BattleDefView } from "./BattleDefView";

@BaseView.registView
export class BattleDefGuideView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleGuide",
        ViewName: "BattleGuideView",
        LayerType: ViewLayer.Normal + 5,
        ViewMask: ViewMask.None,
    };

    protected viewNode = {
        Block: <fgui.GComponent>null,
        ShouZhi: <fgui.GComponent>null,
        Word: <fgui.GTextField>null,
    };

    private rect: fgui.GObject;

    InitData() {
        this.rect = this.viewNode.Block.getChild("Rect");

        EventCtrl.Inst().on(BattleEventType.Swap, this.GuideSwapHeroOff, this);
        EventCtrl.Inst().on(BattleEventType.ClickHero, this.GuideClickHeroOff, this);
    }

    OpenCallBack() {
        BattleData.Inst().SetGuide(true);
        RoleCtrl.Inst().SendRoleSystemSetReq([
            {systemSetType:ROLE_SETTING_TYPE.SettingBattleDefGuide, systemSetParam:1}
        ]);
        this.GuideSwapHeroOn();
    }

    CloseCallBack() {
        BattleData.Inst().SetGuide(false);

        EventCtrl.Inst().off(BattleEventType.Swap, this.GuideSwapHeroOff, this);
        EventCtrl.Inst().off(BattleEventType.ClickHero, this.GuideClickHeroOff, this);

        let view = <BattleDefView>ViewManager.Inst().getView(BattleDefView);
        if(view){
            view.TriggerGameStartGuide();
        }
    }

    SetRectSize(ai:number, aj:number, bi:number, bj:number, rect:fgui.GObject){
        let aPos = BattleHelper.GetDefWorldPos(ai, aj);
        let bPos = BattleHelper.GetDefWorldPos(bi, bj);
        let centerPos = new Vec3(aPos.x + (bPos.x - aPos.x) / 2, aPos.y + (bPos.y - aPos.y) / 2, 0);
        let fPos = UtilHelper.CocosWorldPosToFgui(centerPos);

        let w = (Math.abs(aj - bj) + 1) * DEF_CELL_WIDTH;
        let h = (Math.abs(ai - bi) + 1) * DEF_CELL_WIDTH + 20;
        rect.width = w;
        rect.height = h;
        rect.setPosition(fPos.x, fPos.y - 20);
    }

    // 拖拽交换
    private isSwaping = false;
    GuideSwapHeroOn(){
        let scene = BattleCtrl.Inst().battleSceneDef;
        if(scene.heroMap.size < 2){
            return;
        }
        this.isSwaping = true;
        let heroList:HeroObj[] = [];
        scene.heroMap.forEach((hero,k)=>{
            if(hero && heroList.length < 2){
                heroList.push(hero);
            }
        })

        let hero1 = heroList[0];
        let hero2 = heroList[1];

        this.SetRectSize(hero1.i, hero1.j, hero2.i, hero2.j, this.rect);
        this.ShowShouZhi(new Vec2(this.rect.x - this.rect.width / 2 + 30, this.rect.y), hero1.i, hero1.j, hero2.i, hero2.j);
        UH.SetText(this.viewNode.Word, Language.DefenseHome.GuideTip1);
        this.viewNode.Word.setPosition(this.rect.x - this.rect.width, this.rect.y + 100);
    }

    GuideSwapHeroOff(){
        if(!this.isSwaping){
            return;
        }
        this.isSwaping = false;
        this.GuideClickHeroOn();
    }

    // 下阵
    isClickGuiding = false;
    GuideClickHeroOn(){
        let scene = BattleCtrl.Inst().battleSceneDef;
        if(scene.heroMap.size < 1){
            return;
        }
        this.isClickGuiding = true;
        let heroList:HeroObj[] = [];
        scene.heroMap.forEach((hero,k)=>{
            if(hero && heroList.length < 1){
                heroList.push(hero);
            }
        })

        let hero1 = heroList[0];

        this.SetRectSize(hero1.i, hero1.j, hero1.i, hero1.j, this.rect);
        this.ShowShouZhi(new Vec2(this.rect.x, this.rect.y));
        UH.SetText(this.viewNode.Word, Language.DefenseHome.GuideTip2);
        this.viewNode.Word.setPosition(this.rect.x - this.rect.width, this.rect.y + 100);
    }

    GuideClickHeroOff(hero:HeroObj){
        if(!this.isClickGuiding){
            return;
        }
        BattleCtrl.Inst().battleSceneDef.RemoveHero(hero);
        this.isClickGuiding = false;
        this.closeView();
    }

    private anima:fgui.Transition;
    ShowShouZhi(pos:Vec2, ai?:number, aj?:number, bi?:number, bj?:number){
        this.viewNode.ShouZhi.setPosition(pos.x, pos.y);
        this.viewNode.ShouZhi.sortingOrder = 10;
        this.viewNode.ShouZhi.visible = true;
        if(this.anima){
            this.anima.stop();
        }
        if(ai == null){
            this.anima = this.viewNode.ShouZhi.getTransition("click");
            if(this.anima){
                this.anima.play(null, -1);
            }
            return
        }
        
        if(ai > bi){
            this.anima = this.viewNode.ShouZhi.getTransition("down_move");
        }else if(bi > ai){
            this.anima = this.viewNode.ShouZhi.getTransition("up_move");
        }else if(aj > bj){
            this.anima = this.viewNode.ShouZhi.getTransition("left_move");
        }else if(bj > aj){
            this.anima = this.viewNode.ShouZhi.getTransition("right_move");
        }
        if(this.anima){
            this.anima.play(null, -1);
        }
    }
}
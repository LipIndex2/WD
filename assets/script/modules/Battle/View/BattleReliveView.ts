
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { AdType } from "modules/common/CommonEnum";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { MainFBCtrl } from "modules/main_fb/MainFBCtrl";
import { RoleData } from "modules/role/RoleData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { ChannelAgent, GameToChannel } from "../../../proload/ChannelAgent";
import { BattleCtrl } from "../BattleCtrl";

@BaseView.registView
export class BattleReliveView extends BaseView {
    private sp_show: UISpineShow = undefined;

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "BattleRelive",
        ViewName: "BattleReliveView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
    };

    protected viewNode = {
        TimeShow: <TimeMeter>null,
        BtnFree: <fgui.GButton>null,
        BtnDiamond: <fgui.GButton>null,
        ContinueBtn: <fgui.GButton>null,
    };

    InitData() {
        this.viewNode.BtnFree.onClick(this.OnClickFree, this)
        this.viewNode.BtnDiamond.onClick(this.OnClickDiamond, this)
        this.viewNode.ContinueBtn.onClick(this.OnCloseClick, this)
        this.viewNode.BtnDiamond.title = "30";

        this.InitSpineAnim();
    }

    InitUI() {
        this.FlushTimeShow();

        let isAd = RoleData.Inst().IsCanAD(AdType.relive);
        this.viewNode.BtnFree.visible = isAd;
        let diamondY = this.viewNode.BtnDiamond.y;
        let diamondX = isAd ? 52 : 252;
        this.viewNode.BtnDiamond.setPosition(diamondX, diamondY);
    }

    InitSpineAnim() {
        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.Spine("fuhuo/fuhuo"), true, (obj: any) => {
            obj.setPosition(400, -750);
            this.view._container.insertChild(obj, 0);
        });
    }

    FlushTimeShow() {
        this.viewNode.TimeShow.SetCallBack(this.OnCloseClick.bind(this));
        this.viewNode.TimeShow.SetOutline(true, COLORS.Brown, 3)
        this.viewNode.TimeShow.TotalTime(9, TimeFormatType.TYPE_TIME_2);
    }

    OnClickFree() {
        this.viewNode.TimeShow.SetTime("0");
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.relive), "");
    }

    OnClickDiamond() {
        MainFBCtrl.Inst().SendMainFBOperRelive()
    }

    CloseCallBack(): void {
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
        }
        if (BattleCtrl.Inst().isServerRevive == true) {
            BattleCtrl.Inst().isServerRevive = false;
            BattleCtrl.Inst().adapterBattleScene.CheckGameState();
        }
    }

    OnCloseClick() {
        ViewManager.Inst().CloseView(BattleReliveView);
        BattleCtrl.Inst().adapterBattleScene.CheckGameState();
    }
}
import { UH } from './../../helpers/UIHelper';
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { DrawCardViewGiftPanel } from "./DrawCardViewGiftPanel";
import { DrawCardViewMainPanel } from "./DrawCardViewMainPanel";
import { DrawCardViewTaskPanel } from "./DrawCardViewTaskPanel";
import { CommonBoard1, CommonBoardTab1 } from "modules/common_board/CommonBoard1";
import { EGLoader } from "modules/extends/EGLoader";
import { tabberInfo } from "modules/common_board/BoardData";
import { CurrencyShow } from 'modules/extends/Currency';
import { CommonId } from 'modules/common/CommonEnum';
import { DrawCardData } from './DrawCardData';
import { Vec2 } from '../../../../extensions/cocos-build-template/@types/packages/scene/@types/public';
import { ViewManager } from 'manager/ViewManager';
import { Mod } from 'modules/common/ModuleDefine';
import { RedPoint } from 'modules/extends/RedPoint';

@BaseView.registView
export class DrawCardView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "DrawCard",
        ViewName: "DrawCardView",
        LayerType: ViewLayer.Normal,
    };

    protected boardCfg = {
        TabberCfg: [
            { panel: DrawCardViewMainPanel, viewName: "DrawCardViewMainPanel", titleName: Language.DrawCard.Title[0], param: "ChouJiang", modKey: Mod.DrawCard.Draw, isRemind: true },
            { panel: DrawCardViewTaskPanel, viewName: "DrawCardViewTaskPanel", titleName: Language.DrawCard.Title[1], param: "RenWu", modKey: Mod.DrawCard.Task, isRemind: true },
            { panel: DrawCardViewGiftPanel, viewName: "DrawCardViewGiftPanel", titleName: Language.DrawCard.Title[2], param: "LiBao" , modKey: Mod.DrawCard.Gift},
        ]
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,

        bg: <EGLoader>null,
        BtnClose: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "DrawCardBoard", ExtendsClass: DrawCardBoard },
        { ResName: "ButtonTab", ExtendsClass: DrawCardTab }
    ];

    InitData() {
        this.viewNode.BtnClose.onClick(this.closeView, this);
    }

    InitUI() {
    }

    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.bg.SetIcon("loader/ui_bg/DrawCardBg", () => {
            waitHandle.complete = true;
            this.refreshBgSize(this.viewNode.bg)
        })
    }
}

class DrawCardBoard extends CommonBoard1 {
    protected viewNode: any = {
        fullscreen: <fgui.GComponent>null,
        TabList: <fgui.GList>null,
        bg: <fgui.GImage>null,
    };
    private screenShowSize: Vec2;
    protected onConstruct() {
        super.onConstruct();
        this.screenShowSize = ViewManager.Inst().GetShowScreenSize();
        let fullscreen = this.viewNode.fullscreen;
        if (fullscreen) {
            fullscreen.setSize(this.screenShowSize.x, this.screenShowSize.y);
            fullscreen.center();
        }
    }
    protected FlushView() {
        this.viewNode.bg.visible = this.viewNode.TabList.selectedIndex != 0
    }
}

class DrawCardTab extends CommonBoardTab1 {
    protected viewNode: any = {
        TitleUp: <fgui.GTextField>null,
        TitleDown: <fgui.GTextField>null,
        icon: <fgui.GLoader>null,
        RedPointShow: <RedPoint>null,
    };

    public SetData(info: tabberInfo) {
        super.SetData(info)
        UH.SpriteName(this.viewNode.icon, "DrawCard", info.param)
    }
}
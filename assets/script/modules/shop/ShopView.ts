
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { CommonId } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { CommonBoard1, CommonBoardTab1 } from 'modules/common_board/CommonBoard1';
import { CurrencyShow, ExpShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { ShopViewMainPanel } from './ShopViewMainPanel';
import { ShopViewSalePanel } from './ShopViewSalePanel';

@BaseView.registView
export class ShopView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Shop",
        ViewName: "ShopView",
        LayerType: ViewLayer.ButtomMain,
        ViewCache: true
    };

    protected boardCfg = {
        TabberCfg: [
            { panel: ShopViewMainPanel, viewName: "ShopViewMainPanel", titleName: Language.Shop.Tab1 },
            // FIX:lip 屏蔽按钮
            // { panel: ShopViewSalePanel, viewName: "ShopViewSalePanel", titleName: Language.Shop.Tab2 },
        ]
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,

        bg: <EGLoader>null,

        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,
    };

    protected extendsCfg = [
        { ResName: "ShopBoard", ExtendsClass: BoardShop },
        { ResName: "ButtonTab", ExtendsClass: CommonBoardTab1 }
    ];

    WindowSizeChange() {

    }

    DoOpenWaitHandle() {

    }

    InitData() {
        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.Energy);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        this.viewNode.Currency2.BtnAddShow(true);

    }

    InitUI() {
    }


    OpenCallBack() {
        this.viewNode.bg.setSize(this["screenShowSize"].x, this["screenShowSize"].y);
    }

    CloseCallBack() {
    }
}

export class BoardShop extends CommonBoard1 {
    protected viewNode: any = {
        TabList: <fgui.GList>null,
    };

}

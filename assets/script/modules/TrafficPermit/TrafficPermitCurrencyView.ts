import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { MainData } from "modules/main/MainData";
import { ShopView } from "modules/shop/ShopView";
import { TrafficPermitView } from "./TrafficPermitView";

@BaseView.registView
export class TrafficPermitCurrencyView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "TrafficPermitCurrency",
        ViewName: "TrafficPermitCurrencyView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        BtnShop: <fgui.GButton>null,
    };

    InitData() {
        this.viewNode.Board.SetData(new BoardData(TrafficPermitCurrencyView));
        this.viewNode.BtnShop.onClick(this.onCickOpenShop, this);
    }

    onCickOpenShop() {
        ViewManager.Inst().ShowSkip();
        ViewManager.Inst().OpenView(ShopView);
        MainData.Inst().FlushSkip(1)
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}
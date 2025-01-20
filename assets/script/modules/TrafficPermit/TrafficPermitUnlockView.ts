import { TrafficPermitCtrl } from 'modules/TrafficPermit/TrafficPermitCtrl';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { TrafficPermitData } from "./TrafficPermitData";
import { ViewManager } from 'manager/ViewManager';
import { BagData } from 'modules/bag/BagData';
import { CommonId } from 'modules/common/CommonEnum';
import { TrafficPermitCurrencyView } from './TrafficPermitCurrencyView';

@BaseView.registView
export class TrafficPermitUnlockView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "TrafficPermitUnlock",
        ViewName: "TrafficPermitUnlockView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        BtnBuy: <fgui.GButton>null,
    };
    unlock_item: any;
    callback: any;
    InitData(param: { item: any, callback: Function }) {
        this.unlock_item = param.item
        this.callback = param.callback
        this.viewNode.Board.SetData(new BoardData(TrafficPermitUnlockView));
        // let other = TrafficPermitData.Inst().GetPassBuy();
        this.viewNode.BtnBuy.title = this.unlock_item.num + "";
        this.viewNode.BtnBuy.icon = fgui.UIPackage.getItemURL("CommonCurrency", `Small${this.unlock_item.item_id}`);
        this.viewNode.BtnBuy.onClick(this.OnBuyLevel, this);
    }

    InitUI() {
    }

    OnBuyLevel() {
        // let other = TrafficPermitData.Inst().GetPassBuy();
        let num = BagData.Inst().GetItemNum(this.unlock_item.item_id);
        if (num < this.unlock_item.num) {
            ViewManager.Inst().OpenView(TrafficPermitCurrencyView)
        } else {
            this.callback && this.callback()
            // TrafficPermitCtrl.Inst().SendBuyLevel();
        }
        ViewManager.Inst().CloseView(TrafficPermitUnlockView)
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}
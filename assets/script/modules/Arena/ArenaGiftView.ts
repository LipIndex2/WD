import * as fgui from "fairygui-cc";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { Mod } from "modules/common/ModuleDefine";
import { ItemCell } from "modules/extends/ItemCell";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { UH } from "../../helpers/UIHelper";
import { ArenaData } from "./ArenaData";
import { AudioTag } from "modules/audio/AudioManager";

@BaseView.registView
export class ArenaGiftView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ArenaGift",
        ViewName: "ArenaGiftView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
        ViewMask: ViewMask.BgBlock,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,

        BtnClose: <fgui.GButton>null,
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "GiftCell", ExtendsClass: GiftCell }
    ];

    private listData: any[] = [];

    InitData() {
        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.AddSmartDataCare(ArenaData.Inst().smdData, this.FlushView.bind(this), "dailyGift");
        this.FlushView();
    }

    FlushView() {
        let gift = ArenaData.Inst().GetDailyGiftCfg();
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = gift;
        this.viewNode.ShowList.numItems = gift.length;
    }

    private itemRenderer(index: number, item: GiftCell) {
        item.SetData(this.listData[index]);
    }
}

class GiftCell extends BaseItem {
    protected viewNode = {
        Count: <fgui.GTextField>null,
        ShowList: <fgui.GList>null,
        BtnBuy: <fgui.GButton>null,
    };
    protected onConstruct() {
        super.onConstruct()
        this.viewNode.ShowList.setVirtual();
        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.BtnBuy.onClick(this.onClickBuy, this);
    }
    _key_check_buy: string;
    public SetData(data: any) {
        super.SetData(data)
        let num = ArenaData.Inst().GetDailyGiftBuyCount(data.seq);
        let count = data.limit_num - num
        UH.SetText(this.viewNode.Count, Language.Arena.GiftBuy + count);
        this.viewNode.ShowList.numItems = data.item.length
        this._key_check_buy = Mod.ArenaGift.View + "_" + data.seq
        this.viewNode.BtnBuy.enabled = count > 0;
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, OrderCtrl.PrefixByGold(data.price), () => {
            let num = ArenaData.Inst().GetDailyGiftBuyCount(data.seq);
            let count = data.limit_num - num
            return count == 0
        });
    }
    private renderListItem(index: number, item: ItemCell) {
        const data = this.GetData();
        item.SetData(Item.Create(data.item[index], { is_num: true }));
    }

    onClickBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let data = this.GetData()
        let num = ArenaData.Inst().GetDailyGiftBuyCount(data.seq);
        if (data.limit_num - num <= 0) {
            return
        }
        let other = ArenaData.Inst().GetDailyGiftOtherCfg()
        let order_data = Order_Data.initOrder(data.seq, ACTIVITY_TYPE.ArenaGift, data.price, data.price, other.name);
        OrderCtrl.generateOrder(order_data);
    }
}
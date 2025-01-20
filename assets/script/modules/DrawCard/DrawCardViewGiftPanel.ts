import { Mod } from 'modules/common/ModuleDefine';
import { Language } from 'modules/common/Language';
import * as fgui from "fairygui-cc";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { BaseItem } from "modules/common/BaseItem";
import { BasePanel } from "modules/common/BasePanel";
import { TimeMeter, TimeFormatType } from "modules/extends/TimeMeter";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { DrawCardData } from "./DrawCardData";
import { ItemCell } from "modules/extends/ItemCell";
import { Item } from "modules/bag/ItemData";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { UH } from '../../helpers/UIHelper';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { CommonId } from 'modules/common/CommonEnum';
import { CurrencyShow } from 'modules/extends/Currency';

export class DrawCardViewGiftPanel extends BasePanel {
    protected viewNode = {
        ShowList: <fgui.GList>null,
        timer: <TimeMeter>null,

        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        // Currency3: <CurrencyShow>null,
    };

    protected extendsCfg = [
        { ResName: "GiftCell", ExtendsClass: GiftCell }
    ];
    listData: any[];

    InitPanelData() {
        this.AddSmartDataCare(DrawCardData.Inst().FlushData, this.FlushView.bind(this), "FlushInfo");
        this.viewNode.ShowList.setVirtual();

        const otherCfg = DrawCardData.Inst().GetOtherCfg();
        this.viewNode.Currency1.SetCurrency(CommonId.Diamond);
        this.viewNode.Currency2.SetCurrency(otherCfg.extract_item2[0].item_id, true);
        // this.viewNode.Currency3.SetCurrency(otherCfg.ten_extract_item2[0].item_id, true);

        this.FlushView();
        this.FlushTime();
    }

    FlushView() {
        let gift = DrawCardData.Inst().GetGiftCfg();
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = gift;
        this.viewNode.ShowList.numItems = gift.length;
    }

    private itemRenderer(index: number, item: GiftCell) {
        item.SetData(this.listData[index]);
    }

    private FlushTime() {
        let time = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DrawCard) - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
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
        let num = DrawCardData.Inst().GetGiftBuyCount(data.seq);
        let count = data.limit_num - num
        UH.SetText(this.viewNode.Count, Language.DrawCard.GiftBuy + count);
        this.viewNode.ShowList.numItems = data.item.length
        this._key_check_buy = Mod.DrawCard.View + "_" + data.seq
        this.viewNode.BtnBuy.enabled = count > 0;
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, OrderCtrl.PrefixByGold(data.price), () => {
            let num = DrawCardData.Inst().GetGiftBuyCount(data.seq);
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
        let data = this.GetData();
        if (Item.IsGeneBagMax(data.item)) return
        let num = DrawCardData.Inst().GetGiftBuyCount(data.seq);
        if (data.limit_num - num <= 0) {
            return
        }
        const stampCfg = DrawCardData.Inst().GetTimeStamp();
        let order_data = Order_Data.initOrder(data.seq, ACTIVITY_TYPE.DrawCard, data.price, data.price, stampCfg.activity_name);
        OrderCtrl.generateOrder(order_data);
    }
}
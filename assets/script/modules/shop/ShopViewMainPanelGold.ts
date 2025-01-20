
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseItemCare, BaseItemGB } from "modules/common/BaseItem";
import { AdType } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { RedPoint } from "modules/extends/RedPoint";
import { DialogTipsView } from "modules/public_popup/DialogTipsView";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { TextHelper } from "../../helpers/TextHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { ShopCtrl } from "./ShopCtrl";
import { ShopData } from "./ShopData";

export class ShopViewMainPanelGold extends BaseItemCare {
    private showList: any[]
    private hasAd: boolean

    protected viewNode = {
        ShowList: <fgui.GList>null,
    };


    InitData() {
        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);

        this.AddSmartDataCare(ShopData.Inst().FlushData, this.FlushShopInfo.bind(this), "FlushShopInfo");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushShopInfo.bind(this), "FlushAdInfo");
    }

    InitUI() {
        this.FlushShopInfo()
    }

    FlushShopInfo() {
        if (!ShopData.Inst().ShopInfo) {
            return
        }
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_gold)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.shop_gold)
        this.hasAd = this.hasAd = RoleData.Inst().IsCanAD(AdType.shop_gold, false) && (!info || info.todayCount < co.ad_param)
        let list: any = this.hasAd ? [0] : [];
        for (let element of ShopData.Inst().GetShopGoldShowList(0)) {
            list.push(element)
        }
        this.showList = list;
        this.viewNode.ShowList.numItems = list.length

        let row = Math.ceil(list.length / 3)
        this.height = 95 + 367 * row + (row - 1) * 15

        ShopData.Inst().FlushMainlList()
    }

    private renderListItem(index: number, item: ShopViewMainPanelGoldItem) {
        item.ItemIndex(this.hasAd ? index : (index + 1));
        item.SetData(this.showList[index]);
    }
}

export class ShopViewMainPanelGoldItem extends BaseItemGB {
    private itemIndex: number
    private timer_handle_ad: any = null;

    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        IconSp: <fgui.GLoader>null,
        BtnBuy: <fgui.GButton>null,
        redPoint: <RedPoint>null,
    };

    protected onConstruct() {
        super.onConstruct()
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
    }

    SetData(data: any) {
        super.SetData(data);

        Timer.Inst().CancelTimer(this.timer_handle_ad)

        if (0 == this.itemIndex) {
            let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_gold)
            let co = RoleData.Inst().CfgAdTypeSeq(AdType.shop_gold)
            UH.SetText(this.viewNode.NameShow, `${co.ad_award[0].num}`)
            this.viewNode.BtnBuy.icon = fgui.UIPackage.getItemURL("CommonAtlas", "GuangGao");

            if (info && info.nextFetchTime > TimeCtrl.Inst().ServerTime) {
                this.viewNode.redPoint.SetNum(0);
                this.viewNode.BtnBuy.grayed = true
                this.timer_handle_ad = Timer.Inst().AddCountDownCT(() => {
                    let ft = TimeHelper.FormatDHMS(info.nextFetchTime - TimeCtrl.Inst().ServerTime);
                    this.viewNode.BtnBuy.title = TextHelper.SizeStr(TextHelper.Format(Language.UiTimeMeter.TimeStr1, ft.hour, ft.minute, ft.second), 28)
                }, this.SetData.bind(this, data), info.nextFetchTime, 1)
            } else {
                let num = co.ad_param - (info ? info.todayCount : 0)
                this.viewNode.redPoint.SetNum(num);
                this.viewNode.BtnBuy.grayed = false
                this.viewNode.BtnBuy.title = `${Language.Shop.FreeShow}(${num})`
            }
        } else {
            this.viewNode.BtnBuy.grayed = false
            this.viewNode.redPoint.SetNum(0);
            UH.SetText(this.viewNode.NameShow, `${data.item_num}`)
            this.viewNode.BtnBuy.icon = fgui.UIPackage.getItemURL("CommonCurrency", `Big${data.exchange_item_id}`);
            this.viewNode.BtnBuy.title = `${data.exchange_item_num}`
        }
        UH.SpriteName(this.viewNode.IconSp, "Shop", `JinBi${this.itemIndex}`)
    }

    ItemIndex(index: number) {
        this.itemIndex = index;
    }

    OnClickBuy() {
        if (0 == this.itemIndex) {
            let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_gold)
            let co = RoleData.Inst().CfgAdTypeSeq(AdType.shop_gold)
            if (info) {
                if (info.todayCount >= co.ad_param) {
                    PublicPopupCtrl.Inst().Center(Language.Common.AdFreeTime);
                    return
                } else if (info.nextFetchTime > TimeCtrl.Inst().ServerTime) {
                    PublicPopupCtrl.Inst().Center(Language.Common.AdColdTime);
                    return
                }
            }
            ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.shop_gold), "");
        } else {
            ViewManager.Inst().OpenView(DialogTipsView, {
                content: TextHelper.Format(Language.Shop.ShopMainGold.BuyTips, this._data.exchange_item_num, Item.GetName(this._data.exchange_item_id), this._data.item_num, Item.GetName(this._data.item_id)), confirmFunc: () => {
                    if (BagData.Inst().IsItemEnough(this._data.exchange_item_id, this._data.exchange_item_num)) {
                        ShopCtrl.Inst().SendShopReqBuy(this._data.index, 1)
                    }
                }, confirmText: null, titleShow: null, cancelFunc: null, cancelText: null, btnShow: true
            })
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        Timer.Inst().CancelTimer(this.timer_handle_ad)
    }
}
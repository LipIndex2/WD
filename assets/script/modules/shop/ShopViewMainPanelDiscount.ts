
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemCare, BaseItemGB } from "modules/common/BaseItem";
import { AdType, CommonId } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { HeroItem } from "modules/extends/HeroCell";
import { RedPoint } from "modules/extends/RedPoint";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { HeroData } from "modules/hero/HeroData";
import { DialogTipsView } from "modules/public_popup/DialogTipsView";
import { RoleData } from "modules/role/RoleData";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { ShopBuyHeroView } from "./ShopBuyHeroView";
import { ShopCtrl } from "./ShopCtrl";
import { ShopData } from "./ShopData";

export class ShopViewMainPanelDiscount extends BaseItemCare {
    private showList: any[]
    private hasAd: boolean

    protected viewNode = {
        BtnTips: <fgui.GButton>null,
        BtnFlush: <ShopViewMainPanelDiscountFlushButton>null,

        ShowList: <fgui.GList>null,

        TimeShow: <TimeMeter>null,
    };

    protected onDestroy() {
        super.onDestroy()
        this.viewNode.TimeShow.CloseCountDownTime()
    }

    InitData() {
        this.viewNode.BtnTips.onClick(this.OnClickTips, this);
        this.viewNode.BtnFlush.onClick(this.OnClickFlush, this);

        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);

        this.AddSmartDataCare(ShopData.Inst().FlushData, this.FlushDailyBuyInfo.bind(this), "FlushDailyBuyInfo");
    }

    InitUI() {
        this.FlushDailyBuyInfo()
        this.FlushTimeShow()
    }

    FlushDailyBuyInfo() {
        if (!ShopData.Inst().DailyBuyInfo) {
            return
        }
        this.hasAd = RoleData.Inst().IsCanAD(AdType.shop_dicount, false)
        let list = ShopData.Inst().DailyBuyInfoItemList
        let isNan = true;
        list.forEach(element => {
            if (element.itemId != 0) {
                isNan = false;
            }
        });
        let show_list = []
        for (let [key, value] of list.entries()) {
            if (this.hasAd || 0 != key) {
                show_list.push(value)
            }
        }
        if (isNan) {
            ShopCtrl.Inst().SendDailyBuyReqInfo();
        }
        this.showList = show_list;
        this.viewNode.ShowList.numItems = show_list.length

        let refresh_times = ShopData.Inst().DailyBuyInfoDayRefreshTimes
        let can_fresh = refresh_times <= ShopData.Inst().CfgDailyBuyOtherDailyNum()
        this.viewNode.BtnFlush.FlushShow(refresh_times)
        this.viewNode.BtnFlush.touchable = can_fresh
        this.viewNode.BtnFlush.grayed = !can_fresh

        let row = Math.ceil(show_list.length / 3)
        this.height = 403 + 366 * row + (row - 1) * 25

        ShopData.Inst().FlushMainlList()
    }

    FlushTimeShow() {
        this.viewNode.TimeShow.CloseCountDownTime()
        if (TimeCtrl.Inst().tomorrowStarTime > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.StampTime(TimeCtrl.Inst().tomorrowStarTime, TimeFormatType.TYPE_TIME_0)
            this.viewNode.TimeShow.SetCallBack(this.FlushTimeShow.bind(this))
        }
        else {
            this.viewNode.TimeShow.SetTime("")
        }
    }

    private renderListItem(index: number, item: ShopViewMainPanelDiscountItem) {
        item.ItemIndex(this.hasAd ? index : (index + 1));
        item.SetData(this.showList[index]);
    }


    OnClickTips() {
        let cfg = SettingUsertServeData.Inst().GetWordDes(5);
        ViewManager.Inst().OpenView(DialogTipsView, { content: cfg.word, confirmFunc: null, confirmText: null, titleShow: cfg.name, cancelFunc: null, cancelText: null, btnShow: true })
        // PublicPopupCtrl.Inst().Center("打开每日特惠说明界面");
        // ViewManager.Inst().OpenView(SettingUsertServeView, 5)
    }

    OnClickFlush() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_dicount_flush)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.shop_dicount_flush)
        if (!info || info.todayCount < co.ad_param) {
            ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.shop_dicount_flush), "");
        } else {
            ShopCtrl.Inst().SendDailyBuyReqRefresh();
        }
    }
}

export class ShopViewMainPanelDiscountItem extends BaseItemGB {
    private itemIndex: number

    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        BtnBuy: <fgui.GButton>null,
        ItemShow: <ShopViewMainPanelDiscountHeroItem>null,
        IconShow: <fgui.GLoader>null,
        BuyShow: <fgui.GGroup>null,
        NumShow: <fgui.GTextField>null,
        ItemShowNum: <fgui.GTextField>null,
        redPoint: <RedPoint>null,
    };

    protected onConstruct() {
        super.onConstruct()
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
    }

    SetData(data: any) {
        super.SetData(data);
        if (0 == this.itemIndex) {
            // let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_dicount)
            this.viewNode.BtnBuy.icon = fgui.UIPackage.getItemURL("CommonAtlas", "GuangGao");
            this.viewNode.BtnBuy.title = Language.Shop.FreeShow
            this.viewNode.IconShow.icon = fgui.UIPackage.getItemURL("CommonCurrency", `Big${data.consumeId}`);
            UH.SpriteName(this.viewNode.IconShow, "Shop", CommonId.Diamond == data.itemId ? "ZuanShi0" : `JinBi0`)
            UH.SetText(this.viewNode.NumShow, `x${data.itemNum}`)
            this.viewNode.redPoint.SetNum(data.isBuy ? 0 : 1);
        } else {
            this.viewNode.redPoint.SetNum(0);
            this.viewNode.BtnBuy.icon = fgui.UIPackage.getItemURL("CommonCurrency", `Big${data.consumeId}`);
            this.viewNode.BtnBuy.title = `${data.consumeNum}`
            this.viewNode.ItemShow.SetData({ itemId: data.itemId, num: data.itemNum })
            UH.SetText(this.viewNode.NumShow, "")
            UH.SetText(this.viewNode.ItemShowNum, "x" + data.itemNum)
        }
        UH.SetText(this.viewNode.NameShow, Item.GetName(data.itemId))
        // this.viewNode.BtnBuy.touchable = !data.isBuy
        // this.viewNode.BtnBuy.grayed = data.isBuy
        this.viewNode.ItemShowNum.visible = 0 != this.itemIndex
        this.viewNode.ItemShow.visible = 0 != this.itemIndex
        this.viewNode.IconShow.visible = 0 == this.itemIndex

        this.viewNode.BuyShow.visible = data.isBuy
        this.viewNode.BtnBuy.visible = !data.isBuy

    }

    ItemIndex(index: number) {
        this.itemIndex = index;
    }

    OnClickBuy() {
        if (0 == this.itemIndex) {
            ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.shop_dicount), "");
        } else {
            ViewManager.Inst().OpenView(ShopBuyHeroView, { info: this._data, index: this.itemIndex })
        }
    }
}

export class ShopViewMainPanelDiscountHeroItem extends BaseItem {
    protected viewNode = {
        GpShow: <fgui.GGroup>null,
        HeroItem: <HeroItem>null,
        // Num: <fgui.GTextField>null,
    };

    SetData(data: { itemId: number, num: number }) {
        let id = HeroData.Inst().GetDebrisHeroId(data.itemId);
        this.viewNode.HeroItem.SetData(id);
        // UH.SetText(this.viewNode.Num, "x" + data.num)
    }
}

export class ShopViewMainPanelDiscountFlushButton extends BaseItemGB {
    protected viewNode = {
        title: <fgui.GTextField>null,
        icon: <fgui.GLoader>null,
    };
    FlushShow(refresh_times: number) {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_dicount_flush)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.shop_dicount_flush)
        if (RoleData.Inst().IsCanAD(AdType.shop_dicount_flush, false) && (!info || info.todayCount < co.ad_param)) {
            UH.SetText(this.viewNode.title, Language.Common.Refresh)
            UH.SpriteName(this.viewNode.icon, "CommonAtlas", "GuangGao");
        } else {
            UH.SetText(this.viewNode.title, `${ShopData.Inst().GetDailyBuyCost(refresh_times)}`)
            UH.SpriteName(this.viewNode.icon, "CommonCurrency", `Big${ShopData.Inst().CfgDailyBuyOtherReItem()}`);
        }
    }
}


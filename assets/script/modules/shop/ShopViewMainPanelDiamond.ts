
import * as fgui from "fairygui-cc";
import { BaseItemCare, BaseItemGB } from "modules/common/BaseItem";
import { AdType } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { RedPoint } from "modules/extends/RedPoint";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl } from "modules/recharge/OrderCtrl";
import { RechargeData } from "modules/recharge/RechargeData";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { TextHelper } from "../../helpers/TextHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { ShopData } from "./ShopData";
import { GMCmdCtrl } from "modules/gm_command/GMCmdCtrl";
import { RewardGetView } from "modules/reward_get/RewardGetView";
import { ViewManager } from "manager/ViewManager";
import { DBDNet } from "../../DBDataManager/DBDNet";
import { ActivityCombatData } from "modules/ActivityCombat/ActivityCombatData";
import { LoginCtrl, RELANAME_CODE } from "modules/login/LoginCtrl";

export class ShopViewMainPanelDiamond extends BaseItemCare {
    private showList: any[]
    private hasAd: boolean

    protected viewNode = {
        ShowList: <fgui.GList>null,
    };

    InitData(): void {
        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);

        this.AddSmartDataCare(RechargeData.Inst().ResultData, this.FlushRechargeList.bind(this), "is_change");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushRechargeList.bind(this), "FlushAdInfo");
    }

    InitUI(): void {
        this.FlushRechargeList()
    }

    FlushRechargeList() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_diamond)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.shop_diamond)
        this.hasAd = RoleData.Inst().IsCanAD(AdType.shop_diamond, false) && (!info || info.todayCount < co.ad_param)
        let list: any = this.hasAd ? [0] : [];
        for (let element of RechargeData.Inst().GetChargeInfoList()) {
            list.push(element)
        }
        this.showList = list;
        this.viewNode.ShowList.numItems = list.length

        let row = Math.ceil(list.length / 3)
        this.height = 95 + 379 * row + (row - 1) * 15

        ShopData.Inst().FlushMainlList()
    }

    private renderListItem(index: number, item: ShopViewMainPanelDiamondItem) {
        item.ItemIndex(this.hasAd ? index : (index + 1));
        item.SetData(this.showList[index]);
    }
}

export class ShopViewMainPanelDiamondItem extends BaseItemGB {
    private itemIndex: number
    private timer_handle_ad: any = null;

    protected viewNode = {
        GpExtra: <fgui.GGroup>null,

        BtnAd: <fgui.GButton>null,
        ValShow: <fgui.GTextField>null,

        BtnBuy: <fgui.GButton>null,
        TimesShow: <fgui.GTextField>null,
        NumShow: <fgui.GTextField>null,
        IconSp: <fgui.GLoader>null,
        redPoint: <RedPoint>null,
    };

    protected onConstruct() {
        super.onConstruct()
        this.viewNode.BtnAd.onClick(this.OnClickAd, this);
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
    }
    private _key_check_buy: string;
    SetData(data: any) {
        super.SetData(data);

        Timer.Inst().CancelTimer(this.timer_handle_ad)

        let is_ad = 0 == this.itemIndex
        if (is_ad) {
            let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_diamond)
            let co = RoleData.Inst().CfgAdTypeSeq(AdType.shop_diamond)
            UH.SetText(this.viewNode.ValShow, `+${co.ad_award[0].num}`)
            this.viewNode.BtnAd.icon = fgui.UIPackage.getItemURL("CommonAtlas", "GuangGao");
            this.viewNode.GpExtra.visible = false
            if (info && info.nextFetchTime > TimeCtrl.Inst().ServerTime) {
                this.viewNode.redPoint.SetNum(0);
                this.viewNode.BtnAd.grayed = true
                this.timer_handle_ad = Timer.Inst().AddCountDownCT(() => {
                    let ft = TimeHelper.FormatDHMS(info.nextFetchTime - TimeCtrl.Inst().ServerTime);
                    this.viewNode.BtnAd.title = TextHelper.SizeStr(TextHelper.Format(Language.UiTimeMeter.TimeStr1, ft.hour, ft.minute, ft.second), 28)
                }, this.SetData.bind(this, data), info.nextFetchTime, 1)
            } else {
                let num = co.ad_param - (info ? info.todayCount : 0)
                this.viewNode.redPoint.SetNum(num);
                this.viewNode.BtnAd.grayed = false
                this.viewNode.BtnAd.title = `${Language.Shop.FreeShow}(${num})`
            }
        } else {
            this.viewNode.redPoint.SetNum(0);
            let co = RechargeData.Inst().CfgRechargeReward0(data.info.seq)
            let extra = Math.max(co.reward_times - data.recharge_times, 0)
            UH.SetText(this.viewNode.NumShow, `+${data.info.addGold + data.info.extraReward}`)
            UH.SetText(this.viewNode.TimesShow, TextHelper.Format(Language.Shop.ShopMainDiamond.TimesShow, extra))
            UH.SetText(this.viewNode.ValShow, "")
            this.viewNode.BtnBuy.title = `${Language.Recharge.GoldType[0]}${data.info.moneyShow / 100}`
            this.viewNode.GpExtra.visible = true
            this._key_check_buy = Mod.Shop.View + "-" + data.info.seq
            // OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy);
        }
        UH.SpriteName(this.viewNode.IconSp, "Shop", `ZuanShi${this.itemIndex}`)

        this.viewNode.BtnAd.visible = is_ad
        this.viewNode.BtnBuy.visible = !is_ad

    }

    ItemIndex(index: number) {
        this.itemIndex = index;
    }

    OnClickAd() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_diamond)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.shop_diamond)
        if (info) {
            if (info.todayCount >= co.ad_param) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdFreeTime);
                return
            } else if (info.nextFetchTime > TimeCtrl.Inst().ServerTime) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdColdTime);
                return
            }
        }
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.shop_diamond), "");
    }

    OnClickBuy() {
        // if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
        //     PublicPopupCtrl.Inst().Center(Language.Common.payWait)
        //     return
        // }
        // RechargeData.Inst().DoRecharge(this._data);
        const money = this._data.info.moneyShow / 100;
        if (LoginCtrl.Inst().realName(RELANAME_CODE.PAY_DAY, { money: money })) {
            return;
        }

        if (LoginCtrl.Inst().realName(RELANAME_CODE.PAY_MONTH, { money: money })) {
            return;
        }

        // 直接到账
        let num = this._data.info.addGold + this._data.info.extraReward;
        GMCmdCtrl.Inst().SendGMCommand("additem", "40001 " + num);
        ViewManager.Inst().OpenView(RewardGetView, { reward_data: [{ itemId: 40001, num: num }], call_back: null });
        ShopData.Inst().payMoneyInfo.day += money;
        ShopData.Inst().payMoneyInfo.month += money;

        // 计算一下记录的时间
        let payMoneyInfo = ShopData.Inst().payMoneyInfo;
        const curTime = TimeCtrl.Inst().ServerTime * 1000;
        if (!TimeHelper.isSameDay(payMoneyInfo.dayTime, curTime)) {
            payMoneyInfo.day = 0;
            payMoneyInfo.dayTime = curTime;
        }

        // 不是同一个月
        if (!TimeHelper.isSameMonth(payMoneyInfo.monthTime, curTime)) {
            payMoneyInfo.month = 0;
            payMoneyInfo.monthTime = curTime;
        }

        let shop_box_info = { time: curTime, openBoxTimes: ShopData.Inst().boxOpenTimes };
        DBDNet.Inst().setSignature({ uid: RoleData.Inst().InfoRoleInfo.roleId, zombie_info: ActivityCombatData.Inst().ResultData.ZombieInfo, shop_box_info: shop_box_info, payMoneyInfo: payMoneyInfo }, () => {
            ShopData.Inst().payMoneyInfo = payMoneyInfo;
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        Timer.Inst().CancelTimer(this.timer_handle_ad)
    }
}
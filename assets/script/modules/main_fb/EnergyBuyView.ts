
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItemCare } from 'modules/common/BaseItem';
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { AdType } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { MainFBCtrl } from "modules/main_fb/MainFBCtrl";
import { MainFBData } from 'modules/main_fb/MainFBData';
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { TextHelper } from "../../helpers/TextHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent, GameToChannel } from "../../proload/ChannelAgent";

@BaseView.registView
export class EnergyBuyView extends BaseView {
    protected viewRegcfg = {
        UIPackName: "EnergyBuy",
        ViewName: "EnergyBuyView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        ItemFree: <EnergyBuyViewFreeItem>null,
        ItemBuy: <EnergyBuyViewBuyItem>null,
    };

    protected extendsCfg = [
        { ResName: "ItemBuy", ExtendsClass: EnergyBuyViewBuyItem },
        { ResName: "ItemFree", ExtendsClass: EnergyBuyViewFreeItem }
    ];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(EnergyBuyView));
        if(!RoleData.Inst().IsCanAD(AdType.energy_buy)){
            this.viewNode.ItemFree.visible = false
            this.viewNode.ItemBuy.x = 239
        }
    }

    public Close(): void {
        super.Close();
        this.viewNode.ItemFree.onClose();
    }
}

export class EnergyBuyViewBuyItem extends BaseItemCare {
    protected viewNode = {
        NumShow: <fgui.GTextField>null,
        TimesShow: <fgui.GTextField>null,
        BtnBuy: <fgui.GButton>null,
    };

    InitData() {
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);

        this.AddSmartDataCare(MainFBData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo");
    }

    InitUI() {
        this.FlushInfo()
    }

    FlushInfo() {
        let count = MainFBData.Inst().CfgPlayerLevelOtherTime() - MainFBData.Inst().InfoEnergyBuyCount
        UH.SetText(this.viewNode.NumShow, `x${MainFBData.Inst().CfgPlayerLevelOtherGetPowerNum()}`)
        UH.SetText(this.viewNode.TimesShow, TextHelper.Format(Language.MainFB.EnergyBuy.TimesShow, count))
        this.viewNode.BtnBuy.icon = fgui.UIPackage.getItemURL("CommonCurrency", `Big${MainFBData.Inst().CfgPlayerLevelOtherPowerBuyItem()}`);
        this.viewNode.BtnBuy.title = `x ${MainFBData.Inst().CfgPlayerLevelOtherPowerBuyItemNum() + MainFBData.Inst().InfoEnergyBuyCount * MainFBData.Inst().CfgPlayerLevelOtherUp()}`
        this.viewNode.BtnBuy.grayed = 0 == count
    }

    OnClickBuy() {
        MainFBCtrl.Inst().SendMainFBOperEnergyBuy()
    }

    onDestroy(){
        super.onDestroy();
    }
}

export class EnergyBuyViewFreeItem extends BaseItemCare {
    private timer_handle_ad: any = null;

    protected viewNode = {
        NumShow: <fgui.GTextField>null,
        TimesShow: <fgui.GTextField>null,
        BtnAd: <fgui.GButton>null,
    };

    InitData() {
        this.viewNode.BtnAd.onClick(this.OnClickAd, this);

        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushInfo.bind(this), "FlushAdInfo");
    }

    InitUI() {
        this.FlushInfo()
    }

    FlushInfo() {
        Timer.Inst().CancelTimer(this.timer_handle_ad)

        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.energy_buy)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.energy_buy)
        let count = co.ad_param - (info ? info.todayCount : 0)
        UH.SetText(this.viewNode.NumShow, `x${co.ad_award[0].num}`)
        UH.SetText(this.viewNode.TimesShow, TextHelper.Format(Language.MainFB.EnergyBuy.TimesShow, count))
        this.viewNode.BtnAd.icon = fgui.UIPackage.getItemURL("CommonAtlas", "DaGuangGao");

        if (info && (info.nextFetchTime > TimeCtrl.Inst().ServerTime) && (info.todayCount < co.ad_param)) {
            this.viewNode.BtnAd.grayed = true
            this.timer_handle_ad = Timer.Inst().AddCountDownCT(() => {
                let ft = TimeHelper.FormatDHMS(info.nextFetchTime - TimeCtrl.Inst().ServerTime);
                this.viewNode.BtnAd.title = TextHelper.SizeStr(TextHelper.Format(Language.UiTimeMeter.TimeStr1, ft.hour, ft.minute, ft.second), 36)
            }, this.FlushInfo.bind(this), info.nextFetchTime, 1)
        } else {
            this.viewNode.BtnAd.title = Language.Shop.FreeShow
            this.viewNode.BtnAd.grayed = 0 == count
        }
    }

    OnClickAd() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.energy_buy)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.energy_buy)
        if (info) {
            if (info.todayCount >= co.ad_param) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdFreeTime);
                return
            } else if (info.nextFetchTime > TimeCtrl.Inst().ServerTime) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdColdTime);
                return
            }
        }
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.energy_buy), "");
    }

    protected onDestroy(): void {
        super.onDestroy();
        Timer.Inst().CancelTimer(this.timer_handle_ad)
    }

    onClose(){
        this.onDestroy();
    }
}

import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { AdType } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { TextHelper } from "../../helpers/TextHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { TerritoryCtrl } from "./TerritoryCtrl";
import { TerritoryData } from "./TerritoryData";

@BaseView.registView
export class TerritoryRefreshView extends BaseView {
    private timer_handle_ad: any = null;

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "TerritoryRefresh",
        ViewName: "TerritoryRefreshView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        TimesShow: <fgui.GButton>null,
        BtnAd: <TerritoryRefreshViewBlueButton>null,
        BtnFresh: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "ButtonBlue", ExtendsClass: TerritoryRefreshViewBlueButton },
    ];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(TerritoryRefreshView));

        this.viewNode.BtnAd.onClick(this.OnClickAd, this);
        this.viewNode.BtnFresh.onClick(this.OnClickRefresh, this);

        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushInfo.bind(this), "FlushAdInfo");
    }


    InitUI() {
        this.FlushShow()
        this.FlushInfo()
    }

    CloseCallBack() {
        Timer.Inst().CancelTimer(this.timer_handle_ad)
    }

    FlushShow() {
        this.viewNode.BtnFresh.icon = fgui.UIPackage.getItemURL("CommonCurrency", `Big${TerritoryData.Inst().CfgOtherReItem}`);
        this.viewNode.BtnFresh.title = TextHelper.Format(Language.Territory.Refresh.CostShow, TerritoryData.Inst().CfgOtherReItemNum)

        let ica = RoleData.Inst().IsCanAD(AdType.territory_flush, false)
        this.viewNode.BtnAd.visible = ica
        if (!ica) {
            this.viewNode.BtnFresh.x = 252
        }
    }

    FlushInfo() {
        Timer.Inst().CancelTimer(this.timer_handle_ad)

        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.territory_flush)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.territory_flush)
        let count = co.ad_param - (info ? info.todayCount : 0)
        this.viewNode.BtnAd.SetNum(count)
        this.viewNode.BtnAd.icon = fgui.UIPackage.getItemURL("CommonAtlas", "DaGuangGao");

        if (info && (info.nextFetchTime > TimeCtrl.Inst().ServerTime) && (info.todayCount < co.ad_param)) {
            this.viewNode.BtnAd.grayed = true
            this.timer_handle_ad = Timer.Inst().AddCountDownCT(() => {
                let ft = TimeHelper.FormatDHMS(info.nextFetchTime - TimeCtrl.Inst().ServerTime);
                this.viewNode.BtnAd.SetName(TextHelper.SizeStr(TextHelper.Format(Language.UiTimeMeter.TimeStr1, ft.hour, ft.minute, ft.second), 36))
            }, this.FlushInfo.bind(this), info.nextFetchTime, 1)
        } else {
            this.viewNode.BtnAd.SetName(Language.Shop.FreeShow)
            this.viewNode.BtnAd.grayed = 0 == count
        }
    }

    OnClickAd() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.territory_flush)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.territory_flush)
        if (info) {
            if (info.todayCount >= co.ad_param) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdFreeTime);
                return
            } else if (info.nextFetchTime > TimeCtrl.Inst().ServerTime) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdColdTime);
                return
            }
        }
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.territory_flush), "");
        ViewManager.Inst().CloseView(TerritoryRefreshView)
    }

    OnClickRefresh() {
        if (BagData.Inst().GetItemNum(TerritoryData.Inst().CfgOtherReItem) >= TerritoryData.Inst().CfgOtherReItemNum) {
            ViewManager.Inst().CloseView(TerritoryRefreshView)
            TerritoryCtrl.Inst().SendTerritoryReqRefreshItem()
        } else {
            PublicPopupCtrl.Inst().ItemNotEnoughNotice(TerritoryData.Inst().CfgOtherReItem)
        }
    }
}

class TerritoryRefreshViewBlueButton extends BaseItemGB {
    protected viewNode = {
        NameShow: <fgui.GRichTextField>null,
        NumShow: <fgui.GRichTextField>null,
    };

    public SetName(name: string) {
        UH.SetText(this.viewNode.NameShow, name)
    }

    public SetNum(num: number) {
        UH.SetText(this.viewNode.NumShow, num)
    }
}
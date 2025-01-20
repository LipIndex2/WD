
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { AdType } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { TextHelper } from "../../helpers/TextHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";

@BaseView.registView
export class FishBreadView extends BaseView {
    private timer_handle_ad: any = null;

    protected viewRegcfg = {
        UIPackName: "FishBread",
        ViewName: "FishBreadView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnAd: <fgui.GButton>null,

        TimesShow: <fgui.GTextField>null,
        CellShow: <ItemCell>null,
    };


    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishBreadView));

        this.viewNode.BtnAd.onClick(this.OnClickAd, this);

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
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.fish_bread)
        this.viewNode.CellShow.SetData(Item.Create(co.ad_award[0], { is_num: true }))
    }

    FlushInfo() {
        Timer.Inst().CancelTimer(this.timer_handle_ad)

        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.fish_bread)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.fish_bread)
        let count = co.ad_param - (info ? info.todayCount : 0)
        UH.SetText(this.viewNode.TimesShow, TextHelper.Format(Language.Fish.Bread.TimesShow, count))
        this.viewNode.BtnAd.icon = fgui.UIPackage.getItemURL("CommonAtlas", "DaGuangGao");

        if (info && (info.nextFetchTime > TimeCtrl.Inst().ServerTime) && (info.todayCount < co.ad_param)) {
            this.viewNode.BtnAd.grayed = true
            this.timer_handle_ad = Timer.Inst().AddCountDownCT(() => {
                let ft = TimeHelper.FormatDHMS(info.nextFetchTime - TimeCtrl.Inst().ServerTime);
                this.viewNode.BtnAd.title = TextHelper.SizeStr(TextHelper.Format(Language.UiTimeMeter.TimeStr1, ft.hour, ft.minute, ft.second), 36)
            }, this.FlushInfo.bind(this), info.nextFetchTime, 1)
        } else {
            this.viewNode.BtnAd.title = Language.Fish.Bread.FreeShow
            this.viewNode.BtnAd.grayed = 0 == count
        }
    }

    OnClickAd() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.fish_bread)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.fish_bread)
        if (info) {
            if (info.todayCount >= co.ad_param) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdFreeTime);
                return
            } else if (info.nextFetchTime > TimeCtrl.Inst().ServerTime) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdColdTime);
                return
            }
        }
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.fish_bread), "");
    }
}

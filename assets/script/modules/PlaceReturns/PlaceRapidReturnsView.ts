import { CfgItem } from "config/CfgCommon";
import { CfgGetPrice } from "config/CfgRapidReturns";
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { AdType, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { ItemCell } from "modules/extends/ItemCell";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { TextHelper } from "../../helpers/TextHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent, GameToChannel } from "../../proload/ChannelAgent";
import { PlaceReturnsCtrl, PlaceReturnsType } from "./PlaceReturnsCtrl";
import { PlaceReturnsData } from "./PlaceReturnsData";

@BaseView.registView
export class PlaceRapidReturnsView extends BaseView {
    private timer_handle_ad: any = null;

    protected viewRegcfg = {
        UIPackName: "PlaceRapidReturns",
        ViewName: "PlaceRapidReturnsView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    private show_data: any[];
    private show_items: CfgItem[]

    protected viewNode = {
        Board: <CommonBoard2>null,
        List: <fgui.GList>null,
        // Num1: <fgui.GTextField>null,
        // Num2: <fgui.GTextField>null,
        BtnFree: <PlaceRapidFreeButton>null,
        BtnExpend: <PlaceRapidExpendButton>null,
    };

    protected extendsCfg = [
        { ResName: "BtnExpend", ExtendsClass: PlaceRapidExpendButton },
        { ResName: "BtnFree", ExtendsClass: PlaceRapidFreeButton },
    ];

    InitData() {
        this.AddSmartDataCare(PlaceReturnsData.Inst().ResultData, this.FulshData.bind(this), "RapidInfoFlush");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushAdShow.bind(this), "FlushAdInfo");
        PlaceReturnsCtrl.Inst().SendPlacePrizeInfo(PlaceReturnsType.FETCH_QUICK_INFO);
        this.viewNode.Board.SetData(new BoardData(PlaceRapidReturnsView));

        this.viewNode.BtnFree.onClick(this.OnClickAd, this);
        this.viewNode.BtnExpend.onClick(this.OnClickGetPrize, this);

        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.setVirtual();

        this.FlushAdShow();
        this.FulshData();
    }

    FulshData() {
        this.show_items = PlaceReturnsData.Inst().GetPrizeList(1);
        this.show_data = Item.DefaultCreateListItem(this.show_items);
        this.viewNode.List.numItems = this.show_data.length;

        let cfg = PlaceReturnsData.Inst().GetRapidReturnsConsume();
        this.viewNode.BtnExpend.SetData(cfg);
    }

    FlushAdShow() {
        Timer.Inst().CancelTimer(this.timer_handle_ad)

        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.quick_get)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.quick_get)
        // UH.SetText(this.viewNode.Num1, co.ad_param - ((info && info.todayCount) || 0));
        this.viewNode.BtnFree.title = co.ad_param - ((info && info.todayCount) || 0) + "";
        // this.viewNode.BtnFree.grayed = !(RoleData.Inst().InfoRoleLevel >= +co.level && (!info || (co.ad_param > info.todayCount)));

        if (info && (info.nextFetchTime > TimeCtrl.Inst().ServerTime) && (info.todayCount < co.ad_param)) {
            this.viewNode.BtnFree.grayed = true
            this.timer_handle_ad = Timer.Inst().AddCountDownCT(() => {
                let ft = TimeHelper.FormatDHMS(info.nextFetchTime - TimeCtrl.Inst().ServerTime);
                this.viewNode.BtnFree.SetName(TextHelper.SizeStr(TextHelper.Format(Language.UiTimeMeter.TimeStr1, ft.hour, ft.minute, ft.second), 36))
            }, this.FlushAdShow.bind(this), info.nextFetchTime, 1)
        } else {
            this.viewNode.BtnFree.SetName(Language.Shop.FreeShow)
            this.viewNode.BtnFree.grayed = !(RoleData.Inst().InfoRoleLevel >= +co.level && (!info || (co.ad_param > info.todayCount)));
        }
        if(!RoleData.Inst().IsCanAD(AdType.quick_get)){
            this.viewNode.BtnFree.visible = false
            this.viewNode.BtnExpend.x = 252
        }
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(this.show_data[index]);
    }

    private OnClickAd() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.quick_get)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.quick_get)
        if (info) {
            if (info.todayCount >= co.ad_param) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdFreeTime);
                return
            } else if (info.nextFetchTime > TimeCtrl.Inst().ServerTime) {
                PublicPopupCtrl.Inst().Center(Language.Common.AdColdTime);
                return
            }
        }
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.quick_get), "");
    }

    OnClickGetPrize() {
        PlaceReturnsCtrl.Inst().SendPlacePrizeInfo(PlaceReturnsType.FETCH_QUICK);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        Timer.Inst().CancelTimer(this.timer_handle_ad)
    }
}

class PlaceRapidExpendButton extends BaseItemGB {
    protected viewNode = {
        title: <fgui.GTextField>null,
        price: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
    };
    public SetData(data: CfgGetPrice) {
        let num = PlaceReturnsData.Inst().GetRapidReturnsNum();
        let maxNum = PlaceReturnsData.Inst().GetRapidReturnsMaxNum();
        this.grayed = maxNum == num;
        UH.SetText(this.viewNode.title, maxNum - num);
        UH.SetText(this.viewNode.price, "x" + data.get_price);
        UH.SetIcon(this.viewNode.Icon, data.get_item, ICON_TYPE.ITEM);
    }
}

class PlaceRapidFreeButton extends BaseItemGB {
    protected viewNode = {
        NameShow: <fgui.GRichTextField>null,
    };
    public SetName(name_show: string) {
        UH.SetText(this.viewNode.NameShow, name_show)
    }
}
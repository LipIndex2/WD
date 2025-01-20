import { CfgItem } from "config/CfgCommon";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { AdType } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { ItemCell } from "modules/extends/ItemCell";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { PlaceRapidReturnsView } from "./PlaceRapidReturnsView";
import { PlaceReturnsCtrl, PlaceReturnsType } from "./PlaceReturnsCtrl";
import { PlaceReturnsData } from "./PlaceReturnsData";

@BaseView.registView
export class PlaceReturnsView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "PlaceReturns",
        ViewName: "PlaceReturnsView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        BtnReturns: <fgui.GButton>null,
        BtnGetPrize: <fgui.GButton>null,
        Board: <CommonBoard2>null,
        AttrNum1: <fgui.GTextField>null,
        AttrNum2: <fgui.GTextField>null,
        TimeShow: <fgui.GTextField>null,
        List: <fgui.GList>null,
        timer: <TimeMeter>null,
    };

    private show_data: any[];
    private show_items: CfgItem[];
    private cache_timer: number = 0;

    InitData() {
        this.AddSmartDataCare(PlaceReturnsData.Inst().ResultData, this.FulshData.bind(this), "PlaceInfoFlush");
        this.AddSmartDataCare(PlaceReturnsData.Inst().ResultData, this.FulshBtnShow.bind(this), "RapidInfoFlush");
        PlaceReturnsCtrl.Inst().SendPlacePrizeInfo(PlaceReturnsType.FETCH_TIME_INFO);
        this.viewNode.Board.SetData(new BoardData(PlaceReturnsView));

        this.viewNode.BtnReturns.onClick(this.OnClickOpenView, this);
        this.viewNode.BtnGetPrize.onClick(this.OnClickGetPrize, this);

        this.cache_timer = PlaceReturnsData.Inst().GetPlaceTime();
        this.viewNode.timer.SetCallBack(this.FlushFlushTime.bind(this));

        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.setVirtual();

        // this.FulshData();
    }

    InitUI() {
        let info = PlaceReturnsData.Inst().GetPlaceEarnings();
        UH.SetText(this.viewNode.AttrNum1, TextHelper.Format(Language.PlaceReturns.earnings, info.gold_return));
        UH.SetText(this.viewNode.AttrNum2, TextHelper.Format(Language.PlaceReturns.earnings, info.exp_return));

    }

    FulshData() {
        this.show_items = PlaceReturnsData.Inst().GetPrizeList(0);
        this.show_data = Item.DefaultCreateListItem(this.show_items);
        this.viewNode.List.numItems = this.show_data.length;
        this.viewNode.BtnGetPrize.grayed = this.show_data.length == 0;
        this.cache_timer = PlaceReturnsData.Inst().GetPlaceTime();

        this.FlushFlushTime()
        this.FulshBtnShow()
    }

    FulshBtnShow() {
        let info = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.quick_get)
        let co = RoleData.Inst().CfgAdTypeSeq(AdType.quick_get)
        let num = PlaceReturnsData.Inst().GetRapidReturnsNum();
        let maxNum = PlaceReturnsData.Inst().GetRapidReturnsMaxNum();

        this.viewNode.BtnReturns.enabled = !(info && info.todayCount >= co.ad_param && maxNum == num)
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(this.show_data[index]);
    }

    private FlushFlushTime() {
        this.viewNode.timer.CloseCountDownTime()
        if (this.cache_timer <= 0) return;
        let maxHour = PlaceReturnsData.Inst().GetTimeMax();
        let maxTime = maxHour * 3600;
        let time = this.cache_timer - TimeCtrl.Inst().ServerTime;
        let startTime = maxTime - time;
        this.viewNode.TimeShow.visible = startTime >= maxTime;
        this.viewNode.timer.visible = startTime < maxTime;
        if (startTime < maxTime) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.CreateRunTime(startTime, maxTime, TimeFormatType.TYPE_TIME_0, Language.PlaceReturns.incomeTime);
        }

    }

    OnClickGetPrize() {
        PlaceReturnsCtrl.Inst().SendPlacePrizeInfo(PlaceReturnsType.FETCH_TIME);
    }

    OnClickOpenView() {
        ViewManager.Inst().OpenView(PlaceRapidReturnsView);
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        this.viewNode.timer.CloseCountDownTime();
    }
}
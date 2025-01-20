import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { LimitedRechargeData } from "./LimitedRechargeData";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ItemCell } from "modules/extends/ItemCell";
import { ActivityCtrl } from "modules/activity/ActivityCtrl";
import { Item } from "modules/bag/ItemData";
import { UH } from "../../helpers/UIHelper";
import { ViewManager } from "manager/ViewManager";
import { MainData } from "modules/main/MainData";
import { ShopView } from "modules/shop/ShopView";

@BaseView.registView
export class LimitedRechargeView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "LimitedRecharge",
        ViewName: "LimitedRechargeView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        list: <fgui.GList>null,
        BtnClose: <fgui.GButton>null,
        timer: <TimeMeter>null,
        Describe: <fgui.GTextField>null,
    };

    protected extendsCfg = [
        { ResName: "TaskCell", ExtendsClass: LimitedRechargeTaskCell }
    ];
    listData: any[];

    InitData() {
        this.viewNode.BtnClose.onClick(this.closeView, this);

        this.AddSmartDataCare(LimitedRechargeData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");

        this.viewNode.list.setVirtual();

        this.FlushData();
        this.FlushTime();
    }

    FlushData() {
        let list = LimitedRechargeData.Inst().GetTimeLimitedList()
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.listData = list;
        this.viewNode.list.numItems = list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    private FlushTime() {
        let time = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.LimitedRecharge) - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
    }

    InitUI() {
        let cfg = LimitedRechargeData.Inst().GetOtherCfg()
        UH.SetText(this.viewNode.Describe, cfg.describe)
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

class LimitedRechargeTaskCell extends BaseItem {
    protected viewNode = {
        Num: <fgui.GTextField>null,
        Title: <fgui.GTextField>null,
        MaskShow: <fgui.GImage>null,
        ShowList: <fgui.GList>null,
        BtnPrize: <fgui.GButton>null,
        BtnRecharge: <fgui.GButton>null,
    };
    protected onConstruct() {
        super.onConstruct()
        this.viewNode.BtnPrize.onClick(this.getPrize, this);
        this.viewNode.BtnRecharge.onClick(this.OnClickRecharge, this);
    }
    public SetData(data: any) {
        super.SetData(data);
        this.data = data;
        let num = LimitedRechargeData.Inst().GetRechargeNum()
        let is_get = LimitedRechargeData.Inst().TaskFetch[data.seq]

        UH.SetText(this.viewNode.Num, data.recharge / 10);
        UH.SetText(this.viewNode.Title, `${num / 10}/${data.recharge / 10}`);

        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ShowList.setVirtual();
        this.viewNode.ShowList.numItems = this.data.pack_gift.length

        this.viewNode.BtnPrize.visible = num >= data.recharge && !is_get
        this.viewNode.BtnRecharge.visible = num < data.recharge;
        this.viewNode.MaskShow.visible = is_get
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(Item.Create(this.data.pack_gift[index], { is_click: true, is_num: true }));
    }

    private OnClickRecharge() {
        ViewManager.Inst().OpenView(ShopView);
        ViewManager.Inst().CloseView(LimitedRechargeView);
        MainData.Inst().FlushSkip(1)
    }

    private getPrize() {
        if (Item.IsGeneBagMax(this.data.pack_gift)) return
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.LimitedRecharge, 1, this.data.seq)
    }
}
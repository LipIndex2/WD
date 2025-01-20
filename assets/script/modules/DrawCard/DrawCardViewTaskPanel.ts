import { ItemCell } from 'modules/extends/ItemCell';
import { UH } from './../../helpers/UIHelper';
import * as fgui from "fairygui-cc";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BasePanel } from "modules/common/BasePanel";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { DrawCardData } from "./DrawCardData";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { COLORS } from "modules/common/ColorEnum";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Language } from "modules/common/Language";
import { TextHelper } from "../../helpers/TextHelper";
import { RedPoint } from "modules/extends/RedPoint";
import { Item } from 'modules/bag/ItemData';
import { DrawCardCtrl } from './DrawCardCtrl';

export class DrawCardViewTaskPanel extends BasePanel {
    protected viewNode = {
        TabList: <fgui.GList>null,
        ShowList: <fgui.GList>null,
        timer: <TimeMeter>null,
    };

    protected extendsCfg = [
        { ResName: "BtnTaskTab", ExtendsClass: BtnTaskTab },
        { ResName: "TaskCell", ExtendsClass: TaskCell }
    ];
    private day: number = 0;
    listData: any[];

    InitPanelData() {
        this.AddSmartDataCare(DrawCardData.Inst().FlushData, this.FlushView.bind(this), "FlushInfo");

        let openDay = DrawCardData.Inst().ActOpenDay - 1
        this.day = openDay >= 6 ? 6 : openDay;
        this.viewNode.ShowList.setVirtual();
        this.viewNode.TabList.setVirtual();
        this.viewNode.TabList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.TabList.on(fgui.Event.CLICK_ITEM, this.OnClickItem, this)

        this.FlushView();
        this.FlushTime();

        this.viewNode.TabList.scrollToView(this.day);
        this.viewNode.TabList.selectedIndex = this.day
    }

    private renderListItem(index: number, item: BtnTaskTab) {
        item.SetData(index);
    }

    private FlushView() {
        let taskList = DrawCardData.Inst().GetDayTask(this.day + 1);
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = taskList;
        this.viewNode.ShowList.numItems = taskList.length;

        this.viewNode.TabList.numItems = 7;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    OnClickItem() {
        this.day = this.viewNode.TabList.selectedIndex;
        this.FlushView();
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

class TaskCell extends BaseItem {
    protected viewNode = {
        ShowList: <fgui.GList>null,
        Name: <fgui.GTextField>null,
        ProgressBar: <fgui.GProgressBar>null,
        BtnReward: <fgui.GButton>null,
        Mask: <fgui.GGroup>null,
        GetReward: <fgui.GGroup>null,
        Lock: <fgui.GGroup>null,
        LockDesc: <fgui.GTextField>null,
    };
    protected onConstruct() {
        super.onConstruct()
        this.viewNode.ShowList.setVirtual();
        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.BtnReward.onClick(this.onClickReward, this);
    }
    public SetData(data: any) {
        super.SetData(data);
        const day = DrawCardData.Inst().ActOpenDay
        const value = DrawCardData.Inst().GetTaskProgress(data.mis_type)
        const fetch = DrawCardData.Inst().IsTaskFetch(data.mis_seq)
        this.viewNode.ProgressBar.max = data.param_1
        this.viewNode.ProgressBar.value = value
        UH.SetText(this.viewNode.Name, data.mis_des);
        UH.SetText(this.viewNode.LockDesc, TextHelper.Format(Language.DrawCard.DayOpane, data.day - day));
        this.viewNode.BtnReward.title = value >= data.param_1 ? Language.ActCommon.LingQu : Language.ActCommon.WeiDaCheng
        this.viewNode.BtnReward.grayed = value < data.param_1 || fetch

        this.viewNode.ShowList.numItems = data.reward_item.length

        this.viewNode.GetReward.visible = fetch
        this.viewNode.Lock.visible = day < data.day
        this.viewNode.Mask.visible = day < data.day || fetch

    }

    private renderListItem(index: number, item: ItemCell) {
        const data = this.GetData();
        item.SetData(Item.Create(data.reward_item[index], { is_num: true }));
    }

    private onClickReward() {
        const data = this.GetData();
        const day = DrawCardData.Inst().ActOpenDay
        if (day < data.day) {
            return
        }
        DrawCardCtrl.Inst().SendTaskFetch(data.mis_seq)
    }
}

class BtnTaskTab extends BaseItemGB {
    protected viewNode = {
        redPoint: <RedPoint>null,
    };
    public SetData(day: number) {
        super.SetData(day)
        this.title = TextHelper.Format(Language.DrawCard.DayShow, day + 1)

        let data = DrawCardData.Inst().ActOpenDay;
        if (data <= day) {
            this.viewNode.redPoint.SetNum(0)
        } else {
            let num = DrawCardData.Inst().GetDayTaskRed(day + 1);
            this.viewNode.redPoint.SetNum(num)
        }
    }
}
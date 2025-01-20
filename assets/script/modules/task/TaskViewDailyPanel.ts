
import * as fgui from "fairygui-cc";
import { BasePanel } from 'modules/common/BasePanel';
import { TaskData } from "./TaskData";
import { TaskViewSpecialItem } from "./TaskView";

export class TaskViewDailyPanel extends BasePanel {
    private show_list: any[]

    protected viewNode = {
        ShowList: <fgui.GList>null,

        TaskItemAd: <TaskViewSpecialItem>null,
        TaskItemAll: <TaskViewSpecialItem>null,
    };

    InitPanelData() {
        this.viewNode.ShowList.setVirtual();

        this.AddSmartDataCare(TaskData.Inst().FlushData, this.FlushShowList.bind(this), "FlushInfo");
    }

    InitPanel() {
        this.FlushShowList()
    }

    FlushShowList() {
        this.show_list = TaskData.Inst().GetTaskDailyShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = this.show_list.length;

        this.viewNode.TaskItemAd.visible = false;
        this.viewNode.TaskItemAll.visible = false;
        // this.viewNode.TaskItemAd.SetData(TaskData.Inst().GetTaskSpecialAdInfo())
        // this.viewNode.TaskItemAll.SetData(TaskData.Inst().GetTaskSpecialAllInfo())
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.show_list[index]);
    }
    ClosePanel() {
        this.RemoveSmartDataCare();
    }
}

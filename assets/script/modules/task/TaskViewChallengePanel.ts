
import * as fgui from "fairygui-cc";
import { BasePanel } from 'modules/common/BasePanel';
import { TaskData } from "./TaskData";

export class TaskViewChallengePanel extends BasePanel {
    private show_list: any[]

    protected viewNode = {
        ShowList: <fgui.GList>null,
    };

    InitPanelData() {
        this.viewNode.ShowList.setVirtual();

        this.AddSmartDataCare(TaskData.Inst().FlushData, this.FlushShowList.bind(this), "FlushInfo");
    }

    InitPanel() {
        this.FlushShowList()
    }

    FlushShowList() {
        this.show_list = TaskData.Inst().GetTaskChallengeShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);

        this.viewNode.ShowList.numItems = this.show_list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.show_list[index]);
    }

    ClosePanel(): void {
        this.RemoveSmartDataCare();
    }
}

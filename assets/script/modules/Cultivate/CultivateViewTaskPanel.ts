import { UH } from './../../helpers/UIHelper';
import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BasePanel } from "modules/common/BasePanel";
import { CultivateData } from "./CultivateData";
import { CultivateCtrl } from './CultivateCtrl';
import { ItemCell } from 'modules/extends/ItemCell';
import { Item } from 'modules/bag/ItemData';
import { BagData } from 'modules/bag/BagData';

export class CultivateViewTaskPanel extends BasePanel {
    protected viewNode = {
        ShowList: <fgui.GList>null,
        ItemNum1: <fgui.GTextField>null,
        ItemNum2: <fgui.GTextField>null,
        Desc: <fgui.GTextField>null,
    };

    protected extendsCfg = [
        { ResName: "TaskCell", ExtendsClass: TaskCell }
    ];
    listData: number[];

    InitPanelData() {
        this.AddSmartDataCare(CultivateData.Inst().FlushData, this.FlushView.bind(this), "FlushInfo");

        this.FlushView();
    }

    FlushView() {
        const task = CultivateData.Inst().GetTaskListCfg();
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = task;
        this.viewNode.ShowList.numItems = task.length;

        const other = CultivateData.Inst().GetOther();
        UH.SetText(this.viewNode.ItemNum1, BagData.Inst().GetItemNum(other.cultivate_item_id));
        UH.SetText(this.viewNode.ItemNum2, BagData.Inst().GetItemNum(other.shop_item_id));
        UH.SetText(this.viewNode.Desc, other.mis_des);
    }

    private itemRenderer(index: number, item: TaskCell) {
        item.SetData(this.listData[index]);
    }

}

class TaskCell extends BaseItem {
    protected viewNode = {
        Name: <fgui.GTextField>null,
        ItemList: <fgui.GList>null,
        ProgressBar: <fgui.GProgressBar>null,
        BtnGetReward: <fgui.GButton>null,
    };
    private pack_gift: any[];
    onConstruct() {
        super.onConstruct();
        this.viewNode.BtnGetReward.onClick(this.OnClickGetReward, this);
    }
    public SetData(type: number) {
        super.SetData(type);
        const taskInfo = CultivateData.Inst().taskList[type];
        const cfg = CultivateData.Inst().GetTaskCfg(type, taskInfo.taskSeq)
        const value = +taskInfo.taskTypeProgress || 0;
        UH.SetText(this.viewNode.Name, cfg.describe);

        this.viewNode.ProgressBar.max = cfg.param1;
        this.viewNode.ProgressBar.value = value;
        this.viewNode.ProgressBar.visible = value < cfg.param1;
        this.viewNode.BtnGetReward.visible = value >= cfg.param1 && taskInfo.taskSeq == cfg.mis_seq;

        this.pack_gift = cfg.item;
        this.viewNode.ItemList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ItemList.setVirtual();
        this.viewNode.ItemList.numItems = cfg.item.length;
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(Item.Create(this.pack_gift[index], { is_num: true }));
    }

    OnClickGetReward() {
        CultivateCtrl.Inst().SendFetchTaskReward(this._data)
    }
}

import * as fgui from "fairygui-cc";
import { Item } from "modules/bag/ItemData";
import { BaseItemCare } from "modules/common/BaseItem";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { TaskConfig } from "modules/task/TaskConfig";
import { TaskData } from "modules/task/TaskData";
import { TaskViewProgress } from "modules/task/TaskView";
import { UH } from "../../helpers/UIHelper";

export class TopLayerViewTaskItem extends BaseItemCare {
    private showTweener: fgui.GTweener;

    protected viewNode = {
        GpShow: <fgui.GGroup>null,
        BgSp: <fgui.GLoader>null,
        IconBgSp: <fgui.GLoader>null,
        IconSp: <fgui.GLoader>null,
        NameShow: <fgui.GTextField>null,
        ProgressShow: <TaskViewProgress>null,
        RewardList: <fgui.GList>null,
    };
    listData: Item[];

    InitData() {

        this.AddSmartDataCare(TaskData.Inst().FlushData, this.FlushTopShow.bind(this), "FlushTopShow");
    }

    InitUI() {
    }

    FlushTopShow() {
        this.FlushInfo()
        this.getTransition("ItemShow").play();
    }

    FlushInfo() {
        let info = TaskData.Inst().TopInfo
        UH.SpriteName(this.viewNode.BgSp, "TopLayer", info.task_type > TaskConfig.TaskType.type_1 ? "ZhuanShuRenWuDi" : "TongYongRenWuDi")
        UH.SpriteName(this.viewNode.IconBgSp, "TopLayer", info.task_type > TaskConfig.TaskType.type_1 ? "TuBiaoKuangBai" : "TuBiaoKuang")
        UH.SetIcon(this.viewNode.IconSp, `type${info.condition_type ?? 0}`, ICON_TYPE.TASK);
        UH.SetText(this.viewNode.NameShow, info.missions_word ?? Language.Task.TaskSpecial.NameShows[info.show_type])
        this.viewNode.ProgressShow.value = info.pram
        this.viewNode.ProgressShow.max = info.pram
        this.viewNode.ProgressShow.FlushShow();

        let rewards = []
        for (let element of info.missions) {
            rewards.push(Item.Create(element, { is_num: true }))
        }
        this.listData = rewards;
        this.viewNode.RewardList.itemRenderer = this.itemRenderer.bind(this)
        this.viewNode.RewardList.numItems = rewards.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }
}

import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { TrafficPermitData } from "modules/TrafficPermit/TrafficPermitData";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB, BaseItemGP } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { AdType, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { RedPoint } from "modules/extends/RedPoint";
import { TimeFormatType, TimeMeter } from 'modules/extends/TimeMeter';
import { DialogTipsView } from "modules/public_popup/DialogTipsView";
import { RoleData } from "modules/role/RoleData";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { TaskConfig } from "./TaskConfig";
import { TaskCtrl } from "./TaskCtrl";
import { TaskTreasureBoxView } from "./TaskTreasureBoxView";
import { TaskViewChallengePanel } from "./TaskViewChallengePanel";
import { TaskViewDailyPanel } from "./TaskViewDailyPanel";
import { CommonBoard1 } from "modules/common_board/CommonBoard1";
import { GMCmdCtrl } from "modules/gm_command/GMCmdCtrl";

@BaseView.registView
export class TaskView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Task",
        ViewName: "TaskView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected boardCfg = {
        TabberCfg: [
            { panel: TaskViewDailyPanel, viewName: "TaskViewDailyPanel", titleName: Language.Task.Tab1, modKey: Mod.Task.Daily, isRemind: true, hideTabbar: true },
            // { panel: TaskViewChallengePanel, viewName: "TaskViewChallengePanel", titleName: Language.Task.Tab2, modKey: Mod.Task.Challenge, isRemind: true },
        ],
        HideTabbar: true
    };

    protected viewNode = {
        board: <CommonBoard1>null,
        TimeShow: <TimeMeter>null,
        BtnTips: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "ItemTaskSpecial", ExtendsClass: TaskViewSpecialItem },
        { ResName: "ItemTaskNormal", ExtendsClass: TaskViewNormalItem },

        { ResName: "ProgressSpecial", ExtendsClass: TaskViewProgress },
        { ResName: "ProgressNormal", ExtendsClass: TaskViewProgress },
        { ResName: "ProgressNormalH", ExtendsClass: TaskViewProgress },
        { ResName: "ButtonGet", ExtendsClass: TaskViewGetButton },
    ];

    InitData() {
        this.viewNode.BtnTips.onClick(this.OnClickTips, this);
    }

    InitUI() {
        this.FlushTimeShow();
    }

    FlushTimeShow() {
        this.viewNode.TimeShow.CloseCountDownTime()
        if (TimeCtrl.Inst().tomorrowStarTime > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.TimeShow.StampTime(TimeCtrl.Inst().tomorrowStarTime, TimeFormatType.TYPE_TIME_0, Language.Task.TimeShow)
            this.viewNode.TimeShow.SetCallBack(this.FlushTimeShow.bind(this))
        }
        else {
            this.viewNode.TimeShow.SetTime("")
        }
    }

    OnClickTips() {
        // PublicPopupCtrl.Inst().Center("打开任务说明界面")
        let cfg = SettingUsertServeData.Inst().GetWordDes(6);
        ViewManager.Inst().OpenView(DialogTipsView, { content: cfg.word, confirmFunc: null, confirmText: null, titleShow: cfg.name, cancelFunc: null, cancelText: null, btnShow: true })
    }
}


export class TaskViewSpecialItem extends BaseItem {
    protected viewNode = {
        BgSp: <fgui.GLoader>null,
        NameShow: <fgui.GTextField>null,
        ProgressShow: <TaskViewProgress>null,
        BtnGet: <fgui.GButton>null,
        RedPointShow: <RedPoint>null,
    };

    protected onConstruct() {
        super.onConstruct();
        this.viewNode.BtnGet.onClick(this.OnClickGet, this);
    }

    SetData(data: any) {
        super.SetData(data)
        UH.SpriteName(this.viewNode.BgSp, "Task", `SpecialBg${data.show_type}`)
        UH.SetText(this.viewNode.NameShow, Language.Task.TaskSpecial.NameShows[data.show_type])
        this.viewNode.BtnGet.icon = fgui.UIPackage.getItemURL("Task", `LiBao${data.show_type}`);
        this.viewNode.ProgressShow.value = data.cur
        this.viewNode.ProgressShow.max = data.pram
        this.viewNode.ProgressShow.FlushShow();
        this.viewNode.RedPointShow.SetNum(data.cur >= data.pram ? 1 : 0)
    }

    OnClickGet() {
        if (this._data.cur >= this._data.pram) {
            if (0 == this._data.show_type) {
                TaskCtrl.Inst().SendDailyTaskReqAdNum()
            } else {
                TaskCtrl.Inst().SendDailyTaskReqTaskNum()
            }
        } else {
            ViewManager.Inst().OpenView(TaskTreasureBoxView, this._data.show_type)
        }
    }
}

export class TaskViewNormalItem extends BaseItem {
    private stateCtrler: fgui.Controller

    protected viewNode = {
        BgSp: <fgui.GLoader>null,
        IconBgSp: <fgui.GLoader>null,
        IconSp: <fgui.GLoader>null,
        NameShow: <fgui.GTextField>null,
        ProgressShow: <TaskViewProgress>null,
        ProgressShowH: <TaskViewProgress>null,
        BtnGet: <TaskViewGetButton>null,
        BtnFlush: <fgui.GButton>null,
        BtnAd: <fgui.GButton>null,
        GpMask: <fgui.GGroup>null,
        RewardList: <fgui.GList>null,
        GpAdvance: <fgui.GGroup>null,
    };
    listData: Item[];

    protected onConstruct() {
        super.onConstruct()
        this.stateCtrler = this.getController("TaskState");

        this.viewNode.BtnGet.onClick(this.OnClickGet, this);
        this.viewNode.BtnFlush.onClick(this.OnClickFlush, this);
        this.viewNode.BtnAd.onClick(this.OnClickAd, this);
    }

    SetData(data: { index: number, co: any, info: any }) {
        super.SetData(data)
        let co = data.co
        let info = data.info

        let is_finish = info.num >= co.pram
        this.viewNode.BtnFlush.visible = RoleData.Inst().IsCanAD(AdType.task_flush, false)

        UH.SpriteName(this.viewNode.BgSp, "Task", co.task_type > TaskConfig.TaskType.type_1 ? "ZhuanShuRenWuDi" : "TongYongRenWuDi")
        UH.SpriteName(this.viewNode.IconBgSp, "Task", co.task_type > TaskConfig.TaskType.type_1 ? "TuBiaoKuangBai" : "TuBiaoKuang")
        UH.SetIcon(this.viewNode.IconSp, `type${co.condition_type}`, ICON_TYPE.TASK);
        UH.SetText(this.viewNode.NameShow, co.missions_word)
        this.viewNode.ProgressShow.value = info.num
        this.viewNode.ProgressShow.max = co.pram
        this.viewNode.ProgressShow.FlushShow();
        this.viewNode.ProgressShowH.value = info.num
        this.viewNode.ProgressShowH.max = co.pram
        this.viewNode.ProgressShowH.FlushShow();

        if (!is_finish && (TaskConfig.TaskType.type_1 == co.task_type || TaskConfig.TaskType.type_3 == co.task_type)) {
            this.stateCtrler.selectedIndex = 0
        } else if (is_finish) {
            this.stateCtrler.selectedIndex = 1
        } else if (TaskConfig.ConditionType.ad == co.condition_type) {
            this.stateCtrler.selectedIndex = 3
        } else {
            this.stateCtrler.selectedIndex = 2
        }

        this.viewNode.GpMask.visible = 1 == info.isFetch
        this.touchable = 0 == info.isFetch
        this.viewNode.GpAdvance.visible = !TrafficPermitData.Inst().GetIsActive() && (co.task_type > TaskConfig.TaskType.type_1)
        this.viewNode.BtnGet.FlushShow(0 == info.isFetch && is_finish)

        let rewards = []
        for (let element of co.missions) {
            rewards.push(Item.Create(element, { is_num: true }))
        }
        this.viewNode.RewardList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = rewards;
        this.viewNode.RewardList.numItems = rewards.length;

    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    OnClickGet() {
        TaskCtrl.Inst().SendDailyTaskReqFetch(this._data.index)
        let result = this._data.co.missions.find((v: any) => v.item_id === 40001);
        if (result) {
            GMCmdCtrl.Inst().SendGMCommand("additem", "40001 " + result.num);
        }
        // TaskData.Inst().TopInfo = this._data.co
    }

    OnClickFlush() {
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.task_flush), "", 0, this._data.index)
    }

    OnClickAd() {
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.task_flush), "", 0, this._data.index)
    }
}

export class TaskViewProgress extends BaseItemGP {
    protected viewNode = {
        ProgressShow: <fgui.GTextField>null,
    };

    FlushShow() {
        UH.SetText(this.viewNode.ProgressShow, `${this.value} / ${this.max}`);
    }
}

export class TaskViewGetButton extends BaseItemGB {
    protected viewNode = {
        RedPointShow: <RedPoint>null,
    };

    FlushShow(show_red: boolean) {
        this.viewNode.RedPointShow.SetNum(show_red ? 1 : 0)
        this.visible = show_red
    }
}
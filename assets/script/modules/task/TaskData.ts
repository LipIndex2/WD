import { CfgDailyMissionData } from "config/CfgTask";
import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { TrafficPermitData } from "modules/TrafficPermit/TrafficPermitData";
import { AdType } from "modules/common/CommonEnum";
import { Mod } from "modules/common/ModuleDefine";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { LocalStorageHelper } from "../../helpers/LocalStorageHelper";
import { TaskConfig } from "./TaskConfig";


export class TaskResultData {
    Info: PB_SCDailyTaskInfo
    TopInfo: any
}

export class TaskFlushData {
    @smartdata
    FlushInfo: boolean = false;

    @smartdata
    FlushTopShow: boolean = false;
}

export class TaskData extends DataBase {

    public ResultData: TaskResultData;
    public FlushData: TaskFlushData;

    private task_old_data: number[];

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(TaskFlushData);
        this.ResultData = new TaskResultData()
    }

    public SetDailyTaskInfo(protocol: PB_SCDailyTaskInfo) {
        this.ResultData.Info = protocol
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo

        this.TaskTopShow(protocol)
    }


    public get Info() {
        return this.ResultData.Info
    }

    public get InfoTaskList() {
        return this.Info ? this.Info.taskList : []
    }

    public get InfoTaskNum() {
        return this.Info ? this.Info.taskNum : 0
    }

    public get InfoAdNum() {
        return this.Info ? this.Info.adNum : 0
    }

    public set TopInfo(value: any) {
        this.ResultData.TopInfo = value
        this.FlushData.FlushTopShow = !this.FlushData.FlushTopShow
    }

    public get TopInfo() {
        return this.ResultData.TopInfo
    }

    public TaskTopShow(data: PB_SCDailyTaskInfo) {
        let oldTask
        let str_oldTaks = LocalStorageHelper.PrefsString(LocalStorageHelper.TaskTopShow());
        if (str_oldTaks) {
            oldTask = JSON.parse(str_oldTaks);
        }
        let today_time = Math.floor(TimeCtrl.Inst().todayStarTime);
        let is_tra = TrafficPermitData.Inst().GetIsActive()
        if (oldTask && today_time == oldTask.old_time) {
            this.task_old_data = oldTask.data;
            for (let i = 0; i < data.taskList.length; i++) {
                let value = data.taskList[i];
                let co = CfgDailyMissionData.missions.find(cfg => cfg.task_id == value.taskId)
                if (value.num >= co.pram && this.task_old_data.indexOf(value.taskId) == -1 && !value.isFetch && (is_tra || co.task_type <= TaskConfig.TaskType.type_1)) {
                    this.TopInfo = co;
                    this.task_old_data.push(value.taskId)
                    break;
                }
            }
        } else {
            this.task_old_data = [];
        }
        this.ClearFirstTaskTopShow();

    }

    public ClearFirstTaskTopShow() {
        // let old_time = LocalStorageHelper.PrefsInt(LocalStorageHelper.TaskTopShow());
        let today_time = Math.floor(TimeCtrl.Inst().todayStarTime);
        let taskdata = this.task_old_data || []
        let json = { old_time: today_time, data: taskdata }
        LocalStorageHelper.PrefsString(LocalStorageHelper.TaskTopShow(), JSON.stringify(json));
    }

    public CfgDailyMissionOtherAdNum() {
        return CfgDailyMissionData.other[0].ad_tnum
    }

    public CfgDailyMissionOtherMissionFinNum() {
        return CfgDailyMissionData.other[0].mission_fin_num
    }

    public CfgDailyMissionOtherAd() {
        return CfgDailyMissionData.other[0].ad
    }

    public CfgDailyMissionOtherMissionFin() {
        return CfgDailyMissionData.other[0].mission_fin
    }

    public GetTaskSpecialAdInfo() {
        return { task_type: TaskConfig.TaskType.type_0, show_type: 0, cur: this.InfoAdNum, pram: this.CfgDailyMissionOtherAdNum(), missions: this.CfgDailyMissionOtherAd(), condition_type: TaskConfig.ConditionType.ad }
    }

    public GetTaskSpecialAllInfo() {
        return { task_type: TaskConfig.TaskType.type_0, show_type: 1, cur: this.InfoTaskNum, pram: this.CfgDailyMissionOtherMissionFinNum(), missions: this.CfgDailyMissionOtherMissionFin(), condition_type: TaskConfig.ConditionType.ad }
    }

    public GetTaskDailyShowList(sort = true) {
        let list = []
        let is_tra = TrafficPermitData.Inst().GetIsActive()
        let ica = RoleData.Inst().IsCanAD(AdType.task_flush, false)
        for (let [key, value] of this.InfoTaskList.entries()) {
            let co = CfgDailyMissionData.missions.find(cfg => cfg.task_id == value.taskId)
            if (co && co.task_type == TaskConfig.TaskType.type_0) {
                if (ica || TaskConfig.ConditionType.ad != co.condition_type) {
                    list.push({
                        index: key,
                        info: value,
                        co: co,
                        is_tra: is_tra || co.task_type <= TaskConfig.TaskType.type_1
                    })
                }
            }
        }
        if (sort) {
            list.sort((a: any, b: any) => {
                let af = a.info.isFetch
                let bf = b.info.isFetch
                if (af < bf) {
                    return -1;
                } else if (af > bf) {
                    return 1;
                } else {
                    let an = a.info.num < a.co.pram ? 0 : 1
                    let bn = b.info.num < b.co.pram ? 0 : 1
                    if (an < bn) {
                        return 1;
                    } else if (an > bn) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            });
        }
        return list
    }

    public GetTaskChallengeShowList(sort = true) {
        let list = []
        let is_tra = TrafficPermitData.Inst().GetIsActive()
        let ica = RoleData.Inst().IsCanAD(AdType.task_flush, false)
        for (let [key, value] of this.InfoTaskList.entries()) {
            let co = CfgDailyMissionData.missions.find(cfg => cfg.task_id == value.taskId)
            if (co && co.task_type == TaskConfig.TaskType.type_1 || co.task_type == TaskConfig.TaskType.type_3) {
                if (ica || TaskConfig.ConditionType.ad != co.condition_type) {
                    list.push({
                        index: key,
                        info: value,
                        co: co,
                        is_tra: is_tra || co.task_type <= TaskConfig.TaskType.type_1
                    })
                }
            }
        }
        if (sort) {
            list.sort((a: any, b: any) => {
                let af = a.info.isFetch
                let bf = b.info.isFetch
                if (af < bf) {
                    return -1;
                } else if (af > bf) {
                    return 1;
                } else {
                    let an = a.info.num < a.co.pram ? 0 : 1
                    let bn = b.info.num < b.co.pram ? 0 : 1
                    if (an < bn) {
                        return 1;
                    } else if (an > bn) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            });
        }
        return list
    }

    //总红点
    public GetAllRed() {
        let is_taskOpen = FunOpen.Inst().GetFunIsOpen(Mod.Task.View);
        if (!is_taskOpen.is_open) {
            return 0;
        }
        let red1 = this.GetDailyRed();
        let red2 = this.GetChallengeRed();
        return red1 + red2;
    }
    //日常任务红点
    GetDailyRed() {
        let data = this.GetTaskDailyShowList(false);
        for (let i = 0; i < data.length; i++) {
            if (data[i].is_tra && data[i].info.num >= data[i].co.pram && data[i].info.isFetch == 0) {
                return 1;
            }
        }
        let ad_info = this.GetTaskSpecialAdInfo()
        let all_info = this.GetTaskSpecialAllInfo()
        if (ad_info.cur >= ad_info.pram || all_info.cur >= all_info.pram) {
            return 1
        }
        return 0;
    }
    //挑战红点
    GetChallengeRed() {
        let data = this.GetTaskChallengeShowList(false);
        for (let i = 0; i < data.length; i++) {
            if (data[i].is_tra && data[i].info.num >= data[i].co.pram && data[i].info.isFetch == 0) {
                return 1;
            }
        }
        return 0;
    }
}
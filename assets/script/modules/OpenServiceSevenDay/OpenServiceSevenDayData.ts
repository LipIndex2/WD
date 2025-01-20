import { LogError } from 'core/Debugger';
import { RoleData } from 'modules/role/RoleData';
import { CfgSevenday } from './../../config/CfgSevenday';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { OpenServiceSevenDayCtrl } from "./OpenServiceSevenDayCtrl";
import { BagData } from 'modules/bag/BagData';
import { bit } from 'core/net/bit';
import { TimeCtrl } from 'modules/time/TimeCtrl';

export class SevenDayResultData {
    Info: PB_SevenDayInfo
}

export class SevenDayFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class OpenServiceSevenDayData extends DataBase {
    public ResultData: SevenDayResultData;
    public FlushData: SevenDayFlushData;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(SevenDayFlushData);
        this.ResultData = new SevenDayResultData()
    }

    public get Info() {
        return this.ResultData.Info;
    }


    public get NowStage() {
        return this.Info ? this.Info.nowStage : 0
    }

    public setSevenDayInfo(data: PB_SevenDayInfo) {
        if (data.sendType == 1) {
            for (let i = 0; i < data.taskList.length; i++) {
                let info = data.taskList[i];
                this.ResultData.Info.taskList[info.dayId - 1] = info;
            }
            if (data.stageRewardFlag) {
                this.ResultData.Info.stageRewardFlag = data.stageRewardFlag;
            }
            if (data.nowStage) {
                this.ResultData.Info.nowStage = data.nowStage;
            }
        } else {
            this.ResultData.Info = data;
        }
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public GetActivityDay() {
        return this.getDayTaskListInfo().length;
    }

    public GetDayTaskCfg(day: number) {
        let stage = this.NowStage;
        return CfgSevenday.seven_day.filter(cfg => {
            return cfg.day == day && cfg.stage == stage;
        })
    }

    public GetDayTask(day: number) {
        let data = [];
        let info;
        let cfg = this.GetDayTaskCfg(day);
        for (const task of cfg) {
            info = {
                seq: task.seq,
                day: task.day,
                maxNum: task.pram1,
                value: this.GetTaskProgress(task.day, task.seq),
                isFetch: this.IsTaskFetch(task.day, task.seq),
            }
            data.push(info);
        }
        data.sort((a: any, b: any) => {
            let fetchA = a.isFetch ? 1 : 0;
            let fetchB = b.isFetch ? 1 : 0;
            let valueA = a.value >= a.maxNum ? 1 : 0;
            let valueB = b.value >= b.maxNum ? 1 : 0;
            if (fetchA != fetchB) {
                return fetchA - fetchB;
            } else if (valueA != valueB) {
                return valueB - valueA;
            }
        })
        return data;
    }

    public GetTasCfg(day: number, seq: number) {
        let stage = this.NowStage;
        return CfgSevenday.seven_day.find(cfg => {
            return cfg.day == day && cfg.seq == seq && cfg.stage == stage;
        })
    }

    public getDayTaskListInfo() {
        return this.Info ? this.Info.taskList : [];
    }

    public GetTaskProgress(day: number, seq: number) {
        let task = this.getDayTaskListInfo()[day - 1];
        return (task && task.taskProgress[seq]) ?? 0;
    }

    public IsTaskFetch(day: number, seq: number) {
        let task = this.getDayTaskListInfo()[day - 1];
        return (task && task.taskFetch[seq]) ?? false;
    }

    public getEndTime() {
        return this.Info ? this.Info.activityEndTime - TimeCtrl.Inst().ServerTime : 0;
    }

    public getSevenGift() {
        let stage = this.NowStage;
        return CfgSevenday.seven_gift.filter(cfg => {
            return cfg.type == stage;
        });
    }

    //七日活动积分数
    public GetIntegralNum(): number {
        return BagData.Inst().GetItemNum(40045);
    }

    //是否领取
    public IsBoxReward(seq: number) {
        return bit.hasflag(this.Info.stageRewardFlag, seq)
    }

    public getCfgOther() {
        return CfgSevenday.other[0];
    }

    public getCfgStageItem() {
        return CfgSevenday.seven_gift[0].stage_item;
    }

    public GetAllRed() {
        let day = this.GetActivityDay();
        if (day == 0) return 0
        let red1 = this.GetTaskRed();
        let red2 = this.GetBoxRed();
        return red1 + red2;
    }

    public GetTaskRed() {
        let day = this.GetActivityDay();
        let num = 0;
        for (let i = 1; i <= day; i++) {
            num += this.GetDayTaskRed(i)
        }
        return num
    }

    public GetDayTaskRed(day: number) {
        let data = this.GetDayTask(day);
        for (let j = 0; j < data.length; j++) {
            if (!data[j].isFetch && data[j].value >= data[j].maxNum) {
                return 1;
            }
        }
        return 0;
    }

    public GetBoxRed() {
        let cfg = this.getSevenGift();
        let num = this.GetIntegralNum();
        for (let i = 0; i < cfg.length; i++) {
            if (!this.IsBoxReward(i) && num >= cfg[i].stage_need) {
                return 1
            }
        }
        return 0
    }
}

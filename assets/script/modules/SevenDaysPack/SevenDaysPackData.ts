import { LogError } from 'core/Debugger';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgSevenDaysPack } from "config/CfgSevenDaysPack";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { TimeHelper } from "../../helpers/TimeHelper";

export class SevenDaysPackResultData {
    Info: PB_SCSevenDayGiftInfo
}

export class SevenDaysPackFlushData {
    @smartdata
    FlushInfo: boolean = false;

    @smartdata
    SelSeq: number = -1
}

export class SevenDaysPackData extends DataBase {

    public ResultData: SevenDaysPackResultData;
    public FlushData: SevenDaysPackFlushData;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(SevenDaysPackFlushData);
        this.ResultData = new SevenDaysPackResultData()
    }

    public OnSevenDaysPackInfo(data: PB_SCSevenDayGiftInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    public get InfoFetch() {
        return this.Info ? this.Info.isFetch : [];
    }

    public get InfoTime() {
        return this.Info ? +this.Info.beginTime : 0;
    }

    public set SelSeq(value: number) {
        this.FlushData.SelSeq = value
    }

    public get SelSeq() {
        return this.FlushData.SelSeq
    }

    public GetSevenDaysPackList() {
        let day = Math.floor(this.GetDay() / 7 + 1) * 7;
        // let day = 7
        return CfgSevenDaysPack.seven_days_pack.filter(cfg => {
            return cfg.end_day == day;
        });
    }

    GetSevenDaysOtherCfg() {
        return CfgSevenDaysPack.other[0];
    }

    public GetEndTime() {
        let time = this.InfoTime + 7 * 86400
        if (TimeCtrl.Inst().ServerTime > time) {
            return this.InfoTime + 14 * 86400
        }
        return time;
    }

    public GetDay() {
        let endTime = TimeCtrl.Inst().ServerTime - this.InfoTime
        let time = TimeHelper.FormatDHMS(endTime)
        return time.day
    }

    GetIsActiveOver() {
        let time = TimeCtrl.Inst().ServerTime;
        let beginTime = this.InfoTime;
        let endTime = this.GetEndTime();
        if (time >= beginTime && time < endTime) {
            return true
        }
        return false
    }

}

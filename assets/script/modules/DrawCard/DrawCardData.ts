import { CfgRaffle } from './../../config/CfgRaffle';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { BagData } from 'modules/bag/BagData';

class DrawCardResultData {
    Info: PB_SCRaPickUpInfo
}

class DrawCardFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class DrawCardData extends DataBase {
    public ResultData: DrawCardResultData;
    public FlushData: DrawCardFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(DrawCardFlushData);
        this.ResultData = new DrawCardResultData()
    }

    public onDrawCardInfo(data: PB_SCRaPickUpInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    private get Info() {
        return this.ResultData.Info
    }

    public get GiftBuyCount() {
        return this.Info ? this.Info.giftBuyCount : []
    }

    public get TaskProgress() {
        return this.Info ? this.Info.taskProgress : []
    }

    public get TaskFetch() {
        return this.Info ? this.Info.taskFetch : []
    }

    public get DrawCount() {
        return this.Info ? this.Info.drawCount : 0
    }

    public get TimestampSeq() {
        let start_time = ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.DrawCard)
        let list = CfgRaffle.timetemp.slice().reverse()
        let co = list.find(cfg => start_time >= cfg.time_stamp)
        return co ? co.seq : 0
    }

    public get ActOpenDay() {
        return Math.ceil((TimeCtrl.Inst().ServerTime - TimeCtrl.Inst().GetTimeDayStart(ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.DrawCard))) / 86400)
    }

    public GetDayTask(day: number) {
        let stage = this.TimestampSeq;
        let cfg = CfgRaffle.mission.filter(cfg => {
            return cfg.day == day && cfg.time_seq == stage;
        })
        cfg.sort((a, b) => {
            let fetchA = this.IsTaskFetch(a.mis_seq) ? 1 : 0;
            let fetchB = this.IsTaskFetch(b.mis_seq) ? 1 : 0;
            let valA = this.GetTaskProgress(a.mis_type);
            let valB = this.GetTaskProgress(b.mis_type);
            let valueA = valA >= a.param_1 ? 1 : 0;
            let valueB = valB >= b.param_1 ? 1 : 0;
            if (fetchA != fetchB) {
                return fetchA - fetchB
            } else if (valueA != valueB) {
                return valueB - valueA;
            }
        })
        return cfg
    }

    public GetGiftCfg() {
        let stage = this.TimestampSeq;
        return CfgRaffle.pack.filter(cfg => {
            return cfg.time_seq == stage;
        })
    }

    public GetJackpotCfg() {
        let stage = this.TimestampSeq;
        return CfgRaffle.Jackpot.filter(cfg => {
            return cfg.time_seq == stage;
        })
    }

    public GetJackpotUpCfg(up: number) {
        let stage = this.TimestampSeq;
        let cfg = CfgRaffle.Jackpot.filter(cfg => {
            return cfg.time_seq == stage && cfg.UP_or_not == up;
        })
        cfg.sort((a, b) => {
            return a.rate - b.rate
        })
        return cfg
    }

    public GetTaskProgress(type: number) {
        return this.TaskProgress[type] ?? 0
    }

    public IsTaskFetch(seq: number) {
        return this.TaskFetch[seq] ?? false
    }

    public GetGiftBuyCount(seq: number) {
        return this.GiftBuyCount[seq] ?? 0
    }

    public GetOtherCfg() {
        return CfgRaffle.other[0]
    }

    public GetTimeStamp() {
        let seq = this.TimestampSeq
        return CfgRaffle.timetemp.find(cfg => cfg.seq == seq);
    }

    public GetAllRed() {
        let red1 = this.GetDrawRed();
        let red2 = this.GetTaskRed();
        return red1 + red2
    }

    public GetTaskRed() {
        let day = this.ActOpenDay;
        let num = 0;
        for (let i = 1; i <= day; i++) {
            num += this.GetDayTaskRed(i)
        }
        return num
    }

    public GetDayTaskRed(day: number) {
        let data = this.GetDayTask(day);
        for (let j = 0; j < data.length; j++) {
            let fetch = this.IsTaskFetch(data[j].mis_seq);
            let val = this.GetTaskProgress(data[j].mis_type);
            if (!fetch && val >= data[j].param_1) {
                return 1;
            }
        }
        return 0;
    }

    public GetDrawRed() {
        const otherCfg = this.GetOtherCfg();
        const itemid = otherCfg.extract_item2[0].item_id
        const itemNum = BagData.Inst().GetItemNum(itemid)
        return itemNum
    }
}

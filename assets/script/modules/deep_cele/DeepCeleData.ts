import { CfgCeremonyAct } from "config/CfgCeremonyAct";
import { CfgCeremonyGift } from "config/CfgCeremonyGift";
import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { TimeCtrl } from "modules/time/TimeCtrl";


export class DeepCeleResultData {
    ItemBuyInfo: PB_SCRaItemBuyInfo
    TaskInfo: PB_SCRaTaskInfo
    TaskBuyInfo: PB_SCRaTaskBuyInfo
}

export class DeepCeleFlushData {
    @smartdata
    FlushItemBuyInfo: boolean = false;

    @smartdata
    FlushTaskInfo: boolean = false;

    @smartdata
    FlushTaskBuyInfo: boolean = false;
}

export class DeepCeleData extends DataBase {

    public ResultData: DeepCeleResultData;
    public FlushData: DeepCeleFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(DeepCeleFlushData);
        this.ResultData = new DeepCeleResultData()
    }

    public SetRaItemBuyInfo(protocol: PB_SCRaItemBuyInfo) {
        this.ResultData.ItemBuyInfo = protocol
        this.FlushData.FlushItemBuyInfo = !this.FlushData.FlushItemBuyInfo
    }

    public SetRaTaskInfo(protocol: PB_SCRaTaskInfo) {
        this.ResultData.TaskInfo = protocol
        this.FlushData.FlushTaskInfo = !this.FlushData.FlushTaskInfo
    }

    public SetRaTaskBuyInfo(protocol: PB_SCRaTaskBuyInfo) {
        this.ResultData.TaskBuyInfo = protocol
        this.FlushData.FlushTaskBuyInfo = !this.FlushData.FlushTaskBuyInfo
    }

    public get ActOpenDay() {
        return Math.ceil((TimeCtrl.Inst().ServerTime - ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.DeepCele)) / 86400)
    }

    public get ItemBuyInfoItemBuyCount() {
        return this.ResultData.ItemBuyInfo ? this.ResultData.ItemBuyInfo.itemBuyCount : []
    }

    public get TaskInfoRewardFetch() {
        return this.ResultData.TaskInfo ? this.ResultData.TaskInfo.rewardFetch : []
    }

    public get TaskInfoTaskProgress() {
        return this.ResultData.TaskInfo ? this.ResultData.TaskInfo.taskProgress : []
    }

    public get TaskBuyInfoItemBuyNum() {
        return this.ResultData.TaskBuyInfo ? this.ResultData.TaskBuyInfo.itemBuyNum : []
    }

    public get TimestampActSeq() {
        let start_time = ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.DeepCele)
        let list = CfgCeremonyAct.time_stamp.slice().reverse()
        let co = list.find(cfg => start_time >= cfg.time_stamp)
        return co ? co.time_seq : 0
    }

    public get TimestampGiftSeq() {
        let start_time = ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.DeepCeleGift)
        let list = CfgCeremonyGift.time_stamp.slice().reverse()
        let co = list.find(cfg => start_time >= cfg.time_stamp)
        return co ? co.time_seq : 0
    }

    public GeTimeStampAct() {
        let seq = this.TimestampActSeq
        return CfgCeremonyAct.time_stamp.find(cfg => cfg.time_seq == seq);
    }

    public GeTimeStampGift() {
        let seq = this.TimestampGiftSeq
        return CfgCeremonyGift.time_stamp.find(cfg => cfg.time_seq == seq);
    }

    public CfgCeremonyActOtherTime() {
        return CfgCeremonyAct.other[0].time1
    }

    public CfgCeremonyActOtherItemExchange() {
        return CfgCeremonyAct.other[0].item_exchange
    }

    public CfgCeremonyActOtherItemName() {
        return CfgCeremonyAct.other[0].name
    }

    public CfgCeremonyGiftOtherItemName() {
        return CfgCeremonyGift.other[0].name
    }

    public GetMissionShowList(day: number, sort = false) {
        let seq = this.TimestampActSeq
        let list = CfgCeremonyAct.mission_list.filter(cfg => cfg.time_seq == seq && cfg.day == day)
        if (sort) {
            list.sort((a: any, b: any) => {
                let ag = this.GetMissionGeted(a.seq) ? 1 : 0
                let bg = this.GetMissionGeted(b.seq) ? 1 : 0
                if (ag < bg) {
                    return -1;
                } else if (ag > bg) {
                    return 1;
                } else {
                    let ap = a.pram <= this.GetMissionProgress(a.type) ? 1 : 0
                    let bp = b.pram <= this.GetMissionProgress(b.type) ? 1 : 0
                    if (ap < bp) {
                        return 1;
                    } else if (ap > bp) {
                        return -1;
                    } else {
                        return a.seq - b.seq
                    }
                }
            });
        }
        return list
    }

    public GetMissionProgress(type: number) {
        return this.TaskInfoTaskProgress[type] ?? 0
    }

    public GetMissionGeted(seq: number) {
        return this.TaskInfoRewardFetch[seq] ?? false
    }

    public GetExchangeShowList(sort = false) {
        let seq = this.TimestampActSeq
        let list = CfgCeremonyAct.reward.filter(cfg => cfg.time_seq == seq)
        if (sort) {
            // list.sort((a: any, b: any) => {
            //     let af = this.GetMissionGeted(a.seq) ? 1 : 0
            //     let bf = this.GetMissionGeted(b.seq) ? 1 : 0
            //     if (af < bf) {
            //         return -1;
            //     } else if (af > bf) {
            //         return 1;
            //     } else {
            //         return a.seq - b.seq
            //     }
            // });
        }
        return list
    }

    public GetExchangeNum(seq: number) {
        return this.TaskBuyInfoItemBuyNum[seq] ?? 0
    }

    public GetGiftShowList(sort = false) {
        let seq = this.TimestampGiftSeq
        let list = CfgCeremonyGift.gift_list.filter(cfg => cfg.time_seq == seq)
        if (sort) {
            list.sort((a: any, b: any) => {
                let af = (a.limit_num - this.GetGiftItemBuyCount(a.seq)) > 0 ? 1 : 0
                let bf = (b.limit_num - this.GetGiftItemBuyCount(b.seq)) > 0 ? 1 : 0
                if (af == bf) {
                    return a.seq - b.seq
                }
                return bf - af
            });
        }
        return list
    }

    public GetGiftItemBuyCount(seq: number) {
        return this.ItemBuyInfoItemBuyCount[seq] ?? 0
    }

    public GetGiftBuyNum(seq: number) {
        return this.TaskBuyInfoItemBuyNum[seq] ?? 0
    }

    public GetAllTaskRed() {
        let day = this.ActOpenDay
        let num = 0;
        for (let i = 1; i <= day; i++) {
            num += this.GetDayTaskRed(i)
        }
        return num
    }

    public GetDayTaskRed(day: number) {
        let list = this.GetMissionShowList(day)
        let rp = 0
        for (let element of list) {
            let geted = DeepCeleData.Inst().GetMissionGeted(element.seq)
            let value = geted ? element.pram : DeepCeleData.Inst().GetMissionProgress(element.type)
            if (!geted && value >= element.pram) {
                rp = 1
                break
            }
        }
        return rp
    }
}
import { LogError } from 'core/Debugger';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { CfgZombieRushPass } from 'config/CfgZombieRushPass';

export class ZombieRushPassResultData {
    Info: PB_SCZombiGoGoGoPassInfo
}

export class ZombieRushPassFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class ZombieRushPassData extends DataBase {
    public ResultData: ZombieRushPassResultData;
    public FlushData: ZombieRushPassFlushData;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(ZombieRushPassFlushData);
        this.ResultData = new ZombieRushPassResultData()
    }

    public OnZombieRushPassInfo(data: PB_SCZombiGoGoGoPassInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    public get TimestampSeq() {
        let start_time = ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.ZombieRushPass)
        // let list = CfgZombieRushPass.time_stamp.slice().reverse()
        // let co = list.find(cfg => start_time >= cfg.time_stamp)
        // return co ? co.time_seq : 0
        return 0
    }

    public GeTimeStamp() {
        let seq = this.TimestampSeq
        return CfgZombieRushPass.time_stamp.find(cfg => cfg.time_seq == seq);
    }

    public GetKillNum() {
        return this.Info ? this.Info.killNum : 0;
    }

    public GetListInfo() {
        return this.Info ? this.Info.list : [];
    }

    public GetIsActiveInfo(type: number) {
        let list = this.GetListInfo();
        return list[type] ? list[type].isActive : false;
    }

    public GetIsFetchInfo(type: number) {
        let list = this.GetListInfo();
        return list[type] ? list[type].isFetch : [];
    }

    public GetOtherCfg() {
        return CfgZombieRushPass.other[0];
    }

    public getEndTime() {
        let endTime = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.ZombieRushPass)
        return endTime;
    }

    public GetListData() {
        let seq = this.TimestampSeq
        let cfg = CfgZombieRushPass.round_pass_set.filter(cfg => cfg.time_seq == seq);
        let roundNum = this.GetKillNum();
        let data = [];
        let isActive1 = this.GetIsActiveInfo(1);
        let isActive2 = this.GetIsActiveInfo(2);
        let isFetch0 = this.GetIsFetchInfo(0);
        let isFetch1 = this.GetIsFetchInfo(1);
        let isFetch2 = this.GetIsFetchInfo(2);
        for (let i = 0; i < cfg.length; i++) {
            let isShowWire = false
            if (roundNum >= cfg[i].level && cfg[i + 1] && roundNum < cfg[i + 1].level) {
                isShowWire = true;
            }
            data.push({
                cfg: cfg[i],
                isActive: [true, isActive1, isActive2],
                isFetch: [isFetch0[i], isFetch1[i], isFetch2[i]],
                level: roundNum,
                isShowWire: isShowWire
            });
        }
        return data;
    }

    
    public GetPassCfgLevel(seq: number) {
        let time_seq = this.TimestampSeq;
        const cfg = CfgZombieRushPass.round_pass_set.find(cfg => cfg.time_seq == time_seq && cfg.seq == seq);
        return cfg ? cfg.level : 0
    }
    
    public GetBuyBtnShow(seq: number) {
        if (seq == 0) {
            return false
        }
        let num = this.GetKillNum();
        const val = this.GetPassCfgLevel(seq - 1);
        const val2 = this.GetPassCfgLevel(seq);
        let isShow = val <= num && val2 > num
        if (seq == 1 && val2 > num) {
            return true
        }
        return isShow
    }

    public scrollListNum() {
        let data = this.GetListData();
        for (let i = 0; i < data.length; i++) {
            if (data[i].level >= data[i].cfg.level) {
                if ((data[i].isActive[0] && !data[i].isFetch[0])) {
                    return i
                }
                if (data[i].isActive[1] && !data[i].isFetch[1]) {
                    return i
                }
                if (data[i].isActive[2] && !data[i].isFetch[2]) {
                    return i
                }
            } else {
                return i;
            }
        }
        return data.length - 1;
    }

    //红点
    public GetAllRed() {
        // let data = this.GetListData();
        // for (let i = 0; i < data.length; i++) {
        //     if (data[i].level >= data[i].cfg.level) {
        //         if ((data[i].isActive[0] && !data[i].isFetch[0])) {
        //             return 1
        //         }
        //         if (data[i].isActive[1] && !data[i].isFetch[1]) {
        //             return 1
        //         }
        //         if (data[i].isActive[2] && !data[i].isFetch[2]) {
        //             return 1
        //         }
        //     }
        // }
        return 0;
    }

}

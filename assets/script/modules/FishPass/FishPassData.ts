import { LogError } from 'core/Debugger';
import { CreateSMD, smartdata } from "data/SmartData";
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { Mod } from 'modules/common/ModuleDefine';
import { DataBase } from "../../data/DataBase";
import { CfgFishPass } from 'config/CfgFishPass';

export class FishPassResultData {
    Info: PB_SCRaFishPassInfo
}

export class FishPassFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class FishPassData extends DataBase {
    public ResultData: FishPassResultData;
    public FlushData: FishPassFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(FishPassFlushData);
        this.ResultData = new FishPassResultData()
    }

    public get Info() {
        return this.ResultData.Info;
    }

    public onFishPassInfo(data: PB_SCRaFishPassInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Meters() {
        return this.Info ? this.Info.meters : 0;
    }

    public get fetchEx() {
        return this.Info ? this.Info.fetchExRewardCount : 0;
    }

    public get InfoList() {
        return this.Info ? this.Info.list : [];
    }

    public get TimestampSeq() {
        let start_time = ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.FishPass)
        let list = CfgFishPass.time_stamp.slice().reverse()
        let co = list.find(cfg => start_time >= cfg.time_stamp)
        return co ? co.time_seq : 0
    }

    public GeTimeStamp() {
        let seq = this.TimestampSeq
        return CfgFishPass.time_stamp.find(cfg => cfg.time_seq == seq);
    }

    public GetFishPassList() {
        let seq = this.TimestampSeq;
        return CfgFishPass.pass_check_set.filter(cfg => cfg.time_seq == seq);
    }

    public GetFishPassItemCfg(seq: number) {
        let time_seq = this.TimestampSeq;
        return CfgFishPass.pass_check_set.find(cfg => cfg.time_seq == time_seq && cfg.seq == seq);
    }

    public GetFishPassItemMetersCfg(seq: number) {
        let cfg = this.GetFishPassItemCfg(seq);
        return cfg ? cfg.meters : 0
    }

    public GetBuyBtnShow(seq: number) {
        if (seq == 0) {
            return false
        }
        const cfgMeters = this.GetFishPassItemMetersCfg(seq - 1);
        const cfgMeters2 = this.GetFishPassItemMetersCfg(seq);
        let isShow = cfgMeters <= this.Meters && cfgMeters2 > this.Meters
        if (seq == 1 && cfgMeters2 > this.Meters) {
            return true
        }
        return isShow
    }

    public GetIsActive(type: number) {
        return this.InfoList[type] ? this.InfoList[type].isActive : false
    }

    public GetOtherCfg() {
        return CfgFishPass.other[0]
    }

    //当前通行证等级配置
    public GetPasscheckLevelCfg(seq: number) {
        let cfg = this.GetFishPassList();
        if (seq >= cfg.length) {
            return cfg[cfg.length - 1];
        }
        return cfg.find(cfg => {
            return cfg.seq == seq;
        });
    }

    public IsGetReward(type: number, seq: number) {
        return this.InfoList[type] ? this.InfoList[type].isFetch[seq] : false
    }

    public scrollListNum() {
        let data = this.GetFishPassList();
        let isActive = this.GetIsActive(1)
        let level = this.Meters
        for (let i = 0; i < data.length; i++) {
            if (level >= data[i].meters) {
                if (!this.IsGetReward(0, data[i].seq)) {
                    return i;
                }
                if (isActive && !this.IsGetReward(1, data[i].seq)) {
                    return i;
                }
            } else {
                return i;
            }
        }
        return data.length - 1;
    }

    public GetAllRed(): number {
        let isOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.FishPass);
        if (!isOpen) {
            return 0;
        }

        if (!FunOpen.Inst().checkAudit(1)) {
            return 0;
        }

        let datas = this.GetFishPassList();
        let isActive = this.GetIsActive(1)
        for (let da of datas) {
            let level = this.Meters
            if (level >= da.meters) {
                if (!this.IsGetReward(0, da.seq)) {
                    return 1;
                }
                if (!this.IsGetReward(1, da.seq) && isActive) {
                    return 1;
                }
            }
        }
        return 0;
    }
}

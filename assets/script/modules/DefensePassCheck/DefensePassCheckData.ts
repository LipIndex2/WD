import { LogError } from 'core/Debugger';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { CfgDefensePassCheck } from 'config/CfgDefensePassCheck';

export class DefensePassCheckResultData {
    Info: PB_SCRaBackYardPassInfo
}

export class DefensePassCheckFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class DefensePassCheckData extends DataBase {
    public ResultData: DefensePassCheckResultData;
    public FlushData: DefensePassCheckFlushData;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(DefensePassCheckFlushData);
        this.ResultData = new DefensePassCheckResultData()
    }

    public OnDefensePassCheckInfo(data: PB_SCRaBackYardPassInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    public get TimestampSeq() {
        let start_time = ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.DefensePassCheck)
        let list = CfgDefensePassCheck.time_stamp.slice().reverse()
        let co = list.find(cfg => start_time >= cfg.time_stamp)
        return co ? co.time_seq : 0
    }

    public GeTimeStamp() {
        let seq = this.TimestampSeq
        return CfgDefensePassCheck.time_stamp.find(cfg => cfg.time_seq == seq);
    }

    public GetKillNum() {
        return this.Info ? this.Info.passDay : 0;
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
        return CfgDefensePassCheck.other[0];
    }

    public getEndTime() {
        let endTime = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DefensePassCheck)
        return endTime;
    }

    public GetListData() {
        let seq = this.TimestampSeq
        let cfg = CfgDefensePassCheck.round_pass_set.filter(cfg => cfg.time_seq == seq);
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
        let data = this.GetListData();
        for (let i = 0; i < data.length; i++) {
            if (data[i].level >= data[i].cfg.level) {
                if ((data[i].isActive[0] && !data[i].isFetch[0])) {
                    return 1
                }
                if (data[i].isActive[1] && !data[i].isFetch[1]) {
                    return 1
                }
                if (data[i].isActive[2] && !data[i].isFetch[2]) {
                    return 1
                }
            }
        }
        return 0;
    }

}

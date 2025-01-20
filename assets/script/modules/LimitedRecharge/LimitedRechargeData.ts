import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgTimeLimitedRecharge } from "config/CfgTimeLimitedRecharge";

export class LimitedRechargeResultData {
    Info: PB_SCRaTimeLimitRechargeInfo
}

export class LimitedRechargeFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class LimitedRechargeData extends DataBase {

    public ResultData: LimitedRechargeResultData;
    public FlushData: LimitedRechargeFlushData;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(LimitedRechargeFlushData);
        this.ResultData = new LimitedRechargeResultData()
    }

    public OnLimitedRechargeInfo(data: PB_SCRaTimeLimitRechargeInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    public get TaskFetch() {
        return this.Info ? this.Info.isFetch : [];
    }

    public GetTimeLimitedList() {
        let cfg = CfgTimeLimitedRecharge.Time_limited
        cfg.sort((a, b) => {
            let fetchA = this.TaskFetch[a.seq] ? 1 : 0;
            let fetchB = this.TaskFetch[b.seq] ? 1 : 0;
            if (fetchA != fetchB) {
                return fetchA - fetchB;
            }
        })
        return cfg;
    }

    public GetRechargeNum() {
        return this.Info ? this.Info.rechargeNum : 0;
    }

    public GetOtherCfg() {
        return CfgTimeLimitedRecharge.other[0]
    }

    GetAllRed() {
        let num = this.GetRechargeNum();
        let list = this.GetTimeLimitedList();
        for (let i = 0; i < list.length; i++) {
            if (!this.TaskFetch[list[i].seq] && num >= list[i].recharge) {
                return 1
            }
        }
        return 0
    }

}

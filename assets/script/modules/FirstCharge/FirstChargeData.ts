import { LogError } from 'core/Debugger';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgFirstCharge } from "config/CfgFirstCharge";

export class FirstChargeResultData {
    Info: PB_SCFirstRechargeInfo
}

export class FirstChargeFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class FirstChargeData extends DataBase {
    public ResultData: FirstChargeResultData;
    public FlushData: FirstChargeFlushData;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(FirstChargeFlushData);
        this.ResultData = new FirstChargeResultData()
    }

    public get Info() {
        return this.ResultData.Info;
    }

    public setFirstChargeInfo(data: PB_SCFirstRechargeInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    GetFirstChargeCfg() {
        return CfgFirstCharge.shouchong[0];
    }

    GetInfoActive() {
        return this.Info ? this.Info.isActive : false
    }

    GetInfoFetch() {
        return this.Info ? this.Info.isFetch : false
    }
    GetAllRed() {
        let is_over = this.GetInfoFetch();
        let is_active = this.GetInfoActive();
        if(is_active && !is_over){
            return 1
        }
        return 0
    }

     //活动是否显示入口
     public GetIsActiveOver() {
        let is_over = this.GetInfoFetch();
        return !is_over;
    }
}

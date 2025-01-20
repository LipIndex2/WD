import { Language } from 'modules/common/Language';
import { RoleData } from 'modules/role/RoleData';
import { CfgPiggy } from './../../config/CfgPiggy';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";


class SavingPotResultData {
    @smartdata
    SavingPotInfoFlush: boolean = false;
}


export class SavingPotData extends DataBase {
    public ResultData: SavingPotResultData;
    private SavingPotInfo: PB_SCMoneyBoxInfo;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        let self = this;
        self.ResultData = CreateSMD(SavingPotResultData);
    }

    public OnSavingPotInfo(data: PB_SCMoneyBoxInfo) {
        this.SavingPotInfo = data;
        this.ResultData.SavingPotInfoFlush = !this.ResultData.SavingPotInfoFlush;
    }

    //储蓄罐配置
    public getPiggyCfg() {
        let seq = this.SavingPotInfo ? this.SavingPotInfo.seq : 0
        return CfgPiggy.piggy.find(cfg => {
            return cfg.seq == seq;
        })
    }

    //储蓄罐
    public getDiamondNum() {
        return this.SavingPotInfo ? this.SavingPotInfo.value : 0;
    }

    //储蓄罐
    public getDiamondShow() {
        let cfg = this.getPiggyCfg();
        let value = this.getDiamondNum();
        if (!cfg) return 0
        if (value >= cfg.dia_max) {
            return Language.SavingPot.full;
        } else {
            return value;
        }
    }

    GetIsActiveOver() {
        let cfg = this.getPiggyCfg();
        if (cfg) {
            return true
}
        return false
    }
}

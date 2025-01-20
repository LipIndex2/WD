import { FunOpen } from './../FunUnlock/FunOpen';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgPrivilege } from "config/CfgPrivilege";
import { Mod } from 'modules/common/ModuleDefine';

export class AdFreeResultData {
    Info: PB_SCAdPassInfo
}

export class AdFreeFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class AdFreeData extends DataBase {
    public ResultData: AdFreeResultData;
    public FlushData: AdFreeFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(AdFreeFlushData);
        this.ResultData = new AdFreeResultData()
    }

    public setAdFreeInfo(data: PB_SCAdPassInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    public GetIsBuyAdFree() {
        return this.Info ? this.Info.isActive : false;
    }

    public GetPrivilegeCfg() {
        return CfgPrivilege.privilege_info[0];
    }

    public GetIsAdFreeOpen() {
        let isActive = this.GetIsBuyAdFree();
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.AdFree.View)
        if (!isOpen.is_open) {
            return false;
        }
        return !isActive
    }
}

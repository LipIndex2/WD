import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { LogError } from 'core/Debugger';
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { CfgGeneGift } from "config/CfgGeneGift";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { Mod } from "modules/common/ModuleDefine";
import { HeroData } from "modules/hero/HeroData";

export class GeneGiftResultData {
    Info: PB_SCRaGeneNewbeeGiftInfo
}

export class GeneGiftFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class GeneGiftData extends DataBase {
    public ResultData: GeneGiftResultData;
    public FlushData: GeneGiftFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(GeneGiftFlushData);
        this.ResultData = new GeneGiftResultData()
    }

    public OnGeneGiftInfo(data: PB_SCRaGeneNewbeeGiftInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    getGiftInfo() {
        return this.Info ? this.Info.seq : 0
    }

    getEndTime() {
        return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.GeneGift) - TimeCtrl.Inst().ServerTime;
    }

    public GetGiftCfg(seq: number) {
        return CfgGeneGift.dna_new_pack.find(cfg => {
            return cfg.seq == seq;
        })
    }

    public GetIsActiveOver() {
        let funIsOpen = FunOpen.Inst().GetFunIsOpen(Mod.HeroInfo.Gene);
        if (!funIsOpen.is_open) {
            return false;
        }
        let isOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.GeneGift)
        if(!isOpen){
            return false;
        }
        if (!HeroData.Inst().IsHeroLevel(7)) {
            return false;
        }
        let seq = GeneGiftData.Inst().getGiftInfo();
        let config = GeneGiftData.Inst().GetGiftCfg(seq);
        if (!config) {
            return false;
        }
        return true;
    }

}

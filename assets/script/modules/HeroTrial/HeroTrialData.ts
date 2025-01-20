import { CfgHeroTrial } from './../../config/CfgHeroTrial';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { Mod } from 'modules/common/ModuleDefine';
import { IBattleHeroInfo } from 'modules/Battle/BattleData';
import { TimeCtrl } from 'modules/time/TimeCtrl';

export class HeroTrialResultData {
    Info: PB_SCHerotrialInfo
}

export class HeroTrialFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class HeroTrialData extends DataBase {
    public ResultData: HeroTrialResultData;
    public FlushData: HeroTrialFlushData;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(HeroTrialFlushData);
        this.ResultData = new HeroTrialResultData()
    }

    public OnHeroTrialInfo(data: PB_SCHerotrialInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info;
    }

    public get InfoTrial() {
        return this.Info ? this.Info.isFetch : [];
    }

    public get TimestampSeq() {
        let start_time = TimeCtrl.Inst().ServerTime
        let list = CfgHeroTrial.time_stamp.slice().reverse()
        let co = list.find(cfg => start_time >= cfg.time_stamp && start_time < cfg.end_time_stamp)
        return co ? co.time_seq : 0
    }

    public GetTrialList() {
        let seq = this.TimestampSeq
        return CfgHeroTrial.trial.filter(cfg => cfg.time_seq == seq);
    }

    public IsFetch(seq: number) {
        return this.InfoTrial[seq] ?? false
    }

    //获取上阵的英雄信息
    GetInBattleHeroInfos(barrier_id: number): IBattleHeroInfo[] {
        let cfg = this.GetTrialLevelCfg(barrier_id);
        let heros = cfg.lineup_hero_id.split("|");
        let levels = cfg.hero_level.split("|");
        let infos: IBattleHeroInfo[] = [];
        for (let i = 0; i < heros.length; i++) {
            infos.push(<IBattleHeroInfo>{ heroId: +heros[i], heroLevel: +levels[i] });
        }
        return infos;
    }

    public GetTrialLevelCfg(barrier_id: number) {
        return CfgHeroTrial.trial.find(cfg => cfg.barrier_id == barrier_id)
    }

    public GetIsActiveOver() {
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.HeroTrial.View);
        if (!isOpen.is_open) {
            return false
        }
        for (let i = 0; i < this.InfoTrial.length; i++) {
            if (!this.InfoTrial[i]) {
                return true;
            }
        }
        return false;
    }
}

import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgBarrierInfoData } from "config/CfgBarrierInfo";
import { GetSceneCfgPath, CfgSceneData } from "config/CfgScene";
import { CfgManager } from "manager/CfgManager";
import { SceneType } from "modules/Battle/BattleConfig";

export class MainLevelInfoResultData {
    Info: PB_MainFBPassInfo
}

export class MainLevelInfoFlushData {
    @smartdata
    FlushInfo: boolean = false;

    @smartdata
    FlushBarrierCfg: boolean = false;
}

export class MainLevelInfoData extends DataBase {
    public ResultData: MainLevelInfoResultData;
    public FlushData: MainLevelInfoFlushData;
    private _barrierCfg: CfgSceneData;
    private _barrier_id: number;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(MainLevelInfoFlushData);
        this.ResultData = new MainLevelInfoResultData()
    }

    public setMainLevelInfo(data: PB_MainFBPassInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info;
    }

    public get InfoList() {
        return this.Info ? this.Info.infoList : [];
    }

    public SetBarrierCfg(data: CfgSceneData) {
        this._barrierCfg = data;
        this.FlushData.FlushBarrierCfg = !this.FlushData.FlushBarrierCfg;
    }

    public get barrierCfg() {
        return this._barrierCfg;
    }

    public get barrierMonsterPage() {
        return this._barrierCfg ? this._barrierCfg.monster_page : [];
    }

    public CfgBarrierInfoMainInfo(barrier_id: number) {
        return CfgBarrierInfoData.Main_info.find(cfg => cfg.barrier_id == barrier_id)
    }

    public CfgBarrierBoss() {
        return this.barrierMonsterPage.filter(cfg => {
            return cfg.monster_type == 2 && cfg.describe_type != "";
        })
    }

    public AttributeResistance(cfg: any) {
        let data = [];
        if (cfg.physics_def != 0) {
            data.push([1, cfg.physics_def])
        }
        if (cfg.water_def != 0) {
            data.push([2, cfg.water_def])
        }
        if (cfg.dark_def != 0) {
            data.push([3, cfg.dark_def])
        }
        if (cfg.poison_def != 0) {
            data.push([4, cfg.poison_def])
        }
        if (cfg.fire_def != 0) {
            data.push([5, cfg.fire_def])
        }
        if (cfg.soil_def != 0) {
            data.push([6, cfg.soil_def])
        }
        return data;
    }

    public SceneCfgPathCfg(barrier_id: number) {
        let self = this;
        let resPath = GetSceneCfgPath(barrier_id);
        CfgManager.Inst().GetCfg<CfgSceneData>(resPath, (cfg) => {
            self.SetBarrierCfg(cfg)
        })
    }

}


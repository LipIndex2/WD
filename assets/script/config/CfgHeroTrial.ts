import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/hero_trial_auto";

export function _CreateCfgHeroTrial(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgHeroTrial = <_CfgHeroTrial>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgHeroTrial", CfgHeroTrial);
        func(err == null);
    })
}

class CfgTrial {
    time_seq: number;
    seq: number;
    hero_id: number;
    barrier_id: number;
    lineup_hero_id: string;
    hero_level: string;
    entries: string;
    res_id: string;
    win: CfgItem[];
    hero_rate: string;
}

class CfgTimestamp {
    time_seq: number;
    time_stamp: number;
    end_time_stamp: number;
}

class _CfgHeroTrial {
    trial: CfgTrial[];
    time_stamp: CfgTimestamp[];
}

export let CfgHeroTrial: _CfgHeroTrial = null;
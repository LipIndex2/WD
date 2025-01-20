import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/daily_mission_auto";

export function _CreateCfgDailyMission(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgDailyMissionData = <_CfgDailyMissionData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgDailyMissionData", CfgDailyMissionData);
        func(err == null);
    })
}

class CfgDailyMissionDataMissions {
    task_type: number;
    task_id: number;
    condition_type: number;
    pram: number;
    missions_word: string;
    missions: CfgItem[];
}

class CfgDailyMissionDataOther {
    unlock: number;
    daily_Exclusive_mission_num: number;
    daily_mission_num: number;
    daily_Exclusive_chellgnge_num: number;
    daily_chellgnge_num: number;
    ad_tnum: number;
    ad: CfgItem[];
    mission_fin_num: number;
    mission_fin: CfgItem[];
}

class _CfgDailyMissionData {
    missions: CfgDailyMissionDataMissions[];
    other: CfgDailyMissionDataOther[];
}

export let CfgDailyMissionData: _CfgDailyMissionData = null;
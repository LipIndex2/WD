import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/Player_level_auto";

export function _CreateCfgPlayerLevel(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgPlayerLevelData = <_CfgPlayerLevelData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgPlayerLevelData", CfgPlayerLevelData);
        func(err == null);
    })
}

class CfgPlayerLevelDataLevel {
    level: number;
    level_up: number;
    up: CfgItem[];
}

class CfgPlayerLevelDataOther {
    exp_item: number;
    power_max: number;
    power_buy_item: number;
    get_power_num: number;
    power_buy_item_num: number;
    up: number;
    time: number;
    name: CfgItem[];
    zhuo: CfgItem[];
}

class CfgPlayerLevelDataHead {
    head_id: number;
    unlock_type: number;
    pram1: number;
    pram2: number;
    res_id: string;
    describe: string;
}

class CfgPlayerLevelDataHeadIcon {
    head_id: number;
    unlock_type: number;
    param1: number;
    param2: number;
}

class _CfgPlayerLevelData {
    level: CfgPlayerLevelDataLevel[];
    other: CfgPlayerLevelDataOther[];
    head: CfgPlayerLevelDataHead[];
    head_icon: CfgPlayerLevelDataHeadIcon[];
}

export let CfgPlayerLevelData: _CfgPlayerLevelData = null;
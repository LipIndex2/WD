import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/Rapid_returns_auto";

export function _CreateCfgRapidReturns(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgRapidReturns = <_CfgRapidReturns>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgRapidReturns", CfgRapidReturns);
        func(err == null);
    })
}

class Cfgreturn {
    barrier_id: number;
    gold_return: number;
    exp_return: number;
}

class CfgReturnNow {
    barrier_id: number;
    gold_return: number;
    exp_return: number;
}

export class CfgGetPrice {
    time: number;
    get_item: number;
    get_price: number;
}

class CfgOther {
    unlock: number;
    get_time_max: number;
}

class _CfgRapidReturns {
    return: Cfgreturn[];
    return_now: CfgReturnNow[];
    get_price: CfgGetPrice[];
    other: CfgOther[];
}

export let CfgRapidReturns: _CfgRapidReturns = null;
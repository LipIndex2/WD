import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";

const resPath = "config/Gold_rate_auto";

export function _CreateCfgBattleCoinRate(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgBattleCoinRate = <_CfgBattleCoinRateData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgBattleCoinRate", CfgBattleCoinRate);
        func(err == null);
    })
}

export class CfgCoinRate{
    barrier_type:number;
    round_id:number;
    gold_rate:number;
}
class _CfgBattleCoinRateData {
    gold_rate: CfgCoinRate[];
}

export let CfgBattleCoinRate: _CfgBattleCoinRateData = null;
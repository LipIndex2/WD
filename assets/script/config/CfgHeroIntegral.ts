
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/hero_integral_list_auto";

export function _CreateCfgHeroIntegral(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgHeroIntegral = <_CfgHeroIntegral>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgHeroIntegral", CfgHeroIntegral);
        func(err == null);
    })
}

class CfgHeroPoolIntegral {
    color: number;
    level: number;
    hero_integral: number;
}

class _CfgHeroIntegral {
    hero_pool_integral: CfgHeroPoolIntegral[];
}

export let CfgHeroIntegral: _CfgHeroIntegral = null;
import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/piggy_auto";

export function _CreateCfgPiggy(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgPiggy = <_CfgPiggy>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgPiggy", CfgPiggy);
        func(err == null);
    })
}

export class CfgPiggyData{
    seq:number;
    price:number;
    dia_max:number;
    dia_buy:number;
}

export class CfgOther{
    give_item:number;
    unlock_level:number;
}

class _CfgPiggy {
    piggy: CfgPiggyData[];
    other: CfgOther[];
}

export let CfgPiggy: _CfgPiggy = null;
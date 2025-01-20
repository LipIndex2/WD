import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/grow_pass_auto";

export function _CreateCfgGrowPass(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgGrowPass = <_CfgGrowPass>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgGrowPass", CfgGrowPass);
        func(err == null);
    })
}

export class CfgGrowPassSet {
    seq: number;
    type: number;
    level: number;
    reward1: number;
    reward_num1: number;
    reward2: number;
    reward_num2: number;
    reward3: number;
    reward_num3: number;
}

class CfgGrowPassPay {
    
}

class CfgOther {
    unlock: number;
    item_num_all: number;
    item_num_all2: number;
    price1: number;
    price2: number;
}

class _CfgGrowPass {
    grow_pass_set: CfgGrowPassSet[];
    grow_pass_pay: CfgGrowPassPay[];
    other: CfgOther[];
}

export let CfgGrowPass: _CfgGrowPass = null;
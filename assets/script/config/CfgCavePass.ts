import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/cave_pass_auto";

export function _CreateCfgCavePass(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgCavePass = <_CfgCavePass>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgCavePass", CfgCavePass);
        func(err == null);
    })
}

class CfgCavePassSet {
    seq: number;
    meters: number;
    free_item: CfgItem;
    paid_item: CfgItem;
    time_seq: number;
}

class CfgOther {
    max_after_meters: number;
    max_item: CfgItem;
    pay_price: number;
    high_price: number;
    unlock_item: CfgItem;
}

class CfgTimestamp {
    time_seq: number;
    time_stamp: number;
}

class _CfgCavePass {
    pass_check_set: CfgCavePassSet[];
    other: CfgOther[];
    time_stamp: CfgTimestamp[];
}

export let CfgCavePass: _CfgCavePass = null;
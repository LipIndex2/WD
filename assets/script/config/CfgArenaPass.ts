import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/arena_pass_auto";

export function _CreateCfgArenaPass(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgArenaPass = <_CfgArenaPass>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgCavePass", CfgArenaPass);
        func(err == null);
    })
}

class CfgArenaPassSet {
    seq: number;
    time_seq: number;
    level: number;
    up_exp: number;
    free_item: CfgItem;
    paid_item: CfgItem;
}

class CfgOther {
    level_max: number;
    max_after_exp: number;
    max_item: CfgItem;
    pass_exp_item: number;
    pay_price: number;
    unlock_item: CfgItem;
}

class CfgTimestamp {
    time_seq: number;
    time_stamp: number;
}

class _CfgArenaPass {
    round_pass_set: CfgArenaPassSet[];
    other: CfgOther[];
    time_stamp: CfgTimestamp[];
}

export let CfgArenaPass: _CfgArenaPass = null;
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/fish_pass_auto";

export function _CreateCfgFishPass(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgFishPass = <_CfgFishPass>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgFishPass", CfgFishPass);
        func(err == null);
    })
}

class CfgFishPassSet {
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

class _CfgFishPass {
    pass_check_set: CfgFishPassSet[];
    other: CfgOther[];
    time_stamp: CfgTimestamp[];
}

export let CfgFishPass: _CfgFishPass = null;
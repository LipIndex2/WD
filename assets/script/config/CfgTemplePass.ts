import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/temple_pass_auto";

export function _CreateCfgTemplePass(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgTemplePass = <_CfgTemplePass>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgTemplePass", CfgTemplePass);
        func(err == null);
    })
}

export class CfgTemplePassRoundPassSet {
    seq: number;
    time_seq: number;
    item_num: number;
    reward1: number;
    reward_num1: number;
    reward2: number;
    reward_num2: number;
    reward3: number;
    reward_num3: number;
}

class CfgOther {
    price1: number;
    price2: number;
    item_id: number;
    unlock_item: CfgItem;
}

class CfgTimestamp {
    time_seq: number;
    time_stamp: number;
    out_res_id: string;
    out_top_word: string;
    out_down_word: string;
    inside_res_id: string;
}

class _CfgTemplePass {
    round_pass_set: CfgTemplePassRoundPassSet[];
    other: CfgOther[];
    time_stamp:CfgTimestamp[];
}

export let CfgTemplePass: _CfgTemplePass = null;
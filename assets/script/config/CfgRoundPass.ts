import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/round_pass_auto";

export function _CreateCfgRoundPass(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgRoundPass = <_CfgRoundPass>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgRoundPass", CfgRoundPass);
        func(err == null);
    })
}

export class CfgRoundPassSet {
    seq: number;
    level: number;
    reward1: number;
    reward_num1: number;
    reward2: number;
    reward_num2: number;
    reward3: number;
    reward_num3: number;
    time_seq: number;
}

class CfgOther {
    hero_id: number;
    price1: number;
    price2: number;
    unlock_item: CfgItem;
}

class CfgTimestamp {
    time_seq: number;
    time_stamp: number;
    hero_id: number;
    out_res_id: string;
    out_top_word: string;
    out_down_word: string;
    inside_res_id: string;
    main_icon: string;
}

class _CfgRoundPass {
    round_pass_set: CfgRoundPassSet[];
    other: CfgOther[];
    time_stamp: CfgTimestamp[];
}

export let CfgRoundPass: _CfgRoundPass = null;
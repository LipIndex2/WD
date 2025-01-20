import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/backyard_pass_auto";

export function _CreateCfgDefensePassCheck(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgDefensePassCheck = <_CfgDefensePassCheck>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgDefensePassCheck", CfgDefensePassCheck);
        func(err == null);
    })
}

export class CfgDefensePassCheckSet {
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
    price1: number;
    price2: number;
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

class _CfgDefensePassCheck {
    round_pass_set: CfgDefensePassCheckSet[];
    other: CfgOther[];
    time_stamp: CfgTimestamp[];
}

export let CfgDefensePassCheck: _CfgDefensePassCheck = null;
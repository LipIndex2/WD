import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/zombie_rush_pass_auto";

export function _CreateCfgZombieRushPass(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgZombieRushPass = <_CfgZombieRushPass>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgZombieRushPass", CfgZombieRushPass);
        func(err == null);
    })
}

export class CfgZombieRushPassSet {
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

class _CfgZombieRushPass {
    round_pass_set: CfgZombieRushPassSet[];
    other: CfgOther[];
    time_stamp: CfgTimestamp[];
}

export let CfgZombieRushPass: _CfgZombieRushPass = null;
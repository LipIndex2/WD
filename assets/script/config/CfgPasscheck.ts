import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/passcheck_auto";

export function _CreateCfgPasscheck(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgPasscheck = <_CfgPasscheck>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgPasscheck", CfgPasscheck);
        func(err == null);
    })
}

class CfgPassCheckSet {
    seq: number;
    level: number;
    up_exp: number;
    free_item: CfgItem;
    paid_item: CfgItem;
    time_seq: number;
}

class CfgOther {
    unlock: number;
    unlock_item: CfgItem;
    level_max: number;
    max_after_exp: number;
    max_item: CfgItem;
    pass_exp_item: number;
    pay_price1: number;
    pay_price2: number;
    pay_price2_add_level: number;
    high_price: number;
}

class CfgTimestamp {
    time_seq: number;
    time_stamp: number;
    hero_small_icon: number;
    out_res_id: string;
    out_top_word: string;
    out_down_word: string;
    inside_res_id: string;
}

class _CfgPasscheck {
    pass_check_set: CfgPassCheckSet[];
    other: CfgOther[];
    time_stamp: CfgTimestamp[];
}

export let CfgPasscheck: _CfgPasscheck = null;
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/ceremony_act_auto";

export function _CreateCfgCeremonyAct(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgCeremonyAct = <_CfgCeremonyAct>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgCeremonyAct", CfgCeremonyAct);
        func(err == null);
    })
}

class CfgMissionList {
    seq: number;
    time_seq: number;
    day: number;
    type: number;
    word: string;
    pram: number;
    item: CfgItem[];
}

class CfgReward {
    seq: number;
    time_seq: number;
    item_id: number;
    item_num: number;
    exchange_num: number;
    quota_type: number;
    quota_num: number;
}

class CfgOther {
    item_exchange: number;
    time: number;
    name: string;
    time1: number;
}

class CfgTimestamp {
    time_seq: number;
    time_stamp: number;
    out_res_id: string;
    out_top_word: string;
    out_down_word: string;
    inside_res_id: string;
    main_icon: string;
    name: string;
}

class _CfgCeremonyAct {
    mission_list: CfgMissionList[];
    reward: CfgReward[];
    other: CfgOther[];
    time_stamp: CfgTimestamp[];
}

export let CfgCeremonyAct: _CfgCeremonyAct = null;
import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/Raffle_auto";

export function _CreateCfgRaffle(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgRaffle = <_CfgRaffle>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgRaffle", CfgRaffle);
        func(err == null);
    })
}

class CfgJackpot {
    time_seq: number;
    seq: number;
    UP_or_not: number;
    itme_id: number;
    item_num: number;
    rate: number;
}
class CfgMission {
    time_seq: number;
    day: number;
    mis_seq: number;
    mis_type: number;
    mis_des: string;
    param_1: number;
    param_2: number;
    reward_item: CfgItem[];
}
class CfgPack {
    time_seq: number;
    seq: number;
    item: CfgItem[];
    price: number;
    limit_num: number;
}
class CfgTimetemp {
    time_stamp: number;
    seq: number;
    activity_name: string;
}

class CfgOther {
    extract_item1: CfgItem[];
    extract_item2: CfgItem[];
    ten_extract_item1: CfgItem[];
    ten_extract_item2: CfgItem[];
    guarantees_min_num: number;
}

class _CfgRaffle {
    Jackpot: CfgJackpot[];
    mission: CfgMission[];
    pack: CfgPack[];
    timetemp: CfgTimetemp[];
    other: CfgOther[];
}

export let CfgRaffle: _CfgRaffle = null;
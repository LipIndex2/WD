import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/farm_auto";

export function _CreateCfgFarm(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgFarm = <_CfgFarm>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgFarm", CfgFarm);
        func(err == null);
    })
}

export class CfgGreenhouse {
    flowerpot_seq: number;
    hero_id: number;
    mood1_min: number;
    mood1_max: number;
    mood1_gift: CfgItem[];
    mood2_min: number;
    mood2_max: number;
    mood2_gift: CfgItem[];
    mood3_min: number;
    mood3_max: number;
    mood3_gift: CfgItem[];
    mood4_min: number;
    mood4_max: number;
    mood4_gift: CfgItem[];
    maturation_time: number;
}

class CfgShop {
    page: number;
    seq: number;
    money_item: number;
    price1: number;
    num1: number;
    price2: number;
    num2: number;
    price3: number;
    num3: number;
    price4: number;
    num4: number;
    price5: number;
    num5: number;
    reward_item: number;
    reward_param: number;
}

class CfgGrow {
    stage: number;
    up_time: number;
}

class CfgFriend {
    hero_id: number;
    item_myself: CfgItem[];
    item_other: CfgItem[];
}

class CfgOther {
    machine_item1: CfgItem[];
    machine_item2: CfgItem[];
    machine_item3: CfgItem[];
    mood_min: number;
    mood_max: number;
    mood_up: number;
}

class _CfgFarm {
    greenhouse: CfgGreenhouse[];
    shop: CfgShop[];
    grow: CfgGrow[];
    friend: CfgFriend[];
    other: CfgOther[];
}

export let CfgFarm: _CfgFarm = null;
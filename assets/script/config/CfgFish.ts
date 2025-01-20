import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/fish_auto";

export function _CreateCfgFish(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgFish = <_CfgFish>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgFish", CfgFish);
        func(err == null);
    })
}

class CfgFishFishInfo {
    fish_id: number;
    type: number;
    name: string;
    quality: number;
    item_id: number;
    escape_rate: number;
    break_rate: number;
    min_length: number;
    length1: number;
    rate1: number;
    reward1: CfgItem[];
    length2: number;
    rate2: number;
    reward2: CfgItem[];
    length3: number;
    rate3: number;
    reward3: CfgItem[];
    length4: number;
    rate4: number;
    reward4: CfgItem[];
    length5: number;
    rate5: number;
    reward5: CfgItem[];
    exp: number;
    score: number;
    res_id: number;
    scale: number;
}

class CfgFishToolInfo {
    tool_id: number;
    level: number;
    effect: number;
    pram: number;
    item_id: number;
    num: number;
    dec: string;
    res_id: number;
    show_item: number;
}

class CfgFishToolImage {
    image_id: number;
    image_name: string;
    jihuo_item: number;
    image_type: number;
    image_effect: number;
    parm: number;
    dec: string;
    res_id: number;
    show_item: number;
    fish_cion: number;
}

class CfgFishBaitInfo {
    bait_id: number;
    item_id: number;
    bait_effect: number;
    parm1: number;
    parm2: number;
}

class CfgFishFisherLevel {
    level: number;
    exp: number;
    level_add: number;
}

class CfgFishIslandInfo {
    island_id: number;
    island_name: string;
    unlock_level: number;
    fish_id: number;
    rate: number;
    res_id: number;
}

class CfgFishShop {
    seq: number;
    item_id: number;
    num1: number;
    coin_id: number;
    num2: number;
    record_index: number;
    buy_limit: number;
}

class CfgFishTujian {
    seq: number;
    page: number;
    page_name: string;
    group_id: number;
    group_name: string;
    group_content: string;
    reward: CfgItem[];
}

class CfgFishDailyOrder {
    order_id: number;
    order_name: string;
    min_level: number;
    max_level: number;
    order_type: number;
    parm1: number;
    parm2: number;
    order_star: number;
    rate: number;
    reward: CfgItem[];
    dec: string;
    icon: number
}

class CfgFishOther {
    bread_id: number;
    bread_time: number;
    bread_max: number;
    bite_time: number;
    refresh_time: number;
    price: number;
    reward: number;
    daily_bread: number;
    daily_refresh: number;
    vip_bite_time: number;
    fish_coin: number;
}

class CfgFishRandPoint {
    type: number;
    point_id: number;
    pos_x: number;
    pos_y: number;
}


class _CfgFish {
    fish_info: CfgFishFishInfo[];
    tool_info: CfgFishToolInfo[];
    tool_image: CfgFishToolImage[];
    bait_info: CfgFishBaitInfo[];
    fisher_level: CfgFishFisherLevel[];
    island_info: CfgFishIslandInfo[];
    shop: CfgFishShop[];
    tujian: CfgFishTujian[];
    daily_order: CfgFishDailyOrder[];
    other: CfgFishOther[];
    rand_point: CfgFishRandPoint[];
}

export let CfgFish: _CfgFish = null;
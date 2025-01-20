import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/arena_daily_gift_auto";

export function _CreateCfgArenaDailyGift(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgArenaDailyGift = <_CfgArenaDailyGift>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgArenaDailyGift", CfgArenaDailyGift);
        func(err == null);
    })
}

class CfgPack {
    seq: number;
    item: CfgItem[];
    price: number;
    limit_num: number;
}

class CfgOther {
    name: string;
}

class _CfgArenaDailyGift {
    gift_list: CfgPack[];
    other: CfgOther[];
}

export let CfgArenaDailyGift: _CfgArenaDailyGift = null;
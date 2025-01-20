import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/daily_buy_auto";

export function _CreateCfgDailyBuy(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgDailyBuyData = <_CfgDailyBuyData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgDailyBuyData", CfgDailyBuyData);
        func(err == null);
    })
}

class CfgDailyBuyDataDailyBuy {
    seq: number;
    color: number;
    color_num: number;
    buy_item: number;
    buy_item_num: number;
    rate: number;
}

class CfgDailyBuyDataOther {
    daily_num: number;
    re_item: number;
    re_item_num: number;
    re_item_num_up: number;
}

class _CfgDailyBuyData {
    daily_buy: CfgDailyBuyDataDailyBuy[];
    other: CfgDailyBuyDataOther[];
}

export let CfgDailyBuyData: _CfgDailyBuyData = null;
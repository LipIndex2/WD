import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/shop_box_auto";

export function _CreateCfgShopBox(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgShopBoxData = <_CfgShopBoxData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgShopBoxData", CfgShopBoxData);
        func(err == null);
    })
}

class CfgShopBoxDataShopBox {
    box_type: number;
    box_level: number;
    box_item: CfgItem[];
    color1_num: number;
    color2_num: number;
    color3_num: number;
    open_exp: number;
}

class CfgShopBoxDataBoxLevel {
    box_level: number;
    up_need_exp: number;
}

class CfgShopBoxDataBoxPrice {
    box_type: number;
    buy_item_id1: number;
    buy_item_num1: number;
    buy_item_id2: number;
    buy_item_num2: number;
}

class CfgShopBoxDataOther {
    box_level_max: number;
    color1_item: number;
    color2_item: number;
    color3_item: number;
}

class _CfgShopBoxData {
    shop_box: CfgShopBoxDataShopBox[];
    box_level: CfgShopBoxDataBoxLevel[];
    box_price: CfgShopBoxDataBoxPrice[];
    other: CfgShopBoxDataOther[];
}

export let CfgShopBoxData: _CfgShopBoxData = null;
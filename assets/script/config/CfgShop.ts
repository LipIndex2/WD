import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/shop_cfg_auto";

export function _CreateCfgShop(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgShopData = <_CfgShopData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgShopData", CfgShopData);
        func(err == null);
    })
}

class CfgShopDataShop {
    index: number;
    item_id: number;
    item_num: number;
    exchange_item_id: number;
    exchange_item_num: number;
    quota_type: number;
    param: number;
    page: number;
}

export class CfgRMBShop {
    page: number;
    index: number;
    item: CfgItem[];
    price: number;
    quota_type: number;
    param: number;
}

class CfgShopDataOther {
    box_level_max: number;
}

class _CfgShopData {
    shop: CfgShopDataShop[];
    shop_rmb: CfgRMBShop[];
    // other: CfgShopDataOther[];
}

export let CfgShopData: _CfgShopData = null;
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/shop_gift_auto";

export function _CreateCfgShopGift(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgShopGift = <_CfgShopGift>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgShopGift", CfgShopGift);
        func(err == null);
    })
}

class CfgShopGiftData {
    type: number;
    seq: number;
    name: string;
    reward_item: CfgItem[];
    price: number;
    unlock_type: number;
    unlock_pram: number;
    discount: string;
}

class CfgOther {
    live_time: number;
}
class _CfgShopGift {
    shop_gift: CfgShopGiftData[];
    other: CfgOther[];
}

export let CfgShopGift: _CfgShopGift = null;
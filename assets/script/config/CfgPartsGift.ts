import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/parts_gift_auto";

export function _CreateCfgPartsGift(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgPartsGift = <_CfgPartsGiftData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgPartsGift", CfgPartsGift);
        func(err == null);
    })
}

class CfgGift {
    seq: number;
    gift_name: string;
    item: CfgItem[];
    price: number;
    discount: number;
    rate: number;
}

class CfgOther {
    live_time: number;
    cooling_time: number;
}

class _CfgPartsGiftData {
    parts_gift: CfgGift[];
    other: CfgOther[];
}

export let CfgPartsGift: _CfgPartsGiftData = null;
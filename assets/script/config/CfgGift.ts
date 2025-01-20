import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/item/gift_auto";

export function _CreateCfgGift(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgGift = <{ [item_id: number]: CfgDefGift }>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgGift", CfgGift);
        func(err == null);
    })
}

export class CfgDefGift {
    id: number;
    name: string;
    item_type: number;
    gift_type: number;
    color: number;
    item_num: number;
    rand_num: number;
    icon_id: number;
}

export let CfgGift: { [item_id: number]: CfgDefGift } = null;
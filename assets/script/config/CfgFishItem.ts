import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/item/fish_auto";

export function _CreateCfgFishItem(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgFishItemData = <{ [item_id: number]: CfgFishItem }>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgFishItemData", CfgFishItemData);
        func(err == null);
    })
}

export class CfgFishItem {
    id: number;
    name: string;
    item_type: number;
    show_type: number;
    is_virtual: number;
    color: number;
    sellprice: number;
    pile_limit: number;
    isdroprecord: number;
    invalid_time: number;
    param: number;
    item_level: number;
    description: string;
    use_msg: string;
    icon_id: number;
    get_way: string;
    show_red: number;
    mod_key: number;
    get_the_source: number;
    use: string;
    special_effects: string;
}

export let CfgFishItemData: { [item_id: number]: CfgFishItem } = null;
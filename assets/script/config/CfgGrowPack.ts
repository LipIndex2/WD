import { CfgItem } from "./CfgCommon";
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/grow_pack_auto";

export function _CreateCfgGrowPack(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgGrowPack = <_CfgGrowPack>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgGrowPack", CfgGrowPack);
        func(err == null);
    })
}

class CfgGiftConfigure {
    seq: number;
    reward_item: CfgItem[];
    price: number;
    res_id1: string;
    res_id2: string;
    discount: string;
}

class CfgOther {
    duration_time: number;
    pack_num_max: number;
}

class _CfgGrowPack {
    gift_configure: CfgGiftConfigure[];
    other: CfgOther[];
}

export let CfgGrowPack: _CfgGrowPack = null;
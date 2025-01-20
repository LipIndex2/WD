
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/new_pack_auto";

export function _CreateCfgNewPack(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgNewPack = <_CfgNewPack>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgNewPack", CfgNewPack);
        func(err == null);
    })
}

class CfgGiftConfigure {
    seq: number;
    price: number;
    pack_gift: CfgItem[];
    discount: string;
}

class _CfgNewPack {
    gift_configure: CfgGiftConfigure[];
}

export let CfgNewPack: _CfgNewPack = null;
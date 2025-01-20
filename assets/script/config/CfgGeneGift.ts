
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/dna_new_pack_auto";

export function _CreateCfgGeneGift(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgGeneGift = <_CfgGeneGift>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgGeneGift", CfgGeneGift);
        func(err == null);
    })
}

class CfgGeneNewPack {
    seq: number;
    price: number;
    pack_gift: CfgItem[];
    discount: string;
}

class _CfgGeneGift {
    dna_new_pack: CfgGeneNewPack[];
}

export let CfgGeneGift: _CfgGeneGift = null;
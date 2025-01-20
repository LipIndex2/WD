import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/item/random_dna_auto";

export function _CreateCfgRandomDna(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgRandomDna = <{ [item_id: number]: CfgRandomDnaData }>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgRandomDna", CfgRandomDna);
        func(err == null);
    })
}

export class CfgRandomDnaData {
    id: number;
    name: string;
    item_type: number;
    item_race: string;
    dna_type: string;
    fixed_att: string;
    dna_color: string;
    color: number;
    sellprice: number;
    item_level: number;
    icon_id: number;
    description: string;
}

export let CfgRandomDna: { [item_id: number]: CfgRandomDnaData } = null;
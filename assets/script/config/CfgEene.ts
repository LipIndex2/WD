import { CfgItem } from './CfgCommon';
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/item/gene_auto";

export function _CreateCfgEene(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgEene = <{ [item_id: number]: CfgEeneData }>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgEene", CfgEene);
        func(err == null);
    })
}

export class CfgEeneData {
    id: number;
    name: string;
    item_type: number;
    fixed_type: string;
    fixed_att: string;
    unfixed_type: number;
    unfixed_att: number;
    skill_id: string;
    level_up_id: number;
    color: number;
    sellprice: number;
    item_level: number;
    icon_id: number;
    param: number;
    description: string;
}

export let CfgEene: { [item_id: number]: CfgEeneData } = null;
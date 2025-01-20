
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/word_des_auto";

export function _CreateCfgWordDes(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgWordDes = <_CfgWordDes>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgWordDes", CfgWordDes);
        func(err == null);
    })
}

export class CfgWord {
    index: number;
    name: string;
    word: string;
}

class _CfgWordDes {
    word: CfgWord[];
}

export let CfgWordDes: _CfgWordDes = null;
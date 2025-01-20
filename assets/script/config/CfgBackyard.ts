import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";

const resPath = "config/backyard_auto";

export function _CreateCfgBackyard(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgBackyard = <_CfgBackyardData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgBackyard", CfgBackyard);
        func(err == null);
    })
}

class CfgBackyardLevel {
    color: number;
    level: number;
    stage: number;
}

class _CfgBackyardData {
    level: CfgBackyardLevel[];
}

export let CfgBackyard: _CfgBackyardData = null;
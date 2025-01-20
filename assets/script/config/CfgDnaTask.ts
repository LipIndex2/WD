import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/dna_guide_auto";

export function _CreateCfgDnaTask(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgDnaTask = <_CfgDnaTask>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgDnaTask", CfgDnaTask);
        func(err == null);
    })
}

class CfgDnaMission {
    seq: number;
    type: number;
    describe: string;
    pram1: number;
    pram2: number;
    suc: CfgItem[];
}

class _CfgDnaTask {
    dna_mission: CfgDnaMission[];
}

export let CfgDnaTask: _CfgDnaTask = null;
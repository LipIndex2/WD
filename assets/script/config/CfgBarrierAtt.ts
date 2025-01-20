import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";

const resPath = "config/Barrier_att_auto";

export function _CreateCfgBarrierAtt(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgBarrierAtt = <_CfgBarrierAttData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgBarrierAtt", CfgBarrierAtt);
        func(err == null);
    })
}

export class CfgBarrierAttInfo {
    barrier_id: number;
    stage_id: number;
    hp_add: number;
}

class _CfgBarrierAttData {
    barrier_att: CfgBarrierAttInfo[];
}

export let CfgBarrierAtt: _CfgBarrierAttData = null;
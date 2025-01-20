import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/randactivityopencfg_auto";

export function _CreateCfgRandactivityopen(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgRandactivityopen = <_CfgRandactivityopen>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgRandactivityopen", CfgRandactivityopen);
        func(err == null);
    })
}

class CfgRandactivityopenBaseDay {
    activity_type: number;
    begin_day: string;
    end_day: string;
}


class _CfgRandactivityopen {
    base_on_day_cfg: CfgRandactivityopenBaseDay[];
}

export let CfgRandactivityopen: _CfgRandactivityopen = null;
import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";

const resPath = "config/funopen_auto";

export function _CreateCfgFunOpen(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgFunOpen = <_CfgFunOpenData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgFunOpen", CfgFunOpen);
        func(err == null);
    })
}

class CfgFunOpenData {
    seq: number;
    client_id: number | string;
    class_name: string
    name: string
    open_barrier: number
    open_level: number
    interface: number
}

class _CfgFunOpenData {
    funopen: CfgFunOpenData[];
}

export let CfgFunOpen: _CfgFunOpenData = null;
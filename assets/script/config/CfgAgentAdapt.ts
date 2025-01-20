import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/agent_adapt_auto";

export function _CreateCfgAgentAdapt(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgAgentAdapt = <_CfgAgentAdapt>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgAgentAdapt", CfgAgentAdapt);
        func(err == null);
    })
}

class CfgAgentAdaptAgentAdapt {
    spid: string;
    spid_diff: number;
    game_name: string;
    yxq_xs: number;
    yqhy_xs: number;
}

class _CfgAgentAdapt {
    agent_adapt: CfgAgentAdaptAgentAdapt[];
}

export let CfgAgentAdapt: _CfgAgentAdapt = null;
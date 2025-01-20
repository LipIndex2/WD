import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/activity_main_auto";

export function _CreateCfgActivityMain(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgActivityMain = <_CfgActivityMain>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgActivityMain", CfgActivityMain);
        func(err == null);
    })
}

class CfgMainActivity {
    seq: number;
    mod_key: number;
    text: string;
    act_id: number;
    is_open: number;
    gather_icon: number;
    icon_location: number;
    over_special_effect_id: string;
    icon: string;
    param: number;
}

class _CfgActivityMain {
    main_activity: CfgMainActivity[];
}

export let CfgActivityMain: _CfgActivityMain = null;
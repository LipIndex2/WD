
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/game_circle_auto";

export function _CreateCfgGameCircle(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgGameCircle = <_CfgGameCircle>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgGameCircle", CfgGameCircle);
        func(err == null);
    })
}

class CfgNew {
    item: CfgItem[];
}

class CfgSignIn {
    ceq: string;
    day: string;
    item: CfgItem[];
}

class _CfgGameCircle {
    new: CfgNew[];
    sign_in: CfgSignIn[];
}

export let CfgGameCircle: _CfgGameCircle = null;
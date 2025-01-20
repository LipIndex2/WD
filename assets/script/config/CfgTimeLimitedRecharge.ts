import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/Time_limited_recharge_auto";

export function _CreateCfgTimeLimitedRecharge(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgTimeLimitedRecharge = <_CfgTimeLimitedRecharge>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgTimeLimitedRecharge", CfgTimeLimitedRecharge);
        func(err == null);
    })
}

class CfgTimeLimited {
    seq: number;
    task_dec: string;
    recharge: number;
    pack_gift: CfgItem[];
}

class CfgOther {
    describe: string;
}

class _CfgTimeLimitedRecharge {
    Time_limited: CfgTimeLimited[];
    other: CfgOther[];
}

export let CfgTimeLimitedRecharge: _CfgTimeLimitedRecharge = null;
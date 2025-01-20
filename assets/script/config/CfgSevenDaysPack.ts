import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/seven_days_pack_auto";

export function _CreateCfgSevenDaysPack(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgSevenDaysPack = <_CfgSevenDaysPack>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgSevenDaysPack", CfgSevenDaysPack);
        func(err == null);
    })
}

class CfgSevenDaysPackData {
    seq: number;
    recharge: number;
    start_day: number;
    end_day: number;
    pack_gift1: CfgItem[];
    pack_gift2: CfgItem[];
}

class CfgOther {
    title: number;
    describe: number;
}

class _CfgSevenDaysPack {
    seven_days_pack: CfgSevenDaysPackData[];
    other: CfgOther[];
}

export let CfgSevenDaysPack: _CfgSevenDaysPack = null;
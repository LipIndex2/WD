import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/sevenday_auto";

export function _CreateCfgSevenday(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgSevenday = <_CfgSevenday>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgSevenday", CfgSevenday);
        func(err == null);
    })
}

class CfgSevenDayData {
    stage: number;
    day: number;
    seq: number;
    pram1: number;
    pram2: number;
    word: string;
    suc1: CfgItem[];
    suc2: CfgItem[];
}

class CfgSevenGift {
    type: number;
    seq: number;
    stage_item: number;
    stage_need: number;
    stage: CfgItem[];
    show: number;
}

class CfgOther {
    unlock: number;
    day: number;
}

class _CfgSevenday {
    seven_day: CfgSevenDayData[];
    seven_gift: CfgSevenGift[];
    other: CfgOther[];
}

export let CfgSevenday: _CfgSevenday = null;
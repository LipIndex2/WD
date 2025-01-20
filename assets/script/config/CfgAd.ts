import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/ad_cfg_auto";

export function _CreateCfgAd(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgAdData = <_CfgAdData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgAdData", CfgAdData);
        func(err == null);
    })
}

export class CfgAdDataAdType {
    seq: number;
    ad_type: number;
    ad_flag: number;
    ad_name: string;
    ad_award: CfgItem[];
    interval: number;
    ad_param: number;
    level: number;
    up_ad: number;
    param: number;
    view: number;
    lw3_view: number;
    dy1_view: number;
}

class CfgAdDataOther {
    cd_time: number;
}

class _CfgAdData {
    ad_type: CfgAdDataAdType[];
    other: CfgAdDataOther[];
}

export let CfgAdData: _CfgAdData = null;
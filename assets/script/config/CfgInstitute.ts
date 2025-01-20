import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/institute_auto";

export function _CreateCfgInstitute(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgInstitute = <_CfgInstituteData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgInstitute", CfgInstitute);
        func(err == null);
    })
}

export class CfgInstituteLevel {
    line_id: number;
    talent_id: number;
    talent_id_front: number;
    talent_type: number;
    level: number;
    param: number;
    up_item: CfgItem[];
    up_time: number;
    end_item: CfgItem[];
    res_id: number;
    color: number;
    describe: string;
    battle_show: number;
}

class CfgInstituteOther {
    ad_end_time: number;
}

class _CfgInstituteData {
    talent: CfgInstituteLevel[];
    other: CfgInstituteOther[];
}

export let CfgInstitute: _CfgInstituteData = null;
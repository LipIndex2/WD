
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/privilege_auto";

export function _CreateCfgPrivilege(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgPrivilege = <_CfgPrivilege>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgPrivilege", CfgPrivilege);
        func(err == null);
    })
}

class CfgPrivilegeInfo {
    seq: number;
    price: number;
    privilege_name: string;
    item: CfgItem[];
}

class _CfgPrivilege {
    privilege_info: CfgPrivilegeInfo[];
}

export let CfgPrivilege: _CfgPrivilege = null;
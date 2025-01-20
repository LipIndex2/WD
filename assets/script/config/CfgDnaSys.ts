import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/dna_sys_auto";

export function _CreateCfgDnaSys(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgDnaSys = <_CfgDnaSys>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgDnaSys", CfgDnaSys);
        func(err == null);
    })
}

class CfgDnaAll {
    dna_id: number;
    dna_type: number;
    id: number;
    hero_id: number;
    att_unfixed: number;
    dna_name: string;
    up: CfgItem[];
}

class CfgDnaSkill {
    dna_id: number;
    suit_name: string;
    skill_2: number;
    skill_4: number;
    skill_5: number;
    res_id: number;
}

class CfgDnaSell {
    color: number;
    level: number;
    sell_num: number;
}

class CfgOther {
    dna_sell_id: number;
}

class _CfgDnaSys {
    dna_all: CfgDnaAll[];
    dna_skill: CfgDnaSkill[];
    dna_sell: CfgDnaSell[];
    other: CfgOther[];
}

export let CfgDnaSys: _CfgDnaSys = null;
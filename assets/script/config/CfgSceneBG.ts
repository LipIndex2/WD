import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";

const resPath = "config/Changjing_auto";

export function _CreateCfgSceneBG(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgSceneBG = <_CfgSceneBGData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgSceneBG", CfgSceneBG);
        func(err == null);
    })
}

// 主线关卡背景
export class CfgSceneMainBG{
    stage_res_id:number;
    up_res_id:string;
    down_res_id:string;
    gezi1_id:string;
    gezi2_id:string;
    gezi3_id:string;
    left_res_id:string;
    right_res_id:string;
    small_res_id:string;
    def_id:string;
    defeat_id:number;
}

// 竞技场关卡背景
export class CfgSceneArenaBG{
    stage_res_id:number;
    up_res_id:string;
    down_res_id:string;
    gezi1_id:string;
    gezi2_id:string;
    gezi3_id:string;
    def_id:string;
    defeat_id:number;
    show_res_id:string;
    battle_res_id:number;
}

class _CfgSceneBGData {
    changjing: CfgSceneMainBG[];
    changjing_arena: CfgSceneArenaBG[];
}

export let CfgSceneBG: _CfgSceneBGData = null;
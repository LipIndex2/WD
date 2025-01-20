import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";

const resPath = "config/begin_auto";

export function _CreateCfgBattleGuide(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgBattleGuide = <_CfgBattleGuideData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgBattleGuide", CfgBattleGuide);
        func(err == null);
    })
}

export class CfgGuideHeroInfo{
    seq:number;
    x_pos:number;
    y_pos:number;
    hero_id:number;
    stage:number;
}

export class CfgGuideStap{
    seq:number;
    guide_id:number;
    step_param_1:string|number;
    step_param_2:string|number;
    step_param_3:string|number;
    word:string;
    word_pos:string;
}

export class CfgGuideSkillInfo{
    seq:number;
    entry1:number;
    entry2:number;
    entry3:number;
}
class _CfgBattleGuideData {
    position: CfgGuideHeroInfo[];
    step: CfgGuideStap[];
    entry: CfgGuideSkillInfo[];
}

export let CfgBattleGuide: _CfgBattleGuideData = null;

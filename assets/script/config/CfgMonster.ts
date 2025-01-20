import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";

const resPath = "config/monster_auto";

export function _CreateCfgMonster(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgMonster = <_CfgMonsterData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgMonster", CfgMonster);
        // changeSkill(CfgMonster);
        func(err == null);
    })
}

export function changeSkill(_CfgMonsterData: _CfgMonsterData) {
    _CfgMonsterData.monster_page.forEach(ctrlList => {
        let skill: string = ctrlList.skill as any;
        let ar_skill = skill.split(",");
        ctrlList.skill = [];
        ar_skill.forEach(element => {
            ctrlList.skill.push(element[0]);
        });
    });

}

export class CfgMonsterData {
    monster_id: number;
    name: string;
    monster_word: string;
    res_id: number;
    speed_min: number;
    speed_max: number;
    hp: number;
    attack: number;
    size_min: number;
    size_max: number;
    skill: string[];
    physics_def: number;
    water_def: number;
    dark_def: number;
    poison_def: number;
    fire_def: number;
    soil_def: number;
    control_def: number | string;
    monster_type: number;
    describe_type: number | string;
    boss_dec1: string;
    boss_dec2: string;
}

export class CfgMonsterSkillData {
    skill_id: number;
    skill_type: number;
    parm1: number;
    parm2: number;
    parm3: number;
    parm4: number;
    parm5: number;
    parm6: number;
    parm7: number;
}

class _CfgMonsterData {
    monster_page: CfgMonsterData[];
}
export let CfgMonster: _CfgMonsterData = null;

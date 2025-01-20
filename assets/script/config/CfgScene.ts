import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgMonsterData, CfgMonsterSkillData } from "./CfgMonster";
import { SceneType } from "modules/Battle/BattleConfig";

var resPath = "config/Main_${res_id}_auto";

export function GetSceneCfgPath(id: number, type: SceneType = SceneType.Main): string {
    if(type == SceneType.Main){
        return `config/Main_${id}_auto`;
    }else if(type == SceneType.Coin){
        return `config/Gold_${id}_auto`;
    }else if(type == SceneType.Fragment){
        return `config/Debries_${id}_auto`;
    }else if(type == SceneType.DayChallenge){
        return `config/Challenge_${id}_auto`;
    }else if(type == SceneType.RunRunRun){
        return `config/rush_${id}_auto`;
    }else if(type == SceneType.ShenDian){
        return `config/temple_${id}_auto`;
    }else if(type == SceneType.Defense){
        return `config/backyard_${id}_auto`;
    }else if(type == SceneType.Virtual){
        return `config/hero_trial_${id}_auto`;
    }else if(type == SceneType.Arena){
        return `config/arena_${id}_auto`;
    }
    return `config/Main_${id}_auto`;
}

//回合配置
export class CfgSceneRound {
    round_id: number;
    out_time: number;
    out_speed: number;
    monster_id: number;
    monster_exp: number;
    monster_num: number;
    ctrl_type: number;
    initia_steps: number;
}
//阶段配置
export class CfgSceneStage {
    stage_id: number;
    round_id: string;
    res_id: number;
    public_entry_id: number;
    win_entry_id: number;
    green_entry_id: number;
    blue_entry_id: number;
    purple_entry_id: number;
}

export class CfgSceneBarrier {
    stage_seq: number;
    stage_id: number;
}

//战斗等级
export class CfgSceneBattleLevel {
    battle_level: number;
    battle_exp: number;
}

export class CfgSceneOther {
    barrier_id: number;
}

//特殊地形
export class CfgSpeBlock{
    pos_i: number;
    pos_j: number;
    block_type: number;
    pram: number;
    pram2: number;
    describe: number;
    trigger_type: number;
    view: number;
    res_id: number|string;
}

export class CfgSceneData {
    round: CfgSceneRound[];
    stage: CfgSceneStage[];
    barrier: CfgSceneBarrier[];
    other: CfgSceneOther[];
    battle_level: CfgSceneBattleLevel[];
    monster_page: CfgMonsterData[];
    monster_skill: CfgMonsterSkillData[];
    spe_block: CfgSpeBlock[];
}
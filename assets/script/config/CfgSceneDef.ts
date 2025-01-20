import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgSceneBarrier, CfgSceneBattleLevel, CfgSpeBlock } from "./CfgScene";
import { CfgMonsterData, CfgMonsterSkillData } from "./CfgMonster";

// 地板位置
export class CfgSceneBlockPosDef{
    stage_id:number;
    pos_i:number;
    pos_j:number;
    block_type:number;
}

// 回合
export class CfgSceneRoundDef{
    round_id: number;
    out_time: number;
    out_speed: number;
    monster_id: number;
    monster_exp: number;
    monster_num: number;
    ctrl_type: number;
    initia_steps: number;
    route_id: number;
}

//阶段配置
export class CfgSceneStageDef{
    stage_id: number;
    round_id: string;
    res_id: number;
    public_entry_id: number;
}

//路径配置
export class CfgSceneRoute{
    route_id:number;
    route_i_j:string;
}

export class CfgSceneDefData {
    block_pos: CfgSceneBlockPosDef[];
    round: CfgSceneRoundDef[];
    stage: CfgSceneStageDef[];
    barrier: CfgSceneBarrier[];
    battle_level: CfgSceneBattleLevel[];
    monster_page: CfgMonsterData[];
    monster_skill: CfgMonsterSkillData[];
    spe_block: CfgSpeBlock[];
    monster_way: CfgSceneRoute[];
}
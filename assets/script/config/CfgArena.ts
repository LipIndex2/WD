import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/arena_auto";

export function _CreateCfgArena(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgArena = <_CfgArenaData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgArena", CfgArena);
        func(err == null);
    })
}

//段位
export class CfgArenaRank{
    seq: number;
    rank: number;
    rank_order: number;
    rank_describe:string;
    rank_points: number;
    vic_points: number;
    def_points: number;
    rank_reward: CfgItem[];
    rank_icon: string;
}

//排名奖励
export class CfgArenaRankReward{
    seq: number;
    rank_max: number;
    rank_min: number;
    item_list: CfgItem[];
}

//商店
export class CfgArenaShop{
    seq: number;
    money_item: CfgItem[];
    reward_item: CfgItem[];
    reward_param: number;
    buy_num: number;
}

//机器人
export class CfgArenaRobot{
    seq: number;
    robot_rank: number;
    robot_name: number;
    robot_hero: string;
    robot_hero_level: string;
    buff_type:string;
    buff_param:string;
    robot_skill_id: number;
    robot_level: number;
    robot_icon: number;
    skin_id:number;
}

//时间戳
export class CfgArenaTimestamp{
    time_seq: number;
    time_stamp: number;
}

//阶数转换
export class CfgArenaChangeLevel{
    color: number;
    level: number;
    stage: number;
}

//英雄试用
export class CfgArenaFreeHero{
    time_seq: number;
    hero_id: string;
    hero_level: string;
}

//皮肤
export class CfgArenaSkin{
    seq: number;
    skin_name: string;
    stage_res_id: number;
    get_type: number;
    get_param1: number;
    get_param2: number;
    gain_des: string;
    gain_type: number;
    gain_param: number;
    unlock_type: string;
    spe_icon: number;
    have_time: number;
    index: number;
}


export class CfgArenaOther {
    challenge_item_id: number;
    challenge_item_num: number;
    challenge_item_price: number;
    players_num: number;
    pub_skill_id: string;
    institute_skill_id: string;
    challenge_item_buy_max:number;
}

class _CfgArenaData {
    rank:CfgArenaRank[];
    rank_reward:CfgArenaRankReward[];
    shop:CfgArenaShop[];
    robot:CfgArenaRobot[];
    time_stamp:CfgArenaTimestamp[];
    change_level:CfgArenaChangeLevel[];
    free_hero:CfgArenaFreeHero[];
    pvp_skin: CfgArenaSkin[];
    other: CfgArenaOther[];
}

export let CfgArena: _CfgArenaData = null;
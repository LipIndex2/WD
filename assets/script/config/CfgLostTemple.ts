
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/lost_temple_auto";

export function _CreateCfgLostTemple(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgLostTemple = <_CfgLostTemple>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgLostTemple", CfgLostTemple);
        func(err == null);
    })
}

class CfgTempleDifficulty {
    difficulty: number;
    storey: number;
    line: number;
    block: number;
    event_type: number;
    event_id: number;
}

class CfgTempleBattle {
    event_id: number;
    barrier_id: number;
    item: CfgItem[];
    monster_id1: number;
    monster_id2: number;
}

class CfgMysteriousShop {
    event_id: number;
    item: CfgItem[];
    price_item: CfgItem[];
    buy_times: number;
}

class CfgRemains {
    event_id: number;
    remains_id: number;
    remains_name: number;
    remains_effect: number;
    random_max: number;
    skill_id: number;
    color: number;
}

class CfgBonfire {
    event_id: number;
    reply_type1: number;
    reply_pram1: number;
    reply_type2: number;
    reply_pram2: number;
    reply_type3: number;
    reply_pram3: number;
}

class CfgPub {
    event_id: number;
    hero_id1: number;
    hero_level1: number;
    hero_id2: number;
    hero_level2: number;
    hero_id3: number;
    hero_level3: number;
}

class CfgEndBox {
    event_id: number;
    item: CfgItem[];
}

class CfgTempleShop {
    seq: number;
    item: CfgItem[];
    price_item: CfgItem[];
    buy_times: number;
}

class CfgMission {
    seq: number;
    type: number;
    describe: string;
    pram1: number;
    pram2: number;
    suc: CfgItem[];
}

class CfgMissionReward {
    seq: number;
    stage_item: number;
    stage_need: number;
    stage: CfgItem[];
}

class CfgOther {
    mysterious_shop_time: number;
    restart_time: number;
}

export class CfgShenDianSkill{
    color: number;
    skill_id: number;
    word: number;
    pram1: number;
    pram2: number;
    skill_type: number;
    superposition: number;
}

class _CfgLostTemple {
    temple_difficulty: CfgTempleDifficulty[];
    temple_battle: CfgTempleBattle[];
    mysterious_shop: CfgMysteriousShop[];
    remains: CfgRemains[];
    bonfire: CfgBonfire[];
    pub: CfgPub[];
    end_box: CfgEndBox[];
    temple_shop: CfgTempleShop[];
    mission: CfgMission[];
    mission_reward: CfgMissionReward[];
    other: CfgOther[];
    remains_entry: CfgShenDianSkill[];
}

export let CfgLostTemple: _CfgLostTemple = null;
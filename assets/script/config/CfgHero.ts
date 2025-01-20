import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/hero_auto";

export function _CreateCfgHero(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgHero = <_CfgHeroData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgHero", CfgHero);
        func(err == null);
    })
}

export class CfgHeroAtt {
    hero_id: number;
    res_id: string;
    hero_level: number;
    upgrade: CfgItem[];
    upgrade2: CfgItem[];
    att_scope: number;
    att_distance: number;
    att: number;
    att_speed: number;
    blood_time: number;
    firing_time: number;
    catapult_num: number;
    xuanyun_time: number;
    hurt_time: number;
    methysis_time: number;
    moderate_time: number;
    moderate_effect: number;
    cold_time: number;
    skill: string;
    damage: number;
}

export class CfgHeroJiHuo {
    hero_id: number;
    hero_name: string;
    hero_color: number;
    hero_race: number;
    stage_all: number;
    jihuo: CfgItem[];
    unlock_type: number;
    jihuo_level: number;
    unlock: number;
    skill_all: string;
    ctrl_type: number;
    hero_word: string;
    level_max: number;
    hiden_skill: string;
    dna_unlock: number;
}

export class CfgHeroBattle {
    hero_id: number;
    stage: number;
    res_id: number | string;
    coefficients: number;
    bullet_res_id: number | string;
    bullet_hit_id: number | string;
    name: string;
}

export class CfgHeroBattleDayBuff {
    seq: number;
    hero_race: number
    gain_type: number;
    pram_min: number;
    pram_max: number;
}

class CfgHeroAttrOpen {
    time_stamp: number;
    open_barrier: number
    open_level: number;
    real_att: number;
}

class _CfgHeroData {
    hero_att: CfgHeroAtt[];
    hero_jihuo: CfgHeroJiHuo[];
    battle_info: CfgHeroBattle[];
    today_gain: CfgHeroBattleDayBuff[];
    attr_open: CfgHeroAttrOpen[];
}

export let CfgHero: _CfgHeroData = null;
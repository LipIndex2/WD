import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/Daily_Challenge_auto";

export function _CreateCfgDailyChallenge(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgDailyChallengeData = <_CfgDailyChallengeData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgDailyChallengeData", CfgDailyChallengeData);
        func(err == null);
    })
}

class CfgDailyChallengeDataChallengeBoss {
    seq: number;
    rule_id1: number;
    rule_id2: number;
    mission_id1: number;
    win1: CfgItem[];
    mission_id2: number;
    win2: CfgItem[];
    mission_id3: number;
    win3: CfgItem[];
    barrier_id: number;
    hero_id1: number;
    hero_level1: number;
    hero_id2: number;
    hero_level2: number;
    hero_id3: number;
    hero_level3: number;
    hero_id4: number;
    hero_level4: number;
    monster_id1: number;
    monster_id2: number;
}

class CfgDailyChallengeDataOther {
    ulock_: number;
}

export class CfgDailyChallengeDataChallengesRule {
    rule_id: number;
    rule_type: number;
    rule_word: string;
    pram1: number;
    pram2: number;
    pram3: number;
    pram4: number;
}

class CfgDailyChallengeDataChallengesMissions {
    mission_id: number;
    mission_type: number;
    mission_word: string;
    pram1: number;
    pram2: number;
    pram3: number;
    pram4: number;
}

class _CfgDailyChallengeData {
    Challenge_Boss: CfgDailyChallengeDataChallengeBoss[];
    other: CfgDailyChallengeDataOther[];
    challenges_rule: CfgDailyChallengeDataChallengesRule[];
    challenges_missions: CfgDailyChallengeDataChallengesMissions[];
}

export let CfgDailyChallengeData: _CfgDailyChallengeData = null;
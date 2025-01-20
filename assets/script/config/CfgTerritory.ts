import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/territory_auto";

export function _CreateCfgTerritory(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgTerritory = <_CfgTerritory>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgTerritory", CfgTerritory);
        func(err == null);
    })
}

class CfgTerritoryOther {
    max_refresh: number;
    max_rizhi: number;
    min_refresh_time: number;
    max_refresh_time: number;
    other_territory: number;
    other_territory_refresh: number;
    grid_max: number;
    grid_centre: number;
    bug_monster_item: number;
    monster_num: number;
    max_num: number;
    near_territory: number;
    re_item: number;
    re_item_num1: number;
    re_item_num2: number;
    re_time: number;
    re_cd_time: number;
}

class CfgTerritoryItemInformation {
    seq: number;
    item_id: number;
    item_name: string;
    item_num: number;
    item_level: number;
    max_monster: number;
    speed: number;
    myself_decrease_time: number;
    enemy_decrease_time: number;
    refresh_min: number;
    refresh_max: number;
    icon: number;
}

class CfgTerritoryBuyMonster {
    buy_monster: number;
    bug_price: number;
}

class CfgTerritoryMonsterEfficiency {
    seq: number;
    num: number;
    efficiency: number;
}

class CfgTerritoryTerritoryRate {
    rate_group: number;
    item_seq: number;
    rate: number;
}

class CfgTerritoryRobortTerritory {
    robort_num: number;
    robort_name: string;
    robort_rate: number;
    territory_level: number;
    robort_icon: number;
}

class _CfgTerritory {
    other: CfgTerritoryOther[];
    item_information: CfgTerritoryItemInformation[];
    buy_monster: CfgTerritoryBuyMonster[];
    monster_efficiency: CfgTerritoryMonsterEfficiency[];
    territory_rate: CfgTerritoryTerritoryRate[];
    robort_territory: CfgTerritoryRobortTerritory[];
}

export let CfgTerritory: _CfgTerritory = null;
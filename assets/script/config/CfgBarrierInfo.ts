import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/Barrier_info_auto";

export function _CreateCfgBarrierInfo(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgBarrierInfoData = <_CfgBarrierInfoData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgBarrierInfoData", CfgBarrierInfoData);
        func(err == null);
    })
}

class CfgBarrierInfoDataMainInfo {
    barrier_id: number;
    barrier_name: string;
    power_spend: number;
    round_max: number;
    barrier_icon: number;
    version: number;
}

class CfgBarrierInfoDataMainItemInfo {
    seq: number;
    barrier_id: number;
    round_num: number;
    win: CfgItem[];
}

class CfgBarrierInfoDataGoldInfo {
    barrier_id: number;
    barrier_name: string;
    first_win: CfgItem[];
    win: CfgItem[];
    power_spend: number;
    version: number;
}

class CfgBarrierInfoDataDebriesInfo {
    barrier_id: number;
    barrier_name: string;
    first_win: CfgItem[];
    win: CfgItem[];
    power_spend: number;
    version: number;
}

class CfgBarrierInfoDataChallengeInfo {
    barrier_id: number;
    power_spend: number;
    version: number;
}

class CfgBarrierInfoDataRushInfo {
    barrier_id: number;
    barrier_name: string;
    first_win: CfgItem[];
    win: CfgItem[];
    daily_fight_times: number;
    power_spend: number;
    weakness: string;
    parm: number;
}

class CfgBarrierInfoDataRushItemInfo {
    seq: number;
    kill_num: number;
    win: CfgItem[];
}

class CfgBarrierInfoDataOther {
    gold_open_day: string;
    debries_open_day: string;
    daily_fight_times: number;
}

class CfgBarrierInfoDefenseHomeInfo{
    barrier_id: number;
    barrier_name: string;
    win: CfgItem[];
    daily_fight_times: number;
}

export class CfgBarrierInfoDefenseHomeReward{
    seq: number;
    day_num: number;
    win: CfgItem[];
}

class _CfgBarrierInfoData {
    Main_info: CfgBarrierInfoDataMainInfo[];
    Main_item_info: CfgBarrierInfoDataMainItemInfo[];
    Gold_info: CfgBarrierInfoDataGoldInfo[];
    Debries_info: CfgBarrierInfoDataDebriesInfo[];
    rush_info: CfgBarrierInfoDataRushInfo[];
    rush_item_info: CfgBarrierInfoDataRushItemInfo[];
    Challenge_info: CfgBarrierInfoDataChallengeInfo[];
    backyard_info: CfgBarrierInfoDefenseHomeInfo[];
    backyard_item_info: CfgBarrierInfoDefenseHomeReward[];
    other: CfgBarrierInfoDataOther[];
}

export let CfgBarrierInfoData: _CfgBarrierInfoData = null;
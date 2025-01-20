import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/mining_cave_auto";

export function _CreateCfgMining(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgMining = <_CfgMiningData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgMining", CfgMining);
        func(err == null);
    })
}

//初始地形
export class CfgMiningBeginClod{
    seq: number;
    block_type: number;
}

//地形概率
export class CfgMiningClodRate{
    clod_type: number;
    clod_rate: number;
    clod_num_min: number;
    excavations_num: number;
}

//地形道具
export class CfgMiningClodItem{
    clod_type: number;
    clod_item: CfgItem;
    clod_item_rate: number;
}

//米数奖励
export class CfgMiningMetersReward{
    seq: number;
    meters: number;
    reward: CfgItem[];
}

//特殊行
export class CfgMiningSpeLine{
    line: number;
    block: number;
    block_type: number;
}


export class CfgMiningOther {
    excavate_id: number;
    red_dia_id: number;
    excavate_num_max: number;
    excavate_reply_time: number;
    bit_id: number;
    bit_num_max: number;
    bomb_id: number;
    bomb_num_max: number;
}

class _CfgMiningData {
    begin_clod: CfgMiningBeginClod[];
    clod_rate: CfgMiningClodRate[];
    clod_item: CfgMiningClodItem[];
    meters_reward: CfgMiningMetersReward[];
    spe_line: CfgMiningSpeLine[];
    other: CfgMiningOther[];
}

export let CfgMining: _CfgMiningData = null;
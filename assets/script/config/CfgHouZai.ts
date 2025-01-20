import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";

const resPath = "config/houzhai_auto";

export function _CreateCfgHouZai(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgHouZai = <_CfgHouZaiData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgHouZai", CfgHouZai);
        func(err == null);
    })
}

export class CfgHouZaiReward {
    seq: number;
    time_seq: number;
    block_num: number;
    level: number;
    item_type: number;
    item_id: number;
    item_num: number;
    price: number;
}

export class CfgHouZaiTime{
    time_seq: number;
    time_stamp: number;
    inside_res_id: number;
    main_icon: number;
}

class _CfgHouZaiData {
    reward_set: CfgHouZaiReward[];
    time_stamp: CfgHouZaiTime[];
}

export let CfgHouZai: _CfgHouZaiData = null;
import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/cultivate_auto";

export function _CreateCfgCultivate(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgCultivate = <_CfgCultivate>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgCultivate", CfgCultivate);
        func(err == null);
    })
}

class CfgCultivateMission {
    seq: number;
    mission_type: number;
    mis_seq: number;
    describe: string;
    param1: number;
    param2: number;
    item: CfgItem[];
}

class CfgCultivateData {
    seq: number;
    item: CfgItem[];
}
class CfgCultivateReward {
    gift_seq: number;
    seq: string;
    item: CfgItem[];
}
class CfgShop {
    seq: number;
    money_item: CfgItem[];
    reward_item: CfgItem[];
    buy_num: number;
}
class CfgOther {
    shop_item_id: number;
    cultivate_item_id: number;
    progress_bar_times: number;
    bar_item: CfgItem[];
    resetting_times: number;
    mis_des: string;
    cultivate_des: string;
    reward_des: string;
    act_tittle: string;
}

class _CfgCultivate {
    mission: CfgCultivateMission[];
    cultivate: CfgCultivateData[];
    cultivate_reward: CfgCultivateReward[];
    shop: CfgShop[];
    other: CfgOther[];
}

export let CfgCultivate: _CfgCultivate = null;
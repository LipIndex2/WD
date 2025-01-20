import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/ceremony_gift_auto";

export function _CreateCfgCeremonyGift(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgCeremonyGift = <_CfgCeremonyGift>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgCeremonyGift", CfgCeremonyGift);
        func(err == null);
    })
}

class CfgGiftList {
    seq: number;
    time_seq: number;
    item: CfgItem[];
    price: number;
    limit_num: number;
}

class CfgOther {
    name: string;
}

class CfgTimestamp {
    time_seq: number;
    time_stamp: number;
    out_res_id: string;
    out_top_word: string;
    out_down_word: string;
    inside_res_id: string;
    main_icon: string;
}

class _CfgCeremonyGift {
    gift_list: CfgGiftList[];
    other: CfgOther[];
    time_stamp: CfgTimestamp[];
}

export let CfgCeremonyGift: _CfgCeremonyGift = null;
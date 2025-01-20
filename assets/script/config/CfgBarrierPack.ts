
import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { CfgItem } from "./CfgCommon";

const resPath = "config/barrier_pack_auto";

export function _CreateCfgBarrierPack(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgBarrierPack = <_CfgBarrierPack>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgBarrierPack", CfgBarrierPack);
        func(err == null);
    })
}

class CfgPackSet {
    seq: number;
    price: number;
    unlock_barrier: number;
    res_id1: string;
    res_id2: string;
    pack_gift: CfgItem[];
    fake_price: number;
    discount: string;
}


class _CfgBarrierPack {
    pack_set: CfgPackSet[];
}

export let CfgBarrierPack: _CfgBarrierPack = null;
import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/dna_targeted_gift_auto";

export function _CreateCfgGeneOrientation(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgGeneOrientation = <_CfgGeneOrientation>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgGeneOrientation", CfgGeneOrientation);
        func(err == null);
    })
}

class CfgGift {
    hero_id: number;
    price: number;
    item: CfgItem[];
    discount: number;
    res_id1: string;
    res_id2: string;
}
class CfgOther {
    live_time: number;
    cooling_time: number;
    live_num_max: number;
}


class _CfgGeneOrientation {
    gift: CfgGift[];
    other: CfgOther[];
}

export let CfgGeneOrientation: _CfgGeneOrientation = null;
/* (检查以下，然后删除注释)
    1.改resPath路径
    2.CfgManager注册
    3.可选 从表把字段名那行复制下来，粘贴后每个一行，Alt+鼠标左键，选中多个批量加类型，格式化文档。
*/
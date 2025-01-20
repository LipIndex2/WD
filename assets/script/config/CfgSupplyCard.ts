import { JsonAsset } from "cc";
import { Debugger } from "core/Debugger";
import { ResManager } from "manager/ResManager";

const resPath = "config/supply_card_auto";

export function _CreateCfgSupplyCard(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgSupplyCardData = <_CfgSupplyCardData>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgSupplyCardData", CfgSupplyCardData);
        func(err == null);
    })
}

class CfgSupplyCardDataSupplyCard {
    speed: number;
    attack: number;
    attack_speed: number;
    all_time: number;
    att_skill: number;
    spe_skill: number;
}

class CfgSupplyCardDataSupplyCardPay {
    price: number;
    pay_item: number;
    pay_item_num: number;
}

class CfgSupplyCardDataOther {
    unlock: number;
}

class CfgSupplyCardDataHero {
    seq: number;
    item_id: number;
    item_id_num: number;
}

class _CfgSupplyCardData {
    supply_card: CfgSupplyCardDataSupplyCard[];
    supply_card_pay: CfgSupplyCardDataSupplyCardPay[];
    other: CfgSupplyCardDataOther[];
    hero: CfgSupplyCardDataHero[];
}

export let CfgSupplyCardData: _CfgSupplyCardData = null;
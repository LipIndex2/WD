import { JsonAsset } from "cc";
import { ResManager } from "manager/ResManager";
import { Debugger } from "core/Debugger";
import { CfgItem } from "./CfgCommon";

const resPath = "config/baozilaile_auto";

export function _CreateCfgInviteFriend(func: (suc: boolean) => void) {
    ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
        CfgInviteFriend = <_CfgInviteFriend>jsonAss.json;
        Debugger.ExportGlobalForDebug("CfgInviteFriend", CfgInviteFriend);
        func(err == null);
    })
}

class CfgReward {
    type: number;
    invitation_friend_num: number;
    reward_item: CfgItem[];
}

class _CfgInviteFriend {
    reward: CfgReward[];
}

export let CfgInviteFriend: _CfgInviteFriend = null;
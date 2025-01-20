import { LogError } from 'core/Debugger';
import { ViewManager } from 'manager/ViewManager';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { ITEM_SHOW_TYPE } from 'modules/common/CommonEnum';
import { FishGetFashionView } from 'modules/fish/FishGetFashionView';
import { RoleData } from 'modules/role/RoleData';
import { BagData } from './BagData';
import { BagNoticeBoxFun, BagNoticeFun, GET_TYPE, UnNoticeCommon } from './BagEnum';
import { Item } from './ItemData';

export enum KNAPSACK_REQ_TYPE {
    USE = 0,    // 使用 p1:id p2：num
    SELL = 1,   // 出售 P1:id p2：num
    SHI_ZHUANG_LEVEL_UP = 2,//时装升级 p1:id p2:0消耗物品1消耗钻石
    SHI_ZHUANG_USE = 3,//穿戴时装 p1:id
}

export class BagCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCGetItemNotice, func: this.OnGetItemNotice },
            { msgType: PB_SCKnapsackAllInfo, func: this.OnKnapsackAllInfo },
            { msgType: PB_SCKnapsackSingleInfo, func: this.OnKnapsackSingleInfo },
        ]
    }

    private OnGetItemNotice(protocol: PB_SCGetItemNotice) {
        LogError("OnGetItemNotice", protocol)
        RoleData.Inst().ShowRewardGet = true

        if (1 == protocol.itemList.length) {
            if (protocol.itemList[0] && ITEM_SHOW_TYPE.FISH_TOOL == Item.GetShowType(protocol.itemList[0].itemId)) {
                ViewManager.Inst().OpenView(FishGetFashionView, { reward_data: protocol.itemList[0] })
                return
            }
        }
        if (BagNoticeFun[protocol.getType]) {
            BagNoticeFun[protocol.getType](protocol);
        } else if (BagNoticeBoxFun[protocol.getType]) {
            BagNoticeFun[GET_TYPE.PUT_REASON_TRAFGIC_PERMIT](protocol);
        } else if (!UnNoticeCommon[protocol.getType]) {
            BagNoticeFun[GET_TYPE.common](protocol);
        }
    }

    private OnKnapsackAllInfo(protocol: PB_SCKnapsackAllInfo) {
        BagData.Inst().SetKnapsackAllInfo(protocol);
    }

    private OnKnapsackSingleInfo(protocol: PB_SCKnapsackSingleInfo) {
        BagData.Inst().SetKnapsackSingleInfo(protocol);
    }

    // 物品使用请求
    // param是一个数字数组，使用物品的场合是 id。数量，参数（目前是0）
    public SendCSKnapsackReq(type: KNAPSACK_REQ_TYPE, param: number[]) {
        LogError("?1500!SendCSKnapsackReq", type, param)
        let protocol = this.GetProtocol(PB_CSKnapsackReq);
        protocol.reqType = type;
        protocol.param = param
        this.SendToServer(protocol);
    }
}
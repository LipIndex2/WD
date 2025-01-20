import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { RoundActivityData } from './RoundActivityData';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class RoundActivityCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaRoundPassInfo, func: this.OnRoundPassInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.RoundActivity.View, RoundActivityData.Inst().FlushData, RoundActivityData.Inst().GetAllRed.bind(RoundActivityData.Inst()), "FlushInfo"));
    }

    private OnRoundPassInfo(data: PB_SCRaRoundPassInfo) {
        RoundActivityData.Inst().OnRoundPassInfo(data);
    }

    //领取奖励
    SendFetchReward(type: number, seq: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.RoundPack, 1, type, seq)
    }

    //一键领取
    SendOnKeyGet() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.RoundPack, 2)
    }

    SendBuyLevel() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.RoundPack, 3, 1)
    }
}


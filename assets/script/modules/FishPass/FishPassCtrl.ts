import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { FishPassData } from './FishPassData';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class FishPassCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaFishPassInfo, func: this.onFishPassInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.FishPass.View, FishPassData.Inst().FlushData, FishPassData.Inst().GetAllRed.bind(FishPassData.Inst()), "FlushInfo"));
    }

    private onFishPassInfo(data: PB_SCRaFishPassInfo) {
        FishPassData.Inst().onFishPassInfo(data)
    }

    //领取奖励
    SendFetchReward(type: number, level: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.FishPass, 1, type, level)
    }

    //一键领取
    SendOnKeyGet() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.FishPass, 2)
    }

    //额外奖励
    SendFetchEx() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.FishPass, 3)
    }

    SendBuyLevel() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.FishPass, 4, 1)
    }
}


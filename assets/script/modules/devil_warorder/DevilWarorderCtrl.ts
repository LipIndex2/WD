import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { RemindRegister, SMDHandle } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';
import { DevilWarOrderData } from './DevilWarorderData';
import { ActivityData } from 'modules/activity/ActivityData';

export class DevilWarorderCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCLostTempleItemInfo, func: this.OnLostTempleItemInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.DevilWarorder.View, DevilWarOrderData.Inst().FlushData, DevilWarOrderData.Inst().GetAllRed.bind(DevilWarOrderData.Inst()), "FlushInfo"));
        this.handleCollector.Add(SMDHandle.Create(ActivityData.Inst().result_data, DevilWarOrderData.Inst().CheckActStatus.bind(DevilWarOrderData.Inst()), "is_activity_status_change"))
    }

    private OnLostTempleItemInfo(data: PB_SCLostTempleItemInfo) {
        DevilWarOrderData.Inst().SetLostTempleItemInfo(data);
    }

    //领取奖励
    SendFetchReward(type: number, seq: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DevilWarorder, 1, type, seq)
    }

    //一键领取
    SendOnKeyGet() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DevilWarorder, 2)
    }

    SendBuyLevel() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DevilWarorder, 3, 1)
    }
}


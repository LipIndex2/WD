import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { CavePassData } from './CavePassData';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class CavePassCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaCavePassInfo, func: this.onCavePassInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.CavePass.View, CavePassData.Inst().FlushData, CavePassData.Inst().GetAllRed.bind(CavePassData.Inst()), "FlushInfo"));
    }

    private onCavePassInfo(data: PB_SCRaCavePassInfo) {
        CavePassData.Inst().onCavePassInfo(data)
    }

    //领取奖励
    SendFetchReward(type: number, level: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.CavePass, 1, type, level)
    }

    //一键领取
    SendOnKeyGet() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.CavePass, 2)
    }

    //额外奖励
    SendFetchEx() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.CavePass, 3)
    }

    SendBuyLevel() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.CavePass, 4, 1)
    }
}


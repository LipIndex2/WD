import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { ZombieRushPassData } from './ZombieRushPassData';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class ZombieRushPassCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCZombiGoGoGoPassInfo, func: this.OnZombieRushPassInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.ZombieRushPass.View, ZombieRushPassData.Inst().FlushData, ZombieRushPassData.Inst().GetAllRed.bind(ZombieRushPassData.Inst()), "FlushInfo"));
    }

    private OnZombieRushPassInfo(data: PB_SCZombiGoGoGoPassInfo) {
        ZombieRushPassData.Inst().OnZombieRushPassInfo(data);
    }

    //领取奖励
    SendFetchReward(type: number, seq: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.ZombieRushPass, 1, type, seq)
    }

    //一键领取
    SendOnKeyGet() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.ZombieRushPass, 2)
    }

    SendBuyLevel() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.ZombieRushPass, 3, 1)
    }
}


import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { LimitedRechargeData } from './LimitedRechargeData';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class LimitedRechargeCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaTimeLimitRechargeInfo, func: this.OnLimitedRechargeInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.LimitedRecharge.View, LimitedRechargeData.Inst().FlushData, LimitedRechargeData.Inst().GetAllRed.bind(LimitedRechargeData.Inst()), "FlushInfo"));
    }
   
    private OnLimitedRechargeInfo(data: PB_SCRaTimeLimitRechargeInfo) {
          LimitedRechargeData.Inst().OnLimitedRechargeInfo(data)
    }
    

}


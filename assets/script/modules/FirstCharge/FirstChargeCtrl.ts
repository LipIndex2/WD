import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { FirstChargeData } from './FirstChargeData';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class FirstChargeCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCFirstRechargeInfo, func: this.setFirstChargeInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.FirstCharge.View, FirstChargeData.Inst().FlushData, FirstChargeData.Inst().GetAllRed.bind(FirstChargeData.Inst()), "FlushInfo"));
    }

    private setFirstChargeInfo(data: PB_SCFirstRechargeInfo) {
        FirstChargeData.Inst().setFirstChargeInfo(data);
    }

    public SendFirstChargeReq() {
        let protocol = this.GetProtocol(PB_CSFirstRechargeOper);
        this.SendToServer(protocol);
    }

}


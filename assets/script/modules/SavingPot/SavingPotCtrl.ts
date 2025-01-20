import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { SavingPotData } from './SavingPotData';

export class SavingPotCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCMoneyBoxInfo, func: this.recvLoginResult }
        ]
    }


    private recvLoginResult(data: PB_SCMoneyBoxInfo) {
        SavingPotData.Inst().OnSavingPotInfo(data)
    }


}


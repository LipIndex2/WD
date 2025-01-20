import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { SevenDaysPackData } from './SevenDaysPackData';

export class SevenDaysPackCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCSevenDayGiftInfo, func: this.OnSevenDaysPackInfo }
        ]
    }

    private OnSevenDaysPackInfo(data: PB_SCSevenDayGiftInfo) {
        SevenDaysPackData.Inst().OnSevenDaysPackInfo(data)
    }


}


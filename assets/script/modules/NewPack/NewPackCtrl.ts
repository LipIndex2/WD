import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { NewPackData } from './NewPackData';

export class NewPackCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaNewbeeGiftInfo, func: this.OnNewPackInfo }
        ]
    }

    private OnNewPackInfo(data: PB_SCRaNewbeeGiftInfo) {
        NewPackData.Inst().OnNewPackInfo(data)
    }
   

}


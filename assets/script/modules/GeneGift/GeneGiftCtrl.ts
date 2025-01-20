import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { GeneGiftData } from './GeneGiftData';

export class GeneGiftCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaGeneNewbeeGiftInfo, func: this.OnGeneGiftInfo }
        ]
    }

    private OnGeneGiftInfo(data: PB_SCRaGeneNewbeeGiftInfo) {
        GeneGiftData.Inst().OnGeneGiftInfo(data)
    }

}

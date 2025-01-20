import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { GeneOrientationData } from './GeneOrientationData';

export class GeneOrientationCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaGeneGiftInfo, func: this.OnGeneOrientationInfo }
        ]
    }
    
    private OnGeneOrientationInfo(data: PB_SCRaGeneGiftInfo) {
        GeneOrientationData.Inst().OnGeneOrientationInfo(data)
    }

}


import { AdFreeData } from 'modules/AdFree/AdFreeData';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';

export class AdFreeCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCAdPassInfo, func: this.OnAdPassInfo }
        ]
    }

    private OnAdPassInfo(data: PB_SCAdPassInfo) {
        AdFreeData.Inst().setAdFreeInfo(data);
    }


}


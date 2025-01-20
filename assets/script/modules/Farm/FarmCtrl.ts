import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { FarmData } from './FarmData';

export class FarmCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            // { msgType: PB_SCTerritoryInfo, func: this.onFarmInfo }
        ]
    }

    private onFarmInfo(data: PB_SCTerritoryInfo) {
       FarmData.Inst().onFarmInfo(data)
    }


}


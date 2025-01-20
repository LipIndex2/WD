import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { HeroTrialData } from './HeroTrialData';

export class HeroTrialCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCHerotrialInfo, func: this.OnHeroTrialInfo }
        ]
    }

    private OnHeroTrialInfo(data: PB_SCHerotrialInfo) {
        HeroTrialData.Inst().OnHeroTrialInfo(data)
    }


}


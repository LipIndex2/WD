import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { MainLevelInfoData } from './MainLevelInfoData';

export class MainLevelInfoCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_MainFBPassInfo, func: this.setMainLevelInfo }
        ]
    }

    private setMainLevelInfo(data: PB_MainFBPassInfo) {
        MainLevelInfoData.Inst().setMainLevelInfo(data);
    }

}


import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { DefensePassCheckData } from './DefensePassCheckData';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class DefensePassCheckCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaBackYardPassInfo, func: this.OnDefensePassCheckInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.DefensePassCheck.View, DefensePassCheckData.Inst().FlushData, DefensePassCheckData.Inst().GetAllRed.bind(DefensePassCheckData.Inst()), "FlushInfo"));
    }

    private OnDefensePassCheckInfo(data: PB_SCRaBackYardPassInfo) {
        DefensePassCheckData.Inst().OnDefensePassCheckInfo(data);
    }

    //领取奖励
    SendFetchReward(type: number, seq: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DefensePassCheck, 1, type, seq)
    }

    //一键领取
    SendOnKeyGet() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DefensePassCheck, 2)
    }

}


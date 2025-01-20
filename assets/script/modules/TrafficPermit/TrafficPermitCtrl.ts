import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { TrafficPermitData } from './TrafficPermitData';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';

export class TrafficPermitCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaPassCheckInfo, func: this.onPassCheckInfo }
        ]
    }

    private onPassCheckInfo(data: PB_SCRaPassCheckInfo) {
        TrafficPermitData.Inst().onPassCheckInfo(data)
    }

    //info信息
    SendPassCheckInfo() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.PassCheck, 0)
    }

    //领取奖励
    SendFetchReward(type: number, level: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.PassCheck, 1, type, level)
    }

    //购买等级
    SendBuyLevel() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.PassCheck, 2, 1)
    }

    //满级宝箱
    SendMaxBox() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.PassCheck, 3)
    }

    //一键领取
    SendOnKeyGet() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.PassCheck, 4)
    }
}


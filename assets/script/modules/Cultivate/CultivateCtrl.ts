import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { CultivateData } from './CultivateData';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';

export class CultivateCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaFarminginfo, func: this.OnCultivateInfo },
            { msgType: PB_SCRaFarmingRet, func: this.OnCultivateOpenCell }
        ]
    }

    private OnCultivateInfo(data: PB_SCRaFarminginfo) {
        CultivateData.Inst().OnCultivateInfo(data)
    }

    private OnCultivateOpenCell(data: PB_SCRaFarmingRet) {
        CultivateData.Inst().OnCultivateOpenCell(data)
    }

    //领取任务奖励
    SendFetchTaskReward(type: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.Cultivate, 1, type)
    }

    //开格子
    SendOpenCell() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.Cultivate, 2)
    }

    //兑换道具
    SendShopItem(seq: number, num: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.Cultivate, 3, seq, num)
    }

    //左侧宝箱
    SendFetchBox() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.Cultivate, 4)
    }
}


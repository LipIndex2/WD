import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { OpenServiceSevenDayData } from './OpenServiceSevenDayData';
import { RemindRegister, SMDHandle } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';
import { BagData } from 'modules/bag/BagData';
import { SMDTriggerNotify } from 'data/SmartData';

export enum SevenDayType {
    INFO,//请求信息系
    TASK,//领取任务奖励
    STAGE,//领取阶段奖励
}

export class OpenServiceSevenDayCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SevenDayInfo, func: this.SevenDayInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.OpenServiceSevenDay.View, OpenServiceSevenDayData.Inst().FlushData, OpenServiceSevenDayData.Inst().GetAllRed.bind(OpenServiceSevenDayData.Inst()), "FlushInfo"));
        this.handleCollector.Add(SMDHandle.Create(BagData.Inst().BagItemData, this.BagNumChange.bind(this), "OtherChange"));
    }

    BagNumChange() {
        SMDTriggerNotify(OpenServiceSevenDayData.Inst().FlushData, "FlushInfo")
    }

    private SevenDayInfo(data: PB_SevenDayInfo) {
        OpenServiceSevenDayData.Inst().setSevenDayInfo(data);
    }

    public SendSevenDayReq(rep_type: SevenDayType, param?: number[]) {
        let protocol = this.GetProtocol(PB_SevenDayReq);
        protocol.operType = rep_type
        protocol.operParam = param ?? [];
        this.SendToServer(protocol);
    }

    public SendSevenDayReqInfo() {
        this.SendSevenDayReq(SevenDayType.INFO)
    }

    public SendSevenDayTaskReq(day: number, seq: number) {
        this.SendSevenDayReq(SevenDayType.TASK, [day, seq])
    }

    public SendSevenDayStageReq(seq: number) {
        this.SendSevenDayReq(SevenDayType.STAGE, [seq])
    }
}


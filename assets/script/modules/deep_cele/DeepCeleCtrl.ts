import { LogError } from 'core/Debugger';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { DeepCeleData } from './DeepCeleData';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class DeepCeleCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaItemBuyInfo, func: this.OnRaItemBuyInfo },
            { msgType: PB_SCRaTaskInfo, func: this.OnRaTaskInfo },
            { msgType: PB_SCRaTaskBuyInfo, func: this.OnRaTaskBuyInfo },
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.DeepCele.View, DeepCeleData.Inst().FlushData, DeepCeleData.Inst().GetAllTaskRed.bind(DeepCeleData.Inst()), "FlushTaskInfo"));
    }

    public OnRaItemBuyInfo(protocol: PB_SCRaItemBuyInfo) {
        LogError("OnRaItemBuyInfo", protocol)
        DeepCeleData.Inst().SetRaItemBuyInfo(protocol);
    }

    public OnRaTaskInfo(protocol: PB_SCRaTaskInfo) {
        LogError("OnRaTaskInfo", protocol)
        DeepCeleData.Inst().SetRaTaskInfo(protocol);
    }

    public OnRaTaskBuyInfo(protocol: PB_SCRaTaskBuyInfo) {
        LogError("OnRaTaskBuyInfo", protocol)
        DeepCeleData.Inst().SetRaTaskBuyInfo(protocol);
    }

    public SendTaskInfo() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DeepCele, 0)
    }

    public SendShopInfo() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DeepCele, 1)
    }

    public SendFetch(seq: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DeepCele, 2, seq)
    }

    public SendBuy(seq: number, num = 1) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DeepCele, 3, seq, num)
    }
}
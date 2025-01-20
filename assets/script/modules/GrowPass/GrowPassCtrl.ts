import { RoleData } from 'modules/role/RoleData';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { GrowPassData } from './GrowPassData';
import { RemindRegister, SMDHandle } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';
import { SMDTriggerNotify } from 'data/SmartData';

export enum GrowReqType {
    GROW_REWARD,//领取奖励
    GROW_ONKEYREWARD,//一键领取奖励
}

export class GrowPassCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCGrowthFundInfo, func: this.OnGrowPassInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.GrowPass.View, GrowPassData.Inst().FlushData, GrowPassData.Inst().GetAllRed.bind(GrowPassData.Inst()), "FlushInfo"));
        this.handleCollector.Add(SMDHandle.Create(RoleData.Inst().FlushData, this.LevelUpChange.bind(this), "FlushRoleInfo"));
    }

    LevelUpChange() {
        SMDTriggerNotify(GrowPassData.Inst().FlushData, "FlushInfo")
    }

    private OnGrowPassInfo(data: PB_SCGrowthFundInfo) {
        GrowPassData.Inst().setGrowPassInfo(data);
    }

    public SendGrowPassReq(rep_type: GrowReqType, param1?: number, param2?: number) {
        let protocol = this.GetProtocol(PB_CSGrowthFundReq);
        protocol.reqType = rep_type;
        protocol.p1 = param1 ?? 0;
        protocol.p2 = param2 ?? 0;
        this.SendToServer(protocol);
    }

    public SendGrowPassReward(type: number, seq: number) {
        this.SendGrowPassReq(GrowReqType.GROW_REWARD, type, seq);
    }

    //一键领取
    SendOnKeyGet() {
        this.SendGrowPassReq(GrowReqType.GROW_ONKEYREWARD)
    }
}


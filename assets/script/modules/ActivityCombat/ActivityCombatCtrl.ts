import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { ActivityCombatData } from './ActivityCombatData';
import { RemindRegister, SMDHandle } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { SMDTriggerNotify } from 'data/SmartData';
import { MainFBData } from 'modules/main_fb/MainFBData';
import { ZombieRushPassData } from 'modules/ZombieRushPass/ZombieRushPassData';
import { RemindCtrl } from 'modules/remind/RemindCtrl';
import { DBD_QUERY_PARAMS, DBDNet } from '../../DBDataManager/DBDNet';
import { RoleCtrl } from 'modules/role/RoleCtrl';
import { RoleData } from 'modules/role/RoleData';

export enum DailyReqType {
    OPER_TYPE_SWEEP,//扫荡
}

export class ActivityCombatCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_DailyFBInfo, func: this.onDailyFBInfo },
            { msgType: PB_SCZombieGoGoGoInfo, func: this.onZombieInfo },
        ]
    }

    protected initCtrl() {
        this.OnInits();
        this.handleCollector.Add(RemindRegister.Create(Mod.ActivityCombat.Zombie, ActivityCombatData.Inst().FlushData, ActivityCombatData.Inst().GetZombieRed.bind(ActivityCombatData.Inst()), "FlushZombieInfo"));

        this.handleCollector.Add(RemindRegister.Create(Mod.ActivityCombat.View, ActivityCombatData.Inst().FlushData, ActivityCombatData.Inst().GetAllRed.bind(ActivityCombatData.Inst()), "FlushZombieInfo", "FlushIsRemindShow"));
        this.handleCollector.Add(SMDHandle.Create(ZombieRushPassData.Inst().FlushData, this.ZombieRedChange.bind(this), "FlushInfo"));
    }

    private OnInits() {
        //监听红点
        RemindCtrl.Inst().RegisterGroup(Mod.ActivityCombat, () => { ActivityCombatData.Inst().FlushRedPoint() }, true)
    }

    ZombieRedChange() {
        SMDTriggerNotify(ActivityCombatData.Inst().FlushData, "FlushZombieInfo")
    }

    private onDailyFBInfo(data: PB_DailyFBInfo) {
        ActivityCombatData.Inst().onDailyFBInfo(data)
    }
    private onZombieInfo(data: PB_SCZombieGoGoGoInfo) {
        ActivityCombatData.Inst().onZombieInfo(data)
    }

    public SendDailyReq(rep_type: DailyReqType, param?: number[]) {
        let protocol = this.GetProtocol(PB_DailyFBOper);
        protocol.operType = rep_type; rep_type
        protocol.param = param ?? [];
        this.SendToServer(protocol);
    }

    public SendGrowPassReward(type: number, level: number, num: number) {
        this.SendDailyReq(DailyReqType.OPER_TYPE_SWEEP, [type, level, num]);
    }

    SendMission(seq: number) {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.ZombieGoGoGo, 1, seq)
    }

}


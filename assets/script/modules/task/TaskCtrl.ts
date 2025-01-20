import { LogError } from 'core/Debugger';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { Mod } from 'modules/common/ModuleDefine';
import { TaskConfig } from './TaskConfig';
import { TaskData } from './TaskData';

export class TaskCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCDailyTaskInfo, func: this.OnDailyTaskInfo },
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.Task.View, TaskData.Inst().FlushData, TaskData.Inst().GetAllRed.bind(TaskData.Inst()), "FlushInfo"));
        this.handleCollector.Add(RemindRegister.Create(Mod.Task.Daily, TaskData.Inst().FlushData, TaskData.Inst().GetDailyRed.bind(TaskData.Inst()), "FlushInfo"));
        this.handleCollector.Add(RemindRegister.Create(Mod.Task.Challenge, TaskData.Inst().FlushData, TaskData.Inst().GetChallengeRed.bind(TaskData.Inst()), "FlushInfo"));
    }

    public OnDailyTaskInfo(protocol: PB_SCDailyTaskInfo) {
        LogError("OnDailyTaskInfo", protocol)
        TaskData.Inst().SetDailyTaskInfo(protocol);
    }

    public SendDailyTaskReq(type: number, param: number[] = []) {
        let protocol = this.GetProtocol(PB_CSDailyTaskReq);
        protocol.reqType = type;
        protocol.p1 = param[0] ?? 0;
        this.SendToServer(protocol);
    }

    public SendDailyTaskReqFetch(index: number) {
        this.SendDailyTaskReq(TaskConfig.ReqType.fetch, [index]);
    }

    public SendDailyTaskReqAdNum() {
        this.SendDailyTaskReq(TaskConfig.ReqType.ad_num);
    }

    public SendDailyTaskReqTaskNum() {
        this.SendDailyTaskReq(TaskConfig.ReqType.task_num);
    }
}
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { ActivityCtrl } from 'modules/activity/ActivityCtrl';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';
import { DataBase } from 'data/DataBase';
import { CreateSMD, smartdata } from 'data/SmartData';
import { ActivityData } from 'modules/activity/ActivityData';
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { CfgArenaPass } from 'config/CfgArenaPass';
import { LogError } from 'core/Debugger';
import { ArenaData } from 'modules/Arena/ArenaData';

export class ArenaPassCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaArenaPassInfo, func: this.onPassInfo }
        ]
    }

    protected initCtrl() {
        //this.handleCollector.Add(RemindRegister.Create(Mod.CavePass.View, ArenaPassData.Inst().FlushData, ArenaPassData.Inst().IsRewardCanGet.bind(ArenaPassData.Inst()), "FlushInfo"));
    }

    private onPassInfo(data: PB_SCRaArenaPassInfo) {
        LogError("竞技场战令信息下发", data);
        ArenaPassData.Inst().onPassInfo(data);
        ArenaData.Inst().FlushRemind();
    }

    //info信息
    SendPassCheckInfo() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.ArenaPass, 0)
    }

    //领取奖励
    SendFetchReward(type: number, level: number, actType: ACTIVITY_TYPE = ACTIVITY_TYPE.ArenaPass) {
        ActivityCtrl.Inst().SendAngelReq(actType, 1, type, level)
    }

    //一键领取
    SendOnKeyGet(actType: ACTIVITY_TYPE = ACTIVITY_TYPE.ArenaPass) {
        ActivityCtrl.Inst().SendAngelReq(actType, 2)
    }

    //额外奖励
    SendFetchEx(actType: ACTIVITY_TYPE = ACTIVITY_TYPE.ArenaPass) {
        ActivityCtrl.Inst().SendAngelReq(actType, 3)
    }

    SendBuyLevel(actType: ACTIVITY_TYPE = ACTIVITY_TYPE.ArenaPass) {
        ActivityCtrl.Inst().SendAngelReq(actType, 4, 1)
    }
}

export class ArenaPassResultData {
    Info: PB_SCRaArenaPassInfo
}

export class ArenaPassFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class ArenaPassData extends DataBase {
    public ResultData: ArenaPassResultData;
    public FlushData: ArenaPassFlushData;

    get actType(): ACTIVITY_TYPE {
        return ACTIVITY_TYPE.ArenaPass;
    }

    public get fetchEx() {
        return this.Info ? this.Info.fetchExRewardCount : 0;
    }

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(ArenaPassFlushData);
        this.ResultData = new ArenaPassResultData()
    }

    public get Info() {
        if (!this.ResultData.Info) {
            ArenaPassCtrl.Inst().SendPassCheckInfo()
        }
        return this.ResultData.Info;
    }

    public onPassInfo(data: PB_SCRaArenaPassInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get TimestampSeq() {
        let start_time = ActivityData.Inst().GetStartStampTime(this.actType)
        let list = CfgArenaPass.time_stamp.slice().reverse()
        let co = list.find(cfg => start_time >= cfg.time_stamp)
        return co ? co.time_seq : 0
    }

    public get InfoList() {
        return this.Info ? this.Info.list : [];
    }

    public GeTimeStamp() {
        let seq = this.TimestampSeq
        return CfgArenaPass.time_stamp.find(cfg => cfg.time_seq == seq);
    }

    public getEndTime() {
        let time = ActivityData.Inst().GetEndStampTime(this.actType)
        return time;
    }

    //通行证等级
    public GetLevel() {
        return this.Info ? this.Info.level : 0;
    }

    //黄金通行证是否激活
    public GetIsActive(type: number = 1) {
        return this.InfoList[type] ? this.InfoList[type].isActive : false
    }

    public GetOtherCfg() {
        return CfgArenaPass.other[0]
    }

    //黄金通行证奖励
    public getGoldView() {
        let cfg = this.GetPasscheckCfg();
        let data: any[] = [];
        let prize: { [key: number]: number } = {};
        for (let i = 0; i < cfg.length; i++) {
            let item = cfg[i].paid_item;
            if (prize[item.item_id]) {
                prize[item.item_id] += item.num;
            } else {
                prize[item.item_id] = item.num;
            }
        }
        for (let k in prize) {
            data.push({ item_id: +k, num: prize[k] })
        }
        return data;
    }



    public IsGetReward(type: number, level: number) {
        return this.InfoList[type] ? this.InfoList[type].isFetch[level] : false
    }

    //通行证经验
    public getPasscheckExp() {
        return this.Info ? this.Info.score : 0;
    }

    //通行证
    public GetPasscheckCfg() {
        let seq = this.TimestampSeq
        return CfgArenaPass.round_pass_set.filter(cfg => cfg.time_seq == seq);;
    }

    public GetPasscheckMaxLevel() {
        let cfg = this.GetOtherCfg();
        return cfg.level_max;
    }

    //当前通行证奖励
    public GetPassNowPrize() {
        let cfg = this.GetPasscheckCfg();
        let data = [];
        data.push("");
        for (let i = 0; i < cfg.length; i++) {
            data.push(cfg[i]);
        }
        data.push(1);
        return data;
    }

    public scrollListNum() {
        let data = this.GetPasscheckCfg();
        let isActive = this.GetIsActive(1);
        let level = this.GetLevel();
        for (let i = 0; i < data.length; i++) {
            if (level >= data[i].level) {
                if (!this.IsGetReward(0, data[i].seq)) {
                    return i;
                }
                if (isActive && !this.IsGetReward(1, data[i].seq)) {
                    return i;
                }
            } else {
                return i;
            }
        }
        return data.length - 1;
    }

    //当前通行证等级配置
    public GetPasscheckLevelCfg(Level: number) {
        let max = this.GetPasscheckMaxLevel();
        let cfg = this.GetPasscheckCfg();
        if (Level > max) {
            return cfg[cfg.length - 1];
        }
        return cfg.find(cfg => {
            return cfg.level == Level;
        });
    }

    //当前通行证等级配置
    public IsLevelMax() {
        let max = this.GetPasscheckMaxLevel();
        let level = this.GetLevel();
        return level > max
    }

    //主界面图标
    public GetIsActiveOver() {
        let is_actOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.ArenaPass);
        let is_TrafficPermitOpen = FunOpen.Inst().GetFunIsOpen(Mod.ArenaPass.View);
        return is_TrafficPermitOpen.is_open && is_actOpen;
    }

    public IsRewardCanGet(): number {
        if (!this.GetIsActiveOver()) {
            return 0;
        }
        if (!FunOpen.Inst().checkAudit(1)) {
            return 0;
        }
        let datas = this.GetPasscheckCfg();
        let isActive = this.GetIsActive(1)
        for (let da of datas) {
            let level = this.GetLevel();
            if (level >= da.level) {
                if (!this.IsGetReward(0, da.seq)) {
                    return 1;
                }
                if (!this.IsGetReward(1, da.seq) && isActive) {
                    return 1;
                }
            }
        }
        return 0;
    }
}

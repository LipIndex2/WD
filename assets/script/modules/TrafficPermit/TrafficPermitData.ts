import { LogError } from 'core/Debugger';
import { CreateSMD, smartdata } from "data/SmartData";
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { Mod } from 'modules/common/ModuleDefine';
import { DataBase } from "../../data/DataBase";
import { CfgPasscheck } from './../../config/CfgPasscheck';
import { TrafficPermitCtrl } from './TrafficPermitCtrl';
import { TimeCtrl } from 'modules/time/TimeCtrl';

export class TrafficResultData {
    Info: PB_SCRaPassCheckInfo
}

export class TrafficFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class TrafficPermitData extends DataBase {
    public ResultData: TrafficResultData;
    public FlushData: TrafficFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(TrafficFlushData);
        this.ResultData = new TrafficResultData()
    }

    public get Info() {
        // if (!this.ResultData.Info) {
        //     TrafficPermitCtrl.Inst().SendPassCheckInfo()
        // }
        return this.ResultData.Info;
    }

    public onPassCheckInfo(data: PB_SCRaPassCheckInfo) {
        LogError("PB_SCRaPassCheckInfo", data)
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get TimestampSeq() {
        let start_time = ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.PassCheck)
        let list = CfgPasscheck.time_stamp.slice().reverse()
        let co = list.find(cfg => start_time >= cfg.time_stamp)
        return co ? co.time_seq : 0
    }

    public GeTimeStamp() {
        let seq = this.TimestampSeq
        return CfgPasscheck.time_stamp.find(cfg => cfg.time_seq == seq);
    }

    public getEndTime() {
        let date = new Date()
        let time = new Date(date.getFullYear(), date.getMonth() + 1, 1)
        return time.getTime() / 1000;
    }

    //通行证等级
    public GetLevel() {
        return this.Info ? this.Info.passCheckLevel : 0;
    }

    //黄金通行证是否激活
    public GetIsActive() {
        return this.Info ? this.Info.isActive : 0;
    }

    //通行证解锁1级需要的道具和价格
    public GetPassBuy() {
        return CfgPasscheck.other[0];
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
        if (type == 0) {
            return this.Info.fetchFlagList[0].fetchFlag[level]
        } else {
            return this.Info.fetchFlagList[1].fetchFlag[level]
        }
    }

    //通行证经验
    public getPasscheckExp() {
        return this.Info ? this.Info.passCheckExp : 0;
    }

    //通行证经验
    public IsGetItemLock(type: number, level: number) {
        let islock = false;
        let lv = this.GetLevel();
        let isActive = this.GetIsActive();
        if (lv < level) {
            islock = true;
        }
        if (type == 1 && isActive == 0) {
            islock = true;
        }
        return islock;
    }

    //通行证
    public GetHeroSmallIcon() {
        let seq = this.TimestampSeq
        return CfgPasscheck.time_stamp.find(cfg => cfg.time_seq == seq).hero_small_icon;
    }

    //通行证
    public GetPasscheckCfg() {
        let seq = this.TimestampSeq
        return CfgPasscheck.pass_check_set.filter(cfg => cfg.time_seq == seq);;
    }

    public GetPasscheckMaxLevel() {
        let cfg = this.GetPassBuy();
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
        let level = TrafficPermitData.Inst().GetLevel();
        for (let i = 0; i < data.length; i++) {
            if (!data[i]) continue;
            if (level >= data[i].level) {
                if (!TrafficPermitData.Inst().IsGetReward(0, data[i].level)) {
                    return i;
                }
                if (!TrafficPermitData.Inst().IsGetReward(1, data[i].level) &&
                    !TrafficPermitData.Inst().IsGetItemLock(1, data[i].level)) {
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
        let is_actOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.PassCheck);
        let is_TrafficPermitOpen = FunOpen.Inst().GetFunIsOpen(Mod.TrafficPermit.View);
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
        for (let da of datas) {
            let level = TrafficPermitData.Inst().GetLevel();
            if (level >= da.level) {
                if (!TrafficPermitData.Inst().IsGetReward(0, da.level) &&
                    !TrafficPermitData.Inst().IsGetItemLock(0, da.level)) {
                    return 1;
                }
                if (!TrafficPermitData.Inst().IsGetReward(1, da.level) &&
                    !TrafficPermitData.Inst().IsGetItemLock(1, da.level)) {
                    return 1;
                }
            }
        }
        return 0;
    }
}

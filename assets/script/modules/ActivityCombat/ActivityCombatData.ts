import { Language } from 'modules/common/Language';
import { LogError } from 'core/Debugger';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgBarrierInfoData } from 'config/CfgBarrierInfo';
import { GetCfgValue } from 'config/CfgCommon';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { LocalStorageHelper } from '../../helpers/LocalStorageHelper';
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { Mod } from 'modules/common/ModuleDefine';
import { BagData } from 'modules/bag/BagData';
import { CommonId, ITEM_BIG_TYPE } from 'modules/common/CommonEnum';
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { MainFBData } from 'modules/main_fb/MainFBData';
import { RemindCtrl } from 'modules/remind/RemindCtrl';
import { Item } from 'modules/bag/ItemData';
import { DBD_QUERY_PARAMS } from '../../DBDataManager/DBDNet';

export class DailyFBResultData {
    DailyFBInfo: PB_DailyFBInfo
    ZombieInfo: PB_SCZombieGoGoGoInfo
}

export class DailyFBFlushData {
    @smartdata
    FlushDailyFBInfo: boolean = false;
    @smartdata
    FlushZombieInfo: boolean = false;
    @smartdata
    FlushIsRemindShow: boolean = false;
}

export class ActivityCombatData extends DataBase {
    public ResultData: DailyFBResultData;
    public FlushData: DailyFBFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(DailyFBFlushData);
        this.ResultData = new DailyFBResultData()
    }

    public onDailyFBInfo(data: PB_DailyFBInfo) {
        if (data.sendType == 1) {
            for (let i = 0; i < data.fbList.length; i++) {
                let info = data.fbList[i];
                this.ResultData.DailyFBInfo.fbList[info.fbType] = info;
            }
        } else {
            this.ResultData.DailyFBInfo = data;
        }
        this.FlushData.FlushDailyFBInfo = !this.FlushData.FlushDailyFBInfo
    }

    public onZombieInfo(data: PB_SCZombieGoGoGoInfo) {
        this.ResultData.ZombieInfo = data;
        this.FlushData.FlushZombieInfo = !this.FlushData.FlushZombieInfo
    }

    public onZombieInfoDBD(data: DBD_QUERY_PARAMS) {
        this.ResultData.ZombieInfo = data as any;
        this.FlushData.FlushZombieInfo = !this.FlushData.FlushZombieInfo
    }

    public get Info() {
        return this.ResultData.DailyFBInfo
    }

    public get ZombieInfo() {
        return this.ResultData.ZombieInfo ? this.ResultData.ZombieInfo : { fightCount: [0], killRewardIsFetch: [0, 0, 0], killNum: 0, dailyWeakness: 0 }
    }

    public get ZombieFightNum() {
        return this.ZombieInfo ? this.ZombieInfo.fightCount : [0];
    }

    public get InfoZombieIsFetch() {
        return this.ZombieInfo ? this.ZombieInfo.killRewardIsFetch : [];
    }

    getZombieFightNum() {
        return CfgBarrierInfoData.rush_info[0].daily_fight_times - (this.ZombieFightNum[0] ?? 0);
    }

    GetZombieBoxCfg() {
        return CfgBarrierInfoData.rush_item_info
    }

    GetOpenShow(type: number) {
        let week = TimeCtrl.Inst().GetWeek()
        let day = this.GetOpenTimeDay(type);
        if (week == 0) {
            return day.indexOf("7") == -1
        } else {
            return day.indexOf(week + "") == -1
        }
    }

    getSurplusNum(type: number) {
        return CfgBarrierInfoData.other[0].daily_fight_times - this.Info.fbList[type].fightCount;
    }

    GetOpenTimeDay(type: number) {
        let day;
        if (type == 1) {
            day = CfgBarrierInfoData.other[0].debries_open_day
        } else if (type == 0) {
            day = CfgBarrierInfoData.other[0].gold_open_day
        }
        return day.split("|");
    }

    GetOpenTimeStr(type: number) {
        let day = this.GetOpenTimeDay(type);
        let str = Language.ActivityCombat.opanTime;
        for (let i = 0; i < day.length; i++) {
            str += GetCfgValue(Language.ActivityCombat.day, day[i]) + " "
        }
        return str;
    }

    GetlevelReward(type: number, level: number, isFirst: boolean) {
        let info = this.GetActivityLevelInfo(type)
        let config = this.GetLevelCfg(type, level);
        let data = [];
        if (isFirst && config.first_win && level >= info.fbLevel) {
            for (let i = 0; i < config.first_win.length; i++) {
                let item = config.first_win[i];
                // if (Item.GetBigType(item.item_id) == ITEM_BIG_TYPE.GIFT) {
                //     let gift = Item.GetGiftlist(item.item_id)
                //     for (let j = 0; j < gift.length; j++) {
                //         data.push({ item: gift[j], isFirstPass: true })
                //     }
                // } else {
                data.push({ item: item, isFirstPass: true })
                // }
            }
        }
        for (let j = 0; j < config.win.length; j++) {
            let item = config.win[j];
            // if (Item.GetBigType(item.item_id) == ITEM_BIG_TYPE.GIFT) {
            //     let gift = Item.GetGiftlist(item.item_id)
            //     for (let k = 0; k < gift.length; k++) {
            //         data.push({ item: gift[k], isFirstPass: false })
            //     }
            // } else {
            data.push({ item: item, isFirstPass: false })
            // }
        }
        return data;
    }

    getLevelConsumeCfg(type: number, level: number) {
        let config = this.GetLevelCfg(type, level);
        return config.power_spend ?? 0
    }

    GetEnergyNum() {
        return BagData.Inst().GetItemNum(CommonId.Energy)
    }

    GetMopUpNum(type: number, level: number) {
        let energy = this.GetEnergyNum();
        let surplus = this.getSurplusNum(type)
        let consume = this.getLevelConsumeCfg(type, level);
        let maxNum = Math.floor(energy / consume)
        return maxNum > surplus ? surplus : maxNum;
    }

    GetLevelCfg(type: number, level: number) {
        if (type == 1) {
            return this.getDebrieslevelCfg(level);
        } else if (type == 0) {
            return this.getGoldlevelCfg(level);
        } else if (type == 3) {
            return this.getZombielevelCfg();
        }
    }

    GetActivityLevelInfo(type: number) {
        let arr = this.Info.fbList;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].fbType == type) {
                return arr[i];
            }
        }
    }

    getDebrieslevelCfg(index: number) {
        if (index == 0) {
            return CfgBarrierInfoData.Debries_info[index];
        } else {
            let level = index >= CfgBarrierInfoData.Debries_info.length ? CfgBarrierInfoData.Debries_info.length - 1 : index - 1;
            return CfgBarrierInfoData.Debries_info[level];
        }

    }

    getGoldlevelCfg(index: number) {
        if (index == 0) {
            return CfgBarrierInfoData.Gold_info[index];
        } else {
            let level = index >= CfgBarrierInfoData.Gold_info.length ? CfgBarrierInfoData.Gold_info.length - 1 : index - 1;
            return CfgBarrierInfoData.Gold_info[level];
        }
    }

    GetLevelMaxNum(type: number) {
        if (type == 1) {
            return CfgBarrierInfoData.Debries_info.length
        } else if (type == 0) {
            return CfgBarrierInfoData.Gold_info.length
        }
    }

    getZombielevelCfg() {
        return CfgBarrierInfoData.rush_info[1];
    }

    public FlushRedPoint() {
        this.FlushData.FlushIsRemindShow = !this.FlushData.FlushIsRemindShow
    }

    GetZombieTipOpen() {
        let is_ActivityCombatOpen = FunOpen.Inst().GetFunIsOpen(Mod.ZombieGoGoGo.View);
        let isLock = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.ZombieGoGoGo);
        if (!isLock) {
            return false;
        }
        if (!is_ActivityCombatOpen.is_open) {
            return false;
        }
        let old_time = LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("ZombieLogTips_"));
        let today_time = Math.floor(TimeCtrl.Inst().todayStarTime);
        if (old_time != today_time) {
            return true;
        }
        return false;
    }

    GetZombieRed() {
        let red = RemindCtrl.Inst().GetRemindNum(Mod.ZombieRushPass.View)
        if (red) {
            return red;
        }
        let BoxCfg = this.GetZombieBoxCfg();
        let killNum = this.ZombieInfo ? this.ZombieInfo.killNum : 0;
        for (let i = 0; i < 3; i++) {
            let isFetch = this.InfoZombieIsFetch[i];
            if (killNum >= BoxCfg[i].kill_num && !isFetch) {
                return 1
            }
        }
        return 0
    }

    public GetAllRed() {
        let is_ActivityCombatOpen = FunOpen.Inst().GetFunIsOpen(Mod.ActivityCombat.View);
        if (!is_ActivityCombatOpen.is_open) {
            return 0;
        }
        let old_time = LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("ActivityCombat"));
        let today_time = Math.floor(TimeCtrl.Inst().todayStarTime);
        if (old_time != today_time) {
            return 1;
        }
        // let red1 = MainFBData.Inst().GetAllRed()
        // let red2 = this.GetZombieRed()
        let red1 = RemindCtrl.Inst().GetRemindNum(Mod.ActivityCombat.EverydayFB)
        let red2 = RemindCtrl.Inst().GetRemindNum(Mod.ActivityCombat.Zombie)
        return red1 + red2;
    }

    public ClearFirstRemind() {
        let old_time = LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("ActivityCombat"));
        let today_time = Math.floor(TimeCtrl.Inst().todayStarTime);
        if (old_time != today_time) {
            LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("ActivityCombat"), today_time);
            this.FlushData.FlushIsRemindShow = !this.FlushData.FlushIsRemindShow
        }
    }

    public ClearFirstZombieLogTips() {
        let old_time = LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("ZombieLogTips_"));
        let today_time = Math.floor(TimeCtrl.Inst().todayStarTime);
        if (old_time != today_time) {
            LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("ZombieLogTips_"), today_time);
        }
    }

}

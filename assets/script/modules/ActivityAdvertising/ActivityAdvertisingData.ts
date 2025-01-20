import { RoundActivityData } from 'modules/RoundActivity/RoundActivityData';
import { TrafficPermitData } from 'modules/TrafficPermit/TrafficPermitData';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { ActivityAdvertisingView } from "./ActivityAdvertisingView";
import { ViewManager } from "manager/ViewManager";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { LocalStorageHelper } from "../../helpers/LocalStorageHelper";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { Timer } from "modules/time/Timer";
import { DeepCeleData } from 'modules/deep_cele/DeepCeleData';


let AdvertisingData: AdvertisingConst[] = [
    // { ActivityType: 2050, Mod: 55000 },//通行证
    { ActivityType: 2054, Mod: 7000 },//回合活动
    // { ActivityType: 2055, Mod: 102000 },//深渊礼包
    { ActivityType: 2056, Mod: 101000 },//深渊庆典
]

class AdvertisingConst {
    ActivityType: number;
    Mod: number;
}

export class ActivityAdvertisingData extends DataBase {
    //public ResultData : LoginResultData;
    timer_open: any;
    is_open: boolean;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        /*
        let self = this;
        self.ResultData = CreateSMD(LoginResultData);
        */
    }

    TipOpenView() {
        if (this.is_open) {
            Timer.Inst().CancelTimer(this.timer_open);
            this.timer_open = Timer.Inst().AddRunTimer(() => {
                this.GetOpenView();
                Timer.Inst().CancelTimer(this.timer_open);
            }, 0.2, 1, false)
        } else {
            this.GetOpenView();
            this.is_open = true
        }
    }

    GetOpenView() {
        let isShow = false;
        for (let i = 0; i < AdvertisingData.length; i++) {
            let isOpen = this.GetActivityTipOpen(AdvertisingData[i]);
            if (isOpen) {
                isShow = true;
                ViewManager.Inst().OpenView(ActivityAdvertisingView, AdvertisingData[i].ActivityType);
                break;
            }
        }
        if(!isShow){
            FunOpen.Inst().OnFunOpenViewShow();
        }

    }

    GetTimeStampData(type: number) {
        // if (type == ACTIVITY_TYPE.PassCheck) {
        //     return TrafficPermitData.Inst().GeTimeStamp();
        // } else 
        if (type == ACTIVITY_TYPE.RoundPack) {
            return RoundActivityData.Inst().GeTimeStamp();
        } else if (type == ACTIVITY_TYPE.DeepCele) {
            return DeepCeleData.Inst().GeTimeStampAct();
        } else if (type == ACTIVITY_TYPE.DeepCeleGift) {
            return DeepCeleData.Inst().GeTimeStampGift();
        }
    }

    GetEndTime(type: number) {
        if (type == ACTIVITY_TYPE.PassCheck) {
            return TrafficPermitData.Inst().getEndTime();
        } else if (type == ACTIVITY_TYPE.RoundPack) {
            return RoundActivityData.Inst().getEndTime();
        } else if (type == ACTIVITY_TYPE.DeepCele) {
            return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DeepCele);
        } else if (type == ACTIVITY_TYPE.DeepCeleGift) {
            return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DeepCeleGift);
        }
    }

    GetActivityTipOpen(data: AdvertisingConst) {
        let isLock = ActivityData.Inst().IsOpen(data.ActivityType);
        let funOpen = FunOpen.Inst().GetFunIsOpen(data.Mod);
        if (!isLock) {
            return false;
        }
        if (!funOpen.is_open) {
            return false;
        }
        let cfg = this.GetTimeStampData(data.ActivityType)
        if (!cfg.out_res_id) {
            return false;
        }
        let old_time = LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("ActivityAdvertising_" + data.ActivityType));
        let today_time = Math.floor(TimeCtrl.Inst().todayStarTime);
        if (old_time != today_time) {
            return true;
        }
        return false;
    }

    public ClearFirstActivityTips(ActivityType: number) {
        let old_time = LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("ActivityAdvertising_" + ActivityType));
        let today_time = Math.floor(TimeCtrl.Inst().todayStarTime);
        if (old_time != today_time) {
            LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("ActivityAdvertising_" + ActivityType), today_time);
        }
    }
}

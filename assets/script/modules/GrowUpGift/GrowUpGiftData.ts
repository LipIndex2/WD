import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgGrowPack } from 'config/CfgGrowPack';
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { ViewManager } from 'manager/ViewManager';
import { GrowUpGiftView } from './GrowUpGiftView';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { FunOpen } from "modules/FunUnlock/FunOpen";

export class GrowGiftResultData {
    Info: PB_SCRaGrowGiftInfo
}

export class GrowGiftFlushData {
    @smartdata
    FlushInfo: boolean = false;
    @smartdata
    FlushIsRemindShow: boolean = false;
}

export class GrowUpGiftData extends DataBase {
    public ResultData: GrowGiftResultData;
    public FlushData: GrowGiftFlushData;
    private gift_data: any = [];
    private gift_old_data: any;
    private check_new_seq: number = -1;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(GrowGiftFlushData);
        this.ResultData = new GrowGiftResultData()
    }

    public OnGrowGiftInfo(data: PB_SCRaGrowGiftInfo) {
        this.gift_data = [];
        let check_new = 1;
        if (!this.gift_old_data) {
            this.gift_old_data = [];
            check_new = 0;
        }
        for (let i = 0; i < data.giftList.length; i++) {
            let seq = data.giftList[i].seq;
            this.gift_data.push(seq);
            if (check_new != -1 && this.gift_old_data.indexOf(seq) == -1) {
                if (ActivityData.Inst().IsOpen(ACTIVITY_TYPE.GrowGift) && !ViewManager.Inst().IsOpen(GrowUpGiftView)) {
                    // ViewManager.Inst().OpenView(GrowUpGiftView, i);
                    this.check_new_seq = i;
                }
            }
        }
        this.gift_old_data = this.gift_data;
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    public GiftViewShow() {
        if (this.check_new_seq < 0) return;
        if (!FunOpen.Inst().checkAudit(1)) {
            return;
        }
        // ViewManager.Inst().OpenView(GrowUpGiftView,{index:this.check_new_seq});
        this.check_new_seq = -1;
    }

    public getGift() {
        return this.Info ? this.Info.giftList : [];
    }

    public getGiftInfo(index: number) {
        return this.getGift()[index]
    }

    public getEndTime(index: number) {
        let into = this.getGiftInfo(index);
        return into ? into.endTime - TimeCtrl.Inst().ServerTime : 0;
    }

    public GetGiftCfg(seq: number) {
        return CfgGrowPack.gift_configure.find(cfg => {
            return cfg.seq == seq;
        })
    }

    public getGiftNum() {
        return this.Info ? this.Info.giftList.length : 0;
    }

    //总红点
    public GetAllRed() {
        let act_start = ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.GrowGift);
        let old_time = ActivityData.Inst().GetRemind(ACTIVITY_TYPE.GrowGift)
        if (act_start != old_time) {
            return 1;
        }
        return 0;
    }

    public ClearFirstRemind() {
        let act_start = ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.GrowGift);
        if (act_start != ActivityData.Inst().GetRemind(ACTIVITY_TYPE.GrowGift)) {
            ActivityData.Inst().SetRemind(ACTIVITY_TYPE.GrowGift, act_start);
            this.FlushData.FlushIsRemindShow = !this.FlushData.FlushIsRemindShow
        }
    }
}

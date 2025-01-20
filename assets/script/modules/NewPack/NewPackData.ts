import { LogError } from 'core/Debugger';
import { CfgNewPack } from './../../config/CfgNewPack';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { ViewManager } from 'manager/ViewManager';
import { NewPackView } from './NewPackView';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { Mod } from 'modules/common/ModuleDefine';
import { FunOpen } from 'modules/FunUnlock/FunOpen';

export class NewPackResultData {
    Info: PB_SCRaNewbeeGiftInfo
}

export class NewPackFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class NewPackData extends DataBase {
    public ResultData: NewPackResultData;
    public FlushData: NewPackFlushData;
    private gift_data: any = [];
    private gift_old_data: any;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(NewPackFlushData);
        this.ResultData = new NewPackResultData()
    }

    public OnNewPackInfo(data: PB_SCRaNewbeeGiftInfo) {
        LogError("PB_SCRaNewbeeGiftInfo", data)
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    getGiftInfo() {
        return this.Info ? this.Info.seq : 0
    }

    getEndTime() {
        return ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.NewPack) - TimeCtrl.Inst().ServerTime;
    }

    public GetGiftCfg(seq: number) {
        return CfgNewPack.gift_configure.find(cfg => {
            return cfg.seq == seq;
        })
    }

    public GetIsActiveOver() {
        let isShow = true;
        let seq = NewPackData.Inst().getGiftInfo();
        let config = NewPackData.Inst().GetGiftCfg(seq);
        let isOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.NewPack)
        if(!config){
            isShow = false;
        }
        return isShow && isOpen;
    }

}

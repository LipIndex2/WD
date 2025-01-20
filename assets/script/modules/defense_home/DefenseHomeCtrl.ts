import { CfgBarrierInfoData, CfgBarrierInfoDefenseHomeReward } from 'config/CfgBarrierInfo';
import { LogError } from 'core/Debugger';
import { DataBase } from 'data/DataBase';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { CreateSMD, smartdata } from 'data/SmartData';
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { Mod } from 'modules/common/ModuleDefine';

export class DefenseHomeCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaBackYardInfo, func: this.OnSCRaBackYardInfo }
        ]
    }

    protected initCtrl(): void {
        this.handleCollector.Add(RemindRegister.Create(Mod.ActivityCombat.Defense, DefenseHomeData.Inst().dataInfo,
        DefenseHomeData.Inst().GetRemind.bind(DefenseHomeData.Inst()), "info"));
    }

    private OnSCRaBackYardInfo(data: PB_SCRaBackYardInfo) {
        LogError("守卫后院活动信息!!!!!!!!!!!!!!!!!!!!!!!!", data);
        DefenseHomeData.Inst().SetInfo(data);
    }

}

export class DefenseHomeInfo{
    @smartdata
    info:PB_SCRaBackYardInfo;
}

export class DefenseHomeData extends DataBase{
    dataInfo: DefenseHomeInfo;

    constructor(){
        super();
        this.createSmartData();
    }

    private createSmartData(){
        this.dataInfo =  CreateSMD(DefenseHomeInfo);
    }

    get isOpen():boolean{
        let isOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.DefenseHome);
        return isOpen;
    }

    get isHasInfo():boolean{
        return this.dataInfo != null && this.dataInfo.info != null;
    }

    // 每日最大次数
    get maxCount():number{
        return CfgBarrierInfoData.backyard_info[0].daily_fight_times;
    }
    // 已经战斗次数
    get fightCount():number{
        if(!this.isHasInfo){
            return 0;
        }
        return this.dataInfo.info.fightCount;
    }
    //剩余次数
    get remainCount():number{
        return this.maxCount - this.fightCount;
    }

    //通过天数
    get passDay():number{
        if(!this.isHasInfo){
            return 0;
        }
        return this.dataInfo.info.passDay;
    }
    get maxPassDay():number{
        let cfg = CfgBarrierInfoData.backyard_item_info;
        return cfg[cfg.length - 1].day_num;
    }

    SetInfo(info:PB_SCRaBackYardInfo){
        this.dataInfo.info = info;
    }

    //奖励列表
    GetRewardList():CfgBarrierInfoDefenseHomeReward[]{
        return CfgBarrierInfoData.backyard_item_info;
    }

    //奖励状态 1可领取，0未达成，-1已领取
    GetRewardState(cfg:CfgBarrierInfoDefenseHomeReward){
        if(!this.isHasInfo){
            return 0;
        }
        if(this.dataInfo.info.rewardFlag[cfg.seq]){
            return -1;
        }
        if(this.passDay >= cfg.day_num){
            return 1;
        }
        return 0;
    }

    //红点
    GetRemind():number{
        if(!this.isOpen){
            return 0;
        }
        let list = this.GetRewardList();
        for(let cfg of list){
            let flag = this.GetRewardState(cfg);
            if(flag > 0){
                return 1;
            }
        }
        return 0;
    }
}


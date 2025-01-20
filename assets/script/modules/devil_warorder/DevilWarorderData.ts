import { CfgTemplePass, CfgTemplePassRoundPassSet } from "config/CfgTemplePass";
import { LogError } from "core/Debugger";
import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { ViewManager } from "manager/ViewManager";
import { ActivityCtrl } from "modules/activity/ActivityCtrl";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { DevilWarorderView } from "./DevilWarorderView";

export class DevilWarOrderFlushData {
    @smartdata
    FlushInfo: boolean = false;

    @smartdata
    act_status :boolean = false;
}

export class DevilWarOrderData extends DataBase {
    public FlushData: DevilWarOrderFlushData;
    private ResultData:PB_SCLostTempleItemInfo;
    private cur_arrive_seq = -1;
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(DevilWarOrderFlushData);
    }
    
    public  SetLostTempleItemInfo(data:PB_SCLostTempleItemInfo){
        this.ResultData = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    //检查活动开启状态
    public CheckActStatus(){
        let  act_status = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.DevilWarorder);
        if (!this.FlushData.act_status && act_status){
            ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DevilWarorder, 0);
        }
        if(!act_status && ViewManager.Inst().IsOpen(DevilWarorderView)){
            ViewManager.Inst().CloseView(DevilWarorderView);
        }
        this.FlushData.act_status = act_status;
    }

    //档位是否激活
    public IsActive(buyType: number) {
        return this.ResultData ? this.ResultData.list[buyType].isActive : false;
    }

    public GetOtherCfg() {
        return CfgTemplePass.other[0];
    }
    
    public GetTimestampSeq() {
        let start_time = ActivityData.Inst().GetStartStampTime(ACTIVITY_TYPE.DevilWarorder)
        let list = CfgTemplePass.time_stamp.slice().reverse()
        let co = list.find(cfg => start_time >= cfg.time_stamp)
        return co ? co.time_seq : 0
    }

    public GetListData() {
        let seq = this.GetTimestampSeq();
        let cfg = CfgTemplePass.round_pass_set.filter(cfg => cfg.time_seq == seq);
        return cfg;
    }

    public SetCurArriveSeq(cfgs:CfgTemplePassRoundPassSet[]){
        let item_num = this.GetItemnum();
        let cur_arrive_seq=-1;
        for (let i = 0; i < cfgs.length; i++) {
            if (!cfgs[i+1] ||( item_num >= cfgs[i].item_num && item_num < cfgs[i+1].item_num)){
                cur_arrive_seq = cfgs[i].seq;
                break;
            }
        }
        this.cur_arrive_seq = cur_arrive_seq;
    }

    public GetCurArriveSeq(){
        return  this.cur_arrive_seq;
    }
 
    public GetItemnum() {
        return this.ResultData ? this.ResultData.itemNum : 0
    }

    public IsFetchReward(buyType:number,seq:number) {
        return this.ResultData ? this.ResultData.list[buyType].isFetch[seq] : false;
    }

    public GetPassCfgLevel(seq: number) {
        let time_seq = this.GetTimestampSeq();
        const cfg = CfgTemplePass.round_pass_set.find(cfg => cfg.time_seq == time_seq && cfg.seq == seq);
        return cfg ? cfg.item_num : 0
    }
    
    public GetBuyBtnShow(seq: number) {
        if (seq == 0) {
            return false
        }
        let num = this.GetItemnum();
        const val = this.GetPassCfgLevel(seq - 1);
        const val2 = this.GetPassCfgLevel(seq);
        let isShow = val <= num && val2 > num
        if (seq == 1 && val2 > num) {
            return true
        }
        return isShow
    }

    public GetAllRed() {
        let item_num = this.GetItemnum();
        let cfgs = this.GetListData();
        let is_active_1 = this.IsActive(1);
        let is_active_2 = this.IsActive(2);
        for (let i = 0; i < cfgs.length; i++) {
            if (item_num >= cfgs[i].item_num) {
                if (!this.IsFetchReward(0, cfgs[i].seq)) return 1;
                if (is_active_1 && !this.IsFetchReward(1, cfgs[i].seq)) return 1;
                if (is_active_2 && !this.IsFetchReward(2, cfgs[i].seq)) return 1;
            }
        }
        return 0;
    }
}
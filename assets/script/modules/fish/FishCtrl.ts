import { LogError } from 'core/Debugger';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { BagData } from 'modules/bag/BagData';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { Mod } from 'modules/common/ModuleDefine';
import { FishConfig } from './FishConfig';
import { FishData } from './FishData';

export class FishCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRoleFishInfo, func: this.OnRoleFishInfo },
            { msgType: PB_SCRoleFishPowerInfo, func: this.OnRoleFishPowerInfo },
            { msgType: PB_SCRoleFishCommonInfo, func: this.OnRoleFishCommonInfo },
            { msgType: PB_SCRoleFishFishInfo, func: this.OnRoleFishFishInfo },
            { msgType: PB_SCRoleFishFishListInfo, func: this.OnRoleFishFishListInfo },
            { msgType: PB_SCRoleFishLevelInfo, func: this.OnRoleFishLevelInfo },
            { msgType: PB_SCRoleFishBookRewardInfo, func: this.OnRoleFishBookRewardInfo },
            { msgType: PB_SCRoleFishToolInfo, func: this.OnRoleFishToolInfo },
            { msgType: PB_SCRoleFishShopInfo, func: this.OnRoleFishShopInfo },
            { msgType: PB_SCRoleFishTaskInfo, func: this.OnRoleFishTaskInfo },
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.Fish.View, BagData.Inst().BagItemData, () => {
            let num = FishData.Inst().GetRedNum();
            return num;
        }, "OtherChange"));
        this.handleCollector.Add(RemindRegister.Create(Mod.Fish.View, FishData.Inst().FlushData, () => {
            let num = FishData.Inst().GetRedNum();
            return num;
        }));
    }

    public OnRoleFishInfo(protocol: PB_SCRoleFishInfo) {
        LogError("OnRoleFishInfo", protocol)
        FishData.Inst().SetRoleFishInfo(protocol);
    }

    public OnRoleFishPowerInfo(protocol: PB_SCRoleFishPowerInfo) {
        LogError("OnRoleFishPowerInfo", protocol)
        FishData.Inst().SetRoleFishPowerInfo(protocol);
    }

    public OnRoleFishCommonInfo(protocol: PB_SCRoleFishCommonInfo) {
        LogError("OnRoleFishCommonInfo", protocol)
        FishData.Inst().SetRoleFishCommonInfo(protocol);
    }

    public OnRoleFishFishInfo(protocol: PB_SCRoleFishFishInfo) {
        LogError("OnRoleFishFishInfo", protocol)
        FishData.Inst().SetRoleFishFishInfo(protocol);
    }

    public OnRoleFishFishListInfo(protocol: PB_SCRoleFishFishListInfo) {
        LogError("OnRoleFishFishListInfo", protocol)
        FishData.Inst().SetRoleFishFishListInfo(protocol);
    }

    public OnRoleFishLevelInfo(protocol: PB_SCRoleFishLevelInfo) {
        LogError("OnRoleFishLevelInfo", protocol)
        FishData.Inst().SetRoleFishLevelInfo(protocol);
    }

    public OnRoleFishBookRewardInfo(protocol: PB_SCRoleFishBookRewardInfo) {
        LogError("OnRoleFishBookRewardInfo", protocol)
        FishData.Inst().SetRoleFishBookRewardInfo(protocol);
    }

    public OnRoleFishToolInfo(protocol: PB_SCRoleFishToolInfo) {
        LogError("OnRoleFishToolInfo", protocol)
        FishData.Inst().SetRoleFishToolInfo(protocol);
    }

    public OnRoleFishShopInfo(protocol: PB_SCRoleFishShopInfo) {
        LogError("OnRoleFishShopInfo", protocol)
        FishData.Inst().SetRoleFishShopInfo(protocol);
    }

    public OnRoleFishTaskInfo(protocol: PB_SCRoleFishTaskInfo) {
        LogError("OnRoleFishTaskInfo", protocol)
        FishData.Inst().SetRoleFishTaskInfo(protocol);
    }

    public SendRoleFishReq(type: number, param: number[] = []) {
        let protocol = this.GetProtocol(PB_CSRoleFishReq);
        protocol.reqType = type;
        protocol.p1 = param[0] ?? 0
        protocol.p2 = param[1] ?? 0
        protocol.p3 = param[2] ?? 0
        this.SendToServer(protocol);
    }

    public SendRoleFishReqInfo() {
        this.SendRoleFishReq(FishConfig.ReqType.info);
    }

    public SendRoleFishReqFish(island_id: number = FishData.Inst().InfoAreaId, bait_id = FishData.Inst().InfoBaitId) {
        this.SendRoleFishReq(FishConfig.ReqType.fish, [island_id, bait_id]);
    }

    public SendRoleFishReqPut() {
        this.SendRoleFishReq(FishConfig.ReqType.put);
    }

    public SendRoleFishReqSubTask() {
        this.SendRoleFishReq(FishConfig.ReqType.sub_task);
    }

    public SendRoleFishReqTaskReward(task_index: number) {
        this.SendRoleFishReq(FishConfig.ReqType.task_reward, [task_index]);
    }

    public SendRoleFishReqFlushTask(task_index: number) {
        this.SendRoleFishReq(FishConfig.ReqType.flush_task, [task_index]);
    }

    public SendRoleFishReqSell() {
        let info = FishData.Inst().InfoFish
        let co_fish = FishData.Inst().CfgFishInfoByFishId(info.fishId)
        if (co_fish) {
            let sell = FishData.Inst().GetBoxInfoLengthSell(co_fish, info.fishLen)
            FishData.Inst().SellPrice = FishData.Inst().GetSellPrice(sell[0].num)
        }
        this.SendRoleFishReq(FishConfig.ReqType.sell);
    }

    public SendRoleFishReqSellFish(fish_id: number) {
        this.SendRoleFishReq(FishConfig.ReqType.sell_fish, [fish_id]);
    }

    public SendRoleFishReqFectchHandbook(seq: number) {
        this.SendRoleFishReq(FishConfig.ReqType.fectch_handbook, [seq]);
    }

    public SendRoleFishReqUpTool(tool_id: number) {
        this.SendRoleFishReq(FishConfig.ReqType.up_tool, [tool_id]);
    }

    public SendRoleFishReqFashion(tool_id: number = FishData.Inst().SelToolType, image_id: number = FishData.Inst().SelImageId) {
        this.SendRoleFishReq(FishConfig.ReqType.fashion, [tool_id, image_id]);
    }

    public SendRoleFishReqFashionSell(image_id: number = 0) {
        this.SendRoleFishReq(FishConfig.ReqType.fashion_sell, [image_id]);
    }

    public SendRoleFishReqBuy(item_seq: number, num = 1) {
        this.SendRoleFishReq(FishConfig.ReqType.buy, [item_seq, num]);
    }

    public SendRoleFishReqCardReward() {
        this.SendRoleFishReq(FishConfig.ReqType.card_reward);
    }

    public SendRoleFishReqEnterMap(island_id: number) {
        this.SendRoleFishReq(FishConfig.ReqType.enter_map, [island_id]);
    }

    public SendRoleFishReqSetBait(bait_id: number) {
        this.SendRoleFishReq(FishConfig.ReqType.set_bait, [bait_id]);
    }
}
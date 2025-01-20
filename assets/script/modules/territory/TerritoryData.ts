import { CfgPartsGift } from "config/CfgPartsGift";
import { CfgTerritory } from "config/CfgTerritory";
import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { ViewManager } from "manager/ViewManager";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { MiningData } from "modules/Mining/MiningData";
import { RoleData } from "modules/role/RoleData";
import { TerritoryCartGetView } from "./TerritoryCartGetView";
import { TerritoryConfig } from "./TerritoryConfig";
import { TerritoryModGiftView } from "./TerritoryModGiftView";
import { TerritoryView } from "./TerritoryView";


export class TerritoryResultData {
    Info: PB_SCTerritoryInfo
    NeighbourInfo: PB_SCTerritoryNeighbourInfo
    BotInfo: PB_SCTerritoryBotInfo
    ReportInfo: PB_SCTerritoryReportInfo
    RedInfo: PB_SCTerritoryRedInfo
    GiftInfo: PB_SCRaPartsGiftInfo
}

export class TerritoryFlushData {
    @smartdata
    FlushInfo: boolean = false;

    @smartdata
    FlushNeighbourInfo: boolean = false;

    @smartdata
    FlushBotInfo: boolean = false;

    @smartdata
    FlushReportInfo: boolean = false;

    @smartdata
    FlushRedInfo: boolean = false;

    @smartdata
    FlushGiftInfo: boolean = false;

    FetchReward: boolean = false
}

export class TerritoryData extends DataBase {

    public ResultData: TerritoryResultData;
    public FlushData: TerritoryFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.ResultData = new TerritoryResultData()
        this.FlushData = CreateSMD(TerritoryFlushData);
    }

    public SetTerritoryInfo(protocol: PB_SCTerritoryInfo) {
        this.ResultData.Info = this.ResultData.Info ?? new PB_SCTerritoryInfo()
        switch (protocol.reason) {
            case TerritoryConfig.RetType.info:
                if (protocol.roleInfo.roleId == RoleData.Inst().InfoRoleId) {
                    this.ResultData.Info.botBuyCount = protocol.botBuyCount
                    this.ResultData.Info.botNum = protocol.botNum
                    this.ResultData.Info.botRunNum = protocol.botRunNum
                    this.ResultData.Info.rewardCount = protocol.rewardCount
                }
                this.ResultData.Info.roleInfo = protocol.roleInfo
                this.ResultData.Info.territoryLevel = protocol.territoryLevel
                if (protocol.itemList) {
                    for (let element of protocol.itemList) {
                        this.ResultData.Info.itemList[element.index] = element
                    }
                }
                break;
            case TerritoryConfig.RetType.reward_count:
                this.ResultData.Info.rewardCount = protocol.rewardCount
                break;
            case TerritoryConfig.RetType.bot_run_num:
                this.ResultData.Info.botRunNum = protocol.botRunNum
                break;
            case TerritoryConfig.RetType.fetch_item:
                if (protocol.itemList) {
                    for (let element of protocol.itemList) {
                        this.ResultData.Info.itemList[element.index] = element
                    }
                }
                break;
            case TerritoryConfig.RetType.buy_bot:
                this.ResultData.Info.botBuyCount = protocol.botBuyCount
                this.ResultData.Info.botNum = protocol.botNum
                ViewManager.Inst().OpenView(TerritoryCartGetView)
                break;
            case TerritoryConfig.RetType.refresh_item:
                if (protocol.itemList) {
                    for (let element of protocol.itemList) {
                        this.ResultData.Info.itemList[element.index] = element
                    }
                }
                break;
        }
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public SetTerritoryNeighbourInfo(protocol: PB_SCTerritoryNeighbourInfo) {
        this.ResultData.NeighbourInfo = protocol
        this.FlushData.FlushNeighbourInfo = !this.FlushData.FlushNeighbourInfo
    }

    public SetTerritoryBotInfo(protocol: PB_SCTerritoryBotInfo) {
        this.ResultData.BotInfo = protocol
        this.FlushData.FlushBotInfo = !this.FlushData.FlushBotInfo
    }

    public SetTerritoryReportInfo(protocol: PB_SCTerritoryReportInfo) {
        this.ResultData.ReportInfo = protocol
        this.FlushData.FlushReportInfo = !this.FlushData.FlushReportInfo
    }

    public SetTerritoryRedInfo(protocol: PB_SCTerritoryRedInfo) {
        this.ResultData.RedInfo = protocol
        this.FlushData.FlushRedInfo = !this.FlushData.FlushRedInfo
    }

    public SetRaPartsGiftInfo(protocol: PB_SCRaPartsGiftInfo) {
        this.ResultData.GiftInfo = protocol
        this.FlushData.FlushGiftInfo = !this.FlushData.FlushGiftInfo
        let config = TerritoryData.Inst().GetGiftCfg(protocol.giftSeq);
        if (!config && ViewManager.Inst().IsOpen(TerritoryModGiftView)) {
            ViewManager.Inst().CloseView(TerritoryModGiftView)
            return
        }
        if (ViewManager.Inst().IsOpen(TerritoryView) && FunOpen.Inst().checkAudit(1) && (!RoleData.Inst().IsGuideNum(7, false))) {
            // ViewManager.Inst().OpenView(TerritoryModGiftView)
        }
    }

    public get Info() {
        return this.ResultData.Info
    }

    public get InfoBotNum() {
        return this.Info ? this.Info.botNum : 0
    }

    public get InfoBotRunNum() {
        return this.Info ? this.Info.botRunNum : 0
    }

    public get InfoBotBuyCount() {
        return this.Info ? this.Info.botBuyCount : 0
    }

    public get InfoRewardCount() {
        return this.Info ? this.Info.rewardCount : 0
    }

    public get InfoItemList() {
        return this.Info ? this.Info.itemList : []
    }

    public get InfoRoleInfo() {
        return this.Info ? this.Info.roleInfo : undefined
    }
    public get InfoGiftInfo() {
        return this.Info ? this.Info.roleInfo : undefined
    }

    public get NeighbourInfo() {
        return this.ResultData.NeighbourInfo
    }

    public get NeighbourInfoNeighbourList() {
        return this.NeighbourInfo ? this.NeighbourInfo.neighbourList : []
    }

    public get NeighbourInfoNeighbourTime() {
        return this.NeighbourInfo ? this.NeighbourInfo.neighbourTime : 0
    }

    public get NeighbourInfoEnemyList() {
        return this.ResultData.NeighbourInfo ? this.ResultData.NeighbourInfo.enemyList : []
    }

    public get ReportInfo() {
        return this.ResultData.ReportInfo
    }

    public get ReportInforRportList() {
        return this.ReportInfo ? this.ReportInfo.reportList : []
    }

    public get BotInfo() {
        return this.ResultData.BotInfo
    }
    public get GiftInfo() {
        return this.ResultData.GiftInfo
    }

    public get BotInfoBotList() {
        return this.BotInfo ? this.BotInfo.botList : []
    }

    public get IsMyTerritory() {
        let role_info = this.InfoRoleInfo
        if (role_info) {
            return RoleData.Inst().InfoRoleId == role_info.roleId
        }
        return true
    }

    public get CfgOtherMonsterNum() {
        return CfgTerritory.other[0].monster_num
    }

    public get CfgOtherMaxNum() {
        return CfgTerritory.other[0].max_num
    }

    public get CfgOtherBugMonsterItem() {
        return CfgTerritory.other[0].bug_monster_item
    }

    public get CfgOtherReItemNum() {
        return CfgTerritory.other[0].re_item_num1
    }

    public get CfgOtherGridMax() {
        return CfgTerritory.other[0].grid_max
    }

    public get CfgOtherReItem() {
        return CfgTerritory.other[0].re_item
    }

    public get CfgOtherOtherTerritoryRefresh() {
        return CfgTerritory.other[0].other_territory_refresh * 60
    }

    public set FetchReward(value: boolean) {
        this.FlushData.FetchReward = value
    }

    public get FetchReward() {
        return this.FlushData.FetchReward
    }

    public GetItemInfoBySeq(seq: number) {
        return CfgTerritory.item_information.find(cfg => cfg.seq == seq)
    }

    public GetBuyMonsterInfo() {
        let num = this.InfoBotBuyCount + 1
        num = Math.min(num, CfgTerritory.buy_monster.length)
        return CfgTerritory.buy_monster.find(cfg => cfg.buy_monster == num)
    }

    public GetGiftCfg(giftSeq: number) {
        let data = CfgPartsGift;
        return CfgPartsGift.parts_gift.find(cfg => cfg.seq == giftSeq)
    }

    public GetMonsterEffList() {
        return CfgTerritory.monster_efficiency
    }

    public GetItemInfoByItemId(item_id: number) {
        return CfgTerritory.item_information.find(cfg => cfg.item_id == item_id)
    }


    public GetNeighbourShowList() {
        let list: any[] = []

        list.push(TerritoryConfig.NeighborType.neighbour)
        if (0 == this.NeighbourInfoNeighbourList.length) {
            list.push(TerritoryConfig.NeighborType.empty_nei)
        } else {
            list = list.concat(this.NeighbourInfoNeighbourList)
        }

        list.push(TerritoryConfig.NeighborType.enemy)
        if (0 == this.NeighbourInfoEnemyList.length) {
            list.push(TerritoryConfig.NeighborType.empty_en)
        } else {
            list = list.concat(this.NeighbourInfoEnemyList)
        }
        return list
    }

    public GetReportShowList() {
        return this.ReportInforRportList
    }

    public GetMonsterEfficiencyInfoByRewardCount(reward_count = this.InfoRewardCount) {
        let seq = 1
        for (let element of CfgTerritory.monster_efficiency) {
            if (reward_count >= element.num) {
                seq = Math.max(seq, element.seq)
            }
        }
        return CfgTerritory.monster_efficiency.find(cfg => cfg.seq == seq)
    }

    //花园红点
    GetRemindNum(): number {
        // 矿洞红点
        let miningRemind = MiningData.Inst().GetRemindNum();
        if (miningRemind > 0) {
            return 1;
        }
        return 0;
    }
}
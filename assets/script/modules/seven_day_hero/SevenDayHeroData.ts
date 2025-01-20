import { CfgSupplyCardData } from "config/CfgSupplyCard";
import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { TimeCtrl } from "modules/time/TimeCtrl";


export class SevenDayHeroResultData {
    Info: PB_SCSevenDayHeroInfo
}

export class SevenDayHeroFlushData {
    @smartdata
    FlushInfo: boolean = false;

    @smartdata
    SelSeq: number = -1
}

export class SevenDayHeroData extends DataBase {

    public ResultData: SevenDayHeroResultData;
    public FlushData: SevenDayHeroFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(SevenDayHeroFlushData);
        this.ResultData = new SevenDayHeroResultData()
    }

    public SetSevenDayHeroInfo(protocol: PB_SCSevenDayHeroInfo) {
        this.ResultData.Info = protocol
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get InfoExpiryTime() {
        return this.ResultData.Info ? this.ResultData.Info.expiryTime : 0
    }

    public get InfoFetchRewardTimes() {
        return this.ResultData.Info ? this.ResultData.Info.fetchRewardTimes : 0
    }

    public get InfoHeroId() {
        return this.ResultData.Info ? this.ResultData.Info.heroId : 0
    }

    public get IsBuy() {
        return this.InfoExpiryTime > TimeCtrl.Inst().ServerTime
    }

    public set SelSeq(value: number) {
        this.FlushData.SelSeq = value
    }

    public get SelSeq() {
        return this.FlushData.SelSeq
    }

    public CfgSupplyCardSupplyCardSpeed() {
        return CfgSupplyCardData.supply_card[0].speed
    }

    public CfgSupplyCardSupplyCardAttack() {
        return CfgSupplyCardData.supply_card[0].attack
    }

    public CfgSupplyCardSupplyCardAttackSpeed() {
        return CfgSupplyCardData.supply_card[0].attack_speed
    }

    public CfgSupplyCardSupplyCardPayPayItemNum() {
        return CfgSupplyCardData.supply_card_pay[0].pay_item_num
    }

    public CfgSupplyCardSupplyCardPayPrice() {
        return CfgSupplyCardData.supply_card_pay[0].price
    }

    public GetRewardShowList() {
        return CfgSupplyCardData.hero
    }

    public GetRewardShowInfoBySeq(seq: number) {
        return CfgSupplyCardData.hero.find(cfg => cfg.seq == seq)
    }

    GetAllRed() {
        if (this.IsBuy && !this.InfoFetchRewardTimes) {
            return 1
        }
        return 0;
    }
}
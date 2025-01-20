import { FunOpen } from './../FunUnlock/FunOpen';
import { CfgBarrierPack } from 'config/CfgBarrierPack';
import { CfgDailyBuyData } from "config/CfgDailyBuy";
import { CfgRMBShop, CfgShopData } from "config/CfgShop";
import { CfgShopBoxData } from "config/CfgShopBox";
import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { AdType } from 'modules/common/CommonEnum';
import { RoleData } from 'modules/role/RoleData';
import { ShopConfig } from "./ShopConfig";
import { BagData } from 'modules/bag/BagData';
import { CfgShopGift } from 'config/CfgShopGift';
import { HeroData } from 'modules/hero/HeroData';
import { Mod } from 'modules/common/ModuleDefine';
import { ConstValue } from 'modules/common/ConstValue';


export class ShopResultData {
    BoxInfo: PB_SCShopBoxInfo
    ShopInfo: PB_SCShopInfo
    DailyBuyInfo: PB_SCDailyBuyInfo
    PackInfo: PB_SCRaBarrierPackInfo
    GiftInfo: PB_SCRaShopGiftInfo
}

export class ShopFlushData {
    @smartdata
    FlushBoxInfo: boolean = false;

    @smartdata
    FlushShopInfo: boolean = false;

    @smartdata
    FlushDailyBuyInfo: boolean = false;

    @smartdata
    FlushMainlList: boolean = false;

    @smartdata
    FlushPackInfo: boolean = false;

    @smartdata
    FlushGiftInfo: boolean = false;
}

export class ShopData extends DataBase {

    public ResultData: ShopResultData;
    public FlushData: ShopFlushData;

    public IsBoxLevelUp: boolean = false;

    /**宝箱开启次数 */
    public boxOpenTimes: { [key: number]: number } = { 0: ConstValue.OpenTreasureMaxTimes, 1: ConstValue.OpenTreasureMaxTimes, 2: ConstValue.OpenTreasureMaxTimes };

    /**购买数据 */
    public payMoneyInfo: { day: number, month: number, dayTime: number, monthTime: number } = { day: 0, month: 0, dayTime: 0, monthTime: 0 };

    constructor() {
        super();
        this.createSmartData();
    }

    onBoxOpenTimes(info: { [key: number]: number }) {
        this.boxOpenTimes = info;
    }

    getBoxOpenTimes(key: number) {
        return this.boxOpenTimes[key] || 0
    }

    private createSmartData() {
        this.FlushData = CreateSMD(ShopFlushData);
        this.ResultData = new ShopResultData()
    }

    public SetShopBoxInfo(protocol: PB_SCShopBoxInfo) {
        if (this.ResultData.BoxInfo) {
            this.IsBoxLevelUp = protocol.boxLevel > (this.ResultData.BoxInfo.boxLevel || 1);
        }
        this.ResultData.BoxInfo = protocol
        this.FlushData.FlushBoxInfo = !this.FlushData.FlushBoxInfo
    }

    public SetShopInfo(protocol: PB_SCShopInfo) {
        if (ShopConfig.ShopSendType.init == protocol.sendType) {
            this.ResultData.ShopInfo = protocol
        } else if (ShopConfig.ShopSendType.single == protocol.sendType) {
            for (let element of protocol.shopList) {
                let index = this.ResultData.ShopInfo.shopList.findIndex(cfg => cfg.shopIndex == element.shopIndex)
                if (-1 == index) {
                    this.ResultData.ShopInfo.shopList.push(element)
                } else {
                    this.ResultData.ShopInfo.shopList[index] = element
                }
            }
        }
        this.FlushData.FlushShopInfo = !this.FlushData.FlushShopInfo
    }

    public SetDailyBuyInfo(protocol: PB_SCDailyBuyInfo) {
        this.ResultData.DailyBuyInfo = protocol
        this.FlushData.FlushDailyBuyInfo = !this.FlushData.FlushDailyBuyInfo
    }

    public SetBarrierPackInfo(protocol: PB_SCRaBarrierPackInfo) {
        this.ResultData.PackInfo = protocol
        this.FlushData.FlushPackInfo = !this.FlushData.FlushPackInfo
    }

    public OnSpecialOfferGiftInfo(protocol: PB_SCRaShopGiftInfo) {
        this.ResultData.GiftInfo = protocol
        this.FlushData.FlushGiftInfo = !this.FlushData.FlushGiftInfo
    }

    public get GiftInfo() {
        return this.ResultData.GiftInfo
    }

    public get GiftInfoList() {
        return this.GiftInfo ? this.GiftInfo.shopList : []
    }

    public get BoxInfo() {
        // if (!this.ResultData.BoxInfo) {
        //     ShopCtrl.Inst().SendShopBoxReqInfo()
        // }
        return this.ResultData.BoxInfo
    }

    public get BoxInfoBoxLevel() {
        return this.BoxInfo ? this.BoxInfo.boxLevel : 0
    }

    public get BoxInfoBoxExp() {
        return this.BoxInfo ? this.BoxInfo.boxExp : 0
    }

    public get ShopInfo() {
        // if (!this.ResultData.ShopInfo) {
        //     ShopCtrl.Inst().SendShopReqInfo()
        // }
        return this.ResultData.ShopInfo
    }

    public get ShopInfoSendType() {
        return this.ShopInfo ? this.ShopInfo.sendType : 0
    }

    public get ShopInfoShopList() {
        return this.ShopInfo ? this.ShopInfo.shopList : []
    }

    public get DailyBuyInfo() {
        // if (!this.ResultData.DailyBuyInfo) {
        //     ShopCtrl.Inst().SendDailyBuyReqInfo()
        // }
        return this.ResultData.DailyBuyInfo
    }

    public get DailyBuyInfoDayRefreshTimes() {
        return this.DailyBuyInfo ? this.DailyBuyInfo.dayRefreshTimes : 0
    }

    public get DailyBuyInfoItemList() {
        return this.DailyBuyInfo ? this.DailyBuyInfo.itemList : []
    }

    public get BarrierPackInfo() {
        return this.ResultData.PackInfo
    }

    public get BarrierPackBuy() {
        return this.BarrierPackInfo ? this.BarrierPackInfo.isBuy : []
    }

    public GetBarrierPack() {
        let level = RoleData.Inst().InfoMainSceneLevel;
        let maxLevel = ShopData.Inst().CfgBarrierPackMaxLevel()
        let len = level > maxLevel ? maxLevel : level - 1;
        let data = [];
        for (let i = 0; i < len; i++) {
            if (!this.BarrierPackBuy[i]) {
                data.push(i);
            }
        }
        return data;
    }

    public CfgBarrierPack(seq: number) {
        return CfgBarrierPack.pack_set.find((cfg) => cfg.seq == seq);
    }

    public CfgBarrierPackMaxLevel() {
        return CfgBarrierPack.pack_set.length
    }

    //宝箱是否升级
    public GetIsBoxLevelUp() {
        let isUp = this.IsBoxLevelUp;
        if (isUp) {
            this.IsBoxLevelUp = false
        }
        return isUp;
    }

    public FlushMainlList() {
        this.FlushData.FlushMainlList = !this.FlushData.FlushMainlList
    }

    public CfgShopGiftData(type: number, seq: number) {
        return CfgShopGift.shop_gift.find((cfg) => cfg.type == type && cfg.seq == seq)
    }

    public GetShopGift() {
        let info = ShopData.Inst().GiftInfoList;
        let heroNum = HeroData.Inst().GetHeroColorDebrisLock(3)
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.HeroInfo.Gene);
        let data = [];
        for (let i = 0; i < info.length; i++) {
            let cfg = this.CfgShopGiftData(i, info[i].seq);
            if (cfg.unlock_type == 0 && !FunOpen.Inst().IsBarrierPass(cfg.unlock_pram)) {
                continue;
            } else if (cfg.unlock_type == 1 && heroNum < cfg.unlock_pram) {
                continue;
            } else if (cfg.unlock_type == 2 && RoleData.Inst().InfoMainSceneLevel < cfg.unlock_pram) {
                continue;
            }
            if (isOpen.is_open && cfg.type == 4) {
                continue;
            } else if (!isOpen.is_open && cfg.type == 3) {
                continue;
            }
            data.push({
                type: i,
                seq: info[i].seq,
                endTime: info[i].endTime,
                cfg: cfg
            });
        }
        return data
    }

    public CfgShopBoxLevel(level: number) {
        return CfgShopBoxData.box_level.find((cfg) => cfg.box_level == level)
    }

    public CfgShopBoxMaxLevel() {
        return CfgShopBoxData.box_level.length
    }

    public CfgShopBoxPrice(box_type: number) {
        return CfgShopBoxData.box_price.find((cfg) => cfg.box_type == box_type)
    }

    public CfgShopBoxShopBox(box_type: number, box_level: number) {
        return CfgShopBoxData.shop_box.find((cfg) => cfg.box_type == box_type && cfg.box_level == box_level)
    }

    public CfgShopBoxOtherColor1Item() {
        return CfgShopBoxData.other[0].color1_item
    }

    public CfgShopBoxOtherColor2Item() {
        return CfgShopBoxData.other[0].color2_item
    }

    public CfgShopBoxOtherColor3Item() {
        return CfgShopBoxData.other[0].color3_item
    }

    public CfgDailyBuyOtherDailyNum() {
        return CfgDailyBuyData.other[0].daily_num
    }

    public CfgDailyBuyOtherReItem() {
        return CfgDailyBuyData.other[0].re_item
    }

    public CfgDailyBuyOtherReItemNum() {
        return CfgDailyBuyData.other[0].re_item_num
    }

    public CfgDailyBuyOtherReItemNumUp() {
        return CfgDailyBuyData.other[0].re_item_num_up
    }

    public GetShopBoxRewardShowList() {
        return CfgShopBoxData.box_price
    }

    public GetShopGoldShowList(page: number) {
        return CfgShopData.shop.filter(cfg => {
            return cfg.page == page
        })
    }

    public GetDailyBuyCost(count: number) {
        return this.CfgDailyBuyOtherReItemNum() + count * this.CfgDailyBuyOtherReItemNumUp()
    }

    public GetAllRed() {
        let red = this.GetBoxRed();
        return red;
    }

    public GetBoxRed() {
        let co0 = ShopData.Inst().CfgShopBoxPrice(0)
        let co1 = ShopData.Inst().CfgShopBoxPrice(1)
        let co2 = ShopData.Inst().CfgShopBoxPrice(2)
        let have_num0 = BagData.Inst().GetItemNum(co0.buy_item_id2)
        let have_num1 = BagData.Inst().GetItemNum(co1.buy_item_id2)
        let have_num2 = BagData.Inst().GetItemNum(co2.buy_item_id2)
        if (have_num0 >= co0.buy_item_num2) {
            return 1
        }
        if (have_num1 >= co1.buy_item_num2) {
            return 1
        }
        if (have_num2 >= co2.buy_item_num2) {
            return 1
        }
        return 0
    }

    public GetAdRed() {
        let DailyBuy = this.DailyBuyInfoItemList[0];
        if (DailyBuy && !DailyBuy.isBuy) {
            return 1
        }
        let diamondInfo = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_diamond)
        let diamondCo = RoleData.Inst().CfgAdTypeSeq(AdType.shop_diamond)
        let diamondHasAd = !diamondInfo || diamondInfo.todayCount < diamondCo.ad_param
        if (diamondHasAd) {
            return 1
        }
        let goldInfo = RoleData.Inst().GetAdvertisementInfoBySeq(AdType.shop_gold)
        let goldCo = RoleData.Inst().CfgAdTypeSeq(AdType.shop_gold)
        let goldHasAd = !goldInfo || goldInfo.todayCount < goldCo.ad_param
        if (goldHasAd) {
            return 1
        }
        return 0
    }

    GetRMBShopCfg(index: number): CfgRMBShop {
        let cfg = CfgShopData.shop_rmb.find(cfg => {
            return index == cfg.index;
        });
        return cfg;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.boxOpenTimes = { 0: ConstValue.OpenTreasureMaxTimes, 1: ConstValue.OpenTreasureMaxTimes, 2: ConstValue.OpenTreasureMaxTimes };
        this.payMoneyInfo = { day: 0, month: 0, dayTime: 0, monthTime: 0 };
    }
}
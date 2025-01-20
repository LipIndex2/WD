import { GetCfgValue } from "config/CfgCommon";
import { CfgFish } from "config/CfgFish";
import { bit } from "core/net/bit";
import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { ViewManager } from "manager/ViewManager";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { CommonId, ROLE_SETTING_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { SPINE_ANI_SLOT } from "modules/scene_obj_spine/ObjSpineConfig";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";
import { MathHelper } from "../../helpers/MathHelper";
import { TextHelper } from "../../helpers/TextHelper";
import { FishConfig } from "./FishConfig";
import { FishCtrl } from "./FishCtrl";
import { FishGetView } from "./FishGetView";
import { FishView } from "./FishView";


export class FishResultData {
    Info: PB_SCRoleFishInfo
    ShopInfo: PB_SCRoleFishShopInfo
}

export class FishFlushData {
    @smartdata
    FlushInfo: boolean = false;

    @smartdata
    FlushPowerInfo: boolean = false;

    @smartdata
    FlushCommonInfo: boolean = false;

    @smartdata
    FlushFishInfo: boolean = false;

    @smartdata
    FlushFishListInfo: boolean = false;

    @smartdata
    FlushLevelInfo: boolean = false;

    @smartdata
    FlushBookRewardInfo: boolean = false;

    @smartdata
    FlushToolInfo: boolean = false;

    @smartdata
    FlushShopInfo: boolean = false;

    @smartdata
    FlushTaskInfo: boolean = false;

    @smartdata
    SelMapId: number = 1;

    @smartdata
    SelFishType: number = 0;

    SelToolType: number = 1;

    @smartdata
    SelImageId: number = 0;

    @smartdata
    SellPrice: number = 0;

    @smartdata
    FishState: number = 0;

    @smartdata
    FishShow: boolean = false;

    @smartdata
    LineShow: boolean = false;

    TopShow: { pre: number, cur: number } = { pre: 0, cur: 0 };

    @smartdata
    FlushTopShow: boolean = false;

    @smartdata
    MapRedNum: number = 0;

    @smartdata
    BoxRedNum: number = 0;

    BoxFish: any[] = []

    @smartdata
    IsAutoFish: boolean = false;
}

export class FishData extends DataBase {

    public ResultData: FishResultData;
    public FlushData: FishFlushData;

    private fishTimer: any

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.ResultData = new FishResultData()
        this.FlushData = CreateSMD(FishFlushData);
    }

    public SetRoleFishInfo(protocol: PB_SCRoleFishInfo) {
        this.ResultData.Info = protocol
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo

        // if (ViewManager.Inst().IsOpen(FishView) && protocol.fish && protocol.fish.fishId > 0 && !FishData.Inst().IsAutoFish) {
        //     ViewManager.Inst().OpenView(FishGetView)
        // }
    }

    public SetRoleFishPowerInfo(protocol: PB_SCRoleFishPowerInfo) {
        if (this.Info) {
            this.Info.power = protocol.power
            this.Info.nextPowerTime = protocol.nextPowerTime
        }
        this.FlushData.FlushPowerInfo = !this.FlushData.FlushPowerInfo
    }

    public SetRoleFishCommonInfo(protocol: PB_SCRoleFishCommonInfo) {
        if (this.Info) {
            this.Info.areaId = protocol.areaId
            this.Info.baitId = protocol.baitId
            this.Info.fishCardTime = protocol.fishCardTime
            this.Info.isFetchCardReward = protocol.isFetchCardReward
        }
        this.FlushData.FlushCommonInfo = !this.FlushData.FlushCommonInfo
    }

    public SetRoleFishFishInfo(protocol: PB_SCRoleFishFishInfo) {
        if (this.Info) {
            this.Info.fish = protocol.fish
        }

        this.FishState = FishConfig.FishState.qigan
        let pre_time = this.FishAnimTime(1)
        switch (protocol.state) {
            case FishConfig.StateType.succ:
                this.fishTimer = Timer.Inst().AddRunTimer(() => {
                    this.PlayAudio(AudioTag.huodeyu)
                    this.FishShow = true
                    Timer.Inst().CancelTimer(this.fishTimer)
                    this.fishTimer = Timer.Inst().AddRunTimer(() => {
                        this.AutoSell()
                        if (this.Info.historyInfo[protocol.fish.fishId].fishHistoryLen < protocol.fish.fishLen) {
                            this.Info.historyInfo[protocol.fish.fishId].fishHistoryLen = protocol.fish.fishLen
                            this.FlushData.FlushBookRewardInfo = !this.FlushData.FlushBookRewardInfo
                        }
                    }, pre_time, 1, false)
                }, this.FishAnimTime() - pre_time, 1, false)
                break;
            case 0:
                this.FishState = FishConfig.FishState.idle
                break;
            case FishConfig.StateType.escape:
                this.fishTimer = Timer.Inst().AddRunTimer(() => {
                    if (ViewManager.Inst().IsOpen(FishView)) {
                        PublicPopupCtrl.Inst().Center(Language.Fish.StateShow[protocol.state])
                    }
                    this.FishState = FishConfig.FishState.idle
                }, this.FishAnimTime(), 1, false)
                break
            case FishConfig.StateType.off_line:
                this.fishTimer = Timer.Inst().AddRunTimer(() => {
                    this.LineShow = false
                    this.fishTimer = Timer.Inst().AddRunTimer(() => {
                        if (ViewManager.Inst().IsOpen(FishView)) {
                            PublicPopupCtrl.Inst().Center(Language.Fish.StateShow[protocol.state])
                        }
                        this.FishState = FishConfig.FishState.idle
                    }, pre_time, 1, false)
                }, this.FishAnimTime() - pre_time, 1, false)
                break;
        }

        let co_bait = this.CfgBaitInfoByBaitId(this.InfoBaitId)
        if (co_bait.bait_id > 0 && 0 == BagData.Inst().GetItemNum(co_bait.item_id)) {
            if (0 == RoleData.Inst().GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingFishStart + 3)) {
                this.IsAutoFish = false
            }
            FishCtrl.Inst().SendRoleFishReqSetBait(0)
        }
    }

    public SetRoleFishFishListInfo(protocol: PB_SCRoleFishFishListInfo) {
        let score_pre = this.GetBoxInfoTotalScore()

        if (this.Info) {
            this.Info.fishList[protocol.index] = protocol.fish
        }
        this.FlushData.FlushFishListInfo = !this.FlushData.FlushFishListInfo

        let score_cur = this.GetBoxInfoTotalScore()
        this.FlushData.TopShow.pre = score_pre
        this.FlushData.TopShow.cur = score_cur
        if (score_pre < score_cur) {
            this.FlushData.FlushTopShow = !this.FlushData.FlushTopShow
        }
    }

    public SetRoleFishLevelInfo(protocol: PB_SCRoleFishLevelInfo) {
        if (this.Info) {
            if (this.Info.level < protocol.level) {
                let co = this.CfgIslandInfoByUnlockLevel(protocol.level)
                if (co) {
                    this.MapRedNum = 1
                }
            }
            this.Info.exp = protocol.exp
            this.Info.level = protocol.level
        }
        this.FlushData.FlushLevelInfo = !this.FlushData.FlushLevelInfo
    }

    public SetRoleFishBookRewardInfo(protocol: PB_SCRoleFishBookRewardInfo) {
        if (this.Info) {
            this.Info.bookRewardFetchFlag = protocol.bookRewardFetchFlag
        }
        this.FlushData.FlushBookRewardInfo = !this.FlushData.FlushBookRewardInfo
    }

    public SetRoleFishToolInfo(protocol: PB_SCRoleFishToolInfo) {
        if (this.Info) {
            this.Info.toolInfo = protocol.toolInfo
            this.Info.huanHuaActiveFlag = protocol.huanHuaActiveFlag
        }
        this.FlushData.FlushToolInfo = !this.FlushData.FlushToolInfo
    }

    public SetRoleFishShopInfo(protocol: PB_SCRoleFishShopInfo) {
        this.ResultData.ShopInfo = protocol
        this.FlushData.FlushShopInfo = !this.FlushData.FlushShopInfo
    }

    public SetRoleFishTaskInfo(protocol: PB_SCRoleFishTaskInfo) {
        if (this.Info) {
            this.Info.taskInfo = protocol.taskInfo
        }
        this.FlushData.FlushTaskInfo = !this.FlushData.FlushTaskInfo
    }

    public set SelMapId(value: number) {
        this.FlushData.SelMapId = 0
        this.FlushData.SelMapId = value
    }

    public get SelMapId() {
        return this.FlushData.SelMapId
    }

    public set SelFishType(value: number) {
        this.FlushData.SelFishType = 0
        this.FlushData.SelFishType = value
    }

    public get SelFishType() {
        return this.FlushData.SelFishType
    }

    public set SelToolType(value: number) {
        this.FlushData.SelToolType = value
    }

    public get SelToolType() {
        return this.FlushData.SelToolType
    }

    public set SelImageId(value: number) {
        this.FlushData.SelImageId = value
    }

    public get SelImageId() {
        return this.FlushData.SelImageId
    }

    public set SellPrice(value: number) {
        this.FlushData.SellPrice = 0
        this.FlushData.SellPrice = value
    }

    public get SellPrice() {
        return this.FlushData.SellPrice
    }

    public set FishState(value: number) {
        Timer.Inst().CancelTimer(this.fishTimer)
        this.FlushData.FishState = value
        if (0 == value) {
            this.FishShow = false
            this.LineShow = true
            if (this.IsAutoFish) {
                this.FishStart(true)
            }
        }
    }

    public get FishState() {
        return this.FlushData.FishState
    }

    public set FishShow(value: boolean) {
        this.FlushData.FishShow = value
    }

    public get FishShow() {
        return this.FlushData.FishShow
    }

    public set LineShow(value: boolean) {
        this.FlushData.LineShow = value
    }

    public get LineShow() {
        return this.FlushData.LineShow
    }

    public set MapRedNum(value: number) {
        this.FlushData.MapRedNum = value
    }

    public get MapRedNum() {
        return this.FlushData.MapRedNum
    }

    public set BoxRedNum(value: number) {
        this.FlushData.BoxRedNum = value
    }

    public get BoxRedNum() {
        return this.FlushData.BoxRedNum
    }

    public set BoxFish(value: any[]) {
        this.FlushData.BoxFish = value
    }

    public get BoxFish() {
        return this.FlushData.BoxFish
    }

    public set IsAutoFish(value: boolean) {
        this.FlushData.IsAutoFish = value
    }

    public get IsAutoFish() {
        return this.FlushData.IsAutoFish
    }

    public get Info() {
        return this.ResultData.Info
    }

    public get InfoLevel() {
        return this.Info ? this.Info.level : 0
    }

    public get InfoExp() {
        return this.Info ? this.Info.exp : 0
    }

    public get InfoAreaId() {
        return this.Info ? this.Info.areaId : 0
    }

    public get InfoBaitId() {
        return this.Info ? this.Info.baitId : 0
    }

    public get InfoFishCardTime() {
        return this.Info ? this.Info.fishCardTime : 0
    }

    public get InfoIsFetchCardReward() {
        return this.Info ? this.Info.isFetchCardReward : 0
    }

    public get InfoPower() {
        return this.Info ? this.Info.power : 0
    }

    public get InfoNextPowerTime() {
        return this.Info ? this.Info.nextPowerTime : 0
    }

    public get InfoHuanHuaActiveFlag() {
        return this.Info ? this.Info.huanHuaActiveFlag : 0
    }

    public get InfoToolInfo() {
        return this.Info ? this.Info.toolInfo : []
    }

    public get InfoTaskInfo() {
        return this.Info ? this.Info.taskInfo : []
    }

    public get InfoHistoryInfo() {
        return this.Info ? this.Info.historyInfo : []
    }

    public get InfoBookRewardFetchFlag() {
        return this.Info ? this.Info.bookRewardFetchFlag : []
    }

    public get InfoFishList() {
        return this.Info ? this.Info.fishList : []
    }

    public get InfoFish() {
        return this.Info ? this.Info.fish : { fishId: 0, fishLen: 0 }
    }

    public get CfgOtherBreadId() {
        return CfgFish.other[0].bread_id
    }

    public get CfgOtherFishCoin() {
        return CfgFish.other[0].fish_coin
    }

    public get CfgOtherRefreshTime() {
        return CfgFish.other[0].refresh_time
    }

    public get CfgOtherReward() {
        return CfgFish.other[0].reward
    }

    public get CfgOtherDailyBread() {
        return CfgFish.other[0].daily_bread
    }

    public get CfgOtherDailyRefresh() {
        return CfgFish.other[0].daily_refresh
    }

    public get CfgOtherPrice() {
        return CfgFish.other[0].price
    }

    public get CfgOtherBreadMax() {
        return CfgFish.other[0].bread_max
    }

    public CfgFisherLevelByLevel(level: number = this.InfoLevel) {
        return CfgFish.fisher_level.find(cfg => cfg.level == level);
    }

    public CfgFishInfoByFishId(fish_id: number) {
        return CfgFish.fish_info.find(cfg => cfg.fish_id == fish_id)
    }

    public CfgDailyOrderByOrderId(order_id: number) {
        return CfgFish.daily_order.find(cfg => cfg.order_id == order_id)
    }

    public CfgTuJianByPage(page: number = this.SelMapId) {
        return CfgFish.tujian.filter(cfg => cfg.page == page)
    }

    public CfgIslandInfoByIslandId(island_id: number = this.SelMapId) {
        return CfgFish.island_info.find(cfg => cfg.island_id == island_id)
    }

    public CfgIslandInfoByUnlockLevel(unlock_level: number) {
        return CfgFish.island_info.find(cfg => cfg.unlock_level == unlock_level)
    }

    public CfgToolInfoByIdLevel(tool_id: number, level: number) {
        return CfgFish.tool_info.find(cfg => cfg.tool_id == tool_id && cfg.level == level)
    }

    public CfgToolImageByImageId(image_id: number = this.SelImageId) {
        return CfgFish.tool_image.find(cfg => cfg.image_id == image_id)
    }

    public CfgBaitInfoByBaitId(bait_id: number) {
        return CfgFish.bait_info.find(cfg => cfg.bait_id == bait_id)
    }

    public CfgBaitInfoByItemId(item_id: number) {
        return CfgFish.bait_info.find(cfg => cfg.item_id == item_id)
    }

    public CfgToolImageByImageType(image_type: number = this.SelToolType) {
        return CfgFish.tool_image.find(cfg => cfg.image_type == image_type)
    }

    public CfgToolImageByJihuoItem(jihuo_item: number) {
        return CfgFish.tool_image.find(cfg => cfg.jihuo_item == jihuo_item)
    }

    public CfgShopBySeq(seq: number) {
        return CfgFish.shop.find(cfg => cfg.seq == seq)
    }


    public GetTypeShowList() {
        let list = []
        for (let [key, value] of Language.Fish.TypeShow.entries()) {
            list.push({ type: key, name: value })
        }
        return list
    }

    public GetFishActived(fish_id: number) {
        let info = this.InfoHistoryInfo[fish_id]
        if (info) {
            return info.fishHistoryLen > 0
        }
        return false
    }

    public GetCardShowList() {
        return [
            { seq: 0, num: this.CfgOtherReward, item_id: CommonId.Diamond },
            { seq: 1, num: this.CfgOtherDailyBread, item_id: this.CfgOtherBreadId },
            { seq: 2, num: this.CfgOtherDailyRefresh, item_id: this.CfgOtherRefreshTime },
            { seq: 3, num: 0 },
            { seq: 4, num: 0 },
        ]
    }

    public GetShopShowList() {
        let list = []
        for (let element of CfgFish.shop) {
            list.push(element)
        }
        return list
    }

    public GetOrderShowList() {
        let list = []
        for (let [key, value] of this.InfoTaskInfo.entries()) {
            if (value.taskId > 0) {
                list.push({ index: key, info: value, co: this.CfgDailyOrderByOrderId(value.taskId) })
            }
        }
        return list
    }

    public GetMapShowList() {
        let map = new Map()
        let list = []
        for (let element of CfgFish.island_info) {
            if (!map.has(element.island_id)) {
                map.set(element.island_id, element)
            }
        }
        list = Array.from(map.values())
        return list
    }

    public GetBaitShowList() {
        let list = []
        for (let element of CfgFish.bait_info) {
            list.push(element)
        }
        return list
    }

    public GetFashionShowList(tool_type = this.SelToolType) {
        let list = []
        for (let element of CfgFish.tool_image) {
            if (element.image_type == tool_type) {
                list.push(element)
            }
        }
        return list
    }

    public GetFashionActived(image_id: number = this.SelImageId, flag = this.InfoHuanHuaActiveFlag) {
        return bit.hasflag(flag, image_id)
    }

    public GetHandbookShowList(page: number = this.SelMapId) {
        let list = CfgFish.tujian.filter(cfg => cfg.page == page)
        let map = new Map()
        for (let element of list) {
            let is_fetch = FishData.Inst().GetHandbookFetchBySeq(element.seq)
            let actived = false
            if (!is_fetch) {
                actived = true
                let fish = FishData.Inst().GetHandbookFishList(element.group_content)
                for (let element2 of fish) {
                    actived = actived && element2.actived
                }
            }
            map.set(element.seq, { is_fetch: is_fetch ? 1 : 0, actived: actived ? 1 : 0 })
        }
        list.sort((a: any, b: any) => {
            let am = map.get(a.seq)
            let bm = map.get(b.seq)
            let af = am.is_fetch
            let bf = bm.is_fetch
            if (af < bf) {
                return -1;
            } else if (af > bf) {
                return 1;
            } else {
                let aa = am.actived
                let ba = bm.actived
                if (aa < ba) {
                    return 1;
                } else if (aa > ba) {
                    return -1;
                } else {
                    return 0;
                }
            }
        })
        return list
    }

    public GetHandbookFetchBySeq(seq: number) {
        return this.InfoBookRewardFetchFlag[seq]
    }

    public GetHandbookFishList(group_content: string) {
        let fishs = `${group_content}`.split("|")
        let list = []
        if (fishs.length > 0) {
            for (let element of fishs) {
                list.push({ id: +element, actived: this.GetFishActived(+element) })
            }
        }
        return list
    }

    public GetHandbookProgressInfo(list: any[]) {
        let max = 0
        let value = 0
        for (let element of list) {
            let fishs = this.GetHandbookFishList(element.group_content)
            for (let fish of fishs) {
                max++
                value = fish.actived ? (value + 1) : value
            }
        }
        return { max, value }
    }

    public GetBoxInfoShowList(type: number = this.SelFishType) {
        let list = []
        for (let element of this.InfoFishList) {
            if (element.fishId > 0) {
                let co = this.CfgFishInfoByFishId(element.fishId)
                if (co && co.type == type || 0 == type) {
                    list.push({ co: co, info: element })
                }
            }
        }
        return list
    }

    public GetBoxInfoLengthQua(co: any, length: number) {
        if (length <= co.length1) {
            return 1
        } else if (length <= co.length2) {
            return 2
        } else if (length <= co.length3) {
            return 3
        } else if (length <= co.length4) {
            return 4
        } else {
            return 5
        }
    }

    public GetBoxInfoLengthSell(co: any, length: number) {
        if (length <= co.length1) {
            return co.reward1
        } else if (length <= co.length2) {
            return co.reward2
        } else if (length <= co.length3) {
            return co.reward3
        } else if (length <= co.length4) {
            return co.reward4
        } else {
            return co.reward5
        }
    }

    public GetBoxInfoTotalScore() {
        let score = 0
        for (let element of this.InfoFishList) {
            if (element.fishId > 0) {
                let co = this.CfgFishInfoByFishId(element.fishId)
                if (co) {
                    score = score + Math.floor(co.score * element.fishLen / 10)
                }
            }
        }
        return score
    }


    public GetBoxRandFish(fish_id: number) {
        if (fish_id) {
            let index = this.BoxFish.indexOf(fish_id)
            if (index !== -1) {
                this.BoxFish.splice(index, 1);
            }
        }

        let list = []
        for (let element of this.InfoFishList) {
            if (element.fishId > 0) {
                let co = this.CfgFishInfoByFishId(element.fishId)
                if (co && !this.BoxFish.includes(element.fishId)) {
                    list.push(co)
                }
            }
        }
        if (list.length > 0) {
            let rand = MathHelper.GetRandomNum(0, list.length - 1)
            let fish = list[rand]
            this.BoxFish.push(fish.fish_id)
            return fish
        }
    }


    public GetRandPoint(fishType: number) {
        let points = CfgFish.rand_point.filter(cfg => cfg.type == fishType)
        if (points.length > 0) {
            let rand = MathHelper.GetRandomNum(0, points.length - 1)
            return points[rand]
        } else {
            return { pos_x: MathHelper.GetRandomNum(0, 800), pos_y: MathHelper.GetRandomNum(0, 1600) }
        }
    }

    public GetAttrShowList() {
        let list = []

        for (let [key, value] of this.InfoToolInfo.entries()) {
            let num = 0
            let co_tool = this.CfgToolInfoByIdLevel(key + 1, value.level)
            if (co_tool) {
                num = co_tool.pram
            }
            if (value.huanHuaId > 0) {
                let co_image = this.CfgToolImageByImageId(value.huanHuaId)
                if (co_image) {
                    num = num + co_image.parm
                }
            }
            list.push(TextHelper.Format(Language.Fish.AttrShow[key], num / 100))
        }

        let co_level = FishData.Inst().CfgFisherLevelByLevel()
        if (co_level) {
            list.unshift(TextHelper.Format(Language.Fish.AttrShow[4], co_level.level_add / 100))
        }

        if (this.InfoBaitId > 0) {
            let co_bait = FishData.Inst().CfgBaitInfoByBaitId(this.InfoBaitId)
            if (co_bait) {
                let name = ""
                switch (co_bait.bait_effect) {
                    case 1:
                        name = Language.Fish.TypeShow[co_bait.parm1] ?? ""
                        break;
                    case 2:
                        let co_fish = this.CfgFishInfoByFishId(co_bait.parm1)
                        name = co_fish ? co_fish.name : ""
                        break;
                    case 3:
                        name = Language.Fish.QuaShow[co_bait.parm1] ?? ""
                        break;
                }
                list.push(TextHelper.Format(Language.Fish.AttrShowBait[co_bait.bait_effect], name, `${co_bait.parm2 > 0 ? "+" : "-"}${Math.abs(co_bait.parm2) / 100}`))
            }
        }

        return list
    }

    public GetSellPrice(price: number) {
        let co = this.CfgFisherLevelByLevel()
        if (co) {
            return Math.floor((1 + co.level_add / 10000) * price)
        } else {
            return price
        }
    }

    public AutoFish() {
        this.IsAutoFish = !this.IsAutoFish
        if (this.IsAutoFish) {
            PublicPopupCtrl.Inst().Center(Language.Fish.Main.AutoStart)
            this.FishStart(true)
        } else {
            PublicPopupCtrl.Inst().Center(Language.Fish.Main.AutoEnd)
        }
    }

    public AutoSell() {
        if (this.IsAutoFish) {
            let fish_start = ROLE_SETTING_TYPE.SettingFishStart
            let info = this.InfoFish
            if (0 == RoleData.Inst().GetRoleSystemSetInfo(fish_start)) {
                let ifl = FishData.Inst().InfoFishList
                if (info.fishLen > ifl[info.fishId].fishLen) {
                    this.AutoStop(true)
                    return
                } else {

                }
            }
            if (0 == RoleData.Inst().GetRoleSystemSetInfo(fish_start + 1)) {
                let ihi = FishData.Inst().InfoHistoryInfo
                if (0 == ihi[info.fishId].fishHistoryLen) {
                    this.AutoStop(true)
                    return
                }
            }
            if (0 == RoleData.Inst().GetRoleSystemSetInfo(fish_start + 2)) {
                let show_order = false
                let co_fish = FishData.Inst().CfgFishInfoByFishId(info.fishId)
                for (let element of FishData.Inst().InfoTaskInfo) {
                    if (!show_order && element.taskId > 0) {
                        let co_order = FishData.Inst().CfgDailyOrderByOrderId(element.taskId)
                        if (0 == element.isFetch) {
                            if (element.processNum < co_order.parm1) {
                                switch (co_order.order_type) {
                                    case 1:
                                        show_order = co_fish.type == co_order.parm2
                                        break;
                                    case 2:
                                        show_order = co_fish.fish_id == co_order.parm2
                                        break;
                                }
                            }
                        }
                    }
                }
                if (show_order) {
                    FishCtrl.Inst().SendRoleFishReqSubTask()
                    return
                }
            }
            // if (0 == RoleData.Inst().GetRoleSystemSetInfo(fish_start + 3)) {
            //     if (bait_lack) {
            //         this.AutoStop(true)
            //         return
            //     }
            // }
            FishCtrl.Inst().SendRoleFishReqSell()
        } else {
            this.AutoStop(true)
        }
    }

    public AutoStop(stop: boolean) {
        if (stop) {
            this.IsAutoFish = false
            if (ViewManager.Inst().IsOpen(FishView)) {
                ViewManager.Inst().OpenView(FishGetView)
            }
            this.FishState = FishConfig.FishState.idle3
        }
    }

    public FishStart(is_auto = false) {
        if (0 == this.InfoPower) {
            PublicPopupCtrl.Inst().ItemNotEnoughNotice(this.CfgOtherBreadId)
            this.IsAutoFish = false
            return
        }
        if (FishConfig.FishState.idle == this.FishState) {
            this.FishState = FishConfig.FishState.paogan
            this.PlayAudio(AudioTag.huigan)
            this.fishTimer = Timer.Inst().AddRunTimer(() => {
                this.FishState = FishConfig.FishState.idle2
                this.PlayAudio(AudioTag.yugourushui)
                this.fishTimer = Timer.Inst().AddRunTimer(() => {
                    FishCtrl.Inst().SendRoleFishReqFish()
                    // this.FishState = FishConfig.FishState.qigan
                    // this.fishTimer = Timer.Inst().AddRunTimer(() => {
                    //     this.FishState = FishConfig.FishState.idle3
                    // }, this.FishAnimTime(), 1, false)
                }, this.FishAnimTime(), 1, false)
            }, this.FishAnimTime(), 1, false)
        } else {
            if (!is_auto) {
                PublicPopupCtrl.Inst().Center(Language.Fish.Main.FishingTips)
            }
        }
    }

    public FishAnimTime(time?: number) {
        time = time ?? FishConfig.FishAnimTime[this.FishState]
        return this.InfoFishCardTime > TimeCtrl.Inst().ServerTime ? (time / 2) : time
    }

    public FishSkin(sp_show: UISpineShow, preview: boolean = false, line_show = false) {
        if (!sp_show) {
            return
        }
        if (line_show) {
            let part = 3
            let name_slot = GetCfgValue(SPINE_ANI_SLOT, `Fish${part}`)
            let image_id = this.InfoToolInfo[part].huanHuaId
            sp_show.changSkin(name_slot, ResPath.FishTool(`${FishConfig.FishSkin[part]}${this.LineShow ? image_id : ""}`))
        } else {
            for (let [key, value] of this.InfoToolInfo.entries()) {
                let name_slot = GetCfgValue(SPINE_ANI_SLOT, `Fish${key}`)
                if (name_slot) {
                    if (preview && key == (this.SelToolType - 1)) {
                        sp_show.changSkin(name_slot, ResPath.FishTool(`${FishConfig.FishSkin[key]}${this.SelImageId}`))
                    } else {
                        sp_show.changSkin(name_slot, ResPath.FishTool(`${FishConfig.FishSkin[key]}${value.huanHuaId}`))
                    }
                }
            }
        }
    }

    public GetRedNum() {
        if (!FunOpen.Inst().GetFunIsOpen(Mod.Fish.View).is_open) {
            return 0
        }
        return ((1 == this.GetRedNumPower()) || (1 == this.GetRedNumCard()) || (1 == this.GetRedNumMap())
            || (1 == this.GetRedNumOrder()) || (1 == this.GetRedNumHandbook()) || (1 == this.GetRedNumTool())) ? 1 : 0
    }

    public GetRedNumTool() {
        let rp = 0
        for (let [key, value] of this.InfoToolInfo.entries()) {
            if (1 == this.GetRedNumToolType(key)) {
                rp = 1
                break
            }
        }
        return 0
    }

    public GetRedNumToolType(tool_type: number) {
        let rp = 0
        let info = this.InfoToolInfo[tool_type - 1]
        if (info) {
            let co_next = FishData.Inst().CfgToolInfoByIdLevel(tool_type, info.level + 1)
            if (co_next) {
                let co_tool = FishData.Inst().CfgToolInfoByIdLevel(tool_type, info.level)
                if (co_tool) {
                    if (BagData.Inst().GetItemNum(co_tool.item_id) >= co_tool.num) {
                        rp = 1
                    }
                }
            }
        }
        return rp
    }

    public GetRedNumOrder() {
        let rp = 0
        let show_list = FishData.Inst().GetOrderShowList()
        for (let element of show_list) {
            if (element.co && element.info) {
                if (0 == element.info.isFetch && element.info.processNum >= element.co.parm1) {
                    rp = 1
                    break
                }
            }
        }
        return rp
    }

    public GetRedNumMap() {
        return this.MapRedNum
    }

    public GetRedNumCard() {
        return ((TimeCtrl.Inst().ServerTime < FishData.Inst().InfoFishCardTime) && (0 == FishData.Inst().InfoIsFetchCardReward)) ? 1 : 0
    }

    public GetRedNumHandbook(list = CfgFish.tujian) {
        let rp = 0
        for (let element of list) {
            let fetch = FishData.Inst().GetHandbookFetchBySeq(element.seq)
            if (!fetch) {
                let list = FishData.Inst().GetHandbookFishList(element.group_content)
                let actived = true
                for (let element2 of list) {
                    actived = actived && element2.actived
                }
                if (actived) {
                    rp = 1
                    break
                }
            }
        }
        return rp
    }

    public GetRedNumPower() {
        return this.InfoPower >= this.CfgOtherBreadMax ? 1 : 0
    }

    public PlayAudio(tag: AudioTag) {
        if (ViewManager.Inst().IsOpen(FishView)) {
            AudioManager.Inst().Play(tag)
        }
    }
}
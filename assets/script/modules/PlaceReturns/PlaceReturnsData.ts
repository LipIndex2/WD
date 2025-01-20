import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { RoleData } from "modules/role/RoleData";
import { CfgRapidReturns } from "config/CfgRapidReturns";
import { CfgItem } from "config/CfgCommon";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { PlaceReturnsCtrl, PlaceReturnsType } from "./PlaceReturnsCtrl";
import { ConstValue } from "modules/common/ConstValue";

class PlaceReturnsResultData {
    @smartdata
    PlaceInfoFlush: boolean = false;
    @smartdata
    RapidInfoFlush: boolean = false;
}

export class PlaceReturnsData extends DataBase {
    public ResultData: PlaceReturnsResultData;
    // private Info: PB_MainFBRewardInfo;
    public PlaceInfo_list: { [type: number]: PB_MainFBRewardInfo } = {};
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        let self = this;
        self.ResultData = CreateSMD(PlaceReturnsResultData);
    }

    public OnPlaceReturnsResult(data: PB_MainFBRewardInfo) {
        this.PlaceInfo_list[data.rewardType] = data;
        if (data.rewardType == 0) {
            this.ResultData.PlaceInfoFlush = !this.ResultData.PlaceInfoFlush;
        } else {
            this.ResultData.RapidInfoFlush = !this.ResultData.RapidInfoFlush;
        }
    }

    public get PlaceInfo() {
        if (!this.PlaceInfo_list[0]) {
            PlaceReturnsCtrl.Inst().SendPlacePrizeInfo(PlaceReturnsType.FETCH_TIME_INFO);
        }
        return this.PlaceInfo_list[0];
    }

    public get RapidInfo() {
        if (!this.PlaceInfo_list[1]) {
            PlaceReturnsCtrl.Inst().SendPlacePrizeInfo(PlaceReturnsType.FETCH_QUICK_INFO);
        }
        return this.PlaceInfo_list[1];
    }

    //当前关卡
    public GetMainSceneLevel() {
        return RoleData.Inst().InfoMainSceneLevel;
    }

    //挂机时间
    public GetPlaceTime() {
        return this.PlaceInfo ? this.PlaceInfo.rewardTime : 0;
    }

    //关卡收益
    public GetPlaceEarnings() {
        let level = this.GetMainSceneLevel();
        if (level >= CfgRapidReturns.return.length) {
            return CfgRapidReturns.return[CfgRapidReturns.return.length - 1];
        }
        return CfgRapidReturns.return.find(cfg => {
            return cfg.barrier_id == level;
        })
    }

    //奖励列表
    public GetPrizeList(type: number) {
        let itemid = this.PlaceInfo_list[type] ? this.PlaceInfo_list[type].itemId : [];
        let itemNum = this.PlaceInfo_list[type] ? this.PlaceInfo_list[type].itemNum : [];
        let data: CfgItem[] = [];

        for (let i = 0; i < itemid.length; i++) {
            if (!ConstValue.LegalHeroArr.includes(itemid[i])) {
                continue;
            }
            data.push(new CfgItem(itemid[i], itemNum[i]));
        }
        return data;
    }

    //快速奖励次数
    public GetRapidReturnsNum() {
        return this.RapidInfo ? this.RapidInfo.todayBuyCount : 0;
    }
    //快速奖励最大次数
    public GetRapidReturnsMaxNum() {
        return CfgRapidReturns.get_price.length;
    }
    //收益时间上限
    public GetTimeMax() {
        return CfgRapidReturns.other[0].get_time_max;
    }

    public GetOtherCfg() {
        return CfgRapidReturns.other[0];
    }

    //快速奖励消耗
    public GetRapidReturnsConsume() {
        let num = this.GetRapidReturnsNum();
        let maxNum = this.GetRapidReturnsMaxNum();
        if (num == maxNum) {
            num--;
        }
        return CfgRapidReturns.get_price.find(cfg => {
            return cfg.time == num;
        })
    }

    GetAllRed() {
        let time = this.GetPlaceTime();
        if (TimeCtrl.Inst().ServerTime >= time) {
            return 1
        }
        return 0;
    }
}

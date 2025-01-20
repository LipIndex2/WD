import { ViewManager } from "manager/ViewManager";
import { CultivateData } from "modules/Cultivate/CultivateData";
import { MiningData } from "modules/Mining/MiningData";
import { RewardGetBoxView } from "modules/reward_get/RewardGetBoxView";
import { RewardGetView } from "modules/reward_get/RewardGetView";
import { BagData } from "./BagData";
import { DrawCardEffectView } from "modules/DrawCard/DrawCardEffectView";

export enum GET_TYPE {
    common = 0,								//!< 0 无效

    PUT_REASON_NO_NOTICE = 1,							//!< 不通知
    PUT_REASON_GM = 2,									//!< GM

    PUT_REASON_ROLE_LEVEL_UP = 9,						//!< 角色升级
    PUT_REASON_SHOP_BOX = 12,							//!< 商店宝箱
    PUT_REASON_WIN_BOX = 40,							//!< 胜利广告宝箱
    PUT_REASON_TRAFGIC_PERMIT = 27,						//!< 通行证
    PUT_REASON_ROUND_ACTIVITY = 34,			    		//!< 回合活动
    PUT_REASON_GENE_UP = 38,                            //!< 基因升级

    PUT_REASON_ZOMBIE_RUSH_PASS = 56,			    	//!< 僵尸冲冲冲战令

    PUT_MINING = 63,                                    //矿洞

    PUT_CAVE_PASS = 68,                                 //矿洞战令
    PUT_REASON_CULTIVATE = 76,                         //农场耕种活动
    PUT_REASON_FISH_PASS = 89,                               //钓鱼通行证
    PUT_REASON_FISH = 90,                               //钓鱼

    PUT_REASON_DRAW_CARD = 94,                               //抽奖

    PUT_REASON_MAX,										// 最大原因
}

export enum PUT_REASON_TYPE {
    PUT_REASON_INVALID = 0,								//!< 0 无效

    PUT_REASON_NO_NOTICE = 1,							//!< 不通知
    PUT_REASON_GM = 2,									//!< GM
    PUT_REASON_DAILY_CHALLENGE_BATTLE = 3,				//!< 每日挑战:战斗
    PUT_REASON_DAILY_CHALLENGE_FETCH = 4,				//!< 每日挑战:领取
    PUT_REASON_SERVER_MAIL = 5,							//!< 全服邮箱
    PUT_REASON_CMD_BUY = 6,								//!< 直购
    PUT_REASON_CHONG_ZHI = 7,							//!< 充值
    PUT_REASON_ONE_KEY_MAIL = 8,						//!< 一键领取邮箱
    PUT_REASON_ROLE_LEVEL_UP = 9,						//!< 角色升级
    PUT_REASON_MAINFB_FIGHT_REWARD = 10,				//!< 主线关卡战斗奖励
    PUT_REASON_MAINFB_BOX_REWARD = 11,					//!< 主线关卡宝箱奖励
    PUT_REASON_SHOP_BOX = 12,							//!< 商店宝箱
    PUT_REASON_ADVERTISEMENT = 13,						//!< 广告
    PUT_REASON_DAILY_BUY = 14,							//!< 每日特惠
    PUT_REASON_SHOP_BUY = 15,							//!< 商城购买
    PUT_REASON_DAILY_TASK_FETCH_REWARD = 16,			//!< 日常任务领取奖励
    PUT_REASON_ENERGY_UPDATE = 17,						//!< 体力回复
    PUT_REASON_MAINFB_TIME_REWARD = 18,					//!< 挂机收益
    PUT_REASON_MAINFB_QUICK_REWARD = 19,				//!< 快速收益
    PUT_REASON_BUY_ENERGY = 20,							//!< 购买体力

    PUT_REASON_TRAFGIC_PERMIT = 27,			    		//!< 通行证
    PUT_REASON_ROUND_ACTIVITY = 34,			    		//!< 回合活动
    PUT_REASON_GENE_UP = 38,			    		    //!< 基因升级

    PUT_REASON_ZOMBIE_RUSH_PASS = 56,			    	//!< 僵尸冲冲冲战令

    PUT_MINING = 63,                                    //矿洞

    PUT_CAVE_PASS = 68,                                 //矿洞战令
    PUT_REASON_CULTIVATE = 76,                          //农场耕种活动
    PUT_REASON_FISH_PASS = 89,                               //钓鱼通行证
    PUT_REASON_FISH = 90,                               //钓鱼

    PUT_REASON_DRAW_CARD = 94,                               //抽奖

    PUT_REASON_MAX,										// 最大原因
};

export const BagNoticeFun: { [key: number]: Function } = {
    [GET_TYPE.common]: (data: PB_SCGetItemNotice) => {
        ViewManager.Inst().OpenView(RewardGetView, { reward_data: data.itemList, call_back: null })
    },
    [GET_TYPE.PUT_REASON_SHOP_BOX]: (data: PB_SCGetItemNotice) => {
        ViewManager.Inst().OpenView(RewardGetBoxView, { reward_data: data.itemList, call_back: null })
    },
    [GET_TYPE.PUT_REASON_WIN_BOX]: (data: PB_SCGetItemNotice) => {
        RewardGetBoxView.boxType = 6;
        RewardGetBoxView.needClickOpen = false;
        ViewManager.Inst().OpenView(RewardGetBoxView, { reward_data: data.itemList, call_back: null })
    },
    [GET_TYPE.PUT_REASON_ROLE_LEVEL_UP]: (data: PB_SCGetItemNotice) => {
    },
    [GET_TYPE.PUT_REASON_TRAFGIC_PERMIT]: (data: PB_SCGetItemNotice) => {
        if (BagData.Inst().ShowRewardBox) {
            ViewManager.Inst().OpenView(RewardGetBoxView, { reward_data: data.itemList, call_back: null })
        } else {
            ViewManager.Inst().OpenView(RewardGetView, { reward_data: data.itemList, call_back: null })
        }
    },
    [GET_TYPE.PUT_MINING]: (data: PB_SCGetItemNotice) => {
        MiningData.Inst().excavateInfo.itemList = data.itemList;
        MiningData.Inst().FlushExcavateInfo();
    },
    [GET_TYPE.PUT_REASON_CULTIVATE]: (data: PB_SCGetItemNotice) => {
        if (CultivateData.Inst().IsOpenCell) {
            CultivateData.Inst().itemList = data.itemList;
        } else {
            ViewManager.Inst().OpenView(RewardGetView, { reward_data: data.itemList, call_back: null })
        }
    },
    [GET_TYPE.PUT_REASON_FISH]: (data: PB_SCGetItemNotice) => {
        // if (data.itemList[0] && FishData.Inst().CfgOtherFishCoin == data.itemList[0].itemId) {
        //     PublicPopupCtrl.Inst().Center(Language.Fish.Fashion.ItemTips)
        // }
        // ViewManager.Inst().OpenView(RewardGetView, { reward_data: data.itemList, call_back: null })
    },
    [GET_TYPE.PUT_REASON_DRAW_CARD]: (data: PB_SCGetItemNotice) => {
        ViewManager.Inst().OpenView(DrawCardEffectView, { reward_data: data.itemList, call_back: null })
    },
}

export let BagNoticeBoxFun: { [key: number]: boolean } = {
    [GET_TYPE.PUT_REASON_TRAFGIC_PERMIT]: true,
    [GET_TYPE.PUT_REASON_ROUND_ACTIVITY]: true,
    [GET_TYPE.PUT_REASON_ZOMBIE_RUSH_PASS]: true,
    // [GET_TYPE.PUT_CAVE_PASS]: true,
    // [GET_TYPE.PUT_REASON_FISH_PASS]: true,
}

export let UnNoticeCommon: { [key: number]: boolean } = {
    [GET_TYPE.PUT_REASON_NO_NOTICE]: true,
    [GET_TYPE.PUT_REASON_GM]: true,
    [GET_TYPE.PUT_REASON_ROLE_LEVEL_UP]: true,
    [GET_TYPE.PUT_REASON_GENE_UP]: true,
}

// //总共13个广告位置 这里使用了10个 47 用两次 31 用两次
// export let NeedCheckAdCard: { [key: number]: boolean } = {
//     [PUT_REASON_TYPE.PUT_REASON_ADVERTISEMENT]: true,
//     [PUT_REASON_TYPE.PUT_REASON_RUNE_TOWER_TURNTABLE]: true,
//     [PUT_REASON_TYPE.PUT_REASON_RA_DAILY_SHARING]: true,
//     [PUT_REASON_TYPE.PUT_REASON_RA_ADVERTISEMENT_EQUITY]: true,
//     [PUT_REASON_TYPE.PUT_REASON_PET_TREASURE]: true,
//     [PUT_REASON_TYPE.PUT_REASON_RA_BOX_FUND]: true,
//     [PUT_REASON_TYPE.PUT_REASON_LIMIT_CORE_BOX]: true,
//     [PUT_REASON_TYPE.PUT_REASON_RA_DAILY_GIFT]: true,
//     [PUT_REASON_TYPE.PUT_REASON_RA_LEVEL_FUND]: true,
// }
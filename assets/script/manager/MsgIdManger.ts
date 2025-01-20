import { MsgId } from "core/net/MsgIdRegister";
import { Singleton } from "core/Singleton";

export class MsgIdManger extends Singleton {
    public Init() {

        MsgId.RegisterMsg(700, PB_SCNoticeNum);
        // //msgserver
        MsgId.RegisterMsg(7056, PB_CSLoginToAccount);
        MsgId.RegisterMsg(7000, PB_SCLoginToAccount);

        MsgId.RegisterMsg(9000, PB_SCTimeAck);
        MsgId.RegisterMsg(9001, PB_SCDisconnectNotice);

        MsgId.RegisterMsg(9050, PB_CSTimeReq);
        MsgId.RegisterMsg(1053, PB_CSHeartbeatReq);
        MsgId.RegisterMsg(1003, PB_SCHeartbeatResp);

        MsgId.RegisterMsg(1400, PB_SCRoleInfoAck);
        MsgId.RegisterMsg(1402, PB_SCRoleExpChange);
        MsgId.RegisterMsg(1403, PB_SCRoleLevelChange);
        MsgId.RegisterMsg(1405, PB_CSRoleWXInfoSetReq);  //外部头像和名字设置
        MsgId.RegisterMsg(1407, PB_CSRoleSetHeadFrame);

        MsgId.RegisterMsg(2160, PB_CSGameCircleReq);
        MsgId.RegisterMsg(2161, PB_SCGameCircleInfo);

        //GM命令
        MsgId.RegisterMsg(2001, PB_CSGMCommand);
        MsgId.RegisterMsg(2000, PB_SCGMCommand);

        //msghero
        MsgId.RegisterMsg(2021, PB_SCHeroInfo);
        MsgId.RegisterMsg(2020, PB_CSHeroReq)
        MsgId.RegisterMsg(2022, PB_SCGeneInfo);
        MsgId.RegisterMsg(2024, PB_SCGeneTaskInfo);
        MsgId.RegisterMsg(2130, PB_SCHerotrialInfo);

        //msgbattle
        MsgId.RegisterMsg(2010, PB_CSBattleRet)
        MsgId.RegisterMsg(2011, PB_SCBattleReport)

        //msgsetting
        MsgId.RegisterMsg(1460, PB_CSRoleSystemSetReq);
        MsgId.RegisterMsg(1461, PB_SCRoleSystemSetInfo);
        MsgId.RegisterMsg(1464, PB_CSNoticeTimeReq);

        MsgId.RegisterMsg(1451, PB_CSRoleOtherOperReq);
        MsgId.RegisterMsg(1452, PB_SCRoleZhuoMianReward);

        //msgknapsack
        MsgId.RegisterMsg(1500, PB_CSKnapsackReq);
        MsgId.RegisterMsg(1504, PB_SCItemNotEnoughNotice);
        MsgId.RegisterMsg(1505, PB_SCKnapsackAllInfo);
        MsgId.RegisterMsg(1506, PB_SCKnapsackSingleInfo);
        MsgId.RegisterMsg(1507, PB_SCGetItemNotice);

        //msgmainfb
        MsgId.RegisterMsg(1510, PB_DailyChallengeFetch);
        MsgId.RegisterMsg(1511, PB_DailyChallengeInfo);
        MsgId.RegisterMsg(1520, PB_MainFBOper);
        MsgId.RegisterMsg(1521, PB_MainFBInfo);
        MsgId.RegisterMsg(1522, PB_MainFBRewardInfo);
        MsgId.RegisterMsg(1523, PB_MainFBPassInfo);
        MsgId.RegisterMsg(1560, PB_DailyFBOper);
        MsgId.RegisterMsg(1561, PB_DailyFBInfo);

        MsgId.RegisterMsg(3029, PB_SCZombieGoGoGoInfo);
        MsgId.RegisterMsg(3035, PB_SCZombiGoGoGoPassInfo);
        MsgId.RegisterMsg(3043, PB_SCRaBackYardPassInfo);

        MsgId.RegisterMsg(3044, PB_SCRaFarminginfo);
        MsgId.RegisterMsg(3046, PB_SCRaFarmingRet);

        //msgshop
        MsgId.RegisterMsg(1531, PB_CSShopBoxReq);
        MsgId.RegisterMsg(1532, PB_SCShopBoxInfo);
        MsgId.RegisterMsg(1533, PB_CSShopReq);
        MsgId.RegisterMsg(1534, PB_SCShopInfo);
        MsgId.RegisterMsg(1545, PB_CSDailyBuyReq);
        MsgId.RegisterMsg(1546, PB_SCDailyBuyInfo);
        MsgId.RegisterMsg(3028, PB_SCRaShopGiftInfo);

        MsgId.RegisterMsg(1665, PB_CSFirstRechargeOper);
        MsgId.RegisterMsg(1666, PB_SCFirstRechargeInfo);

        //msgad
        MsgId.RegisterMsg(1662, PB_SCAdvertisementInfo);
        MsgId.RegisterMsg(1663, PB_CSAdvertisementFetch);   // 广告奖励

        //msgtask
        MsgId.RegisterMsg(2050, PB_CSDailyTaskReq);
        MsgId.RegisterMsg(2051, PB_SCDailyTaskInfo);

        //msgrecharge
        MsgId.RegisterMsg(3001, PB_SCChongZhiInfo);
        MsgId.RegisterMsg(3002, PB_SCChongZhiInfoChange);
        MsgId.RegisterMsg(3004, PB_CSChongZhiConfigReq);
        MsgId.RegisterMsg(3005, PB_SCChongZhiConfigInfo);

        //activity
        MsgId.RegisterMsg(3000, PB_CSRandActivityOperaReq);
        MsgId.RegisterMsg(3003, PB_SCActivityStatus);

        MsgId.RegisterMsg(3036, PB_SCSevenDayGiftInfo);
        MsgId.RegisterMsg(3037, PB_SCRaGeneNewbeeGiftInfo);
        MsgId.RegisterMsg(3038, PB_SCRaTimeLimitRechargeInfo);
        MsgId.RegisterMsg(3039, PB_SCRaCavePassInfo);
        MsgId.RegisterMsg(3040, PB_SCRaGeneGiftInfo);
        MsgId.RegisterMsg(3041, PB_SCRaPartsGiftInfo);
        MsgId.RegisterMsg(3047, PB_SCRaFishPassInfo);
        MsgId.RegisterMsg(3048, PB_SCRaPickUpInfo);

        MsgId.RegisterMsg(3020, PB_SCRaFriendInfo);
        MsgId.RegisterMsg(3021, PB_SCRaNewbeeGiftInfo);
        MsgId.RegisterMsg(3022, PB_SCRaGrowGiftInfo);
        MsgId.RegisterMsg(3023, PB_SCRaBarrierPackInfo);
        MsgId.RegisterMsg(3024, PB_SCRaRoundPassInfo);
        MsgId.RegisterMsg(3025, PB_SCRaItemBuyInfo);
        MsgId.RegisterMsg(3026, PB_SCRaTaskInfo);
        MsgId.RegisterMsg(3027, PB_SCRaTaskBuyInfo);

        MsgId.RegisterMsg(3030, PB_SCLostTempleInfo);
        MsgId.RegisterMsg(3031, PB_SCLostTempleShopInfo);
        MsgId.RegisterMsg(3032, PB_SCLostTempleMissionInfo);
        MsgId.RegisterMsg(3033, PB_SCLostTempleItemInfo);
        MsgId.RegisterMsg(3034, PB_SCHouZhaiInfo);

        MsgId.RegisterMsg(3042, PB_SCRaBackYardInfo);

        MsgId.RegisterMsg(3045, PB_SCRaArenaPassInfo);

        MsgId.RegisterMsg(2101, PB_SCRaPassCheckInfo);
        MsgId.RegisterMsg(2071, PB_SCMoneyBoxInfo);
        MsgId.RegisterMsg(2090, PB_CSGrowthFundReq);
        MsgId.RegisterMsg(2091, PB_SCGrowthFundInfo);

        MsgId.RegisterMsg(2110, PB_SCAdPassInfo);

        MsgId.RegisterMsg(2120, PB_CSMiningCaveReq);
        MsgId.RegisterMsg(2121, PB_SCMiningCaveInfo);
        MsgId.RegisterMsg(2122, PB_SCInstituteInfo);

        MsgId.RegisterMsg(1550, PB_SevenDayReq);
        MsgId.RegisterMsg(1551, PB_SevenDayInfo);

        //rank
        MsgId.RegisterMsg(1524, PB_MainFBRankInfo);
        MsgId.RegisterMsg(9601, PB_SCRankList);
        MsgId.RegisterMsg(9602, PB_CSRankReq);

        //msgmail
        MsgId.RegisterMsg(9501, PB_SCMailDeleteAck);
        MsgId.RegisterMsg(9504, PB_SCMailListAck);
        MsgId.RegisterMsg(9505, PB_SCMailDetail);
        MsgId.RegisterMsg(9506, PB_SCFetchMailAck);
        MsgId.RegisterMsg(9551, PB_CSMailReq);

        //msgmail
        MsgId.RegisterMsg(2080, PB_CSSevenDayHeroReq);
        MsgId.RegisterMsg(2081, PB_SCSevenDayHeroInfo);

        MsgId.RegisterMsg(1667, PB_SCBattleRevive);
        MsgId.RegisterMsg(1668, PB_SCBattleBuffRefresh);
        MsgId.RegisterMsg(2023, PB_SCTodayGainInfo);
        MsgId.RegisterMsg(1501, PB_CSBuyCmdReq);

        //territory
        MsgId.RegisterMsg(9630, PB_CSTerritoryReq);
        MsgId.RegisterMsg(9631, PB_SCTerritoryInfo);
        MsgId.RegisterMsg(9632, PB_SCTerritoryNeighbourInfo);
        MsgId.RegisterMsg(9633, PB_SCTerritoryBotInfo);
        MsgId.RegisterMsg(9634, PB_SCTerritoryReportInfo);
        MsgId.RegisterMsg(9635, PB_SCTerritoryRedInfo);

        //fish
        MsgId.RegisterMsg(2140, PB_CSRoleFishReq);
        MsgId.RegisterMsg(2141, PB_SCRoleFishInfo);
        MsgId.RegisterMsg(2142, PB_SCRoleFishPowerInfo);
        MsgId.RegisterMsg(2143, PB_SCRoleFishCommonInfo);
        MsgId.RegisterMsg(2144, PB_SCRoleFishFishInfo);
        MsgId.RegisterMsg(2145, PB_SCRoleFishFishListInfo);
        MsgId.RegisterMsg(2146, PB_SCRoleFishLevelInfo);
        MsgId.RegisterMsg(2147, PB_SCRoleFishBookRewardInfo);
        MsgId.RegisterMsg(2148, PB_SCRoleFishToolInfo);
        MsgId.RegisterMsg(2149, PB_SCRoleFishShopInfo);
        MsgId.RegisterMsg(2150, PB_SCRoleFishTaskInfo);
        
        MsgId.RegisterMsg(3049, PB_SCRaArenaDailyGiftInfo);

        //竞技场
        MsgId.RegisterMsg(9640, PB_CSArenaReq);         //竞技场请求
        MsgId.RegisterMsg(9641, PB_SCArenaInfo);        //竞技场主界面信息
        MsgId.RegisterMsg(9642, PB_SCArenaTargetInfo);  //匹配到对手
        MsgId.RegisterMsg(9643, PB_SCArenaShopInfo);    //商店信息
        MsgId.RegisterMsg(9644, PB_SCArenaReportInfo);  //战报信息
        MsgId.RegisterMsg(9645, PB_SCArenaMapInfo);     //竞技场皮肤信息
        MsgId.RegisterMsg(9646, PB_SCArenaBuyInfo);     //竞技场皮肤信息

        MsgId.RegisterMsg(1669, PB_SCBattleSpeed3);     //试用3倍数
    }
}

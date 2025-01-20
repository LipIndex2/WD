//活动状态
export enum ActStatusType {
    Close = 0,		// 活动未开启或关闭状态
    Standy = 1,     //活动准备状态
    Open = 2,       //活动进行中
    Finish = 3,     //活动已结束
}

//活动id
export enum ACTIVITY_TYPE {
    InviteFriend = 2049,//邀请好友
    PassCheck = 2050,//通行证
    NewPack = 2051,//新手礼包
    GrowGift = 2052,//成长礼包
    BarrierPack = 2053,//章节礼包
    RoundPack = 2054,//回合活动
    DeepCeleGift = 2055, //深渊礼包
    DeepCele = 2056,//深渊庆典
    ShopGift = 2057,//商城礼包
    ZombieGoGoGo = 2058,//僵尸冲冲冲
    LoseTemple = 2059,//失落神殿
    DevilWarorder = 2060,//魔王战令
    HouZai = 2061,      //后宅探险
    ZombieRushPass = 2062,      //僵尸冲冲冲战令
    SevenDaysPack = 2063, //连续七天礼包
    GeneGift = 2064, //基因新手礼包
    LimitedRecharge = 2065, //限时累充
    EverydayChallenge = 2066, //每日挑战
    CavePass = 2067, //挖矿战令
    GeneOrientation = 2068, //基因定向礼包
    TerritoryModGift = 2069, //领地零件礼包
    DefenseHome = 2070,     //守卫后院
    DefensePassCheck = 2071,     //守卫后院战令
    Cultivate = 2072,     //农场耕种
    ArenaPass = 2073,   //竞技场战令
    FishPass = 2074,   //钓鱼战令
    DrawCard = 2075,   //抽卡
    ArenaGift = 2076,   //竞技场每日礼包
    Arena = 2077,       //竞技场
}


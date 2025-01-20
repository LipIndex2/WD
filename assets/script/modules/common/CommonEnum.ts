//-----------------------------------------------------
// 游戏中的枚举
//-----------------------------------------------------
export enum ItemColor {
    None = 0,
    Green = 1,
    Blue = 2,
    Purple = 3,
    Yellow = 4,
}

//图标类型
export enum ICON_TYPE {
    ITEM = 0,   //物品
    ACT = 1,    //活动
    ROLE = 2,   //头像
    TASK = 3,   //任务
    MainFB = 4, //主线关卡
    SKILL = 5,  //技能图标
    CHALLENGE_RULE = 6,  //挑战规则图标
    GROWPACK = 7,  //成长礼包背景
    SHOPGIFT = 8,  //商城礼包背景
    HEROEFFECT = 9,  //英雄词条效果
    HEROSMALL = 10,  //英雄头像 小
    HERODRAWING = 11,  //英雄立绘
    REMAINS = 12,  //遗物
    HEADFRAME = 13,  //头像框
    SPICON = 14,    //特殊图标
    HEROSBIG = 15,  //英雄头像 大
    HEROSMAIN = 16,  //英雄头像 主界面
    ACTIVITYCOMBAT = 17,  //活动关卡
    HEADICON = 18,  //玩家头像
    SCENE_CELL = 19,    //场景上的格子
    HERO_TRIAL = 20,    //英雄试炼背景
    ARENA_RANK = 21,    //竞技场段位
    ARENA_RANK_SAMLL = 22,  //竞技场段位小图标
    ARENA_SKIN = 23,    //竞技场皮肤
    ARENA_SKIN_ATT = 24,    //场景皮肤属性
    DrawCard = 25,    //抽卡背景
}

//技能品质图标
export var SkillBgQuaCfg: { [key: number]: string } = {
    [1]: "PinZhi1",
    [2]: "PinZhi2",
    [3]: "PinZhi3",
}


export enum TimeType {
    TIME_MINUTE_SECOND_NUM = 60,   //一分钟
    TIME_HOUR_SECOND_NUM = 3600,   //一小时
    TIME_DAY_SECOND_NUM = 86400,   //一天
    TIME_WEEK_SECOND_NUM = 604800  //一周
}

// 与ItemData all_item_config对应
export enum ITEM_BIG_TYPE {
    OTHER = 0,
    DEBRIS = 1,
    GIFT = 2,
    GENE = 3,
    RANDOM_DNA = 4,
    FISH = 5,
}

export enum ITEM_SHOW_TYPE {
    NORMAL = 0,
    HERO_PIECE = 1,
    FISH = 2,
    FISH_TOOL = 3,
    FISH_BAIT = 4,
}

export enum CommonId {
    Gold = 40000,           //金币
    Diamond = 40001,        //钻石
    Exp = 40002,            //经验
    Energy = 40004,         //体力
    CelePoint = 40046,      //盛典积分
    WanNengKa = 40692,      //万能卡
    TempleIntegral = 40049,      //魔王城神殿积分
    WeekIntegral = 40051,      //魔王城周常积分
    DevilWarOrder = 40054,     //魔王战令道具
    RedGem = 40063,         //矿洞红钻
    ArenaItemId = 40075,        //竞技场挑战卷
    ArenaPassItemId = 40072,    //竞技场积分
}

export let CommonIdAdd: { [key: number]: boolean } = {
}

// 玩家属性
export enum BATTLE_ATTR {
    BATTLE_ATTR_MIN = 0,
    HP,            // 生命 一般情况下， 生命值降为0时，战斗失败
    ATTACK,          // 攻击 提高造成的伤害
    ARMOR,          // 防御 减少受到的伤害
    SPEED,          // 速度 速度较高的玩家会在回合内先发起攻击
    TRUE_DAMAGE,      // 最终伤害 

    VAMPIRIC,        // 吸血//根据伤害，按吸血百分比回复自己生命//吸血量 = 造成的伤害 * （a吸血 - b忽视吸血）
    COUNTER,        // 反击//反击 : 被攻击时有概率立即发起攻击，可打断对方连击，被击晕时无法反击//反击率 = a反击 - b忽视反击
    COMBO,          // 连击//攻击时，有概率再次攻击，每次连击后概率都会衰减//连击率 = a连击 - b忽视连击
    EVASION,        // 闪避//有概率完全不受伤害
    CRITICAL,        // 暴击//攻击有概率攻击造成2倍伤害，暴击无法被闪避
    STUN,          // 击晕//攻击时有概率打晕对手，使其无法行动//击晕率 = a击晕 - b忽视击晕

    VAMPIRIC_IMMUNITY,    // 忽视吸血//减少对方的吸血百分比
    COUNTER_IMMUNITY,    // 忽视反击//减少对方的反击几率
    COMBO_IMMUNITY,      // 忽视连击//减少对方的连击几率
    EVASION_IMMUNITY,    // 忽视闪避//减少对方的闪避几率
    CRITICAL_IMMUNITY,    // 忽视暴击//减少对方的暴击几率
    STUN_IMMUNITY,      // 忽视击晕//减少对方的击晕几率

    TYRANNY,        // 暴虐//暴击伤害倍率增加，10%即为暴击造成2.1倍伤害
    BENEVOLENCE,      // 仁爱//仁爱 : 减少你受到暴击时的额外伤害，与对方的暴虐相互抵消
    MUDDY,          // 泥泞//减少对方速度//战斗开始生效，使对方变为当前速度*（1 - 泥泞）
    INTERDICTION,      // 禁疗//减少对方所有生命回复效果的百分比，到达100%时对方无法获得任何生命回复
    REJUVENATION,      // 回复//第五回合时，按最大生命值百分比回复生命
    BULLYING,        // 欺凌//对方生命低于50%时，造成额外伤害
    PILLAGE,        // 掠财//在竞技场获得更多金币
    GLADIATUS,        // 角斗士//增加可携带挑战券数量
    MONEY_ADD,  //装备出售金钱增加

    HP_PER, //生命万分比
    ATTACK_PER, //攻击万分比
    ARMOR_PER, //防御万分比
    SPEED_PER, //速度万分比
    BATTLE_ATTR_MAX,


    FISH_ATTR_1 = 101,
    FISH_ATTR_2 = 102,
    FISH_ATTR_3 = 103,
    FISH_ATTR_4 = 104,
    FISH_ATTR_5 = 105,
}

export enum ROLE_SETTING_TYPE {
    SettingMusic = 0,      //音乐
    SettingAudio = 1,      //音效
    SettingGuide = 2,       //指引
    SettingBattleDefGuide = 3,  //守卫后院战斗指引
    SettingFishStart = 30,  //钓鱼托管
    SettingGuideStart = 40, //指引开始
    SettingGuide1 = 41,      //指引1
    SettingGuide2 = 42,      //指引2
    Max = 60,
}

export enum AdType {
    invalid = 0,                //无效
    task_flush = 1,             //任务刷新
    shop_dicount = 2,           //每日特惠
    shop_diamond = 3,           //钻石商城钻石
    shop_gold = 4,              //金币商城金币
    shop_dicount_flush = 5,     //每日特惠刷新
    quick_get = 6,              //快速领取
    energy_buy = 7,             //体力购买
    relive = 8,                 //复活
    battle_flush_skill = 9,     //刷新词条
    main_ad = 10,               //主界面广告
    deep_cele_gift = 11,        //盛典礼包
    win_box = 12,               //战斗结算
    pub_flush = 13,             //酒馆刷新
    Energ_recover = 14,         //体力恢复
    act_hou_zai = 15,           //后宅探险活动
    mail = 16,                  //邮箱广告
    mining_excavate = 17,       //矿搞恢复
    mining_bit = 18,            //钻头恢复
    mining_bomb = 19,           //炸弹恢复
    Institute = 20,             //研究所
    territory_flush = 21,       //领地刷新
    fish_bread = 22,            //钓鱼面包
    battle_speed = 23,          //3倍数试用
    battle_free_box = 24,       //战斗词条宝箱
}

//开放域发送信息结构
export class OPEM_PARAM {
    public type: string
    public event: string
    public value: any
    public strValue: string
    public numValue: number
}

export enum msgType {
    void = "void",
    openid = "openid",
    score = "score",
    draw = "draw",
    setScore = "setScore",
    getScore = "getScore",
    friendScore = "friendScore",
    level = "level",
    //引擎部分命令
    clear = "clear",
    destroyAll = "destroyAll",
    off = "off",
    on = "on",
    emit = "emit",
    once = "once",
    bindEvents = "bindEvents",
    eventHandler = "eventHandler",
    repaint = "repaint",
    initRepaint = "initRepaint"
}

export enum ERRORCODE {
    /**sdk登录失败 */
    err1 = 1,
    /**登录界面报错 */
    err2 = 2,
}


/** --------新加--------- */

export let IsHeroEffectlShow: { [key: string]: string } = {
    ["att_scope"]: "GongJiLeiXing",
    // ["att_distance"]: "GongJiJuLi",
    ["att"]: "GongJiLi",
    ["att_speed"]: "GongJiSuDu",
    ["blood_time"]: "LiuXueShiJian",
    ["firing_time"]: "ZhuoShaoShiJian",
    ["explosion_range"]: "BaoZhaFanWei",
    ["catapult_num"]: "DanSheShuLiang",
    ["xuanyun_time"]: "XuanYunShiJian",
    ["hurt_time"]: "YiShangShiJian",
    ["methysis_time"]: "ZhongDuShiJian",
    ["moderate_time"]: "JianSuShiJian",
    ["moderate_effect"]: "JianSuXiaoGuo",
    // ["cold_time"]: "LingDongShiJian",
}
/** --------新加--------- */

export enum ENUM_MAT_PROPERTY {
    width = "width"
}

/**7000协议枚举 */
export enum ENUM_7000_EVENT {
    LOGIN_RESULT_SUC = 0,               //!< 0 成功
    LOGIN_NO_THREAD = -1,
    LOGIN_SERVER_ERROR = -2,            //!< 2 服务器发生错误
    LOGIN_RESULT_EXIST = -3,
    LOGIN_SCENE_NOT_EXIST = -4,         //!< 4 场景不存在 
    LOGIN_RESULT_NO_GATEWAY = -5,       //!< 5 网关不存在
    LOGIN_RESULT_NO_ROLE = -6,          //!< 6 没有角色
    LOGIN_THREAD_BUSY = -7,
    LOGIN_LOGIN_FORBID = -8,            //!< 8 已被封号
    LOGIN_ANTI_WALLOW = -9,
    LOGIN_FORBID_NEW_ROLE = -10,        //!< 10 禁止创建新号
    LOGIN_TOKEN_ERROR = -11,			//!< 11 token错误
    LOGIN_OTHER_LOGIN = -12,			//!< 12 其他人登录
}

/**9001协议枚举 */
export enum ENUM_9001_EVENT {
    DISCONNECT_NOTICE_TYPE_INVALID = 0,
    /**玩家在别处登录 */
    DISCONNECT_NOTICE_TYPE_LOGIN_OTHER_PLACE,
    DISCONNECT_NOTICE_TYPE_CLIENT_REQ,											// 客户端请求
    DISCONNECT_NOTICE_TYPE_ROLE_RESET,											// 删除角色
    /**服务器重启 */
    DISCONNECT_NOTICE_TYPE_SERVER_RESET,
}
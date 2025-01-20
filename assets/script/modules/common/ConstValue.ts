
export var ConstValue = {
    PKGNAME: {
        CommonItem: "CommonItem"
    },
    //公用包
    PoolPackNames: [
        'CommonBoard',
        'CommonAtlas',
        'CommonButton',
        'CommonItem',
        'CommonWidgets',
        'CommonCurrency',
        'CommonComboBox',
    ],

    //最先加载的包
    FirstShowPoolPackNames: [
        'CommonScreen',
        'CommonFont',
        'Audio',
    ],
    NameEffect: "UItexiao_",

    HTTPS_VALUE: [
        "wss"
    ],

    LocalStrogeKey: {
        Game: "GameValue",
        DeviceId: 0
    },
    BehaveType: {
        RoleLogin: "RoleLogin",
        RoleLogout: "RoleLogout",
        CreatRole: "CreatRole",
        LevelUp: "LevelUp",
        EnterServer: "EnterServer"
    },
    /**fgui自定义参数 */
    FGUIBaseUserData: {
        /**资源依赖 */
        Rely: "Rely",
        /**禁止点击震动 */
        WxVibrate: "WxVibrate:0",
        /**资源释放时间 */
        Quete: "Quete",
        NewView: "NewView",
        FGUIBaseUserValue: "FGUIBaseUserValue",
        poolHttp: "poolHttp",
    },
    /**fgui自定义参数 */
    FGUIBaseUserValue: {
        ShareLogo: "",
        regRoleName: "\[^\\u4E00-\\u9FA5|\\d|\\a-zA-Z|\\r\\n\\s,.?!，。？！…—&$=()-+/*{}[\\]\]|\\r\\n\\s",
        /**点赞次数 */
        likeTime: 2,
        /**请求失败次数 */
        failTimes: 5,
        /**打开设置界面次数 */
        openSetting: 1
    },
    /**合法使用的英雄 */
    LegalHeroArr: [
        40008,
        40009,
        40010,
        40011,
        40012,
        40013,
        40014,
        40015,
        40017,
        40018,
        40019,
        40020,
    ],

    /**开宝箱最大次数 */
    OpenTreasureMaxTimes: 20,
}


/** sdk状态码 */
export enum CODE_STATUS {
    NONE,   //空
    SUCC,   //成功
    FAIL,   //失败
}
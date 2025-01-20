export enum CommonEvent {
    /**FGUI package销毁 */
    FGUI_PACKAGE = "ev0",
    /**打开页面 arg1 viewName：string arg2 viewClass  */
    VIEW_OPEN = "ev0-0",
    /**关闭页面 arg1 viewName：string arg2 viewClass  */
    VIEW_CLOSE = "ev0-1",

    FGUI_PACKAGE_ONLOAD = "ev0-2",
    NET_CLOSE = "ev1",
    NET_RECONS = "ev1-0",
    NET_RECON = "ev1-1",
    /**切服 */
    NET_SWITCH = "ev1-2",
    /**开始切服 */
    NET_BEFORE_SWITCH = "ev1-3",
    /**断网重连 */
    NET_CHECKED = "ev1-4",
    /** HTTP连接超时*/
    NET_HTTP_TIMEOUT = "ev1-5",

    LOGIN_SUCC = "ev2",
    /**获取到角色信息 */
    LOGIN_SUCC_ROLEDATA = "ev2-1",

    /**登录设置sdkUID */
    LOGIN_SET_SDK_UID = "ev2-2",

    /**菜单分享成功 */
    PACK_WX_MENUSHARESUC = "ev3",
    /**分享成功 arg1 活动id */
    PACK_WX_AROUSESHARESUC = "ev3-1",
    /**激励视频 */
    PACK_WX_ADVERTSUC = "ev3-2",
    /**被邀请进游戏 */
    PACK_WX_BE_AROUSESHARESUC = "ev3-3",
    /**微信帐号信息 */
    PACK_WX_BE_AVATAR = "ev3-4",
    /**推荐卡进入游戏 */
    PACK_WX_BE_RECOCARD = "ev3-5",

    /**初次拿到服务器时间 */
    FIRST_GET_SEVER_TIME = "ev4",

    /**CocHighPerfList列表刷新 */
    NODE_CHILDREN_LIST = "ev5",

    //切换到后台
    GAME_HIDE = "ev6-game_hide",
    //切回到游戏
    GAME_SHOW = "ev6-game_show",

    //时间到0点
    TIME_ZERO = "ev7-time_zero",

    /**小游戏onShow */
    ON_SHOW = "ev8-on-show",

    /**聊天 */
    CHAT_MSG = "CHAT_MSG",

    /**刷新奖励获得 */
    REFRESH_REWARD_GET = "REFRESH_REWARD_GET",

    LOGIN_SERVER_NOT_FOUND = "LOGIN_SERVER_NOT_FOUND",
    LOGIN_SERVER_NOTICE = "LOGIN_SERVER_NOTICE",
    LOGIN_LOGIN_SDK_FAILED = "LOGIN_LOGIN_SDK_FAILED",
    GM_NEED_FORCE_UPDATE = "GM_NEED_FORCE_UPDATE",
    UPDATE_FINISHED = "UPDATE_FINISHED",
}
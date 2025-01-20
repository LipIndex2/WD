import { sys } from "cc";
import { LogError } from "core/Debugger";
import { NetManager } from "manager/NetManager";
import { BattleEventType } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { GameCircleData } from "modules/GameCircle/GameCircleData";
import { BaseCtrl, regMsg } from "modules/common/BaseCtrl";
import { CommonEvent } from "modules/common/CommonEvent";
import { ConstValue } from "modules/common/ConstValue";
import { EventCtrl } from "modules/common/EventCtrl";
import { Language } from "modules/common/Language";
import { LoginData } from "modules/login/LoginData";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { TYPE_TIMER, Timer } from "modules/time/Timer";
import { PackageData } from "preload/PkgData";
import { ENUM_WX_AUTHSETTING, wexin } from "preload/PreloadToolFuncs";
import { Base64 } from "../../helpers/Base64";
import { DataHelper } from "../../helpers/DataHelper";
import { HTTP } from "../../helpers/HttpHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { ReportManager, ReportType } from "../../proload/ReportManager";
import { RoleData } from "./RoleData";
import { DBD_QUERY_PARAMS, DBDNet } from "../../DBDataManager/DBDNet";
import { ActivityCombatData } from "modules/ActivityCombat/ActivityCombatData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { TimeHelper } from "../../helpers/TimeHelper";
import { ShopData } from "modules/shop/ShopData";
import { ShopCtrl } from "modules/shop/ShopCtrl";


export class RoleCtrl extends BaseCtrl {
    data: RoleData = RoleData.Inst()
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRoleInfoAck, func: this.OnRoleInfoAck },
            { msgType: PB_SCRoleExpChange, func: this.OnRoleExpChange },
            { msgType: PB_SCRoleLevelChange, func: this.OnRoleLevelChange },

            { msgType: PB_SCAdvertisementInfo, func: this.OnAdvertisementInfo },
            { msgType: PB_SCRoleSystemSetInfo, func: this.OnRoleSystemSetInfo },
            { msgType: PB_SCRoleZhuoMianReward, func: this.OnRoleZhuoMianReward },
        ]
    }

    protected initCtrl(): void {
        EventCtrl.Inst().on(BattleEventType.BattleExit, this.BattleExit, this);
        EventCtrl.Inst().off(CommonEvent.ON_SHOW, this.onShow, this)
        EventCtrl.Inst().on(CommonEvent.ON_SHOW, this.onShow, this)
    }

    protected BattleExit(): void {
        if (RoleData.Inst().ShowLevelUp) {
            RoleData.Inst().ShowLevelUp = true
        } else if (RoleData.Inst().ShowFunOpen) {
            FunOpen.Inst().OnFunOpenViewShow();
        }
    }


    private OnRoleInfoAck(protocol: PB_SCRoleInfoAck) {
        LogError("OnRoleInfoAck", protocol);
        if (NetManager.ISHTTP)
            NetManager.sessionId = DataHelper.TextDecoder.decode(protocol.token);
        RoleData.Inst().SetRoleInfoAck(protocol);
        ChannelAgent.Inst().Report();

        DBDNet.Inst().getSignature({ uid: RoleData.Inst().InfoRoleInfo.roleId }, (data: DBD_QUERY_PARAMS) => {
            const curTime = TimeCtrl.Inst().ServerTime * 1000;
            let isChange = false;

            if (!data["shop_box_info"]) {
                data["shop_box_info"] = { time: curTime, openBoxTimes: { 0: ConstValue.OpenTreasureMaxTimes, 1: ConstValue.OpenTreasureMaxTimes, 2: ConstValue.OpenTreasureMaxTimes } }
                isChange = true;
            }

            if (!data["zombie_info"]) {
                data["zombie_info"] = { fightCount: [0], killRewardIsFetch: [0], killNum: 0, dailyWeakness: 0, time: curTime };
                isChange = true;
            }

            if (!data.payMoneyInfo) {
                data.payMoneyInfo = { day: 0, month: 0, dayTime: curTime, monthTime: curTime };
                isChange = true;
            }

            if (!TimeHelper.isSameDay(data.shop_box_info.time, curTime)) {
                data.shop_box_info.time = curTime;
                data.shop_box_info.openBoxTimes = { 0: ConstValue.OpenTreasureMaxTimes, 1: ConstValue.OpenTreasureMaxTimes, 2: ConstValue.OpenTreasureMaxTimes };
                isChange = true;
            }

            // 是否需要刷新挑战次数
            if (!TimeHelper.isSameDay(data.zombie_info.time, curTime)) {
                data.zombie_info.time = curTime;
                data.zombie_info.fightCount = [0];
                data.zombie_info.killRewardIsFetch = [0, 0, 0];
                isChange = true;
            }

            if (!TimeHelper.isSameDay(data.payMoneyInfo.dayTime, curTime)) {
                data.payMoneyInfo.day = 0;
                data.payMoneyInfo.dayTime = curTime;
                isChange = true;
            }

            // 不是同一个月
            if (!TimeHelper.isSameMonth(data.payMoneyInfo.monthTime, curTime)) {
                data.payMoneyInfo.month = 0;
                data.payMoneyInfo.monthTime = curTime;
                isChange = true;
            }

            if (isChange) {
                DBDNet.Inst().setSignature({ uid: RoleData.Inst().InfoRoleInfo.roleId, zombie_info: data["zombie_info"], shop_box_info: data["shop_box_info"], payMoneyInfo: data.payMoneyInfo }, () => {
                    ActivityCombatData.Inst().onZombieInfoDBD(data["zombie_info"]);
                    ShopData.Inst().onBoxOpenTimes(data["shop_box_info"].openBoxTimes);
                    ShopData.Inst().payMoneyInfo = data.payMoneyInfo;
                });
            } else {
                ActivityCombatData.Inst().onZombieInfoDBD(data["zombie_info"]);
                ShopData.Inst().onBoxOpenTimes(data["shop_box_info"].openBoxTimes);
                ShopData.Inst().payMoneyInfo = data.payMoneyInfo;
            }
        });
        // ChannelAgent.Inst().Report();
        // let report_data = [
        //     LoginData.Inst().GetLoginRespUserData().account,
        //     LoginData.Inst().GetServerItemInfoById(LoginData.Inst().ResultData.currentId).id,
        //     Base64.encode(RoleData.Inst().InfoRoleName),
        //     RoleData.Inst().InfoRoleId,
        //     RoleData.Inst().InfoRoleLevel,
        // ]
        // ReportManager.Inst().sendPoint(ReportType.roleLogin, report_data);
        // ReportManager.Inst().sendPoint(ReportType.beginGame, report_data);
    }

    OnRoleExpChange(protocol: PB_SCRoleExpChange) {
        LogError("OnRoleExpChange", protocol)
        RoleData.Inst().SetRoleExpChange(protocol)
    }

    OnRoleLevelChange(protocol: PB_SCRoleLevelChange) {
        LogError("OnRoleLevelChange", protocol)
        RoleData.Inst().SetRoleLevelChange(protocol)

        let report_data = [
            LoginData.Inst().GetLoginRespUserData().account,
            LoginData.Inst().GetServerItemInfoById(LoginData.Inst().ResultData.currentId).id,
            Base64.encode(RoleData.Inst().InfoRoleName),
            RoleData.Inst().InfoRoleId,
            RoleData.Inst().InfoRoleLevel,
        ]
        ReportManager.Inst().sendPoint(ReportType.scoket, report_data);
        ChannelAgent.Inst().Report(true);
    }

    OnAdvertisementInfo(protocol: PB_SCAdvertisementInfo) {
        LogError("OnAdvertisementInfo", protocol)
        RoleData.Inst().SetAdvertisementInfo(protocol)
    }

    private OnRoleSystemSetInfo(protocol: PB_SCRoleSystemSetInfo) {
        LogError("OnRoleSystemSetInfo", protocol)
        RoleData.Inst().SetRoleSystemSetInfo(protocol)
        if (RoleData.Inst().inGame == false) {
            RoleData.Inst().inGame = true;
            EventCtrl.Inst().emit(CommonEvent.LOGIN_SUCC_ROLEDATA)
        }
    }

    private OnRoleZhuoMianReward(protocol: PB_SCRoleZhuoMianReward) {
        LogError("OnRoleZhuoMianReward", protocol)
        RoleData.Inst().SetRoleZhuoMianReward(protocol)
    }

    public SendRoleSystemSetReq(setList: IPB_system_set[] = []) {
        let protocol = this.GetProtocol(PB_CSRoleSystemSetReq);
        protocol.systemSetList = setList
        this.SendToServer(protocol);
    }

    public SendRoleOtherOperReq(type: number, param: number[] = []) {
        let protocol = this.GetProtocol(PB_CSRoleOtherOperReq)
        protocol.type = type;
        protocol.param = param;
        this.SendToServer(protocol);
    }

    /**
     * 请求下发广告奖励
     * @param seq adType 表里的广告id 
     * @param is_dia 是否消耗钻石 1：钻石 0：非钻石
     * @param param 等级基金，宝箱基金活动序号
     */
    public ReqAdverReward(seq: number, is_dia = 0, param: number = 0, ignore?: boolean) {
        let protocol = this.GetProtocol(PB_CSAdvertisementFetch)
        protocol.seq = seq;
        protocol.isDia = is_dia;
        protocol.param = param;
        this.SendToServer(protocol);
    }

    SendOutUserInfo(name: string, avatarUrl: string, isWx: boolean) {
        let protocol = this.GetProtocol(PB_CSRoleWXInfoSetReq)
        protocol.name = DataHelper.StringToByte(name)
        protocol.headChar = DataHelper.StringToByte(avatarUrl)
        protocol.isWx = isWx ?? false
        this.SendToServer(protocol);
    }

    public SendRoleUserHead(headFrame: number, headIcon: number) {
        let protocol = this.GetProtocol(PB_CSRoleSetHeadFrame);
        protocol.id = headFrame;
        protocol.headId = headIcon;
        this.SendToServer(protocol);
    }

    private _ht_checkWxGameData: TYPE_TIMER;
    private checkWxGameLikeDataTime = 5;
    private onShow() {
        const num = GameCircleData.Inst().InfoLikeCount
        if (num <= ConstValue.FGUIBaseUserValue.likeTime || this.checkWxGameLikeDataTime >= 0) {
            if (this._ht_checkWxGameData) {
                Timer.Inst().CancelTimer(this._ht_checkWxGameData);
                this._ht_checkWxGameData = undefined;
            }
            this._ht_checkWxGameData = Timer.Inst().AddRunTimer(() => {
                if (this._ht_checkWxGameData) {
                    Timer.Inst().CancelTimer(this._ht_checkWxGameData);
                    this._ht_checkWxGameData = undefined;
                }
                this.checkWxGameData();
            }, 2, 1, false);
        }
    }

    //请求签到的次数 每次登陆只请求5次
    private checkWxGameDataTime = 5;
    private _wx_auth: { [key: string]: boolean } = {};
    private _wx_auth_failTip: { [key: string]: number } = {};
    private checkWxAuth(type: ENUM_WX_AUTHSETTING, tip: string, callBack: (check: boolean) => void) {
        let wx: wexin = ChannelAgent.wx;
        let result = this._wx_auth[type];
        if (wx && wx.getSetting) {
            if (!this._wx_auth[type]) {
                wx.getSetting({
                    success: (res) => {
                        this._wx_auth = res.authSetting;
                        result = this._wx_auth[type];
                        if (!result && !BattleCtrl.Inst().IsBattle()) {
                            if (tip && this._wx_auth_failTip[type]) {
                                if (this._wx_auth_failTip[type] > 0) {
                                    PublicPopupCtrl.Inst().DialogTips(tip, () => {
                                        wx.openSetting({
                                            success: (res) => {
                                                this._wx_auth = res.authSetting;
                                                result = this._wx_auth[type];
                                                if (result)
                                                    callBack(result);
                                            }, fail: (e: any) => {
                                            }
                                        });
                                    }, Language.BreakLIne.confim, Language.BreakLIne.tip)
                                }
                                this._wx_auth_failTip[type] = -1;
                                if (this._wx_auth_failTip[type] <= 0) {
                                    this._wx_auth_failTip[type] = -1;
                                }
                                return
                            }
                            let authorize = () => {
                                wx.authorize({
                                    scope: type, success: () => {
                                        result = this._wx_auth[type] = true;
                                        callBack(result);
                                    }, fail: () => {
                                        this._wx_auth_failTip[type] = ConstValue.FGUIBaseUserValue.openSetting;
                                    }
                                })
                            }
                            if (tip) {
                                //提示用户申请权限
                                PublicPopupCtrl.Inst().DialogTips(tip, () => {
                                    authorize()
                                }, Language.BreakLIne.confim, Language.BreakLIne.tip)
                            } else {
                                authorize();
                            }
                        } else {
                            callBack(result);
                        }
                    }
                })
                return;
            }
        }
        callBack(result);
    }

    /**检测游戏圈信息
     * @param type 请求类型 0为签到不加密 1为游戏圈数据需php解密存库
     */
    public checkWxGameData(type = 1, tip: string = undefined) {
        if (RoleData.Inst().InfoRoleId && sys.platform == sys.Platform.WECHAT_GAME) {
            let queryData = PackageData.Inst().getQueryData();
            if (queryData.param_list.game_circle_url) {
                let loginCtrl = LoginData.Inst();
                let roleinfo = RoleData.Inst();
                let server_id = loginCtrl.GetCurServerInfo().id
                let url = `${queryData.param_list.game_circle_url}?server_id=${server_id}&role_id=${roleinfo.InfoRoleId}&plat_id=${PackageData.Inst().getPlatSpid()}&type=${type}`
                if (type == 0) {
                    if (this.checkWxGameDataTime > 0) {
                        this.checkWxGameDataTime -= 1;
                        HTTP.GetJson(url);
                    }
                } else {
                    let wx: wexin = ChannelAgent.wx;
                    let logindata = LoginData.Inst().GetLoginData();
                    let token = logindata.URI_token;
                    if (wx && token && wx.getGameClubData && queryData.param_list.game_circle_type) {
                        this.checkWxAuth(ENUM_WX_AUTHSETTING.gameClubData, tip, (auth: boolean) => {
                            if (!auth) {
                                return;
                            }
                            wx.getGameClubData({
                                dataTypeList: queryData.param_list.game_circle_type,
                                success: (res: {
                                    encryptedData: string
                                    errMsg: string
                                    iv: string
                                    signature: string
                                }) => {
                                    if (token) {
                                        console.log("获取游戏圈信息:" + res.errMsg);
                                        this.checkWxGameLikeDataTime -= 1;
                                        url = `${url}&token=${token}&encryptedData=${encodeURIComponent(res.encryptedData)}&iv=${encodeURIComponent(res.iv)}&signature=${encodeURIComponent(res.signature)}`
                                        HTTP.GetJson(url);
                                    }
                                }
                            });
                        })

                    }
                }
            }
        }
    }
}
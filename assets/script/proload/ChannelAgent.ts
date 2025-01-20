import { assetManager, director, dynamicAtlasManager, game, Graphics, HorizontalTextAlignment, Label, sys, UITransform } from "cc";
import { NATIVE, WECHAT, WECHAT_MINI_PROGRAM } from "cc/env";
import { CfgAdDataAdType } from "config/CfgAd";
import { LogError } from "core/Debugger";
import { Singleton } from "core/Singleton";
import * as fgui from "fairygui-cc";
import { Image, MovieClip } from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AdFreeData } from "modules/AdFree/AdFreeData";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { ERRORCODE } from "modules/common/CommonEnum";
import { CommonEvent } from "modules/common/CommonEvent";
import { ConstValue } from "modules/common/ConstValue";
import { EventCtrl } from "modules/common/EventCtrl";
import { Language } from "modules/common/Language";
import { CommonTipData, CommonTipView } from "modules/common_help/CommonTipView";
import { LoginData } from "modules/login/LoginData";
import { LoginView } from "modules/login/LoginView";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { Order_Data, OrderCtrl } from "modules/recharge/OrderCtrl";
import { RoleCtrl } from "modules/role/RoleCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { headImgExt, PackageData } from "preload/PkgData";
import { wexin } from "preload/PreloadToolFuncs";
import { Base64 } from "../helpers/Base64";
import { DataHelper } from "../helpers/DataHelper";
import { HTTP } from "../helpers/HttpHelper";
import { UH } from "../helpers/UIHelper";
import { UtilHelper } from "../helpers/UtilHelper";
import { Main } from "./Main";
import { NativeAgent } from "./NativeAgent";
import { MD5 } from "../helpers/MD5";


export interface ChannelAgent_IF {
    init(v: ChannelAgent): Boolean;
    login(): void;
    Mai(orderInfo: Order_Data): Boolean;
    OnMessage(type: string, msg?: string | {}, msg1?: string): void;
    Behaveious(type: string): void;
    CheckContent(type: string, msg: string, cb: (result: Boolean, msg: string) => void): boolean | void;
    restartMiniProgram(): void;
    reportError(p: ERRORCODE): void;
    exitMiniProgram(): void;
    CopyText(text: string): void;
    wxModal(title: string, content: string, confirm_func: any, cancel_func: any, showCancel: Boolean, confirmText?: string, cancelText?: string): void;
    advert(cfg_ad: CfgAdDataAdType, tip: string, is_dia: number, param: number, auto: 0 | 1): boolean;
}

// var MainAgent: any = {}
// var changAgent;
// MainAgent.init = function (changAgent: any) {
//     this.changAgent = changAgent
//     return false;
// }
// MainAgent.OnInit = function (result: any) {
//     let data = { result: false }
//     this.changAgent.OnInit(data)
// }

// MainAgent.login = function () {
//     return false;
// }

// MainAgent.OnLogin = function (result: any) {
//     let data = { account: "", token: "" }
//     this.changAgent.OnLogin(data)
// }

// MainAgent.Mai = function (orderInfo: any) {

// }

// MainAgent.Behaveious = function (type: any) {
//     let userInfo = this.changAgent.GetUserInfo()
// }

// MainAgent.OnMessage = function (type: any, msg: any, msg1: any) {

// }

// MainAgent.Message = function (type: any, msg: any) {
//     this.changAgent.Message(type, msg)
// }

// MainAgent.CheckContent = function (type: any, msg: any, cb: any) {

// }

// MainAgent.wxModal = function (title: any, content: any, confirm_func: any, cancel_func: any, showCancel: any, confirmText: any, cancelText: any) {

// }

// MainAgent.exitMiniProgram = function () {

// }

// window['MainAgent'] = MainAgent;

export class ChannelAgent extends Singleton {
    private MainAgent: ChannelAgent_IF;
    private _isAgent = false
    public static get wx() {
        if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            return (window as any)['tt']
        }
        return (window as any)['wx']
    }
    init() {
        ChannelAgent.repair();
        // if (NATIVE) {
        //     this.MainAgent = NativeAgent.inst
        // } else
        // this.MainAgent = (window as any)['MainAgent'];
        if (this.MainAgent) {
            let result_init = this.MainAgent.init(this);
            if (!result_init) {
                this._isAgent = false;
            } else {
                this._isAgent = true
            }
        }

        let wx = ChannelAgent.wx;
        if (wx && wx.onAudioInterruptionEnd) {
            wx.onAudioInterruptionEnd(() => {
                EventCtrl.Inst().emit(CommonEvent.GAME_SHOW);
            })
        }
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            if (wx && wx.onShow) {
                wx.onShow(() => {
                    EventCtrl.Inst().emit(CommonEvent.ON_SHOW)
                })
            }
        }
    }

    OnInit(param: { result: boolean }) {

    }

    get isAgent() {
        return this.MainAgent != undefined && this._isAgent;
    }


    public GetUserInfo() {
        let loginCtrl = LoginData.Inst();
        let data_server = loginCtrl.GetLoginRespUserData();
        let roleinfo = RoleData.Inst();
        let server_info = loginCtrl.GetCurServerInfo();
        if (server_info && data_server && roleinfo)
            return {
                "server_id": server_info.id,
                "server_name": server_info.name,
                "user_id": data_server.uid,
                "role_id": roleinfo.InfoRoleId,
                "role_name": roleinfo.InfoRoleName,
                "level": roleinfo.InfoRoleLevel,
                "serverOpenTime": server_info.open_time,
            }
        else {
            return {
                "server_id": 0,
                "server_name": 0,
                "user_id": 0,
                "role_id": 0,
                "role_name": 0,
                "level": 0,
                "serverOpenTime": 0,
            }
        }
    }

    public login() {
        if (this.MainAgent) {
            this.MainAgent.login();
        }
    }

    public OnLogin(param: { account: string, token: string, uid: string }) {
        LoginData.Inst().GetLoginData().uid = param.uid
        LoginData.Inst().GetLoginData().token = param.token;
        LoginData.Inst().GetLoginData().accountId = param.account;
        Main.Inst().MainLogin((uInfo: LoginVerify) => {
            let loginView = ViewManager.Inst().getView<LoginView>(LoginView);
            if (loginView) {
                loginView.onVerify(uInfo, true);
            }
        });
    }

    public Mai(orderInfo: Order_Data) {
        if (this.MainAgent) {
            let result = this.MainAgent.Mai(orderInfo)
            if (result)
                return
        }
        if (LoginData.GetUrlParm().param_list.gm_buy_url
            && LoginData.GetUrlParm().param_list.switch_list.open_gm
        ) {//gm充值
            let url = LoginData.GetUrlParm().param_list.gm_buy_url + "?money=" + orderInfo.moneyAmount + "&app_order_id=" + orderInfo.orderId;
            console.log("充值url:" + url)
            HTTP.GetJson(url, (statusCode: number, resp: any | null, respText: string) => {
                // if (statusCode == 200 && resp)
                OrderCtrl.Inst().CheckMaiCallBack();
            });
        }
    }

    /**
     * 发信息给sdk
     * @param type  GameToChannel
     * @param msg 参数
     * @param msg1 参数
     * @returns 
     */
    public OnMessage(type: string, msg?: string | {}, msg1?: string) {
        if (this.MainAgent) {
            this.MainAgent.OnMessage(type, msg, msg1);
        }
    }

    /**
     * 广告视频接口
     * @param cfg_ad 广告表
     * @param tip 视频cd提示
     * @param is_dia 是否消耗钻石 1：钻石 0：非钻石
     * @param param 等级基金，宝箱基金活动序号
     */
    public advert(cfg_ad: CfgAdDataAdType, tip: string, is_dia = 0, param: number = 0, auto: 0 | 1 = 1) {
        if (AdFreeData.Inst().GetIsBuyAdFree()) {
            RoleCtrl.Inst().ReqAdverReward(+cfg_ad.seq, is_dia, param);
            return
        }
        let msgs = `${tip}-${is_dia}-${param}-${auto}`;
        if (this.MainAgent && !PackageData.Inst().getQueryData().param_list.switch_list.advert_close) {
            // if (NATIVE) {
            //     this.MainAgent.advert(cfg_ad, tip, is_dia, param, auto)
            // } else
            this.OnMessage(GameToChannel.wx_advert, cfg_ad, msgs);
        } else {
            RoleCtrl.Inst().ReqAdverReward(+cfg_ad.seq, is_dia, param);
        }
    }

    public Behaveious(type: string) {
        if (this.MainAgent) {
            this.MainAgent.Behaveious(type);
        }
    }

    private wx_advertTIme = 0;
    private Message(type: string, msg: string | {}, msg1: string) {
        // if (NATIVE) {
        //     this.MainAgent.OnMessage(type, msg, msg1)
        // } else
        switch (type) {
            case ChannelToGame.tip:
                PublicPopupCtrl.Inst().Center(msg as string);
                break;
            case ChannelToGame.wx_advertS:
                this.wx_advertTIme = TimeCtrl.Inst().ServerTime >> 0;
                break
            case ChannelToGame.wx_advertE:
                if (msg) {
                    let cfg = msg as CfgAdDataAdType
                    let params = msg1.split("-");
                    EventCtrl.Inst().emit(CommonEvent.PACK_WX_ADVERTSUC)
                    //videoKey-${tip}-${is_dia}-${param}-${auto}
                    let auto = +params[4];
                    if (auto) {
                        let is_dia = +params[2];
                        let param = +params[3];
                        RoleCtrl.Inst().ReqAdverReward(+cfg.seq, is_dia, param);
                    }
                }
                // let adv_url = PackageData.Inst().getQueryData().param_list.adv_gift_url;
                // if (adv_url) {
                //     let params = msg.split("-");
                //     let sTime = this.wx_advertTIme;
                //     let eTime = TimeCtrl.Inst().ServerTime >> 0;
                //     let sign = params[0];
                //     let type = params[1];
                //     let loginCtrl = LoginData.Inst();
                //     let data_server = loginCtrl.GetLoginRespUserData();
                //     let roleinfo = RoleData.Inst();

                //     let p1 = PackageData.Inst().getSpid();
                //     let p2 = loginCtrl.GetCurServerInfo().id;
                //     let p3 = data_server.uid;
                //     let p4 = roleinfo.GetRoleId();
                //     let p5 = roleinfo.GetRoleLevel();
                //     let p6 = type
                //     let p7 = sTime;
                //     let p8 = eTime;
                //     let md5_sign = MD5.encode(p2 + p3 + p4 + p5 + p6 + p7 + p8 + sign);
                //     let reqUrl: string = adv_url +
                //         "?spid=" + p1 +
                //         "&server_id=" + p2 +
                //         "&user_id=" + p3 +
                //         "&role_id=" + p4 +
                //         "&level=" + p5 +
                //         "&type=" + p6 +
                //         "&time_beg=" + p7 +
                //         "&time_end=" + p8 +
                //         "&sign=" + md5_sign;
                //     HTTP.GetString(reqUrl, () => {

                //     });
                // }
                break;
            case ChannelToGame.menuShareSuc:
                EventCtrl.Inst().emit(CommonEvent.PACK_WX_MENUSHARESUC)
                break;
            case ChannelToGame.arouseShareSuc:
                let actId = +msg;
                EventCtrl.Inst().emit(CommonEvent.PACK_WX_AROUSESHARESUC, msg);
                break;
            case ChannelToGame.bearouseShareSuc:
                EventCtrl.Inst().emit(CommonEvent.PACK_WX_BE_AROUSESHARESUC, msg);
                break;
            case ChannelToGame.RecoCard:
                EventCtrl.Inst().emit(CommonEvent.PACK_WX_BE_RECOCARD, msg);
                break;
            case ChannelToGame.avatar:
                if (msg)
                    EventCtrl.Inst().emit(CommonEvent.PACK_WX_BE_AVATAR, JSON.parse(msg as string) as wx_User);
                break;
            case ChannelToGame.EnterGame:
                AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
                Main.Inst().connect(LoginData.Inst().ResultData.currentId);
                break;
            case ChannelToGame.mai_check:
                OrderCtrl.Inst().CheckMaiCallBack(+msg);
                break;
        }

    }

    public CheckContent(type: string, msg: string, cb: (result: boolean, msg: string) => void): boolean {
        if (this.MainAgent && this.MainAgent.CheckContent) {
            let result = this.MainAgent.CheckContent(type, msg, cb);
            if (result) {
                return true
            }
        }
        return false;
    }

    public reportError(error: ERRORCODE) {
        if (this.MainAgent) {
            this.MainAgent.reportError(error);
            return true
        }
    }

    public CopyText(text: string) {
        if (sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME || NATIVE) {
            if (this.MainAgent) {
                this.MainAgent.CopyText(text);
            }
        } else {
            UtilHelper.copyStr(text);
            PublicPopupCtrl.Inst().Center(Language.Login.CopyTip);
        }
    }

    public Base64() {
        return Base64
    }

    public MD5() {
        return MD5
    }

    /**上报角色信息
     * @param isLevel 是否角色升级
     * @tip 上报时机 初次进入游戏 和 角色升级
     */
    public Report(isLevel = false) {
        let loginCtrl = LoginData.Inst();
        let data_server = loginCtrl.GetLoginRespUserData();
        // let data_login = loginCtrl.GetLoginData();
        let roleinfo = RoleData.Inst();
        let url = LoginData.GetUrlParm().param_list.role_report_url;
        let reqUrl: string = url +
            "?spid=" + PackageData.Inst().getSpid() +
            "&server_id=" + loginCtrl.GetCurServerInfo().id +
            "&user_id=" + data_server.uid +
            "&role_id=" + roleinfo.InfoRoleId +
            "&role_name=" + roleinfo.InfoRoleName +
            "&level=" + roleinfo.InfoRoleLevel +
            "&vip=" + 0;
        HTTP.GetJson(reqUrl);
        if (isLevel) {
            this.Behaveious(ConstValue.BehaveType.LevelUp);
        }
    }

    public wxModal(title: string, content: string, confirm_func: any, cancel_func: any, showCancel: boolean, confirmText?: string, cancelText?: string) {
        if (this.MainAgent) {
            this.MainAgent.wxModal(title, content, confirm_func, cancel_func, showCancel, confirmText, cancelText);
        }
        else {
            PublicPopupCtrl.Inst().Center(`弹框提示|${title}|${content}}`);
            if (confirm_func) {
                confirm_func();
            }
        }
    }

    public ExitProgram() {
        if (this.MainAgent) {
            this.MainAgent.exitMiniProgram();
        }
        else {
            // game.restart();
            // game.end();
            PublicPopupCtrl.Inst().Center(Language.Login.Tip3);
            ViewManager.Inst().OpenView(CommonTipView, new CommonTipData(Language.Login.Tip, Language.Login.Tip4, () => {
                // game.restart();
                // game.end();
                window && window.location && window.location.reload && window.location.reload();
            }, HorizontalTextAlignment.LEFT));

        }
    }

    /**重启游戏 */
    public RestartProgram() {
        if (this.MainAgent) {
            this.MainAgent.restartMiniProgram();
        }
        else {
            // game.restart();
            // game.end();
            PublicPopupCtrl.Inst().Center(`重启游戏,编辑器模式请手动重启`);
        }
    }

    private static repair() {
        assetManager.downloader.maxConcurrency = 50;
        assetManager.downloader.maxRetryCount = 5;
        Label.prototype.onCustomDestroy = Label.prototype.onDestroy;
        Image.prototype.onCustomDestroy = Image.prototype.onDestroy;
        MovieClip.prototype.onCustomDestroy = MovieClip.prototype.onDestroy;
        Graphics.prototype.onCustomDestroy = Graphics.prototype.onDestroy;
        UITransform.prototype.onCustomDestroy = UITransform.prototype.onDestroy;
        ChannelAgent.repairTextDecoder()

        // LabelOutline.prototype.onCustomDestroy = LabelOutline.prototype.onDisable;
        // sys.__isWebIOS14OrIPadOS14Env = true;
        // this.repairMeshBuff();
        dynamicAtlasManager.enabled = false;
        // dynamicAtlasManager.textureSize = 2048;
        // dynamicAtlasManager.maxFrameSize = 512;
        // macro.CLEANUP_IMAGE_CACHE = false;


        if (WECHAT || WECHAT_MINI_PROGRAM) {
            // @ts-expect-error HACK: this private property only needed on web & wechat JIT
            sys.__isWebIOS14OrIPadOS14Env = (sys.os === sys.OS.IOS || sys.os === sys.OS.OSX) && GameGlobal?.isIOSHighPerformanceMode
                && /(OS 1((4\.[0-9])))|(Version\/1((4\.[0-9])))/.test(window.navigator.userAgent);
        }
        console.log("__isWebIOS14OrIPadOS14Env:" + (sys as any).__isWebIOS14OrIPadOS14Env);



        /**抖音头像跨域问题 */
        const registerHeadImgLoader = function () {
            assetManager.downloader.register(headImgExt, (content, options, onComplete) => {
                onComplete(null, content);
            });
            assetManager.parser.register(headImgExt, assetManager.downloader.downloadDomImage);

            function createTexture(id: string, data: any, options: any, onComplete: (e: any, d: any) => void) {
                // let out = null,
                let err = null;
                // try {
                //     out = new Texture2D();
                //     out._uuid = id;
                //     out._nativeUrl = id;
                //     out._nativeAsset = data;
                // } catch (e) {
                //     err = e;
                // }
                onComplete && onComplete(err, data);
            }
            assetManager.factory.register(headImgExt, createTexture);
        }
        registerHeadImgLoader();
    }

    public static set FPS(value: number) {
        game.frameRate = value;
        ChannelAgent.wx && ChannelAgent.wx.setPreferredFramesPerSecond(value);
    }

    /**设置fgui每帧加载超时限制 */
    public static set FGUIrameTime(v: number) {
        fgui.UIConfig.frameTimeForAsyncUIConstruction = v;
    }

    static repairMeshBuff = function repairMeshBuff() {
        if ((sys as any).__isWebIOS14OrIPadOS14Env) {
            Timer.Inst().AddRunTimer(function () {
                (director.root.batcher2D as any)._bufferAccessors.forEach(function (element: any) {
                    var buff = element._buffers[0];
                    var _nextFreeIAHandle = buff['_nextFreeIAHandle'];
                    var _iaPool = buff['_iaPool'];
                    var start = _nextFreeIAHandle * 2 + 2;

                    if (start < _iaPool.length) {
                        for (var x = start; x < _iaPool.length; x++) {
                            var iaRef = _iaPool[x];
                            iaRef.ia.destroy();
                            iaRef.vertexBuffers[0].destroy();
                            iaRef.indexBuffer.destroy();
                        }

                        _iaPool.splice(start, _iaPool.length - start);
                    }
                });
            }, 60, -1, false);
        }
    };

    static repairTextDecoder() {
        if (undefined !== window.TextEncoder) { DataHelper.init(); return; }

        function _TextEncoder(encode: string) {
            //--DO NOTHING
        }
        _TextEncoder.prototype.encode = function (s: string) {
            return unescape(encodeURIComponent(s)).split('').map(function (val) { return val.charCodeAt(0); });
        };
        function _TextDecoder(decode: string) {
            //--DO NOTHING
        }
        _TextDecoder.prototype.decode = function (code_arr: any) {
            return decodeURIComponent(escape(String.fromCharCode.apply(null, code_arr)));
        };

        (window as any).TextEncoder = _TextEncoder;
        (window as any).TextDecoder = _TextDecoder;
        DataHelper.init();


    }
    //开放域传输信息
    //param = CommonStruct.OpenDataParam
    public postMessageToOD(param: any) {
        const gl_window = window as any
        let env = gl_window.wx || gl_window.tt || gl_window.swan;
        if (env) {
            console.log('Message posted');
            env.getOpenDataContext().postMessage(param);
        } else {
            console.log('env is null, param = ', param)
        }
    }

    public checkGameRes(resources: string) {
        let pkg_resources = PackageData.Inst().getQueryData().version_info.assets_info.resources;
        if (pkg_resources != resources) {
            this.wxModal("提示", "检测到有数据更新，请点击确定重新进入游戏", () => {
                ChannelAgent.wx.restartMiniProgram();
            }, null, false);
            LogError("restartMiniProgram")
        }
    }

    public get ENUM_GAME_VALUE() {
        return ConstValue.FGUIBaseUserValue
    }

    public GC() {
        if (sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            let wx = ChannelAgent.wx;
            if (wx) {
                wx.triggerGC();
            }
        }
    }

    private _system: string;
    public get system(): string {
        if (this._system) {
            return this._system;
        }

        if (sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            let wx = ChannelAgent.wx;
            if (wx) {
                let sysinfo = wx.getSystemInfoSync();
                this._system = sysinfo.system;
            }
        } else {
            this._system = sys.os;
        }
        return this._system;
    }

    /**隐藏抖音客服按钮 */
    public hideDouYinKfBtn(check = true) {
        if (this.MainAgent) {
            let param_list = PackageData.Inst().getQueryData().param_list
            if (!param_list || (param_list && !param_list.switch_list.douyin_kf) || !check) {
                (this.MainAgent as any).sdk_hideKfBtn && (this.MainAgent as any).sdk_hideKfBtn()
            }
        }
    }

    /**显示抖音客服按钮 */
    public showDouYinKfBtn(check = true) {
        if (this.MainAgent) {
            let param_list = PackageData.Inst().getQueryData().param_list
            if (param_list && param_list && param_list.switch_list.douyin_kf || !check) {
                (this.MainAgent as any).sdk_showKfBtn && (this.MainAgent as any).sdk_showKfBtn()
            }
        }
    }

    public getWeChatGameHubBtn(btn: fgui.GObject, x = 0, y = 0): { show: Function, destroy: Function, hide: Function, onTap: Function } {
        let btn_hub: { show: Function, destroy: Function, hide: Function, onTap: Function };
        if (WECHAT && ChannelAgent.wx && (ChannelAgent.wx as wexin).createGameClubButton) {

            var pos = btn.localToGlobal(x, y);
            let info_sc = UH.GetScreenAdapter();
            let height = btn.height * info_sc.scale;
            let color = LoginData.IsWhite() ? "#FFFFFF" : "#FFFFFF00"
            let showdata = {
                type: "text",
                text: "",
                style: {
                    left: Math.abs(pos.x) * info_sc.scale + info_sc.offsetX,
                    top: Math.abs(pos.y) * info_sc.scale + info_sc.offsetY,
                    width: btn.width * info_sc.scale,
                    height: height,
                    backgroundColor: color,
                    color: color
                }
            };
            let data_query = PackageData.Inst().getQueryData()
            if (data_query.param_list.publish_info && data_query.param_list.publish_info.customer_gm && data_query.param_list.publish_info.customer_gm.wx_kf) {
                (showdata as any).openlink = data_query.param_list.publish_info.customer_gm.wx_kf;
            }
            btn_hub = (ChannelAgent.wx as wexin).createGameClubButton(showdata);
        }
        return btn_hub;
    }
}
export let tuiSongID = {
    Escort: "0",
    box: "1",
    arena: "2",
    fish: "3",
    shilian: "4",
    gumo: "5",
    mont: "6",
    territoryBerobbed: "8", //领地资源被抢
    territoryRobBedef: " 9",//领地抢夺资源遭到抵抗
}
export let GameToChannel = {
    KeFu: "KeFu",
    /**分享 */
    arouseShare: "arouseShare",
    /**打开激励视频 */
    wx_advert: "wx_advert",
    /**检查是否被邀请 */
    arouseShareCheck: "arouseShareChceck",

    showEnterGame: "showEnterGame",
    /**打开竞技场 */
    view_o_Arena: "view_o_Arena",
    /**关闭竞技场 */
    view_c_Arena: "view_c_Arena",

    /**打开航海 */
    view_o_Escort: "view_o_Escort",
    /**关闭航海 */
    view_c_Escort: "view_c_Escort",

    tuisong: "tuisong",

    /**获取微信用户信息 */
    WxUser: "WxUser"

}
export let ChannelToGame = {
    /**激励视频成功 */
    wx_advertE: "wx_advert-e",
    /**激励视频开始 */
    wx_advertS: "wx_advert-s",

    /**绑定手机成功 */
    bindPhoneSuc: "bindPhone-1",
    /**提示 */
    tip: "tip",
    /**主菜单分享 */
    menuShareSuc: "menuShare-1",
    /**分享成功 */
    arouseShareSuc: "arouseShare-1",
    /**被邀请人进游戏 */
    bearouseShareSuc: "arouseShare-2",

    /**推荐页游戏卡 */
    RecoCard: "RecoCard",

    avatar: "avatar",
    EnterGame: "EnterGame",
    /**支付检测 */
    mai_check: "mai_check",
}


//--------------------------渠道登录--------------------------
export class LoginVerify {
    ret: number;
    msg: string;
    user: User;
    role_data?: { [key: string]: RoleDatum };
}

export class RoleDatum {
    server_id: string;
    role_id: string;
    role_name: string;
    level: string;
    vip: string;
    last_login_time: number;
}

export class User {
    spid: string;
    merger_spid: string;
    account_spid: string;
    account: string;
    account_type: number;
    fcm_flag: number;
    login_time: number;
    uid: string;
    openid: string;
    login_sign: string;
}
//----------------------end 渠道登录 end----------------------

export type wx_User = {
    nickName: string,
    gender: string,
    language: string,
    city: string,
    province: string,
    country: string,
    avatarUrl: string,
}
//----------------------end 渠道登录 end----------------------


import { NetManager } from "manager/NetManager";
import { ViewManager } from "manager/ViewManager";
import { BaseCtrl, regMsg } from "modules/common/BaseCtrl";
import { ENUM_9001_EVENT } from "modules/common/CommonEnum";
import { BreakLineInfo, BreakLineView } from "modules/main/BreakLineView";
import { RoleData } from "modules/role/RoleData";
import { Main } from "../../proload/Main";
import { ObjectPool } from "core/ObjectPool";
import { Language } from "modules/common/Language";
import { LoginView } from "./LoginView";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { DataManager } from "manager/DataManager";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { PackageData } from "preload/PkgData";
import { HTTP } from "../../helpers/HttpHelper";
import { LoginData } from "./LoginData";
import { ENUM_UserServe, SettingUsertServeView } from "modules/setting/SettingUsertServeView";
import { LocalStorageHelper } from "../../helpers/LocalStorageHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { NetConnectOptions } from "core/net/NetNode";
import { GameTipsView } from "./GameTipsView";
import { CODE_STATUS } from "modules/common/ConstValue";
import { SdkCtrl } from "../../framework/sdk/sdk/SdkCtrl";
import { LogError } from "core/Debugger";
import { game, sys, View } from "cc";
import { GameVersion } from "./GameVersion";
import CryptoJS from "crypto-js";
import { CXSDKHelper } from "../../framework/sdk/sdk/CXSDKHelper";
import { ShopData } from "modules/shop/ShopData";
import { EventCtrl } from "modules/common/EventCtrl";
import { CommonEvent } from "modules/common/CommonEvent";

export type LoginInfo = {
    loginTime: number;
    loginStr: string;
    pname: string;
    server: number;
    platSpid: number;
    code: number,
    account: string,        //GM的UID
    open_id: string,        //SDK的UID
    token: string,
    userName: string,
    identify: number,       //实名用户级别
    isnewuserid: boolean,  //是否为新用户
    timestamp: number,  //实名登录 验证用
}

// 实名类型
export enum RELANAME_CODE {
    /**注册 */
    SIGN_IN,
    /**登录 */
    LOGIN,
    /**充值日 */
    PAY_DAY,
    /**充值月 */
    PAY_MONTH,
}

export class LoginCtrl extends BaseCtrl {
    data: RoleData = RoleData.Inst()

    /**登录 SDK 相关数据 */
    public loginInfo: LoginInfo = {
        code: 0,
        token: "",
        account: "",
        open_id: "",
        userName: "",
        server: 0,
        identify: 0,
        timestamp: 0,
        isnewuserid: false,
        loginTime: 0,
        loginStr: "",
        pname: "",
        platSpid: 0,
    };
    isAudit: boolean;

    _handler: NodeJS.Timeout;

    protected initCtrl(): void {
        super.initCtrl();
        this._handler && clearInterval(this._handler);
        this._handler = setInterval(() => {
            if (LoginCtrl.Inst().realName(RELANAME_CODE.LOGIN)) {
                this._handler && clearInterval(this._handler);
            }
        }, 1000 * 5);
    }

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCHeartbeatResp, func: this.recvHeartbeatResp },
            { msgType: PB_SCLoginToAccount, func: this.recvLoginResult },
            { msgType: PB_SCDisconnectNotice, func: this.recvDisconnectNotice }
        ]
    }

    private recvDisconnectNotice(protocol: PB_SCDisconnectNotice) {
        if (protocol.reason == ENUM_9001_EVENT.DISCONNECT_NOTICE_TYPE_LOGIN_OTHER_PLACE || protocol.reason == ENUM_9001_EVENT.DISCONNECT_NOTICE_TYPE_SERVER_RESET) {
            let bl = ObjectPool.Get(BreakLineInfo);
            // bl.str_close = Language.BreakLIne.cencel;
            bl.str_tautology = Language.BreakLIne.confim;
            bl.tip = Language.BreakLIne.noLogin;
            bl.title = Language.BreakLIne.tip;
            bl.showClose = false;
            bl.res_icon = undefined;
            let blView = ViewManager.Inst().OpenView(BreakLineView, bl) as BreakLineView;
            let fun = () => {
                BattleCtrl.Inst().ExitBattle();
                DataManager.Inst().onSwitch();
                NetManager.Inst().cleanReSend();
                ViewManager.Inst().OpenView(GameTipsView);
            }
            // blView.setOnBtnClose(fun)
            blView.setOnBtnTautology(fun)
        }
    }

    private recvHeartbeatResp() {

    }

    private recvLoginResult(data: PB_SCLoginToAccount) {
        Main.Inst().onLoginResult(data)
    }

    public SendLoginReq(data: LoginInfo) {
        if (sys.isNative && LoginCtrl.Inst().realName(RELANAME_CODE.LOGIN, { isCloseTips: true })) {
            LoginCtrl.Inst().realName(RELANAME_CODE.SIGN_IN);
            return;
        }
        let self = this;
        let protocol = self.GetProtocol(PB_CSLoginToAccount);
        protocol.loginTime = data.loginTime;
        protocol.loginStr = data.loginStr;
        protocol.pname = data.pname;
        protocol.server = data.server;
        protocol.platSpid = data.platSpid;
        NetManager.sessionId = "";
        this.SendToServer(protocol);
    }

    /**
     * 打开公告界面
     * @tip update_notice_query_url 在运营后台 运营工具 公告栏 更新公告列表
     */
    public TryOpenAnnounce() {
        // ViewManager.Inst().OpenView(AnnounceView);
        let notice_call = LoginData.GetUrlParm().param_list.update_notice_query_url

        let url = notice_call + "?spid=" + PackageData.Inst().getSpid()
        HTTP.GetJson(url, (statusCode: number, resp: any) => {
            let list = this.getNoticeRet(statusCode, resp)
            ViewManager.Inst().OpenView(SettingUsertServeView, { type: ENUM_UserServe.DIALOG, param: list[list.length - 1] })
        });
    }

    /**
     * 打开弹窗公告界面  进入主界面打开 
     * @tip update_notice_query_url 在运营后台 运营工具 公告栏 弹窗公告
     */
    public TryOpenAnnounce2() {
        // ViewManager.Inst().OpenView(AnnounceView);
        let notice_call = LoginData.GetUrlParm().param_list.fetch_popup_notice_url
        if (notice_call) {
            let url = notice_call + "?spid=" + PackageData.Inst().getSpid() + "&type=1";
            HTTP.GetJson(url, (statusCode: number, resp: any) => {
                let list = this.getNoticeRet(statusCode, resp)
                if (list.length)
                    ViewManager.Inst().OpenView(SettingUsertServeView, { type: ENUM_UserServe.DIALOG, param: list[list.length - 1] })
            });
        }
    }

    /**
     * 更新版本后自动打开弹窗公告
     */
    public AutoTryOpenAnnounce() {
        let pkg = LocalStorageHelper.PrefsString(LocalStorageHelper.AnnounceCd());
        let pkg_now = PackageData.Inst().g_UserInfo.pkg;
        if (FunOpen.Inst().checkAudit(1) && (!pkg || pkg != pkg_now)) {
            this.TryOpenAnnounce2();
            LocalStorageHelper.PrefsString(LocalStorageHelper.AnnounceCd(), pkg_now);
        }
    }

    private getNoticeRet(statusCode: number, resp: any) {
        let cur_time = TimeCtrl.Inst().ServerTime
        let list = []
        if (resp && resp.ret == 0) {
            for (var index in resp.data) {
                let oper = resp.data[index]
                if (cur_time >= oper.beg_time && cur_time <= oper.end_time) {
                    let handled = this.FixRichTextForUrl(oper.content)
                    // LogError("?check?!1",oper.content)
                    // LogError("?check?!2",handled)
                    let info = {
                        content: handled,
                        title: oper.title,
                        add_time: oper.add_time,
                    }
                    list.push(info)
                }
            }
        }

        list.sort((a, b) => b.add_time - a.add_time);
        return list;
    }

    public FixRichTextForUrl(str: string) {
        let url = str.replace("{【}", "[")

        while (url.search("{【}") != -1) {
            url = url.replace("{【}", "[")
        }

        url = url.replace("{】}", "]")
        while (url.search("{】}") != -1) {
            url = url.replace("{】}", "]")
        }

        while (url.search("url=") != -1) {
            url = url.replace("url=", "mark=http://")
        }

        while (url.search("mark") != -1) {
            url = url.replace("mark", "url")
        }

        return url
    }

    /**
    * 3. 调用SDK登录
    */
    public loginSdk() {
        LogError("开始登录SDK");
        SdkCtrl.Ins.loginSdk((ret: any, allResult?: any) => {
            switch (ret.code) {
                case CODE_STATUS.SUCC:
                    LogError("登录SDK成功");
                    this.loginInfo.token = ret.token || "";

                    let gmLoginParam = {
                        platform: LoginParam.gmInitPlatform,
                        os: sys.os.toLowerCase(),
                        version: GameVersion.version,
                        data: allResult.data,
                    }

                    this.loginInfo.open_id = allResult.data.open_id;
                    this.loginInfo.identify = allResult.data.identify;
                    ViewManager.Inst().getView(LoginView).Touchable = false;
                    setTimeout(() => {
                        ViewManager.Inst().getView(LoginView).Touchable = true;
                        console.log("_doGmAuth", gmLoginParam)
                        this._doGmAuth(allResult.data);
                    }, 1000);
                    break;

                case CODE_STATUS.FAIL://LoginSdkFailed
                    LogError("登录SDK失败");

                    let extMsg = "(" + ret.errno + ret.errmsg + ")";
                    // EventListener.Dispatch(EventConst.LOGIN_LOGIN_SDK_FAILED, 102, extMsg, false);
                    break;

                case CODE_STATUS.NONE://wait input(dev)
                    LogError("SDK登录无数据需要手动输入");
                    // EventListener.Dispatch(EventConst.LOGIN_SHOW_ACCOUNT, true);

                    // 打开登录界面
                    ViewManager.Inst().OpenView(LoginView);
                    break;

                default:
                    break;
            }
        });
    }

    /**
     * 4.GM登录认证(本地登录和SDK登录都必须走，相当于登录校验)
     * params 登录参数JSON
     */
    private _doGmAuth(params: any) {
        console.log("onLoginSuccess:", JSON.stringify(this.loginInfo));
        // SdkCtrl.Ins.setSdkUid(params.uid);
        LoginCtrl.Inst().realName(RELANAME_CODE.SIGN_IN);
    }

    public realName(state: RELANAME_CODE, args?: any) {
        // return false

        // 如果是未成年
        // 秒
        const serverTime = TimeCtrl.Inst().ServerTime;
        const date = new Date(serverTime * 1000);
        let result = false;
        switch (LoginCtrl.Inst().loginInfo.identify) {
            case 0:
                // 没有完成实名
                break;
            case 1:
                // 0-8岁（不包含8岁)
                switch (state) {
                    case RELANAME_CODE.SIGN_IN:
                        // break;
                        ViewManager.Inst().OpenView(SettingUsertServeView, {
                            type: ENUM_UserServe.SETTING, param: 31, btnName: "我知道了", closeCb: () => {
                                setTimeout(() => {
                                    LoginCtrl.Inst().realName(RELANAME_CODE.LOGIN);
                                }, 100);
                            }
                        })
                        break;
                    case RELANAME_CODE.LOGIN:
                        // break;
                        // 仅周五、周六、周日和法定节假日每日20时至21时向未成年人提供1小时服务。
                        if ((date.getDay() !== 0 && date.getDay() !== 5 && date.getDay() !== 6) || date.getHours() != 20) {
                            if (!args || !args.isCloseTips) {
                                ViewManager.Inst().OpenView(SettingUsertServeView, {
                                    type: ENUM_UserServe.SETTING, param: 32, closeCb: () => {
                                        // 退出游戏
                                        CXSDKHelper.Ins.exitGame();
                                    }, btnName: "退出游戏"
                                });
                            }
                            result = true;
                        }
                        break;
                    case RELANAME_CODE.PAY_DAY:
                        ViewManager.Inst().OpenView(SettingUsertServeView, {
                            type: ENUM_UserServe.SETTING, param: 33, btnName: "我知道了"
                        });
                        result = true;
                        break;
                    case RELANAME_CODE.PAY_MONTH:
                        ViewManager.Inst().OpenView(SettingUsertServeView, {
                            type: ENUM_UserServe.SETTING, param: 36, btnName: "我知道了"
                        });
                        result = true;
                        break;
                }
                break;
            case 2:
                // 8-16岁（不包含16岁）
                switch (state) {
                    case RELANAME_CODE.SIGN_IN:
                        // break;
                        ViewManager.Inst().OpenView(SettingUsertServeView, {
                            type: ENUM_UserServe.SETTING, param: 31, btnName: "我知道了", closeCb: () => {
                                setTimeout(() => {
                                    LoginCtrl.Inst().realName(RELANAME_CODE.LOGIN);
                                }, 100);
                            }
                        })
                        break;
                    case RELANAME_CODE.LOGIN:
                        // break;
                        // 仅周五、周六、周日和法定节假日每日20时至21时向未成年人提供1小时服务。
                        if ((date.getDay() !== 0 && date.getDay() !== 5 && date.getDay() !== 6) || date.getHours() != 20) {
                            if (!args || !args.isCloseTips) {
                                ViewManager.Inst().OpenView(SettingUsertServeView, {
                                    type: ENUM_UserServe.SETTING, param: 32, closeCb: () => {
                                        // 退出游戏
                                        CXSDKHelper.Ins.exitGame();
                                    }, btnName: "退出游戏"
                                });
                            }
                            result = true;
                        }
                        break;
                    case RELANAME_CODE.PAY_DAY:
                        if (args.money > 50) {
                            ViewManager.Inst().OpenView(SettingUsertServeView, {
                                type: ENUM_UserServe.SETTING, param: 34, btnName: "我知道了"
                            });
                            result = true;
                        }
                        break;
                    case RELANAME_CODE.PAY_MONTH:
                        if (ShopData.Inst().payMoneyInfo.month + args.money > 200) {
                            ViewManager.Inst().OpenView(SettingUsertServeView, {
                                type: ENUM_UserServe.SETTING, param: 37, btnName: "我知道了"
                            })
                            result = true;
                        }
                        break;
                }
                break;
            case 3:
                // 16-18岁（不包含18岁）
                switch (state) {
                    case RELANAME_CODE.SIGN_IN:
                        // break;
                        ViewManager.Inst().OpenView(SettingUsertServeView, {
                            type: ENUM_UserServe.SETTING, param: 31, btnName: "我知道了", closeCb: () => {
                                setTimeout(() => {
                                    LoginCtrl.Inst().realName(RELANAME_CODE.LOGIN);
                                }, 100);
                            }
                        })
                        break;
                    case RELANAME_CODE.LOGIN:
                        // break;
                        // 仅周五、周六、周日和法定节假日每日20时至21时向未成年人提供1小时服务。
                        if ((date.getDay() !== 0 && date.getDay() !== 5 && date.getDay() !== 6) || date.getHours() != 20) {
                            if (!args || !args.isCloseTips) {
                                ViewManager.Inst().OpenView(SettingUsertServeView, {
                                    type: ENUM_UserServe.SETTING, param: 32, closeCb: () => {
                                        // 退出游戏
                                        CXSDKHelper.Ins.exitGame();
                                    }, btnName: "退出游戏"
                                });
                            }
                            result = true;
                        }
                        break;
                    case RELANAME_CODE.PAY_DAY:
                        if (args.money > 100) {
                            ViewManager.Inst().OpenView(SettingUsertServeView, {
                                type: ENUM_UserServe.SETTING, param: 35, btnName: "我知道了"
                            });
                            result = true;
                        }
                        break;
                    case RELANAME_CODE.PAY_MONTH:
                        if (ShopData.Inst().payMoneyInfo.month + args.money > 400) {
                            ViewManager.Inst().OpenView(SettingUsertServeView, {
                                type: ENUM_UserServe.SETTING, param: 38, btnName: "我知道了"
                            });
                            result = true;
                        }
                        break;
                }
                break;
            case 4:
                // 18岁以上
                result = false;
                break;
            case 5:
                // 通透模式，不显示实名制
                result = false;
                break;
        }

        return result;
    }

    /**
     * 客户端主动重启游戏
     * @param {boolean} closeSocket 是否强制关闭socket链接
     */
    public static OpRestart(closeSocket: boolean = true) {
        //重启时主动断开网络连接
        closeSocket && NetManager.Inst().DisconnectServer();
        //设置新手管理初始化
        // TutorialMgr.Ins.needInit = true;
        ViewManager.Inst().OpenView(LoginView);
        let view = ViewManager.Inst().getView(SettingUsertServeView);
        //@ts-ignore
        view && (view["param"] = null);
        ViewManager.Inst().CloseView(SettingUsertServeView);
        BattleCtrl.Inst().ExitBattle(false);
        game.restart();
    }

    /**
     * 准备开始前数据
     */
    public prepareStart() {
        // this.curVersionUrl = LoginParam.versionUrl;
        this.isAudit = false;

        // SdkCtrl.Ins.loadPhoneInfo();    //获取设备信息

        EventCtrl.Inst().emit(CommonEvent.UPDATE_FINISHED);
        // this._initSdk();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this._handler && clearInterval(this._handler);
    }

}


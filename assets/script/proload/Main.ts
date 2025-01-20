import { sys, url } from "cc";
import { GetCfgValue } from "config/CfgCommon";
import { Debugger } from "core/Debugger";
import { NodePools } from "core/NodePools";
import { Singleton } from "core/Singleton";
import { CfgManager } from "manager/CfgManager";
import { NetManager } from "manager/NetManager";
import { ViewManager } from "manager/ViewManager";
import { ActivityAdvertisingData } from "modules/ActivityAdvertising/ActivityAdvertisingData";
import { ActivityCombatData } from "modules/ActivityCombat/ActivityCombatData";
import { ZombieLogTipsView } from "modules/ActivityCombat/ZombieLogTipsView";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { CommonEvent } from "modules/common/CommonEvent";
import { ConstValue } from "modules/common/ConstValue";
import { EventCtrl } from "modules/common/EventCtrl";
import { Language } from "modules/common/Language";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { LoginCtrl, LoginInfo } from "modules/login/LoginCtrl";
import { LoginData } from "modules/login/LoginData";
import { LoginAckResult, LoginView } from "modules/login/LoginView";
import { MainMenu } from "modules/main/MainMenu";
import { TopLayerView } from "modules/main/TopLayerView";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { TYPE_TIMER, Timer } from "modules/time/Timer";
import { PackageData, server_List_Info, url_parm } from "preload/PkgData";
import { HTTP } from "../helpers/HttpHelper";
import { TextHelper } from "../helpers/TextHelper";
import { TimeHelper } from "../helpers/TimeHelper";
import { ChannelAgent, LoginVerify } from "./ChannelAgent";
import { ReportManager, ReportType } from "./ReportManager";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { Mod } from "modules/common/ModuleDefine";
import { ArenaCtrl, ArenaReq } from "modules/Arena/ArenaCtrl";
import { NetConnectOptions } from "core/net/NetNode";
import { GameTipsView } from "modules/login/GameTipsView";

enum ENUM_LOGIN {
    None = 0,
    CheckServer = 1,
    ConnectServer = 2,
    Send7056 = 3,
    onLogin = 4,
}

export class Main extends Singleton {
    constructor() {
        super();
    }

    public MainStart() {
        // PackageData.Inst().init();
        // ReportManager.Inst().sendPoint(ReportType.beginQuery);
        // let url = PackageData.Inst().query_url;
        // console.error(`${url}`);
        // HTTP.GetJson(url, this.httpCallBack);
        // console.table(PackageData.Inst().getQueryData());
        this.onGetQueryData(PackageData.Inst().getQueryData());
        //EventCtrl.Inst().on(CommonEvent.LOGIN_SUCC_ROLEDATA, this.OnLoginSucc, this, true);
    }

    private httpCallBack(statusCode: number, resp: url_parm | null, respText: string) {
        this.onGetQueryData(resp);
    }

    private onGetQueryData(resp: url_parm) {
        LoginData.Inst().SetServerInfo(resp.server_info);
        LoginData.Inst().SetPublishInfo(resp.param_list.publish_info);
        LoginData.SetUrlParm(resp);
        ChannelAgent.Inst().init();
        NodePools.Inst().Init();
        ViewManager.Inst().OpenView(GameTipsView);
        PackageData.Inst().setSpid(resp.server_info.spid);
        // ReportManager.Inst().sendPoint(ReportType.endQuery);
        ReportManager.Inst().sendPoint(ReportType.beginLoadConfig);
        CfgManager.Inst().Init();
        if (resp.param_list.switch_list.update_assets) {
            ReportManager.Inst().sendPoint(ReportType.beginUpdataSource);
            Main.Inst().getNewRES();
        }
    }

    /**
     * 更新资源
     */
    private getNewRES() {
    }

    public MainLogin(cb: (uInfo: LoginVerify) => void, verify_url = LoginData.GetUrlParm().param_list.verify_url) {
        let spid = PackageData.Inst().getPlatSpid()
        let device = sys.os;
        let accountId = LoginData.Inst().GetLoginData().URI_accountId;
        let userId = LoginData.Inst().GetLoginData().URI_uid;
        let token = LoginData.Inst().GetLoginData().URI_token;

        let time = Math.floor(TimeCtrl.Inst().ServerTime);

        accountId = accountId;
        userId = userId;
        token = token;


        // let url = verify_url +
        //     "?spid=" + spid +
        //     "&device=" + device +
        //     "&userId=" + userId +
        //     "&accountId=" + accountId +
        //     "&timestamp=" + time +
        //     "&sign=" + token;
        Debugger.wx_log_defaut_uid = userId + " " + accountId;
        // ReportManager.Inst().sendPoint(ReportType.beginLogin, ["0", verify_url]);

        if (cb) {
            let tmpInfo: LoginVerify = {
                ret: 0, msg: 'success', user: {
                    spid: '',
                    merger_spid: '',
                    account_spid: '',
                    account: userId,
                    account_type: 1,
                    fcm_flag: 0,
                    login_time: time,
                    uid: userId,
                    openid: '',
                    login_sign: '',
                }
            };
            LoginData.Inst().SetLoginData(tmpInfo);
            cb(tmpInfo);
        }
        // HTTP.GetJson(url, this.LoginRet.bind(this, cb, verify_url));
    }
    private timer_handle: any;
    private timeOut = 0;
    private LoginRet(cb: (uInfo: LoginVerify) => void, verify_url: string, statusCode: number, data: LoginVerify) {
        if (this.timer_handle) {
            Timer.Inst().CancelTimer(this.timer_handle);
            this.timer_handle = undefined;
        }
        if (statusCode == 200 && data && data.ret == 0 && data.user) {
            this.timeOut = 0;
            // ViewManager.Inst().CloseView(WaitView);
            LoginData.Inst().SetLoginData(data);
            cb(data);
            let account = LoginData.Inst().GetLoginRespUserData().account;
            ReportManager.Inst().sendPoint(ReportType.endLogin, [account, "true"]);
            if (data.role_data) {
                LoginData.Inst().SetRoleData(data.role_data);
            }
        } else {
            if (this.timeOut <= 5) {
                if (this.timeOut == 0) {
                    PublicPopupCtrl.Inst().ShowWait(Language.Login.WaitTips.tips1, 10);
                    // ViewManager.Inst().OpenView(WaitView, { desc: Language.Login.WaitTips.tips1 });
                    ReportManager.Inst().sendPoint(ReportType.endLogin, ["0", "false"]);
                }
                this.timer_handle = Timer.Inst().AddRunTimer(this.MainLogin.bind(this, cb, verify_url), 2, 1, false);
            } else {
                cb(undefined);
                this.timeOut = 0
                PublicPopupCtrl.Inst().HideWait();
                // ViewManager.Inst().CloseView(WaitView);
                ChannelAgent.Inst().wxModal(Language.Login.Tip, Language.Login.LoginFail2, null, null, false);
            }
            this.timeOut += 1;
        }
    }
    private isConnect = 0;
    /**连接服务器ID 仅用于请求使用 */
    private _id_server: number;
    public connect(id_server: number) {
        //当前在连接服务器 或 连接成功等待主界面加载
        if (this.isConnect > ENUM_LOGIN.None || (NetManager.sessionId && !Main.readyChcek())) {
            return
        }
        // PublicPopupCtrl.Inst().ShowWait(Language.Login.WaitTips.tips1);
        //刷新一次服务器状态
        this.isConnect = ENUM_LOGIN.CheckServer;
        let url = PackageData.Inst().getQueryData().param_list.server_stat_url;
        if (url) {
            url = `${url}?sid=${id_server}`;
            HTTP.GetJson(url, this.internalConnect.bind(this, id_server));
        }
        else {
            this.internalConnect(id_server, -1, null);
        }
    }

    private internalConnect(id_server: number, statusCode: number, data:
        { server_stat: { [key: string]: server_List_Info } }) {
        let currentInfo = LoginData.Inst().GetServerItemInfoById(id_server);
        if (currentInfo && statusCode == 200 && data && data.server_stat) {
            let si = data.server_stat[id_server.toString()];
            if (si) {
                console.log(`UpdateServerInfo,[${id_server}],open_time=${si.open_time},flag=${si.flag},ahead_time=${si.ahead_time}`)
                currentInfo.open_time = si.open_time;
                currentInfo.flag = si.flag;
                currentInfo.ahead_time = si.ahead_time;
            }
        }
        this._id_server = id_server
        // console.error(`id_server===`,id_server,currentInfo)
        let account = LoginData.Inst().GetLoginRespUserData().account;
        // let role_info = LoginData.Inst().GetServerRoleInfoById(currentInfo.id);
        // console.error(`role_info==`,currentInfo.id,"|",role_info,"|",LoginData.Inst()["server_role_list"]);
        // console.error(!role_info,"|",(0 == +role_info.vip),"|",+role_info.vip)
        // if (!role_info || 0 == +role_info.vip) {
        if (LoginData.Inst().GetLoginRespUserData().account_type != 1) {
            if (currentInfo.open_time > TimeCtrl.Inst().ServerTime + currentInfo.ahead_time) {
                PublicPopupCtrl.Inst().HideWait();
                let time_t = TimeHelper.FormatUnixTimeDate(currentInfo.open_time)
                PublicPopupCtrl.Inst().DialogTips(TextHelper.Format(Language.Login.ServerTips.NotOpenTips, time_t.year, time_t.month, time_t.day, time_t.hour, time_t.minute, time_t.second));
                this.isConnect = ENUM_LOGIN.None;
                return
            } else {
                let tips = GetCfgValue(Language.Login.ServerTips.BadTips, currentInfo.flag)
                if (tips) {
                    PublicPopupCtrl.Inst().HideWait();
                    PublicPopupCtrl.Inst().DialogTips(tips);
                    this.isConnect = ENUM_LOGIN.None;
                    return
                }
            }
        }
        this.isConnect = ENUM_LOGIN.ConnectServer;
        // PublicPopupCtrl.Inst().ShowWait(Language.Login.WaitTips.tips1);
        // ViewManager.Inst().OpenView(WaitView, { desc: Language.Login.WaitTips.tips1 });
        ReportManager.Inst().sendPoint(ReportType.beginConnectServer, [account, currentInfo.id]);
        NetManager.Inst().ConnectServer(currentInfo.ip, currentInfo.port, (suc, opt) => {
            if (suc) {
                Main.Inst().sendLoginReq();
            }
            else {
                PublicPopupCtrl.Inst().HideWait();
                this.isConnect = ENUM_LOGIN.None;
                ChannelAgent.Inst().wxModal(Language.Login.Tip, Language.Login.NetCloseTip, () => {
                    ChannelAgent.Inst().RestartProgram();
                    // let MainAgent = (window as any)['MainAgent'];
                    // MainAgent.exitMiniProgram();
                }, null, false);
                // MainAgent
            }
        }, 10);
    }

    private ht_waitLoginResult: TYPE_TIMER;
    private sendLoginReq() {
        let currentInfo = LoginData.Inst().GetServerItemInfoById(this._id_server);
        let account = LoginData.Inst().GetLoginRespUserData().account;
        ReportManager.Inst().sendPoint(ReportType.endConnectServer, [account, currentInfo.id]);
        var info: LoginInfo = {
            loginTime: Date.parse(new Date().toString()),
            loginStr: LoginData.Inst().GetLoginRespUserData().account,
            pname: LoginData.Inst().GetLoginRespUserData().account,
            server: currentInfo.id,
            platSpid: LoginData.Inst().palt_spid,
        }
        let last_server_list = LoginData.Inst().GetLastServerList();
        RoleData.Inst().isCreateRole = true;
        RoleData.Inst().isNewRole = true;
        for (let i = 0; i < last_server_list.length; i++) {
            if (last_server_list[i].id == currentInfo.id) {
                RoleData.Inst().isCreateRole = false;
                RoleData.Inst().isNewRole = false;
                break;
            }
        }
        if (RoleData.Inst().isCreateRole) {
            ReportManager.Inst().sendPoint(ReportType.beginCreateRole, [account, currentInfo.id, LoginData.Inst().GetLoginRespUserData().account]);
            // ChannelAgent.Inst().Behaveious(ConstValue.BehaveType.CreatRole)
        }

        this.isConnect = ENUM_LOGIN.Send7056;
        LoginCtrl.Inst().SendLoginReq(info);
        if (this.ht_waitLoginResult) {
            Timer.Inst().CancelTimer(this.ht_waitLoginResult)
            this.ht_waitLoginResult = undefined;
        }
        this.ht_waitLoginResult = Timer.Inst().AddRunTimer(this.endlLogin.bind(this), 6, 1, false)
    }

    private endlLogin(succ = false) {
        if (this.ht_waitLoginResult) {
            Timer.Inst().CancelTimer(this.ht_waitLoginResult)
            this.ht_waitLoginResult = undefined;
        }
        if (this.isConnect) {
            PublicPopupCtrl.Inst().HideWait();
            this.isConnect = ENUM_LOGIN.None;
            if (!succ) {
                ReportManager.Inst().sendPoint(ReportType.ConnectServerFail)
                if (LoginData.Inst().ResultData.result == LoginAckResult.LOGIN_RESULT_SUC) {
                    ChannelAgent.Inst().wxModal(Language.Login.Tip, Language.Login.LoginFail3, () => {
                        ChannelAgent.Inst().ExitProgram();
                        // let MainAgent = (window as any)['MainAgent'];
                        // MainAgent.exitMiniProgram();
                    }, null, false);
                } else {
                    PublicPopupCtrl.Inst().Center(Language.Login.LoginFail3);
                }
            } else {
                const wsOptions = {
                    autoReconnect: 10,
                    head: "http",
                    host: "139.155.129.88",
                    port: 30001,
                    url: "http://139.155.129.88:30001"
                }

                NetManager.Inst().ConnectSocket(wsOptions.host, wsOptions.port, (suc: boolean, opt: NetConnectOptions) => {
                    if (suc) {
                        console.log("connect socket success")
                    }

                    let loginData = { "action": 1, uid: RoleData.Inst().InfoRoleId };
                    // NetManager.Inst().SendProtoBufByChat(loginData);
                    NetManager.Inst().sendSocket(loginData);
                    PublicPopupCtrl.Inst().HideWait();
                });
            }
        }
    }

    public onLoginResult(data: PB_SCLoginToAccount) {
        LoginData.Inst().ResultData.currentId = this._id_server
        let resultData = LoginData.Inst().ResultData;
        resultData.result = data.result;
        resultData.resultFlush = !resultData.resultFlush;
        let server = LoginData.Inst().GetCurServerInfo()
        let ip = server.ip;
        LoginData.Inst().HTTPS = false;
        ConstValue.HTTPS_VALUE.forEach(element => {
            if (ip.indexOf(element) != -1) {
                LoginData.Inst().HTTPS = true;
                return;
            }
        });
        let ips = ip.split("//");
        server.noHeandIp = ips[ips.length - 1];
        if (resultData.result == LoginAckResult.LOGIN_RESULT_SUC) {
            EventCtrl.Inst().emit(CommonEvent.LOGIN_SUCC);
        } else {
            let error = Language.TIP_PROTOC_7000[-resultData.result]
            if (!error) {
                error = Language.TIP_PROTOC_7000[2]
            }
            PublicPopupCtrl.Inst().Center(error);
            console.error(`连接服务器失败,错误码:${resultData.result} ${error}`);
        }
        // if (this.is_create_role) {
        //     let currentInfo = LoginData.Inst().GetServerItemInfoById(LoginData.Inst().ResultData.currentId);
        //     let account = LoginData.Inst().GetLoginRespUserData().account;
        //     ReportManager.Inst().sendPoint(ReportType.endCreateRole, [account, currentInfo.id, LoginData.Inst().GetLoginRespUserData().account]);
        // }

        // AudioManager.Inst().PlayBg(AudioTag.ZhuJieMian);

        this.endlLogin(true)
    }

    //请求隐私政策
    public RequestUserProtocol() {
        // let url = LoginData.GetUrlParm().param_list.user_protocol_url ?? "http://cls.tt02.bluegames.cn/api/c2s/fetch_privacy_notice.php";
        // let spid = LoginData.Inst().GetServerInfo().spid ?? "dev";
        // url += "?spid=" + spid;
        // HTTP.GetJson(url, this.UserProtocolCallBack);
    }

    //隐私政策回调
    private UserProtocolCallBack(statusCode: number, resp: any) {
        if (resp && resp.ret == 0) {
            LoginData.Inst().SetLoginUserProtocol(resp.data);
        }
    }

    OnLoginSucc() {
        this.OnMainLoadedEvent();
    }

    OnMainLoadedEvent() {
        PublicPopupCtrl.Inst().HideWait();
        ChannelAgent.Inst().hideDouYinKfBtn()
        if (RoleData.Inst().IsGuide()) {
            BattleCtrl.Inst().EnterBattleGuide();
            return;
        } else {
            ViewManager.Inst().CloseView(LoginView);
        }

        let saveData = BattleCtrl.Inst().GetSaveData();
        if (saveData) {
            PublicPopupCtrl.Inst().DialogTips(Language.Battle.ContinueBattleTip, () => {
                BattleCtrl.Inst().EnterBattle(saveData.sceneId, saveData.sceneType, saveData);
            }, null, null, () => {
                BattleCtrl.Inst().CancelSave();
                if (RoleData.Inst().IsGuideNum(1)) {
                    GuideCtrl.Inst().Start(1);
                    return;
                }
            });
            if (!RoleData.Inst().isNewRole)
                LoginCtrl.Inst().AutoTryOpenAnnounce();
        } else {
            Timer.Inst().AddRunTimer(() => {
                if (RoleData.Inst().IsGuideNum(1)) {
                    GuideCtrl.Inst().Start(1);
                    return;
                } else {
                    let ZombieOpen = ActivityCombatData.Inst().GetZombieTipOpen();
                    if (ZombieOpen) {
                        ViewManager.Inst().OpenView(ZombieLogTipsView);
                        if (!RoleData.Inst().isNewRole)
                            LoginCtrl.Inst().AutoTryOpenAnnounce();
                    } else {
                        ActivityAdvertisingData.Inst().TipOpenView();
                        if (!RoleData.Inst().isNewRole)
                            LoginCtrl.Inst().AutoTryOpenAnnounce();
                    }
                }
            }, 2, 1, false)
        }

        let arenaOpen = FunOpen.Inst().GetFunIsOpen(Mod.Arena.View);
        if (arenaOpen && arenaOpen.is_open) {
            ArenaCtrl.Inst().SendReq(ArenaReq.Info);
        }
    }
    static readyChcek() {
        return ViewManager.Inst().commonPkgLoaded &&
            ViewManager.Inst().IsOpened(TopLayerView) &&
            ViewManager.Inst().IsOpened(MainMenu)
            && LoginData.Inst().ResultData && LoginData.Inst().ResultData.result == LoginAckResult.LOGIN_RESULT_SUC
            && ViewManager.Inst().mainViewLoaded
    }
}



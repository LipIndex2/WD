import { Asset, View, sys } from "cc";
import { LogError } from "core/Debugger";
import { FrameTimerHandle } from "data/HandleCollectorCfg";
import * as fgui from "fairygui-cc";
import { CameraManager } from "manager/CameraManager";
import { CfgManager } from "manager/CfgManager";
import { ViewManager } from "manager/ViewManager";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, viewRegcfg } from "modules/common/BaseView";
import { ERRORCODE, OPEM_PARAM, msgType } from "modules/common/CommonEnum";
import { CommonEvent } from "modules/common/CommonEvent";
import { ConstValue } from "modules/common/ConstValue";
import { EventCtrl } from "modules/common/EventCtrl";
import { Language } from "modules/common/Language";
import { EGLoader } from "modules/extends/EGLoader";
import { MainMenu } from "modules/main/MainMenu";
import { TopLayerView } from "modules/main/TopLayerView";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { Timer } from "modules/time/Timer";
//import { UserProtocolView } from "modules/UserProtocol/UserProtocolView";
import { ObjectPool } from "core/ObjectPool";
import { GuideView } from "modules/guide/GuideView";
import { UISpinePlayData, UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ENUM_UserServe, SettingUsertServeView } from "modules/setting/SettingUsertServeView";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { PackageData, server_List_Info } from "preload/PkgData";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent, GameToChannel, LoginVerify } from "../../proload/ChannelAgent";
import { Main } from "../../proload/Main";
import { LoginCtrl, RELANAME_CODE } from "./LoginCtrl";
import { LoginData } from "./LoginData";
import { ServerSelectView } from "./ServerSelectView";
import { GMCtrl } from "./GMCtrl";
import { HotUpdateCtrl } from "./HotUpdateCtrl";



export enum LoginAckResult {
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
};


@BaseView.registView
export class LoginView extends BaseView {
    protected viewRegcfg: viewRegcfg = {
        UIPackName: "Login",
        ViewName: "LoginView",
        LayerType: ViewLayer.Normal,
    };
    protected viewNode = {
        accountInput: <fgui.GTextInput>null,
        passInput: <fgui.GTextInput>null,
        ButtonLogin: <fgui.GButton>null,
        ButtonLoginNew: <fgui.GButton>null,
        ButtonLoginSDK: <fgui.GButton>null,
        uiSpineShow: <UISpineShow>null,
        // bg1: <EGLoader>null,
        // bg2: <EGLoader>null,
        login: <fgui.GGroup>null,
        play: <fgui.GButton>null,
        notice: <fgui.GButton>null,
        BtnAgeTip: <fgui.GButton>null,
        BtnProtocol: <fgui.GButton>null,
        PublishInfo: <fgui.GTextField>null,
        PublishInfo2: <fgui.GTextField>null,
        PublishInfo3: <fgui.GTextField>null,
        fullscreen: <fgui.GComponent>null,
        version: <fgui.GLabel>null,
        server: <fgui.GGroup>null,
        change: <fgui.GButton>null,
        logo: <EGLoader>null,
        gp_btn_r: <fgui.GGroup>null,
        GpWhite: <fgui.GGroup>null,
        touchBlock: <fgui.Image>null,
    };

    private account: string = "";
    private password: string = "";
    private resultData: any;

    private currentInfo: server_List_Info;
    private ftw_open: fgui.Transition;

    private hotUpdate: HotUpdateCtrl = null;

    mainfestUrl: Asset = null;

    InitData() {
        RoleData.Inst().inGame = false;
        let self = this;
        let _account = sys.localStorage.getItem("Account");
        if (_account) {
            self.account = _account;
        }
        let _password = sys.localStorage.getItem("PassWord");
        if (_account) {
            self.password = _password;
        }
        self.resultData = LoginData.Inst().ResultData;
        // self.AddSmartDataCare(self.resultData, self.isLoginResult.bind(self), "resultFlush");
        self.AddSmartDataCare(self.resultData, self.freshCurrentId.bind(self), "currentId");
        self.AddSmartDataCare(self.resultData, self.ShowUserProtocol.bind(self), "user_protocol_change");
        EventCtrl.Inst().on(CommonEvent.LOGIN_SUCC_ROLEDATA, this.onRoleData, this, true);
        EventCtrl.Inst().on(CommonEvent.LOGIN_SET_SDK_UID, this.onSetSdkUid, this, true);

        // 初始化GM后台
        GMCtrl.Ins.finishInitHandler = (hotUpdateUrl: string) => {
            this.checkUpdate(hotUpdateUrl);
        };
        GMCtrl.Ins.initGM();
    }

    //检查更新
    private checkUpdate(hotUpdateUrl: string) {
        this.updateProgress("等待热更", 0);
        if (sys.isNative) {
            // 原生平台
            if (sys.OS.IOS == sys.os) {
                hotUpdateUrl += 'ios/'
            } else if (sys.OS.ANDROID == sys.os) {
                hotUpdateUrl += 'android/'
            } else {
                console.warn("未知平台，无法提供热更新！");
                LoginCtrl.Inst().prepareStart();
                return;
            }
            this.hotUpdate = new HotUpdateCtrl(this.mainfestUrl.nativeUrl, hotUpdateUrl, this.onHotUpdateCallback.bind(this));
            this.hotUpdate.checkUpdate();
        } else {
            // 非原生平台（web）
            console.log('非原生平台，不检查热更新');
            LoginCtrl.Inst().prepareStart();
        }
    }

    /**
     * 更新进度条
     * @param {string} str
     * @param {number} val
     */
    private updateProgress(str: string, val: number, max?: number, autoTime?: number) {

    }

    /**
    * @param event
    * no_update 没有更新
    * check_update 提示更新
    * update_progress 更新中-提示进度
    * update_fail 更新文件失败
    * download_mainfest_fail 更新mainfest文件失败
    * local_mainfest_fail 去读本地mainfest失败
    */
    private onHotUpdateCallback(event: any) {
        if ('no_update' == event.name) {
            LoginCtrl.Inst().prepareStart();
        } else if ('check_update' == event.name) {
            // this.updateProgress(this.i18n('CX_Words_207'), 0);
            this.hotUpdate.hotUpdate();
        } else if ('update_progress' == event.name) {
            let tips = event.ext.downloadFiles + '/' + event.ext.totalFiles + ' (' + event.ext.downloadBytes + '/' + event.ext.totalBytes + ')';
            this.updateProgress(tips, event.ext.percent)
        } else if ('update_fail' == event.name) {
            // this.showDialogNode(this.i18n('CX_Words_214'), () => { })
        } else if ('download_mainfest_fail' == event.name) {
            // this.showDialogNode(this.i18n('CX_Words_211'), () => { })
        } else if ('finished' == event.name) {
            // this.updateProgress(this.i18n('CX_Words_217'), 0);
            this.hotUpdate.gameRestart();
        }
    }

    InitUI() {
        let self = this;
        self.viewNode.accountInput.text = self.account;
        self.viewNode.passInput.text = self.password;
        self.viewNode.ButtonLogin.onClick(self.onClickLogin.bind(self, false));
        self.viewNode.ButtonLoginNew.onClick(self.onClickLogin.bind(self, true));
        self.viewNode.ButtonLoginSDK.onClick(self.onClickLoginSdk.bind(self));
        self.viewNode.change.onClick(self.onClickChange.bind(self));
        self.viewNode.play.onClick(self.onClickPlay.bind(self));
        self.viewNode.notice.onClick(self.onClickNotice.bind(self));
        self.viewNode.BtnAgeTip.onClick(self.onClickAgeTip.bind(self));
        self.viewNode.BtnProtocol.onClick(self.onClickProtocol.bind(self));
        self.flushVersion();
        this.ftw_open = this.view.getTransition("open");

        this.ShowUserProtocol();
    }

    private flushVersion() {
        let self = this;
        let pkgData = PackageData.Inst();
        let version = "";
        if (pkgData.getQueryData().version_info.assets_info.resources) {
            version = pkgData.getQueryData().version_info.assets_info.resources;
        }
        UH.SetText(self.viewNode.version, TextHelper.Format(Language.Login.version, pkgData.getVersion(), version, LoginData.Inst().GetLoginData().uid))
    }

    private ttime: any;
    private onRoleData() {
        if (Main.readyChcek()) {
            ChannelAgent.FGUIrameTime = 2;
            Main.Inst().OnLoginSucc();
        }
        else {
            PublicPopupCtrl.Inst().ShowWait(Language.Login.WaitTips.tips1, 10);
            // ViewManager.Inst().OpenView(WaitView, { desc: Language.Login.WaitTips.tips1 });
            this.handleCollector.KeyAdd("WaitViewReady", FrameTimerHandle.Create(() => {
                if (Main.readyChcek()) {
                    this.handleCollector.KeyRemove("WaitViewReady");
                    if (!this.ttime) {
                        this.ttime = Timer.Inst().AddRunTimer(() => {
                            // PublicPopupCtrl.Inst().HideWait();
                            Main.Inst().OnLoginSucc();
                        }, 1.5, 1, false)
                    }
                }
            }, 1, 999999999, false));
        }
    }

    private onSetSdkUid(uid: string) {
        this.viewNode.accountInput.text = uid;

        // 确定账号后直接登录
        this.onClickLogin(false);
    }

    DoOpenWaitHandle() {
        let self = this;
        let waitHandle = self.createWaitHandle("loadBG")
        self.AddWaitHandle(waitHandle);
        self.viewNode.logo.SetIcon(PackageData.Inst().getLogin_logo())
        ChannelAgent.FGUIrameTime = 2;
        this.viewNode.uiSpineShow.LoadSpine(ResPath.UIEffect("denglu"), false, async () => {
            let anidata = ObjectPool.Get(UISpinePlayData);
            anidata.name = "kaichang";
            anidata.comp = () => {
                let anidata = ObjectPool.Get(UISpinePlayData);
                anidata.name = "idle";
                anidata.loop = true;
                this.viewNode.uiSpineShow.play(anidata);
            }
            ChannelAgent.FGUIrameTime = 0.02;
            this.viewNode.uiSpineShow.play(anidata);
            waitHandle.complete = true;
            this.ftw_open.play();
            await this.firstSceneCallBack();
            UH.reSizeByParent(this.viewNode.uiSpineShow._container, { x: 0.5, y: 0.5 })
        })
        // self.viewNode.bg1.SetIcon(PackageData.Inst().getLogin_bg(), () => {
        //     self.viewNode.bg2.SetIcon("loader/login/qian", () => {
        //         waitHandle.complete = true;
        //         this.firstSceneCallBack()
        //     })
        //     self.refreshBgSize(this.viewNode.bg1)
        // })
    }

    async firstSceneCallBack() {
        let firstSceneEnd = (window as any)['firstSceneEnd'];
        if (firstSceneEnd) {

            await firstSceneEnd();
            (window as any)['firstSceneEnd'] = undefined;
            CameraManager.Inst().CameraShow();
        } else {
            CameraManager.Inst().CameraShow();
            View.instance.setDesignResolutionSize(800, 1600, 2);
        }
        // let firstSceneEndAfter = (window as any)['firstSceneEndAfter'];
        // if (firstSceneEndAfter) {
        //     firstSceneEndAfter();
        //     (window as any)['firstSceneEndAfter'] = undefined;
        // }
        // View.instance.setDesignResolutionSize(800,2000,2);
        ViewManager.Inst().windowSizeChange();
        this.ReSetWindowSize();
    }

    WindowSizeChange() {
        // this.refreshBgSize(this.viewNode.bg1)
        // this.viewNode.bg.width = 1125 * (fgui.GRoot.inst.height / 1500);
    }

    private FlushPublishInfo() {
        let publish_info = LoginData.Inst().GetPublishInfo()
        let company = "";
        let game_num = "";
        if (publish_info) {
            if (publish_info.company) {
                company = publish_info.company
            }
            if (publish_info.game_num) {
                game_num = publish_info.game_num
            }
        }
        let game_nums = game_num.split("\r\n")
        UH.SetText(this.viewNode.PublishInfo, company);
        UH.SetText(this.viewNode.PublishInfo2, game_nums[0] ? game_nums[0] : "");
        UH.SetText(this.viewNode.PublishInfo3, game_nums[1] ? game_nums[1] : "");
    }

    private onClickChange() {
        AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
        ViewManager.Inst().OpenView(ServerSelectView);
    }

    private freshCurrentId() {
        let self = this;
        self.currentInfo = LoginData.Inst().GetServerItemInfoById(self.resultData.currentId);
        self.viewNode.change.title = self.currentInfo.name;
    }


    // private isLoginResult() {
    //     let self = this;
    //     if (self.resultData.result == LoginAckResult.LOGIN_RESULT_SUC) {
    //         ChannelAgent.Inst().Behaveious(ConstValue.BehaveType.EnterServer)
    //     }
    // }

    private onClickLogin(is_new = false) {
        if (!LoginData.IsWhite() && ChannelAgent.Inst().isAgent) {
            ChannelAgent.Inst().login()
            return
        }

        AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
        let self = this;
        self.account = is_new ? `${Math.floor(TimeCtrl.Inst().ServerTime)}` : self.viewNode.accountInput.text;
        self.password = self.viewNode.passInput.text;
        LoginData.Inst().GetLoginData().uid = self.account
        if (self.account.length === 0) {
            return;
        }
        sys.localStorage.setItem("Account", self.account);
        sys.localStorage.setItem("PassWord", self.password);
        if (!LoginData.GetUrlParm())
            return;
        this.viewNode.ButtonLogin.visible = false;
        this.viewNode.GpWhite.visible = false;
        this.viewNode.login.visible = false;
        Main.Inst().MainLogin((uInfo: LoginVerify) => {
            this.onVerify(uInfo)
        }, LoginData.IsWhite() ? LoginData.GetUrlParm().param_list.verify_url_white : LoginData.GetUrlParm().param_list.verify_url);
        //ViewManager.Inst().CloseView(LoginView);
        // this.viewNode.play.visible = true;
    }

    private onClickLoginSdk() {
        if (ChannelAgent.Inst().isAgent) {
            ChannelAgent.Inst().login()
            this.viewNode.GpWhite.visible = false;
            this.viewNode.login.visible = false;
        }
    }

    // 登录检查
    public onVerify(uInfo: LoginVerify, showEneter = true) {
        let t = this;
        if (uInfo) {
            t.flushVersion();
            if (uInfo.user && uInfo.user.openid) {
                console.log("login openid = ", uInfo.user.openid);
                let param = new OPEM_PARAM()
                param.type = msgType.openid
                param.value = uInfo.user.openid
                ChannelAgent.Inst().postMessageToOD(param)
            }

            this.viewNode.ButtonLogin.visible = false;
            this.viewNode.GpWhite.visible = false;
            t.viewNode.play.visible = showEneter;
            if ((sys.platform != sys.Platform.WECHAT_GAME && sys.platform != sys.Platform.BYTEDANCE_MINI_GAME) || PackageData.Inst().getIsDebug() || LoginData.IsWhite()) {
                t.viewNode.server.visible = true;
            }
            ChannelAgent.Inst().OnMessage(GameToChannel.showEnterGame)
            t.freshCurrentId();
            //LogWxInfo("onVerify", "success")
            ViewManager.Inst().LoadCommonPack(() => {
                this.viewNode.gp_btn_r && (this.viewNode.gp_btn_r.visible = true);
                ViewManager.Inst().OpenView(MainMenu);
                //ViewManager.Inst().OpenView(MainView);
                ViewManager.Inst().OpenView(TopLayerView);
            });
        } else {
            //LogWxError("onVerify", "fail")
            this.viewNode.ButtonLogin.visible = true;
            if (!ChannelAgent.Inst().isAgent || LoginData.IsWhite()) {
                // this.viewNode.GpWhite.visible = true;
                t.viewNode.login.visible = true;
            }
            PublicPopupCtrl.Inst().Center(Language.Login.LoginFail);
        }
    }

    private onClickPlay() {
        if (!CfgManager.Inst().IsLoadComplete(this.onClickPlay.bind(this))) {
            LogError("配置未加载完成，请重试");
            return;
        }

        if (sys.isNative && LoginCtrl.Inst().realName(RELANAME_CODE.LOGIN, { isCloseTips: true })) {
            LoginCtrl.Inst().realName(RELANAME_CODE.SIGN_IN);
            return;
        }
        // AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
        // ViewManager.Inst().CloseView(LoginView);

        Main.Inst().connect(LoginData.Inst().ResultData.currentId);
    }

    CloseCallBack(): void {
        ViewManager.Inst().OpenView(GuideView)
        Timer.Inst().CancelTimer(this.ttime)
        this.ttime = undefined;
        ChannelAgent.FGUIrameTime = 0.2;
    }

    OpenCallBack(): void {
        try {
            Main.Inst().RequestUserProtocol();

            if (LoginData.IsWhite()) {
                // this.viewNode.GpWhite.visible = true
            } else {
                if (ChannelAgent.Inst().isAgent) {
                    this.viewNode.login.visible = false;
                    this.viewNode.ButtonLogin.visible = false;
                    ChannelAgent.Inst().login()
                }
            }
        } catch (e) {
            ChannelAgent.Inst().reportError(ERRORCODE.err2)
            ChannelAgent.Inst().wxModal(Language.Login.Tip, Language.Login.LoginError, () => {
                ChannelAgent.Inst().RestartProgram();
                // let MainAgent = (window as any)['MainAgent'];
                // MainAgent.exitMiniProgram();
            }, null, false);
        }
        AudioManager.Inst().PlayBg(AudioTag.ZhuJieMian);
        this.FlushPublishInfo();
    }

    private onClickNotice() {
        // PublicPopupCtrl.Inst().Center("点击了公告");
        LoginCtrl.Inst().TryOpenAnnounce();
        // ViewManager.Inst().OpenView(SettingUsertServeView, { type: ENUM_UserServe.SETTING, param: 4 })
    }

    private ShowUserProtocol() {
        let user_data = LoginData.Inst().GetLoginUserProtocol();
        this.viewNode.BtnProtocol.visible = user_data != null;
    }

    private onClickAgeTip() {
        ViewManager.Inst().OpenView(SettingUsertServeView, { type: ENUM_UserServe.SETTING, param: 7 })
        // ViewManager.Inst().OpenView(AgeTipView);
    }

    private onClickProtocol() {
        PublicPopupCtrl.Inst().Center("点击了协议");
    }

}
import { native, sys } from "cc";
import { NATIVE } from "cc/env";
import { CfgAdDataAdType } from "config/CfgAd";
import { ViewManager } from "manager/ViewManager";
import { AdFreeData } from "modules/AdFree/AdFreeData";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { CommonEvent } from "modules/common/CommonEvent";
import { ConstValue } from "modules/common/ConstValue";
import { EventCtrl } from "modules/common/EventCtrl";
import { LoginData } from "modules/login/LoginData";
import { LoginView } from "modules/login/LoginView";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleCtrl } from "modules/role/RoleCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { PackageData } from "preload/PkgData";
import { HTTP } from "../helpers/HttpHelper";
import { UtilHelper } from "../helpers/UtilHelper";
import { LoginVerify, GameToChannel, ChannelToGame, wx_User, ChannelAgent_IF, ChannelAgent } from "./ChannelAgent";
import { Main } from "./Main";
import { Order_Data, OrderCtrl } from "modules/recharge/OrderCtrl";
import { Singleton } from "core/Singleton";
import { ERRORCODE } from "modules/common/CommonEnum";
import { Message } from "protobufjs";


export class NativeAgent extends Singleton implements ChannelAgent_IF {
    public static get inst(): NativeAgent {
        return NativeAgent.Inst();
    }
    static NATIVE_CLASS = "com/cocos/game/AppActivity"
    isAgent = false
    init(v: ChannelAgent) {
        this.isAgent = native.reflection.callStaticMethod(NativeAgent.NATIVE_CLASS, "Init", `()${ENUM_NATIVE_PARAM.boolean}`);
        return this.isAgent
    }

    login(): void {
        native.reflection.callStaticMethod(NativeAgent.NATIVE_CLASS, "Login", "()V");
    }

    Mai(orderInfo: Order_Data): Boolean {
        if (this.isAgent) {
            native.reflection.callStaticMethod(NativeAgent.NATIVE_CLASS, "Mai", `(${ENUM_NATIVE_PARAM.str})V`, JSON.stringify(orderInfo));
            return true
        }
        return false
    }
    /**
     * 发信息给sdk
     * @param type  GameToChannel
     * @param msg 参数
     * @param msg1 参数
     * @returns 
     */
    OnMessage(type: string, msg?: string | {}, msg1?: string): void {

    }

    Behaveious(type: string): void {
        native.reflection.callStaticMethod(NativeAgent.NATIVE_CLASS, "SetUserInfo", `(${ENUM_NATIVE_PARAM.str})V`, this.GetUserInfo());
        native.reflection.callStaticMethod(NativeAgent.NATIVE_CLASS, "Behaveious", `(${ENUM_NATIVE_PARAM.str})V`, type);
    }

    CheckContent(type: string, msg: string, cb: (result: boolean, msg: string) => void): void {

    }
    restartMiniProgram(): void {

    }
    reportError(p: ERRORCODE): void {

    }
    exitMiniProgram(): void {

    }

    CopyText(text: string): void {
        native.reflection.callStaticMethod(NativeAgent.NATIVE_CLASS, "CopyText", `(${ENUM_NATIVE_PARAM.str})V`, text);
    }

    wxModal(title: string, content: string, confirm_func: any, cancel_func: any, showCancel: boolean, confirmText?: string, cancelText?: string): void {

    }


    /**====================================================================================== */

    public GetUserInfo() {
        let loginCtrl = LoginData.Inst();
        let data_server = loginCtrl.GetLoginRespUserData();
        let roleinfo = RoleData.Inst();
        let server_info = loginCtrl.GetCurServerInfo();
        let roleInfo
        if (server_info && data_server && roleinfo)
            roleInfo = {
                "server_id": server_info.id,
                "server_name": server_info.name,
                "user_id": data_server.uid,
                "role_id": roleinfo.InfoRoleId,
                "role_name": roleinfo.InfoRoleName,
                "level": roleinfo.InfoRoleLevel,
                "serverOpenTime": server_info.open_time,
            }
        else {
            roleInfo = {
                "server_id": 0,
                "server_name": 0,
                "user_id": 0,
                "role_id": 0,
                "role_name": 0,
                "level": 0,
                "serverOpenTime": 0,
            }
        }
        return JSON.stringify(roleInfo)
    }

    public static SetAudio(open: boolean) {
        if (!open) {
            AudioManager.Inst().StopBg()
        } else {
            AudioManager.Inst().RePlayBg()
        }
    }

    public static OnLogin(loginStr: string) {
        let param: { account: string, token: string, uid: string };
        param = JSON.parse(loginStr);
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


    /**
     * 广告视频接口
     * @param cfg_ad 广告表
     * @param tip 视频cd提示
     * @param is_dia 是否消耗钻石 1：钻石 0：非钻石
     * @param param 等级基金，宝箱基金活动序号
     */
    public advert(cfg_ad: CfgAdDataAdType, tip: string, is_dia = 0, param: number = 0, auto: 0 | 1 = 1) {
        if (this.isAgent) {
            let msg: TYPE_ADVERT = {};
            msg.cfg_ad = cfg_ad;
            msg.tip = tip;
            msg.is_dia = is_dia;
            msg.param = param;
            msg.auto = auto;
            native.reflection.callStaticMethod(NativeAgent.NATIVE_CLASS, "Advert", `(${ENUM_NATIVE_PARAM.str})V`, JSON.stringify(msg));
            return true
        }
        return false
    }

    public static Message(type: string, msg: string) {
        switch (type) {
            case ChannelToGame.tip:
                PublicPopupCtrl.Inst().Center(msg as string);
                break;
            case ChannelToGame.wx_advertS:
                break
            case ChannelToGame.wx_advertE:
                if (msg) {
                    let type_advert: TYPE_ADVERT = JSON.parse(msg as string);
                    let cfg = type_advert.cfg_ad
                    EventCtrl.Inst().emit(CommonEvent.PACK_WX_ADVERTSUC)
                    //videoKey-${tip}-${is_dia}-${param}-${auto}
                    let auto = type_advert.auto
                    if (auto) {
                        let is_dia = type_advert.is_dia;
                        let param = type_advert.param;
                        RoleCtrl.Inst().ReqAdverReward(+cfg.seq, is_dia, param);
                    }
                }
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

    public Report() {
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
        this.Behaveious(ConstValue.BehaveType.LevelUp);
    }
}
(window as any).NativeAgent = NativeAgent;

export enum ENUM_NATIVE_PARAM {
    str = "Ljava/lang/String;",
    int = "I",
    float = "F",
    boolean = "Z",
}

type TYPE_ADVERT = {
    cfg_ad: CfgAdDataAdType, tip: string, is_dia: number, param: number, auto: 0 | 1
}
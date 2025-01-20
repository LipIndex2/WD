import { game, native } from "cc";
import { sys } from "cc";
import { NetManager } from "manager/NetManager";
import { ViewManager } from "manager/ViewManager";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { BattlePauseView } from "modules/Battle/BattlePauseView";
import { CommonEvent } from "modules/common/CommonEvent";
import { EventCtrl } from "modules/common/EventCtrl";
import { LoginCtrl } from "modules/login/LoginCtrl";
import { LoginView } from "modules/login/LoginView";
import { SettingUsertServeView } from "modules/setting/SettingUsertServeView";

export class CXSDKHelper {

    private _loginCB: Function = null;

    private static _instance: CXSDKHelper;
    public static get Ins() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new CXSDKHelper();
        return this._instance;
    }

    // SDK登录
    loginSdk(cb: Function) {
        this._loginCB = cb;
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "login", "()V");
                console.log("SDK登录成功");
            } catch (error) {
                if (error) {
                    console.error("SDK登录失败:" + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    // 设置SDK UID
    setSdkUid(account: String) {
        console.log("setSdkUid:", account);
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "setUid", "(Ljava/lang/String;)V", account);
                console.log("返回UID成功");
            } catch (error) {
                if (error) {
                    console.error("返回UID失败: " + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    // SDK登出
    logoutSdk() {
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "logout", "()V");
            } catch (error) {
                if (error) {
                    console.error("SDK登出失败:" + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    // 打开用户中心
    showUserCenter() {
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "showUserCenter", "()V");
            } catch (error) {
                if (error) {
                    console.error("SDK用户中心打开失败:" + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    // 调用SDK支付
    pay(params: any) {
        let paramsStr = JSON.stringify(params);
        console.log("start sdk pay", paramsStr);
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "pay", "(Ljava/lang/String;)V", paramsStr);
                console.log("调起支付成功");
            } catch (error) {
                if (error) {
                    console.error("调起支付失败：" + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    // 初始化服务器
    initServer(roleId: string, roleName: string, level: number = 1, serverId: string, serverName: string = "") {
        let params = {
            "role_id": roleId,
            "role_name": roleName,
            "level": level,
            "server_id": serverId,
            "server_name": serverName,
        };
        let paramsStr = JSON.stringify(params);
        console.log("report sdk initServer", paramsStr);
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "initServer", "(Ljava/lang/String;)V", paramsStr);
                console.log("initServer上报成功");
            } catch (error) {
                if (error) {
                    console.error("initServer上报成功：" + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    // 登出服务器(此版本可以暂时不接)
    logoutServer() {
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "logoutServer", "()V");
                console.log("logoutServer上报成功");
            } catch (error) {
                if (error) {
                    console.error("logoutServer上报成功：" + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    // 创角上报
    createRole(roleId: string, roleName: string, serverId: string, serverName: string = "") {
        let params = {
            "role_id": roleId,
            "role_name": roleName,
            "level": 1,
            "server_id": serverId,
            "server_name": serverName,
        };
        let paramsStr = JSON.stringify(params);
        console.log("report sdk createRole", paramsStr);
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "createRole", "(Ljava/lang/String;)V", paramsStr);
                console.log("createRole上报成功");
            } catch (error) {
                if (error) {
                    console.error("createRole上报成功：" + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    // 角色升级上报
    upgradeRole(level: number) {
        let params = {
            "level": level,
        };
        let paramsStr = JSON.stringify(params);
        console.log("report sdk upgradeRole", paramsStr);
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "upgradeRole", "(Ljava/lang/String;)V", paramsStr);
                console.log("upgradeRole上报成功");
            } catch (error) {
                if (error) {
                    console.error("upgradeRole上报成功：" + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    // VIP升级上报
    upRoleVipLevel(OldVipLevel: number, vipLevel: number) {
        let params = {
            "old_vip_level": OldVipLevel,
            "vip_level": vipLevel,
        };
        let paramsStr = JSON.stringify(params);
        console.log("report sdk upRoleVipLevel", paramsStr);
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "upRoleVipLevel", "(Ljava/lang/String;)V", paramsStr);
                console.log("upRoleVipLevel上报成功");
            } catch (error) {
                if (error) {
                    console.error("upRoleVipLevel上报成功：" + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    // 关卡上报
    gateReport(gateId: string, gateName: string) {
        let params = {
            "gate_id": gateId,
            "gate_name": gateName,
        };
        let paramsStr = JSON.stringify(params);
        console.log("report sdk gateReport", paramsStr);
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            try {
                native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "gateReport", "(Ljava/lang/String;)V", paramsStr);
                console.log("gateReport上报成功");
            } catch (error) {
                if (error) {
                    console.error("gateReport上报成功：" + error);
                }
            }
        } else if (sys.os == sys.OS.IOS && sys.isNative) {
            //TODO:ios
        } else {
            console.log("非安卓或ios平台");
        }
    }

    exitGame() {
        if (sys.os == sys.OS.ANDROID && sys.isNative) {
            native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "exitGame", "()V");
        }
    }

    // ---（JAVA层调用）--------------------------------------------------------------------------------------------------

    // （JAVA层调用）SDK登录结果回调
    // string = {
    //     "code": 1000,
    //     "msg": "ok",
    //     "data": {
    //         "game": "wjszm",
    //         "platform": "chuxin",
    //         "uid": "b1e4cc73efa3d66b0e3ec57d8c6367bf",
    //         "user_name": "lip12345678",
    //         "identify": 4,
    //         "visitor": false,
    //         "session": "",
    //         "open_id": "25536986",
    //         "device_id": "ae14e24093994732778849ed3700d3ec",
    //         "ad_server_id": "0"
    //     }
    // }
    public onLoginResult(result: string, ori_str: string, uid: string, allRet: string) {
        let ret = JSON.parse(result);
        let allResult = JSON.parse(allRet);
        console.log("onLoginResult:", JSON.stringify(ret), ori_str);
        EventCtrl.Inst().emit(CommonEvent.LOGIN_SET_SDK_UID, allResult.data.open_id);
        if (this._loginCB) {
            console.log("call _loginCB");
            this._loginCB(ret, allResult);
        }
    }

    // （JAVA层调用）SDK登出
    onLogout() {
        // 弹出登录界面
        ViewManager.Inst().OpenView(LoginView);
        let view = ViewManager.Inst().getView(SettingUsertServeView);
        //@ts-ignore
        view && (view["param"] = null);
        ViewManager.Inst().CloseView(SettingUsertServeView);
        BattleCtrl.Inst().ExitBattle(false);
        LoginCtrl.Inst().loginSdk();
    }
}

//@ts-ignore 设置为全局变量，方便再Android 中调用
window["CXSDKHelper"] = CXSDKHelper;
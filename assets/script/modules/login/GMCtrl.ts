import { log, Label, Event, sys, error } from 'cc';
import { GameVersion } from "./GameVersion";
import { NetManager } from 'manager/NetManager';
import { LoginCtrl } from './LoginCtrl';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { EventCtrl } from 'modules/common/EventCtrl';
import { CommonEvent } from 'modules/common/CommonEvent';
import { ViewManager } from 'manager/ViewManager';
import { ENUM_UserServe, SettingUsertServeView } from 'modules/setting/SettingUsertServeView';


export class GMCtrl {
    static _instance: GMCtrl;
    public static get Ins() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new GMCtrl();
        return this._instance;
    }

    // 结束初始化的回调函数
    public finishInitHandler: (hotUpdateUrl: string) => void;

    /** 初始化GM后台 */
    public initGM() {
        // SdkCtrl.Ins.loadPhoneInfo();        //获取设备信息
        if (LoginParam.sdkInfo.platform.length > 0) {
            // 已设置SDK参数->需要走SDK
            LoginParam.platform = LoginParam.sdkInfo.platform;
        }
        this.GMInit();

    }

    // GM后台请求的公共参数（Json格式）
    public getCommonParams() {
        return {
            appid: LoginParam.gmAppId,
            nonce: this._generateRandomNumber(),
            ts: this.getUnixTime(),
            request_id: this.getUnixTime().toString(),  //TODO:需要MD5
        };
    }

    /** 
     * 获取当前时间戳秒数
     */
    getUnixTime() {
        return Math.floor(new Date().getTime() / 1000);
    }

    // 登录校验
    public auth(params: any, callback: Function) {
        let url = LoginParam.gmUrl + `/v1/public/login?`;
        let paramsStr = NetManager.Inst().convertToQueryString(GMCtrl.Ins.getCommonParams());
        url += paramsStr;
        NetManager.Inst().httpPost(url, JSON.stringify(params), (xhr: XMLHttpRequest) => {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {

                const response = xhr.response
                if (response.code != 200) {
                    //服务器维护，有公告提示公告，无公告弹出服务器未开提示(兼容native账号绑定问题)
                    if (response.msg == "ALERT_AUTH_FORBIDED") {
                        EventCtrl.Inst().emit(CommonEvent.LOGIN_SERVER_NOT_FOUND, response.msg, undefined, true, true);
                    } else {
                        //TODO: 打开公告
                        EventCtrl.Inst().emit(CommonEvent.LOGIN_SERVER_NOTICE, "", () => {
                            LoginCtrl.OpRestart();
                        });
                    }
                    return;
                }

                const data = response.data;
                if (callback) {
                    callback(data);
                }
            } else {
                const extMsg = `readyState=${xhr.readyState} status=${xhr.status} response=${JSON.stringify(xhr.response)}`;
                console.log(extMsg);
                EventCtrl.Inst().emit(CommonEvent.LOGIN_LOGIN_SDK_FAILED, 102, '', false);
            }

            // if (xhr.readyState != 4 || xhr.status != 200 || !xhr.response) {
            //     let opt: OpenWinOpt<DialogWinOpt> = {
            //         name: 'DialogWin',
            //         args: {
            //             title: '提示',
            //             des: '登录认证异常，请稍后重试',
            //             right: {
            //                 cb: () => {
            //                     // if (res.confirm) {
            //                     //     self._loginSdk();
            //                     // }
            //                 },
            //             },
            //             hideCloseBtn: true,
            //             clickEmptyClose: false,
            //         },
            //     };
            //     WinManager.Ins.openWin(opt);
            //     return
            // }
        });
    }

    public getServerList(token: string, callback: Function) {
        let url = LoginParam.gmUrl + `/v1/user/servers?`;
        let params: any = {
            platform: LoginParam.gmInitPlatform,
            os: sys.isMobile ? sys.os.toString().toLowerCase() : "android",         // 非手机系统默认传android
            version: GameVersion.version,
        }
        params = Object.assign({}, params, GMCtrl.Ins.getCommonParams());
        let paramsStr = NetManager.Inst().convertToQueryString(params);
        url += paramsStr;

        console.log("获取区服列表：", url);

        let header = {
            Authorization: `Bearer ${token}`
        };

        NetManager.Inst().httpGet({
            url: url, headers: header, callback: (xhr: XMLHttpRequest) => {
                if (xhr.readyState != 4 || xhr.status != 200 || !xhr.response) {
                    console.log("获取区服列表异常");
                    PublicPopupCtrl.Inst().Center("获取区服列表异常");
                    return;
                }

                const response = xhr.response
                if (response.code != 200) {
                    console.log("获取区服列表失败");
                    PublicPopupCtrl.Inst().Center("获取区服列表失败");
                    return;
                }

                const data = response.data;
                data.sort((a: any, b: any) => a.sid - b.sid);

                if (callback) {
                    callback(data);
                }
            }
        });
    }

    //获取运维公告信息
    public getOmNoticeInfo(token: string, callback: Function) {
        let url = LoginParam.gmUrl + `/v1/public/notice/nav?`;
        let params: any = {
            platform: "chuxin", //TODO:测试阶段固定为chuxin
            os: "android",      //TODO:测试阶段固定为android
            version: GameVersion.version,
        }
        params = Object.assign({}, params, GMCtrl.Ins.getCommonParams());
        let paramsStr = NetManager.Inst().convertToQueryString(params);
        url += paramsStr;

        let header = {
            Authorization: `Bearer ${token}`
        };

        NetManager.Inst().httpGet({
            url: url, headers: header, callback: (xhr: XMLHttpRequest) => {
                console.log("xhrxhr", xhr)
                if (xhr.readyState != 4 || xhr.status != 200 || !xhr.response) {
                    PublicPopupCtrl.Inst().Center("获取区服列表异常");
                    return;
                }

                const response = xhr.response
                if (response.code != 200) {
                    PublicPopupCtrl.Inst().Center("获取区服列表失败");
                    return;
                }

                const data = response.data;
                data.sort((a: any, b: any) => a.sid - b.sid);
                if (callback) {
                    callback(data);
                }
            }
        });
    }

    /** 请求初始化GM后台 */
    private GMInit() {
        let url = `${LoginParam.gmUrl}/v1/public/init?`;

        let params: any = {
            platform: LoginParam.gmInitPlatform,
            os: sys.os.toLowerCase(),
            version: GameVersion.version,
            buildTime: this.getUnixTime(),
            packageName: LoginParam.sdkInfo.packageName,
            language: LoginParam.language,
        }
        params = Object.assign({}, params, this.getCommonParams());
        let paramsStr = NetManager.Inst().convertToQueryString(params);
        url += paramsStr;

        NetManager.Inst().httpGet({
            url: url, callback: (xhr: XMLHttpRequest) => {
                if (xhr.status != 200 || !xhr.response) {
                    // 初始化GM失败
                    ViewManager.Inst().OpenView(SettingUsertServeView, {
                        type: ENUM_UserServe.SETTING, param: 39, btnName: "我知道了", closeCb: () => {
                            this.GMInit();
                        }
                    });

                    // let __env = globalThis.tt || globalThis.swan;
                    // if (__env && __env.showModal && typeof __env.showModal == 'function') {
                    //     let self = this;
                    //     __env.showModal({
                    //         title: '提示',
                    //         content: '初始化GM后台失败，请重试',
                    //         showCancel: false,
                    //         success(res: any) {
                    //             if (res.confirm) {
                    //                 self._requestGMInit();
                    //             }
                    //         }
                    //     });
                    // } else {
                    //     PublicPopupCtrl.Inst().Center("GM后台初始化失败");
                    // }
                } else {
                    //初始化GM成功
                    const response = xhr.response;
                    if (response.code != 200) {
                        PublicPopupCtrl.Inst().Center("GM后台初始化失败");
                    } else {
                        const data = response.data;
                        if (data.is_maintain) {
                            // PublicPopupCtrl.Inst().Center("GM后台正在维护中");

                        } else {
                            this._checkForceUpdate(data);
                        }
                    }
                }
            }
        });
    }

    private _checkForceUpdate(data: any) {
        if (data.is_update && sys.isNative) {
            //开启强更
            EventCtrl.Inst().emit(CommonEvent.GM_NEED_FORCE_UPDATE, data.download_url);
        } else {
            //检查是否热更（回调给最外层，用HotUpdateCtrl去检查）
            this._checkHotUpdate(data.hot_update_url);
        }
    }

    //检查是否热更（回调给最外层，用HotUpdateCtrl去检查）
    private _checkHotUpdate(hotUpdateUrl: string) {
        if (this.finishInitHandler) {
            this.finishInitHandler(hotUpdateUrl);
        }
    }

    // 获取一个6位数的随机数
    private _generateRandomNumber(): number {
        const min = 100000;
        const max = 999999;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }

}

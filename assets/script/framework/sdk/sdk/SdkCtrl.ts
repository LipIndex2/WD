/*
 * @Description: sdk管理器
 * @Date: 2021-02-19 20:20:50
 */

import { sys } from "cc";
import { native } from 'cc';
import { CXSDKHelper } from "./CXSDKHelper";

/** 
 * 分享数据结构
 */
export type SHARED_INFO = {
    title: string,
    imgUrl: string,
    imgId: string,
    queryKey?: string,
}

export interface SdkReportInfo {
    serverId: string,
    serverName: string,
    roleId: string,
    roleName: string,
    roleLevel: number,
}

/** SDK管理类 */
export class SdkCtrl {
    private static _instance: SdkCtrl;
    public static get Ins() {
        if (this._instance) {
            return this._instance;
        }

        this._instance = new SdkCtrl();
        return this._instance;
    }

    // private _phoneInfo: { [key: string]: string } = {
    //     model: "unknown",
    //     os: "unknown",
    //     netType: "wifi",
    // };
    // get phoneInfo() {
    //     return this._phoneInfo;
    // }

    // setPhoneInfo(key: string, val: string) {
    //     this._phoneInfo[key] = val;
    // }

    // loadPhoneInfo() {
    //     globalThis.sdkHelper.loadPhoneInfo((ret: { [key: string]: string }) => {
    //         for (let key in ret) {
    //             let val = ret[key];
    //             this.setPhoneInfo(key, val);
    //         }
    //     });

    //     this.getNetType();
    // }

    // getNetType() {
    //     globalThis.sdkHelper.getNetType((ret?: string) => {
    //         if (ret) {
    //             this.phoneInfo.netType = ret;
    //         }
    //     });
    // }

    getPlayerInfo() {
        // let playerModel = ModelCtrl.Ins.getModel<PlayerModel>('PlayerModel');
        // let simpleUser = playerModel.SimpleUser;
        let params: any = {
            // serverId: simpleUser.HomeServerID.toString(),
            // serverName: simpleUser.ServerName,
            // roleId: simpleUser.UserID.toString(),
            // roleName: ToolHelper.GetUserName(simpleUser),
            // roleLevel: simpleUser.SLevel,
            // vipLevel: playerModel.VipLevel,
        }
        return params;
    }

    /**
     * 初始化sdk
     * @param {any} params
     * @param {Function} cb
     */
    initSdk(params: any, cb: Function) {
        if (sys.os == sys.OS.ANDROID) {
            native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "initSdk", "()v", params)
        }
        else {

        }
    }

    /**
     * 登录sdk
     * @param {Function} cb
     */
    loginSdk(cb: Function) {
        CXSDKHelper.Ins.loginSdk(cb);
    }

    setSdkUid(account: String) {
        CXSDKHelper.Ins.setSdkUid(account);
    }

    /**
     * sdk支付
     * @param orderId 订单号
     * @param productId 商品ID
     * @param goodsName 商品名称
     * @param price 商品价格（单位：分）
     * @param extParamJson 透传参数
     * @param quantity 商品数量 
     */
    pay(orderId: string, productId: string, goodsName: string, price: number, extParamJson: string, quantity: number = 1) {
        let params = {
            order_id: orderId,
            goods_id: productId,
            goods_name: goodsName,
            quantity: quantity,
            amount: price,
            pay_ext: extParamJson,
        };
        CXSDKHelper.Ins.pay(params);

        // if (sys.os == sys.OS.ANDROID ) {
        //     native.reflection.callStaticMethod("com/cocos/game/CXSDKHelper", "pay", "()V", params)
        // }
        // else {
        //     globalThis.sdkHelper.pay(params, (ret: any) => {
        //         let iapModel = ModelCtrl.Ins.getModel<IapModel>('IapModel');
        //         iapModel.isPaying = false;
        //         // cb && cb();
        //     });
        // }
    }

    /**
    * 登出sdk
    */
    logoutSdk() {
        CXSDKHelper.Ins.logoutServer();
    }

    // 打开用户中心
    showUserCenter() {
        CXSDKHelper.Ins.showUserCenter();
    }

    // 初始化服务器
    initServer() {
        let playerInfo: SdkReportInfo = this.getPlayerInfo();
        CXSDKHelper.Ins.initServer(playerInfo.roleId, playerInfo.roleName, playerInfo.roleLevel, playerInfo.serverId, playerInfo.serverName);
    }

    // 创角上报
    createRole() {
        let playerInfo: SdkReportInfo = this.getPlayerInfo();
        CXSDKHelper.Ins.createRole(playerInfo.roleId, playerInfo.roleName, playerInfo.serverId, playerInfo.serverName);
    }

    // 角色升级上报
    upgradeRole() {
        let playerInfo: SdkReportInfo = this.getPlayerInfo();
        CXSDKHelper.Ins.upgradeRole(playerInfo.roleLevel);
    }

    // 关卡上报
    gateReport(gateId: string, gateName: string) {
        CXSDKHelper.Ins.gateReport(gateId, gateName);
    }

    // VIP升级上报
    upRoleVipLevel(OldVipLevel: number, vipLevel: number) {
        CXSDKHelper.Ins.upRoleVipLevel(OldVipLevel, vipLevel);
    }

    // /**
    //  * 数据上报
    //  * @param {REPORT_DATA_TAG} tag
    //  * @param {any} params
    //  */
    // submitData(tag: REPORT_DATA_TAG, params?: any) {
    //     if (sys.os == sys.OS.ANDROID) {
    //         switch (tag) {
    //             case REPORT_DATA_TAG.CREATE_ROLE_TAG:
    //                 CXSDKHelper.Ins.createRole(params);
    //                 break;

    //             default:
    //                 break;
    //         }
    //     }
    //     else {
    //         globalThis.sdkHelper.submit(tag, params);
    //     }
    // }


    // /**
    //  * 分享
    //  * @param {SHARED_INFO} info
    //  * @param {Function} cb
    //  */
    // sharedApp(info: SHARED_INFO, cb: Function) {
    //     globalThis.sdkHelper.sharedApp(info, cb);
    // }

    /**获取设备Id */
    getDevId() {
        return "";
    }

    //------------------------------开放域相关------------------------------
    // /**
    //  * 向开放数据域发送消息
    //  * @param {any} data
    //  */
    // sendMsgToOpen(data: object) {
    //     globalThis.sdkHelper.sendMsgToOpen(data);
    // }

    // /**
    //  * 向开发数据域设置数据
    //  * @param {string} key
    //  * @param {any} data
    //  */
    // setOpenData(key: string, data: object) {
    //     globalThis.sdkHelper.setOpenData(key, data);
    // }
}
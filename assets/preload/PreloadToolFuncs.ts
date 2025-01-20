import { VERSION, sys } from "cc";
import { Report2Type } from "../script/proload/ReportManager";
import { PackageData, url_parm } from "./PkgData";
export declare class wx_log_mangaer {
    debug: Function;
    info: Function;
    warn: Function;
    error: Function;
}
export declare class wexin {
    /**
     * 震动
     * @param p type ： 类型
     */
    vibrateShort(p: { type: "heavy" | "medium" | "light" }): void;
    /**
     * 分享
     * @param p menus : 'shareAppMessage','shareTimeline'
     */
    showShareMenu(p: { withShareTicket: boolean, menus: string[] }): void;

    /**
     * 重启小游戏
     */
    restartMiniProgram(): void

    getSystemInfoSync(): { system: string, model: string, safeArea: { left: number, right: number, top: number, bottom: number, width: number, height: number } }

    setPreferredFramesPerSecond(frame: number): void

    onShow(p: (result: {
        /** 查询参数 */
        query: {}
        /** 当场景为由从另一个小程序或公众号或App打开时，返回此字段 */
        referrerInfo: {
            /** 来源小程序或公众号或App的 appId */
            appId: string
            /** 来源小程序传过来的数据，scene=1037或1038时支持 */
            extraData: {}
        }
        /** 场景值 */
        scene: number
        /** 从微信群聊/单聊打开小程序时，chatType 表示具体微信群聊/单聊类型
         *
         * 可选值：
         * - 1: 微信联系人单聊;
         * - 2: 企业微信联系人单聊;
         * - 3: 普通微信群聊;
         * - 4: 企业微信互通群聊; */
        chatType?: 1 | 2 | 3 | 4
        /** shareTicket */
        shareTicket?: string
    }) => void): void
    onHide(p: () => void): void
    offShow(p: () => void): void
    offHide(p: () => void): void
    onAudioInterruptionEnd(p: () => void): void
    getRealtimeLogManager: new () => wx_log_mangaer;
    triggerGC(): void;
    createGameClubButton(p: {
        type: string | "text" | "image",
        icon?: 'green',
        image?: string,
        text?: string,
        style: {
            left: number,
            top: number,
            width: number,
            height: number,
            backgroundColor?: string,
            color?: string
        },
        openlink?: string
    }): { show: Function, destroy: Function, hide: Function, onTap: Function };

    /**type取值	说明	subKey	GameClubDataByType.value
    1	加入该游戏圈时间	无需传入	秒级Unix时间戳
    3	用户禁言状态	无需传入	0：正常 1：禁言
    4	当天(自然日)点赞贴子数	无需传入	
    5	当天(自然日)评论贴子数	无需传入	
    6	当天(自然日)发表贴子数	无需传入	
    7	当天(自然日)发表视频贴子数	无需传入	
    8	当天(自然日)赞官方贴子数	无需传入	
    9	当天(自然日)评论官方贴子数	无需传入	
    10	当天(自然日)发表到本圈子话题的贴子数	传入话题id，从mp-游戏圈话题管理处获取	
    */
    getGameClubData: (p: {
        dataTypeList: { type: (1 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) }[], success: (res: {
            encryptedData: string
            errMsg: string
            iv: string
            signature: string
        }) => void
    }) => void;
    /**获取用户当前的授权状态 */
    getSetting: (p: {
        success: (res: {
            authSetting: {
                /**用户信息 */
                "scope.userInfo": boolean,
                /**地理位置 */
                "scope.userLocation": boolean,
                /**微信运动步数 */
                "scope.werun": boolean,
                /**保存到相册 */
                "scope.writePhotosAlbum": boolean,
                /**微信朋友信息 */
                "scope.WxFriendInteraction": boolean,
                /**游戏圈 */
                "scope.gameClubData": boolean
            }
        }) => void
    }) => void;
    /**提前向用户发起授权请求 */
    authorize: (p: {
        scope: ENUM_WX_AUTHSETTING, success: () => void,
        fail: () => void
    }) => void;
    openSetting(p: {
        success: (res: {
            authSetting: {
                /**用户信息 */
                "scope.userInfo": boolean,
                /**地理位置 */
                "scope.userLocation": boolean,
                /**微信运动步数 */
                "scope.werun": boolean,
                /**保存到相册 */
                "scope.writePhotosAlbum": boolean,
                /**微信朋友信息 */
                "scope.WxFriendInteraction": boolean,
                /**游戏圈 */
                "scope.gameClubData": boolean
            }
        }) => void, fail: (e: any) => void
    }): void;
}
export enum ENUM_WX_AUTHSETTING {
    /**用户信息 */
    userInfo = "scope.userInfo",
    /**地理位置 */
    userLocation = "scope.userLocation",
    /**微信运动步数 */
    werun = "scope.werun",
    /**保存到相册 */
    writePhotosAlbum = "scope.writePhotosAlbum",
    /**微信朋友信息 */
    WxFriendInteraction = "scope.WxFriendInteraction",
    /**游戏圈 */
    gameClubData = "scope.gameClubData"
}
// export declare class douyin {
//     /**
//      * 震动
//      * @param p type ： 类型
//      */
//     vibrateShort(p: { type: "heavy" | "medium" | "light" }): void;
//     /**
//      * 分享
//      * @param p menus : 'shareAppMessage','shareTimeline'
//      */
//     showShareMenu(p: { withShareTicket: boolean, menus: string[] }): void;

//     /**
//      * 重启小游戏
//      */
//     restartMiniProgram(): void

//     getSystemInfoSync(): { system: string, model: string, safeArea: { left: number, right: number, top: number, bottom: number, width: number, height: number } }

//     setPreferredFramesPerSecond(frame: number): void

//     onShow(p: (result: {
//         /** 查询参数 */
//         query: {}
//         /** 当场景为由从另一个小程序或公众号或App打开时，返回此字段 */
//         referrerInfo: {
//             /** 来源小程序或公众号或App的 appId */
//             appId: string
//             /** 来源小程序传过来的数据，scene=1037或1038时支持 */
//             extraData: {}
//         }
//         /** 场景值 */
//         scene: number
//         /** 从微信群聊/单聊打开小程序时，chatType 表示具体微信群聊/单聊类型
//          *
//          * 可选值：
//          * - 1: 微信联系人单聊;
//          * - 2: 企业微信联系人单聊;
//          * - 3: 普通微信群聊;
//          * - 4: 企业微信互通群聊; */
//         chatType?: 1 | 2 | 3 | 4
//         /** shareTicket */
//         shareTicket?: string
//     }) => void): void
//     onHide(p: () => void): void
//     offShow(p: () => void): void
//     offHide(p: () => void): void
//     onAudioInterruptionEnd(p: () => void): void
//     getRealtimeLogManager: new () => wx_log_mangaer;

//     triggerGC(): void;
// }


export class PreloadToolFuncs {

    public static get wx(): wexin {
        if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            return (window as any)['tt']
        }
        return (window as any)['wx'] as wexin
    }

    static Utf8Encode(string: any) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    static md5Encode(string: string) {

        function RotateLeft(lValue: any, iShiftBits: any) {
            return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
        }

        function AddUnsigned(lX: any, lY: any) {
            var lX4, lY4, lX8, lY8, lResult;
            lX8 = (lX & 0x80000000);
            lY8 = (lY & 0x80000000);
            lX4 = (lX & 0x40000000);
            lY4 = (lY & 0x40000000);
            lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
            if (lX4 & lY4) {
                return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
            }
            if (lX4 | lY4) {
                if (lResult & 0x40000000) {
                    return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                } else {
                    return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                }
            } else {
                return (lResult ^ lX8 ^ lY8);
            }
        }

        function F(x: any, y: any, z: any) { return (x & y) | ((~x) & z); }
        function G(x: any, y: any, z: any) { return (x & z) | (y & (~z)); }
        function H(x: any, y: any, z: any) { return (x ^ y ^ z); }
        function I(x: any, y: any, z: any) { return (y ^ (x | (~z))); }

        function FF(a: any, b: any, c: any, d: any, x: any, s: any, ac: any) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function GG(a: any, b: any, c: any, d: any, x: any, s: any, ac: any) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function HH(a: any, b: any, c: any, d: any, x: any, s: any, ac: any) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };

        function II(a: any, b: any, c: any, d: any, x: any, s: any, ac: any) {
            a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
            return AddUnsigned(RotateLeft(a, s), b);
        };



        function ConvertToWordArray(string: any) {
            var lWordCount;
            var lMessageLength = string.length;
            var lNumberOfWords_temp1 = lMessageLength + 8;
            var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
            var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
            var lWordArray = Array(lNumberOfWords - 1);
            var lBytePosition = 0;
            var lByteCount = 0;
            while (lByteCount < lMessageLength) {
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                lByteCount++;
            }
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
            lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
            lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
            return lWordArray;
        };

        function WordToHex(lValue: any) {
            var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
            for (lCount = 0; lCount <= 3; lCount++) {
                lByte = (lValue >>> (lCount * 8)) & 255;
                WordToHexValue_temp = "0" + lByte.toString(16);
                WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
            }
            return WordToHexValue;
        };

        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
        var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
        var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
        var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

        string = PreloadToolFuncs.Utf8Encode(string);

        x = ConvertToWordArray(string);

        a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

        for (k = 0; k < x.length; k += 16) {
            AA = a; BB = b; CC = c; DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }

        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

        return temp.toLowerCase();
    }

    static _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    /**
     * 加密
     */
    public static Base64Encode(input: string) {
        if (input) {
            var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
            input = PreloadToolFuncs.Utf8Encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        }
    }


    static HttpGetJson(url: string, callback?: (statusCode: number, resp: url_parm | null, respText: string) => any): XMLHttpRequest {
        let xhr = new XMLHttpRequest();
        let t_url;
        // if (sys.platform == sys.Platform.WECHAT_GAME || NATIVE) {
        t_url = url;
        // } else {
        //     t_url = new URL(url);
        // }
        xhr.timeout = 2000;
        xhr.open("GET", t_url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let resp = null;
                try {
                    if (xhr.responseText != "") {
                        resp = JSON.parse(xhr.responseText);
                    }
                }
                catch (e) {
                }
                callback && callback(xhr.status, resp, xhr.responseText);
            }
        };
        xhr.onerror = function (err) {
            callback && callback(-1, null, "Network error");
        };
        xhr.send();
        return xhr;
    }

    /**
     * 大数据上报  自动设置参数只需填Report2Type里的 p_
     * @param params ID  设备型号：model
     */
    static reportGameStart2() {
        //{/**事件ID */ ID: string,/**设备 */ model?: string, /**系统 */ system?: string }
        let pkgData = PackageData.Inst().getQueryData();
        let url_rep2 = pkgData.param_list.report_url2;

        if (url_rep2 && url_rep2 != "") {
            let system = "";
            let model = ""; // let queData = PackageData.Inst().getQueryData();

            if (sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
                let wx = PreloadToolFuncs.wx;

                if (wx) {
                    let sysinfo = wx.getSystemInfoSync();
                    system = sysinfo.system;
                    model = sysinfo.model;
                }
            } else {
                system = sys.os;
                model = sys.platform;
            }

            let params = [
                //12 客户端事件ID 操作系统 设备型号 设备ID 引擎版本 资源版本
                "12", "100", system, model, PackageData.Inst().getDevice(), VERSION, PackageData.Inst().getQueryData().version_info.assets_info.resources
            ];
            let str = "";
            params.forEach(element => {
                if (element === Report2Type.p_model) {
                    element = model;
                } else if (element === Report2Type.p_system) {
                    element = system;
                }
                if (str != "") {
                    str += "\t";
                }
                str += element;
            });
            let url = url_rep2 + "?data=" + PreloadToolFuncs.Base64Encode(str);
            PreloadToolFuncs.HttpGetJson(url);
        }
    }
}

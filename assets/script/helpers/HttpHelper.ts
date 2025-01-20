import { sys, url } from "cc";
import { HTML5, NATIVE } from "cc/env";
import { LogError } from "core/Debugger";
import { IPoolObject, ObjectPool } from "core/ObjectPool";
import { MAP_COL } from "modules/Battle/BattleConfig";
import { PackageData } from "preload/PkgData";



export class HTTP {
    static isPool = true;
    static readonly is_url = sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME || NATIVE || HTML5;
    static GetString(url: string, callback: (statusCode: number, resp: string, respText: string) => any): XMLHttpRequest {
        let xhr = new XMLHttpRequest();
        let t_url;
        if (HTTP.is_url) {
            t_url = url;
        } else {
            t_url = new URL(url);
        }
        xhr.open("GET", t_url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let resp: string = xhr.responseText;
                callback && callback(xhr.status, resp, xhr.responseText);
            }
        };
        xhr.onerror = function (err) {
            callback && callback(-1, "", "Network error");
        };
        xhr.send();
        return xhr;
    }


    static GetJson(url: string, callback?: (statusCode: number, resp: any | null, respText: string) => any): XMLHttpRequest {
        let xhr = new XMLHttpRequest();
        let t_url;
        if (HTTP.is_url) {
            t_url = url;
        } else {
            t_url = new URL(url);
        }
        xhr.open("GET", t_url);
        if (PackageData.Inst().getIsDebug()) {
            console.log(url);
        }
        // let error_stack = new Error(">>>")
        // console.log(error_stack.stack);
        // console.error(">>>", t_url);
        xhr.onload = function () {
            if (xhr.status == 200) {
                let resp = null;
                if (xhr.responseText != "") {
                    try {
                        resp = JSON.parse(xhr.responseText);
                    } catch (e) {
                    }
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


    static PostJson(url: string, data: object | string, callback: (statusCode: number, resp: object | null, respText: string) => any, header: string = "applicationjson;charset=utf-8"): XMLHttpRequest {
        let xhr = new XMLHttpRequest();
        let t_url;
        if (HTTP.is_url) {
            t_url = url;
        } else {
            t_url = new URL(url);
        }
        xhr.open("POST", t_url);
        header && xhr.setRequestHeader("Content-Type", header);
        xhr.onload = function () {
            if (xhr.status == 200) {
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
        var text = data instanceof ArrayBuffer ? data : JSON.stringify(data);
        xhr.send(text);
        return xhr;
    }

    static PostArrayBuff(url: string, data: ArrayBuffer, callback: (statusCode: number, respText: ArrayBuffer) => any,
        header: { [key: string]: string } = { "Content-Type": "applicationjson;charset=utf-8" },
        param: string | number): XMLHttpRequest | void {
        let request = ObjectPool.Get(XhrRequerst)
        let xhr = request.xhr
        let t_url;
        if (HTTP.is_url) {
            t_url = url;
        } else {
            t_url = new URL(url);
        }
        xhr.open("POST", t_url);
        xhr.responseType = "arraybuffer"
        if (header) {
            for (const key in header) {
                const value = header[key];
                if (value || value == "")
                    xhr.setRequestHeader(key, value);
            }
        }
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState == 4) {
        //         callback && callback(xhr.status, xhr.response);
        //     }
        // };
        request.param = param;
        xhr.onerror = function () {
            console.error("onerror", request.param, xhr.response)
            if (xhr.response == undefined)
                callback && callback(-1, undefined);
            else {
                callback && callback(xhr.status, xhr.response);
            }
            request.clean();
        };

        xhr.ontimeout = function () {
            console.error("ontimeout", request.param, xhr.response)
            if (xhr.response == undefined)
                callback && callback(-2, xhr.response);
            else {
                callback && callback(xhr.status, xhr.response);
            }
            request.clean();
        };

        xhr.onload = function () {
            if (xhr.readyState == 4) {
                callback && callback(xhr.status, xhr.response);
            } else {
                callback && callback(xhr.status, null);
            }
            request.clean();
        };
        xhr.timeout = 6000;
        xhr.send(data);
        return xhr;


        // fetch(url, {
        //     method: 'POST',
        //     mode: 'cors',
        //     headers: header,
        //     body: data
        // }).then(response => {
        //     if (!response.ok) {
        //         callback && callback(response.status, null);
        //         return
        //     }
        //     return response.arrayBuffer()
        // }).then((buffer) => {
        //     buffer && callback && callback(200, buffer);
        // }).catch((e) => {
        //     console.log(e)
        // })

    }
}

class XhrRequerst implements IPoolObject {
    private _xhr = new XMLHttpRequest();
    param: string | number;
    private clean_timeOut: NodeJS.Timeout;
    public get xhr() {
        return this._xhr;
    }
    clean() {
        if (!NATIVE && HTTP.isPool) {
            if (this.clean_timeOut) {
                return
            }
            this.clean_timeOut = setTimeout(() => {
                ObjectPool.Push(this);
            }, 6000);
        }
    }

    reInit(): void {

    }
    onPoolReset(): void {
        this.param = undefined;
        this._xhr.abort();
        this._xhr.onerror = undefined;
        this._xhr.ontimeout = undefined;
        this._xhr.onabort = undefined;
        this._xhr.onload = undefined;
        this.clean_timeOut = undefined;
        this._xhr.timeout = 6000;
    }
}

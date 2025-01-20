import { BaseProtocolHelper } from "core/net/BaseProtocolHelper";
import { NetChatLoginOptions, NetConnectOptions, NetNode } from "core/net/NetNode";
import { WebSock } from "core/net/WebSock";
import { Singleton } from "core/Singleton";
import { DataManager } from "./DataManager";
import { AnyNestedObject, Type } from "protobufjs";


export class NetManager extends Singleton {
    public static readonly ISHTTP = true;
    private static _sessionId = "";
    /**HTTP请求协议会话ID */
    public static set sessionId(id: string) {
        let o_sid = NetManager._sessionId;
        NetManager._sessionId = id;
        if (o_sid == "" && o_sid != id) {
            NetManager.Inst().reSend();
        }
    }
    public hasSession() {
        return NetManager._sessionId != ""
    }
    private _netNode: NetNode = null;

    public Init() {
        let self = this;
        self._netNode = new NetNode()
        self._netNode.Init(new WebSock(), new BaseProtocolHelper())

        //self.connectServer()
    }

    public ConnectServer(host: string, port: number, callBack: (suc: boolean, opt: NetConnectOptions) => void, autoReconnect: number = 10): void {
        let self = this;
        const _host = host;
        const _port = port;
        self._netNode.Connect({ host: _host, port: _port, autoReconnect: autoReconnect }, callBack)
    }

    public DisconnectServer(): void {
        DataManager.Inst().onDestroy();
        this._netNode.CloseSocket();
    }

    public NetNodeStateClosed(): void {
        this._netNode.StateClosed()
    }

    public NetNodeStateSwitch(): void {
        this._netNode.CloseSocket();
        this._netNode.StateSwitch();
    }

    public reSend() {
        this._netNode.reSend(NetManager._sessionId);
    }

    public cleanReSend(data?: AnyNestedObject) {
        this._netNode.cleanReSend(data);
    }

    public SendProtoBuf(data: any): any {
        let self = this;
        self._netNode.Send(data, NetManager._sessionId);
    }

    // public SendProtoBufByChat(data: any): any {
    //     let self = this;
    //     self._netNode.SendHTTP2(data, NetManager._sessionId);
    // }

    public ConnectSocket(host: string, port: number, callBack: (suc: boolean, opt: NetConnectOptions) => void, autoReconnect: number = 10) {
        let self = this;
        // self._netNode.ConnectSocket({host: host, port: port, url:"http://139.155.129.88:30001", action: action, uid: uid, head:"http"}, callBack);
        self._netNode.ConnectSocket({ host: host, port: port, autoReconnect: 10 }, callBack);
    }

    public sendSocket(data: any) {
        let self = this;
        self._netNode.SendSocke2(data);
    }

    /**
     * 注册一个服务器发送到客户端的消息处理
     * @param msgId
     * @param fun
     */
    public RegisterSTCFunc(msgId: number, msgProto: any, fun: (...params: any[]) => void, sysClass: any): void {
        let self = this;
        if (msgId)
            self._netNode.RegisterSTCFunc(msgId, msgProto, fun, sysClass)
    }

    public RemoveSTCFunc(msgId: number) {
        let self = this;
        self._netNode.RemoveSTCFunc(msgId)
    }

    // public AutoReconnect() {
    //     let self = this;
    //     return self._netNode.AutoReconnect();
    // }

    public onClosed() {
        let self = this;
        return self._netNode.onClosed([]);
    }

    public test(ar: Uint8Array) {
        this._netNode.onMessageHttp(ar);
    }

    /** httpPost */
    public httpPost(url: string, data: any, callback?: Function, responseType: XMLHttpRequestResponseType = "json") {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 60000;
        xhr.responseType = responseType;

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (callback) {
                    callback(xhr);
                }
            };
        }
        xhr.ontimeout = function (e) {
            if (callback && xhr.readyState != 4) {
                callback(xhr);
            }
        };
        xhr.onerror = function (e) {
            if (callback && xhr.readyState != 4) {
                callback(xhr);
            }
        };
        xhr.onabort = function (e) {
            if (callback && xhr.readyState != 4) {
                callback(xhr);
            }
        }

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        console.log("NetManger.header:", xhr.getResponseHeader);
        console.log("NetManager.httpPost url:" + url + " data:" + data)
        xhr.send(data);
    }

    /** httpGet */
    public httpGet({ url, headers, callback }: { url: string, headers?: any, callback?: Function }) {
        let xhr = new XMLHttpRequest();
        xhr.timeout = 60000;
        xhr.responseType = "json";

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {//end状态
                console.log("http get response success:", xhr.response);
                callback(xhr);
            }
        };
        xhr.ontimeout = function (e) {
            if (xhr.readyState != 4) {
                console.log("http get response timeout:", xhr.response);
                callback(xhr);
            }
        };
        xhr.onerror = function (e) {
            if (xhr.readyState != 4) {
                console.log("http get response error:", xhr.response);
                callback(xhr);
            }
        };
        xhr.onabort = function (e) {
            if (xhr.readyState != 4) {
                console.log("http get response onabort:", xhr.response);
                callback(xhr);
            }
        }
        xhr.open("GET", url, true);

        if (headers !== undefined) {
            for (const key in headers) {
                if (Object.prototype.hasOwnProperty.call(headers, key)) {
                    const element = headers[key];
                    xhr.setRequestHeader(key, element);
                }
            }
        }

        console.log("http get rquest url:", url);
        xhr.send();
    }

    public convertToQueryString(params: any): string {
        const queryParts = [];
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const value = encodeURIComponent(params[key]);
                queryParts.push(`${key}=${value}`);
            }
        }
        return queryParts.join('&');
    }
}

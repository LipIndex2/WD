import { LogError } from "core/Debugger";
import { DataManager } from "manager/DataManager";
import { NetManager } from "manager/NetManager";
import { CommonEvent } from "modules/common/CommonEvent";
import { EventCtrl } from "modules/common/EventCtrl";
import { PackageData } from "preload/PkgData";
import { Type, AnyNestedObject } from "protobufjs";
import { HTTP } from "../../helpers/HttpHelper";
import { ISocket } from "./ISocket";
import { MsgId } from "./MsgIdRegister";
import { IProtocolHelper } from "./ProtocolHelper";
import { ConstValue } from "modules/common/ConstValue";
import { DEBUG } from "cc/env";
import { WebSock } from "./WebSock";
import { RoleCtrl } from "modules/role/RoleCtrl";
import { RoleData } from "modules/role/RoleData";


export enum NetNodeState {
    Closed,                     // 已关闭
    Connecting,                 // 连接中
    Checking,                   // 验证中
    Working,                    // 可传输数据
}

export interface NetConnectOptions {
    host?: string,              // 地址
    port?: number,              // 端口
    url?: string,               // url，与地址+端口二选一
    autoReconnect?: number,     // -1 永久重连，0不自动重连，其他正整数为自动重试次数
    head?: "https" | "http"
}

export interface NetChatLoginOptions {
    host: string, port: number, url: string, head: string, action: number, uid: number
}

export type NetChatMsgOptions = {
    msg: string,
    name: string,
    head: number,
    headFrame: number,
    isMe: boolean,
}

interface CallbackObject {
    callback: Function,
    msgProto: any,
    target: any,
}

export class NetNode {
    protected _connectOptions: NetConnectOptions = null;
    protected _connectOptions2: NetConnectOptions = null;
    protected _autoReconnect: number = 0;
    protected _isSocketInit: boolean = false;                               // Socket是否初始化过
    protected _isSocketOpen: boolean = false;                               // Socket是否连接成功过
    protected _state: NetNodeState = NetNodeState.Closed;                   // 节点当前状态
    protected _isSwitch = false;
    protected _socket: WebSock = null;                                      // Socket对象（websocket)

    protected _protocolHelper: IProtocolHelper = null;                      // 包解析对象
    protected _connectedCallback: (suc: boolean, opt: NetConnectOptions) => void = null;                         // 连接完成回调
    // protected _disconnectCallback: Function = null;                         // 断线回调

    protected _keepAliveTimer: any = null;                                  // 心跳定时器
    // protected _receiveMsgTimer: any = null;                                 // 接收数据定时器
    protected _reconnectTimer: any = null;                                  // 重连定时器
    protected _heartTime: number = 10000;                                   // 心跳间隔
    // protected _receiveTime: number = 6000000;                               // 多久没收到数据断开
    protected _reconnetTimeOut: number = 2000;                              // 重连间隔
    protected _listener: { [key: number]: CallbackObject[] } = {}           // 监听者列表
    protected _requestList: { [key: number]: Type } = {}                    // 待响应列表

    public Send: (data: Type, sessionId?: string) => boolean
    /********************** 网络相关处理 *********************/
    public Init(socket: WebSock, protocol: IProtocolHelper) {
        console.log(`NetNode init socket`);
        let self = this;
        self._protocolHelper = protocol;
        if (NetManager.ISHTTP) {
            this.Send = this.SendHTTP.bind(self)
        } else {
            
            this.Send = this.SendSocke.bind(self)
        }

        self._socket = socket;
            self.initSocket();
    }

    public Connect(options: NetConnectOptions, callBack?: (suc: boolean, opt: NetConnectOptions) => void): boolean {
        let self = this;
        self._connectedCallback = callBack;
        if (NetManager.ISHTTP) {
            self._connectOptions = options;
            let host = self._connectOptions.host;
            if (host.match("wss://")) {
                host = host.replace("wss://", "");
                self._connectOptions.head = "https";
            } else {
                host = host.replace("ws://", "");
                self._connectOptions.head = "http";
            }
            self._connectOptions.host = host;
            let port: number | string = self._connectOptions.port;
            if (port) {
                port = ":" + port;
            }
            self._connectOptions.url = `${self._connectOptions.head}://${self._connectOptions.host}${port}`
            callBack(true, options);
        } else {
            if (self._socket && (self._state == NetNodeState.Closed || self._isSwitch)) {
                if (!self._isSocketInit) {
                    self.initSocket();
                }
                self._state = NetNodeState.Connecting;
                if (!self._socket.connect(options)) {
                    return false;
                }
                self._connectOptions2 = options;
                if (!self._connectOptions2.autoReconnect) {
                    self._connectOptions2.autoReconnect = 0;
                }
                this.resetReconnectCount();
                return true;
            }
        }
        return false;
    }

    public ConnectSocket(options: NetConnectOptions, callBack?: (suc: boolean, opt: NetConnectOptions) => void): boolean {
        let self = this;
        self._connectedCallback = callBack;
        if (self._socket && (self._state == NetNodeState.Closed || self._isSwitch)) {
            if (!self._isSocketInit) {
                self.initSocket();
            }
            self._state = NetNodeState.Connecting;
            if (!self._socket.connect(options)) {
                return false;
            }
            self._connectOptions2 = options;
            if (!self._connectOptions2.autoReconnect) {
                self._connectOptions2.autoReconnect = 0;
            }
            this.resetReconnectCount();
            return true;
        }
        return false;
    }

    protected initSocket() {
        let self = this;
        self._socket.onConnected = (event) => { self.onConnected(event) };
        self._socket.onMessage = (msg) => { self.onMessage(msg) };
        self._socket.onError = (event) => { self.onError(event) };
        self._socket.onClosed = (event) => { self.onClosed(event) };
        self._isSocketInit = true;
    }

    // 网络连接成功
    protected onConnected(event: Event) {
        let self = this;
        console.log("NetNode onConnected!")
        self._isSocketOpen = true;
        this.resetReconnectCount();
        if (self._isSwitch) {
            DataManager.Inst().onSwitch();
            EventCtrl.Inst().emit(CommonEvent.NET_SWITCH)
            self._isSwitch = false
        }
        self.onChecked();
        if (self._connectedCallback !== null) {
            self._connectedCallback(true, this._connectOptions2);
        }
        this.resetHearbeatTimer();
    }

    // 连接验证成功，进入工作状态
    protected onChecked() {
        console.log("NetNode onChecked!")
        let self = this;
        self._state = NetNodeState.Working;
        // 关闭连接或重连中的状态显示
        clearInterval(self._reconnectTimer);
    }

    // 接收到一个完整的消息包
    protected onMessage(msg: any): void {
        let self = this;
        let jData = JSON.parse(msg);
        const payload = jData.Message.payload;

        EventCtrl.Inst().emit(CommonEvent.CHAT_MSG, {name:payload.name,head: payload.head,headFrame: payload.headFrame, msg:payload.msg, isMe:jData.Message.uid === RoleData.Inst().InfoRoleId});
        // let reader = this._protocolHelper.getPackReader(msg);
        // // 进行头部的校验（实际包长与头部长度是否匹配）    
        // if (!this._protocolHelper.checkPackage(reader)) {
        //     console.error(`NetNode checkHead Error`);
        //     return;
        // }
        // // 接受到数据，重新定时收数据计时器
        // // this.resetReceiveMsgTimer();
        // // // 重置心跳包发送器
        // // this.resetHearbeatTimer();
        // // 触发消息执行
        // self.processRecvPacket(reader)
    }

    public onMessageHttp(msg: ArrayBuffer, msgID?: number) {
        let self = this;
        let reader = this._protocolHelper.getPackReader(msg);
        let end = 0;
        let recHttp: { [key: number]: number } = {};
        let data: Type;
        if (msgID) {
            data = self._requestList[msgID];
            if (data)
                delete self._requestList[msgID];
        }
        do {
            if (reader.pos >= reader.buf.length) {
                LogError("解析单条协议结束", "pos:" + reader.pos + " len:" + reader.len)
                end = 0;
            } else {
                end = this._protocolHelper.getHeadlen(reader, null);
                let msgId = self.processRecvPacketHttp(reader, end);
                recHttp[msgId] = 1;
            }
        } while (end);
        let showReConnect = false;
        if (msgID) {
            if (data) {
                let careData = MsgId.GetMsgCare(data);
                if (careData) {
                    let careMsgId
                    if (careData.care) {
                        careMsgId = MsgId.GetMsgId(careData.care);
                    }
                    if (careMsgId) {
                        if (recHttp[careMsgId]) {
                            delete self._requestList[msgID];
                        } else {
                            if (careData.func) {
                                careData.func();
                            } else
                                showReConnect = true;
                        }
                    }
                }
            }
            if (showReConnect) {
                EventCtrl.Inst().emit(CommonEvent.NET_HTTP_TIMEOUT)
            }
        }
    }

    /** 派发协议 */
    protected processRecvPacketHttp(read: protobuf.Reader, end: number): number {
        let self = this;
        let msgId = self._protocolHelper.getPackageId(read, null);//协议号
        self.dispatchHttp(msgId, read, end - 4);
        return msgId;
    }

    /** 派发协议 */
    private dispatchHttp(msgId: number, data: protobuf.Reader, end: number): void {
        let self = this;
        if (!self._listener[msgId]) {
            LogError("未添加监听协议id: ", msgId);
            data.pos += end;
            return;
        }
        let arr: any[] = self._listener[msgId];
        const protoData = self._protocolHelper.getPackageData(data, arr[1], end, null);
        LogError("recHTTP", msgId, protoData)
        arr[0].call(arr[2], protoData);
    }

    private _ht_onHttpTimeOut: NodeJS.Timeout
    private _failTimes = 0;
    // 发起请求，如果当前处于重连中，进入缓存列表等待重连完成后发送
    public SendHTTP(data: Type, sessionId: string): boolean {
        let self = this;
        if (!self._connectOptions) {
            console.error(`NetNode ERROR:SendHTTP before connectOpt init!!`)
            return;
        }
        let msgID = MsgId.GetMsgId(data.constructor);
        if (!sessionId && msgID != 7056) {
            self._requestList[msgID] = data;
            return
        }
        let buf = self._protocolHelper.handlePackageData(data);
        LogError("SendHTTP:", msgID, data);
        if (self._requestList[msgID]) {
            self._requestList[msgID] = data;
            // LogError("重复请求 msgID:" + msgID, data);
            // return;
        }
        self._requestList[msgID] = data;
        let str_msg = PackageData.Inst().getIsDebug() ? `/?msg=${msgID}` : "";
        // if(PackageData.Inst().getIsDebug()){
        //     self._connectOptions.url= "https://11929203118-h03.bluegames.cn:21052"
        // }
        HTTP.PostArrayBuff(`${self._connectOptions.url}${str_msg}`, buf.buffer, (state, on_data) => {
            if (state == 200) {
                this._failTimes = 0;
                if (this._ht_onHttpTimeOut) {
                    clearTimeout(this._ht_onHttpTimeOut);
                    this._ht_onHttpTimeOut = undefined;
                }
                if (on_data)
                    this.onMessageHttp(on_data, msgID);
                else {
                    LogError("空协议 msgID:" + msgID,DEBUG? data:"");
                    if (msgID) {
                        delete self._requestList[msgID];
                        let msg_poto = data;
                        if (msg_poto) {
                            let careData = MsgId.GetMsgCare(msg_poto);
                            if (careData) {
                                console.error("careData空协议", DEBUG ? msg_poto : msgID);
                                if (careData.func) {
                                    careData.func();
                                }
                            }
                        }
                    }
                }
            } else {
                if (this._ht_onHttpTimeOut) {
                    clearTimeout(this._ht_onHttpTimeOut);
                    this._ht_onHttpTimeOut = undefined;
                }
                this._failTimes += 1;
                if (this._failTimes >= ConstValue.FGUIBaseUserValue.failTimes) {
                    this._failTimes = 0;
                    this._ht_onHttpTimeOut = setTimeout(() => {
                        EventCtrl.Inst().emit(CommonEvent.NET_HTTP_TIMEOUT)
                    }, 4000);
                    // ViewManager.Inst().OpenView(BreakLineView)
                }
                console.error("request error:" + state, DEBUG? data:msgID);
            }
        }, { "token": sessionId }, msgID);
        return true
    }

    public SendHTTP2(data: Type, sessionId: string): boolean {
        let self = this;
        if (!self._connectOptions2) {
            console.error(`NetNode ERROR:SendHTTP before connectOpt init!!`)
            return;
        }
        let msgID = MsgId.GetMsgId(data.constructor);
        if (!sessionId && msgID != 7056) {
            self._requestList[msgID] = data;
            return
        }
        let buf = self._protocolHelper.handlePackageData(data);
        LogError("SendHTTP:", msgID, data);
        if (self._requestList[msgID]) {
            self._requestList[msgID] = data;
            // LogError("重复请求 msgID:" + msgID, data);
            // return;
        }
        self._requestList[msgID] = data;
        let str_msg = PackageData.Inst().getIsDebug() ? `/?msg=${msgID}` : "";
        // if(PackageData.Inst().getIsDebug()){
        //     self._connectOptions.url= "https://11929203118-h03.bluegames.cn:21052"
        // }
        HTTP.PostJson(`${self._connectOptions2.url}`, data, (state, on_data) => {
            if (state == 200) {
                // this._failTimes = 0;
                // if (this._ht_onHttpTimeOut) {
                //     clearTimeout(this._ht_onHttpTimeOut);
                //     this._ht_onHttpTimeOut = undefined;
                // }
                // if (on_data)
                //     this.onMessageHttp(on_data, msgID);
                // else {
                //     LogError("空协议 msgID:" + msgID,DEBUG? data:"");
                //     if (msgID) {
                //         delete self._requestList[msgID];
                //         let msg_poto = data;
                //         if (msg_poto) {
                //             let careData = MsgId.GetMsgCare(msg_poto);
                //             if (careData) {
                //                 console.error("careData空协议", DEBUG ? msg_poto : msgID);
                //                 if (careData.func) {
                //                     careData.func();
                //                 }
                //             }
                //         }
                //     }
                // }
            } else {
                if (this._ht_onHttpTimeOut) {
                    clearTimeout(this._ht_onHttpTimeOut);
                    this._ht_onHttpTimeOut = undefined;
                }
                this._failTimes += 1;
                if (this._failTimes >= ConstValue.FGUIBaseUserValue.failTimes) {
                    this._failTimes = 0;
                    this._ht_onHttpTimeOut = setTimeout(() => {
                        EventCtrl.Inst().emit(CommonEvent.NET_HTTP_TIMEOUT)
                    }, 4000);
                    // ViewManager.Inst().OpenView(BreakLineView)
                }
                console.error("request error:" + state, DEBUG? data:msgID);
            }
        });
        return true
    }

    reSend(sessionId: string) {
        let self = this;
        for (const msgID in self._requestList) {
            const data = self._requestList[msgID];
            if (data) {
                delete self._requestList[msgID];
                self.SendHTTP(data, sessionId);
            }
        }
    }

    cleanReSend(data?: AnyNestedObject) {
        let self = this;
        if (data) {
            let msgID = MsgId.GetMsgId(data.constructor);
            delete self._requestList[msgID];
        } else
            for (const msgID in self._requestList) {
                delete self._requestList[msgID];
            }
    }

    // 发起请求，如果当前处于重连中，进入缓存列表等待重连完成后发送
    public SendSocke(data: any): boolean {
        let self = this;
        if (self._state == NetNodeState.Working) {
            let buf = self._protocolHelper.handlePackageData(data);
            return self._socket.send(buf);
        } else if (self._state == NetNodeState.Checking ||
            self._state == NetNodeState.Connecting) {
            console.log("NetNode socket is busy, push to send buffer, current state is " + self._state);
            return true;
        } else {
            console.error("NetNode request error! current state is " + self._state);
            return false;
        }
    }

    public SendSocke2(data: any): boolean {
        let self = this;
        if (self._state == NetNodeState.Working) {
            return self._socket.send2(data);
        } else if (self._state == NetNodeState.Checking ||
            self._state == NetNodeState.Connecting) {
            console.log("NetNode socket is busy, push to send buffer, current state is " + self._state);
            return true;
        } else {
            console.error("NetNode request error! current state is " + self._state);
            return false;
        }
    }

    public RegisterSTCFunc(msgId: number, msgProto: any, fun: (...params: any[]) => void, target: any) {
        let self = this;
        if (!self._listener[msgId]) {
            self._listener[msgId] = [fun, msgProto, target];
        } else {
            console.error(`重复注册协议接口${msgId}:${msgProto.name}`);
            return;
        }
    }

    public RemoveSTCFunc(msgId: number) {
        let self = this;
        if (self._listener[msgId]) {
            self._listener[msgId][0] = null;
            self._listener[msgId][1] = null;
            self._listener[msgId][2] = null;
            self._listener[msgId] = null;
        }
        delete self._listener[msgId];
    }

    /** 派发协议 */
    protected processRecvPacket(read: protobuf.Reader): void {
        let self = this;
        let msgId = self._protocolHelper.getPackageId(read);//协议号
        //console.error(`RecvSocketMsg===${msgId}`);
        self.dispatch(msgId, read);
    }

    /** 派发协议 */
    private dispatch(msgId: number, data: protobuf.Reader): void {
        let self = this;
        if (!self._listener[msgId]) {
            LogError(`未添加监听协议id: ${msgId}`);
            return;
        }
        let arr: any[] = self._listener[msgId];
        const protoData = self._protocolHelper.getPackageData(data, arr[1]);
        arr[0].call(arr[2], protoData);
    }

    protected onError(event: Event) {
        // console.error(`NET onERROR`,event);
        let self = this;
        self._state = NetNodeState.Closed;
        // self._isSwitch = false
        this.tryAutoReconnect();

    }

    onClosed(event: CloseEvent | any) {
        // console.error(`NET onCLOSED`,event,this._state);
        let self = this;
        this.clearTimer(false);
        let oldSt = self._state;
        self._state = NetNodeState.Closed;
        if (oldSt == NetNodeState.Working) {
            this.tryAutoReconnect();
        }
        // EventCtrl.Inst().emit(CommonEvent.NET_CLOSE);

        // 执行断线回调，返回false表示不进行重连
        // if ((self._disconnectCallback && !self._disconnectCallback()) || self._isSwitch) {
        //     console.log(`disconnect return!`)
        //     return;
        // }
    }

    /**重连 */
    private tryAutoReconnect() {
        let self = this;
        // 自动重连
        self.clearReconnectTimer();
        if (self.isAutoReconnect()) {
            EventCtrl.Inst().emit(CommonEvent.NET_RECONS);
            if (self._autoReconnect > 0) {
                self._autoReconnect -= 1;
            }
            self._reconnectTimer = setTimeout(() => {
                self._socket.connect(self._connectOptions2);
            }, self._reconnetTimeOut);
        } else {
            if (self._connectedCallback !== null) {
                self._connectedCallback(false, self._connectOptions2);
            }
        }
    }

    // public Close(code?: number, reason?: string) {
    //     let self = this;
    //     self.clearTimer();
    //     self._listener = {};
    //     if (self._networkTips) {
    //         self._networkTips.connectTips(false);
    //         self._networkTips.reconnectTips(false);
    //         self._networkTips.requestTips(false);
    //     }
    //     if (self._socket) {
    //         self._socket.close(code, reason);
    //         self._state = NetNodeState.Closed;
    //     }
    // }

    // 只是关闭Socket套接字（仍然重用缓存与当前状态）
    public CloseSocket(code?: number, reason?: string) {
        let self = this;
        if (self._socket) {
            self._state = NetNodeState.Closed;
            self._socket.close(code, reason);
        }
    }

    public StateClosed() {
        let self = this;
        self._state = NetNodeState.Closed;
    }

    public StateSwitch() {
        let self = this;
        self._isSwitch = true;
    }
    /********************** 心跳、超时相关处理 *********************/
    // protected resetReceiveMsgTimer() {
    //     let self = this;
    //     this.clearReceiveMsgTimer();
    //     self._receiveMsgTimer = setTimeout(() => {
    //         console.warn("NetNode recvieMsgTimer close socket!");
    //         self._socket.close();
    //         self._state = NetNodeState.Closed;
    //     }, self._receiveTime);
    // }

    protected resetHearbeatTimer() {
        let self = this;
        this.clearKeepAliveTimer();

        self._keepAliveTimer = setInterval(() => {
            console.log("NetNode keepAliveTimer send Hearbeat")
            let is = self.Send(self._protocolHelper.getHearbeat());
            // let isSocket = self.SendSocke2({reserve: 0});
        }, self._heartTime);
    }

    protected clearTimer(cleanRecon: boolean) {
        let self = this;
        // self.clearReceiveMsgTimer();
        self.clearKeepAliveTimer();
        if (cleanRecon) {
            self.clearReconnectTimer();
        }
    }

    // private clearReceiveMsgTimer(){
    //     if (this._receiveMsgTimer !== null) {
    //         clearTimeout(this._receiveMsgTimer);
    //         this._receiveMsgTimer = null;
    //     }
    // }
    private clearKeepAliveTimer() {
        if (this._keepAliveTimer !== null) {
            clearInterval(this._keepAliveTimer);
            this._keepAliveTimer = null;
        }
    }
    private clearReconnectTimer() {
        if (this._reconnectTimer !== null) {
            clearTimeout(this._reconnectTimer);
            this._reconnectTimer = null;
        }
    }

    private isAutoReconnect() {
        let self = this;
        return self._autoReconnect != 0;
    }

    private resetReconnectCount() {
        if (this._connectOptions) {
            this._autoReconnect = this._connectOptions.autoReconnect;
        }
    }

}
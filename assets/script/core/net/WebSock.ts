import { sys } from "cc";
import { ISocket } from "./ISocket";

export class WebSock implements ISocket {
    private _ws: WebSocket = null;              // websocket对象
    private sendFunc: Function;
    onConnected: (event: Event) => void = null;
    onMessage: (msg: any) => void = null;
    onError: (event: Event) => void = null;
    onClosed: (event: CloseEvent) => void = null;
    constructor() {
        if (sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
            this.sendFunc = this.sendWx.bind(this);
        } else {
            this.sendFunc = this.sendNormal.bind(this);
        }
    }
    connect(options: any) {
        if (this._ws) {
            this._ws.close();
            this._ws = null;
            // if (this._ws.readyState === WebSocket.CONNECTING) {
            //     console.log("websocket connecting, wait for a moment...")
            //     return false;
            // }
        }

        let url = null;
        if (options.url) {
            url = options.url;
        } else {
            let host = options.host;
            let port = options.port;
            url = host.toString().match("wss://") ? `${host}:${port}` : `ws://${host}:${port}`;
        }

        this._ws = new WebSocket(url);
        // this._ws.binaryType = options.binaryType ? options.binaryType : "arraybuffer";
        this._ws.onmessage = (event) => {
            console.log('Message on websocket:', event.data);
            this.onMessage(event.data);
        };
        this._ws.onopen = this.onConnected;
        this._ws.onerror = this.onError;
        this._ws.onclose = this.onClosed;
        return true;
    }
    send(buffer: Uint8Array): boolean {
        return this.sendFunc(buffer);
    }

    send2(data: any): boolean {
        if (this._ws.readyState == WebSocket.OPEN) {
            this._ws.send(JSON.stringify(data));
            return true;
        }
        return false;
    }

    sendNormal(buffer: Uint8Array): boolean {
        if (this._ws.readyState == WebSocket.OPEN) {
            this._ws.send(buffer);
            return true;
        }
        return false;
    }

    sendWx(buffer: Uint8Array): boolean {
        if (this._ws.readyState == WebSocket.OPEN) {
            this._ws.send(buffer.buffer);
            return true;
        }
        return false;
    }

    close(code?: number, reason?: string) {
        this._ws.close();
    }
}
import { strict } from "assert";
import { Singleton } from "core/Singleton";
import CryptoJS from "crypto-js";

export type DBD_QUERY_PARAMS = {
    [key: string | number]: any
}

export class DBDNet extends Singleton {
    generateSign(
        queryParams: DBD_QUERY_PARAMS, // 定义 queryParams 类型
        fixedKey: string,
        timestamp: number
    ): string {
        const sortedKeys = Object.keys(queryParams).sort();
        const sortedParams = sortedKeys
            .map((key) => `${key}=${queryParams[key] ? JSON.stringify(queryParams[key]) : ''}`)
            .join("&");
        const signString = `${sortedParams}&ts=${timestamp}&key=${fixedKey}`;
        const sign = CryptoJS.MD5(signString).toString();
        return sign;
    }

    getRequest(url: string, headers: any, callBack: (result: DBD_QUERY_PARAMS) => void) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        // 设置请求头
        for (const key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    callBack(data.Msg ? JSON.parse(data.Msg) : {});
                } else {
                    console.error("错误:", xhr.statusText);
                }
            }
        };

        xhr.send();
    }

    postRequest(url: string, data: DBD_QUERY_PARAMS, headers: any, callback?: () => void) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        // 设置其他请求头
        for (const key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (callback) callback();
                } else {
                    console.error("错误:", xhr.statusText);
                }
            }
        };

        xhr.send(JSON.stringify(data));
    }

    async getSignature(queryParams: DBD_QUERY_PARAMS, callBack: (result: DBD_QUERY_PARAMS) => void) {
        const fixedKey = "BnoeCfV3s40rA5PKenbzdmLA8KswhJa7";
        const timestamp = Math.floor(new Date().getTime() / 1000); // 替换为实际时间戳
        console.log("timestamp", timestamp);
        const signature = DBDNet.Inst().generateSign({ uid: queryParams.uid }, fixedKey, timestamp);
        let url = `http://139.155.129.88:8080/activity?`;

        for (let key in { uid: queryParams.uid }) {
            url += `${key}=${queryParams[key] ? JSON.stringify(queryParams[key]) : ''}&`;
        }

        this.getRequest(url, {
            sign: signature,
            timestamp: timestamp.toString(), // 确保时间戳是字符串类型
        }, callBack);
    }

    async setSignature(queryParams: DBD_QUERY_PARAMS, callback?: () => void) {
        const fixedKey = "BnoeCfV3s40rA5PKenbzdmLA8KswhJa7";
        const timestamp = Math.floor(new Date().getTime() / 1000); // 替换为实际时间戳
        console.log("timestamp", timestamp);
        const signature = DBDNet.Inst().generateSign({ uid: queryParams.uid }, fixedKey, timestamp);
        let url = `http://139.155.129.88:8080/activity?`;

        for (let key in { uid: queryParams.uid }) {
            url += `${key}=${queryParams[key] ? JSON.stringify(queryParams[key]) : ''}&`;
        }

        this.postRequest(url, queryParams, {
            sign: signature,
            timestamp: timestamp.toString(), // 确保时间戳是字符串类型
            "Content-Type": "application/json",
        }, callback);
    }

    // https://gm-api-demo.chuxinhudong.com/v1/public/init?platform=chuxin&os=android&version=1.0.3&buildTime=1711961990&packageName=xxxx&language=zh-CN
}

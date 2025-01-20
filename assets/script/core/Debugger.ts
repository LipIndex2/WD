import { DEBUG } from 'cc/env';
import { PreloadToolFuncs, wx_log_mangaer } from 'preload/PreloadToolFuncs';

export class Debugger {
    static wx_logManager: wx_log_mangaer
    static wx_log_defaut_uid = "";
    static wx_log_defaut_key = "";
    static init() {
        if (PreloadToolFuncs.wx && PreloadToolFuncs.wx.getRealtimeLogManager)
            Debugger.wx_logManager = new PreloadToolFuncs.wx.getRealtimeLogManager();
    }
    static LogError(msg: string, obj?: any) {
        if (obj != null) {
            console.error(`[${obj.constructor.name}] ERROR:${msg}`, obj);
        } else {
            console.error(msg);
        }
    }
    static ObjectToString(obj: any) {
        let keys = Object.getOwnPropertyNames(obj);
        let str = "{\n";
        for (let k of keys) {
            str = `${str}\t[${k}] = ${obj[k]}\n`
        }
        str = `${str}}`;
        return str;
    }
    static ExportForDebug(cons: Function) {
        // if (DEBUG) {
        //     (<any>globalThis)[cons.name] = cons;
        // }
    }
    static ExportGlobalForDebug(name: string, obj: any) {
        // if (DEBUG) {
        //     (<any>globalThis)[name] = obj;
        // }
    }

}

export function LogError(...objs: any[]) {
    return;
    if (DEBUG) {
        console.error(objs);
    }
}
export function Log(...objs: any) {
    return;
    if (DEBUG) {
        console.log(...objs);
    }
}

export function LogWxInfo(key: string, ...objs: any) {
    if (Debugger.wx_logManager) {
        key = Debugger.wx_log_defaut_uid + " " + Debugger.wx_log_defaut_key + " " + key;
        Debugger.wx_logManager.info(key, objs)
    }
    return;
    if (DEBUG) {
        console.log(key, ...objs);
    }
}

export function LogWxError(key: string, ...objs: any) {
    if (Debugger.wx_logManager) {
        key = Debugger.wx_log_defaut_uid + " " + Debugger.wx_log_defaut_key + " " + key;
        Debugger.wx_logManager.error(key, objs)
    }
    return;
    if (DEBUG) {
        console.error(key, ...objs);
    }
}

export function LogWxWarn(key: string, ...objs: any) {
    if (Debugger.wx_logManager) {
        key = Debugger.wx_log_defaut_uid + " " + Debugger.wx_log_defaut_key + " " + key;
        Debugger.wx_logManager.warn(key, objs)
    }
    return;
    if (DEBUG) {
        console.warn(key, ...objs);
    }
}

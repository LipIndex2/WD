import { Vec2, Vec3, sys } from "cc";
import { GTweener } from "fairygui-cc";
import { ConstValue } from "modules/common/ConstValue";
import * as fgui from "fairygui-cc";
import { DEFAULT_SCREEN_H } from "config/CfgCommon";

export function IsEmpty(value: any): boolean {
    if (value == undefined || value == null) {
        return true;
    }
    if (typeof (value) == "number" && value == 0) {
        return true;
    }
    if (typeof (value) == "string" && value == "") {
        return true;
    }
    if (typeof (value) == "object" && value.length == 0) {
        return true;
    }
    return false;
}

export class UtilHelper {
    private static _localValue: { [key: string]: any } = {};

    static getLocalGameValue(key: number): string {
        let gameValue: string[] = UtilHelper.getLocalValue(ConstValue.LocalStrogeKey.Game);
        if (gameValue) {
            return gameValue[+key]
        }
        return "";
    }

    static setLocalGameValue(key: number, value: string) {
        let gameValue: string[] = UtilHelper.getLocalValue(ConstValue.LocalStrogeKey.Game);
        if (gameValue) {
            gameValue[key] = value;
            this.setLocalValue(ConstValue.LocalStrogeKey.Game, gameValue);
        }
    }

    static getLocalValue(key: string) {
        if (this._localValue[key]) {
            return this._localValue[key];
        } else {
            let value = localStorage.getItem(key)
            if (value) {
                let json_value = JSON.parse(value);
                this._localValue[key] = json_value;
                return json_value;
            }
            return ""
        }
    }

    static setLocalValue(key: string, value: any) {
        if (value) {
            let json_value = JSON.stringify(value)
            this._localValue[key] = value;
            localStorage.setItem(key, json_value);
        }
    }

    static copyStr(text: string) {
        if (!sys.isNative) {
            var input = document.createElement("input");
            input.value = text
            document.body.appendChild(input);
            //选中文本 执行浏览器复制命令 复制成功后移除input
            input.select();
            input.setSelectionRange(0, input.value.length);
            document.execCommand('Copy');
            document.body.removeChild(input);
            //如果不想ios上点击按钮复制的时候弹出虚拟键盘，加入input只读状态
            input.setAttribute('readOnly', 'readOnly');
        }
    }

    static ArrayRemove(arr: any[], removeObj: any) {
        if(arr == null){
            return;
        }
        let index = arr.indexOf(removeObj);
        if (index != -1) {
            arr.splice(index, 1);
        }
    }

    //杀手fgui的tweenr!!!
    static KillFGuiTweenr(tweener: GTweener) {
        if (tweener == null) {
            return;
        }
        tweener.onComplete(null);
        tweener.onUpdate(null);
        tweener.kill();
    }
    //coocs世界坐标转fgui全局坐标
    static CocosWorldPosToFgui(worldPos: Vec3): Vec2 {
        return new Vec2(worldPos.x, DEFAULT_SCREEN_H - worldPos.y)
    }

    static ForeachArray<T>(arr: T[][], func: (v: T, row: number, col: number) => void | boolean) {
        if (arr == null || arr.length == 0) {
            return;
        }
        for (let j = 0; j < arr.length; j++) {
            if (arr[j] == null || arr[j].length == 0) {
                continue;
            }
            let row = arr[j].length;
            for (let i = 0; i < row; i++) {
                let hero = arr[j][i]
                if (func(hero, i, j) == true) {
                    return;
                }
            }
        }
    }
}
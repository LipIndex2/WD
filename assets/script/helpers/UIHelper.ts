
import { Color, Node, UITransform, screen } from "cc";
import * as fgui from "fairygui-cc";
import { CommonId } from "modules/common/CommonEnum";
import { EGLoader } from "modules/extends/EGLoader";
import { CocSpriteGradient } from "../ccomponent/CocSpriteGradient";
import { TextHelper } from "./TextHelper";

// export let UH: KeyFunction = {};
export class UH {
    //设置文字
    static SetText(obj: fgui.GTextField | fgui.GRichTextField | fgui.GButton | fgui.GLabel, str: string | number, color?: Color) {
        if (obj == null || obj == undefined) { return; }
        if (str == null) { str = "" }
        if (typeof (str) == "number") { str = str.toString() }
        if (color == null) {
            if (obj.text == str) { return; }
            obj.text = str;
        }
        else {
            if (obj.node.name == "GRichTextField") {
                let new_str = TextHelper.ColorStr(str, color.toHEX("#rrggbb"))
                if (obj.text == new_str) { return; }
                obj.text = new_str;
            }
            else {
                if (obj.text != str)
                    obj.text = str;
                obj.color = color;
            }
        }
    }

    //mtype = CommonEnum中的 ICON_TYPE
    static SetIcon(obj: EGLoader | fgui.GLoader, icon_id: string | number, mtype?: number | string, fun?: Function, isClean?: boolean) {
        if (icon_id != null) {
            (obj as EGLoader).SetIcon(EGLoader.IconGeterFuncs[mtype](icon_id), fun, isClean);
        }
    }

    //动态设置fgui loader图片
    static SpriteName(obj: fgui.GLoader | fgui.GTextField | fgui.GLabel, package_name: string, name: string) {
        if ((obj as any)['_contentItem'] && (obj as any)['_contentItem'].name == name) {
            return
        }
        obj.icon = fgui.UIPackage.getItemURL(package_name, name);
    }

    //动态设置fgui loader图片
    static SpriteNameLoader(obj: fgui.GLoader | fgui.GTextField, url: string) {
        if ((obj as any)['_contentItem'] && (obj as any)['_contentItem'].name == url) {
            return
        }
        obj.icon = url;
    }

    //显示公用图集里的货币图标
    static GoldIcon(obj: fgui.GLoader | fgui.GTextField, item_id: CommonId) {
        UH.SpriteName(obj, "CommonAtlas", `Item${item_id}`)
    }

    static ActivatorPosition(obj: any, flag: boolean, x1: number, y1: number, x2: number, y2: number) {
        if (flag) {
            obj.setPosition(x1, y1);
        }
        else {
            obj.setPosition(x2, y2);
        }
    }

    static FontName(obj: fgui.GTextField, package_name: string, name: string) {
        obj.font = fgui.UIPackage.getItemURL(package_name, name);
    }

    static GetScreenAdapter() {
        let desige_width = fgui.GRoot.inst.width;
        let desige_height = fgui.GRoot.inst.height;

        let dpi = screen.devicePixelRatio;
        let size = screen.windowSize;

        let scWidth = size.width / dpi;
        let scHeight = size.height / dpi;
        let desige_sc = desige_width / desige_height;
        let screen_sc = scWidth / scHeight;
        let scale = 1.0;
        if (screen_sc > desige_sc) {
            scale = scHeight / desige_height
        } else {
            scale = scWidth / desige_width
        }
        let offsetX = (desige_width - 800) / 2 * scale;
        let offsetY = (1600 - desige_height) / 2 * scale;

        return { scale: scale, offsetX: offsetX, offsetY: offsetY }
    }

    static SetSpriteMatName(sprite: Node, name: string) {
        let cocGradient = sprite.getComponent(CocSpriteGradient);
        if (cocGradient) {
            cocGradient.setMaterialName(name);
        }
    }

    static SetSpriteMatActive(sprite: Node, active: boolean) {
        let cocGradient = sprite.getComponent(CocSpriteGradient);
        if (cocGradient) {
            cocGradient.active = active;
        }
    }

    static reSizeByParent(obj: Node, Anch?: { x: number, y: number }, pos = { x: 0, y: 0 }) {
        let tran_obj = obj.getComponent(UITransform);
        let tran_gr = fgui.GRoot.inst.node.getComponent(UITransform)
        if (Anch) {
            tran_obj.setAnchorPoint(Anch.x, Anch.y);
        }
        let adpw = tran_gr.width / 800
        let adph = tran_gr.height / 1600;
        obj.setPosition(pos.x, pos.y)
        if (adph != adpw) {
            let adp = 1 - (Math.max(adph, adpw));
            obj.setScale(1 - adp, 1 - adp);
        }
    }
}

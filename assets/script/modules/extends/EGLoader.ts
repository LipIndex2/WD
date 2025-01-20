import { SpriteFrame } from "cc";
import * as fgui from "fairygui-cc";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { KeyFunction } from "modules/common/CommonType";
import { PackageData } from "preload/PkgData";

let bundle_path = "loader/icon/";

export class EGLoader extends fgui.GLoader {
    private completeCallback: Function = null;
    private tex: SpriteFrame;
    protected freeExternal(texture: SpriteFrame): void {
        //texture.destroy();
        //console.warn("freeExternal");
    }

    protected onExternalLoadSuccess(texture: SpriteFrame): void {
        this.clean();
        this.tex = texture;
        texture.addRef();
        super.onExternalLoadSuccess(texture);
        if (this.completeCallback) {
            this.completeCallback();
        }
    }

    public SetLoadCompleteCallback(func?: Function) {
        this.completeCallback = func;
    }

    //path 资源路径
    //func 完成回调
    public SetIcon(path: string, func?: Function, isClean = false) {
        if (PackageData.Inst().g_UserInfo.changRes[path]) {
            path = PackageData.Inst().g_UserInfo.changRes[path];
        }
        this.SetLoadCompleteCallback(func);
        if (isClean && this.icon != path) {
            this.cleanSprite();
        }
        this.icon = path;
    }
    protected onDestroy(): void {
        super.onDestroy();
        this.clean();
    }
    public clean(): void {
        this.cleanSprite();
        if (this.tex) {
            let tex = this.tex;
            this.tex = null;
            tex.decRef();
            // assetManager.releaseAsset(tex);
        }
    }
    public cleanSprite() {
        if (this._content.spriteFrame) {
            this._content.spriteFrame = null;
        }
    }
    public static IconGeterFuncs: KeyFunction = {
        [ICON_TYPE.ITEM]: (icon_id: string) => {
            return bundle_path + "item/" + icon_id;
        },
        [ICON_TYPE.ACT]: (id: string) => {
            return bundle_path + "act/" + id;
        },
        [ICON_TYPE.ROLE]: (id: string) => {
            return bundle_path + "role/" + id;
        },
        [ICON_TYPE.TASK]: (id: string) => {
            return bundle_path + "task/" + id;
        },
        [ICON_TYPE.MainFB]: (id: string) => {
            return bundle_path + "main_fb/" + id;
        },
        [ICON_TYPE.SKILL]: (id: string) => {
            return bundle_path + "skill/" + id;
        },
        [ICON_TYPE.CHALLENGE_RULE]: (id: string) => {
            return bundle_path + "challenge_rule/" + id;
        },
        [ICON_TYPE.GROWPACK]: (id: string) => {
            return bundle_path + "growpack/" + id;
        },
        [ICON_TYPE.SHOPGIFT]: (id: string) => {
            return bundle_path + "shop_gift/" + id;
        },
        [ICON_TYPE.HEROEFFECT]: (id: string) => {
            return bundle_path + "hero_effect/" + id;
        },
        [ICON_TYPE.HEROSMALL]: (id: string) => {
            return bundle_path + "hero_small/" + id;
        },
        [ICON_TYPE.HERODRAWING]: (id: string) => {
            return bundle_path + "hero_drawing/" + id;
        },
        [ICON_TYPE.REMAINS]: (id: string) => {
            return bundle_path + "yiwu/" + id;
        },
        [ICON_TYPE.HEADFRAME]: (id: string) => {
            return bundle_path + "head/" + id;
        },
        [ICON_TYPE.SPICON]: (id: string) => {
            return bundle_path + "sp_icon/" + id;
        },
        [ICON_TYPE.HEROSBIG]: (id: string) => {
            return bundle_path + "hero_big/" + id;
        },
        [ICON_TYPE.HEROSMAIN]: (id: string) => {
            return bundle_path + "hero_main/" + id;
        },
        [ICON_TYPE.ACTIVITYCOMBAT]: (id: string) => {
            return bundle_path + "activity_combat/" + id;
        },
        [ICON_TYPE.HEADICON]: (id: string) => {
            return bundle_path + "head_icon/" + id;
        },
        [ICON_TYPE.SCENE_CELL]: (id: string) => {
            return "loader/scene/cell/" + id;
        },
        [ICON_TYPE.HERO_TRIAL]: (id: string) => {
            return bundle_path + "hero_sy/" + id;
        },
        [ICON_TYPE.ARENA_RANK]: (id: string) => {
            return bundle_path + "arena/" + id;
        },
        [ICON_TYPE.ARENA_RANK_SAMLL]: (id: string) => {
            return bundle_path + "arena_small/" + id;
        },
        [ICON_TYPE.ARENA_SKIN]: (id: string) => {
            return "loader/scene/arena/" + id;
        },
        [ICON_TYPE.ARENA_SKIN_ATT]: (id: string) => {
            return bundle_path + "arena_changjing/" + id;
        },
        [ICON_TYPE.DrawCard]: (id: string) => {
            return bundle_path + "draw_card/" + id;
        },
    }
}
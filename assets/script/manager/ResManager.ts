import { Asset, assetManager, ImageAsset, path, resources, sp, SpriteFrame, sys, Texture2D } from "cc";
import { Singleton } from "core/Singleton";
import { CommonEvent } from "modules/common/CommonEvent";
import { EventCtrl } from "modules/common/EventCtrl";
import * as fgui from "fairygui-cc";
import { ENUM_OBJ, ObjectPool } from "core/ObjectPool";
import { LogError, LogWxError } from "core/Debugger";
import { ENUM_PLANT, headImgExt, PackageData } from "preload/PkgData";



// singleton("ResManager")
export class ResManager extends Singleton {
    private _map_uiPackage: { [key: string]: boolean } = {};
    private _map_uiPackageLoading: { [key: string]: boolean } = {};

    constructor() {
        super();
        EventCtrl.Inst().on(CommonEvent.FGUI_PACKAGE, this.onFguiPackeDestory, this);
    }
    public hasPackage(name: string) {
        return this._map_uiPackage[name]
    }

    public addLoading(name: string) {
        this._map_uiPackageLoading[name] = true;
    }

    public removeLoading(name: string) {
        this._map_uiPackageLoading[name] = false;
    }

    public hasLoading(name: string) {
        return this._map_uiPackageLoading[name]
    }

    public onLoadPackage(name: string) {
        this._map_uiPackageLoading[name] = false;
        if (!this._map_uiPackage[name]) {
            EventCtrl.Inst().emit(CommonEvent.FGUI_PACKAGE_ONLOAD, name)
        }
        this._map_uiPackage[name] = true
    }

    public onRemovePackage(name: string) {
        delete this._map_uiPackage[name]
    }

    Load<T extends Asset>(paths: string,
        onCom: (err: Error | null, data: T) => void) {
        if (PackageData.Inst().g_UserInfo.changRes[paths]) {
            paths = PackageData.Inst().g_UserInfo.changRes[paths];
        }
        resources.load<T>(paths, (err: Error | null, data: T) => {
            if(err){
                LogWxError("资源下载失败", paths, err)
            }
            if (onCom) {
                data && data.addRef();
                onCom(err, data)
            }
        });
    }

    private onFguiPackeDestory(packName: string) {
        LogError("资源释放了：" + packName)
        this.onRemovePackage(packName);
        fgui.UIPackage.removePackage(packName);
    }

    LoadSpriteFrame<T extends Asset>(paths: string,
        onCom: (err: Error | null, data: T) => void) {
        if (PackageData.Inst().g_UserInfo.changRes[paths]) {
            paths = PackageData.Inst().g_UserInfo.changRes[paths];
        }
        resources.load<T>(paths + "/spriteFrame", (err: Error | null, data: T) => {
            if(err){
                LogWxError("资源下载失败", paths, err)
            }
            if (onCom) {
                data && data.addRef();
                onCom(err, data)
            }
        });
    }

    LoadOutSprite(type: ENUM_OBJ, url: string, cb: Function) {
        if (url) {
            if (sys.platform == sys.Platform.BYTEDANCE_MINI_GAME) {
                assetManager.loadRemote(url, { ext: headImgExt }, (error, texture: Texture2D) => {
                    if (error) {
                        return
                    }
                    if (texture) {
                        if (texture) {
                            let sf = ObjectPool.GetObjByCCPool(type, () => {
                                return SpriteFrame.createWithImage(texture)
                            })
                            cb && cb(sf)
                        }
                    }
                })
            } else {
                assetManager.loadRemote(url, (error, image: any) => {
                    if (error) {
                        return
                    }
                    if (image) {
                        let sf = ObjectPool.GetObjByCCPool(type, () => {
                            return SpriteFrame.createWithImage(image)
                        })
                        cb && cb(sf)
                    }
                })
            }
        }
    }
}
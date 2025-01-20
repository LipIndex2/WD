import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { FloatingTextDate } from "modules/main/FloatingTextData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { UH } from "../../helpers/UIHelper";
import { ViewManager } from "manager/ViewManager";
import { LoginView } from "./LoginView";
import { CameraManager } from "manager/CameraManager";
import { sys, View } from "cc";
import { MangaView } from "./MangaView";
import { Prefskey } from "modules/common/PrefsKey";
import { LoginCtrl } from "./LoginCtrl";

@BaseView.registView
export class GameTipsView extends BaseView {

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "Login",
        ViewName: "GametipsView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
    };

    private handler: NodeJS.Timeout;

    InitData() {
        this.handler && clearTimeout(this.handler);
        this.firstSceneCallBack().then(() => {
            this.handler = setTimeout(() => {
                ViewManager.Inst().CloseView(GameTipsView);
            }, 2000);
        });
    }

    async firstSceneCallBack() {
        let firstSceneEnd = (window as any)['firstSceneEnd'];
        if (firstSceneEnd) {

            await firstSceneEnd();
            (window as any)['firstSceneEnd'] = undefined;
            CameraManager.Inst().CameraShow();
        } else {
            CameraManager.Inst().CameraShow();
            View.instance.setDesignResolutionSize(800, 1600, 2);
        }
        ViewManager.Inst().windowSizeChange();
        this.ReSetWindowSize();
    }

    CloseCallBack(): void {
        this.handler && clearTimeout(this.handler);
        if (sys.localStorage.getItem(Prefskey.Get4MangaKey()) === "1") {
            LoginCtrl.Inst().loginSdk();
            ViewManager.Inst().OpenView(LoginView);
        } else {
            ViewManager.Inst().OpenView(MangaView);
        }
    }
}
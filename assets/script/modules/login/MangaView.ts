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
import { game, sys, View } from "cc";
import { GameTipsView } from "./GameTipsView";
import { LoginCtrl } from "./LoginCtrl";
import { Prefskey } from "modules/common/PrefsKey";

@BaseView.registView
export class MangaView extends BaseView {

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "Login",
        ViewName: "MangaView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        icon: <fgui.GLoader>null,
        title: <fgui.GTextField>null,
        btnGo: <fgui.GButton>null,
    };

    private handler: NodeJS.Timeout;

    private showArr: { icon: string, textArr: string[] }[] = [
        { icon: "ui://zuqsa9o4c49js45", textArr: ["一位青年正在看一本名为《宗门秘籍》的小说；"] },
        { icon: "ui://zuqsa9o4c49js46", textArr: ["看着看着，青年人进入了梦乡，一位老者在梦里呼唤；",] },
        { icon: "ui://zuqsa9o4c49js47", textArr: ["在梦里，老者嘱托青年掌舵宗门，抵御妖魔；"] },
        { icon: "ui://zuqsa9o4c49js48", textArr: ["青年有点茫然，但一想，来都来了，不能白走一遭，于是开始了与妖魔的战斗……"] },
    ];
    private showIndex: number = 0;
    private totalTextIndex: number = 0;

    private textArr: string[] = [];
    private textIndex: number = 0;
    private text: string = "";
    private isTouch: boolean = false;

    InitData() {
        this.handler && clearInterval(this.handler);
        this.firstSceneCallBack().then(() => {
            this.handler = setInterval(() => {
                this.updateText();
            }, 100);
        });

        this.text = this.showArr[this.showIndex].textArr[this.totalTextIndex];
        this.textIndex = 0;
        this.viewNode.title.text = "";
        this.textArr = this.text.split("");
        this.viewNode.btnGo.onClick(this.onClickBtnGo, this);
        this.viewNode.icon.url = this.showArr[this.showIndex].icon;
        sys.localStorage.setItem(Prefskey.Get4MangaKey(), "1");
    }

    onClickBtnGo() {
        this.viewNode.title.text = this.text;

        if (this.showIndex >= this.showArr.length - 1) {
            if (this.textIndex > this.textArr.length - 1) {
                this.isTouch = true;
            } else {
                this.isTouch = false;
            }
            this.textIndex = this.textArr.length;
            if (this.isTouch) {
                // 打开登录界面
                ViewManager.Inst().CloseView(MangaView);
            }
            this.isTouch = !this.isTouch;
            return;
        }

        if (this.textIndex > this.textArr.length - 1) {
            this.isTouch = true;
        }
        this.textIndex = this.textArr.length;

        if (this.isTouch) {
            // 检查是否有下一句
            if (this.totalTextIndex < this.showArr[this.showIndex].textArr.length - 1) {
                this.totalTextIndex += 1;
            } else {
                this.showIndex += 1;
                this.totalTextIndex = 0;
                this.viewNode.icon.url = this.showArr[this.showIndex].icon;
            }
            this.textIndex = 0;
            this.text = this.showArr[this.showIndex].textArr[this.totalTextIndex];
            this.viewNode.title.text = "";
            this.textArr = this.text.split("");
        }

        this.isTouch = !this.isTouch;
    }

    updateText() {
        if (this.textIndex > this.textArr.length - 1) {
            return;
        }
        this.viewNode.title.text += this.textArr[this.textIndex];
        this.textIndex++;
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
        this.handler && clearInterval(this.handler);
        LoginCtrl.Inst().loginSdk();
        ViewManager.Inst().OpenView(LoginView);
    }
}
import { DEFAULT_SCREEN_H } from "config/CfgCommon";
import { CfgGuideStep } from "config/CfgGuide";
import {  GObject, GRoot } from "fairygui-cc";
import { Timer } from "modules/time/Timer";
import { GuideBase } from "./GuideBase";
import { GuideCtrl } from "./GuideCtrl";
import * as fgui from "fairygui-cc";
import { Component } from "cc";
import { MainViewHeroItem } from "modules/main/MainView";

export class GuideButton extends GuideBase {
    target: GObject;
    call_back: Function;
    handle: any = null;
    check_count: number = 0
    Start(step_cfg: CfgGuideStep, func: () => void): void {
        this.CheckGuideView()
        this.call_back = func;
        this.CheckButton()
    }
    CheckButton() {
        let step_cfg = GuideCtrl.Inst().CurStepCfg()
        if (!step_cfg)
            return;

        if (!this.handle) {
            Timer.Inst().CancelTimer(this.handle)
            this.handle = null
        }
        this.target = null;
        Timer.Inst().CancelTimer(this.handle)
        this.check_count = 0
        this.handle = Timer.Inst().AddRunFrameTimer(this.GetGuideUi.bind(this), 1, 800, false)//240)
    }

    private addObj: GObject;
    GetGuideUi() {
        let step_cfg = GuideCtrl.Inst().CurStepCfg()
        let ui_key = step_cfg.step_param_1
        this.target = GuideCtrl.Inst().GetGuideUi(ui_key)
        if (this.target != null) {

            this.check_count = this.check_count + 1
            //console.log("获取到目标对象", ui_key)
            let pos = this.target.localToGlobal();
            //这里涉及到分辨率变化
            pos.x = pos.x - (0 - this.target.width / 2)
            pos.y = pos.y - (0 - this.target.height / 2)
            pos.y = pos.y - (GRoot.inst.height - DEFAULT_SCREEN_H)
            //做一个延迟才行对于列表的item会对不上
            if (this.check_count > 10) {
                Timer.Inst().CancelTimer(this.handle)
                if (ui_key == "MainViewHero0") {
                    let addObj = fgui.UIPackage.createObject("Main", "ItemHero").asCom;;
                    this.target.parent.addChildAt(addObj, 0);
                    addObj.width = this.target.width;
                    addObj.height = this.target.height;
                }
                this.view && this.view.Show(pos, {
                    target: this.target,
                    parent: this.target.parent,
                    posX: this.target.localToGlobal().x,
                    posY: this.target.y,
                    posYN: this.target.localToGlobal().y - (GRoot.inst.height - DEFAULT_SCREEN_H),
                });

            }
        }
    }

    Continue(): void {
        this.call_back ? this.call_back() : null;
        this.Finish()
    }

    Finish(): void {
        this.target = null;
        this.check_count = 0
    }

    OnClick() {
        if (this.addObj) {
            this.addObj.parent && this.addObj.parent.removeChild(this.addObj);
            this.addObj = null;
        }
        if (this.target == null || this.target.node == null) {
            GuideCtrl.Inst().ForceStop()
            console.log("指引操作步骤出错, 指引按钮被销毁过");
            return
        }
        GRoot.inst.inputProcessor.simulateClick(this.target);
        this.Continue()
    }
}
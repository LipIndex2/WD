import { CfgGuideStep } from "config/CfgGuide";
import { ViewManager } from "manager/ViewManager";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { MainData } from "modules/main/MainData";
import { GuideBase } from "./GuideBase";

export class GuideOpenView extends GuideBase {

    Start(step_cfg: CfgGuideStep, func: () => void) {
        this.CheckGuideView()
        switch (step_cfg.step_param_1) {
            case "ShopView":
                ViewManager.Inst().OpenView(step_cfg.step_param_1)
                MainData.Inst().FlushMainMenu()
                break
            case "NewPackView":
                if (FunOpen.Inst().checkAudit(1)) {
                    ViewManager.Inst().OpenView(step_cfg.step_param_1)
                }
                break
            default:
                ViewManager.Inst().OpenView(step_cfg.step_param_1)
                break
        }
        func();
    }

    Continue(): void {

    }
    Finish(): void {

    }
}
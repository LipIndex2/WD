import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";

@BaseView.registView
export class BattleStartFightTip extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleTip",
        ViewName: "BattleStartFightTip",
        LayerType: ViewLayer.Buttom,
        ViewMask: ViewMask.None,
    }

    protected viewNode = {
        TopEffect: <UIEffectShow>null,
    };
    private timeOut:any;
    OpenCallBack() {
        this.viewNode.TopEffect.PlayEff("1208013", ()=>{
            setTimeout(()=>{
                //console.error("关闭了");
                ViewManager.Inst().CloseView(BattleStartFightTip);
            }, 2000)
        });
        
        ///this.view.getTransition("show").play();
    }

    CloseCallBack() {
        
    }
}
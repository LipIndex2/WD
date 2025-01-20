
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { CocSpriteGradient } from '../../ccomponent/CocSpriteGradient';
import * as fgui from "fairygui-cc";

@BaseView.registView
export class FillView extends BaseView {
    protected viewRegcfg = {
        UIPackName: "Fill",
        ViewName: "FillView",
        LayerType: ViewLayer.ButtomMain - 1,
    };

    protected viewNode = {
        bg: <fgui.GImage>null,
    }
    InitUI(): void {
        let gradient = this.viewNode.bg._content.addComponent(CocSpriteGradient);
        gradient.setMaterialName("mat_mainview");
    }
}
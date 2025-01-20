
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from "modules/common/BaseView";
import { UH } from "../../helpers/UIHelper";

@BaseView.registView
export class MainChallengeAttrView extends BaseView {

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "MainChallengeAttr",
        ViewName: "MainChallengeAttrView",
        LayerType: ViewLayer.Normal,
        // ViewMask: ViewMask.BlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        GpAttr: <fgui.GGroup>null,
        AttrShow: <fgui.GTextField>null,
        BtnClose: <fgui.GLoader>null,
    };

    InitData(param_t: { x: number, y: number, content: string }) {
        this.viewNode.GpAttr.x = param_t.x
        this.viewNode.GpAttr.y = param_t.y

        if (param_t.content) {
            UH.SetText(this.viewNode.AttrShow, param_t.content)
        }
        this.viewNode.BtnClose.onClick(this.closeView, this);
    }
}
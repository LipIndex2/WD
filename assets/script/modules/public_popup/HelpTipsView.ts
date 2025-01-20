import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { UH } from "../../helpers/UIHelper";
import { AudioTag } from "modules/audio/AudioManager";

@BaseView.registView
export class HelpTipsView extends BaseView {
    protected viewRegcfg: viewRegcfg = {
        UIPackName: "DialogTips",
        ViewName: "HelpTipsView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Text: <fgui.GTextField>null,
        CloseBtn: <fgui.GButton>null,
        Title: <fgui.GTextField>null,
    };

    InitData(paramt: {desc:string, title?:string}) {
        this.viewNode.CloseBtn.onClick(this.closeView, this);
        UH.SetText(this.viewNode.Text, paramt.desc);
        if(paramt.title){
            UH.SetText(this.viewNode.Title, paramt.title);
        }
    }

}
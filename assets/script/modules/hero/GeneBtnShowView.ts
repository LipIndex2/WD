import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { HeroGeneBagView } from "./HeroGeneBagView";
import { HeroGeneInfoView } from "./HeroGeneInfoView";

@BaseView.registView
export class GeneBtnShowView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "GeneBtnShow",
        ViewName: "GeneBtnShowView",
        LayerType: ViewLayer.Normal,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        GpShow: <fgui.GGroup>null,
        BtnClose: <fgui.GLoader>null,
        BtnReplace: <fgui.GButton>null,
        BtnInfo: <fgui.GButton>null,
    };
    data: any
    InitData(param: any) {
        this.viewNode.GpShow.x = param.pos.x - 80;
        this.viewNode.GpShow.y = 1600 - param.pos.y + 100;

        this.data = param;
        this.viewNode.BtnClose.onClick(this.closeView, this);

        this.viewNode.BtnReplace.onClick(this.OnClickReplace, this);
        this.viewNode.BtnInfo.onClick(this.OnClickInfo, this);
    }

    OnClickReplace() {
        ViewManager.Inst().OpenView(HeroGeneBagView, { type: this.data.type, geneIndex: this.data.geneIndex });
        ViewManager.Inst().CloseView(GeneBtnShowView);
    }

    OnClickInfo() {
        ViewManager.Inst().OpenView(HeroGeneInfoView, { geneIndex: this.data.geneIndex, index: this.data.type - 1 });
        ViewManager.Inst().CloseView(GeneBtnShowView);
    }
    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}
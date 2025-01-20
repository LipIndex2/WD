import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { UH } from '../../helpers/UIHelper';
import { ViewManager } from 'manager/ViewManager';
import { BagData } from "modules/bag/BagData";
import { ICON_TYPE } from "modules/common/CommonEnum";

@BaseView.registView
export class HeroGeneResolveHintView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroGeneResolveHint",
        ViewName: "HeroGeneResolveHintView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        // Title2: <fgui.GTextField>null,
        Board: <CommonBoard2>null,
        Title: <fgui.GRichTextField>null,
        Icon: <fgui.GLoader>null,
        BtnClose: <fgui.GButton>null,
        BtnNotarize: <fgui.GButton>null,

        MaterialsNum1: <fgui.GTextField>null,
        MaterialsNum2: <fgui.GTextField>null,
        MaterialsNum3: <fgui.GTextField>null,
        IconMaterials1: <fgui.GLoader>null,
        IconMaterials2: <fgui.GLoader>null,
        IconMaterials3: <fgui.GLoader>null,
    };
    data: any;
    private confirmFunc: Function;
    private stateCtrler: fgui.Controller

    InitData(paramt: { content: string, type: number, num1?: number, num2?: number, confirmFunc?: Function }) {
        this.viewNode.Board.SetData(new BoardData(HeroGeneResolveHintView));
        this.confirmFunc = paramt ? paramt.confirmFunc : undefined;
        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnNotarize.onClick(this.OnClickConfirm, this);

        this.stateCtrler = this.view.getController("ResolveHintState");
        if (paramt.type == 1) {
            this.stateCtrler.selectedIndex = 1
        } else {
            this.stateCtrler.selectedIndex = 0
        }

        UH.SetIcon(this.viewNode.IconMaterials1, 40000, ICON_TYPE.ITEM)
        UH.SetIcon(this.viewNode.IconMaterials2, 40047, ICON_TYPE.ITEM)
        UH.SetIcon(this.viewNode.IconMaterials3, 40047, ICON_TYPE.ITEM)
        UH.SetText(this.viewNode.MaterialsNum1, paramt.num2);
        UH.SetText(this.viewNode.MaterialsNum2, paramt.num1);
        UH.SetText(this.viewNode.MaterialsNum3, BagData.Inst().GetItemNum(40047));
        UH.SetText(this.viewNode.Title, paramt ? paramt.content : "")
    }

    OnClickConfirm() {
        this.confirmFunc && this.confirmFunc();
        ViewManager.Inst().CloseView(HeroGeneResolveHintView);
    }

    OnClickCancel() {
        ViewManager.Inst().CloseView(HeroGeneResolveHintView);
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
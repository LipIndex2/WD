import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { UH } from "../../helpers/UIHelper";
import { PublicPopupCtrl } from "./PublicPopupCtrl";
import { DialogTipsToggle } from "./PublicPopupData";

@BaseView.registView
export class DialogTipsView extends BaseView {
    private confirmFunc: Function;
    private cancelFunc: Function;

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "DialogTips",
        ViewName: "DialogTipsView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        BtnConfirm: <fgui.GButton>null,
        BtnCancel: <fgui.GButton>null,
        ContentShow: <fgui.GTextField>null,
        ContentRichtext: <fgui.GRichTextField>null,
        Toggle: <fgui.GButton>null,
        ToggleText: <fgui.GTextField>null,
    };

    private param_t: any;
    InitData(paramt: { content: string, confirmFunc?: Function, confirmText?: string, titleShow?: string, cancelFunc?: Function, cancelText?: string, btnShow?: boolean, toggleObj?: DialogTipsToggle, isRichtext?: boolean }) {
        this.confirmFunc = paramt ? paramt.confirmFunc : undefined;
        this.cancelFunc = paramt ? paramt.cancelFunc : undefined;
        this.param_t = paramt;

        this.viewNode.Board.SetData(new BoardData(DialogTipsView));
        this.viewNode.BtnConfirm.onClick(this.OnClickConfirm, this);
        this.viewNode.BtnCancel.onClick(this.OnClickCancel, this);

        if (paramt.isRichtext) {
            UH.SetText(this.viewNode.ContentRichtext, paramt ? paramt.content : "")
        } else {
            UH.SetText(this.viewNode.ContentShow, paramt ? paramt.content : "")
        }

        this.viewNode.BtnConfirm.title = paramt.confirmText ?? Language.Common.Confirm
        this.viewNode.BtnCancel.title = paramt.cancelText ?? Language.Common.Cancel

        if (paramt.titleShow) {
            this.viewNode.Board.SetTitle(paramt.titleShow)
        }
        if (paramt.btnShow) {
            this.BtnAddShow();
        }

        this.view.getController("isToggle").setSelectedIndex(paramt.toggleObj == null ? 0 : 1);
        if (paramt.toggleObj) {
            this.viewNode.Toggle.onClick(this.OnToggleClick, this);
            UH.SetText(this.viewNode.ToggleText, paramt.toggleObj.toggleText);
        }
    }

    //只显示确认按钮
    public BtnAddShow() {
        this.viewNode.BtnCancel.visible = false;
        this.viewNode.BtnConfirm.x = 252;
    }

    OnClickConfirm() {
        this.confirmFunc && this.confirmFunc();
        this.cancelFunc = null;
        ViewManager.Inst().CloseView(DialogTipsView);
    }

    OnClickCancel() {
        ViewManager.Inst().CloseView(DialogTipsView);
    }

    CloseCallBack(): void {
        this.cancelFunc && this.cancelFunc();
        if (this.param_t.toggleObj) {
            PublicPopupCtrl.Inst().SetToggle(this.param_t.toggleObj, this.viewNode.Toggle.selected);
        }
    }

    OnToggleClick() {

    }
}
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from "modules/common/BaseView";
import * as fgui from "fairygui-cc";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { UH } from "../../helpers/UIHelper";
import { IPoolObject, ObjectPool } from "core/ObjectPool";
import { GLoader } from "fairygui-cc/GLoader";
export class BreakLineInfo implements IPoolObject {
    title: string;
    tip: string;
    str_close: string;
    str_tautology: string;
    showClose: boolean = true;
    showTautology: boolean = true;
    res_icon: string | undefined = "";
    reInit?(...param: any[]): void {
    }
    onPoolReset(): void {
        this.title = "";
        this.tip = "";
        this.str_close = "";
        this.str_tautology = "";
        this.showClose = true;
        this.showTautology = true;
        this.res_icon = "";
    }
}
@BaseView.registView
export class BreakLineView extends BaseView {
    protected viewRegcfg: viewRegcfg = {
        UIPackName: "BreakLine",
        ViewName: "BreakLineView",
        LayerType: ViewLayer.Top,
        ViewMask: ViewMask.BgBlock,
        ShowAnim: true,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        tip: <fgui.GLabel>null,
        icon: <GLoader>null,
        BtnClose: <fgui.GButton>null,
        BtnTautology: <fgui.GButton>null
    }
    private _onBtnClose: Function;
    private _onBtnTautology: Function;
    private _param: BreakLineInfo

    InitData(param: BreakLineInfo): void {
        this._param = param;
    }
    InitUI(): void {
        this.viewNode.BtnClose.onClick(this.onBtnClose, this);
        this.viewNode.BtnTautology.onClick(this.onBtnTautology, this);
    }
    OpenCallBack(): void {
        if (this._param) {
            this.viewNode.Board.SetTitle(this._param.title);
            this.viewNode.Board.setCloseVisible(false);
            UH.SetText(this.viewNode.tip, this._param.tip);
            UH.SetText(this.viewNode.BtnClose, this._param.str_close);
            UH.SetText(this.viewNode.BtnTautology, this._param.str_tautology);
            this.viewNode.BtnClose.visible = this._param.showClose;
            this.viewNode.BtnTautology.visible = this._param.showTautology;
            if (this._param.res_icon) {
                UH.SpriteName(this.viewNode.icon, "BreakLine", this._param.res_icon)
            } else {
                if (this._param.res_icon != "") {
                    this.viewNode.icon.visible = false;
                }
            }
        }
    }
    public setOnBtnClose(v: Function) {
        this._onBtnClose = v
    }

    public setOnBtnTautology(v: Function) {
        this._onBtnTautology = v
    }

    private onBtnClose() {
        let _onBtnClose = this._onBtnClose;
        this.closeView();
        _onBtnClose && this._onBtnClose();
    }

    private onBtnTautology() {
        let _onBtnTautology = this._onBtnTautology;
        this.closeView();
        _onBtnTautology && _onBtnTautology();
    }
    CloseCallBack(): void {
        if (this._param) {
            ObjectPool.Push(this._param);
            this._param = undefined;
        }
    }
}
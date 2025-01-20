import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { UH } from "../../helpers/UIHelper";
import { BoardData } from "./BoardData";

export class CommonBoard3 extends fgui.GLabel {
    private boardData: BoardData;

    private viewNode = {
        BtnClose: <fgui.GButton>null,

        title: <fgui.GTextField>null,

        GpDeco: <fgui.GGroup>null,
    }

    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }

    public setCloseVisible(v: boolean) {
        if (this.viewNode.BtnClose) {
            this.viewNode.BtnClose.visible = v;
        }
    }

    SetData(board_data: BoardData) {
        this.viewNode.BtnClose.onClick(this.OnClickClose.bind(this));

        if (board_data.title) {
            this.title = board_data.title;
            UH.SetText(this.viewNode.title, board_data.title);
        }

        this.boardData = board_data;
    }

    OnClickClose() {
        ViewManager.Inst().CloseView(this.boardData.view)
    }

    SetTitle(title: string) {
        this.title = title;
        UH.SetText(this.viewNode.title, title);
    }

    SetBtnCloseVisible(visible: boolean) {
        this.viewNode.BtnClose.visible = visible;
    }

    public SetBtnTitleVisible(visible: boolean) {
        this.viewNode.title.visible = visible;
    }

    DecoShow(visible: boolean) {
        this.viewNode.GpDeco.visible = visible
    }
}
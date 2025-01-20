import { DEFAULT_SCREEN_H, DEFAULT_SCREEN_W } from "config/CfgCommon";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { UH } from "../../helpers/UIHelper";
import { BoardData } from "./BoardData";

export class CommonBoard2 extends fgui.GLabel {
    private boardData: BoardData;
    private extraCompent: fgui.GComponent;

    private viewNode = {
        BtnClose: <fgui.GButton>null,

        title: <fgui.GTextField>null,
    }

    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }

    public SetData(board_data: BoardData) {
        let self = this;
        this.boardData = board_data;

        this.viewNode.BtnClose.onClick(this.OnCickClose.bind(self));

        if (board_data.title) {
            UH.SetText(this.viewNode.title, board_data.title)
        }
    }

    addExtraCompent(extra_compent: fgui.GObject) {
        if (!this.extraCompent) {
            this.extraCompent = new fgui.GComponent();
            this.extraCompent.height = DEFAULT_SCREEN_H;
            this.extraCompent.width = DEFAULT_SCREEN_W;
            this.addChildAt(this.extraCompent, 1);
            this.extraCompent.center();
        }
        this.extraCompent.addChildAt(extra_compent, 0);
    }

    removeExtraCompent() {
        if (this.extraCompent)
            this.extraCompent.removeChildren();
    }

    OnCickClose() {
        ViewManager.Inst().CloseView(this.boardData.view)
    }

    SetBtnCloseVisible(visible: boolean) {
        this.viewNode.BtnClose.visible = visible;
    }

    SetTitle(title: string) {
        this.title = title;
        UH.SetText(this.viewNode.title, title);
    }
}

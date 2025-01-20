
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";

@BaseView.registView
export class TerritoryRentView extends BaseView {
    showItem: any[] = [];

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "TerritoryRent",
        ViewName: "TerritoryRentView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
    };

    InitData() {
        this.viewNode.Board.SetData(new BoardData(TerritoryRentView));
    }

    CloseCallBack(): void {
    }
}
import { CommonBoard1 } from 'modules/common_board/CommonBoard1';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { EGLoader } from "modules/extends/EGLoader";
import { FarmNeighbourViewHelpPanel } from './FarmNeighbourViewHelpPanel';
import { FarmNeighbourViewMainPanel } from './FarmNeighbourViewMainPanel';

@BaseView.registView
export class FarmNeighbourView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FarmNeighbour",
        ViewName: "FarmNeighbourView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };


    protected boardCfg = {
        TabberCfg: [
            { panel: FarmNeighbourViewMainPanel, viewName: "FarmNeighbourViewMainPanel", titleName: Language.Farm.NeighbourTitle[0] },
            { panel: FarmNeighbourViewHelpPanel, viewName: "FarmNeighbourViewHelpPanel", titleName: Language.Farm.NeighbourTitle[1] },
        ]
    };

    protected viewNode = {
        Board: <CommonBoard1>null,
    };

    /* protected extendsCfg = [
        { ResName: "组件名", ExtendsClass: 拓展类 }
    ]; */

    InitData() {
        // this.viewNode.Board.SetData(new BoardData(this));
    }

    InitUI() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}
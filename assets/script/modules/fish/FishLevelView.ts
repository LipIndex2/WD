
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishData } from "./FishData";

@BaseView.registView
export class FishLevelView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishLevel",
        ViewName: "FishLevelView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnConfirm: <fgui.GButton>null,

        CurDesc: <fgui.GTextField>null,
        NextDesc: <fgui.GTextField>null,
        ShowList: <fgui.GList>null,
    };

    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishLevelView));
        this.viewNode.Board.DecoShow(true);

        this.viewNode.BtnConfirm.onClick(this.OnClickConfirm, this);

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo", "FlushLevelInfo");
    }

    InitUI() {
        this.FlushInfo()
    }

    FlushInfo() {
        let co_cur = FishData.Inst().CfgFisherLevelByLevel()
        let co_next = FishData.Inst().CfgFisherLevelByLevel(FishData.Inst().InfoLevel + 1)
        this.viewNode.Board.SetTitle(TextHelper.Format(Language.Fish.Level.TitleShow, FishData.Inst().InfoLevel))
        UH.SetText(this.viewNode.CurDesc, TextHelper.Format(Language.Fish.Level.DescShow, (co_cur ? co_cur.level_add : 0) / 100))
        UH.SetText(this.viewNode.NextDesc, TextHelper.Format(Language.Fish.Level.DescShow, (co_next ? co_next.level_add : 0) / 100))
    }

    OnClickConfirm() {
        ViewManager.Inst().CloseView(FishLevelView)
    }
}

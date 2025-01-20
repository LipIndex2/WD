
import * as fgui from "fairygui-cc";
import { BaseItemCare } from "modules/common/BaseItem";
import { FishData } from "modules/fish/FishData";
import { UH } from "../../helpers/UIHelper";

export class TopLayerViewFishScoreItem extends BaseItemCare {
    private showTweener: fgui.GTweener;

    protected viewNode = {
        ScoreShow: <fgui.GTextField>null,
        ScoreAdd: <fgui.GTextField>null,
        GpAdd: <fgui.GGroup>null,
    };

    InitData() {

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushTopShow.bind(this), "FlushTopShow");
    }

    InitUI() {
    }

    FlushTopShow() {
        this.FlushInfo()
        this.getTransition("ItemShow").play();
    }

    FlushInfo() {
        let top_show = FishData.Inst().FlushData.TopShow
        UH.SetText(this.viewNode.ScoreShow, top_show.cur)
        UH.SetText(this.viewNode.ScoreAdd, top_show.cur - top_show.pre)
    }
}
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { CultivateViewExchangePanel } from "./CultivateViewExchangePanel";
import { CultivateViewMainPanel } from "./CultivateViewMainPanel";
import { CultivateViewTaskPanel } from "./CultivateViewTaskPanel";
import { AudioTag } from "modules/audio/AudioManager";
import { CommonBoardTab1, CommonBoard1 } from "modules/common_board/CommonBoard1";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { COLORS } from "modules/common/ColorEnum";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { CultivateData } from "./CultivateData";
import { UH } from "../../helpers/UIHelper";

@BaseView.registView
export class CultivateView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Cultivate",
        ViewName: "CultivateView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected boardCfg = {
        TabberCfg: [
            { panel: CultivateViewTaskPanel, viewName: "CultivateViewTaskPanel", titleName: Language.Cultivate.title[0] },
            { panel: CultivateViewMainPanel, viewName: "CultivateViewMainPanel", titleName: Language.Cultivate.title[1] },
            { panel: CultivateViewExchangePanel, viewName: "CultivateViewExchangePanel", titleName: Language.Cultivate.title[2] },
        ]
    };

    protected viewNode = {
        Name: <fgui.GTextField>null,
        BtnClose: <fgui.GButton>null,
        SpineShow: <UISpineShow>null,
        timer: <TimeMeter>null,
    };

    protected extendsCfg = [
        { ResName: "BoardCultivate", ExtendsClass: BoardCultivate },
        { ResName: "ButtonTab", ExtendsClass: CommonBoardTab1 }
    ];

    InitData() {

        this.viewNode.BtnClose.onClick(this.closeView, this);

        this.viewNode.SpineShow.LoadSpine(ResPath.Spine("gengzhongri/gengzhongri_top"), true);

        this.FlushTime();

    }

    private FlushTime() {
        let time = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.Cultivate) - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
    }

    InitUI() {
        const cfg = CultivateData.Inst().GetOther()
        UH.SetText(this.viewNode.Name, cfg.act_tittle);
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

class BoardCultivate extends CommonBoard1 {
    protected viewNode: any = {
        TabList: <fgui.GList>null,
    };
}

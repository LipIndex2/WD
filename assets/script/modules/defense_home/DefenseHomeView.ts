import * as fgui from "fairygui-cc";
import { SceneType } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { DefenseHomeData } from "./DefenseHomeCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { UH } from "../../helpers/UIHelper";
import { Format } from "../../helpers/TextHelper";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { CfgBarrierInfoDefenseHomeReward } from "config/CfgBarrierInfo";
import { COLORS } from "modules/common/ColorEnum";
import { Color } from "cc";
import { ViewManager } from "manager/ViewManager";
import { MainTaskRewardView } from "modules/main/MainTaskRewardView";
import { RankView } from "modules/rank/RankView";
import { RANK_TYPE } from "modules/rank/RankData";
import { ActivityCtrl } from "modules/activity/ActivityCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { DefensePassCheckView } from "modules/DefensePassCheck/DefensePassCheckView";

@BaseView.registView
export class DefenseHomeView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "DefenseHome",
        ViewName: "DefenseHomeView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        Num: <fgui.GTextField>null,
        RemainCount: <fgui.GTextField>null,
        ActBtn1: <fgui.GButton>null,
        ActBtn2: <fgui.GButton>null,
        StartBtn: <fgui.GButton>null,
        Timer: <TimeMeter>null,
        Progress: <fgui.GProgressBar>null,
        BoxList: <fgui.GList>null,
        UISpineShow: <UISpineShow>null,
    };

    protected extendsCfg = [
        { ResName: "BoxInfo", ExtendsClass: DefenseHomeBoxInfo }
    ];

    InitData() {
        this.AddSmartDataCare(DefenseHomeData.Inst().dataInfo, this.FlushPanel.bind(this), "info")

        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DefenseHome, 0);
        this.viewNode.Board.SetData(new BoardData(DefenseHomeView));

        this.viewNode.StartBtn.onClick(this.OnStartGameClick, this);
        this.viewNode.ActBtn1.onClick(this.OnBtn1Click, this);
        this.viewNode.ActBtn2.onClick(this.OnBtn2Click, this);

        this.viewNode.Progress.min = 0;
        this.viewNode.Progress.max = DefenseHomeData.Inst().maxPassDay;
        let lineColor = new Color(1, 127, 7);
        this.viewNode.Timer.SetOutline(true, lineColor, 3)
        this.viewNode.BoxList.on(fgui.Event.CLICK_ITEM, (item: DefenseHomeBoxInfo) => {
            let data = item.GetData();
            let state = DefenseHomeData.Inst().GetRewardState(data);
            if (state == 1) {
                ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.DefenseHome, 1, data.seq);
            } else {
                ViewManager.Inst().OpenView(MainTaskRewardView, { x: item.node.worldPosition.x - 80, y: 1600 - item.node.worldPosition.y - 200, rewards: data.win });
            }
        })

        this.viewNode.UISpineShow.LoadSpine("spine/shouweihouyuan/shouweihouyuan_tc", true);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
        this.FlushTime();
        this.FlushPanel();
    }

    CloseCallBack() {
    }


    FlushPanel() {
        UH.SetText(this.viewNode.Num, DefenseHomeData.Inst().passDay);
        let remainCount = DefenseHomeData.Inst().remainCount;
        this.viewNode.StartBtn.grayed = DefenseHomeData.Inst().remainCount < 1;
        UH.SetText(this.viewNode.RemainCount, Format(Language.DefenseHome.Text1, remainCount));
        this.viewNode.Progress.value = DefenseHomeData.Inst().passDay;

        this.viewNode.BoxList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.BoxList.numItems = DefenseHomeData.Inst().GetRewardList().length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(DefenseHomeData.Inst().GetRewardList()[index]);
    }

    private FlushTime() {
        let time = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DefenseHome) - TimeCtrl.Inst().ServerTime;
        this.viewNode.Timer.visible = time > 0
        this.viewNode.Timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.Timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
    }


    OnStartGameClick() {
        if (!DefenseHomeData.Inst().isOpen) {
            PublicPopupCtrl.Inst().Center(Language.DefenseHome.Tip1);
            return;
        }
        if (!DefenseHomeData.Inst().remainCount) {
            PublicPopupCtrl.Inst().Center(Language.DefenseHome.Tip2);
            return;
        }
        BattleCtrl.Inst().EnterBattle(1, SceneType.Defense);
    }

    OnBtn1Click() {
        ViewManager.Inst().OpenView(DefensePassCheckView);
    }

    OnBtn2Click() {
        ViewManager.Inst().OpenView(RankView, { type: RANK_TYPE.DefenseHome });
    }
}

export class DefenseHomeBoxInfo extends BaseItemGB {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
        Num: <fgui.GTextField>null,
        UISpineShow: <UISpineShow>null,
    };

    protected _data: CfgBarrierInfoDefenseHomeReward;

    protected onConstruct(): void {
        super.onConstruct();
        this.viewNode.UISpineShow.LoadSpine("spine/shouweihouyuan/shouweihouyuan_BOX", true);
    }

    public SetData(data: CfgBarrierInfoDefenseHomeReward): void {
        super.SetData(data);

        UH.SetText(this.viewNode.Num, data.day_num);
        let state = DefenseHomeData.Inst().GetRewardState(data);
        let boxImg = state == -1 ? "BaoXiangKai" : "BaoXiang";
        UH.SpriteName(this.viewNode.Icon, "DefenseHome", boxImg);

        this.viewNode.Icon.visible = state != 1;
        this.viewNode.UISpineShow.visible = state == 1;
    }
}
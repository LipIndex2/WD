import { HeroCell } from './../extends/HeroCell';
import { GetCfgValue } from "config/CfgCommon";
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseItemGB, BaseItemGL } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { RedPoint } from "modules/extends/RedPoint";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { MainChallengeAttrView } from "modules/main/MainChallengeAttrView";
import { MainChallengeBossView } from "modules/main/MainChallengeBossView";
import { MainChallengeRewardView } from "modules/main/MainChallengeRewardView";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { MainFBCtrl } from "./MainFBCtrl";
import { MainFBData } from "./MainFBData";
import { COLORS } from "modules/common/ColorEnum";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { UH } from "../../helpers/UIHelper";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { AudioTag } from 'modules/audio/AudioManager';
import { BoardData } from 'modules/common_board/BoardData';
import { CommonBoard3 } from 'modules/common_board/CommonBoard3';
import { SceneType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';


@BaseView.registView
export class EverydayChallengeView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "EverydayChallenge",
        ViewName: "EverydayChallengeView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        BtnTips: <fgui.GButton>null,
        BtnStart: <fgui.GButton>null,

        BtnReward1: <ChallengeRewardButton>null,
        BtnReward2: <ChallengeRewardButton>null,
        BtnReward3: <ChallengeRewardButton>null,

        CellBg1: <fgui.GLoader>null,
        CellBg2: <fgui.GLoader>null,
        CellShow1: <fgui.GLoader>null,
        CellShow2: <fgui.GLoader>null,

        RecordShow: <fgui.GTextField>null,
        TimeShow: <TimeMeter>null,

        AttrList: <fgui.GList>null,
        HeroList: <fgui.GList>null,
        Spine: <UISpineShow>null,
    };

    protected extendsCfg = [
        { ResName: "ButtonChallengeReward", ExtendsClass: ChallengeRewardButton },
        { ResName: "ItemChallengeAttr", ExtendsClass: ChallengeAttrItem },
    ];

    private spShow: UISpineShow = undefined;
    listData1: { type: import("d:/ccs/wjszm-c/assets/script/modules/Battle/BattleConfig").HeroAttriType; val: any; }[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(EverydayChallengeView));
        this.viewNode.BtnTips.onClick(this.OnClickTips, this);
        this.viewNode.CellBg1.onClick(this.OnClickCellShow.bind(this, 0));
        this.viewNode.CellBg2.onClick(this.OnClickCellShow.bind(this, 1));
        this.viewNode.BtnStart.onClick(this.OnClickStart, this);

        this.AddSmartDataCare(MainFBData.Inst().FlushData, this.FlushDailyChallengeInfo.bind(this), "FlushDailyChallengeInfo");

    }

    InitUI() {
        this.FlushDailyChallengeInfo();
        this.FlushTimeShow();
    }

    FlushDailyChallengeInfo() {
        let info = MainFBData.Inst().DailyChallengeInfo
        let co = MainFBData.Inst().CfgDailyChallengeDataChallengeBossInfo()
        if (co) {
            UH.SetText(this.viewNode.RecordShow, TextHelper.Format(Language.MainFB.RecordShow, MainFBData.Inst().DailyChallengeInfoBattleRound))

            this.viewNode.BtnReward1.SetData({ info: info, co: co, index: 1 })
            this.viewNode.BtnReward2.SetData({ info: info, co: co, index: 2 })
            this.viewNode.BtnReward3.SetData({ info: info, co: co, index: 3 })

            let rule1 = MainFBData.Inst().CfgDailyChallengeDataChallengesRuleInfo(co.rule_id1)
            let rule2 = MainFBData.Inst().CfgDailyChallengeDataChallengesRuleInfo(co.rule_id2)
            let monster1 = MainFBData.Inst().MonsterInfoById(co.monster_id1)
            if (rule1) {
                UH.SetIcon(this.viewNode.CellShow1, `${rule1.rule_type}${rule1.pram1 > 0 ? 1 : 0}`, ICON_TYPE.CHALLENGE_RULE)
            }
            if (rule2) {
                UH.SetIcon(this.viewNode.CellShow2, `${rule2.rule_type}${rule2.pram1 > 0 ? 1 : 0}`, ICON_TYPE.CHALLENGE_RULE)
            }

            if (monster1) {
                this.viewNode.Spine.LoadSpine(ResPath.Monster(monster1.res_id), true);
                this.listData1 = MainFBData.Inst().GetMonsterDefType(monster1);
                this.viewNode.AttrList.itemRenderer = this.itemRenderer1.bind(this);
                this.viewNode.AttrList.numItems = this.listData1.length;
            }
        }

        let list = MainFBData.Inst().GetDailyChallengeHeroList();
        this.viewNode.HeroList.itemRenderer = this.itemRenderer2.bind(this);
        this.viewNode.HeroList.numItems = list.length;
    }

    private itemRenderer2(index: number, item: any) {
        item.SetData(MainFBData.Inst().GetDailyChallengeHeroList()[index]);
    }

    private itemRenderer1(index: number, item: any) {
        item.SetData(this.listData1[index]);
    }

    // private renderListItem(index: number, item: HeroCell) {
    //     item.SetData(this.heroListData[index]);
    // }

    FlushTimeShow() {
        this.viewNode.TimeShow.CloseCountDownTime()
        if (TimeCtrl.Inst().tomorrowStarTime > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.TimeShow.StampTime(TimeCtrl.Inst().tomorrowStarTime, TimeFormatType.TYPE_TIME_0)
            this.viewNode.TimeShow.SetCallBack(this.FlushTimeShow.bind(this))
        }
        else {
            this.viewNode.TimeShow.SetTime("")
        }
    }

    OnClickStart() {
        let co = MainFBData.Inst().CfgDailyChallengeDataChallengeBossInfo();
        BattleCtrl.Inst().EnterBattle(co.barrier_id, SceneType.DayChallenge)
    }

    OnClickTips() {
        ViewManager.Inst().OpenView(MainChallengeBossView)
    }

    OnClickCellShow(index: number) {
        let co = MainFBData.Inst().CfgDailyChallengeDataChallengeBossInfo()
        let co_rule = MainFBData.Inst().CfgDailyChallengeDataChallengesRuleInfo(GetCfgValue(co, `rule_id${index + 1}`))
        ViewManager.Inst().OpenView(MainChallengeAttrView, { x: 125 + index * 300, y: 540, content: TextHelper.Format(co_rule.rule_word, `${co_rule.pram1 > 0 ? "+" : ""}${co_rule.pram1 / 100}%`) })
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        this.viewNode.TimeShow.CloseCountDownTime()
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
    }
}

class ChallengeRewardButton extends BaseItemGB {
    protected viewNode = {
        bg: <fgui.GImage>null,
        redPoint: <RedPoint>null,
    };
    private spShow: UISpineShow = undefined;
    protected onConstruct() {
        super.onConstruct()
        this.onClick(this.OnClickReward, this);
    }

    SetData(data: { info: any, co: any, index: any }) {
        super.SetData(data)
        this.title = data.co.round_num
        let co_task = MainFBData.Inst().CfgDailyChallengeDataChallengesMissionsInfo(GetCfgValue(this._data.co, `mission_id${this._data.index}`))
        let info_get = MainFBData.Inst().GetDailyChallengeGet(this._data.index, co_task)
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
        if (info_get.can_get && !info_get.is_get) {
            this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine(`tiaozhanjuanzhou/tiaozhanjuanzhou`), true, (obj: any) => {
                obj.setPosition(30, -80);
                this._container.insertChild(obj, 1);
            });
            this.viewNode.redPoint.SetNum(1);
            this.viewNode.bg.visible = false
        } else {
            this.viewNode.redPoint.SetNum(0);
            this.viewNode.bg.visible = true
        }
    }

    OnClickReward() {
        if (this._data) {
            let co_task = MainFBData.Inst().CfgDailyChallengeDataChallengesMissionsInfo(GetCfgValue(this._data.co, `mission_id${this._data.index}`))
            let info_get = MainFBData.Inst().GetDailyChallengeGet(this._data.index, co_task)
            if (info_get.can_get && !info_get.is_get) {
                MainFBCtrl.Inst().SendDailyChallengeFetch(this._data.index)
            } else {
                ViewManager.Inst().OpenView(MainChallengeRewardView, { x: 65 + this._data.index * 120, y: 547, content: co_task.mission_word, rewards: GetCfgValue(this._data.co, `win${this._data.index}`) })
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
    }
}

class ChallengeAttrItem extends BaseItemGL {
    SetData(data: { type: any, val: any }) {
        super.SetData(data)
        this.title = `${data.val > 0 ? "-" : "+"}${data.val / 100}%`
        this.icon = fgui.UIPackage.getItemURL("CommonAtlas", `HeroAttr${data.type}`);
    }
}
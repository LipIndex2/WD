
import { GetCfgValue } from "config/CfgCommon";
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseItemCare, BaseItemGB, BaseItemGL } from "modules/common/BaseItem";
import { COLORS } from "modules/common/ColorEnum";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { RedPoint } from "modules/extends/RedPoint";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { MainFBCtrl } from "modules/main_fb/MainFBCtrl";
import { MainFBData } from "modules/main_fb/MainFBData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { MainChallengeAttrView } from "./MainChallengeAttrView";
import { MainChallengeBossView } from "./MainChallengeBossView";
import { MainChallengeRewardView } from "./MainChallengeRewardView";
import { MainViewHeroItem, MainViewHeroItem2 } from "./MainView";
import { HeroDataModel } from "modules/hero/HeroData";

export class MainViewChallenge extends BaseItemCare {
    private spShow: UISpineShow = undefined;
    private heroListData: any[];

    protected viewNode = {
        BtnTips: <fgui.GButton>null,

        BtnReward1: <MainViewChallengeRewardButton>null,
        BtnReward2: <MainViewChallengeRewardButton>null,
        BtnReward3: <MainViewChallengeRewardButton>null,

        CellBg1: <fgui.GLoader>null,
        CellBg2: <fgui.GLoader>null,
        CellShow1: <fgui.GLoader>null,
        CellShow2: <fgui.GLoader>null,

        RecordShow: <fgui.GTextField>null,
        TimeShow: <TimeMeter>null,

        AttrList: <fgui.GList>null,
        HeroList: <fgui.GList>null,
        HeroList2: <fgui.GList>null,
    };
    listData: { type: import("d:/ccs/wjszm-c/assets/script/modules/Battle/BattleConfig").HeroAttriType; val: any; }[];

    InitData() {
        this.viewNode.BtnTips.onClick(this.OnClickTips, this);
        this.viewNode.CellBg1.onClick(this.OnClickCellShow.bind(this, 0));
        this.viewNode.CellBg2.onClick(this.OnClickCellShow.bind(this, 1));

        this.viewNode.HeroList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.HeroList2.itemRenderer = this.renderListItem2.bind(this);

        this.AddSmartDataCare(MainFBData.Inst().FlushData, this.FlushDailyChallengeInfo.bind(this), "FlushDailyChallengeInfo");

    }

    InitUI() {
        this.FlushDailyChallengeInfo();
        this.FlushTimeShow();
    }

    protected onDestroy() {
        super.onDestroy()
        this.viewNode.TimeShow.CloseCountDownTime()
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
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
                if (this.spShow) {
                    this.spShow.onDestroy();
                    this.spShow = null
                }
                this.spShow = ObjectPool.Get(UISpineShow, ResPath.Monster(monster1.res_id), true, (obj: any) => {
                    obj.setPosition(400, -600);
                    this._container.insertChild(obj, 4);
                });
                this.listData = MainFBData.Inst().GetMonsterDefType(monster1);
                this.viewNode.AttrList.itemRenderer = this.itemRenderer.bind(this);
                this.viewNode.AttrList.numItems = MainFBData.Inst().GetMonsterDefType(monster1).length;
            }
        }

        this.heroListData = MainFBData.Inst().GetDailyChallengeHeroList();
        this.viewNode.HeroList.numItems = this.heroListData.length
        this.viewNode.HeroList2.numItems = this.heroListData.length
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    private renderListItem(index: number, item: MainViewHeroItem) {
        item.ItemIndex(index, false);
        item.SetData(this.heroListData[index]);
    }

    private renderListItem2(index: number, item: MainViewHeroItem2) {
        item.ItemIndex(index, false);
        item.SetData(this.heroListData[index]);
    }


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

    OnClickTips() {
        ViewManager.Inst().OpenView(MainChallengeBossView)
    }

    OnClickCellShow(index: number) {
        let co = MainFBData.Inst().CfgDailyChallengeDataChallengeBossInfo()
        let co_rule = MainFBData.Inst().CfgDailyChallengeDataChallengesRuleInfo(GetCfgValue(co, `rule_id${index + 1}`))
        ViewManager.Inst().OpenView(MainChallengeAttrView, { x: 175 + index * 193, y: 540, content: TextHelper.Format(co_rule.rule_word, `${co_rule.pram1 > 0 ? "+" : ""}${co_rule.pram1 / 100}%`) })
    }
}

export class MainViewChallengeRewardButton extends BaseItemGB {
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
                ViewManager.Inst().OpenView(MainChallengeRewardView, { x: 35 + this._data.index * 120, y: 527, content: co_task.mission_word, rewards: GetCfgValue(this._data.co, `win${this._data.index}`) })
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

export class MainViewChallengeAttrItem extends BaseItemGL {
    SetData(data: { type: any, val: any }) {
        super.SetData(data)
        this.title = `${data.val > 0 ? "-" : "+"}${data.val / 100}%`
        this.icon = fgui.UIPackage.getItemURL("CommonAtlas", `HeroAttr${data.type}`);
    }
}
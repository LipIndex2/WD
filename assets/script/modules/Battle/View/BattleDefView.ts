import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { AdType, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { EGLoader } from "modules/extends/EGLoader";
import { HeroData } from "modules/hero/HeroData";
import { Format, TextHelper } from "../../../helpers/TextHelper";
import { UH } from "../../../helpers/UIHelper";
import { UtilHelper } from "../../../helpers/UtilHelper";
import { BattleCtrl } from "../BattleCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { BattleData } from "../BattleData";
import { BattleEventType, BattleSkillType, BattleState } from "../BattleConfig";
import { BattleHarmShowIconType, BattleHarmShowItem, BattleHarmShowLabel, BattleSkillSelect, BattleSkillSelectItem, BossHeadInfo } from "../BattleView";
import { SmallObjPool } from "core/SmallObjPool";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { ViewManager } from "manager/ViewManager";
import { BattlePauseView } from "../BattlePauseView";
import { EventCtrl } from "modules/common/EventCtrl";
import { Prefskey } from "modules/common/PrefsKey";
import { RoleData } from "modules/role/RoleData";
import { CfgSkillData } from "config/CfgEntry";
import { ChannelAgent } from "../../../proload/ChannelAgent";
import { SelectSkillAction } from "../BattleAction";
import { HeroSkillCell } from "modules/common_item/HeroSkillCellItem";
import { BattleHarmInfoView } from "./BattleHarmInfoView";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { LogError } from "core/Debugger";
import { BattleDefGuideView } from "./BattleDefGuideView";
import { HeroItem } from "modules/extends/HeroCell";

@BaseView.registView
export class BattleDefView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Battle",
        ViewName: "BattleDefView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        SkillSelect: <BattleSkillSelect>null,
        StartGameBtn: <fgui.GButton>null,
        HeroBtn: <fgui.GButton>null,
        List: <fgui.GList>null,
        HpProgerssBar: <fgui.GProgressBar>null,
        ExProgress: <fgui.GProgressBar>null,
        HpNum: <fgui.GTextField>null,
        SubHpEffect: <UIEffectShow>null,
        HpEffect: <UIEffectShow>null,
        FlushBtn: <fgui.GButton>null,
        PauseBtn: <fgui.GButton>null,
        AddSpeedBtn: <fgui.GButton>null,
        RoundNum: <fgui.GTextField>null,
        BGEffect: <UIEffectShow>null,
        ExFillEffect: <UIEffectShow>null,
        SkillGetTip: <fgui.GLabel>null,
        HpInfo: <fgui.GGroup>null,
        HarmInfoBtn: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "HeroItem", ExtendsClass: BattleDefSelectHeroItem },
        { ResName: "BossHeadInfo", ExtendsClass: BossHeadInfo },
        { ResName: "HarmShowItem", ExtendsClass: BattleHarmShowItem },
        { ResName: "HarmShowLabal", ExtendsClass: BattleHarmShowLabel },
        { ResName: "SkillSelect", ExtendsClass: BattleSkillSelect },
        { ResName: "SkillItem", ExtendsClass: BattleSkillSelectItem },

        // { ResName: "RoundInfo", ExtendsClass: BattleRountInfoItem },
        // { ResName: "RoundProgress", ExtendsClass: BattleRountProgressItem },
        // { ResName: "RoundItem", ExtendsClass: BattleRountItem },
        // { ResName: "MonsterDesc", ExtendsClass: MonsterDescItem },
    ];

    private harmItemPool: SmallObjPool<BattleHarmShowItem>;

    private onSelectAnimation: fgui.Transition;
    private OffSelectAnimation: fgui.Transition;
    private onSelect: boolean = false;
    private heroInfoList: IPB_HeroNode[];


    // 指引按钮
    private _guideHeroBtn: fgui.GObject;
    private get guideHeroBtn(): fgui.GObject {
        if (this._guideHeroBtn == null) {
            let herobtn = <fgui.GButton>fgui.UIPackage.createObject("Battle", "HeroBtn").asCom;
            this.addChild(herobtn);
            herobtn.setPosition(this.viewNode.HeroBtn.x, this.viewNode.HeroBtn.y);
            herobtn.onClick(() => {
                this.OnHeroClick();
                herobtn.visible = false;
            });
            this._guideHeroBtn = herobtn;
        }
        return this._guideHeroBtn;
    }

    private _guideHeroItem: BattleDefSelectHeroItem;
    private get guideHeroItem(): BattleDefSelectHeroItem {
        if (this._guideHeroItem == null) {
            let heroItem = <BattleDefSelectHeroItem>fgui.UIPackage.createObject("Battle", "HeroItem").asCom;
            this.addChild(heroItem);
            this._guideHeroItem = heroItem;
            heroItem.onClick(() => {
                heroItem.visible = false;
                this.OnItemClick(heroItem);
                if (RoleData.Inst().IsGuideNum(11)) {
                    this.ShowHeroItemGuide();
                } else {
                    ViewManager.Inst().OpenView(BattleDefGuideView);
                }
            });
        }
        return this._guideHeroItem;
    }

    private _guideStartGameBtn: fgui.GButton;
    private get guideStartGameBtn(): fgui.GObject {
        if (this._guideStartGameBtn == null) {
            let btn = <fgui.GButton>fgui.UIPackage.createObject("CommonButton", "ButtonOrange").asCom;
            this.addChild(btn);
            btn.setPosition(this.viewNode.StartGameBtn.x, this.viewNode.StartGameBtn.y);
            btn.title = Language.DefenseHome.StartGame;
            btn.onClick(() => {
                btn.visible = false;
            });
            this._guideStartGameBtn = btn;
        }
        return this._guideStartGameBtn;
    };

    InitData() {
        this.AddSmartDataCare(BattleData.Inst().otherInfo, this.CenterHarmTip.bind(this), "harmTipList");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushSpeedScale.bind(this), "globalTimeScaleShow");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushRound.bind(this), "roundProgerss");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushHp.bind(this), "hp", "maxHp");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushExp.bind(this), "exp", "level");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushSelectSkillList.bind(this), "skillSelectList");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushGameState.bind(this), "battleState");


        this.viewNode.SkillSelect.SetItemClick(this.OnSkillSelectClick.bind(this));
        this.viewNode.HeroBtn.onClick(this.OnHeroClick, this);
        this.viewNode.StartGameBtn.onClick(this.OnStartGameClick, this);
        this.viewNode.PauseBtn.onClick(this.OnPauseClick.bind(this));
        this.viewNode.AddSpeedBtn.onClick(this.OnAddSpeedClick.bind(this));
        this.viewNode.FlushBtn.onClick(this.OnFlushBtnClick.bind(this));
        this.viewNode.HarmInfoBtn.onClick(this.OnHarmInfoClick.bind(this));

        this.onSelectAnimation = this.view.getTransition("on_select");
        this.OffSelectAnimation = this.view.getTransition("off_select");

        this.viewNode.List.on(fgui.Event.CLICK_ITEM, this.OnItemClick, this);

        this.harmItemPool = new SmallObjPool(undefined, 150);
        this.harmItemPool.isNode = false;
        this.harmItemPool.SetCreateFunc(() => {
            let tipItem = <BattleHarmShowItem>fgui.UIPackage.createObject("Battle", "HarmShowItem").asCom;
            this.addChild(tipItem);
            return tipItem;
        })
        this.harmItemPool.SetDestroyFunc((item: BattleHarmShowItem) => {
            item.dispose();
            item = null;
        })

        if (BattleCtrl.Inst().adapterBattleScene) {
            BattleCtrl.Inst().adapterBattleScene.dynamic.SetPreloadPool(this.harmItemPool, 10);
        }
    }

    OpenCallBack() {
        this.InitExpProgress();

        this.FlushHeroList();

        this.ReSetWindowSize();
        this.FlushRound();
        this.FlushHp();
        this.FlushExp();
        this.FlushSpeedScale();
        this.FlushGameState();

        if (RoleData.Inst().IsGuideNum(10)) {
            GuideCtrl.Inst().AddGuideUi("BattleDefViewHeroBtn", this.guideHeroBtn);
            GuideCtrl.Inst().Start(10);
        }
    }

    CloseCallBack() {
        if (this.harmItemPool) {
            this.harmItemPool.Clear();
            this.harmItemPool = null;
        }

        GuideCtrl.Inst().ClearGuideUi("BattleDefViewHeroBtn");
        GuideCtrl.Inst().ClearGuideUi("BattleDefViewStartGameBtn");
        GuideCtrl.Inst().ClearGuideUi("BattleDefViewHeroItem");
    }


    // 触发开始游戏指引
    TriggerGameStartGuide() {
        if (RoleData.Inst().IsGuideNum(12)) {
            GuideCtrl.Inst().AddGuideUi("BattleDefViewStartGameBtn", this.guideStartGameBtn);
            GuideCtrl.Inst().Start(12);
        }
    }

    ShowHeroItemGuide() {
        this.guideHeroItem.visible = true;
        let globalPos = this.viewNode.List.localToGlobal();
        let pos = this.view.globalToLocal(globalPos.x, globalPos.y);
        this.guideHeroItem.setPosition(pos.x, pos.y);
        this.guideHeroItem.SetData(this.heroInfoList[0]);

        GuideCtrl.Inst().AddGuideUi("BattleDefViewHeroItem", this.guideHeroItem);
    }

    FlushHeroList() {
        if (this.heroInfoList == null) {
            this.heroInfoList = [];
            let scene = BattleCtrl.Inst().battleSceneDef;
            HeroData.Inst().HeroList.forEach(v => {
                if (scene && !scene.IsInScene(v)) {
                    this.heroInfoList.push(v);
                }
            })
        }
        this.heroInfoList.sort((a, b) => {
            let aLevel = a.heroLevel;
            let bLevel = b.heroLevel;
            if (aLevel != bLevel) {
                return bLevel - aLevel;
            } else {
                let aColor = HeroData.Inst().GetHeroBaseCfg(a.heroId).hero_color;
                let bColor = HeroData.Inst().GetHeroBaseCfg(b.heroId).hero_color;
                return bColor - aColor;
            }
        })
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = this.heroInfoList.length;
    }

    private itemRenderer(index: number, item: HeroItem) {
        item.SetData(this.heroInfoList[index] as any);
    }

    OnHeroClick() {
        if (ViewManager.Inst().IsOpen(BattleDefGuideView)) {
            return;
        }

        if (this.OffSelectAnimation.playing || this.onSelectAnimation.playing) {
            return;
        }
        let scene = BattleCtrl.Inst().battleSceneDef;
        if (scene == null || scene.isMoveAnimating) {
            return;
        }
        if (this.onSelect) {
            this.OffSelectAnimation.play();
            this.onSelect = false;
        } else {
            this.onSelectAnimation.play(() => {
                if (RoleData.Inst().IsGuideNum(11, false)) {
                    this.ShowHeroItemGuide();
                    GuideCtrl.Inst().Start(11);
                }
            });
            this.onSelect = true;
        }
        scene.MoveNodeAnimation(this.onSelect);
    }

    OnStartGameClick() {
        if (ViewManager.Inst().IsOpen(BattleDefGuideView)) {
            return;
        }

        if (BattleCtrl.Inst().battleSceneDef.heroBattleCount < 1) {
            PublicPopupCtrl.Inst().Center(Language.DefenseHome.Tip3);
            return;
        }

        BattleCtrl.Inst().battleSceneDef.SetInFightHeros();

        let scene = BattleCtrl.Inst().battleSceneDef;
        if (this.onSelect) {
            this.OffSelectAnimation.play(() => {
                scene.StartGame();
            });
            this.onSelect = false;
            scene.MoveNodeAnimation(this.onSelect);
        } else {
            scene.StartGame();
        }
    }

    OnItemClick(item: BattleDefSelectHeroItem) {
        if (ViewManager.Inst().IsOpen(BattleDefGuideView)) {
            return;
        }
        let data = item.GetData();
        let scene = BattleCtrl.Inst().battleSceneDef;
        if (scene) {
            let result = scene.PutHero(data);
            if (result) {
                UtilHelper.ArrayRemove(this.heroInfoList, data);
                this.FlushHeroList();
            } else {
                PublicPopupCtrl.Inst().Center(Language.DefenseHome.Tip4);
            }
        }
    }

    PutData(data: IPB_HeroNode) {
        if (data == null) {
            return;
        }
        this.heroInfoList.splice(0, 0, data)
        this.FlushHeroList();
    }

    ////////////////////////////// 下面是之前 battleview 的逻辑，复制来的 ///////////////

    FlushSelectSkillList() {
        let listData = BattleData.Inst().GetSelectSkillList();
        if (listData != null && listData.length > 0) {
            if (listData.length == 3) {
                this.viewNode.SkillSelect.isCanClick = true;
                this.viewNode.SkillSelect.visible = true;
                this.viewNode.FlushBtn.visible = BattleData.Inst().randomSkillRecord != null && RoleData.Inst().IsCanAD(AdType.battle_flush_skill);
                this.viewNode.SkillSelect.SetData(listData);
                EventCtrl.Inst().emit(BattleEventType.SetSelectSkill);
            }
        } else if (this.viewNode.SkillSelect.visible) {
            this.viewNode.SkillSelect.visible = false;
            this.viewNode.FlushBtn.visible = false;
        }
    }

    FlushGameState() {
        let state = BattleData.Inst().battleInfo.GetBattleState();
        if (state == BattleState.Figth) {
            this.viewNode.BGEffect.PlayEff("1208004");
        } else {
            this.viewNode.BGEffect.StopEff("1208004");
        }

        this.viewNode.ExProgress.visible = state == BattleState.Figth;
        this.viewNode.HpInfo.visible = state == BattleState.Figth;
        this.viewNode.StartGameBtn.visible = state != BattleState.Figth;
        this.viewNode.HeroBtn.visible = state != BattleState.Figth;
    }

    InitExpProgress() {
        this.viewNode.ExProgress.min = 0;
        this.viewNode.ExProgress.titleType = fgui.ProgressTitleType.Percent;
    }
    FlushExp() {
        let expCfg = BattleData.Inst().battleInfo.ExpCfg();
        this.viewNode.ExProgress.max = expCfg.battle_exp;
        let exp = BattleData.Inst().battleInfo.GetExp();
        this.viewNode.ExProgress.tweenValue(exp, 0.3);
        if (exp >= this.viewNode.ExProgress.max) {
            this.viewNode.ExFillEffect.PlayEff("1203003");
        }
    }

    private lastHp: number;
    FlushHp() {
        let hp = BattleData.Inst().battleInfo.GetHP();
        let maxHp = BattleData.Inst().battleInfo.maxHp;
        this.viewNode.HpProgerssBar.min = 0;
        this.viewNode.HpProgerssBar.max = maxHp;
        this.viewNode.HpProgerssBar.tweenValue(hp, 0.5);
        UH.SetText(this.viewNode.HpNum, hp + "/" + maxHp);

        if (this.lastHp != null) {
            if (hp > this.lastHp) {
                this.viewNode.HpEffect.PlayEff("1208009");
            } else if (hp < this.lastHp) {
                this.viewNode.SubHpEffect.PlayEff("1208043");
            }
        }
        this.lastHp = hp;
    }

    FlushSpeedScale() {
        let num = BattleData.Inst().battleInfo.globalTimeScaleShow;
        this.viewNode.AddSpeedBtn.title = num.toString();
    }

    FlushRound() {
        let battleInfo = BattleData.Inst().battleInfo;
        UH.SetText(this.viewNode.RoundNum, battleInfo.roundProgerss + "/" + battleInfo.roundProgerssMax)
    }

    // 伤害飘字
    CenterHarmTip() {
        let list = BattleData.Inst().otherInfo.harmTipList;
        if (list.length < 1) {
            return;
        }
        list.forEach(v => {
            let tipItem = this.harmItemPool.Get();
            tipItem.visible = true;
            if (v.iconType == BattleHarmShowIconType.baoji || v.iconType == BattleHarmShowIconType.zhongji) {
                tipItem.setScale(2.5, 2.5);
            }
            tipItem.SetData(v);
            tipItem.SetEndCallback(this.HramTipEndCallback.bind(this));
        })
        BattleData.Inst().ClearHarmTip();
    }
    HramTipEndCallback(item: BattleHarmShowItem) {
        item.setPosition(0, 0);
        item.setScale(1, 1);
        this.harmItemPool.Put(item);
    }

    OnPauseClick() {
        let battleInfo = BattleData.Inst().battleInfo;
        if (battleInfo.isPause || battleInfo.isGuiding) {
            return;
        }
        ViewManager.Inst().OpenView(BattlePauseView);
    }

    OnAddSpeedClick() {
        let num = BattleData.Inst().battleInfo.globalTimeScaleShow;
        num++;
        if (num > BattleData.Inst().MaxSpeedScale()) {
            num = 1;
        }
        BattleData.Inst().battleInfo.globalTimeScaleShow = num;
        EventCtrl.Inst().emit(BattleEventType.Speed, num);

        let k = Prefskey.GetBattleSpeedScaleKey();
        Prefskey.SetValue(k, num);
    }

    OnSkillSelectClick(data: CfgSkillData) {
        let action = SelectSkillAction.Create(data);
        BattleCtrl.Inst().PushAction(action);
        this.viewNode.SkillGetTip.visible = true;

        if (data.skill_type == BattleSkillType.AddHarm) {
            let desc = TextHelper.Format(data.word, Math.floor(BattleData.Inst().battleInfo.skillAttri.harmPercent * 100));
            this.viewNode.SkillGetTip.title = desc;
        }
        else if (data.skill_type == BattleSkillType.AddAttackSpeed) {
            let desc = TextHelper.Format(data.word, Math.floor(BattleData.Inst().battleInfo.skillAttri.attackSpeedPercent * 100));
            this.viewNode.SkillGetTip.title = desc;
        }
        else {
            this.viewNode.SkillGetTip.title = HeroSkillCell.GetDesc(data);
        }
        this.view.getTransition("get_skill_tip").play();
        BattleData.Inst().randomSkillRecord = null;
    }

    //播放广告看词条
    OnFlushBtnClick() {
        if (BattleData.Inst().randomSkillRecord != null) {
            ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.battle_flush_skill), "");
        }
    }

    OnHarmInfoClick() {
        if (ViewManager.Inst().IsOpen(BattleHarmInfoView)) {
            ViewManager.Inst().CloseView(BattleHarmInfoView);
        } else {
            ViewManager.Inst().OpenView(BattleHarmInfoView);
        }
    }
}

export class BattleDefSelectHeroItem extends BaseItem {
    protected viewNode = {
        BG: <EGLoader>null,
        Level: <fgui.GTextField>null,
        HeroIcon: <EGLoader>null,
        RaceIcon: <EGLoader>null,
    };

    protected onConstruct(): void {
        super.onConstruct();
    }

    public SetData(data: IPB_HeroNode): void {
        this._data = data;
        let cfg = HeroData.Inst().GetHeroBaseCfg(data.heroId);
        let levelCfg = HeroData.Inst().GetHeroLevelCfg(data.heroId, data.heroLevel);
        let color = cfg.hero_color;
        UH.SpriteName(this.viewNode.BG, "CommonAtlas", "HeroBgPinZhi" + color);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + cfg.hero_race);
        UH.SetIcon(this.viewNode.HeroIcon, levelCfg.res_id, ICON_TYPE.ROLE, null, true);
        UH.SetText(this.viewNode.Level, Language.DefenseHome.Level + data.heroLevel);
    }
}
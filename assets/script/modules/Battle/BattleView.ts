import { CfgSkillData } from "config/CfgEntry";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { UH } from "../../helpers/UIHelper";
import { SelectSkillAction } from "./BattleAction";
import { BattleEventType, BattleHarmFont, BattleSkillType, BattleState, MonsterHarmType, SceneType, SP_SKILL_ID_A } from "./BattleConfig";
import { BattleCtrl } from "./BattleCtrl";
import { BattleData, ICenterStepNumTipData } from "./BattleData";
import { BattlePauseView } from "./BattlePauseView";
import { EventCtrl } from "modules/common/EventCtrl";
import { UtilHelper } from "../../helpers/UtilHelper";
import { Vec3, sys } from "cc";
import { SmallObjPool } from "core/SmallObjPool";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { CfgMonsterData } from "config/CfgMonster";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { AdType, ICON_TYPE } from "modules/common/CommonEnum";
import { Format, TextHelper } from "../../helpers/TextHelper";
import { HeroSkillCell } from "modules/common_item/HeroSkillCellItem";
import { ChannelAgent, GameToChannel } from "../../proload/ChannelAgent";
import { Prefskey } from "modules/common/PrefsKey";
import { RoleData } from "modules/role/RoleData";
import { BattleHarmInfoView } from "./View/BattleHarmInfoView";
import { BattleSpCellInfoView2 } from "./View/BattleSpCellInfoView2";
import { LH, Language } from "modules/common/Language";
import { ProgressTitleType } from "fairygui-cc";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { DialogTipsToggle, DialogTipsToggleKey } from "modules/public_popup/PublicPopupData";
import { BattleFreeSpeedView } from "./View/BattleFreeSpeedView";
import { SevenDayHeroData } from "modules/seven_day_hero/SevenDayHeroData";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { Mod } from "modules/common/ModuleDefine";
import { CfgSupplyCardData } from "config/CfgSupplyCard";
import { SevenDayHeroView } from "modules/seven_day_hero/SevenDayHeroView";
import { CfgHero } from "config/CfgHero";
import { HeroData } from "modules/hero/HeroData";
import { RoundItem } from "modules/RoundActivity/RoundActivityView";

@BaseView.registView
export class BattleView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Battle",
        ViewName: "BattleView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.None,
    };

    protected viewNode = {
        SkillSelect: <BattleSkillSelect>null,
        FlushBtn: <fgui.GButton>null,
        PauseBtn: <fgui.GButton>null,
        StepInfo: <fgui.GLabel>null,
        RoundNum: <fgui.GTextField>null,
        HpProgerssBar: <fgui.GProgressBar>null,
        HpNum: <fgui.GTextField>null,
        ExProgress: <fgui.GProgressBar>null,
        SkillGetTip: <fgui.GLabel>null,
        HpEffect: <UIEffectShow>null,
        MonterDesc: <MonsterDescItem>null,
        RoundInfo: <BattleRountInfoItem>null,
        DiJunLaiXiEffect: <UIEffectShow>null,
        BGEffect: <UIEffectShow>null,
        AddSpeedBtn: <fgui.GButton>null,
        LeftTop: <fgui.GGroup>null,
        SubHpEffect: <UIEffectShow>null,
        NewPlayerTip: <fgui.GLabel>null,
        HarmInfoBtn: <fgui.GButton>null,
        SpCellBtn: <fgui.GButton>null,
        ExFillEffect: <UIEffectShow>null,
        RemainStepTip: <fgui.GLabel>null,
        FreeSpeedBtn: <BattleFreeSpeedBtn>null,
        ActApeedBtn: <BattleActBtn>null,
        Mask: <fgui.GObject>null,
    };

    GetViewNode() {
        return this.viewNode;
    }

    protected extendsCfg = [
        { ResName: "SkillItem", ExtendsClass: BattleSkillSelectItem },
        { ResName: "StepTip", ExtendsClass: BattleStepAddTipItem },
        { ResName: "HarmShowItem", ExtendsClass: BattleHarmShowItem },
        { ResName: "HarmShowLabal", ExtendsClass: BattleHarmShowLabel },
        { ResName: "RoundInfo", ExtendsClass: BattleRountInfoItem },
        { ResName: "RoundProgress", ExtendsClass: BattleRountProgressItem },
        { ResName: "RoundItem", ExtendsClass: BattleRountItem },
        { ResName: "BossHeadInfo", ExtendsClass: BossHeadInfo },
        { ResName: "MonsterDesc", ExtendsClass: MonsterDescItem },
        { ResName: "SkillSelect", ExtendsClass: BattleSkillSelect },
        { ResName: "ActBtn", ExtendsClass: BattleActBtn },
        { ResName: "FreeSpeedBtn", ExtendsClass: BattleFreeSpeedBtn },
    ];

    private stateCtrl: fgui.Controller;
    private harmItemPool: SmallObjPool<BattleHarmShowItem>;
    private jumpStepBtn: fgui.GButton;

    InitData() {
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushSelectSkillList.bind(this), "skillSelectList");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushStep.bind(this), "stepNum");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushRound.bind(this), "roundProgerss");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushGameState.bind(this), "battleState");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushHp.bind(this), "hp", "maxHp");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushExp.bind(this), "exp", "level");
        this.AddSmartDataCare(BattleData.Inst().otherInfo, this.CenterStepTip.bind(this), "stepTipList");
        this.AddSmartDataCare(BattleData.Inst().otherInfo, this.CenterSkillAddStep.bind(this), "skillAddStep");
        this.AddSmartDataCare(BattleData.Inst().otherInfo, this.CenterHarmTip.bind(this), "harmTipList");
        this.AddSmartDataCare(BattleData.Inst().otherInfo, this.ShowMonsterTip.bind(this), "monsterTipList");
        this.AddSmartDataCare(BattleData.Inst().otherInfo, this.RoundInfoShow.bind(this), "rountInfoTip");
        this.AddSmartDataCare(BattleData.Inst().otherInfo, this.MonsterAttackTip.bind(this), "monsterAttackTip");
        this.AddSmartDataCare(BattleData.Inst().otherInfo, this.ShowNewPlayerTip.bind(this), "newPlayerTip");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushSpeedScale.bind(this), "globalTimeScaleShow");
        this.AddSmartDataCare(SevenDayHeroData.Inst().FlushData, this.FlushActBtn.bind(this), "FlushInfo");

        this.jumpStepBtn = this.viewNode.StepInfo.getChild("JumpStepBtn");

        this.jumpStepBtn.onClick(this.OnJumpStepClick.bind(this));
        this.viewNode.SkillSelect.SetItemClick(this.OnSkillSelectClick.bind(this));
        this.viewNode.PauseBtn.onClick(this.OnPauseClick.bind(this));
        this.viewNode.AddSpeedBtn.onClick(this.OnAddSpeedClick.bind(this));
        this.viewNode.FlushBtn.onClick(this.OnFlushBtnClick.bind(this));
        this.viewNode.HarmInfoBtn.onClick(this.OnHarmInfoClick.bind(this));
        this.viewNode.SpCellBtn.onClick(this.OnSpCellClick.bind(this));
        this.viewNode.FreeSpeedBtn.onClick(this.OnFreeSpeedClick, this);
        this.viewNode.ActApeedBtn.onClick(this.OnActSpeedClick, this);

        this.stateCtrl = this.view.getController("battle_state");
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

        EventCtrl.Inst().on(BattleEventType.Pause, this.OnPause, this);

        if (BattleCtrl.Inst().battleScene) {
            BattleCtrl.Inst().battleScene.dynamic.SetPreloadPool(this.harmItemPool, 10);
        }

        let spCfg = BattleCtrl.Inst().battleScene.data.spe_block;
        this.viewNode.SpCellBtn.visible = spCfg != null && spCfg.length > 0
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
        this.ReSetWindowSize();
        this.FlushSelectSkillList();
        this.FlushStep()
        this.FlushRound();
        this.FlushHp();
        this.FlushExp();
        this.FlushSpeedScale();
        this.FlushGameState();
        this.InitExpProgress();
    }

    CloseCallBack() {
        if (this.timeOut) {
            clearTimeout(this.timeOut)
            this.timeOut = null;
        }
        if (this.timeOut2) {
            clearTimeout(this.timeOut2)
            this.timeOut2 = null;
        }
        if (this.harmItemPool) {
            this.harmItemPool.Clear();
            this.harmItemPool = null;
        }

        if (this.moveBtnTw) {
            this.moveBtnTw.kill();
        }

        if (this.moveBtnTimeht) {
            clearTimeout(this.moveBtnTimeht)
            this.moveBtnTimeht = null;
        }

        EventCtrl.Inst().off(BattleEventType.Pause, this.OnPause, this);
    }

    FlushGameState() {
        let state = BattleData.Inst().battleInfo.GetBattleState();
        this.stateCtrl.setSelectedIndex(state);

        if (state == BattleState.Figth) {
            this.viewNode.BGEffect.PlayEff("1208004");
        } else {
            this.viewNode.BGEffect.StopEff("1208004");
        }

        this.viewNode.ExProgress.visible = state == BattleState.Figth && BattleData.Inst().battleInfo.sceneType != SceneType.RunRunRun
        this.FlushJumpStepBtn();
    }

    FlushSelectSkillList() {
        let listData = BattleData.Inst().GetSelectSkillList();
        if (listData != null && listData.length > 0) {
            if (listData.length == 3) {
                this.viewNode.SkillSelect.isCanClick = true;
                this.viewNode.SkillSelect.visible = true;
                this.viewNode.FlushBtn.visible = false// BattleData.Inst().randomSkillRecord != null && RoleData.Inst().IsCanAD(AdType.battle_flush_skill);
                this.viewNode.SkillSelect.SetData(listData);
                EventCtrl.Inst().emit(BattleEventType.SetSelectSkill);
            } else if (listData.length == 1) {
                this.viewNode.SkillSelect.ShowOnceItem(listData[0]);
                this.viewNode.SkillSelect.isCanClick = false;
                this.view.getTransition("show_save_skill").play(() => {
                    BattleData.Inst().SetSelectSkillList(null);
                    EventCtrl.Inst().emit(BattleEventType.Pause, false);
                    BattleCtrl.Inst().battleScene.HandleBoxList();
                });
            }
            if (this.curMonsterTipData != null) {
                if (this.curMonsterTipAnim) {
                    this.view.getTransition("monster_tip").stop();
                }
                BattleData.Inst().AddMonsterTip(this.curMonsterTipData);
                this.viewNode.MonterDesc.visible = false;
                this.curMonsterTipData = null;
            }
        } else if (this.viewNode.SkillSelect.visible) {
            this.viewNode.SkillSelect.visible = false;
            this.viewNode.FlushBtn.visible = false;
        }
    }

    private remainStepTipAnim: fgui.Transition;
    FlushStep() {
        let step = BattleData.Inst().battleInfo.GetStepNum();
        UH.SetText(this.viewNode.StepInfo, step)

        this.FlushJumpStepBtn();


        if (step <= 5 && step > 0 && BattleData.Inst().battleInfo.GetBattleState() == BattleState.SanXiao) {
            this.viewNode.RemainStepTip.visible = true;
            UH.SetText(this.viewNode.RemainStepTip, Format(Language.Battle.Text4, step));
            if (this.remainStepTipAnim == null) {
                this.remainStepTipAnim = this.view.getTransition("remain_step_tip");
            }
            this.remainStepTipAnim.play();
        } else {
            this.viewNode.RemainStepTip.visible = false;
        }
    }

    FlushJumpStepBtn() {
        let battleInfo = BattleData.Inst().battleInfo;
        let step = battleInfo.GetStepNum();
        let round = battleInfo.roundProgerss;
        this.jumpStepBtn.visible = step > 0 && round > 5 && battleInfo.GetBattleState() == BattleState.SanXiao;
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

    FlushRound() {
        UH.SetText(this.viewNode.RoundNum, BattleData.Inst().battleInfo.roundProgerss)
        this.FlushJumpStepBtn();
    }

    InitExpProgress() {
        this.viewNode.ExProgress.min = 0;
        this.viewNode.ExProgress.titleType = ProgressTitleType.Percent;
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

    FlushSpeedScale() {
        let num = BattleData.Inst().battleInfo.globalTimeScaleShow;
        this.viewNode.AddSpeedBtn.title = num.toString();
        this.viewNode.FreeSpeedBtn.visible = this.isShowFreeBtn();
        this.viewNode.ActApeedBtn.visible = this.isShowActBtn();
        let posX = this.viewNode.SpCellBtn.visible ? 140 : 35;
        if (this.viewNode.ActApeedBtn.visible) {
            let data = this.viewNode.ActApeedBtn.GetData();
            if (data == null) {
                let btnData = new BattleActBtnData();
                btnData.spinePath = "card/card";
                this.viewNode.ActApeedBtn.SetData(btnData);
            }
            this.viewNode.ActApeedBtn.x = posX;
        }
        if (this.viewNode.FreeSpeedBtn.visible) {
            this.viewNode.FreeSpeedBtn.Show();
            this.viewNode.FreeSpeedBtn.x = posX;
        }
    }

    FlushActBtn() {
        if (this.viewNode.ActApeedBtn.visible && SevenDayHeroData.Inst().IsBuy) {
            if (ViewManager.Inst().IsOpen(SevenDayHeroView)) {
                ViewManager.Inst().CloseView(SevenDayHeroView);
            }
            this.PlayActSpeedBtn();
        }
    }

    private isShowActBtn(): boolean {
        return false;
        // let key = Prefskey.GetBattleFreeSpeedKey();
        // let flag = sys.localStorage.getItem(key);
        // if(flag != "1"){
        //     return false;
        // }
        // if(BattleData.Inst().battleInfo.isFreeSpeed3){
        //     return false;
        // }
        // if(SevenDayHeroData.Inst().IsBuy){
        //     return false;
        // }
        // let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.SevenDayHero.View);
        // if(isOpen == null || !isOpen.is_open){
        //     return false;
        // }
        // return true;
    }
    private isShowFreeBtn(): boolean {
        return false;

        // if(!RoleData.Inst().IsCanAD(AdType.battle_speed)){
        //     return false;
        // }

        // let key = Prefskey.GetBattleFreeSpeedKey();
        // let flag = sys.localStorage.getItem(key);
        // if(flag == "1"){
        //     return false;
        // }

        // if(BattleData.Inst().battleInfo.isFreeSpeed3 == true){
        //     return false;
        // }
        // if(SevenDayHeroData.Inst().IsBuy){
        //     return false;
        // }
        // let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.BattleFreeSpeed.View);
        // if(isOpen == null || !isOpen.is_open){
        //     return false;
        // }
        // return true;
    }

    //播放广告看词条
    OnFlushBtnClick() {
        if (BattleData.Inst().randomSkillRecord != null) {
            ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.battle_flush_skill), "");
        }
    }

    CenterStepTip() {
        let list = BattleData.Inst().otherInfo.stepTipList;
        if (list.length < 1) {
            return;
        }
        list.forEach(v => {
            let tipItem = <BattleStepAddTipItem>fgui.UIPackage.createObject("Battle", "StepTip").asCom;
            this.addChild(tipItem);
            tipItem.SetData(v);
        })
        BattleData.Inst().ClearCenterStepTip();
    }

    //词条选择增加步数，左上角飘提示
    CenterSkillAddStep() {
        let num = BattleData.Inst().otherInfo.skillAddStep;
        if (num <= 0) {
            return;
        }
        let Text = <fgui.GTextField>this.viewNode.StepInfo.getChild("AddTip");
        UH.SetText(Text, "+" + num);
        this.viewNode.StepInfo.getTransition("tip_anim").play();
        BattleData.Inst().otherInfo.skillAddStep = 0;
    }

    private poolList: { [key: string]: any } = {};

    CenterHarmTip() {
        let list = BattleData.Inst().otherInfo.harmTipList;
        if (list.length < 1) {
            return;
        }
        list.forEach(v => {
            let tipItem = this.harmItemPool.Get(); //<BattleHarmShowItem>fgui.UIPackage.createObject("Battle", "HarmShowItem").asCom;
            tipItem.visible = true;
            if (v.iconType == BattleHarmShowIconType.baoji || v.iconType == BattleHarmShowIconType.zhongji) {
                tipItem.setScale(2.5, 2.5);
            }
            tipItem.SetData(v);
            tipItem.SetEndCallback(this.HramTipEndCallback.bind(this));
            this.poolList[tipItem.node.uuid] = tipItem;
        })
        BattleData.Inst().ClearHarmTip();
    }

    HramTipEndCallback(item: BattleHarmShowItem) {
        //item.visible = false
        item.setPosition(0, 0);
        item.setScale(1, 1);
        this.harmItemPool.Put(item);

        item.node && (delete this.poolList[item.node.uuid]);
    }

    //怪物介绍展示
    private curMonsterTipData: CfgMonsterData;
    private curMonsterTipAnim: fgui.Transition;
    ShowMonsterTip() {
        let list = BattleData.Inst().otherInfo.monsterTipList;
        if (list.length == 0 || this.curMonsterTipData != null || BattleData.Inst().GetSelectSkillList() != null) {
            return;
        }
        let data = list.pop();
        this.curMonsterTipData = data;
        this.viewNode.MonterDesc.SetData(data);
        this.curMonsterTipAnim = this.view.getTransition("monster_tip");
        this.curMonsterTipAnim.play(() => {
            this.curMonsterTipData = null;
            this.ShowMonsterTip();
        })
    }

    //回合信息展示
    RoundInfoShow() {
        let data = BattleData.Inst().otherInfo.rountInfoTip;
        if (data == null) {
            return
        }
        //LogError("回合信息展示", data);
        this.viewNode.RoundInfo.visible = true;
        this.viewNode.RoundInfo.SetData(data);
        this.view.getTransition("round_info").play();
    }

    //敌军来袭提示
    MonsterAttackTip() {
        if (BattleData.Inst().otherInfo.monsterAttackTip != true) {
            return;
        }
        this.viewNode.DiJunLaiXiEffect.PlayEff("1208013");
        BattleData.Inst().otherInfo.monsterAttackTip = false;
    }

    //新手五消提示
    ShowNewPlayerTip() {
        this.view.getTransition("new_player_tip").play();
    }

    private timeOut: any;
    private timeOut2: any;
    //OnSkillSelectClick(item:BattleSkillSelectItem){
    OnSkillSelectClick(data: CfgSkillData) {
        let action = SelectSkillAction.Create(data);
        BattleCtrl.Inst().PushAction(action);
        this.viewNode.SkillGetTip.visible = true;

        if (data.skill_type == BattleSkillType.AddHarm) {
            let value = BattleData.Inst().battleInfo.skillAttri.harmPercent;
            let real_att = CfgHero.attr_open[0].real_att ?? 1;
            let damAdd = (HeroData.Inst().GetAllHeroDamage() * real_att) / 10000;
            value -= damAdd;
            let desc = TextHelper.Format(data.word, Math.floor(value * 100));
            this.viewNode.SkillGetTip.title = desc;
        }
        else if (data.skill_type == BattleSkillType.AddAttackSpeed) {
            let desc = TextHelper.Format(data.word, Math.floor(BattleData.Inst().battleInfo.skillAttri.attackSpeedPercent * 100));
            this.viewNode.SkillGetTip.title = desc;
        }
        else {
            this.viewNode.SkillGetTip.title = HeroSkillCell.GetDesc(data);
        }
        this.view.getTransition("get_skill_tip").play(() => {
            this.ShowMonsterTip();
        });
        BattleData.Inst().randomSkillRecord = null;
    }

    //testB = 0;
    OnPauseClick() {
        let battleInfo = BattleData.Inst().battleInfo;
        if (battleInfo.isPause || battleInfo.isGuiding) {
            return;
        }

        ViewManager.Inst().OpenView(BattlePauseView);
    }

    OnPause(isPause: boolean) {
        if (this.harmItemPool) {
            let list = this.harmItemPool.GetStack();
            list.forEach(v => {
                v.SetPause(isPause);
            })
        }
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

    OnHarmInfoClick() {
        if (ViewManager.Inst().IsOpen(BattleHarmInfoView)) {
            ViewManager.Inst().CloseView(BattleHarmInfoView);
        } else {
            ViewManager.Inst().OpenView(BattleHarmInfoView);
        }
    }

    OnSpCellClick() {
        if (ViewManager.Inst().IsOpen(BattleSpCellInfoView2)) {
            ViewManager.Inst().CloseView(BattleSpCellInfoView2);
        } else {
            ViewManager.Inst().OpenView(BattleSpCellInfoView2);
        }
    }

    OnJumpStepClick() {
        let battleInfo = BattleData.Inst().battleInfo;
        if (BattleData.Inst().IsGuide() || battleInfo.isPause || battleInfo.stepNum == 0 || battleInfo.battleState != BattleState.SanXiao) {
            return;
        }
        let scene = BattleCtrl.Inst().battleScene;
        if (scene && scene.GetBoxCount() == 0 && scene.isCanCtrl) {
            PublicPopupCtrl.Inst().DialogTipsAndToggle(Language.Battle.JumpStepTip, () => {
                scene.battleInfo.stepNum = 0;
                scene.CheckStep();
            }, DialogTipsToggle.CreateDay(DialogTipsToggleKey.BattleJumpStep));
        }
    }

    OnFreeSpeedClick() {
        if (BattleData.Inst().battleInfo.isFreeSpeed3) {
            return;
        }
        ViewManager.Inst().OpenView(BattleFreeSpeedView);
    }

    OnActSpeedClick() {
        if (SevenDayHeroData.Inst().IsBuy) {
            return;
        }
        ViewManager.Inst().OpenViewByKey(Mod.SevenDayHero.View);
    }


    //播放试用3倍按钮的动画
    PlayFreeSpeed() {
        this.DoPlayMoveBtn(this.viewNode.FreeSpeedBtn, () => {
            BattleData.Inst().battleInfo.globalTimeScaleShow = 3;
        });
    }

    PlayActSpeedBtn() {
        this.DoPlayMoveBtn(this.viewNode.ActApeedBtn, () => {
            BattleData.Inst().battleInfo.globalTimeScaleShow = 3;
            let cfg = CfgSupplyCardData.supply_card[0];
            let skill1 = BattleData.Inst().GetSkillCfg(cfg.att_skill);
            let skill2 = BattleData.Inst().GetSkillCfg(cfg.spe_skill);
            BattleData.Inst().AddSkill(skill1);
            BattleData.Inst().AddSkill(skill2);
        });
    }

    //移动按钮的动画
    private moveBtnTw: fgui.GTweener;
    private moveBtnTimeht: any;
    DoPlayMoveBtn(obj: fgui.GObject, finishFunc?: () => any) {
        if (this.moveBtnTw || this.moveBtnTimeht) {
            return;
        }
        this.viewNode.Mask.visible = true;
        obj.setPosition(400, 800);
        this.moveBtnTimeht = setTimeout(() => {
            this.moveBtnTimeht = null;
            let tweener = fgui.GTween.to2(400, 800, this.viewNode.AddSpeedBtn.x, this.viewNode.AddSpeedBtn.y, 1);
            this.moveBtnTw = tweener;
            let easeType = fgui.EaseType.SineInOut; //fgui.EaseType.SineOut
            tweener.setEase(easeType)
            tweener.onUpdate((tweener: fgui.GTweener) => {
                obj.setPosition(tweener.value.x, tweener.value.y);
            })
            tweener.onComplete(() => {
                this.viewNode.Mask.visible = false;
                this.moveBtnTw = null;
                obj.visible = false;
                this.view.getTransition("speed_btn").play();
                if (finishFunc) {
                    finishFunc();
                }
            })
        }, 750);
    }
}


export class BattleSkillSelectItem extends BaseItemGB {
    protected viewNode = {
        BuffDesc: <fgui.GRichTextField>null,
        Qua: <fgui.GLoader>null,
        Qua2: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        IconValue: <fgui.GTextField>null,
        CountLabel: <fgui.GLabel>null,
    };

    SetData(data: CfgSkillData) {
        super.SetData(data);
        //UH.SetText(this.viewNode.BuffDesc, TextHelper.Format(data.word, data.pram1, data.pram2, data.pram3, data.pram4));
        this.visible = true;
        //UH.SetText(this.viewNode.BuffDesc, "");
        UH.SetText(this.viewNode.BuffDesc, HeroSkillCell.GetDesc(data));
        UH.SpriteName(this.viewNode.Qua, "Battle", "SkillQua" + data.color);
        UH.SpriteName(this.viewNode.Qua2, "Battle", "SkillQuaCell" + data.color);
        UH.SetIcon(this.viewNode.Icon, data.icon_res_id, ICON_TYPE.SKILL, undefined, true);
        UH.SetText(this.viewNode.IconValue, data.icon_num);

        if (this.viewNode.BuffDesc.height > 110) {
            this.viewNode.BuffDesc.fontSize = 26;
        }

        this.viewNode.CountLabel.visible = data.skill_id == SP_SKILL_ID_A;
        if (data.skill_id == SP_SKILL_ID_A) {
            let text = Language.Battle.Text1 + BattleCtrl.Inst().battleScene.GetHeroCount(data.pram1, 0);
            this.viewNode.CountLabel.title = text;
        }
        this.viewNode.BuffDesc._richText.onEnable();
    }
}

export class BattleSkillCellItem extends BaseItem {
    protected viewNode = {
        Desc: <fgui.GRichTextField>null,
    };

    SetData(data: CfgSkillData) {
        super.SetData(data);
        UH.SetText(this.viewNode.Desc, data.word);
    }
}


export class BattleStepAddTipItem extends BaseItem {
    protected viewNode = {
        Num: <fgui.GRichTextField>null,
    };

    private tweener: fgui.GTweener;

    SetData(data: ICenterStepNumTipData) {
        super.SetData(data);
        UH.SetText(this.viewNode.Num, "+" + data.num);
        let pos = UtilHelper.CocosWorldPosToFgui(data.worldPos);
        this.setPosition(pos.x, pos.y);

        this.tweener = fgui.GTween.to2(pos.x, pos.y, pos.x, pos.y - 50, 1);
        this.tweener.setEase(fgui.EaseType.CubicOut);
        this.tweener.onUpdate((tweener: fgui.GTweener) => {
            this.setPosition(tweener.value.x, tweener.value.y);
        })
        this.tweener.onComplete(() => {
            this.dispose();
        })
    }

    protected onDestroy(): void {
        if (this.tweener) {
            UtilHelper.KillFGuiTweenr(this.tweener);
        }
    }
}


export class IBattleHarmShowItemData {
    worldPos: Vec3;
    num: number;
    harmType: MonsterHarmType;
    iconType?: BattleHarmShowIconType;
}

export enum BattleHarmShowIconType {
    dunpai = "DunPai1",
    baoji = "BaoJi",
    pojia = "PoJia",
    zhongji = "ZhongJi",
}


var emptyString = "";

//伤害显示
export class BattleHarmShowItem extends BaseItem {
    protected viewNode = {
        Value: <BattleHarmShowLabel>null,
    };

    private animation: fgui.Transition;
    private callback: (item: BattleHarmShowItem) => void;

    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
        this.animation = this.getTransition("show");
    }

    SetData(data: IBattleHarmShowItemData) {
        super.SetData(data);
        this.viewNode.Value.SetData(data);
        let pos = UtilHelper.CocosWorldPosToFgui(data.worldPos);
        this.setPosition(pos.x, pos.y);
        this.animation.play(this.Complete.bind(this));
    }

    SetPause(isPause: boolean) {
        if (this.animation) {
            this.animation.setPaused(isPause);
        }
    }

    private Complete() {
        if (this.callback) {
            this.callback(this);
        }
    }

    SetEndCallback(func: (item: BattleHarmShowItem) => void) {
        this.callback = func
    }
}

export class BattleHarmShowLabel extends BaseItem {
    protected viewNode = {
        Value: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
    };
    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }

    SetData(data: IBattleHarmShowItemData) {
        super.SetData(data);
        let font = BattleHarmFont[data.harmType];
        UH.SetText(this.viewNode.Value, emptyString);
        UH.FontName(this.viewNode.Value, "Battle", font);
        UH.SetText(this.viewNode.Value, data.num);
        this.viewNode.Icon.visible = data.iconType != null;
        if (data.iconType != null) {
            UH.SpriteName(this.viewNode.Icon, "Battle", data.iconType);
        }
    }
}


export class IBattleRountInfoItemData {
    maxRound: number;
    RoundList: number[];
    targetIndex: number;
}

export class BattleRountInfoItem extends BaseItem {
    protected viewNode = {
        RountProgress: <BattleRountProgressItem>null,
        MaxRoundText: <fgui.GTextField>null,
        QiZi: <fgui.GObject>null,
    };

    SetData(data: IBattleRountInfoItemData) {
        super.SetData(data);
        let maxProgress = BattleData.Inst().battleInfo.roundProgerssMax;
        this.viewNode.MaxRoundText.visible = data.maxRound < maxProgress;
        this.viewNode.QiZi.visible = data.maxRound < maxProgress;
        if (data.maxRound < maxProgress) {
            let text = Language.Battle.Text2 + maxProgress + Language.Battle.Text3;
            UH.SetText(this.viewNode.MaxRoundText, text);
        }

        this.viewNode.RountProgress.SetData(data);
        this.viewNode.RountProgress.ShowMove();
    }
}

export class BattleRountProgressItem extends BaseItem {
    protected viewNode = {
        Progress: <fgui.GProgressBar>null,
        RoundList: <fgui.GList>null,
    };
    listData: number[];

    SetData(data: IBattleRountInfoItemData) {
        super.SetData(data);
        this.viewNode.RoundList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data.RoundList;
        this.viewNode.RoundList.numItems = data.RoundList.length;
        this.viewNode.Progress.value = 100 * data.targetIndex / data.RoundList.length;
    }

    private itemRenderer(index: number, item: RoundItem) {
        item.SetData(this.listData[index]);
    }

    ShowMove(cp?: () => void) {
        this.getTransition("move").play(() => {
            if (cp) {
                cp();
            }
            this.viewNode.Progress.setPosition(0, -55);
            this.viewNode.RoundList.setPosition(0, 145);
        });
        this.viewNode.Progress.tweenValue(100 * (this._data.targetIndex + 1) / this._data.RoundList.length, 1);
    }
}

export class BattleRountItem extends BaseItem {
    protected viewNode = {
        DayOn: <fgui.GTextField>null,
        DayOff: <fgui.GTextField>null,
        Flag: <fgui.GLoader>null,
    };

    SetData(roundNum: number) {
        super.SetData(roundNum);
        let text = Language.Battle.Text2 + roundNum + Language.Battle.Text3;
        UH.SetText(this.viewNode.DayOn, text);
        UH.SetText(this.viewNode.DayOff, text);
        this.getController("showCtrl").setSelectedIndex(roundNum == BattleData.Inst().battleInfo.roundProgerss ? 1 : 0);

        if (BattleData.Inst().battleInfo.roundProgerssMax == roundNum) {
            UH.SpriteName(this.viewNode.Flag, "Battle", "MuBiaoicon");
        } else if (roundNum % 10 == 0) {
            UH.SpriteName(this.viewNode.Flag, "Battle", "BossFlag");
        } else {
            UH.SpriteName(this.viewNode.Flag, "Battle", "RiLi");
        }
    }
}


export interface IBossHeadInfoData {
    maxHp: number;
    hp: number;
    bubble: string;
}

// Boss头部信息
export class BossHeadInfo extends BaseItem {
    protected viewNode = {
        BubbleInfo: <fgui.GLabel>null,
        BossHpBar: <fgui.GProgressBar>null,
        Icon: <fgui.GObject>null,
    };

    SetData(data: IBossHeadInfoData) {
        this.viewNode.BossHpBar.value = data.hp;
        this.viewNode.BossHpBar.max = data.maxHp;
        this.viewNode.BubbleInfo.title = data.bubble;
        this.getTransition("HideBubble").play();
    }

    SetHpValue(value: number) {
        this.viewNode.BossHpBar.tweenValue(value, 0.2);
        //this.viewNode.BossHpBar.value = value;
    }

    SetBubble(str: string) {
        this.getTransition("HideBubble").play();
        this.viewNode.BubbleInfo.title = str;
    }

    private timeht: any;
    EndShow(str: string) {
        this.viewNode.BossHpBar.visible = false;
        this.viewNode.Icon.visible = false;
        this.viewNode.BubbleInfo.visible = true;
        this.viewNode.BubbleInfo.title = str;

        setTimeout(() => {
            this.removeFromParent()
            this.dispose();
        }, 2000)
    }
}

//怪物出现提示
export class MonsterDescItem extends BaseItem {
    protected viewNode = {
        title: <fgui.GTextField>null,
        SpineShow: <UISpineShow>null,
    };
    SetData(data: CfgMonsterData) {
        UH.SetText(this.viewNode.title, data.monster_word);
        this.viewNode.SpineShow.LoadSpine(ResPath.Monster(data.res_id), false);
    }
}

//技能选择
export class BattleSkillSelect extends BaseItem {
    protected viewNode = {
        Skill1: <BattleSkillSelectItem>null,
        Skill2: <BattleSkillSelectItem>null,
        Skill3: <BattleSkillSelectItem>null,
    };
    get Skill1(): BattleSkillSelectItem {
        return this.viewNode.Skill1;
    }

    isCanClick: boolean = true;

    protected onConstruct() {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
        this.viewNode.Skill1.onClick(() => {
            if (this.itemClickFunc && this.isCanClick) {
                this.itemClickFunc(this.viewNode.Skill1.GetData());
            }
        });
        this.viewNode.Skill2.onClick(() => {
            if (this.itemClickFunc && this.isCanClick) {
                this.itemClickFunc(this.viewNode.Skill2.GetData());
            }
        });
        this.viewNode.Skill3.onClick(() => {
            if (this.itemClickFunc && this.isCanClick) {
                this.itemClickFunc(this.viewNode.Skill3.GetData());
            }
        });
    }

    SetData(data: CfgSkillData[]) {
        super.SetData(data);
        if (data == null || data.length == 0) {
            this.visible = false;
            return;
        }
        this.viewNode.Skill1.SetData(data[0]);
        this.viewNode.Skill2.SetData(data[1]);
        this.viewNode.Skill3.SetData(data[2]);
    }

    private itemClickFunc: (data: CfgSkillData) => void;
    SetItemClick(func: (data: CfgSkillData) => void) {
        this.itemClickFunc = func;
    }

    ShowOnceItem(skill: CfgSkillData) {
        this.viewNode.Skill1.visible = false;
        this.viewNode.Skill3.visible = false;
        this.viewNode.Skill2.SetData(skill);
    }
}


export class BattleActBtnData {
    spinePath: string;
}

export class BattleActBtn extends BaseItemGB {
    protected viewNode = {
        UISpineShow: <UISpineShow>null,
    }

    public SetData(data: BattleActBtnData): void {
        super.SetData(data);
        this.viewNode.UISpineShow.LoadSpine(ResPath.Spine(data.spinePath), true);
    }
}


//试用三倍数按钮
export class BattleFreeSpeedBtn extends fgui.GButton {
    protected viewNode = {
        UIEffectShow: <UIEffectShow>null,
    }

    protected onConstruct(): void {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    private isShow = true;
    Show() {
        if (this.isShow) {
            this.viewNode.UIEffectShow.PlayEff(1208134);
            this.isShow = false;
        }
    }
}
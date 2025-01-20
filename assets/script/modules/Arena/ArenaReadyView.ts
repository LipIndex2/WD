import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BattleDefSelectHeroItem } from "modules/Battle/View/BattleDefView";
import { BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { ArenaReadHero, ArenaReadHeroBattleArray, ArenaReadHeroInFightItem, BattleArenaSelectHeroItem } from "./ArenaReadyHero";
import { ArenaReadSkill, ArenaReadSkillGroup, ArenaReadSkillInfo, ArenaReadSkillItem } from "./ArenaReadySkill";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { AudioTag } from "modules/audio/AudioManager";
import { ArenaData } from "./ArenaData";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { Language } from "modules/common/Language";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { RoleData } from "modules/role/RoleData";

@BaseView.registView
export class ArenaReadyView extends BaseView {

    // 英雄和词条设置的锁定状态
    static readyHeroLock = false;
    static readySkillLock = false;

    protected viewRegcfg = {
        UIPackName: "ArenaReady",
        ViewName: "ArenaReady",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
        ViewMask: ViewMask.BgBlock,
    };

    private tabList = [
        { type: 0, title: Language.Arena.title5 },
        { type: 1, title: Language.Arena.title6 },
    ]

    protected viewNode = {
        Name: <fgui.GTextField>null,
        TabList: <fgui.GList>null,
        CloseBtn: <fgui.GButton>null,
        BGEffect: <UIEffectShow>null,
        ReadSkill: <ArenaReadSkill>null,
    };

    protected extendsCfg = [
        { ResName: "TabBtn", ExtendsClass: ArenaReadyTabBtn },
        { ResName: "ArenaReadyHero", ExtendsClass: ArenaReadHero },
        { ResName: "ArenaReadySkillNew", ExtendsClass: ArenaReadSkill },
        { ResName: "HeroItem", ExtendsClass: BattleArenaSelectHeroItem },
        { ResName: "BattleArray", ExtendsClass: ArenaReadHeroBattleArray },
        { ResName: "InFightHeroItem", ExtendsClass: ArenaReadHeroInFightItem },
        { ResName: "SkillItem", ExtendsClass: ArenaReadSkillItem },
        { ResName: "SkillInfo", ExtendsClass: ArenaReadSkillInfo },
        { ResName: "SkillGroup", ExtendsClass: ArenaReadSkillGroup },
    ];

    private isFirst = true;

    //指引用的item
    private _guideTabItem: ArenaReadyTabBtn;
    private get guideTabItem(): ArenaReadyTabBtn {
        if (this._guideTabItem == null) {
            let item = <ArenaReadyTabBtn>fgui.UIPackage.createObject("ArenaReady", "TabBtn").asCom;
            this.addChild(item);
            this._guideTabItem = item;
            item.onClick(() => {
                item.visible = false;
                this.viewNode.TabList.selectedIndex = 1;
            });
        }
        return this._guideTabItem;
    }

    ShowItemGuide() {
        this.guideTabItem.visible = true;
        let globalPos = this.viewNode.TabList.localToGlobal();
        let pos = this.view.globalToLocal(globalPos.x, globalPos.y);
        this.guideTabItem.setPosition(pos.x + 370, pos.y);
        this.guideTabItem.SetData(<{ type: 1, title: string }>this.tabList[1]);

        GuideCtrl.Inst().AddGuideUi("ArenaReadySkillTab", this.guideTabItem);
    }

    InitData() {
        this.AddSmartDataCare(ArenaData.Inst().smdData, this.FlushArenaSkill.bind(this), "selectSkillList");
        this.AddSmartDataCare(ArenaData.Inst().smdData, this.FlushArenaSkill.bind(this), "selectSkill");

        this.viewNode.CloseBtn.onClick(this.closeView, this);
        ArenaReadyView.readyHeroLock = ArenaData.Inst().heroLength > 0;
        ArenaReadyView.readySkillLock = ArenaData.Inst().mainInfo != null && ArenaData.Inst().mainInfo.buffList.length > 0;
        this.viewNode.BGEffect.PlayEff(1208110);
        this.ShowItemGuide();
    }

    OpenCallBack() {
        this.viewNode.TabList.on(fgui.Event.CLICK_ITEM, this.OnTabClick, this);
        this.viewNode.TabList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.TabList.numItems = this.tabList.length;
        this.viewNode.TabList.selectedIndex = 1;
    }

    private itemRenderer(index: number, item: ArenaReadyTabBtn): void {
        item.SetData(this.tabList[index]);
    }

    FlushArenaSkill() {
        this.viewNode.ReadSkill.FlushSelectCount();
        this.viewNode.ReadSkill.FlushCenterSkillInfo();
    }

    CloseCallBack() {
        GuideCtrl.Inst().ClearGuideUi("ArenaReadyHeroItem");
        GuideCtrl.Inst().ClearGuideUi("ArenaReadyHeroDownBtn");
        GuideCtrl.Inst().ClearGuideUi("ArenaReadyHeroUpBtn");
        GuideCtrl.Inst().ClearGuideUi("ArenaReadyHeroOkBtn");
        GuideCtrl.Inst().ClearGuideUi("ArenaReadySkillTab");

        GuideCtrl.Inst().ClearGuideUi("ArenaReadyClickSkill");
        GuideCtrl.Inst().ClearGuideUi("ArenaReadySelectSkill");
        GuideCtrl.Inst().ClearGuideUi("ArenaReadyCancelSkill");
        GuideCtrl.Inst().ClearGuideUi("ArenaReadySkillCount");

        if (RoleData.Inst().IsGuideNum(16, false)) {
            GuideCtrl.Inst().Start(16);
            if (RoleData.Inst().IsGuideNum(13, false)) {
                RoleData.Inst().IsGuideNum(13)
                RoleData.Inst().IsGuideNum(14)
                RoleData.Inst().IsGuideNum(15)
                RoleData.Inst().IsGuideNum(16)
            }
        }
    }

    private emptyClick = false;
    OnTabClick(item: ArenaReadyTabBtn) {
        if (this.emptyClick) {
            this.emptyClick = false;
            return;
        }
        let data = item.GetData();
        if (data.type == 1 && !ArenaReadyView.readyHeroLock) {
            PublicPopupCtrl.Inst().Center(Language.Arena.tips8);
            this.emptyClick = true;
            this.viewNode.TabList.selectedIndex = 0;
            return
        }
        if (data.type == 0 && ArenaReadyView.readySkillLock && !this.isFirst) {
            PublicPopupCtrl.Inst().Center(Language.Arena.tips9);
            this.emptyClick = true;
            this.viewNode.TabList.selectedIndex = 1;
            return
        }
        this.view.getController("tab").selectedIndex = data.type;
        this.isFirst = false;
    }
}

export class ArenaReadyTabBtn extends BaseItemGB {
    public SetData(data: { type: number, title: string }): void {
        super.SetData(data);
        this.title = data.title;
    }
}
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BattleDefSelectHeroItem } from "modules/Battle/View/BattleDefView";
import { HeroData } from "modules/hero/HeroData";
import { UtilHelper } from "../../helpers/UtilHelper";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { SmallObjPool } from "core/SmallObjPool";
import { Vec2 } from "cc";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { EGLoader } from "modules/extends/EGLoader";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { BattleHelper } from "modules/Battle/BattleHelper";
import { UH } from "../../helpers/UIHelper";
import { ArenaData, IArenaReadHeroInFightItemData } from "./ArenaData";
import { ArenaReadyView } from "./ArenaReadyView";
import { ArenaCtrl, ArenaReq } from "./ArenaCtrl";
import { Language } from "modules/common/Language";
import { RoleData } from "modules/role/RoleData";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { GuideData } from "modules/guide/GuideData";
import { DragGuideView, DragGuideViewParam } from "modules/guide/DragGuideView";
import { GuidePos } from "modules/guide/GuideView";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { GetCfgValue } from "config/CfgCommon";
import { COLORS } from "modules/common/ColorEnum";

const MAX_IN_FIGHT_HERO_COUNT = 18;     //最大上阵数量

const ArenaReadHeroGuideId = 14;

// 竞技场 -- 英雄上阵
export class ArenaReadHero extends fgui.GComponent {
    protected viewNode = {
        UpBtn: <fgui.GButton>null,
        DownBtn: <fgui.GButton>null,
        OkBtn: <fgui.GButton>null,
        List: <fgui.GList>null,
        BattleArray: <ArenaReadHeroBattleArray>null,
        ScoreLabel: <fgui.GLabel>null,
        UIEffectShow: <UIEffectShow>null,
        ScoreChange: <fgui.GTextField>null,
        CloseBtn: <fgui.GButton>null,
    };

    private _freeList: IPB_HeroNode[]
    private get freeList(): IPB_HeroNode[] {
        if (this._freeList == null) {
            this._freeList = ArenaData.Inst().GetFreeHeroList();
        }
        return this._freeList;
    }

    private _heroInfoList: IPB_HeroNode[]
    private get heroInfoList(): IPB_HeroNode[] {
        if (this._heroInfoList == null) {
            this._heroInfoList = [];
            HeroData.Inst().HeroList.forEach(v => {
                if (!this.IsInFight(v)) {
                    this._heroInfoList.push(v);
                }
            })
            let freeList = this.freeList;
            if (freeList && freeList.length > 0) {
                freeList.forEach(v => {
                    if (!this.IsInFight(v)) {
                        this._heroInfoList.push(v);
                    }
                })
            }
            this.SortList();
        }
        return this._heroInfoList;
    }

    SortList() {
        if (this._heroInfoList == null || this._heroInfoList.length == 0) {
            return;
        }
        this._heroInfoList.sort((a, b) => {
            let aLevel = a.heroLevel;
            let bLevel = b.heroLevel;
            if (aLevel == 0) {
                aLevel = ArenaData.Inst().GetFreeHeroLevel(a.heroId);
            }
            if (bLevel == 0) {
                bLevel = ArenaData.Inst().GetFreeHeroLevel(b.heroId);
            }
            if (aLevel != bLevel) {
                return bLevel - aLevel;
            } else {
                let aColor = HeroData.Inst().GetHeroBaseCfg(a.heroId).hero_color;
                let bColor = HeroData.Inst().GetHeroBaseCfg(b.heroId).hero_color;
                return bColor - aColor;
            }
        })
    }

    //指引用的item
    private _guideHeroItem: BattleArenaSelectHeroItem;
    private get guideHeroItem(): BattleArenaSelectHeroItem {
        if (this._guideHeroItem == null) {
            let heroItem = <BattleArenaSelectHeroItem>fgui.UIPackage.createObject("ArenaReady", "HeroItem").asCom;
            this.addChild(heroItem);
            this._guideHeroItem = heroItem;
            heroItem.onClick(() => {
                heroItem.visible = false;
                this.OnHeroItemClick(heroItem);
                let curGuideCfg = GuideCtrl.Inst().step_cfg;
                if (curGuideCfg && curGuideCfg.step_id == ArenaReadHeroGuideId) {
                    if (curGuideCfg.index == 2) {
                        this.ShowHeroItemGuide();
                    } else {
                        this.OpenDragGuide();
                    }
                }
            });
        }
        return this._guideHeroItem;
    }
    ShowHeroItemGuide() {
        this.guideHeroItem.visible = true;
        let globalPos = this.viewNode.List.localToGlobal();
        let pos = this.globalToLocal(globalPos.x, globalPos.y);
        this.guideHeroItem.setPosition(pos.x, pos.y);
        this.guideHeroItem.SetData(this.heroInfoList[0]);

        GuideCtrl.Inst().AddGuideUi("ArenaReadyHeroItem", this.guideHeroItem);
    }

    OpenDragGuide() {
        let rectPos = new Vec2(this.viewNode.BattleArray.x, this.viewNode.BattleArray.y);
        let param = new DragGuideViewParam(466, 121, rectPos, Language.Arena.DragGuideTip);
        ViewManager.Inst().OpenView(DragGuideView, param);
    }

    private scoreAnim: fgui.Transition;

    protected onConstruct(): void {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);

        this.viewNode.UpBtn.onClick(this.OnUpClick, this);
        this.viewNode.DownBtn.onClick(this.OnDownClick, this);
        this.viewNode.OkBtn.onClick(this.OnOkClick, this);
        this.viewNode.CloseBtn.onClick(() => {
            ViewManager.Inst().CloseView(ArenaReadyView);
        })

        this.viewNode.List.setVirtual();
        this.viewNode.List.on(fgui.Event.CLICK_ITEM, this.OnHeroItemClick, this);
        this.viewNode.BattleArray.SetItemClick(this.OnBattleArrayItemClick.bind(this));

        let heroList = ArenaData.Inst().mainInfo?.heroId;
        let levelList = ArenaData.Inst().mainInfo?.heroLevel;
        if (heroList) {
            for (let i = 0; i < heroList.length; i++) {
                let level = levelList[i];
                let info = <IPB_HeroNode>{ heroId: heroList[i], heroLevel: level };
                if (info.heroId > 0) {
                    this.viewNode.BattleArray.PutHero(info, i);
                }
            }
        }

        GuideCtrl.Inst().AddGuideUi("ArenaReadyHeroUpBtn", this.viewNode.UpBtn);
        GuideCtrl.Inst().AddGuideUi("ArenaReadyHeroDownBtn", this.viewNode.DownBtn);
        GuideCtrl.Inst().AddGuideUi("ArenaReadyHeroOkBtn", this.viewNode.OkBtn);

        if (ArenaData.Inst().GetIsNeedGuide()) {
            setTimeout(() => {
                GuidePos["15_1"] = { x: this.viewNode.DownBtn.x, y: this.viewNode.DownBtn.y };
                GuidePos["15_2"] = { x: this.viewNode.UpBtn.x, y: this.viewNode.UpBtn.y };
                GuidePos["15_3"] = { x: this.viewNode.OkBtn.x, y: this.viewNode.OkBtn.y };
                GuidePos["15_4"] = { x: this.viewNode.OkBtn.x, y: this.viewNode.OkBtn.y };

                this.ShowHeroItemGuide();
                GuideCtrl.Inst().Start(ArenaReadHeroGuideId);
            });
        }

        this.scoreAnim = this.getTransition("score_change");
    }

    protected onEnable(): void {
        super.onEnable();
        this.FlushPanel();
    }

    //是否已上阵
    IsInFight(info: IPB_HeroNode): boolean {
        if (this.viewNode.BattleArray.IsInFight(info)) {
            return true;
        }
        return false;
    }

    FlushPanel() {
        if (!this.visible) {
            return;
        }
        this.FlushHeroList();
        this.FlushOkBtn();
    }

    FlushHeroList() {
        this.SortList();
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = this.heroInfoList.length;
        this.FlushScore();
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.heroInfoList[index]);
    }

    FlushOkBtn() {
        let btnText = ArenaReadyView.readyHeroLock ? Language.Arena.BtnUnlock : Language.Arena.BtnLock;
        this.viewNode.OkBtn.title = btnText;
        this.viewNode.OkBtn.grayed = ArenaReadyView.readyHeroLock;
    }

    private lastScore: number;
    FlushScore() {
        let score = this.viewNode.BattleArray.GetScore();
        if (this.lastScore == null) {
            this.lastScore = score;
        }
        UH.SetText(this.viewNode.ScoreLabel, Language.Arena.text8 + score);
        let changeScore = score - this.lastScore;
        this.viewNode.ScoreChange.visible = changeScore != 0;
        this.viewNode.UIEffectShow.visible = changeScore != 0;
        if (changeScore != 0) {
            this.viewNode.UIEffectShow.PlayEff(1208135);
            this.scoreAnim.stop();
            let text = changeScore > 0 ? "+" + changeScore : changeScore;
            this.viewNode.ScoreChange.color = changeScore < 0 ? GetCfgValue(COLORS, "Red1") : GetCfgValue(COLORS, "Yellow9")
            UH.SetText(this.viewNode.ScoreChange, text);
            this.scoreAnim.play();
        }
        this.lastScore = score;
    }

    ScendHeroList() {
        let p1List: number[] = [];
        let p2List: number[] = [];
        for (let i = 0; i < MAX_IN_FIGHT_HERO_COUNT; i++) {
            let hero = this.viewNode.BattleArray.GetHero(i);
            if (hero) {
                p1List.push(hero.info.heroId);
                p2List.push(hero.info.heroLevel);
            } else {
                p1List.push(0);
                p2List.push(0);
            }
        }
        ArenaCtrl.Inst().SendReq(ArenaReq.SetHero, p1List, p2List);
        //ArenaCtrl.Inst().SendReq(ArenaReq.SetSkill);  //设置英雄的时候，服务端会清空
    }

    OnHeroItemClick(item: BattleArenaSelectHeroItem) {
        if (ArenaReadyView.readyHeroLock) {
            PublicPopupCtrl.Inst().Center(Language.Arena.tips3);
            return;
        }
        let data = item.GetData();
        let result = this.viewNode.BattleArray.PutHero(data);
        if (result == 1) {
            UtilHelper.ArrayRemove(this.heroInfoList, data);
            this.FlushHeroList();
        } else if (result == 0) {
            PublicPopupCtrl.Inst().Center(Language.Arena.tips4);
        } else if (result == -1) {
            PublicPopupCtrl.Inst().Center(Language.Arena.tips5);
        }
    }

    OnBattleArrayItemClick(item: ArenaReadHeroInFightItem) {
        if (ArenaReadyView.readyHeroLock) {
            PublicPopupCtrl.Inst().Center(Language.Arena.tips3);
            return;
        }
        if (ViewManager.Inst().IsOpen(DragGuideView)) {
            return;
        }
        let info = item.info;
        this.heroInfoList.splice(0, 0, info);
        this.viewNode.BattleArray.RemoveHeroItem(item.ij);
        this.FlushHeroList();
    }

    OnUpClick() {
        if (ArenaReadyView.readyHeroLock) {
            PublicPopupCtrl.Inst().Center(Language.Arena.tips3);
            return;
        }
        let count = 0;
        for (let i = 0; i < this.heroInfoList.length; i++) {
            let data = this.heroInfoList[i];
            let result = this.viewNode.BattleArray.PutHero(data);
            if (result == 1) {
                count++;
            } else if (result == 0) {
                break
            }
        }
        if (count > 0) {
            this._heroInfoList = null;
            this.FlushHeroList();
        }
    }

    OnDownClick() {
        if (ArenaReadyView.readyHeroLock) {
            PublicPopupCtrl.Inst().Center(Language.Arena.tips3);
            return;
        }
        if (this.viewNode.BattleArray.heroMap.size < 1) {
            return;
        }
        let ijList: number[] = [];
        this.viewNode.BattleArray.heroMap.forEach((hero, k) => {
            let data = hero.GetData();
            this.heroInfoList.push(data.info);
            ijList.push(hero.ij);
        })
        ijList.forEach(ij => {
            this.viewNode.BattleArray.RemoveHeroItem(ij);
        })
        this.heroInfoList.sort((a, b) => {
            return b.heroLevel - a.heroLevel;
        });
        this.FlushHeroList();
    }

    OnOkClick() {
        if (ArenaReadyView.readyHeroLock) {
            if (GuideCtrl.Inst().IsGuiding()) {
                return;
            }
            ArenaReadyView.readyHeroLock = false;
        } else {
            if (this.viewNode.BattleArray.heroMap.size > 0) {
                ArenaReadyView.readyHeroLock = true;
                this.ScendHeroList();
            } else {
                PublicPopupCtrl.Inst().Center(Language.Arena.tips2);
            }
        }

        this.FlushOkBtn();
    }
}

//英雄阵容
export class ArenaReadHeroBattleArray extends fgui.GComponent {
    protected viewNode = {

    };

    heroMap = new Map<number, ArenaReadHeroInFightItem>();
    private heroItemPool = new SmallObjPool<ArenaReadHeroInFightItem>(undefined, 20);
    private posMap = new Map<number, Vec2>();
    private swaping = false;

    protected onConstruct(): void {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);

        this.heroItemPool.isNode = false;
        this.heroItemPool.SetCreateFunc(() => {
            let item = <ArenaReadHeroInFightItem>fgui.UIPackage.createObject("ArenaReady", "InFightHeroItem").asCom;
            this.addChild(item);
            item.on(fgui.Event.DRAG_END, this.OnItemDragEnd, this);
            item.on(fgui.Event.DRAG_START, this.OnItemDragStart, this);
            item.onClick(this.OnItemClick, this);
            return item;
        })
        this.heroItemPool.SetDestroyFunc((item: ArenaReadHeroInFightItem) => {
            item.dispose();
            item = null;
        })

        this.FlushPanel();
    }

    GetScore(): number {
        let score = 0;
        this.heroMap.forEach(v => {
            score += v.score;
        })
        return score;
    }

    FlushPanel() {

    }

    // 0表示满了，1表示成功，-1表示不可以
    PutHero(data: IPB_HeroNode, ij?: number): number {
        if (data.heroId == 0) {
            return -2;
        }
        if (this.heroMap.size >= 18) {
            return 0;
        }
        ij = ij ?? this.GetCanPutIJ();
        if (ij == null) {
            return 0;
        }
        if (!this.IsCanPut(data)) {
            return -1;
        }
        let item = this.heroItemPool.Get();
        item.visible = true;
        item.draggable = true;
        let pos = this.GetPosByIJ(ij);
        item.setPosition(pos.x, pos.y);
        let itemData = { ij: ij, info: data };
        item.SetData(itemData);
        this.heroMap.set(ij, item);
        return 1;
    }

    RemoveHeroItem(ij: number) {
        if (this.heroMap.has(ij)) {
            let item = this.heroMap.get(ij);
            item.visible = false;
            item.draggable = false;
            this.heroItemPool.Put(item);
            this.heroMap.delete(ij);
        }
    }

    IsInFight(data: IPB_HeroNode): boolean {
        let isIn = false;
        this.heroMap.forEach((hero, k) => {
            if (hero.info.heroId == data.heroId && hero.info.heroLevel == data.heroLevel) {
                isIn = true;
            }
        })
        return isIn;
    }

    IsCanPut(data: IPB_HeroNode): boolean {
        let isCan = true;
        this.heroMap.forEach((hero, k) => {
            if (hero.info.heroId == data.heroId) {
                isCan = false;
            }
        })
        return isCan;
    }

    //获取一个能放置英雄的格子下标
    GetCanPutIJ(): number {
        for (let i = 0; i < MAX_IN_FIGHT_HERO_COUNT; i++) {
            if (!this.heroMap.has(i)) {
                return i;
            }
        }
        return null;
    }

    private offsetPos = new Vec2(121, 62);
    GetPosByIJ(ijNum: number): Vec2 {
        if (this.posMap.has(ijNum)) {
            return this.posMap.get(ijNum);
        }
        let pos = new Vec2();
        let ij = BattleHelper.NumToIJ(ijNum, 3);
        let i = ij.y;
        let j = ij.x;
        pos.x = this.offsetPos.x + j * 232;
        pos.y = this.offsetPos.y + i * 116;
        this.posMap.set(ijNum, pos);
        return pos;
    }

    //通过位置获取IJ
    GetIJByPos(x: number, y: number): number {
        for (let i = 0; i < MAX_IN_FIGHT_HERO_COUNT; i++) {
            let ijPos = this.GetPosByIJ(i);
            if (Math.abs(ijPos.x - x) <= 232 / 2 && Math.abs(ijPos.y - y) <= 116 / 2) {
                return i;
            }
        }
        return null;
    }

    GetHero(ij: number): ArenaReadHeroInFightItem {
        return this.heroMap.get(ij);
    }

    private itemClickFunc: (item: ArenaReadHeroInFightItem) => any;
    SetItemClick(func: (item: ArenaReadHeroInFightItem) => any) {
        this.itemClickFunc = func;
    }
    private OnItemClick(evt: fgui.Event) {
        if (this.swaping) {
            return;
        }
        if (this.itemClickFunc) {
            let item: ArenaReadHeroInFightItem = <ArenaReadHeroInFightItem>evt.sender!;
            this.itemClickFunc(item);
        }
    }

    private OnItemDragStart(evt: fgui.Event) {
        var btn: ArenaReadHeroInFightItem = <ArenaReadHeroInFightItem>evt.sender!;
        if (ArenaReadyView.readyHeroLock) {
            btn.stopDrag();
            PublicPopupCtrl.Inst().Center(Language.Arena.tips3);
            return;
        }
        btn.sortingOrder = MAX_IN_FIGHT_HERO_COUNT;
    }

    private OnItemDragEnd(evt: fgui.Event) {
        var btn: ArenaReadHeroInFightItem = <ArenaReadHeroInFightItem>evt.sender!;
        btn.sortingOrder = 0;
        let ij = this.GetIJByPos(btn.x, btn.y);
        this.swaping = true;
        this.SwapHero(btn.ij, ij, () => {
            this.swaping = false;
        });

        if (ViewManager.Inst().IsOpen(DragGuideView)) {
            ViewManager.Inst().CloseView(DragGuideView);

            //if(RoleData.Inst().IsGuideNum(15, false)) {
            GuideCtrl.Inst().Start(15);
            //}
        }
    }

    //交换两个格子上的英雄
    SwapHero(ijA: number, ijB: number, finishFunc?: () => any) {
        let heroA = this.GetHero(ijA);
        if (!heroA) {
            if (finishFunc) {
                finishFunc();
            }
            return;
        }

        if (ijA == ijB) {
            ijB = null;
        }

        let heroB = this.GetHero(ijB);
        let swapPosB: Vec2 = this.GetPosByIJ(ijA);
        let swapPosA: Vec2 = ijB == null ? swapPosB : this.GetPosByIJ(ijB);;
        heroA.MovePos(swapPosA, finishFunc);
        if (ijB != null) {
            this.heroMap.set(ijB, heroA);
            heroA.ij = ijB;
        }

        if (heroB) {
            this.heroMap.set(ijA, heroB);
            heroB.ij = ijA;
            heroB.sortingOrder = MAX_IN_FIGHT_HERO_COUNT - 1;
            heroB.MovePos(swapPosB, () => {
                heroB.sortingOrder = 0;
            });
        }

        if (ijB != null && heroB == null) {
            this.heroMap.delete(ijA);
        }
    }
}

export class ArenaReadHeroInFightItem extends BaseItemGB {
    protected _data: IArenaReadHeroInFightItemData;

    protected viewNode = {
        HeroIcon: <EGLoader>null,
    };

    get info(): IPB_HeroNode {
        return this._data.info;
    }

    set ij(ij: number) {
        this._data.ij = ij;
    }
    get ij(): number {
        return this._data.ij;
    }

    get score(): number {
        if (this._data == null) {
            return 0;
        }
        let cfg = HeroData.Inst().GetHeroBaseCfg(this._data.info.heroId);
        let level = this._data.info.heroLevel;
        if (level == 0) {
            level = ArenaData.Inst().GetFreeHeroLevel(this._data.info.heroId);
        }
        let scoreCfg = HeroData.Inst().GetHeroIntegralLevelCfg(cfg.hero_color, level);
        if (!scoreCfg) {
            return 0;
        }
        return scoreCfg.hero_integral;
    }

    public SetData(data: IArenaReadHeroInFightItemData): void {
        super.SetData(data);
        let level = data.info.heroLevel;
        if (level == 0) {
            level = ArenaData.Inst().GetFreeHeroLevel(data.info.heroId);
        }
        let levelCfg = HeroData.Inst().GetHeroLevelCfg(data.info.heroId, level);
        UH.SetIcon(this.viewNode.HeroIcon, levelCfg.res_id, ICON_TYPE.ROLE, null, true);
    }

    private moveTweenr: fgui.GTweener;
    MovePos(pos: Vec2, finishFunc?: () => any, time: number = 0.2, easeType: fgui.EaseType = fgui.EaseType.SineOut) {
        if (this.moveTweenr) {
            this.moveTweenr.kill();
            this.moveTweenr = null;
        }
        let gtweenr = fgui.GTween.to2(this.x, this.y, pos.x, pos.y, time);
        this.moveTweenr = gtweenr;
        gtweenr.setEase(easeType);
        gtweenr.onUpdate((tweener: fgui.GTweener) => {
            this.setPosition(tweener.value.x, tweener.value.y);
        })
        gtweenr.onComplete(() => {
            if (this.node == null) {
                return;
            }
            if (finishFunc) {
                finishFunc();
            }
            if (this.moveTweenr) {
                this.moveTweenr = null;
            }
        })
    }

    protected onDisable(): void {
        super.onDisable();
        if (this.moveTweenr) {
            this.moveTweenr.kill();
            this.moveTweenr = null;
        }
    }
}

export class BattleArenaSelectHeroItem extends BaseItem {
    protected viewNode = {
        BG: <EGLoader>null,
        Level: <fgui.GTextField>null,
        HeroIcon: <EGLoader>null,
        RaceIcon: <EGLoader>null,
        FreeFlag: <fgui.GObject>null,
    };

    protected onConstruct(): void {
        super.onConstruct();
    }

    public SetData(data: IPB_HeroNode): void {
        this._data = data;
        let cfg = HeroData.Inst().GetHeroBaseCfg(data.heroId);

        let color = cfg.hero_color;
        this.viewNode.FreeFlag.visible = data.heroLevel == 0;
        UH.SpriteName(this.viewNode.BG, "CommonAtlas", "HeroBgPinZhi" + color);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + cfg.hero_race);

        let level: number;
        if (data.heroLevel == 0) {
            level = ArenaData.Inst().GetFreeHeroLevel(data.heroId);
        } else {
            level = data.heroLevel;
        }

        UH.SetText(this.viewNode.Level, Language.Arena.Level + level);
        let levelCfg = HeroData.Inst().GetHeroLevelCfg(data.heroId, level);
        UH.SetIcon(this.viewNode.HeroIcon, levelCfg.res_id, ICON_TYPE.ROLE, null, true);
    }
}
import { GetCfgValue } from 'config/CfgCommon';
import { HandleCollector } from 'core/HandleCollector';
import { ObjectPool } from 'core/ObjectPool';
import { SMDHandle } from 'data/HandleCollectorCfg';
import * as fgui from "fairygui-cc";
import { ViewManager } from 'manager/ViewManager';
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { BagData } from 'modules/bag/BagData';
import { BaseItem, BaseItemGB, BaseItemGP } from 'modules/common/BaseItem';
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { COLORS } from 'modules/common/ColorEnum';
import { CommonId, ICON_TYPE } from 'modules/common/CommonEnum';
import { Mod } from 'modules/common/ModuleDefine';
import { CurrencyShow, ExpShow } from 'modules/extends/Currency';
import { EGLoader } from 'modules/extends/EGLoader';
import { RoleData } from 'modules/role/RoleData';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';
import { CocHighPerfList } from '../../ccomponent/CocHighPerfList';
import { TextHelper } from '../../helpers/TextHelper';
import { UH } from "../../helpers/UIHelper";
import { Language } from './../common/Language';
import { HeroCtrl, HeroReqType } from './HeroCtrl';
import { HeroData, HeroDataModel, HeroLock } from "./HeroData";
import { HeroItemBtnView } from './HeroItemBtnView';
import { HeroItemCell } from './HeroItemCell';
import { TodayGainView } from './TodayGainView';
import { HeroIntegralPreviewView } from './HeroIntegralPreviewView';

@BaseView.registView
export class HeroView extends BaseView {

    private sp_show: UISpineShow = undefined;

    protected viewRegcfg = {
        UIPackName: "Hero",
        ViewName: "HeroView",
        LayerType: ViewLayer.ButtomMain,
        ViewCache: true
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,

        bg: <fgui.GImage>null,
        BattleClose: <fgui.GLoader>null,
        BtnBless: <fgui.GButton>null,
        // HerotList: <HeroListCell>null,
        List: <fgui.GList>null,
        ParentArrow: <fgui.GComponent>null,

        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,

        HeroItem1: <HeroItemCell>null,
        HeroItem2: <HeroItemCell>null,
        HeroItem3: <HeroItemCell>null,
        HeroItem4: <HeroItemCell>null,

        HeroBattleItem1: <HeroViewHeroItemBattleItem>null,
        HeroBattleItem2: <HeroViewHeroItemBattleItem>null,
        HeroBattleItem3: <HeroViewHeroItemBattleItem>null,
        HeroBattleItem4: <HeroViewHeroItemBattleItem>null,
        BtndayWish: <BtndayWish>null,

        GpBless: <fgui.GGroup>null,
        RaceIcon: <fgui.GLoader>null,
        RaceName: <fgui.GTextField>null,
        BlessDesc: <fgui.GTextField>null,
    };

    protected extendsCfg = [
        { ResName: "HeroItem", ExtendsClass: HeroItemCell },
        { ResName: "HeroListCell", ExtendsClass: HeroListCell },
        { ResName: "HeroTitle", ExtendsClass: HeroTitle },
        { ResName: "HeroBattleItem", ExtendsClass: HeroViewHeroItemBattleItem },
        { ResName: "ProgressHero", ExtendsClass: HeroViewHeroProgress },
        { ResName: "BtndayWish", ExtendsClass: BtndayWish },
    ];

    private data: HeroData = HeroData.Inst();
    private hero_list_data: any;
    private HeroItemAnim: fgui.Transition;

    InitData() {
        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FulshListData.bind(this), "OtherChange")
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FulshListData.bind(this), "FlushRoleInfo");
        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FulshListData.bind(this), "heroInfoFlush");
        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FlushEffShow.bind(this), "heroBattle");
        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FlushTodayGain.bind(this), "todayGainFlush");

        this.viewNode.BattleClose.onClick(this.onCllickBattleClose, this);
        this.viewNode.BtnBless.onClick(this.OnClickBless, this);
        this.viewNode.BtndayWish.onClick(this.OnClickBless, this);

        this.viewNode.List.itemProvider = this.GetListItemResource.bind(this);
        // this.viewNode.List.setVirtual();

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.Energy);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        this.viewNode.Currency2.BtnAddShow(true);

        this.HeroItemAnim = this.view.getTransition("HeroItemAnim");

        this.FulshListData();
        //this.FlushEffectShow();
        this.FlushTodayGain();
        this.viewNode.List.scrollToView(0);
    }

    CloseCallBack() {
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = undefined;
        }
    }

    FlushEffectShow() {
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = undefined;
        }
        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.Spine("jiantou_TB/jiantou_TB"), true, (obj: any) => {
            this.viewNode.ParentArrow._container.insertChild(obj, 0);
        });
    }

    private FulshListData() {
        let battleHero = HeroData.Inst().GetInBattleHeros()
        this.viewNode.HeroItem1.SetData(battleHero[0]);
        this.viewNode.HeroItem2.SetData(battleHero[1]);
        this.viewNode.HeroItem3.SetData(battleHero[2]);
        this.viewNode.HeroItem4.SetData(battleHero[3]);

        // this.viewNode.HeroBattleItem1.FlushShow(battleHero[0], 0);
        // this.viewNode.HeroBattleItem2.FlushShow(battleHero[1], 1);
        // this.viewNode.HeroBattleItem3.FlushShow(battleHero[2], 2);
        // this.viewNode.HeroBattleItem4.FlushShow(battleHero[3], 3);

        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.TodayGain.View);
        // this.viewNode.BtndayWish.visible = isOpen.is_open;
        this.viewNode.GpBless.visible = isOpen.is_open;  //旧

        // let list: any[] = []
        let hero_list_data = this.data.GetHeroListData();
        // for (let element of hero_list_data) {
        //     if (typeof (element) == "number") {
        //         list.push(element)
        //     } else {
        //         list = list.concat(element)
        //     }
        // }
        this.hero_list_data = hero_list_data
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = this.hero_list_data.length;

        this.viewNode.BattleClose.visible = false;
    }

    private itemRenderer(index: number, item: HeroListCell) {
        item.SetData(this.hero_list_data[index]);
    }

    private GetListItemResource(index: number) {
        let data = this.hero_list_data[index];
        if (data < 0) {
            return fgui.UIPackage.getItemURL("Hero", "HeroTitle");
        } else {
            return fgui.UIPackage.getItemURL("Hero", "HeroListCell");
        }
    }

    private FlushEffShow() {
        let selecBattletHeroId = HeroData.Inst().heroBattleid;
        this.viewNode.BattleClose.visible = selecBattletHeroId > 0;
        this.HeroItemAnim.stop();
        if (selecBattletHeroId <= 0) return;
        this.HeroItemAnim.play(() => {
            this.FlushEffShow();
        });
    }

    FlushTodayGain() {
        // this.viewNode.BtndayWish.FlushShow();

        // **** */
        let info = HeroData.Inst().TodayGainInfo
        if (info) {
            let co = HeroData.Inst().GetTodayGainInfoBySeq(info.seq)
            if (co) {
                UH.SetText(this.viewNode.BlessDesc, TextHelper.Format(Language.Hero.TodayGain.DescShow, GetCfgValue(Language.Hero.fixedType, co.gain_type), info.param[0] / 100))
                UH.SetText(this.viewNode.RaceName, GetCfgValue(Language.Hero.Race, co.hero_race))
                this.viewNode.RaceName.color = GetCfgValue(COLORS, `HeroRace${co.hero_race}`)
                UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", `HeroAttr${co.hero_race}`);
            }
        }
    }

    OpenCallBack() {
        this.ReSetWindowSize();
        this.view.setSize(this["screenShowSize"].x, this["screenShowSize"].y);
        this.view.center();
    }

    private onCllickBattleClose() {
        HeroData.Inst().heroBattleid = -1;
    }

    OnClickBless() {
        ViewManager.Inst().OpenView(TodayGainView)
    }
}

export class HeroTitle extends BaseItem {
    protected viewNode = {
        bg1: <fgui.GImage>null,
        bg2: <fgui.GImage>null,
        Title: <fgui.GTextField>null,
        Integral: <fgui.GTextField>null,
        BtnIntegral: <fgui.GButton>null,
    };
    handleCollector: any;
    type: number;

    public SetData(data: number) {
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }
        this.type = data;
        this.visible = true;
        this.addSmartDataCare(HeroData.Inst().ResultData, this.FlushBattleShow.bind(this), "heroBattle");
        this.getController("TitleState").selectedIndex = data + 2

        this.viewNode.BtnIntegral.onClick(this.OnClickIntegral, this);

        if (data == HeroLock.unlock) {
            UH.SetText(this.viewNode.Title, Language.Hero.unlock);
            let num = HeroData.Inst().GetHeroIntegral()
            UH.SetText(this.viewNode.Integral, Language.Hero.integralInfo + num);
        } else {
            UH.SetText(this.viewNode.Title, Language.Hero.lock);
        }
    }

    OnClickIntegral() {
        ViewManager.Inst().OpenView(HeroIntegralPreviewView)
    }

    protected FlushBattleShow() {
        let selecBattletHeroId = HeroData.Inst().heroBattleid;
        if (this.type == HeroLock.latching) {
            this.visible = (selecBattletHeroId <= 0);
        }
    }
    private addSmartDataCare(smdata: any, callback: Function, ...keys: string[]) {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
    };
}

export class HeroListCell extends BaseItem {
    protected viewNode = {
        List: <fgui.GList>null,
    };
    protected onConstruct(): void {
        super.onConstruct();
        // this.viewNode.List._container.addComponent(CocHighPerfList);
    }
    private hero_data: number[];
    private renderListItem(index: number, item: HeroItemCell) {
        item.SetData(this.hero_data[index]);
    }
    public SetData(data: number[]) {
        this.hero_data = data;
        let row = Math.ceil(data.length / 4)
        this.height = 270 * row + 55;
        this.viewNode.List.height = 270 * row + 55;
        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.setVirtual();
        this.viewNode.List.numItems = data.length;

    }
}

export class HeroViewHeroItemBattleItem extends BaseItemGB {
    itemIndex: number
    guideShow: boolean
    private indexCtrler: fgui.Controller
    private heroMode: HeroDataModel;

    protected viewNode = {
        BgSp: <fgui.GLoader>null,
        IconSp: <EGLoader>null,
        LevelShow: <fgui.GTextField>null,
        ProgressShow: <HeroViewHeroProgress>null,
        MaxShow: <fgui.GImage>null,
        GpNum: <fgui.GGroup>null,
    };

    protected onConstruct(): void {
        super.onConstruct();
        this.indexCtrler = this.getController("IndexCtrl");
        this.onClick(this.OnClickItem, this);
    }

    FlushShow(data: number | HeroDataModel, itemIndex: number) {
        if (data instanceof (HeroDataModel)) {
            if (data.hero_id == 0) return this.visible = false;
            this.heroMode = data;
        } else {
            if (data == 0) return this.visible = false;
            this.heroMode = new HeroDataModel(data);
        }
        this.itemIndex = itemIndex
        this.indexCtrler.selectedIndex = itemIndex
        this.visible = true;
        UH.SetText(this.viewNode.LevelShow, TextHelper.Format(Language.Hero.MainItem.LevelShow, this.heroMode.level))
        if (itemIndex == 0 || itemIndex == 1) {
            UH.SpriteName(this.viewNode.BgSp, "Hero", `HeroColor_${this.heroMode.data.hero_color}`);
        } else {
            UH.SpriteName(this.viewNode.BgSp, "Hero", `HeroColor${this.heroMode.data.hero_color}`);
        }
        UH.SetIcon(this.viewNode.IconSp, this.heroMode.hero_id, ICON_TYPE.HEROSMAIN, null, true)

        let is_max = HeroData.Inst().IsHeroLevelMax(this.heroMode.hero_id);
        this.viewNode.MaxShow.visible = is_max;
        this.viewNode.ProgressShow.visible = !is_max;

        if (!is_max) {
            let levelCfg = this.heroMode.GetLevelCfg();
            let debris = HeroData.Inst().GetHeroDebris(levelCfg.upgrade2[0].item_id);
            let consume = HeroData.Inst().GetDebrisConsume(this.heroMode.hero_id);
            this.viewNode.ProgressShow.value = debris
            this.viewNode.ProgressShow.max = consume[0].num
            this.viewNode.ProgressShow.FlushShow(this.heroMode.data.hero_color)
        }
    }

    OnClickItem() {
        let heroBattleid = HeroData.Inst().heroBattleid;
        if (heroBattleid > 0 && heroBattleid != this.heroMode.hero_id) {
            let battle = HeroData.Inst().GetInBattleHeros();
            let index = battle.indexOf(this.heroMode.hero_id)
            this.SendHeroBattleReq(heroBattleid, index)
            HeroData.Inst().heroBattleid = 0;
            return;
        } else {
            let pos = this.node.worldPosition;
            ViewManager.Inst().OpenView(HeroItemBtnView, { data: this.heroMode, index: this.itemIndex, x: pos.x, y: pos.y })
        }
    }

    private SendHeroBattleReq(heroId: number, index: number) {
        AudioManager.Inst().PlayUIAudio(AudioTag.TanChuJieMian);
        HeroCtrl.Inst().SendHeroReq(HeroReqType.HERO_BATTLE, [heroId, index]);
    }
}

class HeroViewHeroProgress extends BaseItemGP {
    private spShow: UISpineShow = undefined;

    protected viewNode = {
        ProgressShow: <fgui.GTextField>null,
        BarMax: <fgui.GImage>null,
        PieceShow: <fgui.GImage>null,
        EffParent: <fgui.GComponent>null,
        BgSp: <fgui.GTextField>null,
    };

    protected onConstruct(): void {
        super.onConstruct()

        this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`1208038`), true, (obj: any) => {
            this.viewNode.EffParent._container.insertChild(obj, 0);
        });
    }

    FlushShow(hero_color: number) {
        let is_enough = this.value >= this.max
        this.viewNode.BarMax.visible = is_enough
        this.viewNode.PieceShow.visible = !is_enough
        this.viewNode.EffParent.visible = is_enough

        UH.SpriteName(this.viewNode.BgSp, "Hero", `JinDuDi${hero_color}`);
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
    }
}

export class BtndayWish extends BaseItemGB {
    protected viewNode = {
        title: <fgui.GTextField>null,
        icon: <fgui.GLoader>null,
        ParentArrow: <fgui.GComponent>null,
    };
    private sp_show: UISpineShow = undefined;

    FlushShow() {
        let info = HeroData.Inst().TodayGainInfo
        if (info) {
            let co = HeroData.Inst().GetTodayGainInfoBySeq(info.seq)
            if (co) {
                // UH.SetText(this.viewNode.BlessDesc, TextHelper.Format(Language.Hero.TodayGain.DescShow, GetCfgValue(Language.Hero.fixedType, co.gain_type), info.param[0] / 100))
                UH.SetText(this.viewNode.title, GetCfgValue(Language.Hero.Race, co.hero_race))
                this.viewNode.title.color = GetCfgValue(COLORS, `HeroRace${co.hero_race}`)
                UH.SpriteName(this.viewNode.icon, "CommonAtlas", `HeroAttr${co.hero_race}`);
            }
        }

        this.FlushEffectShow();
    }

    FlushEffectShow() {
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = undefined;
        }
        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.Spine("jiantou_TB/jiantou_TB"), true, (obj: any) => {
            this.viewNode.ParentArrow._container.insertChild(obj, 0);
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = undefined;
        }
    }

}
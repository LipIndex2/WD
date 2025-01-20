import { LoseTempleCtrl } from 'modules/LoseTemple/LoseTempleCtrl';
import * as fgui from "fairygui-cc";
import { BaseItemGB } from "modules/common/BaseItem";
import { HeroProgress } from "modules/extends/HeroCell";
import { LoseTempleData } from './LoseTempleData';
import { Language } from "modules/common/Language";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { HeroDataModel } from "modules/hero/HeroData";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { ViewManager } from "manager/ViewManager";
import { HeroInfoView } from "modules/hero/HeroInfoView";
import { HandleCollector } from 'core/HandleCollector';
import { SMDHandle } from 'data/HandleCollectorCfg';
import { LoseTempleEnergyView } from './LoseTempleEnergyView';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';
import { Timer } from 'modules/time/Timer';

export class LoseTempleHeroitem extends BaseItemGB {
    protected viewNode = {
        bg1: <fgui.GLoader>null,
        HeroIcon: <fgui.GLoader>null,
        RaceIcon: <fgui.GLoader>null,
        Progress: <HeroProgress>null,
        LevelShow: <fgui.GTextField>null,
        BtnLove1: <fgui.GButton>null,
        BtnLove2: <fgui.GButton>null,
        BtnLove3: <fgui.GButton>null,
        BtnUpgrade: <fgui.GButton>null,
        BtnBattle: <fgui.GButton>null,
        UISpineShow: <UISpineShow>null,
    };
    private info: any;
    private heroId: number;
    private isPub: boolean;
    private isClickLove: boolean;
    private heroMode: HeroDataModel;
    private stateCtrler: fgui.Controller
    private timer_ani: any = null;
    typeShow: boolean;
    handleCollector: any;
    protected onDestroy(): void {
        super.onDestroy();
        if (this.handleCollector) {
            HandleCollector.Destory(this.handleCollector);
            this.handleCollector = null;
        }
        Timer.Inst().CancelTimer(this.timer_ani);
        LoseTempleData.Inst().selectHeroId = 0;
    }
    protected onConstruct() {
        this.onClick(this.OnClickItem, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(heroid: number) {
        if (heroid == 0) return this.visible = false;
        this.info = LoseTempleData.Inst().GetHeroInfo(heroid);
        if (!this.info) return this.visible = false;
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }
        this.visible = true;
        this.heroId = heroid;
        this.stateCtrler = this.getController("LoseState");
        this.info = LoseTempleData.Inst().GetHeroInfo(heroid);
        this.isPub = LoseTempleData.Inst().IsPubHero(heroid);
        this.heroMode = new HeroDataModel(heroid, this.info.heroLevel, this.isPub)

        this.addSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushStateShow.bind(this), "selectHeroFlush");
        this.addSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushBattleShow.bind(this), "heroBattle");

        this.viewNode.BtnUpgrade.onClick(this.OnClickUpLevel, this);
        this.viewNode.BtnBattle.onClick(this.OnClickBattle, this);
        this.viewNode.BtnLove1.onClick(this.OnClickLove, this);
        this.viewNode.BtnLove2.onClick(this.OnClickLove, this);
        this.viewNode.BtnLove3.onClick(this.OnClickLove, this);

        if (!this.isPub) {
            this.viewNode.Progress.SetData(this.heroMode)
        }

        let battleHero = LoseTempleData.Inst().GetInBattleHeros()
        if (battleHero.indexOf(this.heroId) != -1) {
            this.viewNode.BtnBattle.title = Language.Hero.remove;
        } else {
            this.viewNode.BtnBattle.title = Language.Hero.use;
        }

        this.initStateShow();
        this.initUi();
        // this.EnergyConsume();
    }

    private FlushStateShow() {
        let selectHeroId = LoseTempleData.Inst().SelectHeroId;
        if (selectHeroId == this.heroId) {
            this.initStateShow();
        }
    }

    private FlushBattleShow() {
        let battleHeroId = LoseTempleData.Inst().heroBattleid;
        let battle = LoseTempleData.Inst().GetInBattleHeros();
        this.visible = battleHeroId <= 0 || battleHeroId == this.heroId || battle.indexOf(this.heroId) != -1;
    }

    private initUi() {
        let cfg = this.heroMode.data;
        let levelCfg = this.heroMode.GetLevelCfg();
        let isMax = this.info.heroLevel >= cfg.level_max;
        UH.SetText(this.viewNode.LevelShow, TextHelper.Format(Language.Hero.lv, this.info.heroLevel));
        UH.SetIcon(this.viewNode.HeroIcon, levelCfg.res_id, ICON_TYPE.ROLE);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + cfg.hero_race);
        UH.SpriteName(this.viewNode.bg1, "CommonAtlas", "HeroBgPinZhi" + cfg.hero_color);

        let img1 = fgui.UIPackage.getItemURL("CommonAtlas", "TiLi1");
        let img2 = fgui.UIPackage.getItemURL("CommonAtlas", "TiLi2");
        let energy = this.isPub ? this.info.energy : this.info.raLtEnergy;
        this.viewNode.BtnLove1.icon = energy > 0 ? img1 : img2
        this.viewNode.BtnLove2.icon = energy > 1 ? img1 : img2
        this.viewNode.BtnLove3.icon = energy > 2 ? img1 : img2

        this.viewNode.Progress.visible = !isMax;
    }

    private EnergyConsume() {
        Timer.Inst().CancelTimer(this.timer_ani);
        // if (LoseTempleData.energyConsume != this.heroId) return
        this.viewNode.UISpineShow.onDestroy();
        this.timer_ani = Timer.Inst().AddRunTimer(() => {
            this.viewNode.UISpineShow.LoadSpine(ResPath.UIEffect(1208054), true);
        }, 0.4, 1, false)
        // LoseTempleData.energyConsume = 0;
    }

    //状态显示
    private initStateShow() {
        if (this.isPub) {
            this.stateCtrler.selectedIndex = 1
        } else {
            this.stateCtrler.selectedIndex = 0
        }
    }

    private OnClickItem() {
        if (this.isClickLove) {
            this.isClickLove = false
            return
        }
        let heroBattleid = LoseTempleData.Inst().heroBattleid;
        if (heroBattleid > 0) {
            if (heroBattleid != this.heroId) {
                let battle = LoseTempleData.Inst().GetInBattleHeros();
                let index = battle.indexOf(this.heroId)
                LoseTempleCtrl.Inst().SendLoseSetFight(index, heroBattleid)
                LoseTempleData.Inst().heroBattleid = 0;
            } else {
                this.initStateShow();
            }
            return;
        }
        if (this.stateCtrler.selectedIndex == 2) {
            this.initStateShow();
        } else if (this.typeShow) {
            this.stateCtrler.selectedIndex = 2;
            LoseTempleData.Inst().selectHeroId = this.heroId;
        } else {
            this.OnClickUpLevel();
        }
    }

    private OnClickBattle() {
        let battle = LoseTempleData.Inst().GetInBattleHeros();
        let index = battle.indexOf(this.heroId)
        if (index != -1) {
            LoseTempleCtrl.Inst().SendLoseSetFight(index, 0)
        } else {
            let vacancy = battle.indexOf(0);
            if (vacancy != -1) {
                LoseTempleCtrl.Inst().SendLoseSetFight(vacancy, this.heroId)
            } else {
                LoseTempleData.Inst().heroBattleid = this.heroId;
                this.initStateShow();
            }
        }
    }

    private OnClickUpLevel() {
        ViewManager.Inst().OpenView(HeroInfoView, this.heroMode);
    }

    private OnClickLove() {
        let energy = this.isPub ? this.info.energy : this.info.raLtEnergy;
        if (energy == 3) {
            return;
        }
        this.isClickLove = true;
        ViewManager.Inst().OpenView(LoseTempleEnergyView, {
            heroid: this.heroMode.hero_id,
            confirmFunc: () => {
                this.EnergyConsume();
            }
        });
    }

    TypeShow(typeShow: boolean) {
        this.typeShow = typeShow;
    }

    private addSmartDataCare(smdata: any, callback: Function, ...keys: string[]) {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
    };
}
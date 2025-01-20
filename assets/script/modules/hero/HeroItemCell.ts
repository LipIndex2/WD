import { HandleCollector } from 'core/HandleCollector';
import { SMDHandle } from 'data/HandleCollectorCfg';
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseItemGB } from "modules/common/BaseItem";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { HeroCtrl, HeroReqType } from 'modules/hero/HeroCtrl';
import { TextHelper } from '../../helpers/TextHelper';
import { UH } from "../../helpers/UIHelper";
import { HeroData, HeroDataModel } from './HeroData';
import { HeroInfoView } from "./HeroInfoView";
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { HeroProgress } from 'modules/extends/HeroCell';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ObjectPool } from 'core/ObjectPool';
import { ResPath } from 'utils/ResPath';
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { Mod } from 'modules/common/ModuleDefine';

export class HeroItemCell extends BaseItemGB {
    protected viewNode = {
        bg: <fgui.GLoader>null,
        RaceIcon: <fgui.GLoader>null,
        HeroIcon: <fgui.GLoader>null,
        Lock: <fgui.GImage>null,
        ProgressBar: <HeroProgress>null,
        LevelShow: <fgui.GTextField>null,
        Desk: <fgui.GTextField>null,
        BtnUpgrade: <fgui.GButton>null,
        BtnBattle: <fgui.GButton>null,
        BtnSummon: <fgui.GButton>null,
        Max: <fgui.GImage>null,
        UISpineShow: <UISpineShow>null,
    };
    handleCollector: any;
    private heroId: number;
    private heroMode: HeroDataModel;
    private stateCtrler: fgui.Controller
    private sp_show: UISpineShow = undefined;;

    protected onConstruct() {
        this.onClick(this.OnClickItem, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    protected onDestroy(): void {
        super.onDestroy();
        if (this.handleCollector) {
            HandleCollector.Destory(this.handleCollector);
            this.handleCollector = null;
        }
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = null;
        }
        HeroData.Inst().selectHeroId = 0;
    }
    public SetData(data: number | HeroDataModel) {
        if (data instanceof (HeroDataModel)) {
            if (data.hero_id <= 0) return this.visible = false;
            this.heroId = data.hero_id;
            this.heroMode = data;
        } else {
            if (data <= 0) return this.visible = false;
            this.heroId = data;
            this.heroMode = new HeroDataModel(this.heroId);
        }
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }
        this.visible = true;

        this.stateCtrler = this.getController("HeroState");

        this.addSmartDataCare(HeroData.Inst().ResultData, this.FlushStateShow.bind(this), "selectHeroFlush");
        this.addSmartDataCare(HeroData.Inst().ResultData, this.FlushBattleShow.bind(this), "heroBattle");

        this.viewNode.BtnUpgrade.onClick(this.OnClickUpLevel, this);
        this.viewNode.BtnBattle.onClick(this.OnClickBattle, this);
        this.viewNode.BtnSummon.onClick(this.OnClickSummon, this);

        this.viewNode.ProgressBar.SetData(this.heroMode);

        this.initStateShow();
        this.initUi();

    }

    private initUi() {

        let battle = HeroData.Inst().GetInBattleHeros();
        let levelCfg = this.heroMode.GetLevelCfg();
        let debris = this.heroMode.DebrisNum();
        let consume = HeroData.Inst().GetDebrisConsume(this.heroId);
        let levelStr = TextHelper.Format(Language.Hero.lv, this.heroMode.level);
        if (this.stateCtrler.selectedIndex == 1) {
            if (debris >= consume[0].num) {
                levelStr = Language.Hero.summon;
            } else {
                levelStr = Language.Hero.unlock;
            }
        }
        if (battle.indexOf(this.heroId) != -1) {
            this.viewNode.BtnBattle.title = Language.Hero.remove;
        } else {
            this.viewNode.BtnBattle.title = Language.Hero.use;
        }
        if (debris >= consume[0].num && this.stateCtrler.selectedIndex != 5) {
            this.viewNode.BtnUpgrade.title = Language.Hero.upgrade;
        } else {
            this.viewNode.BtnUpgrade.title = Language.Hero.message;
        }
        UH.SetText(this.viewNode.LevelShow, levelStr);
        if (this.heroMode.data.unlock_type == 0) {
            UH.SetText(this.viewNode.Desk, TextHelper.Format(Language.Hero.LockDesk, this.heroMode.data.unlock));
        } else {
            UH.SetText(this.viewNode.Desk, Language.Hero.activityLock);
        }
        let color = this.heroMode.level > 0 ? this.heroMode.data.hero_color : 1
        UH.SpriteName(this.viewNode.bg, "CommonAtlas", "HeroBgPinZhi" + color);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + this.heroMode.data.hero_race);
        UH.SetIcon(this.viewNode.HeroIcon, levelCfg.res_id, ICON_TYPE.ROLE, null, true);
        let info = HeroData.Inst().TodayGainInfo
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.TodayGain.View);
        if (isOpen.is_open && info) {
            let co = HeroData.Inst().GetTodayGainInfoBySeq(info.seq)
            if (co) {
                //属性特效
                if (this.heroMode.data.hero_race == co.hero_race) {
                    this.viewNode.UISpineShow.LoadSpine(ResPath.UIEffect(1208087), true);
                } else {
                    this.viewNode.UISpineShow.onDestroy();
                }
            }
        }

    }

    private FlushStateShow() {
        let selectHeroId = HeroData.Inst().SelectHeroId;
        if (selectHeroId == this.heroId) {
            this.initStateShow();
        }
    }

    //状态显示
    private initStateShow() {
        let isLock = HeroData.Inst().IsHeroLock(this.heroId);//解锁
        let isActivate = this.heroMode.IsActive();//是否激活
        let is_max = HeroData.Inst().IsHeroLevelMax(this.heroId);
        if (!isLock) {//未解锁
            this.stateCtrler.selectedIndex = 0
        } else if (!isActivate) {//未激活
            this.stateCtrler.selectedIndex = 1
        } else if (is_max) {//满级
            this.stateCtrler.selectedIndex = 5
        } else {//解锁常态
            this.stateCtrler.selectedIndex = 3
        }
    }

    private OnClickItem() {
        let heroBattleid = HeroData.Inst().heroBattleid;
        if (heroBattleid > 0) {
            if (heroBattleid != this.heroId) {
                let battle = HeroData.Inst().GetInBattleHeros();
                let index = battle.indexOf(this.heroId)
                this.SendHeroBattleReq(heroBattleid, index)
                HeroData.Inst().heroBattleid = 0;
            } else {
                this.initStateShow();
            }
            return;
        }
        if (this.stateCtrler.selectedIndex == 0 || this.stateCtrler.selectedIndex == 1) {
            let debris = this.heroMode.DebrisNum();
            let consume = HeroData.Inst().GetDebrisConsume(this.heroId);
            if (debris >= consume[0].num) {
                this.stateCtrler.selectedIndex = 2;
            } else {
                this.OnClickUpLevel();
            }
            HeroData.Inst().selectHeroId = this.heroId;
        } else if (this.stateCtrler.selectedIndex == 2) {
            this.stateCtrler.selectedIndex = 1
        } else if (this.stateCtrler.selectedIndex == 3 || this.stateCtrler.selectedIndex == 5) {
            this.stateCtrler.selectedIndex = 4
            HeroData.Inst().selectHeroId = this.heroId;
        } else if (this.stateCtrler.selectedIndex == 4) {
            let is_max = HeroData.Inst().IsHeroLevelMax(this.heroId);
            if (is_max) {
                this.stateCtrler.selectedIndex = 5
            } else {
                this.stateCtrler.selectedIndex = 3
            }
        }
    }

    private FlushBattleShow() {
        let battleHeroId = HeroData.Inst().heroBattleid;
        let battle = HeroData.Inst().GetInBattleHeros();
        this.visible = battleHeroId <= 0 || battleHeroId == this.heroId || battle.indexOf(this.heroId) != -1;
    }

    private addSmartDataCare(smdata: any, callback: Function, ...keys: string[]) {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
    };

    private OnClickBattle() {
        let battle = HeroData.Inst().GetInBattleHeros();
        let index = battle.indexOf(this.heroId)
        if (index != -1) {
            this.SendHeroBattleReq(0, index)
        } else {
            let vacancy = battle.indexOf(0);
            if (vacancy != -1) {
                this.SendHeroBattleReq(this.heroId, vacancy)
            } else {
                HeroData.Inst().heroBattleid = this.heroId;
                this.initStateShow();
            }
        }
    }

    private OnClickUpLevel() {
        ViewManager.Inst().OpenView(HeroInfoView, this.heroMode);
    }

    private OnClickSummon() {
        HeroCtrl.Inst().SendHeroReq(HeroReqType.HERO_UP, [this.heroId])
    }

    private SendHeroBattleReq(heroId: number, index: number) {
        AudioManager.Inst().PlayUIAudio(AudioTag.TanChuJieMian);
        HeroCtrl.Inst().SendHeroReq(HeroReqType.HERO_BATTLE, [heroId, index]);
    }
}

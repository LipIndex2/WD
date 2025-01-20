import { HandleCollector } from "core/HandleCollector";
import { ObjectPool } from "core/ObjectPool";
import { SMDHandle } from "data/HandleCollectorCfg";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BagData } from "modules/bag/BagData";
import { BaseItem, BaseItemGB, BaseItemGP } from "modules/common/BaseItem";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { HeroData, HeroDataModel } from "modules/hero/HeroData";
import { HeroInfoView } from "modules/hero/HeroInfoView";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { Timer } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { CocHighPerfList } from "../../ccomponent/CocHighPerfList";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { Mod } from "modules/common/ModuleDefine";

export class HeroItem extends BaseItem {
    private heroMode: HeroDataModel;
    private handleCollector: HandleCollector;

    protected viewNode = {
        bg1: <fgui.GLoader>null,
        Progress: <HeroProgress>null,
        HeroIcon: <fgui.GLoader>null,
        LevelShow: <fgui.GTextField>null,
        LevelLendShow: <fgui.GTextField>null,
        Max: <fgui.GImage>null,
        GpNormal: <fgui.GGroup>null,
        GpLend: <fgui.GGroup>null,
    };

    public SetData(hero: number | HeroDataModel) {
        let lend_show = false
        let Name_show = false
        if (hero instanceof (HeroDataModel)) {
            if (hero.hero_id <= 0) return this.visible = false;
            this.heroMode = hero;
            lend_show = hero.lend_show
            Name_show = hero.Name_show
        } else {
            if (hero <= 0) return this.visible = false;
            this.heroMode = new HeroDataModel(hero);
        }
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }
        this.visible = true;

        this.addSmartDataCare(BagData.Inst().BagItemData, this.FlushNumShow.bind(this), "OtherChange")

        let levelCfg = this.heroMode.GetLevelCfg();
        let LevelShow;
        if (Name_show) {
            LevelShow = this.heroMode.data.hero_name;
        } else if (this.heroMode.level > 0) {
            LevelShow = TextHelper.Format(Language.Hero.lv, this.heroMode.level)
        } else {
            let isLock = HeroData.Inst().IsHeroLock(this.heroMode.hero_id);
            LevelShow = isLock ? Language.Hero.unlock : Language.Hero.lock
        }
        UH.SetText(this.viewNode.LevelShow, LevelShow)
        UH.SetText(this.viewNode.LevelLendShow, TextHelper.Format(Language.Hero.lv, this.heroMode.level))
        UH.SetIcon(this.viewNode.HeroIcon, levelCfg.res_id, ICON_TYPE.ROLE);
        UH.SpriteName(this.viewNode.bg1, "CommonAtlas", "HeroBgPinZhi" + this.heroMode.data.hero_color);
        let is_max = HeroData.Inst().IsHeroLevelMax(this.heroMode.hero_id);
        this.viewNode.Max.visible = is_max;
        this.viewNode.Progress.visible = !is_max;
        this.viewNode.GpNormal.visible = !lend_show
        this.viewNode.GpLend.visible = lend_show
        this.FlushNumShow();
    }

    private FlushNumShow() {
        this.viewNode.Progress.SetData(this.heroMode)
    }

    private addSmartDataCare(smdata: any, callback: Function, ...keys: string[]) {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
    };

    protected onDestroy(): void {
        super.onDestroy();
        if (this.handleCollector) {
            HandleCollector.Destory(this.handleCollector);
            this.handleCollector = null;
        }
    }

    public ProgressAniShow(callback: Function) {
        this.viewNode.Progress.ProgressAniShow(callback)
    }

    LendShow() {
        this.viewNode.GpLend.y = 163;
        this.viewNode.bg1.height = 210;
    }

}

export class HeroCell extends BaseItemGB {
    protected viewNode = {
        Lock: <fgui.GImage>null,
        RaceIcon: <fgui.GLoader>null,
        HeroItem: <HeroItem>null,
        UISpineShow: <UISpineShow>null,
    };
    private heroid: number;
    protected onConstruct() {
        this.onClick(this.onClickOpen, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public SetData(data: number | HeroDataModel) {
        super.SetData(data)
        let lend_show = false
        let Name_show = false
        if (data instanceof (HeroDataModel)) {
            this.heroid = data.hero_id;
            if (data.hero_id <= 0) return this.visible = false;
            lend_show = data.lend_show
            Name_show = data.Name_show
        } else {
            if (data <= 0) return this.visible = false;
            this.heroid = data;
        }
        this.visible = true;
        let isLock = HeroData.Inst().GetHeroLevel(this.heroid);
        let basedata = HeroData.Inst().GetHeroBaseCfg(this.heroid);
        this.viewNode.Lock.visible = !isLock || lend_show;
        this.viewNode.HeroItem.SetData(data);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + basedata.hero_race);

        let info = HeroData.Inst().TodayGainInfo
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.TodayGain.View);
        if (isOpen.is_open && info) {
            let co = HeroData.Inst().GetTodayGainInfoBySeq(info.seq)
            if (co) {
                //属性特效
                if (basedata.hero_race == co.hero_race) {
                    this.viewNode.UISpineShow.LoadSpine(ResPath.UIEffect(1208087), true);
                } else {
                    this.viewNode.UISpineShow.onDestroy();
                }
            }
        }

    }
    onClickOpen() {
        ViewManager.Inst().OpenView(HeroInfoView, this._data)
    }

    public ProgressAniShow(callback: Function) {
        this.viewNode.HeroItem.ProgressAniShow(callback);
    }

    LendShow() {
        this.viewNode.Lock.visible = false;
        this.viewNode.HeroItem.LendShow();
    }
}

export class HeroProgress extends BaseItemGP {
    private spShow: UISpineShow = undefined;
    private timer_ani: any = null;

    protected viewNode = {
        BarShow: <fgui.GImage>null,
        DebrisShow: <fgui.GImage>null,
        bg: <fgui.GLoader>null,
        Title: <fgui.GTextField>null,
    };

    public SetData(data: HeroDataModel) {
        super.SetData(data)
        if(!this["_node"])return;
        this.data = data;
        let levelCfg = data.GetLevelCfg();
        if (!levelCfg) return;
        let debris = HeroData.Inst().GetHeroDebris(levelCfg.upgrade2[0].item_id);
        let consume = HeroData.Inst().GetDebrisConsume(data.hero_id);
        this.value = debris;
        this.max = consume[0].num;
        UH.SetText(this.viewNode.Title, debris + "/" + consume[0].num)
        UH.SpriteName(this.viewNode.bg, "CommonAtlas", "JinDuTiaoDi" + data.data.hero_color);
        let is_up = debris >= consume[0].num;
        this.stateShow(is_up);

        if (is_up) {
            if (!this.spShow) {
                this.EffShow();
            }
        } else {
            if (this.spShow) {
                ObjectPool.Push(this.spShow);
                this.spShow = null;
            }
        }
    }

    stateShow(visible: boolean) {
        this.viewNode.BarShow.visible = visible;
        this.viewNode.DebrisShow.visible = !visible;
    }

    ProgressAniShow(callback: Function) {
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
        this.stateShow(false);
        let levelCfg = this.data.GetLevelCfg();
        let debris = HeroData.Inst().GetHeroDebris(levelCfg.upgrade2[0].item_id);
        let consume = HeroData.Inst().GetHeroLevelCfg(this.data.hero_id, this.data.level).upgrade2;
        let consume2 = HeroData.Inst().GetHeroLevelCfg(this.data.hero_id, this.data.level + 1).upgrade2;
        let debrisNum = debris + consume[0].num;
        let bar = Math.ceil(debris / consume2[0].num * 100);
        let barMax = bar > 100 ? 100 : bar;
        let isSubtract = true;
        this.value = 100;
        this.max = 100;
        UH.SetText(this.viewNode.Title, debrisNum + "/" + consume[0].num)
        Timer.Inst().CancelTimer(this.timer_ani);
        this.timer_ani = Timer.Inst().AddRunTimer(() => {
            if (isSubtract) {
                this.value -= 5;
                UH.SetText(this.viewNode.Title, (Math.ceil(debrisNum - (consume[0].num * (1 - this.value / 100)))) + "/" + consume[0].num)
                if (this.value <= 0) {
                    isSubtract = false
                    this.value = 0;
                    UH.SetText(this.viewNode.Title, debris + "/" + consume2[0].num)
                }
            } else {
                this.value += 5;
                if (this.value >= barMax) {
                    Timer.Inst().CancelTimer(this.timer_ani);
                    this.value = debris;
                    this.max = consume2[0].num;
                    let is_up = debris >= consume2[0].num;
                    this.stateShow(is_up);
                    if (is_up) {
                        this.EffShow();
                    }
                    callback && callback();
                }
            }
        }, 0.03, -1, false)
    }

    EffShow() {
        // this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`1208038`), true, (obj: any) => {
        //     obj.setPosition(80, 80);
        //     this._container.insertChild(obj, 3);
        //     CocHighPerfList.emit(this.node);
        // });
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
        Timer.Inst().CancelTimer(this.timer_ani);
    }
}
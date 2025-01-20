import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { HeroData, HeroDataModel } from "./HeroData";
import { ViewManager } from "manager/ViewManager";
import { HeroInfoView } from "./HeroInfoView";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { HeroCtrl, HeroReqType } from "./HeroCtrl";
import { UH } from "../../helpers/UIHelper";

@BaseView.registView
export class HeroItemBtnView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Hero",
        ViewName: "HeroItemBtnView",
        LayerType: ViewLayer.Normal,
        ShowAnim: true,
        CloseAudio: AudioTag.TongYongClick,
        ViewMask: ViewMask.BlockClose,
    };

    protected viewNode = {
        GpShow: <fgui.GGroup>null,
        bg: <fgui.GTextField>null,
        BtnUpgrade: <fgui.GButton>null,
        BtnBattle: <fgui.GButton>null,
    };
    private heroMode: HeroDataModel;
    private heroId: number;
    InitData(param: { data: number | HeroDataModel, index: number, x: number, y: number }) {
        if (param.data instanceof (HeroDataModel)) {
            this.heroId = param.data.hero_id;
            this.heroMode = param.data;
        } else {
            if (param.data == 0) return this.visible = false;
            this.heroId = param.data;
            this.heroMode = new HeroDataModel(this.heroId);
        }
        if (param.index == 0 || param.index == 2) {
            this.viewNode.GpShow.x = param.x - 20;
        } else {
            this.viewNode.GpShow.x = param.x - 150;
        }
        if (param.index == 0 || param.index == 1) {
            this.viewNode.GpShow.y = 1600 - param.y - 10;
        } else {
            this.viewNode.GpShow.y = 1600 - param.y + 100;
        }

        this.viewNode.BtnUpgrade.onClick(this.OnClickUpLevel, this);
        this.viewNode.BtnBattle.onClick(this.OnClickBattle, this);

        UH.SpriteName(this.viewNode.bg, "Hero", "ShangZhenAnNiu" + this.heroMode.data.hero_color)

        let debris = this.heroMode.DebrisNum();
        let consume = HeroData.Inst().GetDebrisConsume(this.heroId);
        let is_max = HeroData.Inst().IsHeroLevelMax(this.heroId);
        if (debris >= consume[0].num && !is_max) {
            this.viewNode.BtnUpgrade.title = Language.Hero.upgrade;
        } else {
            this.viewNode.BtnUpgrade.title = Language.Hero.message;
        }

    }

    private OnClickUpLevel() {
        ViewManager.Inst().OpenView(HeroInfoView, this.heroMode);
        ViewManager.Inst().CloseView(HeroItemBtnView)
    }

    private OnClickBattle() {
        let battle = HeroData.Inst().GetInBattleHeros();
        let index = battle.indexOf(this.heroId)
        this.SendHeroBattleReq(0, index)
    }

    private SendHeroBattleReq(heroId: number, index: number) {
        AudioManager.Inst().PlayUIAudio(AudioTag.TanChuJieMian);
        HeroCtrl.Inst().SendHeroReq(HeroReqType.HERO_BATTLE, [heroId, index]);
        ViewManager.Inst().CloseView(HeroItemBtnView)
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}
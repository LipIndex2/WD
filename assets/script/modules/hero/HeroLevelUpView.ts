import { GetCfgValue } from "config/CfgCommon";
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BattleData } from "modules/Battle/BattleData";
import { GrowUpGiftData } from "modules/GrowUpGift/GrowUpGiftData";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { ICON_TYPE, IsHeroEffectlShow } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { CommonBoard4 } from "modules/common_board/CommonBoard4";
import { HeroCell } from "modules/extends/HeroCell";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { RoleData } from "modules/role/RoleData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { Timer } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { HeroData, HeroDataModel, HeroSkillData } from "./HeroData";
import { HeroInfoView } from "./HeroInfoView";
import { HeroSkillCell } from "modules/common_item/HeroSkillCellItem";

@BaseView.registView
export class HeroLevelUpView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroLevelUp",
        ViewName: "HeroLevelUpView",
        LayerType: ViewLayer.Normal,
    };

    protected extendsCfg = [
        { ResName: "CapacityCell", ExtendsClass: CapacityCell },
        { ResName: "BtnSkill", ExtendsClass: BtnSkill },
        { ResName: "SkillInfo", ExtendsClass: SkillInfo },
        { ResName: "CapacityListCell", ExtendsClass: CapacityListCell },
    ];

    protected viewNode = {
        Name: <fgui.GTextField>null,
        BtnOnGo: <fgui.GButton>null,
        List: <fgui.GList>null,
        HeroCell: <HeroCell>null,
        // SkillShow: <fgui.GGroup>null,
        SkillInfo: <SkillInfo>null,
        DescShow: <fgui.GGroup>null,
        // bg: <EGLoader>null,
        Board: <CommonBoard4>null,
        Damage: <fgui.GTextField>null,
        GpDamage: <fgui.GGroup>null,
    };

    private heroMode: HeroDataModel;
    private effectListData: any[];
    private TwShow: fgui.GTweener = null;
    private timer_ani: any = null;
    private timer_ani1: any = null;
    private timer_ani2: any = null;
    private spShow1: UISpineShow = undefined;
    private spShow2: UISpineShow = undefined;

    InitData(param: HeroDataModel) {
        this.heroMode = param;
        this.view.getController("StateShow").selectedIndex = 0
        this.viewNode.BtnOnGo.onClick(this.closeView.bind(this));
        this.viewNode.HeroCell.grayed = false;
        this.viewNode.BtnOnGo.visible = false;
        AudioManager.Inst().PlayUIAudio(AudioTag.HeroLevelUp);
        // this.viewNode.HeroCell.SetData(this.heroMode.hero_id);
        this.viewNode.HeroCell.SetData(new HeroDataModel(this.heroMode.hero_id, this.heroMode.level - 1));


        UH.SetText(this.viewNode.Name, this.heroMode.data.hero_name)

        this.PlaySpineShow();
        this.FulshListData();

        GuideCtrl.Inst().AddGuideUi("HeroInfoLevelUpViewBtnContinue", this.viewNode.BtnOnGo);
    }

    PlaySpineShow() {
        this.spShow1 = ObjectPool.Get(UISpineShow, ResPath.UIEffect(1208020), true, (obj: any) => {
            obj.setPosition(400, -500);
            this.view._container.addChild(obj);
        });
        Timer.Inst().CancelTimer(this.timer_ani);
        this.timer_ani = Timer.Inst().AddRunTimer(() => {
            this.view.getTransition("LevelUpAni").play();
        }, 0.33, 1, false)
        Timer.Inst().CancelTimer(this.timer_ani2);
        this.timer_ani2 = Timer.Inst().AddRunTimer(() => {
            this.viewNode.HeroCell.ProgressAniShow(() => {
                this.viewNode.HeroCell.SetData(this.heroMode);
                this.EffectShow();
            });
        }, 0.3, 1, false)
    }

    private FulshListData() {
        let cfg = HeroData.Inst().GetHeroLevelCfg(this.heroMode.hero_id, this.heroMode.level - 1);
        let nextCfg = HeroData.Inst().GetHeroLevelCfg(this.heroMode.hero_id, this.heroMode.level);
        this.effectListData = [];
        for (let k in cfg) {
            let value = GetCfgValue(cfg, k);
            let value2 = ""
            if (IsHeroEffectlShow[k] && value > 0) {
                if (k == "att_scope") {
                    value = TextHelper.Format(GetCfgValue(Language.Hero.attScope, value), GetCfgValue(cfg, "att_distance"));
                } else if (k == "att" && nextCfg) {
                    value = value;
                    value2 = " > " + GetCfgValue(nextCfg, k)
                } else if (Language.HeroEffectlValue[k]) {
                    value = TextHelper.Format(Language.HeroEffectlValue[k], value)
                }
                this.effectListData.push({
                    key: k,
                    value: value,
                    value2: value2,
                    name: Language.HeroEffectlName[k],
                });
            }
        }
        this.viewNode.List.itemRenderer  =this.itemRenderer.bind(this);
        this.viewNode.List.numItems =this.effectListData.length;

        const allDamage = HeroData.Inst().GetAllHeroDamage();
        let damage = nextCfg.damage - cfg.damage;
        UH.SetText(this.viewNode.Damage, `${(allDamage - damage) / 100}%+${damage / 100}%`)
        let isShow = HeroData.Inst().GetDamageOpen()
        this.viewNode.GpDamage.visible = isShow
    }

    private itemRenderer(index: number, item: any){
        item.SetData(this.effectListData[index])
    }

    InitUI() {

    }

    skillShow() {
        let skill = this.heroMode.GetHeroLevelSkill(this.heroMode.level);
        if (!skill) return;
        this.viewNode.SkillInfo.visible = true;
        this.spShow2 = ObjectPool.Get(UISpineShow, ResPath.UIEffect(1208017), true, (obj: any) => {
            obj.setPosition(400, -1312);
            this.view._container.insertChild(obj, 4);
        });
        this.view.getTransition("SkillAni").play();
        this.viewNode.SkillInfo.SetData(skill);
    }

    EffectShow() {
        let show: Function = () => {
            this.TwShow = fgui.GTween.delayedCall(0.15).onComplete((tweener: fgui.GTweener) => {
                let item = <CapacityCell>this.viewNode.List.getChildAt(cur_index)
                if (item) {
                    item.EffShow()
                }
                if (cur_index == 1) {
                    item.AttrValueScaleAni()
                }
                cur_index++;
                if (cur_index < this.effectListData.length) {
                    show();
                } else {
                    this.skillShow();
                    this.viewNode.BtnOnGo.visible = true;
                }
                this.TwShow = null
            })
        }
        let cur_index: number = 0
        show()
    }

    // WindowSizeChange() {
    //     this.refreshBgSize(this.viewNode.bg)
    // }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.Board.FlushShow(() => {
            waitHandle.complete = true;
        })
    }

    OpenCallBack() {
        if (RoleData.Inst().IsGuideNum(2, false)) {
            ViewManager.Inst().CloseView(HeroInfoView)
            return;
        }
    }

    CloseCallBack() {
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }
        if (this.spShow1) {
            ObjectPool.Push(this.spShow1);
            this.spShow1 = null
        }
        if (this.spShow2) {
            ObjectPool.Push(this.spShow2);
            this.spShow2 = null
        }
        Timer.Inst().CancelTimer(this.timer_ani);
        Timer.Inst().CancelTimer(this.timer_ani1);
        Timer.Inst().CancelTimer(this.timer_ani2);

        if (RoleData.Inst().IsGuideNum(2)) {
            GuideCtrl.Inst().Start(2);
        }

        GrowUpGiftData.Inst().GiftViewShow()
        GuideCtrl.Inst().ClearGuideUi("HeroInfoLevelUpViewBtnContinue");
    }
}

export class CapacityListCell extends BaseItem {
    protected viewNode = {
        CapacityCell: <CapacityCell>null,
    };
    public SetData(data: string[]) {
        this.viewNode.CapacityCell.SetData(data);
    }

    AttrValueScaleAni() {
        this.viewNode.CapacityCell.AttrValueScaleAni();
    }

    EffShow() {
        this.viewNode.CapacityCell.visible = true;
        this.getTransition("ScaleAni").play();
    }
}

export class CapacityCell extends BaseItem {
    protected viewNode = {
        AttrName: <fgui.GTextField>null,
        AttrValue: <fgui.GTextField>null,
        AttrValue2: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
        GpShow: <fgui.GLoader>null,
    };
    public SetData(data: any) {
        UH.SetText(this.viewNode.AttrName, data.name)
        UH.SetText(this.viewNode.AttrValue, data.value)
        UH.SetText(this.viewNode.AttrValue2, data.value2)
        UH.SetIcon(this.viewNode.Icon, IsHeroEffectlShow[data.key], ICON_TYPE.HEROEFFECT);
    }

    AttrValueScaleAni() {
        this.getTransition("AttrValueScaleAni").play();
    }

    EffShow() {
        this.viewNode.GpShow.visible = true
    }
}

export class BtnSkill extends BaseItem {
    protected viewNode = {
        BgIcon: <fgui.GLoader>null,
        icon: <fgui.GLoader>null,
    };
    public SetData(data: HeroSkillData) {
        let skill = BattleData.Inst().GetSkillCfg(data.skillid);
        UH.SetIcon(this.viewNode.icon, skill.icon_res_id, ICON_TYPE.SKILL)
        UH.SpriteName(this.viewNode.BgIcon, "CommonAtlas", `PinZhi${skill.color}`);
    }
}

export class SkillInfo extends BaseItem {
    protected viewNode = {
        BtnSkill: <BtnSkill>null,
        SkillDesc: <fgui.GRichTextField>null,
    };
    public SetData(skill: HeroSkillData) {
        let skillInfo = BattleData.Inst().GetSkillCfg(skill.skillid);
        this.viewNode.BtnSkill.SetData(skill);

        let str = HeroSkillCell.GetDesc(skillInfo);
        let title = str.replace(/#036b16/g, "#aeff91")
        UH.SetText(this.viewNode.SkillDesc, title);
    }
}

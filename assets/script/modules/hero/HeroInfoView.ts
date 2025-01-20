import { GetCfgValue } from "config/CfgCommon";
import * as fgui from "fairygui-cc";
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { CommonId, ICON_TYPE, IsHeroEffectlShow } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { Mod } from "modules/common/ModuleDefine";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from 'modules/common_board/CommonBoard3';
import { HeroCell } from "modules/extends/HeroCell";
import { RedPoint } from 'modules/extends/RedPoint';
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { BattleData } from './../Battle/BattleData';
import { HeroCtrl, HeroReqType } from "./HeroCtrl";
import { HeroData, HeroDataModel, HeroSkillData } from "./HeroData";
import { BtnInherit, ButtonGene, HeroInfoViewGeneShow } from "./HeroInfoViewGeneShow";
import { HeroCompoundViewView } from './HeroCompoundView';
import { HeroLvPreviewView } from './HeroLvPreviewView';
import { ViewManager } from "manager/ViewManager";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ObjectPool } from "core/ObjectPool";
import { ResPath } from "utils/ResPath";
import { Timer } from "modules/time/Timer";
import { HeroSkillCell } from "modules/common_item/HeroSkillCellItem";

@BaseView.registView
export class HeroInfoView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroInfo",
        ViewName: "HeroInfoView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        GenePanel: <HeroInfoViewGeneShow>null,
        TabList: <fgui.GList>null,
        GpDamage: <fgui.GGroup>null,
        Damage: <fgui.GTextField>null,
        RaceText: <fgui.GTextField>null,
        HeroDesc: <fgui.GTextField>null,
        LockDesc: <fgui.GTextField>null,
        Integral: <fgui.GTextField>null,
        BtnUpgrade: <BtnUpgrade>null,
        EffectList: <fgui.GList>null,
        SkillList: <fgui.GList>null,
        RaceIcon: <fgui.GLoader>null,
        HeroCell: <HeroCell>null,
        BtnAttribute: <fgui.GButton>null,
        BtnCompound: <fgui.GButton>null,
        // BtnIntegral: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "BtnInherit", ExtendsClass: BtnInherit },
        { ResName: "BtnSkill", ExtendsClass: BtnSkill },
        { ResName: "BtnUpgrade", ExtendsClass: BtnUpgrade },
        { ResName: "ButtonGene", ExtendsClass: ButtonGene },
        { ResName: "ButtonTab", ExtendsClass: ButtonTab },
        { ResName: "HeroSmallHeadItem", ExtendsClass: HeroSmallHeadItem },
        { ResName: "CapacityCell", ExtendsClass: HeroInfoCapacityCell },
        { ResName: "HeroInfoViewGeneShow", ExtendsClass: HeroInfoViewGeneShow },
    ];

    tabbarCfg = [
        { titleName: Language.Hero.Tab1, modKey: Mod.HeroInfo.Info, type: 0 },
        { titleName: Language.Hero.Tab2, modKey: Mod.HeroInfo.Gene, type: 1 },
    ]

    private heroId: number;
    private heroMode: HeroDataModel;
    private HeroSkill: HeroSkillData[];
    private stateCtrler: fgui.Controller
    static hero_id: number;
    private sp_show: UISpineShow = undefined;
    private btn_Upgrade: any = undefined;
    private btn_Upgrade_lock: boolean = false;
    listData: { key: string; value: any; value2: string; name: string; }[];

    InitData(param: number | HeroDataModel) {
        if (param instanceof HeroDataModel) {
            this.heroId = param.hero_id;
            this.heroMode = param;
        } else {
            this.heroId = param || 1;
            this.heroMode = new HeroDataModel(this.heroId);
        }

        HeroInfoView.hero_id = this.heroMode.hero_id;

        this.viewNode.Board.SetData(new BoardData(HeroInfoView, this.heroMode.data.hero_name));
        this.stateCtrler = this.view.getController("HeroInfoState");

        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FulshData.bind(this), "heroInfoFlush");
        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FulshTabData.bind(this), "heroInfoFlush", "geneInfoFlush");

        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.HeroInfo.Gene);
        this.viewNode.TabList.setVirtual();

        this.viewNode.TabList.on(fgui.Event.CLICK_ITEM, this.OnClickListItem, this);
        this.viewNode.TabList.selectedIndex = 0;
        this.viewNode.TabList.visible = isOpen.is_open && !this.heroMode.lend_show;
        if (isOpen.is_open && !this.heroMode.lend_show && this.heroMode.data.dna_unlock != 0) {
            this.viewNode.GenePanel.SetData(this.heroMode);
        }

        this.viewNode.SkillList.itemRenderer = this.renderListItem.bind(this);
        // this.viewNode.SkillList.on(fgui.Event.CLICK_ITEM, this.OnClickSkillInfo, this)
        this.viewNode.BtnUpgrade.onClick(this.OnClickLevelUp, this);
        this.viewNode.BtnCompound.onClick(this.OnClickCompound, this);
        this.viewNode.BtnAttribute.onClick(this.OnClickLvPreview.bind(this, 0));
        // this.viewNode.BtnIntegral.onClick(this.OnClickLvPreview.bind(this, 1));

        this.FulshData();
        this.FulshTabData();

        GuideCtrl.Inst().AddGuideUi("HeroInfoViewBtnUp", this.viewNode.BtnUpgrade);
        this.viewNode.TabList.selectedIndex = 0;
    }

    FulshTabData() {
        // FIX:lip 屏蔽
        this.viewNode.TabList.visible = false;
        // this.viewNode.TabList.SetData(this.tabbarCfg);
    }

    protected onDestroy(): void {
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = null;
        }
    }

    OnClickListItem() {
        if (this.heroMode.data.dna_unlock == 0) {
            PublicPopupCtrl.Inst().Center(Language.Hero.comingSoon);
            this.viewNode.TabList.selectedIndex = 0;
            return
        }
        if (this.heroMode.level < 7) {
            PublicPopupCtrl.Inst().Center(Language.Hero.geneLock);
            this.viewNode.TabList.selectedIndex = 0;
            return
        }
        this.stateCtrler.selectedIndex = this.viewNode.TabList.selectedIndex;
        this.viewNode.Board.SetBtnTitleVisible(this.stateCtrler.selectedIndex == 0)
    }

    FulshData() {
        let lv = this.heroMode.level || 1;
        let isActive = this.heroMode.level > 0;
        let cfg = HeroData.Inst().GetHeroLevelCfg(this.heroMode.hero_id, lv);
        let is_max = HeroData.Inst().IsHeroLevelMax(this.heroMode.hero_id);
        let isLock = HeroData.Inst().IsHeroLock(this.heroMode.hero_id);
        let is_up = BagData.Inst().GetItemNum(CommonId.Gold) >= cfg.upgrade[0].num;
        let is_debrisUp = HeroData.Inst().GetHeroDebris(cfg.upgrade2[0].item_id) < cfg.upgrade2[0].num

        this.viewNode.BtnUpgrade.grayed = !is_up || is_debrisUp;
        this.viewNode.BtnUpgrade.visible = isActive && !is_max && !this.heroMode.lend_show;
        this.viewNode.LockDesc.visible = !isActive;
        this.viewNode.HeroCell.grayed = !isLock;

        UH.SetText(this.viewNode.Damage, `+${cfg.damage / 100}%`)
        let isShow = HeroData.Inst().GetDamageOpen()
        this.viewNode.GpDamage.visible = isShow

        this.viewNode.HeroCell.SetData(this.heroMode);
        this.viewNode.BtnUpgrade.SetData({ num: cfg.upgrade[0].num, isUp: is_up });

        this.HeroSkill = HeroData.Inst().GetHeroSkill(this.heroMode.hero_id, this.heroMode.level)
        this.viewNode.SkillList.numItems = this.HeroSkill.length;
        // this.viewNode.SkillList.SetData(this.HeroSkill);

        this.ShowEffectList();
    }

    private renderListItem(index: number, item: BtnSkill) {
        item.ItemIndex(index);
        item.SetData(this.HeroSkill[index]);
    }

    private ShowEffectList() {
        let lv = this.heroMode.level || 1;
        let cfg = HeroData.Inst().GetHeroLevelCfg(this.heroMode.hero_id, lv);
        let nextCfg = HeroData.Inst().GetHeroLevelCfg(this.heroMode.hero_id, lv + 1);
        let list = [];
        for (let k in cfg) {
            let value = GetCfgValue(cfg, k);
            let value2 = ""
            if (IsHeroEffectlShow[k] && value > 0) {
                if (k == "att_scope") {
                    value = TextHelper.Format(GetCfgValue(Language.Hero.attScope, value), GetCfgValue(cfg, "att_distance"));
                } else if (k == "att" && nextCfg) {
                    let att = GetCfgValue(nextCfg, k) - GetCfgValue(cfg, k);
                    value = value;
                    value2 = " +" + att
                } else if (Language.HeroEffectlValue[k]) {
                    value = TextHelper.Format(Language.HeroEffectlValue[k], value)
                }
                list.push({
                    key: k,
                    value: value,
                    value2: value2,
                    name: Language.HeroEffectlName[k],
                });
            }
        }
        this.listData =list;
        this.viewNode.EffectList.itemRenderer  = this.itemRenderer.bind(this);
        this.viewNode.EffectList.numItems = list.length;
        this.viewNode.EffectList.y = list.length > 4 ? 290 : 345
    }

    private itemRenderer(index: number, item: any){
        item.SetData(this.listData[index])
    }

    InitUI() {
        let integral = HeroData.Inst().GetHeroIntegralLevelCfg(this.heroMode.data.hero_color, this.heroMode.level);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + this.heroMode.data.hero_race);
        UH.SetText(this.viewNode.RaceText, GetCfgValue(Language.Hero.Race, this.heroMode.data.hero_race))
        UH.SetText(this.viewNode.HeroDesc, this.heroMode.data.hero_word)
        UH.SetText(this.viewNode.Integral, Language.Hero.HeroIntegral + ((integral && integral.hero_integral) || 0));
        if (this.heroMode.data.unlock_type == 0) {
            UH.SetText(this.viewNode.LockDesc, TextHelper.Format(Language.Hero.LockDesk, this.heroMode.data.unlock));
        } else {
            UH.SetText(this.viewNode.LockDesc, Language.Hero.activityLock);
        }
    }

    OnClickLvPreview(type: number) {
        ViewManager.Inst().OpenView(HeroLvPreviewView, { heroid: this.heroId, type: type });
    }

    OnClickCompound() {
        ViewManager.Inst().OpenView(HeroCompoundViewView, this.heroMode);
    }

    // OnClickSkillInfo(item: BtnSkill) {
    //     ViewShowAnimPivot.HeroSkillInfoView = ShowAnimPivot[item.itemIndex]
    //     ViewManager.Inst().OpenView(HeroSkillInfoView, { pos: item.node.worldPosition, data: item.data });
    // }

    OnClickLevelUp() {
        if (this.btn_Upgrade_lock) return//点击间隔
        this.btn_Upgrade_lock = true;
        Timer.Inst().CancelTimer(this.btn_Upgrade);
        this.btn_Upgrade = Timer.Inst().AddRunTimer(() => {
            this.btn_Upgrade_lock = false;
        }, 1, 1, false)
        HeroCtrl.Inst().SendHeroReq(HeroReqType.HERO_UP, [this.heroMode.hero_id]);
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack(): void {
        GuideCtrl.Inst().ClearGuideUi("HeroInfoViewBtnUp");
        Timer.Inst().CancelTimer(this.btn_Upgrade);
    }

}

export class ButtonTab extends BaseItemGB {
    protected viewNode = {
        Lock: <fgui.GImage>null,
        redPoint: <RedPoint>null,
    };
    private stateCtrler: fgui.Controller
    public SetData(data: any) {
        this.data = data;
        this.title = data.titleName;
        this.viewNode.Lock.visible = false;
        this.stateCtrler = this.getController("TabState");
        if (data.type) {
            let info = HeroData.Inst().GetHeroInfo(HeroInfoView.hero_id)
            let cfg = HeroData.Inst().GetHeroBaseCfg(HeroInfoView.hero_id)
            let lock = !info || (info && info.heroLevel < 7) || cfg.dna_unlock == 0;
            this.grayed = lock;
            this.viewNode.Lock.visible = lock;
            this.viewNode
            if (lock) {
                this.stateCtrler.selectedIndex = 1
                this.viewNode.redPoint.SetNum(0)
            } else {
                this.stateCtrler.selectedIndex = 0
                let red = HeroData.Inst().GetGeneHeroAllRed(HeroInfoView.hero_id);
                this.viewNode.redPoint.SetNum(red)
            }
        } else {
            this.stateCtrler.selectedIndex = 0
        }
    }
}

export class HeroInfoCapacityCell extends BaseItem {
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
        UH.SpriteName(this.viewNode.Icon, "HeroInfo", IsHeroEffectlShow[data.key]);
    }
}

export class BtnUpgrade extends BaseItemGB {
    protected viewNode = {
        consume: <fgui.GTextField>null,
    };
    public SetData(data: any) {
        let color = data.isUp ? COLORS.White : COLORS.Red1;
        UH.SetText(this.viewNode.consume, data.num);
        this.viewNode.consume.color = color
    }
}

export class BtnSkill extends BaseItem {
    itemIndex: number;

    protected viewNode = {
        BgIcon: <fgui.GLoader>null,
        icon: <fgui.GLoader>null,
        LevelLock: <fgui.GTextField>null,
        SkillNum: <fgui.GTextField>null,
        Title: <fgui.GTextField>null,
        list: <fgui.GList>null,
    };
    public SetData(data: HeroSkillData) {
        this.data = data;
        let skill = BattleData.Inst().GetSkillCfg(data.skillid);
        let level = data.heroLv ?? HeroData.Inst().GetHeroLevel(data.heroid);
        let isLock = level < data.skillLv;

        UH.SpriteName(this.viewNode.BgIcon, "CommonAtlas", `PinZhi${skill.color}`);
        UH.SetIcon(this.viewNode.icon, skill.icon_res_id, ICON_TYPE.SKILL)
        if (isLock) {
            UH.SetText(this.viewNode.LevelLock, TextHelper.Format(Language.Hero.level2, data.skillLv))
        } else {
            UH.SetText(this.viewNode.LevelLock, TextHelper.Format(Language.Hero.level, data.skillLv))
        }
        UH.SetText(this.viewNode.SkillNum, skill.icon_num)

        let str = HeroSkillCell.GetDesc(skill);
        let title = str.replace(/#036b16/g, "#449a35")
        UH.SetText(this.viewNode.Title, title);

        this.viewNode.BgIcon.grayed = isLock;
        this.viewNode.icon.grayed = isLock;

        this.viewNode.list.visible = false;
        // this.viewNode.list.setVirtual()
        // if (skill.hero_link) {
        //     let HeadData = skill.hero_link.toString().split("|");
        //     this.viewNode.list.SetData(HeadData)
        //     this.viewNode.list.visible = true;
        // } else {
        //     this.viewNode.list.visible = false;
        // }
    }
    ItemIndex(index: number) {
        this.itemIndex = index;
    }
}

export class HeroSmallHeadItem extends BaseItem {
    protected viewNode = {
        icon: <fgui.GLoader>null,
    };
    public SetData(data: string) {
        UH.SetIcon(this.viewNode.icon, data, ICON_TYPE.HEROSMALL);
    }
}

let ShowAnimPivot: { [key: number]: { x: number, y: number } } = {
    [0]: { x: 0.18, y: 0.65 },
    [1]: { x: 0.34, y: 0.65 },
    [2]: { x: 0.5, y: 0.65 },
    [3]: { x: 0.66, y: 0.65 },
    [4]: { x: 0.82, y: 0.65 },
    [5]: { x: 0.18, y: 0.73 },
    [6]: { x: 0.34, y: 0.73 },
    [7]: { x: 0.5, y: 0.73 },
}

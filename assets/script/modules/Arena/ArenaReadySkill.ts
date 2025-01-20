import { CfgSkillData } from "config/CfgEntry";
import * as fgui from "fairygui-cc";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { UH } from "../../helpers/UIHelper";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { HeroSkillCell } from "modules/common_item/HeroSkillCellItem";
import { ViewManager } from "manager/ViewManager";
import { ArenaData } from "./ArenaData";
import { UtilHelper } from "../../helpers/UtilHelper";
import { ArenaReadyView } from "./ArenaReadyView";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { ArenaCtrl, ArenaReq } from "./ArenaCtrl";
import { Format } from "../../helpers/TextHelper";
import { Language } from "modules/common/Language";
import { Vec2, math } from "cc";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { RoleData } from "modules/role/RoleData";
import { GuidePos } from "modules/guide/GuideView";
import { HeroData } from "modules/hero/HeroData";

const MAX_IN_FIGHT_SKILL_COUNT = 24;     //最大上阵数量

export class ArenaReadSkill extends fgui.GComponent {
    protected viewNode = {
        GourpList: <fgui.GList>null,
        SkillInfo: <ArenaReadSkillInfo>null,
        OkBtn: <fgui.GButton>null,
        SelectCount: <fgui.GTextField>null,
    };

    private _groupListData: ArenaReadSkillGroupData[];
    private get groupListData(): ArenaReadSkillGroupData[] {
        if (this._groupListData == null) {
            ArenaData.Inst().ClearSelectSkill();
            let heroBattleArray = ArenaData.Inst().GetSelfHeroNode();
            let skillList = ArenaData.Inst().GetFightSkillPool(heroBattleArray);
            let map = new Map<number, CfgSkillData[]>();
            if (skillList) {
                let serverList = ArenaData.Inst().GetSkillList();
                skillList.forEach(v => {
                    if (map.has(v.hero_id)) {
                        map.get(v.hero_id).push(v);
                    } else {
                        map.set(v.hero_id, [v]);
                    }
                    if (serverList && serverList.indexOf(v.skill_id) != -1) {
                        ArenaData.Inst().AddSelectSkill(v, true);
                    }
                })
            }
            this._groupListData = []
            map.forEach((list, heroId) => {
                list.sort((a, b) => {
                    return b.color - a.color;
                });
                let info = new ArenaReadSkillGroupData(heroId, list);
                this._groupListData.push(info);
            })
        }
        return this._groupListData;
    }


    //指引用的item
    private _guideSkillItem: ArenaReadSkillItem;
    private get guideSkillItem(): ArenaReadSkillItem {
        if (this._guideSkillItem == null) {
            let item = <ArenaReadSkillItem>fgui.UIPackage.createObject("ArenaReady", "SkillItem").asCom;
            this.addChild(item);
            this._guideSkillItem = item;
            item.onClick(() => {
                let curGuideCfg = GuideCtrl.Inst().step_cfg;
                if (curGuideCfg && curGuideCfg.step_id == 15) {
                    if (curGuideCfg.index == 6) {
                        ArenaData.Inst().smdData.selectSkill = item.GetData();
                        this._guideSkillItem.ctrlBtn1.visible = true;
                    } else if (curGuideCfg.index == 7) {
                        this.ShowItemGuide();
                    } else if (curGuideCfg.index == 8) {
                        this._guideSkillItem.visible = false;
                    } else {
                        this._guideSkillItem.visible = false;
                    }
                } else {
                    this._guideSkillItem.visible = false;
                }
            });
            GuideCtrl.Inst().AddGuideUi("ArenaReadyClickSkill", this._guideSkillItem);
            GuideCtrl.Inst().AddGuideUi("ArenaReadySelectSkill", this._guideSkillItem.ctrlBtn1);
            GuideCtrl.Inst().AddGuideUi("ArenaReadyCancelSkill", this._guideSkillItem.ctrlBtn2);
        }
        return this._guideSkillItem;
    }

    ShowItemGuide() {
        this.guideSkillItem.visible = true;
        let globalPos: Vec2;
        globalPos = this.viewNode.GourpList.localToGlobal();
        globalPos.x += 66;
        globalPos.y += 86;

        let pos = this.globalToLocal(globalPos.x, globalPos.y);
        this.guideSkillItem.setPosition(pos.x, pos.y);
        GuidePos["15_6"] = { x: pos.x, y: pos.y };
        GuidePos["15_7"] = { x: pos.x, y: pos.y };
        GuidePos["15_8"] = { x: pos.x, y: pos.y };
        this.guideSkillItem.SetData(this.groupListData[0].skillList[0]);
    }

    protected onConstruct(): void {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
        this.viewNode.OkBtn.onClick(this.OnOkClick, this);
        this.viewNode.GourpList.setVirtual();
        GuideCtrl.Inst().AddGuideUi("ArenaReadySkillCount", this.viewNode.SelectCount);
    }

    protected onEnable(): void {
        super.onEnable();
        this._groupListData = null;
        ArenaData.Inst().smdData.selectSkill = null;
        this.FlushPanel();

        if (GuideCtrl.Inst().IsGuiding()) {
            setTimeout(() => {
                this.ShowItemGuide();
            });
        }
    }

    // private renderListItem(index: number, item:ArenaReadSkillGroup) {
    //     let data = this.groupListData[index];
    //     item.SetData(data);
    // }

    FlushPanel() {
        this.FlushList();
        this.FlushCenterSkillInfo();
        this.FlushOkBtn();
        this.FlushSelectCount();
    }

    FlushList() {
        this.viewNode.GourpList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.GourpList.numItems = this.groupListData.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.groupListData[index]);
    }

    FlushCenterSkillInfo() {
        this.viewNode.SkillInfo.SetData(ArenaData.Inst().smdData.selectSkill);
    }

    FlushOkBtn() {
        let btnText = ArenaReadyView.readySkillLock ? Language.Arena.BtnUnlock : Language.Arena.BtnLock;
        this.viewNode.OkBtn.title = btnText;
        this.viewNode.OkBtn.grayed = ArenaReadyView.readySkillLock;
    }

    FlushSelectCount() {
        let selectList = ArenaData.Inst().smdData.selectSkillList;
        UH.SetText(this.viewNode.SelectCount, Format(Language.Arena.SkillCountText, selectList.size, MAX_IN_FIGHT_SKILL_COUNT));
    }

    ScendSkillList() {
        let p1List: number[] = [];
        let selectList = ArenaData.Inst().smdData.selectSkillList;
        selectList.forEach(v => {
            p1List.push(v.skill_id);
        })
        ArenaCtrl.Inst().SendReq(ArenaReq.SetSkill, p1List);
    }

    OnOkClick() {
        if (ArenaReadyView.readySkillLock) {
            ArenaReadyView.readySkillLock = false;
        } else {
            ArenaReadyView.readySkillLock = true;
            this.ScendSkillList();
        }
        this.FlushOkBtn();
    }
}


export class ArenaReadSkillInfo extends BaseItem {
    protected viewNode = {
        Qua: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        IconValue: <fgui.GTextField>null,
        Desc: <fgui.GRichTextField>null,
    };

    protected _data: CfgSkillData;

    public SetData(data: CfgSkillData): void {
        super.SetData(data);
        if (data == null) {
            return;
        }
        let skill = data;

        UH.SpriteName(this.viewNode.Qua, "ArenaReady", "Qua" + skill.color);
        UH.SetIcon(this.viewNode.Icon, skill.icon_res_id, ICON_TYPE.SKILL, undefined, true);
        UH.SetText(this.viewNode.IconValue, skill.icon_num);
        let desc = HeroSkillCell.GetDesc(skill);
        desc = desc.replace(/#036b16/g, "#aeff91")
        UH.SetText(this.viewNode.Desc, desc);
        this.viewNode.Desc._richText.onEnable();
    }
}

export class ArenaReadSkillGroupData {
    heroId: number;
    skillList: CfgSkillData[];

    private _color: number;
    get color(): number {
        if (this._color == null) {
            if (this.heroId == 0) {
                return 2;
            }
            let herocfg = HeroData.Inst().GetHeroBaseCfg(this.heroId);
            if (!herocfg) {
                return 2;
            }
            return herocfg.hero_color;
        }
        return this._color;
    }

    constructor(id: number, list: CfgSkillData[]) {
        this.heroId = id;
        this.skillList = list;
    }
}

export class ArenaReadSkillGroup extends BaseItem {
    protected _data: ArenaReadSkillGroupData;

    protected viewNode = {
        List: <fgui.GList>null,
        SkillQua: <fgui.GLoader>null,
        SkillIcon: <fgui.GLoader>null,
    };

    private listData: any[] = [];

    public SetData(data: ArenaReadSkillGroupData): void {
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data.skillList;
        this.viewNode.List.numItems = data.skillList.length;
        this.SetH(data.skillList.length);
        UH.SpriteName(this.viewNode.SkillQua, "ArenaReady", "SkillQua" + data.color);
        if (data.heroId == 0) {
            UH.SpriteName(this.viewNode.SkillIcon, "ArenaReady", "skill_icon");
        } else {
            UH.SetIcon(this.viewNode.SkillIcon, data.heroId, ICON_TYPE.HEROSBIG);
        }
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    SetH(dataCount: number) {
        let h = 70 + Math.ceil(dataCount / 4) * 175;
        this.height = h;
    }
}

export class ArenaReadSkillItem extends BaseItemGB {
    protected viewNode = {
        Qua: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        IconValue: <fgui.GTextField>null,
        CtrlBtn1: <fgui.GButton>null,
        CtrlBtn2: <fgui.GButton>null,
    };

    protected _data: CfgSkillData;

    get ctrlBtn1(): fgui.GButton {
        return this.viewNode.CtrlBtn1;
    }
    get ctrlBtn2(): fgui.GButton {
        return this.viewNode.CtrlBtn2;
    }

    private ctrlListen: (item: ArenaReadSkillItem, isOn: boolean) => any;

    protected onConstruct(): void {
        super.onConstruct();
        this.viewNode.CtrlBtn1.onClick(this.OnCtrlClick.bind(this, true));
        this.viewNode.CtrlBtn2.onClick(this.OnCtrlClick.bind(this, false));
        this.onClick(this.OnItemClick, this);
    }

    public SetData(data: CfgSkillData): void {
        super.SetData(data);

        let skill = data;
        UH.SpriteName(this.viewNode.Qua, "ArenaReady", "YuanQua" + skill.color);
        UH.SetIcon(this.viewNode.Icon, skill.icon_res_id, ICON_TYPE.SKILL, undefined, true);
        UH.SetText(this.viewNode.IconValue, skill.icon_num);

        let selectList = ArenaData.Inst().smdData.selectSkillList;
        this.viewNode.CtrlBtn1.visible = !selectList.has(data);
        this.viewNode.CtrlBtn2.visible = selectList.has(data);
    }

    SetCtrlClick(func: (item: ArenaReadSkillItem, isOn: boolean) => any) {
        this.ctrlListen = func;
    }

    private OnCtrlClick(isOn: boolean) {
        if (ArenaReadyView.readySkillLock) {
            PublicPopupCtrl.Inst().Center(Language.Arena.tips3);
            return;
        }
        if (this.ctrlListen) {
            this.ctrlListen(this, isOn);
        }
        ArenaData.Inst().AddSelectSkill(this._data, isOn);
        this.SetData(this._data);
    }

    private OnItemClick() {
        ArenaData.Inst().smdData.selectSkill = this._data;
        this.SetData(this._data);
    }
}
import { Vec2, Vec3 } from "cc";
import { CfgSkillData } from "config/CfgEntry";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { EventCtrl } from "modules/common/EventCtrl";
import { HeroSkillCell, HeroSkillCellItem, HeroSkillShowType } from "modules/common_item/HeroSkillCellItem";
import { UH } from "../../helpers/UIHelper";
import { BattleEventType } from "./BattleConfig";
import { BattleCtrl } from "./BattleCtrl";
import { BattleData } from "./BattleData";
import { SevenDayHeroData } from "modules/seven_day_hero/SevenDayHeroData";

// 战斗暂停界面
@BaseView.registView
export class BattlePauseView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattlePause",
        ViewName: "BattlePause",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
        NotHideAnim: true,
    };

    /* protected boardCfg = {
        BoardTitle: Language.Temp.Title,
        TabberCfg: [
            { panel: TempPanel, viewName: "TempPanel", titleName: Language.Temp.TabberTemp },
        ]
    }; */

    protected viewNode = {
        SkillList: <fgui.GList>null,
        ContinueBtn: <fgui.GButton>null,
        ExitBtn: <fgui.GButton>null,
        SkillDesc: <BattleSkillInfoItem>null,
    };

    protected extendsCfg = [
        { ResName: "SkillDesc", ExtendsClass: BattleSkillInfoItem }
    ];
    listData: HeroSkillCell[];

    InitData() {
        this.viewNode.ExitBtn.onClick(this.OnExitClick.bind(this))
        this.viewNode.ContinueBtn.onClick(this.OnContinueClick.bind(this))
        let skillData = BattleData.Inst().GetShowSkillListData();
        if (SevenDayHeroData.Inst().IsBuy) {
            let speedSkill = new HeroSkillCell({ skill_id: 333, showType: HeroSkillShowType.Node })
            skillData.unshift(speedSkill);
        }
        this.listData = skillData;
        this.viewNode.SkillList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.SkillList.numItems = skillData.length;
        this.viewNode.SkillList.on(fgui.Event.CLICK_ITEM, this.OnSkillClick, this);
    }

    private itemRenderer(index: number, item: HeroSkillCellItem) {
        item.SetData(this.listData[index]);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
        EventCtrl.Inst().emit(BattleEventType.Pause, true);
    }

    CloseCallBack() {
        EventCtrl.Inst().emit(BattleEventType.Pause, false);
    }

    OnExitClick() {
        ViewManager.Inst().CloseView(BattlePauseView);
        BattleData.Inst().battleInfo.isSaveSkill = false;
        BattleCtrl.Inst().adapterBattleScene.FailFightAnimation();
    }

    OnContinueClick() {
        ViewManager.Inst().CloseView(BattlePauseView);
    }

    OnSkillClick(item: HeroSkillCellItem) {
        let data = item.GetData();
        let pos = item.node.worldPosition;
        this.viewNode.SkillDesc.SetData({
            skill: data,
            pos: pos,
        });
        this.viewNode.SkillDesc.visible = true;
    }
}


export interface IBattleSkillInfoItem {
    pos: Vec2 | Vec3;
    skill: HeroSkillCell;
}

export class BattleSkillInfoItem extends BaseItem {
    protected viewNode = {
        Label: <fgui.GLabel>null,
    };
    protected onConstruct() {
        super.onConstruct();
        this.onClick(this.OnCloseClick, this);
    }
    public SetData(data: IBattleSkillInfoItem): void {
        let desc = data.skill.desc;
        let title = desc.replace(/#036b16/g, "#aeff91")
        UH.SetText(this.viewNode.Label, title);
        this.viewNode.Label.node.setWorldPosition(data.pos.x + 50, data.pos.y - 20, 0);
        this.getTransition("show").play();
    }

    OnCloseClick() {
        this.visible = false;
    }
}
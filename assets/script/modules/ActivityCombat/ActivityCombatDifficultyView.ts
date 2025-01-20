import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { UH } from "../../helpers/UIHelper";
import { ActivityCombatData } from "./ActivityCombatData";
import { BaseItem } from "modules/common/BaseItem";
import { ItemCell } from "modules/extends/ItemCell";
import { Item } from "modules/bag/ItemData";
import { Language } from "modules/common/Language";
import { Format, TextHelper } from "../../helpers/TextHelper";
import { SceneType } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { MainFBData } from "modules/main_fb/MainFBData";
import { ViewManager } from "manager/ViewManager";
import { ActivityCombatMopUpView } from "./ActivityCombatMopUpView";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { CommonId } from "modules/common/CommonEnum";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { LoseTempleView } from "modules/LoseTemple/LoseTempleView";

@BaseView.registView
export class ActivityCombatDifficultyView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ActivityCombatDifficulty",
        ViewName: "ActivityCombatDifficultyView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        Title: <fgui.GTextField>null,
        TopIcon: <fgui.GLoader>null,
        DifficultyNum: <fgui.GTextField>null,
        ResidueNum: <fgui.GTextField>null,
        List: <fgui.GList>null,
        BtnArrowsR: <fgui.GButton>null,
        BtnArrowsL: <fgui.GButton>null,
        BtnStart: <fgui.GButton>null,
        // BtnClose: <fgui.GButton>null,
        BtnMopUp: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "RewardItemCell", ExtendsClass: RewardItemCell }
    ];

    level: number;
    parme: any;
    index: number;
    consume: number;
    private stateCtrler: fgui.Controller
    private listData: any[] = [];

    InitData(parme: any) {
        this.parme = parme;
        this.stateCtrler = this.view.getController("CombatState");

        this.viewNode.Board.SetData(new BoardData(ActivityCombatDifficultyView));
        this.AddSmartDataCare(ActivityCombatData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");

        // this.viewNode.BtnClose.onClick(this.closeView.bind(this));
        this.viewNode.BtnArrowsL.onClick(this.OnClickDir.bind(this, -1));
        this.viewNode.BtnArrowsR.onClick(this.OnClickDir.bind(this, 1));
        this.viewNode.BtnStart.onClick(this.OnClickStart, this);
        this.viewNode.BtnMopUp.onClick(this.OnClickMopUp, this);
        UH.SetText(this.viewNode.Title, parme.tabTitle)
        UH.SpriteName(this.viewNode.TopIcon, "ActivityCombatDifficulty", "DingTouHuoDongHaiBao" + parme.type);

        let info = ActivityCombatData.Inst().GetActivityLevelInfo(parme.type)
        let max = ActivityCombatData.Inst().GetLevelMaxNum(parme.type)
        let fblevel = info.fbLevel == 0 ? info.fbLevel + 1 : (info.fbLevel >= max ? max : info.fbLevel);
        this.index = fblevel;
        this.level = fblevel;
        this.FlushData();
    }

    private FlushData() {
        let data = ActivityCombatData.Inst().GetlevelReward(this.parme.type, this.index, true);
        let info = ActivityCombatData.Inst().GetActivityLevelInfo(this.parme.type)
        this.consume = ActivityCombatData.Inst().getLevelConsumeCfg(this.parme.type, this.index);
        if (info.fbLevel <= this.index) {
            this.stateCtrler.selectedIndex = 0
        } else {
            this.stateCtrler.selectedIndex = 1
        }

        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data;
        this.viewNode.List.numItems = data.length;
        UH.SetText(this.viewNode.DifficultyNum, this.index);
        UH.SetText(this.viewNode.ResidueNum, TextHelper.Format(Language.ActivityCombat.surplusNum, ActivityCombatData.Inst().getSurplusNum(this.parme.type)))

        this.viewNode.BtnStart.title = "-" + this.consume;
        this.viewNode.BtnMopUp.title = "-" + this.consume;
        this.aroundBtnShow();
    }

    private itemRenderer(index: number, item: RewardItemCell) {
        item.SetData(this.listData[index]);
    }

    private OnClickDir(dir: number) {
        this.index += dir;
        this.FlushData();
    }

    //左右按钮显示
    private aroundBtnShow() {
        this.viewNode.BtnArrowsL.visible = this.index != 1;
        this.viewNode.BtnArrowsR.visible = this.index != this.level;
    }

    OnClickStart() {
        if (Item.IsGeneBagMax()) return
        let energy = ActivityCombatData.Inst().GetEnergyNum();
        let num = ActivityCombatData.Inst().getSurplusNum(this.parme.type);
        if (energy < this.consume) {
            let name = Item.GetName(CommonId.Energy);
            PublicPopupCtrl.Inst().Center(name + Language.Common.NotHasTip);
            return;
        }
        if (!num) {
            PublicPopupCtrl.Inst().Center(Language.ActivityCombat.countNotHasTip);
            return;
        }
        if (this.parme.type == 2) {
            ViewManager.Inst().OpenView(LoseTempleView)
            return
        }
        if (!num) {
            PublicPopupCtrl.Inst().Center(Language.ActivityCombat.countNotHasTip);
            return;
        }
        let cfg = ActivityCombatData.Inst().GetLevelCfg(this.parme.type, this.index)
        if (this.parme.type == 1) {
            BattleCtrl.Inst().EnterBattle(cfg.barrier_id, SceneType.Fragment)
        } else {
            BattleCtrl.Inst().EnterBattle(cfg.barrier_id, SceneType.Coin)
        }
        ViewManager.Inst().CloseView(ActivityCombatDifficultyView)
    }

    OnClickMopUp() {
        if (Item.IsGeneBagMax()) return
        let energy = ActivityCombatData.Inst().GetEnergyNum();
        let num = ActivityCombatData.Inst().getSurplusNum(this.parme.type);
        if (energy < this.consume) {
            let name = Item.GetName(CommonId.Energy);
            PublicPopupCtrl.Inst().Center(name + Language.Common.NotHasTip);
            return;
        }
        if (!num) {
            PublicPopupCtrl.Inst().Center(Language.ActivityCombat.countNotHasTip);
            return;
        }
        ViewManager.Inst().OpenView(ActivityCombatMopUpView, { type: this.parme.type, level: this.index, consume: this.consume })
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

export class RewardItemCell extends BaseItem {
    protected viewNode = {
        ItemCell: <ItemCell>null,
        FirstPass: <fgui.GGroup>null,
    };
    public SetData(data: any) {
        let item_call = Item.Create(data.item, { is_click: true, is_num: true });
        this.viewNode.ItemCell.SetData(item_call);
        this.viewNode.FirstPass.visible = data.isFirstPass;
    }
}
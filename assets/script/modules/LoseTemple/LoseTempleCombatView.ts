import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { LoseTempleData } from "./LoseTempleData";
import { ViewManager } from "manager/ViewManager";
import { SceneType } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { GetSceneCfgPath, CfgSceneData } from "config/CfgScene";
import { CfgManager } from "manager/CfgManager";
import { ResPath } from "utils/ResPath";
import { UH } from "../../helpers/UIHelper";
import { ItemCell } from "modules/extends/ItemCell";
import { Item } from "modules/bag/ItemData";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { HeroData } from "modules/hero/HeroData";
//战斗
@BaseView.registView
export class LoseTempleCombatView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "LoseTempleCombat",
        ViewName: "LoseTempleCombatView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        ItemList: <fgui.GList>null,
        HeroList: <fgui.GList>null,
        day: <fgui.GTextField>null,
        BtnCombat: <fgui.GButton>null,
        SpineShow: <UISpineShow>null,
    };
    event_id: number;
    SceneCfg: CfgSceneData
    BattleCfg: any;
    InitData(event_id: number) {
        let self = this;
        this.event_id = event_id;
        this.viewNode.Board.SetData(new BoardData(LoseTempleCombatView));
        this.AddSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");
        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FlushData.bind(this), "heroInfoFlush");

        this.viewNode.BtnCombat.onClick(this.OnClickStart, this)

        let Battle = LoseTempleData.Inst().GetBattleCfg(this.event_id)
        this.BattleCfg = Battle;
        this.viewNode.ItemList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ItemList.setVirtual();
        this.viewNode.ItemList.numItems = Battle.item.length;

        let resPath = GetSceneCfgPath(Battle.barrier_id, SceneType.ShenDian);
        CfgManager.Inst().GetCfg<CfgSceneData>(resPath, (cfg) => {
            self.SceneCfg = cfg;
            this.EffShow();
        })

        this.FlushData();
    }

    private FlushData() {
        let data = LoseTempleData.Inst().GetInBattleHeros()
        this.viewNode.HeroList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.HeroList.numItems = data.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(LoseTempleData.Inst().GetInBattleHeros()[index]);
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(Item.Create(this.BattleCfg.item[index], { is_num: true }));
    }

    InitUI() {

    }

    private EffShow() {
        let cfg = this.SceneCfg.monster_page.find(cfg => cfg.monster_type == 2);
        if (!cfg) return;
        this.viewNode.SpineShow.LoadSpine(ResPath.Monster(cfg.res_id), true);
    }

    OnClickStart() {
        let data = LoseTempleData.Inst().GetInBattleHeros()
        for (let i = 0; i < data.length; i++) {
            if (data[i] == 0) {
                PublicPopupCtrl.Inst().Center(Language.LoseTemple.battleHero);
                return;
            }
            let energy = LoseTempleData.Inst().GetHeroEnergy(data[i]);
            if (energy == 0) {
                PublicPopupCtrl.Inst().Center(Language.LoseTemple.HeroEnergy);
                return;
            }
        }
        BattleCtrl.Inst().EnterBattle(this.BattleCfg.barrier_id, SceneType.ShenDian)
        ViewManager.Inst().CloseView(LoseTempleCombatView)
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}
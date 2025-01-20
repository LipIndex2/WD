import * as fgui from "fairygui-cc";
import { ArenaData } from "modules/Arena/ArenaData";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { UH } from "../../../helpers/UIHelper";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { BattleCtrl } from "../BattleCtrl";
import { BattleData } from "../BattleData";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { ViewManager } from "manager/ViewManager";
import { Timer } from "modules/time/Timer";

export class BattleSkinShowParam{
    seq_l:number;
    seq_r:number;
    constructor(seq_l:number = 0, seq_r:number = 0){
        this.seq_l = seq_l;
        this.seq_r = seq_r;
    }
}

@BaseView.registView
export class BattleSkinShow extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleOther",
        ViewName: "BattleSkinShow",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
    };

    protected extendsCfg = [
        { ResName: "AttLabel", ExtendsClass: BattleSkinShowAtt },
    ];

    protected viewNode = {
        LIcon: <fgui.GLoader>null,
        RIcon: <fgui.GLoader>null,
        LName: <fgui.GTextField>null,
        RName: <fgui.GTextField>null,
        LAtt: <fgui.GLabel>null,
        RAtt: <fgui.GLabel>null,
    };

    private time_ht:any;
    private isShowed = false;

    InitData(param?:BattleSkinShowParam) {
        if(param == null){
            return;
        }

        let cfg_l = ArenaData.Inst().GetSkinCfg(param.seq_l);
        UH.SetText(this.viewNode.LName, cfg_l.skin_name);
        let sceneBG_l = BattleData.Inst().GetSceneArenaBGCfg(cfg_l.stage_res_id);
        UH.SetIcon(this.viewNode.LIcon, sceneBG_l.battle_res_id, ICON_TYPE.ARENA_SKIN_ATT);
        let desc_l = cfg_l.gain_param > 0 ? cfg_l.gain_des : Language.Arena.tips12
        UH.SetText(this.viewNode.LAtt, desc_l);

        let cfg_r = ArenaData.Inst().GetSkinCfg(param.seq_r);
        UH.SetText(this.viewNode.RName, cfg_r.skin_name);
        let sceneBG_r = BattleData.Inst().GetSceneArenaBGCfg(cfg_r.stage_res_id);
        UH.SetIcon(this.viewNode.RIcon, sceneBG_r.battle_res_id, ICON_TYPE.ARENA_SKIN_ATT);
        let desc_r = cfg_r.gain_param > 0 ? cfg_r.gain_des : Language.Arena.tips12
        UH.SetText(this.viewNode.RAtt, desc_r);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
        this.view.getTransition("show").play(()=>{
            this.isShowed = true;
        });

        this.time_ht = Timer.Inst().AddRunTimer(() => {
            if (this.isShowed 
                && BattleCtrl.Inst().battleSceneArena_A.dynamic.IsSkillPoolAlLoaded()
                && BattleCtrl.Inst().battleSceneArena_B.dynamic.IsSkillPoolAlLoaded()
                ) {
                Timer.Inst().CancelTimer(this.time_ht);
                this.time_ht = null;

                BattleCtrl.Inst().battleSceneArena_A?.StartFight();
                BattleCtrl.Inst().battleSceneArena_B?.StartFight();
                this.closeView();
            }
        }, 0.1, -1, true)
    }

    CloseCallBack() {
        if(this.time_ht){
            Timer.Inst().CancelTimer(this.time_ht);
            this.time_ht = null;
        }
    }
}

export class BattleSkinShowAtt extends fgui.GLabel{
    protected viewNode = {
        UIEffectShow: <UIEffectShow>null,
    };
    protected onConstruct(): void {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
        this.viewNode.UIEffectShow.PlayEff(1208133);
    }
}
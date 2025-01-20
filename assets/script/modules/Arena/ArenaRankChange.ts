import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { EGLoader } from "modules/extends/EGLoader";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UH } from "../../helpers/UIHelper";
import { ArenaData } from "./ArenaData";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Format } from "../../helpers/TextHelper";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";

export class ArenaRankChangParam{
    lastRank: number = 1;
    lastRankOrder: number = 1;
    lastScore: number = 0;
    rank:number = 1;
    rankOrder:number = 1;
    score:number = 0;

    IsWin():boolean{
        if(this.rank > this.lastRank){
            return true;
        }
        if(this.rank == this.lastRank && this.rankOrder > this.lastRankOrder){
            return true;
        }
        if(this.rank == this.lastRank && this.rankOrder == this.lastRankOrder && this.score > this.lastScore){
            return true;
        }
        return false;
    }

    IsAnim(){
        if(this.rank > this.lastRank){
            return true;
        }
        if(this.rank == this.lastRank && this.rankOrder > this.lastRankOrder){
            return true;
        }
        return false;
    }
}

@BaseView.registView
export class ArenaRankChange extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ArenaOther",
        ViewName: "ArenaRankChange",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
        ViewMask: ViewMask.BgBlock,
    };


    protected viewNode = {
        BGEffect: <UIEffectShow>null,
        CloseBtn: <fgui.GButton>null,
        RankIcon: <EGLoader>null,
        RankName: <fgui.GTextField>null,
        Progress: <fgui.GProgressBar>null,
        Score: <fgui.GRichTextField>null,
        NewRankIcon: <EGLoader>null,
        EffectShow: <UIEffectShow>null,
    };

    param:ArenaRankChangParam;

    private timeHt:any;

    InitData(param?:ArenaRankChangParam) {
        this.viewNode.CloseBtn.onClick(this.closeView, this);
        this.viewNode.BGEffect.PlayEff(1208110);

        if(param == null){
            return;
        }
        this.param = param;
        
        // if(param.IsAnim()){
        //     this.FlushNewInfo();
        //     this.view.getTransition("rank_change").play();
        // }else{
        //     this.FlushOldInfo();
        // }
        this.FlushOldInfo();
    }


    OpenCallBack() {
    }

    CloseCallBack() {
        if(this.timeHt){
            clearTimeout(this.timeHt);
            this.timeHt = null;
        }
    }

    FlushOldInfo(){
        let rankCfg = ArenaData.Inst().GetRankCfg(this.param.lastRank, this.param.lastRankOrder);
        UH.SetIcon(this.viewNode.RankIcon, rankCfg.rank_icon, ICON_TYPE.ARENA_RANK, null, true);
        UH.SetText(this.viewNode.RankName, rankCfg.rank_describe);
        this.viewNode.Progress.min = 0;
        this.viewNode.Progress.max = rankCfg.rank_points;
        this.viewNode.Progress.value = this.param.lastScore;
        let isWin = this.param.IsWin();
        if(isWin){
            let num = rankCfg.vic_points;
            UH.SetText(this.viewNode.Score,Format("<color=#c4ff26>+{0}</color>", num))
        }else{
            let num = rankCfg.def_points;
            UH.SetText(this.viewNode.Score,Format("<color=#ff0143>-{0}</color>", num))
        }

        
        if(this.param.rankOrder != this.param.lastRankOrder){
            let value = isWin ? rankCfg.rank_points : 0;
            this.viewNode.Progress.tweenValue(value, 1);
        }else{
            this.viewNode.Progress.tweenValue(this.param.score, 1);
        }

        let isAnim = this.param.IsAnim();
        if(isAnim){
            let rankCfg = ArenaData.Inst().GetRankCfg(this.param.rank, this.param.rankOrder);
            UH.SetIcon(this.viewNode.NewRankIcon, rankCfg.rank_icon, ICON_TYPE.ARENA_RANK, null, true);

            this.timeHt = setTimeout(() => {
                this.timeHt = null;
                this.FlushNewInfo();
            }, 1000);
        }
    }

    FlushNewInfo(){
        AudioManager.Inst().PlayUIAudio(AudioTag.shengjie);
        let rankCfg = ArenaData.Inst().GetRankCfg(this.param.rank, this.param.rankOrder);
        UH.SetText(this.viewNode.RankName, rankCfg.rank_describe);
        this.viewNode.Progress.min = 0;
        this.viewNode.Progress.max = rankCfg.rank_points;
        this.viewNode.Progress.value = 0;

        this.view.getTransition("rank_change").play(()=>{
            this.viewNode.Progress.tweenValue(this.param.score, 1);
        });
        this.viewNode.NewRankIcon.visible = true;
        this.viewNode.EffectShow.PlayEff("1208126");
    }
}
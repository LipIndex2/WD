import { CfgBattleGuide, CfgGuideStap } from "config/CfgBattleGuide";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BattleCtrl } from "../BattleCtrl";
import { BattleEventType, CELL_WIDTH } from "../BattleConfig";
import { sys, Vec2, Vec3 } from "cc";
import { UtilHelper } from "../../../helpers/UtilHelper";
import { UH } from "../../../helpers/UIHelper";
import { EventCtrl } from "modules/common/EventCtrl";
import { HeroObj } from "../Object/HeroObj";
import { BattleView } from "../BattleView";
import { Prefskey } from "modules/common/PrefsKey";
import { BattleData } from "../BattleData";
import { RoleCtrl } from "modules/role/RoleCtrl";
import { ROLE_SETTING_TYPE } from "modules/common/CommonEnum";
import { RoleData } from "modules/role/RoleData";

// class BattleGuideStep{
//     data:CfgGuideStap;
//     constructor(data:CfgGuideStap){
//         this.data = data;
//     }
// }

@BaseView.registView
export class BattleGuideView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleGuide",
        ViewName: "BattleGuideView",
        LayerType: ViewLayer.Normal + 5,
        ViewMask: ViewMask.None,
    };


    protected viewNode = {
        Block: <fgui.GComponent>null,
        ShouZhi: <fgui.GComponent>null,
        Word: <fgui.GTextField>null,
    };

    private rect: fgui.GObject;
    private clickblock: fgui.GObject;
    private stepCfg:CfgGuideStap[];
    private stepIndex:number;
    InitData() {
        this.stepCfg = CfgBattleGuide.step;
        this.stepIndex = 0;
        this.rect = this.viewNode.Block.getChild("Rect");
        this.clickblock = this.viewNode.Block.getChild("Block");
        this.clickblock.onClick(this.OnBlockClick, this);

        EventCtrl.Inst().on(BattleEventType.Swap, this.CheckSwap, this);
        EventCtrl.Inst().on(BattleEventType.Discard, this.CheckDiscard, this);
        EventCtrl.Inst().on(BattleEventType.SetSelectSkill, this.CheckStep, this);
    }

    private timeOutHt:any;
    OpenCallBack() {
        this.timeOutHt = setTimeout(()=>{
            this.CheckStep();
        },500)
    }

    CloseCallBack() {
        this.SetGuideFlag();
        BattleData.Inst().SetGuide(false);
        
        EventCtrl.Inst().off(BattleEventType.Swap, this.CheckSwap, this);
        EventCtrl.Inst().off(BattleEventType.Discard, this.CheckDiscard, this);
        EventCtrl.Inst().off(BattleEventType.SetSelectSkill, this.CheckStep, this);

        if(this.hideTiemHt){
            clearTimeout(this.hideTiemHt);
        }

        if (this.timeOutHt) {
            clearTimeout(this.timeOutHt);
            this.timeOutHt = null;
        }
    }

    SetGuideFlag(){
        // let key = Prefskey.GetBattkeGuideKey();
        // sys.localStorage.setItem(key, "1");

        if(RoleData.Inst().IsGuide()){
            RoleCtrl.Inst().SendRoleSystemSetReq([
                {systemSetType:ROLE_SETTING_TYPE.SettingGuide, systemSetParam:1}
            ]);
        }
    }

    //隐藏
    Hide(hide:boolean){
        if(hide){
            this.view.alpha = 0;
        }else{
            this.view.alpha = 1;
        }
    }

    private hideTiemHt:any;
    //隐藏一段时间
    HideTime(time:number, call?:Function){
        this.Hide(true);
        if(this.hideTiemHt!=null){
            return;
        }
        this.hideTiemHt = setTimeout(()=>{
            this.Hide(false);
            this.hideTiemHt = null;
            if(call){
                call();
            }
        }, time * 1000)
    }

    ShowWord(step:CfgGuideStap){
        UH.SetText(this.viewNode.Word, step.word);
        let scene = BattleCtrl.Inst().battleScene;
        let ij = step.word_pos.toString().split(",")
        let i = Number(ij[1]);
        let j = Number(ij[0]);
        let pos = UtilHelper.CocosWorldPosToFgui(scene.battleBG.GetWorldPos(i, j));
        this.viewNode.Word.setPosition(pos.x, pos.y);
    }

    private anima:fgui.Transition;
    ShowShouZhi(pos:Vec2, ai?:number, aj?:number, bi?:number, bj?:number){
        this.viewNode.ShouZhi.setPosition(pos.x, pos.y);
        this.viewNode.ShouZhi.sortingOrder = 10;
        this.viewNode.ShouZhi.visible = true;
        if(this.anima){
            this.anima.stop();
        }
        if(ai == null){
            this.anima = this.viewNode.ShouZhi.getTransition("click");
            if(this.anima){
                this.anima.play(null, -1);
            }
            return
        }
        
        if(ai > bi){
            this.anima = this.viewNode.ShouZhi.getTransition("down_move");
        }else if(bi > ai){
            this.anima = this.viewNode.ShouZhi.getTransition("up_move");
        }else if(aj > bj){
            this.anima = this.viewNode.ShouZhi.getTransition("left_move");
        }else if(bj > aj){
            this.anima = this.viewNode.ShouZhi.getTransition("right_move");
        }
        if(this.anima){
            this.anima.play(null, -1);
        }
    }

    CheckStep(){
        if(this.stepIndex == null || this.stepCfg == null || this.stepIndex >= this.stepCfg.length){
            console.log("指引结束");
            ViewManager.Inst().CloseView(BattleGuideView);
            return;
        }
        let step = this.stepCfg[this.stepIndex];
        BattleData.Inst().guideStepIndex = this.stepIndex;
        this.HandleStep(step);
        this.stepIndex++;
    }


    private curStep:CfgGuideStap;
    HandleStep(step:CfgGuideStap){
        this.curStep = step;
        this.viewNode.Block.getController("show").setSelectedIndex(step.guide_id);
        this.ShowWord(step);
        switch(step.guide_id){
            case 1: this.HandleSwap(step); break;
            case 2: this.HandleDiscard(step); break;
            case 3: this.HandleSelectSkill(step); break;
            case 4: this.HandleEmpty(step); break;
            case 5: this.HandleBtn(step); break;
        }
    }

    private handleSwapHeros:HeroObj[];
    HandleSwap(step:CfgGuideStap){
        if(step.seq >= 2 && step.seq <= 4){
            this.HideTime(1, ()=>{
                this._HandleSwap(step);
            });
        }else{
            this._HandleSwap(step);
        }
    }

    _HandleSwap(step:CfgGuideStap){
        let a_ij = step.step_param_1.toString().split(",")
        let ai = Number(a_ij[1]);
        let aj = Number(a_ij[0]);

        let b_ij = step.step_param_2.toString().split(",")
        let bi = Number(b_ij[1]);
        let bj = Number(b_ij[0]);

        let scene = BattleCtrl.Inst().battleScene;
        this.SetRectSize(ai,aj,bi,bj,this.rect);

        let aPos = scene.battleBG.GetWorldPos(ai, aj);
        let aFpos = UtilHelper.CocosWorldPosToFgui(aPos);
        

        //高亮角色
        if(step.step_param_3 != ""){
            let list = step.step_param_3.toString().split("|");
            this.handleSwapHeros = [];
            list.forEach(v=>{
                let ij = v.toString().split(",")
                let i = Number(ij[1]);
                let j = Number(ij[0]);
                let hero = scene.GetHero(i,j);;
                this.handleSwapHeros.push(hero);
            })
            this.ShowHeroObj(this.handleSwapHeros, true);
        }
        this.ShowShouZhi(aFpos,ai, aj, bi, bj);
    }

    SetRectSize(ai:number, aj:number, bi:number, bj:number, rect:fgui.GObject){
        let scene = BattleCtrl.Inst().battleScene;
        let aPos = scene.battleBG.GetWorldPos(ai, aj);
        let bPos = scene.battleBG.GetWorldPos(bi, bj);
        let centerPos = new Vec3(aPos.x + (bPos.x - aPos.x) / 2, aPos.y + (bPos.y - aPos.y) / 2, 0);
        let fPos = UtilHelper.CocosWorldPosToFgui(centerPos);

        let w = aj == bj ? CELL_WIDTH : CELL_WIDTH * 2;
        let h = aj == bj ? CELL_WIDTH * 2 : CELL_WIDTH;
        rect.width = w;
        rect.height = h;
        rect.setPosition(fPos.x, fPos.y);
    }

    HandleDiscard(step:CfgGuideStap){
        this.HandleSwap(step);
    }

    HandleSelectSkill(step:CfgGuideStap){
        this.Hide(false);
        this.clickblock.height = 2000;

        let view:BattleView = ViewManager.Inst().getView(BattleView);
        let skillItem = view.GetViewNode().SkillSelect.Skill1;
        let worldPos = skillItem.node.worldPosition;
        this.view.addChild(skillItem);
        skillItem.node.setWorldPosition(worldPos);
        skillItem.onceClick(()=>{
            view.GetViewNode().SkillSelect.addChild(skillItem);
            skillItem.node.setWorldPosition(worldPos);
            this.CheckSelectSkill();
        });

        let fPos = UtilHelper.CocosWorldPosToFgui(worldPos);
        this.ShowShouZhi(new Vec2(fPos.x + 50,fPos.y));
    }

    private stepInfo:any;
    HandleEmpty(step:CfgGuideStap){
        let view:BattleView = ViewManager.Inst().getView(BattleView);
        this.stepInfo = view.GetViewNode().StepInfo;
        this.view.addChild(this.stepInfo);
        this.stepInfo.onceClick(()=>{
            this.CheckEmpty();
        });
        this.ShowShouZhi(new Vec2(this.stepInfo.x + 50,this.stepInfo.y + 50))
    }

    HandleBtn(step:CfgGuideStap){
        let view:BattleView = ViewManager.Inst().getView(BattleView);
        let speedBtn = view.GetViewNode().AddSpeedBtn;
        // speedBtn.onceClick(()=>{
        //     this.CheckBtn();
        // });
        this.viewNode.Block.visible = false;
        let pos = new Vec2(speedBtn.x + 50,speedBtn.y + 50);
        this.viewNode.ShouZhi.setPosition(pos.x, pos.y);
        if(this.anima){
            this.anima.stop();
        }
        this.viewNode.ShouZhi.getTransition("end").play(()=>{
            this.CheckBtn();
        },2);
    }

    CheckSwap(heroA:HeroObj, heroB:HeroObj){
        if(this.curStep.guide_id != 1){
            return;
        }
        let step = this.curStep;
        let a_ij = step.step_param_1.toString().split(",")
        let ai = Number(a_ij[1]);
        let aj = Number(a_ij[0]);

        let b_ij = step.step_param_2.toString().split(",")
        let bi = Number(b_ij[1]);
        let bj = Number(b_ij[0]);

        if(heroA.i == ai && heroA.j == aj && heroB.i == bi && heroB.j == bj){
            this.ShowHeroObj(this.handleSwapHeros, false);
            this.CheckStep();
        }
    }

    CheckDiscard(heroA:HeroObj){
        //console.log("丢弃的英雄", heroA);
        if(this.curStep.guide_id != 2){
            return;
        }
        let step = this.curStep;
        let a_ij = step.step_param_1.toString().split(",")
        let ai = Number(a_ij[1]);
        let aj = Number(a_ij[0]);

        if(heroA.i == ai && heroA.j == aj){
            //this.CheckStep();
            this.Hide(true);
            BattleCtrl.Inst().battleScene.battleInfo.isGuiding = true;
        }
    }

    CheckSelectSkill(){
        if(this.curStep.guide_id != 3){
            return;
        }
        this.SetGuideFlag();
        this.CheckStep();
    }

    CheckEmpty(){
        if(this.curStep.guide_id != 4){
            return;
        }
        let view:BattleView = ViewManager.Inst().getView(BattleView);
        view.addChild(this.stepInfo);
        BattleCtrl.Inst().battleScene.battleInfo.isGuiding = false;
        BattleCtrl.Inst().battleScene.CheckStep();
        this.CheckStep();
    }

    CheckBtn(){
        if(this.curStep.guide_id != 5){
            return;
        }
        this.CheckStep();
    }


    OnBlockClick(){
        if(this.curStep == null){
            return;
        }
        this.CheckEmpty();
    }

    ShowHeroObj(heros:HeroObj[], isShow:boolean){
        if(heros == null || heros.length == 0){
            return;
        }
        let parent = isShow ? this.viewNode.Block.node : BattleCtrl.Inst().battleScene.HeroRoot
        heros.forEach((hero)=>{
            hero.sanXiaoCtrl.isCanClick = !isShow;
            parent.addChild(hero.node);
            hero.node.setWorldPosition(hero.initWorldPos);
        })
    }
}
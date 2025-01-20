import { _decorator, Color, color, Component, Label, Node, Sprite, Vec3, Animation, SpriteFrame, NodePool, path, isValid, game } from 'cc';
import { BattleObj } from './BattleObj';
import { BattleData, BattleHeroAttriBuff, BattleInfo } from '../BattleData';
import { SanXiaoCtrl } from '../Control/SanXiaoCtrl';
import { CreateSMD, smartdata } from 'data/SmartData';
import { HeroControl } from '../Control/HeroControl';
import { BAO_JI_SCALE, BattleModel, BOX_MAX, DEF_MAP_COL, HeroAnimationType, HeroBUffTypeMap, HeroCtrlMap, HeroObjBuffType, IHeroObjBuffData, MAP_COL, SanXiaoMarkType, SceneType } from '../BattleConfig';
import { CfgHero, CfgHeroAtt, CfgHeroBattle, CfgHeroJiHuo } from 'config/CfgHero';
import { ResManager } from 'manager/ResManager';
import { ResPath } from 'utils/ResPath';
import { LogError } from 'core/Debugger';
import { HeroData } from 'modules/hero/HeroData';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { BattleCtrl } from '../BattleCtrl';
import { NodePools } from 'core/NodePools';
import { BattleScene } from '../BattleScene';
import { TouDanShouCtrl } from '../Control/TouDanShouCtrl';
import { HeroBuff } from '../Function/HeroBuff';
import { Singleton } from 'core/Singleton';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { DefenseCtrl } from '../Control/DefenseCtrl';
import * as fgui from "fairygui-cc";
import { BattleHelper } from '../BattleHelper';
import { ArenaData } from 'modules/Arena/ArenaData';
const { ccclass, property } = _decorator;

@ccclass('HeroObj')
export class HeroObj extends BattleObj {
    @property(Sprite)
    Icon: Sprite;
    @property(Animation)
    Anima: Animation;
    @property(Label)
    LevelText: Label;

    data: CfgHeroBattle;
    baseCfg: CfgHeroJiHuo;
    attriCfg: CfgHeroAtt;

    private localAttriBuff : BattleHeroAttriBuff;

    get LocalAttriBuff(){
        return this.localAttriBuff;
    } 
    i: number;
    j: number;
    level: number = 1;
    get ijNum(): number {
        if(BattleCtrl.Inst().battleModel == BattleModel.Defense){
            return BattleHelper.IJTonum2(this.i, this.j, DEF_MAP_COL);
        }else{
            return BattleHelper.IJTonum2(this.i, this.j, MAP_COL);
        }
    }

    get stage():number{
        return this.data.stage;
    }

    get battleInfo():BattleInfo{
        return BattleData.Inst().GetBattleInfo(this.tag);
    }

    reportIndex: number = 0;    //每次战斗开始前的阵容下标

    initPos: Vec3;
    initWorldPos: Vec3;

    sanXiaoCtrl: SanXiaoCtrl;
    heroCtrl: HeroControl;

    sanxiaoMark: SanXiaoMarkType = SanXiaoMarkType.None;       //0是无标记，1是标记了行，2是标记了列

    private finishAnimationMap: Map<string, Function> = new Map();
    private sceneEffects: Node[] = [];

    buffMap: Map<HeroObjBuffType, HeroBuff> = new Map();

    get zhongji():number{
        return this.GetSkillAttri().zhongji + this.battleInfo.skillAttri.zhongji;
    }

    get baoji():number{
        return this.battleInfo.skillAttri.baoji + this.GetSkillAttri().baoji;
    }
    get baojiScale():number{
        return this.battleInfo.skillAttri.baojiScale + BAO_JI_SCALE + this.GetSkillAttri().baojiScale;
    }

    SetData(data: CfgHeroBattle) {
        super.SetData(data);
        //this.Icon.node.setScale(0.76,0.76);
        this.localAttriBuff = new BattleHeroAttriBuff();
        this.sanxiaoMark = SanXiaoMarkType.None;
        if (data.hero_id != 0) {
            this.baseCfg = HeroData.Inst().GetHeroBaseCfg(this.data.hero_id);
            let battleModel = BattleCtrl.Inst().battleModel;
            if(battleModel == BattleModel.Normal){
                this.level = BattleData.Inst().GetHeroLevel(this.data.hero_id, this.tag);
            }else if(battleModel == BattleModel.Arena){
                this.level = ArenaData.Inst().GetBattleHeroLevel(this.data.hero_id, this.tag);
            }
            else{
                this.level = HeroData.Inst().GetHeroLevel(this.data.hero_id);
                if(this.level < 1){
                    this.level = 1;
                }
            }
            this.attriCfg = HeroData.Inst().GetHeroLevelCfg(this.data.hero_id, this.level)
        }
        this.FlushShow();

        if(BattleCtrl.Inst().battleModel == BattleModel.Normal){
            this.sanXiaoCtrl = this.node.addComponent(SanXiaoCtrl);
            this.AddCtrl(this.sanXiaoCtrl);
        }else if(BattleCtrl.Inst().battleModel == BattleModel.Defense){
            let ctrl = this.node.addComponent(DefenseCtrl);
            this.AddCtrl(ctrl);
        }
        if (!this.IsItem() && this.data.stage > 0) {
            let ctrl = HeroCtrlMap[this.baseCfg.ctrl_type] ?? TouDanShouCtrl;
            if (ctrl) {
                this.heroCtrl = this.node.addComponent(ctrl);
                this.AddCtrl(this.heroCtrl);
            } else {
                LogError("角色添加行为异常", this.data);
            }
        }
        this.LevelText.node.parent.active = false;
    }

    GetHeroSCInfo():IPB_SCBattleHero{
        return <IPB_SCBattleHero>{
            heroId: this.data.hero_id,
            heroLevel: this.level,
            heroStage: this.data.stage,
        };
    }

    private FlushShow() {
        ResManager.Inst().Load<SpriteFrame>(ResPath.RoleIcon(this.data.res_id), (error, img) => {
            if (error != null) {
                LogError(error);
                return;
            }
            img.packable = false;
            this.Icon.spriteFrame = img;
        });
        this.PlayMaxEffect(true);
    }

    get worldPosition(): Vec3 {
        return this.node.worldPosition;
    };

    //播放满级特效
    PlayMaxEffect(isFlush:boolean = false) {
        if (this.IsFull() && !this.IsItem()) {
            if(!isFlush){
                SceneEffect.Inst().Play(SceneEffectConfig.MaxLevel, this.node, this.node.worldPosition)
                AudioManager.Inst().PlaySceneAudio(AudioTag.zhandoumanji);
            }
            SceneEffect.Inst().Play(SceneEffectConfig.MaxLevelLoop, this.node, this.node.worldPosition, (effect) => {
                if(isValid(this.node) && effect){
                    effect.setParent(this.node);
                    effect.setPosition(0,0);
                    this.sceneEffects.push(effect);
                }
                return true;
            })
        }
    }

    SetIJ(i: number, j: number) {
        this.i = i;
        this.j = j;
        this.node.name = this.i + "_" + this.j;
        if(BattleCtrl.Inst().battleModel == BattleModel.Normal){
            BattleCtrl.Inst().battleScene.battleBG.SetSpCellHero(this);
        }
    }

    InitPos(x: number, y: number) {
        this.node.setPosition(x, y);
        this.initPos = this.node.getPosition();
        this.initWorldPos = this.node.getWorldPosition();
    }

    private moveTweenr:fgui.GTweener;
    MovePos(worldPos: Vec3, finishFunc?:()=>any, time: number = 0.2, easeType: fgui.EaseType = fgui.EaseType.SineOut){
        if(this.moveTweenr){
            this.moveTweenr.kill();
            this.moveTweenr = null;
        }
        let curPos = this.node.worldPosition;
        let gtweenr = fgui.GTween.to2(curPos.x, curPos.y, worldPos.x, worldPos.y, time);
        this.moveTweenr = gtweenr;
        gtweenr.setEase(easeType);
        gtweenr.onUpdate((tweener: fgui.GTweener) => {
            this.node.setWorldPosition(tweener.value.x, tweener.value.y, 0);
        })
        gtweenr.onComplete(() => {
            if(this.node == null){
                return;
            }
            if (finishFunc) {
                finishFunc();
            }
            if(this.moveTweenr){
                this.moveTweenr = null;
            }
        })
    }

    GetLevel() {
        return this.data.stage;
    }

    //死亡
    Die(finishFunc?: Function) {
        SceneEffect.Inst().Play(SceneEffectConfig.HeroHide, this.scene.node, this.node.worldPosition);
        this.PlayAnimation(HeroAnimationType.Destroy, finishFunc);
    }
    //出生显示
    ShowCreate(finishFunc?: Function) {
        SceneEffect.Inst().Play(SceneEffectConfig.HeroUp, this.node, this.node.worldPosition);
        this.PlayAnimation(HeroAnimationType.Create, finishFunc);
    }
    
    //显示等级
    ShowLevel(isShow:boolean){
        this.LevelText.node.parent.active = isShow;
        this.LevelText.string = this.data.stage.toString();
    }

    //获得词条提升表现
    ShowUpAttri() {
        if(BattleCtrl.Inst().battleModel != BattleModel.Normal){
            return;
        }
        let cell = BattleCtrl.Inst().battleScene.battleBG.GetCell(this.i, this.j);
        let cellPos = new Vec3(cell.worldPosition.x, cell.worldPosition.y - 20, 0);
        SceneEffect.Inst().Play(SceneEffectConfig.GetSkillShow2, cell, cellPos);
        SceneEffect.Inst().Play(SceneEffectConfig.GetSkillShow1, this.node, this.node.worldPosition);
    }


    PlayAnimation(animaName: string, finishFunc?: Function) {
        if (finishFunc) {
            this.finishAnimationMap.set(animaName, finishFunc);
        }
        this.Anima.play(animaName);
    }

    StopAnimation() {
        this.Anima.play();
    }

    AnimationFinish(animaName: string) {
        if (!animaName) {
            return
        }
        if (this.finishAnimationMap.has(animaName)) {
            let finishFunc = this.finishAnimationMap.get(animaName)
            finishFunc();
            this.finishAnimationMap.delete(animaName);
        }
    }

    IsItem() {
        return this.data.hero_id == 0
    }

    IsFull(level?: number) {
        if (this.IsItem()) {
            if (level) {
                return level >= BOX_MAX;
            }
            return this.data.stage >= BOX_MAX;
        }
        if (level) {
            return level >= this.baseCfg.stage_all;
        }
        return this.data.stage >= this.baseCfg.stage_all;
    }

    //升满级还差多少级
    NeedFull(): number {
        return this.baseCfg.stage_all - this.data.stage;
    }

    Delete() {
        super.Delete();
        if (this.sceneEffects.length > 0) {
            this.sceneEffects.forEach((effect) => {
                NodePools.Inst().Put(effect);
            })
            this.sceneEffects = [];
        }
        this.Icon.spriteFrame = null;
        this.sanXiaoCtrl = null;
        this.heroCtrl = null;
        this.Anima.stop();
        this.ClearBuff();
    }

    IsDeleted():boolean{
        return this.heroCtrl == null;
    }


    AddBuff(buffData: IHeroObjBuffData) {
        if(!isValid(this.node) || this.heroCtrl == null){
            return;
        }
        if (!this.buffMap.has(buffData.buffType)) {
            let buffClass = HeroBUffTypeMap[buffData.buffType];
            let buff = new buffClass(this, buffData.buffType);
            this.buffMap.set(buffData.buffType, buff);
            buff.Add(buffData);
            buff.Start();
        } else {
            let buff = this.buffMap.get(buffData.buffType);
            buff.Add(buffData);
        }
    }
    RemoveBuff(buff: HeroBuff) {
        if (this.buffMap.has(buff.buffType)) {
            this.buffMap.delete(buff.buffType);
        }
        buff.RemoveCallback();
        buff.Delete();
    }

    RemoveBuffAtType(buffType: HeroObjBuffType) {
        if (this.buffMap.has(buffType)) {
            let buff = this.buffMap.get(buffType)
            this.buffMap.delete(buffType);
            buff.RemoveCallback();
            buff.Delete();
        }
    }

    RemoveBuffByData(buffData: IHeroObjBuffData){
        if(!this.buffMap.has(buffData.buffType)){
            return;
        }
        let buff = this.buffMap.get(buffData.buffType);
        if(buff.RemoveBuffData(buffData) && buff.BuffDataCount == 0){
            this.RemoveBuff(buff);
        }
    }

    ClearBuff() {
        if (this.buffMap == null || this.buffMap.size == 0) {
            return;
        }
        this.buffMap.forEach(v => {
            v.RemoveCallback();
            v.Delete();
        })
        this.buffMap.clear();
    }
    HasBuff(buffType: HeroObjBuffType): boolean {
        return this.buffMap.has(buffType);
    }

    GetSkillAttri(): BattleHeroAttriBuff {
        let buff = this.battleInfo.skillAttri.GetHeroAttriBuff(this.data.hero_id);
        return buff;
    }
}


export class HeroObjIconDownloader{

    static iconMap:Map<string, SpriteFrame> = new Map<string, SpriteFrame>();


    static GetTotalIconResPath(hero_ids:number[]):string[]{
        let cfg = CfgHero.battle_info
        let list:string[] = []
        cfg.forEach(v=>{
            
            if(hero_ids.indexOf(v.hero_id) != -1){
                let path = ResPath.RoleIcon(v.res_id);
                if(!this.iconMap.has(path)){
                    list.push(path);
                }
            }
        })
        return list;
    }

    private progress:number;
    private finishFunc:()=>any;
    LoadIcons(paths:string[], finishFunc?:()=>any){
        this.finishFunc = finishFunc;
        this.progress = paths.length;
        console.log("角色下载this.progress", this.progress);
        if(this.progress < 1){
            this.FinishCallback();
            return;
        }
        for(let i = 0; i < paths.length; i++){
            this.LoadIcon(paths[i], this.loadFinish.bind(this));
        }
    }

    LoadIcon(path:string, finishFunc?:()=>any){
        if(HeroObjIconDownloader.iconMap.has(path)){
            if(finishFunc){
                finishFunc();
            }
        }else{
            ResManager.Inst().Load<SpriteFrame>(path, (error, img) => {
                if (error != null) {
                    LogError(error);
                }else{
                    HeroObjIconDownloader.iconMap.set(path, img);
                }
                if(finishFunc){
                    finishFunc();
                }
            });
        }
    }

    private loadFinish(){
        //console.log("角色图片下载进度", this.progress)
        if(this.progress){
            this.progress--;
            if(this.progress <= 0){
                this.progress = null;
                this.FinishCallback();
            }
        }
    }

    private FinishCallback(){
        if(this.finishFunc){
            this.finishFunc();
            this.finishFunc = null;
        }
    }
}

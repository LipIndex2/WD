import { _decorator, Component, Node, Vec3 } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { ResPath } from 'utils/ResPath';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleData } from 'modules/Battle/BattleData';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { BattleEventType, CELL_WIDTH, FIGHT_CELL_WIDTH, IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { EventCtrl } from 'modules/common/EventCtrl';
import { CfgSkillData } from 'config/CfgEntry';
import { LogError } from 'core/Debugger';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { XuanYunBuff } from 'modules/Battle/Function/MonsterBuff';
import { BattleHelper, BattleSceneLayerType } from 'modules/Battle/BattleHelper';
enum WoGuaRes {
    Normal = "wogua_1",
    JiaDa = "wogua_2",
    ChongJiBo = "ChongJiBo",
}
export class WoGuaControl extends HeroControl {
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);

    protected skillFuncRes = {
        [WoGuaRes.ChongJiBo] : SkillFuncResUnlock.Create(HeroSkillId.WoGua.Skill8),
    }

    private addSpeed:number = 0;
    //攻击速度 隔多少秒攻击一次
    GetTotalAttackSpeed(): number {
        let value = this.attackSpeed
        return value + this.addSpeed;
    }

    //有多少怪物在身边死亡了
    private monsterDieCount = 0;

    //击杀了多少个怪物
    private jishaCount = 0;

    //攻击次数
    private attackCount = 0;

    OnFightStart(){
        this.monsterDieCount = 0;
        this.addSpeed = 0;
        //this.attackCount = 0;
    }

    Init(){
        this.RegisterSkill(SkillPlayType.After, HeroSkillId.WoGua.JianTa,this.JianTa.bind(this));
        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.WoGua.Skill8,this.ChongJiBoSkill.bind(this));
        EventCtrl.Inst().on(BattleEventType.MonsterDie, this.OnMonsterDie, this);
    }

    
    //默认技能效果
    DefaultSkillAction(){
        AudioManager.Inst().Play(AudioTag.wogua);
        this.CrateSkillFunc(this.shootEffectPath, (skill:SkillRange)=>{
            skill.SetScale(this.skillBuff.attackRangeScale);
        });

        let parent = BattleHelper.GetNodeParent(BattleSceneLayerType.HeroBottom, this.scene);

        SceneEffect.Inst().Play(SceneEffectConfig.WoGuaDiLie, parent, this.node.worldPosition);
        this.attackCount++;
    }

    //践踏
    JianTa(skill:CfgSkillData, event:SkillColliderEvent){
        let jiansuValue = this.GetJianSuValue();
        let buff = <IMonsterObjBuffData>{buffType: MonsterObjBuffType.JianTa, time:skill.pram1, p1:jiansuValue};
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                monster.AddBuff(buff);
            })
        }
    }

    //击杀怪物
    JiShaMonster(monster:MonsterObj){
        this.jishaCount++;
        if(BattleData.Inst().IsHasSkill(HeroSkillId.WoGua.JiShaJiaGongSu,this.hero.tag)){
            let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.WoGua.JiShaJiaGongSu);
            if(this.jishaCount >= skill.pram1){
                this.jishaCount = 0;
                this.addSpeed = skill.pram2 / 100;
                this.scheduleOnce(()=>{
                    if(this.addSpeed > 0){
                        this.addSpeed -= skill.pram2 / 100;
                    }
                },1)
            }
        }
    }

    //计算伤害
    GetTotalAttackValue(monster:MonsterObj):number{
        let value = this.CalculateAttackValue();
        if(BattleData.Inst().IsHasSkill(HeroSkillId.WoGua.JianTa,this.hero.tag)){
            let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.WoGua.JianTa);
            value += this.baseAttackValue * skill.pram1 / 100;
        }
        if(BattleData.Inst().IsHasSkill(HeroSkillId.WoGua.KongJuJiaShang,this.hero.tag) && monster.HasBuff(MonsterObjBuffType.KonJu)){
            let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.WoGua.KongJuJiaShang);
            value += this.baseAttackValue * skill.pram1 / 100;
        }
        if(BattleData.Inst().IsHasSkill(HeroSkillId.WoGua.SiWangJiaShang,this.hero.tag)){
            let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.WoGua.SiWangJiaShang);
            let num = Math.floor(this.monsterDieCount / skill.pram1);
            value += this.baseAttackValue * num * skill.pram2 / 100
        }
        return value;
    }

    //减速效果
    GetJianSuValue():number{
        return (this.hero.attriCfg.moderate_effect +this.skillBuff.slowDown) / 100;
    }


    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let att_value = this.GetTotalAttackValue(monster);
                monster.DeductHp(this.hero, att_value);
                event.skillFunc.SetExcludeObj(monster);
                if(monster.IsDied()){
                    this.JiShaMonster(monster);
                }
            })
        }
    }

    OnMonsterDie(monster:MonsterObj){
        let isRange = this.CheckAttackRange(monster);
        if(isRange){
            this.monsterDieCount ++;
        }
    }

    onDestroy(){
        super.onDestroy();
        EventCtrl.Inst().off(BattleEventType.MonsterDie, this.OnMonsterDie, this);
    }


    //冲击波
    ChongJiBoSkill(skill:CfgSkillData){
        if(this.attackCount < skill.pram1){
            return;
        }
        this.attackCount = 0;
        this.PlayChongJiBo(0);
        this.PlayChongJiBo(90);
        this.PlayChongJiBo(180);
        this.PlayChongJiBo(270);
    }

    PlayChongJiBo(angle:number){
        this.CrateSkillFuncByName(WoGuaRes.ChongJiBo, (skill:SkillShoot)=>{
            skill.SetEulerAngle(angle);
            skill.OnHit(this.OnChongJiBoHitEvent.bind(this));
        });
    }

    OnChongJiBoHitEvent(event:SkillColliderEvent){
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        this.StopSkill(event.skillFunc);
        let skill8 = BattleData.Inst().GetSkillCfg(HeroSkillId.WoGua.Skill8);
        let attValue = this.CalculateAttackValue(0, skill8.pram2 / 10);
        monster.DeductHp(this.hero, attValue);

        let parent = BattleHelper.GetNodeParent(BattleSceneLayerType.HeroBottom, this.scene);

        BattleData.Inst().HandleSkill(HeroSkillId.WoGua.Skill9, (skill9)=>{
            SceneEffect.Inst().Play(SceneEffectConfig.WoGuaDiLie, parent, monster.node.worldPosition);
            let monsters = this.GetRoundMonsters(1, monster.node.worldPosition);
            monsters.forEach(_monster=>{
                if(_monster != monster && !_monster.IsDied()){
                    let buff = XuanYunBuff.CreateData(this.hero, skill9.pram1);
                    _monster.AddBuff(buff);
                }
            })
        }, this.hero.tag)
    }
}


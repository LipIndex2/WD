import { _decorator, Component, Node } from 'cc';
import { LogError } from 'core/Debugger';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { BattleEventType, IMonsterObjBuffData, MonsterEventType, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleData } from 'modules/Battle/BattleData';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillRotate } from 'modules/Battle/Function/SkillRotate';
import { SkillRoundMove } from 'modules/Battle/Function/SkillRountMove';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { HeroObj } from 'modules/Battle/Object/HeroObj';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { EventCtrl } from 'modules/common/EventCtrl';
import { ResPath } from 'utils/ResPath';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { HeroSkillChangeListener } from '../HeroSkillChangeListener';

enum ShuiLianRes {
    Normal = "shuilian_1",
    JuFeng = "JuFeng",
    HaiLang = "HaiLang",
}

export class ShuiLianControl extends HeroControl {
    protected attackRange: HeroAttackRange = new HeroAttackRange(0.5,3,null,null,0);

    private skillListener = new HeroSkillChangeListener();

    protected skillFuncRes = {
        [ShuiLianRes.Normal] : SkillFuncResInit.Create(),
        [ShuiLianRes.JuFeng] : SkillFuncResUnlock.Create(HeroSkillId.ShuiLian.JuFeng),
        [ShuiLianRes.HaiLang] : SkillFuncResInit.Create(),
    }

    //释放第几个飓风
    private JuFengIndex:number = 1;

    Init(){
        EventCtrl.Inst().on(BattleEventType.MonsterDieByHero, this.OnMonsterDieEvent, this);
        this.skillListener.tag = this.hero.tag;
        this.skillListener.AddLinsten(HeroSkillId.ShuiLian.Skill9,this.FlushSkill9.bind(this));
        this.AddSmartDataCare(this.battleInfo, this.FlushSkill9.bind(this), "skillListMap");

        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.ShuiLian.Skill9,this.PlaySkill9.bind(this));
        this.FlushSkill9();
    }


    FlushSkill9(){
        if(BattleData.Inst().IsHasSkill(HeroSkillId.ShuiLian.Skill9,this.hero.tag)){
            this.attackRange = new HeroAttackRange(0,6);
        }
    }

    PlaySkill9(){
        this.CrateSkillFunc(ResPath.SkillAsset(ShuiLianRes.Normal), (skill)=>{
            skill.SetEulerAngle(90);
        });
        this.CrateSkillFunc(ResPath.SkillAsset(ShuiLianRes.Normal), (skill)=>{
            skill.SetEulerAngle(180);
        });
        this.CrateSkillFunc(ResPath.SkillAsset(ShuiLianRes.Normal), (skill)=>{
            skill.SetEulerAngle(270);
        });
    }


    //计算伤害
    GetTotalAttackValue(monster:MonsterObj):number{
        let value = this.CalculateAttackValue();
        return value;
    }


    //释放海浪的概率
    GetHaiLangGaiLv():number{
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.ShuiLian.HaiLang,this.hero.tag)){
            return 0;
        }
        let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.ShuiLian.HaiLang);
        let value = skill.pram1 + this.skillBuff.HaiLangGaiLv;

        if(BattleData.Inst().IsHasSkill(HeroSkillId.ShuiLian.JiaJiTuiGaiLv2,this.hero.tag)){
            let skill2 = BattleData.Inst().GetSkillCfg(HeroSkillId.ShuiLian.JiaJiTuiGaiLv2);
            let heroObjs = this.GetRoundHeros(skill2.pram1);
            let count = 0;
            heroObjs.forEach((hero)=>{
                if(hero.data.hero_id == 13 || hero.data.hero_id == 2){
                    count++;
                }
            })
            value += Math.floor(count / skill2.pram2) * skill2.pram3;
        }

        //LogError("海浪概率", value);
        return value;
    }

    //能击退的数量
    GetJiTuiCount():number{
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.ShuiLian.HaiLang,this.hero.tag)){
            return 0;
        }
        let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.ShuiLian.HaiLang);
        let value = skill.pram2 + this.skillBuff.JiTuiCount;
        return value;
    }


    //默认技能效果
    DefaultSkillAction(){
        if(MathHelper.RandomResult(this.GetHaiLangGaiLv(), 100)){
            this.PlayHaiLang();
        }else{
            this.CrateSkillFunc(ResPath.SkillAsset(ShuiLianRes.Normal));
        }
        AudioManager.Inst().Play(AudioTag.shuilian);
    }

    //击退怪物
    JiTuiMonster(monster:MonsterObj){
        if(!monster.IsDied()){
            let buff = <IMonsterObjBuffData>{
                buffType: MonsterObjBuffType.JiTui,
                hero:this.hero,
                time:0.5,
                p1:1
            }
            monster.AddBuff(buff);
        }
    }

    //会击退冰冻的敌人
    JiTuiBingDongMonster(monster:MonsterObj){
        if(monster.IsDied()){
            return;
        }
        if(!monster.HasBuff(MonsterObjBuffType.BingDong)){
            return;
        }
        let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.ShuiLian.JiTuiBingDong);
        if(!this.IsHasSkillByData(skill)){
            return; 
        }
        this.JiTuiMonster(monster);
    }

    //释放飓风
    PlayJuFeng(){
        this.CrateHitSkillFunc(ResPath.SkillAsset(ShuiLianRes.JuFeng),this.node.worldPosition, this.OnJuFengHitEvent.bind(this),(skillFunc:SkillRoundMove)=>{
            this.PlaySkill(skillFunc);
        });
    }

    //释放海浪
    PlayHaiLang(){
        this.CrateHitSkillFunc(ResPath.SkillAsset(ShuiLianRes.HaiLang),this.node.worldPosition, this.OnHaiLangHitEvent.bind(this),(skillFunc:SkillShoot)=>{
            this.PlaySkill(skillFunc);
        }, this.scene.BottomEffectRoot);
    }


    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let att_value = this.GetTotalAttackValue(monster);
                monster.DeductHp(this.hero, att_value);
                event.skillFunc.SetExcludeObj(monster);
                this.JiTuiBingDongMonster(monster);

                if(monster.IsDied()){
                    this.skillBuff.JiShaCount++;
                }
            })
        }
    }

    OnJuFengHitEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            let damgeScale = 1;
            let skill10 = this.GetHasSkill(HeroSkillId.ShuiLian.Skill10);
            if(skill10){
                damgeScale += skill10.pram1 / 100;
            }
            let attValue = this.CalculateAttackValue(0, damgeScale);
            event.objs.forEach(monster=>{
                monster.DeductHp(this.hero, attValue);
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }

    OnHaiLangHitEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            let canJitui = this.GetJiTuiCount();
            event.objs.forEach(monster=>{
                if(canJitui > 0){
                    this.JiTuiMonster(monster);
                    canJitui--;
                    event.skillFunc.SetExcludeObj(monster);
                }
                BattleData.Inst().HandleSkill(HeroSkillId.ShuiLian.Skill8, (skill8)=>{
                    let attValue = this.CalculateAttackValue(0, skill8.pram1 / 100);
                    monster.DeductHp(this.hero, attValue); 
                }, this.hero.tag)
            })
        }
    }

    OnMonsterDieEvent(monster:MonsterObj, hero:HeroObj){
        let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.ShuiLian.JuFeng);
        if(this.IsHasSkillByData(skill)){
            let count = this.skillBuff.JiShaCount;
            if(count >= skill.pram1 * this.JuFengIndex){
                this.PlayJuFeng();
                this.JuFengIndex++;
            }
        }
    }

    onDestroy(){
        super.onDestroy();
        EventCtrl.Inst().off(BattleEventType.MonsterDieByHero, this.OnMonsterDieEvent, this);
        this.skillListener.Detroy();
        this.skillListener = null;
    }

}


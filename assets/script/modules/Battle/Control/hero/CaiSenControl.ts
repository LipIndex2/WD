import { _decorator, Node } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent, SkillFunc } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { CfgSkillData } from 'config/CfgEntry';
import { IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleData } from 'modules/Battle/BattleData';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { MathHelper } from '../../../../helpers/MathHelper';
import { JiTuiBuff } from 'modules/Battle/Function/MonsterBuff';
enum CaiSenRes {
    NormalFront1 = "caisen_normal_fr1",
    NormalFront2 = "caisen_normal_fr2",
    NormalFront3 = "caisen_normal_fr3",

    // NormalBack1 = "caisen_normal_bk1",
    // NormalBack2 = "caisen_normal_bk2",
    // NormalBack3 = "caisen_normal_bk3",
    QiGong = "caisen_qigong",
}
export class CaiSenControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);
    private angleNum = 0;
    private atkCount = 0;

    // 技能资源
    protected skillFuncRes = {
        [CaiSenRes.NormalFront1] : SkillFuncResInit.Create([{stage:3,resName:CaiSenRes.NormalFront2},{stage:5,resName:CaiSenRes.NormalFront3}]),
        // [CaiSenRes.NormalBack1] : SkillFuncResUnlock.Create(HeroSkillId.CaiSen.DoubleAtk,[{stage:3,resName:CaiSenRes.NormalBack2},{stage:5,resName:CaiSenRes.NormalBack3}]),
        [CaiSenRes.QiGong] : SkillFuncResUnlock.Create(HeroSkillId.CaiSen.QiGong),
        // [WoGuaRes.JiaDa] : SkillFuncResUnlock.Create(HeroSkillId.WoGua.JianTaFanWei),
    }

    Init(){
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.CaiSen.DoubleAtk,this.SkillDoubleAtkBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.CaiSen.QiGong,this.SkillQiGongBefore.bind(this));
    }

    //每回合战斗开始回调
    OnFightStart(){
        
    }

    
    //默认技能效果
    DefaultSkillAction(){
        ++this.atkCount;
        this.CrateSkillFuncByName(CaiSenRes.NormalFront1,(skillFunc)=>{
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
        })
        AudioManager.Inst().Play(AudioTag.CaiSen);
    }

    SkillDoubleAtkBefore(skill:CfgSkillData, event:SkillColliderEvent){
        this.CrateSkillFuncByName(CaiSenRes.NormalFront1,(skillFunc)=>{
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum-180);
        })
    }

    SkillQiGongBefore(skill:CfgSkillData, event:SkillColliderEvent){
        if(this.atkCount <= skill.pram1){
            return;
        }
        this.atkCount = 0;
        let damPer = skill.pram3 / 100;
        let damAddPer = 0;
        if (BattleData.Inst().IsHasSkill(HeroSkillId.CaiSen.QiGongDam, this.hero.tag)){
            let cfg = BattleData.Inst().GetSkillCfg(HeroSkillId.CaiSen.QiGongDam);
            let skillCount = this.GetSkillCount(cfg);
            damAddPer += MathHelper.NumToPer(cfg.pram1 * skillCount);
        }
        let dp = damPer + damAddPer;
        this.emitQiGong(dp,0);
        BattleData.Inst().HandleSkill(HeroSkillId.CaiSen.FourthQiGong,(cfg)=>{
            this.emitQiGong(dp,-180);
            this.emitQiGong(dp,-90);
            this.emitQiGong(dp,90);
        }, this.hero.tag)
    }

    private emitQiGong(damPer:number,angleOff:number){
        this.CrateHitSkillFuncByName(CaiSenRes.QiGong,this.hero.worldPosition,(event)=>{
            event.objs.forEach(hitMo=>{
                event.skillFunc.SetExcludeObj(hitMo);
                SceneEffect.Inst().Play(SceneEffectConfig.CaiSenQiGongBaoZha, this.scene.node, hitMo.centerWorldPos);
                if(this.checkZhanSha(hitMo)){
                    return;
                }
                let att_value = this.totalAttackValue(hitMo,damPer);
                hitMo.DeductHp(this.hero, att_value);
            });            

        },(skillFunc)=>{
            if(BattleData.Inst().IsHasSkill(HeroSkillId.CaiSen.QiGongBigger, this.hero.tag)){
                skillFunc.SetScale(2);
            }
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum + angleOff);
            this.PlaySkill(skillFunc);
        });
    }

    //计算伤害
    private totalAttackValue(monster:MonsterObj,finDamPer : number = 1):number{
        let finDamSc = finDamPer;
        //菜森攻击灼烧的敌人，伤害+<color=#036b16>{0}</color>%
        if(BattleData.Inst().IsHasSkill(HeroSkillId.CaiSen.ZhuoShaoDam, this.hero.tag)){
            if(monster.HasBuff(MonsterObjBuffType.ZhuoShao)){
                let cfg = BattleData.Inst().GetSkillCfg(HeroSkillId.CaiSen.ZhuoShaoDam);
                finDamSc += MathHelper.NumToPer(cfg.pram1);
            }
        }
        let val = this.CalculateAttackValue(0,finDamSc);
        return val;
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let jituiPer = 0;
        if(BattleData.Inst().IsHasSkill(HeroSkillId.CaiSen.JiTui, this.hero.tag)){
            let cfg = BattleData.Inst().GetSkillCfg(HeroSkillId.CaiSen.JiTui);
            jituiPer += cfg.pram1;
        }
        if(BattleData.Inst().IsHasSkill(HeroSkillId.CaiSen.JiTuiEasy, this.hero.tag)){
            let cfg = BattleData.Inst().GetSkillCfg(HeroSkillId.CaiSen.JiTuiEasy);
            let count = this.GetSkillCount(cfg);
            jituiPer += (cfg.pram1 * count);
        }
        jituiPer /= 100;
        let jituiCell = JiTuiBuff.DEFAULT_CELL;
        let jituiDisCfg = this.GetHasSkill(HeroSkillId.CaiSen.JiTuiDis);
        if(jituiDisCfg){
            jituiCell *= (1 + MathHelper.NumToPer(jituiDisCfg.pram1));
        }
        event.objs.forEach(hitMo=>{
            event.skillFunc.SetExcludeObj(hitMo);
            if(this.checkZhanSha(hitMo)){
                return;
            }
            if(hitMo.hpProgress < jituiPer){
                hitMo.AddBuff(JiTuiBuff.CreateData(this.hero,jituiCell,0.15));
            }
            let att_value = this.totalAttackValue(hitMo);
            hitMo.DeductHp(this.hero, att_value);
        });
    }

    private checkZhanSha(mo:MonsterObj) : boolean{
        let isTrigger = false;
        BattleData.Inst().HandleSkill(HeroSkillId.CaiSen.ZhanSha,(cfg)=>{
            if(mo.hpProgress <= MathHelper.NumToPer(cfg.pram1)){
                mo.ZhanSha(this.hero);
                isTrigger = true;
            }
        }, this.hero.tag);
        return isTrigger;
    }
    
    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

}


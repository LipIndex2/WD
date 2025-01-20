import { Vec3 } from "cc";
import { CfgSkillData } from "config/CfgEntry";
import { AttackConditionType, MonsterBUffTypeMap, MonsterObjBuffType, SkillPlayType } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { BattleData } from "modules/Battle/BattleData";
import { MonterBuff, ZuoShaoBuff } from "modules/Battle/Function/MonsterBuff";
import { SkillColliderEvent, SkillFunc } from "modules/Battle/Function/SkillFunc";
import { SkillRange } from "modules/Battle/Function/SkillRange";
import { SkillShoot } from "modules/Battle/Function/SkillShoot";
import { MonsterObj } from "modules/Battle/Object/MonsterObj";
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from "modules/Battle/Control/HeroControl";
import { HeroSkillId } from "modules/Battle/HeroSkillId";
import { ResPath } from "utils/ResPath";
import { MathHelper } from "../../../../helpers/MathHelper";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";


enum LaBiRes {
    Normal = "labi_1",
    Hit = "labi_hit_1",
    BigFire = "labi_2",
    PenHuo = "labi_penhuo",
}

export class LaBiControl extends HeroControl {

    protected attackRange: HeroAttackRange = new HeroAttackRange(0.2,20);
    private angleNum = 0;
    private penhuoCount = 0;
    protected skillFuncRes = {
        [LaBiRes.Normal] : SkillFuncResInit.Create(),
        [LaBiRes.Hit] : SkillFuncResUnlock.Create(HeroSkillId.Labi.HitBaoZha),
        [LaBiRes.BigFire] : SkillFuncResUnlock.Create(HeroSkillId.Labi.BigFire),
        [LaBiRes.PenHuo] : SkillFuncResUnlock.Create(HeroSkillId.Labi.PenHuo),
    }

    private forBulletCount:number = 1;  //前方子弹数量
    
    Init(){
        this.RegisterSkillHandle(HeroSkillId.Labi.TowFire, this.SetForBulletCount.bind(this));
        this.RegisterSkillHandle(HeroSkillId.Labi.FireCount, this.SetForBulletCount.bind(this));

        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.Labi.ThreeFire,this.SkillThreeFireBefore.bind(this)); 
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.Labi.BigFire,this.SkillBigFireBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.Labi.PenHuo,this.SkillPenHuoBefore.bind(this));
    }

    SetForBulletCount(skill:CfgSkillData){
        if(skill.pram1 > this.forBulletCount){
            this.forBulletCount = skill.pram1;
        }
    }

    DefaultSkillAction(){
        let posX = this.node.worldPosition.x;
        let posY = this.node.worldPosition.y;
        let offX = -40 * (this.forBulletCount - 1) / 2
        for(let i = 0; i < this.forBulletCount; i++){
            let x = offX;
            offX += 40;
            this.CrateSkillFuncByName(LaBiRes.Normal, (skillFunc:SkillShoot)=>{
                skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
                skillFunc.hp = 1;
                skillFunc.node.setWorldPosition(posX + x,posY,0);
            });
        }
    }


    SkillThreeFireBefore(skill:CfgSkillData, event:SkillColliderEvent){
        this.CrateSkillFuncByName(LaBiRes.Normal, (skillFunc:SkillShoot)=>{
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum + 10);
            skillFunc.hp = 1;
        })
        this.CrateSkillFuncByName(LaBiRes.Normal, (skillFunc:SkillShoot)=>{
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum -10);
            skillFunc.hp = 1;
        })        
    }

    SkillBigFireBefore(skill:CfgSkillData, event:SkillColliderEvent){
        if(MathHelper.RandomResult(skill.pram1,100)){
            this.CrateSkillFuncByName(LaBiRes.BigFire, (skillFunc:SkillShoot)=>{
                skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
                skillFunc.hp = 99999999;
            });     
        }
    }

    SkillPenHuoBefore(skill:CfgSkillData, event:SkillColliderEvent){
        ++this.penhuoCount;
        if(this.penhuoCount < skill.pram1){
            return;
        }
        this.penhuoCount = 0;
        this.CrateHitSkillFuncByName(LaBiRes.PenHuo,this.hero.worldPosition,(event: SkillColliderEvent)=>{
                event.objs.forEach(hitMo=>{
                    event.skillFunc.SetExcludeObj(hitMo);
                    let att_value = this.getFinalAttackValue(hitMo,MathHelper.NumToPer(skill.pram2));
                    hitMo.DeductHp(this.hero, att_value);
                    this.addZhuoShaoToMonster(hitMo);
                });
            },(skillFunc:SkillFunc)=>{
                skillFunc.SetEulerAngle(this.angleNum);
                this.PlaySkill(skillFunc);
            }
        );
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        if(event.skillFunc.hp <= 0){
            this.StopSkill(event.skillFunc);
        }
        let atkVal = this.getFinalAttackValue(monster);
        monster.DeductHp(this.hero,atkVal);

		//击中100%添加灼烧BUFF
        this.addZhuoShaoToMonster(monster);

        //辣比的火球命中敌人后产生爆炸，对附近的敌人造成伤害
        if(BattleData.Inst().IsHasSkill(HeroSkillId.Labi.HitBaoZha,this.hero.tag)){
            this.CrateHitSkillFuncByName(LaBiRes.Hit,monster.worldPosition,
                this.BombHitEvent.bind(this) ,(skillFunc:SkillRange)=>{
                // skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
                // skillFunc.hp = 1;
                this.PlaySkill(skillFunc);
            });            
        }
        
        // SceneEffect.Inst().Play(SceneEffectConfig.LaBiBaoZha,null,event.skillFunc.playNode.worldPosition);
        AudioManager.Inst().Play(AudioTag.labi);
    }

    private addZhuoShaoToMonster(mon:MonsterObj){
        let zsBuffT = this.hero.attriCfg.firing_time;
        BattleData.Inst().HandleCountSkill(HeroSkillId.Labi.ZhuoShaoTime,(zsTCfg,zsTCount)=>{
            zsBuffT += zsTCfg.pram1 * zsTCount;
        },this.hero.tag);
        mon.AddBuff(ZuoShaoBuff.CreateData(
            this.hero,zsBuffT,MonterBuff.DefaultDamge(this.baseAttackValue)))
        
    }

    BombHitEvent(event: SkillColliderEvent){
        event.objs.forEach(hitMo=>{
            let att_value = this.getFinalAttackValue(hitMo);
            hitMo.DeductHp(this.hero, att_value);
            event.skillFunc.SetExcludeObj(hitMo);
        });
    }

    private getFinalAttackValue(monster: MonsterObj,finDamSc:number = 1): number {
        // let finDamSc = 1;
        //辣比攻击腐败状态下的敌人，伤害+<color=#DF7401>{0}</color>%
        if(BattleData.Inst().IsHasSkill(HeroSkillId.Labi.FuBaiDam,this.hero.tag)){
            if(monster.HasBuff(MonsterObjBuffType.FuBai)){
                let cfg = BattleData.Inst().GetSkillCfg(HeroSkillId.Labi.FuBaiDam);
                finDamSc += MathHelper.NumToPer(cfg.pram1);
            }
        }
        let val = super.CalculateAttackValue(0,finDamSc);
        return val;
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

}
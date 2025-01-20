import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent, SkillFunc } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { BattleEventType, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { CfgSkillData } from 'config/CfgEntry';
import { EventCtrl } from 'modules/common/EventCtrl';
import { HeroObj } from 'modules/Battle/Object/HeroObj';
import { BattleData } from 'modules/Battle/BattleData';
import { MathHelper } from '../../../../helpers/MathHelper';
import { SkillBulletTrack } from 'modules/Battle/Function/SkillBulletTrack';
import { SkillFuncLocker } from '../SkillFuncLocker';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { Vec3 } from 'cc';
import { SkillStraight } from 'modules/Battle/Function/SkillStraight';
enum DLHRes {
    Normal1 = "dalihua_1",
    Normal2 = "dalihua_2",
    Normal3 = "dalihua_3",
    FenLie1 = "dalihua_fenlie_1",
    FenLie2 = "dalihua_fenlie_2",
    FenLie3 = "dalihua_fenlie_3",
    Bomb = "dalihua_bomb",
    ShenYing = "dalihua_shenying",
}
export class DaLiHuaControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(0.3,20);
    private angleNum:number = 0;
    private  fenlieLocker : SkillFuncLocker = null;
    private atkAddCount = 0;
    private timeFLTimer = 0;
    // 技能资源
    protected skillFuncRes = {
        [DLHRes.Normal1] : SkillFuncResInit.Create([{stage:4,resName:DLHRes.Normal2},{stage:6,resName:DLHRes.Normal3}]),
        [DLHRes.FenLie1] : SkillFuncResUnlock.Create(HeroSkillId.DaLiHua.FenLie
            ,[{stage:4,resName:DLHRes.FenLie2},{stage:6,resName:DLHRes.FenLie3}]
            ),
        [DLHRes.Bomb] : SkillFuncResUnlock.Create(HeroSkillId.DaLiHua.AtkBomb),
        [DLHRes.ShenYing] : SkillFuncResUnlock.Create(HeroSkillId.DaLiHua.ShenYing),
    }

    Init(){
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.DaLiHua.AtkCount,this.SkillAtkCountBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.DaLiHua.TimeFenLie,this.SkillTimeFenLieBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.DaLiHua.ShenYing,this.SkillShenYingBefore.bind(this));
        this.fenlieLocker = new SkillFuncLocker((bullet,initSearch)=>{
            if(initSearch){
                return BattleDynamicHelper.FindRandomMonster(null, this.hero.tag);
            }
            else{
                return BattleDynamicHelper.FindClosestMonster(bullet.node.worldPosition, null, this.hero.tag);
            }        
        });
    }

    Run(dt: number){
        super.Run(dt);
        this.timeFLTimer += dt;
    }

    //每回合战斗开始回调
    OnFightStart(){
        this.atkAddCount = 0;
        this.timeFLTimer += 0;
    }

    
    //默认技能效果
    DefaultSkillAction(){
        this.sendNormalBullet(0);
        // this.sendFenLieBullet(this.hero.worldPosition);
    }

    SkillAtkCountBefore(skill:CfgSkillData, event:SkillColliderEvent){
        let off = 20;
        this.sendNormalBullet(off);
        this.sendNormalBullet(-off);
    }

    SkillTimeFenLieBefore(skill:CfgSkillData, event:SkillColliderEvent){
        if(this.timeFLTimer >= skill.pram1){
            this.timeFLTimer = 0;
            let flNum = skill.pram2;
            for(let i=0;i != flNum;++i){
                this.sendFenLieBullet(this.hero.worldPosition);
            }
        }
    }

    SkillShenYingBefore(skill:CfgSkillData, event:SkillColliderEvent){
        if(!MathHelper.RndRetPercent(skill.pram1)){
            return;
        }
        this.CrateHitSkillFuncByName(DLHRes.ShenYing,this.hero.worldPosition, 
            (event: SkillColliderEvent)=>{
                event.objs.forEach(hitMo=>{
                    this.doDamge(hitMo,MathHelper.NumToPer(skill.pram2));
                    event.skillFunc.SetExcludeObj(hitMo);
                });
            },
            (skillFunc:SkillStraight)=>{
                skillFunc.SetEulerAngle(this.angleNum);
                this.PlaySkill(skillFunc);
        });          
    }

    private sendNormalBullet(offX : number){
        let posBase = this.hero.worldPosition;
        this.CrateSkillFuncByName(DLHRes.Normal1, (skillFunc:SkillFunc)=>{
            skillFunc.SetEulerAngle(this.angleNum);
            skillFunc.node.setWorldPosition(posBase.x + offX ,posBase.y,0);
        }) 
    }

    private sendFenLieBullet(pos:Vec3){
        this.CrateHitSkillFuncByName(DLHRes.FenLie1,pos, 
            this.FenLieHitEvent.bind(this),(skillFunc:SkillBulletTrack)=>{
            let initAngle = MathHelper.GetRandomNum(0,360);
            skillFunc.SetEulerAngle(initAngle);
            this.fenlieLocker.BeginLock(skillFunc);
            this.PlaySkill(skillFunc);
        });   
    }

    private playHitBomb(pos:Vec3){
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.DaLiHua.AtkBomb, this.hero.tag)){
            return;
        }
        this.CrateHitSkillFuncByName(DLHRes.Bomb,pos,
            (event)=>{
                event.objs.forEach(hitMo=>{
                    this.doDamge(hitMo);
                    event.skillFunc.SetExcludeObj(hitMo);
                });
            }
            ,(skillFunc:SkillFunc)=>{
                this.PlaySkill(skillFunc);
        }); 
    }
    
    FenLieHitEvent(event: SkillColliderEvent){
        //击中锁定怪，造成伤害
        let hitMon = this.fenlieLocker.OnHitEvent(event);
        if(!hitMon){
            return;
        }
        this.fenlieLocker.EndLock(event.skillFunc);
        this.doDamge(hitMon);
        this.playHitBomb(event.skillFunc.node.worldPosition);
        this.StopSkill(event.skillFunc);
    }

    OnKillMonster(monster:MonsterObj){
        // if(hero != this.hero){return;}
        //击杀敌人后播放分裂箭
        if(BattleData.Inst().IsHasSkill(HeroSkillId.DaLiHua.FenLie, this.hero.tag)){
            let flCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.DaLiHua.FenLie);
            let rate = flCfg.pram1;
            if(BattleData.Inst().IsHasSkill(HeroSkillId.DaLiHua.FenLieRate, this.hero.tag)){
                let flRateCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.DaLiHua.FenLieRate);
                rate += (flRateCfg.pram1 * this.GetSkillCount(flRateCfg));
            }
            if(MathHelper.RandomResult(rate,100)){
                let flNum = flCfg.pram2;
                if(BattleData.Inst().IsHasSkill(HeroSkillId.DaLiHua.FenLieCount, this.hero.tag)){
                    let flCountCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.DaLiHua.FenLieCount);
                    flNum += flCountCfg.pram1;
                }
                for(let i=0;i != flNum;++i){
                    this.sendFenLieBullet(monster.centerWorldPos);
                }
            }
        }
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        event.objs.forEach(hitMo=>{
            this.doDamge(hitMo);
            this.playHitBomb(event.skillFunc.node.worldPosition);
            event.skillFunc.SetExcludeObj(hitMo);
        });
        // this.StopSkill(event.skillFunc);

        AudioManager.Inst().Play(AudioTag.dalihua);
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

    //damScale用于调试
    private doDamge(monster:MonsterObj,damScale:number = 1){
        let atkAddPer = 0;
        BattleData.Inst().HandleSkill(HeroSkillId.DaLiHua.AddAtk,(addatkCfg)=>{
            let atkAdd = 0;
            let addAtk2Cfg = this.GetHasSkill(HeroSkillId.DaLiHua.AddAtk2);
            if(addAtk2Cfg){
                atkAdd = MathHelper.NumToPer(addAtk2Cfg.pram1);
            }
            else{
                atkAdd = MathHelper.NumToPer(addatkCfg.pram2);
            }
            atkAddPer = Math.floor(this.atkAddCount / addatkCfg.pram1) * atkAdd;
        }, this.hero.tag);
        let att_value = this.CalculateAttackValue(atkAddPer,damScale);
        //因为怪物扣血函数执行后会直接死亡，清空buff，所以需要在扣血之前去判断一下buff
        let preAddAtk = false;
        if(att_value >= monster.hp &&
            BattleData.Inst().IsHasSkill(HeroSkillId.DaLiHua.AddAtk, this.hero.tag) && 
            monster.HasBuff(MonsterObjBuffType.KonJu)){
            preAddAtk = true;
        }
        monster.DeductHp(this.hero, att_value);
        if(monster.hp <= 0){
            this.OnKillMonster(monster);
            if(preAddAtk){
                //战斗开始时，暗精灵每击杀一个恐惧下的敌人，其攻击力增加50%，直至本次战斗结束
                // if(BattleData.Inst().IsHasSkill(HeroSkillId.DaLiHua.AddAtk) && 
                // monster.HasBuff(MonsterObjBuffType.KonJu)){
                    this.atkAddCount += 1;
                // }
            }
        }
    }

    onDestroy(){
        super.onDestroy();
        if(this.fenlieLocker){
            this.fenlieLocker.Destroy();
            this.fenlieLocker = null;
        }
    }
}


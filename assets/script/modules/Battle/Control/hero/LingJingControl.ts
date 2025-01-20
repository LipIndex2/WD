import { _decorator, Node, Vec3 } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { SkillStraight } from 'modules/Battle/Function/SkillStraight';
import { MathHelper } from '../../../../helpers/MathHelper';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { SkillFuncLocker } from '../SkillFuncLocker';
import { CfgSkillData } from 'config/CfgEntry';
import { BattleData } from 'modules/Battle/BattleData';
import { SkillBulletTrack } from 'modules/Battle/Function/SkillBulletTrack';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { RuoHuaSuBuff, XuanYunBuff } from 'modules/Battle/Function/MonsterBuff';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
enum LingJingRes {
    Normal1 = "lingjing_1",
    FeiDan = "lingjing_feidan",
    FeiDanBomb = "lingjing_fdbomb",
    Ray = "lingjing_ray",
    GuangJian = "lingjing_guangjian",
}
export class LingJingControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(5,5);
    private _feidanLocker : SkillFuncLocker = null;
    private rayAtkCount = 0;
    private angleNum:number = 0;
    private static feidanCount = 0;
    
    private get feidanLocker(){
        if(this._feidanLocker == null){
            this._feidanLocker = new SkillFuncLocker((bullet,initSearch)=>{
                if(initSearch){
                    return BattleDynamicHelper.FindRandomMonster(null, this.hero.tag);
                }
                else{
                    return BattleDynamicHelper.FindClosestMonster(bullet.node.worldPosition, null, this.hero.tag);
                }        
            });
        }
        return this._feidanLocker;
    }

    // 技能资源
    protected skillFuncRes = {
        [LingJingRes.Normal1] : SkillFuncResInit.Create(),
        [LingJingRes.FeiDan] : SkillFuncResUnlock.Create(HeroSkillId.LingJing.FeiDan),
        [LingJingRes.FeiDanBomb] : SkillFuncResUnlock.Create(HeroSkillId.LingJing.FeiDanBomb),
        [LingJingRes.Ray] : SkillFuncResUnlock.Create(HeroSkillId.LingJing.Ray),
        [LingJingRes.GuangJian] : SkillFuncResUnlock.Create(HeroSkillId.LingJing.GuangJian),
    }

    Init(){
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.LingJing.FeiDan,this.SkillFeiDanBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.LingJing.Ray,this.SkillRayBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.LingJing.GuangJian,this.SkillGuangJianBefore.bind(this));
    }

    //每回合战斗开始回调
    OnFightStart(){
        LingJingControl.feidanCount = 0;
    }

    
    //默认技能效果
    DefaultSkillAction(){
        let mo = BattleDynamicHelper.FindClosestMonster(this.hero.worldPosition, null, this.hero.tag);
        if(mo == null){
            return;
        }
        this.CrateSkillFuncByName(LingJingRes.Normal1, (skillFunc:SkillStraight)=>{
            let angle = MathHelper.VecZEuler(mo.centerWorldPos.x - this.hero.worldPosition.x,
                mo.centerWorldPos.y - this.hero.worldPosition.y);
            skillFunc.SetEulerAngle(angle);
        });
        AudioManager.Inst().Play(AudioTag.lingJincao);
    }


    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        this.StopSkill(event.skillFunc);
        let attackValue = this._calculateAttackValue(monster);
        monster.DeductHp(this.hero, attackValue);
    }

    SkillFeiDanBefore(skill:CfgSkillData, event:SkillColliderEvent){
        let rate = skill.pram1;
        let fdRateCfg = this.GetHasSkill(HeroSkillId.LingJing.FeiDanRate);
        if(fdRateCfg){
            rate += fdRateCfg.pram1;
        }
        if(!MathHelper.RndRetPercent(rate)){
            return;
        }
        let fdCount = skill.pram2;
        BattleData.Inst().HandleCountSkill(HeroSkillId.LingJing.FeiDanCount,(fdCtCfg,count)=>{
            fdCount += (fdCtCfg.pram1 * count);
        },this.hero.tag);
        if(BattleData.Inst().IsHasSkill(HeroSkillId.LingJing.GuangJian,this.hero.tag)){
            LingJingControl.feidanCount += fdCount;
        }
        for(let i = 0;i != fdCount;++i){
            this.sendFeiDan(MathHelper.NumToPer(skill.pram3));
        }
    }

    SkillRayBefore(skill:CfgSkillData, event:SkillColliderEvent){
        ++this.rayAtkCount
        if(this.rayAtkCount < skill.pram1){
            return;
        }
        this.rayAtkCount = 0;
        this.CrateHitSkillFuncByName(LingJingRes.Ray,this.hero.worldPosition,
            this.rayHitEvent.bind(this,MathHelper.NumToPer(skill.pram2)),
            (rayFunc : SkillRange)=>{
                let mo = BattleDynamicHelper.FindRandomMonster(null, this.hero.tag);
                if(mo == null){
                    this.StopSkill(rayFunc);
                    return;
                }
                let angle = MathHelper.VecZEuler(mo.centerWorldPos.x - this.hero.worldPosition.x,
                    mo.centerWorldPos.y - this.hero.worldPosition.y); 
                rayFunc.SetEulerAngle(angle);
                // rayFunc.SetEulerAngle(-45);
                this.PlaySkill(rayFunc);
            }
        );
    }

    SkillGuangJianBefore(skill:CfgSkillData, event:SkillColliderEvent){
        if(LingJingControl.feidanCount < skill.pram1){
            return;
        }
        LingJingControl.feidanCount -= skill.pram1;
        let worldCenter = this.scene.node.worldPosition;
        let startPos = new Vec3(worldCenter.x,-500,0);
        let damHero = this.scene.GetMaxStageHero(this.hero.data.hero_id);
        if(!damHero){
            return;
        }
        let damHeroCtrl = damHero.heroCtrl;
        if(!damHeroCtrl){
            return;
        }
        if(damHeroCtrl instanceof LingJingControl){
                this.CrateHitSkillFuncByName(LingJingRes.GuangJian,startPos, (event: SkillColliderEvent)=>{
                    event.objs.forEach(hitMo=>{
                        if(damHeroCtrl instanceof LingJingControl){
                            let att_value = damHeroCtrl._calculateAttackValue(hitMo,MathHelper.NumToPer(skill.pram2));
                            hitMo.DeductHp(damHero, att_value);
                            event.skillFunc.SetExcludeObj(hitMo);
                        }
                    });
                },
                (gj:SkillStraight)=>{
                    gj.SetEulerAngle(0);
                    gj.node.worldPosition = startPos;
                    this.PlaySkill(gj);
                }
            );
        }

}

    private sendFeiDan(damScale:number){
        this.CrateHitSkillFuncByName(LingJingRes.FeiDan,this.hero.worldPosition, 
            this.feiDanHitEvent.bind(this,damScale),(skillFunc:SkillBulletTrack)=>{
            let initAngle = MathHelper.GetRandomNum(0,360);
            skillFunc.SetEulerAngle(initAngle);
            this.feidanLocker.BeginLock(skillFunc);
            this.PlaySkill(skillFunc);
        });
    }

    feiDanHitEvent(damScale: number,event: SkillColliderEvent){
        //击中锁定怪，导弹爆炸
        let hitMon = this.feidanLocker.OnHitEvent(event);
        if(!hitMon){
            return;
        }
        this.feidanLocker.EndLock(event.skillFunc);
        this.StopSkill(event.skillFunc);
        let attackValue = this._calculateAttackValue(hitMon,damScale);
        hitMon.DeductHp(this.hero,attackValue);
        BattleData.Inst().HandleSkill(HeroSkillId.LingJing.FeiDanBomb,(fdBombCfg)=>{
            this.CrateHitSkillFuncByName(LingJingRes.FeiDanBomb,event.skillFunc.node.worldPosition,
                this.feiDanBombHitEvent.bind(this,MathHelper.NumToPer(fdBombCfg.pram1)),
                (skillFunc:SkillRange)=>{
                    // AudioManager.Inst().Play(AudioTag.GongChengShiBomb);
                    this.PlaySkill(skillFunc);
                });
        }, this.hero.tag);

    }
    
    feiDanBombHitEvent(damScale: number,event: SkillColliderEvent){
        let damScAdd = 0;
        let fdbDamCfg = this.GetHasSkill(HeroSkillId.LingJing.FeiDanBombDam);
        if(fdbDamCfg){
            damScAdd += MathHelper.NumToPer(fdbDamCfg.pram1);
        }
        event.objs.forEach(hitMo=>{
            let att_value = this._calculateAttackValue(hitMo,damScale + damScAdd);
            hitMo.DeductHp(this.hero, att_value);
            if(fdbDamCfg){
                hitMo.AddBuff(XuanYunBuff.CreateData(this.hero,fdbDamCfg.pram2));
            }
            event.skillFunc.SetExcludeObj(hitMo);
            BattleData.Inst().HandleSkill(HeroSkillId.LingJing.BombRuoHua,(brhCfg)=>{
                if(!MathHelper.RndRetPercent(brhCfg.pram1)){
                    return;
                }
                hitMo.AddBuff(RuoHuaSuBuff.CreateData(this.hero))
            });
        }, this.hero.tag);
    }

    rayHitEvent(damScale: number,event: SkillColliderEvent){
        event.objs.forEach(hitMo=>{
            let att_value = this._calculateAttackValue(hitMo,damScale);
            hitMo.DeductHp(this.hero, att_value);
            event.skillFunc.SetExcludeObj(hitMo);            
        });
    }

    private _calculateAttackValue(mon:MonsterObj, damScale:number = 1): number {
        BattleData.Inst().HandleSkill(HeroSkillId.LingJing.ZhongDuDam,(zdDamCfg)=>{
            if(mon.HasBuff(MonsterObjBuffType.ZhongDu)){
                damScale += MathHelper.NumToPer(zdDamCfg.pram1);
            }
        }, this.hero.tag);
        return this.CalculateAttackValue(0,damScale);
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

    onDestroy(){
        super.onDestroy();
        if(this._feidanLocker){
            this._feidanLocker.Destroy();
            this._feidanLocker = null;
        }
    }
}


import { _decorator, Node, DebugMode, Vec3 } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { MathHelper } from '../../../../helpers/MathHelper';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { ChanRaoBuff, JiTuiBuff, MonterBuff, ZhongDuBuff } from 'modules/Battle/Function/MonsterBuff';
import { BattleData } from 'modules/Battle/BattleData';
import { TimeHelper } from '../../../../helpers/TimeHelper';
import { Timer } from 'modules/time/Timer';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { FIGHT_CELL_WIDTH } from 'modules/Battle/BattleConfig';

enum MuBeiRes {
    Normal1 = "mubei_normal1",
    Normal2 = "mubei_normal2",
    Normal3 = "mubei_normal3",
}
export class MuBeiControl extends HeroControl {

    private static get MAX_DIS_DAM_ADD(){
        return 8 * FIGHT_CELL_WIDTH;//n格的距离
    } 
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(5,5);
    private delayAtkTimer : any = null;;
    private delayAtkTimer2 : any = null;;

    // 技能资源
    protected skillFuncRes = {
        [MuBeiRes.Normal1] : SkillFuncResInit.Create([{stage:3,resName:MuBeiRes.Normal2},{stage:5,resName:MuBeiRes.Normal3}]),
        // [WoGuaRes.JiaDa] : SkillFuncResUnlock.Create(HeroSkillId.WoGua.JianTaFanWei),
    }

    Init(){
        
    }

    //每回合战斗开始回调
    OnFightStart(){
        
    }

    
    //默认技能效果
    DefaultSkillAction(){
        this.doNormalAtk();
        let atk2 = this.GetHasSkill(HeroSkillId.MuBei.DoubleAtk2);
        if(BattleData.Inst().IsHasSkill(HeroSkillId.MuBei.DoubleAtk,this.hero.tag) || atk2){
            this.cancelTimer();
            this.cancelTimer2();
            this.delayAtkTimer = Timer.Inst().AddRunTimer(()=>{
                this.cancelTimer();
                this.doNormalAtk();
            },0.1,1,false);
            if(atk2){
                this.delayAtkTimer2 = Timer.Inst().AddRunTimer(()=>{
                    this.cancelTimer2();
                    this.doNormalAtk();
                },0.2,1,false);            
            }
        }
    }

    private cancelTimer(){
        if(this.delayAtkTimer){
            Timer.Inst().CancelTimer(this.delayAtkTimer);
            this.delayAtkTimer = null;
        }
    }

    private cancelTimer2(){
        if(this.delayAtkTimer2){
            Timer.Inst().CancelTimer(this.delayAtkTimer2);
            this.delayAtkTimer2 = null;
        }    
    }

    private doNormalAtk(){
        this.CrateHitSkillFuncByName(MuBeiRes.Normal1,this.hero.worldPosition,this.OnHitEvent.bind(this),(skillFunc)=>{
            let angle = 0;
            let dirMonster = BattleDynamicHelper.FindClosestMonster(this.hero.worldPosition, null, this.hero.tag);
            if(dirMonster != null){
                let dirMonCenP = dirMonster.centerWorldPos;
                angle = MathHelper.VecZEuler(dirMonCenP.x - this.hero.worldPosition.x,
                    dirMonCenP.y - this.hero.worldPosition.y);
            }
            skillFunc.SetEulerAngle(angle);
            //攻击穿透
            if(BattleData.Inst().IsHasSkill(HeroSkillId.MuBei.ThroughAtk,this.hero.tag)){
                skillFunc.hp = 999999;
            }
            else{
                skillFunc.hp = 1;
            }
            this.PlaySkill(skillFunc);
            (<any>skillFunc)["_jituiCount"] = 0;
        });
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        if(event.skillFunc.hp <= 0){
            this.StopSkill(event.skillFunc);
        }
        let damSc = 1;
        BattleData.Inst().HandleSkill(HeroSkillId.MuBei.DisDamage,(cfg)=>{
            let maxScAdd = MathHelper.NumToPer(cfg.pram1) - 1;
            let dis = Vec3.distance(monster.centerWorldPos,this.hero.worldPosition);
            let disDamPer =  dis/MuBeiControl.MAX_DIS_DAM_ADD;
            disDamPer = disDamPer>1 ? 1 : disDamPer;
            damSc += (maxScAdd * disDamPer);
        }, this.hero.tag)
        
        let atkVal = this.CalculateAttackValue();
        monster.DeductHp(this.hero, atkVal * damSc);

        //攻击使敌人中毒
        monster.AddBuff(ZhongDuBuff.CreateData(
            this.hero,this.hero.attriCfg.methysis_time,MonterBuff.DefaultDamge(atkVal)))

        //缠绕判断
        if(BattleData.Inst().IsHasSkill(HeroSkillId.MuBei.ChanRao,this.hero.tag)){
            let chanraoSkillCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.MuBei.ChanRao);
            let rate = chanraoSkillCfg.pram1;
            if(BattleData.Inst().IsHasSkill(HeroSkillId.MuBei.ChanRaoRate,this.hero.tag)){
                let xuanyunRateCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.MuBei.ChanRaoRate);
                let xuanyunRateCount = this.GetSkillCount(xuanyunRateCfg);
                rate += (xuanyunRateCount * xuanyunRateCfg.pram1);
            }
            if(MathHelper.RandomResult(rate,100)){
                let chanraoBuffData = ChanRaoBuff.CreateData(this.hero,chanraoSkillCfg.pram2);
                //墓碑破坏者使<color=#036b16>{0}</color>个敌人被缠绕时，以其为中心，周围{1}格的敌人都被缠绕
                if(BattleData.Inst().IsHasSkill(HeroSkillId.MuBei.ChanRaoInfect,this.hero.tag))
                {   
                    let infectCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.MuBei.ChanRaoInfect);
                    let round = infectCfg.pram1;
                    //墓碑破坏者触发群体缠绕的范围+<color=#036b16>{0}</color>%
                    if(BattleData.Inst().IsHasSkill(HeroSkillId.MuBei.ChanRaoRange,this.hero.tag))
                    {
                        let chanraoRangeCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.MuBei.ChanRaoRange);
                        let chanraoRangeCount = this.GetSkillCount(chanraoRangeCfg);
                        round += (chanraoRangeCfg.pram1 * chanraoRangeCount / 100);
                    }
                    let mons =this.GetRoundMonsters(round,monster.centerWorldPos);
                    mons.forEach((mo)=>{
                        mo.AddBuff(chanraoBuffData);
                    })
                }
                else{
                    monster.AddBuff(chanraoBuffData);
                }
            }
        }
        //墓碑破坏者每次攻击有{0}%的几率使被攻击的敌人被击退一格，每次攻击最多击退{1}个敌人
        BattleData.Inst().HandleSkill(HeroSkillId.MuBei.JiTui,(cfg)=>{
            if(!MathHelper.RndRetPercent(cfg.pram1)){
                return;
            }
            let jtNum = (<any>event.skillFunc)["_jituiCount"];
            if(!jtNum){jtNum = 0;}
            if(jtNum >= cfg.pram2){return;}
            (<any>event.skillFunc)["_jituiCount"] = jtNum + 1;
            monster.AddBuff(JiTuiBuff.CreateData(this.hero));
        }, this.hero.tag);

        AudioManager.Inst().Play(AudioTag.mubei);
    }

    onDestroy(){
        super.onDestroy();
        this.cancelTimer();
        this.cancelTimer2();
    }
}


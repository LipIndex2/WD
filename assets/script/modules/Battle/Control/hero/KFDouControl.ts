import { _decorator, Node, error } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { HeroObjBuffType, MonsterObjBuffType, ZHONG_JI_SCALE } from 'modules/Battle/BattleConfig';
import { BattleData } from 'modules/Battle/BattleData';
import { H_ShiXueBuff, H_SleepBuff } from 'modules/Battle/Function/HeroBuff';
import { BattleHarmShowIconType } from 'modules/Battle/BattleView';
import { MathHelper } from '../../../../helpers/MathHelper';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { JinGuBuff } from 'modules/Battle/Function/MonsterBuff';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { SkillFuncLocker } from '../SkillFuncLocker';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
enum KFDouRes {
    Normal1 = "kfdou_normal1",
    Normal2 = "kfdou_normal2",
    Jian = "kfdou_jian",
    JianTrack = "kfdou_jian_track",
    // JiaDa = "wogua_2",
}
export class KFDouControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);
    private atkTimer = 0;//记录咖啡豆醒着的时间
    private jianAtkTimer = 0;
    private killCount = 0;
    // private angleNum = 0;
    private addedShiXue = false;
    private _trackLocker : SkillFuncLocker = null;

    private get trackLocker(){
        if(this._trackLocker == null){
            this._trackLocker = new SkillFuncLocker((bullet,initSearch)=>{
                if(initSearch){
                    return BattleDynamicHelper.FindRandomMonster(null, this.hero.tag);
                }
                else{
                    return BattleDynamicHelper.FindClosestMonster(bullet.node.worldPosition, null, this.hero.tag);
                }        
            });
        }
        return this._trackLocker;
    }
    // 技能资源
    protected skillFuncRes = {
        [KFDouRes.Normal1] : SkillFuncResInit.Create([{stage:4, resName:KFDouRes.Normal2}]),
        [KFDouRes.Jian] : SkillFuncResUnlock.Create(HeroSkillId.KFDou.Sword),
        [KFDouRes.JianTrack] : SkillFuncResUnlock.Create(HeroSkillId.KFDou.TrackSword),
    }

    Init(){
        
    }

    //每回合战斗开始回调
    OnFightStart(){
        this.atkTimer = 0;
        this.jianAtkTimer = 0;
        this.killCount = 0;
        this.addedShiXue = false;
    }

    Run(dt: number){
        super.Run(dt);
        // if(!this.IsMosnterEnter){
        //     return;
        // }
        if(BattleData.Inst().IsHasSkill(HeroSkillId.KFDou.Sleep,this.hero.tag)){
            // console.error(`ExeAtkTimer======${this.atkTimer}`)
            this.atkTimer += dt;
            let sleepCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.KFDou.Sleep);
            if(this.atkTimer >= sleepCfg.pram2 && this.IsCanBattle()){    //睡着了
                let tBac = this.atkTimer;
                this.atkTimer = 0;
                let sleepT = sleepCfg.pram3;
                if(BattleData.Inst().IsHasSkill(HeroSkillId.KFDou.SleepTime)){
                    let sleepTCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.KFDou.SleepTime);
                    sleepT -= (sleepTCfg.pram1 * this.GetSkillCount(sleepTCfg));
                }
                if(sleepT > 0){
                    // console.error(`AddSleep=AtkT=${tBac},${sleepT}`);
                    this.hero.AddBuff(H_SleepBuff.CrateData(sleepT));
                }
            }
        }
        if(BattleData.Inst().IsHasSkill(HeroSkillId.KFDou.Sword,this.hero.tag)){
            this.jianAtkTimer += dt;
            let swordCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.KFDou.Sword);
            if(this.jianAtkTimer >= swordCfg.pram1){
                this.jianAtkTimer = 0;
                let isTrack = BattleData.Inst().IsHasSkill(HeroSkillId.KFDou.TrackSword,this.hero.tag);
                for(let i = 0;i != swordCfg.pram2; ++i){
                    this.CrateHitSkillFuncByName(isTrack ? KFDouRes.JianTrack: KFDouRes.Jian,this.hero.worldPosition,
                        this.jianOnHitEvent.bind(this,isTrack),
                        (skillFunc)=>{
                            let rot =// isTrack ? 
                                MathHelper.GetRandomNum(0,360);
                            //  : MathHelper.GetRandomNum(this.angleNum-90,this.angleNum+90);
                            skillFunc.SetEulerAngle(rot);
                            if(isTrack){
                                this.trackLocker.BeginLock(skillFunc);
                            }
                            this.PlaySkill(skillFunc);
                        }
                    );
                }
                
            }
        }
    }

    private jianOnHitEvent(isTrack:boolean,event : SkillColliderEvent){
        let monster :MonsterObj = null;
        if(isTrack){
            monster = this.trackLocker.OnHitEvent(event);
            if(!monster){return;}
            this.trackLocker.EndLock(event.skillFunc);
        }
        else{
            monster = event.GetFirstHitObj();
        }
        let swordCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.KFDou.Sword);
        
        event.skillFunc.SetExcludeObj(monster);

        this.StopSkill(event.skillFunc);
        let jgTime = swordCfg.pram4;
        BattleData.Inst().HandleCountSkill(HeroSkillId.KFDou.JinGuTime,(jgTCfg,jgTCount)=>{
            jgTime += jgTCfg.pram1 * jgTCount;
        },this.hero.tag);
        monster.AddBuff(JinGuBuff.CrateData(this.hero,jgTime)); //定身
        let cr = this.critRate();
        this.doDamage(monster,cr,swordCfg.pram3/100);
    }

    
    //默认技能效果
    DefaultSkillAction(){
        this.CrateSkillFuncByName(KFDouRes.Normal1);
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let critRate = this.critRate();
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                event.SetExcludeObj(monster);
                this.doDamage(monster,critRate,1);
            })

            AudioManager.Inst().PlaySceneAudio(AudioTag.kafeidou);
        }
    }

    private critRate(){
        let critRate = 0;
        if(BattleData.Inst().IsHasSkill(HeroSkillId.KFDou.Critical,this.hero.tag)){
            let critCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.KFDou.Critical);
            critRate = critCfg.pram1;
            if(BattleData.Inst().IsHasSkill(HeroSkillId.KFDou.CriticalRate,this.hero.tag)){
                let critRateCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.KFDou.CriticalRate);
                critRate += (critRateCfg.pram1 * this.GetSkillCount(critRateCfg));
            }
        }
        return critRate;
    }

    private doDamage(monster:MonsterObj,critRate:number,atkValScale:number){
        let att_value = this.CalculateAttackValue(0,atkValScale);
        let iconType : BattleHarmShowIconType = null;
        if(critRate > 0 && 
            (monster.HasBuff(MonsterObjBuffType.LiuXue) || monster.HasBuff(MonsterObjBuffType.FuBai)) &&
            MathHelper.RndRetPercent(critRate)){
            iconType = BattleHarmShowIconType.zhongji;
            let critPer = ZHONG_JI_SCALE;
            let critDamCfg = this.GetHasSkill(HeroSkillId.KFDou.CriticalDam);
            if(critDamCfg){
                critPer += MathHelper.NumToPer(critDamCfg.pram1);
            }
            att_value *= critPer;
        }
        monster.DeductHp(this.hero, att_value,iconType);
        if(monster.IsDied() && this.addedShiXue == false &&  
            BattleData.Inst().IsHasSkill(HeroSkillId.KFDou.ShiXue,this.hero.tag)){
            ++this.killCount;
            let shixueCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.KFDou.ShiXue);
            if(this.killCount >= shixueCfg.pram1){
                this.addedShiXue = true;
                this.hero.AddBuff(H_ShiXueBuff.CrateData(Number.MAX_VALUE,shixueCfg.pram2/100));
            }
        }
    }

    // protected OnMonsterEnter(monster:MonsterObj){
    //     this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    // }

    onDestroy(){
        super.onDestroy();
        if(this._trackLocker){
            this._trackLocker.Destroy();
            this._trackLocker = null;
        }    
    }
}


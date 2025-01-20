import { _decorator, Node } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { HeroObj } from 'modules/Battle/Object/HeroObj';
import { BattleEventType, HeroObjBuffType, IHeroObjBuffData, MonsterObjBuffType } from 'modules/Battle/BattleConfig';
import { BattleScene } from 'modules/Battle/BattleScene';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleData } from 'modules/Battle/BattleData';
import { MathHelper } from '../../../../helpers/MathHelper';
import { H_HuoJuBuff } from 'modules/Battle/Function/HeroBuff';
import { HeroSkillChangeListener } from '../HeroSkillChangeListener';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { HuoJuJianSuBuff, MonterBuff, YiShangBuff } from 'modules/Battle/Function/MonsterBuff';
import { EventCtrl } from 'modules/common/EventCtrl';

enum HuoJuRes {
    DamAddRow = "huoju_damadd_1",
    DamAddCol = "huoju_damadd_2",
    DamAddRect = "huoju_damadd_3",
    YiShang = "huoju_yishang",
    // Normal = "wogua_1",
    // JiaDa = "wogua_2",
}

// interface MonsterDamAddData {
//     inRow :boolean;
//     inCol :boolean;
//     inRect:boolean;
// }
export class HuoJuControl extends HeroControl {
    static huojuNum = 0;
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(20,20);

    private heroBuffData : Map<HeroObj,IHeroObjBuffData> = new Map();

    private skillListener = new HeroSkillChangeListener();

    private damageAddScopeFuncRow : SkillRange = null;

    private damageAddScopeFuncCol : SkillRange = null;

    private damageAddScopeFuncRect : SkillRange = null;

    private damAddMonsters : Map<MonsterObj,{[key:string] : boolean}> = new Map();

    private yishangBuffFunc : SkillRange = null;

    private hitExcludeMons : MonsterObj[] = null;


    // 技能资源
    protected skillFuncRes = {
        // [HuoJuRes.DamAddRow] : SkillFuncResUnlock.Create(HeroSkillId.HuoJu.DamAdd),
        // [HuoJuRes.DamAddCol] : SkillFuncResUnlock.Create(HeroSkillId.HuoJu.DamAdd),
        // [HuoJuRes.DamAddRect] : SkillFuncResUnlock.Create(HeroSkillId.HuoJu.DamAdd),
        // [HuoJuRes.YiShang] : SkillFuncResUnlock.Create(HeroSkillId.HuoJu.YiShangBuff),
        [HuoJuRes.DamAddRow] : SkillFuncResInit.Create(),
        [HuoJuRes.DamAddCol] : SkillFuncResInit.Create(),
        [HuoJuRes.DamAddRect] : SkillFuncResInit.Create(),
        [HuoJuRes.YiShang] : SkillFuncResInit.Create(),
    }

    Init(){
        this.skillListener.AddLinsten(HeroSkillId.HuoJu.BuffScope,this.onBuffScopeSkillChange.bind(this));
        let flushBuffAttri = this.onBuffAttriSkillChange.bind(this);
        this.skillListener.tag = this.hero.tag;
        this.skillListener.AddLinsten(HeroSkillId.HuoJu.BuffAtk,flushBuffAttri);
        this.skillListener.AddLinsten(HeroSkillId.HuoJu.BuffSpeed,flushBuffAttri);
        this.skillListener.AddLinsten(HeroSkillId.HuoJu.BuffPower,flushBuffAttri);
        this.skillListener.AddLinsten(HeroSkillId.HuoJu.BuffPower2,flushBuffAttri);
        this.skillListener.AddLinsten(HeroSkillId.HuoJu.NumGain,flushBuffAttri);
        this.skillListener.AddLinsten(HeroSkillId.HuoJu.DamAdd,this.onDamAddSkillChange.bind(this));
        this.skillListener.AddLinsten(HeroSkillId.HuoJu.SpeedDown,this.onSpeedDownSkillChange.bind(this));
        this.skillListener.AddLinsten(HeroSkillId.HuoJu.YiShangBuff,this.addYiShangBuffFunc.bind(this));

        EventCtrl.Inst().on(BattleEventType.MonsterDie, this.OnMonsterDie, this);
    }

    //每回合战斗开始回调
    OnFightStart(){
        this.flushHeroBuffState();
        HuoJuControl.huojuNum = 0;
        this.flushDamAddSkillFunc();
    }

    protected OnMonsterEnter(monster:MonsterObj){
        if(this.yishangBuffFunc != null){
            return;
        }
        if(BattleData.Inst().IsHasSkill(HeroSkillId.HuoJu.YiShangBuff,this.hero.tag)){
            this.addYiShangBuffFunc();
        }
    }

    private addYiShangBuffFunc(){        
        if(this.yishangBuffFunc != null){
            return;
        }
        this.CrateHitSkillFuncByName(HuoJuRes.YiShang,this.hero.worldPosition,this.OnHitEvent.bind(this),(skill:SkillRange)=>{
            this.yishangBuffFunc = skill;
            this.PlaySkill(skill);
        },this.scene.BottomEffectRoot);
    }

    private flushDamAddSkillFunc(){
        this.damAddMonsters.forEach((data,mon)=>{
            this.applySkillDamAdd(mon,true);
            this.applySkillSpeedDown(mon,true);
        });    
        this.damAddMonsters.clear();
        if(this.damageAddScopeFuncRow != null){
            this.StopSkill(this.damageAddScopeFuncRow);
            this.damageAddScopeFuncRow = null;
        }
        if(this.damageAddScopeFuncCol != null){
            this.StopSkill(this.damageAddScopeFuncCol);
            this.damageAddScopeFuncCol = null;
        }        
        if(this.damageAddScopeFuncRect != null){
            this.StopSkill(this.damageAddScopeFuncRect);
            this.damageAddScopeFuncRect = null;
        }
        if(BattleData.Inst().IsHasSkill(HeroSkillId.HuoJu.DamAdd,this.hero.tag) || 
            BattleData.Inst().IsHasSkill(HeroSkillId.HuoJu.SpeedDown,this.hero.tag)){
            if(BattleData.Inst().IsHasSkill(HeroSkillId.HuoJu.BuffScope,this.hero.tag)){
                this.CrateHitSkillFuncByName(HuoJuRes.DamAddRect,this.hero.worldPosition,null,(skill:SkillRange)=>{
                    this.damageAddScopeFuncRect = skill;
                    this.damageAddScopeFuncRect.OnMonsterEnterRange = this.onDamAddFuncEnter.bind(this,"inRect");
                    this.damageAddScopeFuncRect.OnMonsterExitRange = this.onDamAddFuncExit.bind(this,"inRect");
                    this.PlaySkill(skill);
                });
            }
            else{
                this.CrateHitSkillFuncByName(HuoJuRes.DamAddRow,this.hero.worldPosition,null,(skill:SkillRange)=>{
                    this.damageAddScopeFuncRow = skill;
                    this.damageAddScopeFuncRow.OnMonsterEnterRange = this.onDamAddFuncEnter.bind(this,"inRow");
                    this.damageAddScopeFuncRow.OnMonsterExitRange = this.onDamAddFuncExit.bind(this,"inRow");
                    this.PlaySkill(skill);
                });
                this.CrateHitSkillFuncByName(HuoJuRes.DamAddCol,this.hero.worldPosition,null,(skill:SkillRange)=>{
                    this.damageAddScopeFuncCol = skill;
                    this.damageAddScopeFuncCol.OnMonsterEnterRange = this.onDamAddFuncEnter.bind(this,"inCol");
                    this.damageAddScopeFuncCol.OnMonsterExitRange = this.onDamAddFuncExit.bind(this,"inCol");
                    this.PlaySkill(skill);
                });
            }
        }    
    }

    onDamAddSkillChange(skillId:number,oldNum:number,newNum:number){
        if(this.damageAddScopeFuncCol || this.damageAddScopeFuncRow || this.damageAddScopeFuncRect){
            if(this.damAddMonsters != null){
                this.damAddMonsters.forEach((data,mon)=>{
                    this.applySkillDamAdd(mon,false,newNum-oldNum);
                });
            }        
        }
        else{
            this.flushDamAddSkillFunc();
        }
    }

    onSpeedDownSkillChange(skillId:number,oldNum:number,newNum:number){
        if(this.damageAddScopeFuncCol || this.damageAddScopeFuncRow || this.damageAddScopeFuncRect){
            if(this.damAddMonsters != null){
                this.damAddMonsters.forEach((data,mon)=>{
                    this.applySkillSpeedDown(mon,false);
                });
            }        
        }
        else{
            this.flushDamAddSkillFunc();
        }    
    }

    OnFightEnd(){
        this.damageAddScopeFuncRow = null;
        this.damageAddScopeFuncCol = null;
        this.damageAddScopeFuncRect = null;
        this.yishangBuffFunc = null;
        this.hitExcludeMons = null;
        this.heroBuffData.clear();
        BattleData.Inst().HandleSkill(HeroSkillId.HuoJu.HpRecover,(cfg)=>{
            ++HuoJuControl.huojuNum;
            if(HuoJuControl.huojuNum / cfg.pram1 >= 1){
                HuoJuControl.huojuNum = 0;
                this.battleInfo.AddHP(cfg.pram2);
            }
        }, this.hero.tag)

    }

    private onBuffScopeSkillChange(){
        this.flushHeroBuffState();
        this.flushDamAddSkillFunc();
    }

    private onBuffAttriSkillChange(){
        this.flushHeroBuffAttri();
    }

    private static outDamAddRange(data :{[key:string] : boolean}){
        return !data.inRect && !data.inCol && !data.inRow
    } 


    private onDamAddFuncEnter(funcKey: string,mons:MonsterObj[]){
        mons.forEach((mon)=>{
            if(this.damAddMonsters.has(mon)){
                this.damAddMonsters.get(mon)[funcKey] = true;
            }
            else{
                this.damAddMonsters.set(mon,{[funcKey]:true});
                this.applySkillDamAdd(mon,false);
                this.applySkillSpeedDown(mon,false);
            }
        });
    }

    private onDamAddFuncExit(funcKey: string,mons:MonsterObj[]){
        mons.forEach((mon)=>{
            if(!this.damAddMonsters.has(mon)){return;}
            let data = this.damAddMonsters.get(mon);
            data[funcKey] = false;
            if(HuoJuControl.outDamAddRange(data)){
                this.damAddMonsters.delete(mon);
                this.applySkillDamAdd(mon,true);
                this.applySkillSpeedDown(mon,true);
            }
        });        
    }

    private applySkillDamAdd(mon:MonsterObj,reverse:boolean,num:number = 0){
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.HuoJu.DamAdd,this.hero.tag)){
            return;
        }
        let cfg  = BattleData.Inst().GetSkillCfg(HeroSkillId.HuoJu.DamAdd);
        if(num == 0){
            num = this.GetSkillCount(cfg);
        }
        let valOff = (num * MathHelper.NumToPer(cfg.pram1)) * (reverse?-1:1);
        mon.damgeScale += valOff;
    }

    private applySkillSpeedDown(mon:MonsterObj,reverse:boolean){
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.HuoJu.SpeedDown,this.hero.tag)){
            return;
        }
        if(reverse){
            mon.RemoveBuffByHero(this.hero,MonsterObjBuffType.HuoJuJianSu);
        }
        else{
            let cfg = BattleData.Inst().GetSkillCfg(HeroSkillId.HuoJu.SpeedDown);
            let count = this.GetSkillCount(cfg);
            HuoJuJianSuBuff.FlushData(mon,this.hero,cfg.pram1 * count);
            // mon.AddBuff(HuoJuJianSuBuff.CreateData(this.hero,cfg.pram1 * count));
        }
    }
 
    //默认技能效果
    DefaultSkillAction(){
        this.hitExcludeMons = null
    }

    flushHeroBuffState(){
        let affectHeros = new Set<HeroObj>();
        let row = this.hero.i;
        let col = this.hero.j;
        let addHero = (i:number,j:number)=>{
            let he = this.getHero(i,j);
            if(he != null){
                affectHeros.add(he);
            }
        }
        addHero(row + 1,col);
        addHero(row - 1,col);
        addHero(row,col + 1);
        addHero(row,col - 1);
        if(BattleData.Inst().IsHasSkill(HeroSkillId.HuoJu.BuffScope,this.hero.tag)){
            addHero(row + 1,col + 1);
            addHero(row - 1,col - 1);
            addHero(row - 1,col + 1);
            addHero(row + 1,col - 1);            
        }
        //比较缓存删减添加对应英雄的buff
        this.heroBuffData.forEach((buffData,hero)=>{
            if(!affectHeros.has(hero)){
                hero.RemoveBuffByData(buffData);
                this.heroBuffData.delete(hero);
            }
        });
        affectHeros.forEach((hero)=>{
            if(!this.heroBuffData.has(hero)){
                let buffData = this.flushHeroBuffData()
                buffData.hero = hero;
                hero.AddBuff(buffData);
                this.heroBuffData.set(hero,buffData);
            }
            else{
                let buffData = this.heroBuffData.get(hero);
                this.flushHeroBuffData(buffData);
            }
        });
    }

    private flushHeroBuffAttri(){
        this.heroBuffData.forEach((buffData,hero)=>{
            this.flushHeroBuffData(buffData);
        })
    }

    private flushHeroBuffData(buffData : IHeroObjBuffData = null) : IHeroObjBuffData{
        let atkVal = this.hero.attriCfg.att * this.hero.data.coefficients;
        // let buffType = HeroObjBuffType.HuoJu;
        // let atkAdd = 1;
        let atkValAddPer = 1;
        let speedAdd = 0.33;
        BattleData.Inst().HandleSkill(HeroSkillId.HuoJu.BuffPower,(cfg)=>{
            // let attrAdd = 1;
            let bp2Cfg = this.GetHasSkill(HeroSkillId.HuoJu.BuffPower2);
            if(bp2Cfg){
                // attrAdd = MathHelper.NumToPer(bp2Cfg.pram1);
                atkValAddPer = MathHelper.NumToPer(bp2Cfg.pram1);
            }
            else{
                // attrAdd = MathHelper.NumToPer(cfg.pram1);
                atkValAddPer = MathHelper.NumToPer(cfg.pram1);
            }
            // atkAdd = attrAdd;
            // speedAdd = attrAdd;
        }, this.hero.tag);
        BattleData.Inst().HandleCountSkill(HeroSkillId.HuoJu.BuffAtk,(cfg,count)=>{
            // atkAdd += (MathHelper.NumToPer(cfg.pram1) * count);
            atkValAddPer += (MathHelper.NumToPer(cfg.pram1) * count);
        },this.hero.tag);
        BattleData.Inst().HandleCountSkill(HeroSkillId.HuoJu.BuffSpeed,(cfg,count)=>{
            speedAdd += (MathHelper.NumToPer(cfg.pram1) * count);
        },this.hero.tag);
        BattleData.Inst().HandleSkill(HeroSkillId.HuoJu.NumGain,(cfg)=>{
            let huojuNum = this.scene.GetHeroCount(this.hero.data.hero_id,-2);
            let attrAdd = huojuNum * MathHelper.NumToPer(cfg.pram1);
            atkValAddPer += attrAdd;
            // atkAdd += attrAdd;
            // speedAdd += attrAdd;
        }, this.hero.tag);

        //console.error(
        //    `FlushHuoJuBuffData===att=${this.hero.attriCfg.att},stage=${this.hero.stage},atkVal=${atkVal},atkValPer=${atkValAddPer},spAdd=${speedAdd}`);
        if(buffData == null){
            buffData = H_HuoJuBuff.CrateData(
                //atkAdd
                atkVal * atkValAddPer
                ,speedAdd);
        }
        else{
            H_HuoJuBuff.FlushAttri(buffData,
                // atkAdd
                atkVal * atkValAddPer
                ,speedAdd);
        }
        return buffData;
    }

    

    private getHero(i:number,j:number){
        let hero = this.scene.GetHero(i,j);
        if(hero == null || hero.IsItem() || hero.data.stage <= 0){
            return null;
        }
        if(hero.data.hero_id == this.hero.data.hero_id){    //火炬木不给火炬木加buff
            return null;
        }
        return hero;
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        if(event.objs.length > 0){      
            BattleData.Inst().HandleSkill(HeroSkillId.HuoJu.YiShangBuff,(cfg)=>{
                event.objs.forEach(monster=>{
                    if(this.hitExcludeMons != null && this.hitExcludeMons.includes(monster)){
                        return;
                    }
                    if(this.hitExcludeMons == null){
                        this.hitExcludeMons = [];
                    }
                    this.hitExcludeMons.push(monster);
                    monster.AddBuff(YiShangBuff.CrateData(this.hero,cfg.pram1,MonterBuff.DefaultPer));
                })
            }, this.hero.tag);

        }
    }

    onDestroy(){
        super.onDestroy();
        this.skillListener.Detroy();
        this.skillListener = null;
        EventCtrl.Inst().off(BattleEventType.MonsterDie, this.OnMonsterDie, this);
    }

    OnMonsterDie(monster:MonsterObj){
        if(this.damAddMonsters.has(monster)){
            this.damAddMonsters.delete(monster);
        }
    }
}


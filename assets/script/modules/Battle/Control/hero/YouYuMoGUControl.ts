import { _decorator, Node } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent, SkillFunc } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { ResPath } from 'utils/ResPath';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { BattleData } from 'modules/Battle/BattleData';
import { KongJuBuff, MonterBuff, ZhongDuBuff } from 'modules/Battle/Function/MonsterBuff';
import { MathHelper } from '../../../../helpers/MathHelper';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { EventCtrl } from 'modules/common/EventCtrl';
import { BattleEventType } from 'modules/Battle/BattleConfig';
enum YouYuRes {
    Normal1 = "youyumogu_1",
    Normal2 = "youyumogu_2"
}
export class YouYuMoGUControl extends HeroControl {

    //全场中毒词条计数
    private static zhongduCount = 0; 
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(20,20);

    // 技能资源
    protected skillFuncRes = {
        [YouYuRes.Normal1] : SkillFuncResInit.Create([{stage:4,resName:YouYuRes.Normal2}]),
    }

    private skill:SkillRange;

    private hitExcludeMons : MonsterObj[] = null;

    private skillCountRec : Map<number,number> = new Map();

    private skillChangeFuncs : Map<number, (skillId:number,oldNum:number,newNum:number)=>void> = new Map();

    Init(){
        this.addSkillChangeLinsten(HeroSkillId.YYMoGu.AtkScope,this.OnSkillAtkScopeChange.bind(this));
        this.addSkillChangeLinsten(HeroSkillId.YYMoGu.BuffDam,this.OnSkillBuffDamChange.bind(this));
        this.addSkillChangeLinsten(HeroSkillId.YYMoGu.DamAdd,this.OnSkillDamageAddChange.bind(this));
        this.addSkillChangeLinsten(HeroSkillId.YYMoGu.DefOffset,this.OnSkillDefOffsetChange.bind(this));
        EventCtrl.Inst().on(BattleEventType.GameOver, this.onGameOver, this);
    }

    //采集当前技能数量并添加技能监听
    private addSkillChangeLinsten(skillId:number, func:(oldNum:number,newNum:number)=>void){
        this.skillChangeFuncs.set(skillId,func);
        if(BattleData.Inst().IsHasSkill(skillId,this.hero.tag)){
            let cfg = BattleData.Inst().GetSkillCfg(skillId);
            this.skillCountRec.set(skillId,this.GetSkillCount(cfg));
        }
    }

    //技能数量有变化的时候通知注册函数
    OnSkillChange(){
        this.skillChangeFuncs.forEach((func,skillId)=>{
            if(!BattleData.Inst().IsHasSkill(skillId,this.hero.tag)){
                return;
            }
            let cfg = BattleData.Inst().GetSkillCfg(skillId);
            let newNum = this.GetSkillCount(cfg);
            let oldNum = 0;
            if(this.skillCountRec.has(skillId)){
                oldNum = this.skillCountRec.get(skillId);
            }
            if(newNum != oldNum){
                this.skillCountRec.set(skillId,newNum);
                func(skillId,oldNum,newNum);
            }
        })
    }

    //每回合战斗开始回调
    OnFightStart(){
        YouYuMoGUControl.zhongduCount = 0;
        this.CrateHitSkillFuncByName(YouYuRes.Normal1, this.node.worldPosition, this.OnHitEvent.bind(this), (skill:SkillRange)=>{
            skill.OnMonsterEnterRange = this.OnEnterRange.bind(this);
            skill.OnMonsterExitRange = this.OnExitRange.bind(this);
            this.PlaySkill(skill);
            this.skill = skill;
            if(BattleData.Inst().IsHasSkill(HeroSkillId.YYMoGu.AtkScope,this.hero.tag)){
                let scopeCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.YYMoGu.AtkScope);
                let scopeNum = this.GetSkillCount(scopeCfg);
                this.OnSkillAtkScopeChange(HeroSkillId.YYMoGu.AtkScope,0,scopeNum);
            }
        });
    }

    OnSkillAtkScopeChange(skillId:number,oldNum:number,newNum:number){
        if(this.skill == null){ return; }
        let cfg = BattleData.Inst().GetSkillCfg(skillId);
        this.skill.SetScale((cfg.pram1 / 100 * newNum) + 1);
    }

    OnSkillDamageAddChange(skillId:number,oldNum:number,newNum:number){
        if(this.skill == null){ return; }
        let mons = this.skill.InRangeMonsters;
        if(mons == null || mons.length == 0){return;}
        //这里需要加上变化数量的效果数值
        this.applySkillDamAdd(mons,false,newNum-oldNum);
    }

    OnSkillDefOffsetChange(skillId:number,oldNum:number,newNum:number){
        if(this.skill == null){ return; }
        let mons = this.skill.InRangeMonsters;
        if(mons == null || mons.length == 0){return;}
        //这里需要加上变化数量的效果数值
        this.applySkillDefOffset(mons,false,newNum-oldNum);
    }

    OnSkillBuffDamChange(skillId:number,oldNum:number,newNum:number){
        if(this.skill == null){
            return;
        }
        let mons = this.skill.InRangeMonsters;
        if(mons == null || mons.length == 0){return;}
        //这里需要加上变化数量的效果数值
        this.applySkillBuffDam(mons,false,newNum-oldNum);
    }

    
    //默认技能效果
    DefaultSkillAction(){
        this.hitExcludeMons = null;
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        if(event.objs.length > 0){
            let addDu = BattleData.Inst().IsHasSkill(HeroSkillId.YYMoGu.DuWu,this.hero.tag);
            let duDamPer = 0;
            if(addDu){
                let addDuCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.YYMoGu.DuWu);
                duDamPer = addDuCfg.pram1 / 100;
            }
            let buffTimeAdd = 0;
            if(BattleData.Inst().IsHasSkill(HeroSkillId.YYMoGu.BuffTime,this.hero.tag)){
                let btCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.YYMoGu.BuffTime);
                buffTimeAdd = btCfg.pram1 * this.GetSkillCount(btCfg);
            }        
            let zdtCfg = this.GetHasSkill(HeroSkillId.YYMoGu.ZhongDuTime);
            if(zdtCfg){
                buffTimeAdd += zdtCfg.pram1;
            }
            event.objs.forEach(monster=>{
                if(this.hitExcludeMons != null && this.hitExcludeMons.includes(monster)){
                    return;
                }
                if(this.hitExcludeMons == null){
                    this.hitExcludeMons = [];
                }
                this.hitExcludeMons.push(monster);
                let att_value = this.CalculateAttackValue(0,1 + duDamPer);
                if(addDu){
                    let buffT = MonterBuff.DefaultTime + buffTimeAdd;
                    let buffDam = att_value * duDamPer;
                    monster.AddBuff(ZhongDuBuff.CreateData(this.hero,buffT,buffDam));
                    BattleData.Inst().HandleSkill(HeroSkillId.YYMoGu.AllZhongDu,(cfg)=>{
                        if(++YouYuMoGUControl.zhongduCount < cfg.pram1){
                            return;
                        }
                        YouYuMoGUControl.zhongduCount = 0;
                        this.scene.dynamic.ForeachMonsters((mo:MonsterObj)=>{
                            if(mo.IsDied()){
                                return false;
                            }
                            mo.AddBuff(ZhongDuBuff.CreateData(this.hero,buffT,buffDam));
                            return false;
                        });
                    }, this.hero.tag);
                }
                if(BattleData.Inst().IsHasSkill(HeroSkillId.YYMoGu.KongJu,this.hero.tag)){
                    let kjCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.YYMoGu.KongJu);
                    if(MathHelper.RandomResult(kjCfg.pram1,100)){
                        monster.AddBuff(KongJuBuff.CrateData(this.hero,kjCfg.pram2 + buffTimeAdd));
                    }
                }
                monster.DeductHp(this.hero, att_value);
                // event.skillFunc.SetExcludeObj(monster);
            })
            AudioManager.Inst().PlaySceneAudio(AudioTag.youyumogu, 1000);
        }
    }

    private OnEnterRange(mons : MonsterObj[]){
        this.applySkillBuffDam(mons,false);
        this.applySkillDamAdd(mons,false);
        this.applySkillDefOffset(mons,false);
    }

    private OnExitRange(mons : MonsterObj[]){   
        this.applySkillBuffDam(mons,true);
        this.applySkillDamAdd(mons,true);
        this.applySkillDefOffset(mons,true);
    }

    private applySkillBuffDam(mons:MonsterObj[],reverse:boolean,num:number = 0){
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.YYMoGu.BuffDam,this.hero.tag)){
            return;
        }
        let cfg  = BattleData.Inst().GetSkillCfg(HeroSkillId.YYMoGu.BuffDam);
        let funcNum = num;
        if(num == 0){
            num = this.GetSkillCount(cfg);
        }
        let valOff = (num * cfg.pram1 / 100) * (reverse?-1:1);
        mons.forEach((mo)=>{
            mo.buffReduceScale += valOff;
        })
    }

    private applySkillDamAdd(mons:MonsterObj[],reverse:boolean,num:number = 0){
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.YYMoGu.DamAdd,this.hero.tag)){
            return;
        }
        let cfg  = BattleData.Inst().GetSkillCfg(HeroSkillId.YYMoGu.DamAdd);
        let funcNum = num;
        if(num == 0){
            num = this.GetSkillCount(cfg);
        }
        let valOff = (num * cfg.pram1 / 100) * (reverse?-1:1);
        mons.forEach((mo)=>{
            mo.damgeScale += valOff;
        })    
    }

    //应用减少怪物抗性
    private applySkillDefOffset(mons:MonsterObj[],reverse:boolean,num:number = 0){
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.YYMoGu.DefOffset,this.hero.tag)){
            return;
        }
        let cfg  = BattleData.Inst().GetSkillCfg(HeroSkillId.YYMoGu.DefOffset);
        if(num == 0){
            num = this.GetSkillCount(cfg);
        }
        let valOff = (num * cfg.pram1) * (reverse?1:-1);
        mons.forEach((mo)=>{
            mo.defOffset += valOff;
        })
    }

    private onGameOver(suc:boolean){
        if(this.skill != null){
            this.StopSkill(this.skill);
            this.skill = null;
        }
    }

    onDestroy(){
        super.onDestroy();
        EventCtrl.Inst().off(BattleEventType.GameOver, this.onGameOver, this);
    }
    
}


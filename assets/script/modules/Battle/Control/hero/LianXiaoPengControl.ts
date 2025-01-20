import { _decorator, isValid, Node, Vec3 } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent, SkillFunc } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { HeroObjBuffType, IHeroObjBuffData, MonsterObjBuffType } from 'modules/Battle/BattleConfig';
import { BattleData } from 'modules/Battle/BattleData';
import { MathHelper } from '../../../../helpers/MathHelper';
import { H_TimeProgressBuff } from 'modules/Battle/Function/HeroBuff';
enum SkillRes {
    Normal = "LianXiaoPeng_1",
    QuanTou = "LianXiaoPeng_QuanTou",
    QiGongBo = "QiGongBo",
    BaoPo = "LianXiaoPengBaoPo",
}

// 普通攻击，向前后一列攻击，打到就消失，像海带恶魔一样
enum SkillIds {
    Skill1 = 541,   //战斗开始时，莲小蓬进入狂怒状态，当附近有敌人时，莲小蓬快速出拳对其造成{0}%伤害，莲小蓬蓄力{1}秒后可再次进入狂怒状态 , 技能打2秒
    Skill2 = 542,   //<color=#036b16>莲小蓬</color>对流血的敌人伤害<color=#036b16>+{0}%</color>   
    Skill3 = 543,   //<color=#036b16>莲小蓬</color>对剩余生命值越低的敌人伤害越高      
    Skill4 = 544,   //<color=#036b16>莲小蓬</color>攻击力<color=#036b16>+{0}%</color>
    Skill5 = 545,   //战斗开始时，<color=#036b16>莲小蓬</color>激励相邻一格的友军，使其攻击力<color=#036b16>+{0}%</color>，持续到战斗结束
    Skill6 = 546,   //<color=#036b16>莲小蓬</color>攻速<color=#036b16>+{0}%</color>
    Skill7 = 547,   //<color=#036b16>莲小蓬</color>每击杀<color=#036b16>{0}个</color>敌人，发射一次贯穿所有敌人的强力气功波，造成<color=#036b16>{1}%</color>伤害
    Skill8 = 548,   //<color=#036b16>莲小蓬</color>进入狂怒状态的蓄力时间<color=#036b16>-{0}秒</color>
    Skill9 = 549,   //<color=#036b16>莲小蓬</color>的普攻命中HP<color=#036b16>{0}%</color>的敌人时，<color=#036b16>{1}%</color>几率出现一次起劲爆破，对附近的敌人造成<color=#036b16>{3}%</color>伤害
    Skill10 = 550,  //<color=#036b16>莲小蓬</color>的强力气功波伤害<color=#036b16>+{0}%</color>，且战斗开始时立即释放<color=#036b16>{1}次</color>
}

export class LianXiaoPengControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(0.3,20);

    // 技能资源
    protected skillFuncRes = {
        [SkillRes.Normal] : SkillFuncResInit.Create(),
        [SkillRes.QuanTou] : SkillFuncResUnlock.Create(SkillIds.Skill1),
        [SkillRes.QiGongBo] : SkillFuncResUnlock.Create(SkillIds.Skill7),
        [SkillRes.BaoPo] : SkillFuncResUnlock.Create(SkillIds.Skill9),
    }

    private angleNum:number = 0;

    //狂怒蓄力时间
    private kuangnuCD:number = 0;

    //击杀数量
    private killCount:number = 0;
    private fisrtQiGongBo = true;

    private quantouing = false;

    Init(){
        
    }

    //每回合战斗开始回调
    OnFightStart(){
        this.kuangnuCD = 0;
        this.fisrtQiGongBo = true;
        this.quantouing = false;
        this.AddKuangNu();

        let skill5 = this.GetHasSkill(SkillIds.Skill5);
        if(skill5){
            let heros = this.GetRoundHeros(1);
            if(heros && heros.length > 0){
                heros.forEach(h=>{
                    if(h && !h.IsItem() && h.stage >= 1 && !h.HasBuff(HeroObjBuffType.JiLi)){
                        let buff = <IHeroObjBuffData>{
                            buffType: HeroObjBuffType.JiLi,
                            time: Number.MAX_VALUE,
                            p1: skill5.pram1 / 100,
                        }
                        h.AddBuff(buff);
                    }
                })
            }
        }
    }

    protected Run(dt: number): void {
        if(this.hero.HasBuff(HeroObjBuffType.KuangNu) && !this.quantouing){
            let monsters = this.GetRoundMonsters(1, this.node.worldPosition);
            if(monsters && monsters.length > 0){
                this.quantouing = true;
                this.PlayQuanTou();
            }
        }else if(this.kuangnuCD > 0){
            this.kuangnuCD -= dt;
            if(this.kuangnuCD <= 0){
                this.AddKuangNu();
            }
        }
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

    OnSkillChange(): void {
        let skill1 = this.GetHasSkill(SkillIds.Skill1);
        if(skill1){
            if(!this.hero.HasBuff(HeroObjBuffType.KuangNu)){
                this.AddKuangNu();
            }
        }
    }

    
    //默认技能效果
    DefaultSkillAction(){
        this.CrateSkillFuncByName(SkillRes.Normal, (skill)=>{
            skill.SetEulerAngle(this.angleNum);
        });

        if(this.fisrtQiGongBo){
            let skill10 = this.GetHasSkill(SkillIds.Skill10);
            if(skill10){
                this.fisrtQiGongBo = false;
                this.PlayQiGongBo();
            }
        }
    }

    //添加狂怒状态
    AddKuangNu(){
        if(this.kuangnuCD <= 0){
            let skill1 = this.GetHasSkill(SkillIds.Skill1);
            if(skill1){
                let buff = <IHeroObjBuffData>{
                    buffType: HeroObjBuffType.KuangNu,
                    time: Number.MAX_VALUE,
                }
                this.hero.AddBuff(buff);
                let cd = skill1.pram2;
                let skill8 = this.GetHasSkill(SkillIds.Skill8);
                if(skill8){
                    let count = this.GetSkillCount(skill8);
                    cd -= count * skill8.pram1;
                }
                this.kuangnuCD = cd;
            }
        }
    }

    //播放拳头
    PlayQuanTou(){
        this.CrateHitSkillFuncByName(SkillRes.QuanTou, this.node.worldPosition, this.OnQuanTouHitEvent.bind(this), (skill:SkillFunc)=>{
            this.PlaySkill(skill);
            skill.OnStop(()=>{
                if(this.node == null || !isValid(this.node) || this.hero == null || this.hero.IsDeleted()){
                    return
                }
                this.hero.RemoveBuffAtType(HeroObjBuffType.KuangNu);
                this.quantouing = false;
                if(this.kuangnuCD > 0){
                    let hasBuff = this.hero.HasBuff(HeroObjBuffType.TimeProgress);
                    if(!hasBuff){
                        let skill1 = this.GetHasSkill(SkillIds.Skill1);
                        if(skill1){
                            this.hero.AddBuff(H_TimeProgressBuff.Create(this.kuangnuCD));
                        }
                    }
                }
            })
        })
    }

    //播放气功波
    PlayQiGongBo(){
        this.CrateHitSkillFuncByName(SkillRes.QiGongBo, this.node.worldPosition, this.OnQiGongBoEvent.bind(this), (skill:SkillFunc)=>{
            skill.SetEulerAngle(this.angleNum);
            this.PlaySkill(skill);
        })
    }

    //播放爆破
    PlayBaoPo(pos:Vec3){
        this.CrateHitSkillFuncByName(SkillRes.QiGongBo, pos, this.OnBaoPoEvent.bind(this), (skill:SkillFunc)=>{
            this.PlaySkill(skill);
        })
    }

    GetTotalAttackValue(monseter:MonsterObj){
        let addPer:number = 0;
        let damScale:number = 1;

        let skill2 = this.GetHasSkill(SkillIds.Skill2);
        if(skill2 && monseter.HasBuff(MonsterObjBuffType.LiuXue)){
            addPer += skill2.pram1;
        }

        let skill3 = this.GetHasSkill(SkillIds.Skill3);
        if(skill3){
            let hpProgress = 1 - monseter.hpProgress;
            let count = Math.floor((hpProgress * 100) / skill3.pram1);
            addPer += count * skill3.pram2 / 100;
        }

        let value = this.CalculateAttackValue(addPer, damScale);
        return value
    }


    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        this.StopSkill(event.skillFunc);

        let attValue = this.GetTotalAttackValue(monster);
        monster.DeductHp(this.hero,attValue);
        this.KillMonster(monster);

        let skill9 = this.GetHasSkill(SkillIds.Skill9);
        if(skill9){
            if(monster.hpProgress < skill9.pram1 / 100 && MathHelper.RandomResult(skill9.pram2, 100)){
                this.PlayBaoPo(monster.worldPosition);
            }
        }
    }

    //拳头击中事件
    OnQuanTouHitEvent(event:SkillColliderEvent){
        let skill1 = this.GetHasSkill(SkillIds.Skill1);
        if(skill1){
            let attValue = this.CalculateAttackValue(skill1.pram1 / 100);
            event.objs.forEach(monster=>{
                monster.DeductHp(this.hero, attValue);
                this.KillMonster(monster);
            })

            event.SetAllExcludeObj();
        }
    }

    //气功波击中事件
    OnQiGongBoEvent(event:SkillColliderEvent){
        let skill7 = this.GetHasSkill(SkillIds.Skill7);
        if(skill7){
            let damScale = skill7.pram2 / 100;
            let skill10 = this.GetHasSkill(SkillIds.Skill10);
            if(skill10){
                damScale += skill10.pram1 / 100;
            }
            let attValue = this.CalculateAttackValue(0, damScale);
            event.objs.forEach(monster=>{
                monster.DeductHp(this.hero, attValue);
            })

            event.SetAllExcludeObj();
        }
    }

    //爆破击中事件
    OnBaoPoEvent(event:SkillColliderEvent){
        let Skill9 = this.GetHasSkill(SkillIds.Skill9);
        if(Skill9){
            let damScale = Skill9.pram3 / 100;
            let attValue = this.CalculateAttackValue(0, damScale);
            event.objs.forEach(monster=>{
                monster.DeductHp(this.hero, attValue);
                this.KillMonster(monster);
            })
            event.SetAllExcludeObj();
        }
    }

    KillMonster(monster:MonsterObj){
        if(monster.IsDied()){
            this.killCount++;
        }
        let skill7 = this.GetHasSkill(SkillIds.Skill7);
        if(skill7){
            if(this.killCount >= skill7.pram1){
                this.killCount = 0;
                this.PlayQiGongBo();
            }
        }
    }

}


import { _decorator, Node } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { MathHelper } from '../../../../helpers/MathHelper';
import { ResPath } from 'utils/ResPath';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { IMonsterObjBuffData, MonsterObjBuffType } from 'modules/Battle/BattleConfig';
import { MonterBuff, ZuoShaoBuff } from 'modules/Battle/Function/MonsterBuff';
import { SkillRoundMove } from 'modules/Battle/Function/SkillRountMove';
import { BattleData } from 'modules/Battle/BattleData';
import { CfgSkillData } from 'config/CfgEntry';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
enum NanGuaRes {
    Normal = "nangua_1",
    DianRan = "DianRang",
    HuoJuFeng = "HuoJuFeng",
    HuoYu = "HuoYu",
}
export class NanGuaControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);

    private angleNum:number = 0;

    private zuoshaoTime = 5;    //默认灼烧5秒
    private jufengHarm = 2;     //默认飓风造成2倍伤害

    // 技能资源
    protected skillFuncRes = {
        [NanGuaRes.Normal] : SkillFuncResInit.Create(),
        [NanGuaRes.DianRan] : SkillFuncResInit.Create(),
        [NanGuaRes.HuoJuFeng] : SkillFuncResUnlock.Create(HeroSkillId.NanGua.ZhaoHuanJuFeng),
        [NanGuaRes.HuoYu] : SkillFuncResUnlock.Create(HeroSkillId.NanGua.Skill9),
    }

    Init(){
        
    }

    //每回合战斗开始回调
    OnFightStart(){
        
    }

    
    //默认技能效果
    DefaultSkillAction(){
        AudioManager.Inst().PlaySceneAudio(AudioTag.nangua);
        this.CrateSkillFuncByName(NanGuaRes.Normal,(skillFunc:SkillShoot)=>{
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
        });

        BattleData.Inst().HandleSkill(HeroSkillId.NanGua.ZhaoHuanJuFeng, (skill:CfgSkillData)=>{
            let rate = skill.pram1;
            BattleData.Inst().HandleCountSkill(HeroSkillId.NanGua.JiaJuFengGaiLv, (skill2:CfgSkillData, count:number)=>{
                rate += skill2.pram1 * count;
            },this.hero.tag)
            let jufengCount = 1;
            BattleData.Inst().HandleSkill(HeroSkillId.NanGua.JiaJuFeng, (skill3:CfgSkillData)=>{
                jufengCount = skill3.pram1;
            }, this.hero.tag);
            if(MathHelper.RndRetPercent(rate)){
                this.skillBuff.otherValue++;
                let angle = 360 / jufengCount;
                for(let i = 0; i < jufengCount; i++){
                    this.PlayJuFeng(i * angle);
                }

                BattleData.Inst().HandleSkill(HeroSkillId.NanGua.GongJiQuanBu, (skill4)=>{
                    let count = this.skillBuff.otherValue;
                    if(count >= skill.pram1){
                        let monsters = BattleDynamicHelper.GetMonsterMap(this.hero.tag);
                        monsters.forEach(monster=>{
                            if(!monster.IsDied()){
                                monster.DeductHp(this.hero, this.CalculateAttackValue(0, skill4.pram2 / 100));
                            }
                        })
                        this.skillBuff.otherValue = 0;
                    }
                }, this.hero.tag)
            }
        }, this.hero.tag)

        let skill9 = BattleData.Inst().GetSkillCfg(HeroSkillId.NanGua.Skill9);
        if(this.IsHasSkillByData(skill9)){
            if(MathHelper.RandomResult(skill9.pram1, 100)){
                this.PlayHuoYu();
            }
        }
    }


    //释放飓风
    PlayJuFeng(angleNum:number){
        this.CrateHitSkillFuncByName(NanGuaRes.HuoJuFeng,this.node.worldPosition, this.OnJuFengHitEvent.bind(this),(skillFunc:SkillRoundMove)=>{
            skillFunc.initAngel = angleNum;
            let roundNum = 1;
            BattleData.Inst().HandleCountSkill(HeroSkillId.NanGua.JiaJuFengShiJian, (skill, count)=>{
                roundNum += (skill.pram1 * count) / skillFunc.playTime;
            },this.hero.tag);
            skillFunc.playRoundNum = roundNum;
            this.PlaySkill(skillFunc);
        });
    }


    //召唤火雨
    PlayHuoYu(){
        this.CrateHitSkillFuncByName(NanGuaRes.HuoYu,this.node.worldPosition, this.OnHuoYuHitEvent.bind(this),(skillFunc:SkillRange)=>{
            this.PlaySkill(skillFunc);
        });
    }


    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();

        let attackValue = this.CalculateAttackValue();
        monster.DeductHp(this.hero, attackValue);

        this.CrateHitSkillFuncByName(NanGuaRes.DianRan, monster.worldPosition, this.OnFireHieEvent.bind(this),(skillFunc:SkillRange)=>{
            let skill8 = BattleData.Inst().GetSkillCfg(HeroSkillId.NanGua.Skill8);
            let count = this.GetSkillCount(skill8);
            if(count > 0){
                skillFunc.SetScale(1 + skill8.pram1 * count / 100);
            }

            this.PlaySkill(skillFunc);
        }, this.scene.BottomEffectRoot);

        this.StopSkill(event.skillFunc);

        if(monster.HasBuff(MonsterObjBuffType.XuanYun)){
            BattleData.Inst().HandleCountSkill(HeroSkillId.NanGua.YanChangXuanYun, (skill, count)=>{
                monster.OffsetBuffTime(HeroSkillId.NanGua.YanChangXuanYun, skill.pram1 * count);
            }, this.hero.tag)
        }
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = 360 - MathHelper.GetVecAngle(this.node.worldPosition, monster.node.worldPosition);
    }

    //火焰命中事件
    OnFireHieEvent(event:SkillColliderEvent){
        //console.log("火焰命中事件", event.objs.length);
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let attackValue = this.CalculateAttackValue();
                monster.AddBuff(<IMonsterObjBuffData>{
                    buffType:MonsterObjBuffType.ZhuoShao,
                    time: 3,
                    hero:this.hero,
                    p1:MonterBuff.DefaultDamge(attackValue),
                    p2:1,
                })
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }

    //飓风命中事件
    OnJuFengHitEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let skill10 = this.GetHasSkill(HeroSkillId.NanGua.Skill10);
                if(skill10){
                    this.jufengHarm = 2 + skill10.pram1 / 100;
                }
                let att_value = this.CalculateAttackValue(0,this.jufengHarm);
                monster.DeductHp(this.hero, att_value);
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }


    //火雨命中事件
    OnHuoYuHitEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            let Skill9 = BattleData.Inst().GetSkillCfg(HeroSkillId.NanGua.Skill9);

            event.objs.forEach(monster=>{
                let att_value = this.CalculateAttackValue(0,Skill9.pram2 / 100);
                monster.DeductHp(this.hero, att_value);
                event.skillFunc.SetExcludeObj(monster);
                for(let i = 0; i < Skill9.pram3; i++){
                    monster.AddBuff(ZuoShaoBuff.CreateData(this.hero, 5, MonterBuff.DefaultDamge(att_value)))
                }
            })
        }
    }
}


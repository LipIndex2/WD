import { _decorator, math, Node, Vec3 } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { HeroObjBuffType, IHeroObjBuffData, MonsterObjBuffType } from 'modules/Battle/BattleConfig';
import { XuanYunBuff } from 'modules/Battle/Function/MonsterBuff';
import { BattleData } from 'modules/Battle/BattleData';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
enum SkillRes {
    Normal = "TieChuiLan_1",
    ShengGuangZhiLi = "ShengGuangZhiLi",
}
export class TieChuiLanControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);

    // 技能资源
    protected skillFuncRes = {
        [SkillRes.Normal] : SkillFuncResInit.Create(),
        [SkillRes.ShengGuangZhiLi] : SkillFuncResUnlock.Create(HeroSkillId.TieChuiLan.Skill1),
    }

    private attackTimes:number = 0;

    Init(){
        
    }

    //每回合战斗开始回调
    OnFightStart(){
        let skill5 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill5);
        if(skill5){
            this.PlayZhuFu();
        }
    }

    
    //默认技能效果
    DefaultSkillAction(){
        this.PlayNormalSkill();

        this.attackTimes++;
        this.skillBuff.otherValue++;
        let skill1 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill1);
        if(skill1 && this.attackTimes > skill1.pram1){
            let monsters = this.GetRoundMonsters(1, this.node.worldPosition);
            if(monsters.length > 0){
                this.PlayShengGuangZhiLi(monsters[0].worldPosition);
                this.attackTimes = 0;
            }
        }

        let skill7 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill7);
        if(skill7 && this.skillBuff.otherValue >= skill7.pram1){
            this.PlayShengGuangShenPanBefore();
            this.skillBuff.otherValue = 0;
        }

    }

    PlayNormalSkill(){
        this.CrateSkillFuncByName(SkillRes.Normal, (skill:SkillRange)=>{
            skill.SetScale(this.skillBuff.attackRangeScale);
        });
        AudioManager.Inst().PlaySceneAudio(AudioTag.tiechuilan);
    }

    //播放圣光之力
    PlayShengGuangZhiLi(worldPos:Vec3){
        this.CrateHitSkillFuncByName(SkillRes.ShengGuangZhiLi, worldPos, this.OnShengGuangZhiLiHit.bind(this), (skill)=>{
            this.PlaySkill(skill);
        })
    }

    //释放光明祝福
    PlayZhuFu(){
        let skill5 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill5);
        if(!skill5){
            return;
        }
        SceneEffect.Inst().Play(SceneEffectConfig.GuangMingZhuFu, null, this.node.worldPosition);
        let count = skill5.pram1;
        for(let i = 0; i < count; i++){
            let hero = this.scene.GetRandomHero(null, true, 1);
            if(hero && !hero.HasBuff(HeroObjBuffType.GuangMingZhuFu)){
                let buff = <IHeroObjBuffData>{
                    buffType: HeroObjBuffType.GuangMingZhuFu,
                    time: Number.MAX_VALUE,
                    p1: skill5.pram2 / 100,
                }
                hero.AddBuff(buff);
            }else{
                if(count < 10){
                    count++;
                }
            }
        }        
    }

    //圣光审判
    private PlayShengGuangShenPanBefore(){
        let damHero = this.scene.GetMaxStageHero(this.hero.data.hero_id);
        if(!damHero){
            return;
        }
        let damHeroCtrl = damHero.heroCtrl;
        if(!damHeroCtrl){
            return;
        }

        if(damHeroCtrl instanceof TieChuiLanControl){
            damHeroCtrl.PlayShengGuangShenPan();
        }
    }

    //释放圣光审判
    PlayShengGuangShenPan(){
        let skill7 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill7);
        if(skill7 == null){
            return;
        }
        SceneEffect.Inst().Play(SceneEffectConfig.ShengGuangShenPan, null, this.scene.Root.worldPosition);
        this.scheduleOnce(()=>{
            let monsters = BattleDynamicHelper.GetMonsterMap(this.hero.tag);
            let attValue = this.CalculateAttackValue(0, skill7.pram2 / 100);
            let skill11 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill11);
            monsters.forEach(monster=>{
                if(skill11 && monster.hpProgress <= skill11.pram1 / 100){
                    monster.ZhanSha(this.hero);
                }else{
                    monster.DeductHp(this.hero, attValue);
                }
            })
        },0.5)
    }


    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        event.objs.forEach(monster=>{
            this.OnHitMonster(monster);
        });
        event.SetAllExcludeObj();
    }

    OnHitMonster(monster:MonsterObj){
        let addPer:number = 0;
        let damScale:number = 1;

        let skill2 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill2);
        if(skill2){
            if(monster.HasBuff(MonsterObjBuffType.LiuXue)){
                damScale += skill2.pram1 / 100;
            }
        }

        let skill4 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill4);
        if(skill4){
            let count = this.GetSkillCount(skill4);
            damScale += count * skill4.pram1 / 100;
        }

        let skill10 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill10);
        if(skill10){
            let scale = this.globalSkillAttri.attackSpeedPercent + this.skillBuff.attackSpeed + this.hero.LocalAttriBuff.attackSpeed;
            let speedAddper = scale;
            let n = skill10.pram1 / 100;
            let num = Math.floor(speedAddper / n);
            damScale += num * skill10.pram2 / 100;
        }

        let attackValue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attackValue);
    }

    //圣光之力击中
    OnShengGuangZhiLiHit(event: SkillColliderEvent){
        let skill1 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill1);
        if(!skill1){
            return;
        }
        AudioManager.Inst().PlaySceneAudio(AudioTag.shenpan);
        event.objs.forEach(monster=>{
            let attackValue = this.CalculateAttackValue(0, skill1.pram2 / 100);
            monster.DeductHp(this.hero, attackValue);

            let xuanYunTime = skill1.pram3;
            let skill3 = this.GetHasSkill(HeroSkillId.TieChuiLan.Skill3);
            if(skill3){
                let count = this.GetSkillCount(skill3);
                xuanYunTime += count * skill3.pram1;
            }
            let buff = XuanYunBuff.CreateData(this.hero, xuanYunTime);
            monster.AddBuff(buff);
        })
        event.SetAllExcludeObj();
    }
}


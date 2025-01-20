import { _decorator, Node } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroObjBuffType, MonsterObjBuffType, MonsterType } from 'modules/Battle/BattleConfig';
import { CfgSkillData } from 'config/CfgEntry';
import { BattleData } from 'modules/Battle/BattleData';
import { H_TimeProgressBuff } from 'modules/Battle/Function/HeroBuff';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
enum SkillRes {
    HuoQiu = "DaZuiHuaHuoQiu",
}
export class DaZuiHuaControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);

    // 技能资源
    protected skillFuncRes = {
        [SkillRes.HuoQiu] : SkillFuncResInit.Create(),
    }

    //默认可吞噬数量
    private defaultEatCount = 1;
    //默认吞噬cd
    private defaultEatCD = 3;

    // 可吞噬数量
    private get canEatCount():number{
        let num = this.defaultEatCount;
        let skill3 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill3);
        if(skill3){
            num += skill3.pram1
        }

        let skill7 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill7);
        if(skill7){
            num += skill7.pram1
        }
        return num;
    }


    // 吞噬cd
    private get eatCD():number{
        let cd = this.defaultEatCD;

        let skill5 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill5);
        if(skill5){
            let count = this.GetSkillCount(skill5);
            cd -= skill5.pram1 * count;
        }

        let skill8 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill8);
        if(skill8){
            let count = this.GetSkillCount(skill8);
            cd -= skill8.pram1 * count;
        }

        return cd;
    }

    // 已吞噬数量
    private eatCount = 0;

    Init(){
        
    }

    //是否吞噬
    private IsEat():boolean{
        if(this.hero.HasBuff(HeroObjBuffType.TimeProgress)){
            return false;
        }

        let skill1 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill1);
        if(skill1 == null){
            return false;
        }
        let gailv = skill1.pram1;

        let skill4 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill4);
        if(skill4){
            gailv += skill4.pram1;
        }

        if(MathHelper.RandomResult(gailv, 100)){
            return true
        }
        return false;
    }

    //每回合战斗开始回调
    OnFightStart(){
        this.eatCount = 0;
    }

    
    //默认技能效果
    DefaultSkillAction(){
        this.PlayNormalSkill();
    }

    PlayNormalSkill(){
        let monsters = this.GetRoundMonsters(1, this.node.worldPosition);
        if(monsters && monsters.length > 0){
            let attCount = 1;
            let isEat = this.IsEat();

            if(isEat){
                let skill10 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill10);
                if(skill10 && MathHelper.RandomResult(skill10.pram1, 100)){
                    attCount = skill10.pram2;
                }
            }

            for(let i = 0; i < attCount && i < monsters.length; i++){
                let monster = monsters[i];
                SceneEffect.Inst().Play(SceneEffectConfig.DaZuiHuaGongJi, null, monster.centerWorldPos);
                AudioManager.Inst().PlaySceneAudio(AudioTag.dazuihua);
                this.OnHitMonster(monster, isEat);
            }
        }
    }

    //向前方吐出火球
    PlayHuoQiu(){
        this.CrateHitSkillFuncByName(SkillRes.HuoQiu, this.node.worldPosition, this.OnHuoQiuEvent.bind(this), (skill)=>{
            this.PlaySkill(skill);
        });
    }
    


    //火球击中
    OnHuoQiuEvent(event:SkillColliderEvent){
        let damScale:number = 1;

        let skill2 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill2);
        let skill9 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill9);
        if(skill9){
            damScale = skill9.pram1 / 100;
        }else if(skill2){
            damScale = skill2.pram1 / 100;
        }

        let attackValue = this.CalculateAttackValue(0, damScale);
        event.objs.forEach(monster=>{
            monster.DeductHp(this.hero, attackValue);
        })
        event.SetAllExcludeObj();
    }

    OnHitMonster(monster:MonsterObj, isEat:boolean){
        let addPer:number = 0;
        let damScale:number = 1;

        if(isEat){
            this.eatCount++;
            if(this.eatCount >= this.canEatCount){
                let cd = this.eatCD;
                if(cd > 0){
                    let buff = H_TimeProgressBuff.Create(this.eatCD);
                    this.hero.AddBuff(buff);
                }
                this.eatCount = 0;
            }

            // boss一口吃不下
            if(monster.data.monster_type != MonsterType.Boss){
                let skill9 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill9);
                if(skill9 && monster.IsBuffed()){
                    this.PlayHuoQiu();
                }else{
                    let skill2 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill2);
                    if(skill2 && monster.HasBuff(MonsterObjBuffType.ZhuoShao)){
                        this.PlayHuoQiu();
                    }
                }
                monster.ZhanSha(this.hero);
                return;
            }else{
                let skill5 = this.GetHasSkill(HeroSkillId.DaZuiHua.Skill5);
                if(skill5){
                    let attackValue = this.CalculateAttackValue(0, skill5.pram2 / 100);
                    monster.DeductHp(this.hero, attackValue);
                    return;
                }
            }
        }

        let attackValue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attackValue);
    }
}


import { _decorator, Node, Vec2, Vec3 } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent, SkillFunc } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { BattleData } from 'modules/Battle/BattleData';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { BattleEventType, IMonsterObjBuffData, MonsterEventType, MonsterObjBuffType } from 'modules/Battle/BattleConfig';
import { EventCtrl } from 'modules/common/EventCtrl';
import { MathHelper } from '../../../../helpers/MathHelper';
import { MonterBuff, YiShangBuff } from 'modules/Battle/Function/MonsterBuff';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
enum SkillRes {
    Normal = "LiuLian_1",
    LiuLianFengBao = "LiuLianFengBao",
    LiuLianCi = "LiuLianCi",
}
export class LiuLianControl extends HeroControl {
    static isPlayedFengBao = false;

    fengBaoSkill:SkillRange;

    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);

    // 技能资源
    protected skillFuncRes = {
        [SkillRes.Normal] : SkillFuncResInit.Create(),
        [SkillRes.LiuLianFengBao] : SkillFuncResUnlock.Create(HeroSkillId.LiuLian.Skill1),
        [SkillRes.LiuLianCi] : SkillFuncResUnlock.Create(HeroSkillId.LiuLian.Skill11),
    }

    private liulianSkillAssets = new Set<SkillFunc>();

    Init(){
        EventCtrl.Inst().on(BattleEventType.MonsterDie, this.OnMonsterDie, this);
    }

    //每回合战斗开始回调
    OnFightStart(){
        this._fengbaocd = 0;
        this.liulianSkillAssets.clear();
        if(BattleData.Inst().IsHasSkill(HeroSkillId.LiuLian.Skill1,this.hero.tag)){
            this.PlayLiuLianFengBaoBefore();
        }
    }

    OnFightEnd(): void {
        LiuLianControl.isPlayedFengBao = false;
        if(this.fengBaoSkill){
            this.StopSkill(this.fengBaoSkill);
            this.fengBaoSkill = null;
        }
    }

    private fengbaocd = 1.5;
    private _fengbaocd = 0;
    protected Run(dt: number): void {
        if(this.fengBaoSkill){
            this._fengbaocd += dt;
            if(this._fengbaocd >= this.fengbaocd){
                this.fengBaoSkill.ClearExclude();
                this._fengbaocd = 0;
            }
        }
    }

    
    //默认技能效果
    DefaultSkillAction(){
        this.PlayNormalSkill();
    }

    PlayNormalSkill(){
        this.CrateSkillFuncByName(SkillRes.Normal, (skill:SkillRange)=>{
            skill.SetScale(this.skillBuff.attackRangeScale);
            skill.OnStop(this.OnLiuLianStop.bind(this));
            this.liulianSkillAssets.add(skill);
        }, this.scene.BottomEffectRoot);
        SceneEffect.Inst().Play(SceneEffectConfig.LiuLianJiZhong, null, this.node.worldPosition);
    }

    //榴莲风暴
    private PlayLiuLianFengBaoBefore(){
        if(LiuLianControl.isPlayedFengBao){
            return;
        }
        let damHero = this.scene.GetMaxStageHero(this.hero.data.hero_id);
        if(!damHero){
            return;
        }
        let damHeroCtrl = damHero.heroCtrl;
        if(!damHeroCtrl){
            return;
        }

        if(damHeroCtrl instanceof LiuLianControl){
            LiuLianControl.isPlayedFengBao = true;
            damHeroCtrl.PlayLiuLianFengBao();
        }
    }

    //释放流量风暴
    PlayLiuLianFengBao(){
        LiuLianControl.isPlayedFengBao = true;

        this.CrateHitSkillFuncByName(SkillRes.LiuLianFengBao, this.scene.node.worldPosition, this.OnFengBaoHit.bind(this), (skill:SkillRange)=>{
            if(this.fengBaoSkill){
                this.StopSkill(this.fengBaoSkill);
                this.fengBaoSkill = null;
            }
            this.fengBaoSkill = skill;
            skill.OnStop(()=>{
                LiuLianControl.isPlayedFengBao = false;
            })
            this.PlaySkill(skill);
        })
    }

    //释放榴莲刺
    PlayLiuLianCi(wroldPos:Vec3){
        this.CrateHitSkillFuncByName(SkillRes.LiuLianCi, wroldPos, this.OnLiuLianCiHit.bind(this), (skill:SkillRange)=>{
            this.PlaySkill(skill);
        })
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

        let skill2 = this.GetHasSkill(HeroSkillId.LiuLian.Skill2);
        if(skill2 && monster.HasBuff(MonsterObjBuffType.XuanYun)){
            damScale += skill2.pram2 / 100 - 1;
        }

        let attackValue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attackValue);

        let skill10 = this.GetHasSkill(HeroSkillId.LiuLian.Skill10);
        if(skill10 && MathHelper.RandomResult(skill10.pram1, 100)){
            let buff = YiShangBuff.CrateData(this.hero, MonterBuff.DefaultTime, MonterBuff.DefaultPer);
            monster.AddBuff(buff);
        }
        AudioManager.Inst().PlaySceneAudio(AudioTag.bawangliulian);
    }

    //霸王风暴击中
    OnFengBaoHit(event:SkillColliderEvent){
        let skill1 = this.GetHasSkill(HeroSkillId.LiuLian.Skill1);
        if(skill1){
            let monsters = event.objs;
            let damScale = skill1.pram1 / 100;
            let skill3 = this.GetHasSkill(HeroSkillId.LiuLian.Skill3);
            if(skill3){
                let heroCount = this.scene.GetHeroCount(this.hero.data.hero_id, -2);
                damScale += heroCount * skill3.pram1 / 100;
            }

            monsters.forEach(monster=>{
                let attvalue = this.CalculateAttackValue(0, damScale);
                monster.DeductHp(this.hero, attvalue);

                let skill5 = this.GetHasSkill(HeroSkillId.LiuLian.Skill5);
                if(skill5 && MathHelper.RandomResult(skill5.pram1, 100)){
                    let buff = <IMonsterObjBuffData>{buffType: MonsterObjBuffType.JianTa, time:skill5.pram2, p1:0.15};
                    monster.AddBuff(buff);
                }

                let skill7 = this.GetHasSkill(HeroSkillId.LiuLian.Skill7);
                if(skill7 && MathHelper.RandomResult(skill7.pram1, 100)){
                    let buff = <IMonsterObjBuffData>{buffType: MonsterObjBuffType.JinGu, time:skill7.pram2};
                    monster.AddBuff(buff, true);

                    let skill11 = this.GetHasSkill(HeroSkillId.LiuLian.Skill1);
                    if(skill11){
                        monster.OnEvent(MonsterEventType.Die, this.OnMonsterDieJingGu.bind(this));
                    }
                }
            })
        }
        event.SetAllExcludeObj();
    }

    //榴莲刺击中
    OnLiuLianCiHit(event:SkillColliderEvent){
        let skill11 = this.GetHasSkill(HeroSkillId.LiuLian.Skill11);
        if(skill11){
            let monsters = event.objs;
            let damScale = skill11.pram1 / 100;
            monsters.forEach(monster=>{
                let attvalue = this.CalculateAttackValue(0, damScale);
                monster.DeductHp(this.hero, attvalue);
            })
            event.SetAllExcludeObj();
        }

        AudioManager.Inst().PlaySceneAudio(AudioTag.bawangliulian);
    }

    OnMonsterDie(monster: MonsterObj){
        if (this.fengBaoSkill) {
            this.fengBaoSkill.RemoveExcludeObj(monster);
        }
    }

    //紧固死亡
    OnMonsterDieJingGu(monster:MonsterObj){
        if(this.IsCanBattle()){
            this.PlayLiuLianCi(monster.centerWorldPos);
        }
    }

    onDestroy(){
        super.onDestroy();
        EventCtrl.Inst().off(BattleEventType.MonsterDie, this.OnMonsterDie, this);
    }



    private OnLiuLianStop(skill:SkillFunc){
        this.liulianSkillAssets.delete(skill);
    }

    protected OnMonsterLeave(): void {
        this.liulianSkillAssets.forEach(skill=>{
            this.StopSkill(skill);
        })
    }
}


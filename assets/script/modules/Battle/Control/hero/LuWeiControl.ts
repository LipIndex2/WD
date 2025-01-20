import { _decorator, Node, Vec3 } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent, SkillFunc } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { SkillStraight } from 'modules/Battle/Function/SkillStraight';
import { MathHelper } from '../../../../helpers/MathHelper';
import { CfgSkillData } from 'config/CfgEntry';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { MonsterObjBuffType } from 'modules/Battle/BattleConfig';
import { SkillShootBack } from 'modules/Battle/Function/SkillShootBack';
import { JinGuBuff, MonterBuff } from 'modules/Battle/Function/MonsterBuff';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
enum SkillRes {
    Normal = "LuWei_1",
    ChuanDao = "LuWeiHit",
    ShanDianQiu = "ShanDianQiu",
    DaShanDian = "DaShanDian",
}
export class LuWeiControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);

    //每次释放多少个闪电
    private playCount:number = 1;

    //攻击时间
    //private skillTime:number = 0.5;

    private killCount = 0;
    private killPos: Vec3;

    // 技能资源
    protected skillFuncRes = {
        [SkillRes.Normal] : SkillFuncResInit.Create(),
        [SkillRes.ChuanDao] : SkillFuncResUnlock.Create(HeroSkillId.LuWei.Skill2),
        [SkillRes.ShanDianQiu] : SkillFuncResUnlock.Create(HeroSkillId.LuWei.Skill5),
        [SkillRes.DaShanDian] : SkillFuncResUnlock.Create(HeroSkillId.LuWei.Skill7),
    }

    Init(){
        this.RegisterSkillHandle(HeroSkillId.LuWei.Skill1,this.SetBulletCount.bind(this));
        this.RegisterSkillHandle(HeroSkillId.LuWei.Skill10,this.SetBulletCount.bind(this));
    }

    //每回合战斗开始回调
    OnFightStart(){
        
    }

    SetBulletCount(skill:CfgSkillData){
        if(skill.skill_id == HeroSkillId.LuWei.Skill10){
            this.playCount = skill.pram1;
        }else{
            let new_count = skill.pram1;
            if(new_count > this.playCount){
                this.playCount = new_count;
            }
        }
    }

    AddKill(num:number){
        this.killCount += num;
        let skill7 = this.GetHasSkill(HeroSkillId.LuWei.Skill7);
        if(skill7 && this.killCount >= skill7.pram1){
            this.PlayDaShanDian();
            this.killCount = 0;
        }
    }

    
    //默认技能效果
    DefaultSkillAction(i:number = 0){
        let monsters = this.GetRoundMonsters(1, this.node.worldPosition);
        monsters.forEach(monster=>{
            if(i < this.playCount){
                let skill5 = this.GetHasSkill(HeroSkillId.LuWei.Skill5);
                if(skill5 && MathHelper.RandomResult(skill5.pram1, 100)){
                    this.PlayBackSkill(monster.worldPosition);
                }else{
                    this.PlayNormalSkill(monster.worldPosition);
                }
                i++;
            }
        });

        if(i < this.playCount){
            this.scheduleOnce(()=>{
                this.DefaultSkillAction(i);
            }, 0.2)
        }
    }

    //释放普通的闪电
    PlayNormalSkill(pos:Vec3){
        AudioManager.Inst().PlaySceneAudio(AudioTag.shandianluwei);
        let angle = MathHelper.GetVecAngle(this.node.worldPosition, pos);
        angle = 360 - angle;
        this.CrateSkillFuncByName(SkillRes.Normal, (skill:SkillStraight)=>{
            skill.SetEulerAngle(angle);
            //skill.playTime = this.skillTime * this.skillBuff.attackRangeScale;
        });
    }

    //释放一个会返回的球状闪电
    PlayBackSkill(pos:Vec3){
        let angle = MathHelper.GetVecAngle(this.node.worldPosition, pos);
        angle = 360 - angle;
        this.CrateHitSkillFuncByName(SkillRes.ShanDianQiu, this.node.worldPosition, this.OnShanDianQiuHit.bind(this),(skill:SkillShootBack)=>{
            skill.SetEulerAngle(angle);
            skill.isBack = true;
            this.PlaySkill(skill);
        });
    }

    //释放一个大闪电
    PlayDaShanDian(){
        let angle = 0
        if(this.killPos){
            angle = MathHelper.GetVecAngle(this.node.worldPosition, this.killPos);
            angle = 360 - angle;
        }
        this.CrateHitSkillFuncByName(SkillRes.DaShanDian, this.node.worldPosition, this.OnDaShanDianHit.bind(this),(skill:SkillRange)=>{
            skill.SetEulerAngle(angle);
            this.PlaySkill(skill);
        });
    }

    //传导闪电
    PlayChuanDao(monster:MonsterObj, hp:number){
        let monsterPos = monster.centerWorldPos;
        this.CrateHitSkillFuncByName(SkillRes.ChuanDao, monsterPos, this.OnChuanDaoHit.bind(this),(skill:SkillStraight)=>{
            skill.hp = hp;
            skill.SetExcludeObj(monster);
            let mo = BattleDynamicHelper.FindClosestMonster(monsterPos,Array.from(skill.excludeMap.keys()), this.hero.tag);
            if(mo != null){
                let angle = 360 - MathHelper.GetVecAngle(monsterPos,mo.centerWorldPos);
                skill.SetEulerAngle(angle);
                this.PlaySkill(skill);
            }else{
                this.scene.dynamic.PutSkillAsset(skill.node);
            }
        });
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        this.OnHitMonster(monster, event.skillFunc);
        this.StopSkill(event.skillFunc);
        SceneEffect.Inst().Play(SceneEffectConfig.ShanDianBaoZa,null, monster.centerWorldPos);
    }

    OnHitMonster(monster:MonsterObj, skill?:SkillFunc){
        let addPer:number = 0;
        let damScale:number = 1;

        let skill2 = this.GetHasSkill(HeroSkillId.LuWei.Skill2);
        if(skill && skill2 && monster.HasBuff(MonsterObjBuffType.BingDong)){
            damScale += skill2.pram1 / 100;
            this.PlayChuanDao(monster, skill2.pram2);
        }

        let attackValue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attackValue);

        let skill9 = this.GetHasSkill(HeroSkillId.LuWei.Skill9);
        if(skill9){
            if(MathHelper.RandomResult(skill9.pram1, 100)){
                let jinguBuff = JinGuBuff.CrateData(this.hero,MonterBuff.DefaultTime);
                monster.AddBuff(jinguBuff);
            }
        }

        if(monster.IsDied()){
            this.killPos = monster.centerWorldPos;
            this.AddKill(1);
        }
    }

    //闪电球几种
    OnShanDianQiuHit(event:SkillColliderEvent){
        let skill5 = this.GetHasSkill(HeroSkillId.LuWei.Skill5);
        if(skill5){
            let attackValue = this.CalculateAttackValue(0, skill5.pram2 / 100);
            event.objs.forEach(monster=>{
                monster.DeductHp(this.hero, attackValue);
                event.skillFunc.SetExcludeObj(monster);

                if(monster.IsDied()){
                    this.killPos = monster.centerWorldPos;
                    this.AddKill(1);
                }
            })
        }
    }

    //大闪电击中
    OnDaShanDianHit(event:SkillColliderEvent){
        let skill7 = this.GetHasSkill(HeroSkillId.LuWei.Skill7);
        if(skill7){
            let attackValue = this.CalculateAttackValue(0, skill7.pram2 / 100);
            event.objs.forEach(monster=>{
                monster.DeductHp(this.hero, attackValue);
                event.skillFunc.SetExcludeObj(monster);
                this.PlayChuanDao(monster, skill7.pram3);
            })
        }
    }

    //传导闪电击中
    OnChuanDaoHit(event:SkillColliderEvent){
        event.skillFunc.hp--;
        let monster = event.GetFirstHitObj();
        this.OnHitMonster(monster);
        event.skillFunc.SetExcludeObj(monster);
        SceneEffect.Inst().Play(SceneEffectConfig.ShanDianBaoZa,null, monster.centerWorldPos);

        if(event.skillFunc.hp <= 0){
            this.StopSkill(event.skillFunc);
        }else{
            //弹射目标
            let funcPos = event.skillFunc.playNode.worldPosition;
            let mo = BattleDynamicHelper.FindClosestMonster(funcPos,Array.from(event.skillFunc.excludeMap.keys()), this.hero.tag);
            if(mo != null){
                let playNodePos = monster.centerWorldPos;//event.skillFunc.playNode.worldPosition;
                event.skillFunc.node.worldPosition = playNodePos;
                event.skillFunc.playNode.worldPosition = playNodePos;
                let angle = 360 - MathHelper.GetVecAngle(funcPos,mo.centerWorldPos);
                event.skillFunc.SetEulerAngle(angle);
            }
        }
    }
}


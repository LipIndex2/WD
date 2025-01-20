import { _decorator, Node, Vec3 } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { BattleData } from 'modules/Battle/BattleData';
import { FIGHT_CELL_WIDTH, IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { CfgSkillData } from 'config/CfgEntry';
import { MonterBuff, ZhongDuBuff } from 'modules/Battle/Function/MonsterBuff';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
enum SkillRes {
    PuTaoDan = "PuTaoZhi",
}
export class PuTaoQiuControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(1,5);
    private angleNum:number = 0;
    private shootLength:number = 162;

    // 技能资源
    protected skillFuncRes = {
        [SkillRes.PuTaoDan] : SkillFuncResUnlock.Create(HeroSkillId.PuTaoQiu.Skill5),
    }

    Init(){
        //this.RegisterSkill(SkillPlayType.Before, HeroSkillId.PuTaoQiu.Skill1,this.LianXuPlay.bind(this));
        this.OnSkillChange();
    }

    //词条变化的时候
    OnSkillChange(){
        let skill3 = this.GetHasSkill(HeroSkillId.PuTaoQiu.Skill3);
        if(skill3){
            let count = this.GetSkillCount(skill3);
            this.attackRange.h = 5 + skill3.pram1 * 2 * count;
            this.attackRange.ReSetAABB();
            this.shootLength = FIGHT_CELL_WIDTH * (this.attackRange.h - 1) / 2;
        }
    }
  
    //默认技能效果
    DefaultSkillAction(){
        this.CrateSkillFunc(this.shootEffectPath, (skill:SkillShoot)=>{
            //skill.shootLength = this.shootLength;
            skill.SetEulerAngle(this.angleNum);
            let scale = this.shootLength / 162;
            skill.node.setScale(1,scale);
        });
        AudioManager.Inst().Play(AudioTag.munaili);

        let skill1 = this.GetHasSkill(HeroSkillId.PuTaoQiu.Skill1);
        let skill9 = this.GetHasSkill(HeroSkillId.PuTaoQiu.Skill9);
        if(skill9){
            this.LianXuPlay(skill9);
        }else if(skill1){
            this.LianXuPlay(skill1);
        }
    }

    //连续释放
    LianXuPlay(skill:CfgSkillData){
        let count = skill.pram1 - 1;
        let skill9 = this.GetHasSkill(HeroSkillId.PuTaoQiu.Skill9);
        if(skill9){
            count = skill9.pram1;
        }
        for(let i = 1; i <= count; i++){
            this.scheduleOnce(this.DoLianXuPlay.bind(this),0.4 * i);
        }
    }

    private DoLianXuPlay(){
        if(!this.isBattle){
            return;
        }

        this.CrateHitSkillFunc(this.shootEffectPath, this.node.worldPosition, this.OnHitEvent.bind(this), (skill:SkillShoot)=>{
            skill.shootLength = this.shootLength;
            skill.SetEulerAngle(this.angleNum);
            this.PlaySkill(skill);
        });
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.centerWorldPos.y >= this.node.worldPosition.y ? 0 : 180;
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        event.objs.forEach((monster)=>{
            this.OnHitMonster(monster);
            event.skillFunc.SetExcludeObj(monster);
        })
    }

    OnHitMonster(monster:MonsterObj){
        let skill7 = this.GetHasSkill(HeroSkillId.PuTaoQiu.Skill7)
        if(skill7 && monster.hpProgress < skill7.pram1 / 100){
            monster.ZhanSha(this.hero);
        }else{
            let skill2 = this.GetHasSkill(HeroSkillId.PuTaoQiu.Skill2);
            let addPer = 0;
            let damScale = 1;
            if(skill2){
                if(monster.HasBuff(MonsterObjBuffType.JinGu)){
                    damScale += skill2.pram1 / 100;
                }
            }
            let attValue = this.CalculateAttackValue(addPer, damScale);
            monster.DeductHp(this.hero, attValue);
        }

        if(!monster.IsDied()){
            this.AddZhongDu(monster);
            let skil10 = this.GetHasSkill(HeroSkillId.PuTaoQiu.Skill10);
            if(skil10){
                this.ChuanRanMonster(monster);
            }
        }else{
            //击杀敌人
            let skill5 = this.GetHasSkill(HeroSkillId.PuTaoQiu.Skill5);
            if(skill5){
                this.PlayPuTaoDan(monster.worldPosition);
            }
        }
    }

    //传染给周围敌人
    ChuanRanMonster(monster:MonsterObj){
        let monsters = this.GetRoundMonsters(1, monster.worldPosition);
        monsters.forEach(mst=>{
            if(!mst.HasBuff(MonsterObjBuffType.ZhongDu)){
                this.AddZhongDu(mst);
            }
        })
    }

    //留下葡萄蛋
    PlayPuTaoDan(pos:Vec3){
        this.CrateHitSkillFuncByName(SkillRes.PuTaoDan,pos, this.OnPuTaoDaoHit.bind(this),(skillFunc:SkillRange)=>{
            this.PlaySkill(skillFunc);
        }, this.scene.BottomEffectRoot);
    }

    OnPuTaoDaoHit(event:SkillColliderEvent){
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                this.AddZhongDu(monster);
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }

    //加中毒buff
    AddZhongDu(monster:MonsterObj){
        let buffAttValue = this.CalculateAttackValue();
        let buff_value = MonterBuff.DefaultDamge(buffAttValue);
        let skill4 = this.GetHasSkill(HeroSkillId.PuTaoQiu.Skill4);
        if(skill4){
            let count = this.GetSkillCount(skill4);
            buff_value = buff_value + buff_value * skill4.pram1 * count / 100;
        }

        let buff = ZhongDuBuff.CreateData(this.hero, MonterBuff.DefaultTime, buff_value);
        monster.AddBuff(buff);
    }
}


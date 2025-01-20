import { Vec3 } from 'cc';
import { CfgSkillData } from 'config/CfgEntry';
import { IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleData } from 'modules/Battle/BattleData';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillShootBack } from 'modules/Battle/Function/SkillShootBack';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroAttackRange, HeroControl, SkillFuncResUnlock } from '../HeroControl';
import { ResPath } from 'utils/ResPath';

//10380122
enum SkillIdType {
    skill1 = 157,     //1.回旋花每攻击3次向前扔出大回旋镖，造成200%伤害
    skill2 = 158,     //2.回旋花攻击中毒的敌人，20%几率对其造成300%伤害
    skill3 = 159,     //3.回旋花一次扔出3个回旋镖
    skill4 = 160,     //4.回旋花攻击速度+10%
    skill5 = 161,     //5.回旋花攻击20%几率向左右扔出1只巨型回旋镖，50%几率对命中的敌人造成200%伤害
    skill6 = 162,     //6.回旋花攻击力+10%
    skill7 = 163,     //7.回旋花的巨型回旋镖命中敌人时，20%几率使敌人眩晕1秒
    skill8 = 330,     //8.回旋花增加对中毒敌人造成200%伤害的几率+10%
    skill9 = 364,     //9.<color=#036b16>回旋花</color>每次向前掷出<color=#036b16>{0}个</color>回旋镖
    skill10 = 365,    //10.<color=#036b16>回旋花</color>每击杀<color=#036b16>{0}个</color>敌人，就会提升<color=#036b16>{0}%</color>的攻击力，持续到本回合结束
    Skill11 = 429,      //<color=#036b16>回旋花</color>的大回旋镖伤害增加到<color=#036b16>{0}%</color
}

enum SkillRes{
    huixuanhua3 = "huixuanhua_3",
}

export class HuiXuanHuaControl extends HeroControl {

    protected attackRange: HeroAttackRange = new HeroAttackRange(0.2, 20);

    private angleNum: number = 0;
    private shootNum: number = 0;

    protected skillFuncRes = {
        [SkillRes.huixuanhua3] : SkillFuncResUnlock.Create(SkillIdType.skill9),
    }

    get shootEffectPath(): string {
        let res_id;
        if(BattleData.Inst().IsHasSkill(SkillIdType.skill9,this.hero.tag)){
            res_id = SkillRes.huixuanhua3;
        }else{
            res_id = this.heroData.bullet_res_id;
        }
        return ResPath.SkillAsset(res_id);
    }

    private killCount:number = 0;

    Init() {
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill1, this.SkillAction1.bind(this));
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill3, this.SkillAction3.bind(this));
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill5, this.SkillAction5.bind(this));

    }

    OnFightStart(): void {
        this.killCount = 0;
    }

    //默认攻击
    DefaultSkillAction() {
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShootBack) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
            skillFunc.hp = 1;
            skillFunc.isBack = true;
        });
        this.shootNum++
        AudioManager.Inst().Play(AudioTag.huixuanhua);
    }

    //回旋花每攻击3次向前扔出大回旋镖，造成200%伤害
    SkillAction1(skill: CfgSkillData) {
        if (0 == this.shootNum % 3)
            this.CrateHitSkillFunc(this.shootEffectPath, this.node.worldPosition, this.OnBigSkillHit.bind(this), (skillFunc: SkillShootBack) => {
                skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
                skillFunc.SetScale(1.5);
                skillFunc.hp = 1;
                skillFunc.isBack = true;
                this.PlaySkill(skillFunc);
            })
    }

    //回旋花一次扔出3个回旋镖
    SkillAction3(skill: CfgSkillData) {
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShootBack) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum + 10);
            skillFunc.hp = 1;
            skillFunc.isBack = true;
        })
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShootBack) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum - 10);
            skillFunc.hp = 1;
            skillFunc.isBack = true;
        })
    }

    //回旋花攻击20%几率向左右扔出1只巨型回旋镖，50%几率对命中的敌人造成200%伤害
    SkillAction5(skill: CfgSkillData) {
        let tValue = skill.pram1;
        if (MathHelper.RandomResult(tValue, 100)) {
            this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShootBack) => {
                skillFunc.node.setRotationFromEuler(0, 0, this.angleNum - 90);
                skillFunc.SetScale(2);
                skillFunc.hp = 1;
                skillFunc.isBack = true;
            })
            this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShootBack) => {
                skillFunc.node.setRotationFromEuler(0, 0, this.angleNum + 90);
                skillFunc.shootDir = Vec3.UP;
                skillFunc.SetScale(2);
                skillFunc.hp = 1;
                skillFunc.isBack = true;
            })
        }
    }

    //眩晕时间
    GetXuanYunTime(): number {
        return this.hero.attriCfg.xuanyun_time + this.skillBuff.xuanyuanTime;
    }

    //回旋花攻击中毒的敌人，20%几率对其造成300%伤害
    //回旋花攻击20%几率向左右扔出1只巨型回旋镖，50%几率对命中的敌人造成200%伤害
    //回旋花的巨型回旋镖命中敌人时，20%几率使敌人眩晕1秒
    GongJiSkillAction(monster: MonsterObj, event: SkillColliderEvent) {
        let attackValue = this.attackValue;
        if (monster.HasBuff(MonsterObjBuffType.ZhongDu)) {
            let skill2 = BattleData.Inst().GetSkillCfg(SkillIdType.skill2);
            let skill8 = BattleData.Inst().GetSkillCfg(SkillIdType.skill8);
            if (BattleData.Inst().IsHasSkillByData(skill2,this.hero.tag)) {
                let tValue = skill2.pram1 + (BattleData.Inst().IsHasSkillByData(skill8,this.hero.tag) ? skill8.pram1 : 0);
                if (MathHelper.RandomResult(tValue, 100)) {
                    attackValue = this.CalculateAttackValue(0, skill2.pram2 / 100)
                }
            }
        }
        if (2 == event.skillFunc.playNode.scale.x) {
            let skill5 = BattleData.Inst().GetSkillCfg(SkillIdType.skill5);
            let skill7 = BattleData.Inst().GetSkillCfg(SkillIdType.skill7);
            if (BattleData.Inst().IsHasSkillByData(skill5,this.hero.tag)) {
                let tValue = skill5.pram3
                if (MathHelper.RandomResult(tValue, 100)) {
                    attackValue = this.CalculateAttackValue(0, skill5.pram4 / 100)
                }
            }
            if (BattleData.Inst().IsHasSkillByData(skill7,this.hero.tag)) {
                let tValue = skill7.pram1;
                if (MathHelper.RandomResult(tValue, 100)) {
                    monster.AddBuff(<IMonsterObjBuffData>{
                        buffType: MonsterObjBuffType.XuanYun,
                        time: skill7.pram2,
                        hero: this.hero,
                    })
                }
            }
        }

        let skill10 = BattleData.Inst().GetSkillCfg(SkillIdType.skill10);
        if(BattleData.Inst().IsHasSkillByData(skill10,this.hero.tag)){
            let count = Math.floor(this.killCount / skill10.pram1);
            let scale = count * skill10.pram2 / 100;
            attackValue += this.baseAttackValue * scale;
        }

        if(BattleData.Inst().IsHasSkill(SkillIdType.skill9,this.hero.tag)){
            attackValue = attackValue * 3;
        }

        monster.DeductHp(this.hero, attackValue);
    }

    //击中怪物事件
    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        this.GongJiSkillAction(monster, event)
        if(monster.hp < 0){
            this.killCount++;
        }
        AudioManager.Inst().PlaySceneAudio(AudioTag.huixuanhuashouji);
    }

    protected OnMonsterEnter(monster: MonsterObj) {
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

    OnBigSkillHit(event: SkillColliderEvent){
        let skill_11 = this.GetHasSkill(SkillIdType.Skill11);
        let damScale:number;
        if(skill_11){
            damScale = skill_11.pram1 / 100;
        }else{
            let skill_1 = BattleData.Inst().GetSkillCfg(SkillIdType.skill1);
            damScale = skill_1.pram2 / 100;
        }
        let attValue = this.CalculateAttackValue(0, damScale);
        event.objs.forEach((monster)=>{
            monster.DeductHp(this.hero, attValue);
            event.skillFunc.SetExcludeObj(monster);
        })
    }

}


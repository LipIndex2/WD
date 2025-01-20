import { CfgSkillData } from 'config/CfgEntry';
import { HeroObjBuffType, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleData } from 'modules/Battle/BattleData';
import { H_TimeProgressBuff } from 'modules/Battle/Function/HeroBuff';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroAttackRange, HeroControl } from '../HeroControl';
import { YiShangBuff } from 'modules/Battle/Function/MonsterBuff';

enum SkillIdType {
    skill1 = 206,     //1.仙人掌朝前后左右同时发射尖刺
    skill2 = 207,     //2.周围有其他植物时（除仙人掌），仙人掌装填时间-30%
    skill3 = 208,     //3.仙人掌攻击的持续时间+1s
    skill4 = 209,     //4.仙人掌攻击速度+10%
    skill5 = 210,     //5.仙人掌攻击距离越近的敌人，伤害越高
    skill6 = 211,     //6.仙人掌攻击力+10%
    skill7 = 212,     //7.仙人掌击杀敌人后，下次装填时间-50%
    skill8 = 378,     //8.<color=#036b16>仙人掌</color>每击杀一个敌人攻击力提升<color=#036b16>{0}%</color>，持续到本回合结束
    skill9 = 379,     //9.<color=#036b16>仙人掌</color>的针刺会贯穿敌人的护甲，造成<color=#036b16>{0}%</color>的易伤效果
    skill10 = 436,      //<color=#036b16>仙人掌</color>对缠绕的敌人额外造成<color=#036b16>{0}%</color>的伤害
}

const attckTime: number = 1
const resetTime: number = 2

export class XianRenZhangControl extends HeroControl {

    protected attackRange: HeroAttackRange = new HeroAttackRange(0.2, 20);

    private angleNum: number = 0;
    private shootTime: number = 0

    private realAttackTime: number = attckTime
    private realResetTime: number = resetTime
    private realRealResetTime: number = 0
    private isReduceResetTime: boolean = false
    private startCold: boolean = false

    private killCount: number = 0;      //本回合击杀敌人数量

    Init() {
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill1, this.SkillAction1.bind(this));
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill2, this.SkillAction2.bind(this));
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill3, this.SkillAction3.bind(this));
        // this.RegisterSkill(SkillPlayType.Before, 93, this.BackSkillAction.bind(this));

    }

    OnFightStart(): void {
        this.killCount = 0;
    }

    protected IsHeroRest(dt: number) {
        if (!this.IsMosnterEnter && 0 == this.shootTime) {
            return false
        }
        this.shootTime += dt
        if (this.shootTime < this.realAttackTime) {
            this.startCold = true
            return false
        } else {
            if (this.startCold) {
                this.startCold = false
                this.realRealResetTime = this.isReduceResetTime ? (this.realResetTime / 2) : this.realResetTime
                this.node.setSiblingIndex(0);
                this.hero.AddBuff(H_TimeProgressBuff.Create(this.realRealResetTime))
            } else if (this.shootTime > (this.realAttackTime + this.realRealResetTime)) {
                this.shootTime = 0
                this.isReduceResetTime = false
                this.hero.RemoveBuffAtType(HeroObjBuffType.TimeProgress)
            }
            return true
        }
    }

    //默认攻击
    DefaultSkillAction() {
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShoot) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
            skillFunc.node.setPosition(skillFunc.node.position.x + MathHelper.GetRandomNum(-1, 1) * 20, skillFunc.node.position.y);
            skillFunc.hp = 1;
        });
    }

    //前后左右同时发射尖刺
    SkillAction1(skill: CfgSkillData) {
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShoot) => {
            skillFunc.node.setRotationFromEuler(0, 0, 90);
            skillFunc.node.setPosition(skillFunc.node.position.x + MathHelper.GetRandomNum(-1, 1) * 20, skillFunc.node.position.y);
            skillFunc.hp = 1;
        })
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShoot) => {
            skillFunc.node.setRotationFromEuler(0, 0, -90);
            skillFunc.node.setPosition(skillFunc.node.position.x + MathHelper.GetRandomNum(-1, 1) * 20, skillFunc.node.position.y);
            skillFunc.hp = 1;
        })
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShoot) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum + 180);
            skillFunc.node.setPosition(skillFunc.node.position.x + MathHelper.GetRandomNum(-1, 1) * 20, skillFunc.node.position.y);
            skillFunc.hp = 1;
        })
    }

    //周围有其他植物时（除仙人掌），装填时间-30%
    SkillAction2(skill: CfgSkillData) {
        let skill2 = BattleData.Inst().GetSkillCfg(SkillIdType.skill2);
        if (!this.IsHasSkillByData(skill2)) {
            return;
        }
        let val = false
        let heros = this.GetRoundHeros(1);
        for (let hero of heros) {
            if (23 != hero.data.hero_id) {
                val = true
                break
            }
        }
        if (val) {
            this.realResetTime = this.IsHasSkillByData(skill2) ? (resetTime * (1 - skill2.pram1 / 100)) : resetTime
        }
    }

    //攻击的持续时间+1s
    SkillAction3(skill: CfgSkillData) {
        let skill3 = BattleData.Inst().GetSkillCfg(SkillIdType.skill3);
        if (!this.IsHasSkillByData(skill3)) {
            return;
        }
        this.realAttackTime = this.IsHasSkillByData(skill3) ? (attckTime + skill3.pram1) : attckTime
    }

    //攻击距离越近的敌人，伤害越高
    GongJiSkillAction(monster: MonsterObj, event: SkillColliderEvent) {
        let skill5 = BattleData.Inst().GetSkillCfg(SkillIdType.skill5);
        let addPer = 0;
        let damScale = 1;

        if (this.IsHasSkillByData(skill5)) {
            damScale = (1500 - Math.abs(monster.node.position.y - this.node.position.y)) / 1500 * skill5.pram1 / 100;
        }

        let skill8 = BattleData.Inst().GetSkillCfg(SkillIdType.skill8)
        if(this.IsHasSkillByData(skill8)){
            addPer += this.killCount * skill8.pram1 / 100;
        }

        let skill9 = BattleData.Inst().GetSkillCfg(SkillIdType.skill9)
        if(this.IsHasSkillByData(skill9)){
            let buff = YiShangBuff.CrateData(this.hero,5, skill9.pram1);
            monster.AddBuff(buff);
        }

        let skill10 = this.GetHasSkill(SkillIdType.skill10);
        if(skill10 && monster.HasBuff(MonsterObjBuffType.ChanRao)){
            damScale += skill10.pram1 / 100;
        }

        let attackValue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attackValue);
    }

    //击杀敌人后，下次装填时间-50%
    JiShaJiaSkillAction(monster: MonsterObj) {
        if (monster.hp > 0) {
            return;
        }
        this.isReduceResetTime = true
        this.killCount++;
    }

    //击中怪物事件
    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        if (event.skillFunc.hp <= 0) {
            this.StopSkill(event.skillFunc);
        }
        this.GongJiSkillAction(monster, event)
        this.JiShaJiaSkillAction(monster);
        AudioManager.Inst().Play(AudioTag.xianrenzhang);
    }

    protected OnMonsterEnter(monster: MonsterObj) {
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

}


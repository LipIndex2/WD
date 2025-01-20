import { CfgSkillData } from 'config/CfgEntry';
import { MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleData } from 'modules/Battle/BattleData';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillShootBack } from 'modules/Battle/Function/SkillShootBack';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { HeroAttackRange, HeroControl } from '../HeroControl';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';

enum SkillIdType {
    skill1 = 87,      //1.狂战士前后方向各丢一把斧头
    skill2 = 88,      //2.狂战士攻击灼烧的敌人，对其造成200%的伤害
    skill3 = 89,      //3.狂战士攻击距离越远的敌人，伤害越高
    skill4 = 90,      //4.击杀敌人时，狂战士攻击速度+10%，持续3s，效果可叠加
    skill5 = 91,      //5.狂战士每穿透1个敌人，伤害4%
    skill6 = 92,      //6.狂战士攻击速度提升的持续时间+1秒
    skill7 = 93,      //7.狂战士可收回抛出的斧头
    skill8 = 344,     //8.场上每存在<color=#036b16>{0}个椰子大炮</color>，则<color=#036b16>椰子大炮</color>的攻击力增加<color=#036b16>{1}%</color>
    skill9 = 345,     //9.敌人的血量每降低<color=#036b16>{0}%</color>，<color=#036b16>椰子大炮</color>对该敌人的伤害就增加<color=#036b16>{1}%</color>
    Skill10 = 419,    //<color=#036b16>椰子大炮</color>同时攻击前后左右的敌人
    Skill11 = 521,    //<color=#036b16>椰子大炮</color>穿透数量<color=#036b16>+{0}</color>    
}

export class YeZiBaoLeiControl extends HeroControl {

    protected attackRange: HeroAttackRange = new HeroAttackRange(0.2, 20);

    private angleNum: number = 0;

    private skillIsBack: boolean = false;
    private skillHp: number = 2;

    Init() {
        this.RegisterSkillHandle(SkillIdType.skill7, (skill:CfgSkillData)=>{
            this.skillIsBack = true;
        });

        this.RegisterSkillHandle(SkillIdType.Skill11, (skill:CfgSkillData)=>{
            let count = this.GetSkillCount(skill);
            this.skillHp = 2 + count * skill.pram1;
        })

        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill1, this.SkillAction1.bind(this));
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.Skill10, this.SkillAction10.bind(this));
    }

    //默认攻击
    DefaultSkillAction() {
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShootBack) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
            skillFunc.hp = this.skillHp;
            skillFunc.isBack = this.skillIsBack;
        });
        AudioManager.Inst().Play(AudioTag.YeZiGongJi);
    }

    //前后方向各丢一把斧头
    SkillAction1(skill: CfgSkillData) {
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShootBack) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum + 180);
            skillFunc.hp = this.skillHp;
            skillFunc.isBack = this.skillIsBack;
        })
    }

    SkillAction10(skill: CfgSkillData) {
        let skill1 = this.GetHasSkill(SkillIdType.skill1);
        if(!skill1){
            this.SkillAction1(skill);
        }

        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShootBack) => {
            skillFunc.node.setRotationFromEuler(0, 0, 90);
            skillFunc.hp = this.skillHp;
            skillFunc.isBack = this.skillIsBack;
        })
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShootBack) => {
            skillFunc.node.setRotationFromEuler(0, 0, 270);
            skillFunc.hp = this.skillHp;
            skillFunc.isBack = this.skillIsBack;
        })
    }

    //狂战士攻击距离越远的敌人，伤害越高
    //狂战士每穿透1个敌人，伤害+4%
    //攻击灼烧的敌人，对其造成200%的伤害
    GongJiSkillAction(monster: MonsterObj, event: SkillColliderEvent) {
        let addPer:number = 0;
        let damScale:number = 1;

        let skill3 = BattleData.Inst().GetSkillCfg(SkillIdType.skill3);
        if (this.IsHasSkillByData(skill3)) {
            damScale += Math.abs(monster.node.position.y - this.node.position.y) / 1500 * skill3.pram1 / 100;
        }
        let skill5 = BattleData.Inst().GetSkillCfg(SkillIdType.skill5);
        if (this.IsHasSkillByData(skill5)) {
            if (event.skillFunc instanceof SkillShootBack) {
                addPer += Math.floor(event.skillFunc.touNum / skill5.pram1) * skill5.pram2 / 100;
            }
        }
        let skill2 = BattleData.Inst().GetSkillCfg(SkillIdType.skill2);
        if (this.IsHasSkillByData(skill2) && monster.HasBuff(MonsterObjBuffType.ZhuoShao)) {
            damScale += (skill2.pram1 / 100) - 1;
        }

        //处理344词条
        BattleData.Inst().HandleSkill(SkillIdType.skill8, (skill8)=>{
            let scene = this.scene;
            let heroCount = scene.GetHeroCount(this.heroData.hero_id, -1);
            let xishu = Math.floor(heroCount / skill8.pram1);
            addPer += xishu * skill8.pram2 / 100;
        }, this.hero.tag)
        //处理345词条
        BattleData.Inst().HandleSkill(SkillIdType.skill9, (skill9)=>{
            let value = (1 - monster.hpProgress) * 100;
            let xishu = Math.floor(value / skill9.pram1);
            damScale += xishu * skill9.pram2 / 100;
        }, this.hero.tag)

        let attackValue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attackValue);
    }

    //击杀敌人时，狂战士攻击速度+10%，持续3s，效果可叠加
    //狂攻击速度提升的持续时间+1秒
    JiShaJiaSkillAction(monster: MonsterObj) {
        if (monster.hp > 0) {
            return;
        }
        let skill4 = BattleData.Inst().GetSkillCfg(SkillIdType.skill4);
        if (!this.IsHasSkillByData(skill4)) {
            return;
        }
        let skill6 = BattleData.Inst().GetSkillCfg(SkillIdType.skill6);
        let skillBuff = this.skillBuff;
        skillBuff.attackSpeed += skill4.pram1 / 100;
        setTimeout(() => {
            skillBuff.attackSpeed -= skill4.pram1 / 100;
        }, skill4.pram2 * 1000 + (this.IsHasSkillByData(skill6) ? (skill6.pram1 * 1000) : 0));
    }

    //击中怪物事件
    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        this.GongJiSkillAction(monster, event)
        if (event.skillFunc instanceof SkillShootBack) {
            event.skillFunc.touNum++;
        }
        //AudioManager.Inst().Play(AudioTag.YeZiBaoZha);
        this.JiShaJiaSkillAction(monster);
        event.skillFunc.DeductHp();
    }

    protected OnMonsterEnter(monster: MonsterObj) {
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

}


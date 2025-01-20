import { BattleState, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleData } from 'modules/Battle/BattleData';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillShootBig } from 'modules/Battle/Function/SkillShootBig';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { HeroAttackRange, HeroControl } from '../HeroControl';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';

enum SkillIdType {
    skill1 = 192,      //1.坚果墙的坚果会越滚越大
    skill2 = 193,      //2.坚果墙的坚果命中禁锢的敌人，伤害+100%
    skill3 = 194,      //3.坚果墙制造坚果的时间-0.5秒
    skill4 = 195,      //4.坚果墙攻击力+10%
    skill5 = 196,      //5.坚果墙的坚果越大伤害越高
    skill6 = 197,      //6.坚果墙的坚果变大的时间变得更短
    skill7 = 198,      //7.坚果墙的坚果越大，击退敌人的几率越高
    skill8 = 374,      //8.<color=#036b16>坚果墙</color>每次攻击会释放<color=#036b16>{0}个</color>坚果
    skill9 = 375,      //9.<color=#036b16>坚果墙</color>对异常状态下的敌人造成<color=#036b16>{0}%</color>的伤害
    Skill10 = 434,      //<color=#036b16>坚果墙</color>命中禁锢的敌人时的伤害增加到<color=#036b16>{0}%</color>
}

export class JianGuoQiangControl extends HeroControl {

    protected attackRange: HeroAttackRange = new HeroAttackRange(0.2, 20);

    private angleNum: number = 0;

    Init() {
        
    }

    //默认攻击
    DefaultSkillAction() {
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShootBig) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
            skillFunc.hp = 1;
            skillFunc.isBig = false;
            let skill1 = this.GetHasSkill(SkillIdType.skill1);
            skillFunc.isBig = skill1 != null;

            let skill6 = this.GetHasSkill(SkillIdType.skill6);
            if(skill6){
                skillFunc.bigVal = 750;
            }
        });
        AudioManager.Inst().Play(AudioTag.jianguo);

        BattleData.Inst().HandleSkill(SkillIdType.skill8, (skill)=>{
            this.scheduleOnce(()=>{
                if(this.IsCanBattle()){
                    this.CrateHitSkillFunc(this.shootEffectPath, this.node.worldPosition, this.OnHitEvent.bind(this), (skillFunc:SkillShootBig)=>{
                        let skill1 = this.GetHasSkill(SkillIdType.skill1);
                        skillFunc.isBig = skill1 != null;

                        let skill6 = this.GetHasSkill(SkillIdType.skill6);
                        if(skill6){
                            skillFunc.bigVal = 750;
                        }
                        this.PlaySkill(skillFunc);
                    })
                }
            },0.2)
        }, this.hero.tag)
    }

    //坚果墙的坚果命中禁锢的敌人，伤害+100%
    //坚果墙的坚果越大伤害越高
    GongJiSkillAction(monster: MonsterObj, event: SkillColliderEvent) {
        let addPer = 0;
        let admScale = 1;
        //let attackValue = this.attackValue;

        
        let skill5 = BattleData.Inst().GetSkillCfg(SkillIdType.skill5);
        if (BattleData.Inst().IsHasSkillByData(skill5,this.hero.tag)) {
            if (event.skillFunc instanceof SkillShootBig) {
                admScale = event.skillFunc.bigScale;
            }
        }

        let skill9 = BattleData.Inst().GetSkillCfg(SkillIdType.skill9);
        if(BattleData.Inst().IsHasSkillByData(skill9,this.hero.tag) && monster.IsBuffed()){
            admScale += skill9.pram1 / 100;
        }

        if(monster.HasBuff(MonsterObjBuffType.JinGu)){
            let skill10 = this.GetHasSkill(SkillIdType.Skill10);
            if(skill10){
                admScale += skill10.pram1 / 100 - 1
            }else{
                let skill2 = this.GetHasSkill(SkillIdType.skill2);
                if(skill2){
                    admScale += skill2.pram1 / 100
                }
            }
        }

        let attackValue = this.CalculateAttackValue(addPer, admScale);
        monster.DeductHp(this.hero, attackValue);
    }

    //击中怪物事件
    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        this.GongJiSkillAction(monster, event)
        // this.JiShaJiaSkillAction(monster);
        AudioManager.Inst().PlaySceneAudio(AudioTag.jianguoshouji);
    }

    protected OnMonsterEnter(monster: MonsterObj) {
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

}


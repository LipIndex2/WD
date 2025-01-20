import { CfgSkillData } from 'config/CfgEntry';
import { BattleState, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleData } from 'modules/Battle/BattleData';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { JiTuiBuff } from 'modules/Battle/Function/MonsterBuff';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { Vec3 } from 'cc';

enum SkillIdType {
    skill1 = 255,       //1.香蒲猫召唤的水柱数量+1
    skill2 = 256,       //2.香蒲猫攻击灼烧的敌人时，10%几率使其身上出现1蒸发爆炸，对周围敌人造成200伤害
    skill3 = 257,       //3.香蒲猫攻击力10%，且射程增加1格
    skill4 = 258,       //4.香蒲猫攻击速度+10%
    skill5 = 259,       //5.香蒲猫召唤的水柱变得更大，并且伤害100%
    skill6 = 260,       //6.香蒲猫攻击力+10%
    skill7 = 261,       //7.香蒲猫攻击时，10%的几率召唤巨浪攻击敌人
    skill8 = 390,       //8.<color=#036b16>香蒲猫</color>的水柱会对当前一格内的敌人都造成伤害
    skill9 = 391,       //9.<color=#036b16>香蒲猫</color>每次会召唤<color=#036b16>{0}个</color>巨浪
    skill10 = 442,      //<color=#036b16>香蒲猫</color>的蒸发爆炸的伤害<color=#036b16>+{0}%</color>
}

enum XiangPuMaoRes {
    Normal = "xiangpumao_1",
    JuLang = "xiangpumao_julang",
}

export class XiangPuMaoControl extends HeroControl {

    protected attackRange: HeroAttackRange = new HeroAttackRange(5, 5);
    private angleNum: number = 0;

    protected skillFuncRes = {
        [XiangPuMaoRes.Normal]: SkillFuncResInit.Create(),
        [XiangPuMaoRes.JuLang]: SkillFuncResUnlock.Create(SkillIdType.skill7),
    }

    Init() {
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill1, this.SkillAction1.bind(this));
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill7, this.SkillAction7.bind(this));
    }

    //默认攻击
    DefaultSkillAction() {
        this.CrateSkillFuncByName(XiangPuMaoRes.Normal, (skillFunc: SkillRange) => {
            // skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
            let dirMonster = BattleDynamicHelper.FindClosestMonster(this.hero.worldPosition, null, this.hero.tag);
            if (dirMonster) {
                let skill5 = BattleData.Inst().GetSkillCfg(SkillIdType.skill5);
                if (this.IsHasSkillByData(skill5)) {
                    skillFunc.node.setScale(2, 2)
                }
                skillFunc.node.setWorldPosition(dirMonster.node.worldPosition)
            }
        });
        AudioManager.Inst().Play(AudioTag.xiangpumao);
    }

    //香蒲猫召唤的水柱数量+1
    //香蒲猫召唤的水柱变得更大，并且伤害100%
    SkillAction1(skill: CfgSkillData) {
        this.CrateSkillFuncByName(XiangPuMaoRes.Normal, (skillFunc: SkillRange) => {
            // skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
            let dirMonster = BattleDynamicHelper.FindClosestMonster(this.hero.worldPosition, null, this.hero.tag);
            if (dirMonster) {
                let skill5 = BattleData.Inst().GetSkillCfg(SkillIdType.skill5);
                if (this.IsHasSkillByData(skill5)) {
                    skillFunc.node.setScale(2, 2)
                }
                skillFunc.node.setWorldPosition(dirMonster.node.worldPosition)
            }
        });
    }

    //香蒲猫攻击时，10%的几率召唤巨浪攻击敌人
    SkillAction7(skill: CfgSkillData) {
        let tValue = skill.pram1;
        if (MathHelper.RandomResult(tValue, 100)) {

            let count = 1
            let skill9 = BattleData.Inst().GetSkillCfg(SkillIdType.skill9);
            if(this.IsHasSkillByData(skill9)){
                count = skill9.pram1;
            }

            for(let i = 0; i < count; i++){
                this.scheduleOnce(()=>{
                    this.CreateJuLang(this.node.worldPosition.clone());
                }, i)
            }
        }
    }

    //创建巨浪
    CreateJuLang(pos:Vec3){
        if(this.battleInfo.battleState != BattleState.Figth){
            return;
        }
        this.CrateHitSkillFuncByName(XiangPuMaoRes.JuLang, pos, (event: SkillColliderEvent) => {
            super.OnHitEvent(event);
            let monster = event.GetFirstHitObj();
            event.skillFunc.SetExcludeObj(monster);
            monster.AddBuff(JiTuiBuff.CreateData(this.hero, 1, 0.15));
            this.GongJiSkillAction(monster, event)

        }, (skillFunc: SkillShoot) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
            this.PlaySkill(skillFunc);
        }, this.scene.BottomEffectRoot);
    }

    //香蒲猫召唤的水柱变得更大，并且伤害100%
    //香蒲猫攻击灼烧的敌人时，10%几率使其身上出现1蒸发爆炸，对周围敌人造成200伤害
    GongJiSkillAction(monster: MonsterObj, event: SkillColliderEvent) {
        let attackValue = this.attackValue;
        let skill5 = BattleData.Inst().GetSkillCfg(SkillIdType.skill5);
        if (this.IsHasSkillByData(skill5)) {
            attackValue = this.CalculateAttackValue(skill5.pram1 / 100)
        }
        if (monster.HasBuff(MonsterObjBuffType.ZhuoShao)) {
            let skill2 = BattleData.Inst().GetSkillCfg(SkillIdType.skill2);
            if (this.IsHasSkillByData(skill2)) {
                let tValue = skill2.pram1;
                if (MathHelper.RandomResult(tValue, 100)) {
                    SceneEffect.Inst().Play(SceneEffectConfig.XiangPuMaoShuiBao, this.scene.node, monster.worldPosition);
                    let monsters = this.GetRoundMonsters(1, monster.centerWorldPos);
                    let attvalue = skill2.pram3 / 100;
                    let skill10 = this.GetHasSkill(SkillIdType.skill10);
                    if(skill10){
                        attvalue += attvalue * skill10.pram1 / 100;
                    }
                    for (let element of monsters) {
                        element.DeductHp(this.hero, this.CalculateAttackValue(0, attvalue))
                    }
                }
            }
        }
        monster.DeductHp(this.hero, attackValue);
    }

    //击中怪物事件
    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        if(BattleData.Inst().IsHasSkill(SkillIdType.skill8,this.hero.tag)){
            event.objs.forEach(monster=>{
                event.skillFunc.SetExcludeObj(monster);
                this.GongJiSkillAction(monster, event);
            })
        }else{
            let monster = event.GetFirstHitObj();
            event.skillFunc.SetExcludeObj(monster);
            this.GongJiSkillAction(monster, event);
            event.skillFunc.isCheckCollider = false;
        }
    }

    // protected OnMonsterEnter(monster: MonsterObj) {
    //     this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    // }

}


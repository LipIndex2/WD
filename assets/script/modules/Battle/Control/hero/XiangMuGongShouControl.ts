import { CfgSkillData } from 'config/CfgEntry';
import { MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleData } from 'modules/Battle/BattleData';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { SkillColliderEvent, SkillFunc } from 'modules/Battle/Function/SkillFunc';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';

enum SkillIdType {
    skill1 = 531,       //1.橡木弓手每攻击3次，会向周围射出八把弩箭
    skill2 = 532,       //2.橡木弓手对眩晕的敌人伤害+250%
    skill3 = 533,       //3.橡木弓手的弩箭可以穿透僵尸
    skill4 = 534,       //4-橡木弓手攻击力+15%
    skill5 = 535,       //5.橡木弓手攻击时，15%几率向前发射滚筒，对路径上的敌人造成250%伤害，滚筒移动到顶端时停留在原地期间停留5秒，期间每秒造成125%伤害
    skill6 = 536,       //6-橡木弓手攻速+15%
    skill7 = 537,       //7.橡木弓手的弩箭命中敌人时，15%几率产生爆炸，对附近敌人造成125%伤害
    skill8 = 538,       //8-橡木弓手的重击伤害提高25%
    skill9 = 539,       //9.橡木弓手的滚筒对敌人造成伤害时，使其减速20%，持续1.5秒
    skill10 = 540,      //10.橡木弓手的弩箭升级为铁制弩箭，攻击力增加50%
}

enum XiangMuGongShouRes {
    Normal1 = "xiangmugongshou_normal1",
    Normal2 = "xiangmugongshou_normal2",
    GunTong1 = "xiangmugongshou_guntong1",
    GunTong2 = "xiangmugongshou_guntong2",
}

export class XiangMuGongShouControl extends HeroControl {

    protected attackRange: HeroAttackRange = new HeroAttackRange(5, 5);
    private atkCount = 0;

    protected skillFuncRes = {
        [XiangMuGongShouRes.Normal1]: SkillFuncResInit.Create(),
        [XiangMuGongShouRes.Normal2]: SkillFuncResUnlock.Create(SkillIdType.skill10),
        [XiangMuGongShouRes.GunTong1]: SkillFuncResUnlock.Create(SkillIdType.skill5),
        [XiangMuGongShouRes.GunTong2]: SkillFuncResUnlock.Create(SkillIdType.skill5),
    }

    Init() {
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill1, this.SkillAction1.bind(this));
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill5, this.SkillAction5.bind(this));

        this.OnSkillChange();
    }

    OnFightStart(): void {
        this.atkCount = 0;
    }

    //默认攻击
    DefaultSkillAction() {
        this.CrateSkillFuncByName(this.SkillName(), (skillFunc: SkillFunc) => {
            let angle = 0;
            let dirMonster = BattleDynamicHelper.FindClosestMonster(this.hero.worldPosition, null, this.hero.tag);
            if (dirMonster != null) {
                let dirMonCenP = dirMonster.centerWorldPos;
                angle = MathHelper.VecZEuler(dirMonCenP.x - this.hero.worldPosition.x,
                    dirMonCenP.y - this.hero.worldPosition.y);
            }
            skillFunc.hp = this.SkillHp();
            skillFunc.SetEulerAngle(angle);;
        })
        this.atkCount++;
        AudioManager.Inst().Play(AudioTag.BingShuangJiZhong);
    }

    SkillHp() {
        return BattleData.Inst().IsHasSkill(SkillIdType.skill3, this.hero.tag) ? 99999999 : 1
    }

    SkillName() {
        return BattleData.Inst().IsHasSkill(SkillIdType.skill10, this.hero.tag) ? XiangMuGongShouRes.Normal2 : XiangMuGongShouRes.Normal1
    }

    //橡木弓手每攻击2次，会向周围射出八把弩箭
    SkillAction1(skill: CfgSkillData) {
        if (this.atkCount < skill.pram1) {
            return;
        }
        this.atkCount = 0;
        for (let i = 0; i < 8; i++) {
            this.CrateSkillFuncByName(this.SkillName(), (skillFunc: SkillFunc) => {
                skillFunc.hp = this.SkillHp();
                skillFunc.SetEulerAngle(i * 45);
            })
        }
    }

    //橡木弓手攻击时，15%几率向前发射滚筒，对路径上的敌人造成250%伤害，滚筒移动到顶端时停留在原地期间停留5秒，期间每秒造成125%伤害
    SkillAction5() {
        let skill5 = BattleData.Inst().GetSkillCfg(SkillIdType.skill5);
        if (this.IsHasSkillByData(skill5)) {
            if (MathHelper.RandomResult(skill5.pram1, 100)) {
                this.CrateHitSkillFuncByName(XiangMuGongShouRes.GunTong1, this.hero.worldPosition,
                    this.gunTongHitEvent.bind(this, skill5.pram2 / 100), (skillFunc1: SkillRange) => {
                        skillFunc1.hp = this.SkillHp();
                        skillFunc1.SetEulerAngle(0);
                        skillFunc1.OnStop(() => {
                            this.CrateHitSkillFuncByName(XiangMuGongShouRes.GunTong2, skillFunc1.playNode.worldPosition,
                                this.gunTongHitEvent.bind(this, skill5.pram4 / 100), (skillFunc: SkillRange) => {
                                    skillFunc.playTime = skill5.pram3;
                                    skillFunc.timeClear = 1
                                    this.PlaySkill(skillFunc);
                                });
                        })
                        this.PlaySkill(skillFunc1);
                    });
            }
        }
    }

    gunTongHitEvent(damScale: number, event: SkillColliderEvent) {
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);

        let skill9 = BattleData.Inst().GetSkillCfg(SkillIdType.skill9);
        if (this.IsHasSkillByData(skill9)) {
            monster.AddBuff({
                buffType: MonsterObjBuffType.JianSu,
                time: skill9.pram2,
                hero: this.hero,
                p1: skill9.pram1 / 100
            })
        }

        let addPer: number = 0;
        let attackValue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attackValue);

        AudioManager.Inst().PlaySceneAudio(AudioTag.bingjian);
    }

    //橡木弓手对眩晕的敌人伤害+250%
    //橡木弓手的弩箭命中敌人时，15%几率产生爆炸，对附近敌人造成125%伤害
    //橡木弓手的弩箭升级为铁制弩箭，攻击力增加50%
    GongJiSkillAction(monster: MonsterObj, event: SkillColliderEvent, damScale = 1) {
        let addPer: number = 0;

        let skill10 = BattleData.Inst().GetSkillCfg(SkillIdType.skill10);
        if (this.IsHasSkillByData(skill10)) {
            addPer += skill10.pram1 / 100;
        }

        if (monster.HasBuff(MonsterObjBuffType.XuanYun)) {
            let skill2 = BattleData.Inst().GetSkillCfg(SkillIdType.skill2);
            if (this.IsHasSkillByData(skill2)) {
                damScale += (skill2.pram1 / 100);
            }
        }
        let skill7 = BattleData.Inst().GetSkillCfg(SkillIdType.skill7);
        if (this.IsHasSkillByData(skill7)) {
            if (MathHelper.RandomResult(skill7.pram1, 100)) {
                SceneEffect.Inst().Play(SceneEffectConfig.XiangMuGongShouBaoZha, this.scene.node, monster.worldPosition);
                let monsters = this.GetRoundMonsters(1, monster.centerWorldPos);
                let attvalue = skill7.pram2 / 100;
                for (let element of monsters) {
                    element.DeductHp(this.hero, this.CalculateAttackValue(addPer, attvalue))
                }
            }
        }

        let attackValue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attackValue);
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
        this.GongJiSkillAction(monster, event);
        AudioManager.Inst().PlaySceneAudio(AudioTag.bingshuangshouji);
    }
}
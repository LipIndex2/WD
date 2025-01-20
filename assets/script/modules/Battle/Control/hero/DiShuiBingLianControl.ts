import { CfgSkillData } from 'config/CfgEntry';
import { MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleData } from 'modules/Battle/BattleData';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { SkillBulletTrack } from 'modules/Battle/Function/SkillBulletTrack';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroAttackRange, HeroControl, SkillFuncResInit } from '../HeroControl';
import { SkillFuncLocker } from '../SkillFuncLocker';

enum SkillIdType {
    skill1 = 508,       //1.滴水冰莲攻击时，额外向前发射可以穿透所有僵尸的冰锥，造成100%伤害
    skill2 = 509,       //2.滴水冰莲对中毒的僵尸，伤害+225%
    skill3 = 510,       //3.滴水冰莲每同一僵尸一次，伤害提升5%
    skill4 = 511,       //4-滴水冰莲攻速+10%
    skill5 = 512,       //5.滴水冰莲攻击时，25%几率发射会自动索敌的冰剑，造成100%伤害
    skill6 = 513,       //6-滴水冰莲攻击力+10%
    skill7 = 514,       //7.每隔5秒，滴水冰莲会发射把5把冰剑，造成125%伤害
    skill8 = 515,       //8.滴水冰莲冰剑会对僵尸施加一个持续3秒的冰雪印记，滴水冰莲对有印记的僵尸伤害+60%
    skill9 = 516,       //9.滴水冰莲对有冰雪印记的僵尸，伤害额外+15%
    skill10 = 517,      //10.滴水冰莲对同一僵尸连续造成10次伤害后，下一次对该僵尸造成300%伤害
}

enum DiShuiBingLianRes {
    Normal = "dishuibinglian_1",
    BingJian = "dishuibinglian_bingjian",
}

export class DiShuiBingLianControl extends HeroControl {

    protected attackRange: HeroAttackRange = new HeroAttackRange(0.2, 20);
    private angleNum: number = 0;

    private _bingJianLocker: SkillFuncLocker = null;

    private BingJianTime: number = 0;
    private _bingJianTime: number = 0;

    private hit_monsters = new Map()

    protected skillFuncRes = {
        [DiShuiBingLianRes.Normal]: SkillFuncResInit.Create(),
        [DiShuiBingLianRes.BingJian]: SkillFuncResInit.Create(),
    }

    private get bingJianLocker() {
        if (this._bingJianLocker == null) {
            this._bingJianLocker = new SkillFuncLocker((bullet, initSearch) => {
                if (initSearch) {
                    return BattleDynamicHelper.FindRandomMonster(null, this.hero.tag);
                }
                else {
                    return BattleDynamicHelper.FindClosestMonster(bullet.node.worldPosition, null, this.hero.tag);
                }
            });
        }
        return this._bingJianLocker;
    }

    Init() {
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill1, this.SkillAction1.bind(this));
        this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill5, this.SkillAction5.bind(this));

        this.OnSkillChange();
    }

    OnFightStart(): void {
        this._bingJianTime = 0;
        this.hit_monsters.clear()
    }

    OnSkillChange(): void {
        if (this.BingJianTime == 0) {
            let Skill7 = this.GetHasSkill(SkillIdType.skill7);
            if (Skill7) {
                this.BingJianTime = Skill7.pram1;
                this._bingJianTime = this.BingJianTime;
            }
        }
    }

    protected Run(dt: number) {
        if (this.BingJianTime != 0) {
            this._bingJianTime += dt;
            if (this._bingJianTime >= this.BingJianTime) {
                this.sendBingJian7();
                this._bingJianTime = 0;
            }
        }

    }

    //默认攻击
    DefaultSkillAction() {
        this.CrateSkillFuncByName(DiShuiBingLianRes.Normal, (skillFunc: SkillShoot) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
            skillFunc.hp = 1;
        });
        AudioManager.Inst().Play(AudioTag.BingShuangJiZhong);
    }

    //滴水冰莲攻击时，额外向前发射可以穿透所有僵尸的冰锥，造成100%伤害
    SkillAction1(skill: CfgSkillData) {
        this.scheduleOnce(() => {
            this.CrateSkillFuncByName(DiShuiBingLianRes.Normal, (skillFunc: SkillShoot) => {
                skillFunc.SetScale(1.5);
                skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
                skillFunc.hp = 99999999;
            })
        }, 0.2);
    }

    //滴水冰莲攻击时，25%几率发射会自动索敌的冰剑，造成100%伤害
    SkillAction5(skill: CfgSkillData, event: SkillColliderEvent) {
        let rate = skill.pram1;
        if (!MathHelper.RndRetPercent(rate)) {
            return;
        }
        let fdCount = 1
        for (let i = 0; i != fdCount; ++i) {
            this.sendBingJian(MathHelper.NumToPer(skill.pram2));
        }
    }

    //每隔5秒，滴水冰莲会发射把5把冰剑，造成125%伤害
    sendBingJian7() {
        let skill7 = BattleData.Inst().GetSkillCfg(SkillIdType.skill7);
        let fdCount = skill7.pram2;
        for (let i = 0; i != fdCount; ++i) {
            this.sendBingJian(MathHelper.NumToPer(skill7.pram3));
        }
    }

    private sendBingJian(damScale: number) {
        this.CrateHitSkillFuncByName(DiShuiBingLianRes.BingJian, this.hero.worldPosition,
            this.bingJianHitEvent.bind(this, damScale), (skillFunc: SkillBulletTrack) => {
                let initAngle = MathHelper.GetRandomNum(0, 360);
                skillFunc.SetEulerAngle(initAngle);
                this.bingJianLocker.BeginLock(skillFunc);
                this.PlaySkill(skillFunc);
            });
    }

    bingJianHitEvent(damScale: number, event: SkillColliderEvent) {
        let hitMon = this.bingJianLocker.OnHitEvent(event);
        if (!hitMon) {
            return;
        }

        this.bingJianLocker.EndLock(event.skillFunc);
        this.StopSkill(event.skillFunc);

        this.GongJiSkillAction(hitMon, event, damScale)
        AudioManager.Inst().PlaySceneAudio(AudioTag.bingjian);
    }

    //滴水冰莲对中毒的僵尸，伤害+225%
    //滴水冰莲每同一僵尸一次，伤害提升5%
    //滴水冰莲对同一僵尸连续造成10次伤害后，下一次对该僵尸造成300%伤害
    //滴水冰莲冰剑会对僵尸施加一个持续3秒的冰雪印记，滴水冰莲对有印记的僵尸伤害+60%
    //滴水冰莲对有冰雪印记的僵尸，伤害额外+15%
    GongJiSkillAction(monster: MonsterObj, event: SkillColliderEvent, damScale = 1) {
        let addPer: number = 0;

        let hit_num = this.hit_monsters.get(monster.objId) ?? 0
        this.hit_monsters.set(monster.objId, hit_num + 1)

        if (hit_num > 0) {
            let skill3 = BattleData.Inst().GetSkillCfg(SkillIdType.skill3);
            if (BattleData.Inst().IsHasSkillByData(skill3,this.hero.tag)) {
                damScale += (skill3.pram1 / 100) * hit_num;
            }
            let skill10 = BattleData.Inst().GetSkillCfg(SkillIdType.skill10);
            if (BattleData.Inst().IsHasSkillByData(skill10,this.hero.tag)) {
                if (0 == hit_num % skill10.pram1) {
                    damScale += (skill10.pram2 / 100) - 1;
                }
            }
        }
        if (monster.HasBuff(MonsterObjBuffType.ZhongDu)) {
            let skill2 = BattleData.Inst().GetSkillCfg(SkillIdType.skill2);
            if (BattleData.Inst().IsHasSkillByData(skill2,this.hero.tag)) {
                damScale += (skill2.pram1 / 100);
            }
        }

        let skill8 = BattleData.Inst().GetSkillCfg(SkillIdType.skill8);
        if (BattleData.Inst().IsHasSkillByData(skill8,this.hero.tag)) {
            let bingXueYinJiCount = monster.GetBuffCountByHero(MonsterObjBuffType.BingXueYinJi, this.hero);
            if (bingXueYinJiCount == 0) {
                monster.AddBuff({
                    buffType: MonsterObjBuffType.BingXueYinJi,
                    time: skill8.pram1,
                    hero: this.hero,
                })
            } else {
                damScale += (skill8.pram2 / 100);

                let skill9 = BattleData.Inst().GetSkillCfg(SkillIdType.skill9);
                if (BattleData.Inst().IsHasSkillByData(skill9,this.hero.tag)) {
                    damScale += (skill9.pram1 / 100);
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

    protected OnMonsterEnter(monster: MonsterObj) {
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

    onDestroy() {
        super.onDestroy();
        if (this._bingJianLocker) {
            this._bingJianLocker.Destroy();
            this._bingJianLocker = null;
        }
    }

}


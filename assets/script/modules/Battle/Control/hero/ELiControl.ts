import { BattleState, MonsterObjBuffType } from 'modules/Battle/BattleConfig';
import { BattleData } from 'modules/Battle/BattleData';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { game } from 'cc';

enum SkillIdType {
    skill1 = 551,       //1.鳄梨在命中敌人时，25%几率在敌人位置生成一滩黏液，减速附近敌人并造成125%伤害
    skill2 = 552,       //2.鳄梨的黏液命中敌人时，25%几率禁锢敌人1.5秒
    skill3 = 553,       //3.鳄梨可同时攻击2个敌人，且攻击距离+50%
    skill4 = 554,       //4-鳄梨减速效果+15%
    skill5 = 555,       //5.鳄梨击杀敌人后，25%几率留下一片使敌人减速的尖刺
    skill6 = 556,       //6-鳄梨攻速+15%
    skill7 = 557,       //7.每隔15s，鳄梨生成一滩巨型黏液，禁锢所有敌人1.5秒
    skill8 = 558,       //8.鳄梨击杀敌人时，留下的尖刺持续时间+2秒
    skill9 = 559,       //9.鳄梨击杀敌人时，留下的尖刺带有剧毒，对HP>55%的敌人每秒造成其最大HP3%的伤害
    skill10 = 560,      //10.鳄梨禁锢HP<15%的敌人时，15%几率将其斩杀
}

enum ELiRes {
    Normal = "eli_1",
    NianYe = "eli_nianye",
    JianCi = "eli_jianci",
}

export class ELiControl extends HeroControl {

    protected attackRange: HeroAttackRange = new HeroAttackRange(5, 5);
    private jianci_time = 3.5
    static _nianYeJuTime = 0

    protected skillFuncRes = {
        [ELiRes.Normal]: SkillFuncResInit.Create(),
        [ELiRes.NianYe]: SkillFuncResUnlock.Create(SkillIdType.skill1),
        [ELiRes.JianCi]: SkillFuncResUnlock.Create(SkillIdType.skill5),
    }

    Init() {
        this.OnSkillChange();
    }

    OnFightStart(): void {
        let skill7 = this.GetHasSkill(SkillIdType.skill7);
        if(skill7){
            ELiControl._nianYeJuTime = game.totalTime;
        }else{
            ELiControl._nianYeJuTime = 0;
        }
    }

    OnSkillChange(): void {
        if (ELiControl._nianYeJuTime == 0) {
            let skill7 = this.GetHasSkill(SkillIdType.skill7);
            if (skill7) {
                ELiControl._nianYeJuTime = game.totalTime;
            }
        }
    }

    protected Run(dt: number) {
        let skill7 = this.GetHasSkill(SkillIdType.skill7);
        if(skill7){
            if(ELiControl._nianYeJuTime > 0 && game.totalTime - ELiControl._nianYeJuTime >= (skill7.pram1 * 1000) / this.playerBattleInfo.globalTimeScale){
                ELiControl._nianYeJuTime = game.totalTime;
                this.sendNainYeJu();
            }
        }
    }


    //每隔15s，鳄梨生成一滩巨型黏液，禁锢所有敌人1.5秒
    sendNainYeJu() {
        SceneEffect.Inst().Play(SceneEffectConfig.ELiJuXingNianYe, this.scene.node, this.scene.node.worldPosition);
        let monsters = BattleDynamicHelper.GetMonsterMap(this.hero.tag);
        let skill7 = BattleData.Inst().GetSkillCfg(SkillIdType.skill7);
        for (let [key, monster] of monsters) {
            this.SkillActionJinGu(monster, skill7.pram2)
        }
    }

    //鳄梨禁锢HP<15%的敌人时，15%几率将其斩杀
    SkillActionJinGu(monster: MonsterObj, time: number) {
        monster.AddBuff({
            buffType: MonsterObjBuffType.JinGu,
            time: time,
            hero: this.hero,
        })
        let skill10 = BattleData.Inst().GetSkillCfg(SkillIdType.skill10);
        if (BattleData.Inst().IsHasSkillByData(skill10, this.hero.tag) && (monster.hpProgress < (skill10.pram1 / 100))) {
            if (MathHelper.RandomResult(skill10.pram2, 100)) {
                monster.ZhanSha(this.hero)
            }
        }
    }

    //默认攻击
    //鳄梨可同时攻击2个敌人，且攻击距离+50%（攻击距离走配置）
    DefaultSkillAction() {
        this.CrateSkillFuncByName(ELiRes.Normal, (skillFunc: SkillRange) => {
            let dirMonster = BattleDynamicHelper.FindClosestMonster(this.hero.worldPosition, null, this.hero.tag);
            if (dirMonster) {
                skillFunc.node.setWorldPosition(dirMonster.node.worldPosition)
            }
        });
        // if (BattleData.Inst().IsHasSkill(SkillIdType.skill3, this.hero.tag)) {
        //     this.CrateSkillFuncByName(ELiRes.Normal, (skillFunc: SkillRange) => {
        //         let dirMonster = BattleDynamicHelper.FindClosestMonster(this.hero.worldPosition, null, this.hero.tag);
        //         if (dirMonster) {
        //             skillFunc.node.setWorldPosition(dirMonster.node.worldPosition)
        //         }
        //     });
        // }
        AudioManager.Inst().Play(AudioTag.xiangpumao);
    }

    nianYeHitEvent(event: SkillColliderEvent) {
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);

        monster.AddBuff({
            buffType: MonsterObjBuffType.JianSu,
            time: 2.5,
            hero: this.hero,
            p1: 15 / 100,
        })

        let addPer: number = 0;
        let attackValue = this.CalculateAttackValue(addPer, 1);
        monster.DeductHp(this.hero, attackValue);

        AudioManager.Inst().PlaySceneAudio(AudioTag.bingjian);
    }

    jianCiHitEvent(event: SkillColliderEvent) {
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);

        monster.AddBuff({
            buffType: MonsterObjBuffType.JianSu,
            time: 2.5,
            hero: this.hero,
            p1: 15 / 100,
        })

        let skill9 = BattleData.Inst().GetSkillCfg(SkillIdType.skill9);
        if (BattleData.Inst().IsHasSkillByData(skill9, this.hero.tag) && (monster.hpProgress > (skill9.pram1 / 100))) {
            let attackValue = monster.maxHp * skill9.pram2 / 100
            monster.DeductHp(this.hero, attackValue);
        }

        AudioManager.Inst().PlaySceneAudio(AudioTag.bingjian);
    }

    //鳄梨在命中敌人时，25%几率在敌人位置生成一滩黏液，减速附近敌人并造成125%伤害
    //鳄梨的黏液命中敌人时，25%几率禁锢敌人1.5秒
    GongJiSkillAction(monster: MonsterObj, event: SkillColliderEvent, damScale = 1) {
        let addPer: number = 0;

        let skill1 = BattleData.Inst().GetSkillCfg(SkillIdType.skill1);
        if (BattleData.Inst().IsHasSkillByData(skill1, this.hero.tag)) {
            if (MathHelper.RandomResult(skill1.pram1, 100)) {
                this.CrateHitSkillFuncByName(ELiRes.NianYe, monster.worldPosition, this.nianYeHitEvent.bind(this), (skillFunc: SkillRange) => {
                    this.PlaySkill(skillFunc);
                }, this.scene.BottomEffectRoot);
            }
        }

        let skill2 = BattleData.Inst().GetSkillCfg(SkillIdType.skill2);
        if (BattleData.Inst().IsHasSkillByData(skill2, this.hero.tag)) {
            if (MathHelper.RandomResult(skill2.pram1, 100)) {
                this.SkillActionJinGu(monster, skill2.pram2)
            }
        }

        let attackValue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attackValue);
    }

    //鳄梨击杀敌人后，25%几率留下一片使敌人减速的尖刺
    //鳄梨击杀敌人时，留下的尖刺持续时间+2秒
    //鳄梨击杀敌人时，留下的尖刺带有剧毒，对HP>55%的敌人每秒造成其最大HP3%的伤害
    JiShaJiaSkillAction(monster: MonsterObj) {
        if (monster.hp > 0) {
            return;
        }
        let skill5 = BattleData.Inst().GetSkillCfg(SkillIdType.skill5);
        if (BattleData.Inst().IsHasSkillByData(skill5, this.hero.tag)) {
            if (MathHelper.RandomResult(skill5.pram1, 100)) {
                this.CrateHitSkillFuncByName(ELiRes.JianCi, monster.worldPosition, this.jianCiHitEvent.bind(this), (skillFunc: SkillRange) => {
                    let skill8 = BattleData.Inst().GetSkillCfg(SkillIdType.skill8);
                    skillFunc.playTime = BattleData.Inst().IsHasSkillByData(skill8, this.hero.tag) ? (this.jianci_time + skill8.pram1) : this.jianci_time
                    skillFunc.timeClear = 1
                    this.PlaySkill(skillFunc);
                }, this.scene.BottomEffectRoot);
            }
        }
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
        this.JiShaJiaSkillAction(monster);
        if (BattleData.Inst().IsHasSkill(SkillIdType.skill3, this.hero.tag)) {
            if (event.skillFunc.excludeMap.size > 1) {
                event.skillFunc.isCheckCollider = false;
            }
        }
        else {
            event.skillFunc.isCheckCollider = false;
        }
        AudioManager.Inst().PlaySceneAudio(AudioTag.bingshuangshouji);
    }

}


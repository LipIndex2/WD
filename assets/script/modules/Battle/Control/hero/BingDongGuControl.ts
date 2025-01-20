import { Vec3 } from 'cc';
import { CfgSkillData } from 'config/CfgEntry';
import { IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleData } from 'modules/Battle/BattleData';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroAttackRange, HeroControl } from '../HeroControl';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';

enum SkillIdType {
    skill1 = 136,       //1.冰冻菇命中敌人后，30%几率在其周围1格产生1次冰爆，几率对周围敌人减速或冰冻
    skill2 = 137,       //2.冰冻菇冰爆冰冻敌人的几率+20%
    skill3 = 138,       //3-冰冻菇减速效果+20%
    skill4 = 139,       //4.冰冻菇冰爆冰冻敌人时，其周围敌人10%几率被冰冻
    skill5 = 140,       //5-冰冻菇攻击速度+10%
    skill6 = 141,       //6.冰冻菇攻击时，20%几率释放圆形冰环，对敌人造成100%伤害，并使其减速或冰冻
    skill7 = 142,       //7.全场冰冻菇每攻击100次，召唤1次暴风雪，使全场敌人减速或冰冻
    skill8 = 358,       //8.<color=#036b16>冰冻菇</color>释放冰环后，<color=#036b16>{0}%</color>概率额外释放一次冰环
    skill9 = 359,       //9.<color=#036b16>冰冻菇</color>冰冻<color=#036b16>HP<{0}%</color>的敌人时，<color=#036b16>{0}%</color>概率将其斩杀
    skill10 = 426,      //<color=#036b16>冰冻菇</color>造成的冰冻时间<color=#036b16>+{0}秒</color>

    skill11 = 567,      //<color=#036b16>冰灵菇</color>的雪花命中僵尸后，<color=#036b16>{0}%</color>几率在其周围<color=#036b16>{1}格</color>释放<color=#036b16>{2}次</color>冰霜新星，减速或冰冻附近的僵尸
    skill12 = 568,      //<color=#036b16>冰灵菇</color>的冰霜新星冰冻僵尸的几率<color=#036b16>+{0}%</color>
    skill13 = 569,      //<color=#036b16>冰灵菇</color>攻击时，<color=#036b16>{0}%</color>几率释放冰冻圆环，对僵尸造成<color=#036b16>{1}%</color>伤害，并使其减速或冰冻
    skill14 = 570,      //全场<color=#036b16>的冰灵菇</color>每攻击<color=#036b16>{0}次</color>，就会召唤<color=#036b16>{1}次</color>暴风雪，使全场僵尸减速或冰冻
}


export class BingDongGuControl extends HeroControl {

    protected attackRange: HeroAttackRange = new HeroAttackRange(0.2, 20);

    static shootNum = 0

    private shootDir: Vec3 = Vec3.UP;    //发射方向

    Init() {
        this.RegisterSkill(SkillPlayType.After, SkillIdType.skill1, this.SkillAction1.bind(this));
        this.RegisterSkill(SkillPlayType.After, SkillIdType.skill11, this.SkillAction1.bind(this));
        // this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill4, this.SkillAction4.bind(this));
        // this.RegisterSkill(SkillPlayType.Before, 93, this.BackSkillAction.bind(this));

    }

    //默认攻击
    DefaultSkillAction() {
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShoot) => {
            skillFunc.shootDir = this.shootDir;
            skillFunc.hp = 1;
        });
        AudioManager.Inst().Play(AudioTag.bingdonggu);
        let skill7 = this.GetGoodSkill(SkillIdType.skill7, SkillIdType.skill14);
        if (skill7) {
            BingDongGuControl.shootNum++;
            if (skill7.pram1 == BingDongGuControl.shootNum) {
                BingDongGuControl.shootNum = 0
                SceneEffect.Inst().Play(SceneEffectConfig.BingDongGuBaoFengXue, this.scene.node, this.scene.node.worldPosition);
                let monsters = BattleDynamicHelper.GetMonsterMap(this.hero.tag);
                for (let [key, monster] of monsters) {
                    let bingdong = 50;
                    if (MathHelper.RandomResult(bingdong, 100)) {
                        this.AddBingDongBuff(monster);
                    } else {
                        monster.AddBuff(<IMonsterObjBuffData>{
                            buffType: MonsterObjBuffType.JianSu,
                            time: this.GetJianSuTime(),
                            hero: this.hero,
                            p1: this.GetJianSuValue(),
                        })

                    }
                }
            }
        }
    }

    //冰冻菇命中敌人后，30%几率在其周围1格产生1次冰爆，几率对周围敌人减速或冰冻
    //冰冻菇冰爆冰冻敌人的几率+20%
    //冰冻菇冰爆冰冻敌人时，其周围敌人10%几率被冰冻
    SkillAction1(skill: CfgSkillData, event: SkillColliderEvent) {
        let skill11 = this.GetHasSkill(SkillIdType.skill11)
        if(skill11 && skill.skill_id != SkillIdType.skill11){
            return;
        }

        let monster_fh = event.GetFirstHitObj();
        let tValue = skill.pram1 + this.skillBuff.bingdonggailv;
        let monsters = this.GetRoundMonsters(1, monster_fh.centerWorldPos);
        for (let monster of monsters) {
            if (MathHelper.RandomResult(tValue, 100)) {
                let skill2 = this.GetHasSkill(SkillIdType.skill2);
                let skill12 = this.GetHasSkill(SkillIdType.skill12);
                let param = skill12 ? skill12.pram1 : 0;
                if(param == 0 && skill2){
                    param = skill2.pram1;
                }

                let bingdong = 50 + param;
                if (MathHelper.RandomResult(bingdong, 100)) {
                    this.AddBingDongBuff(monster);
                } else {
                    monster.AddBuff(<IMonsterObjBuffData>{
                        buffType: MonsterObjBuffType.JianSu,
                        time: this.GetJianSuTime(),
                        hero: this.hero,
                        p1: this.GetJianSuValue(),
                    })

                }
                let skill4 = BattleData.Inst().GetSkillCfg(SkillIdType.skill4);
                if (BattleData.Inst().IsHasSkillByData(skill4,this.hero.tag) && monster.HasBuff(MonsterObjBuffType.BingDong)) {
                    let monsters_bd = this.GetRoundMonsters(1, monster.centerWorldPos);
                    monsters_bd.forEach(monster_bd => {
                        let tValue2 = 10;
                        if (MathHelper.RandomResult(tValue2, 100)) {
                            this.AddBingDongBuff(monster);
                        }
                    })
                }
            }
        }
    }

    //冰冻时间
    GetBingDongTime(): number {
        let time = this.hero.attriCfg.cold_time;
        let skill10 = this.GetHasSkill(SkillIdType.skill10);
        if(skill10){
            time = time += skill10.pram1;
        }
        return time;
    }

    //减速时间
    GetJianSuTime(): number {
        return this.hero.attriCfg.moderate_time + this.skillBuff.jiansutime;
    }

    //减速效果
    GetJianSuValue(): number {
        return (this.hero.attriCfg.moderate_effect + this.skillBuff.slowDown) / 100;
    }

    static defaultJinaSuBuff: IMonsterObjBuffData;
    GongJiSkillAction(monster: MonsterObj, event: SkillColliderEvent) {
        let skill6 = this.GetHasSkill(SkillIdType.skill6);
        let skill13 = this.GetHasSkill(SkillIdType.skill13);
        if(skill6 || skill13 ){
            let param = 0;
            if(skill13){
                param = skill13.pram1 / 100;
            }else if(skill6){
                param = skill6.pram1 / 100;
            }

            if (MathHelper.RandomResult(param, 100)) {
                this.PlayBingHuan(monster);
                let skill8 = BattleData.Inst().GetSkillCfg(SkillIdType.skill8);
                if(BattleData.Inst().IsHasSkillByData(skill8,this.hero.tag)){
                    if(MathHelper.RandomResult(skill8.pram1, 100)){
                        this.scheduleOnce(()=>{
                            this.PlayBingHuan(monster);
                        }, 1);
                    }
                }
            }
        }


        let attackValue = this.CalculateAttackValue();
        monster.DeductHp(this.hero, attackValue);

        if (BingDongGuControl.defaultJinaSuBuff == null) {
            BingDongGuControl.defaultJinaSuBuff = {
                buffType: MonsterObjBuffType.JianSu,
                time: null,
                hero: null,
                p1: null,
            };
        }
        BingDongGuControl.defaultJinaSuBuff.time = this.GetJianSuTime();
        BingDongGuControl.defaultJinaSuBuff.p1 = this.GetJianSuValue();
        BingDongGuControl.defaultJinaSuBuff.hero = this.hero;

        monster.AddBuff(BingDongGuControl.defaultJinaSuBuff);
    }


    //释放冰环
    PlayBingHuan(monster:MonsterObj){
        if(monster.IsDied()){
            return;
        }
        let bingdong = 50;
        let skill6 = this.GetHasSkill(SkillIdType.skill6);
        let skill13 = this.GetHasSkill(SkillIdType.skill13);
        if(skill6 == null && skill13 == null){
            return;
        }
        let harmScale = 1;
        if(skill13){
            harmScale = skill13.pram2 / 100;
        }else if(skill6){
            harmScale = skill6.pram2 / 100;
        }

        let attackValue = this.CalculateAttackValue(0, harmScale);
        monster.DeductHp(this.hero, attackValue);
        SceneEffect.Inst().Play(SceneEffectConfig.BingDongGuBingHuan, this.scene.node, monster.node.worldPosition,null);
        if (MathHelper.RandomResult(bingdong, 100)) {
            this.AddBingDongBuff(monster);
        } else {
            monster.AddBuff(<IMonsterObjBuffData>{
                buffType: MonsterObjBuffType.JianSu,
                time: this.GetJianSuTime(),
                hero: this.hero,
                p1: this.GetJianSuValue(),
            })
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
        this.GongJiSkillAction(monster, event)
    }

    protected OnMonsterEnter(monster: MonsterObj) {
        this.shootDir = monster.worldPosition.y >= this.node.worldPosition.y ? Vec3.UP : new Vec3(0, -1, 0);
    }


    //添加冰冻buff
    AddBingDongBuff(monster:MonsterObj){
        if(monster.IsDied()){
            return;
        }
        let skill9 = BattleData.Inst().GetSkillCfg(SkillIdType.skill9);
        if(BattleData.Inst().IsHasSkillByData(skill9,this.hero.tag)){
            if(MathHelper.RandomResult(skill9.pram2) && monster.hpProgress < skill9.pram1 / 100){
                monster.ZhanSha(this.hero);
                return;
            }
        }
        monster.AddBuff(<IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.BingDong,
            time: this.GetBingDongTime(),
            hero: this.hero,
        })
    }

}


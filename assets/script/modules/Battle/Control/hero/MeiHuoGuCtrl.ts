import { HeroSkillId } from "modules/Battle/HeroSkillId";
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from "../HeroControl";
import { SkillColliderEvent, SkillFunc } from "modules/Battle/Function/SkillFunc";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { MonsterObj } from "modules/Battle/Object/MonsterObj";
import { BattleData } from "modules/Battle/BattleData";
import { CELL_WIDTH, IMonsterObjBuffData, MAP_COL, MonsterObjBuffType, SkillPlayType } from "modules/Battle/BattleConfig";
import { CfgSkillData } from "config/CfgEntry";
import { MathHelper } from "../../../../helpers/MathHelper";
import { SkillRange } from "modules/Battle/Function/SkillRange";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { FIGHT_SCALE } from "modules/Battle/BattleConfig";

enum MeiHuoGuRes {
    Normal = "meihuogu_1",
    MeiHuo="meihuogu_meihuo_1",
}

export class MeiHuoGuCtrl extends HeroControl{

    protected attackRange: HeroAttackRange = new HeroAttackRange(0.5,4);
    private base_attack_dis = 162;//魅惑菇基础攻击长度
    private kill_fear_add_attack =0;//击杀恐惧敌人加的攻击力%s
    private timeHt:any; //击杀恐惧敌人加攻击力倒计时

    private meihuo_num=0;//可被魅惑的怪物数量

    private angleNum:number = 0;

    protected skillFuncRes = {
        [MeiHuoGuRes.Normal]: SkillFuncResInit.Create(),
        [MeiHuoGuRes.MeiHuo]: SkillFuncResUnlock.Create(HeroSkillId.MeiHuoGu.MeiHuo),
    }

    Init(){
        this.RegisterSkill(SkillPlayType.After, HeroSkillId.MeiHuoGu.MeiHuo,this.SkillMeiHuoAfter.bind(this));
        this.AddSmartDataCare(this.battleInfo, this.ReSetAttackRange.bind(this), "skillListMap");
        this.ReSetAttackRange();
    }

    ReSetAttackRange() {
        BattleData.Inst().HandleCountSkill(HeroSkillId.MeiHuoGu.AttackDis, (cfg, count) => {
            this.attackRange.h = 4+ cfg.pram1/100*count;
            this.attackRange.ReSetAABB();
        },this.hero.tag)
    }

    //默认攻击
    DefaultSkillAction() {
        AudioManager.Inst().Play(AudioTag.MeiHuoGu);
        this.CrateSkillFuncByName(MeiHuoGuRes.Normal, (skillFunc: SkillFunc) => {
            //魅惑菇攻击距离延长{0}格
            BattleData.Inst().HandleCountSkill(HeroSkillId.MeiHuoGu.AttackDis, (cfg, count) => {
                let sc = 1 +  cfg.pram1/100*count // +((CELL_WIDTH * FIGHT_SCALE * cfg.pram1 / this.base_attack_dis).toFixed(2))*count
                skillFunc.playNode.setScale(1, sc);
            },this.hero.tag)
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
            skillFunc.hp = 1;
        });
    }

    //魅惑菇攻击时{0}%几率使周围{1}个敌人进入魅惑状态
    SkillMeiHuoAfter(skill: CfgSkillData, event: SkillColliderEvent) {
        let skill_meihuo = BattleData.Inst().GetSkillCfg(HeroSkillId.MeiHuoGu.MeiHuo);
        let meihuo_rate = +skill_meihuo.pram1;
        //魅惑菇释放魅惑几率+{0}%
        BattleData.Inst().HandleCountSkill(HeroSkillId.MeiHuoGu.MeiHuoRate, (cfg, count) => {
            meihuo_rate += cfg.pram1*count;
        },this.hero.tag)
        if (MathHelper.RandomResult(meihuo_rate, 100)) {
            this.CrateHitSkillFuncByName(MeiHuoGuRes.MeiHuo, this.node.worldPosition, this.OnMeiHuoHitEvent.bind(this), (skillFunc: SkillRange) => {
                this.PlaySkill(skillFunc);
                let meihuo_num = +skill_meihuo.pram2;
                //魅惑菇魅惑敌人数量+{0}
                BattleData.Inst().HandleCountSkill(HeroSkillId.MeiHuoGu.MeiHuoNum, (cfg, count) => {
                    meihuo_num += cfg.pram1*count;
                },this.hero.tag)
                this.meihuo_num = meihuo_num;
            });
        }
    }

    OnMeiHuoHitEvent(event: SkillColliderEvent) {
        if (this.meihuo_num > 0) {
            let monster = event.GetFirstHitObj();
            if (!monster.HasBuff(MonsterObjBuffType.MeiHuo)) {
                this.meihuo_num--;
                let time = 2;
                let skill_add_times = BattleData.Inst().GetSkillCfg(HeroSkillId.MeiHuoGu.AddMeiHuoTime);
                if (this.IsHasSkillByData(skill_add_times)) {
                    time += +skill_add_times.pram1;
                }

                // 被魅惑，受伤+x%
                let p1:number;
                // 362词条处理
                BattleData.Inst().HandleCountSkill(HeroSkillId.MeiHuoGu.Skill9, (skill, count)=>{
                    p1 = skill.pram1 * count;
                },this.hero.tag)

                // 363词条处理
                BattleData.Inst().HandleSkill(HeroSkillId.MeiHuoGu.Skill10, (skill)=>{
                    let monsters = this.GetRoundMonsters(1, monster.worldPosition);
                    let count = 0;
                    for(let i = 0; i < monsters.length; i++){
                        if(!monsters[i].HasBuff(MonsterObjBuffType.MeiHuo) && monsters[i] != monster){
                            monsters[i].AddBuff(<IMonsterObjBuffData>{
                                buffType: MonsterObjBuffType.MeiHuo,
                                time: time,
                                hero: this.hero,
                                p1: p1,
                            })
                            count ++;
                        }
                        if(count >= skill.pram1){
                            break;
                        }
                    }
                }, this.hero.tag)

                monster.AddBuff(<IMonsterObjBuffData>{
                    buffType: MonsterObjBuffType.MeiHuo,
                    time: time,
                    hero: this.hero,
                    p1: p1,
                })

            }
        }
    }

    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        let atkVal = this.GetTotalAttackValue(monster);
        monster.DeductHp(this.hero, atkVal);

        ///魅惑菇击杀恐惧下的敌人，魅惑菇攻击力+X%，持续{1}秒
        let skill_killfear = BattleData.Inst().GetSkillCfg(HeroSkillId.MeiHuoGu.KillFearAddAttack);
        if(this.IsHasSkillByData(skill_killfear) && monster.hp<=0 && monster.HasBuff(MonsterObjBuffType.KonJu)){
            this.kill_fear_add_attack = +skill_killfear.pram1;
            this.timeHt = setTimeout(()=>{
                this.kill_fear_add_attack = 0;
            },+skill_killfear.pram2 * 1000)
        }
    }
    

    //计算伤害
    GetTotalAttackValue(monster: MonsterObj): number {
        let value = this.attackValue;
        //魅惑菇击杀恐惧敌人加的攻击力
        value += value * (this.kill_fear_add_attack / 100);
        //总伤害
        let total_val = value;

        //魅惑菇攻击恐惧下的敌人，伤害+X%
        BattleData.Inst().HandleCountSkill(HeroSkillId.MeiHuoGu.DamFear, (cfg, count) => {
            total_val += value * (cfg.pram1 / 100)*count;
        },this.hero.tag)
        return total_val;
    }

    //行为销毁事件
    onDisable() {
        if (this.timeHt) {
            clearTimeout(this.timeHt);
            this.timeHt = null;
        }
    }

    protected OnMonsterEnter(monster:MonsterObj){
        //this.shootDir = monster.worldPosition.y >= this.node.worldPosition.y ? Vec3.UP : new Vec3(0,-1,0);
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }
}

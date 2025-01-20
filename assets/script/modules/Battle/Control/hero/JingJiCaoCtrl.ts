import { SkillColliderEvent, SkillFunc } from "modules/Battle/Function/SkillFunc";
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from "../HeroControl";
import { SkillRange } from "modules/Battle/Function/SkillRange";
import { BattleData } from "modules/Battle/BattleData";
import { HeroSkillId } from "modules/Battle/HeroSkillId";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { CELL_WIDTH, FIGHT_SCALE, IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType, ZHONG_JI_SCALE } from "modules/Battle/BattleConfig";
import { MonsterObj } from "modules/Battle/Object/MonsterObj";
import { MathHelper } from "../../../../helpers/MathHelper";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { SkillShoot } from "modules/Battle/Function/SkillShoot";
import { Vec3 } from "cc";
import { BattleHarmShowIconType } from "modules/Battle/BattleView";
import { MonterBuff } from "modules/Battle/Function/MonsterBuff";
import { CfgSkillData } from "config/CfgEntry";

enum JingJiCaoRes {
    Normal = "jingjicao_1",
    Normal2 = "jingjicao_2",
    Chang = "jingjicao_chang_1",
    Chang2 = "jingjicao_chang_2",
    XueBao = "jingjicao_xuebao",
}
export class JingJiCaoCtrl extends HeroControl{
    protected attackRange: HeroAttackRange = new HeroAttackRange(1, 5);
    private jingjicao_scale = 1; //荆棘草长度
    private angleNum:number = 0;

    protected skillFuncRes = {
        [JingJiCaoRes.Normal]: SkillFuncResInit.Create([{ stage: 4, resName: JingJiCaoRes.Normal2 }]),
        [JingJiCaoRes.XueBao]: SkillFuncResInit.Create(),
        [JingJiCaoRes.Chang]: SkillFuncResUnlock.Create(HeroSkillId.JingJiCao.JuLi,[{ stage: 4, resName: JingJiCaoRes.Chang2 }]),
    }

    private attackCount = 1;    //攻击次数

    Init(){
        this.RegisterSkillHandle(HeroSkillId.JingJiCao.LianXu, this.AddAttackCount.bind(this))
        this.RegisterSkillHandle(HeroSkillId.JingJiCao.Skill10, this.AddAttackCount.bind(this));
        this.RegisterSkillHandle(HeroSkillId.JingJiCao.Skill14, this.AddAttackCount.bind(this));
        this.OnSkillChange();
    }

    AddAttackCount(skill:CfgSkillData){
        if(skill.pram1 > this.attackCount){
            this.attackCount = skill.pram1;
        }
    }
    
    OnSkillChange() {
        //this.jingjicao_scale = BattleData.Inst().IsHasSkill(HeroSkillId.JingJiCao.ShenChang,this.hero.tag) ? 1.5 : 1;
        this.jingjicao_scale = 1;
        this.attackRange.h=(BattleData.Inst().IsHasSkill(HeroSkillId.JingJiCao.JuLi,this.hero.tag)?7:5)*this.jingjicao_scale;
        this.attackRange.w=BattleData.Inst().IsHasSkill(HeroSkillId.JingJiCao.FourDirect,this.hero.tag)?this.attackRange.h:1;
        this.attackRange.ReSetAABB();
    }
    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }
     //默认攻击
    DefaultSkillAction() {
        for(let i = 0; i < this.attackCount; i++){
            this.scheduleOnce(this.PlayNormalSkill.bind(this), i / BattleData.Inst().battleInfo.globalTimeScale);
        }
    }

    PlayNormalSkill(){
        if(!this.isBattle){
            return;
        }
        let res = BattleData.Inst().IsHasSkill(HeroSkillId.JingJiCao.JuLi,this.hero.tag) ? JingJiCaoRes.Chang : JingJiCaoRes.Normal
        this.CrateSkillFuncByName(res, (skillFunc: SkillShoot) => {
            skillFunc.startPos = new Vec3(0,90,0)
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
            skillFunc.node.setScale(1, this.jingjicao_scale);
            skillFunc.OnStop(this.OnSkillStopEvent.bind(this));
        });
        if(BattleData.Inst().IsHasSkill(HeroSkillId.JingJiCao.FourDirect,this.hero.tag)){
            this.SkillFourDirectBefore();
        }
    }

    //荆棘草朝前后左右发出荆棘
    SkillFourDirectBefore() {
        let res = BattleData.Inst().IsHasSkill(HeroSkillId.JingJiCao.JuLi,this.hero.tag) ? JingJiCaoRes.Chang : JingJiCaoRes.Normal
        this.CrateSkillFuncByName(res, (skillFunc: SkillShoot) => {
            skillFunc.startPos = new Vec3(0,90,0)
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum == 0 ? 180 : 0);
            skillFunc.node.setScale(1, this.jingjicao_scale);
            skillFunc.OnStop(this.OnSkillStopEvent.bind(this));
        });
        this.CrateSkillFuncByName(res, (skillFunc: SkillShoot) => {
            skillFunc.startPos = new Vec3(0,90,0)
            skillFunc.node.setRotationFromEuler(0,0,-90);
            skillFunc.node.setScale(1, this.jingjicao_scale);
            skillFunc.OnStop(this.OnSkillStopEvent.bind(this));
        });
        this.CrateSkillFuncByName(res, (skillFunc: SkillShoot) => {
            skillFunc.startPos = new Vec3(0,90,0)
            skillFunc.node.setRotationFromEuler(0,0,90);
            skillFunc.node.setScale(1, this.jingjicao_scale);
            skillFunc.OnStop(this.OnSkillStopEvent.bind(this));
        });
    }

    OnSkillStopEvent(skillFunc: SkillShoot) {
        // if (BattleData.Inst().IsHasSkill(HeroSkillId.JingJiCao.LianXu)) {
        //     let res = BattleData.Inst().IsHasSkill(HeroSkillId.JingJiCao.JuLi) ? JingJiCaoRes.Chang : JingJiCaoRes.Normal
        //     this.CrateHitSkillFuncByName(res, this.node.worldPosition, this.OnHitEvent.bind(this), (skill: SkillShoot) => {
        //         skill.startPos = new Vec3(0, 90, 0);
        //         skill.node.setRotationFromEuler(skillFunc.node.eulerAngles);
        //         skill.node.setScale(1, this.jingjicao_scale);
        //         this.PlaySkill(skill);
        //     });
        // }
    }

    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;

        // 处理369词条
        let skill9 = this.GetHasSkill(HeroSkillId.JingJiCao.Skill9);
        let skill13 = this.GetHasSkill(HeroSkillId.JingJiCao.Skill13);
        let tSkill = skill13 ?? skill9;

        let atkVal = this.GetTotalAttackValue(monster);
        let harmIconType = null;
        if(tSkill && monster.hpProgress < tSkill.pram1 / 100){
            atkVal = atkVal * ZHONG_JI_SCALE
            harmIconType = BattleHarmShowIconType.zhongji;
        }

        monster.DeductHp(this.hero, atkVal, harmIconType);
        this.CrateHitSkillFunc(this.hitEffectPath, monster.centerWorldPos, () => {}, (skillFunc: SkillRange) => {
            this.PlaySkill(skillFunc);
        });
        //荆棘草伸出的尖刺更长，伤害+{0}%，{1}%几率使敌人禁锢{2}秒
        let skill_shen_chang = this.GetHasSkill(HeroSkillId.JingJiCao.ShenChang);
        let skill12 = this.GetHasSkill(HeroSkillId.JingJiCao.Skill12);
        let tShenChangSkill = skill12 ?? skill_shen_chang

        if (tShenChangSkill) {
            let rate = +tShenChangSkill.pram2;
            let time = +tShenChangSkill.pram3;
            // 处理368词条
            BattleData.Inst().HandleCountSkill(HeroSkillId.JingJiCao.Skill8, (skill,count)=>{
                time += skill.pram1 * count;
            },this.hero.tag)
            if (MathHelper.RandomResult(rate, 100)) {
                monster.AddBuff(<IMonsterObjBuffData>{
                    buffType: MonsterObjBuffType.JinGu,
                    time: time,
                    hero: this.hero,
                })
            }
        }
        //荆棘草攻击流血的敌人,{0}%几率使其身上出现{1}次血爆，造成{2}%伤害且流血层数+{3}
        if (monster.HasBuff(MonsterObjBuffType.LiuXue)) {
            let skill11 = this.GetHasSkill(HeroSkillId.JingJiCao.Skill11);
            let skill_xuabao = this.GetHasSkill(HeroSkillId.JingJiCao.XueBao);
            let tSkill = skill11 ? skill11 : skill_xuabao;

            let rateCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.JingJiCao.ShenChang);
            let rate = +rateCfg.pram1;
            if (tSkill && MathHelper.RandomResult(rate, 100)) {
                AudioManager.Inst().Play(AudioTag.jingjicaoxuebao);
                this.CrateHitSkillFuncByName(JingJiCaoRes.XueBao, monster.node.worldPosition, this.OnXueBaoHitMonster.bind(this), (skill: SkillRange) => {
                    this.PlaySkill(skill);
                });
                for (let index = 0; index < +tSkill.pram4; index++) {
                    monster.AddBuff(<IMonsterObjBuffData>{
                        buffType: MonsterObjBuffType.LiuXue,
                        time: 5,
                        hero: this.hero,
                        p1: MonterBuff.DefaultDamge(atkVal),
                    })
                }
            }
        }
    }

    OnXueBaoHitMonster(event: SkillColliderEvent) {
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        let atkVal = this.GetTotalAttackValue(monster);
        let skill11 = this.GetHasSkill(HeroSkillId.JingJiCao.Skill11);
        let skill_xuabao = this.GetHasSkill(HeroSkillId.JingJiCao.XueBao);
        let tSkill = skill11 ? skill11 : skill_xuabao;
        if(!tSkill){
            return;
        }
        let att_val = atkVal * tSkill.pram3 / 100
        monster.DeductHp(this.hero, att_val);
    }

    //计算伤害
    GetTotalAttackValue(monster: MonsterObj): number {
        let value = this.attackValue;
        //总伤害
        let total_val = value;
        //荆棘草伸出的尖刺更长，伤害+{0}%，
        let skill_shen_chang = this.GetHasSkill(HeroSkillId.JingJiCao.ShenChang);
        let skill12 = this.GetHasSkill(HeroSkillId.JingJiCao.Skill12)
        let tSkill = skill12 ?? skill_shen_chang;
        if (tSkill)
            total_val += this.baseAttackValue * +tSkill.pram1 / 100;
        return total_val;
    }
}
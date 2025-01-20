import { SkillShoot } from "modules/Battle/Function/SkillShoot";
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from "../HeroControl";
import { SkillColliderEvent } from "modules/Battle/Function/SkillFunc";
import { HeroSkillId } from "modules/Battle/HeroSkillId";
import { BattleEventType, IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { BattleData } from "modules/Battle/BattleData";
import { BattleDynamicHelper } from "modules/Battle/BattleDynamicHelper";
import { MathHelper } from "../../../../helpers/MathHelper";
import { MonsterObj } from "modules/Battle/Object/MonsterObj";
import { EventCtrl } from "modules/common/EventCtrl";
import { SkillStraight } from "modules/Battle/Function/SkillStraight";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { SkillRange } from "modules/Battle/Function/SkillRange";
import { Vec3 } from "cc";

enum HaiDaiEMoRes {
    Normal = "haidaiemo_1",
    Normal2 = "haidaiemo_2",
    ChanRao="haidaiemo_chanrao",
    KangFen = "haidaiemo_kangfen",
    Ray = "haidaiemo_ray",
}
export class HaiDaiEMoCtrl extends HeroControl{

    protected attackRange: HeroAttackRange = new HeroAttackRange(0.5,20);

    private is_kangfen = false;//是否亢奋
    private timeHt:any; //亢奋倒计时
    private jishaCount=0;//击杀数量
    private angleNum:number = 0;

    protected skillFuncRes = {
        [HaiDaiEMoRes.Normal]: SkillFuncResInit.Create([{ stage: 4, resName: HaiDaiEMoRes.Normal2 }]),
        [HaiDaiEMoRes.ChanRao]: SkillFuncResUnlock.Create(HeroSkillId.HaiDaiEMo.ChanRao),
        [HaiDaiEMoRes.KangFen]: SkillFuncResUnlock.Create(HeroSkillId.HaiDaiEMo.KangFen),
        [HaiDaiEMoRes.Ray ]: SkillFuncResUnlock.Create(HeroSkillId.HaiDaiEMo.Ray),
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

    Init(){
        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.HaiDaiEMo.ChanRao,this.SkillChanRaoBefore.bind(this));
        EventCtrl.Inst().on(BattleEventType.MonsterDie, this.OnMonsterDie, this);
    }

    //默认攻击
    DefaultSkillAction() {
        let skillHp = 1
        let skill12 = this.GetHasSkill(HeroSkillId.HaiDaiEMo.Skill12);
        if(skill12){
            let count = this.GetSkillCount(skill12);
            skillHp += count * skill12.pram1;
        }

        AudioManager.Inst().Play(AudioTag.haidei);
        let offX = 25;
        this.CrateSkillFuncByName(HaiDaiEMoRes.Normal, (skillFunc: SkillShoot) => {
            skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
            let posX = skillFunc.node.position.x;
            let posY = skillFunc.node.position.y;
            skillFunc.node.setPosition(posX + (this.is_kangfen ? - offX : 0), posY);
            skillFunc.hp = skillHp;
        });
        if (this.is_kangfen) {
            this.CrateSkillFuncByName(HaiDaiEMoRes.Normal, (skillFunc: SkillShoot) => {
                skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
                let posX = skillFunc.node.position.x;
                let posY = skillFunc.node.position.y;
                skillFunc.node.setPosition(posX + offX, posY);
                skillFunc.hp = skillHp;
            });
        }
    }

    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        let atkVal = this.GetTotalAttackValue(monster);
        monster.DeductHp(this.hero, atkVal);
        if(monster.IsDied()){
            this.JiShaMonster(monster);
        }
        AudioManager.Inst().PlaySceneAudio(AudioTag.haidaiemoshouji);
        if(event.skillFunc.hp <= 0){
            this.StopSkill(event.skillFunc);
        }
    }

    //缠绕
    SkillChanRaoBefore() {
        let skill_chanrao = BattleData.Inst().GetSkillCfg(HeroSkillId.HaiDaiEMo.ChanRao);
        let value = +skill_chanrao.pram1;
        let skill_11 = this.GetHasSkill(HeroSkillId.HaiDaiEMo.Skill11)
        if(skill_11){
            let count = this.GetSkillCount(skill_11);
            value = value + count * skill_11.pram1;
        }
        if (MathHelper.RandomResult(value, 100)) {
            this.CrateHitSkillFuncByName(HaiDaiEMoRes.ChanRao, this.hero.node.worldPosition,
                this.OnChanRaoHit.bind(this), (skillFunc: SkillStraight) => {
                    skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
                    let chuandi_num = 0;
                    BattleData.Inst().HandleCountSkill(HeroSkillId.HaiDaiEMo.ChanRaoChuanDi, (cfg, count) => {
                        chuandi_num = cfg.pram1*count;
                    },this.hero.tag)
                    skillFunc.hp = chuandi_num + 1;
                    this.PlaySkill(skillFunc);
                });
        }
    }

    OnChanRaoHit(event: SkillColliderEvent) {
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        let time = 2;
        BattleData.Inst().HandleCountSkill(HeroSkillId.HaiDaiEMo.AddKongJuTime, (cfg, count) => {
            time += cfg.pram1*count;
        },this.hero.tag);

        let jiansu:number = null;
        BattleData.Inst().HandleCountSkill(HeroSkillId.HaiDaiEMo.Skill9, (skill, count)=>{
            jiansu = skill.pram1 * count;
        },this.hero.tag)

        monster.AddBuff(<IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.KonJu,
            hero: this.hero,
            time: time,
            p1: jiansu,
        });
        if (event.skillFunc.hp <= 0) {
            this.StopSkill(event.skillFunc);
        } else {
            let funcPos = event.skillFunc.playNode.worldPosition;
            let mo = BattleDynamicHelper.FindClosestMonster(funcPos, Array.from(event.skillFunc.excludeMap.keys()), this.hero.tag);
            if (mo != null) {
                let angle = 360 - MathHelper.GetVecAngle(funcPos, mo.centerWorldPos);
                event.skillFunc.SetEulerAngle(angle);
            } else {
                event.skillFunc.hp = 0;
                this.StopSkill(event.skillFunc);
            }
        }
    }

     //击杀怪物 死亡射线
    JiShaMonster(monster: MonsterObj) {
        this.jishaCount++;
        if (BattleData.Inst().IsHasSkill(HeroSkillId.HaiDaiEMo.Ray,this.hero.tag)) {
            let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.HaiDaiEMo.Ray);
            if (this.jishaCount >= skill.pram1) {
                this.jishaCount = 0;

                let rayCount = 1;
                BattleData.Inst().HandleSkill(HeroSkillId.HaiDaiEMo.Skill10, (skill)=>{
                    rayCount = skill.pram1;
                }, this.hero.tag);

                let x = this.node.worldPosition.x
                for(let i = -(rayCount - 1) / 2; i <= (rayCount - 1) / 2; i++){
                    this.PlayRay(new Vec3(x + i * 20, this.node.worldPosition.y, 0));
                }
            }
        }
    }

    //释放射线
    PlayRay(pos:Vec3){
        this.CrateHitSkillFuncByName(HaiDaiEMoRes.Ray, pos,
            this.OnRayHit.bind(this), (skillFunc: SkillStraight) => {
                skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
                this.PlaySkill(skillFunc);
            });
    }

    OnRayHit(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        let atkVal = this.GetTotalAttackValue(monster);
        let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.HaiDaiEMo.Ray);
        let beishu = MathHelper.GetRandomNum(+skill.pram3, +skill.pram4);
        let total_attval = beishu * atkVal;
        monster.DeductHp(this.hero, total_attval);
    }

    //计算伤害
    GetTotalAttackValue(monster: MonsterObj): number {
        let value = this.attackValue
        //总伤害
        let total_val = value;
        //攻击灼烧和冰冻伤害加成
        let skill_dam_zhuoshaobingdong = BattleData.Inst().GetSkillCfg(HeroSkillId.HaiDaiEMo.DamZhuoShaoBingDong);
        if (BattleData.Inst().IsHasSkillByData(skill_dam_zhuoshaobingdong,this.hero.tag) && this.is_kangfen) {
            if (monster.HasBuff(MonsterObjBuffType.ZhuoShao)) {
                total_val += value * +skill_dam_zhuoshaobingdong.pram1 / 100;
            }
            if (monster.HasBuff(MonsterObjBuffType.BingDong)) {
                total_val += value * +skill_dam_zhuoshaobingdong.pram2 / 100;
            }
        }
        return total_val;
    }

    //攻击速度 隔多少秒攻击一次
    GetTotalAttackSpeed(): number {
        let value = this.attackSpeed;
        if (this.is_kangfen){
            let skill_kangfen = BattleData.Inst().GetSkillCfg(HeroSkillId.HaiDaiEMo.KangFen);
            value -= this.baseSpeedValue * +skill_kangfen.pram2 / 100;
        }
        return value;
    }

    private kangfen_func :SkillRange;
    OnMonsterDie(monster: MonsterObj) {
        let skill_kangfen = BattleData.Inst().GetSkillCfg(HeroSkillId.HaiDaiEMo.KangFen);
        //恐惧时死亡--亢奋
        if (BattleData.Inst().IsHasSkillByData(skill_kangfen,this.hero.tag) && monster.HasBuff(MonsterObjBuffType.KonJu)) {
            let time = +skill_kangfen.pram1;
            let skill_add_kangfen_time = BattleData.Inst().GetSkillCfg(HeroSkillId.HaiDaiEMo.AddKangFenTime);
            if (BattleData.Inst().IsHasSkillByData(skill_kangfen,this.hero.tag))
                time += +skill_add_kangfen_time.pram1;
            if (!this.is_kangfen) {
                this.CrateSkillFuncByName(HaiDaiEMoRes.KangFen, (skillFunc: SkillRange) => {
                    this.kangfen_func=skillFunc
                    skillFunc.playTime = time
                    // skillFunc.node.setRotationFromEuler(0, 0, this.angleNum);
                });
                this.is_kangfen = true;
                if (this.timeHt) {
                    clearTimeout(this.timeHt);
                    this.timeHt = null;
                }
                this.timeHt = setTimeout(() => {
                    this.is_kangfen = false;
                }, time * 1000)
            }
        }
    }

    OnFightEnd(): void {
        this.is_kangfen = false;
    }

    onDestroy(){
        super.onDestroy();
        EventCtrl.Inst().off(BattleEventType.MonsterDie, this.OnMonsterDie, this);
        if (this.timeHt) {
            clearTimeout(this.timeHt);
            this.timeHt = null;
        }
    }
}
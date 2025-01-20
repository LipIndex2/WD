import { SkillShoot } from "modules/Battle/Function/SkillShoot";
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from "../HeroControl";
import { BattleData } from "modules/Battle/BattleData";
import { HeroSkillId } from "modules/Battle/HeroSkillId";
import { CELL_WIDTH, FIGHT_CELL_WIDTH, FIGHT_SCALE, IMonsterObjBuffData, MonsterObjBuffType } from "modules/Battle/BattleConfig";
import { MonsterObj } from "modules/Battle/Object/MonsterObj";
import { SkillColliderEvent } from "modules/Battle/Function/SkillFunc";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { SkillRange } from "modules/Battle/Function/SkillRange";
import { Intersection2D, Rect, Vec3 } from "cc";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { MathHelper } from "../../../../helpers/MathHelper";
import { KongJuBuff, MonterBuff } from "modules/Battle/Function/MonsterBuff";
enum YouLingLaJiaoRes {
    Normal = "youlinglajiao_1",
    Bomb = "youlinglajiao_bomb",
    TenShapeBomb ="youlinglajiao_tenshapebomb",
    MiShapeBomb ="youlinglajiao_mishapebomb",
}
export class YouLingLaJiaoCtrl extends HeroControl{
    protected attackRange: HeroAttackRange = new HeroAttackRange(0.5,4);
    private angleNum:number = 0;
    private fly_dis:number;//最远飞行距离

    protected skillFuncRes = {
        [YouLingLaJiaoRes.Normal]: SkillFuncResInit.Create(),
        [YouLingLaJiaoRes.Bomb]: SkillFuncResUnlock.Create(HeroSkillId.YouLingLaJiao.Bomb),
        [YouLingLaJiaoRes.TenShapeBomb]: SkillFuncResUnlock.Create(HeroSkillId.YouLingLaJiao.BombTenShape),
        [YouLingLaJiaoRes.MiShapeBomb]: SkillFuncResUnlock.Create(HeroSkillId.YouLingLaJiao.BombMiShape),
    }

    Init(){
        this.OnSkillChange();
    }

    

    OnSkillChange() {
        let skill_add_dis = BattleData.Inst().GetSkillCfg(HeroSkillId.YouLingLaJiao.AddDis);
        let is_skill_dis = this.IsHasSkillByData(skill_add_dis);
        this.fly_dis = 2 + (is_skill_dis ? +skill_add_dis.pram1 : 0);

        if(BattleData.Inst().IsHasSkill(HeroSkillId.YouLingLaJiao.Skill9,this.hero.tag)){
            this.attackRange.h = 20;
            this.attackRange.ReSetAABB();
        }
    }

    //默认攻击
    DefaultSkillAction() {
        AudioManager.Inst().Play(AudioTag.youlinglajiaofashe);
        this.CrateSkillFuncByName(YouLingLaJiaoRes.Normal, (skillFunc: SkillShoot) => {
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
            skillFunc.shootLength = this.fly_dis * CELL_WIDTH*FIGHT_SCALE;
            skillFunc.OnStop(this.OnSkillStopEvent.bind(this));
            if(BattleData.Inst().IsHasSkill(HeroSkillId.YouLingLaJiao.Skill9,this.hero.tag)){
                skillFunc.scale = 5;
            }
        });
    }

    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        let atkVal = this.GetTotalAttackValue(monster);
        monster.DeductHp(this.hero, atkVal);

        if(!monster.IsDied()){
            BattleData.Inst().HandleSkill(HeroSkillId.YouLingLaJiao.Skill8, (skill8)=>{
                if(MathHelper.RandomResult(skill8.pram1, 100)){
                    monster.AddBuff(KongJuBuff.CrateData(this.hero,5))
                }
            }, this.hero.tag)
        }

        if(BattleData.Inst().IsHasSkill(HeroSkillId.YouLingLaJiao.Skill9,this.hero.tag)){
            this.CrateHitSkillFuncByName(YouLingLaJiaoRes.Bomb, monster.worldPosition,
                this.OnBombHit.bind(this), (skillFunc: SkillRange) => {
                    this.PlaySkill(skillFunc);
                    AudioManager.Inst().Play(AudioTag.youlinglajiaobaozha);
                });
        }
    }

    OnSkillStopEvent(skill: SkillShoot) {
        let skill_bomb = BattleData.Inst().GetSkillCfg(HeroSkillId.YouLingLaJiao.Bomb);
        if (this.IsHasSkillByData(skill_bomb)) {
            let res = YouLingLaJiaoRes.Bomb;
            if (BattleData.Inst().IsHasSkill(HeroSkillId.YouLingLaJiao.BombMiShape,this.hero.tag))
                res = YouLingLaJiaoRes.MiShapeBomb;
            else if (BattleData.Inst().IsHasSkill(HeroSkillId.YouLingLaJiao.BombTenShape,this.hero.tag))
                res = YouLingLaJiaoRes.TenShapeBomb;
            this.CrateHitSkillFuncByName(res, skill.playNode.worldPosition,
                this.OnBombHit.bind(this), (skillFunc: SkillRange) => {
                    this.PlaySkill(skillFunc);
                    AudioManager.Inst().Play(AudioTag.youlinglajiaobaozha);
                });
        }
    }

    OnBombHit(event: SkillColliderEvent) {
        let monster = event.GetFirstHitObj();
        // let atkVal = this.GetTotalAttackValue(monster);
        let skill_mi_bomb = BattleData.Inst().GetSkillCfg(HeroSkillId.YouLingLaJiao.BombMiShape);
        let bomb_val= this.GetBaseAttackValue(monster) * +skill_mi_bomb.pram1 / 100;
        let skill_bomb = BattleData.Inst().GetSkillCfg(HeroSkillId.YouLingLaJiao.Bomb);
        let total_val = bomb_val + bomb_val * +skill_bomb.pram1 / 100;
        if (this.IsHasSkillByData(skill_mi_bomb)) {
            total_val += bomb_val * skill_mi_bomb.pram1 / 100;
        }
        if (total_val > 0) {
            monster.AddBuff(<IMonsterObjBuffData>{
                buffType: MonsterObjBuffType.ZhongDu,
                time: 5,
                hero: this.hero,
                p1: MonterBuff.DefaultDamge(total_val),
            })
            monster.DeductHp(this.hero, total_val);
            event.skillFunc.SetExcludeObj(monster);
        }
    }

    //检查目标是否在以wordPos为中心,宽度为w格，高度为h格的范围内
    CheckRange(w: number, h: number, wordPos: Vec3, target_rect: Rect) {
        let range_w = FIGHT_CELL_WIDTH * w;
        let range_h = FIGHT_CELL_WIDTH * h;
        let scopeRect = new Rect(wordPos.x - range_w / 2, wordPos.y - range_h / 2, range_w, range_h);
        return Intersection2D.rectRect(scopeRect, target_rect);
    }

    //计算基础伤害
    GetBaseAttackValue(monster: MonsterObj): number {
        let value = this.attackValue;
        let skill_dis = BattleData.Inst().GetSkillCfg(HeroSkillId.YouLingLaJiao.AddDis);
        if (this.IsHasSkillByData(skill_dis))
            value += value * +skill_dis.pram2 / 100;
        return value
    }

    //计算伤害
    GetTotalAttackValue(monster: MonsterObj): number {
        //基础攻击伤害
        let value = this.GetBaseAttackValue(monster);
        //总伤害
        let total_val = value;

        if(monster.HasBuff(MonsterObjBuffType.XuanYun)){
            let skill_10 = this.GetHasSkill(HeroSkillId.YouLingLaJiao.Skill10);
            let addPer = 0;
            if(skill_10){
                let count = this.GetSkillCount(skill_10);
                addPer += count * skill_10.pram1 / 100;
            }
            let skill_hit_xuanyun = this.GetHasSkill(HeroSkillId.YouLingLaJiao.HitXuanYun);
            if(skill_hit_xuanyun){
                let count = this.GetSkillCount(skill_hit_xuanyun);
                addPer += count * skill_hit_xuanyun.pram1 / 100;
            }
            if(addPer > 0){
                total_val += this.baseAttackValue * addPer;
            }
        }

        let skill9 = BattleData.Inst().GetSkillCfg(HeroSkillId.YouLingLaJiao.Skill9);
        if(this.IsHasSkillByData(skill9)){
            total_val += total_val * skill9.pram1 / 100 
        }
        return total_val;
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }
}
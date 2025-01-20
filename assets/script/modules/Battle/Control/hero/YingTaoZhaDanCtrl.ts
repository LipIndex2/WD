import { HeroSkillId } from "modules/Battle/HeroSkillId";
import { HeroAttackRange, HeroControl, SkillFuncResUnlock} from "../HeroControl";
import { Vec3 } from 'cc';
import { SkillShoot } from "modules/Battle/Function/SkillShoot";
import { MathHelper } from "../../../../helpers/MathHelper";
import { SkillColliderEvent, SkillFunc } from "modules/Battle/Function/SkillFunc";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { MonsterObj } from "modules/Battle/Object/MonsterObj";
import { SkillRange } from "modules/Battle/Function/SkillRange";
import { BattleData } from "modules/Battle/BattleData";
import { CELL_WIDTH, FIGHT_CELL_WIDTH, MonsterObjBuffType, SkillPlayType } from "modules/Battle/BattleConfig";
import {  ZuoShaoBuff } from "modules/Battle/Function/MonsterBuff";
import { SkillBulletTrack } from "modules/Battle/Function/SkillBulletTrack";
import { BattleDynamicHelper } from "modules/Battle/BattleDynamicHelper";
import { SkillFuncLocker } from "../SkillFuncLocker";
import { ResPath } from "utils/ResPath";
import { HeroSkillChangeListener } from "../HeroSkillChangeListener";
import { SceneEffect, SceneEffectConfig } from "modules/scene_obj_spine/Effect/SceneEffect";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";

enum YingTaoZhaDanRes {
    Daodan = "daodan_1",
    DaodanBomb = "daodan_bomb_1",
    ZaDan3 = "yingtaozhadan_3",
    DiLei = "yingtaodilei",
}

export class YingTaoZhaDanCtrl extends HeroControl{

    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);

    private shootDir:Vec3 = new Vec3(0,1,0);    //发射方向

    private hit_times = 0; //攻击次数

    private  daodanLocker : SkillFuncLocker = null;

    private skillListener = new HeroSkillChangeListener();

    protected skillFuncRes = {
        [YingTaoZhaDanRes.Daodan]: SkillFuncResUnlock.Create(HeroSkillId.YingTaoZhaDan.ShootEnemy),
        [YingTaoZhaDanRes.DaodanBomb]: SkillFuncResUnlock.Create(HeroSkillId.YingTaoZhaDan.ShootEnemy),
        [YingTaoZhaDanRes.ZaDan3]: SkillFuncResUnlock.Create(HeroSkillId.YingTaoZhaDan.Skill8),
        [YingTaoZhaDanRes.DiLei]: SkillFuncResUnlock.Create(HeroSkillId.YingTaoZhaDan.Skill9),
    }

    get shootEffectPath(): string {
        let res_id;
        if(BattleData.Inst().IsHasSkill(HeroSkillId.YingTaoZhaDan.Skill8,this.hero.tag)){
            res_id = YingTaoZhaDanRes.ZaDan3;
        }else{
            res_id = this.heroData.bullet_res_id;
        }
        return ResPath.SkillAsset(res_id);
    }


    Init(){
        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.YingTaoZhaDan.ThreeBomb,this.SkillTwreeBombBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.YingTaoZhaDan.ShootEnemy,this.SkillShootEnemyBefore.bind(this));
        this.daodanLocker = new SkillFuncLocker((bullet,initSearch)=>{
            if(initSearch){
                return BattleDynamicHelper.FindRandomMonster(null, this.hero.tag);
            }
            else{
                return BattleDynamicHelper.FindClosestMonster(bullet.node.worldPosition, null, this.hero.tag);
            }
        });
        this.skillListener.tag = this.hero.tag;
        this.skillListener.AddLinsten(HeroSkillId.YingTaoZhaDan.Skill9,()=>{
            this.isSkill9 = true;
            let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.YingTaoZhaDan.Skill9);
            this.skill9Time = skill.pram1;
            this._skill9Time = skill.pram1;
        });
    }

    OnFightStart(): void {
        let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.YingTaoZhaDan.Skill9);
        if(this.IsHasSkillByData(skill)){
            this.skill9Time = skill.pram1;
            this._skill9Time = skill.pram1;
            this.isSkill9 = true;
        }else{
            this.skill9Time = 0;
            this._skill9Time = 0;
            this.isSkill9 = false;
        } 
    }

    private skill9Time = 0;
    private _skill9Time = 0;
    private isSkill9 = false;
    protected Run(dt: number): void {
        if(this.isSkill9){
            this._skill9Time += dt;
            if(this._skill9Time >= this.skill9Time && this.skill9Time != 0){
                this.PlayDiLei();
                this._skill9Time = 0;
            }
        }
    }


    //埋地雷
    PlayDiLei(){
        let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.YingTaoZhaDan.Skill9);
        let n = (skill.pram2 - 1) / 2
        for(let i = -n; i <= n; i++){
            let offsetX = MathHelper.GetRandomNum(-10,10);
            let offsety = MathHelper.GetRandomNum(-10,10);
            let pos = new Vec3(this.node.worldPosition.x + offsetX + i * FIGHT_CELL_WIDTH, this.node.worldPosition.y + 2 * FIGHT_CELL_WIDTH + offsety, 0);
            this.CrateHitSkillFuncByName(YingTaoZhaDanRes.DiLei, pos, (event: SkillColliderEvent)=>{
                event.objs.forEach(monster=>{
                    let attValue = this.CalculateAttackValue(0, skill.pram3 / 100);
                    monster.DeductHp(this.hero, attValue);
                })
                SceneEffect.Inst().Play(SceneEffectConfig.DiLeiBaoZa, null, event.skillFunc.node.worldPosition);
                this.StopSkill(event.skillFunc);
                AudioManager.Inst().PlaySceneAudio(AudioTag.yingtaobaozha);
            }, (skillFunc)=>{
                this.PlaySkill(skillFunc);
            }, this.scene.BottomEffectRoot)
        }
    }



     //默认攻击
    DefaultSkillAction() {
        this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShoot) => {
            skillFunc.shootDir = this.shootDir;
            skillFunc.OnStop(this.OnSkillStop.bind(this))
        });
    }

    SkillTwreeBombBefore(){
        for (let index = 0; index < 2; index++) {
            this.CrateSkillFunc(this.shootEffectPath, (skillFunc: SkillShoot) => {
                let x = MathHelper.GetRandomNum(-100,100)/100;
                let y = MathHelper.GetRandomNum(-100,100)/100;
                skillFunc.shootDir = new Vec3(x,y,0);
                skillFunc.OnStop(this.OnSkillStop.bind(this))
            });             
        }
    }

    SkillShootEnemyBefore() {
        let skill_shoot_enemy = BattleData.Inst().GetSkillCfg(HeroSkillId.YingTaoZhaDan.ShootEnemy);
        if (this.IsHasSkillByData(skill_shoot_enemy) && this.hit_times >= skill_shoot_enemy.pram1) {
            this.hit_times = 0;
            let excludeMos: MonsterObj[] = [];
            for (let enmey = 0; enmey < +skill_shoot_enemy.pram2; enmey++) {
                for (let daodan = 0; daodan <+skill_shoot_enemy.pram3; daodan++) {
                    this.CrateHitSkillFuncByName(YingTaoZhaDanRes.Daodan,this.hero.worldPosition, 
                        this.DaoDanHitEvent.bind(this,YingTaoZhaDanRes.DaodanBomb,1),(skillFunc:SkillBulletTrack)=>{
                        let initAngle = MathHelper.GetRandomNum(0,360);
                        skillFunc.SetEulerAngle(initAngle);
                        this.daodanLocker.BeginLock(skillFunc);
                        this.PlaySkill(skillFunc);
                    });                       
                }
            }
        }
    }

    DaoDanHitEvent(hitName: string, damScale: number, event: SkillColliderEvent) {
        if (!this.daodanLocker.OnHitEvent(event)) {
            return;
        }
        this.daodanLocker.EndLock(event.skillFunc);
        this.StopSkill(event.skillFunc);
        this.CrateHitSkillFuncByName(hitName, event.skillFunc.node.worldPosition,
            (event) => {
                event.objs.forEach(hitMo => {
                    let att_value = this.GetTotalAttackValue(hitMo) * damScale;
                    hitMo.DeductHp(this.hero, att_value);
                    event.skillFunc.SetExcludeObj(hitMo);
                });
            }
            , (skillFunc: SkillRange) => {
                this.PlaySkill(skillFunc);
            });
    }

    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        this.hit_times++;
        this.StopSkill(event.skillFunc);
    }

    OnSkillStop(skill:SkillFunc) {
        this.CrateHitSkillFunc(this.hitEffectPath, skill.playNode.worldPosition, this.OnBombHitEvent.bind(this), (skillFunc: SkillRange) => {
            if(BattleData.Inst().IsHasSkill(HeroSkillId.YingTaoZhaDan.AddBombRange,this.hero.tag)){
                let skill_add_range = BattleData.Inst().GetSkillCfg(HeroSkillId.YingTaoZhaDan.AddBombRange);
                skillFunc.SetScale(+skill_add_range.pram1 / 100 + 1);
            }
            this.PlaySkill(skillFunc);
        });
    }

    //爆炸伤害事件
    OnBombHitEvent(event: SkillColliderEvent) {
        event.objs.forEach(monster => {
            //樱桃修补匠的炸弹会使敌人灼烧 Xs，每秒造成X%伤害
            let skill_buff_zhuoshao = BattleData.Inst().GetSkillCfg(HeroSkillId.YingTaoZhaDan.BuffZhuoshao);
            if (this.IsHasSkillByData(skill_buff_zhuoshao)) {
                let att_val = this.attackValue;
                let skill_add_attack = BattleData.Inst().GetSkillCfg(HeroSkillId.YingTaoZhaDan.AddAttack);
                if (this.IsHasSkillByData(skill_add_attack))
                    att_val *= (+skill_add_attack.pram1 / 100 + 1);
                monster.AddBuff(ZuoShaoBuff.CreateData(
                    this.hero,
                    +skill_buff_zhuoshao.pram1,
                    att_val * +skill_buff_zhuoshao.pram2 / 100))
            }
            let att_value = this.GetTotalAttackValue(monster);
            monster.DeductHp(this.hero, att_value);
            event.skillFunc.SetExcludeObj(monster);
        });
        AudioManager.Inst().PlaySceneAudio(AudioTag.yingtaobaozha);
    }

    //计算伤害
    GetTotalAttackValue(monster: MonsterObj): number {
        let value = this.attackValue;
        //总伤害
        let total_val = value;

        //樱桃修补匠攻击灼烧或冰冻的敌人，对其伤害+X%
        let skill_hit_zhuoshao_bingdong = BattleData.Inst().GetSkillCfg(HeroSkillId.YingTaoZhaDan.HitZhuoshaoBingdong);
        if ((this.IsHasSkillByData(skill_hit_zhuoshao_bingdong) || monster.HasBuff(MonsterObjBuffType.BingDong))
            && monster.HasBuff(MonsterObjBuffType.ZhuoShao)) {
                total_val += this.baseAttackValue * +skill_hit_zhuoshao_bingdong.pram1 / 100;
        }

        //樱桃修补匠造成的灼烧伤害+X %
        let skill_dam_zhuoshao = BattleData.Inst().GetSkillCfg(HeroSkillId.YingTaoZhaDan.DamZhuoShao);
        if (this.IsHasSkillByData(skill_dam_zhuoshao)) {
            total_val += this.baseAttackValue * +skill_dam_zhuoshao.pram1 / 100
        }

        if(BattleData.Inst().IsHasSkill(HeroSkillId.YingTaoZhaDan.Skill8,this.hero.tag)){
            total_val = total_val * 3;
        }

        return total_val;
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.shootDir = new Vec3(0,1,0);
        Vec3.subtract(this.shootDir, monster.node.worldPosition, this.node.worldPosition);
        this.shootDir = this.shootDir.normalize();
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.skillListener.Detroy();
        this.skillListener = null;
    }
}
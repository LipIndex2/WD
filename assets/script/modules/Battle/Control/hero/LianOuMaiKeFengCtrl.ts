import { BattleData } from "modules/Battle/BattleData";
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from "../HeroControl";
import { HeroSkillId } from "modules/Battle/HeroSkillId";
import { SkillColliderEvent, SkillFunc } from "modules/Battle/Function/SkillFunc";
import { MonsterObj } from "modules/Battle/Object/MonsterObj";
import { CELL_WIDTH, IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType } from "modules/Battle/BattleConfig";
import { SkillShoot } from "modules/Battle/Function/SkillShoot";
import { MathHelper } from "../../../../helpers/MathHelper";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { LogError } from "core/Debugger";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { MonterBuff, RuoHuaSuBuff } from "modules/Battle/Function/MonsterBuff";

enum LianOuMaiKeFengRes {
    Normal = "lianoumaikefeng_1",
    JuFeng = "lianoumaikefeng_2",
    YinFu = "lianoumaikefeng_yinfu",
}

export class LianOuMaiKeFengCtrl extends HeroControl{
    protected attackRange: HeroAttackRange = new HeroAttackRange(1,2);
    private longjuanfeng_num=1;//每次攻击释放的龙卷风数量
    private longjuanfeng_resname=LianOuMaiKeFengRes.Normal;//龙卷风攻击特效资源
    private longjuanfeng_dis = 2;//龙卷风最远距离
    protected skillFuncRes = {
        [LianOuMaiKeFengRes.Normal]: SkillFuncResInit.Create(),
        [LianOuMaiKeFengRes.JuFeng]: SkillFuncResUnlock.Create(HeroSkillId.LianOuMaiKeFeng.JuFeng),
        [LianOuMaiKeFengRes.YinFu]: SkillFuncResUnlock.Create(HeroSkillId.LianOuMaiKeFeng.RuoHua),
    }

    Init(){
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.LianOuMaiKeFeng.RuoHua,this.SkillRuoHuaBefore.bind(this));
        this.AddSmartDataCare(this.battleInfo, this.OnCiTiaoFlush.bind(this), "skillListMap");
        this.OnCiTiaoFlush();
    }
    
    OnCiTiaoFlush() {
        let skill_add_dis = BattleData.Inst().GetSkillCfg(HeroSkillId.LianOuMaiKeFeng.AddDis);
        let is_skill_dis = this.IsHasSkillByData(skill_add_dis);
        this.longjuanfeng_dis = is_skill_dis ? +skill_add_dis.pram1 : 2;

        let is_jufeng_skill = BattleData.Inst().IsHasSkill(HeroSkillId.LianOuMaiKeFeng.JuFeng,this.hero.tag);
        //let skill9 = this.GetHasSkill(HeroSkillId.LianOuMaiKeFeng.Skill9);
        this.longjuanfeng_resname = is_jufeng_skill ? LianOuMaiKeFengRes.JuFeng : LianOuMaiKeFengRes.Normal;

        let skill_multiple = BattleData.Inst().GetSkillCfg(HeroSkillId.LianOuMaiKeFeng.MultipleNum);
        let is_skill_multiple = this.IsHasSkillByData(skill_multiple);
        this.longjuanfeng_num = is_skill_multiple ? +skill_multiple.pram1 : 1;

        this.attackRange.h = this.longjuanfeng_dis * 2;
        this.attackRange.ReSetAABB();
    }

    //默认攻击
    DefaultSkillAction() {
        AudioManager.Inst().Play(AudioTag.lianou);

        let skill9 = BattleData.Inst().GetSkillCfg(HeroSkillId.LianOuMaiKeFeng.Skill9);
        if(this.IsHasSkillByData(skill9)){
            this.longjuanfeng_num = skill9.pram1;
        }

        for (let index = 0; index < this.longjuanfeng_num; index++) {
            this.CrateSkillFuncByName(this.longjuanfeng_resname, (skillFunc: SkillShoot) => {
                skillFunc.shootLength = this.longjuanfeng_dis * CELL_WIDTH;
                let posX = skillFunc.node.position.x;
                let posY = skillFunc.node.position.y;
                let offX = (index % 2 == 0 ? -50 : 50) * Math.ceil((index + (this.longjuanfeng_num + 1) % 2) / 2);
                skillFunc.node.setPosition(posX + offX, posY);
            });
        }
    }

    //莲藕麦克风攻击时X%几率发射音符，使命中的敌人进入弱化状态(弱化：撞击城堡伤害-{1}%)
    SkillRuoHuaBefore() {
        let skill_ruohua = BattleData.Inst().GetSkillCfg(HeroSkillId.LianOuMaiKeFeng.RuoHua);
        let rate = +skill_ruohua.pram1;
        if (MathHelper.RandomResult(rate, 100)) {
            this.CrateHitSkillFuncByName(LianOuMaiKeFengRes.YinFu, this.hero.node.worldPosition,
                this.OnRuoHuoHit.bind(this), (skillFunc: SkillShoot) => {
                    this.PlaySkill(skillFunc);
                });
        }
    }

    OnRuoHuoHit(event: SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        let skill_ruohua = BattleData.Inst().GetSkillCfg(HeroSkillId.LianOuMaiKeFeng.RuoHua);
        monster.AddBuff(
            RuoHuaSuBuff.CreateData(this.hero,MonterBuff.DefaultTime,skill_ruohua.pram2)
        )
    }

    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        let atkVal = this.GetTotalAttackValue(monster);
        monster.DeductHp(this.hero, atkVal);
        let skill_jufeng = BattleData.Inst().GetSkillCfg(HeroSkillId.LianOuMaiKeFeng.JuFeng);
        if (this.IsHasSkillByData(skill_jufeng)) {
            let rate = +skill_jufeng.pram2;
            if (MathHelper.RandomResult(rate, 100)) {
                let time = +skill_jufeng.pram3;
                let skill_add_times = BattleData.Inst().GetSkillCfg(HeroSkillId.LianOuMaiKeFeng.AddXuanYunTime);
                if (this.IsHasSkillByData(skill_add_times)) {
                    time += +skill_add_times.pram1;
                }
                monster.AddBuff(<IMonsterObjBuffData>{
                    buffType: MonsterObjBuffType.XuanYun,
                    time: time,
                    hero: this.hero,
                })
            }
        }

        let skill10 = BattleData.Inst().GetSkillCfg(HeroSkillId.LianOuMaiKeFeng.Skill10);
        if(this.IsHasSkillByData(skill10) && MathHelper.RandomResult(skill10.pram1, 100)){
            let buff = <IMonsterObjBuffData>{
                buffType: MonsterObjBuffType.JiTui,
                hero:this.hero,
                time:0.5,
                p1:1
            }
            monster.AddBuff(buff);
        }
    }

    //计算伤害
    GetTotalAttackValue(monster: MonsterObj): number {
        let value = this.attackValue;
        //总伤害
        let total_val = value;
        if(monster.HasBuff(MonsterObjBuffType.ZhuoShao)){
            let skill_11 = this.GetHasSkill(HeroSkillId.LianOuMaiKeFeng.Skill11);
            if(skill_11){
                total_val += this.baseAttackValue * +skill_11.pram1 / 100;
            }else{
                let skill_zhuoshao = BattleData.Inst().GetSkillCfg(HeroSkillId.LianOuMaiKeFeng.HitZhuoShao);
                if (this.IsHasSkillByData(skill_zhuoshao))
                    total_val += this.baseAttackValue * +skill_zhuoshao.pram1 / 100;
            }
        }


        //飓风额外伤害
        let skill_jufeng = BattleData.Inst().GetSkillCfg(HeroSkillId.LianOuMaiKeFeng.JuFeng);
        if (this.IsHasSkillByData(skill_jufeng)) {
            total_val+= this.baseAttackValue * +skill_jufeng.pram1 / 100;
        }
        return total_val;
    }
}
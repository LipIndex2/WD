import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from "../HeroControl";
import { CfgSkillData } from "config/CfgEntry";
import { SkillColliderEvent, SkillFunc } from "modules/Battle/Function/SkillFunc";
import { MonsterObj } from "modules/Battle/Object/MonsterObj";
import { IMonsterObjBuffData, MonsterObjBuffType, MonsterType, SkillPlayType } from "modules/Battle/BattleConfig";
import { HeroSkillId } from "modules/Battle/HeroSkillId";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { BattleData } from "modules/Battle/BattleData";
import { SkillRange } from "modules/Battle/Function/SkillRange";
import { MathHelper } from "../../../../helpers/MathHelper";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { IQueuePlayFuncItem, QueuePlayFunc } from "modules/Battle/Function/QueueFunc";
import { SceneEffect, SceneEffectConfig } from "modules/scene_obj_spine/Effect/SceneEffect";
import { LogError } from "core/Debugger";
import { BattleDynamicHelper } from "modules/Battle/BattleDynamicHelper";

enum XiTieHuaRes {
    Normal = "xitiehua_1",
    Normal2 = "xitiehua_2",
    Normal3 = "xitiehua_3",
    Bomb="xitiehua_bomb_1",
}

class TianLeiPlayInfo implements IQueuePlayFuncItem{
    out_time:number = 0.01;
    monster:MonsterObj;
    constructor(monster:MonsterObj){
        this.monster = monster;
    }
}

export class XiTieHuaControl extends HeroControl{

    protected attackRange: HeroAttackRange = new HeroAttackRange(20,0.8);
    private angleNum:number = 0;
    private dianbo_num = 1;
    // private dianliu_num = 1;    //电流数量，现有伤害直接x2

    private killJingGuCount:number = 0;   //击杀数量

    private tianLeiSkillQueue:QueuePlayFunc = new QueuePlayFunc(); 

    Init(){
        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.XiTieHua.TwoDianBo,this.SkillTowDirectionBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.XiTieHua.FourDianBo,this.SkillFourDirectionBefore.bind(this));
        this.AddSmartDataCare(this.battleInfo, this.OnSkillFlush.bind(this), "skillListMap");
        this.tianLeiSkillQueue.OnPlay(this.PlayTianLei.bind(this));
        this.OnSkillFlush();
    }
    protected Run(dt: number): void {
        this.tianLeiSkillQueue.Update(dt);
    }

    OnFightStart(): void {
        this.killJingGuCount = 0;
    }

    OnSkillFlush() {
        let skill_four = BattleData.Inst().GetSkillCfg(HeroSkillId.XiTieHua.FourDianBo);
        if (this.IsHasSkillByData(skill_four)) {
            this.attackRange.h = 20;
            this.attackRange.ReSetAABB();
        }

        let skill_multiple = BattleData.Inst().GetSkillCfg(HeroSkillId.XiTieHua.MultipleDianBo);
        this.dianbo_num = this.IsHasSkillByData(skill_multiple) ? +skill_multiple.pram1 : 1;
    }

    protected skillFuncRes = {
        [XiTieHuaRes.Normal]: SkillFuncResInit.Create([{ stage: 3, resName: XiTieHuaRes.Normal2 }, { stage: 4, resName: XiTieHuaRes.Normal3 }]),
        [XiTieHuaRes.Bomb]: SkillFuncResUnlock.Create(HeroSkillId.XiTieHua.HitZhuoShao),
    }

    //默认攻击
    DefaultSkillAction() {
        AudioManager.Inst().Play(AudioTag.XiTieHua);
        for (let index = 0; index < this.dianbo_num; index++) {
            this.DoAttackAction(this.angleNum,index);
        }
        this.skillBuff.otherValue++;        //攻击次数
        this.CheckTianLei();
    }

    //检查并释放天雷
    CheckTianLei(){
        let skill9 = BattleData.Inst().GetSkillCfg(HeroSkillId.XiTieHua.Skill9);
        if(this.IsHasSkillByData(skill9)){
            if(this.skillBuff.otherValue >= skill9.pram1){
                this.skillBuff.otherValue = 0;
                let monsters = BattleDynamicHelper.GetMonsterMap(this.hero.tag);
                monsters.forEach((monster, id)=>{
                    this.tianLeiSkillQueue.PushData(new TianLeiPlayInfo(monster))
                })
            }
        }
    }

    PlayTianLei(info:TianLeiPlayInfo){
        if(info.monster && !info.monster.IsDied()){
            let skill9 = BattleData.Inst().GetSkillCfg(HeroSkillId.XiTieHua.Skill9);
            let attValue = this.CalculateAttackValue(0,skill9.pram2 / 100);
            info.monster.DeductHp(this.hero, attValue);
            SceneEffect.Inst().Play(SceneEffectConfig.TianLei,this.scene.TopRoot, info.monster.worldPosition);
        }
    }

    //磁铁花向左右两边发射电波
    SkillTowDirectionBefore(skill: CfgSkillData) {
        let skill_four = BattleData.Inst().GetSkillCfg(HeroSkillId.XiTieHua.FourDianBo);
        if (this.IsHasSkillByData(skill_four)) {
            return;
        }
        for (let index = 0; index < this.dianbo_num; index++) {
            this.DoAttackAction(this.angleNum == 0 ? 180 : 0,index);
        }
    }

    //磁铁花同时向四个方向发射电波
    SkillFourDirectionBefore(skill: CfgSkillData) {
        for (let index = 0; index < this.dianbo_num; index++) {
            this.DoAttackAction(this.angleNum == 0 ? 180 : 0,index);
            this.DoAttackAction(90,index);
            this.DoAttackAction(-90,index);
        }
    }

    DoAttackAction(angel_num: number, index: number) {
        this.CrateSkillFuncByName(XiTieHuaRes.Normal, (skillFunc: SkillFunc) => {
            let posX = skillFunc.node.position.x;
            let posY = skillFunc.node.position.y;
            let index_off = 30 * index;
            let offX = 0;
            let offY = 0;
            if (angel_num == 0) {//右
                offX = 15 ;
                offY = 25 - index_off;
            } else if (angel_num == 180) {//左
                offX = -15;
                offY = 25 - index_off;
            } else {
                offX += (index % 2 == 0 ? -10 : 10) * Math.ceil((index + (this.dianbo_num + 1) % 2) / 2);
            }
            skillFunc.node.setPosition(posX + offX, posY + offY);
            skillFunc.node.setRotationFromEuler(0, 0, angel_num);
            skillFunc.node.setScale(2.2,1)
            skillFunc.hp = 1;
        });
    }

    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster:MonsterObj= event.GetFirstHitObj();
        let isJingGu = monster.HasBuff(MonsterObjBuffType.JinGu);
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        let atkVal = this.GetTotalAttackValue(monster);
        monster.DeductHp(this.hero, atkVal);

        //磁铁花攻击灼烧的敌人（精英怪除外）X%几率将其引爆
        let skill_zhuoshao_bomb = BattleData.Inst().GetSkillCfg(HeroSkillId.XiTieHua.HitZhuoShao);
        if (this.IsHasSkillByData(skill_zhuoshao_bomb) && monster.HasBuff(MonsterObjBuffType.ZhuoShao)) {
            if (MathHelper.RandomResult(+skill_zhuoshao_bomb.pram1, 100) && monster.GetData().monster_type != MonsterType.JingYing) {
                this.CrateHitSkillFuncByName(XiTieHuaRes.Bomb, monster.worldPosition,
                    this.BombHitEvent.bind(this), (skillFunc: SkillRange) => {
                        if(BattleData.Inst().IsHasSkill(HeroSkillId.XiTieHua.AddYinBaoRange,this.hero.tag)){
                            let skill_add_range = BattleData.Inst().GetSkillCfg(HeroSkillId.XiTieHua.AddYinBaoRange);
                            skillFunc.SetScale(+skill_add_range.pram1 / 100 + 1);
                        }
                        this.PlaySkill(skillFunc);
                    });
            }
        }
        if(!monster.IsDied()){
            //磁铁花攻击加禁锢buff,禁锢敌人的时间+<color=#036b16>{0}</color>秒
            BattleData.Inst().HandleCountSkill(HeroSkillId.XiTieHua.AddBanTime, (cfg, count) => {
                let time = cfg.pram1 * count
                if (isJingGu) {
                    monster.OffsetBuffTime(MonsterObjBuffType.JinGu, time)
                } else {
                    if(MathHelper.RandomResult(25, 100)){
                        monster.AddBuff(<IMonsterObjBuffData>{
                            buffType: MonsterObjBuffType.JinGu,
                            time: time
                        })
                    }
                }
            }, this.hero.tag)
        }
        
        if(monster.hp < 0 && isJingGu){
            this.killJingGuCount++;
        }
    }

      //计算伤害
      GetTotalAttackValue(monster: MonsterObj): number {
        let value = this.attackValue;
        //总伤害
        let total_val = value;
        //磁铁花攻击冰冻的敌人，X%几率对其造成{1}倍伤害
        let skill_hit_dingdong = BattleData.Inst().GetSkillCfg(HeroSkillId.XiTieHua.HitBingDong);
        if (this.IsHasSkillByData(skill_hit_dingdong) && monster.HasBuff(MonsterObjBuffType.BingDong)) {
            if (MathHelper.RandomResult(+skill_hit_dingdong.pram1, 100)) {
                total_val += value * (+skill_hit_dingdong.pram2 - 1);
            }
        }

        let skill8 = BattleData.Inst().GetSkillCfg(HeroSkillId.XiTieHua.Skill8);
        if(this.IsHasSkillByData(skill8)){
            let count = this.killJingGuCount / skill8.pram1;
            total_val += this.baseAttackValue * count * skill8.pram2 / 100
        }
        
        return total_val ;//* this.dianliu_num;
      }

    BombHitEvent(event: SkillColliderEvent) {
        event.objs.forEach(monster => {
            let att_value = this.GetTotalAttackValue(monster);

            let skill10 = this.GetHasSkill(HeroSkillId.XiTieHua.Skill10);
            if(skill10){
                let count = this.GetSkillCount(skill10);
                att_value += att_value * count * skill10.pram1 / 100;
            }

            monster.DeductHp(this.hero, att_value);
            event.skillFunc.SetExcludeObj(monster);
        });
    }

    //怪物进入
    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum =  monster.worldPosition.x >= this.node.worldPosition.x ? 0 : 180;
    }
}
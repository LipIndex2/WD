import { _decorator, Node } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { ChanRaoBuff, FuBaiBuff, MonterBuff, YiShangBuff } from 'modules/Battle/Function/MonsterBuff';
import { MathHelper } from '../../../../helpers/MathHelper';
import { CfgSkillData } from 'config/CfgEntry';
import { BattleData } from 'modules/Battle/BattleData';
import { CELL_WIDTH, FIGHT_CELL_WIDTH, IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType, ZHONG_JI_SCALE } from 'modules/Battle/BattleConfig';
import { SkillHover } from 'modules/Battle/Function/SkillHover';
import { BattleHarmShowIconType } from 'modules/Battle/BattleView';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
enum SkillRes {
    Normal = "meigui_1",
    Hit = "meigui_hit_1",
    DefSkill = "meigui_shouhu",
    HuaBan = "meiguihuaban",
}
export class MeiGuiControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(0.8,20);

    // 技能资源
    protected skillFuncRes = {
        [SkillRes.Normal] : SkillFuncResInit.Create(),
        [SkillRes.Hit] : SkillFuncResInit.Create(),
        [SkillRes.HuaBan] : SkillFuncResUnlock.Create(HeroSkillId.MeiGui.Skill5),
        [SkillRes.DefSkill] : SkillFuncResUnlock.Create(HeroSkillId.MeiGui.Skill7),
    }

    // 溅射范围
    private jianseScale = 1;
    // 击杀了多少个敌人
    private killCount = 0;
    private angleNum:number = 0;

    Init(){
        this.RegisterSkillHandle(HeroSkillId.MeiGui.Skill4, this.OnAddJianSeScale.bind(this));
        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.MeiGui.Skill10, this.MeiGuiYu.bind(this));
    }

    //每回合战斗开始回调
    OnFightStart(){
        this.killCount = 0;
    }

    OnAddJianSeScale(skill:CfgSkillData){
        let skill4 = this.GetHasSkill(HeroSkillId.MeiGui.Skill4);
        if(skill4){
            let count = this.GetSkillCount(skill4);
            this.jianseScale = 1 + count * skill4.pram1 / 100;
        }
    }

    
    //默认技能效果
    DefaultSkillAction(){
        this.CrateSkillFuncByName(SkillRes.Normal, (skill)=>{
            skill.SetEulerAngle(this.angleNum);
        });
        AudioManager.Inst().PlaySceneAudio(AudioTag.meiguifashi);
        this.skillBuff.otherValue ++;
    }

    MeiGuiYu(skill:CfgSkillData){
        if(this.skillBuff.otherValue >= skill.pram1){
            this.skillBuff.otherValue = 0;
            let monseters = BattleDynamicHelper.GetMonsterMap(this.hero.tag);
            let attValue = this.CalculateAttackValue(0, skill.pram2 / 100);
            monseters.forEach(mst=>{
                mst.DeductHp(this.hero, attValue);
                let buff = YiShangBuff.CrateData(this.hero, skill.pram3, 10);
                mst.AddBuff(buff);
            })
            SceneEffect.Inst().Play(SceneEffectConfig.MeiGuiHuaYu);
        }
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        this.StopSkill(event.skillFunc);
        //击中之后给一个爆炸特效
        this.CrateHitSkillFuncByName(SkillRes.Hit,monster.worldPosition, this.OnBombHitEvent.bind(this),(skillFunc:SkillRange)=>{
            skillFunc.SetScale(this.jianseScale);
            this.PlaySkill(skillFunc);
        });

        if(!monster.IsDied()){
            let skill1 = this.GetHasSkill(HeroSkillId.MeiGui.Skill1);
            if(skill1){
                let attValue = this.CalculateAttackValue();
                let buffValue = attValue * skill1.pram2 / 100;
                let time = skill1.pram1;
                let skill6 = this.GetHasSkill(HeroSkillId.MeiGui.SKill6);
                if(skill6){
                    let count = this.GetSkillCount(skill6);
                    time += skill6.pram1 * count;
                }
                let skill8 = this.GetHasSkill(HeroSkillId.MeiGui.Skill8);
                if(skill8){
                    this.skillBuff.fubaiScale = skill8.pram1 / 100;
                }
                this.AddMonsterFuBai(monster, buffValue, time);
            }
        }
    }


    OnBombHitEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                this.OnMonsterHit(monster);
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }

    OnMonsterHit(monster:MonsterObj){
        let addPer:number = 0;
        let damScale:number = 1;
        let iconType:BattleHarmShowIconType = null;

        let skill2 = this.GetHasSkill(HeroSkillId.MeiGui.Skill2);
        if(skill2){
            if(MathHelper.RandomResult(skill2.pram1, 100)){
                damScale += ZHONG_JI_SCALE - 1;
                iconType = BattleHarmShowIconType.zhongji;
            }
        }

        let attValue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attValue, iconType);

        if(monster.IsDied()){
            this.killCount++;
            let skill5 = this.GetHasSkill(HeroSkillId.MeiGui.Skill5);
            if(skill5){
                if(MathHelper.RandomResult(skill5.pram1,  100)){
                    this.CrateHitSkillFuncByName(SkillRes.HuaBan,monster.worldPosition, this.OnHuaBanHit.bind(this),(skillFunc:SkillRange)=>{
                        this.PlaySkill(skillFunc);
                    });
                }
            }

            let skill7 = this.GetHasSkill(HeroSkillId.MeiGui.Skill7);
            if(skill7 && this.killCount >= skill7.pram1){
                this.PlayDefSkill(skill7.pram2);
                this.killCount = 0;
            }
        }else{
            let skill9 = this.GetHasSkill(HeroSkillId.MeiGui.Skill9);
            if(skill9){
                if(MathHelper.RandomResult(skill9.pram1, 100)){
                    this.AddMonsterCanRao(monster);
                }
            }
        }
    }

    OnHuaBanHit(event:SkillColliderEvent){
        let skill5 = this.GetHasSkill(HeroSkillId.MeiGui.Skill5);
        if(skill5){
            let attValue = this.CalculateAttackValue(0, skill5.pram2 / 100);
            event.objs.forEach(monster=>{
                let buff = <IMonsterObjBuffData>{
                    buffType: MonsterObjBuffType.DeductHp,
                    hero: this.hero,
                    time: skill5.pram3,
                    p1: attValue,
                }
                monster.AddBuff(buff);
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }

    AddMonsterFuBai(monster:MonsterObj, attValue:number, time:number = MonterBuff.DefaultTime){
        let buff = FuBaiBuff.CrateData(this.hero, time, attValue);
        monster.AddBuff(buff);
    }

    AddMonsterCanRao(monseter:MonsterObj, time:number = 1){
        let buff = ChanRaoBuff.CreateData(this.hero, time);
        monseter.AddBuff(buff);
    }


    //释放守护玫瑰
    PlayDefSkill(n:number){
        let angle = 360 / n;
        for(let i = 0; i < n; i++){
            this.CrateHitSkillFuncByName(SkillRes.DefSkill, this.node.worldPosition,this.OnDefHitEvent.bind(this),(skill:SkillHover)=>{
                skill.height = FIGHT_CELL_WIDTH;
                skill.startAngle = angle * (i + 1);
                skill.roundCount = 6;
                skill.playTime = 4;
                this.PlaySkill(skill);
            });
        }
    }

    //守护蝙蝠击中事件
    OnDefHitEvent(event:SkillColliderEvent){
        this.StopSkill(event.skillFunc);
        let monster = event.GetFirstHitObj();
        let att_value = this.CalculateAttackValue(0, 2);
        monster.DeductHp(this.hero, att_value);
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }
}


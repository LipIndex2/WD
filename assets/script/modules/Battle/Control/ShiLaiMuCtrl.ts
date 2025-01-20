import { _decorator, Component, Node } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResUnlock } from './HeroControl';
import { AttackConditionType, MonsterObjBuffType, SkillPlayType } from '../BattleConfig';
import { SkillColliderEvent, SkillFunc } from '../Function/SkillFunc';
import { SkillRotate } from '../Function/SkillRotate';
import { BattleData } from '../BattleData';
import { MonsterObj } from '../Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { MathHelper } from '../../../helpers/MathHelper';
import { CfgSkillData } from 'config/CfgEntry';

enum ShiLaiMuCtrlSkillIdType{
    addJian = 72,   //增加一把剑
    fangda = 73,    //放大
    zansha = 75,    //斩杀
    addRound = 76,  //旋转两圈
    Wubeishanghai = 79,     //五倍伤害
    skill8 = 340,   //<color=#036b16>柠檬战士</color>攻击时变为<color=#036b16>{0}</color>把剑
    skill9 = 341,   //每隔<color=#036b16>{0}秒</color>，所有的<color=#036b16>柠檬战士</color>就会释放一次剑刃旋风，对周围的敌人造成<color=#036b16>{0}%</color>伤害
    Skill10 = 417,  //<color=#036b16>柠檬战士</color>剑的大小增加到<color=#036b16>{0}%</color>
}

enum SkillRes{
    JianRenXuanFeng = "JianRenXuanFeng",
}

export class ShiLaiMuCtrl extends HeroControl {
    protected attackRange: HeroAttackRange = new HeroAttackRange(0,0,3);

    private jianShuLiang:number = 1;    //剑的数量

    private jianRenTime:number = 0;     //每隔多少秒释放剑刃
    private _jianRenTime:number = 0;

    private jianScale:number = 1;
    
    protected skillFuncRes = {
        [SkillRes.JianRenXuanFeng] : SkillFuncResUnlock.Create(ShiLaiMuCtrlSkillIdType.skill9),
    }

    Init(){
        this.RegisterSkillHandle(ShiLaiMuCtrlSkillIdType.addJian,this.AddJian.bind(this));
        this.RegisterSkillHandle(ShiLaiMuCtrlSkillIdType.skill8,this.SetJian.bind(this));
        this.RegisterSkillHandle(ShiLaiMuCtrlSkillIdType.fangda,this.SetJianScale.bind(this));
        this.RegisterSkillHandle(ShiLaiMuCtrlSkillIdType.Skill10,this.SetJianScale.bind(this));

        this.OnSkillChange();
    }

    protected Run(dt: number): void {
        if(this.jianRenTime == 0){
            return;
        }
        this._jianRenTime += dt;
        if(this._jianRenTime >= this.jianRenTime){
            this.PlayJianRenXuanFeng();
            this._jianRenTime = 0;
        }
    }


    SetJianScale(skill:CfgSkillData){
        let scale = 1 + skill.pram1 / 100;
        if(scale > this.jianScale){
            this.jianScale = scale;
            this.attackRange.r = scale * 3;
        }
    }

    OnFightStart(): void {
        this._jianRenTime = 0;
    }

    OnSkillChange(): void {
        if(this.jianRenTime == 0){
            let skill9 = this.GetHasSkill(ShiLaiMuCtrlSkillIdType.skill9);
            if(skill9){
                this.jianRenTime = skill9.pram1;
                this._jianRenTime = this.jianRenTime;
            }
        }
    }


    //默认技能效果
    DefaultSkillAction(){
        let angle = 360 / this.jianShuLiang;
        for(let i = 0; i < this.jianShuLiang; i++){
            this.CrateSkillFunc(this.shootEffectPath, (skillFunc:SkillRotate)=>{
                skillFunc.SetEulerAngle(angle * i);
                skillFunc.SetScale(this.jianScale);
                let addRoundSkill = this.GetHasSkill(ShiLaiMuCtrlSkillIdType.addRound);
                if(addRoundSkill){
                    skillFunc.rotationValue = 720;
                }
            });
        }
    }

    //增加剑
    AddJian(skill:CfgSkillData){
        this.jianShuLiang = skill.pram1 + 1;
    }

    SetJian(skill:CfgSkillData){
        if(skill.pram1 > this.jianShuLiang){
            this.jianShuLiang = skill.pram1;
        }
    }

    //是否对生命值小于x的眩晕敌人斩杀
    IsZhanSha(monster:MonsterObj):boolean{
        if(!monster.HasBuff(MonsterObjBuffType.XuanYun)){
            return false;
        }
        let skill = BattleData.Inst().GetSkillCfg(ShiLaiMuCtrlSkillIdType.zansha);
        if(!BattleData.Inst().IsHasSkillByData(skill,this.hero.tag)){
            return false;
        }
        let skill2 = BattleData.Inst().GetSkillCfg(78);
        let condition:number;
        if(BattleData.Inst().IsHasSkillByData(skill2,this.hero.tag)){
            condition = skill2.pram1 / 100;
        }else{
            condition = skill.pram1 / 100;
        }
        if(monster.hpProgress >= condition){
            return false;
        }
        
        return true;
    }

    //对低于5%血量敌人造成5倍伤害的几率提高5%
    IsWuBeiShangHai(monster:MonsterObj):boolean{
        let skill = BattleData.Inst().GetSkillCfg(ShiLaiMuCtrlSkillIdType.Wubeishanghai);
        if(!BattleData.Inst().IsHasSkillByData(skill,this.hero.tag)){
            return false;
        }
        if(monster.hpProgress >= skill.pram1 / 100){
            return false
        }
        let value = this.skillBuff.otherValue;
        let randomNum = MathHelper.GetRandomNum(1,100);
        return value > randomNum;
    }

    OnHitEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                if(this.IsZhanSha(monster)){
                    monster.ZhanSha(this.hero);
                }else{
                    let att_value = this.CalculateAttackValue();
                    if(this.IsWuBeiShangHai(monster)){
                        let skill = BattleData.Inst().GetSkillCfg(ShiLaiMuCtrlSkillIdType.zansha);
                        att_value * skill.pram2;
                    }
                    monster.DeductHp(this.hero, att_value);
                    event.skillFunc.SetExcludeObj(monster);
                }
                //AudioManager.Inst().PlaySceneAudio(AudioTag.ShiLaiMuJiZhong,  4);
            })

            AudioManager.Inst().Play(AudioTag.ShiLaiMuJiZhong);
        }
    }


    //释放剑刃旋风
    PlayJianRenXuanFeng(){
        this.CrateHitSkillFuncByName(SkillRes.JianRenXuanFeng, this.node.worldPosition, this.OnJianRenXuanFeng.bind(this),(skill)=>{
            this.PlaySkill(skill);
        })
    }

    OnJianRenXuanFeng(event:SkillColliderEvent){
        if(event.objs.length > 0){
            let skill9 = BattleData.Inst().GetSkillCfg(ShiLaiMuCtrlSkillIdType.skill9);
            event.objs.forEach(monster=>{
                let attackValue = this.CalculateAttackValue(0, skill9.pram2 / 100);
                monster.DeductHp(this.hero, attackValue);
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }
}


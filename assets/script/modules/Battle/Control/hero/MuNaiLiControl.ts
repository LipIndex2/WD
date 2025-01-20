import { _decorator, Node } from 'cc';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleData } from 'modules/Battle/BattleData';
import { FuBaiBuff, MonterBuff } from 'modules/Battle/Function/MonsterBuff';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { ResPath } from 'utils/ResPath';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { CfgSkillData } from 'config/CfgEntry';
enum MuNaiLiRes {
    ZuZou = "munaili_zuzou",
}
export class MuNaiLiControl extends HeroControl {
    protected attackRange: HeroAttackRange = new HeroAttackRange(0.5,2,null,null,0);
    protected skillFuncRes = {
        [MuNaiLiRes.ZuZou] : SkillFuncResUnlock.Create(HeroSkillId.MuNaiLi.ZuZou),
    }

    private zuzhou:SkillRange = null;

    private playCount = 1;

    Init(){
        this.RegisterSkillHandle(HeroSkillId.MuNaiLi.LianXU, (skill:CfgSkillData)=>{
            this.playCount = 2;
        })

        this.RegisterSkillHandle(HeroSkillId.MuNaiLi.Skill8, (skill:CfgSkillData)=>{
            this.playCount = skill.pram1;
        })

        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.MuNaiLi.ZuZou,this.PlayZuZhou.bind(this));
    }

    //默认技能效果
    DefaultSkillAction(){
        this.LianXuPlay(this.playCount);
    }

    //连续释放
    LianXuPlay(count:number){
        let skill8 = BattleData.Inst().GetSkillCfg(HeroSkillId.MuNaiLi.Skill8);
        if(this.IsHasSkillByData(skill8)){
            count = skill8.pram1;
        }
        this.CrateSkillFunc(this.shootEffectPath);
        for(let i = 1; i < count; i++){
            this.scheduleOnce(this.DoLianXuPlay.bind(this),0.4 * i);
        }
    }

    private DoLianXuPlay(){
        if(!this.isBattle){
            return;
        }

        this.CrateHitSkillFunc(this.shootEffectPath, this.node.worldPosition, this.OnHitEvent.bind(this), (skill:SkillRange)=>{
            this.PlaySkill(skill);
        });
    }

    //周围释放诅咒
    PlayZuZhou(){
        if(this.zuzhou === null){
            this.zuzhou == undefined;
            this.CrateHitSkillFunc(ResPath.SkillAsset(MuNaiLiRes.ZuZou), this.node.worldPosition, this.OnZuZouHitEvent.bind(this), (skill:SkillRange)=>{
                this.zuzhou = skill;
                skill.OnStop(this.OnZuZouStop.bind(this));
                this.PlaySkill(skill);
            });
        }
    }

    //腐败时间
    GetFuBaiTime():number{
        return this.hero.attriCfg.methysis_time;
    }

    //计算伤害
    GetTotalAttackValue(monster:MonsterObj):number{
        let value = this.CalculateAttackValue();
        if(monster.HasBuff(MonsterObjBuffType.ZhongDu)){
            let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.MuNaiLi.ZhongDuJiaShang);
            let count = this.GetSkillCount(skill);
            if(count > 0){
                value += value * skill.pram1 * count / 100
            }
        }
        return value;
    }



    //击中怪物实践
    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                if(BattleData.Inst().IsHasSkill(HeroSkillId.MuNaiLi.ZhanSha,this.hero.tag)){
                    let skill = BattleData.Inst().GetSkillCfg(HeroSkillId.MuNaiLi.ZhanSha);
                    if(monster.hpProgress <= skill.pram1 / 100){
                        monster.ZhanSha(this.hero);
                        return;
                    }
                }
                let att_value = this.GetTotalAttackValue(monster);
                monster.DeductHp(this.hero, att_value);
                event.skillFunc.SetExcludeObj(monster);
                let buff_value = MonterBuff.DefaultDamge(att_value);

                let skill10 = this.GetHasSkill(HeroSkillId.MuNaiLi.Skill10);
                if(skill10){
                    this.hero.GetSkillAttri().fubaiScale = skill10.pram1 / 100;
                }

                let buff = FuBaiBuff.CrateData(this.hero, this.GetFuBaiTime(), buff_value);
                let skill9 = BattleData.Inst().GetSkillCfg(HeroSkillId.MuNaiLi.Skill9);
                if(this.IsHasSkillByData(skill9)){
                    buff.p2 = skill9.pram1;
                }
                monster.AddBuff(buff);
            })
        }
        AudioManager.Inst().Play(AudioTag.munaili);
    }

    // OnSkillStopEvent(skill:SkillRange){
    //     if(BattleData.Inst().IsHasSkill(HeroSkillId.MuNaiLi.LianXU)){
    //         this.CrateHitSkillFunc(ResPath.SkillAsset(this.shootEffectPath), this.node.worldPosition, this.OnHitEvent.bind(this), (skill:SkillRange)=>{
    //             this.PlaySkill(skill);
    //         });
    //     }
    // }

    //诅咒击中
    OnZuZouHitEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let att_value = this.GetTotalAttackValue(monster);
                monster.DeductHp(this.hero, att_value);
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }

    //诅咒结束
    OnZuZouStop(skill:SkillRange){
        this.zuzhou = null;
    }

}
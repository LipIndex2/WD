import { _decorator, Node } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { BattleEventType, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { CfgSkillData } from 'config/CfgEntry';
import { BattleData } from 'modules/Battle/BattleData';
import { MathHelper } from '../../../../helpers/MathHelper';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { KongJuBuff, MonterBuff } from 'modules/Battle/Function/MonsterBuff';
import { EventCtrl } from 'modules/common/EventCtrl';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
enum XJChanZhangRes {
    Normal1 = "xjchanzhang_1",
    Bomb = "xjchuanzhang_bomb",
    ChuanMao = "xjchuanzhang_chuanmao",
}
export class XJChuanZhangControl extends HeroControl {
    // 范围 横向
    protected attackRange: HeroAttackRange = new HeroAttackRange(20,1);
    private angleNum : number = 90;

    private static monsterListenControl : XJChuanZhangControl = null;
    // 技能资源
    protected skillFuncRes = {
        [XJChanZhangRes.Normal1] : SkillFuncResInit.Create(),
        [XJChanZhangRes.Bomb] : SkillFuncResUnlock.Create(HeroSkillId.XJChanZhang.HitBomb),
        [XJChanZhangRes.ChuanMao] : SkillFuncResUnlock.Create(HeroSkillId.XJChanZhang.ChuanMao),
        // [WoGuaRes.JiaDa] : SkillFuncResUnlock.Create(HeroSkillId.WoGua.JianTaFanWei),
    }

    Init(){
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.XJChanZhang.DoubleAtk,this.SkillDoubleAtkBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.XJChanZhang.FourthAtk,this.SkillFourthAtkBefore.bind(this));
        if(XJChuanZhangControl.monsterListenControl == null){
            XJChuanZhangControl.monsterListenControl = this;
            EventCtrl.Inst().on(BattleEventType.MonsterDie, this.OnMonsterDie,this);
        }
    }

    //每回合战斗开始回调
    OnFightStart(){
        
    }
    
    //默认技能效果
    DefaultSkillAction(){
        this.CrateSkillFuncByName(XJChanZhangRes.Normal1,(skillFunc)=>{
            skillFunc.SetEulerAngle(this.angleNum);
        })
    }

    SkillDoubleAtkBefore(skill:CfgSkillData, event:SkillColliderEvent){
        this.CrateSkillFuncByName(XJChanZhangRes.Normal1,(skillFunc)=>{
            skillFunc.SetEulerAngle(this.angleNum + 180);
        })
    }

    SkillFourthAtkBefore(skill:CfgSkillData, event:SkillColliderEvent){
        this.CrateSkillFuncByName(XJChanZhangRes.Normal1,(skillFunc)=>{
            skillFunc.SetEulerAngle(this.angleNum - 90);
        })
        this.CrateSkillFuncByName(XJChanZhangRes.Normal1,(skillFunc)=>{
            skillFunc.SetEulerAngle(this.angleNum + 90);
        })
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        event.objs.forEach(hitMo=>{
            let addPer = 0;
            //伤害造成恐惧并加伤
            BattleData.Inst().HandleSkill(HeroSkillId.XJChanZhang.KongJu,(kjCfg)=>{
                let kjRate = kjCfg.pram1;
                //恐惧概率提升
                BattleData.Inst().HandleCountSkill(HeroSkillId.XJChanZhang.KongJuRate,(kjRateCfg,count)=>{
                    kjRate += (kjRateCfg.pram1 * count);
                }, this.hero.tag);
                //攻击造成恐惧
                if(MathHelper.RndRetPercent(kjRate)){
                    addPer += MathHelper.NumToPer(kjCfg.pram3);
                    let kfT = kjCfg.pram2;
                    BattleData.Inst().HandleCountSkill(HeroSkillId.XJChanZhang.KongJuTime,(kjTCfg,kjTCount)=>{
                        kfT += (kjTCfg.pram1*kjTCount);
                    },this.hero.tag)
                    let kjT2Cfg = this.GetHasSkill(HeroSkillId.XJChanZhang.KongJuTime2);
                    if(kjT2Cfg){
                        kfT += kjT2Cfg.pram1;
                    }
                    hitMo.AddBuff(KongJuBuff.CrateData(this.hero,kfT));
                }
            }, this.hero.tag);
            //禁锢加时长
            if(hitMo.HasBuff(MonsterObjBuffType.JinGu)){
                BattleData.Inst().HandleCountSkill(HeroSkillId.XJChanZhang.JinGuExtend,(jgCfg,jgCount)=>{
                    let extT = jgCfg.pram1 * jgCount;
                    hitMo.OffsetBuffTime(MonsterObjBuffType.JinGu,extT);
                }, this.hero.tag);
            }

            let att_value = this.CalculateAttackValue(addPer,1);
            hitMo.DeductHp(this.hero, att_value);
            event.skillFunc.SetExcludeObj(hitMo);
            BattleData.Inst().HandleSkill(HeroSkillId.XJChanZhang.HitBomb,(bombCfg)=>{
                // let per = bombCfg.pram1;
                if(!MathHelper.RndRetPercent(bombCfg.pram1)){
                    return;
                }
                this.CrateHitSkillFuncByName(XJChanZhangRes.Bomb,hitMo.centerWorldPos,
                    this.OnBombHitEvent.bind(this,bombCfg),
                    (skillfunc)=>{
                        this.PlaySkill(skillfunc);
                    }
                );
            }, this.hero.tag);   
        });
        AudioManager.Inst().PlaySceneAudio(AudioTag.xiangjiaoshouji);
    }

    OnBombHitEvent(bombCfg:CfgSkillData,bombEve:SkillColliderEvent){
        bombEve.objs.forEach(hitMo=>{
            bombEve.skillFunc.SetExcludeObj(hitMo)
            let att_value = this.CalculateAttackValue(0,MathHelper.NumToPer(bombCfg.pram2));
            hitMo.DeductHp(this.hero, att_value);
            BattleData.Inst().HandleSkill(HeroSkillId.XJChanZhang.BombKongJu,(bkgCfg)=>{
                hitMo.AddBuff(KongJuBuff.CrateData(this.hero,MonterBuff.DefaultTime));
            }, this.hero.tag);
        });
        AudioManager.Inst().PlaySceneAudio(AudioTag.xiangjiaobaozha);
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.x >= this.node.worldPosition.x ? 270 : 90;
    }

    OnMonsterDie(monster: MonsterObj) {
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.XJChanZhang.ChuanMao,this.hero.tag)){
            return;
        }
        if(!monster.HasBuffByHeroId(MonsterObjBuffType.KonJu,this.hero.data.hero_id)){
            return;
        }
        let cfg = BattleData.Inst().GetSkillCfg(HeroSkillId.XJChanZhang.ChuanMao);
        if(!MathHelper.RndRetPercent(cfg.pram1)){
            return;
        }
        this.CrateHitSkillFuncByName(XJChanZhangRes.ChuanMao,monster.centerWorldPos,
            (eve:SkillColliderEvent)=>{
                eve.objs.forEach(hitMo=>{
                    eve.skillFunc.SetExcludeObj(hitMo)
                    let att_value = this.CalculateAttackValue(0,MathHelper.NumToPer(cfg.pram2));
                    hitMo.DeductHp(this.hero, att_value);
                });  
            },
            (skillfunc)=>{
                this.PlaySkill(skillfunc);
            }
        );        
    }

    onDestroy(){
        super.onDestroy();
        if( XJChuanZhangControl.monsterListenControl == this){
            EventCtrl.Inst().off(BattleEventType.MonsterDie, this.OnMonsterDie,this);
        }
    }
}


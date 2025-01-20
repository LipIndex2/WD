import { Vec2, Vec3 } from "cc";
import { CfgSkillData } from "config/CfgEntry";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { BattleEventType, SkillPlayType } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { BattleData } from "modules/Battle/BattleData";
import { BattleDynamicHelper } from "modules/Battle/BattleDynamicHelper";
import { SkillBulletTrack } from "modules/Battle/Function/SkillBulletTrack";
import { SkillColliderEvent, SkillFunc } from "modules/Battle/Function/SkillFunc";
import { SkillRange } from "modules/Battle/Function/SkillRange";
import { SkillShoot } from "modules/Battle/Function/SkillShoot";
import { SkillStraight } from "modules/Battle/Function/SkillStraight";
import { HeroSkillId } from "modules/Battle/HeroSkillId";
import { MonsterObj } from "modules/Battle/Object/MonsterObj";
import { EventCtrl } from "modules/common/EventCtrl";
import { MathHelper } from "../../../../helpers/MathHelper";
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from "../HeroControl";
import {SkillFuncLocker} from "../SkillFuncLocker"
import { YuMiJiQiRenControl } from "./YuMiJiQiRenControl";
import * as fgui from "fairygui-cc";
import { TimeHelper } from "../../../../helpers/TimeHelper";

enum GongChengShiRes {
    Normal1 = "gongchengshi_1",
    Normal2 = "gongchengshi_2",
    Normal3 = "gongchengshi_3",
    DaoDan = "gongchengshi_daodan",
    DaoDanBomb = "gongchengshi_hit_1",
    RanShaoDan = "gongchengshi_ranshao",
    RanShaoDanBomb = "gongchengshi_hit_ranshao",
    HeDan = "gongchengshi_hedan",
    HeDanBomb = "gongchengshi_hedan_bomb",
    HuoYan = "gongchengshi_huoyan",
}
export class GongChengShiControl extends HeroControl {
    //全场发射导弹
    private static daodanCount = 0; 

    static defaultJumpCount : number  = 1;
    
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);
    private  daodanLocker : SkillFuncLocker = null;
    // private daodanTrackInfo : Map<SkillFunc,MonsterObj> = null;

    private huoyanSet : Set<SkillRange> = null;

    private ranshaoTimer : any = null;

    protected skillFuncRes = {
        [GongChengShiRes.Normal1] : SkillFuncResInit.Create(
            [{stage:3,resName:GongChengShiRes.Normal2},
            {stage:5,resName:GongChengShiRes.Normal3}]
        ),
        [GongChengShiRes.DaoDan] : SkillFuncResUnlock.Create(HeroSkillId.GongChengShi.DaoDan),
        [GongChengShiRes.DaoDanBomb] : SkillFuncResUnlock.Create(HeroSkillId.GongChengShi.DaoDan),
        [GongChengShiRes.RanShaoDan] : SkillFuncResUnlock.Create(HeroSkillId.GongChengShi.RanShaoDan),
        [GongChengShiRes.RanShaoDanBomb] : SkillFuncResUnlock.Create(HeroSkillId.GongChengShi.RanShaoDan),
        [GongChengShiRes.HeDan] : SkillFuncResUnlock.Create(HeroSkillId.GongChengShi.NBomb),
        [GongChengShiRes.HeDanBomb] : SkillFuncResUnlock.Create(HeroSkillId.GongChengShi.NBomb),
        [GongChengShiRes.HuoYan] : SkillFuncResUnlock.Create(HeroSkillId.GongChengShi.DaoDanFire),
        // [LaBiRes.Hit] : SkillFuncResUnlock.Create(HeroSkillId.Labi.HitBaoZha),
        // [LaBiRes.BigFire] : SkillFuncResUnlock.Create(HeroSkillId.Labi.BigFire),
    }

    Init(){
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.GongChengShi.DaoDan,this.SkillDaoDanBefore.bind(this));
        // EventCtrl.Inst().on(BattleEventType.MonsterDie, this.SkillDaoDanMonsterDie, this);
        // this.RegisterSkill(SkillPlayType.Before,HeroSkillId.GongChengShi.DaoDanCount,this.SkillDaoDanBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.GongChengShi.RanShaoDan,this.SkillRanShaoDanBefore.bind(this));
        this.RegisterSkill(SkillPlayType.Before,HeroSkillId.GongChengShi.RobotAtk,this.SkillRobotAtkBefore.bind(this));
        this.daodanLocker = new SkillFuncLocker((bullet,initSearch)=>{
            if(initSearch){
                return BattleDynamicHelper.FindRandomMonster(null, this.hero.tag);
            }
            else{
                return BattleDynamicHelper.FindClosestMonster(bullet.node.worldPosition, null, this.hero.tag);
            }
        });
    }
    OnFightStart(){
        GongChengShiControl.daodanCount = 0;
    }

    OnFightEnd(){
        if(this.huoyanSet){
            this.huoyanSet.clear();
        }
    }

    DefaultSkillAction(){
        let mo = BattleDynamicHelper.FindClosestMonster(this.hero.worldPosition, null, this.hero.tag);
        if(mo == null){
            return;
        }
        this.CrateSkillFuncByName(GongChengShiRes.Normal1, (skillFunc:SkillStraight)=>{
            let angle = MathHelper.VecZEuler(mo.centerWorldPos.x - this.hero.worldPosition.x,
                mo.centerWorldPos.y - this.hero.worldPosition.y); //360 - MathHelper.GetVecAngle(this.hero.worldPosition,mo.centerWorldPos);  
            skillFunc.SetEulerAngle(angle);
            // 工程师的攻击传递次数+ X
            let addAtkCount = 0;
            if(BattleData.Inst().IsHasSkill(HeroSkillId.GongChengShi.AtkCount, this.hero.tag)){
                let cfg = BattleData.Inst().GetSkillCfg(HeroSkillId.GongChengShi.AtkCount)
                let skCount = this.GetSkillCount(cfg);
                addAtkCount = cfg.pram1 * skCount;
            }
            skillFunc.hp = GongChengShiControl.defaultJumpCount + addAtkCount + 1;//1是基础血量(弹射次数)
        });
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        if(event.skillFunc.hp <= 0){
            this.StopSkill(event.skillFunc);
        }
        else{
            //弹射目标
            let funcPos = event.skillFunc.playNode.worldPosition;
            let mo = BattleDynamicHelper.FindClosestMonster(funcPos,Array.from(event.skillFunc.excludeMap.keys()), this.hero.tag);
            if(mo != null){
                let angle = 360 - MathHelper.GetVecAngle(funcPos,mo.centerWorldPos);
                event.skillFunc.SetEulerAngle(angle);
            }
        }
        let attackValue = this.CalculateAttackValue();
        monster.DeductHp(this.hero, attackValue);
    }

    SkillDaoDanBefore(skill:CfgSkillData, event:SkillColliderEvent){
        let rate = skill.pram1;
        if(BattleData.Inst().IsHasSkill(HeroSkillId.GongChengShi.DaoDanRate,this.hero.tag)){
            let addRateCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.GongChengShi.DaoDanRate);
            let skCount = this.GetSkillCount(addRateCfg);
            rate += (addRateCfg.pram1 * skCount);
        }
        if(MathHelper.RndRetPercent(rate)){
            let damScale = 1;
            if(BattleData.Inst().IsHasSkill(HeroSkillId.GongChengShi.DaoDanDam,this.hero.tag)){
                let damScCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.GongChengShi.DaoDanDam);
                let damScCount = this.GetSkillCount(damScCfg);
                damScale += MathHelper.NumToPer(damScCfg.pram1 * damScCount);
            }
            let count = 1;
            if(!BattleData.Inst().HandleSkill(HeroSkillId.GongChengShi.DaoDanCount2,(cfg)=>{count = cfg.pram1;}, this.hero.tag)){
                BattleData.Inst().HandleSkill(HeroSkillId.GongChengShi.DaoDanCount,(cfg)=>{count = cfg.pram2;}, this.hero.tag)
            }
            for(let i = 0;i != count;++i){
                this.sendDaoDan(GongChengShiRes.DaoDan,GongChengShiRes.DaoDanBomb,damScale);
            }
        }
    }

    SkillRanShaoDanBefore(skill:CfgSkillData, event:SkillColliderEvent){
        let rate = skill.pram1;
        if(MathHelper.RndRetPercent(rate)){
            this.sendDaoDan(GongChengShiRes.RanShaoDan,GongChengShiRes.RanShaoDanBomb,MathHelper.NumToPer(skill.pram2));
        }
    }

    //X%的概率让周围的机器人射出导弹
    SkillRobotAtkBefore(skill:CfgSkillData, event:SkillColliderEvent){
        let rate = skill.pram1;
        if(MathHelper.RndRetPercent(rate)){
            let round = skill.pram2;
            let heros = this.GetRoundHeros(round);
            for(let he of heros){
                if(he.heroCtrl && (he.heroCtrl instanceof YuMiJiQiRenControl)){
                    he.heroCtrl.SendDaoDan();
                }
            }
        }
    }

    private sendDaoDan(resName:string,hitResName:string,damScale : number = 1){
        this.CrateHitSkillFuncByName(resName,this.hero.worldPosition, 
            this.DaoDanHitEvent.bind(this,hitResName,damScale),(skillFunc:SkillBulletTrack)=>{
            let initAngle = MathHelper.GetRandomNum(0,360);
            skillFunc.SetEulerAngle(initAngle);
            // let trackMo = BattleDynamicHelper.FindRandomMonster();
            // skillFunc.SetTrackNode(trackMo.node);
            this.daodanLocker.BeginLock(skillFunc);
            // this.addDaoDanTrack(skillFunc,trackMo);
            this.PlaySkill(skillFunc);
        });
        if(resName != GongChengShiRes.DaoDan){
            return;
        }
        //丢核弹
        BattleData.Inst().HandleSkill(HeroSkillId.GongChengShi.NBomb,(cfg)=>{
            if(++GongChengShiControl.daodanCount < cfg.pram1){
                return;
            }
            GongChengShiControl.daodanCount = 0;
            let worldCenter = this.scene.node.worldPosition;
            let startPos = new Vec3(worldCenter.x,0,0);
            this.CrateHitSkillFuncByName(GongChengShiRes.HeDan,startPos,
                null,
                (hedan:SkillShoot)=>{
                    hedan.SetEulerAngle(0);
                    hedan.shootLength = worldCenter.y;
                    hedan.node.worldPosition = startPos;
                    hedan.OnStop((skill)=>{
                        this.CrateHitSkillFuncByName(GongChengShiRes.HeDanBomb,skill.playNode.worldPosition,
                            this.HeDanHitEvent.bind(this),(hedanBomb)=>{
                                this.PlaySkill(hedanBomb);
                            });
                        // this.StopSkill(skill);
                    });
                    this.PlaySkill(hedan);
                }
            );
        }, this.hero.tag);
    }

    HeDanHitEvent(event: SkillColliderEvent){
        let hedanCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.GongChengShi.NBomb);
        let damSc = MathHelper.NumToPer(hedanCfg.pram2);
        event.objs.forEach(hitMo=>{
            let att_value = this.CalculateAttackValue(0,damSc);
            hitMo.DeductHp(this.hero, att_value);
            event.skillFunc.SetExcludeObj(hitMo);
        });
    }

    DaoDanHitEvent(hitName: string,damScale: number,event: SkillColliderEvent){
        // let trackMon = this.getDaoDanTrackMonster(event.skillFunc);
        // if(trackMon == null){
        //     return;
        // }
        // if(!event.objs.includes(trackMon)){
        //     event.objs.forEach((mon)=>{//设置所有怪忽略防止重复回调事件
        //         event.skillFunc.SetExcludeObj(mon);
        //     })
        //     return;
        // }
        //击中锁定怪，导弹爆炸
        if(!this.daodanLocker.OnHitEvent(event)){
            return;
        }
        this.daodanLocker.EndLock(event.skillFunc);
        let funcPos = event.skillFunc.node.worldPosition
        this.StopSkill(event.skillFunc);
        // this.removeDaoDanTrackBullet(event.skillFunc);
        this.CrateHitSkillFuncByName(hitName,funcPos,
            // this.DaoDanBombHitEvent.bind(this) 
            (event)=>{
                event.objs.forEach(hitMo=>{
                    let att_value = this.CalculateAttackValue(0,damScale);
                    hitMo.DeductHp(this.hero, att_value);
                    event.skillFunc.SetExcludeObj(hitMo);
                });
            }
            ,(skillFunc:SkillRange)=>{
                AudioManager.Inst().Play(AudioTag.GongChengShiBomb);
                if(BattleData.Inst().IsHasSkill(HeroSkillId.GongChengShi.BiggerBomb,this.hero.tag)){
                    let biggerBombCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.GongChengShi.BiggerBomb);
                    let scale = biggerBombCfg.pram1 / 100 + 1;
                    skillFunc.SetScale(scale);
                }
                this.PlaySkill(skillFunc);
        }); 
        //导弹爆炸留下火焰
        if(hitName != GongChengShiRes.DaoDanBomb){
            return;
        }

        let huoyanCfg = this.GetHasSkill(HeroSkillId.GongChengShi.DaoDanFire);
        if(huoyanCfg){
            if(!this.ranshaoTimer){
                this.ranshaoTimer = setInterval(()=>{
                    if(!this.huoyanSet){return;}
                    this.huoyanSet.forEach((sf)=>{
                        sf.ClearExclude();
                    });
                },1000);
            }
            this.CrateHitSkillFuncByName(GongChengShiRes.HuoYan,funcPos,
                (event)=>{
                    event.objs.forEach(hitMo=>{
                        let att_value = this.CalculateAttackValue(0,MathHelper.NumToPer(huoyanCfg.pram2));
                        hitMo.DeductHp(this.hero, att_value);
                        event.skillFunc.SetExcludeObj(hitMo);
                    });
                },
                (rsFunc:SkillRange)=>{
                    rsFunc.playTime = huoyanCfg.pram1;
                    if(!this.huoyanSet){this.huoyanSet = new Set<SkillRange>();}
                    this.huoyanSet.add(rsFunc);
                    rsFunc.OnStop(()=>{
                        this.huoyanSet.delete(rsFunc);
                    });
                    this.PlaySkill(rsFunc);
                })
        }
        
    }

    DaoDanBombHitEvent(event: SkillColliderEvent){
        event.objs.forEach(hitMo=>{
            let att_value = this.CalculateAttackValue();
            hitMo.DeductHp(this.hero, att_value);
            event.skillFunc.SetExcludeObj(hitMo);
        });
    }
    

    // SkillDaoDanMonsterDie(monster:MonsterObj){
    //     if(this.daodanTrackInfo == null){return;}
    //     // console.error(`SkillDaoDanMonsterDie===${monster.objId},hp=${monster.hp}`);
    //     this.daodanTrackInfo.forEach((mon,bullet)=>{
    //         if(bullet instanceof SkillBulletTrack){
    //             if(mon == monster){
    //                 // console.error(`DeleteDaoDanTrack==222==${bullet._id},moId=${monster.objId},moHp=${monster.hp}`);
    //                 this.removeDaoDanTrackBullet(bullet);
    //                 let nextTrack = BattleDynamicHelper.FindClosestMonster(bullet.node.worldPosition)
    //                 if(nextTrack == null){
    //                     // console.error("ChangeTrack NULL")
    //                     bullet.SetTrackNode(null);
    //                 }
    //                 else{
    //                     // console.error(`ChangeTrack====,moId=${monster.objId},moHp=${monster.hp}`)
    //                     bullet.SetTrackNode(nextTrack.node);
    //                     this.addDaoDanTrack(bullet,nextTrack);
    //                 }
    //             }
    //         }

    //     })
    //     // console.error(`monsterDie===${monster},${monster.objId}`)
    // }

    // private addDaoDanTrack(bullet: SkillFunc,monster:MonsterObj){
    //     if(this.daodanTrackInfo == null){
    //         this.daodanTrackInfo = new Map();
    //     }
    //     // console.error(`AddDaoDanTrack====${bullet._id},${monster.objId},${monster.hp}`)
    //     this.daodanTrackInfo.set(bullet,monster);
    // }


    // private removeDaoDanTrackBullet(bullet: SkillFunc){
    //     if(this.daodanTrackInfo == null){return;}
    //     if(this.daodanTrackInfo.has(bullet)){
    //         let mo = this.daodanTrackInfo.get(bullet);
    //         // console.error(`DeleteDaoDanTrack==111==${bullet._id},${mo.objId},${mo.hp}`)
    //         this.daodanTrackInfo.delete(bullet);
    //     }
    // }

    // private getDaoDanTrackMonster(bullet: SkillFunc) : MonsterObj{
    //     if(this.daodanTrackInfo == null){
    //         return null;
    //     }
    //     if(!this.daodanTrackInfo.has(bullet)){
    //         return null;
    //     }
    //     return this.daodanTrackInfo.get(bullet);
    // }

    onDestroy(){
        super.onDestroy();
        if(this.daodanLocker){
            this.daodanLocker.Destroy();
            this.daodanLocker = null;
        }
        if(this.ranshaoTimer){
            clearInterval(this.ranshaoTimer);
            this.ranshaoTimer = null;
        }
        // EventCtrl.Inst().off(BattleEventType.MonsterDie, this.SkillDaoDanMonsterDie, this);
    }
}

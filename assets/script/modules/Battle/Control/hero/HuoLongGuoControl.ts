import { _decorator, Node, Vec3, Intersection2D } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent, SkillFunc } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { MathHelper } from '../../../../helpers/MathHelper';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { MainSceneBG } from 'modules/Battle/MainSceneBG';
import { IMonsterObjBuffData, MonsterObjBuffType } from 'modules/Battle/BattleConfig';
import { JiTuiBuff, MonterBuff } from 'modules/Battle/Function/MonsterBuff';
import { CfgSkillData } from 'config/CfgEntry';
import { BattleData } from 'modules/Battle/BattleData';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { NodePools } from 'core/NodePools';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { BattleHelper } from 'modules/Battle/BattleHelper';
enum SkillRes {
    Normal = "HuoLongGuo_1",
    HuoYan = "HuoYan",
    GangFeng = "GangFeng",
    HuoYanFengBao = "HuoYanFengBao",
    FuChouHuoYan = "FuChouHuoYan",
    FuChouHuoYanFengBao = "FuChouHuoYanFengBao",
}

interface IJ{i:number, j:number}

export class HuoLongGuoControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);

    private playCount:number = 1;
    private huoyanTime: number = 2;

    private runTime: number = 0;

    // 技能资源
    protected skillFuncRes = {
        [SkillRes.Normal] : SkillFuncResInit.Create(),
        [SkillRes.HuoYan] : SkillFuncResInit.Create(),
        [SkillRes.GangFeng] : SkillFuncResUnlock.Create(HeroSkillId.HuoLongGuo.Skill3),
        [SkillRes.HuoYanFengBao] : SkillFuncResUnlock.Create(HeroSkillId.HuoLongGuo.Skill7),
        [SkillRes.FuChouHuoYan] : SkillFuncResUnlock.Create(HeroSkillId.HuoLongGuo.Skill10),
        [SkillRes.FuChouHuoYanFengBao] : SkillFuncResUnlock.Create(HeroSkillId.HuoLongGuo.Skill11),
    }

    Init(){
        this.RegisterSkillHandle(HeroSkillId.HuoLongGuo.Skill1,this.SetBulletCount.bind(this));
    }

    Run(dt:number){
        this.runTime += dt;
        let skill7 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill7);
        if(skill7){
            if(this.runTime >= skill7.pram1){
                this.PlayBaoLieMoFa();
                this.runTime = 0;
            }
        }
    }

    SetBulletCount(skill:CfgSkillData){
        let new_count = skill.pram1;
        if(new_count > this.playCount){
            this.playCount = new_count;
        }
    }

    //每回合战斗开始回调
    OnFightStart(){
        
    }

    
    GetPlayPosList(pos:Vec3, count: number):IJ[]{
        let angle = MathHelper.GetVecAngle(this.node.worldPosition, pos);
        //angle = 360 - angle;
        let index = Math.ceil(((angle + 22.5) % 360) / 45);

        let i = 0;
        let j = 0;
        switch (index) {
            case 1: i = 1, j = 0; break;
            case 2: i = 1, j = 1; break;
            case 3: i = 0, j = 1; break;
            case 4: i = -1, j = 1; break;
            case 5: i = -1, j = 0; break;
            case 6: i = -1, j = -1; break;
            case 7: i = 0, j = -1; break;
            case 8: i = 1, j = -1; break;
        }

        let list: IJ[] = [];
        for(let n = 1; n <= count; n++){
            let ij = {i : this.hero.i, j : this.hero.j}
            ij.i += n * i;
            ij.j += n * j;
            list.push(ij);
        }
        return list;
    }

    GetTotalAttackValue(mosnter:MonsterObj):number{
        let addPer = 0;
        let damScale = 1;

        let skill4 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill4);
        if(skill4){
            if(mosnter.HasBuff(MonsterObjBuffType.KonJu)){
                damScale += skill4.pram1 / 100;
            }
        }

        let attValue = this.CalculateAttackValue(addPer, damScale);
        return attValue;
    }

    //获取周围X格的地上火焰
    GetRangeHuoYan():SkillFunc[]{
        let rect = this.attackRange.GetWordAABB(this.node.worldPosition, 1);
        let skillList = this.scene.dynamic.GetAllSkill();
        let huoyanList:SkillFunc[] = [];
        skillList.forEach(skill=>{
            let skillName = skill.node.name;
            if((skillName == "DianRang" || skillName == "FuChouHuoYan") && Intersection2D.rectRect(skill.worldAABB, rect)){
                huoyanList.push(skill);
            }
        })
        return huoyanList;
    }



    //默认技能效果
    DefaultSkillAction(i:number = 0){
        let monsters = this.GetRoundMonsters(1, this.node.worldPosition);
        let skill3 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill3);
        let length = 1;
        let isGangfeng = false;
        if(skill3){
            let skill3Rate = skill3.pram1;
            let skill9 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill9);
            if(skill9){
                skill3Rate += skill9.pram1;
            }
            if(MathHelper.RandomResult(skill3Rate, 100)){
                length = 3;
                isGangfeng = true;
            }
        }

        monsters.forEach(monster=>{
            if(i < this.playCount){
                this.PlayNormalSkill(monster.worldPosition, length, isGangfeng);
                i++;
            }
        });

    }

    //释放普通的火球
    PlayNormalSkill(pos:Vec3, count:number, isGangFeng?:boolean){
        let ijList = this.GetPlayPosList(pos, count);
        //let ijPos = this.sceneBg.GetWorldPos(ijList[0].i, ijList[0].j);
        let ijPos = BattleHelper.GetWorldPos(ijList[0].i, ijList[0].j, this.hero.tag);

        let isFuChou = false;
        if(isGangFeng){
            let skill10 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill10);
            if(skill10 && MathHelper.RandomResult(skill10.pram1, 100)){
                isFuChou = true;
            }
        }

        let angle = MathHelper.GetVecAngle(this.node.worldPosition, ijPos);
        angle = 360 - angle;
        this.CrateSkillFuncByName(SkillRes.Normal, (skill:SkillShoot)=>{
            skill.SetEulerAngle(angle);
            skill.OnStop(()=>{
                ijList.forEach(ij=>{
                    let huoyanPos = BattleHelper.GetWorldPos(ij.i, ij.j, this.hero.tag);
                    this.PlayHuoYan(huoyanPos, isFuChou);
                })
            });
        });

        if(isGangFeng){
            this.PlayGangFeng(angle);
        }
    }

    //地上放一个火焰
    PlayHuoYan(pos:Vec3, isFuChou:boolean = false){
        if(!this.IsCanBattle()){
            return;
        }
        let ijPos = pos;
        let skillName = isFuChou ? SkillRes.FuChouHuoYan : SkillRes.HuoYan;
        let hitEvent = isFuChou ? this.OnFuChouFireHieEvent.bind(this) : this.OnFireHieEvent.bind(this);


        this.CrateHitSkillFuncByName(skillName, ijPos, hitEvent,(skillFunc:SkillRange)=>{
            let time = this.huoyanTime;
            let skill2 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill2);
            if(skill2){
                let count = this.GetSkillCount(skill2);
                time = time + count * skill2.pram1;
            }
            skillFunc.playTime = time;
            this.PlaySkill(skillFunc);
            AudioManager.Inst().PlaySceneAudio(AudioTag.diyuhuolongguoshouji);
        }, this.scene.BottomEffectRoot);
    }

    //释放地狱罡风
    PlayGangFeng(angle:number){
        this.CrateHitSkillFuncByName(SkillRes.GangFeng, this.node.worldPosition, this.OnGangFengHitEvent.bind(this), (skill:SkillShoot)=>{
            skill.SetEulerAngle(angle);
            this.PlaySkill(skill);
        })
    }

    //释放爆裂魔法
    PlayBaoLieMoFa(){
        SceneEffect.Inst().Play(SceneEffectConfig.BaoLieMoFa, null, this.node.worldPosition);
        let monsters = this.GetRoundMonsters(1, this.node.worldPosition);
        if(monsters){
            let skill7 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill7);
            if(skill7){
                let attackValue = this.CalculateAttackValue(0, skill7.pram2 / 100);
                monsters.forEach(m=>{
                    m.DeductHp(this.hero, attackValue);
                })
            }
        }

        let skillList = this.GetRangeHuoYan();
        if(skillList && skillList.length > 0){
            let skill11 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill11);
            skillList.forEach((skill)=>{
                if(skill.node.name == "FuChouHuoYanFengBao" && skill11){
                    this.PlayFuChouHuoYanFengBao(skill.node.worldPosition);
                }else{
                    this.PlayHuoYanFengBao(skill.node.worldPosition);
                }
            })
        }
    }

    //释放火焰风暴
    PlayHuoYanFengBao(pos:Vec3){
        this.CrateHitSkillFuncByName(SkillRes.HuoYanFengBao, pos, this.OnHuoYanFengBaoHit.bind(this), (skill:SkillRange)=>{
            this.PlaySkill(skill);
        }, this.scene.BottomEffectRoot)
    }

    //释放复仇火焰风暴
    PlayFuChouHuoYanFengBao(pos:Vec3){
        let skill11 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill11);
        if(!skill11){
            return;
        }
        this.CrateHitSkillFuncByName(SkillRes.FuChouHuoYanFengBao, pos, this.OnFuChouHuoYanFengBaoHit.bind(this), (skill:SkillRange)=>{
            skill.playTime += skill11.pram2;
            this.PlaySkill(skill);
        }, this.scene.BottomEffectRoot)
    }

    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
    }


    //火焰命中事件
    OnFireHieEvent(event:SkillColliderEvent){
        //console.log("火焰命中事件", event.objs.length);
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let attackValue = this.GetTotalAttackValue(monster);
                this.AddHuoYanBuff(monster, attackValue);
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }

    //复仇火焰命中事件
    OnFuChouFireHieEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            let skill10 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill10);
            event.objs.forEach(monster=>{
                let attackValue = this.GetTotalAttackValue(monster);
                attackValue += attackValue * skill10.pram2 / 100;
                this.AddHuoYanBuff(monster, attackValue);
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }


    //罡风命中事件
    OnGangFengHitEvent(event: SkillColliderEvent){
        let skill5 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill5);
        if(skill5 && MathHelper.RandomResult(skill5.pram1, 100)){
            //击退
            let count = skill5.pram2;
            for(let i = 0; i < count && i < event.objs.length; i++){
                let monster = event.objs[i];
                monster.AddBuff(JiTuiBuff.CreateData(this.hero,null,0.15));
                event.SetExcludeObj(monster);
            }
        }
    }

    //火焰风暴命中事件
    OnHuoYanFengBaoHit(event: SkillColliderEvent){
        event.objs.forEach(monster=>{
            let attackValue = this.GetTotalAttackValue(monster);
            monster.DeductHp(this.hero, attackValue);
            event.skillFunc.SetExcludeObj(monster);
        })
    }

    //复仇火焰风暴命中事件
    OnFuChouHuoYanFengBaoHit(event: SkillColliderEvent){
        let skill11 = this.GetHasSkill(HeroSkillId.HuoLongGuo.Skill11);
        if(skill11 == null) return;
        event.objs.forEach(monster=>{
            let attackValue = this.GetTotalAttackValue(monster);
            attackValue += attackValue * skill11.pram1 / 100;
            monster.DeductHp(this.hero, attackValue);
            event.skillFunc.SetExcludeObj(monster);
        })
    }


    AddHuoYanBuff(monster:MonsterObj, attackValue:number){
        monster.DeductHp(this.hero, attackValue);
        monster.AddBuff(<IMonsterObjBuffData>{
            buffType:MonsterObjBuffType.ZhuoShao,
            hero:this.hero,
            p1:MonterBuff.DefaultDamge(attackValue),
            p2:1,
        })
    }
}


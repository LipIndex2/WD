import { _decorator, Node, Vec3 } from 'cc';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { CfgSkillData } from 'config/CfgEntry';
import { IMonsterObjBuffData, MonsterObjBuffType } from 'modules/Battle/BattleConfig';
import { BattleData } from 'modules/Battle/BattleData';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { MathHelper } from '../../../../helpers/MathHelper';
enum SkillRes {
    Normal = "sibadazhu_1",
    HuanYingZhu = "huanyingzhu",
    ShanXIngZuoZi = "ShanXIngZuoZi",
}
export class SiBaDaZhuControl extends HeroControl {
    // 范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);

    //每次释放多少个竹子
    private playCount:number = 1;
    //爆竹范围
    private skillScale:number = 1;

    //每隔多少时间播放幻影竹
    private huanyingzhuTime = 0;
    private _huanyingzhuTime = 0;

    // 技能资源
    protected skillFuncRes = {
        [SkillRes.Normal] : SkillFuncResInit.Create(),
        [SkillRes.HuanYingZhu] : SkillFuncResUnlock.Create(HeroSkillId.SiBaDaZhu.Skill7),
        [SkillRes.ShanXIngZuoZi] : SkillFuncResUnlock.Create(HeroSkillId.SiBaDaZhu.Skill10),
    }

    Init(){
        this.RegisterSkillHandle(HeroSkillId.SiBaDaZhu.Skill1,this.SetForBullet.bind(this));
        this.RegisterSkillHandle(HeroSkillId.SiBaDaZhu.Skill9,this.SetForBullet.bind(this));
        this.RegisterSkillHandle(HeroSkillId.SiBaDaZhu.Skill5,this.SetSkillScale.bind(this));
        this.OnSkillChange();
    }

    Run(dt:number){
        if(this.huanyingzhuTime > 0){
            this._huanyingzhuTime += dt;
            if(this._huanyingzhuTime >= this.huanyingzhuTime){
                this.PlayHuanYingZhu();
                this._huanyingzhuTime = 0;
            }
        }
    }

    OnSkillChange(){
        if(this.huanyingzhuTime == 0){
            let skill7 = this.GetHasSkill(HeroSkillId.SiBaDaZhu.Skill7);
            if(skill7){
                this.huanyingzhuTime = skill7.pram1;
                this._huanyingzhuTime = skill7.pram1;
            }
        }
    }


    //默认技能效果
    DefaultSkillAction(i:number = 0){
        let monsters = this.GetRoundMonsters(1, this.node.worldPosition);
        monsters.forEach(monster=>{
            if(i < this.playCount){
                this.PlayNormalSkill(monster.worldPosition);
                i++;
            }
        });

        if(i < this.playCount){
            this.scheduleOnce(()=>{
                this.DefaultSkillAction(i);
            }, 0.2)
        }

        AudioManager.Inst().PlaySceneAudio(AudioTag.sibadazu);
        this.PlayShanXing();
    }

    //设置前方子弹数量
    SetForBullet(skill:CfgSkillData){
        this.playCount = skill.pram1;
    }
    //设置爆竹范围
    SetSkillScale(skill:CfgSkillData){
        let count = this.GetSkillCount(skill);
        this.skillScale = 1 + count * skill.pram1 / 100;
    }

    //释放普通的竹子
    PlayNormalSkill(pos:Vec3){
        let angle = MathHelper.GetVecAngle(this.node.worldPosition, pos);
        angle = 360 - angle;
        this.CrateHitSkillFuncByName(SkillRes.Normal, this.node.worldPosition, this.OnHitEvent.bind(this), (skill:SkillShoot)=>{
            //skill.SetScale(this.skillScale);
            skill.SetEulerAngle(angle);
            skill.scale = this.skillScale;
            this.PlaySkill(skill);
        });
    }

    //前方扇形攻击
    PlayShanXing(){
        let skill10 = this.GetHasSkill(HeroSkillId.SiBaDaZhu.Skill10);
        if(skill10){
            if(MathHelper.RandomResult(skill10.pram1, 100)){
                this.CrateHitSkillFuncByName(SkillRes.ShanXIngZuoZi, this.node.worldPosition, this.OnSanXingHitEvent.bind(this), (skill:SkillRange)=>{
                    this.PlaySkill(skill);
                })
            }
        }
    }
    OnSanXingHitEvent(event:SkillColliderEvent){
        event.objs.forEach((monster)=>{
            let skill10 = this.GetHasSkill(HeroSkillId.SiBaDaZhu.Skill10);
            if(skill10){
                let attValue = this.CalculateAttackValue(0, skill10.pram2 / 100);
                monster.DeductHp(this.hero, attValue)
            }
            event.skillFunc.SetExcludeObj(monster);
        })
    }


    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        event.objs.forEach((monster)=>{
            this.OnHitMonster(monster);
            event.skillFunc.SetExcludeObj(monster);
        })
    }

    OnHitMonster(monster:MonsterObj){
        let addPer:number = 0;
        let damScale:number = 1;

        let skill8 = this.GetHasSkill(HeroSkillId.SiBaDaZhu.Skill8);
        if(skill8){
            damScale = skill8.pram1 / 100;
        }else{
            let skill2 = this.GetHasSkill(HeroSkillId.SiBaDaZhu.Skill2);
            if(skill2){
                if(monster.HasBuff(MonsterObjBuffType.JinGu)){
                    damScale += skill2.pram1 / 100;
                }
            }
        }
        

        let attVlaue = this.CalculateAttackValue(addPer, damScale);
        monster.DeductHp(this.hero, attVlaue);

        let skill3 = this.GetHasSkill(HeroSkillId.SiBaDaZhu.Skill3)
        if(skill3 && !monster.IsDied()){
            this.AddLiuXue(monster, skill3.pram1, attVlaue * skill3.pram2 / 100)
        }
    }


    //加流血buff
    AddLiuXue(monster:MonsterObj, time:number, value:number){
        let buff = <IMonsterObjBuffData>{
            buffType: MonsterObjBuffType.LiuXue,
            hero: this.hero,
            time: time,
            p1: value,
        }
        monster.AddBuff(buff);
    }

    //释放幻影竹
    PlayHuanYingZhu(){
        this.CrateHitSkillFuncByName(SkillRes.HuanYingZhu, this.node.worldPosition, this.OnHitHuanYingZhu.bind(this), (skill:SkillRange)=>{
            this.PlaySkill(skill);
        });
    }

    OnHitHuanYingZhu(event:SkillColliderEvent){
        let skill7 = this.GetHasSkill(HeroSkillId.SiBaDaZhu.Skill7);
        if(skill7){
            event.objs.forEach((monster)=>{
                let attValue = this.CalculateAttackValue(0, skill7.pram2 / 100);
                monster.DeductHp(this.hero, attValue);
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }
}


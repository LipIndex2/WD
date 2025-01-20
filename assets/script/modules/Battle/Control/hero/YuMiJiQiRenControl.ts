import { _decorator, Component, Node, instantiate, Vec3, Pool, math, Vec2, UITransform, RichText } from 'cc';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { AttackConditionType, FIGHT_CELL_WIDTH, HeroObjBuffType, IHeroObjBuffData, IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleData } from 'modules/Battle/BattleData';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { MonterBuff } from 'modules/Battle/Function/MonsterBuff';
import { SkillBulletTrack } from 'modules/Battle/Function/SkillBulletTrack';
import { SkillColliderEvent } from 'modules/Battle/Function/SkillFunc';
import { SkillRange } from 'modules/Battle/Function/SkillRange';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { SkillStraight } from 'modules/Battle/Function/SkillStraight';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { ResPath } from 'utils/ResPath';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { SkillFuncLocker } from '../SkillFuncLocker';


enum YuMiJiQiRenControlSkillIdType{
    chongdian = 116,    //玉米机器人击杀敌人后，给周围一格友军增加<color=#DF7401>{0}</color>%伤害，持续{1}s
    yumizi = 119,       //玉米机器人击杀敌人后，留下一滩玉米汁
    yumizifanwei = 120, //玉米机器人产生的玉米汁范围+<color=#036b16>{0}</color>%,
    jiashang = 121,     //玉米机器人对HP><color=#DF7401>{0}</color>%的敌人，单次攻击额外造成其最大生命值{1}%伤害
    tanshushuliang = 324,   //玉米机器人弹射数量+<color=#036b16>+{0}</color>
    skill9 = 352,       //<color=#036b16>玉米机器人</color>的眩晕时间增加<color=#036b16>{1}秒</color>
    skill10 = 353,      //<color=#036b16>玉米机器人</color>每次眩晕敌人时，<color=#036b16>{0}%</color>概率会对其周围的敌人造成<color=#036b16>{1}秒</color>的眩晕
    Skill11 = 423,      //<color=#036b16>玉米机器人</color>为队友充能时，增加的伤害增加到<color=#036b16>{0}%</color>
}
enum YuMiJiQiRenRes {
    DaoDan = "gongchengshi_daodan",
    DaoDanBomb = "gongchengshi_hit_1",
    YuMiZi = "yumizi",
    TanSe = "yumi_2",
}


export class YuMiJiQiRenControl extends HeroControl {
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);
    private angleNum:number = 0;
    private  daodanLocker : SkillFuncLocker = null;

    protected skillFuncRes = {
        [YuMiJiQiRenRes.TanSe] :  SkillFuncResInit.Create(),
        [YuMiJiQiRenRes.DaoDan] : SkillFuncResUnlock.Create(HeroSkillId.GongChengShi.RobotAtk),
        [YuMiJiQiRenRes.DaoDanBomb] : SkillFuncResUnlock.Create(HeroSkillId.GongChengShi.RobotAtk),
        [YuMiJiQiRenRes.YuMiZi] : SkillFuncResUnlock.Create(YuMiJiQiRenControlSkillIdType.yumizi),
    }

    Init(){
    }

    //默认攻击
    DefaultSkillAction(){
        AudioManager.Inst().Play(AudioTag.yumijiqiren);
        this.CrateSkillFunc(this.shootEffectPath,(skillFunc:SkillShoot)=>{
            skillFunc.scale = this.skillBuff.attackRangeScale;
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
        });
    }

    //随机获取一个目标
    GetRandomMonster(excludes:MonsterObj[]):MonsterObj{
        let monsters:MonsterObj[] = [];
        let dyMonsters = BattleDynamicHelper.GetMonsterMap(this.hero.tag);
        dyMonsters.forEach((monster)=>{
            if(excludes.indexOf(monster) == -1){
                monsters.push(monster);
            }
        })
        if(monsters.length == 0){
            return;
        }
        let index = MathHelper.GetRandomNum(0, monsters.length - 1);
        let monster = monsters[index]
        return monster;
    }

    //随机打一个敌人
    RandomAttackMonster(curMonster:MonsterObj){
        let monster = this.GetRandomMonster([curMonster]);
        if(monster == null){
            return;
        }
        this.CrateHitSkillFunc(ResPath.SkillAsset(YuMiJiQiRenRes.TanSe), curMonster.worldPosition, this.OnTanSeHitEvent.bind(this) , (skillFunc:SkillStraight)=>{
            let angle = MathHelper.GetVecAngle(curMonster.worldPosition, monster.worldPosition);
            angle = 360 - angle;
            skillFunc.SetEulerAngle(angle);
            skillFunc.SetExcludeObj(curMonster);
            this.PlaySkill(skillFunc);
            skillFunc.hp = this.skillBuff.tansheshuliang + 1;//1是基础血量(弹射次数)
        });
    }

    //敌人死亡给队友充电
    ChongDian(monster:MonsterObj){
        let skill = BattleData.Inst().GetSkillCfg(YuMiJiQiRenControlSkillIdType.chongdian);
        if(monster.hp <= 0 && this.IsHasSkillByData(skill)){
            let heros = this.GetRoundHeros(1);
            let value:number;

            let skill11 = this.GetHasSkill(YuMiJiQiRenControlSkillIdType.Skill11);
            if(skill11){
                value = skill11.pram1 / 100;
            }else{
                value = skill.pram1/100;
            }

            heros.forEach((hero)=>{
                let data = <IHeroObjBuffData>{
                    buffType:HeroObjBuffType.ChongDian,
                    time:skill.pram2 + this.skillBuff.chongDian,
                    p1:value,
                }
                hero.AddBuff(data);
            })
        }
    }

    //击杀敌人留下一滩玉米汁
    PlayYuMiZi(monster:MonsterObj){
        //console.log("击杀敌人留下一滩玉米汁");
        if(!monster.IsDied()){
            return;
        }
        let skill = BattleData.Inst().GetSkillCfg(YuMiJiQiRenControlSkillIdType.yumizi);
        if(!this.IsHasSkillByData(skill)){
            return;
        }
        let addRangeSkill = BattleData.Inst().GetSkillCfg(YuMiJiQiRenControlSkillIdType.yumizifanwei);
        let skillCount = this.GetSkillCount(addRangeSkill);
        let scale = 1 + addRangeSkill.pram1 / 100 * skillCount;
        this.CrateHitSkillFunc(ResPath.SkillAsset(YuMiJiQiRenRes.YuMiZi),monster.worldPosition, this.OnYuMiZiHitEvent.bind(this),(skillFunc:SkillRange)=>{
            skillFunc.playNode.setScale(scale, scale);
            this.PlaySkill(skillFunc);
        }, this.scene.BottomEffectRoot);
    }

    //计算伤害
    GetTotalAttackValue(monster:MonsterObj):number{
        let value = this.CalculateAttackValue();
        let skill = BattleData.Inst().GetSkillCfg(YuMiJiQiRenControlSkillIdType.jiashang);
        if(this.IsHasSkillByData(skill) && monster.hpProgress > skill.pram1 / 100){
            value += monster.data.hp * skill.pram2 / 100;
        }
        return value;
    }

    //眩晕时间
    GetBingDongTime():number{
        return this.hero.attriCfg.xuanyun_time + this.skillBuff.xuanyuanTime;
    }


    //击中怪物实践
    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        this.StopSkill(event.skillFunc);
        monster.DeductHp(this.hero, this.GetTotalAttackValue(monster));

        //击中之后给一个爆炸特效
        SceneEffect.Inst().Play(SceneEffectConfig.YuMiBaoZa, this.scene.node, monster.worldPosition);
        this.AddJiYun(monster, this.GetBingDongTime());

        this.RandomAttackMonster(monster);

        BattleData.Inst().HandleSkill(YuMiJiQiRenControlSkillIdType.skill10, (skill)=>{
            if(MathHelper.RandomResult(skill.pram1, 100)){
                let monsters = this.GetRoundMonsters(1, monster.worldPosition);
                monsters.forEach(_monster=>{
                    if(_monster != monster){
                        this.AddJiYun(_monster, skill.pram2);
                    }
                })
            }
        }, this.hero.tag)
    }


    AddJiYun(monster:MonsterObj, time:number){
        let data = <IMonsterObjBuffData>{
            buffType:MonsterObjBuffType.XuanYun,
            time:time,
            hero:this.hero,
        };
        monster.AddBuff(data)
    }


    //第二发子弹弹射击中
    OnTanSeHitEvent(event:SkillColliderEvent){
        event.skillFunc.hp--;
        if(event.skillFunc.hp <= 0){
            this.StopSkill(event.skillFunc);
        }else{
            //弹射目标
            let funcPos = event.skillFunc.node.worldPosition;
            let mo =  this.GetRandomMonster(Array.from(event.skillFunc.excludeMap.keys()));
            if(mo != null){
                let angle = 360 - MathHelper.GetVecAngle(funcPos,mo.centerWorldPos);
                event.skillFunc.SetEulerAngle(angle);
            }
        }
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        monster.DeductHp(this.hero, this.GetTotalAttackValue(monster));
        this.ChongDian(monster);
        this.PlayYuMiZi(monster);
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = this.GetAngle(monster);
    }

    GetDir(monster:MonsterObj){
        let dir = new Vec3(0,1,0);
        Vec3.subtract(dir, monster.node.worldPosition, this.node.worldPosition);
        return dir.normalize();
    }

    GetAngle(monster:MonsterObj):number{
        let angle = MathHelper.GetVecAngle(this.node.worldPosition, monster.worldPosition);
        return 360 - angle;
    }

    SendDaoDan(){
        this.CrateHitSkillFuncByName(YuMiJiQiRenRes.DaoDan,this.hero.worldPosition, 
            this.DaoDanHitEvent.bind(this),(skillFunc:SkillBulletTrack)=>{
            let initAngle = MathHelper.GetRandomNum(0,360);
            skillFunc.SetEulerAngle(initAngle);
            if(this.daodanLocker == null){
                this.daodanLocker = new SkillFuncLocker((bullet,initSearch)=>{
                    if(initSearch){
                        return BattleDynamicHelper.FindRandomMonster(null, this.hero.tag);
                    }
                    else{
                        return BattleDynamicHelper.FindClosestMonster(bullet.node.worldPosition, null, this.hero.tag);
                    }
                });
            }
            this.daodanLocker.BeginLock(skillFunc);
            this.PlaySkill(skillFunc);
        }); 
    }

    DaoDanHitEvent(event: SkillColliderEvent){
        //击中锁定怪，导弹爆炸
        if(!this.daodanLocker.OnHitEvent(event)){
            return;
        }
        this.daodanLocker.EndLock(event.skillFunc);
        this.StopSkill(event.skillFunc);
        this.CrateHitSkillFuncByName(YuMiJiQiRenRes.DaoDanBomb,event.skillFunc.node.worldPosition,
            (event)=>{
                event.objs.forEach(hitMo=>{
                    let att_value = this.GetTotalAttackValue(hitMo);
                    hitMo.DeductHp(this.hero, att_value);
                    event.skillFunc.SetExcludeObj(hitMo);
                });
            }
            ,(skillFunc:SkillRange)=>{
                this.PlaySkill(skillFunc);
        }); 
    }

    onDestroy(){
        super.onDestroy();
        if(this.daodanLocker){
            this.daodanLocker.Destroy();
            this.daodanLocker = null;
        }
    }


    //爆炸伤害事件
    OnYuMiZiHitEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let attackValue = this.GetTotalAttackValue(monster);
                monster.AddBuff(<IMonsterObjBuffData>{
                    buffType:MonsterObjBuffType.ZhongDu,
                    time:5,
                    hero:this.hero,
                    p1:MonterBuff.DefaultDamge(attackValue),
                    p2:1,
                })
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }
}
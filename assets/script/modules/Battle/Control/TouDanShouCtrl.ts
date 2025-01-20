import { Vec3, _decorator} from 'cc';
import { IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType } from '../BattleConfig';
import { BattleCtrl } from '../BattleCtrl';
import { MonsterObj } from '../Object/MonsterObj';
import { HeroAttackRange, HeroControl } from './HeroControl';
import { BattleData } from '../BattleData';
import { SkillShoot } from '../Function/SkillShoot';
import { SkillColliderEvent, SkillFunc } from '../Function/SkillFunc';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { CfgSkillData } from 'config/CfgEntry';

enum toudanshouRes {
    Normal = "labi_1",
    Hit = "labi_hit_1",
    BigFire = "labi_2",
}

enum SkillIdType{
    Skill1 = 41,        //<color=#036b16>豌豆射手</color>同时发射扇形范围的<color=#036b16>{0}颗</color>豌豆
    Skill2 = 42,        //<color=#036b16>豌豆射手</color>的豌豆可以穿透<color=#036b16>{0}个</color>敌人
    Skill3 = 43,        //<color=#036b16>豌豆射手</color>攻击眩晕的敌人，使其流血<color=#036b16>{0}秒</color>，每秒造成攻击力<color=#036b16>{1}%</color>的伤害
    Skill4 = 44,        //<color=#036b16>豌豆射手</color>攻击速度<color=#036b16>+{0}%</color>
    Skill5 = 45,        //<color=#036b16>豌豆射手</color>向前方发射<color=#036b16>{0}颗</color>豌豆
    Skill6 = 46,        //<color=#036b16>豌豆射手</color>造成的流血伤害<color=#036b16>+{0}%</color>
    Skill7 = 47,        //<color=#036b16>豌豆射手</color>击杀敌人后，攻击速度<color=#036b16>+{0}%</color>，持续<color=#036b16>{1}秒</color>
    Skill8 = 334,       //<color=#036b16>豌豆射手</color>的子弹会穿透<color=#036b16>{0}个</color>敌人
    Skill9 = 335,       //<color=#036b16>豌豆射手</color>同时发射扇形范围的<color=#036b16>{0}颗</color>豌豆
    Skill10 = 414,      //<color=#036b16>豌豆射手</color>造成的流血伤害增加<color=#036b16>{0}%</color>
}

export class TouDanShouCtrl extends HeroControl {

    //攻击范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(0.3,20);
    private angleNum:number = 0;


    private bulletHp = 1;               //子弹穿透力
    private forBulletCount = 1;         //前方子弹数量
    private bulletCount = 1;            //一排子弹的数量

    Init(){
        this.RegisterSkillHandle(SkillIdType.Skill1,this.SetBulletCount.bind(this));
        this.RegisterSkillHandle(SkillIdType.Skill5,this.SetForBullet.bind(this));
        this.RegisterSkillHandle(SkillIdType.Skill9,this.SetBulletCount.bind(this));
        this.RegisterSkillHandle(SkillIdType.Skill2,this.SetBulletHp.bind(this));
        this.RegisterSkillHandle(SkillIdType.Skill8,this.SetBulletHp.bind(this));

        this.RegisterSkill(SkillPlayType.After, SkillIdType.Skill3,this.GongJiXuanYun.bind(this));
    }

    //设置前方子弹数量
    SetForBullet(skill:CfgSkillData){
        let new_count = skill.pram1;
        if(new_count > this.forBulletCount){
            this.forBulletCount = new_count;
        }
    }

    SetBulletCount(skill:CfgSkillData){
        let new_count = skill.pram1;
        if(new_count > this.bulletCount){
            this.bulletCount = new_count;
        }
    }

    //设置子弹血量
    SetBulletHp(skill:CfgSkillData){
        let new_hp = 1 + skill.pram1;
        if(new_hp > this.bulletHp){
            this.bulletHp = new_hp;
        }
    }

    // //创建子弹
    // CreateBullet(x:number = 0, y:number = 0){
    //     let pos = new Vec3(this.node.worldPosition.x + x, this.node.worldPosition.y + y, 0);
    //     this.CrateSkillFunc(this.shootEffectPath,(skillFunc:SkillShoot)=>{
    //         skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
    //         skillFunc.hp = this.bulletHp;
    //         skillFunc.node.worldPosition = pos;
    //     });
    // }

    //创建子弹
    CreateBullet(angle:number){
        this.CrateHitSkillFunc(this.shootEffectPath,this.node.worldPosition, this.OnHitEvent.bind(this),(skillFunc:SkillShoot)=>{
            skillFunc.SetEulerAngle(this.angleNum + angle);
            skillFunc.hp = this.bulletHp;
            this.PlaySkill(skillFunc);
        });
    }

    //默认攻击
    DefaultSkillAction(){
        for(let i = 0; i < this.forBulletCount; i++){
            this.scheduleOnce(this.PlayBullet.bind(this), 0.1 * i);
        }
    }

    PlayBullet(){
        if(!this.isBattle){
            return;
        }
        let n = (this.bulletCount - 1) / 2
        let i = -n
        for(i; i <= n; i++){
            this.CreateBullet(i * 10);
        }
    }

    //攻击眩晕的敌人，使其流血5s，每秒造成攻击力20%的伤害
    GongJiXuanYun(skill:CfgSkillData, event:SkillColliderEvent){
        let monster = event.GetFirstHitObj();
        if(!monster.HasBuff(MonsterObjBuffType.XuanYun)){
            return;
        }
        let liuxueCount = monster.GetBuffCountByHero(MonsterObjBuffType.LiuXue, this.hero);
        if(liuxueCount == 0){

            let skill10 = this.GetHasSkill(SkillIdType.Skill10);
            let damScale:number;
            if(skill10){
                damScale = skill10.pram1 / 100;
            }else{
                damScale = skill.pram2 / 100;
            }

            monster.AddBuff(<IMonsterObjBuffData>{
                buffType:MonsterObjBuffType.LiuXue,
                time:skill.pram1,
                hero:this.hero,
                p1:this.CalculateAttackValue(0,damScale),
            })
        }
    }

    //击杀敌人后，攻击速度+100%，持续1s
    JiShaJiaGongSu(monster:MonsterObj){
        if(monster.hp > 0){
            return;
        }
        let skill = BattleData.Inst().GetSkillCfg(47);
        if(!BattleData.Inst().IsHasSkillByData(skill,this.hero.tag)){
            return;
        }
        let skillBuff = this.skillBuff;
        skillBuff.attackSpeed += skill.pram1 / 100;
        this.scheduleOnce(()=>{
            skillBuff.attackSpeed -= skill.pram1 / 100;
        }, skill.pram2);
    }

    //击中怪物实践
    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        event.skillFunc.hp--;
        if(event.skillFunc.hp <= 0){
            this.StopSkill(event.skillFunc);
        }
        let attackValue = this.attackValue;
        monster.DeductHp(this.hero, attackValue);

        AudioManager.Inst().Play(AudioTag.TouDanShouJiZhong);
        this.JiShaJiaGongSu(monster);
    }

    protected OnMonsterEnter(monster:MonsterObj){
        //this.shootDir = monster.worldPosition.y >= this.node.worldPosition.y ? Vec3.UP : new Vec3(0,-1,0);
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }

}


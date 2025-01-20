import { _decorator, Node, Vec3 } from 'cc';
import { CfgSkillData } from 'config/CfgEntry';
import { NodePools } from 'core/NodePools';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { ResPath } from 'utils/ResPath';
import { MathHelper } from '../../../helpers/MathHelper';
import { AttackConditionType, BattleSkillType, IMonsterObjBuffData, MonsterObjBuffType, SkillPlayType } from '../BattleConfig';
import { BattleCtrl } from '../BattleCtrl';
import { BattleData } from '../BattleData';
import { MonterBuff } from '../Function/MonsterBuff';
import { SkillColliderEvent } from '../Function/SkillFunc';
import { SkillRange } from '../Function/SkillRange';
import { SkillShoot } from '../Function/SkillShoot';
import { MonsterObj } from '../Object/MonsterObj';
import { HeroAttackRange, HeroControl, SkillFuncResUnlock } from './HeroControl';

enum ErMoCtrlSkillIdType{
    zuoshao = 64,       //小喷菇命中敌人时，使其灼烧<color=#DF7401>{0}</color>s，每秒造成{1}%伤害
    zuoshaoleiji = 65,  //小喷菇灼烧累计造成的伤害 +x%
    bingdongjiashang = 66,      //小喷菇对冰冻敌人的伤害+<color=#DF7401>{0}</color>%
    jiazuoshaoshijian = 67,     //小喷菇造成灼烧时间+<color=#DF7401>{0}</color>秒
    dianranzhouwei = 68,        //小喷菇命中敌人时，<color=#DF7401>{0}</color>%几率点燃其{1}格区域
    Skill8 = 338,       //<color=#036b16>大喷菇</color>每次攻击造成的灼烧效果层数<color=#036b16>+{0}</color>
    Skill9 = 339,       //<color=#036b16>大喷菇</color>累计造成的灼烧伤害<color=#036b16>+{0}</color>
    Skill10 = 416,      //<color=#036b16>大喷菇</color>最多同时攻击<color=#036b16>{0}个</color>敌人
}  

enum ErMoRes {
    DianRan = "DianRang",
}

export class ErMoCtrl extends HeroControl {
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);
    
    private shootDir:Vec3 = new Vec3(0,1,0);    //发射方向

    private zuoshaoLevel:number = 1;    //灼烧效果层数

    protected skillFuncRes = {
        [ErMoRes.DianRan] : SkillFuncResUnlock.Create(ErMoCtrlSkillIdType.dianranzhouwei),
    }

    Init(){
        this.RegisterSkillHandle(ErMoCtrlSkillIdType.Skill8,(skill:CfgSkillData)=>{
            this.zuoshaoLevel = skill.pram1
        });

        this.RegisterSkill(SkillPlayType.After, ErMoCtrlSkillIdType.zuoshao,this.ZuoShaoBuff.bind(this));
    }
    

    //默认攻击
    DefaultSkillAction(i:number = 0){
        let playCount = 1;
        let skill10 = this.GetHasSkill(ErMoCtrlSkillIdType.Skill10);
        if(skill10){
            playCount = skill10.pram1;
        }

        let monsters = this.GetRoundMonsters(1, this.node.worldPosition);
        monsters.forEach(monster=>{
            if(i < playCount){
                this.PlayNormalSkill(monster.worldPosition);
                i++;
            }
        });

        if(i < playCount){
            this.scheduleOnce(()=>{
                this.DefaultSkillAction(i);
            }, 0.2)
        }
    }

    PlayNormalSkill(pos:Vec3){
        let angle = MathHelper.GetVecAngle(this.node.worldPosition, pos);
        angle = 360 - angle;
        this.CrateHitSkillFunc(this.shootEffectPath, this.node.worldPosition, this.OnHitEvent.bind(this), (skill:SkillShoot)=>{
            skill.SetEulerAngle(angle);
            this.PlaySkill(skill);
        });
    }

   

    //小喷菇命中敌人时，使其灼烧<color=#DF7401>{0}</color>s，每秒造成{1}%伤害
    ZuoShaoBuff(skill:CfgSkillData, event:SkillColliderEvent){
        let monster = event.GetFirstHitObj();
        let attackValue = this.CalculateAttackValue(0, skill.pram2 / 100);
        for(let i = 0; i < this.zuoshaoLevel; i++){
            monster.AddBuff(<IMonsterObjBuffData>{
                buffType:MonsterObjBuffType.ZhuoShao,
                time:this.GetZuoShaoTime(true),
                hero:this.hero,
                p1:attackValue,
                p2:1,
            })
        }
    }

    //点燃周围一格
    DianRanZhouWei(event:SkillColliderEvent){
        let skill = BattleData.Inst().GetSkillCfg(ErMoCtrlSkillIdType.dianranzhouwei);
        if(MathHelper.RandomResult(skill.pram1, 100)){
            let monster = event.GetFirstHitObj();
            if(monster == null){
                return;
            }
            this.CrateHitSkillFunc(ResPath.SkillAsset(ErMoRes.DianRan),monster.worldPosition, this.OnFireHieEvent.bind(this),(skillFunc:SkillRange)=>{
                skillFunc.SetScale(this.skillBuff.dianranRange);
                this.PlaySkill(skillFunc);
            }, this.scene.BottomEffectRoot);
        }

    }


    //灼烧时间
    GetZuoShaoTime(isCondition:boolean):number{
        let skill1 = BattleData.Inst().GetSkillCfg(ErMoCtrlSkillIdType.zuoshao);
        if(isCondition && !BattleData.Inst().IsHasSkillByData(skill1,this.hero.tag)){
            return 0;
        }
        let time = skill1.pram1 + this.skillBuff.zuoshaotime;
        return time;
    }

    //计算伤害
    GetTotalAttackValue(monster:MonsterObj):number{
        let value = this.attackValue;

        if(monster.HasBuff(MonsterObjBuffType.BingDong)){
            let skill1 = BattleData.Inst().GetSkillCfg(ErMoCtrlSkillIdType.bingdongjiashang);
            if(BattleData.Inst().IsHasSkillByData(skill1,this.hero.tag)){
                value = value + this.baseAttackValue * skill1.pram1 / 100
            }
        }
        return value;
    }

    //击中怪物实践
    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        this.StopSkill(event.skillFunc);

        AudioManager.Inst().Play(AudioTag.ErMoJiZhong);

        //击中之后给一个爆炸特效
        this.CrateHitSkillFunc(this.hitEffectPath,monster.worldPosition, this.OnBombHitEvent.bind(this),(skillFunc:SkillRange)=>{
            skillFunc.playNode.setScale(this.skillBuff.jianseRange, this.skillBuff.jianseRange);
            this.PlaySkill(skillFunc);
        });
    }

    //爆炸伤害事件
    OnBombHitEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let att_value = this.GetTotalAttackValue(monster);
                monster.DeductHp(this.hero, att_value);
                event.skillFunc.SetExcludeObj(monster);
            })
        }

        if(BattleData.Inst().IsHasSkill(ErMoCtrlSkillIdType.dianranzhouwei, this.hero.tag)){
            this.DianRanZhouWei(event);
        }
    }

    //火焰命中事件
    OnFireHieEvent(event:SkillColliderEvent){
        //console.log("火焰命中事件", event.objs.length);
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let attackValue = this.GetTotalAttackValue(monster);
                monster.AddBuff(<IMonsterObjBuffData>{
                    buffType:MonsterObjBuffType.ZhuoShao,
                    time:this.GetZuoShaoTime(false),
                    hero:this.hero,
                    p1:MonterBuff.DefaultDamge(attackValue) * this.skillBuff.dianranHarmScale,
                    p2:1,
                })
                event.skillFunc.SetExcludeObj(monster);
            })
        }
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.shootDir = new Vec3(0,1,0);
        Vec3.subtract(this.shootDir, monster.node.worldPosition, this.node.worldPosition);
        this.shootDir = this.shootDir.normalize();
    }
}


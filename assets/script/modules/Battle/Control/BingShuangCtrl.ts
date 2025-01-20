import { _decorator, Node, Vec3 } from 'cc';
import { NodePools } from 'core/NodePools';
import { ResPath } from 'utils/ResPath';
import { AttackConditionType, BattleSkillType, IMonsterObjBuffData, MonsterEventType, MonsterObjBuffType, SkillPlayType } from '../BattleConfig';
import { BattleCtrl } from '../BattleCtrl';
import { BattleData } from '../BattleData';
import { SkillColliderEvent } from '../Function/SkillFunc';
import { SkillShoot } from '../Function/SkillShoot';
import { MonsterEventActionHT, MonsterObj } from '../Object/MonsterObj';
import { HeroAttackRange, HeroControl, SkillFuncResUnlock } from './HeroControl';
import { MathHelper } from '../../../helpers/MathHelper';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { CfgSkillData } from 'config/CfgEntry';
import { SkillRange } from '../Function/SkillRange';
import { LogError } from 'core/Debugger';
import { MonterBuff } from '../Function/MonsterBuff';

enum BingShuangCtrlSkillIdType{
    bingdong = 54,      //冰霜命中时<color=#DF7401>{0}</color>%几率使其冰冻{1}s
    zhouweijiansu = 57, //冰冻敌人时，对其周围半格的敌人减速<color=#DF7401>{0}</color>秒
    bingdongjianse = 58,    //被冰霜冰冻的敌人死亡时，其周围溅射冰块

    jian_se_jian_su = 337,  //被<color=#036b16>冰瓜</color>的冰块溅射到的敌人，会造成周围的敌人减速
    skill10 = 415,          //<color=#036b16>冰瓜</color>造成的冰冻时间<color=#036b16>+{0}秒</color>
}

enum SkillRes {
    JianSe = "bingshuang_jianse",
}

export class BingShuangCtrl extends HeroControl {
    //攻击范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(0.3,20);
    private angleNum:number = 0;

    protected skillFuncRes = {
        [SkillRes.JianSe] : SkillFuncResUnlock.Create(BingShuangCtrlSkillIdType.jian_se_jian_su),
    }

    Init(){
        this.RegisterSkill(SkillPlayType.After, BingShuangCtrlSkillIdType.bingdong,this.BingDong.bind(this));
    }

    //默认攻击
    DefaultSkillAction(){
        this.CrateSkillFunc(this.shootEffectPath,(skillFunc:SkillShoot)=>{
            skillFunc.node.setRotationFromEuler(0,0,this.angleNum);
        });
        AudioManager.Inst().Play(AudioTag.BingShuangJiZhong);
    }


    //冰冻
    BingDong(skill:CfgSkillData, event:SkillColliderEvent){
        let monster = event.GetFirstHitObj();
        let tValue = skill.pram1 + this.skillBuff.bingdonggailv;
        if(MathHelper.RandomResult(tValue, 100)){
            monster.AddBuff(<IMonsterObjBuffData>{
                buffType:MonsterObjBuffType.BingDong,
                time:this.GetBingDongTime(),
                hero:this.hero,
            })

            if(BattleData.Inst().IsHasSkill(BingShuangCtrlSkillIdType.zhouweijiansu, this.hero.tag)){
                this.ZhouWeiJianSu(monster);
            }

            if(BattleData.Inst().IsHasSkill(BingShuangCtrlSkillIdType.bingdongjianse, this.hero.tag)){
                //可不用销毁
                monster.OnEvent(MonsterEventType.Die, this.BingDongJianSe.bind(this));
            }
        }
    }

    //冰冻溅射
    BingDongJianSe(monster:MonsterObj){
        LogError("冰冻溅射");
        this.CrateHitSkillFunc(ResPath.SkillAsset(SkillRes.JianSe),monster.worldPosition, this.OnBombHitEvent.bind(this),(skillFunc:SkillRange)=>{
            //skillFunc.playNode.setScale(this.skillBuff.jianseRange, this.skillBuff.jianseRange);
            this.PlaySkill(skillFunc);
        });
    }

    //冰冻溅射伤害事件
    OnBombHitEvent(event:SkillColliderEvent){
        //console.log("冰冻溅射伤害事件", event);
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let att_value = this.GetTotalAttackValue(monster);
                att_value *=  this.skillBuff.jianseHarmScale;
                monster.DeductHp(this.hero, att_value);
                event.skillFunc.SetExcludeObj(monster);

                let jianshejianse = this.GetHasSkill(BingShuangCtrlSkillIdType.jian_se_jian_su);
                if(jianshejianse){
                    this.MonsterAddJianSuBuff(monster);
                }
            })
        }
    }

    //冰冻敌人时，对其周围半格的敌人减速<color=#DF7401>{0}</color>秒
    ZhouWeiJianSu(monster:MonsterObj){
        let skill = BattleData.Inst().GetSkillCfg(BingShuangCtrlSkillIdType.zhouweijiansu);
        let monsters = this.GetRoundMonsters(0.5, monster.centerWorldPos);
        monsters.forEach(monster=>{
            this.MonsterAddJianSuBuff(monster, skill.pram1);
        })
    }

    MonsterAddJianSuBuff(monster:MonsterObj, time:number = MonterBuff.DefaultTime){
        monster.AddBuff(<IMonsterObjBuffData>{
            buffType:MonsterObjBuffType.JianSu,
            time:time,
            hero:this.hero,
            p1: this.GetJianSuValue(),
        })
    }



    //冰冻时间
    GetBingDongTime():number{
        let time = this.hero.attriCfg.cold_time;
        let skill10 = this.GetHasSkill(BingShuangCtrlSkillIdType.skill10);
        if(skill10){
            let count = this.GetSkillCount(skill10);
            time += count * skill10.pram1;
        }
        return time;
    }

    //减速时间
    GetJianSuTime():number{
        return this.hero.attriCfg.moderate_time + this.skillBuff.jiansutime;
    }

    //减速效果
    GetJianSuValue():number{
        return (this.hero.attriCfg.moderate_effect +this.skillBuff.slowDown) / 100;
    }
   

    static defaultJinaSuBuff:IMonsterObjBuffData;
    //击中怪物实践
    OnHitEvent(event:SkillColliderEvent){
        super.OnHitEvent(event);
        // 得比dynamic.StopAllSkill()先执行，否则清理两遍出现异常
        let monster = event.GetFirstHitObj();
        this.StopSkill(event.skillFunc);
        let attackValue = this.CalculateAttackValue();
        monster.DeductHp(this.hero,attackValue);

        if(BingShuangCtrl.defaultJinaSuBuff == null){
            BingShuangCtrl.defaultJinaSuBuff = {
                buffType:MonsterObjBuffType.JianSu,
                time:null,
                hero:null,
                p1:null,
            };
        }
        BingShuangCtrl.defaultJinaSuBuff.time = this.GetJianSuTime();
        BingShuangCtrl.defaultJinaSuBuff.p1 = this.GetJianSuValue();
        BingShuangCtrl.defaultJinaSuBuff.hero = this.hero;

        monster.AddBuff(BingShuangCtrl.defaultJinaSuBuff);
        AudioManager.Inst().PlaySceneAudio(AudioTag.bingshuangshouji);
    }

    protected OnMonsterEnter(monster:MonsterObj){
        this.angleNum = monster.worldPosition.y >= this.node.worldPosition.y ? 0 : 180;
    }
}


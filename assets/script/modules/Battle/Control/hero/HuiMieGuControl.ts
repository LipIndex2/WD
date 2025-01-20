import { _decorator, Component, Node, Vec3 } from 'cc';
import { CfgSkillData } from 'config/CfgEntry';
import { LogError } from 'core/Debugger';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { BattleEventType, BattleObjTag, BattleState, CELL_WIDTH, FIGHT_SCALE, MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleData } from 'modules/Battle/BattleData';
import { MonterBuff } from 'modules/Battle/Function/MonsterBuff';
import { SkillColliderEvent, SkillFunc } from 'modules/Battle/Function/SkillFunc';
import { SkillHover } from 'modules/Battle/Function/SkillHover';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { HeroData } from 'modules/hero/HeroData';
import { UtilHelper } from '../../../../helpers/UtilHelper';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { EventCtrl } from 'modules/common/EventCtrl';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
enum HuiMieGuRes {
    Normal = "huimiegu_1",
    BianFuBaoZa = "BianFuBaoZa",
    YiYunBianFu = "YiQunBianFu",
}
export class HuiMieGuControl extends HeroControl {
    protected attackRange: HeroAttackRange = new HeroAttackRange(3,3);

    protected skillFuncRes = {
        [HuiMieGuRes.BianFuBaoZa] : SkillFuncResUnlock.Create(HeroSkillId.HuiMieGu.Skill8),
        [HuiMieGuRes.YiYunBianFu] : SkillFuncResUnlock.Create(HeroSkillId.HuiMieGu.Skill9),
    }

    //守护蝙蝠
    private batDefList: SkillFunc[] = [];
    //守护蝙蝠冷却时间
    private batTime: number;

    private YiYunBianFuTime:number = 0;     //每隔多少秒释放一群蝙蝠
    private _YiYunBianFuTime:number = 0;

    //蝙蝠飞行的圈数
    private _flyRoundNum:number = 1;
    private get flyRoundNum():number{
        let lianxuSkill = this.GetHasSkill(HeroSkillId.HuiMieGu.LianXuFeiXing);
        let skill11 = this.GetHasSkill(HeroSkillId.HuiMieGu.Skill11);
        if(skill11 && skill11.pram1 > this._flyRoundNum){
            this._flyRoundNum = skill11.pram1;
        }
        if(lianxuSkill && lianxuSkill.pram1 > this._flyRoundNum){
            this._flyRoundNum = lianxuSkill.pram1;
        }
        return this._flyRoundNum;
    }

    //普通攻击蝙蝠数量
    private _playNum:number = 1;
    private get playNum():number{
        let tianjiabianfu = this.GetHasSkill(HeroSkillId.HuiMieGu.TianJiaBianFu);
        let Skill12 = this.GetHasSkill(HeroSkillId.HuiMieGu.Skill12);
        if(Skill12 && Skill12.pram1 > this._playNum){
            this._playNum = Skill12.pram1;
        }
        if(tianjiabianfu && tianjiabianfu.pram1 > this._playNum){
            this._playNum = tianjiabianfu.pram1;
        }
        return this._playNum;
    }

    Init(){
        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.HuiMieGu.DatDef,this.PlayDefBat.bind(this));


        this.AddSmartDataCare(this.battleInfo, this.FlushSkill.bind(this), "skillListMap");
        EventCtrl.Inst().on(BattleEventType.BeAttack, this.CreateFiveBat, this);
        this.batTime = 0;

        this.OnSkillChange();
    }

    OnFightStart(): void {
        this._YiYunBianFuTime = 0;
    }

    OnSkillChange(): void {
        if(this.YiYunBianFuTime == 0){
            let skill9 = this.GetHasSkill(HeroSkillId.HuiMieGu.Skill9);
            if(skill9){
                this.YiYunBianFuTime = skill9.pram1;
                this._YiYunBianFuTime = this.YiYunBianFuTime;
            }
        }
    }

    protected Run(dt:number){
        if(this.batTime >= 0){
            this.batTime -= dt;
            if(this.batTime < 0){
                this.PlayDefBat();
            }
        }

        if(this.YiYunBianFuTime != 0){
            this._YiYunBianFuTime += dt;
            if(this._YiYunBianFuTime >= this.YiYunBianFuTime){
                this.PlayYiQunBianFu();
                this._YiYunBianFuTime = 0;
            }
        }
        
    }

    //技能变化
    FlushSkill(){
        this.PlayDefBat();
    }

    //默认技能效果
    DefaultSkillAction(){
        this.CrateSkillFunc(this.shootEffectPath, (skill:SkillHover)=>{
            skill.roundCount = this.flyRoundNum;
        });
        let count = this.playNum;
        for(let i = 0; i < count; i++){
            let height = 80 + 40 * i;
            this.CreateBat(height, this.flyRoundNum);
        }
    }

    //创建单个蝙蝠
    CreateBat(height:number, roundNum:number){
        this.CrateSkillFunc(this.shootEffectPath, (skill:SkillHover)=>{
            skill.height = height;
            skill.roundCount = roundNum;
        });
    }

    //释放守护蝙蝠
    PlayDefBat(){
        //console.log("释放守护蝙蝠");
        if(!this.IsCanBattle()){
            return
        }
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.HuiMieGu.DatDef,this.hero.tag)){
            return;
        }
        if(this.batTime <= 0 && this.batDefList.length == 0){
            let count = 4 + this.skillBuff.BatCount;
            this.AddDefSkillObj(count);
        }
    }

    //添加n只守护蝙蝠
    AddDefSkillObj(n:number){
        let angle = 360 / n;
        for(let i = 0; i < n; i++){
            this.CrateHitSkillFunc(this.shootEffectPath, this.node.worldPosition,this.OnDefHitEvent.bind(this),(skill:SkillHover)=>{
                skill.height = CELL_WIDTH * FIGHT_SCALE;
                skill.startAngle = angle * (i + 1);
                skill.roundCount = 6;
                skill.playTime = 4;
                skill.OnStop(this.OnDefStopEvent.bind(this));
                this.batDefList.push(skill);
                this.PlaySkill(skill);
            });
        }
    }

    //击杀时对周围1格人 伤害 + 流血
    ZhouWeiJianSu(tMonster:MonsterObj){
        let skill = this.GetHasSkill(HeroSkillId.HuiMieGu.JiZhongLiuXue);
        let skill14 = this.GetHasSkill(HeroSkillId.HuiMieGu.Skill14);
        if(!skill && !skill14){
            return;
        }

        let harmScale = 100;
        if(skill && skill.pram1 > harmScale){
            harmScale = skill.pram1;
        }
        if(skill14 && skill14.pram1 > harmScale){
            harmScale = skill14.pram1;
        }

        let monsters = this.GetRoundMonsters(1, tMonster.centerWorldPos);
        monsters.forEach(monster=>{
           if(monster != tMonster && monster.hp > 0){
                let att_value = this.CalculateAttackValue(0,harmScale);
                monster.DeductHp(this.hero, att_value);
                monster.AddBuff({buffType:MonsterObjBuffType.LiuXue,
                    time:this.hero.attriCfg.blood_time,
                    hero:this.hero,
                    p1:MonterBuff.DefaultDamge(att_value)})
           }
        })
    }

    //城堡受击时招唤5只蝙蝠攻击敌人
    CreateFiveBat(tag:BattleObjTag){
        if(!BattleData.Inst().IsHasSkill(HeroSkillId.HuiMieGu.FiveBat,this.hero.tag)){
            return;
        }
        if(this.hero.tag != tag){
            return;
        }
        let angle = 360 / 5;
        for(let i = 0; i < 5; i++){
            this.CrateHitSkillFunc(this.shootEffectPath, this.node.worldPosition,this.OnDefHitEvent.bind(this), (skill:SkillHover)=>{
                skill.height = CELL_WIDTH * FIGHT_SCALE + 40;
                skill.startAngle = angle * (i + 1);
                skill.roundCount = 1;
                skill.playTime = 4;
                this.PlaySkill(skill);
            });
        }
    }

    //计算伤害
    GetTotalAttackValue(monster:MonsterObj):number{
        let value = this.CalculateAttackValue();
        return value;
    }

    //守护蝙蝠的伤害
    GetDefAttackValue(monster:MonsterObj){
        // let cfg = HeroData.Inst().GetHeroBattleCfg(this.heroData.hero_id, 2);
        // let attackValue = cfg.coefficients * this.hero.attriCfg.att;
        let attackValue = this.CalculateAttackValue(0,2)
        return attackValue;
    }

    //击中怪物实践
    OnHitEvent(event:SkillColliderEvent){
        if(event.objs.length > 0){
            event.objs.forEach(monster=>{
                let att_value = this.GetTotalAttackValue(monster)
                monster.DeductHp(this.hero, att_value);
                if(monster.hp < 0){
                    this.ZhouWeiJianSu(monster);
                }
                event.skillFunc.SetExcludeObj(monster);
                let liuxueCount = monster.GetBuffCountByHero(MonsterObjBuffType.LiuXue, this.hero);
                if(liuxueCount < this.skillBuff.LiuXueCount){
                    monster.AddBuff({buffType:MonsterObjBuffType.LiuXue,
                    time:this.hero.attriCfg.blood_time,
                    hero:this.hero,
                    p1:MonterBuff.DefaultDamge(att_value)})
                }
            })
            AudioManager.Inst().Play(AudioTag.HuiMieGu);
        }
    }

    //守护蝙蝠击中事件
    OnDefHitEvent(event:SkillColliderEvent){
        this.StopSkill(event.skillFunc);
        let monster = event.GetFirstHitObj();
        let att_value = this.GetDefAttackValue(monster);
        monster.DeductHp(this.hero, att_value);
        AudioManager.Inst().Play(AudioTag.HuiMieGu);

        let skill8 = this.GetHasSkill(HeroSkillId.HuiMieGu.Skill8);
        if(skill8){
            this.CrateHitSkillFuncByName(HuiMieGuRes.BianFuBaoZa, monster.centerWorldPos, this.OnDefBombEvent.bind(this), (skill)=>{
                this.PlaySkill(skill);
            })
        }
    }

    //守护蝙蝠销毁事件
    OnDefStopEvent(skill:SkillFunc){
        if(this.batDefList == null){
            return;
        }
        UtilHelper.ArrayRemove(this.batDefList, skill);
        if(this.batDefList.length == 0){
            this.batTime = 5;
        }
    }

    onDestroy(){
        super.onDestroy();
        EventCtrl.Inst().off(BattleEventType.BeAttack, this.CreateFiveBat, this);
    }

    //守护蝙蝠爆炸事件
    OnDefBombEvent(event:SkillColliderEvent){
        let skill8 = this.GetHasSkill(HeroSkillId.HuiMieGu.Skill8);
        event.objs.forEach(monster=>{
            let skill8AttValue = this.CalculateAttackValue(0, skill8.pram1 / 100);
            monster.DeductHp(this.hero, skill8AttValue);
            event.skillFunc.SetExcludeObj(monster);
        })
    }


    //释放一群蝙蝠
    PlayYiQunBianFu(){
        if(this.skillBuff.otherValue == 1){
            return;
        }
        this.CrateHitSkillFuncByName(HuiMieGuRes.YiYunBianFu, this.scene.node.worldPosition, this.OnYiQunBianFu.bind(this),(skill:SkillShoot)=>{
            skill.startPos = new Vec3(0,-1000,0);
            this.PlaySkill(skill);
            skill.OnStop((_skill)=>{
                this.skillBuff.otherValue = 0;
            })
        })
        this.skillBuff.otherValue = 1;
    }

    OnYiQunBianFu(event:SkillColliderEvent){
        let skill9 = this.GetHasSkill(HeroSkillId.HuiMieGu.Skill9);
        event.objs.forEach(monster=>{
            let skill9AttValue = this.CalculateAttackValue(0, skill9.pram2 / 100);
            monster.DeductHp(this.hero, skill9AttValue);
            event.skillFunc.SetExcludeObj(monster);
        })
    }
}


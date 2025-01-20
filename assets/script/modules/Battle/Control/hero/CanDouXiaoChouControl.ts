import { Vec3 } from 'cc';
import { CfgSkillData } from 'config/CfgEntry';
import { MonsterObjBuffType, SkillPlayType } from 'modules/Battle/BattleConfig';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { BattleData } from 'modules/Battle/BattleData';
import { SkillColliderEvent, SkillFunc } from 'modules/Battle/Function/SkillFunc';
import { SkillShoot } from 'modules/Battle/Function/SkillShoot';
import { MonsterObj } from 'modules/Battle/Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { MathHelper } from '../../../../helpers/MathHelper';
import { HeroAttackRange, HeroControl, SkillFuncResInit, SkillFuncResUnlock } from '../HeroControl';
import { BattleDynamicHelper } from 'modules/Battle/BattleDynamicHelper';
import { HeroSkillId } from 'modules/Battle/HeroSkillId';
import { JiTuiBuff, KongJuBuff, MonterBuff, YiShangBuff } from 'modules/Battle/Function/MonsterBuff';
import { BattleScene } from 'modules/Battle/BattleScene';

enum CDXiaoChouRes {
    Normal1  = "cdxiaochou_normal1",
    Normal2  = "cdxiaochou_normal2",
    Normal3  = "cdxiaochou_normal3",
    BombPoke = "cdxiaochou_bombpoke",
    BombFeiDao = "cdxiaochou_bombfeidao",
    KongJuBomb = "cdxiaochou_kongjubomb",
}

export class CanDouXiaoChouControl extends HeroControl {
    private static KongJuBombIntervel = 3;//恐惧盒子间隔时间
    private static YiShangBaseNum = 1;  //默认最高只能叠1层易伤
    protected attackRange: HeroAttackRange = new HeroAttackRange(3, 3);
    private atkCount = 0;
    private kongjuBombTimer = 0;
    private feidaoBombTimer : NodeJS.Timeout = null;
    protected skillFuncRes = {
        [CDXiaoChouRes.Normal1] : SkillFuncResInit.Create(
            [{stage:3,resName:CDXiaoChouRes.Normal2},{stage:5,resName:CDXiaoChouRes.Normal3}]),
        [CDXiaoChouRes.BombFeiDao] : SkillFuncResUnlock.Create(HeroSkillId.CDXiaoChou.BombFeiDao),
        [CDXiaoChouRes.BombPoke] : SkillFuncResUnlock.Create(HeroSkillId.CDXiaoChou.BombPoke),
        [CDXiaoChouRes.KongJuBomb] : SkillFuncResUnlock.Create(HeroSkillId.CDXiaoChou.KongJuBomb),
    }
 

    Init() {
        this.RegisterSkill(SkillPlayType.Before, HeroSkillId.CDXiaoChou.BombFeiDao, this.SkillBombFeiDaoBefore.bind(this));
        // this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill2, this.SkillAction2.bind(this));
        // this.RegisterSkill(SkillPlayType.Before, SkillIdType.skill4, this.SkillAction4.bind(this));
        // this.RegisterSkill(SkillPlayType.Before, 93, this.BackSkillAction.bind(this));

    }

    Run(dt: number){
        super.Run(dt);
        this.kongjuBombTimer += dt;
    }

    OnFightStart(){
        this.atkCount = 0;
        this.kongjuBombTimer = 0;
    }

    //默认攻击
    DefaultSkillAction() {
        this.CrateSkillFuncByName(CDXiaoChouRes.Normal1, (skillFunc:SkillFunc)=>{
            let angle = 0;
            let dirMonster = BattleDynamicHelper.FindClosestMonster(this.hero.worldPosition,null, this.hero.tag);
            if(dirMonster != null){
                let dirMonCenP = dirMonster.centerWorldPos;
                angle = MathHelper.VecZEuler(dirMonCenP.x - this.hero.worldPosition.x,
                    dirMonCenP.y - this.hero.worldPosition.y);
            }
            skillFunc.SetEulerAngle(angle);;
        }) 
        ++this.atkCount;
        AudioManager.Inst().Play(AudioTag.candou);
    }

    //蚕豆小丑每攻击X次，向周围抛出环形飞刀
    SkillBombFeiDaoBefore(skill:CfgSkillData, event:SkillColliderEvent){
        if(this.atkCount <= skill.pram1){
            return;
        }
        this.atkCount = 0;
        this.sendBomb(CDXiaoChouRes.BombFeiDao,this.hero.worldPosition,this.onBombFeiDaoHit.bind(this));
        BattleData.Inst().HandleSkill(HeroSkillId.CDXiaoChou.FeiDaoCount,(cfg)=>{
            this.feidaoBombTimer = setTimeout(()=>{
                this.sendBomb(CDXiaoChouRes.BombFeiDao,this.hero.worldPosition,this.onBombFeiDaoHit.bind(this));
            },200);
        }, this.hero.tag);
    }

    onDestroy(){
        super.onDestroy();
        if (this.feidaoBombTimer) {
            clearTimeout(this.feidaoBombTimer);
            this.feidaoBombTimer = null;
        }
    }

    //击中怪物事件
    OnHitEvent(event: SkillColliderEvent) {
        super.OnHitEvent(event);
        let monster = event.GetFirstHitObj();
        event.skillFunc.SetExcludeObj(monster);
        // event.skillFunc.hp--;
        // if (event.skillFunc.hp <= 0) {
            this.StopSkill(event.skillFunc);
        // }
        this.doDamge(monster);
    }
    
    private onBombHit(event: SkillColliderEvent){
        event.objs.forEach(hitMo=>{
            event.skillFunc.SetExcludeObj(hitMo);
            this.doDamge(hitMo);
        });
    }

    private onBombFeiDaoHit(event: SkillColliderEvent){
        let damScale = 1;
        let fdDamCfg = this.GetHasSkill(HeroSkillId.CDXiaoChou.FeiDaoDam);
        if(fdDamCfg){
            damScale += MathHelper.NumToPer(fdDamCfg.pram1);
        }
        event.objs.forEach(hitMo=>{
            event.skillFunc.SetExcludeObj(hitMo);
            this.doDamge(hitMo,damScale);
        });        
    }

    private doDamge(monster:MonsterObj,damScale = 1){
        let atkVal = this.CalculateAttackValue(0,damScale);
        let bombPokeFlag = monster.HasBuff(MonsterObjBuffType.YiShang) && 
            BattleData.Inst().IsHasSkill(HeroSkillId.CDXiaoChou.BombPoke, this.hero.tag);
        monster.DeductHp(this.hero, atkVal);
        let maxYishangNum = CanDouXiaoChouControl.YiShangBaseNum;
        if(BattleData.Inst().IsHasSkill(HeroSkillId.CDXiaoChou.YiShangNum, this.hero.tag)){
            let ysNumCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.CDXiaoChou.YiShangNum);
            maxYishangNum += (this.GetSkillCount(ysNumCfg) * ysNumCfg.pram1);
        }
        //造成伤害添加易伤buff
        if(monster.GetBuffCountByHero(MonsterObjBuffType.YiShang,this.hero) < maxYishangNum){
            let ysDam = MonterBuff.DefaultPer;
            if(BattleData.Inst().IsHasSkill(HeroSkillId.CDXiaoChou.YiShangDam, this.hero.tag)){
                let ysDamCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.CDXiaoChou.YiShangDam);
                ysDam += (ysDamCfg.pram1 * this.GetSkillCount(ysDamCfg));
            }
            let defOff = 0;
            BattleData.Inst().HandleSkill(HeroSkillId.CDXiaoChou.YiShangDefOff,(cfg)=>{defOff = cfg.pram1;}, this.hero.tag);
            monster.AddBuff(YiShangBuff.CrateData(this.hero,5,ysDam,defOff));
        }

        //蚕豆小丑击杀易伤状态下的敌人时，在被击杀敌人周围散出扑克牌
        if(bombPokeFlag && monster.IsDied()){
            this.sendBomb(CDXiaoChouRes.BombPoke,monster.centerWorldPos);
        }
        //蚕豆小丑攻击禁锢的敌人，X%几率将其击退{1}格
        if(BattleData.Inst().IsHasSkill(HeroSkillId.CDXiaoChou.JiTui, this.hero.tag) && 
            monster.HasBuff(MonsterObjBuffType.JinGu)){
            let jituiCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.CDXiaoChou.JiTui);
            let jituiCount = this.GetSkillCount(jituiCfg);
            let rate =  jituiCount * jituiCfg.pram1;
            if(MathHelper.RandomResult(rate,100)){
                monster.AddBuff(JiTuiBuff.CreateData(this.hero,jituiCfg.pram2));
            }
        }
        //每隔一段时间，蚕豆小丑开启惊吓盒子，恐惧周围敌人X秒
        if(BattleData.Inst().IsHasSkill(HeroSkillId.CDXiaoChou.KongJuBomb, this.hero.tag) && 
            this.kongjuBombTimer >= CanDouXiaoChouControl.KongJuBombIntervel){
            this.kongjuBombTimer = 0;
            this.sendBomb(CDXiaoChouRes.KongJuBomb,monster.centerWorldPos,this.kongjuBombHit.bind(this));
        }
    }

    private sendBomb(resName:string,pos:Vec3,hitFunc: (event: SkillColliderEvent) => void = null){
        if(hitFunc == null){
            hitFunc = this.onBombHit.bind(this);
        }
        this.CrateHitSkillFuncByName(resName,pos,hitFunc,
            (skillFunc:SkillFunc)=>{
                this.PlaySkill(skillFunc);
            }
        );
    }

    private kongjuBombHit(event: SkillColliderEvent){
        let kongjuCfg = BattleData.Inst().GetSkillCfg(HeroSkillId.CDXiaoChou.KongJuBomb);
        event.objs.forEach(hitMo=>{
            event.skillFunc.SetExcludeObj(hitMo);
            hitMo.AddBuff(KongJuBuff.CrateData(this.hero,kongjuCfg.pram1));
        });
    }

}


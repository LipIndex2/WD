import { EventCtrl } from "modules/common/EventCtrl";
import { BattleEventType } from "../BattleConfig";
import { SkillBulletTrack } from "../Function/SkillBulletTrack";
import { SkillColliderEvent, SkillFunc } from "../Function/SkillFunc";
import { MonsterObj } from "../Object/MonsterObj";

export class SkillFuncLocker{
    private lockInfo : Map<SkillFunc,MonsterObj> = null;

    //searcgFunc 传入检索目标的逻辑，返回检索结果的怪
    //initSearch 是否是初始检索，有些子弹初始和切换目标时检索逻辑不一样
    constructor(searchFunc : (bullet:SkillFunc,initSearch :boolean) => MonsterObj){
        this.searchMonsterFunc = searchFunc;
        EventCtrl.Inst().on(BattleEventType.MonsterDie, this.OnMonsterDie, this);

    }
    
    private searchMonsterFunc : (bullet:SkillFunc,initSearch :boolean) => MonsterObj;

    //开启子弹锁定模式
    public BeginLock(bullet:SkillFunc){
        let mo = this.searchMonsterFunc(bullet,true);
        this.lockMonster(bullet,mo);
    }

    //关闭子弹锁定模式
    public EndLock(bullet:SkillFunc){
        this.removeBullet(bullet);
    }

    public Destroy(){
        EventCtrl.Inst().off(BattleEventType.MonsterDie, this.OnMonsterDie, this);
    }

    
    //击中事件，返回是否击中了锁定目标，非锁定目标会被忽略，应用真实子弹效果之前应该用这个函数进行判断
    public OnHitEvent(event:SkillColliderEvent) : MonsterObj{
        if(this.lockInfo == null){
            return null;
        }
        // if(!this.daodanTrackInfo.has(bullet)){
        //     return null;
        // }
        let lockMon = this.lockInfo.get(event.skillFunc);
        if(lockMon == null){
            return null;
        }
        if(event.objs.includes(lockMon)){
            return lockMon;
        }
        else{
            return null;
        }
    }

    private OnMonsterDie(monster:MonsterObj){
        //怪物死亡需要切换锁定目标
        if(this.lockInfo == null){return;}
        this.lockInfo.forEach((mon,bullet)=>{
            if(mon == monster){
                let mo = this.searchMonsterFunc(bullet,false);
                if(mo == mon){  //找到的怪是一样的怪，此时出现异常
                    console.error(`SkillFuncLocker Relock Exception!Find Died Monster when OnMonsterDie.objid=${monster.objId},hp=${monster.hp}`);
                    mo == null;
                }
                this.lockMonster(bullet,mo);
                // this.changeLock(bullet);
            }
        })
    }

    private changeLock(bullet:SkillFunc){
        let mo = this.searchMonsterFunc(bullet,false);
        this.lockMonster(bullet,mo);
    }
    
    //先写死，这个设置锁定逻辑可能会需要外部控制
    private lockMonster(bullet:SkillFunc,monster:MonsterObj){
        this.removeBullet(bullet);

        if(monster != null){
            if(this.lockInfo == null){
                this.lockInfo = new Map();
            }
            this.lockInfo.set(bullet,monster);
        }
        
        if(bullet instanceof SkillBulletTrack){
            if(monster){
                bullet.SetTrackNode(monster.node);
            }else{
                bullet.SetTrackNode(null);
            }
        }
    }
    
    private removeBullet(bullet : SkillFunc){
        if(this.lockInfo == null){
            return;
        }
        // if(this.lockInfo.has(bullet)){
        this.lockInfo.delete(bullet);
        // }
    }

 

}
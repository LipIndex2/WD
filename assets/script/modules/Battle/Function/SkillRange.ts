import { _decorator, Component, Node, Animation, ForwardPipeline } from 'cc';
import { BattleCtrl } from '../BattleCtrl';
import { MonsterObj } from '../Object/MonsterObj';
import { SkillFunc } from './SkillFunc';
import { BattleData } from '../BattleData';
const { ccclass, property } = _decorator;

//用于范围伤害
@ccclass('SkillRange')
export class SkillRange extends SkillFunc {

    //private timeHt:any;

    OnMonsterEnterRange : (monsters:MonsterObj[])=>void = null;
    OnMonsterExitRange : (monsters:MonsterObj[])=>void = null;

    private inRangeMonsters : MonsterObj[] = null;

    public get InRangeMonsters(){
        return this.inRangeMonsters;
    } 
    // private monsterListCache : MonsterObj[] = null;

    timeClear:number = 0;
    private _timeClear:number = 0;
    private playing:boolean = false;
    private _playTime = 0;
    protected update(dt: number): void {
        if(BattleData.Inst().battleInfo.isPause){
            return;
        }
        dt *= BattleData.Inst().battleInfo.globalTimeScale;
        if(this.playing){
            if(this.timeClear > 0)
            {
                this._timeClear += dt;
                if(this._timeClear >= this.timeClear){
                    this.ClearExclude();
                    this._timeClear = 0;
                }
            }
            if(this.playTime > 0){
                this._playTime += dt;
                if(this._playTime >= this.playTime){
                    this.playing = false;
                    this.StopSkill(this);
                }
            }
        }
    }

    Play(){
        super.Play();
        this.playing = true;
        // if(this.playTime > 0){
        //     if(this.timeHt){
        //         clearTimeout(this.timeHt);
        //         this.timeHt = null;
        //     }
        //     this.timeHt = setTimeout(()=>{
        //         this.StopSkill(this);
        //         this.timeHt = null;
        //     },this.playTime * 1000 / BattleData.Inst().battleInfo.globalTimeScale)
        // }
    }
    
    Stop(){
        this.playing = false;
        if(this.stopEvent){
            this.stopEvent(this);
            this.stopEvent = null;
        }
        if(this.uieffectConf){
            this.uieffectConf.stop();
        }
        this.excludeMap.clear();
        // if(this.timeHt){
        //     clearTimeout(this.timeHt);
        //     this.timeHt = null;
        // }
        this.scene.dynamic.PutSkillAsset(this.node);
    }
    Reset(){
        super.Reset();
        this.inRangeMonsters = null;
        this.OnMonsterEnterRange = null;
        this.OnMonsterExitRange = null;
        this.timeClear = 0;
        this._timeClear = 0;
        this._playTime = 0;
        // if(this.monsterListCache != null && this.monsterListCache.length > 0){
        //     this.monsterListCache = [];
        // }
    }

    ColliderHit(objs:MonsterObj[]){
        super.ColliderHit(objs);

        if( !this.OnMonsterEnterRange && !this.OnMonsterExitRange){
            return;
        }

        if(this.inRangeMonsters == null || this.inRangeMonsters.length == 0){
            if(objs != null && objs.length > 0){
                if(this.OnMonsterEnterRange){
                    this.OnMonsterEnterRange(objs);
                }
            }
        }
        else if (objs == null || objs.length == 0){
            if(this.OnMonsterExitRange){
                this.OnMonsterExitRange(this.inRangeMonsters);
            }
        }
        else{   //两个数组都不为空，需要比较两个数组之间的差异
            if(this.OnMonsterExitRange){
                let exitObjs = this.inRangeMonsters.filter((mon)=>{
                    return  mon.isValid && !mon.IsDied() && !objs.includes(mon);
                })
                if(exitObjs.length > 0){
                    this.OnMonsterExitRange(exitObjs);
                }
            }
            if(this.OnMonsterEnterRange){
                let enterObjs = objs.filter((mon)=>{
                    return !mon.IsDied() && !this.inRangeMonsters.includes(mon);
                })
                if(enterObjs.length > 0){
                    this.OnMonsterEnterRange(enterObjs);
                }
            }
        }
        this.inRangeMonsters = objs;
    }
}


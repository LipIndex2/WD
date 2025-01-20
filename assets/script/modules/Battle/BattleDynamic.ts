import { _decorator, Component, game, Intersection2D, log, Node, Rect, isValid, error, Prefab, instantiate, Director, NodePool, Pool, director, view, Camera, Vec3 } from 'cc';
import * as fgui from "fairygui-cc";
import { UtilHelper } from '../../helpers/UtilHelper';
import { MonsterObj } from './Object/MonsterObj';
import { BattleData, BattleInfo } from './BattleData';
import { BattleEventType, BattleState, IS_DEBUG_COLLIDER, IHeroObjBuffData, IMonsterObjBuffData, MonsterCreateInfo, MonsterObjBuffType, MonsterType, BattleObjTag, BattleModel } from './BattleConfig';
import { BattleCtrl } from './BattleCtrl';
import { ColliderCheckType, SkillFunc } from './Function/SkillFunc';
import { BattleScene, IBattleScene } from './BattleScene';
import { LogError, LogWxError } from 'core/Debugger';
import { EventCtrl } from 'modules/common/EventCtrl';
import { SmallObjPool } from 'core/SmallObjPool';
import { ResManager } from 'manager/ResManager';
import { MainSceneBG } from './MainSceneBG';
import { BattleDebugData } from './BattleDebugCfg';
import { DEBUG } from 'cc/env';
import { IPreloadPool, NodePools } from 'core/NodePools';
import { PreloadSceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { ResPath } from 'utils/ResPath';
import { CameraManager } from 'manager/CameraManager';
import { NodeCreateFunc } from 'core/NodeCreateFunc';
import { BattleHelper, BattleSceneLayerType } from './BattleHelper';
const { ccclass, property } = _decorator;

export enum BattleTweenerType {
    Hero = 1,
    Monster = 2,
    Skill = 3,
    Other = 4,
}

// 被全局加速控制的tweener类型
var ctrlTweenerType: number[] = [
    BattleTweenerType.Monster,
    BattleTweenerType.Skill,
]

// 管理战斗中动态的对象
@ccclass('BattleDynamic')
export class BattleDynamic extends Component {
    //update帧率
    private frameRate: number = 0.1;
    private _frameRate: number = 0;
    //所有的tweenr

    private tweenerMap: Map<BattleTweenerType, Set<fgui.GTweener>>;
    private tweenerRecord: Map<fgui.GTweener, BattleTweenerType>;
    //所有的怪物
    monsters: Map<number, MonsterObj> = new Map();
    monsters_boss: Map<number, MonsterObj> = new Map();
    monsterPool: SmallObjPool<Node>;
    //所有的技能
    private skillFuncs: SkillFunc[] = [];
    private checkSkillIndex = 0;


    //技能资源池子
    private skillAssetPoolMap: Map<string, SmallObjPool<Node | Prefab>> = new Map();
    private objToPool: Map<Node, SmallObjPool<Node | Prefab>> = new Map<Node, SmallObjPool<Node | Prefab>>();


    //所有的池子
    private allPool: IPreloadPool[] = [];
    private preloadIndex = 0;
    quickDownloadFalg: boolean = false;  //快速下载标记

    //特效资源
    private effectList: Node[] = [];
    get scene(): IBattleScene {
        return BattleCtrl.Inst().GetBattleScene(this.tag);
    }

    get battleInfo(): BattleInfo {
        return BattleData.Inst().GetBattleInfo(this.tag);
    }

    get playerBattleInfo(): BattleInfo {
        return BattleData.Inst().battleInfo;
    }

    tag: BattleObjTag = BattleObjTag.Player;

    private dynamicMonsterId: number = 0;

    protected onLoad() {
        this.dynamicMonsterId = 0;
        this.tweenerMap = new Map();
        this.tweenerRecord = new Map();
        this.tweenerMap.set(BattleTweenerType.Hero, new Set<fgui.GTweener>());
        this.tweenerMap.set(BattleTweenerType.Monster, new Set<fgui.GTweener>());
        this.tweenerMap.set(BattleTweenerType.Skill, new Set<fgui.GTweener>());
        this.tweenerMap.set(BattleTweenerType.Other, new Set<fgui.GTweener>());

        this.monsterPool = new SmallObjPool(this.scene.MonsterSource, 100);
        this.SetPreloadPool(this.monsterPool);

        EventCtrl.Inst().on(BattleEventType.Pause, this.OnPause, this);
        EventCtrl.Inst().on(BattleEventType.Speed, this.OnSpeed, this);
        this.InitLoadRes();
    }

    //记录检测了多少个
    private recordCount: number = 0;
    //超时处理多少个
    private passTimeCount: number = 0;
    private testTime: number = 0;
    private testCount: number = 0;

    protected update(dt: number): void {
        let state = this.battleInfo.GetBattleState();
        if (state == BattleState.SanXiao) {
            this._frameRate += dt;
            if (this._frameRate >= this.frameRate || this.quickDownloadFalg) {
                this.PreloadPool();
                this._frameRate = 0;
            }
        } else if (state == BattleState.Figth) {
            //let time = game.totalTime;
            this.CheckCollider();
            // let _time = game.totalTime - time;
            // if(_time >= 5){
            //     //console.log("CheckCollider2 time", game.totalTime - time);
            //     this.passTimeCount;
            // }

            // this.testTime += dt;
            // if(this.testTime >= 10){
            //     this.testTime = 0;
            //     this.testCount++;
            //     console.log("时间", this.testCount * 10, "检测个数", this.recordCount, "超时个数", this.passTimeCount);
            // }
        }
    }

    private isPause = false;
    private OnPause(isPause: boolean) {
        this.isPause = isPause;
        this.playerBattleInfo.isPause = isPause;
        this.PauseAll(isPause);
    }

    OnSpeed() {
        let timescale = this.playerBattleInfo.globalTimeScale;
        ctrlTweenerType.forEach(type => {
            if (type == BattleTweenerType.Monster || type == BattleTweenerType.Hero) {
                this.SetAllTweenrSpeed(type, timescale)
            }
        })
    }



    private RealUpdate() {
        let state = this.battleInfo.GetBattleState();
        if (state == BattleState.Figth) {
            this.CheckCollider();
        }
    }


    IsPreloaded(): boolean {
        if (this.allPool == null) {
            return true;
        }
        let len = this.allPool.length;
        for (let i = 0; i < len; i++) {
            let pool = this.allPool[i];
            if (!pool.IsPreloaded()) {
                return false;
            }
        }
        return true;
    }

    private PreloadPool() {
        if (this.IsPreloaded()) {
            if (this.quickDownloadFalg) {
                this.quickDownloadFalg = false;
            }
            return;
        }
        if (!this.IsTweenrCompleted()) {
            return;
        }
        if (this.preloadIndex >= this.allPool.length) {
            this.preloadIndex = 0;
        }

        if (this.quickDownloadFalg) {
            this.allPool.forEach(pool => {
                pool.PreloadPut();
            })
        } else {
            let pool = this.allPool[this.preloadIndex];
            pool.PreloadPut();
            this.preloadIndex++;
        }
    }

    //检测方案1 每帧检测比例
    private CheckCollider() {
        if (this.monsters.size == 0 || this.skillFuncs.length == 0) {
            return;
        }
        if (this.playerBattleInfo.isPause == true) {
            return;
        }

        let stopSkills: SkillFunc[];
        let checkCount = Math.ceil(this.skillFuncs.length * 0.25);
        if (checkCount < 10) {
            checkCount = 10;
        }
        for (let i = 0; i < checkCount; i++) {
            if (this.skillFuncs.length > 0) {
                if (this.checkSkillIndex >= this.skillFuncs.length) {
                    this.checkSkillIndex = 0;
                }
                let skill = this.skillFuncs[this.checkSkillIndex]
                if (skill == null) {
                    continue;
                }
                if (this.IsScreenEliminate(skill)) {
                    if (stopSkills == null) {
                        stopSkills = [];
                    }
                    stopSkills.push(skill);
                } else {
                    let hits: MonsterObj[];
                    this.monsters.forEach((monster) => {
                        if (this.IsCollider(skill, monster)) {
                            if (hits == null) {
                                hits = [];
                            }
                            hits.push(monster);
                        }
                    })
                    skill.ColliderHit(hits);
                }
                this.checkSkillIndex++;
            } else {
                break;
            }
        }
        if (stopSkills) {
            stopSkills.forEach(this.foreachStopSkill.bind(this));
        }
    }

    //检测方案2 每帧全部检测
    private CheckCollider2() {
        if (this.monsters.size == 0 || this.skillFuncs.length == 0) {
            return;
        }
        if (this.playerBattleInfo.isPause == true) {
            return;
        }

        let stopSkills: SkillFunc[];
        let checkCount = this.skillFuncs.length;
        for (let i = 0; i < checkCount; i++) {
            let skill = this.skillFuncs[i]
            if (skill == null) {
                continue;
            }
            if (this.IsScreenEliminate(skill)) {
                if (stopSkills == null) {
                    stopSkills = [];
                }
                stopSkills.push(skill);
            } else {
                let hits: MonsterObj[];
                this.monsters.forEach((monster) => {
                    if (this.IsCollider(skill, monster)) {
                        if (hits == null) {
                            hits = [];
                        }
                        hits.push(monster);
                    }
                })
                skill.ColliderHit(hits);
            }
        }
        if (stopSkills) {
            stopSkills.forEach(this.foreachStopSkill.bind(this));
        }
    }

    private foreachStopSkill(skill: SkillFunc) {
        this.StopSkillFunc(skill);
    }

    IsCollider(skill: SkillFunc, monster: MonsterObj): boolean {
        if (Number.isNaN(monster.worldPosition.x) || Number.isNaN(monster.worldPosition.y)) {
            let battleInfo = this.playerBattleInfo;
            let skills: number[] = [];
            battleInfo.skillListMap.forEach((v, skill) => {
                skills.push(skill.skill_id);
            })

            // LogWxError("怪物位置NAN!! ", battleInfo.sceneType, battleInfo.sceneId, battleInfo.roundProgerss, monster.data.monster_id,
            // "上阵英雄", battleInfo.in_battle_heros,
            // "词条",skills);
            monster.Die();
            return false;
        }
        // if (monster.colliderTrans == null) {
        //     //console.log("怪物未加碰撞盒");
        //     return false;
        // }
        if (skill.colliderTrans == null || !skill.isCheckCollider) {
            //console.log("技能未加碰撞盒");
            return false;
        }
        if (skill.tag != monster.tag) {
            return false;
        }
        if (monster.IsDied() || !monster.isMoved) {
            return false;
        }
        if (skill.IsExclude(monster)) {
            return false;
        }
        let wudi = monster.HasBuff(MonsterObjBuffType.WuDi);
        if (wudi) {
            return false;
        }
        let result;
        if (skill.colliderType == ColliderCheckType.RectRect) {
            result = Intersection2D.rectRect(skill.worldAABB, monster.wordAABB);
        } else if (skill.colliderType == ColliderCheckType.RectPolygon) {
            result = Intersection2D.rectPolygon(monster.wordAABB, skill.worldPoints);
        } else {
            return false;
        }
        // if(result){
        //     this.recordCount++;
        // }
        return result;
    }

    IsScreenEliminate(skill: SkillFunc): boolean {
        if (skill == null || !skill.isScreenEliminate) {
            return false;
        }
        let screenPos = skill.playNode.worldPosition;
        let isOffScreen: boolean = screenPos.x < 0 ||
            screenPos.x > fgui.GRoot.inst.width ||
            screenPos.y < 0 ||
            screenPos.y > fgui.GRoot.inst.height
        return isOffScreen
    }


    CreateMonster(info: MonsterCreateInfo): MonsterObj {
        let data = BattleData.Inst().GetSceneMonsterCfg(info.monster_id);
        let node = this.monsterPool.Get();
        let parent = BattleHelper.GetNodeParent(BattleSceneLayerType.MonsterRoot, this.scene);
        parent.addChild(node);
        node.name = info.monster_id.toString();
        let mono = node.getComponent(MonsterObj);
        mono.tag = this.tag;
        node.setSiblingIndex(0);
        node.setWorldPosition(info.pos);
        mono.createInfo = info;
        mono.SetData(data);
        this.dynamicMonsterId++;
        mono.objId = this.dynamicMonsterId;
        mono.exp = info.monster_exp;
        this.AddMonster(mono);
        // if(this.monsters_boss.size == 0){
        //     this.AddBossMonster(mono);
        // }
        if (mono.data.monster_type == MonsterType.Boss) {
            this.AddBossMonster(mono);
        }

        if (BattleDebugData.BATTLE_DEBUG_MODE) {
            this.scheduleOnce(() => {
                if (mono.IsDied()) { return; }
                BattleDebugData.Inst().MonsterBuff.forEach(buffType => {
                    if (buffType > 0) {
                        let data = <IMonsterObjBuffData>{
                            buffType: buffType,
                            time: 100000,
                            hero: null,
                            p1: 1,
                        }
                        mono.AddBuff(data);
                    }
                })
            }, 0.2);

        }

        return mono;
    }

    // checkCreatInfo(info: MonsterCreateInfo) {
    //     if (this.monsters_boss.size > 0) {
    //         let pos;
    //         this.monsters_boss.forEach(element => {
    //             pos = element.node.worldPosition
    //         });
    //         let bos_ij = this.scene.battleBG.GetIJByPos(pos);
    //         info.i = bos_ij.i;
    //         info.j = bos_ij.j;
    //         info.pos = this.scene.battleBG.GetTopMonsterPos(info.i, info.j);
    //         info.showEffect = false;
    //     }
    // }

    AddMonster(monster: MonsterObj) {
        if (this.monsters.has(monster.objId)) {
            LogError("注意加了一个相同的怪物", monster.objId);
        }
        this.monsters.set(monster.objId, monster);
    }

    AddBossMonster(monster: MonsterObj) {
        if (this.monsters_boss.has(monster.objId)) {
            LogError("注意加了一个相同的怪物", monster.objId);
        }
        this.monsters_boss.set(monster.objId, monster);
    }

    DieMonster() {
        this.monsters.forEach(element => {
            element.Die();
        });
    }
    RemoveMonster(monster: MonsterObj, isPut: boolean = true) {
        if (this.monsters.has(monster.objId)) {
            this.monsters.delete(monster.objId);
            if (this.monsters_boss.has(monster.objId)) {
                this.monsters_boss.delete(monster.objId);
            }
            monster.Delete();
        } else {
            LogError("Remove一个异常的怪物！！！", monster)
        }
        if (isPut) {
            this.monsterPool.Put(monster.node);
        }
    }
    GetMonster(id: number): MonsterObj {
        return this.monsters.get(id);
    }
    ClearMonster() {
        this.monsters.forEach((v) => {
            v.Delete();
        });
        this.monsters.clear();
        this.monsters = null;

        this.monsters_boss.forEach((v) => {
            v.Delete();
        });
        this.monsters_boss.clear();
        this.monsters_boss = null;
    }


    AddTweenr(type: BattleTweenerType, tweenr: fgui.GTweener) {
        //console.log("添加tw", this.tweenerRecord.has(tweenr))
        // if(this.tweenerRecord.has(tweenr)){
        //     let type = this.tweenerRecord.get(tweenr);
        //     this.RemoveTweenr(type, tweenr);
        // }
        // this.tweenerRecord.set(tweenr, type);

        this.tweenerMap.get(type).add(tweenr);
        tweenr.setPaused(this.isPause);
        if (ctrlTweenerType.indexOf(type) != -1) {
            tweenr.setTimeScale(this.playerBattleInfo.globalTimeScale);
        }

        if (BattleDebugData.BATTLE_DEBUG_MODE) {
            if (type == BattleTweenerType.Monster && !BattleDebugData.Inst().IsMonsterAttack) {
                tweenr.setPaused(true);
            }
        }
    }
    RemoveTweenr(type: BattleTweenerType, tweenr: fgui.GTweener) {
        if (tweenr == null) {
            LogError("销毁Tweener异常，请检查")
            return
        }
        //this.tweenerRecord.delete(tweenr);
        let arr = this.tweenerMap.get(type);
        this.KillTweenr(tweenr);
        arr.delete(tweenr);
    }
    KillTweenr(tweenr: fgui.GTweener) {
        if (tweenr == null) {
            return
        }
        tweenr.onComplete(null);
        tweenr.onUpdate(null);
        tweenr.kill();
    }
    IsTweenrCompleted(): boolean {
        for (var tweeners of this.tweenerMap.values()) {
            for (var t of tweeners) {
                if (!t.completed) {
                    return false;
                }
            }
        }
        return true;
    }
    PauseAllTweenr(type: BattleTweenerType, isPause: boolean) {
        if (type == null) {
            for (var tweeners of this.tweenerMap.values()) {
                for (var t of tweeners) {
                    t.setPaused(isPause);
                }
            }
        }
        else {
            let tweeners = this.tweenerMap.get(type);
            for (let tweener of tweeners) {
                tweener.setPaused(isPause);
            }
        }
    }

    //设置tweener速度比例
    SetAllTweenrSpeed(type: BattleTweenerType, scale: number) {
        if (type == null) {
            for (var tweeners of this.tweenerMap.values()) {
                for (var t of tweeners) {
                    t.setTimeScale(scale);
                }
            }
        }
        else {
            let tweeners = this.tweenerMap.get(type);
            for (let tweener of tweeners) {
                tweener.setTimeScale(scale);
            }
        }
    }


    PlaySkillFunc(skillFunc: SkillFunc) {
        if (DEBUG) {
            if (this.skillFuncs.indexOf(skillFunc) != -1) {
                LogError("播放了同一个技能，请检查");
            }
        }
        skillFunc.tag = this.tag;
        skillFunc.Play();
        this.skillFuncs.push(skillFunc);
    }
    StopSkillFunc(skillFunc: SkillFunc) {
        skillFunc.Stop();
        UtilHelper.ArrayRemove(this.skillFuncs, skillFunc);
    }
    StopAllSkill(call?: () => void) {
        if (this.skillFuncs.length == 0) {
            if (call) {
                call();
            }
            return;
        }
        this.scheduleOnce(() => {
            console.log("清空了全部技能", this.skillFuncs.length);
            for (var skillFunc of this.skillFuncs) {
                skillFunc.Stop();
            }
            this.skillFuncs = [];
            if (call) {
                call();
            }
        }, 0.1);
    }
    PauseAllSkill(isPause: boolean) {
        for (var skillFunc of this.skillFuncs) {
            skillFunc.Pause(isPause);
        }
    }


    // 暂停全部
    PauseAll(isPause: boolean) {
        for (var tweeners of this.tweenerMap.values()) {
            for (var t of tweeners) {
                t.setPaused(isPause);
            }
        }
    }

    GetAllSkill(): SkillFunc[] {
        return this.skillFuncs;
    }


    RegisterSkillAssetPool(path: string, parent?: Node) {
        //LogError("注册path", path);
        if (this.skillAssetPoolMap.has(path)) {
            return;
        }
        let pool = new SmallObjPool<Node | Prefab>(null, 100);
        pool.path = path;
        if (parent != null) {
            pool.parent = parent;
        } else {
            pool.parent = BattleHelper.GetNodeParent(BattleSceneLayerType.Skill, this.scene);
        }
        this.SetPreloadPool(pool);
        this.skillAssetPoolMap.set(path, pool);
        if (BattleCtrl.Inst().battleModel == BattleModel.Arena) {
            ResManager.Inst().Load<Prefab>(path, (error, prefab) => {
                if (error != null) {
                    console.error("资源加载失败", path);
                    return;
                }
                pool.SetSourceObj(prefab);
            })
        }
    }

    IsCanPlaySkill(): boolean {
        if (this.node == null) {
            return false;
        }
        if (this.playerBattleInfo.isPause) {
            return false;
        }
        if (this.battleInfo.battleState != BattleState.Figth) {
            return false;
        }
        return true;
    }
    GetSkillAsset(path: string, call?: (obj: Node) => any) {
        // if (!this.skillAssetPoolMap.has(path)) {
        //     return null;
        // }
        // let pool = this.skillAssetPoolMap.get(path);
        // if (pool.GetSourceObj() == null) {
        //     return null;
        // }
        // let node = pool.Get() as Node;
        // this.objToPool.set(node, pool);
        // return node;

        if (!this.skillAssetPoolMap.has(path)) {
            this.RegisterSkillAssetPool(path);
        }
        let pool = this.skillAssetPoolMap.get(path);
        if (pool.GetSourceObj() == null) {
            ResManager.Inst().Load<Prefab>(path, (error, prefab) => {
                if (error != null) {
                    console.error("资源加载失败", path);
                    return;
                }
                pool.SetSourceObj(prefab);
                if (call && this.IsCanPlaySkill()) {
                    let obj = pool.Get() as Node;
                    this.objToPool.set(obj, pool);
                    call(obj);
                }
            })
        } else {
            if (call && this.IsCanPlaySkill()) {
                // 分帧加载，暂时每看到明显效果
                // let prefab = pool.GetSourceObj();
                // NodeCreateFunc.Inst().CloneObj(prefab, 100, (obj)=>{
                //     if(obj){
                //         this.objToPool.set(obj, pool);
                //         call(obj);
                //     }
                // }, pool);

                let obj = pool.Get() as Node;
                this.objToPool.set(obj, pool);
                call(obj);
            }
        }
    }
    PutSkillAsset(obj: Node) {
        let pool = this.objToPool.get(obj);
        if (pool) {
            pool.Put(obj);
        } else {
            console.log("销毁了一个没有池子的技能", obj.name);
            obj.destroy();
        }
    }
    IsSkillPoolLoaded(path: string): boolean {
        if (!this.skillAssetPoolMap.has(path)) {
            return false;
        }
        let pool = this.skillAssetPoolMap.get(path);
        if (pool.GetSourceObj() == null) {
            return false;
        }
        return true;
    }
    //技能池子是否全部加载完毕
    IsSkillPoolAlLoaded(): boolean {
        for (let v of this.skillAssetPoolMap.values()) {
            if (v == null || v.GetSourceObj() == null) {
                return false;
            }
        }
        return true;
    }


    Delete(): void {
        for (var tweeners of this.tweenerMap.values()) {
            for (var t of tweeners) {
                this.KillTweenr(t);
            }
        }
        for (var skillFunc of this.skillFuncs) {
            skillFunc.Stop();
        }

        this.skillFuncs = null;
        this.tweenerMap.clear();
        this.tweenerMap = null;

        this.ClearMonster();

        EventCtrl.Inst().off(BattleEventType.Pause, this.OnPause, this)

        this.skillAssetPoolMap.clear();
        this.objToPool.clear();
        this.skillAssetPoolMap = null;
        this.objToPool = null;
        this.unscheduleAllCallbacks();

        this.monsterPool.Clear();
        this.monsterPool = null;

        this.ClearEffect();
    }

    //foreach所有的怪，如果函数返回true则停止循环
    ForeachMonsters(func: (monObj: MonsterObj) => boolean) {
        for (let moKey of this.monsters.values()) {
            if (func(moKey)) {
                return;
            }
        }
    }

    SetPreloadPool(pool: IPreloadPool, count: number = 6) {
        this.allPool.push(pool);
        pool.preloadCount = count;
    }

    private InitLoadRes() {
        console.log("注册战斗预加载");
        //必用的特效
        let effectCfg = PreloadSceneEffectConfig;
        effectCfg.forEach((cfg) => {
            let pool = NodePools.Inst().CreatePool(cfg.effectCfg.path);
            this.SetPreloadPool(pool, cfg.preloadCount);
        })

        // 必用怪物
        // let monsterList = BattleData.Inst().GetAllMonsterResList();
        // monsterList.forEach((res_id)=>{
        //     let path = ResPath.Monster(res_id);
        //     let pool = NodePools.Inst().CreatePool(path);
        //     this.SetPreloadPool(pool, 10);
        // })
    }

    LoadEffect(path: string, parent: Node, worldPos: Vec3, call?: (obj: Node) => any) {
        NodePools.Inst().Get(path, (obj) => {
            if (!obj) {
                return;
            }
            if (!isValid(this.node) || !isValid(parent)) {
                NodePools.Inst().Put(obj);
                return;
            }
            obj.setParent(parent);
            obj.setWorldPosition(worldPos);
            this.effectList.push(obj);
            if (call) {
                call(obj);
            }
        });
    }
    RemoveEffect(obj: Node) {
        if (obj == null) {
            return;
        }
        UtilHelper.ArrayRemove(this.effectList, obj);
        NodePools.Inst().Put(obj);
    }
    ClearEffect() {
        this.effectList.forEach(v => {
            if (v && isValid(v)) {
                NodePools.Inst().Put(v);
            }
        })
        this.effectList = [];
    }

}


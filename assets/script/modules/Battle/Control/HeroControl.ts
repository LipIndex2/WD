import { Intersection2D, Node, Rect, Vec2, Vec3, isValid } from 'cc';
import { CfgSkillData } from 'config/CfgEntry';
import { CfgHeroBattle } from 'config/CfgHero';
import { HandleCollector } from 'core/HandleCollector';
import { NodePools } from 'core/NodePools';
import { ResPath } from 'utils/ResPath';
import { BAO_JI_SCALE, BattleModel, BattleSkillType, BattleState, CELL_WIDTH, FIGHT_CELL_WIDTH, FIGHT_SCALE, HeroAnimationType, MIN_ATTACK_SPEED, MonsterObjBuffType, SkillPlayType } from '../BattleConfig';
import { BattleCtrl } from '../BattleCtrl';
import { BattleData, BattleHeroAttriBuff, BattleInfo, BattleSkillAttriData } from '../BattleData';
import { BattleDebugData } from '../BattleDebugCfg';
import { BattleDynamicHelper } from '../BattleDynamicHelper';
import { SkillColliderEvent, SkillFunc } from '../Function/SkillFunc';
import { HeroObj } from '../Object/HeroObj';
import { MonsterObj } from '../Object/MonsterObj';
import { BaseControl } from './BaseControl';
import { IBattleScene } from '../BattleScene';
import { BattleHelper, BattleSceneLayerType } from '../BattleHelper';
import { LogWxError } from 'core/Debugger';

//英雄等级>=stage级的时候使用resName
export type SkillFuncStageRes = { stage: number; resName: string; }[]
class SkillFuncRes {
    //**需要按等级从低到高【顺序】配置**
    stageRes: SkillFuncStageRes = null;
}

//初始就预加载
export class SkillFuncResInit extends SkillFuncRes {
    public static Create(stageRes: SkillFuncStageRes = null): SkillFuncResInit {
        let re = new SkillFuncResInit();
        re.stageRes = stageRes;
        return re;
    }
}

//解锁技能的时候预加载
export class SkillFuncResUnlock extends SkillFuncRes {
    public static Create(skillId: number, stageRes: SkillFuncStageRes = null): SkillFuncResUnlock {
        let re = new SkillFuncResUnlock();
        re.stageRes = stageRes;
        re.skillId = skillId;
        return re;
    }
    skillId: number;
}


//攻击范围  跟uiTransform一样的
//这个是攻击范围 0.3以格子为计量标准。0.3就表示他的触发范围宽是0.3个格子 一个格子==CELL_WIDTH * FIGHT_SCALE
// anchorX anchorY 是表示矩形的轴心，默认0.5, 0.5
export class HeroAttackRange {
    w: number;
    h: number;
    r: number;
    anchorX: number;
    anchorY: number;
    scale: number;
    constructor(w: number, h: number, r?: number, x?: number, y?: number) {
        this.w = w;
        this.h = h;
        this.r = r;
        this.anchorX = x ?? 0.5;
        this.anchorY = y ?? 0.5;
    }
    private _wordAABB: Rect = new Rect();
    private lastPos:Vec3;
    GetWordAABB(centerPos: Vec3, scale: number): Rect {
        if (scale != this.scale || this.lastPos == null || this.lastPos.x != centerPos.x || this.lastPos.y != centerPos.y) {
            let w = this.w * CELL_WIDTH * FIGHT_SCALE * scale;
            let h = this.h * CELL_WIDTH * FIGHT_SCALE * scale;
            let x = centerPos.x - w * this.anchorX;
            let y = centerPos.y - h * this.anchorY;
            this._wordAABB.x = x;
            this._wordAABB.y = y;
            this._wordAABB.width = w;
            this._wordAABB.height = h;
            this.scale = scale;
            this.lastPos = new Vec3(centerPos.x, centerPos.y);
        }
        return this._wordAABB;
    }

    ReSetAABB() {
        this.lastPos = null;
    }
}

export class HeroControl extends BaseControl {
    protected beforeSkillMap = new Map();
    protected afterSkillMap = new Map();
    protected skillFuncRes: { [key: string]: SkillFuncRes } = null

    private skillDataHandleMap: Map<number, (skill:CfgSkillData)=>any>;

    hero: HeroObj;
    heroData: CfgHeroBattle;

    isBattle: boolean = false;
    private t: number = 100;

    //每0.5秒检查一下怪物是否进度攻击范围
    protected attackRange: HeroAttackRange = new HeroAttackRange(0, 0);
    protected GetattackRange(): HeroAttackRange {
        return this.attackRange;
    }
    private checkAttackTime: number = 0.2;
    private _checkAttackTime: number = 0.2;
    private isMonsterEnter = false;
    protected get IsMosnterEnter(){
        return this.isMonsterEnter;
    }

    protected globalSkillAttri: BattleSkillAttriData;
    private pause_num: number = 0;
    get shootEffectPath(): string {
        let res_id = this.heroData.bullet_res_id;
        if (res_id == null || res_id == "" || res_id == 0) {
            res_id = "toudanshou_1"
            console.log("英雄技能资源未找到");
        }

        return ResPath.SkillAsset(res_id)
    }
    get hitEffectPath(): string {
        if (this.heroData.bullet_hit_id == 0) {
            return null;
        }
        return ResPath.SkillAsset(this.heroData.bullet_hit_id)
    }

    get scene():IBattleScene{
        return BattleCtrl.Inst().GetBattleScene(this.hero.tag);
    }

    get battleInfo(): BattleInfo{
        return BattleData.Inst().GetBattleInfo(this.hero.tag);
    }

    get playerBattleInfo(): BattleInfo{
        return BattleData.Inst().battleInfo;
    }

    private foreachSkillFuncRes(con: Function, func: (key: string, data: SkillFuncRes) => void) {
        if (this.skillFuncRes == null) {
            return;
        }
        for (let k in this.skillFuncRes) {
            let data = this.skillFuncRes[k];
            if (data.constructor == con) {
                func(k, data);
            }
        }
    }

    protected start(): void {
        this.hero = this.node.getComponent(HeroObj);
        this.heroData = this.hero.GetData();

        this.globalSkillAttri = this.battleInfo.skillAttri;
        this.handleCollector = HandleCollector.Create();
        // 备注 isbattle 和这个监听可以去掉
        this.AddSmartDataCare(this.battleInfo, this.FlushRoundState.bind(this), "battleState");
        this.AddSmartDataCare(this.battleInfo, this.PreloadSkillAssetUnlock.bind(this), "skillListMap");
        this.FlushBattle();
        this.PreloadSkillAsset();
        this.Init();
    }

    protected update(dt: number): void {
        if(this.playerBattleInfo.isPause){
            return;
        }
        if (BattleDebugData.BATTLE_DEBUG_MODE && !BattleDebugData.Inst().IsHeroAttack) {
            return;
        }
        if (!this.isBattle || this.heroData.stage == 0) {
            return;
        }

        if (this.pause_num) {
            return
        }

        if (this.playerBattleInfo.globalTimeScale != 1) {
            dt *= this.playerBattleInfo.globalTimeScale;
        }

        if (this.IsHeroRest(dt)) {
            return
        }
        //this.PreloadSkillAsset();
        this.t += dt;
        let player_speed = this.GetTotalAttackSpeed();
        let min_speed = this.minSpeedValue;
        if(player_speed < min_speed){
            player_speed = min_speed;
        }
        if (this.isMonsterEnter && (this.t < 0 || (player_speed > 0 && this.t >= player_speed))) {
            this.Play();
            this.t = 0;
        }

        this._checkAttackTime += dt;
        if (this._checkAttackTime > this.checkAttackTime) {
            this.CheckAttackCondition();
            this._checkAttackTime = 0;
        }

        this.Run(dt);
    }

    protected Run(dt: number) {

    }


    private FlushBattle() {
        this.FlushRoundState();
    }

    private FlushRoundState() {
        let battleState = this.battleInfo.GetBattleState();
        if (battleState == BattleState.Figth) {
            this.StartBattle();
        } else {
            this.StopBattle();
        }
    }
    private CheckAttackCondition() {
        let monsters = BattleDynamicHelper.GetMonsterMap(this.hero.tag);
        for (var monster of monsters.values()) {
            if (this.CheckAttackRange(monster)) {
                this.OnMonsterEnter(monster);
                this.isMonsterEnter = true;

                if(this.scene.FightMask != null){
                    let maskSiblingIndex = this.scene.FightMask.node.getSiblingIndex();
                    let selfSiblingIndex = this.node.getSiblingIndex();
                    if (selfSiblingIndex < maskSiblingIndex) {
                        this.node.setSiblingIndex(maskSiblingIndex);
                        this.hero.PlayAnimation(HeroAnimationType.InFight);
                    }
                }
                return;
            }
        }
        if (this.isMonsterEnter) {
            this.OnMonsterLeave();
            this.isMonsterEnter = false;
            this.node.setSiblingIndex(0);
            this.hero.PlayAnimation(HeroAnimationType.Await);
        }

    }

    //攻击范围检查
    protected CheckAttackRange(monster: MonsterObj): boolean {
        let wudi = monster.HasBuff(MonsterObjBuffType.WuDi);
        if (wudi) {
            return false;
        }
        //半径检查
        let range = this.GetattackRange();
        if (range.r != null) {
            return this.CheckAttackConditionRange(monster);
        }

        //矩形碰撞检查
        let selfAABB = range.GetWordAABB(this.node.worldPosition, this.skillBuff.attackRangeScale);
        let result = Intersection2D.rectRect(monster.wordAABB, selfAABB);
        return result;
    }
    //检查范围
    private _cacheVec2 = new Vec2();
    private CheckAttackConditionRange(monster: MonsterObj): boolean {
        let range = this.GetattackRange();
        if (range.r == null) {
            return false;
        }

        this._cacheVec2.x = this.node.worldPosition.x;
        this._cacheVec2.y = this.node.worldPosition.y;
        let result = Intersection2D.rectCircle(monster.wordAABB, this._cacheVec2, range.r * FIGHT_CELL_WIDTH * 0.5);
        return result;
    }

    RegisterSkill(type: SkillPlayType, skillId: number, skillFunc: (skill: CfgSkillData, event?: SkillColliderEvent) => void) {
        if (type == SkillPlayType.Before) {
            if (!this.beforeSkillMap.has(skillId)) {
                this.beforeSkillMap.set(skillId, skillFunc);
            };
        } else if (type == SkillPlayType.After) {
            if (!this.afterSkillMap.has(skillId)) {
                this.afterSkillMap.set(skillId, skillFunc);
            }
        }
    }

    UnRegisterSkill(type: SkillPlayType, skillId: number) {
        if (type == SkillPlayType.Before) {
            if (this.beforeSkillMap.has(skillId)) {
                this.beforeSkillMap.delete(skillId);
            };
        } else if (type == SkillPlayType.After) {
            if (this.afterSkillMap.has(skillId)) {
                this.afterSkillMap.delete(skillId);
            }
        }
    }

    RegisterSkillHandle(skillid:number, func:(skill: CfgSkillData)=>any){
        if(this.skillDataHandleMap == null){
            this.skillDataHandleMap = new Map<number, (skill: CfgSkillData)=>any>();
        }
        this.skillDataHandleMap.set(skillid, func);
    }

    StartBattle() {
        if (!this.isBattle) {
            this.isBattle = true;
            this.t = 100;
        }
    }

    StopBattle() {
        if (this.isBattle) {
            this.isBattle = false;
            this.isMonsterEnter = false;
        }
    }

    IsCanBattle():boolean{
        return this.node != null && this.battleInfo.GetBattleState() == BattleState.Figth && !this.playerBattleInfo.isPause
    }


    //技能播放前叠加的Skill
    protected BeforeSkill() {
        this.beforeSkillMap.forEach((v, skill_id) => {
            if (BattleData.Inst().IsHasSkill(skill_id, this.hero.tag)) {
                let skill = BattleData.Inst().GetSkillCfg(skill_id);
                v(skill);
            }
        })
    }

    //技能命中后叠加的Skill
    protected AfterSkill(event: SkillColliderEvent) {
        this.afterSkillMap.forEach((v, skill_id) => {
            if (BattleData.Inst().IsHasSkill(skill_id, this.hero.tag)) {
                let skill = BattleData.Inst().GetSkillCfg(skill_id);
                v(skill, event);
            }
        })
    }

    //技能释放前处理词条
    protected BeforeSkillData(){
        if(this.skillDataHandleMap == null || this.skillDataHandleMap.size == 0){
            return;
        }
        this.skillDataHandleMap.forEach((v, skill_id) => {
            if (BattleData.Inst().IsHasSkill(skill_id, this.hero.tag)) {
                let skill = BattleData.Inst().GetSkillCfg(skill_id);
                v(skill);
            }
        })
    }

    protected PreloadSkillAsset() {
        // NodePools.Inst().CreatePool(this.shootEffectPath);
        // if(this.heroData.bullet_hit_id != 0){
        //     NodePools.Inst().CreatePool(this.hitEffectPath);
        // }
        if (this.heroData.stage == 0) {
            return;
        }
        let scene = this.scene;
        if (this.heroData.bullet_res_id != 0){
            scene.dynamic.RegisterSkillAssetPool(this.shootEffectPath);
        }
        if (this.heroData.bullet_hit_id != 0) {
            scene.dynamic.RegisterSkillAssetPool(this.hitEffectPath);
        }

        this.foreachSkillFuncRes(SkillFuncResInit, (key, data) => {
            this.scene.dynamic.RegisterSkillAssetPool(this.skillAssetPath(key));
        });
        this.PreloadSkillAssetUnlock();
    }

    protected PreloadSkillAssetUnlock() {
        this.foreachSkillFuncRes(SkillFuncResUnlock, (key, data: SkillFuncResUnlock) => {
            if (BattleData.Inst().IsHasSkill(data.skillId, this.hero.tag)) {
                this.scene.dynamic.RegisterSkillAssetPool(this.skillAssetPath(key));
            }
        });
        this.OnSkillChange();
    }

    private skillAssetPath(key: string): string {
        let resData = this.skillFuncRes[key];
        if (resData == null || resData == undefined) {
            console.error(`英雄技能资源未找到,resKey=${key},heroId=${this.heroData.hero_id}`);
            return ResPath.SkillAsset("toudanshou_1");
        }
        let resName = key;
        if (resData.stageRes == null) {
            return ResPath.SkillAsset(resName);
        }
        for (let st of resData.stageRes) {
            if (this.heroData.stage < st.stage) {
                break;
            }
            resName = st.resName;
        }
        return ResPath.SkillAsset(resName);
    }

    CrateSkillFuncByName(assName: string, call?: (skill: SkillFunc) => void, parent?: Node) {
        let path = this.skillAssetPath(assName);
        this.CrateSkillFunc(path, call, parent);
    }

    CrateSkillFunc(path: string, call?: (skill: SkillFunc) => void, parent?: Node) {
        if (this.hero == null) {
            return;
        }
        if(this.scene.GetHero(this.hero.i, this.hero.j) == null){
            LogWxError("战斗异常，英雄没有记录在场景中", this.hero.i, this.hero.j,this.hero.data.hero_id, this.hero.stage);
            return;
        }
        let scene = this.scene;
        scene.dynamic.GetSkillAsset(path, (obj:Node)=>{
            if (obj) {
                if(!this.node || !isValid(this.node || !this.hero)){
                    return;
                }
                if(!this.IsCanBattle()){
                    this.scene.dynamic.PutSkillAsset(obj);
                    return;
                }

                parent = parent ?? BattleHelper.GetNodeParent(BattleSceneLayerType.Skill, this.scene);
                parent.addChild(obj);
                let mono = obj.getComponent(SkillFunc);
                mono.Reset();
                obj.worldPosition = this.node.worldPosition;
                mono.OnHit(this.OnHitEvent.bind(this));
                if (call) {
                    call(mono);
                }

                this.PlaySkill(mono);
            }
        });
    }

    CrateHitSkillFuncByName(assName: string, pos: Vec3, hitFunc: (event: SkillColliderEvent) => void, call?: (skill: SkillFunc) => void, parent?:Node) {
        let path = this.skillAssetPath(assName);
        this.CrateHitSkillFunc(path, pos, hitFunc, call, parent);
    }


    CrateHitSkillFunc(path: string, pos: Vec3, hitFunc: (event: SkillColliderEvent) => void, call?: (skill: SkillFunc) => void, parent?:Node) {
        if (this.hero == null) {
            return;
        }

        if(this.scene.GetHero(this.hero.i, this.hero.j) == null){
            LogWxError("战斗异常，英雄没有记录在场景中", this.hero.i, this.hero.j,this.hero.data.hero_id, this.hero.stage);
            return;
        }

        let scene = this.scene;
        scene.dynamic.GetSkillAsset(path, (obj:Node)=>{
            if (obj == null || obj.children == null) {
                return;
            }
            if(!this.IsCanBattle()){
                this.scene.dynamic.PutSkillAsset(obj);
                return;
            }
            if(parent == null){
                parent = BattleHelper.GetNodeParent(BattleSceneLayerType.Skill, this.scene);
            }
            parent.addChild(obj);
            let mono = obj.getComponent(SkillFunc);
            mono.Reset();
            obj.worldPosition = pos;
            mono.OnHit(hitFunc);
            if (call) {
                call(mono);
            }
        });
    }

    //获取周围round格敌人
    GetRoundMonsters(round: number, wordPos: Vec3): MonsterObj[] {
        let list: MonsterObj[] = [];
        let monsters = BattleDynamicHelper.GetMonsterMap(this.hero.tag);
        let roundSize = (round * 2 + 1) * FIGHT_CELL_WIDTH;
        let scopeRect = new Rect(wordPos.x - roundSize / 2, wordPos.y - roundSize / 2, roundSize, roundSize)
        monsters.forEach(monster => {
            if (Intersection2D.rectRect(scopeRect, monster.wordAABB)) {
                list.push(monster);
            }
        })
        return list;
    }

    //获取周围round队友
    GetRoundHeros(round: number): HeroObj[] {
        return this.scene.GetRoundHeros(this.hero, round);
    }


    //没有获得这个词条会返回空
    GetHasSkill(skill_id:number):CfgSkillData{
        let skill = BattleData.Inst().GetSkillCfg(skill_id);
        if(BattleData.Inst().IsHasSkillByData(skill,this.hero.tag)){
            return skill;
        }
        return null;
    }

    PlaySkill(skill:SkillFunc){
        BattleDynamicHelper.PlaySkill(skill, this.hero.tag);
    }
    StopSkill(skill:SkillFunc){
        BattleDynamicHelper.StopSkill(skill, this.hero.tag);
    }

    IsHasSkillByData(skill_data: CfgSkillData):boolean{
        return BattleData.Inst().IsHasSkillByData(skill_data, this.hero.tag);
    }

    GetSkillCount(skill: CfgSkillData): number {
        return BattleData.Inst().GetSkillCount(skill, this.hero.tag)
    }

    // 如果有skill2则用skill2,skill2是比skill1更好的但是一样类型的词条
    GetGoodSkill(skill1_id:number, skill2_id:number){
        let skill2 = this.GetHasSkill(skill2_id);
        if(skill2){
            return skill2;
        }
        let skill1 = this.GetHasSkill(skill1_id);
        return skill1;
    }

    // ************** 属性计算逻辑 value = 英雄等级属性 战斗等级系数 全局词条加成 技能buff ***********

    // 特殊词条加成比例 2000伤害类型
    GetSpSkillHarmScale():number{
        let skill = BattleData.Inst().GetHasSkillByTypeAndHeroId(BattleSkillType.ComTiaoJianJiaCheng, this.hero.data.hero_id, this.hero.tag);
        if(!skill){
            return 0;
        }
        switch(skill.pram1){
            case 1: if(this.otherAttackValue >= skill.pram2) return skill.pram3 / 100;      //攻击力
            case 4: if(this.hero.baoji >= skill.pram2) return skill.pram3 / 100;            //暴击
            case 5: if(this.hero.baojiScale - BAO_JI_SCALE >= skill.pram2 / 100) return skill.pram3 / 100;  //暴击比例
        }
        return 0;
    }

    get skillBuff(): BattleHeroAttriBuff {
        let buff = this.battleInfo.skillAttri.GetHeroAttriBuff(this.heroData.hero_id);
        return buff;
    }

    //额外的攻击力
    get otherAttackValue():number{
        return this.skillBuff.harmValue + this.battleInfo.skillAttri.attackValue + this.hero.LocalAttriBuff.harmValue;
    }

    // 基础伤害
    get baseAttackValue(): number{
        let value = this.hero.attriCfg.att * this.hero.data.coefficients;
        if (BattleDebugData.BATTLE_DEBUG_MODE) {
            value = value * BattleDebugData.Inst().PlayerDamageScale;
        }
        return value + this.otherAttackValue;
    }
    // 基础攻速
    get baseSpeedValue(): number{
        return this.hero.attriCfg.att_speed;
    }
    // 最小攻速
    get minSpeedValue(): number{
        return this.hero.attriCfg.att_speed * MIN_ATTACK_SPEED;
    }

    //攻击力
    get attackValue(): number {
        let spScale = this.GetSpSkillHarmScale();
        let value = this.baseAttackValue * (this.battleInfo.globalAttackScale + 
            this.globalSkillAttri.GetHarmPercent() + this.skillBuff.harmScale + this.hero.LocalAttriBuff.harmScale + spScale);

        if(BattleDebugData.Inst().PrintHarmInfo){
            let str = "角色" + this.hero.data.hero_id + ": 基础伤害 " + this.baseAttackValue + "| 基础伤害加成 " + this.hero.LocalAttriBuff.harmValue + "| 全局加成 " + this.globalSkillAttri.GetHarmPercent()
            + "| 英雄加成 " + this.hero.LocalAttriBuff.harmScale + "| 词条加成 " + this.skillBuff.harmScale;
            console.log(str);
        }
        return Math.floor(value);
    }

    //攻击速度 隔多少秒攻击一次
    get attackSpeed(): number {
        let scale = this.globalSkillAttri.attackSpeedPercent + this.skillBuff.attackSpeed + this.hero.LocalAttriBuff.attackSpeed;
        let value = this.baseSpeedValue - this.baseSpeedValue * scale;
        return value;
    }


    // ******************** 以下可派生类自己重写 ****************
    protected Init() {
    }

    //每回合战斗开始
    OnFightStart() {
    }
    //每回合战斗结束
    OnFightEnd(){
    }
    //词条变化的时候
    OnSkillChange(){

    }

    //攻击前准备
    protected Play() {
        this.BeforeSkillData();
        this.DefaultSkillAction();
        this.BeforeSkill();
        this.DoPlay();
    }

    //正式攻击
    protected DoPlay() {
        this.hero.PlayAnimation(HeroAnimationType.Attack);
    }

    //默认的攻击方式
    protected DefaultSkillAction() {
    }

    // 怪物进入攻击范围
    protected OnMonsterEnter(monster: MonsterObj) {
    }
    // 怪物离开攻击范围
    protected OnMonsterLeave() {
    }

    // skillfun击中事件
    OnHitEvent(event: SkillColliderEvent) {
        this.AfterSkill(event);
    }

    //行为销毁事件
    onDisable() {
    }

    /**
     * 计算攻击伤害
     * @param monster 怪物 
     * @param addPer 伤害加成比 基础伤害 * addPer      例如：加20%伤害
     * @param damScale 最终伤害比 最后伤害 * damScale  例如：暴击伤害两倍
     */
    CalculateAttackValue(addPer:number = 0, damScale:number = 1): number {
        let value = this.attackValue + (this.baseAttackValue * addPer);
        value *= damScale;
        return value;
    }

    GetTotalAttackValue(monster: MonsterObj){
        return this.CalculateAttackValue();
    }

    //计算攻速
    GetTotalAttackSpeed(): number {
        return this.attackSpeed;
    }

    //英雄休息中
    protected IsHeroRest(dt: number) {
        return false
    }

    //英雄暂停次数
    public addPauseNum(v: boolean) {
        this.pause_num += v ? 1 : -1;
        this.pause_num < 0 ?? (this.pause_num = 0);
    }
}


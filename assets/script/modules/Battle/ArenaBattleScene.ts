import { _decorator, Color, Component, instantiate, math, Node, Prefab, Sprite, UITransform, Vec3 } from 'cc';
import { BattleSceneModel, CreateHeroQueueInfo, IBattleScene } from './BattleScene';
import { BattleData, BattleInfo, BattleRoundReport } from './BattleData';
import { BattleDynamic, BattleTweenerType } from './BattleDynamic';
import { HeroObj } from './Object/HeroObj';
import { MonsterObj } from './Object/MonsterObj';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { SmallObjPool } from 'core/SmallObjPool';
import { IQueuePlayFuncItem, QueuePlayFunc } from './Function/QueueFunc';
import { CfgSceneData, CfgSceneRound } from 'config/CfgScene';
import { ArenaSceneBG } from './ArenaSceneBG';
import { EventCtrl } from 'modules/common/EventCtrl';
import { ARENA_CELL_OFFSET_POS, ARENA_MAP_COL, ARENA_MAP_ROW, BattleEventType, BattleObjTag, BattleState, CELL_WIDTH, FIGHT_SCALE, HeroAnimationType, HeroObjBuffType, IMonsterObjBuffData, IS_BATTLE_TWEENER_AUTO, MAX_MAP_ROW, MonsterCreateInfo, MonsterType, SceneIsNoRelive } from './BattleConfig';
import { ResManager } from 'manager/ResManager';
import { LogError, LogWxError } from 'core/Debugger';
import { BattleHelper, BattleSceneLayerType } from './BattleHelper';
import { CfgMonsterSkillData } from 'config/CfgMonster';
import { CfgMonsterCtrl } from 'config/CfgMonsterCtrl';
import { DEBUG } from 'cc/env';
import { MathHelper } from '../../helpers/MathHelper';
import * as fgui from "fairygui-cc";
import { ISceneEffectConfig, SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { ViewManager } from 'manager/ViewManager';
import { BattleStartFightTip } from './View/BattleStartFightTip';
import { ObjectPool } from 'core/ObjectPool';
import { BattleDebugData } from './BattleDebugCfg';
import { BattleView } from './BattleView';
import { BattleCtrl } from './BattleCtrl';
import { BattleReliveView } from './View/BattleReliveView';
import { UtilHelper } from '../../helpers/UtilHelper';
import { ArenaData } from 'modules/Arena/ArenaData';
import { BattleSkinShow, BattleSkinShowParam } from './View/BattleSkinShow';
const { ccclass, property } = _decorator;

@ccclass('ArenaBattleScene')
export class ArenaBattleScene extends Component implements IBattleScene {
    @property(Node)
    Root: Node;
    @property(Node)
    BGRoot: Node;
    @property(Node)
    HeroRoot: Node;
    @property(Node)
    MonsterRoot: Node;
    @property(Node)
    TopRoot: Node;
    @property(Node)
    BottomEffectRoot: Node;
    @property(Node)
    BottomSkillRoot: Node;
    @property(Node)
    TopSkillRoot: Node;
    @property(Node)
    HeroSource: Node;
    @property(Node)
    MonsterSource: Node;
    @property(Node)
    CloudSource: Node;
    @property(UITransform)
    FightMask: UITransform;
    @property(UITransform)
    RootMask: UITransform;

    tag: BattleObjTag;


    private _isCanCtrl: boolean = false;
    get isCanCtrl() {
        return this._isCanCtrl;
    }

    private _isloaded: boolean = false;
    get isLoaded(): boolean {
        return this._isloaded;
    }



    get playerBattleInfo():BattleInfo{
        return BattleData.Inst().battleInfo;
    }

    dynamic: BattleDynamic;  //// 管理战斗中动态的对象
    battleBG: ArenaSceneBG;
    battleInfo: BattleInfo;
    data: CfgSceneData;
    dataModel: BattleSceneModel;

    private heroPool: SmallObjPool<Node>;
    heros: HeroObj[][] = [];      //先列后行
    heros2: HeroObj[][] = [];     //先列后行

    private roundActionQueue: QueuePlayFunc;   //回合事件播放器
    private monsterQueueMap: Map<number, QueuePlayFunc>;
    private monsterQueueEffectMap: Map<number, Node | null>;
    private createHeroActionQueue: QueuePlayFunc;

    passTime = 0;


    protected onLoad(): void {
        this.dynamic = this.addComponent(BattleDynamic);
        this.dynamic.quickDownloadFalg = false;
        AudioManager.Inst().PlayBg(AudioTag.ZhanDouAudio);

        this.heroPool = new SmallObjPool<Node>(this.HeroSource);

        this.roundActionQueue = new QueuePlayFunc();
        this.roundActionQueue.OnPlay(this.PlayRoundAction.bind(this));
        this.monsterQueueMap = new Map();
        this.monsterQueueEffectMap = new Map();

        this.createHeroActionQueue = new QueuePlayFunc();
        this.createHeroActionQueue.OnPlay(this.PlayCreateHeroAction.bind(this));
        this.passTime = 0;
    }

    update(dt: number) {
        if(this.battleInfo == null || !this.report){
            return;
        }

        if (!this.playerBattleInfo.isPause) {
            if (this.playerBattleInfo.globalTimeScale != 1) {
                dt *= this.playerBattleInfo.globalTimeScale;
                this.passTime += dt;
            }
            if (this.battleInfo.GetBattleState() == BattleState.Figth && BattleData.Inst().robotBattleInfo.GetBattleState() == BattleState.Figth) {
                this.roundActionQueue.Update(dt);
                this.monsterQueueMap.forEach(v => {
                    v.Update(dt);
                })

                this.report.totalTime += dt;
            } else {
                this.createHeroActionQueue.Update(dt);
            }
        }
    }

    //导入数据
    SetData(data:CfgSceneData){
        this.data = data;
        this.dataModel = new BattleSceneModel(data);
        this.dynamic.tag = this.tag;
        this.battleInfo = BattleData.Inst().GetBattleInfo(this.tag);
        BattleData.Inst().ResetBattleInfo(this.tag);
        
        EventCtrl.Inst().emit(BattleEventType.SceneLoaded);

        this.PlayStage();
    }

    LoadBG(call?:Function){
        let skinSeq:number;
        if(this.tag == BattleObjTag.Player){
            skinSeq = ArenaData.Inst().skinSeq;
        }else{
            skinSeq = ArenaData.Inst().matchInfo.skinSeq;
        }
        let skinCfg = ArenaData.Inst().GetSkinCfg(skinSeq);

        let bgData = BattleData.Inst().GetSceneArenaBGCfg(skinCfg.stage_res_id);
        if (this.battleBG == null) {
            let bg_path = "battle/ArenaSceneBG";
            ResManager.Inst().Load<Prefab>(bg_path, (error, bgPrefab) => {
                if (error != null) {
                    LogWxError("战斗场景背景BG加载失败", error);
                    return
                }
                let bg = instantiate(bgPrefab);
                BattleHelper.SetParent(bg, BattleSceneLayerType.BGRoot, this)
                bg.setPosition(0, 0);
                this.battleBG = bg.getComponent(ArenaSceneBG);
                this.battleBG.SetData(bgData);
                this.battleBG.LoadIcon(call);
            });
        }else{
            this.battleBG.SetData(bgData);
            this.battleBG.LoadIcon(call);
        }
    }

    //播放当前阶段
    PlayStage() {
        if (this.dataModel.IsEnd()) {
            return
        }
        this.battleInfo.SetSceneRoundIndex(0);
        this.LoadBG(()=>{
            this._isloaded = true;
            this.battleBG.SetInitMap();
            this.scheduleOnce(()=>{
                this.LayoutScene();
            },0.5)
        });
    }

    //布局场景
    LayoutScene(){
        this.PlayRound();
        this.MendMapCell(()=>{
            this.battleInfo.isLoaded = true;
            if(!ViewManager.Inst().IsOpen(BattleSkinShow) && BattleData.Inst().battleInfo.isLoaded && BattleData.Inst().robotBattleInfo.isLoaded){
                ViewManager.Inst().OpenView(BattleSkinShow, new BattleSkinShowParam(ArenaData.Inst().skinSeq, ArenaData.Inst().matchInfo.skinSeq));
            }
        });
    }

    StartFight(){
        this.StartFightAnimation(()=>{
            this.SanXiaoEndEvent();
        });
    }

    //播放当前回合
    PlayRound() {
        if (this.dataModel.IsEnd()) {
            return
        }
        EventCtrl.Inst().emit(BattleEventType.RoundChange, this.battleInfo.roundProgerss);
        let roundCfg = this.dataModel.curRoundGroup;

        let queuedata = BattleData.Inst().GetRoundQueueData(roundCfg);
        this.roundActionQueue.Reset(queuedata);
        let report = new BattleRoundReport();
        this.battleInfo.AddReport(report);
        this.ShowFightMask(false);

        this.battleInfo.SetBattleState(BattleState.SanXiao);
        
    }

    //三消结束事件
    SanXiaoEndEvent() {
        let state = BattleState.Figth;
        this.battleInfo.SetBattleState(state);
        

        //记录战报
        let report = this.report;
        if(report){
            let row = ARENA_MAP_ROW;
            let maxNum = ARENA_MAP_COL * row;
            for (let i = 0; i < maxNum; i++) {
                let ij = BattleHelper.NumToIJ(i, ARENA_MAP_COL);
                let hero = this.GetHero(ij.y, ij.x);
                if (hero) {
                    let info = hero.GetHeroSCInfo();
                    hero.reportIndex = report.heroList.length;
                    report.heroList.push(info);
                    if (hero.heroCtrl) {
                        hero.heroCtrl.OnFightStart();
                    }
                } else {
                    report.heroList.push({ heroId: 0, heroLevel: 0, heroStage: 0 });
                }
            }
        }
    }

    //回合事件播放
    PlayRoundAction(data: IQueuePlayFuncItem | CfgMonsterSkillData, showEffect = true, p_pos: Vec3 = undefined, defautBuff?: IMonsterObjBuffData[]) {
        let ctrl: number;
        let monster_id: number;
        let out_speed: number;
        let round_id: number;
        let monster_exp: number;
        let monster_num: number;
        if ((data as CfgSceneRound).round_id) {
            let cfg = <CfgSceneRound>data;
            ctrl = cfg.ctrl_type;
            monster_id = cfg.monster_id;
            out_speed = cfg.out_speed;
            round_id = cfg.round_id;
            monster_exp = cfg.monster_exp;
            monster_num = cfg.monster_num;
        } else {
            let cfg = <CfgMonsterSkillData>data;
            ctrl = cfg.parm4;
            monster_id = cfg.parm2;
            out_speed = cfg.parm6;
            round_id = 0;
            monster_exp = cfg.parm5;
            monster_num = cfg.parm3;
        }


        let monsterCfg = BattleData.Inst().GetSceneMonsterCfg(monster_id);
        let cfg_ctrl = CfgMonsterCtrl.ctrl_list[ctrl - 1];
        if (!cfg_ctrl) {
            if (DEBUG) {
                window.confirm("行为" + ctrl + "竞技场关卡表怪物出生点出错 章：" + this.battleInfo.sceneId + " 关卡：" + this.battleInfo.roundProgerss);
            }
            ctrl = 1;
            cfg_ctrl = CfgMonsterCtrl.ctrl_list[ctrl - 1];
        }
        let bomPointArr = cfg_ctrl.spwan;
        let bomMonsterLimit: number;
        let bomMonsterRandomLimit: number; //开始随机位置的值
        let bomPointTemp: number[][];


        let hero_point: number[][]; //有英雄的列
        // if (round_id <= 3 && round_id >= 0) {
        //     hero_point = [];
        //     let map_bomPoint: { [key: string]: boolean };
        //     BattleHelper.ForeachHeros(this.heros, (v: HeroObj, row: number, col: number) => {
        //         if (v.data.stage > 0) {
        //             if (!map_bomPoint) {
        //                 map_bomPoint = {};
        //             }
        //             if (!map_bomPoint[col]) {
        //                 hero_point.push([col, row])
        //                 map_bomPoint[col] = true;
        //             }
        //         }
        //     })
        //     if (map_bomPoint) {
        //         bomPointArr = [];
        //         cfg_ctrl.spwan.forEach(point => {
        //             let col = point[0];
        //             let row = point[1];
        //             if (col < 0 || map_bomPoint[col] || col >= ARENA_MAP_COL) {
        //                 bomPointArr.push(point)
        //             }
        //         });
        //     }
        // }

        let func = (index: number) => {
            let cfg_ctrl = CfgMonsterCtrl.ctrl_list[ctrl - 1];
            let bomPoint: number[]; //选中的出生点
            let queueIndex = index;
            let pos: Vec3;
            if (p_pos) {
                pos = p_pos;
            } else {
                if (bomMonsterLimit >= 1) {
                    bomPoint = bomPointArr[queueIndex];
                }
                if (!bomPoint) {
                    if (index >= bomMonsterRandomLimit || bomMonsterRandomLimit == 0) {
                        let slic_queueIndex;;
                        if (!bomPointTemp || !bomPointTemp.length) {
                            bomPointTemp = bomPointArr.concat();
                        }
                        queueIndex = MathHelper.GetRandomNum(0, bomPointTemp.length - 1);
                        slic_queueIndex = queueIndex;
                        bomPoint = bomPointTemp[queueIndex];
                        bomPointTemp.splice(slic_queueIndex, 1);
                    } else {
                        queueIndex = index % bomPointArr.length
                        bomPoint = bomPointArr[queueIndex];
                    }
                }
                if (!bomPoint) {
                    return
                }
                pos = this.battleBG.GetTopMonsterPos(bomPoint[0], bomPoint[1]);
            }
            let queue = this.GetMonsterQueueByIJ(MAX_MAP_ROW, queueIndex);
            let createInfo = ObjectPool.Get(MonsterCreateInfo, out_speed, monster_id, monster_exp, pos, MAX_MAP_ROW, queueIndex, cfg_ctrl)
            if (hero_point && hero_point.length) {
                createInfo.hero_point = hero_point;
            }
            createInfo.defautBuff = defautBuff;
            createInfo.showEffect = showEffect;
            queue.PushData(createInfo);
        }


        if (monsterCfg.monster_type == MonsterType.Boss) {
            let bossIndex = 1;
            func(bossIndex);
            return;
        }
        bomMonsterLimit = Math.floor(monster_num / bomPointArr.length);
        bomMonsterRandomLimit = bomMonsterLimit * monster_num;
        for (let i = 0; i < monster_num; i++) {
            func(i);
        }
    }

    //通过ij获取怪物播放队列
    GetMonsterQueueByIJ(i: number, j: number): QueuePlayFunc {
        let key = BattleHelper.IJTonum2(i,j, ARENA_MAP_COL);
        if (!this.monsterQueueMap.has(key)) {
            let func = new QueuePlayFunc();
            func.OnPlay(this.PlayMonsterAction.bind(this));
            //func.OnFinish(this.PlayMonsterQueueFinish.bind(this))
            this.monsterQueueMap.set(key, func);
        }
        return this.monsterQueueMap.get(key);
    }

    //怪物播放
    private createMonsterdProgress: number = 0;
    PlayMonsterAction(data: IQueuePlayFuncItem) {
        this.createMonsterdProgress++;
        let cfg = <MonsterCreateInfo>data;
        //创建怪物
        let monster = this.dynamic.CreateMonster(cfg);
        this.createMonsterdProgress--;
        //看看是否提醒
        let is_tip = this.dataModel.IsMonsterTip(monster.data);
        if (is_tip) {
            BattleData.Inst().AddMonsterTip(monster.data);
            this.dataModel.RecordMonsterTip(monster.data);
        }
        //是否播放特效
        let keyNum = BattleHelper.IJTonum2(cfg.i, cfg.j, ARENA_MAP_COL);
        if (cfg.showEffect && !this.monsterQueueEffectMap.has(keyNum)) {
            this.monsterQueueEffectMap.set(keyNum, null);
            let sPos = cfg.pos;//this.battleBG.GetWorldPos(cfg.i, cfg.j);
            let effectPos = new Vec3(sPos.x, sPos.y + 50, 0);
            SceneEffect.Inst().Play(SceneEffectConfig.MonsterCreate, this.BottomEffectRoot, effectPos, (effect) => {
                this.monsterQueueEffectMap.set(keyNum, effect);
                // console.log("播放成功", cfg.i, cfg.j, sPos.x, sPos.y);
            }, (effect) => {
                //console.log("结束", cfg.i, cfg.j, sPos.x, sPos.y);
                this.monsterQueueEffectMap.delete(keyNum);
            });
        }
    }



    private mendMoveProgerss: number = 0;
    private mendCallback: () => void;
    //补缺空格子
    MendMapCell(mendCallback?: () => void) {
        if (mendCallback) {
            this.mendCallback = mendCallback;
        }
        let col = ARENA_MAP_COL;
        for (let j = 0; j < col; j++) {
            let count = 0;
            let row = ARENA_MAP_ROW;
            for (let i = 0; i < row; i++) {
                let obj = this.GetHero(i, j);
                if (obj == null) {
                    count++;
                }
            }
            if (count > 0) {
                this.CreateNewHero(j, count);
            }
        }

        this.createHeroActionQueue.OnFinish(() => {
            this.mendMoveProgerss = 0;
            BattleHelper.ForeachHeros(this.heros, (hero, i, j) => {
                if (hero == null) {
                    return;
                }
                let moveCount = this.GetCellMoveCount(hero);
                if (moveCount > 0) {
                    this.mendMoveProgerss++;
                    this.MoveHero(hero, moveCount);
                }
            })
            BattleHelper.ForeachHeros(this.heros2, (hero, i, j) => {
                if (hero == null) {
                    return;
                }
                let moveCount = this.GetCellMoveCount(hero);
                if (moveCount > 0) {
                    this.mendMoveProgerss++;
                    this.MoveHero(hero, moveCount);
                }
            })

            if (this.mendMoveProgerss == 0) {
                if (this.mendCallback) {
                    this.mendCallback();
                    this.mendCallback = null;
                }
            }
        })
    }

    //获取格子需要走几个位置
    private GetCellMoveCount(hero: HeroObj): number {
        let count = 0;
        let row = ARENA_MAP_ROW;
        let i = hero.i < 0 ? 0 : hero.i;
        for (i; i < row; i++) {
            if (this.GetHero(i, hero.j) == null) {
                count = count + 1
            }
        }
        return count;
    }

    //移动英雄
    MoveHero(hero: HeroObj, count: number) {
        let moveI = hero.i + count;
        let pos = this.battleBG.GetWorldPos(moveI, hero.j);
        hero.MovePos(pos, () => {
            hero.SetIJ(moveI, hero.j);
            hero.InitPos(hero.node.position.x, hero.node.position.y);
            this.heros[hero.j][moveI] = hero;
            this.mendMoveProgerss--;
            if (this.mendCallback) {
                this.mendCallback();
                this.mendCallback = null;
            }
        }, 0.6);
    }

    //播放创建角色
    PlayCreateHeroAction(param: IQueuePlayFuncItem) {
        let info = <CreateHeroQueueInfo>param;
        let i = info.i;
        let j = info.j;
        let heroInfo = ArenaData.Inst().GetBattleHeroInfo(i + 6, j, this.tag);
        let heroStage = ArenaData.Inst().GetHeroBattleStage(heroInfo);
        let data = BattleData.Inst().GetHeroBattleCfg(heroInfo.heroId, heroStage);
        let mono = this.CrateHero();
        mono.SetData(data);
        mono.SetIJ(i, j);
        mono.PlayAnimation(HeroAnimationType.Await);
        let pos = this.battleBG.GetPos(i, j);
        mono.InitPos(pos.x, pos.y);
        this.heros2[j].push(mono);
    }

    //生成新的英雄实例 col第几列，count:生成几个
    CreateNewHero(col: number, count: number) {
        if (!this.heros2[col]) {
            this.heros2[col] = [];
        }
        if (!this.heros[col]) {
            this.heros[col] = [];
        }

        let len = this.heros2[col].length;
        for (let n = 0; n < count; n++) {
            let i = -len - 1
            let time = n % 3 == 0 ? 0.001 : 0
            let info = new CreateHeroQueueInfo(i, col, time);
            this.createHeroActionQueue.PushData(info);
            len++;
        }
    }

    //创建一个英雄
    CrateHero(): HeroObj {
        let node = this.GetHeroNode();
        this.HeroRoot.addChild(node);
        let mono = node.getComponent(HeroObj);
        mono.tag = this.tag;
        return mono;
    }

    GetHeroNode(): Node {
        return this.heroPool.Get();
    }
    PutHeroNode(obj: HeroObj) {
        obj.Delete();
        this.heroPool.Put(obj.node);
    }

    // 拉镜头
    StartFightAnimation(func?: Function) {
        //console.error("拉镜头");
        this.ShowFightMask(true);
        let root = this.Root;
        let tweener = fgui.GTween.to2(1, 1, FIGHT_SCALE, FIGHT_SCALE, 1.2);
        this.dynamic.AddTweenr(BattleTweenerType.Other, tweener);
        let easeType = fgui.EaseType.SineInOut; //fgui.EaseType.SineOut
        tweener.setEase(easeType)
        tweener.onUpdate((tweener: fgui.GTweener) => {
            root.setScale(tweener.value.x, tweener.value.y);
        })
        tweener.onComplete(() => {
            this.dynamic.RemoveTweenr(BattleTweenerType.Other, tweener);
            AudioManager.Inst().PlaySceneAudio(AudioTag.guaiwulaixi);
            SceneEffect.Inst().Play(SceneEffectConfig.JinRuZhanDou, BattleCtrl.Inst().battleScenePlatform, this.node.worldPosition, null, () => {
                if (func) {
                    func();
                }
            });
        })

        let mask_sprite = this.FightMask.getComponent(Sprite);
        mask_sprite.color = new Color(255, 255, 255, 0);
        let colorTweener = fgui.GTween.to(0, 255, 1.2);
        colorTweener.setEase(easeType);
        colorTweener.onUpdate((_tweener: fgui.GTweener) => {
            mask_sprite.color = new Color(255, 255, 255, _tweener.value.x);
        })
        colorTweener.onComplete(() => {
            this.dynamic.RemoveTweenr(BattleTweenerType.Other, colorTweener);
        })
        this.dynamic.AddTweenr(BattleTweenerType.Other, colorTweener);

        let moveTweener = fgui.GTween.to(0, -65, 1.2);
        moveTweener.setEase(easeType);
        moveTweener.onUpdate((_tweener: fgui.GTweener) => {
            root.setPosition(0, _tweener.value.x);
        })
        moveTweener.onComplete(() => {
            this.dynamic.RemoveTweenr(BattleTweenerType.Other, moveTweener);
        })
        this.dynamic.AddTweenr(BattleTweenerType.Other, moveTweener);

        if(this.tag == BattleObjTag.Player){
            ViewManager.Inst().OpenView(BattleStartFightTip);
        }
    }

    //显示遮罩
    ShowFightMask(isShow: boolean) {
        this.FightMask.node.active = isShow;
        if (!isShow) {
            return;
        }
        this.FightMask.node.setSiblingIndex(this.FightMask.node.parent.children.length - 1);
        let h = CELL_WIDTH * ARENA_MAP_ROW;
        this.FightMask.height = h;
        //let pos = this.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(CELL_OFFSET_POS.x, CELL_OFFSET_POS.y,0));
        let pos = new Vec3(ARENA_CELL_OFFSET_POS.x - CELL_WIDTH / 2, ARENA_CELL_OFFSET_POS.y - CELL_WIDTH / 2, 0)
        this.FightMask.node.setPosition(pos);
    }

    //回合是否结束了
    IsRoundEnd(): boolean {
        if (this.createMonsterdProgress != 0) {
            return false;
        }

        if (this.dynamic.monsters.size > 0) {
            //console.log("还有怪物",this.dynamic.monsters.size);
            return false;
        }
        if (!this.roundActionQueue.IsFinish()) {
            //console.log("还有回合");
            return false;
        }
        for (var queue of this.monsterQueueMap.values()) {
            if (!queue.IsFinish()) {
                //console.log("还有怪物没有播完");
                return false;
            }
        }
        return true;
    }


    /////////////////////////////////// 下面是接口方法 //////////
    get report(): BattleRoundReport {
        return this.battleInfo.GetCurReport();
    }
    Delete() {
        BattleHelper.ForeachHeros(this.heros, (hero, i, j) => {
            if (hero) {
                hero.Delete();
            }
        })

        this.heroPool.Clear();
        this.dynamic.Delete();

        this.heroPool = null;
        this.dynamic = null;
    }
    //被攻击
    BeAttacked(monster: MonsterObj) {
        if (!BattleDebugData.BATTLE_DEBUG_MODE || !BattleDebugData.Inst().GodCastle) {
            this.battleInfo.AddHP(-monster.attackHarm);
        }
        EventCtrl.Inst().emit(BattleEventType.BeAttack, this.tag);
        EventCtrl.Inst().emit(BattleEventType.MonsterDie, monster);
        EventCtrl.Inst().emit(BattleEventType.MonsterDieByWall, monster);
        this.dynamic.RemoveMonster(monster);
        this.report.monsterList.push(monster.report);
        //游戏状态检查
        this.CheckGameState();
    }
    GetHero(i: number, j: number):HeroObj{
        if (j >= this.heros.length || j < 0) {
            return null;
        }
        if (i < 0) {
            return null;
        }
        return this.heros[j][i];
    }
    //获取周围round队友
    GetRoundHeros(hero: HeroObj, round: number): HeroObj[] {
        let list: HeroObj[] = [];
        for (let i = -round; i <= round; i++) {
            for (let j = -round; j <= round; j++) {
                let t_hero = this.GetHero(hero.i + i, hero.j + j);
                if (t_hero != null && t_hero != hero && !t_hero.IsItem() && t_hero.data.stage > 0) {
                    list.push(t_hero);
                }
            }
        }
        return list;
    }
    //怪物死亡
    MonsterDie(monster: MonsterObj) {
        EventCtrl.Inst().emit(BattleEventType.MonsterDie, monster);
        //let exp = monster.exp * this.battleInfo.skillAttri.monsterExpPercent;
        //this.battleInfo.AddExp(exp);
        this.dynamic.RemoveMonster(monster);
        if (monster.data.monster_type == MonsterType.Boss && this.dataModel.curStage.IsFull()) {
            this.report.monsterList.push(monster.report);
        }
        this.battleInfo.killCount++;
        //游戏状态检查
        this.CheckGameState();
    }
    //失败镜头
    FailFightAnimation(func?: Function) {
        EventCtrl.Inst().emit(BattleEventType.GameOver, false);
        ViewManager.Inst().ShowView(BattleView, false);
        EventCtrl.Inst().emit(BattleEventType.Pause, true);
        AudioManager.Inst().Play(AudioTag.ChengBaoBaoZha);
        let effectPos = this.battleBG.BottomImg.node.worldPosition;
        effectPos = new Vec3(effectPos.x, effectPos.y - 100, 0);
        SceneEffect.Inst().Play(SceneEffectConfig.FailEffect, this.node, effectPos, () => {
            this.battleBG.SetFailImg();
        });
        this.dynamic.LoadEffect(SceneEffectConfig.FailEffect2.path, this.node, effectPos);
        this.dynamic.LoadEffect("effect/ui/" + this.battleBG.data.defeat_id, this.node, effectPos);

        this.scheduleOnce(() => {
            if(this.tag == BattleObjTag.Player){
                this.battleInfo.SetBattleState(BattleState.Fail);
            }else{
                this.playerBattleInfo.SetBattleState(BattleState.Win);
            }
            BattleCtrl.Inst().FightEnd(this.playerBattleInfo.sceneType);
        }, 2);
        if (func) {
            func();
        }
    }
    //闪烁所有的英雄
    SanSuoHero(hero_id: number) {
        BattleHelper.ForeachHeros(this.heros, hero => {
            if (hero != null && hero.data.stage > 0 && hero.data.hero_id == hero_id) {
                hero.ShowUpAttri();
            }
        })
    }
    //游戏状态检查
    CheckGameState() {
        if (ViewManager.Inst().IsOpened(BattleReliveView)) {
            return;
        }
        let hp = this.battleInfo.GetHP();
        //失败检查
        if (hp <= 0) {
            console.log("失败了？？？？", this.tag, hp);
            this.battleInfo.isSaveSkill = false;
            this.FailFightAnimation();
            return;
        }
        let isRoundEnd = this.IsRoundEnd();
        if (!isRoundEnd) {
            return;
        }
        this.battleInfo.AddSceneRoundIndex(1);
        this.playerBattleInfo.isPause = true;
        this.dynamic.StopAllSkill();


        BattleHelper.ForeachHeros(this.heros, (hero) => {
            if (hero) {
                if (hero.heroCtrl) {
                    hero.heroCtrl.OnFightEnd();
                }
                //清空角色buff
                hero.ClearBuff();
            }
        })

        //阶段结束检查
        let isStageEnd = this.dataModel.curStage.IsEnd();
        if (isStageEnd) {
            EventCtrl.Inst().emit(BattleEventType.Pause, true);
            this.battleInfo.AddSceneStageIndex(1);
            let effectPos = BattleCtrl.Inst().battleScenePlatform.worldPosition;
            AudioManager.Inst().Play(AudioTag.HeroChange);
            //播下一阶段
            SceneEffect.Inst().Play(SceneEffectConfig.PassStage, BattleCtrl.Inst().battleScenePlatform, effectPos, null, () => {
                //胜利检查
                let isSceneEnd = this.dataModel.IsEnd();
                if (isSceneEnd) {
                    if(this.tag == BattleObjTag.Player){
                        this.battleInfo.SetBattleState(BattleState.Win);
                    }else{
                        this.playerBattleInfo.SetBattleState(BattleState.Fail);
                    }

                    EventCtrl.Inst().emit(BattleEventType.GameOver, true);
                    BattleCtrl.Inst().FightEnd(this.playerBattleInfo.sceneType);
                    return;
                }
            })
            return;
        }else{
            LogError("竞技场回合错误，应该只有一回合")
        }
    }
    Resurgence: (hp?: number) => any;
    //获取场景中阶数最大的一个英雄
    GetMaxStageHero(heroId: number): HeroObj {
        let re: HeroObj = null;
        this.heros.forEach((hl) => {
            hl.forEach((h) => {
                if (!h || !h.data || h.data.hero_id != heroId) {
                    return;
                }
                if (!re || h.data.stage > re.data.stage) {
                    re = h;
                }
            })
        })
        return re;
    }
    //获取当前英雄数量 level[-1:所有阶段,-2:除掉阶段0的英雄]
    GetHeroCount(heroid: number, level: number): number {
        let count = 0;
        BattleHelper.ForeachHeros(this.heros, (hero, i, j) => {
            if (hero && hero.data.hero_id == heroid) {
                if (hero.data.stage == level || level == -1 || (level == -2 && hero.data.stage > 0)) {
                    count++;
                }
            }
        })
        return count;
    }
    /**获取随机英雄 noItem:是否筛选能升级的 */
    GetRandomHero(obj?: HeroObj, noItem?:boolean, limitLevel?:number): (HeroObj | undefined) {
        let hero;
        let heroList:HeroObj[] = [];
        BattleHelper.ForeachHeros(this.heros, (hero,i,j)=>{
            if(hero){
                heroList.push(hero);
            }
        })
        do {
            if (heroList.length == 0) {
                return undefined;
            }
            let index = MathHelper.GetRandomNum(0, heroList.length - 1);
            hero = heroList[index];
            if(hero){
                if (hero.HasBuff(HeroObjBuffType.WaitDie)) {
                    hero = undefined;
                }else if(noItem == true && hero.IsItem()){
                    hero = undefined;
                }else if(limitLevel != null && hero.stage < limitLevel){
                    hero = undefined;
                }
            }
            UtilHelper.ArrayRemove(heroList, hero);
        } while (!hero || (obj && (obj == hero)))
        return hero;
    }
    //获取场景最上层位置
    GetTopPos():Vec3{
        let pos = this.battleBG.TopImg.node.getWorldPosition();
        return pos;
    }
    //家的位置
    GetHomePos():Vec3{
        let pos = this.battleBG.Home.getWorldPosition();
        return pos;
    }

}



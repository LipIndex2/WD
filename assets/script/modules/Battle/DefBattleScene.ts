import { _decorator, Component, Node, UITransform, Prefab, instantiate, Sprite, Vec3, Vec2 } from 'cc';
import { CfgMonsterData, CfgMonsterSkillData } from 'config/CfgMonster';
import { CfgSceneBlockPosDef, CfgSceneDefData, CfgSceneRoundDef, CfgSceneRoute, CfgSceneStageDef } from 'config/CfgSceneDef';
import { LogError, LogWxError } from 'core/Debugger';
import { SmallObjPool } from 'core/SmallObjPool';
import { ResManager } from 'manager/ResManager';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { DataHelper } from '../../helpers/DataHelper';
import { BattleEventType, BattleObjTag, BattleState, DEFAULT_HP, DEF_CELL_WIDTH, DEF_MAP_COL, HeroObjBuffType, IMonsterObjBuffData, IS_BATTLE_TWEENER_AUTO, MAX_MAP_ROW, MonsterCreateInfo, MonsterType, SceneIsNoRelive, SceneType } from './BattleConfig';
import { BattleData, BattleHeroAttriBuff, BattleInfo, BattleInfoSave, BattleRoundReport, IBattleHeroInfo } from './BattleData';
import { BattleDynamic } from './BattleDynamic';
import { BattleHelper, BattleSceneLayerType } from './BattleHelper';
import { IBattleScene } from './BattleScene';
import { DefSceneBG } from './DefSceneBG';
import { MainSceneBG } from './MainSceneBG';
import { DefBlockObj, DefBlockType } from './Object/DefBlockObj';
import * as fgui from "fairygui-cc";
import { HeroObj } from './Object/HeroObj';
import { HeroData } from 'modules/hero/HeroData';
import { ViewManager } from 'manager/ViewManager';
import { BattleDefView } from './View/BattleDefView';
import { IQueuePlayFuncItem, QueuePlayFunc } from './Function/QueueFunc';
import { EventCtrl } from 'modules/common/EventCtrl';
import { CfgSceneRound } from 'config/CfgScene';
import { CfgCtrlList, CfgMonsterCtrl } from 'config/CfgMonsterCtrl';
import { DEBUG } from 'cc/env';
import { MathHelper } from '../../helpers/MathHelper';
import { ISceneEffectConfig, SceneEffect, SceneEffectConfig } from 'modules/scene_obj_spine/Effect/SceneEffect';
import { ObjectPool } from 'core/ObjectPool';
import { MapIJ } from 'modules/common/CommonType';
import { MonsterObj } from './Object/MonsterObj';
import { BattleCtrl } from './BattleCtrl';
import { BattleReliveView } from './View/BattleReliveView';
import { BattleFinishView } from './BattleFinishView';
import { CfgHeroBattle } from 'config/CfgHero';
import { SevenDayHeroData } from 'modules/seven_day_hero/SevenDayHeroData';
import { CfgSupplyCardData } from 'config/CfgSupplyCard';
import { RoleData } from 'modules/role/RoleData';
import { BattleDefGuideView } from './View/BattleDefGuideView';
import { UtilHelper } from '../../helpers/UtilHelper';
import { NodePools } from 'core/NodePools';
const { ccclass, property } = _decorator;

@ccclass('DefBattleScene')
export class DefBattleScene extends Component implements IBattleScene {
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


    @property(Node)
    BlockSource: Node;
    @property(Node)
    BlockFrame: Node;

    tag: BattleObjTag = BattleObjTag.Player;


    private _isCanCtrl: boolean = true;
    get isCanCtrl() {
        if (BattleData.Inst().battleInfo.GetBattleState() != BattleState.SanXiao) {
            return false
        }
        return this._isCanCtrl;
    }

    private _isloaded: boolean = false;
    get isLoaded(): boolean {
        return this._isloaded;
    }

    get report(): BattleRoundReport {
        //return this.battleInfo.GetCurReport();
        return null;
    }

    // 英雄上阵数量
    get heroBattleCount(): number {
        return this.heroMap.size;
    }

    dynamic: BattleDynamic;  //// 管理战斗中动态的对象
    battleBG: DefSceneBG;
    battleInfo: BattleInfo;
    data: CfgSceneDefData;
    dataModel: BattleSceneModelDef;


    private blockPool: SmallObjPool<Node>;
    private blockMap: Map<number, DefBlockObj>;
    private blockFramePool: SmallObjPool<Node>;

    private heroPool: SmallObjPool<Node>;
    heroMap: Map<number, HeroObj>;

    private roundActionQueue: QueuePlayFunc;   //回合事件播放器
    private monsterQueueMap: Map<number, QueuePlayFunc>;
    private monsterQueueEffectMap: Map<number, Node | null>;
    private routeMap: Map<number, BattleRouteModelDef>;

    private curRoundBeAttack: number = 0;       //当前回合被攻击多少次

    protected onLoad(): void {
        this.dynamic = this.addComponent(BattleDynamic);
        this.dynamic.quickDownloadFalg = false;
        AudioManager.Inst().PlayBg(AudioTag.ZhanDouAudio);

        this.blockPool = new SmallObjPool<Node>(this.BlockSource);
        this.blockFramePool = new SmallObjPool<Node>(this.BlockFrame);
        this.blockMap = new Map<number, DefBlockObj>();

        this.heroPool = new SmallObjPool<Node>(this.HeroSource);
        this.heroMap = new Map<number, HeroObj>();

        this.roundActionQueue = new QueuePlayFunc();
        this.roundActionQueue.OnPlay(this.PlayRoundAction.bind(this));
        this.monsterQueueMap = new Map();
        this.monsterQueueEffectMap = new Map();
        this.routeMap = new Map<number, BattleRouteModelDef>();

        let guide = RoleData.Inst().IsBattleDefGuide();
        if (guide) {
            BattleData.Inst().SetGuide(true);
        }
    }

    update(dt: number) {
        if (!BattleData.Inst().battleInfo.isPause && this.heroMap.size > 0) {
            if (BattleData.Inst().battleInfo.GetBattleState() == BattleState.Figth) {
                if (this.battleInfo.globalTimeScale != 1) {
                    dt *= this.battleInfo.globalTimeScale;
                }
                this.roundActionQueue.Update(dt);
                this.monsterQueueMap.forEach(v => {
                    v.Update(dt);
                })
            }
        }
    }

    Delete() {
        if (this.blockPool) {
            this.blockPool.Clear();
            this.blockPool = null;
        }
        this.ClearBossTip();
    }


    //导入数据
    SetData(data: CfgSceneDefData, saveData?: BattleInfoSave) {
        BattleData.Inst().isUseSave = saveData != null;
        this.data = data;
        BattleData.Inst().ResetBattleInfo();
        this.battleInfo = BattleData.Inst().battleInfo;
        this.dataModel = new BattleSceneModelDef(data);

        if (saveData) {
            BattleInfo.ConvertObj(this.battleInfo, saveData);
            console.log("SAVE_DATA", saveData.battleState);
        }

        EventCtrl.Inst().emit(BattleEventType.SceneLoaded);

        this.PlayStage();
    }

    LoadBG(call?: Function) {
        let bgData = BattleData.Inst().GetSceneBGCfg(1);
        if (this.battleBG == null) {
            let bg_path = "battle/DefSceneBattleBG";
            ResManager.Inst().Load<Prefab>(bg_path, (error, bgPrefab) => {
                if (error != null) {
                    LogWxError("战斗场景背景BG加载失败", error);
                    return
                }
                let bg = instantiate(bgPrefab);
                BattleHelper.SetParent(bg, BattleSceneLayerType.BGRoot, this)
                bg.setPosition(0, 0);
                this.battleBG = bg.getComponent(DefSceneBG);
                this.battleBG.SetData(bgData);
                this.battleBG.LoadIcon(call);
            });
        } else {
            this.battleBG.SetData(bgData);
            this.battleBG.LoadIcon(call);
        }
    }

    ReadyRound() {
        //有存档的英雄
        if (this.battleInfo.heroInfoMap.size > 0) {
            this.battleInfo.heroInfoMap.forEach((herodata, posIndex) => {
                this.CrateHero(posIndex, herodata);
            })
            this.battleInfo.heroInfoMap.clear();
            this.SetRoundData();
            this.scheduleOnce(() => {
                this.OnStartGame();
            })
        } else {
            this.PlayRound();
        }

        //存档
        BattleCtrl.Inst().SaveBattleDef();
    }

    //播放当前阶段
    PlayStage() {
        //BattleData.Inst().battleInfo.SetSceneRoundIndex(0);
        //let index = this.battleInfo.roundIndex;
        //console.log("::::::::::::", index);
        this.LoadBG(() => {
            this._isloaded = true;
            this.ShowBlock();
            this.ReadyRound();
        });
    }

    SetRoundData() {
        let roundCfg = this.dataModel.curRoundGroup;
        let queuedata = BattleData.Inst().GetRoundQueueData(roundCfg);
        this.roundActionQueue.Reset(queuedata);
    }

    //播放当前回合
    PlayRound() {
        if (this.dataModel.IsEnd()) {
            return
        }
        this.ClearBossTip();
        EventCtrl.Inst().emit(BattleEventType.RoundChange, this.battleInfo.roundProgerss);
        this.SetRoundData();
        BattleData.Inst().battleInfo.isPause = false;
        BattleData.Inst().battleInfo.SetBattleState(BattleState.SanXiao);
        this.curRoundBeAttack = 0;

        this.ReadyStageFull();
    }

    // 准备这阶段的最后一波
    ReadyStageFull() {
        //最后一回合显示boss
        let isShow: boolean = true;
        // if (this.dataModel.curStage.IsFull()) {
        //     isShow = true;
        // }

        if (isShow) {
            let roundCfg = this.dataModel.curRoundGroup;
            roundCfg.forEach(cfg_round => {
                let monsterCfg = BattleData.Inst().GetSceneMonsterCfg(cfg_round.monster_id);
                if (monsterCfg.monster_type == MonsterType.Boss) {
                    let route = this.GetMonsterRoute(cfg_round.route_id);
                    let i = route.StartIJ().i;
                    let j = route.StartIJ().j;
                    let pos = BattleHelper.GetDefWorldPos(i, j);
                    this.PlayBossTip(pos);
                }
            });
        }
    }

    //回合事件播放
    PlayRoundAction(data: IQueuePlayFuncItem) {
        let cfg = <CfgSceneRoundDef>data;
        let route = this.GetMonsterRoute(cfg.route_id);
        let monster_num = cfg.monster_num;
        let i = route.StartIJ().i;
        let j = route.StartIJ().j;
        let pos = BattleHelper.GetDefWorldPos(i, j);
        let ctrl = new CfgCtrlList();
        let queue = this.GetMonsterQueueByIJ(i, j);
        ctrl.move_type = 101;
        ctrl.speed = 10000;
        for (let i = 0; i < monster_num; i++) {
            let out_speed = i == 0 ? cfg.out_speed : 0;
            let createInfo = ObjectPool.Get(MonsterCreateInfo, out_speed, cfg.monster_id, cfg.monster_exp, pos, i, j, ctrl);
            createInfo.param = route;
            queue.PushData(createInfo);
        }
    }

    //怪物播放
    private createMonsterdProgress: number = 0;
    PlayMonsterAction(data: IQueuePlayFuncItem) {
        this.createMonsterdProgress++;
        let cfg = <MonsterCreateInfo>data;
        // this.dynamic.checkCreatInfo(cfg);
        let outTime = MathHelper.GetRandomNum(300, 600);
        this.scheduleOnce(() => {
            //创建怪物
            let monster = this.dynamic.CreateMonster(cfg);
            if (monster.data.monster_type == MonsterType.Boss) {
                monster.ShowRoot.setPosition(0, -80);
            } else {
                monster.ShowRoot.setPosition(0, 0);
            }
            this.createMonsterdProgress--;
        }, outTime / 1000)
        //是否播放特效
        let keyNum = BattleHelper.IJTonum2(cfg.i, cfg.j, DEF_MAP_COL);
        if (cfg.showEffect && !this.monsterQueueEffectMap.has(keyNum)) {
            this.monsterQueueEffectMap.set(keyNum, null);
            let sPos = cfg.pos;
            let effectPos = new Vec3(sPos.x, sPos.y + 50, 0);
            SceneEffect.Inst().Play(SceneEffectConfig.MonsterCreate, this.BottomEffectRoot, effectPos, (effect) => {
                this.monsterQueueEffectMap.set(keyNum, effect);
            }, (effect) => {
                this.monsterQueueEffectMap.delete(keyNum);
            });
        }
    }

    //通过ij获取怪物播放队列
    GetMonsterQueueByIJ(i: number, j: number): QueuePlayFunc {
        let key = BattleHelper.IJTonum2(i, j, DEF_MAP_COL);
        if (!this.monsterQueueMap.has(key)) {
            let func = new QueuePlayFunc();
            func.OnPlay(this.PlayMonsterAction.bind(this));
            this.monsterQueueMap.set(key, func);
        }
        return this.monsterQueueMap.get(key);
    }

    //获取路径
    GetMonsterRoute(id: number): BattleRouteModelDef {
        if (!this.routeMap.has(id)) {
            let vo = this.data.monster_way[id - 1];
            if (vo == null) {
                LogError("守护后院怪物路径配置获取异常 id ==", id);
                return null;
            }
            let route = new BattleRouteModelDef(vo);
            this.routeMap.set(id, route);
        }
        return this.routeMap.get(id);
    }

    //播放Boss提醒
    private bossTipSet = new Set<Node>();
    PlayBossTip(worldPos: Vec3) {
        NodePools.Inst().Get("battle/BossTip", obj => {
            if (obj) {
                if (this.node) {
                    BattleHelper.SetParent(obj, BattleSceneLayerType.BGTop, this);
                    obj.setWorldPosition(worldPos.x, worldPos.y, 0);
                    this.bossTipSet.add(obj);
                } else {
                    NodePools.Inst().Put(obj);
                }
            }
        });
    }
    //清空Boss提醒
    ClearBossTip() {
        if (this.bossTipSet.size > 0) {
            this.bossTipSet.forEach((obj) => {
                NodePools.Inst().Put(obj);
            })
            this.bossTipSet.clear();
        }
    }

    //摆放格子
    ShowBlock() {
        this.RemoveAllBlock();
        this.blockFramePool.ClearRefList();

        let cfgs = this.dataModel.curblockGroup;
        let frameDatas: CfgSceneBlockPosDef[][] = [];
        let lastMark: CfgSceneBlockPosDef = cfgs[0];
        let frameData: CfgSceneBlockPosDef[] = [];
        frameDatas.push(frameData);
        cfgs.forEach(data => {
            let block = this.CreateBlock(data);
            //if(data.pos_i != lastMark.pos_i && data.pos_j != lastMark.pos_j)
            if (data.pos_i != lastMark.pos_i) {
                frameData = [];
                frameDatas.push(frameData);
            }
            frameData.push(data);
            lastMark = data;
            // if(data.block_type == DefBlockType.Hero){
            //     this.heroBlocks.push(block);
            // }
        })
        frameDatas.forEach((datas) => {
            this.CreateBlockFrame(datas);
        })
    }


    CreateBlock(data: CfgSceneBlockPosDef): DefBlockObj {
        let obj = this.blockPool.Get();
        BattleHelper.SetParent(obj, BattleSceneLayerType.BGTop, this);
        let mono = obj.getComponent(DefBlockObj);
        mono.SetData(data);
        let pos = BattleHelper.GetDefWorldPos(data.pos_i, data.pos_j);
        let ijNum = BattleHelper.IJTonum2(data.pos_i, data.pos_j, DEF_MAP_COL);

        obj.worldPosition = pos;

        if (this.blockMap.has(ijNum)) {
            LogError("格子位置重复", data.pos_i, data.pos_j);
        }

        this.blockMap.set(ijNum, mono);
        return mono;
    }
    CreateBlockFrame(datas: CfgSceneBlockPosDef[]) {
        if (datas == null || datas.length == 0) return;
        let w = datas.length * DEF_CELL_WIDTH;
        let leftPos = BattleHelper.GetDefWorldPos(datas[0].pos_i, datas[0].pos_j);
        let frame = this.blockFramePool.Get();
        BattleHelper.SetParent(frame, BattleSceneLayerType.BGRoot, this);
        frame.getComponent(UITransform).width = w;
        frame.setWorldPosition(leftPos.x - DEF_CELL_WIDTH / 2, leftPos.y - 8, 0);
    }
    GetBlock(ij: number): DefBlockObj {
        return this.blockMap.get(ij);
    }

    RemoveAllBlock() {
        if (this.blockMap.size > 0) {
            this.blockMap.forEach((block, ijNum) => {
                this.blockPool.Put(block.node);
            })
            this.blockMap.clear();
        }
    }


    GetHeroNode(): Node {
        return this.heroPool.Get();
    }
    PutHeroNode(obj: HeroObj) {
        obj.Delete();
        this.heroPool.Put(obj.node);
    }
    CrateHero(ij: number, cfg: CfgHeroBattle): HeroObj {
        let node = this.GetHeroNode();
        this.HeroRoot.addChild(node);
        let hero = node.getComponent(HeroObj);

        let block = this.GetBlock(ij);
        if (block == null) {
            LogError("守卫后院战斗异常，无位置可放", ij);
            return;
        }
        let pos = block.PutPos();
        hero.node.worldPosition = pos;
        hero.InitPos(hero.node.position.x, hero.node.position.y);
        let ijObj = BattleHelper.NumToIJ(ij, DEF_MAP_COL);
        hero.SetIJ(ijObj.y, ijObj.x);
        hero.SetData(cfg);
        this.heroMap.set(ij, hero);
        return hero;
    }

    CreteHeroSmall(): HeroObj {
        let node = this.GetHeroNode();
        this.HeroRoot.addChild(node);
        let mono = node.getComponent(HeroObj);
        return mono;
    }

    //设置上阵英雄
    SetInFightHeros() {
        let infos: IBattleHeroInfo[] = [];
        this.heroMap.forEach((hero, k) => {
            infos.push({
                heroId: hero.data.hero_id,
                heroLevel: hero.level,
            })
        })
        this.battleInfo.SetInFightHeros(infos, infos.length);
    }

    //放置英雄
    PutHero(info: IPB_HeroNode, ij?: number): boolean {
        ij = ij ?? this.GetCanPutIJ();
        if (ij == null) {
            return false;
        }

        let stage = BattleData.Inst().GetHeroBattleStage(info);
        let data = BattleData.Inst().GetHeroBattleCfg(info.heroId, stage);
        let hero = this.CrateHero(ij, data);
        if (hero) {
            return true;
        }

        return false;
    }

    //移除英雄
    RemoveHero(hero: HeroObj) {
        let ij = hero.ijNum;
        if (this.heroMap.has(ij)) {
            this.PutHeroNode(hero);
            this.heroMap.delete(ij);
            let infoList = HeroData.Inst().HeroList;
            for (let info of infoList) {
                if (info.heroId == hero.data.hero_id) {
                    let view = <BattleDefView>ViewManager.Inst().getView(BattleDefView);
                    if (view) {
                        view.PutData(info);
                    }
                    break;
                }
            }
        }
    }

    RemoveAllHero() {
        this.heroMap.forEach((hero, key) => {
            if (hero) {
                if (hero.heroCtrl) {
                    hero.heroCtrl.OnFightEnd();
                }
                this.RemoveHero(hero);
            }
        })
    }

    GetHero2(ijNum: number): HeroObj {
        if (ijNum == null) {
            return null;
        }
        return this.heroMap.get(ijNum);
    }

    GetHero(i: number, j: number): HeroObj {
        let ijNum = BattleHelper.IJTonum2(i, j, DEF_MAP_COL);
        return this.heroMap.get(ijNum);
    }

    //获取场景中阶数最大的一个英雄
    GetMaxStageHero(heroId: number): HeroObj {
        let re: HeroObj = null;
        this.heroMap.forEach((h, k) => {
            if (!h || !h.data || h.data.hero_id != heroId) {
                return;
            }
            if (!re || h.data.stage > re.data.stage) {
                re = h;
            }
        })
        return re;
    }

    //获取当前英雄数量 level[-1:所有阶段,-2:除掉阶段0的英雄]
    GetHeroCount(heroid: number, level: number): number {
        let count = 0;
        this.heroMap.forEach((hero, k) => {
            if (hero && hero.data.hero_id == heroid) {
                if (hero.data.stage == level || level == -1 || (level == -2 && hero.data.stage > 0)) {
                    count++;
                }
            }
        })
        return count;
    }

    /**获取随机英雄 noItem:是否筛选能升级的 */
    GetRandomHero(obj?: HeroObj, noItem?: boolean, limitLevel?: number): (HeroObj | undefined) {
        let hero;
        let heroList = Array.from(this.heroMap.values());
        do {
            if (heroList.length == 0) {
                return undefined;
            }
            let index = MathHelper.GetRandomNum(0, heroList.length - 1);
            hero = heroList[index];
            if (hero) {
                if (hero.HasBuff(HeroObjBuffType.WaitDie)) {
                    hero = undefined;
                } else if (noItem == true && hero.IsItem()) {
                    hero = undefined;
                } else if (limitLevel != null && hero.stage < limitLevel) {
                    hero = undefined;
                }
            }
            UtilHelper.ArrayRemove(heroList, hero);
        } while (!hero || (obj && (obj == hero)))
        return hero;
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

    //获取一个能放置英雄的格子下标
    GetCanPutIJ(): number {
        let index: number;
        this.blockMap.forEach((v, k) => {
            if (index == null && v.blockType == DefBlockType.Hero) {
                let hero = this.heroMap.get(k);
                if (hero == null) {
                    index = k;
                }
            }
        })
        return index;
    }




    isMoveAnimating: boolean = false;  //是否在执行移动动画
    //选择英雄移动动画
    MoveNodeAnimation(isOn: boolean, func?: Function) {
        this.isMoveAnimating = true;
        let pos = this.node.position;
        let ty = isOn ? 524 : 0;
        let tweener = fgui.GTween.to2(0, pos.y, 0, ty, 0.5);
        tweener.setEase(fgui.EaseType.QuadOut)
        tweener.onUpdate((tweener: fgui.GTweener) => {
            this.node.setPosition(tweener.value.x, tweener.value.y);
        })
        tweener.onComplete(() => {
            this.isMoveAnimating = false;
            if (func) {
                func();
            }
        })
    }


    //交换两个格子上的英雄
    SwapHero(ijA: number, ijB: number, finishFunc?: () => any, isMove = true) {
        let heroA = this.GetHero2(ijA);
        if (!heroA) {
            return;
        }

        if (ijA == ijB) {
            ijB = null;
        }

        let heroB = this.GetHero2(ijB);
        let blockA = this.GetBlock(ijA);
        let blockB = this.GetBlock(ijB);

        let swapPosB: Vec3 = blockA.PutPos();
        let swapPosA: Vec3 = ijB == null ? swapPosB : blockB.PutPos();
        heroA.MovePos(swapPosA, finishFunc);
        if (ijB != null) {
            this.heroMap.set(ijB, heroA);
            let ijObj = BattleHelper.NumToIJ(ijB, DEF_MAP_COL);
            heroA.SetIJ(ijObj.y, ijObj.x);
        }

        if (heroB) {
            let ijObj = BattleHelper.NumToIJ(ijA, DEF_MAP_COL);
            heroB.SetIJ(ijObj.y, ijObj.x);
            this.heroMap.set(ijA, heroB);
            heroB.MovePos(swapPosB, () => {
                EventCtrl.Inst().emit(BattleEventType.Swap, heroB, heroA);
            });
        }

        if (ijB != null && heroB == null) {
            this.heroMap.delete(ijA);
        }
    }

    GetSwapHeroIJ(touchPos: Vec3, excludeObj?: HeroObj): number {
        let tIJ: number;
        this.blockMap.forEach((v, k) => {
            if (tIJ == null && v && v.data.block_type == DefBlockType.Hero) {
                let wPos = v.node.worldPosition;
                let dis = Vec2.distance(touchPos, wPos);
                if (dis <= 60) {
                    tIJ = k;
                }
            }
        })

        if (BattleData.Inst().IsGuide()) {
            let guideView = <BattleDefGuideView>ViewManager.Inst().getView(BattleDefGuideView);
            if (guideView && (guideView.isClickGuiding || tIJ != 10)) {
                return null;
            }
        }

        return tIJ;
    }

    //怪物死亡
    MonsterDie(monster: MonsterObj) {
        EventCtrl.Inst().emit(BattleEventType.MonsterDie, monster);
        let exp = monster.exp * this.battleInfo.skillAttri.monsterExpPercent;
        BattleData.Inst().battleInfo.AddExp(exp);
        this.dynamic.RemoveMonster(monster);
        // if (monster.data.monster_type == MonsterType.Boss && this.dataModel.curStage.IsFull()) {
        //     this.report.monsterList.push(monster.report);
        // }
        //游戏状态检查
        this.CheckGameState();
    }

    //被攻击
    BeAttacked(monster: MonsterObj) {
        this.curRoundBeAttack++;
        BattleData.Inst().battleInfo.AddHP(-monster.attackHarm);
        EventCtrl.Inst().emit(BattleEventType.BeAttack);
        EventCtrl.Inst().emit(BattleEventType.MonsterDie, monster);
        EventCtrl.Inst().emit(BattleEventType.MonsterDieByWall, monster);
        this.dynamic.RemoveMonster(monster);
        //游戏状态检查
        this.CheckGameState();
    }

    //失败镜头
    FailFightAnimation(func?: Function) {
        EventCtrl.Inst().emit(BattleEventType.GameOver, false);
        ViewManager.Inst().ShowView(BattleDefView, false);
        EventCtrl.Inst().emit(BattleEventType.Pause, true);
        let tweener = fgui.GTween.to2(0, 0, 0, 400, 2);
        tweener.setEase(fgui.EaseType.QuadOut)
        tweener.onUpdate((tweener: fgui.GTweener) => {
            this.node.setPosition(tweener.value.x, tweener.value.y);
        })
        tweener.onComplete(() => {
            AudioManager.Inst().Play(AudioTag.ChengBaoBaoZha);
            let effectPos = this.battleBG.BottomImg.node.worldPosition;
            effectPos = new Vec3(effectPos.x, effectPos.y - 100, 0);
            SceneEffect.Inst().Play(SceneEffectConfig.FailEffect, this.node, effectPos, () => {
                this.battleBG.SetFailImg();
            });
            SceneEffect.Inst().Play(SceneEffectConfig.FailEffect2, this.node, effectPos);
            SceneEffect.Inst().Play(<ISceneEffectConfig>{ path: "effect/ui/" + this.battleBG.data.defeat_id }, this.node, effectPos);

            this.scheduleOnce(() => {
                BattleData.Inst().battleInfo.SetBattleState(BattleState.Fail);
                BattleCtrl.Inst().FightEnd(this.battleInfo.sceneType);
                //BattleCtrl.Inst().ExitBattle();
                //ViewManager.Inst().OpenView(BattleFinishView);
            }, 2);
            if (func) {
                func();
            }
        })
    }

    //回合是否结束了
    IsRoundEnd(): boolean {
        if (this.createMonsterdProgress != 0) {
            return false;
        }
        if (this.dynamic.monsters.size > 0) {
            return false;
        }
        if (!this.roundActionQueue.IsFinish()) {
            return false;
        }
        for (var queue of this.monsterQueueMap.values()) {
            if (!queue.IsFinish()) {
                return false;
            }
        }
        return true;
    }

    //复活重置
    Resurgence(hp?: number) {
        this.battleInfo.hp = hp ?? DEFAULT_HP;
        this.dynamic.DieMonster();
        this.dynamic.StopAllSkill();
        EventCtrl.Inst().emit(BattleEventType.Pause, false);
    }

    //游戏状态检查
    CheckGameState() {
        if (ViewManager.Inst().IsOpened(BattleReliveView)) {
            return;
        }
        let hp = BattleData.Inst().battleInfo.GetHP();
        //失败检查
        if (hp <= 0) {
            if (this.battleInfo.remainResurgence <= 0 || SceneIsNoRelive[this.battleInfo.sceneType] == true) {
                BattleData.Inst().battleInfo.isSaveSkill = this.battleInfo.sceneType == SceneType.Main;
                this.FailFightAnimation();
            } else {
                this.battleInfo.remainResurgence--;
                EventCtrl.Inst().emit(BattleEventType.Pause, true);
                ViewManager.Inst().OpenView(BattleReliveView);
            }
            return;
        }
        let isRoundEnd = this.IsRoundEnd();
        if (!isRoundEnd) {
            return;
        }
        BattleData.Inst().battleInfo.AddSceneRoundIndex(1);
        this.dynamic.StopAllSkill();
        if (this.battleInfo.skillAttri.isChengBao3 && this.curRoundBeAttack < 1) {
            let skill = BattleData.Inst().GetSkillCfg(304);
            this.battleInfo.AddHP(skill.pram1);
        }

        this.heroMap.forEach((hero, key) => {
            if (hero) {
                if (hero.heroCtrl) {
                    hero.heroCtrl.OnFightEnd();
                }
                //清空角色buff
                hero.ClearBuff();
            }
        })

        BattleData.Inst().battleInfo.isPause = false;
        //阶段结束检查
        let isStageEnd = this.dataModel.curStage.IsEnd();
        if (isStageEnd) {
            BattleData.Inst().battleInfo.AddSceneStageIndex(1);
            let effectPos = this.getComponent(UITransform).convertToWorldSpaceAR(new Vec3());
            AudioManager.Inst().Play(AudioTag.HeroChange);
            BattleData.Inst().battleInfo.isPause = true;
            //播下一阶段
            SceneEffect.Inst().Play(SceneEffectConfig.PassStage, this.node, effectPos, null, () => {
                //胜利检查
                let isSceneEnd = this.dataModel.IsEnd();
                if (isSceneEnd) {
                    EventCtrl.Inst().emit(BattleEventType.GameOver, true);
                    BattleData.Inst().battleInfo.SetBattleState(BattleState.Win);
                    BattleCtrl.Inst().FightEnd(this.battleInfo.sceneType);
                    //ViewManager.Inst().OpenView(BattleFinishView);
                    //BattleCtrl.Inst().ExitBattle();
                    return;
                }

                BattleData.Inst().battleInfo.roundProgerss++;
                BattleData.Inst().battleInfo.SetBattleState(BattleState.SanXiao);

                SceneEffect.Inst().PlayLoadScene(() => {
                    // 清空全部的角色
                    this._isloaded = false;
                    this.RemoveAllHero();
                    this.PlayStage();
                }, () => {
                    return this.isLoaded;
                });
            })
            return;
        }
        BattleData.Inst().battleInfo.roundProgerss++;
        BattleData.Inst().battleInfo.SetBattleState(BattleState.SanXiao);
        BattleCtrl.Inst().SaveBattleDef();
        //播下一回合
        this.PlayRound();
    }

    //闪烁所有的英雄
    SanSuoHero(hero_id: number) {
        this.heroMap.forEach((hero, key) => {
            if (hero && hero.data.stage > 0 && hero.data.hero_id == hero_id) {
                let block = this.GetBlock(hero.ijNum);
                if (block) {
                    SceneEffect.Inst().Play(SceneEffectConfig.GetSkillShow2, block.node, block.node.worldPosition);
                    SceneEffect.Inst().Play(SceneEffectConfig.GetSkillShow1, hero.node, hero.node.worldPosition);
                }
            }
        })
    }

    //获取场景最上层位置
    GetTopPos(): Vec3 {
        let pos = this.battleBG.TopImg.node.getWorldPosition();
        return pos;
    }
    //家的位置
    GetHomePos(): Vec3 {
        let pos = this.battleBG.Home.getWorldPosition();
        return pos;
    }

    StartGame() {
        BattleData.Inst().battleInfo.SetBattleState(BattleState.Figth);
        BattleCtrl.Inst().SaveBattleDef();
        this.OnStartGame();
    }

    private OnStartGame() {
        this.heroMap.forEach((hero, ij) => {
            if (hero.heroCtrl) {
                hero.heroCtrl.OnFightStart();
            }
        });
    }

    IsInScene(heroInfo: IPB_HeroNode): boolean {
        let isIn = false;
        this.heroMap.forEach((hero, ij) => {
            if (hero.data.hero_id == heroInfo.heroId) {
                isIn = true;
            }
        });
        return isIn;
    }
}



export class BattleSceneModelDef {
    data: CfgSceneDefData;
    private stages: BattleStageModelDef[];
    get curStage(): BattleStageModelDef {
        let index = BattleData.Inst().battleInfo.GetSceneStageIndex();
        return this.stages[index];
    }

    private roundGroup: CfgSceneRoundDef[][];
    get curRoundGroup(): CfgSceneRoundDef[] {
        let round_index = BattleData.Inst().battleInfo.GetSceneRoundIndex();
        let id = this.curStage.GetRoundId(round_index)
        return this.roundGroup[id];
    }

    private blockGroup: CfgSceneBlockPosDef[][];
    get curblockGroup(): CfgSceneBlockPosDef[] {
        let id = this.curStage.data.stage_id;
        return this.blockGroup[id];
    }

    constructor(data: CfgSceneDefData) {
        this.data = data;
        this.stages = [];
        for (var v of data.barrier) {
            let cfg = this.GetStageCfg(v.stage_id);
            let stageModel = new BattleStageModelDef(cfg);
            this.stages.push(stageModel);
        }
        this.roundGroup = DataHelper.TabGroup(data.round, "round_id");
        this.blockGroup = DataHelper.TabGroup(data.block_pos, "stage_id");
        BattleData.Inst().battleInfo.roundProgerssMax = this.roundGroup.length - 1;
    }


    GetStageCfg(stage_id: number): CfgSceneStageDef {
        for (var v of this.data.stage) {
            if (v.stage_id == stage_id) {
                return v;
            }
        }
        return null;
    }

    IsEnd(): boolean {
        let index = BattleData.Inst().battleInfo.GetSceneStageIndex();
        return index >= this.stages.length;
    }
}

//阶段数据模型
export class BattleStageModelDef {
    data: CfgSceneStageDef;
    private round_ids: number[]
    constructor(data: CfgSceneStageDef) {
        this.data = data;
        this.round_ids = [];
        let cfg = data.round_id.toString().split("|");
        cfg.forEach((str_id) => {
            this.round_ids.push(Number(str_id));
        })
        //console.log("???", data.round_id, this.round_ids);
    }


    //获取回合id
    GetRoundId(index: number): number {
        return this.round_ids[index];
    }

    //是不是结束了
    IsEnd(): boolean {
        let round_index = BattleData.Inst().battleInfo.GetSceneRoundIndex();
        return round_index >= this.round_ids.length;
    }

    //是不是最后一回合
    IsFull(): boolean {
        let round_index = BattleData.Inst().battleInfo.GetSceneRoundIndex();
        return round_index >= this.round_ids.length - 1;
    }

    RoundLength(): number {
        return this.round_ids.length;
    }
}

//守护后院路径
export class BattleRouteModelDef {
    private vo: CfgSceneRoute;
    private ijList: MapIJ[] = [];

    constructor(vo: CfgSceneRoute) {
        this.vo = vo;
        let strList = this.vo.route_i_j.toString().split("|");
        strList.forEach(v => {
            let ijCfg = v.toString().split(",");
            this.ijList.push(<MapIJ>{ i: Number(ijCfg[0]), j: Number(ijCfg[1]) })
        })
    }

    //起点i,j
    StartIJ(): MapIJ {
        return this.ijList[0];
    }

    //终点i,j
    EndIJ(): MapIJ {
        let index = this.ijList.length - 1;
        return this.ijList[index];
    }

    IJList(): MapIJ[] {
        return this.ijList;
    }
}



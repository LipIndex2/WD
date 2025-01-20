import { _decorator, Component, UITransform, Input, Prefab, instantiate, Vec3, Vec2, sys, Animation, Node, Color, Sprite, game, NodePool, SpriteFrame } from "cc";
import { DEBUG } from "cc/env";
import { CfgBattleGuide } from "config/CfgBattleGuide";
import { CfgSkillData } from "config/CfgEntry";
import { CfgHero, CfgHeroBattle } from "config/CfgHero";
import { CfgMonsterSkillData, CfgMonsterData } from "config/CfgMonster";
import { CfgMonsterCtrl } from "config/CfgMonsterCtrl";
import { CfgSceneData, CfgSceneRound, CfgSceneStage } from "config/CfgScene";
import { LogError, LogWxError } from "core/Debugger";
import { NodePools } from "core/NodePools";
import { ObjectPool } from "core/ObjectPool";
import { SmallObjPool } from "core/SmallObjPool";
import * as fgui from "fairygui-cc";
import { ResManager } from "manager/ResManager";
import { ViewManager } from "manager/ViewManager";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { EventCtrl } from "modules/common/EventCtrl";
import { Prefskey } from "modules/common/PrefsKey";
import { HeroData } from "modules/hero/HeroData";
import { RoleData } from "modules/role/RoleData";
import { SceneEffect, SceneEffectConfig, ISceneEffectConfig } from "modules/scene_obj_spine/Effect/SceneEffect";
import { Timer, TYPE_TIMER } from "modules/time/Timer";
import { DataHelper } from "../../helpers/DataHelper";
import { MathHelper } from "../../helpers/MathHelper";
import { UH } from "../../helpers/UIHelper";
import { RandomSkillListAction } from "./BattleAction";
import { BattleState, HeroAnimationType, BattleEventType, GUIDE_HEROS, MAP_COL, CELL_WIDTH, CELL_OFFSET_POS, MonsterType, IMonsterObjBuffData, MAX_MAP_ROW, MonsterCreateInfo, CfgCoinData, HeroAnimationRemind, BOX_MAX, FIGHT_SCALE, IS_BATTLE_TWEENER_AUTO, DEFAULT_HP, HeroObjBuffType, SceneType, SceneBoxIsHero, HeroBattleDayBuffHandle, SceneIsNoRelive, BattleObjTag } from "./BattleConfig";
import { BattleCtrl } from "./BattleCtrl";
import { BattleRoundReport, BattleInfo, BattleData, BattleInfoSave, ISkillInfoSave } from "./BattleData";
import { BattleDebugData } from "./BattleDebugCfg";
import { BattleDynamic, BattleTweenerType } from "./BattleDynamic";
import { BattleView } from "./BattleView";
import { QueuePlayFunc, IQueuePlayFuncItem } from "./Function/QueueFunc";
import { MainSceneBG } from "./MainSceneBG";
import { HeroObj, HeroObjIconDownloader } from "./Object/HeroObj";
import { MonsterObj } from "./Object/MonsterObj";
import { SanXiaoLogic } from "./SanXiaoLogic";
import { BattleGuideView } from "./View/BattleGuideView";
import { BattleReliveView } from "./View/BattleReliveView";
import { BattleStartFightTip } from "./View/BattleStartFightTip";
import { SevenDayHeroData } from "modules/seven_day_hero/SevenDayHeroData";
import { CfgSupplyCardData } from "config/CfgSupplyCard";
import { CloudObj } from "./Object/CloudObj";
import { BattleHarmInfoView } from "./View/BattleHarmInfoView";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { UtilHelper } from "../../helpers/UtilHelper";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { CfgBarrierAttInfo } from "config/CfgBarrierAtt";

const { ccclass, property } = _decorator;

export interface IHeroUpInfo {
    curData: CfgHeroBattle;  //当前数据
    i: number,
    j: number,
    level: number,
}

export class CreateHeroQueueInfo implements IQueuePlayFuncItem {
    out_time: number = 0.001;
    i: number;
    j: number;
    constructor(i: number, j: number, time: number = 0.001) {
        this.i = i;
        this.j = j;
        this.out_time = time;
    }
}

export interface IBattleBG {
    node: Node;
    maxCol?: number;

    GetMapLeftX?: () => number;
    GetMapRightX?: () => number;
    GetMapTopY?: () => number;
    GetWorldPos?: (i: number, j: number) => Vec3;
}

export interface IBattleScene {
    tag: BattleObjTag;
    node: Node;
    Root: Node;
    BGRoot: Node;
    HeroRoot: Node;
    MonsterRoot: Node;
    TopRoot: Node;
    BottomEffectRoot: Node;
    BottomSkillRoot: Node;
    TopSkillRoot: Node;

    HeroSource: Node;
    MonsterSource: Node;
    CloudSource: Node;
    FightMask?: UITransform;

    isCanCtrl: boolean;
    isLoaded: boolean;

    dynamic: BattleDynamic;
    battleBG: IBattleBG;
    report: BattleRoundReport;

    SetData: (data: any) => any;
    Delete: () => any;
    BeAttacked: (monseter: MonsterObj) => any;          //被攻击
    GetHero: (i: number, j: number) => any;              //获取英雄
    GetRoundHeros: (hero: HeroObj, round: number) => any;//获取周围英雄
    MonsterDie: (monster: MonsterObj) => any;          //怪物死亡
    FailFightAnimation: (func?: Function) => any;      //失败动画
    SanSuoHero: (hero_id: number) => any;              //闪烁英雄
    CheckGameState: () => any;                         //游戏状态检查
    Resurgence: (hp?: number) => any;                  //复活重置
    GetMaxStageHero: (heroId: number) => HeroObj       //获取场景中阶数最大的一个英雄
    GetHeroCount: (heroid: number, level: number) => number //获取当前英雄数量 level[-1:所有阶段,-2:除掉阶段0的英雄]
    GetRandomHero: (obj?: HeroObj, noItem?: boolean, limitLevel?: number) => (HeroObj | undefined)     /**获取随机英雄 noItem:是否筛选能升级的 */
    GetTopPos: () => Vec3                            ///**获取场景最上层位置 */
    GetHomePos: () => Vec3                           ///**获取场景家的位置 */
}


@ccclass('BattleScene')
export class BattleScene extends Component implements IBattleScene {
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

    tag: BattleObjTag = BattleObjTag.Player;

    get sceneId(): number {
        if (!this.battleInfo) {
            return null
        }
        return this.battleInfo.sceneId;
    }

    get report(): BattleRoundReport {
        return this.battleInfo.GetCurReport();
    }

    data: CfgSceneData;
    dataModel: BattleSceneModel;
    battleInfo: BattleInfo;

    anima: Animation;
    dynamic: BattleDynamic;  //// 管理战斗中动态的对象

    battleBG: MainSceneBG;

    heros: HeroObj[][];      //先列后行
    heros2: HeroObj[][];     //先列后行

    heroProtects: CfgHeroBattle[];   //阶段结束，留下来的英雄

    heroPool: SmallObjPool<Node>;
    monsterPool: SmallObjPool<Node>;

    sanxiao: SanXiaoLogic;   //三消逻辑

    private _timeOutHandles: NodeJS.Timeout[] = [];
    private _isCanCtrl: boolean = false;
    get isCanCtrl() {
        if (!this._isCanCtrl) {
            return false;
        }
        if (this.battleInfo.isGuiding) {
            return false;
        }
        if (BattleData.Inst().battleInfo.isPause) {
            return false;
        }
        if (BattleData.Inst().battleInfo.GetBattleState() != BattleState.SanXiao) {
            return false
        }
        if (!this.dynamic.IsTweenrCompleted()) {
            return false;
        }
        return true;
    }

    private _isloaded: boolean = false;
    get isLoaded(): boolean {
        return this._isloaded;
    }

    private remindTime: number = 5;  //当长时间未操作将触发提醒
    private _remindTime: number = 0;
    private isCheckRemind: boolean = false;    //是否检查提醒
    private curRemindHero: HeroObj;  //当前提醒的英雄
    private curRoundUpCount: number = 0;     //当前回合升级了多少次英雄
    private curRoundBeAttack: number = 0;       //当前回合被攻击多少次


    private roundActionQueue: QueuePlayFunc;   //回合事件播放器
    //private monsterQueue:QueuePlayFunc[]; //怪物队列播放器
    private monsterQueueMap: Map<number, QueuePlayFunc>;
    private monsterQueueEffectMap: Map<number, Node | null>;
    private monsterPlayCols: number[];    //怪物能放置的列，如果没有，默认都可放
    private bossCols: number[];      //boss所占的列
    private showBoosRangeCol: number[];  //显示boos的范围位置
    private createHeroActionQueue: QueuePlayFunc;

    private cloudPool: SmallObjPool<Node>;
    private cloudFlushTime = 20;
    private _cloudFlushTime = 20;


    GetRoundActionQueue() {
        return this.roundActionQueue;
    }

    GetHeroNode(): Node {
        return this.heroPool.Get();
    }
    PutHeroNode(obj: HeroObj) {
        obj.Delete();
        this.heroPool.Put(obj.node);
    }
    GetMonsterNode(): Node {
        return this.monsterPool.Get();
    }
    PutMonsterNode(obj: Node) {
        this.monsterPool.Put(obj);
    }


    protected onLoad(): void {
        this.dynamic = this.addComponent(BattleDynamic);
        this.dynamic.quickDownloadFalg = false;
        this.anima = this.getComponent(Animation)
        fgui.GRoot.inst.on(Input.EventType.TOUCH_START, this.OnTouchStart.bind(this));
        fgui.GRoot.inst.on(Input.EventType.TOUCH_CANCEL, this.OnTouchEnd.bind(this));
        fgui.GRoot.inst.on(Input.EventType.TOUCH_END, this.OnTouchEnd.bind(this));
        //this.SetData();

        AudioManager.Inst().PlayBg(AudioTag.ZhanDouAudio);

        this.cloudPool = new SmallObjPool<Node>(this.CloudSource);
    }

    update(dt: number) {
        if (this.battleInfo == null) {
            return;
        }
        if (this.isCheckRemind) {
            this.UpdateRemind(dt);
        }

        this._cloudFlushTime += dt;
        if (this._isloaded && this._cloudFlushTime >= this.cloudFlushTime) {
            this.CreateCloud();
            this._cloudFlushTime = 0;
            this.cloudFlushTime = MathHelper.GetRandomNum(10, 20);
        }

        if (!BattleData.Inst().battleInfo.isPause) {
            if (this.battleInfo.globalTimeScale != 1) {
                dt *= this.battleInfo.globalTimeScale;
            }
            if (BattleData.Inst().battleInfo.GetBattleState() == BattleState.Figth) {
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

    UpdateRemind(dt: number) {
        this._remindTime += dt;
        if (this._remindTime >= this.remindTime) {
            if (this.isCanCtrl) {
                this.CheckHeroRemind();
                this.isCheckRemind = false;
            }
            this._remindTime = 0;
        }
    }

    Delete() {
        if (this._timeOutHandles.length > 0) {
            for (let hand of this._timeOutHandles) {
                clearTimeout(hand);
            }
            this._timeOutHandles = [];
        }
        if (this.timeHandle) {
            clearTimeout(this.timeHandle);
            this.timeHandle = null;
        }
        if (this.collect_timer_handle) {
            Timer.Inst().CancelTimer(this.collect_timer_handle);
            this.collect_timer_handle = null;
        }

        BattleScene.ForeachHeros(this.heros, (hero, i, j) => {
            if (hero) {
                hero.Delete();
            }
        })

        this.heroPool.Clear();
        this.monsterPool.Clear();
        this.dynamic.Delete();

        this.heroPool = null;
        this.monsterPool = null;
        this.dynamic = null;
    }

    OnTouchStart() {
        this.StopHeroRemind();
    }

    OnTouchEnd() {
        this._remindTime = 0;
        this.isCheckRemind = true;
    }

    private _th_TouchSingleHero: TYPE_TIMER;
    OnTouchSingleHero(hero: HeroObj) {
        if (this._th_TouchSingleHero) {
            Timer.Inst().CancelTimer(this._th_TouchSingleHero);
            this._th_TouchSingleHero = undefined;
        }
        if (hero) {
            let hero_id = hero.data.hero_id;
            let stage = hero.data.stage;
            BattleScene.ForeachHeros(this.heros, (v, i, j) => {
                if (v && stage == v.data.stage && hero_id == v.data.hero_id) {
                    UH.SetSpriteMatActive(v.node, true);
                    v.ShowLevel(true);
                    UH.SetSpriteMatName(v.node, "mat_OutLine");
                    v.PlayAnimation(HeroAnimationType.Dou);
                } else {
                    UH.SetSpriteMatActive(v.node, false);
                    v.ShowLevel(false);
                }
            })
            this._th_TouchSingleHero = Timer.Inst().AddRunTimer(this.OnTouchSingleHero.bind(this), 2, 1, false);
        } else {
            BattleScene.ForeachHeros(this.heros, (v, i, j) => {
                if (v) {
                    UH.SetSpriteMatActive(v.node, false);
                    v.ShowLevel(false);
                }
            })
        }
    }

    //导入数据
    SetData(data: CfgSceneData, saveData?: BattleInfoSave) {
        console.log("导入数据");
        BattleData.Inst().isUseSave = saveData != null;

        this.data = data;
        this.dataModel = new BattleSceneModel(data);

        this._isCanCtrl = false;
        this.heros = [];
        this.heros2 = [];
        this.sanxiao = new SanXiaoLogic(this.heros);

        this.heroPool = new SmallObjPool(this.HeroSource, 100);
        this.monsterPool = new SmallObjPool(this.MonsterSource, 100);
        this.dynamic.SetPreloadPool(this.heroPool);
        this.dynamic.SetPreloadPool(this.monsterPool);

        this.roundActionQueue = new QueuePlayFunc();
        this.createHeroActionQueue = new QueuePlayFunc();
        this.createHeroActionQueue.OnPlay(this.PlayCreateHeroAction.bind(this));
        if (BattleDebugData.BATTLE_DEBUG_MODE && BattleDebugData.Inst().monsterRoundCount != -1) {
            this.roundActionQueue.OnPlay(this.PlayDebugRoundAction.bind(this));
        } else {
            this.roundActionQueue.OnPlay(this.PlayRoundAction.bind(this));
        }
        this.monsterPlayCols = [];

        this.monsterQueueMap = new Map();
        this.monsterQueueEffectMap = new Map();

        BattleData.Inst().ResetBattleInfo();
        this.battleInfo = BattleData.Inst().battleInfo;
        if (saveData) {
            BattleInfo.ConvertObj(this.battleInfo, saveData);
            this.battleInfo.SetBattleState(BattleState.SanXiao);
        }

        if (BattleData.Inst().IsGuide()) {
            this.SetGuideData();
        }

        EventCtrl.Inst().emit(BattleEventType.SceneLoaded);

        this._isloaded = false;
        let paths = HeroObjIconDownloader.GetTotalIconResPath(this.battleInfo.in_battle_heros);
        let heroIconDown = new HeroObjIconDownloader();
        heroIconDown.LoadIcons(paths, () => {
            this.PlayStage();
        });
    }

    //设置引导数据
    SetGuideData() {
        console.log("设置了引导数据");
        //棋子布置
        let guideHeroCfg = CfgBattleGuide.position;
        let herodata: CfgHeroBattle[][] = [];
        guideHeroCfg.forEach((posInfo) => {
            let col = posInfo.x_pos;
            if (herodata[col] == null) {
                herodata[col] = [];
            }
            let heroData = HeroData.Inst().GetHeroBattleCfg(posInfo.hero_id, posInfo.stage);
            herodata[col].push(heroData);
        })
        this.battleInfo.SetGuideHeroData(herodata);
        //技能布置
        let guideSkillCfg = CfgBattleGuide.entry;
        let skilldata: CfgSkillData[][] = [];
        guideSkillCfg.forEach((skillInfo) => {
            let group: CfgSkillData[] = [];
            let skill1 = BattleData.Inst().GetSkillCfg(skillInfo.entry1);
            let skill2 = BattleData.Inst().GetSkillCfg(skillInfo.entry2);
            let skill3 = BattleData.Inst().GetSkillCfg(skillInfo.entry3);
            group.push(skill1);
            group.push(skill2);
            group.push(skill3);
            skilldata.push(group);
        })
        this.battleInfo.SetGuideSkillData(skilldata);
        this.battleInfo.SetInFightHeros(GUIDE_HEROS);
        //this.battleInfo.isSave = false;
        this.battleInfo.globalTimeScaleShow = 1;
    }

    //设置上局保留的技能
    SetSaveSkill(): boolean {
        if (this.battleInfo.sceneType != SceneType.Main) {
            return false;
        }
        let saveSkillJson = sys.localStorage.getItem(Prefskey.GetBattleSaveSkillKey());
        if (saveSkillJson && saveSkillJson != "") {
            let skillInfo = <ISkillInfoSave>JSON.parse(saveSkillJson);
            sys.localStorage.setItem(Prefskey.GetBattleSaveSkillKey(), "");
            let skillCfg = BattleData.Inst().GetSkillCfg(skillInfo.skillId);
            if (skillCfg) {
                for (let i = 0; i < skillInfo.count; i++) {
                    BattleData.Inst().AddSkill(skillCfg);
                }
                EventCtrl.Inst().emit(BattleEventType.Pause, true);
                BattleData.Inst().SetSelectSkillList([skillCfg]);
                return true;
            }
        }
        return false;

        //测试用
        // EventCtrl.Inst().emit(BattleEventType.Pause, true);
        // BattleData.Inst().SetSelectSkillList([BattleData.Inst().GetSkillCfg(1)]);
    }

    //播放当前阶段
    PlayStage() {
        if (this.dataModel.IsEnd()) {
            //console.log("游戏结束了")
            return
        }
        BattleData.Inst().battleInfo.isPause = false;
        this.bossCols = [];

        let curStage = this.dataModel.curStage;
        let bgData = BattleData.Inst().GetSceneBGCfg(curStage.data.res_id);
        this._isloaded = false;
        //加载场景
        if (this.battleBG == null) {
            let bg_path = "battle/MainSceneBG";  //ResPath.Scene(curStage.data.res_id);
            //console.log("背景",bg_path, curStage.data);
            ResManager.Inst().Load<Prefab>(bg_path, (error, bgPrefab) => {
                if (error != null) {
                    LogWxError("战斗场景背景BG加载失败", curStage.data.res_id, error);
                    return
                }
                let bg = instantiate(bgPrefab);
                this.BGRoot.addChild(bg);
                bg.setPosition(0, 0);
                this.battleBG = bg.getComponent(MainSceneBG);
                this.battleBG.SetSpCellData(this.data.spe_block);
                this.battleBG.SetData(bgData);
                this.battleBG.LoadIcon(() => {
                    this.PlayStageLoadCallback();
                });
            });
        } else {
            this.battleBG.SetSpCellData(this.data.spe_block);
            this.battleBG.SetData(bgData);
            this.battleBG.LoadIcon(() => {
                this.PlayStageLoadCallback();
            });
        }
    }

    private PlayStageLoadCallback() {
        this._isloaded = true;
        this.battleBG.SetInitMap(this.battleInfo.mapRow);
        let time = this.battleInfo.heroInfoMap.size > 0 ? 0 : 0.7;
        this.scheduleOnce(this.LayoutScene.bind(this), time);
    }


    private timeHandle: any;
    //布局场景
    LayoutScene() {
        if (BattleData.Inst().IsGuide()) {
            ViewManager.Inst().OpenView(BattleGuideView);
        }

        //console.error("布局场景");
        if (this.battleInfo.heroInfoMap.size > 0) {
            //有存档的
            this.battleInfo.heroInfoMap.forEach((herodata, posIndex) => {
                if (herodata) {
                    let ij = BattleScene.NumToIJ(posIndex);
                    this.CreteHero2(ij.y, ij.x, herodata);
                }
            })
            this.battleInfo.heroInfoMap.clear();
            //if (this.battleInfo.GetBattleState() == BattleState.Figth) {
            if (this.battleInfo.GetStepNum() <= 0) {
                let roundCfg = this.dataModel.curRoundGroup;
                let queuedata = BattleData.Inst().GetRoundQueueData(roundCfg);
                this.roundActionQueue.Reset(queuedata);
                this.ReadyStageFull();
                this.CheckStep();
            } else {
                this.PlayRound(false);
                this.MendMapCell();
            }
        } else {
            //无纯当的
            BattleData.Inst().battleInfo.SetSceneRoundIndex(0);
            this.PlayRound();
            //首次布局
            if (this.heroProtects == null || this.heroProtects.length == 0) {
                this.MendMapCell(() => {
                    let isSet = this.SetSaveSkill();
                    if (!isSet) {
                        this.HandleBoxList();
                    }
                });
            } else {
                let times = this.heroProtects.length;
                let row = this.battleBG.Row;
                let n = 0;
                let mended = false;
                MathHelper.UpsetArr(this.heroProtects);
                this.collect_timer_handle = Timer.Inst().AddRunTimer(() => {
                    if (this.heroProtects.length != 0) {
                        let data = this.heroProtects.pop();
                        let i = row - (Math.ceil((n + 1) / MAP_COL))
                        let j = n % MAP_COL;
                        let pos = this.battleBG.GetWorldPos(i, j);
                        pos.y = pos.y - 10;
                        SceneEffect.Inst().Play(SceneEffectConfig.HeroIn, this.node, pos);
                        AudioManager.Inst().PlaySceneAudio(AudioTag.baoxiangdan, 0);
                        this.scheduleOnce(() => {
                            this.CreteHero2(i, j, data);
                            if (this.heroProtects.length == 0 && !mended) {
                                mended = true;
                                //存档
                                BattleCtrl.Inst().SaveBattle();
                                this.scheduleOnce(() => {
                                    this.MendMapCell();
                                }, 0.3)
                            }
                        }, 0.25)
                    }
                    n++;
                }, 0.3, times, false)
            }
        }
        this.SetupDebugData();
    }

    SetupDebugData() {
        if (!BattleDebugData.BATTLE_DEBUG_MODE) {
            return;
        }
        BattleDebugData.Inst().HeroSkills.forEach((skId) => {
            if (skId) {
                let skillCfg = BattleData.Inst().GetSkillCfg(skId);
                BattleData.Inst().AddSkill(skillCfg);
            }
        })
    }

    //显示遮罩
    ShowFightMask(isShow: boolean) {
        this.FightMask.node.active = isShow;
        if (!isShow) {
            return;
        }
        this.FightMask.node.setSiblingIndex(this.FightMask.node.parent.children.length - 1);
        let h = CELL_WIDTH * this.battleBG.Row;
        this.FightMask.height = h;
        //let pos = this.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(CELL_OFFSET_POS.x, CELL_OFFSET_POS.y,0));
        let pos = new Vec3(CELL_OFFSET_POS.x - CELL_WIDTH / 2, CELL_OFFSET_POS.y - CELL_WIDTH / 2, 0)
        this.FightMask.node.setPosition(pos);
    }

    //归位全部角色动画状态
    ResetHeroAnima() {
        BattleScene.ForeachHeros(this.heros, (v, i, j) => {
            if (v) {
                v.PlayAnimation(HeroAnimationType.Await);
            }
        })
    }

    //播放当前回合
    PlayRound(isAddStepnum: boolean = true) {
        if (this.dataModel.IsEnd()) {
            return
        }
        EventCtrl.Inst().emit(BattleEventType.RoundChange, this.battleInfo.roundProgerss);
        this.curRoundUpCount = 0;
        let roundCfg = this.dataModel.curRoundGroup;
        //设置回合数据
        let firstCfg = roundCfg[0];
        let stepNum = BattleData.Inst().IsGuide() ? 4 : firstCfg.initia_steps;
        //LogError("当前回合数据", roundCfg);
        if (isAddStepnum) {
            this.battleInfo.AddStepNum(stepNum);
            this.battleInfo.SetUseStep(0);
            //this.ResetToDayBuff();
        }
        if (BattleDebugData.BATTLE_DEBUG_MODE) {
            let roundCount = BattleDebugData.Inst().monsterRoundCount;
            if (roundCount == 1) {
                roundCfg = [firstCfg];
            } else if (roundCount == -1) {
                this.roundActionQueue.SetLoop(true);
            }
        }
        let queuedata = BattleData.Inst().GetRoundQueueData(roundCfg);
        this.roundActionQueue.Reset(queuedata);
        let report = new BattleRoundReport();
        this.battleInfo.AddReport(report);
        this.curRoundBeAttack = 0;

        //this.CheckSanXiao();
        this._remindTime = 0;
        this.isCheckRemind = true;
        this.ShowFightMask(false);
        this.ResetHeroAnima();
        BattleData.Inst().battleInfo.SetBattleState(BattleState.SanXiao);
        this._isCanCtrl = true;
        if (this.battleInfo.skillAttri.isMeiRiAddStep > 0) {
            BattleData.Inst().battleInfo.AddStepNum(this.battleInfo.skillAttri.isMeiRiAddStep);
            BattleData.Inst().otherInfo.skillAddStep = this.battleInfo.skillAttri.isMeiRiAddStep;
        }
        if (this.battleInfo.skillAttri.isMieJieAddStep > 0 && this.battleInfo.roundIndex == 0) {
            BattleData.Inst().battleInfo.AddStepNum(this.battleInfo.skillAttri.isMieJieAddStep);
            BattleData.Inst().otherInfo.skillAddStep = this.battleInfo.skillAttri.isMieJieAddStep;
        }

        this.ReadyStageFull();

        this.CheckStep();
    }

    // 准备这阶段的最后一波
    ReadyStageFull() {
        //最后一回合显示boss
        let isShow: boolean = false;
        if (this.IsSceneBossRange()) {
            if (BattleData.Inst().battleInfo.GetStepNum() <= 15) {
                isShow = true;
            }
        } else if (this.dataModel.curStage.IsFull()) {
            isShow = true;
        }

        if (isShow) {
            let roundCfg = this.dataModel.curRoundGroup;
            let num = 0;
            roundCfg.forEach(cfg_round => {
                let monsterCfg = BattleData.Inst().GetSceneMonsterCfg(cfg_round.monster_id);
                if (monsterCfg.monster_type == MonsterType.Boss) {
                    num += 1;
                }
            });
            if (num > 0) {
                if (this.battleInfo.showBoosRangeCol && this.battleInfo.showBoosRangeCol.length > 0) {
                    this.showBoosRangeCol = this.battleInfo.showBoosRangeCol;
                    this.battleInfo.showBoosRangeCol = null;
                } else {
                    this.showBoosRangeCol = this.GetBossCols(num);
                    this.battleInfo.showBoosRangeCol = this.showBoosRangeCol;
                }
                this.battleBG.SetBossRange(this.showBoosRangeCol);
            } else {
                this.showBoosRangeCol = null;
            }
        }
    }

    //调试模式下的回合播放事件
    PlayDebugRoundAction() {
        let monsterInfos = BattleDebugData.Inst().MonsterInfos;
        monsterInfos.forEach(info => {
            let queue = this.GetMonsterQueueByIJ(info.i, info.j);
            queue.PushData(info);
        })

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
                window.confirm("主线关卡表怪物出生点出错 章：" + this.battleInfo.sceneId + " 关卡：" + this.battleInfo.roundProgerss);
            }
            ctrl = 1;
            cfg_ctrl = CfgMonsterCtrl.ctrl_list[ctrl - 1];
        }
        let bomPointArr = cfg_ctrl.spwan;
        let bomMonsterLimit: number;
        let bomMonsterRandomLimit: number; //开始随机位置的值
        let bomPointTemp: number[][];


        let hero_point: number[][]; //有英雄的列
        if (round_id <= 3 && round_id >= 0) {
            hero_point = [];
            let map_bomPoint: { [key: string]: boolean };
            BattleScene.ForeachHeros(this.heros, (v: HeroObj, row: number, col: number) => {
                if (v.data.stage > 0) {
                    if (!map_bomPoint) {
                        map_bomPoint = {};
                    }
                    if (!map_bomPoint[col]) {
                        hero_point.push([col, row])
                        map_bomPoint[col] = true;
                    }
                }
            })
            if (map_bomPoint) {
                bomPointArr = [];
                cfg_ctrl.spwan.forEach(point => {
                    let col = point[0];
                    let row = point[1];
                    if (col < 0 || map_bomPoint[col] || col >= MAP_COL) {
                        bomPointArr.push(point)
                    }
                });
            }
        }

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


        if (monsterCfg.monster_type == MonsterType.Boss && this.showBoosRangeCol && this.showBoosRangeCol.length > 0) {
            let cols = this.showBoosRangeCol;
            let length = cols.length;
            let bossIndex = cols.shift();
            if (bossIndex) {
                bomMonsterLimit = 1;
                func(bossIndex);
                if (length == 1) {
                    this.bossCols = [cols[0] - 1, cols[0], cols[0] + 1]
                } else if (length == 2) {
                    this.bossCols = [0, 1, 2, 3, 4, 5];
                }
            }
            cols.push(bossIndex);
            return;
        }
        bomMonsterLimit = Math.floor(monster_num / bomPointArr.length);
        bomMonsterRandomLimit = bomMonsterLimit * monster_num;
        for (let i = 0; i < monster_num; i++) {
            func(i);
        }
    }

    //回合是否结束了
    IsRoundEnd(): boolean {
        //console.log("回合是否结束");
        // if (this.monsterQueueEffectMap.size > 0) {
        //     //console.log("还有特效",this.monsterQueueEffectMap.size);
        //     return false;
        // }

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
    DieAll() {
        this.dynamic.DieMonster();
    }

    //怪物播放
    private createMonsterdProgress: number = 0;
    PlayMonsterAction(data: IQueuePlayFuncItem) {
        this.createMonsterdProgress++;
        let cfg = <MonsterCreateInfo>data;
        // this.dynamic.checkCreatInfo(cfg);
        let outTime = MathHelper.GetRandomNum(300, 600);
        let toHand = setTimeout(
            // this.scheduleOnce(
            () => {
                let handIdx = this._timeOutHandles.indexOf(toHand);
                if (handIdx >= 0) {
                    this._timeOutHandles.splice(handIdx, 1);
                }
                //创建怪物
                let monster = this.dynamic.CreateMonster(cfg);
                this.createMonsterdProgress--;
                //看看是否提醒
                let is_tip = this.dataModel.IsMonsterTip(monster.data);
                if (is_tip) {
                    BattleData.Inst().AddMonsterTip(monster.data);
                    this.dataModel.RecordMonsterTip(monster.data);
                }
            }
            // , outTime / 1000)
            , outTime)
        this._timeOutHandles.push(toHand);
        //是否播放特效
        let keyNum = BattleScene.IJTonum2(cfg.i, cfg.j);
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
    //怪物播放结束
    PlayMonsterQueueFinish(ij: number) {
        let effect = this.monsterQueueEffectMap.get(ij);
        if (effect != null) {
            NodePools.Inst().Put(effect);
            this.monsterQueueEffectMap.delete(ij);
        }
    }

    //播放创建角色
    PlayCreateHeroAction(param: IQueuePlayFuncItem) {
        let info = <CreateHeroQueueInfo>param;
        let i = info.i;
        let j = info.j;
        let data = this.CreateSafetyHeroData(i, j);
        let mono = this.CrateHero();
        mono.SetData(data);
        mono.SetIJ(i, j);
        mono.PlayAnimation(HeroAnimationType.Await);
        let pos = this.battleBG.GetPos(i, j);
        mono.InitPos(pos.x, pos.y);
        this.heros2[j].push(mono);
        if (mono.IsItem() && mono.data.stage > 0) {
            this.boxList.push(mono);
            console.log(mono.node.name);
        }
    }

    //获取一个能播放怪物的队列下标
    GetMonsterQueueIndex(): number {
        if (this.monsterPlayCols.length > 0) {
            let index = MathHelper.GetRandomNum(0, this.monsterPlayCols.length - 1)
            return index;
        } else {
            let index = MathHelper.GetRandomNum(0, MAP_COL - 1)
            return index;
        }
    }

    //通过ij获取怪物播放队列
    GetMonsterQueueByIJ(i: number, j: number): QueuePlayFunc {
        let key = BattleScene.IJToNum(new Vec2(j, i));
        if (!this.monsterQueueMap.has(key)) {
            let func = new QueuePlayFunc();
            func.OnPlay(this.PlayMonsterAction.bind(this));
            //func.OnFinish(this.PlayMonsterQueueFinish.bind(this))
            this.monsterQueueMap.set(key, func);
        }
        return this.monsterQueueMap.get(key);
    }

    //获取能放boss的列
    GetBossCols(num: number): number[] {
        if (num > 2) {
            num = 2;
        }
        if (num == 1) {
            let index = MathHelper.GetRandomNum(1, 4);
            return [index];
        }
        if (num == 2) {
            return [1, 4]
        }
    }


    //随机一个英雄id
    RandomHeroId(): number {
        let coinRate = this.battleInfo.GetCoinRate() + this.battleInfo.skillAttri.coidRate;
        //console.log("金币概率", coinRate);
        //金币判断
        if (MathHelper.RandomResult(coinRate, 100)) {
            return 0
        }

        let idList = BattleData.Inst().in_battle_heros;

        // 单独设置英雄出现概率
        let rates = this.battleInfo.in_heros_rate;
        if (rates && rates.length > 0) {
            let sum = 0;
            rates.forEach((rate) => {
                sum += rate;
            })
            let randNum = MathHelper.GetRandomNum(1, sum);
            let n = 0;
            for (let i = 0; i < rates.length; i++) {
                n += rates[i];
                if (n >= randNum) {
                    return idList[i];
                }
            }
        }


        let len = idList.length;
        let index = MathHelper.GetRandomNum(0, len - 1);
        return idList[index];
    }

    //生成一个安全的英雄数据
    CreateSafetyHeroData(i: number, j: number, level: number = 0): CfgHeroBattle {
        let guideData = this.battleInfo.GetGuideHeroData(j);
        if (guideData) {
            return guideData;
        }

        if (this.preBoxDataList.length > 0) {
            let qua = this.preBoxDataList.pop();
            return CfgCoinData[qua];
        }

        let hero_id = this.RandomHeroId();
        if (level == 0 && this.battleInfo.skillAttri.heroAttriMap.has(hero_id)) {
            level = this.battleInfo.skillAttri.heroAttriMap.get(hero_id).initLevel;
        }
        let data = hero_id == 0 ? CfgCoinData[0] : BattleData.Inst().GetHeroBattleCfg(hero_id, level);
        return data;
    }


    //创建一个英雄
    CrateHero(): HeroObj {
        let node = this.GetHeroNode();
        this.HeroRoot.addChild(node);
        let mono = node.getComponent(HeroObj);
        return mono;
    }
    CreteHero2(i: number, j: number, data: CfgHeroBattle): HeroObj {
        let mono = this.CrateHero();
        mono.SetData(data);
        mono.SetIJ(i, j);
        let pos = this.battleBG.GetPos(i, j);
        mono.InitPos(pos.x, pos.y);
        this.AddHero(mono);
        mono.PlayAnimation(HeroAnimationType.Await);
        return mono;
    }

    //生成新的英雄实例 col第几列，count:生成几个
    CreateNewHero(col: number, count: number) {
        if (!this.heros2[col]) {
            this.heros2[col] = [];
        }
        if (!this.heros[col]) {
            this.heros[col] = [];
        }
        // for (let n = 0; n < count; n++) {
        //     let mono = this.CrateHero();
        //     let i = -this.heros2[col].length - 1
        //     let t_i = i + count;
        //     let data = this.CreateSafetyHeroData(t_i, col);
        //     mono.SetData(data);
        //     mono.SetIJ(i, col);
        //     mono.PlayAnimation(HeroAnimationType.Await);
        //     let pos = this.battleBG.GetPos(i, col);
        //     mono.InitPos(pos.x, pos.y);
        //     this.heros2[col].push(mono);
        // }

        let len = this.heros2[col].length;
        for (let n = 0; n < count; n++) {
            let i = -len - 1
            let time = 0;
            if (count >= 6) {
                time = n % 3 == 0 ? 0.001 : 0
            }
            let info = new CreateHeroQueueInfo(i, col, time);
            this.createHeroActionQueue.PushData(info);
            len++;
        }

        if (count < 6) {
            this.createHeroActionQueue.Update(1);
        }
    }



    private recordChangeItems: HeroObj[] = [];      //记录一下交换的英雄，方便处理英雄升级的位置
    //交换两个英雄
    SwapHero(itemA: HeroObj, itemB: HeroObj, finishFunc?: Function, isMove = true) {
        //console.log("交换两个英雄", itemA.node.name, itemB.node.name);
        let a_i = itemA.i;
        let a_j = itemA.j;
        let b_i = itemB.i;
        let b_j = itemB.j;
        this.recordChangeItems[0] = itemA;
        this.recordChangeItems[2] = itemB;

        let progress_num = 2;
        let fun1 = () => {
            progress_num--;
            this.heros[b_j][b_i] = itemA;
            itemA.SetIJ(b_i, b_j);
            let pos = this.battleBG.GetPos(b_i, b_j);
            itemA.InitPos(pos.x, pos.y);
            if (finishFunc && progress_num == 0) {
                finishFunc();
                progress_num = 2;
                EventCtrl.Inst().emit(BattleEventType.Swap, itemB, itemA);
            }
        }
        let fun2 = () => {
            progress_num--;
            this.heros[a_j][a_i] = itemB;
            itemB.SetIJ(a_i, a_j);
            let pos = this.battleBG.GetPos(a_i, a_j);
            itemB.InitPos(pos.x, pos.y);
            if (finishFunc && progress_num == 0) {
                finishFunc();
                progress_num = 2;
                EventCtrl.Inst().emit(BattleEventType.Swap, itemB, itemA);
            }
        }
        if (isMove) {
            itemA.sanXiaoCtrl.MovePos(itemB.initPos, () => {
                fun1()
            })

            itemB.sanXiaoCtrl.MovePos(itemA.initPos, () => {
                fun2();
            })
        } else {
            fun1();
            fun2();
        }

        //战报记录
        let moveInfo = <IPB_SCBattleMoveNode>{ heroIndex: itemA.ijNum, moveDir: itemB.ijNum };
        this.report.moveList.push(moveInfo);
    }

    //丢弃英雄
    DiscardHero(hero: HeroObj, callback?: Function) {
        let i = hero.i
        let j = hero.j
        let maxRow = this.heros[j].length;
        //在外部需移出一段位置
        //英雄在内部直接销毁
        if (i <= 0 || j <= 0 || i >= maxRow - 1 || j >= MAP_COL - 1) {
            //console.log("向外部移除",maxRow);
            let curPos = hero.node.position;
            let initPos = hero.initPos;
            let dir = new Vec3(curPos.x - initPos.x, curPos.y - initPos.y, 0);
            let targetPos = new Vec3(curPos.x, curPos.y, 0);
            Vec3.scaleAndAdd(targetPos, curPos, dir, 1);
            hero.sanXiaoCtrl.MovePos(targetPos, () => {
                EventCtrl.Inst().emit(BattleEventType.Discard, hero);
                this.RemoveHero(hero);
                if (callback != null) {
                    callback();
                }
                this.MendMapCell();
            });
        } else {
            //console.log("内部自毁");
            this.RemoveHero(hero);
            EventCtrl.Inst().emit(BattleEventType.Discard, hero);
            if (callback != null) {
                callback();
            }
            this.MendMapCell();
        }
        BattleData.Inst().battleInfo.AddStepNum(-1);
    }


    //地图添加一行
    MapAddRow() {
        let row = this.battleBG.Row;
        if (row >= MAX_MAP_ROW) {
            return;
        }
        // if(!this.isCanCtrl){
        //     return;
        // }
        this.battleBG.CrateRowCell(row);
        //this.MendMapCell();
    }

    //检测提醒
    CheckHeroRemind() {
        let result = this.sanxiao.GetRemindCell();
        if (result != null) {
            //console.log("提醒了！！！", result);
            result.hero.PlayAnimation(HeroAnimationRemind[result.dir]);
            this.curRemindHero = result.hero;
        }
    }

    //停止提醒
    StopHeroRemind() {
        this.isCheckRemind = false;
        if (this.curRemindHero) {
            this.curRemindHero.StopAnimation();
            this.curRemindHero = null;
        }
    }

    //检测步数
    CheckStep(step?: number) {
        if (this.battleInfo.isGuiding) {
            return;
        }
        step = step ?? BattleData.Inst().battleInfo.GetStepNum();
        if (step <= 0) {
            this.StartFightAnimation(() => {
                this.SanXiaoEndEvent();
            })
        } else {
            BattleData.Inst().battleInfo.SetBattleState(BattleState.SanXiao);
        }
    }

    //三消结束事件
    SanXiaoEndEvent() {
        let state = BattleState.Figth;
        BattleData.Inst().battleInfo.SetBattleState(state);

        //记录战报
        let report = this.report;
        let row = this.battleBG.Row;
        let maxNum = MAP_COL * row;
        for (let i = 0; i < maxNum; i++) {
            let ij = BattleScene.NumToIJ(i);
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

        let spCells = this.battleBG.GetSpCells();
        if (spCells) {
            spCells.forEach((cell) => {
                cell.OnFightStart();
            })
        }

        this.StopHeroRemind();

        //存档
        BattleCtrl.Inst().SaveBattle();

        // let wx = ChannelAgent.wx;
        // if (wx) {
        //     wx.triggerGC();
        // }
    }

    AddPreBox(color: number) {
        this.preBoxDataList.push(color);
    }

    private needUpHeros: Map<HeroObj, IHeroUpInfo>;
    private addStep: number = -1;
    private delayTime: number = 0;
    private boxList: HeroObj[] = [];   //宝箱列表
    private preBoxDataList: number[] = [];      //开局直接获得x个宝箱
    private addUpHeros: Map<HeroObj, IHeroUpInfo>;
    //检测三消
    CheckSanXiao() {
        //console.log("执行了检查三消");
        this.CheckRunRunRun();
        let heros: HeroObj[][] = this.sanxiao.GetcellOKGroups();
        if (heros == null || heros.length == 0) {
            if (this.isStageEndCallback) {
                this.scheduleOnce(this.StageEndCallback.bind(this), 1);
            } else {
                this._isCanCtrl = true;
                this.addStep = -1;
                this.CheckStep();
            }
            return;
        }
        this.addStep++;
        let row = heros.length;
        let map = new Map();
        for (let i = 0; i < row; i++) {
            let col = heros[i].length;
            for (let j = 0; j < col; j++) {
                let hero = heros[i][j]
                if (!map.has(hero)) {
                    map.set(hero, true);
                }
            }
        }
        //console.log("消除多少个英雄", map.size);
        //let RemovePregress = map.size;
        for (let hero of map.keys()) {
            this.RemoveHero(hero, false);
            hero.Die(() => {
                this.PutHeroNode(hero);
            })
        }

        this.needUpHeros = new Map<HeroObj, IHeroUpInfo>();
        //this.addUpHeros = new Map<HeroObj, IHeroUpInfo>();
        this.delayTime = 350;
        heros.sort((a, b) => {
            return b.length - a.length;
        })
        for (let i = 0; i < row; i++) {
            this.HandleSanXiao(heros[i]);
            this.HandleSanXiaoBuff(heros[i]);
        }
        this.needUpHeros.forEach((v, k) => {
            if (v) {
                this.HeroUp(v);
            }
        });

        // if(this.addUpHeros.size > 0){
        //     this.delayTime += 100;
        //     this._isCanCtrl = false;
        //     this.timeHandle = setTimeout(() => {
        //         this.addUpHeros.forEach((v,k) => {
        //             this.HeroUp(v);
        //         });
        //     }, this.delayTime);
        //     this.delayTime += 700;
        // }

        if (map.size > 0) {
            this._isCanCtrl = false;
            //特效播完，且新升级一个英雄后补缺格子
            this.timeHandle = setTimeout(() => {
                this.MendMapCell();
            }, this.delayTime);
        }
    }

    CheckRunRunRun() {
        if (this.showBoosRangeCol == null && BattleData.Inst().battleInfo.GetStepNum() <= 15 && this.IsSceneBossRange()) {
            this.ReadyStageFull();
        }
    }

    IsSceneBossRange() {
        let sceneType = this.battleInfo.sceneType;
        return sceneType == SceneType.RunRunRun
            || sceneType == SceneType.ShenDian
    }

    //处理三消
    HandleSanXiao(group: HeroObj[]) {
        let len = group.length;
        //console.log("处理三消",group);
        if (group.length < 3) {
            return;
        }

        //播放音效
        let audio: AudioTag;
        switch (group.length) {
            case 3: audio = AudioTag.SanXiao; break;
            case 4: audio = AudioTag.SiXiao; break;
            case 5: audio = AudioTag.WuXiao; break;
        }
        if (audio) {
            AudioManager.Inst().Play(audio);
        }


        if (this.addStep > 0) {
            BattleData.Inst().battleInfo.AddStepNum(this.addStep);
            //PublicPopupCtrl.Inst().Center("步数" + this.addStep);
            let item = group[Math.floor(group.length / 2)]
            BattleData.Inst().CenterStepTip(item.node.worldPosition, this.addStep);
            this.battleInfo.combo_num++;
            this.report.comboAddStep += this.addStep;
        }

        let upLevel = 1;
        let isItem = group[0].IsItem();
        if (isItem) {
            upLevel = group.length - 2;
            if (upLevel > BOX_MAX) {
                upLevel = BOX_MAX
            }
            this.battleInfo.box_num++;
        } else {
            this.battleInfo.comp_hero_num++;
            this.curRoundUpCount++;
        }


        if ((isItem || group.length == 3) && this.recordChangeItems.length > 0) {
            let item = this.GetUpHero(group);
            if (item) {
                this.needUpHeros.set(item, <IHeroUpInfo>{ curData: item.data, i: item.i, j: item.j, level: upLevel });
                return;
            }
        }

        for (let i = 1; i < len - 1; i++) {
            let hero = group[i];
            //console.log(hero.data.hero_id, hero.data.stage, hero.i, hero.j)
            if (this.needUpHeros.has(hero)) {
                if (!this.needUpHeros.has(group[0])) {
                    hero = group[0]
                } else {
                    hero = group[len - 1]
                }
            }
            this.needUpHeros.set(hero, <IHeroUpInfo>{ curData: hero.data, i: hero.i, j: hero.j, level: upLevel });
            if (hero.IsItem()) {
                break;
            }
        }
    }

    GetBoxCount(): number {
        return this.boxList.length;
    }
    //处理宝箱列表
    HandleBoxList() {
        if (this.boxList.length == 0) {
            this.CheckSanXiao();
            return;
        }
        let box = this.boxList.pop();
        this.OpenBox(box);
    }
    //打开宝箱
    OpenBox(item: HeroObj) {
        this._isCanCtrl = false;
        let openBookPath = "";
        let quas: number[];
        let skillGroupId: number;
        if (item.data.stage == 3) {
            quas = [3, 0, 0];
            openBookPath = "ui/Book/purple_book";
            skillGroupId = this.dataModel.curStage.data.purple_entry_id;
        } else if (item.data.stage == 2) {
            openBookPath = "ui/Book/bule_book";
            quas = [2, 0, 0];
            skillGroupId = this.dataModel.curStage.data.blue_entry_id;
        } else {
            openBookPath = "ui/Book/yellow_book";
            quas = [1, 0, 0];
            skillGroupId = this.dataModel.curStage.data.green_entry_id;;
        }

        ResManager.Inst().LoadSpriteFrame<SpriteFrame>(openBookPath, (err, icon) => {
            item.Icon.spriteFrame = icon;
            setTimeout(() => {
                this.RemoveHero(item);
                let ishero = SceneBoxIsHero[this.battleInfo.sceneType] == true ? true : false;
                let skill_list = BattleData.Inst().RandomSkillList(quas, skillGroupId, ishero); //this.dataModel.curStage.GetSkillids(quas);
                let action = RandomSkillListAction.Create(skill_list);
                BattleCtrl.Inst().PushAction(action);
            }, 500);
        });
        // SceneEffect.Inst().Play(effectCfg, this.node, item.node.worldPosition, () => {
        //     this.RemoveHero(item);
        // }, () => {
        //     let ishero = SceneBoxIsHero[this.battleInfo.sceneType] == true ? true : false;
        //     let skill_list = BattleData.Inst().RandomSkillList(quas, skillGroupId, ishero); //this.dataModel.curStage.GetSkillids(quas);
        //     let action = RandomSkillListAction.Create(skill_list);
        //     BattleCtrl.Inst().PushAction(action);
        // });
    }

    //获取升级哪个英雄
    GetUpHero(group: HeroObj[]): HeroObj {
        for (let v of group) {
            for (let v2 of this.recordChangeItems) {
                if (v2 != null && v == v2 && !this.needUpHeros.has(v)) {
                    return v;
                }
            }
        }
    }

    //获取当前英雄数量 level[-1:所有阶段,-2:除掉阶段0的英雄]
    GetHeroCount(heroid: number, level: number): number {
        let count = 0;
        BattleScene.ForeachHeros(this.heros, (hero, i, j) => {
            if (hero && hero.data.hero_id == heroid) {
                if (hero.data.stage == level || level == -1 || (level == -2 && hero.data.stage > 0)) {
                    count++;
                }
            }
        })
        return count;
    }

    HandleSanXiaoBuff(group: HeroObj[]) {
        if (group == null || group.length == 0) {
            return
        }
        let isItem = group[0].IsItem();

        //每日首次合成时，产生英雄数量+1
        if (this.curRoundUpCount == 1 && this.battleInfo.skillAttri.isMeiRiHeChengAdd && !isItem) {
            for (let hero of group) {
                if (!this.needUpHeros.has(hero)) {
                    this.needUpHeros.set(hero, { curData: hero.data, i: hero.i, j: hero.j, level: 1 });
                    break;
                }
            }
        }

        //5消中间的多生一级的buff功能
        if (group.length == 5 && this.battleInfo.skillAttri.isWuXiaoBuff) {
            let centerHero = group[2];
            let level = centerHero.GetLevel();
            if (!centerHero.IsItem() && !centerHero.IsFull()) {
                let uplevel = 2;
                let needFull = centerHero.NeedFull();
                if (uplevel > needFull) {
                    uplevel = needFull;
                }
                this.needUpHeros.set(centerHero, { curData: centerHero.data, i: centerHero.i, j: centerHero.j, level: uplevel });
            }
        }

        //5消多的一个金币的功能
        if (group.length == 5 && this.battleInfo.skillAttri.isWuXiaoHuoDeJinBi && !isItem) {
            for (let hero of group) {
                if (!this.needUpHeros.has(hero)) {
                    this.needUpHeros.set(hero, { curData: CfgCoinData[0], i: hero.i, j: hero.j, level: 0 });
                    break;
                }
            }
        }

        //5消多加一步
        if (group.length == 5 && this.battleInfo.skillAttri.wuXiaoJiaBuShu > 0) {
            let num = this.battleInfo.skillAttri.wuXiaoJiaBuShu;
            this.battleInfo.AddStepNum(num);
            BattleData.Inst().otherInfo.skillAddStep = num;
        }
    }

    //重置英雄等级
    ResetHeroStage(hero: HeroObj, stage: number) {
        if (stage > hero.baseCfg.stage_all) {
            stage = hero.baseCfg.stage_all;
        }
        hero.ShowCreate();
        let newData = BattleData.Inst().GetHeroBattleCfg(hero.data.hero_id, stage);
        hero.SetData(newData);
        // if (hero.IsFull()) {
        //     hero.PlayMaxEffect();
        // }
    }

    //英雄升级
    HeroUp(upinfo: IHeroUpInfo) {
        let curHero = this.GetHero(upinfo.i, upinfo.j);
        if (curHero) {
            // curHero.Die(() => {
            //     this.RemoveHero(curHero);
            //     this.HeroUp(upinfo);
            // });
            // return;
            this.RemoveHero(curHero);
        }

        let data = upinfo.curData;
        let baseCfg = HeroData.Inst().GetHeroBaseCfg(data.hero_id);
        let newLevel = data.stage + upinfo.level;
        if (baseCfg && newLevel > baseCfg.level_max) {
            newLevel = baseCfg.level_max;
        }
        let newData = BattleData.Inst().GetHeroBattleCfg(data.hero_id, newLevel);
        let hero = this.CreteHero2(upinfo.i, upinfo.j, newData);
        hero.ShowCreate();
        if (hero.IsItem() && hero.data.stage > 0) {
            this.boxList.push(hero);
        }
        if (hero.IsFull()) {
            hero.PlayMaxEffect();
        }
    }
    HeroUpByHero(hero: HeroObj, level: number = 1) {
        let data = <IHeroUpInfo>{ curData: hero.data, i: hero.i, j: hero.j, level: level };
        this.HeroUp(data);
    }

    //随机英雄升级
    HeroUpRandom(num: number) {
        let canCount = this.GetNotFullCount();
        if (num > canCount) {
            num = canCount;
        }
        if (num == 0) {
            console.log("升级英雄失败，全部满级了");
            return;
        }
        let row = this.battleBG.Row;
        let list: number[] = [];
        let maxNum = MAP_COL * row - 1;
        while (list.length < num) {
            let randNum = MathHelper.GetRandomNum(0, maxNum);
            if (list.indexOf(randNum) == -1) {
                let ij = BattleScene.NumToIJ(randNum);
                let hero = this.GetHero(ij.y, ij.x);
                if (hero && !hero.IsFull() && !hero.IsItem()) {
                    list.push(randNum);
                    this.RemoveHero(hero);
                    this.HeroUp(<IHeroUpInfo>{ curData: hero.data, i: ij.y, j: ij.x, level: 1 });
                    //console.log("随机英雄升级i_j", i,j);
                }

            }
        }
    }

    //英雄变身
    HeroChange(hero: HeroObj, toHeroId: number) {
        let baseCfg = HeroData.Inst().GetHeroBaseCfg(toHeroId);
        let newLevel = hero.data.stage;
        if (newLevel > baseCfg.level_max) {
            newLevel = baseCfg.level_max;
        }
        let newData = BattleData.Inst().GetHeroBattleCfg(toHeroId, newLevel);
        hero.SetData(newData);
        hero.ShowCreate();
        // if (hero.IsFull()) {
        //     hero.PlayMaxEffect();
        // }
    }

    //获取最高等级（非满级的英雄）
    GetMaxCanUpHero(): HeroObj {
        let maxHero: HeroObj
        BattleScene.ForeachHeros(this.heros, (hero, i, j) => {
            if (hero && !hero.IsFull()) {
                if (maxHero == null || hero.stage > maxHero.stage) {
                    maxHero = hero;
                }
            }
        })
        return maxHero;
    }

    //闪烁所有的英雄
    SanSuoHero(hero_id: number) {
        BattleScene.ForeachHeros(this.heros, hero => {
            if (hero != null && hero.data.stage > 0 && hero.data.hero_id == hero_id) {
                hero.ShowUpAttri();
            }
        })
    }

    //有多少个未满级的
    GetNotFullCount(): number {
        let count = 0;
        BattleScene.ForeachHeros(this.heros, hero => {
            if (hero != null) {
                if (!hero.IsItem() && !hero.IsFull()) {
                    count++;
                }
            }
        })
        return count;
    }

    //指定场上英雄升级
    HeroUpById(id: number, level: number = 0) {
        BattleScene.ForeachHeros(this.heros, (hero) => {
            if (hero != null && !hero.IsItem() && hero.data.hero_id == id && hero.data.stage == level) {
                this.RemoveHero(hero);
                this.HeroUpByHero(hero);
            }
        })
    }
    //场上全部英雄升级
    HeroUpAll(hero_id?: number) {
        BattleScene.ForeachHeros(this.heros, (hero) => {
            if (hero != null && !hero.IsItem() && !hero.IsFull()) {
                if (hero_id == null || hero_id == 0 || hero.data.hero_id == hero_id) {
                    this.RemoveHero(hero);
                    this.HeroUpByHero(hero, 1);
                }
            }
        })
    }

    //查找指定等级的英雄
    GetHeroListByLevel(level: number): HeroObj[] {
        let heroList: HeroObj[] = [];
        BattleScene.ForeachHeros(this.heros, (hero) => {
            if (hero != null && !hero.IsItem() && hero.stage == level) {
                heroList.push(hero);
            }
        })
        return heroList;
    }
    //查找指定id的英雄
    GetHeroListById(id: number): HeroObj[] {
        let heroList: HeroObj[] = [];
        BattleScene.ForeachHeros(this.heros, (hero) => {
            if (hero != null && !hero.IsItem() && hero.data.hero_id == id) {
                heroList.push(hero);
            }
        })
        return heroList;
    }


    private mendMoveProgerss: number = 0;
    private mendCallback: () => void;
    //补缺空格子
    MendMapCell(mendCallback?: () => void) {
        if (mendCallback) {
            this.mendCallback = mendCallback;
        }
        let col = MAP_COL;
        for (let j = 0; j < col; j++) {
            let count = 0;
            let row = this.battleBG.Row;
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
            BattleScene.ForeachHeros(this.heros, (hero, i, j) => {
                if (hero == null) {
                    return;
                }
                let moveCount = this.GetCellMoveCount(hero);
                if (moveCount > 0) {
                    this.mendMoveProgerss++;
                    this.MoveHero(hero, moveCount);
                }
            })
            BattleScene.ForeachHeros(this.heros2, (hero, i, j) => {
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
                this.MendMapCellFinishCallback();
            }
        })
    }

    //补缺空格子完成回调
    MendMapCellFinishCallback() {
        if (this.mendCallback) {
            this.mendCallback();
            this.mendCallback = null;
        } else {
            if (this.battleInfo.GetBattleState() == BattleState.SanXiao) {
                this.HandleBoxList()
            }
        }
        this.heros2 = [];
    }

    //获取格子需要走几个位置
    private GetCellMoveCount(hero: HeroObj): number {
        let count = 0;
        let row = this.battleBG.Row;
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
        let pos = this.battleBG.GetPos(moveI, hero.j);
        hero.sanXiaoCtrl.MovePos(pos, () => {
            hero.SetIJ(moveI, hero.j);
            hero.InitPos(pos.x, pos.y);
            this.heros[hero.j][moveI] = hero;
            this.mendMoveProgerss--;
            if (this.mendMoveProgerss == 0) {
                this.MendMapCellFinishCallback();
            }
        }, 0.6);
    }

    // 遍历英雄
    static ForeachHeros(arr: HeroObj[][], func: (v: HeroObj, row: number, col: number) => void | boolean) {
        if (arr == null || arr.length == 0) {
            return;
        }
        for (let j = 0; j < arr.length; j++) {
            if (arr[j] == null || arr[j].length == 0) {
                continue;
            }
            let row = arr[j].length;
            for (let i = 0; i < row; i++) {
                let hero = arr[j][i]
                if (hero) {
                    if (func(hero, i, j) == true) {
                        return;
                    }
                }
            }
        }
    }

    //坐标转换 x = j, y = i
    static NumToIJ(num: number): Vec2 {
        let i = Math.ceil((num + 1) / MAP_COL) - 1;
        let j = num % MAP_COL;
        return new Vec2(j, i);
    }
    static IJToNum(v2: Vec2): number {
        let num = v2.y * MAP_COL + v2.x;
        return num;
    }
    static IJTonum2(i: number, j: number) {
        let num = i * MAP_COL + j;
        return num;
    }



    AddHero(hero: HeroObj) {
        if (this.heros[hero.j] == null) {
            this.heros[hero.j] = [];
        }
        if (this.heros[hero.j][hero.i] != null) {
            LogError("添加英雄角色异常！！这个坑位有角色了", hero.i, hero.j);
        }
        this.heros[hero.j][hero.i] = hero;
    }

    RemoveHero(hero: HeroObj, isPut: boolean = true) {
        this.heros[hero.j][hero.i] = null;
        if (isPut) {
            this.PutHeroNode(hero);
        }
    }
    RemoveAllHero() {
        BattleScene.ForeachHeros(this.heros, (v, i, j) => {
            if (v) {
                this.heros[j][i] = null;
                this.PutHeroNode(v);
            }
        });
    }

    GetHero(i: number, j: number): HeroObj {
        if (j >= this.heros.length || j < 0) {
            return null;
        }
        if (i < 0) {
            return null;
        }
        if (!this.heros[j]) {
            return null;
        }
        return this.heros[j][i];
    }

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
            SceneEffect.Inst().Play(SceneEffectConfig.JinRuZhanDou, this.node, this.node.worldPosition, null, () => {
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

        //LogError("拉尽")
        ViewManager.Inst().OpenView(BattleStartFightTip);
        //BattleData.Inst().otherInfo.monsterAttackTip = true;
        //SceneEffect.Inst().Play(SceneEffectConfig.DiJunLaiXi, this.node, this.node.worldPosition);
    }

    // 回收镜头
    EndFightAnimation(func?: Function) {
        //console.error("收镜头");
        let root = this.Root;
        let tweener = fgui.GTween.to2(FIGHT_SCALE, FIGHT_SCALE, 1, 1, 1);
        this.dynamic.AddTweenr(BattleTweenerType.Other, tweener);
        tweener.setEase(fgui.EaseType.SineOut)
        tweener.onUpdate((tweener: fgui.GTweener) => {
            root.setScale(tweener.value.x, tweener.value.y);
        })
        tweener.onComplete(() => {
            this.dynamic.RemoveTweenr(BattleTweenerType.Other, tweener);
            if (func) {
                func();
            }
        })

        let mask_sprite = this.FightMask.getComponent(Sprite);
        mask_sprite.color = new Color(255, 255, 255, 255);
        let colorTweener = fgui.GTween.to(255, 0, 1);
        colorTweener.setEase(fgui.EaseType.SineOut);
        colorTweener.onUpdate((_tweener: fgui.GTweener) => {
            mask_sprite.color = new Color(255, 255, 255, _tweener.value.x);
        })
        colorTweener.onComplete(() => {
            this.dynamic.RemoveTweenr(BattleTweenerType.Other, colorTweener);
        })
        this.dynamic.AddTweenr(BattleTweenerType.Other, colorTweener);

        let moveTweener = fgui.GTween.to(-65, 0, 1);
        moveTweener.setEase(fgui.EaseType.SineOut);
        moveTweener.onUpdate((_tweener: fgui.GTweener) => {
            root.setPosition(0, _tweener.value.x);
        })
        moveTweener.onComplete(() => {
            this.dynamic.RemoveTweenr(BattleTweenerType.Other, moveTweener);
        })
        this.dynamic.AddTweenr(BattleTweenerType.Other, moveTweener);
    }

    private failAnimating: boolean = false;  //是否失败中
    //失败镜头
    FailFightAnimation(func?: Function) {
        EventCtrl.Inst().emit(BattleEventType.GameOver, false);
        ViewManager.Inst().ShowView(BattleView, false);
        ViewManager.Inst().CloseView(BattleHarmInfoView);
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

            this.dynamic.LoadEffect(SceneEffectConfig.FailEffect2.path, this.node, effectPos);
            this.dynamic.LoadEffect("effect/ui/" + this.battleBG.data.defeat_id, this.node, effectPos);

            this.scheduleOnce(() => {
                BattleData.Inst().battleInfo.SetBattleState(BattleState.Fail);
                BattleCtrl.Inst().FightEnd(this.battleInfo.sceneType);
            }, 2);
            if (func) {
                func();
            }
        })
    }


    //怪物死亡
    MonsterDie(monster: MonsterObj) {
        EventCtrl.Inst().emit(BattleEventType.MonsterDie, monster);
        let exp = monster.exp * this.battleInfo.skillAttri.monsterExpPercent;
        BattleData.Inst().battleInfo.AddExp(exp);
        this.dynamic.RemoveMonster(monster);
        if (monster.data.monster_type == MonsterType.Boss && this.dataModel.curStage.IsFull()) {
            this.report.monsterList.push(monster.report);
        }
        //游戏状态检查
        this.CheckGameState();
    }
    //被攻击
    BeAttacked(monster: MonsterObj) {
        if (!BattleDebugData.BATTLE_DEBUG_MODE || !BattleDebugData.Inst().GodCastle) {
            BattleData.Inst().battleInfo.AddHP(-monster.attackHarm);
            this.curRoundBeAttack++;
        }
        EventCtrl.Inst().emit(BattleEventType.BeAttack);
        EventCtrl.Inst().emit(BattleEventType.MonsterDie, monster);
        EventCtrl.Inst().emit(BattleEventType.MonsterDieByWall, monster);
        this.dynamic.RemoveMonster(monster);
        this.report.monsterList.push(monster.report);
        //游戏状态检查
        this.CheckGameState();
    }

    //复活重置
    Resurgence(hp?: number) {
        this.battleInfo.hp = hp ?? DEFAULT_HP;
        this.DieAll();
        this.roundActionQueue.Clear();
        for (var queue of this.monsterQueueMap.values()) {
            queue.Clear();
        }
        this.dynamic.StopAllSkill(this.cleanKillByBossHero.bind(this));
        if (this.battleInfo.roundProgerss > 0 && this.battleInfo.roundProgerss % 10 == 0) {
            BattleData.Inst().battleInfo.AddSceneRoundIndex(-1);
            this.battleInfo.roundProgerss--;
        }
        EventCtrl.Inst().emit(BattleEventType.Pause, false);
        this.MendMapCell();
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
        BattleData.Inst().battleInfo.isPause = true;
        this.dynamic.StopAllSkill(this.cleanKillByBossHero.bind(this));
        if (this.battleInfo.skillAttri.isChengBao3 && this.curRoundBeAttack < 1) {
            let skill = BattleData.Inst().GetSkillCfg(304);
            this.battleInfo.AddHP(skill.pram1);
        }

        BattleScene.ForeachHeros(this.heros, (hero) => {
            if (hero) {
                if (hero.heroCtrl) {
                    hero.heroCtrl.OnFightEnd();
                }
                //清空角色buff
                hero.ClearBuff();
            }
        })



        this.EndFightAnimation(() => {

            //新手五消提示
            if (this.battleInfo.sceneType == SceneType.Main && this.battleInfo.sceneId == 1 && BattleData.Inst().otherInfo.newPlayerTip == false) {
                BattleData.Inst().otherInfo.newPlayerTip = true;
            }

            BattleData.Inst().battleInfo.isPause = false;
            this.ClearBossRange();
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
                        return;
                    }

                    //播放通关词条
                    BattleData.Inst().battleInfo.roundProgerss++;
                    let stageCfg = this.dataModel.data.stage[BattleData.Inst().battleInfo.stageIndex - 1];
                    let skill_list = BattleData.Inst().RandomSkillList([0, 0, 0], stageCfg.win_entry_id, false);
                    let action = RandomSkillListAction.Create(skill_list, 3);
                    BattleCtrl.Inst().PushAction(action);
                    this.isStageEndCallback = true;
                    this._isCanCtrl = false;
                    BattleData.Inst().battleInfo.SetBattleState(BattleState.SanXiao);
                    //this.StageEndCallback();
                })
                return;
            }
            BattleData.Inst().battleInfo.roundProgerss++;
            //播下一回合
            this.dynamic.StopAllSkill();
            this.PlayRound();
            let data = BattleData.Inst().GetViewRountInfo();
            BattleData.Inst().AddRountTip(data);
            //存档
            BattleCtrl.Inst().SaveBattle();
        })
    }

    //清除boss范围
    ClearBossRange() {
        this.battleBG.SetBossRange(null);
        this.battleInfo.showBoosRangeCol = null;
    }


    private isStageEndCallback: boolean = false;

    private InHeroMap: Map<HeroObj, number>;
    //阶段结束，打扫场景
    StageEndCallback() {
        if (!this.isStageEndCallback) {
            return;
        }
        this.isStageEndCallback = false;
        this.SetInHeroPos();

        //先消除所有不在场的
        BattleScene.ForeachHeros(this.heros, (hero: HeroObj, i: number, j: number) => {
            if (hero && !this.InHeroMap.has(hero)) {
                hero.Die(() => {
                    //this.PutHeroNode(hero.node);
                    this.RemoveHero(hero);
                })
            }
        });
        // 摆放位置
        this.timeHandle = setTimeout(() => {
            // 保留角色
            this.SortHerosAnimation(() => {
                this.dynamic.quickDownloadFalg = false;
                SceneEffect.Inst().PlayLoadScene(() => {
                    // 清空全部的角色
                    this._isloaded = false;
                    this.RemoveAllHero();
                    this.PlayStage();
                }, () => {
                    return this.isLoaded;
                });
            })
        }, 1000)
    }

    private cleanKillByBossHero() {
        //判断角色已在战斗中死亡
        BattleScene.ForeachHeros(this.heros, (hero) => {
            if (hero && hero.HasBuff(HeroObjBuffType.WaitDie)) {
                this.RemoveHero(hero);
            }
        })

    }

    //以下逻辑混乱和复杂，慎改！！！
    //整理英雄排列的位置
    //保留X个等级最高的角色
    //规则：每个英雄的最高阶一个，剩下两个按最高阶取
    SetInHeroPos() {
        this.InHeroMap = new Map();
        let heroLevels: HeroObj[][] = []
        this.collectHeros = [];
        BattleScene.ForeachHeros(this.heros, (v, i, j) => {
            if (v) {
                let stage = v.data.stage;
                if (heroLevels[stage] == null) {
                    heroLevels[stage] = []
                }
                heroLevels[stage].push(v);
            }
        });

        heroLevels.forEach(heros => {
            heros.sort((a, b) => {
                return a.data.hero_id - b.data.hero_id;
            })
        })

        let fisrtI = this.battleBG.Row;
        let col = -1;
        let _inBattleHeros: number[] = [];
        let maxLevel = heroLevels.length - 1;
        LogError("晋级多少个", this.battleInfo.skillAttri.stageHeroCount, maxLevel)
        for (let i = heroLevels.length - 1; i >= 0; i--) {
            let heros = heroLevels[i];
            if (heros) {
                if (col != MAP_COL - 1) {
                    fisrtI--;
                }
                heros.forEach((hero, index) => {
                    col++;
                    if (col == MAP_COL) {
                        fisrtI--;
                    }
                    col = col % MAP_COL;
                    if (fisrtI >= 0 && hero.data.hero_id != 0 && hero.data.stage > 0) {
                        let ijNum = BattleScene.IJTonum2(fisrtI, col);
                        this.InHeroMap.set(hero, ijNum);
                        //保留X个等级最高的角色
                        if (_inBattleHeros.indexOf(hero.data.hero_id) == -1 && hero.data.stage == maxLevel) {
                            this.collectHeros.push(hero);
                            _inBattleHeros.push(hero.data.hero_id)
                        }
                    }
                })
            }
        }
        for (let i = heroLevels.length - 1; i >= 0; i--) {
            let heros = heroLevels[i];
            if (heros) {
                heros = MathHelper.UpsetArr(heros);
                heros.forEach((hero, index) => {
                    if (hero.data.stage > 0 && this.collectHeros.indexOf(hero) == -1 && !hero.IsItem() && this.collectHeros.length < this.battleInfo.skillAttri.stageHeroCount) {
                        this.collectHeros.push(hero);
                    }
                })
            }
        }
        LogError("回收了多少个", this.collectHeros.length)
    }


    //排列英雄动画
    SortHerosAnimation(cp?: () => void) {
        let progress_num = this.InHeroMap.size;
        this.InHeroMap.forEach((ijNum: number, hero: HeroObj) => {
            let ij = BattleScene.NumToIJ(ijNum);
            let pos = this.battleBG.GetPos(ij.y, ij.x);
            hero.i = ij.y;
            hero.j = ij.x;
            hero.sanXiaoCtrl.MovePos(pos, () => {
                progress_num--;
                if (progress_num == 0) {
                    this.CollectHeroAnimation(cp);
                }
            }, 1.2, fgui.EaseType.QuadOut);
        })
        if (progress_num == 0) {
            this.CollectHeroAnimation(cp);
        }
    }

    //回收英雄动画
    private collectHeros: HeroObj[];
    private collect_timer_handle: TYPE_TIMER;
    CollectHeroAnimation(cp?: () => void) {
        if (this.collectHeros == null || this.collectHeros.length < 1) {
            if (cp) {
                cp();
                cp = null;
            }
            return
        }
        this.collectHeros.sort((a, b) => {
            if (a.i == b.i) {
                return b.j - a.j;
            }
            return a.i - b.i;
        })
        this.heroProtects = [];
        this.collectHeros.forEach(hero => {
            this.heroProtects.push(hero.data);
        })
        let times = this.collectHeros.length;
        this.collect_timer_handle = Timer.Inst().AddRunTimer(() => {
            if (this.collectHeros.length == 0) {
                if (cp) {
                    cp();
                    cp = null;
                }
            } else {
                let hero = this.collectHeros.pop();
                SceneEffect.Inst().Play(SceneEffectConfig.HeroOut, this.node, hero.node.worldPosition)
                AudioManager.Inst().PlaySceneAudio(AudioTag.baoxiangquanbu, 0);
                //this.RemoveHero(hero);    //在SortHerosAnimation里打乱了ij这里不能直接销毁。后面会全部清除
                hero.node.active = false;
            }
        }, 0.2, times + 1, false)
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

    /**获取随机英雄 noItem:是否筛选能升级的 */
    GetRandomHero(obj?: HeroObj, noItem?: boolean, limitLevel?: number): (HeroObj | undefined) {
        let hero;
        let time = 0;
        do {
            time += 1;
            if (time >= this.heros[0].length * this.heros.length) {
                return undefined;
            }
            let heros = this.heros;
            let num_col = MAP_COL - 1;
            let num_row = BattleCtrl.Inst().battleScene.battleBG.Row - 1;
            let col = MathHelper.GetRandomNum(0, num_col);
            let row = MathHelper.GetRandomNum(0, num_row);
            hero = heros[col][row];
            if (hero) {
                if (hero.HasBuff(HeroObjBuffType.WaitDie)) {
                    hero = undefined;
                } else if (noItem == true && hero.IsItem()) {
                    hero = undefined;
                } else if (limitLevel != null && hero.stage < limitLevel) {
                    hero = undefined;
                }
            }

        } while (!hero || (obj && (obj == hero)))
        return hero;
    }

    //创建云
    CreateCloud() {
        let cloud = this.cloudPool.Get();
        cloud.setParent(this.BottomSkillRoot);
        let mono = cloud.getComponent(CloudObj);
        mono.SetIcon(MathHelper.GetRandomNum(0, 2))
        mono.Play(MathHelper.GetRandomNum(0, 1))
        mono.SetTimeScale(MathHelper.GetRandomNum(0.85, 1.2));
        let posB = this.battleBG.GetWorldPos(0, 0);
        let posT = this.battleBG.GetWorldPos(this.battleInfo.mapRow - 1, 0);
        let posY = MathHelper.GetRandomNum(posB.y, posT.y);
        cloud.setWorldPosition(this.node.worldPosition.x, posY, 0);
        mono.SetMovedFunc((_mono: CloudObj) => {
            this.cloudPool.Put(_mono.node);
        })
    }

    //打乱全场英雄顺序
    private awapAllHeroProgerss: number = 0;
    SwapAllHero() {
        let heroList: HeroObj[] = [];
        BattleScene.ForeachHeros(this.heros, (hero, i, j) => {
            if (hero) {
                heroList.push(hero);
            }
        });
        heroList = MathHelper.UpsetArr(heroList);
        for (let i = 0; i < heroList.length; i += 2) {
            if (i + 1 < heroList.length) {
                this.awapAllHeroProgerss++;
                this.SwapHero(heroList[i], heroList[i + 1], () => {
                    this.awapAllHeroProgerss--;
                    if (this.awapAllHeroProgerss == 0) {
                        //this.CheckSanXiao();
                        this.MendMapCell();
                    }
                });
            }
        }
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
}


//场景数据模型
export class BattleSceneModel {
    data: CfgSceneData;
    private roundGroup: CfgSceneRound[][];
    private stages: BattleStageModel[];
    private monsterTipMap: Map<number, boolean>;     //怪物提醒记录
    get curRoundGroup(): CfgSceneRound[] {
        let round_index = BattleData.Inst().battleInfo.GetSceneRoundIndex();
        let id = this.curStage.GetRoundId(round_index)
        return this.roundGroup[id];
    }
    get curStage(): BattleStageModel {
        let index = BattleData.Inst().battleInfo.GetSceneStageIndex();
        if (index >= this.stages.length) {
            return this.stages[this.stages.length - 1];
        }
        return this.stages[index];
    }
    constructor(data: CfgSceneData) {
        this.data = data;
        this.stages = [];
        for (var v of data.barrier) {
            let cfg = this.GetStageCfg(v.stage_id);
            let stageModel = new BattleStageModel(cfg);
            this.stages.push(stageModel);
        }
        this.roundGroup = DataHelper.TabGroup(data.round, "round_id");
        BattleData.Inst().battleInfo.roundProgerssMax = this.roundGroup.length - 1;
        this.monsterTipMap = new Map();
    }


    GetStageCfg(stage_id: number): CfgSceneStage {
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

    GetMonsterTipKey(data: CfgMonsterData) {
        let key = RoleData.Inst().InfoRoleId + "battlemonstertip_19_" + BattleData.Inst().battleInfo.sceneId + "_" + data.monster_id;
        return key;
    }
    //怪物是否提示
    IsMonsterTip(data: CfgMonsterData): boolean {
        if (this.monsterTipMap.has(data.monster_id)) {
            return false;
        }
        if (data.describe_type !== 0 && data.describe_type !== 1) {
            return false
        }
        if (data.describe_type == 1) {
            return true;
        } else {
            let key = this.GetMonsterTipKey(data);
            let value = sys.localStorage.getItem(key);
            if (value == null) {
                return true;
            }
        }

        return false;
    }
    RecordMonsterTip(data: CfgMonsterData) {
        if (this.monsterTipMap.has(data.monster_id)) {
            return false;
        }
        this.monsterTipMap.set(data.monster_id, true);
        if (data.describe_type != 1) {
            let key = this.GetMonsterTipKey(data);
            sys.localStorage.setItem(key, "1");
        }
    }
}

//阶段数据模型
export class BattleStageModel {
    data: CfgSceneStage;
    private round_ids: number[]
    constructor(data: CfgSceneStage) {
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

    private attCfg: CfgBarrierAttInfo;
    AttCfg(): CfgBarrierAttInfo {
        if (this.attCfg == null) {
            this.attCfg = BattleData.Inst().GetSceneAtt(BattleData.Inst().battleInfo.sceneId, this.data.stage_id);
        }
        return this.attCfg;
    }
}
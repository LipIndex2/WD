import { Node, game, sys } from "cc";
import { DEBUG } from "cc/env";
import { LogError, LogWxError } from "core/Debugger";
import { ObjectPool } from "core/ObjectPool";
import { NetManager } from "manager/NetManager";
import { ViewManager } from "manager/ViewManager";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseCtrl, regMsg } from "modules/common/BaseCtrl";
import { CommonId } from "modules/common/CommonEnum";
import { EventCtrl } from "modules/common/EventCtrl";
import { Language } from "modules/common/Language";
import { Prefskey } from "modules/common/PrefsKey";
import { HeroData } from "modules/hero/HeroData";
import { BreakLineInfo, BreakLineView } from "modules/main/BreakLineView";
import { MainMenu } from "modules/main/MainMenu";
import { MainFBData } from "modules/main_fb/MainFBData";
import { DialogTipsView } from "modules/public_popup/DialogTipsView";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { PackageData } from "preload/PkgData";
import { PreloadToolFuncs } from "preload/PreloadToolFuncs";
import { AnyNestedObject } from "protobufjs";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { BattleAction, IStartArenaBattleActionData, IStartBattleActionData, IStartDefBattleActionnData, RandomSkillListAction, StartArenaBattleAction, StartBattleAction, StartDefBattleAction } from "./BattleAction";
import { BATTLE_SCENE_PATH, BattleEventType, BattleState, DEFAULT_HP, BattleModel, DEF_MAP_ROW, DEF_MAP_COL, BattleObjTag, SceneType } from "./BattleConfig";
import { BattleData, BattleInfo, BattleInfoSave, IBattleHeroInfo } from "./BattleData";
import { BattleDebugData } from "./BattleDebugCfg";
import { BattleFinishView } from "./BattleFinishView";
import { BattleScene, BattleSceneModel, IBattleScene } from "./BattleScene";
import { BattleView } from "./BattleView";
import { DefBattleScene } from "./DefBattleScene";
import { BattleDebugView } from "./View/BattleDebugView";
import { BattleHarmInfoView } from "./View/BattleHarmInfoView";
import { BattleReliveView } from "./View/BattleReliveView";
import { BattleDefView } from "./View/BattleDefView";
import { ArenaBattleScene } from "./ArenaBattleScene";
import { BattleArenaView } from "./View/BattleArenaView";
import { ArenaRankChange } from "modules/Arena/ArenaRankChange";
import { ArenaData } from "modules/Arena/ArenaData";
import { Mod } from "modules/common/ModuleDefine";
import { ReportManager, ReportType } from "../../proload/ReportManager";
import { RoleCtrl } from "modules/role/RoleCtrl";
import { RoleData } from "modules/role/RoleData";
import { DBD_QUERY_PARAMS, DBDNet } from "../../DBDataManager/DBDNet";
import { ActivityCombatData } from "modules/ActivityCombat/ActivityCombatData";
import { TimeHelper } from "../../helpers/TimeHelper";
import { ShopData } from "modules/shop/ShopData";

// 待测试，七日英雄卡词条，每日挑战词条

// info还需检查， battledata  AddSkill添加词条
// 词条相关 HeroSkillChangeListener
export class BattleCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCBattleReport, func: this.SCBattleReportCallback },
            { msgType: PB_SCBattleRevive, func: this.SCBattleRevive },
            { msgType: PB_SCBattleBuffRefresh, func: this.SCBattleFlushSkillList },
            { msgType: PB_SCBattleSpeed3, func: this.OnScBattleSpeed3 },
        ]
    }

    //是否战斗中
    IsBattle() {
        return this.adapterBattleScene != null;
    }

    //结算
    private isFinish = false;
    FightEnd(sceneType: SceneType = SceneType.Main) {
        if (this.isFinish) {
            return;
        }
        let state = BattleData.Inst().battleInfo.GetBattleState();
        if (state == BattleState.Win || state == BattleState.Fail) {
            let isWin = state == BattleState.Win ? true : false;
            let roundNum = BattleData.Inst().battleInfo.roundProgerss
            BattleCtrl.Inst().SendBattleRet(isWin, sceneType, roundNum, [BattleData.Inst().battleInfo.sceneId]);
            this.isFinish = true;
        }
    }

    //发送战斗结果 params[0] == 关卡id
    SendBattleRet(result: boolean, scene_type: SceneType, roundNum: number, params: number[]) {
        LogError("开始发送战斗结果", result, scene_type, roundNum, params)
        let protocol = this.GetProtocol(PB_CSBattleRet, {
            care: PB_SCBattleReport as AnyNestedObject, func: () => {
                if (!ViewManager.Inst().IsOpen(BreakLineView)) {
                    let bl = ObjectPool.Get(BreakLineInfo);
                    bl.str_close = Language.BreakLIne.cencel;
                    bl.str_tautology = Language.BreakLIne.confim;
                    bl.tip = Language.BreakLIne.noNet;
                    bl.title = Language.BreakLIne.diffNet;
                    let BreakLine = ViewManager.Inst().OpenView(BreakLineView, bl) as BreakLineView
                    BreakLine.setOnBtnTautology(() => {
                        NetManager.Inst().reSend();
                    });
                    BreakLine.setOnBtnClose(() => {
                        NetManager.Inst().cleanReSend(PB_CSBattleRet as AnyNestedObject);
                        ViewManager.Inst().CloseView(BreakLineView);
                    });
                }
            }
        });
        let battleInfo = BattleData.Inst().battleInfo;
        if (!result) {
            roundNum--;
        }
        protocol.battleResult = result ? 1 : 0;
        protocol.battleMode = scene_type;
        protocol.battleRound = roundNum;
        protocol.battleParam = params;

        protocol.roundList = battleInfo.reports;
        protocol.killElite = battleInfo.kill_elite;
        protocol.killBoss = battleInfo.kill_boss;
        protocol.killMonster = battleInfo.kill_monster;
        protocol.comboNum = battleInfo.combo_num;
        protocol.boxNum = battleInfo.box_num;
        protocol.compNum = battleInfo.comp_hero_num;

        //伤害数据验证
        if (protocol.roundList) {
            protocol.roundList.forEach(roundInfo => {
                let monsterList = roundInfo.monsterList;
                let heroList = roundInfo.heroList;
                if (monsterList && heroList) {
                    monsterList.forEach(info => {
                        info.attackList.forEach(attInfo => {
                            let _heroInfo = heroList[attInfo.heroIndex]
                            if (_heroInfo == null || _heroInfo.heroId == 0) {
                                LogError("战斗战报数据异常", attInfo.heroIndex, _heroInfo)
                            }
                        })
                    })
                }
            })
        }

        //伤害信息
        let heroInfos: IBattleHeroInfo[] = battleInfo.hero_infos;
        if (heroInfos == null || heroInfos.length == 0) {
            heroInfos = HeroData.Inst().GetInBattleHeroInfos();
        }

        let harmList: IPB_BattleHeroInfo[] = [];
        for (let i = 0; i < 4; i++) {
            let info = heroInfos[i];
            let cs_info = <IPB_BattleHeroInfo>{};
            if (info) {
                cs_info.heroId = info.heroId;
                cs_info.heroDamage = BattleData.Inst().GetRecordAttackValue(info.heroId);
                cs_info.heroLevel = info.heroLevel;
            } else {
                cs_info.heroId = 0;
                cs_info.heroDamage = 0;
                cs_info.heroLevel = 1;
            }
            harmList.push(cs_info);
        }
        protocol.heroList = harmList;
        LogError("伤害信息", harmList)

        LogError("结算奖励请求》", protocol);
        MainFBData.Inst().SelId = -1
        this.SendToServer(protocol);
        //console.log("战斗信息记录", battleInfo.reports)
    }

    isSaveChack = true;
    //结算奖励下发
    private SCBattleReportCallback(protocol: PB_SCBattleReport) {
        LogError("结算奖励下发", protocol);
        if (this.isSaveChack) {
            if (this.adapterBattleScene == null) {
                LogError("战斗结算失败，战斗场景为空");
                return;
            }
            let state = BattleData.Inst().battleInfo.GetBattleState();
            if (state != BattleState.Fail && state != BattleState.Win) {
                LogError("战斗结算失败，状态不对", state);
                return;
            }
        }
        BattleData.Inst().SetFinishInfo(protocol);
        ViewManager.Inst().OpenView(BattleFinishView);

        // 如果是僵尸冲冲冲，记录杀死的boss数量
        if (BattleData.Inst().GetBattleInfo(BattleObjTag.Player).sceneType === SceneType.RunRunRun) {
            DBDNet.Inst().getSignature({ uid: RoleData.Inst().InfoRoleInfo.roleId }, (data: DBD_QUERY_PARAMS) => {
                const curTime = Date.now();
                let shop_box_info = { time: curTime, openBoxTimes: ShopData.Inst().boxOpenTimes };
                if (!data["zombie_info"]) {
                    data["zombie_info"] = { fightCount: [1], killRewardIsFetch: [0], killNum: BattleData.Inst().GetBattleInfo(BattleObjTag.Player).kill_boss, dailyWeakness: 0, time: curTime };
                    DBDNet.Inst().setSignature({ uid: RoleData.Inst().InfoRoleInfo.roleId, zombie_info: data["zombie_info"], shop_box_info: shop_box_info, payMoneyInfo: ShopData.Inst().payMoneyInfo }, () => {
                        ActivityCombatData.Inst().onZombieInfoDBD(data["zombie_info"]);
                    });
                } else {
                    data["zombie_info"].killNum += BattleData.Inst().GetBattleInfo(BattleObjTag.Player).kill_boss;
                    data["zombie_info"].fightCount[0]++;

                    // 是否需要刷新挑战次数
                    if (!TimeHelper.isSameDay(data.zombie_info.time, curTime)) {
                        data.zombie_info.time = curTime;
                        data.zombie_info.killRewardIsFetch = [0, 0, 0];
                    }
                    data["zombie_info"].time = curTime;

                    DBDNet.Inst().setSignature({ uid: RoleData.Inst().InfoRoleInfo.roleId, zombie_info: data["zombie_info"], shop_box_info: shop_box_info, payMoneyInfo: ShopData.Inst().payMoneyInfo }, () => {
                        ActivityCombatData.Inst().onZombieInfoDBD(data["zombie_info"]);
                    });
                    ActivityCombatData.Inst().onZombieInfoDBD(data["zombie_info"]);
                }
            });
        }

        this.isSaveChack = true;
        this.CancelSave();
    }

    //通知复活
    isServerRevive: boolean = false;
    private SCBattleRevive(protocol: PB_SCBattleRevive) {
        LogError("复活协议", protocol)
        if (this.adapterBattleScene == null) {
            return;
        }
        let reviveScale = protocol.reviveHp / 100;
        this.adapterBattleScene.Resurgence(Math.floor(DEFAULT_HP * reviveScale));
        this.isServerRevive = true;
        ViewManager.Inst().CloseView(BattleReliveView)
    }

    //通知刷词条
    private SCBattleFlushSkillList(protocol: PB_SCBattleBuffRefresh) {
        LogError("广告刷词条")
        if (this.adapterBattleScene == null) {
            return;
        }
        if (BattleData.Inst().randomSkillRecord) {
            let info = BattleData.Inst().randomSkillRecord;
            let skill_list = BattleData.Inst().RandomSkillList(info.quas, info.group_id, info.is_get_hero);
            let action = RandomSkillListAction.Create(skill_list, RandomSkillListAction.param);
            BattleCtrl.Inst().PushAction(action);
            BattleData.Inst().randomSkillRecord = null;
        }
    }

    //每日增益
    private SCBattleToDayBuff(protocol: PB_SCTodayGainInfo) {
        LogError("每日增益下发", protocol);
        BattleData.Inst().toDayBuff = protocol;
    }

    //试用3倍数
    private OnScBattleSpeed3(protocol: PB_SCBattleSpeed3) {
        BattleData.Inst().battleInfo.isFreeSpeed3 = true;
        //BattleData.Inst().battleInfo.globalTimeScaleShow = 3;
        if (ViewManager.Inst().IsOpen(BattleView)) {
            let view = <BattleView>ViewManager.Inst().getView(BattleView);
            if (view) {
                let key = Prefskey.GetBattleFreeSpeedKey();
                sys.localStorage.setItem(key, "1");
                view.PlayFreeSpeed();
            }
        }
    }

    // 事件链表
    private headAction: BattleAction;
    private endAction: BattleAction;
    private curAction: BattleAction;     //当前执行的

    battleScene: BattleScene;
    battleSceneDef: DefBattleScene;
    battleModel: BattleModel;

    battleSceneArena_A: ArenaBattleScene;
    battleSceneArena_B: ArenaBattleScene;
    battleScenePlatform: Node;

    get adapterBattleScene(): IBattleScene {
        return this.GetBattleScene();
    }

    GetBattleScene(tag: BattleObjTag = BattleObjTag.Player): IBattleScene {
        if (this.battleModel == BattleModel.Defense) {
            return this.battleSceneDef;
        } else if (this.battleModel == BattleModel.Arena) {
            if (tag == BattleObjTag.Player) {
                return this.battleSceneArena_A;
            } else {
                return this.battleSceneArena_B;
            }
        }
        else {
            return this.battleScene;
        }
    }

    GetAdapterScene(tag: number, model: BattleModel = this.battleModel): IBattleScene {
        if (model == BattleModel.Defense) {
            return this.battleSceneDef;
        } else if (model == BattleModel.Arena) {
            return this.battleSceneArena_A;
        }
        else {
            return this.battleScene;
        }
    }

    //进入战斗  saveData:存档信息
    EnterBattle(sceneId: number = 1, sceneType: SceneType = SceneType.Main, saveData?: BattleInfoSave): boolean {
        LogError("进入战斗", sceneId, sceneType)
        if (BattleData.Inst().battleInfo.sceneId != null) {
            return false;
        }
        if (ViewManager.Inst().IsOpen(DialogTipsView) && !ViewManager.Inst().IsOpened(DialogTipsView)) {
            return false;
        }

        if (sceneId < 0) {
            PublicPopupCtrl.Inst().Center("进入战斗失败，场景id==" + sceneId);
            return false;
        }

        //ChannelAgent.Inst().GC();

        // if (GuideCtrl.Inst().CurStepCfg()) {
        //     return false
        // }
        if (!BattleDebugData.BATTLE_DEBUG_MODE) {
            if (!BattleData.Inst().IsGuide() &&
                (sceneType == SceneType.Main || sceneType == SceneType.Coin || sceneType == SceneType.Fragment || sceneType == SceneType.DayChallenge)
                && Item.GetNum(CommonId.Energy) < 5) {
                PublicPopupCtrl.Inst().Center(Language.Battle.Tip1);
                return false;
            }
            let count = BattleData.Inst().FightHeroCount();
            if (sceneType != SceneType.Arena && count < 4) {
                PublicPopupCtrl.Inst().Center(Language.Battle.Tip2);
                return false;
            }

            if (sceneType == SceneType.Arena && ArenaData.Inst().fightItemNum < 1) {
                PublicPopupCtrl.Inst().ItemNotEnoughNotice(CommonId.ArenaItemId);
                return false;
            }
        }

        switch (sceneType) {
            case SceneType.Arena:
                ReportManager.Inst().sendPoint(ReportType.gameModelInfo, [Mod.Arena.View, 0, 0, RoleData.Inst().InfoRoleId], "mod-" + Mod.Arena.View)
                break;
            case SceneType.Coin:
                ReportManager.Inst().sendPoint(ReportType.gameModelInfo, [Mod.ActivityCombat.Gold, 0, 0, RoleData.Inst().InfoRoleId], "mod-" + Mod.ActivityCombat.Gold)
                break;
            case SceneType.RunRunRun:
                ReportManager.Inst().sendPoint(ReportType.gameModelInfo, [Mod.ActivityCombat.Zombie, 0, 0, RoleData.Inst().InfoRoleId], "mod-" + Mod.ActivityCombat.Zombie)
                break;
            case SceneType.DayChallenge:
                ReportManager.Inst().sendPoint(ReportType.gameModelInfo, [Mod.ActivityCombat.EverydayFB, 0, 0, RoleData.Inst().InfoRoleId], "mod-" + Mod.ActivityCombat.EverydayFB)
                break;
            case SceneType.ShenDian:
                ReportManager.Inst().sendPoint(ReportType.gameModelInfo, [Mod.LoseTemple.View, 0, 0, RoleData.Inst().InfoRoleId], "mod-" + Mod.LoseTemple.View)
                break;
        }


        if (sceneType == SceneType.Defense) {
            let actionParam = <IStartDefBattleActionnData>{ sceneId: sceneId, sceneType: sceneType, saveData: saveData };
            let action = new StartDefBattleAction(actionParam);
            this.battleModel = BattleModel.Defense;
            this.StartAction(action);
        } else if (sceneType == SceneType.Arena) {
            let actionParam = <IStartArenaBattleActionData>{ sceneId: sceneId, sceneType: sceneType, saveData: saveData };
            let action = new StartArenaBattleAction(actionParam);
            this.battleModel = BattleModel.Arena;
            this.StartAction(action);
        }
        else {
            let actionParam = <IStartBattleActionData>{ scenePath: BATTLE_SCENE_PATH, sceneId: sceneId, sceneType: sceneType, saveData: saveData };
            let action = new StartBattleAction(actionParam);
            this.battleModel = BattleModel.Normal;
            this.StartAction(action);
        }
        window.onerror = this.OnError.bind(this);
        this.isFinish = false;
    }

    //进入指引战斗
    EnterBattleGuide() {
        BattleData.Inst().SetGuide(true);
        this.EnterBattle();
    }

    ExitBattle(isEventEmit: boolean = true) {
        if (this.adapterBattleScene == null) {
            return;
        }
        if (isEventEmit) {
            EventCtrl.Inst().emit(BattleEventType.BattleExit, BattleData.Inst().battleInfo.sceneType);
        }

        if (this.battleScene) {
            this.battleScene.Delete();
            this.battleScene.node.destroy();
            this.battleScene = null;
        }
        if (this.battleSceneDef) {
            this.battleSceneDef.Delete();
            this.battleSceneDef.node.destroy();
            this.battleSceneDef = null;
        }
        if (this.battleSceneArena_A) {
            this.battleSceneArena_A.Delete();
            this.battleSceneArena_A.node.destroy();
            this.battleSceneArena_A = null;
        }
        if (this.battleSceneArena_B) {
            this.battleSceneArena_B.Delete();
            this.battleSceneArena_B.node.destroy();
            this.battleSceneArena_B = null;
        }

        this.headAction = null;
        this.endAction = null;

        BattleData.Inst().battleInfo.sceneId = null;
        BattleData.Inst().robotBattleInfo.sceneId = null;
        // ViewManager.Inst().MainViewVisible(true);
        ViewManager.Inst().CloseView(BattleView);
        ViewManager.Inst().CloseView(BattleDebugView);
        ViewManager.Inst().CloseView(BattleReliveView);
        ViewManager.Inst().CloseView(BattleHarmInfoView);
        ViewManager.Inst().CloseView(BattleDefView);
        ViewManager.Inst().CloseView(BattleArenaView);
        ViewManager.Inst().OpenView(MainMenu)
        ViewManager.Inst().ShowBattle(false);
        AudioManager.Inst().PlayBg(AudioTag.ZhuJieMian);

        window.onerror = null;
        //ChannelAgent.Inst().GC();

        if (this.battleScenePlatform) {
            this.battleScenePlatform.destroy();
            this.battleScenePlatform = null;
        }

        if (this.battleModel == BattleModel.Arena) {
            ViewManager.Inst().OpenView(ArenaRankChange, ArenaData.Inst().rankChange);
        }

        this.battleModel = null;
    }


    StartAction(action: BattleAction) {
        this.headAction = action;
        this.endAction = action;
        this.ExecuteAction(this.headAction);
    }

    PushAction(action: BattleAction) {
        let isExecute = this.curAction == this.endAction;
        this.endAction.nextAction = action;
        this.endAction = action;
        if (isExecute) {
            this.ExecuteAction(action);
        }
    }

    ExecuteAction(action: BattleAction) {
        this.curAction = action;
        action.Execute();
    }


    SaveBattle(scene: BattleScene = this.battleScene) {
        console.log("开始存档");
        let battleInfo = scene.battleInfo;
        if (!battleInfo.isSave) {
            return;
        }
        BattleScene.ForeachHeros(scene.heros, (hero, i, j) => {
            if (hero) {
                let posIndex = BattleScene.IJTonum2(i, j);
                battleInfo.heroInfoMap.set(posIndex, hero.data);
            }
        })
        let data = BattleInfo.ConvertSaveData(battleInfo);
        //设置到期时间
        if (battleInfo.sceneType == SceneType.Main) {
            data.storageLifeTime = -1;
        } else {
            data.storageLifeTime = TimeCtrl.Inst().tomorrowStarTime;
        }

        //设置版本号
        data.version = BattleData.Inst().GetVersion(battleInfo.sceneType, battleInfo.sceneId);

        let json = JSON.stringify(data);
        sys.localStorage.setItem(Prefskey.GetBattkeSaveKey(), json);
        battleInfo.heroInfoMap.clear();
        sys.localStorage.setItem(Prefskey.GetBattkeSaveVersionKey(), "1");
        console.log("存档成功");
    }

    //守卫后院保存战斗
    SaveBattleDef(scene: DefBattleScene = this.battleSceneDef) {
        console.log("开始存档");
        let battleInfo = scene.battleInfo;
        if (!battleInfo.isSave) {
            return;
        }

        scene.heroMap.forEach((hero, key) => {
            if (hero) {
                battleInfo.heroInfoMap.set(key, hero.data);
            }
        })

        let data = BattleInfo.ConvertSaveData(battleInfo);
        //设置到期时间
        if (battleInfo.sceneType == SceneType.Main) {
            data.storageLifeTime = -1;
        } else {
            data.storageLifeTime = TimeCtrl.Inst().tomorrowStarTime;
        }

        //设置版本号
        data.version = BattleData.Inst().GetVersion(battleInfo.sceneType, battleInfo.sceneId);

        let json = JSON.stringify(data);
        sys.localStorage.setItem(Prefskey.GetBattkeSaveKey(), json);
        battleInfo.heroInfoMap.clear();
        sys.localStorage.setItem(Prefskey.GetBattkeSaveVersionKey(), "1");
        console.log("存档成功");
    }

    //保存存档文件到本地
    SaveFileToLocal() {
        if (DEBUG) {
            let json = sys.localStorage.getItem(Prefskey.GetBattkeSaveKey());
            if (json == null || json == "") {
                return;
            }
            let fileName = BattleData.Inst().battleInfo.sceneId + "-" + BattleData.Inst().battleInfo.roundProgerss + "存档_.txt";
            let blob = new Blob([json],);
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = fileName;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // let fileName = "关卡" + this.battleScene.battleInfo.sceneId + "回合" + this.battleScene.battleInfo.roundProgerss + "战斗存档.txt";
            // let file = new File([json], fileName, {type:"text/plain"});
            // let tmpLink = document.createElement("a");
            // let objUrl = URL.createObjectURL(file);

            // tmpLink.href = objUrl;
            // tmpLink.download = file.name;
            // document.body.appendChild(tmpLink);
            // tmpLink.click();

            // document.body.removeChild(tmpLink);
            // URL.revokeObjectURL(objUrl);
        }
    }

    InputFile() {
        if (PackageData.Inst().getQueryData().param_list.save_url) {
            PreloadToolFuncs.HttpGetJson(PackageData.Inst().getQueryData().param_list.save_url,
                (statusCode, resp, respText) => {
                    let saveData = this.ConvertSaveData(respText);
                    this.EnterBattle(saveData.sceneId, saveData.sceneType, saveData);
                });
            return;
        }

        let inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.addEventListener('change', (event) => {
            let fileList = (event.target as HTMLInputElement).files;
            let file = fileList[0];
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => {
                let content = reader.result as string;
                if (content != null && content != "") {
                    let saveData = this.ConvertSaveData(content);
                    this.EnterBattle(saveData.sceneId, saveData.sceneType, saveData);
                }
            };
        });
        inputElement.click();
    }


    GetSaveData(): BattleInfoSave {
        let verion = sys.localStorage.getItem(Prefskey.GetBattkeSaveVersionKey())
        if (verion == null || verion == "") {
            sys.localStorage.setItem(Prefskey.GetBattkeSaveKey(), "");
            return null;
        }
        let json = sys.localStorage.getItem(Prefskey.GetBattkeSaveKey());
        if (json == null || json == "") {
            return null;
        }
        let data = <BattleInfoSave>JSON.parse(json);
        if (data.storageLifeTime && data.storageLifeTime > 0) {
            let curTime = TimeCtrl.Inst().ClientTime;
            if (curTime >= data.storageLifeTime) {
                sys.localStorage.setItem(Prefskey.GetBattkeSaveKey(), "");
                return null;
            }
        }
        let curSceneVersion = BattleData.Inst().GetVersion(data.sceneType, data.sceneId) ?? 1;
        if (data.version != curSceneVersion) {
            sys.localStorage.setItem(Prefskey.GetBattkeSaveKey(), "");
            return null;
        }
        return data;
    }

    ConvertSaveData(json: string): BattleInfoSave {
        let data = <BattleInfoSave>JSON.parse(json);
        return data;
    }

    CancelSave() {
        sys.localStorage.setItem(Prefskey.GetBattkeSaveKey(), "");
    }


    //异常捕捉
    OnError(errorMessage: any, scriptURL: any, lineNumber: any) {
        window.onerror = null;
        LogWxError("战斗异常捕捉", errorMessage, scriptURL, lineNumber);
        if (DEBUG) {
            this.SaveFileToLocal();
        }
    }
}


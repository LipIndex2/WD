import { Node, Prefab, UITransform, instantiate } from "cc";
import { LogError, LogWxError } from "core/Debugger";
import { ResManager } from "manager/ResManager";
import { BattleCtrl } from "./BattleCtrl";
import { BattleScene } from "./BattleScene";
import { CameraManager } from "manager/CameraManager";
import { ViewManager } from "manager/ViewManager";
import { BattleView } from "./BattleView";
import { MainMenu } from "modules/main/MainMenu";
import { BattleEventType, BATTLE_DEF_SCENE_PATH, SceneType, SP_SKILL_ID_A, BATTLE_ARENA_SCENE_PATH, BATTLE_PLATFORM_PATH, BattleObjTag } from "./BattleConfig";
import { CfgSkillData } from "config/CfgEntry";
import { BattleData, BattleInfoSave } from "./BattleData";
import { CfgManager } from "manager/CfgManager";
import { CfgSceneData, GetSceneCfgPath } from "config/CfgScene";
import { SceneEffect } from "modules/scene_obj_spine/Effect/SceneEffect";
import { BattleDebugView } from "./View/BattleDebugView";
import { LoginView } from "modules/login/LoginView";
import { DEBUG } from "cc/env";
import { EventCtrl } from "modules/common/EventCtrl";
import { PackageData } from "preload/PkgData";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { CfgSceneDefData } from "config/CfgSceneDef";
import { DefBattleScene } from "./DefBattleScene";
import { BattleDefView } from "./View/BattleDefView";
import { TopLayerView } from "modules/main/TopLayerView";
import { LoginData } from "modules/login/LoginData";
import { ArenaBattleScene } from "./ArenaBattleScene";
import * as fgui from "fairygui-cc";
import { BattleArenaView } from "./View/BattleArenaView";
// 战斗事件
export class BattleAction {
    protected data: any;
    nextAction: BattleAction;
    private _isDone: boolean = false;
    get isDone(): boolean {
        return this._isDone;
    }

    protected set isDone(v: boolean) {
        this._isDone = v;
        if (this._isDone) {
            this.DoneCallback();
            if (this.nextAction) {
                BattleCtrl.Inst().ExecuteAction(this.nextAction);
            }
        }
    }

    Execute() {

    }

    protected DoneCallback() {

    }
}


export interface IStartBattleActionData {
    scenePath: string;
    sceneId: number;
    sceneType: SceneType;
    saveData?: BattleInfoSave;
}

//开始游戏事件
export class StartBattleAction extends BattleAction {
    data: IStartBattleActionData;

    constructor(data: IStartBattleActionData) {
        super();
        this.data = data;
    }
    private scene: BattleScene;

    Execute(): void {
        BattleData.Inst().battleInfo.sceneType = this.data.sceneType;
        BattleData.Inst().battleInfo.sceneId = this.data.sceneId;
        SceneEffect.Inst().PlayLoadScene(this.LoadScene.bind(this), () => {
            if (this.scene == null) {
                return false;
            }
            return this.scene.isLoaded // && this.scene.dynamic.IsPreloaded();
        });
        this.StartPrrload();
    }

    StartPrrload() {
        AudioManager.Inst().PreloadClip(AudioTag.SanXiao);
        AudioManager.Inst().PreloadClip(AudioTag.SiXiao);
        AudioManager.Inst().PreloadClip(AudioTag.WuXiao);
    }

    LoadScene() {
        LogError("执行开始游戏事件", this.data);
        if (ViewManager.Inst().IsOpened(LoginView)) {
            ViewManager.Inst().CloseView(LoginView);
        }
        ViewManager.Inst().ShowBattle(true);
        let resPath = GetSceneCfgPath(this.data.sceneId, this.data.sceneType);
        let sceneCfg: CfgSceneData;
        CfgManager.Inst().GetCfg<CfgSceneData>(resPath, (cfg) => {
            LogError("场景配置", resPath, cfg);
            sceneCfg = cfg;
            this.BindScene(BattleCtrl.Inst().battleScene, sceneCfg);
        })


        ResManager.Inst().Load<Prefab>(this.data.scenePath, (error, obj) => {
            if (error != null) {
                LogWxError("战斗场景加载", error);
                return;
            }
            let node = instantiate(obj);
            BattleCtrl.Inst().battleScene = node.getComponent(BattleScene);
            // ViewManager.Inst().MainViewVisible(false);
            ViewManager.Inst().CloseView(MainMenu)
            this.BindScene(BattleCtrl.Inst().battleScene, sceneCfg);
        });
    }

    BindScene(scene: BattleScene, data: CfgSceneData) {
        if (this.isDone || scene == null || data == null) {
            return
        }
        this.isDone = true;
        this.scene = scene;
        scene.node.parent = CameraManager.Inst().canvas.node;
        scene.node.setSiblingIndex(0);
        scene.SetData(data, this.data.saveData);

        ViewManager.Inst().OpenView(BattleView);
        if ((PackageData.Inst().getIsDebug() || LoginData.IsWhite()) && ViewManager.Inst().IsOpen(TopLayerView)) {
            // ViewManager.Inst().OpenView(BattleDebugView);
        }
    }
}


export interface IStartDefBattleActionnData {
    sceneId: number;
    sceneType: SceneType;
    saveData?: BattleInfoSave;
}
// 开始守卫萝卜玩法
export class StartDefBattleAction extends BattleAction {
    data: IStartDefBattleActionnData;

    constructor(data: IStartDefBattleActionnData) {
        super();
        this.data = data;
    }
    private scene: DefBattleScene;

    Execute(): void {
        BattleData.Inst().battleInfo.sceneType = this.data.sceneType;
        BattleData.Inst().battleInfo.sceneId = this.data.sceneId;
        SceneEffect.Inst().PlayLoadScene(this.LoadScene.bind(this), ()=>{
            if(this.scene == null){
                return false;
            }
            return this.scene.isLoaded
        });
    }

    LoadScene(){
        LogError("开始守卫萝卜玩法", this.data);
        if(ViewManager.Inst().IsOpened(LoginView)){
            ViewManager.Inst().CloseView(LoginView);
        }
        ViewManager.Inst().ShowBattle(true);
        let resPath = GetSceneCfgPath(this.data.sceneId, this.data.sceneType);
        let sceneCfg: CfgSceneDefData;
        CfgManager.Inst().GetCfg<CfgSceneDefData>(resPath, (cfg) => {
            LogError("场景配置", resPath, cfg);
            sceneCfg = cfg;
            this.BindScene(BattleCtrl.Inst().battleSceneDef, sceneCfg);
        })

        ResManager.Inst().Load<Prefab>(BATTLE_DEF_SCENE_PATH, (error, obj) => {
            if (error != null) {
                LogWxError("战斗场景加载", error);
                return;
            }
            let node = instantiate(obj);
            BattleCtrl.Inst().battleSceneDef = node.getComponent(DefBattleScene);
            ViewManager.Inst().CloseView(MainMenu)
            this.BindScene(BattleCtrl.Inst().battleSceneDef, sceneCfg);
        });
    }

    BindScene(scene: DefBattleScene, data: CfgSceneDefData) {
        if (this.isDone || scene == null || data == null) {
            return
        }
        this.isDone = true;
        this.scene = scene;
        scene.node.parent = CameraManager.Inst().canvas.node;
        scene.node.setSiblingIndex(0);
        scene.SetData(data, this.data.saveData);
        
        //ViewManager.Inst().OpenView(BattleView);
        if(PackageData.Inst().getIsDebug()){
            // ViewManager.Inst().OpenView(BattleDebugView);
        }

        ViewManager.Inst().OpenView(BattleDefView);
    }
}




export interface IStartArenaBattleActionData {
    sceneId: number;
    sceneType: SceneType;
}
// 开始竞技场玩法
export class StartArenaBattleAction extends BattleAction {
    data: IStartArenaBattleActionData;

    constructor(data: IStartArenaBattleActionData) {
        super();
        this.data = data;
    }
    private scene: ArenaBattleScene;

    private sceneCfg:CfgSceneData;
    private get isHasScene(){
        return BattleCtrl.Inst().battleSceneArena_A != null && BattleCtrl.Inst().battleSceneArena_B != null;
    }

    Execute(): void {
        BattleData.Inst().battleInfo.sceneType = this.data.sceneType;
        BattleData.Inst().battleInfo.sceneId = this.data.sceneId;
        BattleData.Inst().robotBattleInfo.sceneType = this.data.sceneType;
        BattleData.Inst().robotBattleInfo.sceneId = this.data.sceneId;
        SceneEffect.Inst().PlayLoadScene(this.LoadScene.bind(this), ()=>{
            if(this.scene == null){
                return false;
            }
            return this.scene.isLoaded;
        });
    }


    LoadScene(){
        LogError("开始竞技场玩法", this.data);
        ViewManager.Inst().ShowBattle(true);
        let resPath = GetSceneCfgPath(this.data.sceneId, this.data.sceneType);
        CfgManager.Inst().GetCfg<CfgSceneData>(resPath, (cfg) => {
            this.sceneCfg = cfg;
            this.BindScene();
        })

        ResManager.Inst().Load<Prefab>(BATTLE_PLATFORM_PATH, (error, obj) =>{
            if (error != null) {
                LogWxError("战斗平台加载错误", error);
                return;
            }
            BattleCtrl.Inst().battleScenePlatform = instantiate(obj);
            this.BindScene();
        })

        ResManager.Inst().Load<Prefab>(BATTLE_ARENA_SCENE_PATH, (error, obj) => {
            if (error != null) {
                LogWxError("战斗场景加载", error);
                return;
            }
            let nodeA = instantiate(obj);
            let nodeB = instantiate(obj);
            BattleCtrl.Inst().battleSceneArena_A = nodeA.getComponent(ArenaBattleScene);
            BattleCtrl.Inst().battleSceneArena_B = nodeB.getComponent(ArenaBattleScene);
            BattleCtrl.Inst().battleSceneArena_A.tag = BattleObjTag.Player;
            BattleCtrl.Inst().battleSceneArena_B.tag = BattleObjTag.Robot;
            ViewManager.Inst().CloseView(MainMenu)
            this.BindScene();
        });
    }

    BindScene() {
        if (this.isDone || this.sceneCfg == null || !this.isHasScene || BattleCtrl.Inst().battleScenePlatform == null) {
            return
        }
        BattleCtrl.Inst().battleScenePlatform.parent = CameraManager.Inst().canvas.node;
        BattleCtrl.Inst().battleScenePlatform.setSiblingIndex(0);
        BattleCtrl.Inst().battleScenePlatform.setPosition(0,0);
        BattleCtrl.Inst().battleScenePlatform.getComponent(UITransform).height = fgui.GRoot.inst.height;
        let parent = BattleCtrl.Inst().battleScenePlatform.getChildByName("SceneRoot");
        this.isDone = true;
        let sceneA = <ArenaBattleScene>BattleCtrl.Inst().battleSceneArena_A;
        let sceneB = <ArenaBattleScene>BattleCtrl.Inst().battleSceneArena_B;
        this.scene = sceneA;
  
        sceneA.node.setParent(parent);
        sceneB.node.setParent(parent)
        sceneA.SetData(this.sceneCfg);
        sceneB.SetData(this.sceneCfg);

        let width = fgui.GRoot.inst.width;

        sceneA.node.setPosition(-width / 4, 0);
        sceneB.node.setPosition(width / 4, 0);

        sceneA.RootMask.width = width / 2;
        sceneA.RootMask.height = fgui.GRoot.inst.height;

        sceneB.RootMask.width = width / 2;
        sceneB.RootMask.height = fgui.GRoot.inst.height;
        
        //ViewManager.Inst().OpenView(BattleView);
        // if(PackageData.Inst().getIsDebug()){
        //     ViewManager.Inst().OpenView(BattleDebugView);
        // }

        ViewManager.Inst().OpenView(BattleArenaView);
    }
}






export interface IRandomSkillListActionData {
    skill_list: CfgSkillData[];
    type: number;        //1宝箱开启，2经验升级, 3通关获取
}
//随机词条事件
export class RandomSkillListAction extends BattleAction {
    data: IRandomSkillListActionData;

    static Create(skill_list: CfgSkillData[], type: number = 1): RandomSkillListAction {
        return new RandomSkillListAction(<IRandomSkillListActionData>{ skill_list: skill_list, type: type });
    }

    static param: number;

    constructor(data: IRandomSkillListActionData) {
        super();
        this.data = data;
    }

    Execute(): void {
        LogError("随机词条事件", this.data);
        if (this.data.skill_list == null || this.data.skill_list.length == 0) {
            this.isDone = true;
            return;
        }

        //this.data.skill_list[0] = BattleData.Inst().GetSkillCfg(529);

        EventCtrl.Inst().emit(BattleEventType.Pause, true);
        BattleData.Inst().SetSelectSkillList(this.data.skill_list);
        RandomSkillListAction.param = this.data.type;
        this.isDone = true;
    }
}

export interface ISelectSkillAction {
    skill: CfgSkillData;
}
//选择词条事件
export class SelectSkillAction extends BattleAction {
    data: ISelectSkillAction;

    static Create(skill: CfgSkillData): SelectSkillAction {
        return new SelectSkillAction(<ISelectSkillAction>{ skill: skill });
    }

    constructor(data: ISelectSkillAction) {
        super();
        this.data = data;
    }

    Execute(): void {
        LogError("执行选择词条事件", this.data);
        EventCtrl.Inst().emit(BattleEventType.Pause, false);
        BattleData.Inst().AddSkill(this.data.skill);
        BattleData.Inst().SetSelectSkillList(null);
        let type = RandomSkillListAction.param;
        if (type == 2) {
            BattleData.Inst().battleInfo.UpLevel();
        } else {
            if(this.data.skill.skill_id != 529){
                BattleCtrl.Inst().battleScene?.MendMapCell();
            }
        }
        this.isDone = true;
        if(BattleCtrl.Inst().GetBattleScene().report){
            BattleCtrl.Inst().GetBattleScene().report.buffId.push(this.data.skill.skill_id);
        }
        if (this.data.skill.skill_id == SP_SKILL_ID_A) {
            BattleData.Inst().battleInfo.SetSpSkill26HeroRate(this.data.skill.pram1, 20);
        }
    }
}
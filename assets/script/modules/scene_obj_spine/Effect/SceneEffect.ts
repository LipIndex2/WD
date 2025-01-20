import { Node, Vec3, isValid } from "cc";
import { NodePools } from "core/NodePools";
import { ObjectPool } from "core/ObjectPool";
import { Singleton } from "core/Singleton";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BattleObjTag, SceneTypeEffect } from "modules/Battle/BattleConfig";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { BattleData } from "modules/Battle/BattleData";
import { ViewLayer } from "modules/common/BaseView";
import { Timer } from "modules/time/Timer";
import { PackageData } from "preload/PkgData";
import { ResPath } from "utils/ResPath";
import { UH } from "../../../helpers/UIHelper";
import { ChannelAgent } from "../../../proload/ChannelAgent";
import { UISpinePlayData, UISpineShow } from "../UISpineShow";
import { UIEffectConf } from "./UIEffectConf";
import { UISPineConf } from "./UISPineConf";
import { LogError } from "core/Debugger";

export interface ISceneEffectConfig {
    path: string,
    animName?: string,
    isSpine?: boolean,
}

export interface IPreloadSceneEffect {
    effectCfg: ISceneEffectConfig;
    preloadCount: number;
}

export var SceneEffectConfig = {
    HeroUp: <ISceneEffectConfig>{ path: "effect/ui/1208001" },  //角色升级特效
    HeroHide: <ISceneEffectConfig>{ path: "effect/ui/1208002" },  //角色隐藏特效
    ChangAn: <ISceneEffectConfig>{ path: "effect/ui/1208003" },  //长按特效
    //QiLiu: <ISceneEffectConfig>{ path: "effect/ui/1208004", isSpine: false },  //战斗的气流   **
    MonsterCreate: <ISceneEffectConfig>{ path: "effect/ui/1208005" },  //怪物出生特效
    MonsterDie: <ISceneEffectConfig>{ path: "effect/ui/1208006" },  //怪物死亡特效
    MonsterDieClip: <ISceneEffectConfig>{ path: "effect/ui/1208049", isSpine: false },  //怪物死亡特效碎片
    MonsterDieCoin: <ISceneEffectConfig>{ path: "effect/ui/1208048", isSpine: false },  //怪物死亡特效金币
    Box1: <ISceneEffectConfig>{ path: "effect/ui/1208007", animName: "box01", },  //宝箱特效
    Box2: <ISceneEffectConfig>{ path: "effect/ui/1208007", animName: "box02", },  //宝箱特效
    Box3: <ISceneEffectConfig>{ path: "effect/ui/1208007", animName: "box03", },  //宝箱特效
    PassStage: <ISceneEffectConfig>{ path: "effect/ui/1208008" },  //通关特效
    MaxLevel: <ISceneEffectConfig>{ path: "effect/ui/1208010" },  //满级特效
    MaxLevelLoop: <ISceneEffectConfig>{ path: "effect/ui/1208012", isSpine: false },  //满级特效持续闪光  *
    //DiJunLaiXi: <ISceneEffectConfig>{path:"effect/ui/1208013"},     //敌军来袭特效
    JinRuZhanDou: <ISceneEffectConfig>{ path: "effect/ui/1208011" },   //开战特效
    EnterBattle: <ISceneEffectConfig>{ path: "effect/ui/1208021" },   //进入战斗过场特效   **
    HeroOut: <ISceneEffectConfig>{ path: "effect/ui/1208028", animName: "out", },       //英雄回收特效
    HeroIn: <ISceneEffectConfig>{ path: "effect/ui/1208028", animName: "in", },       //英雄回收特效
    FailEffect: <ISceneEffectConfig>{ path: "effect/ui/1208031", },    //失败特效
    FailEffect2: <ISceneEffectConfig>{ path: "effect/ui/1208032", isSpine: false },    //失败城堡冒烟特效   *
    YuMiBaoZa: <ISceneEffectConfig>{ path: "effect/blueheros/1038006", isSpine: false },    //玉米机器人爆炸特效
    CaiSenQiGongBaoZha: <ISceneEffectConfig>{ path: "effect/blueheros/10390021", isSpine: false },//菜森气功爆炸
    BingDongGuBingHuan: <ISceneEffectConfig>{ path: "effect/purpleheros/10490171", isSpine: true },//冰冻菇冰环
    BingDongGuBaoFengXue: <ISceneEffectConfig>{ path: "effect/purpleheros/10490172", isSpine: true },//冰冻菇暴风雪
    XiangPuMaoShuiBao: <ISceneEffectConfig>{ path: "effect/purpleheros/10490141", isSpine: false },//香蒲猫水爆
    XiangMuGongShouBaoZha: <ISceneEffectConfig>{ path: "effect/purpleheros/10480204", isSpine: false },//香蒲猫水爆
    WoGuaDiLie: <ISceneEffectConfig>{ path: "effect/blueheros/10380151" },//倭瓜地裂
    JiTuiMonster: <ISceneEffectConfig>{ path: "effect/buff/1058017" },//击退怪物效果
    DiLeiBaoZa: <ISceneEffectConfig>{ path: "effect/greenheros/10290131", isSpine: false },       //樱桃地雷爆炸
    TianLei: <ISceneEffectConfig>{ path: "effect/greenheros/1028002" },   //吸铁花天雷
    MeiGuiHuaYu: <ISceneEffectConfig>{ path: "effect/purpleheros/10480125", isSpine: false },   //玫瑰花语
    ShanDianBaoZa: <ISceneEffectConfig>{ path: "effect/purpleheros/10480162" },    //闪电芦苇击中爆炸
    BaoLieMoFa: <ISceneEffectConfig>{ path: "effect/purpleheros/10480188" },    //火龙果，爆裂魔法
    LiuLianJiZhong: <ISceneEffectConfig>{ path: "effect/purpleheros/10480013", isSpine: false },    //霸王榴莲击中
    GuangMingZhuFu: <ISceneEffectConfig>{ path: "effect/purpleheros/10480153", isSpine: false },    //霸王榴莲击中
    ShengGuangShenPan: <ISceneEffectConfig>{ path: "effect/purpleheros/10480155" },  //圣光审判 
    DaZuiHuaGongJi: <ISceneEffectConfig>{ path: "effect/purpleheros/10480141" },     //大嘴花攻击
    ELiJuXingNianYe: <ISceneEffectConfig>{ path: "effect/purpleheros/10480224", isSpine: true },     //鳄梨巨型粘液

    GetSkillShow1: <ISceneEffectConfig>{ path: "effect/buff/1058013" },//获得词条播放
    GetSkillShow2: <ISceneEffectConfig>{ path: "effect/buff/1058014", animName: "levelup" },//获得词条播放  *

    BOSS_15020: <ISceneEffectConfig>{ path: "effect/boss/15020" },//获得词条播放
    BOSS_15022: <ISceneEffectConfig>{ path: "effect/boss/15022" },//消除英雄    **
    BOSS_15025: <ISceneEffectConfig>{ path: "effect/boss/15025" },//消除英雄

    BOSS_15023: <ISceneEffectConfig>{ path: "effect/boss/15023" },//交换英雄BOSS身上
    BOSS_15026: <ISceneEffectConfig>{ path: "effect/boss/15026" },//交换英雄BOSS身上
    BOSS_15027: <ISceneEffectConfig>{ path: "effect/boss/15027" },//交换英雄

    BOSS_15024: <ISceneEffectConfig>{ path: "effect/boss/15024" },//变羊
    BOSS_15029: <ISceneEffectConfig>{ path: "effect/boss/15029" },//变羊
    BOSS_15028: <ISceneEffectConfig>{ path: "effect/boss/15028" },//变羊    *
}


//场景中需要提前加载的特效
export var PreloadSceneEffectConfig: IPreloadSceneEffect[] = [
    <IPreloadSceneEffect>{ effectCfg: SceneEffectConfig.HeroUp, preloadCount: 5 },
    <IPreloadSceneEffect>{ effectCfg: SceneEffectConfig.HeroHide, preloadCount: 10 },
    <IPreloadSceneEffect>{ effectCfg: SceneEffectConfig.MonsterCreate, preloadCount: 6 },
    <IPreloadSceneEffect>{ effectCfg: SceneEffectConfig.MonsterDie, preloadCount: 5 },
    <IPreloadSceneEffect>{ effectCfg: SceneEffectConfig.Box1, preloadCount: 2 },
    <IPreloadSceneEffect>{ effectCfg: SceneEffectConfig.GetSkillShow1, preloadCount: 10 },
    <IPreloadSceneEffect>{ effectCfg: SceneEffectConfig.GetSkillShow2, preloadCount: 10 },
    <IPreloadSceneEffect>{ effectCfg: SceneEffectConfig.HeroOut, preloadCount: 2 },
]

//怪物死亡特效
export var MonsterDieEffectConfig: { [key: number]: ISceneEffectConfig } = {
    [0]: SceneEffectConfig.MonsterDie,
    [1]: SceneEffectConfig.MonsterDie,
    [2]: SceneEffectConfig.MonsterDieCoin,
    [3]: SceneEffectConfig.MonsterDieClip,
    [4]: SceneEffectConfig.MonsterDie,
}

export class SceneEffect extends Singleton {
    //这是spine特效
    Play(cfg: ISceneEffectConfig, parent?: Node, worldPos?: Vec3, loadedCall?: (obj: Node) => boolean | void, stopCall?: (obj: Node) => void, tag?: BattleObjTag) {
        NodePools.Inst().Get(cfg.path, (obj: Node) => {
            if (parent == null) {
                parent = BattleCtrl.Inst().GetBattleScene(tag).node;
            }
            if (!isValid(parent)) {
                return;
            }

            let isReutrn;
            if (loadedCall) {
                isReutrn = loadedCall(obj);
            }

            if (isReutrn) {
                return
            }

            let isSpine = cfg.isSpine == null ? true : false;

            obj.setParent(parent);
            worldPos && obj.setWorldPosition(worldPos);


            if (isSpine) {
                let mono = obj.getComponent(UISPineConf);
                if (!mono) {
                    LogError("SceneEffect特效未添加 UISPineConf 配置组件", cfg.path)
                    return;
                }
                if (!mono.destroyAuto) {
                    LogError("SceneEffect特效未设置自动销毁", cfg.path)
                }
                if (stopCall) {
                    mono.SetStopCallback(stopCall);
                }
                if (cfg.animName) {
                    mono.play(null, cfg.animName);
                } else if (!mono.playOnAwake) {
                    mono.play();
                }
            } else {
                let mono = obj.getComponent(UIEffectConf);
                if (!mono) {
                    LogError("SceneEffect特效未添加 UIEffectConf 配置组件", cfg.path)
                    return;
                }
                if (!mono.destroyAuto) {
                    LogError("SceneEffect特效未设置自动销毁", cfg.path)
                }
                if (mono && stopCall) {
                    mono.SetStopCallback(stopCall);
                }
                if (!mono.playOnAwake) {
                    mono.play();
                }
            }
        });
    }

    PlayLoadScene(loadFunc: () => void, checkFunc: () => boolean) {
        let spine = UISpineShow.creat();
        let time_ht: any;
        let effectID = SceneTypeEffect[BattleData.Inst().battleInfo.sceneType] ?? 12080210;
        spine.setPosition(fgui.GRoot.inst.width / 2, fgui.GRoot.inst.height / 2);
        spine.setPivot(0.5, 0.5)
        spine.LoadSpine(ResPath.UIEffect(effectID), true, (obj: Node) => {
            UH.reSizeByParent(spine._container, { x: 0.5, y: 0.5 })
            let anidata = ObjectPool.Get(UISpinePlayData);
            anidata.name = "start";
            spine.setCompFunc(() => {
                loadFunc();
                spine.setCompFunc(undefined);
                time_ht = Timer.Inst().AddRunTimer(() => {
                    if (checkFunc()) {
                        let anidata = ObjectPool.Get(UISpinePlayData);
                        // anidata.start = 1;
                        anidata.name = "end";
                        // anidata.timeScale = -1;
                        setTimeout(() => {
                            spine.removeFromParent();
                            spine = undefined;
                        }, 1500)
                        spine.play(anidata);
                        Timer.Inst().CancelTimer(time_ht);
                    }
                }, 0.1, -1, true)
            })
            spine.play(anidata)
        })
        spine.sortingOrder = ViewManager.Inst().AddOrder(ViewLayer.BgBlock);
        fgui.GRoot.inst.addChild(spine);
        ChannelAgent.FPS = PackageData.Inst().g_UserInfo.gameFPS.battle;
    }
}
import { Vec2, Vec3 } from "cc";
import { GetCfgValue } from "config/CfgCommon";
import { CfgSkillData } from "config/CfgEntry";
import { CfgHeroBattle } from "config/CfgHero";
import { CfgInstituteLevel } from "config/CfgInstitute";
import { CfgShenDianSkill } from "config/CfgLostTemple";
import { CfgMonsterSkillData } from "config/CfgMonster";
import { CfgCtrlList } from "config/CfgMonsterCtrl";
import { IPoolObject } from "core/ObjectPool";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { Language } from "modules/common/Language";
import { HeroData } from "modules/hero/HeroData";
import { MathHelper } from "../../helpers/MathHelper";
import { Format } from "../../helpers/TextHelper";
import { BattleCtrl } from "./BattleCtrl";
import { BattleData, BattleInfo, IBattleHeroInfo } from "./BattleData";
import { BattleDynamicHelper } from "./BattleDynamicHelper";
import { BattleScene, IBattleScene } from "./BattleScene";
import { BingShuangCtrl } from "./Control/BingShuangCtrl";
import { DefMonsterControl } from "./Control/DefMonsterControl";
import { ErMoCtrl } from "./Control/ErMoCtrl";
import { MonsterControl } from "./Control/MonsterControl";
import { MonsterLuanFeiControl } from "./Control/MonsterLuanFeiControl";
import { MonsterPingYiARCControl } from "./Control/MonsterPingYiARCControl";
import { MonsterPingYiControl } from "./Control/MonsterPingYiControl";
import { MonsterRoundOutSideControl } from "./Control/MonsterRoundOutSideControl";
import { MonsterRoundSideControl } from "./Control/MonsterRoundSideControl";
import { ShiLaiMuCtrl } from "./Control/ShiLaiMuCtrl";
import { TouDanShouCtrl } from "./Control/TouDanShouCtrl";
import { BingDongGuControl } from "./Control/hero/BingDongGuControl";
import { CaiSenControl } from "./Control/hero/CaiSenControl";
import { CanDouXiaoChouControl } from "./Control/hero/CanDouXiaoChouControl";
import { DaLiHuaControl } from "./Control/hero/DaLiHuaControl";
import { DaZuiHuaControl } from "./Control/hero/DaZuiHuaControl";
import { DiShuiBingLianControl } from "./Control/hero/DiShuiBingLianControl";
import { ELiControl } from "./Control/hero/ELiControl";
import { GongChengShiControl } from "./Control/hero/GongChengShiControl";
import { HaiDaiEMoCtrl } from "./Control/hero/HaiDaiEMoCtrl";
import { HuiMieGuControl } from "./Control/hero/HuiMieGuControl";
import { HuiXuanHuaControl } from "./Control/hero/HuiXuanHuaControl";
import { HuoJuControl } from "./Control/hero/HuoJuControl";
import { HuoLongGuoControl } from "./Control/hero/HuoLongGuoControl";
import { JianGuoQiangControl } from "./Control/hero/JianGuoQiangControl";
import { JingJiCaoCtrl } from "./Control/hero/JingJiCaoCtrl";
import { KFDouControl } from "./Control/hero/KFDouControl";
import { LaBiControl } from "./Control/hero/LaBiControl";
import { LianOuMaiKeFengCtrl } from "./Control/hero/LianOuMaiKeFengCtrl";
import { LingJingControl } from "./Control/hero/LingJingControl";
import { LiuLianControl } from "./Control/hero/LiuLianControl";
import { LuWeiControl } from "./Control/hero/LuWeiControl";
import { MeiGuiControl } from "./Control/hero/MeiGuiControl";
import { MeiHuoGuCtrl } from "./Control/hero/MeiHuoGuCtrl";
import { MuBeiControl } from "./Control/hero/MuBeiControl";
import { MuNaiLiControl } from "./Control/hero/MuNaiLiControl";
import { NanGuaControl } from "./Control/hero/NanGuaControl";
import { PuTaoQiuControl } from "./Control/hero/PuTaoQiuControl";
import { ShuiLianControl } from "./Control/hero/ShuiLianControl";
import { SiBaDaZhuControl } from "./Control/hero/SiBaDaZhuControl";
import { TieChuiLanControl } from "./Control/hero/TieChuiLanControl";
import { WoGuaControl } from "./Control/hero/WoGuaControl";
import { XJChuanZhangControl } from "./Control/hero/XJChuanZhangControl";
import { XiTieHuaControl } from "./Control/hero/XiTieHuaControl";
import { XianRenZhangControl } from "./Control/hero/XianRenZhangControl";
import { XiangMuGongShouControl } from "./Control/hero/XiangMuGongShouControl";
import { XiangPuMaoControl } from "./Control/hero/XiangPuMaoControl";
import { YeZiBaoLeiControl } from "./Control/hero/YeZiBaoLeiControl";
import { YingTaoZhaDanCtrl } from "./Control/hero/YingTaoZhaDanCtrl";
import { YouLingLaJiaoCtrl } from "./Control/hero/YouLingLaJiaoCtrl";
import { YouYuMoGUControl } from "./Control/hero/YouYuMoGUControl";
import { YuMiJiQiRenControl } from "./Control/hero/YuMiJiQiRenControl";
import { CellSpCellAttackSpeed, CellSpCellDizziness, CellSpCellHarm, CellSpCellProperty, CellSpCellSwap } from "./Function/CellSpFunc";
import { ChongDianBuff, H_GuangMingZhuFuBuff, H_HuoJuBuff, H_JiLiBuff, H_KuangNuBuff, H_ShiXueBuff, H_SleepBuff, H_Stopff, H_TimeProgressBuff, H_WaitDieBuff, H_XuanYunBuff, H_YangBuff } from "./Function/HeroBuff";
import { BingShuangBingDongBuff, BingShuangJianSuBuff, BingXueYinJiBuff, ChanRaoBuff, DeductHpBuff, FuBaiBuff, HuoJuJianSuBuff, JiTuiBuff, JianTaJianSuBuff, JinGuBuff, KongJuBuff, LiuXueBuff, MeiHuoBuff, RuoHuaSuBuff, WuDiBuff, XuanYunBuff, YiShangBuff, ZhongDuBuff, ZuoShaoBuff } from "./Function/MonsterBuff";
import { IQueuePlayFuncItem } from "./Function/QueueFunc";
import { SkillMonster, SkillMonster1, SkillMonster10, SkillMonster11, SkillMonster12, SkillMonster2, SkillMonster3, SkillMonster4, SkillMonster5, SkillMonster6, SkillMonster7, SkillMonster8, SkillMonster9 } from "./Function/SkillMonster";
import { HeroObj } from "./Object/HeroObj";
import { InstituteTalentType } from "modules/Institute/InstituteCtrl";
import { LianXiaoPengControl } from "./Control/hero/LianXiaoPengControl";
import { ArenaData } from "modules/Arena/ArenaData";


// 战斗模式
export enum BattleModel {
    Normal = 1,     //正常勇闯要塞玩法
    Defense = 2,    //保卫萝卜玩法
    Arena = 3,      //竞技场
}

export enum BattleObjTag {
    Player = 1, //玩家
    Robot = 2,  //机器人
}


//新手指引上阵英雄
export const GUIDE_HEROS: IBattleHeroInfo[] = [
    { heroId: 1, heroLevel: 1 },
    { heroId: 2, heroLevel: 1 },
    { heroId: 3, heroLevel: 1 },
    { heroId: 4, heroLevel: 1 },
]

//场景类型
export enum SceneType {
    Main = 0,           //主线关卡
    DayChallenge = 1,   //每日挑战
    Coin = 2,           //金币关卡
    Fragment = 3,       //碎片关卡
    RunRunRun = 4,      //僵尸冲冲冲
    ShenDian = 5,       //失落神殿
    Virtual = 6,        //英雄试用

    Defense = 7,        //保卫萝卜
    Arena = 8,          //竞技场
}

//场景加载特效
export var SceneTypeEffect: { [key: number]: number } = {
    [SceneType.Main]: 12080210,           //主线关卡
    [SceneType.DayChallenge]: 12080210,   //每日挑战
    [SceneType.Coin]: 12080210,          //金币关卡
    [SceneType.Fragment]: 12080210,       //碎片关卡
    [SceneType.RunRunRun]: 12080210,
}

//宝箱是否开启英雄词条
export var SceneBoxIsHero: { [key: number]: boolean } = {
    [SceneType.RunRunRun]: true,
    [SceneType.ShenDian]: true,
}

//禁止复活的场景
export var SceneIsNoRelive: { [key: number]: boolean } = {
    [SceneType.ShenDian]: true,
    [SceneType.RunRunRun]: true,
    [SceneType.Arena]: true,
}


//战斗状态
export enum BattleState {
    //Wait = 0,       //等待
    SanXiao = 1,    //三消阶段  也表示准备阶段
    Figth = 2,      //抵御怪物阶段
    Win = 3,        //胜利
    Fail = 4,       //失败
}

//游戏状态
// export enum GameState{
//     Pause = 1,      //暂停
//     Run = 2,        //运行
// }

export enum BattleEventType {
    SceneLoaded = "battle_scene_loaded",    //场景加载完毕事件
    Pause = "battle_pause", //暂停状态
    Run = "battle_pause",
    Speed = "battle_speed", //倍数变化

    ClickHero = "battle_click_hero",    //英雄点击
    Swap = "battle_Swap",   //交换角色
    Discard = "battle_Discard",                 //销毁角色
    SetSelectSkill = "battle_SetSelectSkill",   //刷词条
    BeAttack = "battle_BeAttack",           //城堡被攻击
    RoundChange = "battle_round_change",    //回合变化
    MonsterDie = "battle_monster_die",      //怪物死亡，任何死法    p1:monster, 
    MonsterDieByHero = "battle_monster_die_hero",   //英雄打死      p1:monster, p2:hero
    MonsterDieByBuff = "battle_monster_die_buff",   //buff导致死亡  p1:monster, p2:buffData
    MonsterDieByWall = "battle_monster_die_wall",   //撞墙而死      p1:monster

    BattleExit = "battle_exit", //战斗退出事件
    GameOver = "battle_game_over",  //游戏结束 p1:是否胜利
}

export enum MonsterEventType {
    Die = "zzw-die"
}

export enum SkillPlayType {
    Before = 0,     //释放前执行
    After = 1,      //是否后执行
}


//游戏事件
export enum BattleActionType {
    //交换两个格子
    //达成三消
    //英雄升级
    //随机生成一个英雄
}

//攻击条件类型
export enum AttackConditionType {
    Col = 1,    //同列
    Row = 2,    //同行
    Range = 3,  //周围X格
}



export enum MonsterType {
    NormalType = 1,
}

// 英雄行为
export var HeroCtrlMap: { [key: number]: any } = {
    [1]: TouDanShouCtrl,
    [2]: BingShuangCtrl,
    [3]: ErMoCtrl,
    [4]: ShiLaiMuCtrl,
    [5]: YingTaoZhaDanCtrl,
    [6]: YeZiBaoLeiControl,
    [7]: HuiMieGuControl,
    [8]: CaiSenControl,     //菜森
    [9]: XiTieHuaControl,
    [10]: YuMiJiQiRenControl,
    [11]: GongChengShiControl,  //工程师
    [12]: MuNaiLiControl,
    [13]: BingDongGuControl,
    [14]: MuBeiControl,
    [15]: MeiHuoGuCtrl,
    [16]: HuiXuanHuaControl,
    [17]: ShuiLianControl,
    [18]: JingJiCaoCtrl,
    [19]: LianOuMaiKeFengCtrl,
    [20]: YouLingLaJiaoCtrl,
    [21]: JianGuoQiangControl,
    [22]: HaiDaiEMoCtrl,
    [23]: XianRenZhangControl,
    [24]: CanDouXiaoChouControl,
    [25]: YouYuMoGUControl,
    [26]: NanGuaControl,
    [27]: DaLiHuaControl,
    [28]: KFDouControl,
    [29]: LingJingControl,  //棱镜草(艾米)
    [30]: XiangPuMaoControl,
    [31]: HuoJuControl,
    [32]: SiBaDaZhuControl,
    [33]: LaBiControl,      //辣比
    [34]: PuTaoQiuControl,      //葡萄球
    [35]: XJChuanZhangControl,  //香蕉船长
    [36]: WoGuaControl,
    [37]: MeiGuiControl,    //玫瑰法师
    [38]: TieChuiLanControl,    //铁锤兰
    [39]: LuWeiControl,     //闪电芦苇
    [40]: LiuLianControl,   //霸王榴莲
    [41]: HuoLongGuoControl,    //地狱火龙果
    [42]: DiShuiBingLianControl,    //滴水冰莲
    [43]: DaZuiHuaControl,  //大嘴花
    [44]: XiangMuGongShouControl,  //橡木弓手
    [45]: LianXiaoPengControl,      //莲小鹏
    [46]: ELiControl,  //鳄梨
}

// 怪物移动行为
export var MonsterCtrlMap: { [key: number]: any } = {
    [0]: MonsterControl,                //从上到下直线
    [1]: MonsterLuanFeiControl,         //左右乱飞
    [2]: MonsterPingYiARCControl,       //抛物线入场
    [3]: MonsterPingYiControl,          //选定一个方向平移
    [4]: MonsterRoundOutSideControl,    //从外围出场
    [5]: MonsterRoundSideControl,       //从外围入场

    //不走配置的特殊行为
    [101]: DefMonsterControl,           //守护后院的怪物移动
}

export enum MonsterType {
    Normal = 0,     //普通小怪
    JingYing,       //精英
    Boss,           //BOSS
}


// export class CfgMonsterData{
//     monsterId:number;
//     monsterType:number;
// }

// 金币配置
export const CfgCoinData: CfgHeroBattle[] = [
    {
        hero_id: 0,
        stage: 0,
        res_id: 0,
        coefficients: 0,
        bullet_hit_id: 0,
        bullet_res_id: 0,
        name: "",
    },
    {
        hero_id: 0,
        stage: 1,
        res_id: 1,
        coefficients: 0,
        bullet_hit_id: 0,
        bullet_res_id: 0,
        name: "",
    },
    {
        hero_id: 0,
        stage: 2,
        res_id: 2,
        coefficients: 0,
        bullet_hit_id: 0,
        bullet_res_id: 0,
        name: "",
    },
    {
        hero_id: 0,
        stage: 3,
        res_id: 3,
        coefficients: 0,
        bullet_hit_id: 0,
        bullet_res_id: 0,
        name: "",
    },
]


//***************** 常量 */
export const BATTLE_SCENE_PATH = "battle/BattleScene";  //场景路径
export const BATTLE_DEF_SCENE_PATH = "battle/DefBattleScene";  //场景路径
export const BATTLE_ARENA_SCENE_PATH = "battle/ArenaBattleScene";  //场景路径
export const BATTLE_PLATFORM_PATH = "battle/BattlePlatform";    //战斗平台
export const CELL_WIDTH: number = 116//106//116;  //地图格子的宽
export const CELL_OFFSET_POS: Vec2 = new Vec2(-290, -420) //new Vec2(-265,-457)//new Vec2(-290,-457);    //第一个格子的位置 x = CELL_WIDTH * MAP_COL / 2 - CELL_WIDTH / 2
export const MAP_COL = 6;       //地图固定6列
export const MAX_MAP_ROW = 8;   //地图最多9行
export const INIT_MAP_ROW = 6;  //地图初始多少行
export const BOX_MAX = 3;       //宝箱最高等级
export const FIGHT_SCALE = 0.7; //战斗时缩放的比例
export const FIGHT_CELL_WIDTH = CELL_WIDTH * FIGHT_SCALE;   //战斗中格子的宽

export const MIN_ATTACK_SPEED = 0.5;    //最快攻击速度
export const DEFAULT_HP = 1000; //初始血量
export const MONSTER_MIN_SPEED_SCALE = 0.1; //怪物最少减速比
export const ZHONG_JI_SCALE = 2;    //重击伤害比例
export const BAO_JI_SCALE = 1.5;    //暴击伤害比

export const IS_BATTLE_TWEENER_AUTO = false;    //战斗的tw是否自动回收

export const SP_SKILL_ID_A = 26;    //特殊词条id: 场上xx变为xx
export const SP_SKILL_ID_B = 27;    //特殊词条id: 场上出现xx时变为xx
export const SP_SKILL_ID_C = 525;   //特殊词条id: 场上x属性伤害加x
export const SP_SKILL_ID_D = 530;   //场上所有的aa变bb

//********** 保卫萝卜的常量 */
export const DEF_MAP_COL = 7;       //守卫萝卜地图固定7列
export const DEF_MAP_ROW = 9;       //守卫萝卜地图固定9行
export const DEF_CELL_WIDTH = 84;  //守卫萝卜格子宽
export const DEF_CELL_OFFSET_POS: Vec2 = new Vec2(-252, -391);   //局部坐标
//export const DEF_CELL_OFFSET_WORLD_POS: Vec2 = new Vec2(-252,-391);

//********** 竞技场的常量 */
export const ARENA_MAP_COL = 3;     //竞技场固定3列
export const ARENA_MAP_ROW = 6;     //竞技场固定6列
export const ARENA_CELL_OFFSET_POS: Vec2 = new Vec2(-116, -420)//第一个格子的位置 x = CELL_WIDTH * MAP_COL / 2 - CELL_WIDTH / 2


//是否打印碰撞检查的log
export var IS_DEBUG_COLLIDER = {
    IS_LOG: false,
};

//速度比例
export const BATTLE_SPEED_CFG: { [key: number]: number } = {
    [1]: 1,
    [2]: 1.5,
    [3]: 2,
}

//***************** 三消逻辑 */
export enum SanXiaoMarkType {
    None = 0,
    Row = 1,
    Col = 2,
}

//英雄动画
export var HeroAnimationType = {
    UpRemind: "up_remind",
    UpRightRemind: "up_right_remind",
    RightRemind: "right_remind",
    DownRightRemind: "down_right_remind",
    DownRemind: "down_remind",
    DownLeftRemind: "down_left_remind",
    LeftRemind: "left_remind",
    UpLeftRemind: "up_left_remind",
    Create: "create",
    Destroy: "destroy",
    Await: "await",
    Attack: "attack",
    InFight: "InFight",
    Dou: "dou",
}

//英雄提醒动画
export var HeroAnimationRemind: { [key: number]: string } = {
    [0]: "await",
    [1]: "up_remind",
    [2]: "up_right_remind",
    [3]: "right_remind",
    [4]: "down_right_remind",
    [5]: "down_remind",
    [6]: "down_left_remind",
    [7]: "left_remind",
    [8]: "up_left_remind",
}


// //****************** 关卡相关 */

//词条随机配置
export interface ISceneSkillDataRateCfg {
    skill_id: number;
    rate: number;
}


//怪物出生信息
export class MonsterCreateInfo implements IQueuePlayFuncItem, IPoolObject {
    out_time: number;    //刷新时间
    monster_id: number;
    monster_exp: number; //产出的经验
    pos: Vec3;           //出生位置
    i: number;
    j: number;
    hero_point: number[][];
    showEffect: boolean = true;
    defautBuff: IMonsterObjBuffData[];
    param?: any;

    cfg_ctrl: CfgCtrlList;
    constructor(out_time: number, monster_id: number, monster_exp: number, pos: Vec3, i: number, j: number, cfg_ctrl: CfgCtrlList) {
        this.reInit(out_time, monster_id, monster_exp, pos, i, j, cfg_ctrl)
    }
    reInit?(out_time: number, monster_id: number, monster_exp: number, pos: Vec3, i: number, j: number, cfg_ctrl: CfgCtrlList): void {
        this.out_time = out_time;
        this.monster_id = monster_id;
        this.monster_exp = monster_exp;
        this.pos = pos;
        this.i = i;
        this.j = j;
        this.cfg_ctrl = cfg_ctrl;
    }
    onPoolReset(): void {
        this.out_time = undefined;
        this.monster_id = undefined;
        this.monster_exp = undefined;
        this.pos = undefined;
        this.i = undefined;
        this.j = undefined;
        this.cfg_ctrl = undefined;
        this.hero_point = undefined;
        this.showEffect = true;
        this.defautBuff = undefined;
    }
}

//英雄属性
export enum HeroAttriType {
    WuLi = 1,   //物理
    Shui = 2,   //水
    An = 3,     //暗
    Du = 4,     //毒
    Huo = 5,    //火
    Tu = 6,     //土
    Guang = 7,  //光
}

//每日挑战规则类型
export enum BattleChallengeRuleType {
    HeroAttackSpeed = 1,    //英雄全局攻速
    JingYingMonsterHp = 2,  //精英怪生命
    MonsterMoveSpeed = 3,   //怪物移速
    MonsterHp = 4,          //敌人生命
    HeroAttackHarm = 5,     //全局攻击力
}

//词条来源
export enum BattleSkillSource {
    Normal = 0,     //正常途径，英雄解锁
    Institute = 1,  //研究所
}

// **************** 技能类型 *****************
export var BattleSkillType: { [key: string]: number } = {
    None: 0,        //什么都没有

    AddExp: 1,     //击杀敌人增加 x 经验   *       ok
    AddHarm: 2,    //全局攻击力+X%         *       ok
    AddAttackSpeed: 3,  //全局攻击速度+x%  *       ok
    AddStep: 4,    // 增加步数             *       ok
    WuXiaoBuff: 5, // 五消时中间单位多升一级   *   ok
    HeroRandomUp: 6,     // 随机英雄升级  *    ok
    AddHp: 7,      //增加血量  *       ok
    AddMapHp: 8,   //增加最大血量  *    ok

    UpHero: 9,     //场上的xx变成xx    *       ok
    ChengBao1: 10,//城堡血量低于50%时伤害增加40%       ok
    MonsterSubMove: 11,     //敌人减速      ok
    MapAddRow: 12, // 额外增加1行                      ok
    WuXiaoHuoDeJinBi: 13,      //是否五消获得金币      ok
    ChengBao2: 14, //城堡每增加100血量上限增加10%伤害  ok
    XieJiao: 15,   //是否支持斜角  *                           ok
    MeiRiHeChengAdd: 16,  //每日首次合成时，产生英雄数量+1   *   ok
    ChuXianJiuShengJi: 17,//场上出现XX直接变为XX *       ok
    MeiRiAddStep: 18,    //每日多加一步                  ok
    AddStageHeroCount: 19,  //晋级后携带英雄数量+x       ok
    ChengBao3: 276,       //城堡当日未收到伤害时，恢复<color=#DF7401>{0}</color>血量

    RandomSwapHero: 523,          //随机将场上两个植物等级互换（互换后，最高等级不超过该植物最大等级）
    ZhiWUDuiBossJiaShang: 524,    //所有植物对boss伤害增加25%
    ShuXingShangHaiTiSheng: 525,  //x属性伤害提升
    WuXiaoJiaBuShu: 526,          //每完成一次5消，额外增加一步
    ShengJiZuiGaoYingXiong: 527,  //将场上最高等级（非满级）的一个植物升1级
    ShengJiSuoYou0: 528,          //将场上所有0级植物提升1级
    DaLuanShunXu: 529,            //随机打乱场上所有植物的顺序
    AAToBB: 530,


    //英雄公用属性类型
    ComGongSu: 1001,       //攻速加成
    ComGongJi: 1002,       //攻击加成
    ComJianSuValue: 1003,  //减速效果
    ComZhuoShaoTime: 1004,  //灼烧加时
    ComJianSuTime: 1005,     //减速加时
    ComZhongJi: 1006,       //重击率
    ComBaoJi: 1007,         //暴击率

    ComFuBaiJiaShang: 1101,    //腐败加伤
    ComZhongDuJiaShang: 1102,  //中毒加伤
    ComTanSheShuLiang: 1103,   //弹射数量增加 
    ComYiShang: 1104,           //易伤
    ComXuanYunTime: 1105,       //加眩晕时间
    ComMeiHuoTime: 1106,        //魅惑时间
    ComZhuoShaoJiaShang: 1107,  //灼烧加伤
    ComLiuXueJiaShang: 1108,    //流血加伤
    ComRangeScale: 1109,        //攻击范围比例
    ComZhongJiAdd: 1110,        //重击加伤
    ComBaoJiAdd: 1111,          //暴击加伤

    ComTiaoJianJiaCheng: 2000,  //条件加成  xx的xx属性达到xx时，额外获得xx伤害加成


    // ****** 英雄分割线 *****
    TouDanShou1: 20,   //1.同时发射扇形范围的3颗子弹
    TouDanShou2: 21,   //2.子弹可以穿透一个敌人
    TouDanShou3: 22,   //3.攻击眩晕的敌人，使其流血5s，每秒造成攻击力20%的伤害
    TouDanShou4: 23,   //4.攻击速度+10%
    TouDanShou5: 24,   //5.向前方发射两颗子弹
    TouDanShou6: 25,   //6.造成的流血伤害+10%
    TouDanShou7: 26,   //7.击杀敌人后，攻击速度+100%，持续1s
    TouDanShou8: 27,   //8.攻击力+x%
    BingShuang1: 28,   //冰霜命中时15%几率使其冰冻1s
    BingShuang2: 29,   //冰冻敌人概率+15%
    BingShuang3: 30,   //造成的减速时间+0.2s
    BingShuang4: 31,   //冰冻敌人时，对其周围半格的敌人减速1s
    BingShuang5: 32,   //被冰霜冰冻的敌人死亡时，其周围溅射冰块
    BingShuang6: 33,   //冰冻敌人死亡时，溅射的冰块伤害+10%
    BingShuang7: 34,   //被冰霜减速的敌人受到伤害+20%
    BingShuang8: 35,   //减速效果+x%
    ErMo1: 36,  //小喷菇命中敌人时，使其灼烧<color=#DF7401>{0}</color>s，每秒造成{1}%伤害
    ErMo2: 37,  //小喷菇灼烧累计造成的伤害+<color=#DF7401>{0}</color>%
    ErMo3: 38,  //小喷菇对冰冻敌人的伤害+<color=#DF7401>{0}</color>%
    ErMo4: 39,  //小喷菇造成灼烧时间+<color=#DF7401>{0}</color>秒
    ErMo5: 40,  //小喷菇命中敌人时，<color=#DF7401>{0}</color>%几率点燃其{1}格区域
    ErMo6: 41,  //小喷菇点燃区域造成伤害+<color=#DF7401>{0}</color>%
    ErMo7: 42,  //小喷菇点燃区域扩大<color=#DF7401>{0}</color>倍
    ErMo8: 43,  //小喷菇的溅射范围扩大<color=#DF7401>{0}</color>%
    ShiLaiMu1: 44,          //1.史莱姆攻击时，额外增加1把剑
    ShiLaiMu2: 45,          //2.剑的大小增加100%
    ShiLaiMu3: 46,          //3.攻击力+10%
    ShiLaiMu4: 47,          //4.对生命值<10%的眩晕敌人斩杀
    ShiLaiMu5: 48,          //5.攻击时，剑连续旋转两圈
    ShiLaiMu6: 49,          //6.史莱姆攻击速度+10%
    ShiLaiMu7: 50,          //7.触发斩杀的血量增加到15%
    ShiLaiMu8: 51,          //8.对低于X%血量敌人造成5倍伤害的几率提高X%
    KuangZhanShi1: 59,      //1.狂战士前后方向各丢一把斧头
    KuangZhanShi2: 60,      //2.狂战士攻击灼烧的敌人，对其造成200%的伤害
    KuangZhanShi3: 61,      //3.狂战士攻击距离越远的敌人，伤害越高
    KuangZhanShi4: 62,      //4.击杀敌人时，狂战士攻击速度+10%，持续3s，效果可叠加
    KuangZhanShi5: 63,      //5.狂战士每穿透1个敌人，伤害4%
    KuangZhanShi6: 64,      //6.狂战士攻击速度提升的持续时间+1秒
    KuangZhanShi7: 65,      //7.狂战士可收回抛出的斧头
    BingDongGu1: 108,       //1.冰冻菇命中敌人后，30%几率在其周围1格产生1次冰爆，几率对周围敌人减速或冰冻
    BingDongGu2: 109,       //2.冰冻菇冰爆冰冻敌人的几率+20%
    BingDongGu3: 110,       //3.冰冻菇减速效果+20%
    BingDongGu4: 111,       //4.冰冻菇冰爆冰冻敌人时，其周围敌人10%几率被冰冻
    BingDongGu5: 112,       //5.冰冻菇攻击速度+10%
    BingDongGu6: 113,       //6.冰冻菇攻击时，20%几率释放圆形冰环，对敌人造成100%伤害，并使其减速或冰冻
    BingDongGu7: 114,       //7.全场冰冻菇每攻击100次，召唤1次暴风雪，使全场敌人减速或冰冻
    HuiXuanHua1: 129,        //1.回旋花每攻击3次向前扔出大回旋镖，造成200%伤害
    HuiXuanHua2: 130,        //2.回旋花攻击中毒的敌人，20%几率对其造成300%伤害
    HuiXuanHua3: 131,        //3.回旋花一次扔出3个回旋镖
    HuiXuanHua4: 132,        //4.回旋花攻击速度+10%
    HuiXuanHua5: 133,        //5.回旋花攻击20%几率向左右扔出1只巨型回旋镖，50%几率对命中的敌人造成200%伤害
    HuiXuanHua6: 134,        //6.回旋花攻击力+10%
    HuiXuanHua7: 135,        //7.回旋花的巨型回旋镖命中敌人时，20%几率使敌人眩晕1秒
    HuiXuanHua8: 283,          //8.回旋花增加对中毒敌人造成200%伤害的几率+10%
    JianGuoQiang1: 164,       //1.坚果墙的坚果会越滚越大
    JianGuoQiang2: 165,       //2.坚果墙的坚果命中禁锢的敌人，伤害+100%
    JianGuoQiang3: 166,       //3.坚果墙制造坚果的时间-0.5秒
    JianGuoQiang4: 167,       //4.坚果墙攻击力+10%
    JianGuoQiang5: 168,       //5.坚果墙的坚果越大伤害越高
    JianGuoQiang6: 169,       //6.坚果墙的坚果变大的时间变得更短
    JianGuoQiang7: 170,       //7.坚果墙的坚果越大，击退敌人的几率越高
    XianRenZhang1: 178,     //1.仙人掌朝前后左右同时发射尖刺
    XianRenZhang2: 179,     //2.周围有其他植物时（除仙人掌），仙人掌装填时间-30%
    XianRenZhang3: 180,     //3.仙人掌攻击的持续时间+1s
    XianRenZhang4: 181,     //4.仙人掌攻击速度+10%
    XianRenZhang5: 182,     //5.仙人掌攻击距离越近的敌人，伤害越高
    XianRenZhang6: 183,     //6.仙人掌攻击力+10%
    XianRenZhang7: 184,     //7.仙人掌击杀敌人后，下次装填时间-50%
    CanDouXiaoChou1: 185,     //1.蚕豆小丑每攻击2次，向周围抛出环形飞刀
    CanDouXiaoChou2: 186,     //2.蚕豆小丑攻击禁锢的敌人，20%几率将其击退0.5格
    CanDouXiaoChou3: 187,     //3.蚕豆小丑易伤加成的伤害提升至15%
    CanDouXiaoChou4: 188,     //4.蚕豆小丑造成的易伤层数上限+1
    CanDouXiaoChou5: 189,     //5.蚕豆小丑击杀易伤状态下的敌人时，在被击杀敌人周围散出扑克牌
    CanDouXiaoChou6: 190,     //6.蚕豆小丑攻击速度10%
    CanDouXiaoChou7: 191,     //7.每隔一段时间，蚕豆小丑开启惊吓盒子，恐惧周围敌人1秒
    YuMiJiQi1: 115,         //玉米机器人射程增加<color=#DF7401>{0}</color>格
    YuMiJiQi2: 116,         //玉米机器人击杀敌人后，给周围一格友军增加<color=#DF7401>{0}</color>%伤害，持续{1}s
    YuMiJiQi3: 117,         //玉米机器人给友军充电的时间+<color=#DF7401>{0}</color>秒
    YuMiJiQi4: 118,         //玉米机器人造成的眩晕时间+<color=#DF7401>{0}</color>秒
    YuMiJiQi5: 119,         //玉米机器人击杀敌人后，留下一滩玉米汁
    YuMiJiQi6: 120,         //玉米机器人产生的玉米汁范围+<color=#DF7401>{0}</color>%
    YuMiJiQi7: 121,         //玉米机器人对HP><color=#DF7401>{0}</color>%的敌人，单次攻击额外造成其最大生命值{1}%伤害
    XiangPuMao1: 227,         //1.香蒲猫召唤的水柱数量+1
    XiangPuMao2: 228,         //2.香蒲猫攻击灼烧的敌人时，10%几率使其身上出现1蒸发爆炸，对周围敌人造成200伤害
    XiangPuMao3: 229,         //3.香蒲猫攻击力10%，且射程增加1格
    XiangPuMao4: 230,         //4.香蒲猫攻击速度+10%
    XiangPuMao5: 231,         //5.香蒲猫召唤的水柱变得更大，并且伤害100%
    XiangPuMao6: 232,         //6.香蒲猫攻击力+10%
    XiangPuMao7: 233,         //7.香蒲猫攻击时，10%的几率召唤巨浪攻击敌人

    HuiMieGu4: 68,          //流血层数增加
    HuiMieGu5: 70,          //毁灭菇的守护蝙蝠数量+x

    ShuiLian3: 138,         //增加可击退数量
    ShuiLian4: 139,         //增加海浪概率 
}

type BattleSkillTypeFunc = (cfg: CfgSkillData, scene: IBattleScene, battleInfo: BattleInfo) => boolean | CfgSkillData;

//词条处理
export var BattleSkillHandle: { [key: number]: BattleSkillTypeFunc } = {
    [BattleSkillType.AddExp]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.monsterExpPercent += (cfg.pram1 / 100);
        return true;
    },
    [BattleSkillType.AddHarm]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.harmPercent += (cfg.pram1 / 100);
        return true;
    },
    [BattleSkillType.AddAttackSpeed]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.attackSpeedPercent += (cfg.pram1 / 100);
        return true;
    },
    [BattleSkillType.AddStep]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.stepNum += cfg.pram1;
        BattleData.Inst().otherInfo.skillAddStep = cfg.pram1;
        return false;
    },
    [BattleSkillType.WuXiaoBuff]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.isWuXiaoBuff = true;
        return true;
    },
    [BattleSkillType.HeroRandomUp]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        if (scene == null) {
            return false;
        }
        scene.HeroUpRandom(cfg.pram1);
        AudioManager.Inst().Play(AudioTag.WuXiao);
        return false;
    },
    [BattleSkillType.AddHp]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let hp = info.hp + cfg.pram1;
        if (hp > info.maxHp) {
            hp = info.maxHp;
        }
        info.hp = hp;
        return true;
    },
    [BattleSkillType.AddMapHp]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.maxHp += cfg.pram1;
        info.hp += cfg.pram1;
        return true;
    },

    [BattleSkillType.UpHero]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        if (scene == null) {
            return false;
        }
        let hero_id = cfg.pram1;
        if (hero_id == 0) {
            return false;
        }
        scene.HeroUpById(hero_id);
        AudioManager.Inst().Play(AudioTag.WuXiao);
        return false;
    },

    [BattleSkillType.ChengBao1]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.isChengBao1 = true;
        return true;
    },
    [BattleSkillType.MonsterSubMove]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.monsterMoveParcent -= (cfg.pram1 / 100);
        let monsters = scene.dynamic.monsters;
        if (monsters && monsters.size > 0) {
            monsters.forEach(monster => {
                monster.monsterCtrl.SetMoveSpeed();
            })
        }
        return true;
    },
    [BattleSkillType.MapAddRow]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        if (scene == null) {
            return false;
        }
        scene.MapAddRow();
        info.mapRow++;
        return false;
    },
    [BattleSkillType.WuXiaoHuoDeJinBi]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.isWuXiaoHuoDeJinBi = true;
        return true;
    },
    [BattleSkillType.ChengBao2]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.isChengBao2 = true;
        return true;
    },
    [BattleSkillType.XieJiao]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.isCanXieJiao = true;
        return true;
    },
    [BattleSkillType.MeiRiHeChengAdd]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.isMeiRiHeChengAdd = true;
        return true;
    },
    [BattleSkillType.ChuXianJiuShengJi]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        if (scene == null) {
            return false;
        }
        let hero_id = cfg.pram1;
        if (hero_id == 0) {
            return false;
        }
        scene.HeroUpById(hero_id);
        let heroBuff = info.skillAttri.GetHeroAttriBuff(hero_id);
        heroBuff.initLevel = 1;
        AudioManager.Inst().Play(AudioTag.WuXiao);
        return cfg;
    },
    [BattleSkillType.MeiRiAddStep]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.isMeiRiAddStep += 1;
        return true;
    },
    [BattleSkillType.AddStageHeroCount]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.stageHeroCount += cfg.pram1;
        return true;
    },
    [BattleSkillType.ChengBao3]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.isChengBao3 = true;
        return true;
    },

    [BattleSkillType.RandomSwapHero]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        if (scene == null) {
            return false;
        }
        let hero1 = scene.GetRandomHero(null, true);
        if (hero1) {
            let hero2 = scene.GetRandomHero(hero1, true);
            if (hero2) {
                let stage1 = hero1.stage;
                let stage2 = hero2.stage;
                scene.ResetHeroStage(hero1, stage2);
                scene.ResetHeroStage(hero2, stage1);
            }
        }
        return false;
    },

    [BattleSkillType.ZhiWUDuiBossJiaShang]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.bossHarmAdd += cfg.pram1 / 100;
        return true;
    },

    [BattleSkillType.ShuXingShangHaiTiSheng]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let heroIdList: number[] = info.in_battle_heros;
        if (BattleCtrl.Inst().battleModel == BattleModel.Arena) {
            if (info.tag == BattleObjTag.Player) {
                heroIdList = ArenaData.Inst().mainInfo.heroId;
            } else {
                heroIdList = ArenaData.Inst().matchHeroidList;
            }
        } else {
            heroIdList = info.in_battle_heros;
        }


        heroIdList.forEach(id => {
            if (id > 0) {
                let baseCfg = HeroData.Inst().GetHeroBaseCfg(id);
                if (baseCfg.hero_race == cfg.pram2) {
                    let heroSkillBuff = info.skillAttri.GetHeroAttriBuff(id);
                    if (heroSkillBuff) {
                        heroSkillBuff.harmScale += cfg.pram1 / 100;
                    }
                }
            }
        })

        return true;
    },

    [BattleSkillType.ShengJiZuiGaoYingXiong]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        if (scene == null) {
            return false;
        }
        let hero = scene.GetMaxCanUpHero();
        if (hero) {
            scene.RemoveHero(hero);
            scene.HeroUpByHero(hero);
        }
        return false;
    },

    [BattleSkillType.WuXiaoJiaBuShu]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        info.skillAttri.wuXiaoJiaBuShu = cfg.pram1;
        return true;
    },

    [BattleSkillType.ShengJiSuoYou0]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        if (scene == null) {
            return false;
        }
        let heros = scene.GetHeroListByLevel(cfg.pram1);
        if (heros && heros.length > 0) {
            heros.forEach(hero => {
                scene.RemoveHero(hero);
                scene.HeroUpByHero(hero, cfg.pram2);
            })
        }
        return false;
    },
    [BattleSkillType.DaLuanShunXu]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        if (scene == null) {
            return false;
        }
        scene.SwapAllHero();
        return false;
    },

    [BattleSkillType.AAToBB]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        if (scene == null) {
            return false;
        }
        let heroIdA = cfg.pram1;
        let heroIdB = cfg.pram2;
        let allA = scene.GetHeroListById(heroIdA);
        allA.forEach(hero => {
            scene.HeroChange(hero, heroIdB);
        });
        return false;
    },


    [BattleSkillType.HuiMieGu4]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.LiuXueCount += cfg.pram1;
        return true;
    },

    /////////////// 角色公用专区 //////////
    [BattleSkillType.ComGongSu]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackSpeed += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ComGongJi]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.harmScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ComJianSuValue]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.slowDown += cfg.pram1;
        return true;
    },
    [BattleSkillType.ComFuBaiJiaShang]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.fubaiScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ComZhongDuJiaShang]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.zhongduScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ComYiShang]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.yishangHarmScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ComTanSheShuLiang]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.tansheshuliang += cfg.pram1;
        return true;
    },
    [BattleSkillType.ComXuanYunTime]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.xuanyuanTime += cfg.pram1;
        return true;
    },
    [BattleSkillType.ComMeiHuoTime]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.meihuoTime += cfg.pram1;
        return true;
    },
    [BattleSkillType.ComZhuoShaoJiaShang]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.zuoshaoScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ComLiuXueJiaShang]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.lixueScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ComRangeScale]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackRangeScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ComZhuoShaoTime]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.zuoshaotime += cfg.pram1;
        return true;
    },
    [BattleSkillType.ComJianSuTime]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.jiansutime += cfg.pram1;
        return true;
    },
    [BattleSkillType.ComZhongJi]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.zhongji += cfg.pram1;
        return true;
    },
    [BattleSkillType.ComBaoJi]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.baoji += cfg.pram1;
        return true;
    },
    [BattleSkillType.ComZhongJiAdd]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        //暂无暴击加伤
        return true;
    },
    [BattleSkillType.ComBaoJiAdd]: (cfg: CfgSkillData, scene: IBattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.baojiScale += cfg.pram1;
        return true;
    },


    /////////////// 角色区域 ///////////////

    //投弹手
    [BattleSkillType.TouDanShou4]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackSpeed += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.TouDanShou6]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.lixueScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.TouDanShou8]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.harmScale += cfg.pram1 / 100;
        return true;
    },

    //冰霜
    [BattleSkillType.BingShuang2]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.bingdonggailv += cfg.pram1;
        return true;
    },
    [BattleSkillType.BingShuang3]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.jiansutime += cfg.pram1;
        return true;
    },
    [BattleSkillType.BingShuang6]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.jianseHarmScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.BingShuang7]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        info.skillAttri.AddMonsterBuffHarmScale(MonsterObjBuffType.JianSu, cfg.pram1 / 100);
        return true;
    },
    [BattleSkillType.BingShuang8]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.slowDown += cfg.pram1;
        return true;
    },


    //史莱姆
    [BattleSkillType.ShiLaiMu3]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.harmScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ShiLaiMu6]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackSpeed += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ShiLaiMu8]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.otherValue += cfg.pram1;
        return true;
    },

    //恶魔
    [BattleSkillType.ErMo2]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.zuoshaoScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ErMo4]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.zuoshaotime += cfg.pram1;
        return true;
    },
    [BattleSkillType.ErMo6]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.dianranHarmScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.ErMo7]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.dianranRange += cfg.pram1 - 1;
        return true;
    },
    [BattleSkillType.ErMo8]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.jianseRange += cfg.pram1 / 100;
        return true;
    },

    //冰冻菇
    [BattleSkillType.BingDongGu3]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.slowDown += cfg.pram1;
        return true;
    },
    [BattleSkillType.BingDongGu5]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackSpeed += cfg.pram1 / 100;
        return true;
    },

    //回旋花
    [BattleSkillType.HuiXuanHua4]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackSpeed += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.HuiXuanHua6]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.harmScale += cfg.pram1 / 100;
        return true;
    },

    //仙人掌
    [BattleSkillType.XianRenZhang4]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackSpeed += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.XianRenZhang6]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.harmScale += cfg.pram1 / 100;
        return true;
    },

    //蚕豆小丑
    [BattleSkillType.CanDouXiaoChou4]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.yishangcengshumax += cfg.pram1;
        return true;
    },
    [BattleSkillType.CanDouXiaoChou6]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackSpeed += cfg.pram1 / 100;
        return true;
    },

    //玉米机器人
    [BattleSkillType.YuMiJiQi1]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackRangeScale += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.YuMiJiQi3]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.chongDian += cfg.pram1;
        return true;
    },
    [BattleSkillType.YuMiJiQi4]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.xuanyuanTime += cfg.pram1;
        return true;
    },

    //坚果墙
    [BattleSkillType.JianGuoQiang3]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackSpeed += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.JianGuoQiang4]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.harmScale += cfg.pram1 / 100;
        return true;
    },

    //香蒲猫
    [BattleSkillType.XiangPuMao3]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.harmScale += cfg.pram1 / 100;
        attri.attackRangeScale += cfg.pram2 / 100;
        return true;
    },
    [BattleSkillType.XiangPuMao4]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.attackSpeed += cfg.pram1 / 100;
        return true;
    },
    [BattleSkillType.XiangPuMao6]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.harmScale += cfg.pram1 / 100;
        return true;
    },

    //睡莲
    [BattleSkillType.ShuiLian3]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.JiTuiCount += cfg.pram1;
        return true;
    },
    [BattleSkillType.ShuiLian4]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.HaiLangGaiLv += cfg.pram1;
        return true;
    },

    //毁灭姑
    [BattleSkillType.HuiMieGu5]: (cfg: CfgSkillData, scene: BattleScene, info: BattleInfo) => {
        let attri = info.skillAttri.GetHeroAttriBuff(cfg.hero_id);
        attri.BatCount += cfg.pram1;
        return true;
    },

}

//特殊词条转换
export var SpecialSkillConvert: { [key: number]: (cfg: CfgSkillData, heroid?: number, heroIdList?: number[]) => CfgSkillData } = {
    // 场上xx变成xx
    [BattleSkillType.UpHero]: (cfg: CfgSkillData, heroid?: number) => {
        let heroids = BattleData.Inst().in_battle_heros;
        //let CfgSkill27Map = BattleData.Inst().battleInfo.CfgSkill27Map;
        let CfgSkill26Map = BattleData.Inst().battleInfo.CfgSkill26Map;
        if (heroid == null) {
            let list: number[] = []
            let totalNum = 0;
            heroids.forEach((v) => {
                if (!BattleData.Inst().IsHasSpSkill(SP_SKILL_ID_B, v)) {
                    let scene = BattleCtrl.Inst().battleScene;
                    let count = scene.GetHeroCount(v, 0);
                    if (count > 0) {
                        list.push(v);
                        let rate: number = BattleData.Inst().battleInfo.GetSpSkill26HeroRate(v);
                        totalNum += rate;
                    }
                }
            })
            if (list.length > 0) {
                let randomValue = MathHelper.GetRandomNum(0, totalNum);
                let n = 0
                for (let id of list) {
                    let rate = BattleData.Inst().battleInfo.GetSpSkill26HeroRate(id);
                    n += rate;
                    if (n >= randomValue) {
                        heroid = id;
                        break
                    }
                }
            }
        }
        if (heroid == null) {
            heroid = heroids[0];
        }
        if (CfgSkill26Map.has(heroid)) {
            return CfgSkill26Map.get(heroid);
        }
        let heroBattleCfg0 = HeroData.Inst().GetHeroBattleCfg(heroid, 0);
        let heroBattleCfg1 = HeroData.Inst().GetHeroBattleCfg(heroid, 1);
        let data = new CfgSkillData();
        data.color = cfg.color;
        data.skill_id = cfg.skill_id;
        data.skill_type = cfg.skill_type;
        data.word = Format(Language.Battle.SpSkillDesc1, heroBattleCfg0.name, heroBattleCfg1.name);
        data.pram1 = heroid;
        data.icon_res_id = BattleData.Inst().GetSkillOtherIconCfg(heroid, data.skill_id).icon_res_id;
        CfgSkill26Map.set(heroid, data);
        return data;
    },
    // 场上出现xx就变成xx
    [BattleSkillType.ChuXianJiuShengJi]: (cfg: CfgSkillData, heroid?: number) => {
        let heroids = BattleData.Inst().in_battle_heros;
        let CfgSkill27Map = BattleData.Inst().battleInfo.CfgSkill27Map;
        if (heroid == null) {
            // for (let i = 0; i < 100000; i++) {
            //     let randomIndex = MathHelper.GetRandomNum(0, heroids.length - 1);
            //     if (!CfgSkill27Map.has(heroids[randomIndex])) {
            //         heroid = heroids[randomIndex];
            //         break;
            //     }
            // }
            let list: number[] = []
            heroids.forEach((v) => {
                if (!BattleData.Inst().IsHasSpSkill(SP_SKILL_ID_B, v)) {
                    list.push(v);
                }
            })
            if (list.length > 0) {
                let randomIndex = MathHelper.GetRandomNum(0, list.length - 1);
                heroid = list[randomIndex];
            }
        }

        if (heroid == null) {
            heroid = heroids[0];
        }

        if (CfgSkill27Map.has(heroid)) {
            return CfgSkill27Map.get(heroid);
        }
        let heroBattleCfg0 = HeroData.Inst().GetHeroBattleCfg(heroid, 0);
        let heroBattleCfg1 = HeroData.Inst().GetHeroBattleCfg(heroid, 1);
        let data = new CfgSkillData();
        data.color = cfg.color;
        data.skill_id = cfg.skill_id;
        data.skill_type = cfg.skill_type;
        data.word = Format(Language.Battle.SpSkillDesc2, heroBattleCfg0.name, heroBattleCfg1.name);
        data.pram1 = heroid;
        data.icon_res_id = BattleData.Inst().GetSkillOtherIconCfg(heroid, data.skill_id).icon_res_id;
        CfgSkill27Map.set(heroid, data);
        return data;
    },

    [BattleSkillType.ShuXingShangHaiTiSheng]: (cfg: CfgSkillData, raceType?: number, heroIdList?: number[]) => {
        let CfgSkill525Map = BattleData.Inst().battleInfo.CfgSkill525Map;
        if (raceType == null) {
            if (heroIdList == null) {
                heroIdList = BattleData.Inst().battleInfo.in_battle_heros;
            }
            let racePool: number[] = [];
            heroIdList.forEach(id => {
                if (id > 0) {
                    let baseCfg = HeroData.Inst().GetHeroBaseCfg(id);
                    if (baseCfg.hero_race && racePool.indexOf(baseCfg.hero_race) == -1) {
                        racePool.push(baseCfg.hero_race);
                    }
                }
            })

            let randomIndex = MathHelper.GetRandomNum(0, racePool.length - 1);
            raceType = racePool[randomIndex];
        }

        if (CfgSkill525Map.has(raceType)) {
            return CfgSkill525Map.get(raceType);
        }

        let data = new CfgSkillData();
        data.color = cfg.color;
        data.skill_id = cfg.skill_id;
        data.skill_type = cfg.skill_type;

        let raceName = GetCfgValue(Language.Hero.Race, raceType)
        data.word = Format(Language.Battle.SpSkillDesc3, raceName, cfg.pram1);
        data.pram1 = cfg.pram1;
        data.pram2 = raceType;
        data.icon_num = cfg.icon_num;
        data.icon_res_id = "hero_race_" + raceType;
        CfgSkill525Map.set(raceType, data);
        return data;
    },

    [BattleSkillType.AAToBB]: (cfg: CfgSkillData, raceType?: number) => {
        let heroids = BattleData.Inst().in_battle_heros;
        let randoms = MathHelper.GetRandomNumList(0, heroids.length - 1, 2);
        let heroA = heroids[randoms[0]]
        let heroB = heroids[randoms[1]]
        let aCfg = HeroData.Inst().GetHeroBaseCfg(heroA);
        let bCfg = HeroData.Inst().GetHeroBaseCfg(heroB);
        let data = new CfgSkillData();
        data.color = cfg.color;
        data.skill_id = cfg.skill_id;
        data.skill_type = cfg.skill_type;
        data.word = Format(Language.Battle.SpSkillDesc4, aCfg.hero_name, bCfg.hero_name);
        data.pram1 = heroA;
        data.pram2 = heroB;
        data.icon_res_id = cfg.icon_res_id
        return data;
    }
}


//词条能否添加的特殊条件
export var SkillIsCanAddCheckFunc: { [key: number]: (skill: CfgSkillData) => boolean } = {
    [BattleSkillType.AddHp]: (skill: CfgSkillData) => {
        let battle_info = BattleData.Inst().battleInfo;
        if (battle_info.hp >= battle_info.maxHp) {
            return false;
        }
        return true;
    },
    [BattleSkillType.MapAddRow]: (skill: CfgSkillData) => {
        let battle_info = BattleData.Inst().battleInfo;
        if (battle_info.mapRow >= MAX_MAP_ROW) {
            return false;
        }
        return true;
    }
}


// *************** 其他技能类型 *************
export var BattleOtherSkillType: { [key: string]: number } = {
    AddStepNumInStart: 1,       //开局额外获得{0}步
    AddAttackSpeed: 2,          //增加英雄攻击速度{0}%
    AddHarm: 3,                 //增加英雄攻击力{0}%
    AddHeroSelect: 4,           //进入酒馆时，可以选择的英雄数量+{0} 
    LowerMonsterHp: 5,          //小怪血量降低{0}%
    Box: 6,                     //开局直接获得{0}个绿色宝箱
    LowerMonsterSpeed: 9,       //敌人移动速度降低{0}%
    LowerBossHp: 10,            //BOSS血量降低{0}%
    AddHeroZhongJi: 11,         //增加英雄重击率{0}%
    MapAddRow: 12,              //开局额外增加{0}行
}

type BattleOtherSkillTypeFunc = (cfg: CfgShenDianSkill, scene: BattleScene, battleInfo: BattleInfo, count: number) => void;
//词条处理
export var BattleOtherSkillHandle: { [key: number]: BattleOtherSkillTypeFunc } = {
    [BattleOtherSkillType.AddStepNumInStart]: (cfg: CfgShenDianSkill, scene: BattleScene, info: BattleInfo, count: number) => {
        info.AddStepNum(cfg.pram1 * count);
    },
    [BattleOtherSkillType.AddAttackSpeed]: (cfg: CfgShenDianSkill, scene: BattleScene, info: BattleInfo, count: number) => {
        info.skillAttri.attackSpeedPercent += (cfg.pram1 / 100) * count;
    },
    [BattleOtherSkillType.AddHarm]: (cfg: CfgShenDianSkill, scene: BattleScene, info: BattleInfo, count: number) => {
        info.skillAttri.harmPercent += (cfg.pram1 / 100) * count;
    },
    [BattleOtherSkillType.LowerMonsterHp]: (cfg: CfgShenDianSkill, scene: BattleScene, info: BattleInfo, count: number) => {
        info.skillAttri.xiaoguaiHpPercent -= count * cfg.pram1 / 100;
    },
    [BattleOtherSkillType.Box]: (cfg: CfgShenDianSkill, scene: BattleScene, info: BattleInfo, count: number) => {
        if (scene == null) {
            return;
        }
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < cfg.pram1; j++) {
                scene.AddPreBox(cfg.pram2);
            }
        }
    },
    [BattleOtherSkillType.LowerMonsterSpeed]: (cfg: CfgShenDianSkill, scene: BattleScene, info: BattleInfo, count: number) => {
        info.skillAttri.monsterMoveParcent -= (cfg.pram1 / 100);
    },
    [BattleOtherSkillType.LowerBossHp]: (cfg: CfgShenDianSkill, scene: BattleScene, info: BattleInfo, count: number) => {
        info.skillAttri.bossHpPercent -= count * cfg.pram1 / 100;
    },
    [BattleOtherSkillType.AddHeroZhongJi]: (cfg: CfgShenDianSkill, scene: BattleScene, info: BattleInfo, count: number) => {
        info.skillAttri.zhongji += cfg.pram1 * count;
    },
    [BattleOtherSkillType.MapAddRow]: (cfg: CfgShenDianSkill, scene: BattleScene, info: BattleInfo, count: number) => {
        for (let i = 0; i < count; i++) {
            info.mapRow++;
        }
    },
}


//英雄每日增益类型  配置都是万分比
export var HeroBattleDayBuffType: { [key: string]: number } = {
    Harm: 1,             //攻击力
    AttackSpeed: 2,      //攻速
    AttHarm: 3,          //属性伤害
    BaoJiLv: 4,          //暴击率
    BaoJiShangHai: 5,    //暴击增伤
}

type HeroBattleDayBuffTypeFunc = (heroId: number, value: number, info: BattleInfo) => void;

//增益处理
export var HeroBattleDayBuffHandle: { [key: number]: HeroBattleDayBuffTypeFunc } = {
    [HeroBattleDayBuffType.Harm]: (heroId: number, value: number, info: BattleInfo) => {
        let buff = info.skillAttri.GetHeroAttriBuff(heroId);
        buff.harmScale += value / 10000
    },
    [HeroBattleDayBuffType.AttackSpeed]: (heroId: number, value: number, info: BattleInfo) => {
        let buff = info.skillAttri.GetHeroAttriBuff(heroId);
        buff.attackSpeed += value / 10000
    },
    [HeroBattleDayBuffType.AttHarm]: (heroId: number, value: number, info: BattleInfo) => {
        let buff = info.skillAttri.GetHeroAttriBuff(heroId);
        buff.harmScale += value / 10000
    },
    [HeroBattleDayBuffType.BaoJiLv]: (heroId: number, value: number, info: BattleInfo) => {
        let buff = info.skillAttri.GetHeroAttriBuff(heroId);
        buff.baoji += value / 100
    },
    [HeroBattleDayBuffType.BaoJiShangHai]: (heroId: number, value: number, info: BattleInfo) => {
        let buff = info.skillAttri.GetHeroAttriBuff(heroId);
        buff.baojiScale += value / 10000
    },
}


//研究所处理
type InstituteTalentFunc = (cfg: CfgInstituteLevel, info: BattleInfo) => void;
export var InstituteTalentHandle: { [key: number]: InstituteTalentFunc } = {
    [InstituteTalentType.Skill]: (cfg: CfgInstituteLevel, info: BattleInfo) => {
        info.institute_skills.add(cfg.param);
    },
    [InstituteTalentType.AttackValue]: (cfg: CfgInstituteLevel, info: BattleInfo) => {
        info.skillAttri.attackValue += cfg.param;
    },
    [InstituteTalentType.AttackSpeed]: (cfg: CfgInstituteLevel, info: BattleInfo) => {
        info.skillAttri.attackSpeedPercent += cfg.param / 10000;
    },
    [InstituteTalentType.AttackHarm]: (cfg: CfgInstituteLevel, info: BattleInfo) => {
        info.skillAttri.harmPercent += cfg.param / 10000;
    },
    [InstituteTalentType.BaoJi]: (cfg: CfgInstituteLevel, info: BattleInfo) => {
        info.skillAttri.baoji = cfg.param / 10000;
    },
    [InstituteTalentType.BaojiScale]: (cfg: CfgInstituteLevel, info: BattleInfo) => {
        info.skillAttri.baojiScale = cfg.param / 10000;
    },

    [InstituteTalentType.BattleExp]: (cfg: CfgInstituteLevel, info: BattleInfo) => {
        info.skillAttri.monsterExpPercent += cfg.param / 10000;
    },
    [InstituteTalentType.StepNum]: (cfg: CfgInstituteLevel, info: BattleInfo) => {
        info.skillAttri.isMieJieAddStep += cfg.param;
    },
    [InstituteTalentType.CoinRate]: (cfg: CfgInstituteLevel, info: BattleInfo) => {
        info.skillAttri.coidRate += cfg.param / 10000;
    },
}


//////////////// 怪物buff //////////////////////

export enum MonsterObjBuffType {
    JianSu = 1,       //冰霜减速
    BingDong = 2,     //冰霜冰冻
    XuanYun = 3,    //眩晕
    LiuXue = 4,     //流血
    ZhuoShao = 5,   //灼烧
    FuBai = 6,      //腐败
    JinGu = 7,      //禁锢
    ZhongDu = 8,    //中毒
    KonJu = 9,      //恐惧
    JianTa = 10,    //践踏
    MeiHuo = 11,   //魅惑 
    JiTui = 12,     //击退
    RuoHua = 13,    //弱化
    ChanRao = 14,  //缠绕
    WuDi = 15,  //无敌
    YiShang = 16, //易伤
    HuoJuJianSu = 17,//火炬木减速(效果不叠加)
    DeductHp = 18,      //很单纯的扣血
    BingXueYinJi = 19,//滴水冰莲冰雪印记
}

export enum HeroObjBuffType {
    ChongDian = 1,              //充电
    XuanYun = 2,              //眩晕
    Yang = 3,              //羊
    Stop = 4,              //停止攻击
    WaitDie = 5,            //等待死亡
    Sleep = 6,//睡眠
    ShiXue = 7,//嗜血
    TimeProgress = 8,   //冷却进度条
    HuoJu = 9,//火炬木专属buff1
    GuangMingZhuFu = 10,    //光明祝福 加攻速
    KuangNu = 11,           //莲小蓬狂怒
    JiLi = 12,          //激励
}

//伤害类型
export enum MonsterHarmType {
    WuLi = 1,   //物理
    Shui = 2,   //水
    An = 3,     //暗
    Du = 4,     //毒
    Huo = 5,    //火
    Tu = 6,     //土
    Gunag = 7,  //光

    BingDong = 101,   //冰冻
    CanRao = 102,     //缠绕
    KonJu = 103,      //恐惧
    LiuXue = 104,    //流血
    MeiHuo = 105,    //魅惑
    ZhongDu = 106,   //中毒
    ZuoShao = 107,   //灼烧
}

//buff对应的伤害类型
export var BuffToHarmType: { [key: number]: number } = {
    [MonsterObjBuffType.LiuXue]: MonsterHarmType.LiuXue,
    [MonsterObjBuffType.ZhuoShao]: MonsterHarmType.ZuoShao,
    [MonsterObjBuffType.FuBai]: MonsterHarmType.ZhongDu,
    [MonsterObjBuffType.ZhongDu]: MonsterHarmType.ZhongDu,
    [MonsterObjBuffType.DeductHp]: MonsterHarmType.LiuXue,
}

//伤害字体
export var BattleHarmFont: { [key: number]: string } = {
    [MonsterHarmType.WuLi]: "WuLiFont",
    [MonsterHarmType.Shui]: "ShuiFont",
    [MonsterHarmType.An]: "AnFont",
    [MonsterHarmType.Du]: "DuFont",
    [MonsterHarmType.Huo]: "HuoFont",
    [MonsterHarmType.Tu]: "TuFont",
    [MonsterHarmType.Gunag]: "GuangFont",

    [MonsterHarmType.BingDong]: "BongDongFont",
    [MonsterHarmType.CanRao]: "CanRaoFont",
    [MonsterHarmType.KonJu]: "KonJuFont",
    [MonsterHarmType.LiuXue]: "LiuXueFont",
    [MonsterHarmType.MeiHuo]: "MeiHuoFont",
    [MonsterHarmType.ZhongDu]: "ZhongDuFont",
    [MonsterHarmType.ZuoShao]: "ZuoShaoFont",
}

export interface IMonsterObjBuffData {
    buffType: MonsterObjBuffType;
    time?: number;
    hero: HeroObj;
    p1?: number;
    p2?: number;
}

export interface IHeroObjBuffData {
    buffType: HeroObjBuffType;
    time: number;
    p1?: number;
    p2?: number;
    hero?: HeroObj;//不必要字段
}

export var MonsterBUffTypeMap: { [key: number]: any } = {
    [MonsterObjBuffType.JianSu]: BingShuangJianSuBuff,
    [MonsterObjBuffType.BingDong]: BingShuangBingDongBuff,
    [MonsterObjBuffType.XuanYun]: XuanYunBuff,
    [MonsterObjBuffType.LiuXue]: LiuXueBuff,
    [MonsterObjBuffType.ZhuoShao]: ZuoShaoBuff,
    [MonsterObjBuffType.JinGu]: JinGuBuff,
    [MonsterObjBuffType.FuBai]: FuBaiBuff,
    [MonsterObjBuffType.JianTa]: JianTaJianSuBuff,
    [MonsterObjBuffType.MeiHuo]: MeiHuoBuff,
    [MonsterObjBuffType.JiTui]: JiTuiBuff,
    [MonsterObjBuffType.RuoHua]: RuoHuaSuBuff,
    [MonsterObjBuffType.ZhongDu]: ZhongDuBuff,
    [MonsterObjBuffType.ChanRao]: ChanRaoBuff,
    [MonsterObjBuffType.KonJu]: KongJuBuff,
    [MonsterObjBuffType.WuDi]: WuDiBuff,
    [MonsterObjBuffType.YiShang]: YiShangBuff,
    [MonsterObjBuffType.HuoJuJianSu]: HuoJuJianSuBuff,
    [MonsterObjBuffType.DeductHp]: DeductHpBuff,
    [MonsterObjBuffType.BingXueYinJi]: BingXueYinJiBuff,
}


export var HeroBUffTypeMap: { [key: number]: any } = {
    [HeroObjBuffType.ChongDian]: ChongDianBuff,
    [HeroObjBuffType.XuanYun]: H_XuanYunBuff,
    [HeroObjBuffType.Yang]: H_YangBuff,
    [HeroObjBuffType.Stop]: H_Stopff,
    [HeroObjBuffType.WaitDie]: H_WaitDieBuff,
    [HeroObjBuffType.Sleep]: H_SleepBuff,
    [HeroObjBuffType.ShiXue]: H_ShiXueBuff,
    [HeroObjBuffType.TimeProgress]: H_TimeProgressBuff,
    [HeroObjBuffType.HuoJu]: H_HuoJuBuff,
    [HeroObjBuffType.GuangMingZhuFu]: H_GuangMingZhuFuBuff,
    [HeroObjBuffType.KuangNu]: H_KuangNuBuff,
    [HeroObjBuffType.JiLi]: H_JiLiBuff,
}

// 特殊地形类型
export enum CellSpType {
    Harm = 1,           //1=增加或减少英雄攻击力（百分比）
    AttackSpeed = 2,    //2=增加或降低英雄攻速（百分比）
    Dizziness = 3,      //3=每隔5s，眩晕英雄1s
    Swap = 4,           //4=与随机位置的棋子交换位置
    Property = 5,       //5=x属性站在上面，伤害增加
}

export var CellSPTypeMap: { [key: number]: any } = {
    [CellSpType.Harm]: CellSpCellHarm,
    [CellSpType.AttackSpeed]: CellSpCellAttackSpeed,
    [CellSpType.Dizziness]: CellSpCellDizziness,
    [CellSpType.Swap]: CellSpCellSwap,
    [CellSpType.Property]: CellSpCellProperty,
}

export enum ENUM_BATTLE_MOVE_TYPE {
    NORMAL = 0,
    /**弧线 */
    ARC = 1,
}

export enum HeroTypeId {
    LaBi = 33,
}

export var MONSTER_SKILL_INDEX: { [key: number]: new (cfg: CfgMonsterSkillData, ctrl: MonsterControl) => SkillMonster } = {
    1: SkillMonster1,
    2: SkillMonster2,
    3: SkillMonster3,
    4: SkillMonster4,
    5: SkillMonster5,
    6: SkillMonster6,
    7: SkillMonster7,
    8: SkillMonster8,
    9: SkillMonster9,
    10: SkillMonster10,
    11: SkillMonster11,
    12: SkillMonster12,

}

export var BATTLE_HP_NO_SHOW: { [key: number]: boolean } = {
    150211: true,
}
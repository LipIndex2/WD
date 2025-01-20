import { DEBUG } from "cc/env";
import { Singleton } from "core/Singleton";
import { BattleModel, BattleState, MonsterCreateInfo, MonsterObjBuffType } from "./BattleConfig";
import { BattleCtrl } from "./BattleCtrl";
import { HeroSkillId } from "./HeroSkillId";
import { BattleData, IBattleHeroInfo } from "./BattleData";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { PackageData } from "preload/PkgData";
import { CfgMonsterCtrl } from "config/CfgMonsterCtrl";

export class BattleDebugData extends Singleton {
    //是否开启战斗调试模式
    static BATTLE_DEBUG_MODE = false;
    constructor() {
        super();
        BattleDebugData.BATTLE_DEBUG_MODE = PackageData.Inst().getIsDebug() && BattleDebugData.BATTLE_DEBUG_MODE
    }
    //玩家造成的所有伤害百分比缩放
    PlayerDamageScale = 1;

    //城堡无敌
    GodCastle = true;
    //关闭系统词条选择(升级,宝箱)
    CloseSystemSkill = true;
    //英雄是否攻击
    IsHeroAttack = true;
    //怪物是否攻击
    IsMonsterAttack = true;
    //是否显示碰撞盒
    IsDrawCollider = false;
    //打印怪物伤害信息
    PrintHarmInfo = false;

    //战斗中自带的词条
    HeroSkills: number[] = [541,542,543,544,545,546,547,548,549,550
        //=================辣比==================
        // HeroSkillId.Labi.TowFire,
        // HeroSkillId.Labi.ThreeFire,
        // HeroSkillId.Labi.ZhuoShaoDam,
        // HeroSkillId.Labi.GongSU,
        // HeroSkillId.HuoLongGuo.Skill1,
        // HeroSkillId.HuoLongGuo.Skill2,
        // HeroSkillId.HuoLongGuo.Skill3,
        // HeroSkillId.HuoLongGuo.Skill4,
        // HeroSkillId.HuoLongGuo.Skill5,
        // HeroSkillId.HuoLongGuo.Skill6,
        //HeroSkillId.HuoLongGuo.Skill7,
        // HeroSkillId.HuoLongGuo.Skill8,
        // HeroSkillId.HuoLongGuo.Skill9,
        // HeroSkillId.HuoLongGuo.Skill10,
        // HeroSkillId.HuoLongGuo.Skill11,
        // HeroSkillId.LiuLian.Skill1,
        // HeroSkillId.LiuLian.Skill2,
        // HeroSkillId.LiuLian.Skill3,
        // HeroSkillId.LiuLian.Skill4,
        // HeroSkillId.LiuLian.Skill5,
        // HeroSkillId.LiuLian.Skill6,
        // HeroSkillId.LiuLian.Skill7,
        // HeroSkillId.LiuLian.Skill8,
        // HeroSkillId.LiuLian.Skill9,
        // HeroSkillId.LiuLian.Skill10,
        // HeroSkillId.LiuLian.Skill11,
        //HeroSkillId.TieChuiLan.Skill1,
        //HeroSkillId.TieChuiLan.Skill7,
        //HeroSkillId.TieChuiLan.Skill11,
        // HeroSkillId.DaZuiHua.Skill1,
        // HeroSkillId.DaZuiHua.Skill2,
        // HeroSkillId.DaZuiHua.Skill3,
        // HeroSkillId.DaZuiHua.Skill4,
        // HeroSkillId.DaZuiHua.Skill5,
        // HeroSkillId.DaZuiHua.Skill6,
        // HeroSkillId.DaZuiHua.Skill7,
        // HeroSkillId.DaZuiHua.Skill8,
        // HeroSkillId.DaZuiHua.Skill9,
        // HeroSkillId.DaZuiHua.Skill10,
    ];

    //怪物出身自带的buff
    MonsterBuff: number[] = [
        //MonsterObjBuffType.ZhuoShao
    ];

    //上阵英雄
    InBattleHeros: IBattleHeroInfo[] = [
        //{heroId:1, heroLevel:1},    //投弹手
        //{heroId:2, heroLevel:1},    //冰霜
        //{heroId:3, heroLevel:1},    /恶魔
        //{heroId:4, heroLevel:1},    //史莱姆
        //{heroId:5, heroLevel:1},    //樱桃炸弹
        //{heroId:6, heroLevel:1},    //椰子
        //{heroId:7, heroLevel:1},    //毁灭菇
        //{heroId:9, heroLevel:1},    //吸贴花
        //{heroId:10, heroLevel:1},   //玉米机器人
        //{heroId:12, heroLevel:1},   //木乃梨
        //{heroId:13, heroLevel:1},   //冰冻菇
        //{heroId:15, heroLevel:1},   //魅惑菇
        //{heroId:16, heroLevel:1},   //回旋花
        //{heroId:17, heroLevel:1},   //睡莲
        //{heroId:18, heroLevel:1},   //荆棘草
        //{heroId:19, heroLevel:1},   //莲藕
        //{heroId:20, heroLevel:1},   //幽灵辣椒
        //{heroId:21, heroLevel:1},   //坚果墙
        //{heroId:22, heroLevel:1},   //海带恶魔
        //{heroId:23, heroLevel:1},   //仙人掌
        //{heroId:25, heroLevel:1},   //忧郁蘑菇
        //{heroId:26, heroLevel:1},   //南瓜
        //{heroId:29, heroLevel:1},   //棱镜草(艾米)
        //{heroId:30, heroLevel:1},   //香蒲猫
        //{heroId:32, heroLevel:1},   //斯巴达竹
        //{heroId:34, heroLevel:1},   //葡萄球
        //{heroId:41, heroLevel:1},   //倭瓜
        //{heroId:40, heroLevel:1},   //榴莲
        //{heroId:38, heroLevel:1},   //铁锤兰
        //{heroId:41, heroLevel:1},   //火龙果
        //{heroId:43, heroLevel:1},   //大嘴花
        //{heroId:45, heroLevel:1},   //榴莲
        {heroId:45, heroLevel:1}
    ];

    //怪物波数：1，0，-1。分别代表一波，正常。无线怪物
    monsterRoundCount:number = -1;
    //出现的怪物
    get MonsterInfos(): MonsterCreateInfo[] {
        let monster_id = 1;
        let list = [
            this.CreateMonterInfoFunc(monster_id, 9, 0),
            this.CreateMonterInfoFunc(monster_id, 8, 1),
            this.CreateMonterInfoFunc(monster_id, 9, 2),
            this.CreateMonterInfoFunc(monster_id, 9, 3),
            this.CreateMonterInfoFunc(monster_id, 9, 4),
            this.CreateMonterInfoFunc(monster_id, 9, 5),
        ]
        return list;
    }

    CreateMonterInfoFunc(monster_id: number, i: number, j: number): MonsterCreateInfo {
        let pos = BattleCtrl.Inst().battleScene.battleBG.GetWorldPos(i, j);
        let info = new MonsterCreateInfo(0, monster_id, 0, pos, i, j, CfgMonsterCtrl.ctrl_list[0]);
        return info;
    }
}


export class BattleGMItemData {
    Func: (params: number[]) => void;
    paramList: string[];
    btnText: string;
    tags: Set<number>;
    constructor(btnText: string, params: string[], func: (params: number[]) => void, tags?:number[]) {
        this.Func = func;
        this.btnText = btnText;
        this.paramList = params;
        this.tags = new Set<number>();
        this.tags.add(1);
        if(tags){
            tags.forEach(tag=>{
                this.tags.add(tag);
            })
        }
    }
}

export const BattleGMList: BattleGMItemData[] = [
    new BattleGMItemData("指定回合", ["回合数"], (params: number[]) => {
        let battleInfo = BattleData.Inst().battleInfo;
        let roundNum = params[0] - 1;
        if (roundNum > battleInfo.roundProgerssMax) {
            roundNum = battleInfo.roundProgerssMax;
        }
        let roundLength = 10;
        if(BattleCtrl.Inst().battleModel == BattleModel.Defense){
            roundLength = BattleCtrl.Inst().battleSceneDef.dataModel.curStage.RoundLength();
        }else{
            roundLength = BattleCtrl.Inst().battleScene.dataModel.curStage.RoundLength();
        }
        let stageIndex = Math.floor(roundNum / roundLength);
        let roundIndex = roundNum % roundLength;
        battleInfo.roundIndex = roundIndex - 1;
        battleInfo.stageIndex = stageIndex;
        battleInfo.roundProgerss = roundNum;
        PublicPopupCtrl.Inst().Center("下回合将进行指定回合");
    },[1,2]),
    new BattleGMItemData("添加词条", ["词条id"], (params: number[]) => {
        let skillid = params[0];
        PublicPopupCtrl.Inst().Center("GM添加词条id " + skillid);
        let skill = BattleData.Inst().GetSkillCfg(skillid);
        BattleData.Inst().AddSkill(skill);
    },[1,2]),
    new BattleGMItemData("升级英雄", ["英雄id", "行", "列"], (params: number[]) => {
        if(BattleCtrl.Inst().battleScene.battleInfo.battleState != BattleState.SanXiao){
            PublicPopupCtrl.Inst().Center("三消阶段才可升级英雄");
            return;
        }
        let i = params[1];
        let j = params[2];
        if (i > 0 && j > 0) {
            let hero = BattleCtrl.Inst().battleScene.GetHero(i - 1, j - 1);
            if (hero && !hero.IsFull() && !hero.IsItem()) {
                BattleCtrl.Inst().battleScene.HeroUpByHero(hero, 1);
            }
            return;
        }
        let hero_id = params[0];
        BattleCtrl.Inst().battleScene.HeroUpAll(hero_id);
    }),
    new BattleGMItemData("伤害比例", ["比例"], (params: number[]) => {
        let scale = params[0];
        BattleData.Inst().battleInfo.globalAttackScale = scale;
    },[1,2]),
    new BattleGMItemData("添加经验", ["经验"], (params: number[]) => {
        let exp = params[0];
        BattleData.Inst().battleInfo.AddExp(exp);
    },[1,2]),
    new BattleGMItemData("秒杀怪物", [], (params: number[]) => {
        BattleCtrl.Inst().battleScene.DieAll();
    }),
    new BattleGMItemData("怪物波数", ["波数"], (params: number[]) => {
        BattleDebugData.Inst().monsterRoundCount = params[0];
        let queue = BattleCtrl.Inst().battleScene.GetRoundActionQueue();
        if(params[0] == -1){
            queue.SetLoop(true);
        }else{
            queue.SetLoop(false);
        }
    }),
]


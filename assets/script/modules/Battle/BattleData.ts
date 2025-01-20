import { Vec3 } from "cc";
import { CfgBattleCoinRate } from "config/CfgBattleCoinRate";
import { CfgBattleGuide, CfgGuideStap } from "config/CfgBattleGuide";
import { CfgDailyChallengeDataChallengesRule } from "config/CfgDailyChallenge";
import { CfgEntry, CfgSkillData, CfgSkillGroup, CfgSkillIconOther, CfgSkillOther } from "config/CfgEntry";
import { CfgHero, CfgHeroBattle } from "config/CfgHero";
import { CfgMonsterData, CfgMonsterSkillData } from "config/CfgMonster";
import { CfgSceneBattleLevel, CfgSceneData, CfgSceneRound, CfgSceneStage, GetSceneCfgPath } from "config/CfgScene";
import { CfgSceneArenaBG, CfgSceneBG, CfgSceneMainBG } from "config/CfgSceneBG";
import { LogError } from "core/Debugger";
import { DataBase } from "data/DataBase";
import { CreateSMD, SMDTriggerNotify, smartdata } from "data/SmartData";
import { CfgManager } from "manager/CfgManager";
import { Prefskey } from "modules/common/PrefsKey";
import { HeroSkillCell, HeroSkillShowType } from "modules/common_item/HeroSkillCellItem";
import { HeroData, HeroRaceType } from "modules/hero/HeroData";
import { MainFBData } from "modules/main_fb/MainFBData";
import { RoleData } from "modules/role/RoleData";
import { DataHelper } from "../../helpers/DataHelper";
import { MathHelper } from "../../helpers/MathHelper";
import { UtilHelper } from "../../helpers/UtilHelper";
import { RandomSkillListAction } from "./BattleAction";
import { BATTLE_SPEED_CFG, BattleChallengeRuleType, BattleSkillHandle, BattleSkillType, BattleState, CfgCoinData, DEFAULT_HP, HeroAttriType, INIT_MAP_ROW, ISceneSkillDataRateCfg, MonsterHarmType, MonsterObjBuffType, SceneType, SpecialSkillConvert, SP_SKILL_ID_A, SP_SKILL_ID_B, BATTLE_HP_NO_SHOW, SkillIsCanAddCheckFunc, BattleOtherSkillHandle, HeroBattleDayBuffHandle, SP_SKILL_ID_C, InstituteTalentHandle, BattleSkillSource, SP_SKILL_ID_D, BattleObjTag, BattleModel } from "./BattleConfig";
import { BattleCtrl } from "./BattleCtrl";
import { BattleDebugData } from "./BattleDebugCfg";
import { BattleHarmShowIconType, IBattleHarmShowItemData, IBattleRountInfoItemData } from "./BattleView";
import { SevenDayHeroData } from "modules/seven_day_hero/SevenDayHeroData";
import { IQueuePlayFuncItem } from "./Function/QueueFunc";
import { CfgBarrierInfoData } from "config/CfgBarrierInfo";
import { IBattleAttackInfoItemData } from "./BattleFinishView";
import { LoseTempleData, RemainsSkillList } from "modules/LoseTemple/LoseTempleData";
import { CfgLostTemple, CfgShenDianSkill } from "config/CfgLostTemple";
import { DEBUG } from "cc/env";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { Mod } from "modules/common/ModuleDefine";
import { CfgBackyard } from "config/CfgBackyard";
import { ActivityCombatData } from "modules/ActivityCombat/ActivityCombatData";
import { HeroTrialData } from "modules/HeroTrial/HeroTrialData";
import { InstituteData } from "modules/Institute/InstituteCtrl";
import { CfgInstituteLevel } from "config/CfgInstitute";
import { CfgSupplyCardData } from "config/CfgSupplyCard";
import { ArenaData } from "modules/Arena/ArenaData";
import { CfgBarrierAtt, CfgBarrierAttInfo } from "config/CfgBarrierAtt";
import { Language } from "modules/common/Language";
import { Format } from "../../helpers/TextHelper";


//随机词条的记录
export interface IRandomSkillRecord {
    group_id: number,
    is_get_hero: boolean,
    quas: number[],
}

//步数添加票字
export interface ICenterStepNumTipData {
    worldPos: Vec3;
    num: number;
}

export class BattleOtherInfo {
    @smartdata
    stepTipList: ICenterStepNumTipData[] = [];
    @smartdata
    harmTipList: IBattleHarmShowItemData[] = [];
    @smartdata
    monsterTipList: CfgMonsterData[] = [];
    @smartdata
    rountInfoTip: IBattleRountInfoItemData;
    @smartdata
    monsterAttackTip: boolean;
    @smartdata
    skillAddStep: number;
    @smartdata
    newPlayerTip: boolean;

    Reset() {
        this.stepTipList = [];
        this.harmTipList = [];
        this.monsterTipList = [];
        this.monsterAttackTip = false;
        this.skillAddStep = 0;
        this.newPlayerTip = false;
    }
}

export class BattleData extends DataBase {

    //private skillGroup:Array<CfgSkillGroup>[];
    private skillGroup: CfgSkillGroup[][];

    battleInfo: BattleInfo;        //战斗数据
    robotBattleInfo: BattleInfo;    //竞技场机器人的战斗数据
    finishInfo: PB_SCBattleReport;
    otherInfo: BattleOtherInfo;

    randomSkillRecord: IRandomSkillRecord;
    isUseSave: boolean = false;

    private _isGuide: boolean = false;

    //每日增益
    toDayBuff: PB_SCTodayGainInfo;

    // 上阵的英雄 0是金币
    get in_battle_heros(): number[] {
        return this.battleInfo.in_battle_heros;
    }
    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.battleInfo = CreateSMD(BattleInfo);
        this.robotBattleInfo = CreateSMD(BattleInfo);
        this.otherInfo = CreateSMD(BattleOtherInfo);
        this.battleInfo.tag = BattleObjTag.Player;
        this.robotBattleInfo.tag = BattleObjTag.Robot;
    }

    GetBattleInfo(tag:BattleObjTag = BattleObjTag.Player){
        if(tag == BattleObjTag.Robot){
            return this.robotBattleInfo;
        }else{
            return this.battleInfo;
        }
    }

    //是否指引
    IsGuide(): boolean {
        return this._isGuide;
    }
    SetGuide(v: boolean) {
        this._isGuide = v;
    }

    //最大能设置几倍速
    MaxSpeedScale(): number {
        if (SevenDayHeroData.Inst().IsBuy) {
            return 3;
        }
        if (this.battleInfo.isFreeSpeed3 == true) {
            return 3;
        }
        return 2;
    }

    //上阵了几个英雄
    FightHeroCount(): number {
        let count = 0;
        let heros = HeroData.Inst().GetInBattleHeros();
        heros.forEach(id => {
            if (id > 0) {
                count++;
            }
        })
        return count;
    }

    SetFinishInfo(info: PB_SCBattleReport) {
        this.finishInfo = info;
    }
    GetFinishInfo() {
        if(this.finishInfo == null){
            let obj = new PB_SCBattleReport();
            obj.battleResult = 0;
            obj.battleMode = this.battleInfo.sceneType;
            obj.battleRound = 0;
            obj.rewardList = [];
            obj.battleParam = [1];
            return obj;
        }
        return this.finishInfo;
    }

    //主线是否新记录
    IsNewRecord(scene_type: SceneType, scene_id: number, round: number): boolean {
        if (scene_type != SceneType.Main) {
            return false;
        }
        if (scene_id < RoleData.Inst().InfoMainSceneLevel) {
            return false;
        }
        return round > RoleData.Inst().InfoMainSceneRound;
    }

    ResetBattleInfo(tag: BattleObjTag = BattleObjTag.Player) {
        if(tag == BattleObjTag.Robot){
            this.robotBattleInfo.Reset();
        }else{
            this.battleInfo.Reset();
            this.otherInfo.Reset();
        }
    }

    //记录伤害
    AddRecordAttackValue(hero_id: number, value: number, tag:BattleObjTag = BattleObjTag.Player) {
        //console.log("记录伤害", hero_id, value);
        let info = this.GetBattleInfo(tag);
        if (!info.attackValueRecord.has(hero_id)) {
            info.attackValueRecord.set(hero_id, value);
            return
        }
        let curValue = info.attackValueRecord.get(hero_id);
        curValue += value;
        info.attackValueRecord.set(hero_id, curValue);
        SMDTriggerNotify(info, "attackValueRecord");
    }
    GetRecordAttackValue(hero_id: number, tag:BattleObjTag = BattleObjTag.Player): number {
        let info = this.GetBattleInfo(tag);
        if (info.attackValueRecord == null || !info.attackValueRecord.has(hero_id)) {
            return 0
        }
        return info.attackValueRecord.get(hero_id);
    }
    GetRecordAttackValueSum(tag:BattleObjTag = BattleObjTag.Player): number {
        let info = this.GetBattleInfo(tag);
        if (info.attackValueRecord == null) {
            return 0;
        }
        let value = 0;
        info.attackValueRecord.forEach((v) => {
            value += v;
        })
        return value;
    }

    //步数提示
    CenterStepTip(worldPos: Vec3, num: number) {
        let data = <ICenterStepNumTipData>{ worldPos: worldPos, num: num };
        this.otherInfo.stepTipList.push(data);
        SMDTriggerNotify(this.otherInfo, "stepTipList");
    }
    ClearCenterStepTip() {
        this.otherInfo.stepTipList = [];
    }

    //伤害飘字
    CenterHarmTip(worldPos: Vec3, num: number, harmType: MonsterHarmType, iconType: BattleHarmShowIconType, data_monster: CfgMonsterData) {
        if (data_monster && BATTLE_HP_NO_SHOW[data_monster.res_id]) {
            return
        }
        if (num < 0) {
            LogError("伤害异常，小于0", num);
            num = 0;
        }
        let data = <IBattleHarmShowItemData>{ worldPos: worldPos, num: num, harmType: harmType, iconType: iconType };
        this.otherInfo.harmTipList.push(data);
        SMDTriggerNotify(this.otherInfo, "harmTipList");
    }
    ClearHarmTip() {
        this.otherInfo.harmTipList = [];
    }

    //怪物出现提示
    AddMonsterTip(data: CfgMonsterData) {
        this.otherInfo.monsterTipList.push(data);
        SMDTriggerNotify(this.otherInfo, "monsterTipList");
    }
    RemoveMonsterTip(data: CfgMonsterData) {
        UtilHelper.ArrayRemove(this.otherInfo.monsterTipList, data);
        SMDTriggerNotify(this.otherInfo, "monsterTipList");
    }


    AddRountTip(data: IBattleRountInfoItemData) {
        this.otherInfo.rountInfoTip = data;
    }

    //获取界面展示的回合信息
    GetViewRountInfo(targetRound?: number): IBattleRountInfoItemData {
        if (targetRound == null) {
            targetRound = this.battleInfo.roundProgerss;
        }
        let count = 5;
        let targetIndex = 1;
        let round_list: number[] = [];
        let max_round = targetRound + count - 2;
        if (max_round > this.battleInfo.roundProgerssMax) {
            targetIndex += max_round - this.battleInfo.roundProgerssMax;
            max_round = this.battleInfo.roundProgerssMax;
        }
        for (let i = count - 1; i >= 0; i--) {
            round_list.push(max_round - i);
        }
        let result = <IBattleRountInfoItemData>{
            maxRound: max_round,
            RoundList: round_list,
            targetIndex: targetIndex,
        }
        return result;
    }


    //怪物产生抗性的属性
    GetMonsterDefType(monsterData: CfgMonsterData): Map<HeroAttriType, number> {
        let map = new Map<HeroAttriType, number>();
        if (monsterData.physics_def != 0) {
            map.set(HeroAttriType.WuLi, monsterData.physics_def);
        }
        if (monsterData.water_def != 0) {
            map.set(HeroAttriType.Shui, monsterData.water_def);
        }
        if (monsterData.dark_def != 0) {
            map.set(HeroAttriType.An, monsterData.dark_def);
        }
        if (monsterData.poison_def != 0) {
            map.set(HeroAttriType.Du, monsterData.poison_def);
        }
        if (monsterData.fire_def != 0) {
            map.set(HeroAttriType.Huo, monsterData.fire_def);
        }
        if (monsterData.soil_def != 0) {
            map.set(HeroAttriType.Tu, monsterData.soil_def);
        }
        return map;
    }



    //获取英雄等级
    GetHeroLevel(id: number, tag:BattleObjTag = BattleObjTag.Player): number {
        let info = this.GetBattleInfo(tag);
        return info.GetHeroLevel(id);
    }

    //获取英雄战斗配置
    GetHeroBattleCfg(id: number, stage: number): CfgHeroBattle {
        if (id == 0) {
            return CfgCoinData[stage];
        }
        for (var cfg of CfgHero.battle_info) {
            if (cfg.hero_id == id && cfg.stage == stage) {
                return cfg;
            }
        }
        return null;
    }

    //获取守护后院的角色形象阶级
    GetHeroBattleStage(info: IPB_HeroNode): number {
        let levelCfg = CfgBackyard.level;
        let heroBaseCfg = HeroData.Inst().GetHeroBaseCfg(info.heroId);
        for (let v of levelCfg) {
            if (heroBaseCfg.hero_color == v.color && info.heroLevel == v.level) {
                return v.stage;
            }
        }
        return 1;
    }

    //词条概率配置
    GetSkillRateCfg(sceneType?: SceneType): CfgSkillOther {
        if (sceneType == null) {
            sceneType = this.battleInfo.sceneType;
        }
        for (let i = 0; i < CfgEntry.other.length; i++) {
            if (CfgEntry.other[i].barrier_type == sceneType) {
                return CfgEntry.other[i];
            }
        }
        return CfgEntry.other[0];
    }


    //获取当前上阵英雄能出现的所有词条
    GetSkillDataInHero(): CfgSkillData[] {
        let list: CfgSkillData[] = [];
        this.in_battle_heros.forEach((hero_id) => {
            if (hero_id > 0) {
                let level = this.GetHeroLevel(hero_id);
                let cfg = HeroData.Inst().GetHeroLevelCfg(hero_id, level);
                let skill_ids = cfg.skill.toString().split("|");
                skill_ids.forEach((skill_id) => {
                    let id = Number(skill_id);
                    if (id > 0) {
                        let skill_cfg = this.GetSkillCfg(id);
                        list.push(skill_cfg);
                    }
                })

                let baseCfg = HeroData.Inst().GetHeroBaseCfg(hero_id);
                let hide_skills = baseCfg.hiden_skill.toString().split("|");
                hide_skills.forEach((skill_id) => {
                    let id = Number(skill_id);
                    if (id > 0) {
                        let skill_cfg = this.GetSkillCfg(id);
                        list.push(skill_cfg);
                    }
                })

                // 基因系统的词条
                let dna_skill_list = HeroData.Inst().GetGeneSuitSkill(hero_id);
                if (dna_skill_list && dna_skill_list.length > 0) {
                    dna_skill_list.forEach((_skill_id) => {
                        if (_skill_id > 0) {
                            let skill_cfg = this.GetSkillCfg(_skill_id);
                            list.push(skill_cfg);
                        }
                    })
                }
            }
        })

        return list;
    }


    //根据英雄id和等级获取能出现的词条
    GetSkillDataByHeroInfos(heroList:IPB_HeroNode[], isArena:boolean = false): CfgSkillData[] {
        let list: CfgSkillData[] = [];
        heroList.forEach((info) => {
            if (info.heroId > 0) {
                let level = info.heroLevel;

                if(level == 0 && isArena){
                    level = ArenaData.Inst().GetFreeHeroLevel(info.heroId);
                }

                let hero_id = info.heroId;
                let cfg = HeroData.Inst().GetHeroLevelCfg(hero_id, level);
                let skill_ids = cfg.skill.toString().split("|");
                skill_ids.forEach((skill_id) => {
                    let id = Number(skill_id);
                    if (id > 0) {
                        let skill_cfg = this.GetSkillCfg(id);
                        list.push(skill_cfg);
                    }
                })

                let baseCfg = HeroData.Inst().GetHeroBaseCfg(hero_id);
                let hide_skills = baseCfg.hiden_skill.toString().split("|");
                hide_skills.forEach((skill_id) => {
                    let id = Number(skill_id);
                    if (id > 0) {
                        let skill_cfg = this.GetSkillCfg(id);
                        list.push(skill_cfg);
                    }
                })

                // 基因系统的词条
                let dna_skill_list = HeroData.Inst().GetGeneSuitSkill(hero_id);
                if (dna_skill_list && dna_skill_list.length > 0) {
                    dna_skill_list.forEach((_skill_id) => {
                        if (_skill_id > 0) {
                            let skill_cfg = this.GetSkillCfg(_skill_id);
                            list.push(skill_cfg);
                        }
                    })
                }
            }
        })

        return list;
    }


    //随机3个词条
    RandomSkillList(quas: number[], group_id: number, isGetHero: boolean): CfgSkillData[] {
        //console.log("随机词条组id == ", group_id, quas)
        let guidedata = this.battleInfo.GetGuideSkillData();
        if (guidedata) {
            return guidedata;
        }
        this.randomSkillRecord = { quas: quas, group_id: group_id, is_get_hero: isGetHero };
        let skillDataPool: ISceneSkillDataRateCfg[] = this.GetGlobalSkillRateList(group_id);
        let heroSkillDataPool: ISceneSkillDataRateCfg[] = isGetHero ? this.GetHeroSkillRateList() : null;

        // console.log("英雄词条池子", CfgEntry.other[0].rate, heroSkillDataPool);
        // console.log("全局词条池子", CfgEntry.other[0].rate, skillDataPool);
        let list: CfgSkillData[] = [];
        let rateCfg = this.GetSkillRateCfg();
        for (let i = 0; i < quas.length; i++) {
            let qua = quas[i];
            //进行判断用英雄还是公用词条
            let pool: ISceneSkillDataRateCfg[];
            if (heroSkillDataPool == null || heroSkillDataPool.length == 0 || !this.IsHasSkillByQua(heroSkillDataPool, qua) || MathHelper.RandomResult(rateCfg.rate)) {
                pool = skillDataPool;
                //判断是否排除特殊词条
                if (!this.IsCanAddSpSkill(SP_SKILL_ID_A, list)) {
                    for (let i = 0; i < pool.length; i++) {
                        if (pool[i] && pool[i].skill_id == SP_SKILL_ID_A) {
                            pool[i] = null;
                        }
                    }
                }
                if (!this.IsCanAddSpSkill(SP_SKILL_ID_B, list)) {
                    for (let i = 0; i < pool.length; i++) {
                        if (pool[i] && pool[i].skill_id == SP_SKILL_ID_B) {
                            pool[i] = null;
                        }
                    }
                }
            } else {
                pool = heroSkillDataPool;
            }
            let skill = this.GetRandomSkill(pool, qua);
            if (skill == null) {
                LogError("skill", pool, qua);
                skill = this.GetSkillCfg(pool[0].skill_id);
                if (DEBUG) {
                    window.confirm("词条池子拿不到对应条件的词条，检查配置");
                }
            }
            if (list.indexOf(skill) == -1) {
                //console.log("随机到词条", skill);
                list.push(skill);
            } else {
                i--;
            }
        }


        // list.sort((a, b) => {
        //     return b.color - a.color;
        // })
        return list;
    }

    private GetGlobalSkillRateList(group_id: number): ISceneSkillDataRateCfg[] {
        let skillDataPool = this.GetSkillGroupCfg(group_id);
        let list: ISceneSkillDataRateCfg[] = [];
        skillDataPool.forEach(data => {
            let skill = this.GetSkillCfg(data.skill_id);
            if (this.IsCanAddSkill(skill)) {
                list.push(data);
            }
        })

        //list.push({rate: 5000, skill_id:530});

        return list;
    }


    private GetHeroSkillRateList(): ISceneSkillDataRateCfg[] {
        let heroSkillDataPool: ISceneSkillDataRateCfg[] = [];
        let hreoSkills = this.GetSkillDataInHero();
        let quaCounts: number[] = [0, 0, 0];
        hreoSkills.forEach((v) => {
            if (this.IsCanAddSkill(v)) {
                if (!this.IsHasSkillByData(v) || this.battleInfo.skillListMap.get(v) < v.superposition) {
                    quaCounts[v.color - 1]++;
                    let data = <ISceneSkillDataRateCfg>{ skill_id: v.skill_id, rate: 0 };
                    heroSkillDataPool.push(data);
                }
            }
        })
        let otherCfg = this.GetSkillRateCfg();
        let randomCfg: number[] = [otherCfg.hero_color1_rate, otherCfg.hero_color2_rate, otherCfg.hero_color3_rate];
        heroSkillDataPool.forEach(v => {
            let cfg = this.GetSkillCfg(v.skill_id);
            v.rate = randomCfg[cfg.color - 1] / quaCounts[cfg.color - 1];
        })

        return heroSkillDataPool;
    }
    private IsHasSkillByQua(skills: ISceneSkillDataRateCfg[], qua: number): boolean {
        if (skills.length == 0) {
            return false;
        }
        if (qua == 0) {
            return true;
        }
        for (var skill of skills) {
            let cfg = this.GetSkillCfg(skill.skill_id);
            if (cfg.color == qua) {
                return true;
            }
        }
        return false;
    }

    //是否能添加这个词条
    private IsCanAddSkill(skill: CfgSkillData): boolean {
        if (this.IsHasSkillByData(skill)) {
            if (this.battleInfo.skillListMap.get(skill) >= skill.superposition) {
                return false;
            }
        }
        if (skill.appear != 0 && skill.appear != "") {
            let limitList = skill.appear.toString().split("|");
            for (let i = 0; i < limitList.length; i++) {
                if (!this.IsHasSkill(Number(limitList[i]))) {
                    return false
                }
            }
        }

        if (skill.entry_source == BattleSkillSource.Institute) {
            if (!this.battleInfo.institute_skills.has(skill.skill_id)) {
                return false;
            }
        }


        let checkFunc = SkillIsCanAddCheckFunc[skill.skill_type];
        if (checkFunc) {
            if (checkFunc(skill) == false) {
                return false;
            }
        }
        return true;
    }

    //是否能添加特殊词条
    IsCanAddSpSkill(sp_skill_id: number, list: CfgSkillData[]): boolean {
        let heroids = BattleData.Inst().in_battle_heros;
        for (let i = 0; i < heroids.length; i++) {
            let id = heroids[i];
            if (sp_skill_id == SP_SKILL_ID_A) {
                let in_battle_heros = this.battleInfo.in_battle_heros;
                let scene = BattleCtrl.Inst().battleScene;
                let count = 0;
                if (scene && in_battle_heros && in_battle_heros.length > 0) {
                    for (let hero_id of in_battle_heros) {
                        if (hero_id > 0) {
                            count += scene.GetHeroCount(hero_id, 0);
                        }
                    }
                }
                if (count <= 0) {
                    return false
                }

                let data = this.battleInfo.CfgSkill26Map.get(id)
                if (data == null) {
                    return true
                } else {
                    if (!this.IsHasSpSkill(SP_SKILL_ID_B, id) && list.indexOf(data) == -1) {
                        return true
                    }
                }
            } else if (sp_skill_id == SP_SKILL_ID_B) {
                let data = this.battleInfo.CfgSkill27Map.get(id)
                if (data == null) {
                    return true
                } else {
                    if (!this.IsHasSpSkill(SP_SKILL_ID_B, id) && list.indexOf(data) == -1) {
                        return true
                    }
                }
            }
        }
        return false
    }

    //是否有指的特殊词条
    IsHasSpSkill(skill_id: number, hero_id: number): boolean {
        if (skill_id == SP_SKILL_ID_A) {
            let data = this.battleInfo.CfgSkill26Map.get(hero_id);
            if (data) {
                return this.IsHasSkillByData(data);
            } else {
                return false;
            }
        } else if (skill_id == SP_SKILL_ID_B) {
            let data = this.battleInfo.CfgSkill27Map.get(hero_id);
            if (data) {
                return this.IsHasSkillByData(data);
            } else {
                return false;
            }
        }
        return false
    }


    private GetRandomSkill(pool: ISceneSkillDataRateCfg[], qua: number, randomValue?: number): CfgSkillData {
        let skillPool: ISceneSkillDataRateCfg[] = []
        let sumRate = 0;
        pool.forEach((v) => {
            if (v) {
                let cfg = BattleData.Inst().GetSkillCfg(v.skill_id);
                if (qua == 0 || cfg.color == qua) {
                    skillPool.push(v);
                    sumRate += v.rate;
                }
            }
        })
        if (randomValue == null) {
            randomValue = MathHelper.GetRandomNum(0, sumRate);
        }
        if (skillPool == null || skillPool.length == 0) {
            LogError("随机词条异常，请检查", pool);
            return
        }
        let n = 0
        for (let rateData of skillPool) {
            n += rateData.rate;
            if (n >= randomValue) {
                let cfg = BattleData.Inst().GetSkillCfg(rateData.skill_id);
                let spFunc = SpecialSkillConvert[cfg.skill_type];
                if (spFunc) {
                    let spCfg = spFunc(cfg);
                    if (cfg.skill_id == SP_SKILL_ID_C || cfg.skill_id == SP_SKILL_ID_D) {
                        UtilHelper.ArrayRemove(pool, rateData);
                    }
                    return spCfg;
                } else {
                    UtilHelper.ArrayRemove(pool, rateData);
                    return cfg
                }
            }
        }
        LogError("获取词条异常", n, randomValue, skillPool);
        let skill = skillPool.pop();

        return this.GetSkillCfg(skill.skill_id);
    }


    //词条配置
    GetSkillCfg(skill_id: number): CfgSkillData {
        let cfg = CfgEntry.public_entry[skill_id - 1];
        return cfg;
    }

    //传入的技能id如果存在，则执行func并为func传入skillCfg
    HandleSkill(skillId: number, func: (cfg: CfgSkillData) => void, tag:BattleObjTag = BattleObjTag.Player) {
        if (!this.IsHasSkill(skillId, tag)) {
            return false;
        }
        func(this.GetSkillCfg(skillId));
        return true;
    }

    //传入的技能id如果存在，则执行func并为func传入skillCfg和skillCount
    HandleCountSkill(skillId: number, func: (cfg: CfgSkillData, count: number) => void, tag:BattleObjTag = BattleObjTag.Player) {
        if (!this.IsHasSkill(skillId, tag)) {
            return false;
        }
        let cfg = this.GetSkillCfg(skillId);
        let count = this.GetSkillCount(cfg, tag);
        func(cfg, count);
        return true;
    }

    //获取词条组
    GetSkillGroupCfg(group_id: number): CfgSkillGroup[] {
        if (this.skillGroup == null) {
            let cfg = CfgEntry.entry_group;
            this.skillGroup = DataHelper.TabGroup(cfg, "entry_group_type");
        }
        return this.skillGroup[group_id];
    }

    //获取额外的技能图标信息
    GetSkillOtherIconCfg(heroId: number, skill_id: number): CfgSkillIconOther {
        if (heroId == 0) {
            LogError("获取额外的技能图标信息 异常 heroid == 0，调试模式下出现此报错正常")
        }
        for (let i = 0; i < CfgEntry.other_entry.length; i++) {
            let v = CfgEntry.other_entry[i];
            if (v.hero_id == heroId && v.skill_id == skill_id) {
                return v;
            }
        }
        return null;
    }

    //设置选择词条
    SetSelectSkillList(list: CfgSkillData[]) {
        this.battleInfo.skillSelectList = list;
    }
    GetSelectSkillList(): CfgSkillData[] {
        return this.battleInfo.skillSelectList;
    }

    //添加词条
    AddSkill(skill: CfgSkillData, tag:BattleObjTag = BattleObjTag.Player) {
        let scene = BattleCtrl.Inst().GetBattleScene(tag);
        let func = BattleSkillHandle[skill.skill_type]
        let is_add: boolean | CfgSkillData;
        let info = this.GetBattleInfo(tag);
        if (func) {
            LogError("触发词条", skill.skill_id, skill.word);
            is_add = func(skill, scene, info);
        } else {
            LogError("词条Func为空", skill.skill_type, skill);
            is_add = true;
        }
        let saveSkill: CfgSkillData;
        if (is_add instanceof CfgSkillData) {
            saveSkill = is_add;
        } else if (is_add == true) {
            saveSkill = skill;
        }
        if (saveSkill) {
            if (info.skillListMap.has(saveSkill)) {
                let num = info.skillListMap.get(saveSkill)
                info.skillListMap.set(saveSkill, num + 1);
            } else {
                info.skillListMap.set(saveSkill, 1);
            }
            SMDTriggerNotify(info, "skillListMap");
        }
        if (skill.hero_id > 0) {
            scene.SanSuoHero(skill.hero_id);
        }
    }
    //移除词条
    RemoveSkill(skill: CfgSkillData) {
        if (this.battleInfo.skillListMap.has(skill)) {
            this.battleInfo.skillListMap.delete(skill);
        }
    }
    //是否有这个词条
    IsHasSkill(skill_id: number, tag:BattleObjTag = BattleObjTag.Player): boolean {
        let skill = this.GetSkillCfg(skill_id);
        return this.IsHasSkillByData(skill, tag);
    }
    IsHasSkillByType(skill_type: number, tag:BattleObjTag = BattleObjTag.Player): boolean {
        let info = this.GetBattleInfo(tag);
        for (var v of info.skillListMap.keys()) {
            if (v.skill_type == skill_type) {
                return true
            }
        }
        return false;
    }
    IsHasSkillByData(skill_data: CfgSkillData, tag:BattleObjTag = BattleObjTag.Player): boolean {
        let info = this.GetBattleInfo(tag);
        return info.skillListMap.has(skill_data);
    }

    GetHasSkillByTypeAndHeroId(skillType:number, heroId:number, tag:BattleObjTag = BattleObjTag.Player){
        let info = this.GetBattleInfo(tag);
        for(var v of info.skillListMap.keys()){
            if(v.skill_type == skillType && v.hero_id == heroId){
                return v;
            }
        }
    }

    GetShowSkillListData(isSafe:boolean = false): HeroSkillCell[] {
        let list: HeroSkillCell[] = [];
        this.battleInfo.skillListMap.forEach((num, skilldata) => {
            if(skilldata){
                let show_type = num > 1 ? HeroSkillShowType.Count : HeroSkillShowType.Value;
                if(isSafe){
                    if(BattleData.Inst().GetSkillCfg(skilldata.skill_id) != null){
                        let skillCell = new HeroSkillCell({ skill_id: skilldata.skill_id, count: num, showType: show_type, cfg: skilldata })
                        list.push(skillCell);
                    }
                }else{
                    let skillCell = new HeroSkillCell({ skill_id: skilldata.skill_id, count: num, showType: show_type, cfg: skilldata })
                    list.push(skillCell);
                }
            }

        })
        return list;
    }


    GetSkillCount(skill: CfgSkillData, tag:BattleObjTag = BattleObjTag.Player): number {
        let info = this.GetBattleInfo(tag);
        if (!info.skillListMap.has(skill)) {
            return 0;
        }
        return info.skillListMap.get(skill);
    }


    //获取神殿词条配置
    GetShenDianSkillCfg(skillId: number): CfgShenDianSkill {
        return CfgLostTemple.remains_entry[skillId - 1]
    }

    //获取怪物配置  >> 废弃
    // GetMonsterCfg(id:number):CfgMonsterData{
    //     return CfgMonster.monster_page[id - 1];
    // }
    //获取当前场景的怪物配置
    GetSceneMonsterCfg(id: number): CfgMonsterData {
        let cfg = this.battleInfo.cfg.monster_page[id - 1];
        if (cfg == null) {
            LogError("怪物配置不存在id == ", id, "场景", this.battleInfo.sceneId);
        }
        return cfg;
    }

    GetSceneMonsterSkillCfg(id: number): CfgMonsterSkillData {
        return this.battleInfo.cfg.monster_skill[id - 1];
    }
    GetAllMonsterResList(): Set<number> {
        let list: Set<number> = new Set<number>();
        this.battleInfo.cfg.monster_page.forEach((cfg) => {
            if (!list.has(cfg.res_id)) {
                list.add(cfg.res_id);
            }
        })
        return list;
    }

    //获取背景配置
    GetSceneBGCfg(id: number): CfgSceneMainBG {
        return CfgSceneBG.changjing[id - 1];
    }

    //获取竞技场背景配置
    GetSceneArenaBGCfg(id: number): CfgSceneArenaBG {
        return CfgSceneBG.changjing_arena[id - 1];
    }


    guideStepIndex: number = 0;
    //获取当前指引配置
    GetGuideStepCfg(index?: number): CfgGuideStap {
        index = index ?? this.guideStepIndex;
        return CfgBattleGuide.step[index];
    }

    GetRoundQueueData(cfg: CfgSceneRound[]): IQueuePlayFuncItem[] {
        let list: IQueuePlayFuncItem[] = [];
        if (cfg) {
            cfg.forEach(data => {
                if (data.monster_num > 0) {
                    list.push(data);
                }
            })
        }
        return list;
    }

    //获取当前关卡版本号
    GetVersion(sceneType: SceneType, id: number): number {
        let cfg;
        switch (sceneType) {
            case SceneType.Main: cfg = MainFBData.Inst().CfgBarrierInfoMainInfo(id); if (cfg) return cfg.version; break;
            case SceneType.Coin: cfg = CfgBarrierInfoData.Gold_info.find(_cfg => _cfg.barrier_id == id); if (cfg) return cfg.version; break;
            case SceneType.Fragment: cfg = CfgBarrierInfoData.Debries_info.find(_cfg => _cfg.barrier_id == id); if (cfg) return cfg.version; break;
            case SceneType.DayChallenge: cfg = CfgBarrierInfoData.Challenge_info.find(_cfg => _cfg.barrier_id == id); if (cfg) return cfg.version; break;
        }
        return 1;
    }

    GetHarmInfoList(outList?: IBattleAttackInfoItemData[]): IBattleAttackInfoItemData[] {
        let sumScore = this.GetRecordAttackValueSum();
        let list: IBattleAttackInfoItemData[] = outList ?? [];
        if (BattleData.Inst().in_battle_heros == null || BattleData.Inst().in_battle_heros.length == 0) {
            LogError("战斗结算界面异常 in_battle_heros == null")
            return [];
        }
        let i = 0;
        BattleData.Inst().in_battle_heros.forEach((id) => {
            if (id != 0) {
                let value = BattleData.Inst().GetRecordAttackValue(id);
                if (i < list.length) {
                    list[i].heroId = id;
                    list[i].value = value;
                    list[i].sumValue = sumScore;
                } else {
                    list.push(<IBattleAttackInfoItemData>{
                        heroId: id,
                        value: value,
                        sumValue: sumScore,
                    })
                }
                i++;
            }
        })
        return list;
    }

    GetSceneAtt(scene_id:number, stage_id:number, scene_type:SceneType = SceneType.Main):CfgBarrierAttInfo{
        if(scene_type != SceneType.Main){
            return;
        }
        let cfg = CfgBarrierAtt.barrier_att.find(v=>{
            return v.barrier_id == scene_id && v.stage_id == stage_id;
        })
        return cfg;
    }
}



///////////////////// battleInfo ///////////////////


//英雄的属性加成
export class BattleHeroAttriBuff {
    //出生的时候多少级
    initLevel: number = 0;

    //攻击力加成
    harmValue: number = 0;
    //伤害加成
    harmScale: number = 0;
    //攻速加成
    attackSpeed: number = 0;
    //减速效果加成
    slowDown: number = 0;
    //灼烧时间多加几秒
    zuoshaotime: number = 0;
    //眩晕时间加成
    xuanyuanTime: number = 0;
    //魅惑时间
    meihuoTime: number = 0;
    //弹射数量
    tansheshuliang: number = 0;
    //减速时间增加
    jiansutime: number = 0;
    //重击率 百分比
    zhongji: number = 0;
    //暴击率
    baoji: number = 0;
    //暴击伤害加成
    baojiScale: number = 0;


    //腐败伤害比
    fubaiScale: number = 1;
    //流血伤害比
    lixueScale: number = 1;
    //灼烧伤害比
    zuoshaoScale: number = 1;
    //中毒伤害比
    zhongduScale: number = 1;
    //攻击范围比例
    attackRangeScale: number = 1;
    //易伤伤害
    yishangHarmScale: number = 1;

    /////////  分割线：以下不是通用的 ////////

    //点燃范围
    dianranRange: number = 1;
    //点燃伤害比
    dianranHarmScale: number = 1;
    //溅射范围
    jianseRange: number = 1;
    //溅射伤害比
    jianseHarmScale: number = 1;
    //射程比例
    shootScale: number = 1;
    //充电时间加成
    chongDian: number = 0;


    //冰冻概率增加
    bingdonggailv: number = 0;
    //流血层数
    LiuXueCount: number = 1;
    //额外守护蝙蝠数量
    BatCount: number = 0;
    //可击退数量
    JiTuiCount: number = 0;
    //加海浪概率
    HaiLangGaiLv: number = 0;
    //这类英雄全场击杀了多少个英雄
    JiShaCount: number = 0;
    //易伤层数
    yishangcengshu: number = 0;
    //易伤层数上限
    yishangcengshumax: number = 0;


    //其他数值
    otherValue: number = 0;
}


export interface IHeroAttriBuff {
    harmValue: number;           //攻击力
    harmScale: number;           //攻速
    attackSpeedScale: number;   //属性伤害
    baoji: number;              //暴击率
    baojiScale: number;         //暴击增伤
}

//每回合增益 暂未用到
export class ToRoundAttriBuff implements IHeroAttriBuff {
    harmValue: number = 0;
    harmScale: number = 0;
    attackSpeedScale: number = 0;
    baoji: number = 0;
    baojiScale: number = 0;
}

//基因系统增益
export class JiYinAttriBuff implements IHeroAttriBuff {
    harmValue: number = 0;
    harmScale: number = 0;
    attackSpeedScale: number = 0;
    baoji: number = 0;
    baojiScale: number = 0;
}

//技能属性
export class BattleSkillAttriData {
    battleInfo: BattleInfo;

    //击杀经验百分比
    private _monsterExpPercent: number = 1;
    //伤害百分比加成
    private _harmPercent: number = 0;
    //攻速百分比
    private _attackSpeedPercent: number = 0;
    //怪物移动速度百分比
    private _monsterMoveParcent: number = 1;
    //暴击
    private _baoji: number = 0;
    //暴击伤害比例
    private _baojisScale: number = 0;
    //攻击力加成
    private _attackValue: number = 0;

    //晋级后携带英雄数量
    public stageHeroCount: number = 6;
    //小怪生命加成
    public xiaoguaiHpPercent: number = 0;
    //boss生命加成
    public bossHpPercent: number = 0;
    //精英怪生命加成
    public jingyingHpPercent: number = 0;
    //怪物生命加成
    public monsterHpPrecent: number = 0;
    //英雄重击率 0 - 100
    public zhongji: number = 0;
    //对Boss伤害加成
    public bossHarmAdd: number = 0;
    //五消额外加步数
    public wuXiaoJiaBuShu: number = 0;
    //金币概率加成
    public coidRate: number = 0;
    //每日多加x步
    public isMeiRiAddStep: number = 0;
    //每阶段加x步
    public isMieJieAddStep: number = 0;

    //是否5消时中间多生一级
    isWuXiaoBuff: boolean = false;
    //是否支持斜角
    public isCanXieJiao: boolean = false;
    //是否五消额外获得金币
    public isWuXiaoHuoDeJinBi: boolean = false;
    //是否每日首次合成时，产生英雄数量+1
    public isMeiRiHeChengAdd: boolean = false;
    //是否城堡血量低于50%时伤害增加40%
    public isChengBao1: boolean = false;
    //城堡每增加100血量上限增加10%伤害
    public isChengBao2: boolean = false;
    //是否城堡当日未收到伤害时，恢复<color=#DF7401>{0}</color>血量
    public isChengBao3: boolean = false;

    //英雄属性加成
    public heroAttriMap: Map<number, BattleHeroAttriBuff> = new Map();

    //怪物Buff伤害比
    public monsterBuffHarmScaleMap: Map<MonsterObjBuffType, number> = new Map();


    get monsterExpPercent(): number {
        return this._monsterExpPercent;
    }
    set monsterExpPercent(v: number) {
        this._monsterExpPercent = v;
    }

    get harmPercent(): number {
        let v = this._harmPercent;
        return v;
    }
    set harmPercent(v: number) {
        this._harmPercent = v;
    }

    get attackSpeedPercent(): number {
        // if (this._attackSpeedPercent < MIN_ATTACK_SPEED) {
        //     return MIN_ATTACK_SPEED
        // }
        return this._attackSpeedPercent;
    }
    set attackSpeedPercent(v: number) {
        this._attackSpeedPercent = v;
    }

    get monsterMoveParcent(): number {
        return this._monsterMoveParcent;
    }
    set monsterMoveParcent(v: number) {
        this._monsterMoveParcent = v;
    }

    get baoji(): number {
        return this._baoji;
    }
    set baoji(v: number) {
        this._baoji = v;
    }

    get baojiScale(): number {
        return this._baojisScale
    }
    set baojiScale(v: number) {
        this._baojisScale = v;
    }

    get attackValue(): number {
        let v = this._attackValue ?? 0;
        return v;
    }
    set attackValue(v: number) {
        this._attackValue = v;
    }

    GetHarmPercent(): number {
        let v = this.harmPercent;
        if (this.isChengBao1 && (this.battleInfo.hp / this.battleInfo.maxHp) < 0.5) {
            v += 0.4;
        }
        if (this.isChengBao2) {
            v += Math.floor((this.battleInfo.maxHp - DEFAULT_HP) / 100) * 0.1;
        }
        return v;
    }

    GetHeroAttriBuff(id: number): BattleHeroAttriBuff {
        if (this.heroAttriMap.has(id)) {
            return this.heroAttriMap.get(id);
        }
        let attri = new BattleHeroAttriBuff();
        this.heroAttriMap.set(id, attri);
        return attri;
    }
    SetHeroAttriBuff(id: number, attri: BattleHeroAttriBuff) {
        this.heroAttriMap.set(id, attri);
    }

    GetMonsterBuffHarmScale(buffType: MonsterObjBuffType): number {
        if (!this.monsterBuffHarmScaleMap.has(buffType)) {
            this.monsterBuffHarmScaleMap.set(buffType, 0);
        }
        return this.monsterBuffHarmScaleMap.get(buffType);
    }
    AddMonsterBuffHarmScale(buffType: MonsterObjBuffType, value: number) {
        let vlaue = this.GetMonsterBuffHarmScale(buffType) + value;
        this.monsterBuffHarmScaleMap.set(buffType, vlaue);
    }

    static ConvertSaveData(obj: BattleSkillAttriData): BattleSkillAttriSave {
        let data = <BattleSkillAttriSave>{};
        data.monsterExpPercent = obj.monsterExpPercent;
        data.harmPercent = obj.harmPercent;
        data.attackSpeedPercent = obj.attackSpeedPercent;
        data.monsterMoveParcent = obj.monsterMoveParcent;
        data.stageHeroCount = obj.stageHeroCount;

        data.xiaoguaiHpPercent = obj.xiaoguaiHpPercent;
        data.bossHpPercent = obj.bossHpPercent;
        data.jingyingHpPercent = obj.jingyingHpPercent;
        data.monsterHpPrecent = obj.monsterExpPercent;
        data.zhongji = obj.zhongji;
        data.baoji = obj.baoji;
        data.baojiScale = obj.baojiScale;
        data.attackValue = obj.attackValue;
        data.bossHarmAdd = obj.bossHarmAdd;
        data.wuXiaoJiaBuShu = obj.wuXiaoJiaBuShu;
        data.coidRate = obj.coidRate;

        data.isWuXiaoBuff = obj.isWuXiaoBuff;
        data.isCanXieJiao = obj.isCanXieJiao;
        data.isWuXiaoHuoDeJinBi = obj.isWuXiaoHuoDeJinBi;
        data.isMeiRiHeChengAdd = obj.isMeiRiHeChengAdd;
        data.isMeiRiAddStep = obj.isMeiRiAddStep;
        data.isMieJieAddStep = obj.isMieJieAddStep;
        data.isChengBao1 = obj.isChengBao1;
        data.isChengBao2 = obj.isChengBao2;
        data.isChengBao3 = obj.isChengBao3;
        data.heroAttriInfoList = [];
        data.monsterBuffHarmScaleList = [];
        obj.heroAttriMap.forEach((attri, heroid) => {
            let info = <IHeroSkillAttriSave>{}
            info.heroId = heroid;
            info.skillAttri = attri;
            data.heroAttriInfoList.push(info);
        })
        obj.monsterBuffHarmScaleMap.forEach((value, buffType) => {
            let info = <IMonsterBuffHarmSave>{}
            info.buffType = buffType;
            info.value = value;
            data.monsterBuffHarmScaleList.push(info);
        })
        return data;
    }
    static ConvertObj(data: BattleSkillAttriSave): BattleSkillAttriData {
        let obj = new BattleSkillAttriData();
        obj.monsterExpPercent = data.monsterExpPercent;
        obj.harmPercent = data.harmPercent;
        obj.attackSpeedPercent = data.attackSpeedPercent;
        obj.monsterMoveParcent = data.monsterMoveParcent;
        obj.stageHeroCount = data.stageHeroCount;

        obj.xiaoguaiHpPercent = data.xiaoguaiHpPercent;
        obj.bossHpPercent = data.bossHpPercent;
        obj.jingyingHpPercent = data.jingyingHpPercent;
        obj.monsterHpPrecent = data.monsterExpPercent;
        obj.zhongji = data.zhongji;
        obj.baoji = data.baoji;
        obj.baojiScale = data.baojiScale;
        obj.attackValue = data.attackValue;
        obj.bossHarmAdd = data.bossHarmAdd;
        obj.wuXiaoJiaBuShu = data.wuXiaoJiaBuShu;
        obj.coidRate = data.coidRate;

        obj.isWuXiaoBuff = data.isWuXiaoBuff;
        obj.isCanXieJiao = data.isCanXieJiao;
        obj.isWuXiaoHuoDeJinBi = data.isWuXiaoHuoDeJinBi;
        obj.isMeiRiHeChengAdd = data.isMeiRiHeChengAdd;
        obj.isMeiRiAddStep = data.isMeiRiAddStep;
        obj.isMieJieAddStep = data.isMieJieAddStep;
        obj.isChengBao1 = data.isChengBao1;
        obj.isChengBao2 = data.isChengBao2;
        obj.isChengBao3 = data.isChengBao3
        if (data.heroAttriInfoList) {
            data.heroAttriInfoList.forEach(info => {
                obj.SetHeroAttriBuff(info.heroId, info.skillAttri);
            })
        }
        return obj;
    }
}

export interface IBattleHeroInfo extends IPB_HeroNode {
    heroId: number;
    heroLevel: number;
}

export class BattleInfo {
    tag:BattleObjTag;
    isLoaded = false;

    private _cfg: CfgSceneData;
    private _lastSceneId: number;
    private _lastSceneType: number;
    get cfg(): CfgSceneData {
        if (this._cfg == null || this._lastSceneId != this.sceneId || this._lastSceneType != this.sceneType) {
            // 加载好配置才能进战斗，这里时同步
            this._lastSceneId = this.sceneId;
            this._lastSceneType = this.sceneType;
            let resPath = GetSceneCfgPath(this.sceneId, this.sceneType);
            CfgManager.Inst().GetCfg<CfgSceneData>(resPath, (cfg) => {
                this._cfg = cfg;
            })
            return this._cfg;
        } else {
            return this._cfg;
        }

    };
    //是否暂停
    isPause: boolean = false;
    //是否保留技能
    isSaveSkill: boolean = false;
    //场景类型
    sceneType: SceneType = SceneType.Main;
    //是否指引中
    isGuiding: boolean = false;
    //剩余复活次数
    remainResurgence: number;

    get curStageCfg(): CfgSceneStage {
        return this.cfg.stage[this.stageIndex];
    }

    @smartdata
    battleState: BattleState;        // 游戏状态
    @smartdata
    skillSelectList: CfgSkillData[];   // 词条选择列表  记录即可防刷词条
    @smartdata
    skillListMap: Map<CfgSkillData, number>;     //词条,数量
    @smartdata
    sceneId: number;     //场景id
    @smartdata
    stepNum: number;     //剩余步数
    @smartdata
    useStepNum: number;     //操作步数
    @smartdata
    stageIndex: number;     //阶段下标
    @smartdata
    roundIndex: number;     //回合下标
    @smartdata
    roundProgerss: number;   //回合进度
    @smartdata
    roundProgerssMax: number;    //最大回合
    @smartdata
    exp: number;     //经验
    @smartdata
    level: number    //等级
    @smartdata
    hp: number;      //血量
    @smartdata
    maxHp: number;
    @smartdata
    globalTimeScaleShow: number //加速显示 实际上，二倍速是1.5， 三倍速是2
    @smartdata
    killCount: number   //击杀数量

    //全局加速 
    get globalTimeScale(): number {
        return BATTLE_SPEED_CFG[this.globalTimeScaleShow];
    }
    //全局攻击倍数：目前只有测试情况下修改这个
    globalAttackScale: number;

    kill_elite: number;  //击杀精英怪的数量
    kill_boss: number;   //击杀boss数量
    kill_monster: number;    //击杀小怪数量
    combo_num: number;   //连击数
    box_num: number;     //宝箱合成数量
    comp_hero_num: number;  //合成了英雄多少次
    isSave: boolean;     //是否存档
    mapRow: number;     //地图多少行
    private cacheExp: number;   //缓存的经验
    isFreeSpeed3: boolean;  //是否免费的3倍数

    //技能属性
    skillAttri: BattleSkillAttriData;

    //伤害信息
    @smartdata
    attackValueRecord: Map<number, number>;

    //英雄信息
    heroInfoMap: Map<number, CfgHeroBattle>;

    //回合战报
    reports: BattleRoundReport[];

    //引导英雄池
    guideHeroPool: CfgHeroBattle[][];
    //引导技能池 3个一组
    guideSkillPool: CfgSkillData[][];

    //上阵的英雄
    in_battle_heros: number[];
    //上阵的信息
    hero_infos: IBattleHeroInfo[];
    //英雄出阵概率
    in_heros_rate: number[];
    //研究所解锁词条
    institute_skills: Set<number>;

    //特殊技能
    CfgSkill26Map: Map<number, CfgSkillData>;
    CfgSkill27Map: Map<number, CfgSkillData>;
    CfgSkill525Map: Map<number, CfgSkillData>;

    //aa变AA的获取概率
    SpSkill26RateMap: Map<number, number>;

    //Boss出生点
    showBoosRangeCol: number[];


    //获取金币概率 1 - 100
    GetCoinRate(sceneType?: SceneType, defaultValue?: number): number {
        let round = this.roundProgerss
        if (sceneType == null) {
            sceneType = this.sceneType;
        }
        let cfg;
        for (let i = 0; i < CfgBattleCoinRate.gold_rate.length; i++) {
            cfg = CfgBattleCoinRate.gold_rate[i];
            if (cfg.barrier_type == sceneType && cfg.round_id == round) {
                return cfg.gold_rate / 100;
            }
        }
        if (defaultValue != null) {
            return defaultValue;
        }
        return this.GetCoinRate(SceneType.Main, 0);
    }

    //设置上阵英雄
    SetInFightHeros(infos?: IBattleHeroInfo[], count:number = 4) {
        console.log("设置上阵英雄", infos)
        infos = infos ?? []
        this.in_battle_heros = [];
        this.hero_infos = [];
        for (let i = 0; i < count; i++) {
            if (i + 1 <= infos.length) {
                this.in_battle_heros[i] = infos[i].heroId;
                this.hero_infos.push(infos[i]);
            } else {
                this.in_battle_heros[i] = 0;
                this.hero_infos.push({ heroId: 0, heroLevel: 1 });
            }
        }
    }

    //获取英雄等级
    GetHeroLevel(id: number): number {
        if (this.hero_infos == null) {
            return 1
        }
        for (let i = 0; i < this.hero_infos.length; i++) {
            if (this.hero_infos[i].heroId == id) {
                return this.hero_infos[i].heroLevel;
            }
        }
        return 1;
    }

    //上一次的速度比
    GetLastSpeedScale(): number {
        let k = Prefskey.GetBattleSpeedScaleKey();
        let v = Prefskey.GetValue(k);
        if (v == null) {
            return 1
        }
        let speed = Number(v);
        if (speed > BattleData.Inst().MaxSpeedScale()) {
            speed = BattleData.Inst().MaxSpeedScale();
        }
        return speed;
    }


    Reset() {
        switch (this.sceneType) {
            case SceneType.Main: this.ResetMain(); break;
            case SceneType.DayChallenge: this.ResetChallenge(); break;
            case SceneType.Coin: this.ResetAct(); break;
            case SceneType.Fragment: this.ResetAct(); break;
            case SceneType.RunRunRun: this.ResetAct(); break;
            case SceneType.ShenDian: this.ResetShenDian(); break;
            case SceneType.Virtual: this.ResetVirtual(); break;
            case SceneType.Defense: this.ResetDef(); break;
            //竞技场有个return哦
            case SceneType.Arena: this.ResetArena(); return; break;
            default: this.ResetMain(); break;
        }

        if (!BattleData.Inst().isUseSave) {
            //设置每日增益
            let todayBuff = HeroData.Inst().TodayGainInfo;
            let heros = this.in_battle_heros;
            if (todayBuff && FunOpen.Inst().GetFunIsOpen(Mod.TodayGain.View)) {
                LogError("每日增益信息", todayBuff);
                let seq = todayBuff.seq;
                let cfg = HeroData.Inst().GetTodayGainInfoBySeq(seq);
                if (cfg) {
                    heros.forEach(id => {
                        if (id > 0) {
                            let heroCfg = HeroData.Inst().GetHeroBaseCfg(id);
                            if (heroCfg.hero_race == cfg.hero_race) {
                                let types = cfg.gain_type.toString().split("|");
                                let params = todayBuff.param;
                                types.forEach((type, index) => {
                                    let func = HeroBattleDayBuffHandle[Number(type)];
                                    if (func) {
                                        let value = MathHelper.GetRandomNum(Number(params[index]), Number(params[index]));
                                        func(id, value, this);
                                        LogError("每日增益触发", type, value);
                                    }
                                });
                            }
                        }
                    });
                }

                // 七日英雄卡的
                if (SevenDayHeroData.Inst().IsBuy) {
                    let cfg = CfgSupplyCardData.supply_card[0];
                    let skill1 = BattleData.Inst().GetSkillCfg(cfg.att_skill);
                    let skill2 = BattleData.Inst().GetSkillCfg(cfg.spe_skill);
                    BattleData.Inst().AddSkill(skill1);
                    BattleData.Inst().AddSkill(skill2);
                }
            }

            //设置基因系统
            heros.forEach(id => {
                if (id > 0) {
                    this.SetDNAAttri(id);
                }
            })

            // 英雄解锁的伤害加成
            this.SetHeroUnlockAdd();
        }
        //研究所
        this.SetInstituteAttri();
        // 额外加个英雄解锁假词条
        let addValue = HeroData.Inst().GetAllHeroDamage();
        if(addValue > 0){
            let data = new CfgSkillData();
            data.color = 3;
            data.skill_id = 99999;
            data.word = Format(Language.Battle.SpAttactValue, addValue / 100);
            data.icon_res_id = 2;
            BattleData.Inst().AddSkill(data);
        }
    }



    //重置
    ResetInfo() {
        this.battleState = BattleState.SanXiao;
        this.stepNum = 0;
        this.useStepNum = 0;
        this.skillSelectList = [];
        this.skillListMap = new Map();
        this.stageIndex = 0;
        this.roundIndex = 0;

        this.cacheExp = null;
        this.exp = 0;
        this.hp = DEFAULT_HP;
        this.maxHp = DEFAULT_HP;
        this.roundProgerss = 1;
        this.skillAttri = new BattleSkillAttriData();
        this.skillAttri.battleInfo = this;
        this.attackValueRecord = new Map();
        this.level = 0;
        this.isPause = false;
        this.isFreeSpeed3 = false;
        this.globalTimeScaleShow = this.GetLastSpeedScale();
        this.globalAttackScale = 1;
        this.heroInfoMap = new Map();
        this.kill_elite = 0;
        this.kill_boss = 0;
        this.kill_monster = 0;
        this.combo_num = 0;
        this.box_num = 0;
        this.comp_hero_num = 0;
        this.reports = [];
        this.guideSkillPool = null;
        this.guideHeroPool = null;
        this.CfgSkill26Map = new Map();
        this.CfgSkill27Map = new Map();
        this.CfgSkill525Map = new Map();
        this.isSave = true;
        this.remainResurgence = 1;
        this.mapRow = INIT_MAP_ROW;
        this.SpSkill26RateMap = new Map();
        this.showBoosRangeCol = [];
        this.isSaveSkill = false;
        this.in_heros_rate = [];
        this.institute_skills = new Set<number>();
        this.killCount = 0;
        this.isLoaded = false;
    }

    ResetHero() {
        if (BattleDebugData.BATTLE_DEBUG_MODE) {
            this.SetInFightHeros(BattleDebugData.Inst().InBattleHeros);
        } else {
            this.SetInFightHeros(HeroData.Inst().GetInBattleHeroInfos());
        }
    }

    //重置主线章节
    ResetMain() {
        this.ResetInfo();
        this.ResetHero();
    }

    //重置每日挑战
    ResetChallenge() {
        this.ResetInfo();
        let herolist = MainFBData.Inst().GetDailyChallengeHeroList()
        let list: IBattleHeroInfo[] = [];
        herolist.forEach(info => {
            list.push(info.ToBattleInfo())
        })
        this.SetInFightHeros(list);
        let co = MainFBData.Inst().CfgDailyChallengeDataChallengeBossInfo();
        let rule1 = MainFBData.Inst().CfgDailyChallengeDataChallengesRuleInfo(co.rule_id1);
        let rule2 = MainFBData.Inst().CfgDailyChallengeDataChallengesRuleInfo(co.rule_id2);
        this.SetChallengeRule(rule1);
        this.SetChallengeRule(rule2);
    }

    //重置活动关卡
    ResetAct() {
        this.ResetMain();

        if (this.sceneType == SceneType.RunRunRun && !BattleData.Inst().isUseSave) {
            //弱点
            let weakness = ActivityCombatData.Inst().ZombieInfo.dailyWeakness
            let heroList = this.in_battle_heros;
            let weaknessValue = CfgBarrierInfoData.rush_info[0].parm;
            console.log("冲冲冲弱点", weakness, weaknessValue);
            heroList.forEach(id => {
                if (id > 0) {
                    let baseCfg = HeroData.Inst().GetHeroBaseCfg(id);
                    if (baseCfg.hero_race == weakness) {
                        let buff = this.skillAttri.GetHeroAttriBuff(id);
                        buff.harmScale += weaknessValue / 10000;
                    }
                }
            })
        }
    }

    //重置失落神殿
    ResetShenDian() {
        this.ResetInfo();
        let heroList = LoseTempleData.Inst().GetInBattleHeroInfos();
        this.SetInFightHeros(heroList);
        LogError("失落神殿上阵的英雄", heroList);
        //this.ResetHero();

        if (!BattleData.Inst().isUseSave) {
            let remainsSKillList = LoseTempleData.Inst().GetRemainsSkillList();
            // let remainsSKillList:RemainsSkillList[] = [
            //     {skillId: 1, num: 2},
            //     {skillId: 2, num: 2},
            //     {skillId: 3, num: 2},
            //     {skillId: 4, num: 2},
            //     {skillId: 5, num: 2},
            //     {skillId: 6, num: 2},
            //     {skillId: 7, num: 2},
            //     {skillId: 8, num: 2},
            //     {skillId: 9, num: 2},
            //     {skillId: 10, num: 2},
            //     {skillId: 11, num: 2},
            //     {skillId: 12, num: 2},
            // ]
            LogError("失落神殿的词条", remainsSKillList);
            remainsSKillList.forEach(data => {
                let cfg = BattleData.Inst().GetShenDianSkillCfg(data.skillId);
                let func = BattleOtherSkillHandle[cfg.skill_type];
                if (func != null) {
                    func(cfg, BattleCtrl.Inst().battleScene, BattleData.Inst().battleInfo, data.num);
                }
            });
        }
    }

    // 重置英雄试炼
    ResetVirtual() {
        this.ResetInfo();

        let heroList = HeroTrialData.Inst().GetInBattleHeroInfos(this.sceneId);
        this.SetInFightHeros(heroList);

        if (!BattleData.Inst().isUseSave) {
            let cfg = HeroTrialData.Inst().GetTrialLevelCfg(this.sceneId);
            let skills = cfg.entries.toString().split("|");
            skills.forEach(skillid => {
                let skill = BattleData.Inst().GetSkillCfg(Number(skillid));
                if (skill) {
                    BattleData.Inst().AddSkill(skill);
                }
            })

            let heros = cfg.hero_rate.toString().split("|");
            for (let i = 0; i < 4; i++) {
                if (heros[i]) {
                    this.in_heros_rate.push(Number(heros[i]));
                } else {
                    this.in_heros_rate.push(0);
                }
            }
            LogError("英雄概率", this.in_heros_rate);
        }
    }

    //重置守卫后院
    ResetDef(){
        this.ResetInfo();
        this.in_battle_heros = [];
    }

    //重置竞技场
    ResetArena(){
        this.ResetInfo(); 
        if(this.tag == BattleObjTag.Player){
            if(ArenaData.Inst().mainInfo && ArenaData.Inst().mainInfo.buffList){
                ArenaData.Inst().mainInfo.buffList.forEach(id=>{
                    let skill = BattleData.Inst().GetSkillCfg(id);
                    if(id == SP_SKILL_ID_C){
                        let func = SpecialSkillConvert[skill.skill_id];
                        skill = func(skill, null, ArenaData.Inst().mainInfo.heroId);
                    }
                    BattleData.Inst().AddSkill(skill, this.tag);
                });
                // 设置基因
                let heros_ids = ArenaData.Inst().mainInfo.heroId;
                let heros_levels = ArenaData.Inst().mainInfo.heroLevel;
                heros_ids.forEach((v,index)=>{
                    let level = heros_levels[index];
                    if(level && level > 0){
                        this.SetDNAAttri(v);
                    }
                });
                // 设置研究所
                this.SetInstituteAttri();

                // 英雄解锁的伤害加成
                this.SetHeroUnlockAdd();

                let skin_seq = ArenaData.Inst().skinSeq;
                this.SetSkinAttri(skin_seq);
            }
        }else{
            let matchInfo = ArenaData.Inst().matchInfo;
            if(matchInfo && matchInfo.buffList){
                matchInfo.buffList.forEach(id=>{
                    let skill = BattleData.Inst().GetSkillCfg(id);
                    if(id == SP_SKILL_ID_C){
                        let func = SpecialSkillConvert[skill.skill_id];
                        skill = func(skill, null, ArenaData.Inst().matchHeroidList);
                    }
                    BattleData.Inst().AddSkill(skill, this.tag);
                });
                // 设置基因
                matchInfo.heroList.forEach(v=>{
                    if(v.heroLevel > 0){
                        this.SetDNAAttri(v.heroId, v.geneId);
                    }
                })
                this.SetInstituteAttri(matchInfo.talentList);

                // 英雄解锁的伤害加成
                let damAdd = matchInfo.heroDamage;
                this.skillAttri.harmPercent += damAdd / 10000;

                let skin_seq = matchInfo.skinSeq;
                this.SetSkinAttri(skin_seq);

                // 机器人属性加成
                if(matchInfo.roleInfo.roleId < 65535){
                    let robotCfg = ArenaData.Inst().GetRobotCfg(matchInfo.roleInfo.roleId);
                    if(robotCfg){
                        let attTypes = robotCfg.buff_type.toString().split("|");
                        let attVlaues = robotCfg.buff_param.toString().split("|");
                        attTypes.forEach((v,index)=>{
                            let type = Number(v);
                            let value = attVlaues[index];
                            if(value){
                                let valuePer = Number(value) / 10000;
                                if(!Number.isNaN(valuePer)){
                                    switch(type){
                                        case 1: this.skillAttri.attackValue += Number(value); break;
                                        case 2: this.skillAttri.attackSpeedPercent += valuePer; break;
                                        case 3: this.skillAttri.harmPercent += valuePer; break;
                                        case 4: this.skillAttri.baoji += Number(value) / 100; break;
                                        case 5: this.skillAttri.baojiScale += valuePer; break;
                                    }
                                }
                            }
                        })
                    }
                }
            }
        }
    }

    //设置基因系统属性
    SetDNAAttri(id:number, items?: number[]){
        if (id > 0) {
            let jiyin: JiYinAttriBuff
            if(items){
                jiyin =  HeroData.Inst().GetGeneAttriBuffByItem(items);
            }else{
                jiyin =  HeroData.Inst().GetGeneAttriBuff(id);
            }
            if (jiyin) {
                let buff = this.skillAttri.GetHeroAttriBuff(id);
                buff.harmValue += jiyin.harmValue;
                buff.harmScale += jiyin.harmScale / 10000;
                buff.baoji += jiyin.baoji / 100;
                buff.baojiScale += jiyin.baojiScale / 10000;
                buff.attackSpeed += jiyin.attackSpeedScale / 10000;
            }
        }
    }

    //设置研究所属性
    SetInstituteAttri(infos?:{talentId:number,talentLevel:number}[]|IPB_SCArenaTalentLevelInfo[]){
        let instituteLevelCfgList:CfgInstituteLevel[];
        if(infos){
            instituteLevelCfgList = InstituteData.Inst().GetAllActiveCfg2(infos);
        }else{
            instituteLevelCfgList = InstituteData.Inst().GetAllActiveCfg();
        }
        if (instituteLevelCfgList) {
            let insTypeMap = new Map<number, CfgInstituteLevel>();
            instituteLevelCfgList.forEach(cfg => {
                let type = cfg.talent_type;
                let func = InstituteTalentHandle[type];
                if (func) {
                    func(cfg, this);
                }

                let maxCfg = insTypeMap.get(cfg.talent_type);
                if (cfg.battle_show == 1 && (maxCfg == null || cfg.color * 100 + cfg.level > maxCfg.color * 100 + maxCfg.level)) {
                    insTypeMap.set(cfg.talent_type, cfg);
                }
            })
            insTypeMap.forEach((v, k) => {
                let skill = InstituteData.Inst().ConvertBattleSkill(v);
                if (skill) {
                    BattleData.Inst().AddSkill(skill);
                }
            })
        }
    }

    //英雄解锁的伤害
    SetHeroUnlockAdd(){
        let real_att = CfgHero.attr_open[0].real_att ?? 1;
        let addValue = HeroData.Inst().GetAllHeroDamage();
        let damAdd = addValue * real_att;
        if(damAdd > 0){
            this.skillAttri.harmPercent += damAdd / 10000;
        }
    }

    //皮肤属性
    SetSkinAttri(skin_seq:number){
        let skinCfg = ArenaData.Inst().GetSkinCfg(skin_seq);
        if(skinCfg){
            let gain_type = skinCfg.gain_type;
            if(skinCfg.gain_param == null || skinCfg.gain_param == 0){
                return;
            }
            let perValue = skinCfg.gain_param / 10000;
            switch(gain_type){
                case 1: this.skillAttri.attackValue += skinCfg.gain_param; break;
                case 2: this.skillAttri.attackSpeedPercent += perValue; break;
                case 3: this.skillAttri.harmPercent += perValue; break;
                case 4: this.skillAttri.baoji += perValue; break;
                case 5: this.skillAttri.baojiScale += perValue; break;
                case 6: this.SetHeroRaceAttri(HeroRaceType.WuLi,perValue); break;
                case 7: this.SetHeroRaceAttri(HeroRaceType.Shui,perValue); break;
                case 8: this.SetHeroRaceAttri(HeroRaceType.An,perValue); break;
                case 9: this.SetHeroRaceAttri(HeroRaceType.Du,perValue); break;
                case 10: this.SetHeroRaceAttri(HeroRaceType.Huo,perValue); break;
                case 11: this.SetHeroRaceAttri(HeroRaceType.Tu,perValue); break;
                case 12: this.SetHeroRaceAttri(HeroRaceType.Gunag,perValue); break;
            }
        }
    }

    //设置英雄类型伤害属性加成
    SetHeroRaceAttri(hero_race:number, value:number){
        if(value == 0){
            return;
        }
        let heroIdList:number[];
        if(BattleCtrl.Inst().battleModel == BattleModel.Arena){
            if(this.tag == BattleObjTag.Player){
                heroIdList = ArenaData.Inst().mainInfo.heroId;
            }else{
                heroIdList = ArenaData.Inst().matchHeroidList;
            }
        }else{
            heroIdList = this.in_battle_heros;
        }

        
        heroIdList.forEach(id => {
            if (id > 0) {
                let baseCfg = HeroData.Inst().GetHeroBaseCfg(id);
                if (baseCfg.hero_race == hero_race) {
                    let heroSkillBuff = this.skillAttri.GetHeroAttriBuff(id);
                    if (heroSkillBuff) {
                        heroSkillBuff.harmScale += value;
                    }
                }
            }
        })
    }


    SetChallengeRule(cfg: CfgDailyChallengeDataChallengesRule) {
        switch (cfg.rule_type) {
            case BattleChallengeRuleType.HeroAttackSpeed: this.skillAttri.attackSpeedPercent += cfg.pram1 / 10000; break;
            case BattleChallengeRuleType.JingYingMonsterHp: this.skillAttri.jingyingHpPercent += cfg.pram1 / 10000; break;
            case BattleChallengeRuleType.MonsterMoveSpeed: this.skillAttri.monsterMoveParcent += cfg.pram1 / 10000; break;
            case BattleChallengeRuleType.MonsterHp: this.skillAttri.monsterHpPrecent += cfg.pram1 / 10000; break;
            case BattleChallengeRuleType.HeroAttackHarm: this.skillAttri.harmPercent += cfg.pram1 / 10000; break;
        }
    }

    SetBattleState(state: BattleState) {
        this.battleState = state;
    }
    GetBattleState() {
        return this.battleState ?? BattleState.SanXiao;
    }

    //设置/获取/添加步数
    SetStepNum(v: number) {
        this.stepNum = v;
    }
    GetStepNum(): number {
        return this.stepNum;
    }
    AddStepNum(num: number) {
        if (num < 0) {
            this.useStepNum -= num;
        }
        this.stepNum += num;
    }
    HasStep(): boolean {
        return this.stepNum > 0;
    }
    SetUseStep(num: number) {
        this.useStepNum = num;
    }
    GetUseStep() {
        return this.useStepNum;
    }

    //阶段 注意，这是数组下标
    SetSceneStageIndex(v: number) {
        this.stageIndex = v;
    }
    GetSceneStageIndex() {
        return this.stageIndex
    }
    AddSceneStageIndex(v: number) {
        this.stageIndex += v;
    }


    //回合 注意，这是数组下标
    SetSceneRoundIndex(v: number) {
        this.roundIndex = v;
    }
    GetSceneRoundIndex() {
        return this.roundIndex
    }
    AddSceneRoundIndex(v: number) {
        this.roundIndex += v;
    }

    //血量相关
    SetHP(hp: number) {
        this.hp = hp;
    }
    GetHP(): number {
        return this.hp;
    }
    AddHP(v: number) {
        let hp = this.hp + v;
        if (hp > this.maxHp) {
            hp = this.maxHp;
        }
        if (hp < 0) {
            hp = 0;
        }
        this.hp = hp;
    }

    //经验相关
    SetExp(exp: number) {
        this.exp = exp;
    }
    GetExp(): number {
        return this.exp
    }
    AddExp(exp: number) {
        //console.log("添加了多少经验", this.exp,exp);
        this.exp += exp;
        let cfg = this.ExpCfg();
        if (this.exp >= cfg.battle_exp) {
            this.cacheExp = 1 //this.exp - cfg.battle_exp;
            this.exp = cfg.battle_exp;
            let quas = [0, 0, 0];
            let stageCfg = this.curStageCfg;
            let skill_list = BattleData.Inst().RandomSkillList(quas, stageCfg.public_entry_id, true);//BattleCtrl.Inst().battleScene.dataModel.curStage.GetSkillids(quas);
            let action = RandomSkillListAction.Create(skill_list, 2);
            BattleCtrl.Inst().PushAction(action);
        }
    }
    GetLevel(): number {
        return this.level;
    }
    UpLevel() {
        if (this.cacheExp) {
            this.exp = 0;
            this.AddExp(this.cacheExp);
            this.cacheExp = null;
            this.level++;
        }
    }
    ExpCfg(level?: number): CfgSceneBattleLevel {
        level = level ?? this.level;
        if (level >= this.cfg.battle_level.length) {
            LogError("缺少战斗等级配置！！！")
            level = this.cfg.battle_level.length - 1;
        }
        return this.cfg.battle_level[level];
    }

    //战报
    AddReport(data: BattleRoundReport) {
        this.reports.push(data);
    }
    GetCurReport(): BattleRoundReport {
        return this.reports[this.reports.length - 1];
    }


    //获取引导的英雄
    GetGuideHeroData(col: number): CfgHeroBattle {
        if (this.guideHeroPool == null || this.guideHeroPool.length == 0) {
            return null;
        }
        let pool = this.guideHeroPool[col];
        if (pool == null || pool.length == 0) {
            return null;
        }
        return pool.shift();
    }
    SetGuideHeroData(data: CfgHeroBattle[][]) {
        this.guideHeroPool = data;
    }

    //获取引导词条
    GetGuideSkillData(): CfgSkillData[] {
        if (this.guideSkillPool == null || this.guideSkillPool.length == 0) {
            return null;
        }
        let group = this.guideSkillPool.shift();
        return group;
    }

    SetGuideSkillData(data: CfgSkillData[][]) {
        this.guideSkillPool = data;
    }

    //获取单个英雄aa变为bb的概率
    GetSpSkill26HeroRate(heroid: number): number {
        if (!this.SpSkill26RateMap.has(heroid)) {
            this.SpSkill26RateMap.set(heroid, 100);
        }
        return this.SpSkill26RateMap.get(heroid);
    }
    SetSpSkill26HeroRate(heroid: number, rate: number) {
        this.SpSkill26RateMap.set(heroid, rate);
        if (this.SpSkill26RateMap.size >= 4) {
            let num = 0;
            this.SpSkill26RateMap.forEach((rate, hero_id) => {
                num += rate;
            })
            if (num <= this.SpSkill26RateMap.size * 20) {
                this.SpSkill26RateMap.clear();
            }
        }
    }

    //  存档相关
    static ConvertSaveData(obj: BattleInfo): BattleInfoSave {
        let data = <BattleInfoSave>{};
        data.sceneType = obj.sceneType;
        data.sceneId = obj.sceneId;
        data.battleState = obj.battleState;
        data.globalTimeScaleShow = obj.globalTimeScaleShow;
        data.stepNum = obj.stepNum;
        data.useStepNum = obj.useStepNum;
        data.stageIndex = obj.stageIndex;
        data.roundIndex = obj.roundIndex;
        data.roundProgerss = obj.roundProgerss;
        data.roundProgerssMax = obj.roundProgerssMax;
        data.exp = obj.exp;
        data.level = obj.level;
        data.hp = obj.hp;
        data.maxHp = obj.maxHp;
        data.kill_elite = obj.kill_elite;
        data.kill_boss = obj.kill_boss;
        data.kill_monster = obj.kill_monster;
        data.combo_num = obj.combo_num;
        data.box_num = obj.box_num;
        data.mapRow = obj.mapRow;
        data.comp_hero_num = obj.comp_hero_num;
        data.in_battle_heros = obj.in_battle_heros;
        data.hero_infos = obj.hero_infos;
        if (!BattleDebugData.BATTLE_DEBUG_MODE) {
            data.skillAttri = BattleSkillAttriData.ConvertSaveData(obj.skillAttri);
        } else {
            data.skillAttri = BattleSkillAttriData.ConvertSaveData(new BattleSkillAttriData());
        }
        data.heroInfoList = [];
        obj.heroInfoMap.forEach((heroData, posIndex) => {
            if(heroData){
                let info = <IHeroInfoSave>{
                    heroId: heroData.hero_id,
                    heroStage: heroData.stage,
                    posIndex: posIndex,
                }
                data.heroInfoList.push(info);
            }
        });
        data.skillInfoList = [];
        data.SpSkillInfoList = [];
        if (!BattleDebugData.BATTLE_DEBUG_MODE) {
            obj.skillListMap.forEach((num, skill) => {
                let info = <ISkillInfoSave>{
                    skillId: skill.skill_id,
                    count: num,
                }
                data.skillInfoList.push(info);
            });
            obj.CfgSkill26Map.forEach((skill, hero_id) => {
                data.SpSkillInfoList.push({ param: hero_id, skill_id: skill.skill_id, num: 1 });
            })
            obj.CfgSkill27Map.forEach((skill, hero_id) => {
                data.SpSkillInfoList.push({ param: hero_id, skill_id: skill.skill_id, num: 1 });
            })
            obj.CfgSkill525Map.forEach((skill, param) => {
                let skillNum = obj.skillListMap.get(skill);
                if (skillNum) {
                    data.SpSkillInfoList.push({ param: param, skill_id: skill.skill_id, num: skillNum });
                }
            })
        }
        data.harmInfoList = [];
        obj.attackValueRecord.forEach((value, heroid) => {
            let info = <IHarmInfoSave>{
                heroId: heroid,
                harmValue: value,
            }
            data.harmInfoList.push(info);
        })

        data.reports = obj.reports;
        data.remainResurgence = obj.remainResurgence;
        data.showBoosRangeCol = obj.showBoosRangeCol ?? [];
        data.isFreeSpeed3 = obj.isFreeSpeed3;
        return data;
    }

    static ConvertObj(obj: BattleInfo, data: BattleInfoSave) {
        //console.log("设置存档数据", data);
        obj.sceneType = data.sceneType;
        obj.sceneId = data.sceneId;
        obj.battleState = data.battleState;
        obj.globalTimeScaleShow = data.globalTimeScaleShow;
        obj.stepNum = data.stepNum;
        obj.useStepNum = data.useStepNum;
        obj.stageIndex = data.stageIndex;
        obj.roundIndex = data.roundIndex;
        obj.roundProgerss = data.roundProgerss;
        obj.roundProgerssMax = data.roundProgerssMax;
        obj.exp = data.exp;
        obj.level = data.level;
        obj.hp = data.hp;
        obj.maxHp = data.maxHp;
        obj.kill_elite = data.kill_elite;
        obj.kill_boss = data.kill_boss;
        obj.kill_monster = data.kill_monster;
        obj.combo_num = data.combo_num;
        obj.box_num = data.box_num;
        obj.comp_hero_num = data.comp_hero_num;
        obj.mapRow = data.mapRow;

        obj.skillAttri = BattleSkillAttriData.ConvertObj(data.skillAttri);
        obj.skillAttri.battleInfo = obj;
        obj.in_battle_heros = data.in_battle_heros;
        obj.hero_infos = data.hero_infos;

        obj.heroInfoMap = new Map();
        if (data.heroInfoList) {
            data.heroInfoList.forEach((info) => {
                let cfg = HeroData.Inst().GetHeroBattleCfg(info.heroId, info.heroStage);
                obj.heroInfoMap.set(info.posIndex, cfg);
            });
        }

        obj.CfgSkill26Map = new Map();
        obj.CfgSkill27Map = new Map();
        obj.CfgSkill525Map = new Map();
        obj.skillListMap = obj.skillListMap ?? new Map();
        data.SpSkillInfoList.forEach(info => {
            if (info.skill_id == SP_SKILL_ID_B) {
                let cfg = BattleData.Inst().GetSkillCfg(info.skill_id);
                if (cfg) {
                    let skill = SpecialSkillConvert[BattleSkillType.ChuXianJiuShengJi](cfg, info.param);
                    if (skill) {
                        obj.CfgSkill27Map.set(info.param, skill);
                        obj.skillListMap.set(skill, info.num);
                    }
                }
            } else if (info.skill_id == SP_SKILL_ID_A) {
                let cfg = BattleData.Inst().GetSkillCfg(info.skill_id);
                if (cfg) {
                    let skill = SpecialSkillConvert[BattleSkillType.UpHero](cfg, info.param);
                    if (skill) {
                        obj.CfgSkill26Map.set(info.param, skill);
                    }
                }
            } else if (info.skill_id == SP_SKILL_ID_C) {
                let cfg = BattleData.Inst().GetSkillCfg(info.skill_id);
                if (cfg) {
                    let skill = SpecialSkillConvert[BattleSkillType.ShuXingShangHaiTiSheng](cfg, info.param);
                    if (skill) {
                        obj.CfgSkill525Map.set(info.param, skill);
                        obj.skillListMap.set(skill, info.num);
                    }
                }
            }
        })

        if (data.skillInfoList) {
            data.skillInfoList.forEach(info => {
                if (info.skillId != SP_SKILL_ID_A && info.skillId != SP_SKILL_ID_B && info.skillId != SP_SKILL_ID_C) {
                    let cfg = BattleData.Inst().GetSkillCfg(info.skillId);
                    if (cfg) {
                        obj.skillListMap.set(cfg, info.count);
                    }
                }
            })
        }

        obj.attackValueRecord = new Map();
        if (data.harmInfoList) {
            data.harmInfoList.forEach(info => {
                obj.attackValueRecord.set(info.heroId, info.harmValue);
            })
        }

        obj.reports = data.reports;
        obj.remainResurgence = data.remainResurgence;
        obj.showBoosRangeCol = data.showBoosRangeCol ?? [];
        obj.isFreeSpeed3 = data.isFreeSpeed3;
    }

}

export interface IMonsterAttackRecord {

}

//回合战报  验证用
export class BattleRoundReport implements IPB_SCBattleRoundInfo {
    totalTime: (number | null) = 0;
    heroList: (IPB_SCBattleHero[] | null) = [];
    monsterList: (IPB_SCBattleMonsterInfo[] | null) = [];
    buffId: (number[] | null) = [];
    moveList: (IPB_SCBattleMoveNode[] | null) = [];
    comboAddStep: number = 0;
}


///   存档数据  ///

//英雄信息存档
export interface IHeroInfoSave {
    posIndex: number,    //位置下标，用于转成ij
    heroId: number,
    heroStage: number,   //等级
}

//词条存档
export interface ISkillInfoSave {
    skillId: number,
    count: number,
}

//伤害信息
export interface IHarmInfoSave {
    heroId: number,
    harmValue: number,
}

//英雄属性加成
export interface IHeroSkillAttriSave {
    heroId: number,
    skillAttri: BattleHeroAttriBuff,
}

//怪物buff伤害加成
export interface IMonsterBuffHarmSave {
    buffType: number,
    value: number,
}

export interface ISpSkillSave {
    skill_id: number,
    param: number,
    num: number,
}

//技能属性
export interface BattleSkillAttriSave {
    //击杀经验百分比
    monsterExpPercent: number;
    //伤害百分比
    harmPercent: number;
    //攻速百分比
    attackSpeedPercent: number;
    //怪物移动速度百分比
    monsterMoveParcent: number;
    //晋级后携带英雄数量
    stageHeroCount: number;

    //小怪生命加成
    xiaoguaiHpPercent: number;
    //boss生命加成
    bossHpPercent: number;
    //精英怪生命加成
    jingyingHpPercent: number;
    //怪物生命加成
    monsterHpPrecent: number;
    //英雄重击率 0 - 100
    zhongji: number;
    //英雄暴击率 0 - 100
    baoji: number;
    //暴击增加的伤害比例
    baojiScale: number;
    attackValue: number;
    bossHarmAdd: number;
    wuXiaoJiaBuShu: number;
    coidRate: number;
    //每日多加x步
    isMeiRiAddStep: number;
    isMieJieAddStep: number;

    //是否5消时中间多生一级
    isWuXiaoBuff: boolean;
    //是否支持斜角
    isCanXieJiao: boolean;
    //是否五消额外获得金币
    isWuXiaoHuoDeJinBi: boolean;
    //是否每日首次合成时，产生英雄数量+1
    isMeiRiHeChengAdd: boolean;
    //是否城堡血量低于50%时伤害增加40%
    isChengBao1: boolean;
    //城堡每增加100血量上限增加10%伤害
    isChengBao2: boolean;
    //城堡当日未收到伤害时，恢复<color=#DF7401>{0}</color>血量
    isChengBao3: boolean;

    //英雄属性加成
    heroAttriInfoList: IHeroSkillAttriSave[];
    monsterBuffHarmScaleList: IMonsterBuffHarmSave[];
}

export interface BattleInfoSave {
    storageLifeTime: number;    //到期时间 -1则不到期
    version: number;            //存档版本号

    sceneType: SceneType;       //场景类型
    sceneId: number;                            //场景id
    battleState: BattleState;                   // 游戏状态
    globalTimeScaleShow: number;                    //全局加速
    stepNum: number;                            //剩余步数
    useStepNum: number;                         //操作步数
    stageIndex: number;                         //阶段下标
    roundIndex: number;                         //回合下标
    roundProgerss: number;                      //回合进度
    roundProgerssMax: number;                   //最大回合
    exp: number;        //经验
    level: number       //等级
    hp: number;         //血量
    maxHp: number;      //最大血量
    kill_elite: number;  //击杀精英怪的数量
    kill_boss: number;  //击杀boss数量
    kill_monster: number; //击杀小怪数量
    combo_num: number;   //连击数
    box_num: number;     //宝箱合成数量
    comp_hero_num: number;   //英雄合成数
    in_battle_heros: number[];
    hero_infos: IBattleHeroInfo[];
    remainResurgence: number;
    mapRow: number;
    isFreeSpeed3: boolean;

    //技能属性
    skillAttri: BattleSkillAttriSave;

    //英雄信息
    heroInfoList: IHeroInfoSave[];

    //词条信息
    skillInfoList: ISkillInfoSave[];

    //伤害信息
    harmInfoList: IHarmInfoSave[];

    //回合战报
    reports: BattleRoundReport[];

    //特殊技能
    SpSkillInfoList: ISpSkillSave[];

    //boss出生点
    showBoosRangeCol: number[];

}
import { CfgBarrierInfoData } from "config/CfgBarrierInfo";
import { GetCfgValue } from "config/CfgCommon";
import { CfgDailyChallengeData } from "config/CfgDailyChallenge";
import { CfgMonster } from "config/CfgMonster";
import { CfgPlayerLevelData } from "config/CfgPlayerLevel";
import { bit } from "core/net/bit";
import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { HeroAttriType } from "modules/Battle/BattleConfig";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { Mod } from "modules/common/ModuleDefine";
import { HeroDataModel } from "modules/hero/HeroData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { LocalStorageHelper } from "../../helpers/LocalStorageHelper";


export class MainFBResultData {
    Info: PB_MainFBInfo
    DailyChallengeInfo: PB_DailyChallengeInfo
}

export class MainFBFlushData {
    @smartdata
    FlushInfo: boolean = false;

    @smartdata
    FlushDailyChallengeInfo: boolean = false;

    @smartdata
    FlushIsRemindShow: boolean = false;

    SelId: number = -1;
}

export class MainFBData extends DataBase {

    public ResultData: MainFBResultData;
    public FlushData: MainFBFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(MainFBFlushData);
        this.ResultData = new MainFBResultData()
    }

    public SetMainFBInfo(protocol: PB_MainFBInfo) {
        this.ResultData.Info = this.ResultData.Info ?? new PB_MainFBInfo()
        for (let element of protocol.fbList) {
            // FIX: lip 只有10关
            if(element.level > 10)continue;
            let index = this.ResultData.Info.fbList.findIndex(cfg => cfg.level == element.level)
            if (-1 == index) {
                this.ResultData.Info.fbList.push(element)
            } else {
                this.ResultData.Info.fbList[index] = element
            }
        }
        this.ResultData.Info.energyBuyCount = protocol.energyBuyCount
        this.ResultData.Info.adReward = protocol.adReward
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public SetDailyChallengeInfo(protocol: PB_DailyChallengeInfo) {
        this.ResultData.DailyChallengeInfo = protocol
        this.FlushData.FlushDailyChallengeInfo = !this.FlushData.FlushDailyChallengeInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    public get InfoRedLeft() {
        for (let info of this.InfoFbList) {
            if (info.level < this.SelId) {
                let co = MainFBData.Inst().CfgBarrierInfoMainInfo(info.level)
                let co_items = MainFBData.Inst().CfgBarrierInfoMainItemInfo(co.barrier_id, co.round_max)
                for (let i = 0; i < co_items.length; i++) {
                    let item = co_items[i]
                    if (info.round >= item.round_num && !info.rewardFlag[i]) {
                        return 1
                    }
                }
            }
        }
        return 0
    }

    public get InfoRedRight() {
        for (let info of this.InfoFbList) {
            if (info.level > this.SelId) {
                let co = MainFBData.Inst().CfgBarrierInfoMainInfo(info.level)
                let co_items = MainFBData.Inst().CfgBarrierInfoMainItemInfo(co.barrier_id, co.round_max)
                for (let i = 0; i < co_items.length; i++) {
                    let item = co_items[i]
                    if (info.round >= item.round_num && !info.rewardFlag[i]) {
                        return 1
                    }
                }
            }
        }
        return 0
    }

    public get InfoEnergyBuyCount() {
        return this.Info ? this.Info.energyBuyCount : 0
    }

    public get InfoFbList() {
        return this.Info ? this.Info.fbList : []
    }

    public get InfoAdReward() {
        return this.Info ? this.Info.adReward : false
    }

    public get DailyChallengeInfo() {
        return this.ResultData.DailyChallengeInfo
    }

    public get DailyChallengeInfoBossSeq() {
        return this.DailyChallengeInfo ? this.DailyChallengeInfo.bossSeq : 0
    }

    public get DailyChallengeInfoFetchFlag() {
        return this.DailyChallengeInfo ? this.DailyChallengeInfo.fetchFlag : 0
    }

    public get DailyChallengeInfoMissionProgress() {
        return this.DailyChallengeInfo ? this.DailyChallengeInfo.missionProgress : []
    }

    public get DailyChallengeInfoBattleRound() {
        return this.DailyChallengeInfo ? this.DailyChallengeInfo.battleRound : 0
    }

    public set SelId(value: number) {
        this.FlushData.SelId = value
    }

    public get SelId() {
        return this.FlushData.SelId
    }

    public CfgPlayerLevelOtherGetPowerNum() {
        return CfgPlayerLevelData.other[0].get_power_num ?? 0
    }

    public CfgPlayerLevelOtherTime() {
        return CfgPlayerLevelData.other[0].time ?? 0
    }

    public CfgPlayerLevelOtherPowerBuyItem() {
        return CfgPlayerLevelData.other[0].power_buy_item ?? 0
    }

    public CfgPlayerLevelOtherPowerBuyItemNum() {
        return CfgPlayerLevelData.other[0].power_buy_item_num ?? 0
    }

    public CfgPlayerLevelOtherUp() {
        return CfgPlayerLevelData.other[0].up ?? 0
    }

    public CfgBarrierInfoMainInfo(barrier_id: number) {
        return CfgBarrierInfoData.Main_info.find(cfg => cfg.barrier_id == barrier_id)
    }

    public CfgBarrierInfoMainItemInfo(barrier_id: number, round_max: number) {
        return CfgBarrierInfoData.Main_item_info.filter(cfg => cfg.barrier_id == barrier_id && cfg.round_num <= round_max)
    }

    public CfgBarrierInfoMainInfoCount() {
        return CfgBarrierInfoData.Main_info.length
    }

    public CfgDailyChallengeDataChallengeBossInfo(seq: number = this.DailyChallengeInfoBossSeq) {
        return CfgDailyChallengeData.Challenge_Boss.find(cfg => cfg.seq == seq)
    }

    public CfgDailyChallengeDataChallengesMissionsInfo(mission_id: number) {
        return CfgDailyChallengeData.challenges_missions.find(cfg => cfg.mission_id == mission_id)
    }

    public CfgDailyChallengeDataChallengesRuleInfo(rule_id: number) {
        return CfgDailyChallengeData.challenges_rule.find(cfg => cfg.rule_id == rule_id)
    }

    public GetDailyChallengeHeroList() {
        let co = this.CfgDailyChallengeDataChallengeBossInfo()
        let list = []
        for (let i = 1; i <= 4; i++) {
            list.push(new HeroDataModel(GetCfgValue(co, `hero_id${i}`), GetCfgValue(co, `hero_level${i}`), true))
        }
        return list
    }

    public GetInfoFbInfoByLevel(id: number) {
        if (id > 0) {
            let index = this.InfoFbList.findIndex(cfg => cfg.level == id)
            if (-1 == index) {
                // MainFBCtrl.Inst().SendMainFBOperInfo(id)
                let info = { level: id, round: 0, rewardFlag: [false, false, false] }
                this.InfoFbList.push(info)
            } else {
                return this.Info.fbList[index]
            }
        }
    }

    public GetDailyChallengeGet(seq: number, co: any) {
        let is_get = bit.hasflag(this.DailyChallengeInfoFetchFlag, seq)
        let can_get = false
        switch (co.mission_type) {
            case 1:
                can_get = 0 != this.DailyChallengeInfoMissionProgress[seq - 1]
                break;
            case 2:
                can_get = 0 != this.DailyChallengeInfoMissionProgress[seq - 1]
                break;
            case 3:
                can_get = this.DailyChallengeInfoMissionProgress[seq - 1] >= co.pram2
                break;
            case 4:
                can_get = this.DailyChallengeInfoMissionProgress[seq - 1] >= co.pram1
                break;
            case 5:
                can_get = this.DailyChallengeInfoMissionProgress[seq - 1] >= co.pram1
                break;

        }
        return { is_get, can_get }
    }

    public GetMainTaskShowLevel() {
        let info
        let level = -1
        for (let element of this.InfoFbList) {
            if (element.level > level) {
                info = element
                level = element.level
            }
        }
        if (info) {
            let co = MainFBData.Inst().CfgBarrierInfoMainInfo(level)
            if (co && info.round >= co.round_max && level < this.CfgBarrierInfoMainInfoCount()) {
                level = level + 1
            }
        }
        return level
    }

    public GetMonsterDefType(monsterData: any) {
        let list = [];
        if (monsterData.physics_def != 0) {
            list.push({ type: HeroAttriType.WuLi, val: monsterData.physics_def })
        }
        if (monsterData.water_def != 0) {
            list.push({ type: HeroAttriType.Shui, val: monsterData.water_def })

        }
        if (monsterData.dark_def != 0) {
            list.push({ type: HeroAttriType.An, val: monsterData.dark_def })

        }
        if (monsterData.poison_def != 0) {
            list.push({ type: HeroAttriType.Du, val: monsterData.poison_def })

        }
        if (monsterData.fire_def != 0) {
            list.push({ type: HeroAttriType.Huo, val: monsterData.fire_def })

        }
        if (monsterData.soil_def != 0) {
            list.push({ type: HeroAttriType.Tu, val: monsterData.soil_def })

        }
        return list;
    }

    public GetAllRed() {
        let co = this.CfgDailyChallengeDataChallengeBossInfo()
        if (!co) return 0
        for (let i = 0; i < 3; i++) {
            let co_task = this.CfgDailyChallengeDataChallengesMissionsInfo(GetCfgValue(co, `mission_id${i + 1}`))
            let info_get = this.GetDailyChallengeGet(i + 1, co_task)
            if (info_get.can_get && !info_get.is_get) {
                return 1
            }
        }
        return 0
    }

    public GetFirstRed() {
        let is_MainFBOpen = FunOpen.Inst().GetFunIsOpen(Mod.Main.EverydayFB);
        if (!is_MainFBOpen.is_open) {
            return 0;
        }
        let old_time = LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("MainFB"));
        let today_time = Math.floor(TimeCtrl.Inst().todayStarTime);
        if (old_time != today_time)
            return 1;
        return 0;
    }

    public ClearFirstRemind() {
        let old_time = LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("MainFB"));
        let today_time = Math.floor(TimeCtrl.Inst().todayStarTime);
        if (old_time != today_time) {
            LocalStorageHelper.PrefsInt(LocalStorageHelper.IsRemindShow("MainFB"), today_time);
            this.FlushData.FlushIsRemindShow = !this.FlushData.FlushIsRemindShow
        }
    }

    public MonsterInfoById(monster_id: number) {
        return CfgMonster.monster_page.find(cfg => cfg.monster_id == monster_id)
    }
}
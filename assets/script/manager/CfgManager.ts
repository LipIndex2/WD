import { JsonAsset } from "cc";
import { _CreateCfgActivityMain } from "config/CfgActivityMain";
import { _CreateCfgAd } from "config/CfgAd";
import { _CreateCfgArena } from "config/CfgArena";
import { _CreateCfgBackyard } from "config/CfgBackyard";
import { _CreateCfgBarrierInfo } from "config/CfgBarrierInfo";
import { _CreateCfgBarrierPack } from "config/CfgBarrierPack";
import { _CreateCfgBattleCoinRate } from "config/CfgBattleCoinRate";
import { _CreateCfgBattleGuide } from "config/CfgBattleGuide";
import { _CreateCfgCavePass } from "config/CfgCavePass";
import { _CreateCfgCeremonyAct } from "config/CfgCeremonyAct";
import { _CreateCfgCeremonyGift } from "config/CfgCeremonyGift";
import { _CreateCfgCultivate } from "config/CfgCultivate";
import { _CreateCfgDailyBuy } from "config/CfgDailyBuy";
import { _CreateCfgDailyChallenge } from "config/CfgDailyChallenge";
import { _CreateCfgDebris } from "config/CfgDebris";
import { _CreateCfgDefensePassCheck } from "config/CfgDefensePassCheck";
import { _CreateCfgDnaSys } from "config/CfgDnaSys";
import { _CreateCfgDnaTask } from "config/CfgDnaTask";
import { _CreateCfgEene } from "config/CfgEene";
import { _CreateCfgEntry } from "config/CfgEntry";
import { _CreateCfgFarm } from "config/CfgFarm";
import { _CreateCfgFirstCharge } from "config/CfgFirstCharge";
import { _CreateCfgFish } from "config/CfgFish";
import { _CreateCfgFishItem } from "config/CfgFishItem";
import { _CreateCfgFunOpen } from "config/CfgFunOpen";
import { _CreateCfgGameCircle } from "config/CfgGameCircle";
import { _CreateCfgGeneGift } from "config/CfgGeneGift";
import { _CreateCfgGeneOrientation } from "config/CfgGeneOrientation";
import { _CreateCfgGetWay } from "config/CfgGetWay";
import { _CreateCfgGift } from "config/CfgGift";
import { _CreateCfgGrowPack } from "config/CfgGrowPack";
import { _CreateCfgGrowPass } from "config/CfgGrowPass";
import { _CreateCfgGuideData } from "config/CfgGuide";
import { _CreateCfgHero } from "config/CfgHero";
import { _CreateCfgHeroIntegral } from "config/CfgHeroIntegral";
import { _CreateCfgHeroTrial } from "config/CfgHeroTrial";
import { _CreateCfgHouZai } from "config/CfgHouZai";
import { _CreateCfgInstitute } from "config/CfgInstitute";
import { _CreateCfgInviteFriend } from "config/CfgInviteFriend";
import { _CreateCfgLostTemple } from "config/CfgLostTemple";
import { _CreateCfgMining } from "config/CfgMining";
import { _CreateCfgMonster } from "config/CfgMonster";
import { _CreateCfgMonsterCtrl } from "config/CfgMonsterCtrl";
import { _CreateCfgNewPack } from "config/CfgNewPack";
import { _CreateCfgOther } from "config/CfgOther";
import { _CreateCfgPartsGift } from "config/CfgPartsGift";
import { _CreateCfgPasscheck } from "config/CfgPasscheck";
import { _CreateCfgPiggy } from "config/CfgPiggy";
import { _CreateCfgPlayerLevel } from "config/CfgPlayerLevel";
import { _CreateCfgPrivilege } from "config/CfgPrivilege";
import { _CreateCfgRandactivityopen } from "config/CfgRandactivityopen";
import { _CreateCfgRandomDna } from "config/CfgRandomDna";
import { _CreateCfgRapidReturns } from "config/CfgRapidReturns";
import { _CreateCfgRecharge } from "config/CfgRecharge";
import { _CreateCfgRoundPass } from "config/CfgRoundPass";
import { _CreateCfgSceneBG } from "config/CfgSceneBG";
import { _CreateCfgSensitivewords } from "config/CfgSensitivewords";
import { _CreateCfgSevenDaysPack } from "config/CfgSevenDaysPack";
import { _CreateCfgSevenday } from "config/CfgSevenday";
import { _CreateCfgShop } from "config/CfgShop";
import { _CreateCfgShopBox } from "config/CfgShopBox";
import { _CreateCfgShopGift } from "config/CfgShopGift";
import { _CreateCfgSupplyCard } from "config/CfgSupplyCard";
import { _CreateCfgDailyMission } from "config/CfgTask";
import { _CreateCfgTemplePass } from "config/CfgTemplePass";
import { _CreateCfgTerritory } from "config/CfgTerritory";
import { _CreateCfgTimeLimitedRecharge } from "config/CfgTimeLimitedRecharge";
import { _CreateCfgWordDes } from "config/CfgWordDes";
import { _CreateCfgZombieRushPass } from "config/CfgZombieRushPass";
import { LogError } from "core/Debugger";
import { Singleton } from "core/Singleton";
import { ReportManager, ReportType } from "../proload/ReportManager";
import { ResManager } from "./ResManager";
import { _CreateCfgArenaPass } from "config/CfgArenaPass";
import { _CreateCfgFishPass } from "config/CfgFishPass";
import { _CreateCfgBarrierAtt } from "config/CfgBarrierAtt";
import { _CreateCfgAgentAdapt } from "config/CfgAgentAdapt";
import { _CreateCfgRaffle } from "config/CfgRaffle";
import { _CreateCfgArenaDailyGift } from "config/CfgArenaDailyGift";
export class CfgManager extends Singleton {
    // private _data  : {[index:string] : CfgDataBase ;};
    private needLoadCount: number = 0;
    private loadedCount: number = 0;

    private cfgCacheMap: Map<string, any>;

    // private 
    public Init() {
        this.cfgCacheMap = new Map();
        this.createCfg(_CreateCfgOther);
        this.createCfg(_CreateCfgFishItem);
        this.createCfg(_CreateCfgSensitivewords);
        this.createCfg(_CreateCfgDebris);
        this.createCfg(_CreateCfgAd);
        this.createCfg(_CreateCfgPlayerLevel);
        this.createCfg(_CreateCfgGuideData);
        this.createCfg(_CreateCfgDailyMission);
        this.createCfg(_CreateCfgDailyChallenge);
        this.createCfg(_CreateCfgBarrierInfo);
        this.createCfg(_CreateCfgRecharge);
        this.createCfg(_CreateCfgShop);
        this.createCfg(_CreateCfgShopBox);
        this.createCfg(_CreateCfgDailyBuy);
        this.createCfg(_CreateCfgSupplyCard);
        this.createCfg(_CreateCfgHero);
        this.createCfg(_CreateCfgEntry);
        this.createCfg(_CreateCfgMonster);
        this.createCfg(_CreateCfgPasscheck);
        this.createCfg(_CreateCfgPiggy);
        this.createCfg(_CreateCfgSceneBG);
        this.createCfg(_CreateCfgRapidReturns);
        this.createCfg(_CreateCfgGrowPass);
        this.createCfg(_CreateCfgTerritory);
        this.createCfg(_CreateCfgFish);
        this.createCfg(_CreateCfgSevenday);
        this.createCfg(_CreateCfgCeremonyAct);
        this.createCfg(_CreateCfgCeremonyGift);
        this.createCfg(_CreateCfgInviteFriend);
        this.createCfg(_CreateCfgMonsterCtrl);
        this.createCfg(_CreateCfgGift);
        this.createCfg(_CreateCfgGrowPack);
        this.createCfg(_CreateCfgBattleGuide);
        this.createCfg(_CreateCfgBarrierPack);
        this.createCfg(_CreateCfgAgentAdapt);
        this.createCfg(_CreateCfgFunOpen);
        this.createCfg(_CreateCfgNewPack);
        this.createCfg(_CreateCfgWordDes);
        this.createCfg(_CreateCfgBattleCoinRate);
        this.createCfg(_CreateCfgFirstCharge);
        this.createCfg(_CreateCfgRoundPass);
        this.createCfg(_CreateCfgEene);
        this.createCfg(_CreateCfgDnaSys);
        this.createCfg(_CreateCfgShopGift);
        this.createCfg(_CreateCfgPrivilege);
        this.createCfg(_CreateCfgLostTemple);
        this.createCfg(_CreateCfgTemplePass);
        this.createCfg(_CreateCfgRandactivityopen);
        this.createCfg(_CreateCfgGetWay);
        this.createCfg(_CreateCfgHouZai);
        this.createCfg(_CreateCfgBackyard);
        this.createCfg(_CreateCfgDnaTask);
        this.createCfg(_CreateCfgTimeLimitedRecharge);
        this.createCfg(_CreateCfgSevenDaysPack);
        this.createCfg(_CreateCfgGeneGift);
        this.createCfg(_CreateCfgZombieRushPass);
        this.createCfg(_CreateCfgMining);
        this.createCfg(_CreateCfgActivityMain);
        this.createCfg(_CreateCfgCavePass);
        this.createCfg(_CreateCfgHeroIntegral);
        this.createCfg(_CreateCfgGeneOrientation);
        this.createCfg(_CreateCfgInstitute);
        this.createCfg(_CreateCfgHeroTrial);
        this.createCfg(_CreateCfgRandomDna);
        this.createCfg(_CreateCfgPartsGift);
        this.createCfg(_CreateCfgArena);
        this.createCfg(_CreateCfgDefensePassCheck);
        this.createCfg(_CreateCfgCultivate);
        this.createCfg(_CreateCfgFarm);
        this.createCfg(_CreateCfgGameCircle);
        this.createCfg(_CreateCfgArenaPass);
        this.createCfg(_CreateCfgFishPass);
        this.createCfg(_CreateCfgBarrierAtt);
        this.createCfg(_CreateCfgRaffle);
        this.createCfg(_CreateCfgArenaDailyGift);
    }

    createCfg(func: (onCom: (suc: boolean) => void) => void) {
        ++this.needLoadCount
        func((suc) => {
            if (suc) { ++this.loadedCount; }
            if (this.loadedCount == this.needLoadCount) {
                ReportManager.Inst().sendPoint(ReportType.endLoadConfig);
                this.cb && this.cb() && (this.cb = undefined);
            }
        })
    }
    private cb: Function;
    public IsLoadComplete(cb?: Function) {
        if (this.loadedCount != this.needLoadCount)
            this.cb = cb;
        return this.loadedCount == this.needLoadCount;
    }
    public static JsonGetKeyCfg(jsonAss: JsonAsset, table_name: string) {
        return (<{ [key: string]: any }>jsonAss.json)[table_name];
    }

    //根据路径获取配置
    public GetCfg<T>(resPath: string, ballback: (v: T) => void) {
        if (this.cfgCacheMap.has(resPath)) {
            let cfg = this.cfgCacheMap.get(resPath);
            ballback(cfg);
            return;
        }
        ResManager.Inst().Load<JsonAsset>(resPath, (err, jsonAss) => {
            if (err != null) {
                LogError("根据路径获取配置错误" + err);
                return;
            }
            let cfg = <T>jsonAss.json;
            this.PutCfg(resPath, cfg);
            ballback(cfg);
        })
    }
    PutCfg(resPath: string, cfg: any) {
        this.cfgCacheMap.set(resPath, cfg);
    }
}


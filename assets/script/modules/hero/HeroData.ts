import { Language } from 'modules/common/Language';
import { CfgHero, CfgHeroAtt, CfgHeroBattle, CfgHeroJiHuo } from "config/CfgHero";
import { LogError } from "core/Debugger";
import { CreateSMD, smartdata } from "data/SmartData";
import { ViewManager } from "manager/ViewManager";
import { CfgCoinData } from 'modules/Battle/BattleConfig';
import { IBattleHeroInfo, JiYinAttriBuff } from "modules/Battle/BattleData";
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { BagData } from 'modules/bag/BagData';
import { Item } from 'modules/bag/ItemData';
import { Mod } from 'modules/common/ModuleDefine';
import { MainFBData } from 'modules/main_fb/MainFBData';
import { RoleData } from "modules/role/RoleData";
import { ShopData } from "modules/shop/ShopData";
import { DataBase } from "../../data/DataBase";
import { CfgDnaSys } from './../../config/CfgDnaSys';
import { CfgHeroIntegral } from './../../config/CfgHeroIntegral';
import { GeneLevelUpView } from "./GeneLevelUpView";
import { HeroActivateView } from "./HeroActivateView";
import { HeroLevelUpView } from './HeroLevelUpView';
import { Hero_Preview_Type } from './HeroLvPreviewView';
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";

export enum HeroLock {
    unlock = -2,//已解锁
    latching = -1,//未解锁
}

// 英雄属性类型
export enum HeroRaceType {
    WuLi = 1,   //物理
    Shui = 2,   //水
    An = 3,     //暗
    Du = 4,     //毒
    Huo = 5,    //火
    Tu = 6,     //土
    Gunag = 7,  //光
}

class HeroResultFlush {
    @smartdata
    selectHeroFlush: number = 0;//界面选择
    @smartdata
    heroInfoFlush: boolean = false;
    @smartdata
    heroBattle: boolean = false;;//上阵效果

    @smartdata
    geneInfoFlush: boolean = false;

    @smartdata
    todayGainFlush: boolean = false;
}

class HeroResultData {
    heroInfo: PB_SCHeroInfo
    geneInfo: PB_SCGeneInfo;
    todayGainInfo: PB_SCTodayGainInfo;
}

export class HeroData extends DataBase {
    public ResultData: HeroResultFlush;
    public InfoData: HeroResultData;
    // private heroInfo: PB_SCHeroInfo;
    // private geneInfo: PB_SCGeneInfo;
    private selectHero: number = null;
    private BattleHero: number = 0;
    private _NewGene: boolean = false;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        let self = this;
        self.ResultData = CreateSMD(HeroResultFlush);
        this.InfoData = new HeroResultData();
    }

    public setHeroInfo(data: PB_SCHeroInfo) {
        if (data.sendType == 0) {
            this.InfoData.heroInfo = data;
        } else {
            let isNew = true;
            let isup = false
            for (let i = 0; i < this.HeroList.length; i++) {
                if (this.HeroList[i].heroId == data.heroList[0].heroId) {
                    if (this.HeroList[i].heroLevel < data.heroList[0].heroLevel) {
                        isup = true;
                    }
                    this.InfoData.heroInfo.heroList[i] = data.heroList[0];
                    isNew = false;
                }
            }
            if (isNew) {//新获得英雄
                this.InfoData.heroInfo.heroList.push(data.heroList[0]);
                this.HeroActivate(data.heroList[0].heroId);
            } else if (isup) {//英雄升级
                this.HeroLevelUp(data.heroList[0].heroId);
            }
        }
        this.ResultData.heroInfoFlush = !this.ResultData.heroInfoFlush;
    }

    public setHeroGeneInfoResult(data: PB_SCGeneInfo) {
        this._NewGene = false
        if (data.sendType == 0) {
            this.InfoData.geneInfo = data;
        } else if (data.sendType == 1) {
            this.InfoData.geneInfo.geneList.push(data.geneList[0]);
            this._NewGene = true
        } else if (data.sendType == 2) {
            for (let i = 0; i < this.GeneList.length; i++) {
                if (this.GeneList[i].geneIndex == data.geneList[0].geneIndex) {
                    if (this.InfoData.geneInfo.geneList[i].geneId != data.geneList[0].geneId) {
                        this.GeneLevelUp(this.InfoData.geneInfo.geneList[i], data.geneList[0]);
                    }
                    this.InfoData.geneInfo.geneList[i] = data.geneList[0];
                    break;
                }
            }
        } else if (data.sendType == 3) {
            for (let i = 0; i < this.GeneList.length; i++) {
                if (this.GeneList[i].geneIndex == data.geneList[0].geneIndex) {
                    this.InfoData.geneInfo.geneList.splice(i, 1)
                    break;
                }
            }
        }
        this.ResultData.geneInfoFlush = !this.ResultData.geneInfoFlush;
    }

    public SetTodayGainInfo(protocol: PB_SCTodayGainInfo) {
        this.InfoData.todayGainInfo = protocol
        this.ResultData.todayGainFlush = !this.ResultData.todayGainFlush
    }

    public get IsNewGene() {
        return this._NewGene;
    }

    public get HeroInfo() {
        return this.InfoData.heroInfo;
    }
    public get HeroList() {
        return this.HeroInfo ? this.HeroInfo.heroList : [];
    }

    public get GeneInfo() {
        return this.InfoData.geneInfo;
    }

    public get GeneList() {
        return this.GeneInfo ? this.GeneInfo.geneList : [];
    }

    public get TodayGainInfo() {
        return this.InfoData.todayGainInfo
    }

    public set selectHeroId(id: number) {
        if (this.selectHero != null && this.selectHero != id) {
            this.ResultData.selectHeroFlush = this.selectHero;
        }
        this.selectHero = id;
    }

    public get SelectHeroId() {
        return this.ResultData.selectHeroFlush;
    }

    public set heroBattleid(id: number) {
        if (id != 0 && this.BattleHero != id) {
            this.ResultData.heroBattle = !this.ResultData.heroBattle
        }
        this.BattleHero = id;
    }

    public get heroBattleid() {
        return this.BattleHero;
    }

    //英雄信息
    public GetHeroInfo(heroId: number): IPB_HeroNode {
        if (this.HeroList.length == 0) {
            return null;
        }
        for (let i = 0; i < this.HeroList.length; i++) {
            if (heroId == this.HeroList[i].heroId) {
                return this.HeroList[i];
            }
        }
        return null;
    }

    //英雄列表
    public GetHeroListData(): number[] {
        let battle = this.GetInBattleHeros();
        let unlock = [];//解锁
        let latching = [];//未解锁
        let showHeroIdArr = [1,2,3,4,5,6,7,8,10,11,12,13];
        let cfg = CfgHero.hero_jihuo.filter(v=> showHeroIdArr.includes(v.hero_id));
        let hero_datas: any[] = [];
        for (let i = 0; i < cfg.length; i++) {
            let heroid = cfg[i].hero_id;
            if (battle.indexOf(heroid) != -1) continue;
            if (this.IsHeroLock(heroid)) {
                unlock.push(heroid)
            } else {
                latching.push(heroid)
            }
        }
        if (unlock.length > 0) {
            hero_datas.push(HeroLock.unlock)
            unlock.sort((a, b) => {
                let LvA = this.GetHeroLevel(a);
                let LvB = this.GetHeroLevel(b);
                let confA = this.GetHeroBaseCfg(a)
                let confB = this.GetHeroBaseCfg(b)
                if (LvA != LvB) {
                    return LvB - LvA
                } else if (confA.hero_color != confB.hero_color) {
                    return confB.hero_color - confA.hero_color;
                }
            })
            hero_datas = hero_datas.concat([unlock])
        }
        if (latching.length > 0) {
            hero_datas.push(HeroLock.latching)
            latching.sort((a, b) => {
                let confA = this.GetHeroBaseCfg(a)
                let confB = this.GetHeroBaseCfg(b)
                if (confA.unlock_type != confB.unlock_type) {
                    return confA.unlock_type - confB.unlock_type;
                } else if (confA.unlock != confB.unlock) {
                    return confA.unlock - confB.unlock;
                }
            })
            hero_datas = hero_datas.concat([latching])
        }
        return hero_datas;
    }

    GetHeroIntegral() {
        let list = this.HeroList;
        let intergra = 0;
        for (let i = 0; i < list.length; i++) {
            let baseCfg = this.GetHeroBaseCfg(list[i].heroId);
            let intergraCfg = this.GetHeroIntegralLevelCfg(baseCfg.hero_color, list[i].heroLevel);
            intergra += intergraCfg.hero_integral;
        }
        return intergra
    }

    GetHeroIntegralCfg(color: number) {
        return CfgHeroIntegral.hero_pool_integral.filter(cfg => {
            return cfg.color == color;
        })
    }

    GetHeroIntegralLevelCfg(color: number, level: number) {
        return CfgHeroIntegral.hero_pool_integral.find(cfg => {
            return cfg.color == color && cfg.level == level;
        })
    }

    GetAllHeroDamage() {
        let isOpen = this.GetDamageOpen();
        if (!isOpen) {
            return 0
        }
        const list = this.HeroList;
        let damage = 0;
        list.forEach(info => {
            const cfg = this.GetHeroLevelCfg(info.heroId, info.heroLevel);
            if (cfg) {
                damage += cfg.damage;
            }
        })
        return damage
    }

    IsGeneBagMax(isTips: boolean = true) {
        let ismax = this.GeneList.length >= 290
        if (ismax && isTips) {
            PublicPopupCtrl.Inst().Center(Language.Hero.GeneBagMax)
        }
        return ismax
    }

    //英雄升级
    private HeroLevelUp(heroId: number) {
        ViewManager.Inst().OpenView(HeroLevelUpView, new HeroDataModel(heroId));
    }

    //新获得英雄
    private HeroActivate(heroId: number) {
        ViewManager.Inst().OpenView(HeroActivateView, new HeroDataModel(heroId));
    }

    //基因升级
    private GeneLevelUp(oldInfo: IPB_GeneNode, info: IPB_GeneNode) {
        ViewManager.Inst().OpenView(GeneLevelUpView, [oldInfo, info]);
    }

    //英雄碎片
    public GetHeroDebris(itemId: number): number {
        return BagData.Inst().GetItemNum(itemId);
    }

    //对应品质的英雄碎片
    public GetHeroColorDebris(color: number) {
        let data = [];
        for (let k in CfgHero.hero_jihuo) {
            let cfg = CfgHero.hero_jihuo[k];
            if (cfg.hero_color == color) {
                let isLock = this.IsHeroLock(cfg.hero_id);
                data.push({ item: cfg.jihuo[0], isLock: isLock })
            }
        }
        return data
    }

    //对应品质的英雄解锁
    public GetHeroColorDebrisLock(color: number) {
        let num = 0
        for (let k in CfgHero.hero_jihuo) {
            let cfg = CfgHero.hero_jihuo[k];
            if (cfg.hero_color == color) {
                let isLock = this.IsHeroLock(cfg.hero_id);
                if (isLock) {
                    num++;
                }
            }
        }
        return num
    }

    //英雄升级碎片消耗
    public GetDebrisConsume(heroId: number) {
        let heroInfo = this.GetHeroInfo(heroId);
        let lv = heroInfo ? heroInfo.heroLevel : 0;
        if (lv == 0) {
            return this.GetHeroBaseCfg(heroId).jihuo;
        } else {
            return this.GetHeroLevelCfg(heroId, lv).upgrade2;
        }
    }

    //英雄是否解锁
    public IsHeroLock(heroId: number): boolean {
        let data = this.GetHeroBaseCfg(heroId);
        if (!data) return
        let lv = this.GetHeroLevel(heroId);
        let debrisNum = this.GetHeroDebris(data.jihuo[0].item_id);
        if (debrisNum > 0 || lv >= 1) {
            return true;
        }
        if (data.unlock_type == 1) {
            return false;
        } else {
            let barrier = RoleData.Inst().InfoMainSceneLevel;
            let round = RoleData.Inst().InfoMainSceneRound;
            let co = MainFBData.Inst().CfgBarrierInfoMainInfo(barrier)
            if (barrier < data.unlock) {
                return false
            } else if (barrier == data.unlock) {
                if (co && round < co.round_max) {
                    return false
                }
            }
            return true
        }
    }

    //英雄是否满级
    public IsHeroLevelMax(heroId: number): boolean {
        let heroInfo = this.GetHeroInfo(heroId);
        let cfg = this.GetHeroBaseCfg(heroId);
        let lv = heroInfo ? heroInfo.heroLevel : 0;
        return lv >= cfg.level_max;
    }

    //英雄词条
    public GetHeroSkill(hero_id: number, hero_level: number): HeroSkillData[] {
        let baseData = this.GetHeroBaseCfg(hero_id);
        let skillAll: string[] = [];
        let data: HeroSkillData[] = [];
        if (!baseData) return null
        for (let i = 1; i <= baseData.level_max; i++) {
            let lvData = this.GetHeroLevelCfg(hero_id, i);
            if (!lvData) {
                continue;
            }
            let str = lvData.skill + "";
            let skill = str.split("|");
            for (let j = 0; j < skill.length; j++) {
                if (skillAll.indexOf(skill[j]) == -1) {
                    skillAll.push(skill[j]);
                    data.push(new HeroSkillData(hero_id, +skill[j], i, hero_level));
                }
            }
        }
        return data;
    }

    //通过英雄碎片id获取英雄
    public GetDebrisHeroCfg(itemId: number) {
        return CfgHero.hero_jihuo.find(cfg => {
            return cfg.jihuo[0].item_id == itemId;
        })
    }

    //通过英雄碎片id获取英雄id
    public GetDebrisHeroId(itemId: number) {
        let cfg = this.GetDebrisHeroCfg(itemId);
        return cfg ? cfg.hero_id : 0
    }


    public IsHeroLevel(lv: number) {
        for (let i = 0; i < this.HeroList.length; i++) {
            if (this.HeroList[i].heroLevel >= lv) {
                return true
            }
        }
        return false;
    }

    //通过英雄碎片id获取英雄图片
    public GetDebrisHeroIcon(itemId: number, Level?: number) {
        let id = this.GetDebrisHeroId(itemId);
        let lv = Level ?? (this.GetHeroLevel(id) || 1);
        let co = this.GetHeroLevelCfg(id, lv)
        return co ? co.res_id : "0";
    }

    GetAllRed() {
        let cfg = CfgHero.hero_jihuo;
        for (let i = 0; i < cfg.length; i++) {
            let debris = this.GetHeroDebris(cfg[i].jihuo[0].item_id);
            let consume = this.GetDebrisConsume(cfg[i].hero_id);
            if (debris >= consume[0].num && !this.IsHeroLevelMax(cfg[i].hero_id)) {
                return 1
            }
        }
        return 0;
    }

    GetPutOnGeneIndex() {
        let arr: number[] = []
        for (let i = 0; i < this.HeroList.length; i++) {
            let geneId = this.HeroList[i] ? this.HeroList[i].geneId : []
            arr = arr.concat(geneId);
        }
        // let geneIdArr = []
        // for (let j = 0; j < arr.length; j++) {
        //     if (geneIdArr.indexOf(arr[j]) == -1) {
        //         geneIdArr.push(arr[j]);
        //     }
        // }
        return arr
    }

    //所有基因
    public GetGeneBagList(index: number) {
        let geneList = this.GeneList;
        let PutOnGeneArr = this.GetPutOnGeneIndex()
        let list = []
        for (let i = 0; i < geneList.length; i++) {
            if (PutOnGeneArr.indexOf(geneList[i].geneIndex) != -1) continue;
            let cfg = this.GetGeneCfg(geneList[i].geneId);
            if (!cfg) {
                continue
            };
            if (cfg.dna_type != index) continue;
            list.push(geneList[i]);
        }
        return list
    }

    GEtGeneInfo(index: number) {
        return this.GeneList.find(gene => {
            return gene.geneIndex == index
        })
    }

    GetGeneInfoIndex(index: number) {
        return this.GeneList[index];
    }

    GetGeneNum() {
        return this.GeneList.length;
    }

    GetGeneSuitSkill(heroId: number) {
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.ActivityCombat.View);
        if (!isOpen.is_open) {
            return null
        }
        let num = 0;
        let info = this.GetHeroInfo(heroId)
        let suit = this.GetGeneSuitCfg(heroId);
        let geneArr = (info && info.geneId) || []
        for (let i = 0; i < geneArr.length; i++) {
            if (!info.geneId[i]) continue;
            let data = this.GEtGeneInfo(info.geneId[i]);
            let gene = this.GetGeneCfg(data.geneId)
            if (gene.hero_id == heroId) {
                num++;
            }
        }
        if (num == 0) return null
        let skill = [];
        if (num >= 2) {
            skill.push(suit.skill_2)
        }
        if (num >= 4) {
            skill.push(suit.skill_4)
        }
        if (num >= 5) {
            skill.push(suit.skill_5)
        }
        return skill;
    }

    GetGeneSuitCfg(id: number) {
        return CfgDnaSys.dna_skill.find(cfg => {
            return cfg.dna_id == id;
        })
    }

    GetGeneCfg(id: number) {
        return CfgDnaSys.dna_all.find(cfg => {
            return cfg.id == id;
        })
    }

    //JiYinAttriBuff
    GetGeneAttriBuff(id: number) {
        let info = this.GetHeroInfo(id);
        let geneArr = (info && info.geneId) || []
        let num = [0, 0, 0, 0, 0];
        for (let i = 0; i < geneArr.length; i++) {
            if (geneArr[i] == 0) continue;
            let data = this.GEtGeneInfo(geneArr[i]);
            let item = Item.GetConfig(data.geneId);
            let att = item.fixed_att.split("|");
            num[data.randAttr - 1] += (att[data.randAttr - 1] * 1)
            num[item.unfixed_type - 1] += item.unfixed_att
        }
        return <JiYinAttriBuff>{
            harmValue: num[0],
            attackSpeedScale: num[1],
            harmScale: num[2],
            baoji: num[3],
            baojiScale: num[4],
        }
    }

    //通过物品id列表获取基因属性
    GetGeneAttriBuffByItem(itemidList: number[]) {
        let num = [0, 0, 0, 0, 0];
        for (let i = 0; i < itemidList.length; i++) {
            if (itemidList[i] == 0) continue;
            let item = Item.GetConfig(itemidList[i]);
            let att = item.fixed_att.split("|");
            num[i] += (att[i] * 1)
            num[item.unfixed_type - 1] += item.unfixed_att
        }
        return <JiYinAttriBuff>{
            harmValue: num[0],
            attackSpeedScale: num[1],
            harmScale: num[2],
            baoji: num[3],
            baojiScale: num[4],
        }
    }


    GetSellNumCfg(id: number) {
        let item = Item.GetConfig(id);
        return CfgDnaSys.dna_sell.find(cfg => {
            return cfg.color == item.color && cfg.level == item.item_level;
        }).sell_num;
    }

    GetGeneOtherSellIdCfg() {
        return CfgDnaSys.other[0].dna_sell_id
    }

    GetGeneUpRed(geneId: number) {
        let cfg = this.GetGeneCfg(geneId);
        let isRed = true;
        if (!cfg) return 0
        if (!cfg.up.length) return 0;
        for (let i = 0; i < cfg.up.length; i++) {
            let num = BagData.Inst().GetItemNum(cfg.up[i].item_id);
            if (cfg.up[i].num > num) {
                isRed = false
                break;
            }
        }
        if (isRed) {
            return 1
        }
        return 0
    }

    GetGeneTypeRed(type: number) {
        let list = this.GetGeneBagList(type);
        for (let i = 0; i < list.length; i++) {
            let red = this.GetGeneUpRed(list[i].geneId);
            if (red == 1) {
                return 1
            }
        }
        return 0
    }

    GetGeneHeroAllRed(id: number) {
        let info = this.GetHeroInfo(id);
        let geneArr = (info && info.geneId) || [];
        for (let i = 0; i < geneArr.length; i++) {
            if (geneArr[i] == 0) {
                let list = this.GetGeneBagList(i + 1)
                if (list.length > 0) {
                    return 1
                }
            } else if (geneArr[i] != 0) {
                let data = HeroData.Inst().GEtGeneInfo(geneArr[i]);
                let red = this.GetGeneUpRed(data.geneId)
                if (red > 0) {
                    return 1
                }
            }
        }
        return 0
    }

    GetGeneCompoundRed() {
        let cfg = ShopData.Inst().GetShopGoldShowList(1)

        let num1 = BagData.Inst().GetItemNum(cfg[1].exchange_item_id);
        let num2 = BagData.Inst().GetItemNum(cfg[0].exchange_item_id);

        let red1 = cfg[1].exchange_item_num > num1 ? 0 : 1
        let red2 = cfg[0].exchange_item_num > num2 ? 0 : 1
        return red1 + red2
    }

    GetHeroPreviewList(type: number, heroid: number) {
        if (Hero_Preview_Type.att == type) {
            return this.GetHeroAttrCfg(heroid)
        } else if (Hero_Preview_Type.integral == type) {
            let color = this.GetHeroBaseCfg(heroid).hero_color
            return this.GetHeroIntegralCfg(color)
        }
    }

    GetHeroAttrCfg(id: number) {
        return CfgHero.hero_att.filter(cfg => {
            return cfg.hero_id == id;
        })
    }

    GetHeroBattleInfoCfg(id: number, att: number) {
        let cfg = CfgHero.battle_info.filter(cfg => {
            return cfg.hero_id == id;
        })
        let data = [];
        for (let i = 0; i < cfg.length; i++) {
            data.push({
                stage: cfg[i].stage,
                resId: cfg[i].res_id,
                harm: Math.floor(att * cfg[i].coefficients),
                mulriple: (cfg[i - 1] && cfg[i - 1].coefficients) ? +(cfg[i].coefficients / cfg[i - 1].coefficients).toFixed(2) : 0
            })
        }
        return data
    }

    ///////////////////////////////////////
    //获取上阵的英雄
    GetInBattleHeros(): number[] {
        return RoleData.Inst().InfoRoleFightList ?? [];
    }

    //获取上阵的英雄信息
    GetInBattleHeroInfos(): IBattleHeroInfo[] {
        let heros = RoleData.Inst().InfoRoleFightList;
        let infos: IBattleHeroInfo[] = [];
        heros.forEach(heroid => {
            let info = this.GetHeroInfo(heroid);
            if (info) {
                infos.push(<IBattleHeroInfo>info);
            } else {
                infos.push(<IBattleHeroInfo>{ heroId: heroid, heroLevel: 1 });
            }
        })
        return infos;
    }

    //获取英雄等级
    GetHeroLevel(id: number): number {
        let info = this.GetHeroInfo(id)
        return info ? info.heroLevel : 0;
    }

    //获取英雄基本配置
    GetHeroBaseCfg(id: number): CfgHeroJiHuo {
        if (id == 0) {
            return null;
        }
        return CfgHero.hero_jihuo.find(cfg => {
            return cfg.hero_id == id;
        });
    }

    //获取英雄等级配置
    GetHeroLevelCfg(id: number, level: number): CfgHeroAtt {
        for (let cfg of CfgHero.hero_att) {
            if (cfg.hero_id == id && cfg.hero_level == level) {
                return cfg;
            }
        }
        LogError("获取英雄等级配置为空，检查下", id, level)
        return null;
    }

    //获取英雄战斗配置
    GetHeroBattleCfg(id: number, stage: number): CfgHeroBattle {
        if (id == 0) {
            return CfgCoinData[stage];
        }
        for (let cfg of CfgHero.battle_info) {
            if (cfg.hero_id == id && cfg.stage == stage) {
                return cfg;
            }
        }
    }

    GetGeneSuitNum(id: number) {
        let info = this.GetHeroInfo(id);
        let geneArr = (info && info.geneId) || []
        let num = 0;
        for (let i = 0; i < geneArr.length; i++) {
            if (!info.geneId[i]) continue;
            let data = this.GEtGeneInfo(info.geneId[i]);
            let gene = this.GetGeneCfg(data.geneId)
            if (gene.hero_id == id) {
                num++;
            }
        }
        return num;
    }
    //////////////////////////////////////////

    GetHeroListByRace(hero_race: number) {
        return CfgHero.hero_jihuo.filter(cfg => cfg.hero_race == hero_race)
    }

    GetTodayGainInfoBySeq(seq: number) {
        return CfgHero.today_gain.find(cfg => cfg.seq == seq)
    }

    GetDamageOpen() {
        let cfg = CfgHero.attr_open[0];
        let time = RoleData.Inst().InfoRoleInfoCreateTime;
        if (time < cfg.time_stamp) {
            return true
        }
        let lv = RoleData.Inst().InfoRoleLevel;
        let isBarrier = FunOpen.Inst().IsBarrierPass(cfg.open_barrier);
        if (lv < cfg.open_level) {
            return false
        }
        if (!isBarrier) {
            return false
        }
        return true
    }

}

//英雄数据模型
export class HeroDataModel {
    private _data: CfgHeroJiHuo;
    private _skill: HeroSkillData[];
    private _hero_id: number;
    private _hero_level: number;
    private _lend_show: boolean
    private _Name_show: boolean
    get hero_id(): number {
        return this._hero_id;
    }
    get level(): number {
        return this._hero_level || HeroData.Inst().GetHeroLevel(this._hero_id);
    }
    get data(): CfgHeroJiHuo {
        return this._data;
    }
    get skill(): HeroSkillData[] {
        return this._skill;
    }
    get lend_show(): boolean {
        return this._lend_show;
    }
    get Name_show(): boolean {
        return this._Name_show;
    }

    constructor(hero_id: number, hero_level?: number, lend_show = false, Name_show = false) {
        this._hero_id = hero_id;
        this._hero_level = hero_level
        this._data = HeroData.Inst().GetHeroBaseCfg(this._hero_id);
        this._skill = HeroData.Inst().GetHeroSkill(this._hero_id, hero_level);
        this._lend_show = lend_show
        this._Name_show = Name_show

        if (lend_show && !this._hero_level) {
            this._hero_level = this._data.jihuo_level
        }
    }

    GetLevelCfg(): CfgHeroAtt {
        let level = this.level;
        if (level == null || level < 1) {
            return HeroData.Inst().GetHeroLevelCfg(this._hero_id, 1);
        }
        return HeroData.Inst().GetHeroLevelCfg(this._hero_id, level);
    }

    //英雄词条
    GetHeroLevelSkill(level: number) {
        for (let i = 0; i < this.skill.length; i++) {
            if (this.skill[i].skillLv == level) {
                return this.skill[i];
            }
        }
        return null;
    }

    //英雄碎片
    DebrisNum() {
        return BagData.Inst().GetItemNum(this._data.jihuo[0].item_id);
    }

    //是否解锁
    IsActive() {
        return this.level > 0
    }

    ToBattleInfo(): IBattleHeroInfo {
        return <IBattleHeroInfo>{ heroId: this.hero_id, heroLevel: this.level };
    }
}

export class HeroSkillData {
    heroid: number;
    skillid: number;
    skillLv: number;//技能解锁等级
    heroLv: number;//技能解锁等级
    constructor(heroid: any, skillid: number, skillLv: number, heroLv?: number) {
        this.heroid = heroid;
        this.skillid = skillid;
        this.skillLv = skillLv;
        this.heroLv = heroLv;
    }
}

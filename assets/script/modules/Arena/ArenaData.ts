import { CreateSMD, SMDTriggerNotify, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgSkillData } from "config/CfgEntry";
import { CfgArena, CfgArenaRank, CfgArenaRobot, CfgArenaShop, CfgArenaSkin, CfgArenaTimestamp } from "config/CfgArena";
import { BattleData } from "modules/Battle/BattleData";
import { InstituteData } from "modules/Institute/InstituteCtrl";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Item } from "modules/bag/ItemData";
import { ARENA_MAP_COL, ARENA_MAP_ROW, BattleObjTag } from "modules/Battle/BattleConfig";
import { BattleHelper } from "modules/Battle/BattleHelper";
import { HeroData } from "modules/hero/HeroData";
import { ArenaRankChangParam } from "./ArenaRankChange";
import { RoleData } from "modules/role/RoleData";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { Mod } from "modules/common/ModuleDefine";
import { ArenaPassData } from "modules/ArenaPass/ArenaPassCtrl";
import { sys } from "cc";
import { Prefskey } from "modules/common/PrefsKey";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { Language } from "modules/common/Language";
import { CfgArenaDailyGift } from "config/CfgArenaDailyGift";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";

//上阵的英雄
export interface IArenaReadHeroInFightItemData{
    ij:number,
    info:IPB_HeroNode,
}

class ArenaSMD{
    @smartdata
    mainInfo:PB_SCArenaInfo;
    @smartdata
    shopInfo:PB_SCArenaShopInfo;
    @smartdata
    matchInfo:PB_SCArenaTargetInfo;
    @smartdata
    reportInfo:PB_SCArenaReportInfo;
    @smartdata
    skinInfo:PB_SCArenaMapInfo;
    @smartdata
    buyInfo:PB_SCArenaBuyInfo;
    @smartdata
    dailyGift:PB_SCRaArenaDailyGiftInfo;
    @smartdata
    flushData:boolean = false;
    @smartdata
    selectSkillList:Set<CfgSkillData> = new Set<CfgSkillData>();
    @smartdata
    selectSkill:CfgSkillData;
}

export class ArenaData extends DataBase {  

    smdData:ArenaSMD;
    rankChange:ArenaRankChangParam;

    set mainInfo(v:PB_SCArenaInfo){
        this.smdData.mainInfo = v;
        this._heroLength = null;
    }
    get mainInfo():PB_SCArenaInfo{
        return this.smdData.mainInfo;
    }

    set shopInfo(v:PB_SCArenaShopInfo){
        this.smdData.shopInfo = v;
    }
    get shopInfo():PB_SCArenaShopInfo{
        return this.smdData.shopInfo;
    }

    // 匹配信息
    set matchInfo(v:PB_SCArenaTargetInfo){
        this.smdData.matchInfo = v;
        let list:number[] = [];
        if(v){
            this.smdData.matchInfo.heroList.forEach((info)=>{
                list.push(info.heroId);
            })
        }
        this._matchHeroidList = list;
    }
    get matchInfo():PB_SCArenaTargetInfo{
        return this.smdData.matchInfo;
    }

    private _matchHeroidList:number[] = [];
    get matchHeroidList():number[]{
        return this._matchHeroidList;
    }

    // 战报信息
    set reportInfo(v:PB_SCArenaReportInfo){
        this.smdData.reportInfo = v;
    }
    get reportInfo():PB_SCArenaReportInfo{
        return this.smdData.reportInfo;
    }

    // 皮肤信息
    set skinInfo(v:PB_SCArenaMapInfo){
        this.smdData.skinInfo = v;
    }
    get skinInfo():PB_SCArenaMapInfo{
        return this.smdData.skinInfo
    }

    get dailyGift():PB_SCRaArenaDailyGiftInfo{
        return this.smdData.dailyGift
    }


    get rank():number{
        if(this.mainInfo == null){
            return 1;
        }
        return this.mainInfo.rank;
    }
    get rankOrder():number{
        if(this.mainInfo == null){
            return 1;
        }
        return this.mainInfo.rankOrder;
    }

    get score():number{
        if(this.mainInfo == null){
            return 0;
        }
        return this.mainInfo.score;
    }

    get fightItemNum():number{
        if(this.mainInfo == null){
            return 0;
        }
        return this.mainInfo.fightItemNum;
    }

    get maxFightItemNum():number{
        return 10;
    }

    //使用的皮肤
    get skinSeq():number{
        if(this.mainInfo == null){
            return 0;
        }
        let skin = this.mainInfo.skinSeq ?? 0;
        return skin;
    }

    private _heroLength:number;
    get heroLength():number{
        if(this.mainInfo == null){
            return 0;
        }
        if(this.mainInfo.heroId == null){
            return 0;
        }
        if(this._heroLength == null){
            let num = 0;
            this.mainInfo.heroId.forEach(id=>{
                if(id > 0){
                    num++;
                }
            })
            this._heroLength = num;
        }
        return this._heroLength;
    }

    //购买次数
    public get buyCount():number{
        if(this.smdData.buyInfo == null){
            return 0;
        }
        return this.smdData.buyInfo.buyItemCount;
    }


    //记录试用英雄的等级
    freeHeroLevelMap = new Map<number, number>();

    constructor(){
        super();
        this.createSmartData();
        this.rankChange = new ArenaRankChangParam();
    }

    private createSmartData(){
        this.smdData = CreateSMD(ArenaSMD);
    }

    //获取段位配置
    GetRankCfg(rank:number, rank_order:number):CfgArenaRank{
        let cfg = CfgArena.rank;
        for(let v of cfg){
            if(v.rank == rank && v.rank_order == rank_order){
                return v;
            }
        }
        return cfg[0];
    }
    //当前段位配置
    GetCurRankCfg():CfgArenaRank{
        let cfg = this.GetRankCfg(this.rank, this.rankOrder);
        return cfg;
    }


    //是否能匹配
    IsCanMatch():number{
        if(this.mainInfo == null){
            return 0;
        }
        if(this.heroLength == 0){
            return -1;
        }
        if(this.fightItemNum < 1){
            return -2;
        }
        return 1;
    }

    //当前时间戳配置
    GetCurTimeCfg():CfgArenaTimestamp{
        let curTime = TimeCtrl.Inst().ServerTime;
        let cfg = CfgArena.time_stamp;
        for(let v of cfg){
            if(curTime < v.time_stamp){
                return v;
            }
        }
    }

    //获取试用英雄
    GetFreeHeroList():IPB_HeroNode[]{
        let timeCfg = this.GetCurTimeCfg();
        if(timeCfg == null){
            return [];
        }
        let cfg = CfgArena.free_hero[timeCfg.time_seq];
        if(cfg == null){
            return [];
        }
        this.freeHeroLevelMap = new Map<number, number>();
        let list:IPB_HeroNode[] = [];
        let heroIds = cfg.hero_id.toString().split("|");
        let heroLevels = cfg.hero_level.toString().split("|");
        heroIds.forEach((v,index)=>{
            let id = Number(v);
            let level = Number(heroLevels[index]);
            this.freeHeroLevelMap.set(id, level);
            let info = <IPB_HeroNode>{heroId:id, heroLevel:0};
            list.push(info);
        })
        return list;
    }

    //获取试用英雄的等级
    GetFreeHeroLevel(id:number){
        if(this.freeHeroLevelMap == null || this.freeHeroLevelMap.size == 0){
            this.GetFreeHeroList();
        }
        if(!this.freeHeroLevelMap.has(id)){
            return 1;
        }
        let level = this.freeHeroLevelMap.get(id);
        return level;
    }

    //heroid[] 和herolevel[] 转成pb_heronode[]
    ConvertToHeroNode(heroids:number[], heroLevel:number[], count?:number):IPB_HeroNode[]{
        let list:IPB_HeroNode[] = [];
        if(count == null){
            count = heroids.length;
        }
        for(let i = 0; i < heroids.length; i++){
            let id = heroids[i];
            if(id > 0){
                let level = heroLevel[i] ?? 1;
                let data = <IPB_HeroNode>{heroId: id, heroLevel: level};
                list.push(data);
            }
        }
        if(count && count < list.length){
            return list.slice(0,count);
        }
        return list;
    }

    ConvertToHeroNode2(infos:IPB_SCArenaHeroInfo[], count?:number):IPB_HeroNode[]{
        let list:IPB_HeroNode[] = [];
        if(count == null){
            count = infos.length;
        }
        for(let i = 0; i < infos.length; i++){
            let info = infos[i];
            let id = info.heroId;
            if(id > 0){
                let level = info.heroLevel
                let data = <IPB_HeroNode>{heroId: id, heroLevel: level};
                list.push(data);
            }
        }
        if(count && count < list.length){
            return list.slice(0,count);
        }
        return list;
    }

    GetSelfHeroNode(count?:number):IPB_HeroNode[]{
        if(this.mainInfo == null){
            return [];
        }
        if(this.heroLength == 0){
            return [];
        }
        return this.ConvertToHeroNode(this.mainInfo.heroId, this.mainInfo.heroLevel, count);
    }

    //通过战斗中的i,j拿到英雄信息
    GetBattleHeroInfo(i:number, j:number, tag:BattleObjTag):IPB_HeroNode{
        let ij = this.ConvertBattleIj(i,j);
        let id:number = 0;
        let level:number = 0;
        if(tag == BattleObjTag.Player){
            if(this.mainInfo != null){
                id = this.mainInfo.heroId[ij] ?? 0;
                level = this.mainInfo.heroLevel[ij] ?? 0; 
            }
        }else{
            if(this.matchInfo != null){
                let info = this.matchInfo.heroList[ij];
                if(info == null){
                    id = 0;
                    level = 0;
                }else{
                    id = info.heroId;
                    level = info.heroLevel;
                }  
            }
        }
        return <IPB_HeroNode>{heroId: id, heroLevel:level};
    }

    ConvertBattleIj(i:number, j:number):number{
        let maxRow = ARENA_MAP_ROW;
        i = maxRow - i - 1;
        let ij = BattleHelper.IJTonum2(i,j, ARENA_MAP_COL);
        return ij;
    }

    //获取竞技场的角色形象阶级
    GetHeroBattleStage(info: IPB_HeroNode): number {
        if(info.heroId == 0){
            return 0;
        }
        let levelCfg = CfgArena.change_level;
        let heroBaseCfg = HeroData.Inst().GetHeroBaseCfg(info.heroId);
        let level = info.heroLevel;
        if(level == 0){
            level = ArenaData.Inst().GetFreeHeroLevel(info.heroId);
        }
        for (let v of levelCfg) {
            if (heroBaseCfg.hero_color == v.color && level == v.level) {
                return v.stage;
            }
        }
        return 1;
    }


    //已上阵的英雄信息
    //已上阵的词条信息
    GetSkillList():number[]{
        if(this.mainInfo == null){
            return [];
        }
        return this.mainInfo.buffList;
    }

    //获取英雄等级
    GetBattleHeroLevel(heroid:number, tag:BattleObjTag):number{
        if(tag == BattleObjTag.Player){
            if(this.mainInfo == null){
                return 1;
            }
            for(let i = 0; i < this.mainInfo.heroId.length; i++){
                let _id = this.mainInfo.heroId[i];
                if(_id == heroid){
                    let level = this.mainInfo.heroLevel[i];
                    if(level == null){
                        return 1
                    }else if(level == 0){
                        level = this.GetFreeHeroLevel(heroid);
                        return level;
                    }
                    return level;
                }
            }
        }else{
            if(this.matchInfo == null){
                return 1;
            }
            for(let i = 0; i < this.matchInfo.heroList.length; i++){
                let info = this.matchInfo.heroList[i];
                if(info.heroId == heroid){
                    let level = info.heroLevel;
                    if(level == 0){
                        level = this.GetFreeHeroLevel(heroid);
                        return level;
                    }
                    return level;
                }
            }
        }
        return 1;
    }



    // private _heroBattleArray:IArenaReadHeroInFightItemData[]
    // SetHeroBattleArray(list:IArenaReadHeroInFightItemData[]){
    //     this._heroBattleArray = list;
    // }
    // GetHeroBattleArray(){
    //     return this._heroBattleArray;
    // }


    //根据英雄信息列表，获取可上阵竞技场的词条
    //词条来源有，正常公用词条、英雄词条、 基因词条、研究所词条
    GetFightSkillPool(heroList?:IPB_HeroNode[]):CfgSkillData[]{
        let list: CfgSkillData[] = [];
        //公用词条
        let pub_skill_ids:string[] = CfgArena.other[0].pub_skill_id.toString().split("|");
        pub_skill_ids.forEach(str_id=>{
            let skill_id = Number(str_id);
            let cfg = BattleData.Inst().GetSkillCfg(skill_id);
            list.push(cfg);
        })
        //研究所词条
        let institute_skill_ids:string[] = CfgArena.other[0].institute_skill_id.toString().split("|");
        institute_skill_ids.forEach(str_id=>{
            let skill_id = Number(str_id);
            let isActive = InstituteData.Inst().IsActiveSkillId(skill_id);
            if(isActive){
                let cfg = BattleData.Inst().GetSkillCfg(skill_id);
                list.push(cfg);
            }
        })

        //英雄 + 基因词条
        if(heroList && heroList.length > 0){
            let heroSkillList = BattleData.Inst().GetSkillDataByHeroInfos(heroList, true);
            list = list.concat(heroSkillList);
        }

        return list;
    }


    ////////////// 商店相关 ////////////
    
    //商品剩余次数
    GetShopItemBuyTimes(data:CfgArenaShop):number{
        if(this.shopInfo == null){
            return data.buy_num;
        }
        let times = this.shopInfo.buyCount[data.seq] ?? 0;
        return data.buy_num - times;
    }
    //商品购买状态，1可购买，0数量不足，-1次数不足
    GetShopItemState(data:CfgArenaShop):number{
        let times = this.GetShopItemBuyTimes(data);
        if(times < 1){
            return -1;
        }
        let currItemCfg = data.money_item[0];
        let hasNum = Item.GetNum(currItemCfg.item_id);
        if(hasNum < currItemCfg.num){
            return 0;
        }
        return 1;
    }

    ////////////// 皮肤相关 ////////////

    GetSkinInfo(seq: number):IPB_SCArenaMapData{
        if(this.skinInfo == null || this.skinInfo.mapList == null){
            return null;
        }
        let info = this.skinInfo.mapList.find((v)=>{
            return v.seq == seq;
        });
        return info;
    }

    GetSkinCfg(seq: number):CfgArenaSkin{
        let cfg = CfgArena.pvp_skin.find((v)=>{
            return v.seq == seq;
        });
        return cfg;
    }

    // 1 已激活，0未解锁
    GetSkinState(data: CfgArenaSkin):number{
        if(data.get_type == 0){
            return 1
        }
        let info = this.GetSkinInfo(data.seq);
        if(info == null){
            return 0;
        }
        let curTime = TimeCtrl.Inst().ServerTime;
        if(curTime > Number(info.endTime))
        {
            return 0;
        }
        return 1;
    }

    //皮肤剩余时间 -1是永久，0是未激活
    GetSkinTime(data: CfgArenaSkin): number{
        let state = this.GetSkinState(data);
        if(state == 0){
            return 0;
        }
        if(data.have_time == 0){
            return -1;
        }
        let info = this.GetSkinInfo(data.seq);
        return Number(info.endTime);
    }

    ///////////////// 每日礼包 /////////
    
    public GetDailyGiftBuyCount(seq: number) {
        return this.dailyGift ? (this.dailyGift.giftBuyCount[seq] || 0): 0
    }

    public GetDailyGiftCfg() {
        return CfgArenaDailyGift.gift_list
    }

    public GetDailyGiftOtherCfg() {
        return CfgArenaDailyGift.other[0]
    }

    ///////////////// 其他 //////////////

    //是否需要指引
    GetIsNeedGuide(){
        if(this.mainInfo == null){
            return false;
        }
        if(!RoleData.Inst().IsGuideNum(13, false)){
            return false;
        }
        return this.heroLength == 0;
    }

    //获取机器人配置
    GetRobotCfg(seq:number):CfgArenaRobot{
        let cfg = CfgArena.robot.find((v)=>{
            return v.seq == seq;
        })
        return cfg;
    }

    //段位奖励状态 -1已经领取， 0条件不达标，1可领取
    GetRankRewardState(data: CfgArenaRank){
        if(this.mainInfo == null){
            return 0;
        }
        if(this.mainInfo.rankRewardFetch[data.seq]){
            return -1;
        }
        if(data.rank < this.rank){
            return 1;
        }
        if(data.rank == this.rank && data.rank_order <= this.rankOrder){
            return 1;
        }
        return 0;
    }

    //段位奖励红点
    RankRewardRemind():number{
        let list = CfgArena.rank;
        for(let v of list){
            let state = this.GetRankRewardState(v);
            if(state > 0){
                return 1;
            }
        }
        return 0;
    }


    //竞技场红点
    AllRemind():number{
        let isOpen = this.IsOpen();
        if(!isOpen){
            return 0;
        }

        let flag = sys.localStorage.getItem(Prefskey.GetArenaRemindKey());
        if(flag == null || flag == ""){
            return 1;
        }

        let rankRemind = this.RankRewardRemind();
        if(rankRemind > 0){
            return 1;
        }

        let arenaPassRemind = ArenaPassData.Inst().IsRewardCanGet();
        if(arenaPassRemind > 0){
            return 1;
        }
        return 0;
    }

    FlushRemind(){
        this.smdData.flushData = !this.smdData.flushData;
    }

    //挑战卷剩余购买次数
    GetRemainBuyCount():number{
        let remainCount = CfgArena.other[0].challenge_item_buy_max - this.buyCount;
        return remainCount;
    }


    AddSelectSkill(skill:CfgSkillData, isOn:boolean){
        if(isOn){
            if(this.smdData.selectSkillList.size >= 24){
                PublicPopupCtrl.Inst().Center(Language.Arena.tips7);
                return;
            }
            this.smdData.selectSkillList.add(skill);
        }else if(skill){
            this.smdData.selectSkillList.delete(skill);
        }
        SMDTriggerNotify(this.smdData, "selectSkillList");
    }
    ClearSelectSkill(){
        this.smdData.selectSkillList.clear();
        SMDTriggerNotify(this.smdData, "selectSkillList");
    }

    IsOpen(){
        if(!ActivityData.Inst().IsOpen(ACTIVITY_TYPE.Arena)){
            return false;
        }
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.Arena.View);
        if(!isOpen){
            return false;
        }
        return isOpen.is_open;
    }
}

import { GetCfgValue } from 'config/CfgCommon';
import { CreateSMD, smartdata } from "data/SmartData";
import { ViewManager } from 'manager/ViewManager';
import { IBattleHeroInfo } from 'modules/Battle/BattleData';
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { BagData } from 'modules/bag/BagData';
import { Mod } from 'modules/common/ModuleDefine';
import { HeroData } from 'modules/hero/HeroData';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { DataBase } from "../../data/DataBase";
import { CfgLostTemple } from './../../config/CfgLostTemple';
import { LoseTempleCtrl } from './LoseTempleCtrl';
import { LoseTempleView } from './LoseTempleView';

export class LoseTempleResultData {
    Info: PB_SCLostTempleInfo
    ShopInfo: PB_SCLostTempleShopInfo
    TaskInfo: PB_SCLostTempleMissionInfo
}

export class LoseTempleFlushData {
    @smartdata
    FlushInfo: boolean = false;
    @smartdata
    FlushShopInfo: boolean = false;
    @smartdata
    FlushTaskInfo: boolean = false;

    @smartdata
    selectHeroFlush: number = 0;//界面选择
    @smartdata
    heroBattle: boolean = false;;//上阵效果

    @smartdata
    selectMapFlush: boolean = false;//选中底图格子

    @smartdata
    slideShowFlush: boolean = false;//选中底图格子

    RoleAnim: boolean = false
}

export enum LostCellType {
    My,		    	  //自己
    Choosable,  	 //可选  
    Mist,		     //迷雾
    Selected,   	  //已选
    Conceal,	      //隐藏
}

export class LoseTempleData extends DataBase {
    public ResultData: LoseTempleResultData;
    public FlushData: LoseTempleFlushData;
    static difficulty: number = 1;
    static energyConsume: number = 0;
    private selectHero: number = null;
    private BattleHero: number = 0;

    private selectMapCell: number = 0;

    static remainsPub: boolean = false;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(LoseTempleFlushData);
        this.ResultData = new LoseTempleResultData()
    }

    public setLoseTempleInfo(data: PB_SCLostTempleInfo) {
        if (this.Info && this.BlockPass != data.nowBlock) {
            this.RoleAnim = true
        }
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public setLoseTempleShopInfo(data: PB_SCLostTempleShopInfo) {
        this.ResultData.ShopInfo = data;
        this.FlushData.FlushShopInfo = !this.FlushData.FlushShopInfo
    }

    public setLoseTempleTaskInfo(data: PB_SCLostTempleMissionInfo) {
        this.ResultData.TaskInfo = data;
        this.FlushData.FlushTaskInfo = !this.FlushData.FlushTaskInfo
    }

    public get SelecMapCell() {
        return this.selectMapCell;
    }
    public set SelecMapCell(value: number) {
        this.selectMapCell = value;
        this.FlushData.selectMapFlush = !this.FlushData.selectMapFlush;
    }

    public set selectHeroId(id: number) {
        if (this.selectHero != null && this.selectHero != id) {
            this.FlushData.selectHeroFlush = this.selectHero;
        }
        this.selectHero = id;
    }

    public get SelectHeroId() {
        return this.FlushData.selectHeroFlush;
    }

    public set heroBattleid(id: number) {
        if (id != 0 && this.BattleHero != id) {
            this.FlushData.heroBattle = !this.FlushData.heroBattle
        }
        this.BattleHero = id;
    }

    public get heroBattleid() {
        return this.BattleHero;
    }

    public get ShopInfo() {
        return this.ResultData.ShopInfo;
    }

    public get TaskInfo() {
        return this.ResultData.TaskInfo;
    }

    public get TaskProgress() {
        return this.TaskInfo ? this.TaskInfo.missionProgress : [];
    }

    public get TaskBoxFetch() {
        return this.TaskInfo ? this.TaskInfo.missionRewardFetchFlag : [];
    }

    public get TaskFetch() {
        return this.TaskInfo ? this.TaskInfo.missionFetch : [];
    }

    public get Info() {
        return this.ResultData.Info;
    }

    public get BlockPass() {
        return this.Info ? this.Info.nowBlockPass : 0;
    }

    public get ShopListInfo() {
        return this.Info ? this.Info.shopList : [];
    }

    public get pubHeroList() {
        return this.Info ? this.Info.pubHeroList : [];
    }
    public get pubEvent() {
        return this.Info.pub ? this.Info.pub.eventId : 0;
    }

    GetRemainsBox() {
        if (this.Info.remainsBox && this.Info.remainsBox.remainsId) {
            return this.Info.remainsBox.remainsId ?? []
        }
        return []
    }

    GetRemainsListData() {
        return this.Info ? this.Info.remainsList : [];
    }

    slideShowFlush() {
        this.FlushData.slideShowFlush = !this.FlushData.slideShowFlush;
    }

    GetRemainsSkillList(): RemainsSkillList[] {
        let list = this.GetRemainsListData();
        let info: { [key: number]: number } = {}
        let data: RemainsSkillList[] = []
        for (let i = 0; i < list.length; i++) {
            if (!info[list[i]]) {
                info[list[i]] = 1
            } else {
                info[list[i]] += 1
            }
        }
        for (let k in info) {
            let cfg = this.GetRemainsCfg(+k)
            data.push(<RemainsSkillList>{ skillId: cfg.skill_id, num: info[k] })
        }
        return data;
    }

    openView() {
        let maxline = this.GetMaxStoreyline();
        let maxStorey = this.IsMaxStorey();
        if (!this.Info || (this.Info && this.Info.nowLine <= 1 && this.Info.nowLine <= 1 && this.Info.nowStorey <= 1)) {
            LoseTempleCtrl.Inst().SendLoseStart(1)
        } else if (!maxStorey && this.Info && this.Info.nowLine >= maxline && this.Info.nowBlockPass == 1) {
            LoseTempleCtrl.Inst().SendLoseNextStorey()
        }
        ViewManager.Inst().OpenView(LoseTempleView)
    }

    //英雄信息
    public GetHeroInfo(heroId: number) {
        for (let i = 0; i < this.pubHeroList.length; i++) {
            if (heroId == this.pubHeroList[i].heroId) {
                return this.pubHeroList[i]
            }
        }
        return HeroData.Inst().GetHeroInfo(heroId)
    }

    public GetHeroEnergy(heroId: number) {
        for (let i = 0; i < this.pubHeroList.length; i++) {
            if (heroId == this.pubHeroList[i].heroId) {
                return this.pubHeroList[i].energy
            }
        }
        let info = HeroData.Inst().GetHeroInfo(heroId);
        return info ? info.raLtEnergy : 0
    }

    IsPubHero(heroId: number) {
        for (let i = 0; i < this.pubHeroList.length; i++) {
            if (heroId == this.pubHeroList[i].heroId) {
                return true
            }
        }
        return false
    }

    GetHeroListData() {
        let info = [];
        let data = [];
        let battle = this.GetInBattleHeros();
        let myData = HeroData.Inst().HeroList;
        for (let i = 0; i < this.pubHeroList.length; i++) {
            let id = this.pubHeroList[i].heroId;
            if (battle.indexOf(id) != -1) continue;
            data.push(id);
            info.push(this.pubHeroList[i]);
        }
        for (let j = 0; j < myData.length; j++) {
            let id = myData[j].heroId;
            if (battle.indexOf(id) != -1) continue;
            if (data.indexOf(id) != -1) continue;
            data.push(id);
            info.push(myData[j]);
        }
        return info
    }

    IsHeroLevelMax(heroId: number, lv: number) {
        let cfg = HeroData.Inst().GetHeroBaseCfg(heroId);
        return lv >= cfg.level_max;
    }

    GetMaxStoreyline() {
        let cfg = this.GetTempleMapCfg()
        return (cfg[cfg.length - 1] && cfg[cfg.length - 1].line) || 22;
    }

    IsMaxStorey() {
        let storey = this.Info ? this.Info.nowStorey : 1;
        let max = this.GetMaxStorey()
        let line = LoseTempleData.Inst().GetMaxStoreyline();
        let myLine = LoseTempleData.Inst().GetMyLine()
        let pass = LoseTempleData.Inst().BlockPass;
        return storey >= max && pass == 1 && myLine >= line;
    }

    GetTempleMapCfg() {
        let diff = LoseTempleData.difficulty;
        let storey = this.Info ? this.Info.nowStorey : 1;
        if (storey > 3) {
            storey = 3
        }
        return CfgLostTemple.temple_difficulty.filter(cfg => {
            return cfg.difficulty == diff && cfg.storey == storey;
        })
    }

    public GetMapData() {
        let mapdata = this.GetTempleMapCfg();
        let data: any[][] = [];
        for (let i = 0; i < mapdata.length; i++) {
            let index = mapdata[i].line - 1;
            if (!data[index]) {
                data[index] = []
            }
            data[index].push(mapdata[i])
        }
        return data;
    }

    GetMyBlock() {
        if (this.BlockPass == 1) {
            return this.Info ? this.Info.nowBlock : 1;
        } else {
            let moveBlock = this.Info ? this.Info.moveBlock : [2]
            return moveBlock[moveBlock.length - 2] ?? 2;
        }
    }

    GetMyLine() {
        let line = this.Info ? this.Info.nowLine : 1;
        if (this.BlockPass == 1 || line == 1) {
            return line;
        } else {
            return line - 1;
        }
    }

    get MoveBlock() {
        return this.Info ? this.Info.moveBlock : []
    }

    set RoleAnim(value: boolean) {
        this.FlushData.RoleAnim = value
    }

    get RoleAnim() {
        return this.FlushData.RoleAnim
    }

    //自己 可选 迷雾 走过 
    GetMapCellState(line: number, block: number) {
        if (!this.Info) return 3;
        let nowBlock = this.GetMyBlock();
        let nowLine = this.GetMyLine();
        let moveBlock = this.Info ? this.Info.moveBlock : [2]
        if (line > nowLine + 1) {
            return LostCellType.Mist
        }
        if (line == nowLine && block == nowBlock) {
            return LostCellType.My
        }
        if (line < nowLine && moveBlock[line - 1] == block) {
            return LostCellType.Selected
        }
        if (line == nowLine + 1) {
            if (this.BlockPass == 0) {
                if (block == this.Info.nowBlock) {
                    return LostCellType.Choosable
                }
            } else {
                if (nowBlock == block) {
                    return LostCellType.Choosable
                } else if (line % 2 == 0 && nowBlock == block + 1) {
                    return LostCellType.Choosable
                } else if (line % 2 == 1 && nowBlock == block - 1) {
                    return LostCellType.Choosable
                } else {
                    return LostCellType.Mist
                }
            }
        }
        return LostCellType.Conceal
    }

    GetInBattleHeros() {
        let fightHeroId = this.Info ? this.Info.fightHeroId : [0, 0, 0, 0];
        let data = [0, 0, 0, 0];
        for (let i = 0; i < fightHeroId.length; i++) {
            if (fightHeroId[i]) {
                let info = this.GetHeroInfo(fightHeroId[i]);
                if (info) {
                    data[i] = fightHeroId[i]
                }
            }
        }
        return data
    }

    //获取上阵的英雄信息
    GetInBattleHeroInfos(): IBattleHeroInfo[] {
        let heros = this.GetInBattleHeros();;
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

    GetTask() {
        let data = [];
        let cfg = CfgLostTemple.mission;
        for (let i = 0; i < cfg.length; i++) {
            data.push({
                cfg: cfg[i],
                value: this.TaskProgress[cfg[i].type],
                isFetch: this.TaskFetch[cfg[i].seq],
            });
        }
        return data
    }

    AchievementAllRed() {
        let red1 = this.GetTaskRed()
        let red2 = this.GetTaskBoxRed()
        return red1 + red2;
    }

    GetTaskRed() {
        let list = this.GetTask();
        for (let i = 0; i < list.length; i++) {
            if (!list[i].isFetch && list[i].value >= list[i].cfg.pram1) {
                return 1
            }
        }
        return 0
    }

    GetTaskBoxRed() {
        let BoxCfg = LoseTempleData.Inst().GetTaskBox();
        let num = LoseTempleData.Inst().GetIntegralNum(BoxCfg[0].stage_item);
        for (let i = 0; i < BoxCfg.length; i++) {
            if (!this.TaskBoxFetch[BoxCfg[i].seq] && num >= BoxCfg[i].stage_need) {
                return 1
            }
        }
        return 0
    }

    GetMysteriousShopEventId() {
        let index = this.ShopListInfo.length - 1;
        return this.ShopListInfo[index] ? this.ShopListInfo[index].eventId : 1;
    }

    GetMysteriousShopIndex() {
        let index = this.ShopListInfo.length - 1;
        return this.ShopListInfo[index] ? this.ShopListInfo[index].shopIndex : 0;
    }

    GetTaskBox() {
        return CfgLostTemple.mission_reward
    }

    GetIntegralNum(id: number) {
        return BagData.Inst().GetItemNum(id);
    }

    GetBattleCfg(event_id: number) {
        return CfgLostTemple.temple_battle.find(cfg => cfg.event_id == event_id);
    }

    GetMysteriousShopCfg(event_id: number) {
        return CfgLostTemple.mysterious_shop.filter(cfg => cfg.event_id == event_id);
    }

    GetRemainsCfg(remains_id: number) {
        return CfgLostTemple.remains.find(cfg => cfg.remains_id == remains_id);
    }

    GetBonfireCfg(event_id: number) {
        return CfgLostTemple.bonfire.find(cfg => cfg.event_id == event_id);
    }

    GetPubCfg(event_id: number) {
        return CfgLostTemple.pub.find(cfg => cfg.event_id == event_id);
    }

    GetEndBoxCfg(event_id: number) {
        return CfgLostTemple.end_box.find(cfg => cfg.event_id == event_id);
    }

    GetTempleShopCfg() {
        return CfgLostTemple.temple_shop
    }

    GetMysteriousNum(seq: number) {
        let index = this.ShopListInfo.length - 1;
        return this.ShopListInfo[index] ? (this.ShopListInfo[index].buyCount[seq] ?? 0) : 0
    }

    GetTempleShopNum(index: number) {
        return this.ShopInfo ? (this.ShopInfo.templeShopBuyCount[index] ?? 0) : 0
    }

    GEtPubList(event_id: number) {
        let cfg = this.GetPubCfg(event_id);
        let data = [];
        for (let i = 1; i <= 3; i++) {
            data.push({
                heroid: GetCfgValue(cfg, "hero_id" + i),
                heroLevel: GetCfgValue(cfg, "hero_level" + i)
            })
        }
        return data;
    }

    GetEnergyNum() {
        return this.Info ? this.Info.energyNum : 0;
    }

    GetMaxStorey() {
        return CfgLostTemple.temple_difficulty[CfgLostTemple.temple_difficulty.length - 1].storey
    }

    isMysteriousOpen() {
        if (this.ShopListInfo && this.ShopListInfo.length) {
            let ListInfo = this.ShopListInfo[this.ShopListInfo.length - 1];
            let endT = ListInfo.endTime;
            let leftT = endT - TimeCtrl.Inst().ServerTime;
            if (leftT <= 0) {
                return false;
            }
            let cfg = this.GetMysteriousShopCfg(1);
            for (let i = 0; i < cfg.length; i++) {
                if (ListInfo && ListInfo.buyCount[i] < cfg[i].buy_times) {
                    return true;
                }
            }
        }
        return false;
    }

    getActList() {
        let endTime = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.LoseTemple)
        let data = [
            { type: 2, index: 0, endTime: endTime, mod_key: 0, effect: "" },
            { type: 3, index: 0, endTime: endTime, mod_key: Mod.LoseTemple.Achievement, effect: "" }
        ];
        if (this.ShopListInfo && this.ShopListInfo.length) {
            let ListInfo = this.ShopListInfo[this.ShopListInfo.length - 1];
            let endT = ListInfo.endTime;
            if (this.isMysteriousOpen()) {
                data.push({ type: 1, index: this.ShopListInfo.length - 1, endTime: endT, mod_key: 0, effect: "" })
            }
        }
        if (ActivityData.Inst().IsOpen(ACTIVITY_TYPE.DevilWarorder)) {
            data.push({
                type: 4, index: 0,
                endTime: ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DevilWarorder),
                mod_key: Mod.DevilWarorder.View,
                effect: "xianshihuodong_TB/mogu_TB/mogu_TB"
            })
        }
        return data
    }

    getShopListEndTime() {
        let info = this.ShopListInfo[this.ShopListInfo.length - 1];
        let time = info ? info.endTime : 0;
        return time - TimeCtrl.Inst().ServerTime
    }

    getEndTime() {
        let endTime = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.LoseTemple)
        let time = endTime - TimeCtrl.Inst().ServerTime;
        return time;
    }

}

export interface RemainsSkillList {
    skillId: number;
    num: number;
}
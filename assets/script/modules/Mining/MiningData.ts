import { Vec2 } from "cc";
import { CfgMining, CfgMiningClodRate, CfgMiningMetersReward } from "config/CfgMining";
import { CreateSMD, smartdata, SMDTriggerNotify } from "data/SmartData";
import { Item } from "modules/bag/ItemData";
import { BattleHelper } from "modules/Battle/BattleHelper";
import { DataBase } from "../../data/DataBase";
import { MathHelper } from "../../helpers/MathHelper";
import { IMiningPitItemData } from "./MiningView";
import { InstituteData, InstituteTalentType } from "modules/Institute/InstituteCtrl";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { Mod } from "modules/common/ModuleDefine";
import { CavePassData } from "modules/CavePass/CavePassData";

export enum MiningBlockType{
    None = 0,       //空土块
    NiTuKuai = 1,   //泥土块
    ShiKuai = 2,    //石块
    JinBi = 3,      //金币泥土块
    HongZhuan = 4,  //红钻泥土块
    ZuanShi = 5,    //钻石泥土块
    BaoXiang = 6,   //宝箱泥土块
    DaoJu = 7,      //挖掘道具泥土块
}

export const MiningMapCol = 6;      //地图固定6列格子

// 挖掘信息
export class MiningExcavateInfo{
    pos:Vec2;
    blockType:MiningBlockType;
    itemList:IPB_ItemData[];

    GetIsShow(){
        return this.blockType != null && this.itemList != null && this.pos != null && this.itemList.length > 0;
    }

    Reset(){
        this.pos = null;
        this.blockType = null;
        this.itemList = null;
    }
}

class MiningInfo{
    @smartdata
    sceneInfo:PB_SCMiningCaveInfo;
    @smartdata
    excavateInfo:MiningExcavateInfo;
}

export class MiningData extends DataBase {  
    public miningInfo : MiningInfo;
    private route : Set<IPB_SCMiningCaveCold>;

    get excavateInfo():MiningExcavateInfo{
        return this.miningInfo.excavateInfo;
    }

    constructor(){
        super();
        this.createSmartData();
        this.route = new Set<IPB_SCMiningCaveCold>();
    }

    private createSmartData(){
        this.miningInfo =  CreateSMD(MiningInfo);
        this.miningInfo.excavateInfo = new MiningExcavateInfo();
        //this.SetTestInfo();
    }

    SetTestInfo(){
        let info = <PB_SCMiningCaveInfo>{
            excavateReplyTime: 0,
            nowHigh : 0,
            metersReward : [false],
            coldList: [],
        }

        for(let i = 0; i < 90; i++){
            info.coldList.push({excavateCount:0, coldType : MathHelper.GetRandomNum(0,7)});
        }

        this.SetSceneInfo(info);
    }

    SetSceneInfo(info:PB_SCMiningCaveInfo){
        this.miningInfo.sceneInfo = info;
        this.InitRoute();
    }
    GetSceneInfo():PB_SCMiningCaveInfo{
        return this.miningInfo.sceneInfo;
    }

    GetBlockCfg(type: MiningBlockType): CfgMiningClodRate{
        let cfg = CfgMining.clod_rate;
        for(let v of cfg){
            if(v.clod_type == type){
                return v;
            }
        }
        return null;
    }

    //初始化路线
    InitRoute(){
        if(this.miningInfo.sceneInfo == null){
            return;
        }
        this.route.clear();
        let blockList = this.GetBlockList();
        for(let i = 0; i <= 5; i++){
            let block = blockList[i];
            if(block.coldType == MiningBlockType.None){
                this.route.add(block);
                this.seekRoute(block);
            }
        }

        // 调试用
        // this.route.forEach(block=>{
        //     let index = this.miningInfo.sceneInfo.coldList.indexOf(block);
        //     let ij = BattleHelper.NumToIJ(index, 6);
        //     console.log("线路", ij.y, ij.x);
        // })
    }

    //寻找路线
    private seekRoute(block:IPB_SCMiningCaveCold){
        if(block.coldType != MiningBlockType.None){
            return;
        }
        let circumBlocks = this.GetCircumBlocks(block);
        for(let i = 0; i < circumBlocks.length; i++){
            let value = circumBlocks[i];
            if(value.coldType == MiningBlockType.None && !this.route.has(value)){
                this.route.add(value);
                this.seekRoute(value)
            }
        }
    }

    AddRouteData(block:IPB_SCMiningCaveCold){
        this.route.add(block);
    }



    //获取地块列表
    GetBlockList():IPB_SCMiningCaveCold[]{
        if(this.miningInfo.sceneInfo == null || this.miningInfo.sceneInfo.coldList == null){
            return [];
        }
        return this.miningInfo.sceneInfo.coldList;
    }

    GetBlock(index:number):IPB_SCMiningCaveCold{
        return this.miningInfo.sceneInfo.coldList[index];
    }

    //获取格子周围的格子
    GetCircumBlocks(data:IPB_SCMiningCaveCold):IPB_SCMiningCaveCold[]{
        let list:IPB_SCMiningCaveCold[] = []
        let index = this.miningInfo.sceneInfo.coldList.indexOf(data);
        if(index < 0){
            return list;
        }

        let rangeIndexs: number[] = [];
        rangeIndexs[0] = index - MiningMapCol;  //上
        rangeIndexs[1] = index + MiningMapCol;  //下
        rangeIndexs[2] = index - 1;             //左
        rangeIndexs[3] = index + 1;             //右

        for(let i = 0; i <= 1; i++){
            let block = this.GetBlock(rangeIndexs[i]);
            if(block){
                list.push(block);
            }
        }

        for(let i = 2; i <= 3; i++){
            let blockIndex = rangeIndexs[i];
            let block = this.GetBlock(blockIndex);
            if(block){
                let blockI = Math.ceil((blockIndex + 1) / MiningMapCol) - 1;
                let curI = Math.ceil((index + 1) / MiningMapCol) - 1;
                if(blockI == curI){
                    list.push(block);
                }
            }
        }
        return list;
    }

    GetDepthValue():number{
        return <number>this.miningInfo.sceneInfo.nowHigh;
    }

    //米数奖励
    DepthReward():CfgMiningMetersReward{
        if(this.miningInfo.sceneInfo == null){
            return null;
        }
        let metersRewardState = this.miningInfo.sceneInfo.metersReward;

        let cfg = CfgMining.meters_reward;
        for(let v of cfg){
            let state = metersRewardState[v.seq];
            if(!state){
                return v;
            }
        }
        return null;
    }

    IsMask(data:IPB_SCMiningCaveCold):boolean{
        if(this.route.has(data)){
            return false;
        }
        let circumBlocks = this.GetCircumBlocks(data);
        for(let i = 0; i < circumBlocks.length; i++){
            let value = circumBlocks[i];
            if(this.route.has(value)){
                return false;
            }
        }

        return true;
    }

    GetExcavateFlushTime():number{
        if(this.miningInfo.sceneInfo == null || this.miningInfo.sceneInfo.excavateReplyTime == null){
            return 0;
        }
        return <number>this.miningInfo.sceneInfo.excavateReplyTime;
    }

    //挖掘道具id
    GetExcavateItemId():number{
        return CfgMining.other[0].excavate_id;
    }
    //钻头道具id
    GetBitItemId():number{
        return CfgMining.other[0].bit_id;
    }
    //炸弹道具id
    GetBombItemId():number{
        return CfgMining.other[0].bomb_id;
    }
    //宝石道具id
    GetGemItemId():number{
        return CfgMining.other[0].red_dia_id;
    }

    //是否能挖掘
    IsCanExcavate(){
        let item_num = Item.GetNum(this.GetExcavateItemId());
        return item_num > 0;
    }

    GetBlockIndex(data:IPB_SCMiningCaveCold){
        let index = this.miningInfo.sceneInfo.coldList.indexOf(data);
        return index;
    }

    FlushExcavateInfo(){
        SMDTriggerNotify(this.miningInfo, "excavateInfo");
    }

    //挖掘道具上限
    GetExcavateNumLimit():number{
        let num = CfgMining.other[0].excavate_num_max;
        let instituteLevelCfgList = InstituteData.Inst().GetAllActiveCfg(InstituteTalentType.ExcavateNum);
        if(instituteLevelCfgList){
            instituteLevelCfgList.forEach(v=>{
                if(v.talent_type == InstituteTalentType.ExcavateNum){
                    num+=v.param;
                }
            })
        }
        return num;
    }

    //矿洞红点
    GetRemindNum():number{
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.Mining.View);
        if(!isOpen){
            return 0;
        }

        let item_id = this.GetExcavateItemId();
        let limitNum = this.GetExcavateNumLimit();
        let hasNum = Item.GetNum(item_id);

        if(hasNum >= limitNum){
            return 1;
        }

        let actNum = CavePassData.Inst().GetAllRed();
        if(actNum && actNum > 0){
            return 1;
        }
        return 0
    }

}

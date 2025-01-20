import { math } from 'cc';
import { CfgSkillData } from 'config/CfgEntry';
import { CfgInstitute, CfgInstituteLevel } from 'config/CfgInstitute';
import { LogError } from 'core/Debugger';
import { DataBase } from 'data/DataBase';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { CreateSMD, smartdata, SMDTriggerNotify } from 'data/SmartData';
import { BagData } from 'modules/bag/BagData';
import { Item } from 'modules/bag/ItemData';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { Language } from 'modules/common/Language';
import { Mod } from 'modules/common/ModuleDefine';
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { MiningData } from 'modules/Mining/MiningData';
import { TimeHelper } from '../../helpers/TimeHelper';

// 研究所天赋类型
export enum InstituteTalentType{
    Skill = 0,              //词条
    AttackValue = 1,        //1=攻击力（固定值）
    AttackSpeed = 2,        //2=攻速（万分比）
    AttackHarm = 3,         //3=伤害加成（万分比）
    BaoJi = 4,              //4=暴击率（万分比）
    BaojiScale = 5,         //4=暴击增伤（万分比）
    InstituteTime = 6,      //6=缩短升级时间（万分比）
    ExcavateNum = 7,        //7=增加矿稿上限数量（固定值）
    ExcavateResetTime = 8,  //8=缩短矿稿回复时间（万分比）
    GemReward = 9,          //9=红钻获得量增加（万分比）
    BattleExp = 10,         //10=战斗内获得经验增加（万分比）
    StepNum = 11,           //11=初始步数增加（固定值）//只加没个阶段的第一回合
    CoinRate = 12,          //12=初始金币概率提升（万分比）
}


export class InstituteCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCInstituteInfo, func: this.OnSCInstituteInfo }
        ]
    }

    protected initCtrl(): void {
        // this.handleCollector.Add(RemindRegister.Create(Mod.Institute.View, BagData.Inst().BagItemData, ()=>{
        //     let num = InstituteData.Inst().GetRemindNum();
        //     return num;
        // }, "OtherChange"));
    }

    private OnSCInstituteInfo(data: PB_SCInstituteInfo) {
        LogError("研究所信息", data);
        InstituteData.Inst().SetDataInfo(data);
    }

}

class InstituteInfo{
    @smartdata
    info:PB_SCInstituteInfo;
}

export class InstituteItemData{
    private _vo:CfgInstituteLevel;
    get vo():CfgInstituteLevel{
        return this._vo;
    }
    set vo(value:CfgInstituteLevel){
        this._vo = value;
    }

    get id():number{
        return this.vo.talent_id;
    }
    get lineId():number{
        return this.vo.line_id;
    }

    parentData:InstituteLineData;

    // 1 - 5
    private _posIndex:number = 0;
    get posIndex():number{
        if(this._posIndex){
            return this._posIndex;
        }
        if(this.parentData == null){
            return 1;
        }
        let parentChildLength = this.parentData.datas.length;
        let indexOf = this.parentData.datas.indexOf(this);
        // if(parentChildLength == 3){
        //     return 2 * indexOf + 1;
        // }else if(parentChildLength == 2){
        //     return 2 * indexOf + 2
        // }else{
        //     return 2 * indexOf + 3;
        // }
        this._posIndex = 2 * indexOf + 4 - parentChildLength;
        return this._posIndex;
    }


    // 前置天赋id列表
    private _conditionIds:number[];
    get conditionIds():number[]{
        if(this._conditionIds == null){
            let str_list = this.vo.talent_id_front.toString().split("|");
            this._conditionIds = [];
            str_list.forEach((v)=>{
                this._conditionIds.push(Number(v));
            })
        }
        return this._conditionIds;
    }

    fullLevel: number = 1;

    get level(): number{
        let v = InstituteData.Inst().GetItemLevel(this.id);
        if(v > this.fullLevel){
            v = this.fullLevel;
        }
        return v;
    }

    // 子节点
    private childs: InstituteItemData[] = [];

    constructor(vo:CfgInstituteLevel){
        this.vo = vo;
    }

    // 是否满级
    IsFullLevel(){
        return this.level >= this.fullLevel;
    }

    IsActive(){
        return this.level > 0;
    }

    //是否能操作
    IsCanCtrl():boolean{
        for(let id of this.conditionIds){
            let data = InstituteData.Inst().GetItemData(id);
            if(data && !data.IsFullLevel()){
                return false;
            }
        }
        return true;
    }

    AddChild(data:InstituteItemData){
        this.childs.push(data);
    }
    GetChilds():InstituteItemData[]{
        return this.childs;
    }
    
    LineState(type:number):string{
        if(this.IsFullLevel()){
            return "Xian" + type;
        }else{
            return "AnXian" + type;
        }
    }

    //左线 空则隐藏
    LeftLine():string{
        let childs = this.GetChilds();
        if(childs.length == 0){
            return null;
        }
        for(let i = 0; i< childs.length; i++){
            let num = childs[i].posIndex - this.posIndex;
            if(num < 0){
                let type = num == -1 ? 1 : 3;
                return this.LineState(type);
            }
        }
        return null;
    }
    //右线 空则隐藏
    RightLine():string{
        let childs = this.GetChilds();
        if(childs.length == 0){
            return null;
        }
        for(let i = 0; i< childs.length; i++){
            let num = childs[i].posIndex - this.posIndex;
            if(num > 0){
                let type = num == 1 ? 1 : 3;
                return this.LineState(type);
            }
        }
        return null;
    }

    //中间那条线
    Line():string{
        let childs = this.GetChilds();
        if(childs.length == 0){
            return null;
        }
        for(let i = 0; i< childs.length; i++){
            if(childs[i].posIndex == this.posIndex){
                return this.LineState(2);
            }
        }
        return null;
    }

    

    LevelCfg():CfgInstituteLevel{
        if(this.level == 0){
            return null;
        }
        let level = this.level;
        if(level > this.fullLevel){
            level = this.fullLevel;
        }
        return InstituteData.Inst().GetLevelCfg(this.id, level);
    }

    NextLevelCfg():CfgInstituteLevel{
        let level = this.level + 1;
        if(level > this.fullLevel){
            level = this.fullLevel;
        }
        return InstituteData.Inst().GetLevelCfg(this.id, level);
    }

    //当前描述
    GetCurDesc():string{
        if(this.level == 0){
            if(this.vo.talent_type == 0){
                return this.GetNextDesc();
            }else{
                return Language.Institute.Text2;
            }
        }
        let cfg = InstituteData.Inst().GetLevelCfg(this.id, this.level);
        return cfg.describe;
    }
    //下级描述
    GetNextDesc():string{
        if(this.IsFullLevel()){
            return Language.Institute.Text3;
        }
        let cfg = this.NextLevelCfg();
        return cfg.describe;
    }

    GetUpTime():number{
        let cfg = this.NextLevelCfg();
        let instituteLevelCfgList = InstituteData.Inst().GetAllActiveCfg(InstituteTalentType.InstituteTime);
        let scale = 1;
        if(instituteLevelCfgList){
            instituteLevelCfgList.forEach(v=>{
                if(v.talent_type == InstituteTalentType.InstituteTime){
                    scale-=v.param / 10000;
                }
            })
        }
        return cfg.up_time * 60 * scale;
    }

    GetTimeDesc():string{
        let allTime = this.GetUpTime();
        let time_t = TimeHelper.FormatDHMS(allTime);
        let h = time_t.hour;
        let m = time_t.minute;
        let s = time_t.second;
        let h_str = h < 10 ? "0" + h : h;
        let m_str = m < 10 ? "0" + m : m;
        let s_str = s < 10 ? "0" + s : s;
        return h_str + ":" + m_str + ":" + s_str;
    }
}

export class InstituteLineData{
    datas: InstituteItemData[] = [];
}

export class InstituteData extends DataBase {  
    public dataInfo : InstituteInfo;

    private _itemDataMap: Map<number, InstituteItemData>;
    get itemDataMap():Map<number, InstituteItemData>{
        if(this._itemDataMap == null){
            this._itemDataMap = new Map<number, InstituteItemData>();
            let cfg = CfgInstitute.talent;
            cfg.forEach((vo)=>{
                if(vo.level == 1){
                    let data = new InstituteItemData(vo);
                    this._itemDataMap.set(vo.talent_id, data);
                }else if(vo.level > 1){
                    let data = this._itemDataMap.get(vo.talent_id);
                    if(data && vo.level > data.fullLevel){
                        data.fullLevel = vo.level;
                    }
                }
            });

            this._itemDataMap.forEach((value, id)=>{
                let nums = value.conditionIds;
                nums.forEach(num=>{
                    let data = this._itemDataMap.get(num);
                    if(data){
                        data.AddChild(value);
                    }
                })
            })
        }
        return this._itemDataMap;
    }

    private _listItemData: InstituteLineData[];
    get listItemData():InstituteLineData[]{
        if(this._listItemData == null){
            this._listItemData = [];
            this.itemDataMap.forEach((value, key)=>{
                if(this._listItemData[value.lineId - 1] == null){
                    this._listItemData[value.lineId - 1] = new InstituteLineData();
                }
                this._listItemData[value.lineId - 1].datas.push(value);
                value.parentData = this._listItemData[value.lineId - 1];
            })
        }

        return this._listItemData;
    }

    constructor(){
        super();
        this.createSmartData();
    }

    private createSmartData(){
        this.dataInfo =  CreateSMD(InstituteInfo);
    }

    SetDataInfo(info: PB_SCInstituteInfo){
        this.dataInfo.info = info;
    }
    GetDataInfo(){
        return this.dataInfo.info;
    }
    FlushInfo(){
        SMDTriggerNotify(this.dataInfo, "info");
    }

    GetItemData(id: number):InstituteItemData{
        return this.itemDataMap.get(id);
    }

    //当前选中的data
    private selData:InstituteItemData;
    GetSelData():InstituteItemData{
        return this.selData ?? this.GetItemData(1);
    }
    SetSelData(data: InstituteItemData){
        this.selData = data;
    }

    GetItemLevel(id:number):number{
        if(this.dataInfo.info == null){
            return 0;
        }
        return this.dataInfo.info.talentLevel[id] ?? 0;
    }

    GetTimestamp():number{
        if(this.dataInfo.info == null){
            return 0;
        }
        return <number>this.dataInfo.info.upTalentTime;
    }

    // 研究中的id
    GetInstitutingId():number{
        if(this.dataInfo.info == null){
            return 1;
        }
        let time = this.GetTimestamp();
        if(time > 0){
            return this.dataInfo.info.upTalentId;
        }
        for(let lineData of this.listItemData){
            for(let v of lineData.datas){
                if(!v.IsFullLevel()){
                    return v.id;
                }
            }
        }

        if(this.dataInfo.info.upTalentId == 0){
            return 1
        }
        
        return this.dataInfo.info.upTalentId;
    }

    GetLevelCfg(id:number, level:number):CfgInstituteLevel{
        let cfg = CfgInstitute.talent;
        for(let v of cfg){
            if(v.talent_id == id && v.level == level){
                return v;
            }
        }
    }

    //获取全部激活的天赋配置
    GetAllActiveCfg(talent_type?:InstituteTalentType):CfgInstituteLevel[]{
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.Institute.View);
        if(!isOpen){
            return null;
        }

        let list:CfgInstituteLevel[] = [];
        this.itemDataMap.forEach((data,id)=>{
            if(data.IsActive() && (talent_type == null || data.vo.talent_type == talent_type)){
                list.push(data.LevelCfg());
            }
        })
        return list;
    }

    GetAllActiveCfg2(infos:{talentId:number,talentLevel:number}[]|IPB_SCArenaTalentLevelInfo[]):CfgInstituteLevel[]{
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.Institute.View);
        if(!isOpen){
            return null;
        }

        let list:CfgInstituteLevel[] = [];
        infos.forEach((v)=>{
            if(v.talentLevel > 0){
                let cfg = this.GetLevelCfg(v.talentId, v.talentLevel);
                list.push(cfg);
            }
        })
        return list;
    }

    //研究点位操作状态 -1已满级，0材料不够，1可升级
    GetStuffState(data:InstituteItemData):number{
        if(data.IsFullLevel()){
            return -1;
        }
        let nextCfg = data.NextLevelCfg();
        let needNum = nextCfg.up_item[0].num;
        let hasNum = Item.GetNum(nextCfg.up_item[0].item_id);
        if(hasNum < needNum){
            return 0;
        }
        return 1;
    }



    //研究所红点
    GetRemindNum():number{
        let isOpen = FunOpen.Inst().GetFunIsOpen(Mod.Institute.View);
        if(!isOpen){
            return 0;
        }

        // 研究中不给红点
        let time = this.GetTimestamp();
        if(time > 0){
            return 0;
        }

        let id = InstituteData.Inst().GetInstitutingId();
        let data = InstituteData.Inst().GetItemData(id);
        let state = this.GetStuffState(data);
        if(state > 0){
            return 1
        }
        return 0
    }

    //研究所配置转成词条
    ConvertBattleSkill(cfg:CfgInstituteLevel):CfgSkillData{
        let data = new CfgSkillData();
        data.color = cfg.color;
        data.skill_id = 99999;
        data.word = cfg.describe;
        data.icon_res_id = cfg.res_id;
        return data;
    }

    //通过技能id获取配置
    GetCfgBySkillId(skill_id: number): CfgInstituteLevel{
        let cfg = CfgInstitute.talent;
        for(let v of cfg){
            if(v.talent_type == InstituteTalentType.Skill && v.param == skill_id){
                return v;
            }
        }
    }

    //技能id是否已经解锁
    IsActiveSkillId(skill_id: number): boolean{
        let cfg = this.GetCfgBySkillId(skill_id);
        if(!cfg){
            return false;
        }
        let v = InstituteData.Inst().GetItemLevel(cfg.talent_id);
        return v > 0;
    }
}






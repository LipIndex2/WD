import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgCultivate } from "config/CfgCultivate";

class CultivateResultData {
    Info: PB_SCRaFarminginfo
    CellRet: PB_SCRaFarmingRet
}

class CultivateFlushData {
    @smartdata
    FlushInfo: boolean = false;
    @smartdata
    FlushCellAni: boolean = false;
}

export class CultivateData extends DataBase {
    public ResultData: CultivateResultData;
    public FlushData: CultivateFlushData;
    public itemList: IPB_ItemData[]
    private isOpenCell: boolean = false;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(CultivateFlushData);
        this.ResultData = new CultivateResultData()
    }

    OnCultivateInfo(data: PB_SCRaFarminginfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo;
    }

    OnCultivateOpenCell(data: PB_SCRaFarmingRet) {
        this.ResultData.CellRet = data;
        this.FlushData.FlushCellAni = !this.FlushData.FlushCellAni;
    }

    public get IsOpenCell() {
        return this.isOpenCell
    }

    public set IsOpenCell(value: boolean) {
        this.isOpenCell = value;
    }

    private get CellRet() {
        return this.ResultData.CellRet
    }

    public get CellIndexAni() {
        return this.CellRet ? this.CellRet.param[0] : 0;
    }

    private get Info() {
        return this.ResultData.Info
    }

    public get CellCount() {
        return this.Info ? this.Info.cellCount : 0;
    }

    public get CellCountIsFetch() {
        return this.Info ? this.Info.cellCountIsFetch : false;
    }

    public get CellList() {
        return this.Info ? this.Info.cellList : [];
    }

    public get lineRewardFlag() {
        return this.Info ? this.Info.lineRewardFlag : [];
    }

    public get shopBuyCount() {
        return this.Info ? this.Info.shopBuyCount : [];
    }

    public get taskList() {
        return this.Info ? this.Info.taskList : [];
    }

    public GetTaskListCfg() {
        const cfg = CfgCultivate.mission;
        let data = [];
        for (let i = 0; i < cfg.length; i++) {
            const seq = this.taskList[cfg[i].mission_type].taskSeq
            if (cfg[i].mis_seq < seq) continue;
            if (data.indexOf(cfg[i].mission_type) == -1) {
                data.push(cfg[i].mission_type)
            }
        }
        return data
    }

    public GetTaskCfg(type: number, seq: number) {
        return CfgCultivate.mission.find(cfg => cfg.mission_type == type && cfg.mis_seq == seq);
    }

    public GetShopList() {
        return CfgCultivate.shop
    }

    public GetCultivateCfg() {
        return CfgCultivate.cultivate
    }

    public GetCultivateRewardCfg() {
        return CfgCultivate.cultivate_reward
    }

    public GetOther() {
        return CfgCultivate.other[0]
    }
}

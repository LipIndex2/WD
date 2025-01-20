import { RoleData } from 'modules/role/RoleData';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { CfgFarm } from "config/CfgFarm";

class FarmResultData {
    Info: PB_SCTerritoryInfo
}

class FarmFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export enum FitmentItemType {
    Sprinkler = 0,  //浇水
    Pipeline = 1,   //施肥  
    Weeding = 2,    //除草
}

export class FarmData extends DataBase {
    public ResultData: FarmResultData;
    public FlushData: FarmFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(FarmFlushData);
        this.ResultData = new FarmResultData()
    }

    public onFarmInfo(data: PB_SCTerritoryInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    public get InfoRoleInfo() {
        return this.Info ? this.Info.roleInfo : RoleData.Inst().InfoRoleInfo
    }

    GetGreenhouseListCfg(page: number) {
        let data = [];
        data.push(CfgFarm.greenhouse.slice(page * 12, page * 12 + 4))
        data.push(CfgFarm.greenhouse.slice(page * 12 + 4, page * 12 + 8))
        data.push(CfgFarm.greenhouse.slice(page * 12 + 8, page * 12 + 12))
        return data;
    }

    GetGreenhouseMaxPage() {
        return Math.ceil(CfgFarm.greenhouse.length / 12) - 1
    }

    GetShopListCfg(page: number) {
        return CfgFarm.shop.filter(cfg => cfg.page == page)
    }

    GetRenovationListCfg() {
        let data = [];
        const cfg = this.GetOtherCfg();
        data.push({ seq: FitmentItemType.Sprinkler, item: cfg.machine_item1 });
        data.push({ seq: FitmentItemType.Pipeline, item: cfg.machine_item2 });
        data.push({ seq: FitmentItemType.Weeding, item: cfg.machine_item3 });
        return data
    }

    GetFriendCfg() {
        return CfgFarm.friend
    }

    GetOtherCfg() {
        return CfgFarm.other[0]
    }

    //获取Item位置
    GetItemInfoByPos(x: number, y: number, ListPosY: number) {
        let info = { i: -1, j: -1 };
        const width = 140
        const height = 210
        const minX = 70;
        const minY = ListPosY - 3 * height - 2 * 38;
        const maxY = ListPosY;
        const maxX = 4 * width + minX + 3 * 33;
        if (y > maxY || y < minY || x > maxX || x < minX) {
            return info
        }
        for (let i = 0; i < 3; i++) {
            const _y1 = maxY - i * height - i * 38 + 20;
            const _y2 = _y1 - height - 20;
            if (y >= _y2 && y <= _y1) {
                info.i = i;
                break;
            }
        }
        for (let j = 0; j < 4; j++) {
            const _x1 = minX + j * width + j * 33 - 16;
            const _x2 = _x1 + width + 16;
            if (x >= _x1 && x <= _x2) {
                info.j = j;
                break;
            }
        }
        return info
    }

}

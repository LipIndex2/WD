import { CfgGrowPass } from './../../config/CfgGrowPass';
import { CreateSMD, smartdata } from "data/SmartData";
import { DataBase } from "../../data/DataBase";
import { RoleData } from "modules/role/RoleData";
import { bit } from 'core/net/bit';

export class GrowPassResultData {
    Info: PB_SCGrowthFundInfo
}

export class GrowPassFlushData {
    @smartdata
    FlushInfo: boolean = false;
}

export class GrowPassData extends DataBase {
    public ResultData: GrowPassResultData;
    public FlushData: GrowPassFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(GrowPassFlushData);
        this.ResultData = new GrowPassResultData()
    }

    public setGrowPassInfo(data: PB_SCGrowthFundInfo) {
        this.ResultData.Info = data;
        this.FlushData.FlushInfo = !this.FlushData.FlushInfo
    }

    public get Info() {
        return this.ResultData.Info
    }

    //玩家等级
    public GetRoleLevel() {
        return RoleData.Inst().InfoRoleLevel;
    }

    public GetGrowPassCfg(type: number) {
        return CfgGrowPass.grow_pass_set.filter(cfg => {
            return cfg.type == type;
        });
    }

    //达到二阶段
    public IsTwoStage() {
        let lv = RoleData.Inst().InfoRoleLevel;
        let cfg = this.GetGrowPassCfg(0);
        if (lv > cfg[cfg.length - 1].level) {
            return true;
        }
        return false;
    }

    public GetListData(type: number) {
        let cfg = this.GetGrowPassCfg(type);
        let level = this.GetRoleLevel();
        let data = [];
        let isActive1 = this.IsActive(type * 3 + 1)
        let isActive2 = this.IsActive(type * 3 + 2)
        for (let i = 0; i < cfg.length; i++) {
            let fetchFlag0 = this.IsGetPrize(0, cfg[i].seq);
            let fetchFlag1 = this.IsGetPrize(1, cfg[i].seq);
            let fetchFlag2 = this.IsGetPrize(2, cfg[i].seq);
            let isShowWire = false
            if (level >= cfg[i].level && cfg[i + 1] && level < cfg[i + 1].level) {
                isShowWire = true;
            }
            data.push({
                cfg: cfg[i],
                isActive: [true, isActive1, isActive2],
                isFetch: [fetchFlag0, fetchFlag1, fetchFlag2],
                level: level,
                itemType: isShowWire
            });
        }
        return data;
    }

    public scrollListNum(data: any) {
        for (let i = 0; i < data.length; i++) {
            if (!data[i]) continue;
            if (data[i].level >= data[i].cfg.level) {
                if ((data[i].isActive[0] && !data[i].isFetch[0])) {
                    return i
                }
                if (data[i].isActive[1] && !data[i].isFetch[1]) {
                    return i
                }
                if (data[i].isActive[2] && !data[i].isFetch[2]) {
                    return i
                }
            } else {
                return i
            }
        }
        return data.length
    }
    public GetOtherCfg() {
        return CfgGrowPass.other[0];
    }

    //是否解锁
    public IsActive(type: number) {
        let activit = this.Info ? this.Info.activeFlag : 0;
        if (type == 0) {
            return true;
        }
        return bit.hasflag(activit, type)
    }

    //是否领取
    public IsGetPrize(type: number, seq: number) {
        let fetchFlag = this.Info ? this.Info.fetchFlag : [];
        return bit.hasflag(fetchFlag[type], seq)
    }

    //红点
    public GetAllRed() {
        let data = this.GetListData(0);
        let data1 = this.GetListData(1);
        let red1 = this.GetAwardRed(data);
        let red2 = this.GetAwardRed(data1);
        return red1 + red2;
    }

    GetAwardRed(data: any) {
        for (let i = 0; i < data.length; i++) {
            if (!data[i]) continue;
            if (data[i].level >= data[i].cfg.level) {
                if ((data[i].isActive[0] && !data[i].isFetch[0])) {
                    return 1
                }
                if (data[i].isActive[1] && !data[i].isFetch[1]) {
                    return 1
                }
                if (data[i].isActive[2] && !data[i].isFetch[2]) {
                    return 1
                }
            } else {
                return 0
            }
        }
        return 0;
    }


}

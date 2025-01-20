import { CfgHouZai, CfgHouZaiReward } from 'config/CfgHouZai';
import { LogError } from 'core/Debugger';
import { DataBase } from 'data/DataBase';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { CreateSMD, smartdata } from 'data/SmartData';
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { AdType } from 'modules/common/CommonEnum';
import { Mod } from 'modules/common/ModuleDefine';
import { RoleData } from 'modules/role/RoleData';

export class HouZaiTanXianCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCHouZhaiInfo, func: this.OnSCHouZhaiInfo }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.HouZai.View, HouZaiTanXianData.Inst().actInfo,
            HouZaiTanXianData.Inst().GetRemindNum.bind(HouZaiTanXianData.Inst()), "data"));
    }


    private OnSCHouZhaiInfo(protocol: PB_SCHouZhaiInfo) {
        LogError("后宅活动信息", protocol);
        HouZaiTanXianData.Inst().actInfo.data = protocol;
    }


}


export interface IHouZaiShopItemData {
    index: number;
    cfgs: CfgHouZaiReward[];
}

export class HouZaiActInfo {
    @smartdata
    data: PB_SCHouZhaiInfo;
    @smartdata
    click_buy_change: boolean = false;
}

export enum ActHouZaiItemState {
    Geted = -1,     //已领取
    Not = 0,        //未达成
    Can = 1,        //可领取
}

export class HouZaiTanXianData extends DataBase {

    actInfo: HouZaiActInfo;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.actInfo = CreateSMD(HouZaiActInfo);
    }


    GetRewardList(): IHouZaiShopItemData[] {
        let map: { [key: number]: IHouZaiShopItemData } = {};// new Map<number, IHouZaiShopItemData>();
        let result: IHouZaiShopItemData[] = [];
        CfgHouZai.reward_set.forEach(cfg => {
            if(cfg.item_type != 1 || RoleData.Inst().IsCanAD(AdType.act_hou_zai)){
                if (map[cfg.block_num]) {
                    map[cfg.block_num].cfgs.push(cfg);
                } else {
                    let item: IHouZaiShopItemData = {
                        index: cfg.block_num - 1,
                        cfgs: [cfg],
                    };
                    map[cfg.block_num] = item;
                    result.push(item)
                }
            }
        })
        return result;
    }

    GetActData(): PB_SCHouZhaiInfo {
        return this.actInfo.data;
    }

    // 1可操作，0未解锁，-1已领取
    GetItemState(cfg: CfgHouZaiReward): ActHouZaiItemState {
        if (this.actInfo.data == null) {
            return ActHouZaiItemState.Not;
        }
        if (this.actInfo.data.passBlock >= cfg.block_num) {
            return ActHouZaiItemState.Geted;
        }
        if (this.actInfo.data.passBlock + 1 < cfg.block_num) {
            return ActHouZaiItemState.Not;
        }
        if (cfg.level > 0 && this.actInfo.data.passRound < cfg.level) {
            return ActHouZaiItemState.Not;
        }
        return ActHouZaiItemState.Can;
    }

    //红点
    GetRemindNum(): number {
        let isOpen = ActivityData.Inst().IsOpen(ACTIVITY_TYPE.HouZai);
        if (!isOpen) {
            return 0;
        }

        let cfg = CfgHouZai.reward_set;
        for (let v of cfg) {
            if (this.GetItemState(v) == ActHouZaiItemState.Can) {
                return 1;
            }
        }
        return 0
    }

    public OnBuyChange() {
        this.actInfo.click_buy_change = !this.actInfo.click_buy_change;
    }
}


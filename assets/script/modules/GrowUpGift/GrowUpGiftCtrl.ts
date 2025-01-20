import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { GrowUpGiftData } from './GrowUpGiftData';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class GrowUpGiftCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCRaGrowGiftInfo, func: this.OnGrowGiftInfo }
        ]
    }
    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.GrowUpGift.View, GrowUpGiftData.Inst().FlushData, GrowUpGiftData.Inst().GetAllRed.bind(GrowUpGiftData.Inst())));
    }

    private OnGrowGiftInfo(data: PB_SCRaGrowGiftInfo) {
        GrowUpGiftData.Inst().OnGrowGiftInfo(data)
    }


}


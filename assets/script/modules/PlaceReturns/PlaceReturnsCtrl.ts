import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { PlaceReturnsData } from './PlaceReturnsData';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export enum PlaceReturnsType {
    FETCH_TIME_INFO = 2,
    FETCH_TIME = 3,
    FETCH_QUICK_INFO = 4,
    FETCH_QUICK = 5,
}

export class PlaceReturnsCtrl extends BaseCtrl {

    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_MainFBRewardInfo, func: this.OnPlaceReturnsResult }
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.PlaceReturns.View, PlaceReturnsData.Inst().ResultData, PlaceReturnsData.Inst().GetAllRed.bind(PlaceReturnsData.Inst()), "PlaceInfoFlush"));
    }

    private OnPlaceReturnsResult(data: PB_MainFBRewardInfo) {
        PlaceReturnsData.Inst().OnPlaceReturnsResult(data);
    }

    public SendPlaceReturnsReq(rep_type: PlaceReturnsType, param?: number[]) {
        let protocol = this.GetProtocol(PB_MainFBOper);
        protocol.operType = rep_type
        protocol.operParam = param ?? [];
        this.SendToServer(protocol);
    }

    public SendPlacePrizeInfo(rep_type: PlaceReturnsType) {
        this.SendPlaceReturnsReq(rep_type)
    }

}


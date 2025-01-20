import { LogError } from 'core/Debugger';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { RoleData } from 'modules/role/RoleData';
import { TerritoryConfig } from './TerritoryConfig';
import { TerritoryData } from './TerritoryData';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';
import { BagData } from 'modules/bag/BagData';
import { TYPE_PROTO_CARE } from 'core/net/ProtocolHelper';

export class TerritoryCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCTerritoryInfo, func: this.OnTerritoryInfo },
            { msgType: PB_SCTerritoryNeighbourInfo, func: this.OnTerritoryNeighbourInfo },
            { msgType: PB_SCTerritoryBotInfo, func: this.OnTerritoryBotInfo },
            { msgType: PB_SCTerritoryReportInfo, func: this.OnTerritoryReportInfo },
            { msgType: PB_SCTerritoryRedInfo, func: this.OnTerritoryRedInfo },
            { msgType: PB_SCRaPartsGiftInfo, func: this.OnRaPartsGiftInfo },
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.Territory.View, BagData.Inst().BagItemData, () => {
            let num = TerritoryData.Inst().GetRemindNum();
            return num;
        }, "OtherChange"));
    }

    public OnTerritoryInfo(protocol: PB_SCTerritoryInfo) {
        LogError("OnTerritoryInfo", protocol)
        TerritoryData.Inst().SetTerritoryInfo(protocol);
    }

    public OnTerritoryNeighbourInfo(protocol: PB_SCTerritoryNeighbourInfo) {
        LogError("OnTerritoryNeighbourInfo", protocol)
        TerritoryData.Inst().SetTerritoryNeighbourInfo(protocol);
    }

    public OnTerritoryBotInfo(protocol: PB_SCTerritoryBotInfo) {
        LogError("OnTerritoryBotInfo", protocol)
        TerritoryData.Inst().SetTerritoryBotInfo(protocol);
    }

    public OnTerritoryReportInfo(protocol: PB_SCTerritoryReportInfo) {
        LogError("OnTerritoryReportInfo", protocol)
        TerritoryData.Inst().SetTerritoryReportInfo(protocol);
    }

    public OnTerritoryRedInfo(protocol: PB_SCTerritoryRedInfo) {
        LogError("OnTerritoryRedInfo", protocol)
        TerritoryData.Inst().SetTerritoryRedInfo(protocol);
    }
    public OnRaPartsGiftInfo(protocol: PB_SCRaPartsGiftInfo) {
        LogError("OnRaPartsGiftInfo", protocol)
        TerritoryData.Inst().SetRaPartsGiftInfo(protocol);
    }
    

    public SendTerritoryReq(type: number, param: number[] = [], care?: TYPE_PROTO_CARE) {
        let protocol = this.GetProtocol(PB_CSTerritoryReq, care);
        protocol.type = type;
        protocol.param = param
        this.SendToServer(protocol);
    }

    public SendTerritoryReqInfo(uid?: number) {
        if (!uid) {
            uid = RoleData.Inst().InfoRoleId
        }
        this.SendTerritoryReq(TerritoryConfig.ReqType.info, [uid], {
            care: null,
            func: () => {
                TerritoryCtrl.Inst().SendTerritoryReq(TerritoryConfig.ReqType.info, [RoleData.Inst().InfoRoleId]);
            },
        });
    }

    public SendTerritoryReqNeighbour() {
        this.SendTerritoryReq(TerritoryConfig.ReqType.neighbour);
    }

    public SendTerritoryReqFetchItem(uid: number, index: number, num: number) {
        this.SendTerritoryReq(TerritoryConfig.ReqType.fetch_item, [uid, index, num]);
    }

    public SendTerritoryReqFetchReward() {
        this.SendTerritoryReq(TerritoryConfig.ReqType.fetch_reward);
    }

    public SendTerritoryReqBuy() {
        this.SendTerritoryReq(TerritoryConfig.ReqType.buy);
    }

    public SendTerritoryReqBotStatus() {
        this.SendTerritoryReq(TerritoryConfig.ReqType.bot_status);
    }

    public SendTerritoryReqRefreshNeighbour() {
        this.SendTerritoryReq(TerritoryConfig.ReqType.refresh_neighbour);
    }

    public SendTerritoryReqReport() {
        this.SendTerritoryReq(TerritoryConfig.ReqType.report);
    }

    public SendTerritoryReqRefreshItem() {
        this.SendTerritoryReq(TerritoryConfig.ReqType.refresh_item);
    }
    public SendTerritoryReqOpenUi() {
        this.SendTerritoryReq(TerritoryConfig.ReqType.open_ui);
    }
}
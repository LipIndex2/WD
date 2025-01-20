import { RoleData } from 'modules/role/RoleData';
import { LogError } from 'core/Debugger';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { ShopConfig } from './ShopConfig';
import { ShopData } from './ShopData';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { Mod } from 'modules/common/ModuleDefine';

export class ShopCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCShopBoxInfo, func: this.OnShopBoxInfo },
            { msgType: PB_SCShopInfo, func: this.OnShopInfo },
            { msgType: PB_SCDailyBuyInfo, func: this.OnDailyBuyInfo },
            { msgType: PB_SCRaBarrierPackInfo, func: this.OnBarrierPackInfo },
            { msgType: PB_SCRaShopGiftInfo, func: this.OnSpecialOfferGiftInfo },
        ]
    }

    protected initCtrl() {
        // this.handleCollector.Add(RemindRegister.Create(Mod.Shop.View, RoleData.Inst().FlushData, ShopData.Inst().GetAllRed.bind(ShopData.Inst()), "FlushAdInfo"));
        this.handleCollector.Add(RemindRegister.Create(Mod.Shop.View, ShopData.Inst().FlushData, ShopData.Inst().GetAllRed.bind(ShopData.Inst()), "FlushBoxInfo"));
    }

    public OnShopBoxInfo(protocol: PB_SCShopBoxInfo) {
        LogError("OnShopBoxInfo", protocol)
        ShopData.Inst().SetShopBoxInfo(protocol);
    }

    public OnShopInfo(protocol: PB_SCShopInfo) {
        LogError("OnShopInfo", protocol)
        ShopData.Inst().SetShopInfo(protocol);
    }

    public OnDailyBuyInfo(protocol: PB_SCDailyBuyInfo) {
        LogError("OnDailyBuyInfo", protocol)
        ShopData.Inst().SetDailyBuyInfo(protocol);
    }
    
    public OnBarrierPackInfo(protocol: PB_SCRaBarrierPackInfo) {
        LogError("OnBarrierPackInfo", protocol)
        ShopData.Inst().SetBarrierPackInfo(protocol);
    }

    public OnSpecialOfferGiftInfo(protocol: PB_SCRaShopGiftInfo) {
        ShopData.Inst().OnSpecialOfferGiftInfo(protocol);
    }

    public SendShopBoxReq(type: number, param: number[] = []) {
        let protocol = this.GetProtocol(PB_CSShopBoxReq);
        protocol.reqType = type;
        protocol.paramList = param;
        this.SendToServer(protocol);
    }

    public SendShopBoxReqOpen(index: number) {
        this.SendShopBoxReq(ShopConfig.BoxReqType.open, [index]);
    }

    public SendShopBoxReqInfo() {
        this.SendShopBoxReq(ShopConfig.BoxReqType.info);
    }

    public SendShopReq(type: number, param: number[] = []) {
        let protocol = this.GetProtocol(PB_CSShopReq);
        protocol.reqType = type;
        protocol.paramList = param;
        this.SendToServer(protocol);
    }

    public SendShopReqBuy(seq: number, num: number) {
        this.SendShopReq(ShopConfig.ShopReqType.buy, [seq, num]);
    }

    public SendShopReqInfo() {
        this.SendShopReq(ShopConfig.ShopReqType.info);
    }

    public SendDailyBuyReq(type: number, param: number[] = []) {
        let protocol = this.GetProtocol(PB_CSDailyBuyReq);
        protocol.reqType = type;
        protocol.paramList = param;
        this.SendToServer(protocol);
    }

    public SendDailyBuyReqBuy(index: number) {
        this.SendDailyBuyReq(ShopConfig.DiscountReqType.buy, [index]);
    }

    public SendDailyBuyReqRefresh() {
        this.SendDailyBuyReq(ShopConfig.DiscountReqType.refresh);
    }

    public SendDailyBuyReqInfo() {
        this.SendDailyBuyReq(ShopConfig.DiscountReqType.info);
    }
}
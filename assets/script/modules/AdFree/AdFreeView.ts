import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { ItemCell } from "modules/extends/ItemCell";
import { UH } from "../../helpers/UIHelper";
import { Mod } from "modules/common/ModuleDefine";
import { AdFreeData } from "./AdFreeData";
import { OrderCtrl, Order_Data, RechargeType } from "modules/recharge/OrderCtrl";
import { config } from "process";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { ViewManager } from "manager/ViewManager";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ObjectPool } from "core/ObjectPool";
import { ResPath } from "utils/ResPath";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";

@BaseView.registView
export class AdFreeView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "AdFree",
        ViewName: "AdFreeView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        List: <fgui.GList>null,
        BtnBuy: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "GiftCell", ExtendsClass: GiftCell },
    ];
    private spShow: UISpineShow = undefined;
    private _key_check_buy: string;
    private listData: any[] = [];
    InitData() {
        this.AddSmartDataCare(AdFreeData.Inst().FlushData, this.FulshData.bind(this), "FlushInfo");

        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);

        this._key_check_buy = Mod.AdFree.View + "-1";

        this.FulshData();
    }

    FulshData() {
        let isBuy = AdFreeData.Inst().GetIsBuyAdFree();
        if (isBuy) {
            ViewManager.Inst().CloseView(AdFreeView);
            return;
        }
        let cfg = AdFreeData.Inst().GetPrivilegeCfg();

        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (cfg.price / 10));
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = cfg.item;
        this.viewNode.List.numItems = cfg.item.length;
    }

    private itemRenderer(index: number, item: GiftCell) {
        item.SetData(this.listData[index]);
    }

    OnClickBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let cfg = AdFreeData.Inst().GetPrivilegeCfg();
        let cfg_word = SettingUsertServeData.Inst().GetWordDes(17);
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(cfg.seq, RechargeType.BUY_TYPE_AD_PASS, cfg.price, cfg.price, name);
        OrderCtrl.generateOrder(order_data);

    }
    InitUI() {
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine(`mianguanggao/mianguanggao`), true, (obj: any) => {
            obj.setPosition(400, -590);
            this.view._container.insertChild(obj, 2);
        });
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
    }
}

export class GiftCell extends BaseItem {
    protected viewNode = {
        ItemCell: <ItemCell>null,
        Num: <fgui.GTextField>null,
        HeroNum: <fgui.GTextField>null,
    };
    public SetData(data: any) {
        let item_call = Item.Create(data, { is_click: true });
        this.viewNode.ItemCell.SetData(item_call);

        let cfg = Item.GetConfig(data.item_id);
        let isHero = cfg.item_type == 3
        if (isHero) {
            UH.SetText(this.viewNode.Num, cfg.name);
            this.viewNode.Num.fontSize = 37;
            UH.SetText(this.viewNode.HeroNum, "x" + data.num);
        } else {
            UH.SetText(this.viewNode.Num, data.num);
            this.viewNode.Num.fontSize = 40;
            UH.SetText(this.viewNode.HeroNum, "");
        }
    }
}
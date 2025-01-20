
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { CurrencyShow } from "modules/extends/Currency";
import { HeroData } from "modules/hero/HeroData";
import { UH } from "../../helpers/UIHelper";
import { ShopCtrl } from "./ShopCtrl";
import { ShopViewMainPanelDiscountHeroItem } from "./ShopViewMainPanelDiscount";

@BaseView.registView
export class ShopBuyHeroView extends BaseView {
    private param_t: any

    protected viewRegcfg = {
        UIPackName: "ShopBuyHero",
        ViewName: "ShopBuyHeroView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        NameShow: <CurrencyShow>null,
        DescShow: <CurrencyShow>null,
        BtnBuy: <fgui.GButton>null,
        ItemShow: <ShopViewMainPanelDiscountHeroItem>null,
        ItemShowNum: <fgui.GTextField>null,
    };

    protected extendsCfg = [
        { ResName: "ItemHero", ExtendsClass: ShopViewMainPanelDiscountHeroItem },
    ];


    InitData(param_t: { info: any, index: number }) {
        this.viewNode.Board.SetData(new BoardData(ShopBuyHeroView));
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);

        if (param_t && param_t.info) {
            this.param_t = param_t
            let info = param_t.info
            let hero_id = HeroData.Inst().GetDebrisHeroId(info.itemId);
            let co = HeroData.Inst().GetHeroBaseCfg(hero_id);

            this.viewNode.BtnBuy.icon = fgui.UIPackage.getItemURL("CommonCurrency", `Big${info.consumeId}`);
            this.viewNode.BtnBuy.title = `${info.consumeNum}`
            UH.SetText(this.viewNode.NameShow, Item.GetName(info.itemId))
            UH.SetText(this.viewNode.DescShow, co ? co.hero_word : "")
            
            this.viewNode.ItemShow.SetData({ itemId: info.itemId, num: info.itemNum })
            UH.SetText(this.viewNode.ItemShowNum, "x" + info.itemNum)
        }
    }

    OnClickBuy() {
        if (this.param_t && this.param_t.info) {
            if (BagData.Inst().IsItemEnough(this.param_t.info.consumeId, this.param_t.info.consumeNum)) {
                ViewManager.Inst().CloseView(ShopBuyHeroView)
                ShopCtrl.Inst().SendDailyBuyReqBuy(this.param_t.index);
            }
        }
    }
}

import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";

@BaseView.registView
export class FishShopInfoView extends BaseView {
    private seq: number;
    private cur_num: number
    private max_num: number
    private price_per: number

    protected viewRegcfg = {
        UIPackName: "FishShopInfo",
        ViewName: "FishShopInfoView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: false,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnBuy: <fgui.GButton>null,
        BtnAdd: <fgui.GButton>null,
        BtnSub: <fgui.GButton>null,
        BtnMax: <fgui.GButton>null,
        BtnMin: <fgui.GButton>null,

        NameShow: <fgui.GTextField>null,
        DescShow: <fgui.GTextField>null,
        AttrShow: <fgui.GTextField>null,
        NumShow: <fgui.GTextField>null,
        CellShow: <ItemCell>null,

        PriceShow: <fgui.GTextField>null,
        PriceSp: <fgui.GLoader>null,
    };

    // protected extendsCfg = [
    //     { ResName: "HeroItem", ExtendsClass: TodayGainViewHeroItem },
    // ]

    InitData(seq: number) {
        this.viewNode.Board.SetData(new BoardData(FishShopInfoView));

        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
        this.viewNode.BtnAdd.onClick(this.OnClickAdd, this);
        this.viewNode.BtnSub.onClick(this.OnClickSub, this);
        this.viewNode.BtnMax.onClick(this.OnClickMax, this);
        this.viewNode.BtnMin.onClick(this.OnClickMin, this);

        this.seq = seq
    }

    InitUI() {
        this.FlushShow()
        this.FlushNum()
    }

    FlushShow() {
        let co_shop = FishData.Inst().CfgShopBySeq(this.seq)
        this.price_per = 0
        if (co_shop) {
            this.price_per = co_shop.num2
            this.viewNode.CellShow.SetData(Item.Create({ itemId: co_shop.item_id }, { is_num: false, is_click: false }))
            UH.SetText(this.viewNode.NameShow, Item.GetName(co_shop.item_id))
            UH.SetText(this.viewNode.DescShow, Item.GetDesc(co_shop.item_id))
            UH.SetIcon(this.viewNode.PriceSp, Item.GetIconId(co_shop.coin_id), ICON_TYPE.ITEM)

            let co_bait = FishData.Inst().CfgBaitInfoByItemId(co_shop.item_id)
            if (co_bait) {
                let name = ""
                switch (co_bait.bait_effect) {
                    case 1:
                        name = Language.Fish.TypeShow[co_bait.parm1] ?? ""
                        break;
                    case 2:
                        let co_fish = FishData.Inst().CfgFishInfoByFishId(co_bait.parm1)
                        name = co_fish ? co_fish.name : ""
                        break;
                    case 3:
                        name = Language.Fish.QuaShow[co_bait.parm1] ?? ""
                        break;
                }
                UH.SetText(this.viewNode.AttrShow, TextHelper.Format(Language.Fish.BaitInfo.AttrShowBait[co_bait.bait_effect], name, `${co_bait.parm2 > 0 ? "+" : "-"}${Math.abs(co_bait.parm2) / 100}`))
            }

            this.cur_num = 1
            this.max_num = Math.min(99, Math.floor(BagData.Inst().GetItemNum(co_shop.coin_id) / co_shop.num2))
            this.max_num = Math.max(1, this.max_num)
        }
    }

    FlushNum() {
        UH.SetText(this.viewNode.NumShow, this.cur_num)
        UH.SetText(this.viewNode.PriceShow, this.cur_num * this.price_per)
    }

    OnClickAdd() {
        if (this.cur_num < this.max_num) {
            this.cur_num++
            this.FlushNum()
        }
    }

    OnClickSub() {
        if (this.cur_num > 1) {
            this.cur_num--
            this.FlushNum()
        }
    }

    OnClickMax() {
        this.cur_num = this.max_num
        this.FlushNum()
    }

    OnClickMin() {
        this.cur_num = 1
        this.FlushNum()
    }

    OnClickBuy() {
        ViewManager.Inst().CloseView(FishShopInfoView)
        FishCtrl.Inst().SendRoleFishReqBuy(this.seq, this.cur_num)
    }
}

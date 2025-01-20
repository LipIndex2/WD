
import { GetCfgValue } from "config/CfgCommon";
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { COLORS } from "modules/common/ColorEnum";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { FlyIcon } from "modules/extends/FlyIcon";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";

@BaseView.registView
export class FishBoxInfoView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishBoxInfo",
        ViewName: "FishBoxInfoView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnType: <fgui.GButton>null,

        BgType: <fgui.GImage>null,
        TypeList: <fgui.GList>null,
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ShowItem", ExtendsClass: FishBoxInfoViewShowItem },
        { ResName: "ButtonShow", ExtendsClass: FishBoxInfoViewShowButton },
    ]

    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishBoxInfoView));
        this.viewNode.Board.DecoShow(true);

        this.viewNode.BtnType.onClick(this.OnClickType, this);
        this.viewNode.ShowList.setVirtual()

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo", "FlushFishListInfo", "SelFishType");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushMapSel.bind(this), "SelFishType");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushFlyIcon.bind(this), "SellPrice");
    }

    InitUI() {
        this.FlushInfo()
        this.FlushShow()
    }

    FlushShow() {
        let type_list = FishData.Inst().GetTypeShowList()
        this.viewNode.TypeList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.TypeList.numItems = type_list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(FishData.Inst().GetTypeShowList()[index]);
    }

    private itemRenderer2(index: number, item: any) {
        item.SetData(FishData.Inst().GetBoxInfoShowList()[index]);
    }

    FlushInfo() {
        this.viewNode.BtnType.title = Language.Fish.TypeShow[FishData.Inst().SelFishType]

        let show_list = FishData.Inst().GetBoxInfoShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer2.bind(this)
        this.viewNode.ShowList.numItems = show_list.length;
    }

    FlushMapSel() {
        if (this.viewNode.BtnType.selected) {
            this.viewNode.BtnType.selected = false
            this.OnClickType()
        }
    }

    private _arr_coin: FlyIcon[] = [];
    FlushFlyIcon() {
        let price = FishData.Inst().SellPrice
        if (price > 0) {
            let d = Math.floor(price / 5)//
            d = d == 0 ? 1 : d
            for (let index = 1; index < 6; index++) {
                if (price > 0) {
                    let flyIcon = this._arr_coin[index];
                    if (!flyIcon) {
                        flyIcon = this._arr_coin[index] = <FlyIcon>fgui.UIPackage.createObject("CommonWidgets", "FlyIcon", FlyIcon)
                        flyIcon.scaleX = 1.5
                        flyIcon.scaleY = 1.5
                        this.addChild(flyIcon)
                    }
                    if (price - d < 0) {
                        flyIcon.PlayTween(price, 400, 800, Item.GetIconId(FishData.Inst().CfgOtherFishCoin))
                    } else {
                        flyIcon.PlayTween(+d, 400, 800, FishData.Inst().CfgOtherFishCoin)
                    }
                    price = price - d
                }
            }
        }
    }

    OnClickType() {
        this.viewNode.BgType.visible = this.viewNode.BtnType.selected
        this.viewNode.TypeList.visible = this.viewNode.BtnType.selected
    }
}

export class FishBoxInfoViewShowItem extends BaseItem {
    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        ScoreShow: <fgui.GTextField>null,
        LengthShow: <fgui.GTextField>null,
        QuaSp: <fgui.GLoader>null,
        FishIcon: <fgui.GLoader>null,
        BtnSell: <fgui.GButton>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.viewNode.BtnSell.onClick(this.OnClickSell, this);
    }

    SetData(data: any) {
        super.SetData(data)

        let co = data.co
        let info = data.info
        UH.SetText(this.viewNode.NameShow, co.name)
        this.viewNode.NameShow.color = GetCfgValue(COLORS, `FishQua${Item.GetColor(co.item_id)}`)
        UH.SetText(this.viewNode.ScoreShow, TextHelper.Format(Language.Fish.BoxInfo.ScoreShow, Math.floor(co.score * info.fishLen / 10)))
        UH.SetText(this.viewNode.LengthShow, TextHelper.Format(Language.Fish.BoxInfo.LengthShow, info.fishLen / 100))
        UH.SpriteName(this.viewNode.QuaSp, "FishBoxInfo", `PinZhi${FishData.Inst().GetBoxInfoLengthQua(co, info.fishLen)}`)
        UH.SetIcon(this.viewNode.FishIcon, Item.GetIconId(co.item_id), ICON_TYPE.ITEM)
    }

    OnClickSell() {
        let info = this._data.info
        if (info) {
            let co_fish = FishData.Inst().CfgFishInfoByFishId(info.fishId)
            if (co_fish) {
                let sell = FishData.Inst().GetBoxInfoLengthSell(co_fish, info.fishLen)
                FishData.Inst().SellPrice = sell[0].num
            }
        }
        FishCtrl.Inst().SendRoleFishReqSellFish(info.fishId)
    }
}

export class FishBoxInfoViewShowButton extends BaseItemGB {
    protected viewNode = {
        title: <fgui.GTextField>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.onClick(this.OnClickType, this);
    }

    SetData(data: any) {
        super.SetData(data)
        UH.SetText(this.viewNode.title, data.name)
    }

    OnClickType() {
        FishData.Inst().SelFishType = this._data.type
    }
}
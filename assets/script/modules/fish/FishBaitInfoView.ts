
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";

@BaseView.registView
export class FishBaitInfoView extends BaseView {
    private baitId: number;

    protected viewRegcfg = {
        UIPackName: "FishBaitInfo",
        ViewName: "FishBaitInfoView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: false,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnChange: <fgui.GButton>null,

        NameShow: <fgui.GTextField>null,
        DescShow: <fgui.GTextField>null,
        AttrShow: <fgui.GTextField>null,
        CellShow: <ItemCell>null,
    };

    // protected extendsCfg = [
    //     { ResName: "HeroItem", ExtendsClass: TodayGainViewHeroItem },
    // ]

    InitData(bait_id: number) {
        this.viewNode.Board.SetData(new BoardData(FishBaitInfoView));

        this.viewNode.BtnChange.onClick(this.OnClickChange, this);

        this.baitId = bait_id
    }

    InitUI() {
        this.FlushShow()
    }

    FlushShow() {
        let co_bait = FishData.Inst().CfgBaitInfoByBaitId(this.baitId)
        if (co_bait) {
            this.viewNode.CellShow.SetData(Item.Create({ itemId: co_bait.item_id }, { is_num: false, is_click: false }))
            UH.SetText(this.viewNode.NameShow, Item.GetName(co_bait.item_id))
            UH.SetText(this.viewNode.DescShow, Item.GetDesc(co_bait.item_id))
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

            let can_change = 0 == this.baitId || BagData.Inst().GetItemNum(co_bait.item_id) > 0
            this.viewNode.BtnChange.grayed = !can_change
            this.viewNode.BtnChange.touchable = can_change
        }
    }

    OnClickChange() {
        ViewManager.Inst().CloseView(FishBaitInfoView)
        FishCtrl.Inst().SendRoleFishReqSetBait(this.baitId)
    }
}

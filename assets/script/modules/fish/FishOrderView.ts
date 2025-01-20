
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { COLORS } from "modules/common/ColorEnum";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { CurrencyShow } from "modules/extends/Currency";
import { ItemCell } from "modules/extends/ItemCell";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishConfig } from "./FishConfig";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";
import { FishRewardView } from "./FishRewardView";

@BaseView.registView
export class FishOrderView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishOrder",
        ViewName: "FishOrderView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        CurrencyShow: <CurrencyShow>null,
        ShowList: <fgui.GList>null,
        TimeShow: <TimeMeter>null,
    };

    protected extendsCfg = [
        { ResName: "ShowItem", ExtendsClass: FishOrderViewShowItem },
    ]

    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishOrderView));
        this.viewNode.Board.DecoShow(true);

        this.viewNode.CurrencyShow.SetCurrency(FishData.Inst().CfgOtherRefreshTime, true);

        this.viewNode.TimeShow.SetOutline(true, COLORS.Brown, 3)

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo", "FlushTaskInfo");
    }

    InitUI() {
        this.FlushInfo()
        this.FlushTimeShow()
    }

    CloseCallBack() {
        this.viewNode.TimeShow.CloseCountDownTime()
    }

    FlushInfo() {
        let show_list = FishData.Inst().GetOrderShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = show_list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(FishData.Inst().GetOrderShowList()[index]);
    }

    FlushTimeShow() {
        this.viewNode.TimeShow.CloseCountDownTime()
        if (TimeCtrl.Inst().tomorrowStarTime > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.StampTime(TimeCtrl.Inst().tomorrowStarTime, TimeFormatType.TYPE_TIME_0, Language.Fish.Order.TimeShow)
            this.viewNode.TimeShow.SetCallBack(this.FlushTimeShow.bind(this))
        }
        else {
            this.viewNode.TimeShow.SetTime("")
        }
    }
}

export class FishOrderViewShowItem extends BaseItem {
    protected viewNode: { [key: string]: any } = {
        NameShow: <fgui.GTextField>null,
        NumShow: <fgui.GTextField>null,
        ProgressShow: <fgui.GTextField>null,
        Geted: <fgui.GTextField>null,
        IconSp: <fgui.GLoader>null,
        BtnGet: <fgui.GButton>null,
        BtnFlush: <fgui.GButton>null,
        CellShow: <ItemCell>null,

        StarShow1: <fgui.GImage>null,
        StarShow2: <fgui.GImage>null,
        StarShow3: <fgui.GImage>null,
        StarShow4: <fgui.GImage>null,
        StarShow5: <fgui.GImage>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.viewNode.BtnGet.onClick(this.OnClickGet, this);
        this.viewNode.BtnFlush.onClick(this.OnClickFlush, this);
    }

    SetData(data: any) {
        super.SetData(data)

        let co = data.co
        let info = data.info
        if (co) {
            this.viewNode.BtnGet.visible = 0 == info.isFetch
            this.viewNode.Geted.visible = 1 == info.isFetch
            UH.SetText(this.viewNode.NameShow, co.dec)
            UH.SetText(this.viewNode.NumShow, TextHelper.Format(Language.Fish.Order.NumShow, co.parm1))
            UH.SetText(this.viewNode.ProgressShow, 1 == info.isFetch ? "" : TextHelper.Format(Language.Fish.Order.ProgressShow, info.processNum, co.parm1))
            UH.SetIcon(this.viewNode.IconSp, co.icon, ICON_TYPE.ITEM)
            this.viewNode.CellShow.SetData(Item.Create(co.reward[0], { is_num: true }))
            for (let i = 1; i <= FishConfig.ORDER_STAR_MAX; i++) {
                this.viewNode[`StarShow${i}`].visible = co.order_star >= i
            }

            if (0 == info.isFetch) {
                this.viewNode.BtnGet.grayed = info.processNum < co.parm1
                this.viewNode.BtnGet.touchable = info.processNum >= co.parm1
            }
            this.viewNode.BtnFlush.visible = 0 == info.isFetch
        }
    }

    OnClickGet() {
        FishCtrl.Inst().SendRoleFishReqTaskReward(this._data.index)

        if (this._data.co) {
            ViewManager.Inst().OpenView(FishRewardView, this._data.co.reward[0])
        }
    }

    OnClickFlush() {
        if (BagData.Inst().GetItemNum(FishData.Inst().CfgOtherRefreshTime) < 1) {
            PublicPopupCtrl.Inst().ItemNotEnoughNotice(FishData.Inst().CfgOtherRefreshTime)
            return
        }
        FishCtrl.Inst().SendRoleFishReqFlushTask(this._data.index)
    }
}


import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { CommonId, ICON_TYPE, ITEM_SHOW_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { CurrencyShow, ExpShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { ItemCell } from "modules/extends/ItemCell";
import { RedPoint } from "modules/extends/RedPoint";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { DeepCeleCtrl } from "./DeepCeleCtrl";
import { DeepCeleData } from "./DeepCeleData";

@BaseView.registView
export class DeepCeleView extends BaseView {
    private tabCtrler: fgui.Controller
    private selDay: number
    private sp_show: UISpineShow = undefined;

    protected viewRegcfg = {
        UIPackName: "DeepCele",
        ViewName: "DeepCeleView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        OpenAudio: AudioTag.TanChuJieMian,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,

        parent: <fgui.GComponent>null,
        TitleShow: <fgui.GTextField>null,

        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,

        BtnClose: <fgui.GButton>null,

        TaskList: <fgui.GList>null,
        TaskDayList: <fgui.GList>null,
        ExchangeList: <fgui.GList>null,
        TimeShow1: <TimeMeter>null,
        TimeShow2: <TimeMeter>null,
    };

    protected extendsCfg = [
        { ResName: "TaskItem", ExtendsClass: DeepCeleViewTaskItem },
        { ResName: "ExchangeItem", ExtendsClass: DeepCeleViewExchangeItem },
        { ResName: "DayItem", ExtendsClass: DeepCeleViewDayItem },
        // { ResName: "ButtonMod", ExtendsClass: DeepCeleViewModButton },
    ]
    listData: any[];
    listData2: any[];

    InitData() {
        this.tabCtrler = this.view.getController("TabState");

        this.viewNode.BtnClose.onClick(this.OnClickClose.bind(this));

        this.viewNode.TaskDayList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.TaskDayList.setVirtual();
        this.viewNode.TaskDayList.on(fgui.Event.CLICK_ITEM, this.OnClickDayItem, this)

        this.viewNode.TaskList.setVirtual();
        this.viewNode.ExchangeList.setVirtual();

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.CelePoint, true);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);

        this.AddSmartDataCare(DeepCeleData.Inst().FlushData, this.FlushTaskInfo.bind(this), "FlushTaskInfo");
        this.AddSmartDataCare(DeepCeleData.Inst().FlushData, this.FlushTaskBuyInfo.bind(this), "FlushTaskBuyInfo");

        this.selDay = DeepCeleData.Inst().ActOpenDay - 1


        let stamp = DeepCeleData.Inst().GeTimeStampAct()
        let effectPath
        if (stamp && stamp.inside_res_id) {
            effectPath = `xianshihuodong/${stamp.inside_res_id}/${stamp.inside_res_id}`;

        } else {
            effectPath = "shenyuanhuiyi/shenyuanhuiyi";
            // UH.SetText(this.viewNode.TitleShow, DeepCeleData.Inst().CfgCeremonyActOtherItemName())
        }
        let name = stamp ? stamp.name : DeepCeleData.Inst().CfgCeremonyActOtherItemName()
        UH.SetText(this.viewNode.TitleShow, name)

        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.Spine(effectPath), true, (obj: any) => {
            this.viewNode.parent._container.insertChild(obj, 1);
        });

        DeepCeleCtrl.Inst().SendTaskInfo()
    }

    InitUI() {
        this.FlushTaskBuyInfo()
        this.FlushTimeShow()

        if (Math.min(this.selDay, DeepCeleData.Inst().CfgCeremonyActOtherTime() - 1) > 4) {
            this.FlushFifthDayInfo()
            this.viewNode.TaskDayList.selectedIndex = 4;
        } else {
            this.FlushTaskInfo()
            this.viewNode.TaskDayList.selectedIndex = Math.min(this.selDay, DeepCeleData.Inst().CfgCeremonyActOtherTime() - 1);
        }


    }

    CloseCallBack() {
        this.viewNode.TimeShow1.CloseCountDownTime()
        this.viewNode.TimeShow2.CloseCountDownTime()

        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
        }
    }

    FlushTaskInfo() {
        let list = DeepCeleData.Inst().GetMissionShowList(Math.min(this.selDay + 1, DeepCeleData.Inst().CfgCeremonyActOtherTime()), true)
        this.viewNode.TaskList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = list;
        this.viewNode.TaskList.numItems = list.length;
        this.viewNode.TaskDayList.numItems = DeepCeleData.Inst().CfgCeremonyActOtherTime()
    }

    private itemRenderer(index: number, item: DeepCeleViewTaskItem) {
        item.SetData(this.listData[index]);
    }

    FlushFifthDayInfo() {
        this.selDay = 4;
        let list = DeepCeleData.Inst().GetMissionShowList(5, true)
        this.viewNode.TaskList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = list;
        this.viewNode.TaskList.numItems = list.length;
        this.viewNode.TaskDayList.numItems = DeepCeleData.Inst().CfgCeremonyActOtherTime()
    }

    FlushTaskBuyInfo() {
        let list = DeepCeleData.Inst().GetExchangeShowList()
        this.viewNode.ExchangeList.itemRenderer = this.itemRenderer2.bind(this);
        this.listData2 = list;
        this.viewNode.ExchangeList.numItems = list.length;
    }
    private itemRenderer2(index: number, item: DeepCeleViewExchangeItem) {
        item.SetData(this.listData2[index]);
    }

    private FlushTimeShow() {
        let end_time = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DeepCele) - TimeCtrl.Inst().ServerTime;
        this.viewNode.TimeShow1.visible = end_time > 0
        this.viewNode.TimeShow2.visible = end_time > 0
        this.viewNode.TimeShow1.CloseCountDownTime()
        this.viewNode.TimeShow2.CloseCountDownTime()
        if (end_time > 0) {
            this.viewNode.TimeShow1.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.TimeShow1.TotalTime(end_time, TimeFormatType.TYPE_TIME_4, Language.DeepCele.TimeShow);
            this.viewNode.TimeShow2.TotalTime(end_time, TimeFormatType.TYPE_TIME_4);
        }
    }

    private renderListItem(index: number, item: DeepCeleViewDayItem) {
        item.SetData(index);
    }

    OnClickDayItem() {
        this.selDay = this.viewNode.TaskDayList.selectedIndex;
        this.FlushTaskInfo();
    }

    OnClickClose() {
        ViewManager.Inst().CloseView(DeepCeleView)
    }
}

// export class DeepCeleViewModButton extends BaseItemGB {
//     private sp_show: UISpineShow = undefined;

//     protected viewNode = {
//         parent: <fgui.GComponent>null,
//     };

//     onConstruct() {
//         super.onConstruct()
//         this.sp_show = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208051"), true, (obj: any) => {
//             this.viewNode.parent._container.insertChild(obj, 1);
//         });
//     }

//     protected onDestroy(): void {
//         super.onDestroy();
//         if (this.sp_show) {
//             ObjectPool.Push(this.sp_show);
//         }
//     }
// }

export class DeepCeleViewTaskItem extends BaseItem {
    protected viewNode = {
        IconShow: <fgui.GLoader>null,
        DescShow: <fgui.GTextField>null,
        ItemNum: <fgui.GTextField>null,
        BtnGet: <fgui.GButton>null,
        ProgressShow: <fgui.GProgressBar>null,
        MaskShow: <fgui.GGroup>null,
        ItemCell: <ItemCell>null,
    };

    onConstruct() {
        super.onConstruct()
        this.viewNode.BtnGet.onClick(this.OnClickGet.bind(this));
    }

    SetData(data: any) {
        super.SetData(data)

        let item0 = data.item[0]
        let geted = DeepCeleData.Inst().GetMissionGeted(data.seq)
        let value = geted ? data.pram : DeepCeleData.Inst().GetMissionProgress(data.type)

        if (item0) {
            UH.SetIcon(this.viewNode.IconShow, Item.GetIconId(item0.item_id), ICON_TYPE.ITEM)
            UH.SetText(this.viewNode.ItemNum, item0.num)
        }
        UH.SetText(this.viewNode.DescShow, data.word)
        this.viewNode.ItemCell.SetData(Item.Create(item0, { is_num: true }));

        this.viewNode.ProgressShow.value = value;
        this.viewNode.ProgressShow.max = data.pram;
        this.viewNode.MaskShow.visible = geted;
        this.viewNode.BtnGet.grayed = value < data.pram
        this.viewNode.BtnGet.visible = !geted
    }

    OnClickGet() {
        let geted = DeepCeleData.Inst().GetMissionGeted(this._data.seq)
        let value = DeepCeleData.Inst().GetMissionProgress(this._data.type);
        if (geted) {
            PublicPopupCtrl.Inst().Center(Language.DeepCele.TaskFetchTip);
            return
        } else if (value < this._data.pram) {
            PublicPopupCtrl.Inst().Center(Language.ServiceSevenDay.TaskTip);
            return
        } else {
            DeepCeleCtrl.Inst().SendFetch(this._data.seq)
        }
    }
}

export class DeepCeleViewDayItem extends BaseItemGB {
    protected viewNode = {
        Lock: <fgui.GImage>null,
        title: <fgui.GTextField>null,
        redPoint: <RedPoint>null,
    };
    public SetData(data: number) {
        let day = DeepCeleData.Inst().ActOpenDay;
        this.enabled = data < day;
        // this.viewNode.Lock.visible = data >= day;
        UH.SetText(this.viewNode.title, data + 1);
        if (data < day) {
            let num = DeepCeleData.Inst().GetDayTaskRed(data + 1)
            this.viewNode.redPoint.SetNum(num)
        }
    }
}

export class DeepCeleViewExchangeItem extends BaseItem {
    protected viewNode = {
        IconShow: <fgui.GLoader>null,
        PieceShow: <fgui.GImage>null,
        SShow: <fgui.GImage>null,
        ItemNum: <fgui.GTextField>null,
        TimesShow: <fgui.GTextField>null,
        BtnExchange: <fgui.GButton>null,
        MaskShow: <fgui.GGroup>null,
        ItemCell: <ItemCell>null,
    };

    onConstruct() {
        super.onConstruct()
        this.viewNode.BtnExchange.onClick(this.OnClickExchange.bind(this));
    }

    SetData(data: any) {
        super.SetData(data)

        let num = DeepCeleData.Inst().GetExchangeNum(data.seq)
        let geted = data.quota_num == num

        this.viewNode.ItemCell.SetData(Item.Create({ itemId: data.item_id, num: data.item_num }, { is_num: true }));

        UH.SetIcon(this.viewNode.IconShow, Item.GetIconId(data.item_id), ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.item_id) ? ICON_TYPE.ROLE : ICON_TYPE.ITEM)
        // this.viewNode.PieceShow.visible = ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.item_id)
        // this.viewNode.SShow.visible = ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.item_id) && ItemColor.Purple == Item.GetColor(data.item_id)
        // UH.SetText(this.viewNode.ItemNum, data.item_num)
        UH.SetText(this.viewNode.TimesShow, TextHelper.Format(Language.DeepCele.ExchangeTimesShow, data.quota_num - num))
        this.viewNode.MaskShow.visible = geted;

        this.viewNode.BtnExchange.grayed = num >= data.quota_num
        this.viewNode.BtnExchange.visible = !geted
        this.viewNode.BtnExchange.icon = EGLoader.IconGeterFuncs[ICON_TYPE.ITEM](Item.GetIconId(DeepCeleData.Inst().CfgCeremonyActOtherItemExchange()));
        this.viewNode.BtnExchange.title = data.exchange_num

    }

    OnClickExchange() {
        let num = DeepCeleData.Inst().GetExchangeNum(this._data.seq)
        if (num >= this._data.quota_num) {
            PublicPopupCtrl.Inst().Center(Language.DeepCele.ExchangeTip1);
            return
        } else if (BagData.Inst().GetItemNum(DeepCeleData.Inst().CfgCeremonyActOtherItemExchange()) < this._data.exchange_num) {
            PublicPopupCtrl.Inst().Center(Language.DeepCele.ExchangeTip2);
            return
        } else {
            DeepCeleCtrl.Inst().SendBuy(this._data.seq)
        }
    }
}
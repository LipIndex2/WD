import { BaseItemGB } from './../common/BaseItem';
import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { EGLoader } from "modules/extends/EGLoader";
import { SevenDaysPackData } from "./SevenDaysPackData";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { UH } from "../../helpers/UIHelper";
import { ViewManager } from "manager/ViewManager";
import { SevenDaysGiftView } from "./SevenDaysGiftView";
import { TextHelper } from "../../helpers/TextHelper";
import { Item } from "modules/bag/ItemData";
import { ItemCell } from "modules/extends/ItemCell";
import { AudioTag } from 'modules/audio/AudioManager';

@BaseView.registView
export class SevenDaysPackView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "SevenDaysPack",
        ViewName: "SevenDaysPackView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        bg: <EGLoader>null,
        Name: <fgui.GTextField>null,
        Describe: <fgui.GTextField>null,
        GiftItem: <SevenDaysPackGiftItem>null,
        list: <fgui.GList>null,
        BtnClose: <fgui.GButton>null,
        timer: <TimeMeter>null,
        Spine: <UISpineShow>null,
    };

    protected extendsCfg = [
        { ResName: "GiftItem", ExtendsClass: SevenDaysPackGiftItem },
        { ResName: "GiftItem2", ExtendsClass: SevenDaysPackGiftItem },
    ];
    listData: any[];

    InitData() {
        this.viewNode.BtnClose.onClick(this.closeView, this);

        this.AddSmartDataCare(SevenDaysPackData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");

        this.viewNode.list.setVirtual();

        this.FlushData();
        this.FlushTime();
    }

    FlushData() {
        let list = SevenDaysPackData.Inst().GetSevenDaysPackList()
        if (list.length) {
            this.listData = list.slice(0, 6);
            this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
            this.viewNode.list.numItems = this.listData.length;

            this.viewNode.GiftItem.SetData(list[6]);
        }
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    FlushTime() {
        let time = SevenDaysPackData.Inst().GetEndTime() - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
    }

    InitUI() {
        let cfg = SevenDaysPackData.Inst().GetSevenDaysOtherCfg()
        UH.SetText(this.viewNode.Name, cfg.title)
        UH.SetText(this.viewNode.Describe, cfg.describe)
        this.viewNode.Spine.LoadSpine(ResPath.Spine("qirishishi/qirishishi_top"), true);
    }
    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.bg.SetIcon("loader/common/SevenDaysPackBg", () => {
            waitHandle.complete = true;
            this.refreshBgSize(this.viewNode.bg)
        })
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

class SevenDaysPackGiftItem extends BaseItemGB {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
        BtnBox: <fgui.GButton>null,
        Day: <fgui.GTextField>null,
        OpenDay: <fgui.GTextField>null,
        List: <fgui.GList>null,
        Mask: <fgui.GGroup>null,
    };
    public SetData(data: any) {
        this.data = data;
        let day = SevenDaysPackData.Inst().GetDay() + 1

        this.viewNode.BtnBox.onClick(this.OnClickGift, this);

        UH.SetText(this.viewNode.Day, TextHelper.Format(Language.SevenDaysGift.day, data.start_day % 7 == 0 ? 7 : data.start_day % 7));
        UH.SetText(this.viewNode.OpenDay, TextHelper.Format(Language.SevenDaysGift.OpenDay, data.start_day - day));
        let isFetch = SevenDaysPackData.Inst().InfoFetch[data.seq]
        let boxImg = isFetch ? "BaoXiangKai" : "BaoXiang";
        // UH.SpriteName(this.viewNode.Icon, "SevenDaysPack", boxImg)
        this.viewNode.BtnBox.icon = fgui.UIPackage.getItemURL("SevenDaysPack", boxImg);
        this.viewNode.Mask.visible = isFetch;

        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.setVirtual();
        this.viewNode.List.numItems = this.data.pack_gift1.length

        const isShow = day >= data.start_day || data.start_day % 7 == 0
        this.viewNode.List.visible = isShow
        this.viewNode.OpenDay.visible = !isShow
    }

    OnClickGift() {
        let day = SevenDaysPackData.Inst().GetDay() + 1
        if (day < this.data.start_day) return
        ViewManager.Inst().OpenView(SevenDaysGiftView, this.data);
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(Item.Create(this.data.pack_gift1[index], { is_num: true }));
    }
}
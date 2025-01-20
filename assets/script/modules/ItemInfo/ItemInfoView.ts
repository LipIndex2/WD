import { MainData } from 'modules/main/MainData';
import { Mod } from 'modules/common/ModuleDefine';
import { MainMenu } from 'modules/main/MainMenu';
import { LogError } from "core/Debugger";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { UH } from "../../helpers/UIHelper";
import { BaseItemGB } from "modules/common/BaseItem";
import { AudioTag } from "modules/audio/AudioManager";
import { ItemCell } from "modules/extends/ItemCell";
import { DEBUG } from "cc/env";
import { Item } from "modules/bag/ItemData";
import { COLORSTR } from "modules/common/ColorEnum";
import { GMCmdCtrl } from "modules/gm_command/GMCmdCtrl";
import { Timer } from "modules/time/Timer";
import { TextHelper } from "../../helpers/TextHelper";
import { GetWayData } from "./GetWayData";

@BaseView.registView
export class ItemInfoView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ItemInfo",
        ViewName: "ItemInfoView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Name: <fgui.GTextField>null,
        WayDesc: <fgui.GTextField>null,
        ItemCall: <ItemCell>null,
        Desc: <fgui.GLabel>null,
        GetWayList: <fgui.GList>null,
        GpItemShow: <fgui.GGroup>null,
    };

    protected extendsCfg = [
        { ResName: "GetWayItem", ExtendsClass: GetWayItem }
    ];
    private item_id: number
    private timer_handle: any = null;
    listData: any[];
    InitData(data: any) {
        if (typeof (data) == "number") {
            this.item_id = data
        } else {
            this.item_id = data.item_id
        }
        if (!this.item_id || this.item_id <= 0) return;
        this.viewNode.WayDesc.visible = false;
        this.ShowBaseInfo()
        this.ShowGetWay()
        this.viewNode.GetWayList.on(fgui.Event.CLICK_ITEM, this.OnClickGetWay, this);
    }

    private ShowBaseInfo() {
        this.viewNode.ItemCall.SetData(Item.Create({ item_id: this.item_id }, { is_num: false, is_click: false }))
        UH.SetText(this.viewNode.Name, Item.GetName(this.item_id));

        let desc = Item.GetDesc(this.item_id)
        this.viewNode.Desc.visible = desc != null
        if (desc != null) {
            UH.SetText(this.viewNode.Desc, desc);
        }

    }

    private ShowGetWay() {
        let co = Item.GetConfig(this.item_id);
        // 没填或者没有
        if (!co) return;
        if (co.get_way == null || co.get_way == "") {
            return
        }

        let list = GetWayData.Inst().GetWayList(co.get_way)
        // 填了但是没有解析出来
        if (list.length == 0) {
            return
        }
        this.viewNode.GetWayList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = list;
        this.viewNode.GetWayList.numItems = list.length;
        this.viewNode.WayDesc.visible = list.length > 0;
        // 解决闪的问题
        Timer.Inst().CancelTimer(this.timer_handle)
        this.timer_handle = Timer.Inst().AddRunFrameTimer(() => {
            this.viewNode.GetWayList.visible = true
        }, 3, 1, false)
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    private OnClickGetWay(item: GetWayItem) {
        if (item.data.open_panel == null) {
            ViewManager.Inst().CloseView(ItemInfoView)
            return
        }
        ViewManager.Inst().ShowSkip();
        ViewManager.Inst().OpenViewByKey(item.data.open_panel);

        if (item.data.open_panel == Mod.Main.View) {
            MainData.Inst().FlushSkip(0)
        } else if (item.data.open_panel == Mod.Shop.View) {
            MainData.Inst().FlushSkip(1)
        } else if (item.data.open_panel == Mod.ActivityCombat.View) {
            MainData.Inst().FlushSkip(4)
        }

        if (ViewManager.Inst().IsOpen(ItemInfoView))
            ViewManager.Inst().CloseView(ItemInfoView)
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

export class GetWayItem extends BaseItemGB {
    protected viewNode = {
        title: <fgui.GLabel>null,
    };
    public SetData(data: any) {
        this.data = data
        this.title = data.desc;
    }
}
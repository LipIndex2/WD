import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { MainViewActItem } from "./MainViewAct";
import { ActivityData } from "modules/activity/ActivityData";

@BaseView.registView
export class MainActCollectView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "MainActCollect",
        ViewName: "MainActCollectView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        GpShow: <fgui.GGroup>null,
        list: <fgui.GList>null,
        bg: <fgui.GImage>null,
    };

    protected extendsCfg = [
        { ResName: "ItemAct", ExtendsClass: MainViewActItem },
    ];

    InitData(param: any) {
        let actlist = ActivityData.Inst().GetMainActList(param.data, 0)
        let count = actlist.length;
        this.viewNode.list.width = count < 3 ? Math.min(355, count * 108 + (count - 1) * 15) : 355
        this.viewNode.list.height = Math.min(700, Math.ceil(count / 3) * 138)

        this.viewNode.GpShow.x = param.pos.x - 470
        this.viewNode.GpShow.y = 1600 - param.pos.y - 70

        this.viewNode.list.on(fgui.Event.CLICK_ITEM, this.OnClickActItem, this);

        this.viewNode.list.SetData(actlist)
    }

    OnClickActItem(item: MainViewActItem) {
        ViewManager.Inst().OpenViewByKey(item.ModKey(), { pos: item.node.worldPosition, data: item.data.param ,index:item.data.index})
        ViewManager.Inst().CloseView(MainActCollectView)
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
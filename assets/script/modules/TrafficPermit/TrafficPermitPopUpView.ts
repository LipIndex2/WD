import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from 'modules/bag/ItemData';
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { ItemCell } from 'modules/extends/ItemCell';
import { TrafficPermitData } from './TrafficPermitData';
import { ObjectPool } from "core/ObjectPool";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";

@BaseView.registView
export class TrafficPermitPopUpView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "TrafficPermitPopUp",
        ViewName: "TrafficPermitPopUpView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        BtnConfirm: <fgui.GButton>null,
        List: <fgui.GList>null,
    };

    prizeData: any;
    private spShow: UISpineShow = undefined;

    InitData() {
        this.viewNode.Board.SetData(new BoardData(TrafficPermitPopUpView));
        this.viewNode.BtnConfirm.onClick(this.closeView.bind(this));

        this.prizeData = TrafficPermitData.Inst().getGoldView();
        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.numItems = this.prizeData.length;

        this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("tongxingzheng/tongxingzheng"), true, (obj: any) => {
            obj.setPosition(400, -520);
            this.view._container.insertChild(obj, 2);
        });
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(Item.Create({ item_id: this.prizeData[index].item_id, num: this.prizeData[index].num }, { is_num: true }));
    }

    InitUI() {
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
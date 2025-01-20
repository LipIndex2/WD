import { LoseTempleCtrl } from 'modules/LoseTemple/LoseTempleCtrl';
import { LoseTempleData } from './LoseTempleData';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { UH } from '../../helpers/UIHelper';
import { ViewManager } from 'manager/ViewManager';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';

//遗物宝箱
@BaseView.registView
export class LoseTempleRemainsBoxView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "LoseTempleRemainsBox",
        ViewName: "LoseTempleRemainsBoxView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        list: <fgui.GList>null,
        BtnConfirm: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "BonfireSelectItem", ExtendsClass: BonfireSelectItem }
    ];
    private selectId: number = 0;
    static eventId: number;
    InitData(param: number) {
        LoseTempleRemainsBoxView.eventId = param;
        this.viewNode.Board.SetData(new BoardData(LoseTempleRemainsBoxView));

        this.viewNode.BtnConfirm.onClick(this.onClickConfirm, this);
        this.AddSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");

        this.viewNode.list.setVirtual();
        this.viewNode.list.on(fgui.Event.CLICK_ITEM, this.OnClickItem, this)
        this.FlushData();
    }

    FlushData() {
        let data = LoseTempleData.Inst().GetRemainsBox();
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.list.numItems = data.length;
        this.viewNode.list.selectedIndex = this.selectId;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(LoseTempleData.Inst().GetRemainsBox()[index]);
    }

    OnClickItem(item: BonfireSelectItem) {
        this.selectId = this.viewNode.list.selectedIndex;
    }

    onClickConfirm() {
        LoseTempleCtrl.Inst().SendLoseSelectRemains(this.selectId);
        ViewManager.Inst().CloseView(LoseTempleRemainsBoxView)
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

export class BonfireSelectItem extends BaseItemGB {
    protected viewNode = {
        Name: <fgui.GTextField>null,
        title: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
        bg: <fgui.GLoader>null,
        UISpineShow: <UISpineShow>null,
    };
    public SetData(id: number) {
        let data = LoseTempleData.Inst().GetRemainsCfg(id);
        UH.SetIcon(this.viewNode.Icon, id, ICON_TYPE.REMAINS);
        UH.SpriteName(this.viewNode.bg, "LoseTempleRemainsBox", "XuanZeKuang" + data.color);
        UH.SetText(this.viewNode.Name, data.remains_name)
        UH.SetText(this.viewNode.title, data.remains_effect)
        this.viewNode.UISpineShow.LoadSpine(ResPath.UIEffect(1208077), true);
    }
}
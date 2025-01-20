import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { UH } from "../../helpers/UIHelper";
import { LoseTempleData } from "./LoseTempleData";
//遗物
@BaseView.registView
export class LoseTempleRemainsView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "LoseTempleRemains",
        ViewName: "LoseTempleRemainsView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        list: <fgui.GList>null,
        BtnClose: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "BonfireSelectItem", ExtendsClass: BonfireSelectItem }
    ];

    InitData() {
        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.AddSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");

        this.viewNode.list.setVirtual();

        this.FlushData();
    }

    FlushData() {
        LoseTempleData.Inst().GetRemainsSkillList();
        let data = LoseTempleData.Inst().GetRemainsListData();
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.list.numItems = data.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(LoseTempleData.Inst().GetRemainsListData()[index]);
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

export class BonfireSelectItem extends BaseItem {
    protected viewNode = {
        Name: <fgui.GTextField>null,
        title: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
        bg: <fgui.GLoader>null,
    };
    public SetData(id: number) {
        let data = LoseTempleData.Inst().GetRemainsCfg(id);
        UH.SetIcon(this.viewNode.Icon, id, ICON_TYPE.REMAINS);
        UH.SpriteName(this.viewNode.bg, "LoseTempleRemains", "XuanZeKuang" + data.color);
        UH.SetText(this.viewNode.Name, data.remains_name)
        UH.SetText(this.viewNode.title, data.remains_effect)
    }
}
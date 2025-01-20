
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItemGL } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { ROLE_SETTING_TYPE } from "modules/common/CommonEnum";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { RoleData } from "modules/role/RoleData";
import { FishData } from "./FishData";

@BaseView.registView
export class FishSettingView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishSetting",
        ViewName: "FishSettingView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnStart: <fgui.GButton>null,
        BtnStop: <fgui.GButton>null,

        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: FishSettingViewShowItem },
    ]
    listData: number[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(FishSettingView));

        this.viewNode.BtnStart.onClick(this.OnClickAuto, this);
        this.viewNode.BtnStop.onClick(this.OnClickAuto, this);
    }

    InitUI() {
        this.FlushShow()
    }

    private itemRenderer(index: number, item: FishSettingViewShowItem) {
        item.SetData(this.listData[index]);
    }

    FlushShow() {
        this.listData = [0, 1, 2, 3];
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = this.listData.length;


        this.viewNode.BtnStart.visible = !FishData.Inst().IsAutoFish
        this.viewNode.BtnStop.visible = FishData.Inst().IsAutoFish
    }

    OnClickAuto() {
        ViewManager.Inst().CloseView(FishSettingView)
        FishData.Inst().AutoFish()
    }
}

export class FishSettingViewShowItem extends BaseItemGL {
    protected viewNode = {
        Toggle: <fgui.GButton>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.viewNode.Toggle.onClick(this.OnClickToggle, this);
    }

    SetData(data: any) {
        super.SetData(data)

        this.viewNode.Toggle.selected = 0 == RoleData.Inst().GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingFishStart + this._data)
    }

    OnClickToggle() {
        let set_info = RoleData.Inst().GetRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingFishStart + this._data)
        RoleData.Inst().ChangeRoleSystemSetInfo(ROLE_SETTING_TYPE.SettingFishStart + this._data, 0 == set_info ? 1 : 0)
    }
}


import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { Language } from "modules/common/Language";
import { ItemCell } from "modules/extends/ItemCell";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { RoleCtrl } from "./RoleCtrl";
import { RoleData } from "./RoleData";

@BaseView.registView
export class AddDesktopView extends BaseView {
    private isAdd: boolean

    protected viewRegcfg = {
        UIPackName: "AddDesktop",
        ViewName: "AddDesktopView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        BtnShow: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,

        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ShowItem", ExtendsClass: AddDesktopViewShowItem },
    ]
    listData: import("d:/ccs/wjszm-c/assets/script/config/CfgCommon").CfgItem[];

    InitData() {
        this.viewNode.BtnClose.onClick(this.OnClickClose, this);
        this.viewNode.BtnShow.onClick(this.OnClickShow, this);

        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushInfo.bind(this), "FlushZhuoMianReward");
    }

    InitUI() {
        this.FlushInfo()
    }

    FlushInfo() {
        if (this.isAdd) {
            if (RoleData.Inst().ZhuoMianRewardIsFetch) {
                this.viewNode.BtnShow.title = Language.AddDesktop.BtnAdd
            } else {
                this.viewNode.BtnShow.title = Language.AddDesktop.BtnGet
            }
        } else {
            this.viewNode.BtnShow.title = Language.AddDesktop.BtnAdd
        }

        let show_list = RoleData.Inst().CfgPlayerLevelOtherZhuo()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = show_list;
        this.viewNode.ShowList.numItems = show_list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    OnClickClose() {
        ViewManager.Inst().CloseView(AddDesktopView)
    }

    OnClickShow() {
        if (this.isAdd && !RoleData.Inst().ZhuoMianRewardIsFetch) {
            RoleCtrl.Inst().SendRoleOtherOperReq(0)
        } else {
            if (!this.isAdd) {
                if (!RoleData.Inst().ZhuoMianRewardIsFetch) {
                    this.isAdd = true
                    this.FlushInfo()
                }
            }
            let wx = ChannelAgent.wx;
            if (wx && wx.addShortcut) {
                wx.addShortcut()
            }
        }
    }
}

export class AddDesktopViewShowItem extends BaseItem {
    protected viewNode = {
        NumShow: <fgui.GTextField>null,
        CellShow: <ItemCell>null,
        GpGet: <fgui.GGroup>null,
    };

    SetData(data: any) {
        UH.SetText(this.viewNode.NumShow, data.num)
        this.viewNode.CellShow.SetData(Item.Create(data, { is_num: false }))
        this.viewNode.GpGet.visible = RoleData.Inst().ZhuoMianRewardIsFetch
    }
}

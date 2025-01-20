import { HeroData } from 'modules/hero/HeroData';
import { RoleCtrl } from 'modules/role/RoleCtrl';
import { RoleData } from 'modules/role/RoleData';
import { CommonBoard2 } from './../common_board/CommonBoard2';
import { BaseItemGB } from './../common/BaseItem';
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { ExpShow } from 'modules/extends/Currency';
import { AudioTag } from 'modules/audio/AudioManager';
import { BoardData } from 'modules/common_board/BoardData';
import { HeadItem } from 'modules/extends/HeadItem';
import { UH } from '../../helpers/UIHelper';
import { TextHelper } from '../../helpers/TextHelper';
import { SpriteFrame } from 'cc';
import { ChannelAgent, GameToChannel } from '../../proload/ChannelAgent';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { ViewManager } from 'manager/ViewManager';
import { SettingNameView } from './SettingNameViewView';

@BaseView.registView
export class RoleInfoView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "RoleInfo",
        ViewName: "RoleInfoView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        HeadItem: <HeadItem>null,
        ExpShow: <ExpShow>null,
        Board: <CommonBoard2>null,
        HeadImg: <fgui.GImage>null,
        Name: <fgui.GTextField>null,
        LockDesc: <fgui.GTextField>null,
        UseDesc: <fgui.GTextField>null,
        RoleID: <fgui.GTextField>null,
        list: <fgui.GList>null,
        HeadList: <fgui.GList>null,
        BtnTitleList: <fgui.GList>null,
        BtnUse: <fgui.GButton>null,
        BtnName: <fgui.GButton>null,
        ButtonCut: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "BtnHeadFrame", ExtendsClass: BtnHeadFrame },
        { ResName: "BtnHeadIcon", ExtendsClass: BtnHeadIcon },
    ];

    type: number = 0;
    selectId: number;//选择头像框
    selectHeadId: number;//选择头像
    listData: any;
    listData1: any[];
    listData2: any[];

    InitData() {
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushRoleAvater.bind(this), "FlushRoleAvater");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FulshData.bind(this), "FlushRoleInfo");

        this.viewNode.Board.SetData(new BoardData(RoleInfoView));
        this.viewNode.list.setVirtual();
        this.viewNode.list.on(fgui.Event.CLICK_ITEM, this.OnClickHeadFrame, this)

        this.viewNode.HeadList.setVirtual();
        this.viewNode.HeadList.on(fgui.Event.CLICK_ITEM, this.OnClickHeadIcon, this)
        // this.viewNode.list
        this.viewNode.BtnTitleList.on(fgui.Event.CLICK_ITEM, this.OnClickTitleList, this)
        this.viewNode.BtnUse.onClick(this.OnClickUse, this);
        this.viewNode.BtnName.onClick(this.OnClickName, this);
        this.viewNode.ButtonCut.onClick(this.OnClickCut, this);

        let headid = RoleData.Inst().InfoRoleHeadFrame
        this.selectId = headid > 0 ? headid : 1;
        this.selectHeadId = RoleData.Inst().InfoRoleHeadPicId
        this.FulshData();

        this.viewNode.BtnTitleList.selectedIndex = this.type;
    }

    InitUI(): void {
        UH.SetText(this.viewNode.RoleID, `账号:${RoleData.Inst().InfoRoleId}`)
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData1[index])
    }

    private itemRenderer2(index: number, item: any) {
        item.SetData(this.listData2[index])
    }
    FulshData() {
        if (this.type == 0) {
            let listData = RoleData.Inst().GetRoleHeadIconCfg();
            this.viewNode.HeadList.itemRenderer = this.itemRenderer.bind(this);
            this.listData1 = listData;
            this.viewNode.HeadList.numItems = listData.length;
            this.viewNode.HeadList.selectedIndex = RoleData.Inst().GetHeadIconIndex(this.selectHeadId);
        } else if (this.type == 1) {
            let listData = RoleData.Inst().GetRoleHeadFrameCfg();
            this.viewNode.list.itemRenderer = this.itemRenderer2.bind(this);
            this.listData2 = listData;
            this.viewNode.list.numItems = listData.length;
            this.viewNode.list.selectedIndex = RoleData.Inst().GetHeadFrameIndex(this.selectId);
        }
        this.viewNode.HeadList.visible = this.type == 0
        this.viewNode.list.visible = this.type == 1

        this.FulshDataShow();
        this.FlushRoleAvater();
    }

    FulshDataShow() {
        if (this.type == 0) {
            let cfg = RoleData.Inst().CfgRoleHeadIcon(this.selectHeadId);
            let lock = !RoleData.Inst().GetRoleHeadIconIsLock(this.selectHeadId);
            let useId = RoleData.Inst().InfoRoleHeadPicId;
            this.viewNode.BtnUse.visible = !lock && (useId == 0 || this.selectHeadId != useId);

            if (useId != 0 && this.selectHeadId == useId) {
                UH.SetText(this.viewNode.UseDesc, Language.RoleInfo.use)
            } else {
                UH.SetText(this.viewNode.UseDesc, Language.FunOpen.lock)
            }
            if (cfg && cfg.unlock_type == 0) {
                UH.SetText(this.viewNode.LockDesc, TextHelper.Format(Language.RoleInfo.unlockType4, HeroData.Inst().GetHeroBaseCfg(cfg.param1).hero_name))
            }
        } else {
            let cfg = RoleData.Inst().CfgRoleHeadFrame(this.selectId);
            let lock = !RoleData.Inst().GetRoleHeadFrameIsLock(this.selectId);
            let useId = RoleData.Inst().InfoRoleHeadFrame;
            this.viewNode.BtnUse.visible = !lock && this.selectId != useId;

            if (this.selectId == useId) {
                UH.SetText(this.viewNode.UseDesc, Language.RoleInfo.use)
            } else {
                UH.SetText(this.viewNode.UseDesc, Language.FunOpen.lock)
            }
            UH.SetText(this.viewNode.LockDesc, cfg.describe)
        }

        this.viewNode.HeadImg.visible = !this.viewNode.BtnUse.visible
        this.viewNode.UseDesc.visible = !this.viewNode.BtnUse.visible

        if (this.selectHeadId == 0 && RoleData.Inst().avatar_out_texture) {
            this.viewNode.HeadItem.SeSpriteFrame(RoleData.Inst().avatar_out_texture as SpriteFrame)
        } else {
            this.viewNode.HeadItem.setDefaut(this.selectHeadId);
        }
        this.viewNode.HeadItem.SetHeadFrame(this.selectId)
    }

    OnClickHeadIcon(item: BtnHeadIcon) {
        this.selectHeadId = item.data.head_id;
        this.FulshDataShow();
    }

    OnClickCut() {
        this.selectHeadId = 0;
        RoleCtrl.Inst().SendRoleUserHead(RoleData.Inst().InfoRoleHeadFrame || 1, this.selectHeadId);
    }

    OnClickName() {
        ViewManager.Inst().OpenView(SettingNameView)
    }

    OnClickTitleList() {
        this.type = this.viewNode.BtnTitleList.selectedIndex;
        this.FulshData();
    }

    OnClickUse() {
        if (this.type == 0) {
            RoleCtrl.Inst().SendRoleUserHead(RoleData.Inst().InfoRoleHeadFrame || 1, this.selectHeadId);
        } else {
            RoleCtrl.Inst().SendRoleUserHead(this.selectId, RoleData.Inst().InfoRoleHeadPicId);
        }
    }

    OnClickHeadFrame(item: BtnHeadFrame) {
        this.selectId = item.data.head_id;
        this.FulshDataShow();
    }
    FlushRoleAvater() {
        if (this.selectHeadId == 0 && RoleData.Inst().avatar_out_texture) {
            this.viewNode.HeadItem.SeSpriteFrame(RoleData.Inst().avatar_out_texture as SpriteFrame)
        } else {
            this.viewNode.HeadItem.setDefaut(this.selectHeadId);
        }
        UH.SetText(this.viewNode.Name, RoleData.Inst().InfoRoleName)
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
        ChannelAgent.Inst().OnMessage(GameToChannel.WxUser);
    }

    CloseCallBack() {
    }
}

class BtnHeadFrame extends BaseItemGB {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
        Lock: <fgui.GImage>null,
        select: <fgui.GImage>null,
        GpUse: <fgui.GGroup>null,
    };
    SetData(data: any) {
        this.data = data;
        this.viewNode.GpUse.visible = data.head_id == RoleData.Inst().InfoRoleHeadFrame;
        this.viewNode.Lock.visible = !RoleData.Inst().GetRoleHeadFrameIsLock(data.head_id)
        UH.SetIcon(this.viewNode.Icon, data.res_id, ICON_TYPE.HEADFRAME)
    }
}

class BtnHeadIcon extends BaseItemGB {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
        Lock: <fgui.GImage>null,
        select: <fgui.GImage>null,
        GpUse: <fgui.GGroup>null,
    };
    SetData(data: any) {
        this.data = data;
        this.viewNode.GpUse.visible = data.head_id == RoleData.Inst().InfoRoleHeadPicId;
        this.viewNode.Lock.visible = !RoleData.Inst().GetRoleHeadIconIsLock(data.head_id)
        UH.SetIcon(this.viewNode.Icon, data.head_id, ICON_TYPE.HEADICON)
    }
}
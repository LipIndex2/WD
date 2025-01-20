import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ActivityCtrl } from "modules/activity/ActivityCtrl";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { ItemCell } from "modules/extends/ItemCell";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { InviteFriendCtrl } from "./InviteFriendCtrl";
import { InviteFriendData } from "./InviteFriendData";

@BaseView.registView
export class InviteFriendView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "InviteFriend",
        ViewName: "InviteFriendView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        parent: <fgui.GComponent>null,
        list: <fgui.GList>null,
        BtnClose: <fgui.GButton>null,
        BtnInvite: <fgui.GButton>null,
        timer: <TimeMeter>null,
    };

    protected extendsCfg = [
        { ResName: "InviteTaskCell", ExtendsClass: InviteTaskCell }
    ];
    private invite_list: any
    private spShow: UISpineShow = undefined;
    InitData() {
        InviteFriendCtrl.Inst().SendInviteAllInfo()
        this.AddSmartDataCare(InviteFriendData.Inst().FlushData, this.FlushList.bind(this), "FlushInfo");
        this.viewNode.BtnClose.onClick(this.closeView.bind(this));
        this.viewNode.BtnInvite.onClick(this.OnClickInvite.bind(this))
        this.viewNode.list.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.list.setVirtual();

        if (this.spShow) {
            this.spShow.onDestroy();
            this.spShow = null;
        }
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("yaoqinghaoyou/yaoqinghaoyou"), true, (obj: any) => {
            // this.viewNode.parent._container.setPosition(55, -90);
            this.viewNode.parent._container.insertChild(obj, 2);
        });

        this.FlushList();
        this.FlushFlushTime();
    }

    private FlushFlushTime() {
        let time = InviteFriendData.Inst().getEndTime() - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_4);
        }
    }

    public FlushList() {
        this.invite_list = InviteFriendData.Inst().GetInviteList()
        this.viewNode.list.numItems = this.invite_list.length;
    }

    private renderListItem(index: number, item: InviteTaskCell) {
        item.SetData(this.invite_list[index]);
    }

    private OnClickInvite() {
        InviteFriendCtrl.Inst().InviteFriend();
    }

    InitUI() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        if (this.spShow) {
            this.spShow.onDestroy();
            this.spShow = null;
        }
    }
}

export class InviteTaskCell extends BaseItem {
    protected viewNode = {
        ProgressBar: <fgui.GProgressBar>null,
        Title: <fgui.GTextField>null,
        BtnPrize: <fgui.GButton>null,
        BtnInvite: <fgui.GButton>null,
        ItemCell: <ItemCell>null,
    };
    protected onConstruct(): void {
        super.onConstruct();
        this.viewNode.BtnPrize.onClick(this.getPrize.bind(this));
        this.viewNode.BtnInvite.onClick(this.OnClickInvite.bind(this));
    }
    public SetData(data: any) {
        this.data = data;

        let is_get = InviteFriendData.Inst().GetInviteIsGet(data.type)
        let jindu = InviteFriendData.Inst().GetInviteJindu()
        let item_call = Item.Create(data.reward_item, { is_click: true, is_num: true });
        this.viewNode.ItemCell.SetData(item_call);



        this.viewNode.BtnPrize.visible = jindu >= data.invitation_friend_num && !is_get
        this.viewNode.BtnInvite.visible = jindu < data.invitation_friend_num;
        this.viewNode.ProgressBar.max = data.invitation_friend_num;
        this.viewNode.ProgressBar.value = jindu > data.invitation_friend_num ? data.invitation_friend_num : jindu;

        UH.SetText(this.viewNode.Title, TextHelper.Format(Language.InviteFriends.InviteDesc, data.invitation_friend_num));
    }

    private OnClickInvite() {
        InviteFriendCtrl.Inst().InviteFriend();
    }

    private getPrize() {
        ActivityCtrl.Inst().SendAngelReq(ACTIVITY_TYPE.InviteFriend, 1, this.data.type)
    }
}
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { UH } from "../../helpers/UIHelper";
import { BoardData } from "modules/common_board/BoardData";
import { Item } from "modules/bag/ItemData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { ItemCell } from "modules/extends/ItemCell";
import { TrafficPermitGoldView } from "./TrafficPermitGoldView";
import { ViewManager } from "manager/ViewManager";
import { TrafficPermitData } from "./TrafficPermitData";
import { TrafficPermitCtrl } from "./TrafficPermitCtrl";
import { RewardGetBoxView } from "modules/reward_get/RewardGetBoxView";
import { BagData } from "modules/bag/BagData";

@BaseView.registView
export class TrafficPermitBoxView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "TrafficPermitBox",
        ViewName: "TrafficPermitBoxView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Icon: <fgui.GLoader>null,
        List: <fgui.GList>null,
        BtnBuy: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
        GlodShow: <fgui.GGroup>null,
        Board: <CommonBoard2>null,
    };
    private data: any;
    InitData(param: any) {
        this.data = param;
        let isActive = TrafficPermitData.Inst().GetIsActive();
        if (param.type == 1 && isActive == 0) {
            this.viewNode.GlodShow.visible = true;
            this.viewNode.Board.height = 1255;
        } else {
            this.viewNode.GlodShow.visible = false;
            this.viewNode.Board.height = 1055;
        }
        let buyCfg = TrafficPermitData.Inst().GetPassBuy();
        this.viewNode.Board.SetData(new BoardData(TrafficPermitBoxView, param.item.name));
        this.viewNode.BtnClose.onClick(this.OnClickIsReceive, this);
        this.viewNode.BtnBuy.onClick(this.OnClickBuy.bind(this, 2));
        this.viewNode.BtnBuy.title = Language.Recharge.GoldType[0] + " " + buyCfg.pay_price2 / 10;

        UH.SpriteName(this.viewNode.Icon, "TrafficPermitBox", "XiangZi" + param.item.color);

        if (param.isReceive) {
            this.viewNode.BtnClose.title = Language.ActCommon.LingQu1
        } else {
            this.viewNode.BtnClose.title = Language.ActCommon.Confirm
        }

        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.numItems = param.item.gift.length;
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(Item.Create({ item_id: this.data.item.gift[index].item_id, num: this.data.item.gift[index].num }, { is_num: true }));
    }

    OnClickBuy() {
        ViewManager.Inst().OpenView(TrafficPermitGoldView);
        ViewManager.Inst().CloseView(TrafficPermitBoxView)
    }

    OnClickIsReceive() {
        RewardGetBoxView.boxType = this.data.item.color + 2;
        BagData.Inst().ShowRewardBox = true;
        if (this.data.isMax) {
            TrafficPermitCtrl.Inst().SendMaxBox();
        } else if (this.data.isReceive) {
            TrafficPermitCtrl.Inst().SendFetchReward(this.data.type, this.data.level);
        }
        ViewManager.Inst().CloseView(TrafficPermitBoxView)
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
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { GrowUpGiftData } from "./GrowUpGiftData";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { ViewManager } from "manager/ViewManager";

@BaseView.registView
export class GrowUpGiftView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "GrowUpGift",
        ViewName: "GrowUpGiftView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        // BtnClose: <fgui.GButton>null,
        BtnBuy: <fgui.GButton>null,
        ButtonArrowL: <fgui.GButton>null,
        ButtonArrowR: <fgui.GButton>null,
        List: <fgui.GList>null,
        timer: <TimeMeter>null,
        Icon: <fgui.GLoader>null,
        DiscountShow: <fgui.GTextField>null,
    };

    protected extendsCfg = [
        { ResName: "GiftCell", ExtendsClass: GiftCell },
    ];

    private index: number = 0;
    private cache_timer: number = 0;
    private _key_check_buy: string;
    private spShow: UISpineShow = undefined;
    listData: import("d:/ccs/wjszm-c/assets/script/config/CfgCommon").CfgItem[];

    InitData(param?: any) {
        if (param.index) {
            this.index = param.index;
        } else {
            this.index = 0
        }
        this.viewNode.Board.SetData(new BoardData(GrowUpGiftView));
        // this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.ButtonArrowL.onClick(this.OnClickDir.bind(this, -1));
        this.viewNode.ButtonArrowR.onClick(this.OnClickDir.bind(this, 1));
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
        this.AddSmartDataCare(GrowUpGiftData.Inst().FlushData, this.FulshListData.bind(this), "FlushInfo");
        // this.viewNode.timer.SetCallBack(this.FlushFlushTime.bind(this));
        // this.viewNode.List.setVirtual();
        this._key_check_buy = Mod.GrowUpGift.View + "-1";
        this.FulshListData();
        GrowUpGiftData.Inst().ClearFirstRemind();
    }

    private FulshListData() {
        if (GrowUpGiftData.Inst().getGiftNum() == 0) {
            ViewManager.Inst().CloseView(GrowUpGiftView);
            return;
        }
        let info = GrowUpGiftData.Inst().getGiftInfo(this.index);
        let config = GrowUpGiftData.Inst().GetGiftCfg(info.seq);
        this.cache_timer = info.endTime;

        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
        UH.SetText(this.viewNode.DiscountShow, config.discount + "%")
        UH.SetIcon(this.viewNode.Icon, config.res_id1, ICON_TYPE.GROWPACK);
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("libao/" + config.res_id2), true, (obj: any) => {
            obj.setPosition(400, -750);
            this.view._container.insertChild(obj, 3);
        });
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (config.price / 10));

        this.listData = config.reward_item;
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = config.reward_item.length;
        this.FlushFlushTime();
        this.aroundBtnShow();
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    private FlushFlushTime() {
        let time = this.cache_timer - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_0, Language.UiTimeMeter.TimeLimit2);
        }
    }

    OnClickBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let info = GrowUpGiftData.Inst().getGiftInfo(this.index);
        let config = GrowUpGiftData.Inst().GetGiftCfg(info.seq);

        let cfg_word = SettingUsertServeData.Inst().GetWordDes(9);//成长礼包
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(info.seq, ACTIVITY_TYPE.GrowGift, config.price, config.price, name);
        OrderCtrl.generateOrder(order_data);
        this.index = 0;
    }

    private OnClickDir(dir: number) {
        this.index += dir;
        this.FulshListData();
    }

    //左右按钮显示
    private aroundBtnShow() {
        this.viewNode.ButtonArrowL.visible = this.index != 0;
        this.viewNode.ButtonArrowR.visible = this.index != GrowUpGiftData.Inst().getGiftNum() - 1;
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
        this.viewNode.timer.CloseCountDownTime();
    }
}

export class GiftCell extends BaseItem {
    protected viewNode = {
        ItemCell: <ItemCell>null,
        Num: <fgui.GTextField>null,
        HeroNum: <fgui.GTextField>null,
    };
    public SetData(data: any) {
        let item_call = Item.Create(data, { is_click: true });
        this.viewNode.ItemCell.SetData(item_call);

        let cfg = Item.GetConfig(data.item_id);
        let isHero = cfg.item_type == 3
        if (isHero) {
            UH.SetText(this.viewNode.Num, cfg.name);
            this.viewNode.Num.fontSize = 37;
            UH.SetText(this.viewNode.HeroNum, "x" + data.num);
        } else {
            UH.SetText(this.viewNode.Num, data.num);
            this.viewNode.Num.fontSize = 40;
            UH.SetText(this.viewNode.HeroNum, "");
        }
    }
}
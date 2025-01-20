import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { TimeMeter } from "modules/extends/TimeMeter";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { ResPath } from "utils/ResPath";
import { UH } from "../../helpers/UIHelper";
import { NewPackData } from "./NewPackData";


@BaseView.registView
export class NewPackView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "NewPack",
        ViewName: "NewPackView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        Icon: <fgui.GLoader>null,
        BtnBuy: <fgui.GButton>null,
        List: <fgui.GList>null,
        timer: <TimeMeter>null,
        DiscountShow: <fgui.GTextField>null,
    };

    protected extendsCfg = [
        { ResName: "GiftCell", ExtendsClass: GiftCell },
    ];

    private _key_check_buy: string;
    private spShow: UISpineShow = undefined;
    listData: import("d:/ccs/wjszm-c/assets/script/config/CfgCommon").CfgItem[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(NewPackView));
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
        this.AddSmartDataCare(NewPackData.Inst().FlushData, this.FulshListData.bind(this), "FlushInfo");
        // this.viewNode.timer.SetCallBack(this.FlushFlushTime.bind(this));
        this._key_check_buy = Mod.NewPack.View + "-1";

        this.PlaySpineShow();
        this.FulshListData();
    }

    InitUI() {
        UH.SetIcon(this.viewNode.Icon, "growpack5", ICON_TYPE.GROWPACK);
    }

    private FulshListData() {
        let seq = NewPackData.Inst().getGiftInfo();
        let config = NewPackData.Inst().GetGiftCfg(seq);
        if (!config) {
            ViewManager.Inst().CloseView(NewPackView)
            return
        }
        UH.SetText(this.viewNode.DiscountShow, config.discount + "%")
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (config.price / 10));
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = config.pack_gift;
        this.viewNode.List.numItems = config.pack_gift.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    PlaySpineShow() {
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("libao/chengzhanglibao_07"), true, (obj: any) => {
            obj.setPosition(400, -750);
            this.view._container.insertChild(obj, 2);
        });
    }

    OnClickBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let seq = NewPackData.Inst().getGiftInfo();
        let config = NewPackData.Inst().GetGiftCfg(seq);
        let cfg_word = SettingUsertServeData.Inst().GetWordDes(15);//新手礼包
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(seq, ACTIVITY_TYPE.NewPack, config.price, config.price, name);
        OrderCtrl.generateOrder(order_data);

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
        FunOpen.Inst().OnFunOpenViewShow(true);
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
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from 'manager/ViewManager';
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { Language } from 'modules/common/Language';
import { BoardData } from 'modules/common_board/BoardData';
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";
import { CommonBoard2 } from './../common_board/CommonBoard2';
import { TrafficPermitCtrl } from "./TrafficPermitCtrl";
import { TrafficPermitData } from './TrafficPermitData';
import { TrafficPermitPopUpView } from './TrafficPermitPopUpView';
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";

@BaseView.registView
export class TrafficPermitGoldView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "TrafficPermitGold",
        ViewName: "TrafficPermitGoldView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        BtnPoint: <fgui.GButton>null,
        BtnBuy1: <fgui.GButton>null,
        BtnBuy2: <fgui.GButton>null,
        timer: <TimeMeter>null,
    };

    private timer_handle: any = null;
    private check_buy: boolean = false;
    private spShow: UISpineShow = undefined;
    // private _key_check_buy1: string;
    // private _key_check_buy2: string;
    InitData() {
        this.viewNode.Board.SetData(new BoardData(TrafficPermitGoldView));
        this.viewNode.BtnPoint.onClick(this.OnClickPopUp, this);
        this.viewNode.BtnBuy1.onClick(this.OnClickBuy.bind(this, 1));
        this.viewNode.BtnBuy2.onClick(this.OnClickBuy.bind(this, 2));
    }

    InitUI() {
        let buyCfg = TrafficPermitData.Inst().GetPassBuy();
        this.viewNode.BtnBuy1.title = Language.Recharge.GoldType[0] + " " + buyCfg.pay_price1 / 10;
        this.viewNode.BtnBuy2.title = Language.Recharge.GoldType[0] + " " + buyCfg.pay_price2 / 10;
        // this._key_check_buy1 = Mod.TrafficPermit.View + "-1"
        // OrderCtrl.Inst().CheckMaiButton(this._key_check_buy1, this.viewNode.BtnBuy1);
        // this._key_check_buy2 = Mod.TrafficPermit.View + "-2"
        // OrderCtrl.Inst().CheckMaiButton(this._key_check_buy2, this.viewNode.BtnBuy2);

        this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("tongxingzheng/tongxingzheng"), true, (obj: any) => {
            obj.setPosition(405, -660);
            this.view._container.insertChild(obj, 2);
        });

        this.FlushTime();
    }

    private OnClickPopUp() {
        ViewManager.Inst().OpenView(TrafficPermitPopUpView);
    }

    public FlushTime() {
        let date = new Date()
        let dateData = new Date(date.getFullYear(), date.getMonth() + 1, 1)
        let time = (dateData.getTime() / 1000) - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0;
        if (time > 0) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_4);
        }

    }

    OnClickBuy(type: number) {
        if (this.check_buy) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        this.check_buy = true;
        let buyCfg = TrafficPermitData.Inst().GetPassBuy();
        let price;
        if (type == 1) {
            price = buyCfg.pay_price1
        } else {
            price = buyCfg.pay_price2
        }
        let cfg_word = SettingUsertServeData.Inst().GetWordDes(14);//通行证
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(1, ACTIVITY_TYPE.PassCheck, price, price, name);
        OrderCtrl.generateOrder(order_data);
        Timer.Inst().CancelTimer(this.timer_handle);
        this.timer_handle = Timer.Inst().AddRunTimer(() => {
            TrafficPermitCtrl.Inst().SendPassCheckInfo()
            ViewManager.Inst().CloseView(TrafficPermitGoldView)
        }, 0.6, 1, false)
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
        Timer.Inst().CancelTimer(this.timer_handle);
    }
}
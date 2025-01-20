import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { Mod } from "modules/common/ModuleDefine";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data, RechargeType } from "modules/recharge/OrderCtrl";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from '../../helpers/UIHelper';
import { SavingPotData } from './SavingPotData';
import { ViewManager } from "manager/ViewManager";

@BaseView.registView
export class SavingPotView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "SavingPot",
        ViewName: "SavingPotView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        ProgressBar: <fgui.GProgressBar>null,
        Num2: <fgui.GTextField>null,
        Num1: <fgui.GTextField>null,
        Desc: <fgui.GTextField>null,
        BuyNumShow: <fgui.GGroup>null,
        BtnBuy: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
        UIEffectShow: <UIEffectShow>null,
    };

    private spShow: UISpineShow = undefined;
    private _key_check_buy: string;

    InitData() {
        this.viewNode.Board.SetBtnCloseVisible(false)

        this.viewNode.BtnClose.onClick(this.closeView.bind(this));
        this.viewNode.BtnBuy.onClick(this.OnClickBuy.bind(this));
        this.AddSmartDataCare(SavingPotData.Inst().ResultData, this.FulshDataPopup.bind(this), "SavingPotInfoFlush");

        this._key_check_buy = Mod.SavingPot.View + "-1";

        this.FulshData();
        this.InitSpineAnim();
    }

    InitSpineAnim() {
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("cunqianguan/cunqianguan"), true, (obj: any) => {
            obj.setPosition(400, -530);
            this.view._container.insertChild(obj, 7);
        });

        this.viewNode.UIEffectShow.StopEff(1009001)
        this.viewNode.UIEffectShow.PlayEff(1009001)
    }

    InitUI() {
    }

    FulshDataPopup() {
        PublicPopupCtrl.Inst().Center(Language.Common.paySucceed);
        this.FulshData();
    }

    FulshData() {
        let data = SavingPotData.Inst().getPiggyCfg();
        let value = SavingPotData.Inst().getDiamondNum()
        if(!data){
            ViewManager.Inst().CloseView(SavingPotView);
            return;
        }
        this.viewNode.BuyNumShow.x = 136 + (532 / (data.dia_max / data.dia_buy)) - 84;
        // this.viewNode.ProgressBar.FlushShow(data, value);
        this.viewNode.ProgressBar.max = data.dia_max;
        this.viewNode.ProgressBar.value = value;

        this.viewNode.BtnBuy.title = Language.Recharge.GoldType[0] + (data.price / 10);
        UH.SetText(this.viewNode.Desc, TextHelper.Format(Language.SavingPot.desc, data.dia_buy));
        UH.SetText(this.viewNode.Num1, data.dia_buy)
        UH.SetText(this.viewNode.Num2, data.dia_max)

        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (data.price / 10));
        this.viewNode.BtnBuy.grayed = value < data.dia_buy;
    }

    OnClickBuy() {
        let value = SavingPotData.Inst().getDiamondNum()
        let data = SavingPotData.Inst().getPiggyCfg();
        if (data.dia_buy > value) {
            PublicPopupCtrl.Inst().Center(Language.SavingPot.tip)
            return;
        }
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let cfg_word = SettingUsertServeData.Inst().GetWordDes(10);//英雄活动
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(data.seq, RechargeType.BUY_TYPE_MONEY_BOX, data.price, data.price, name);
        OrderCtrl.generateOrder(order_data);
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
    }
}


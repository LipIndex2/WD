import { CfgArena, CfgArenaSkin } from "config/CfgArena";
import * as fgui from "fairygui-cc";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { EGLoader } from "modules/extends/EGLoader";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UH } from "../../helpers/UIHelper";
import { ArenaData } from "./ArenaData";
import { ShopData } from "modules/shop/ShopData";
import { OrderCtrl, Order_Data, RechargeType } from "modules/recharge/OrderCtrl";
import { ArenaCtrl, ArenaReq } from "./ArenaCtrl";
import { BattleData } from "modules/Battle/BattleData";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";

@BaseView.registView
export class ArenaSkinView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ArenaSkin",
        ViewName: "ArenaSkinView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
        ViewMask: ViewMask.BgBlock,
    };

    protected viewNode = {
        CloseBtn: <fgui.GButton>null,
        BGEffect: <UIEffectShow>null,
        List: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "SkinItem", ExtendsClass: ArenaSkinItem },
        { ResName: "Title", ExtendsClass: ArenaSkinViewTitle }
    ];

    private titleData1: IArenaSkinViewTitleData = { title: Language.Arena.title7 };
    private titleData2: IArenaSkinViewTitleData = { title: Language.Arena.title8 };

    private _listData: any[];
    private get listData(): any[] {
        if (this._listData == null) {
            this._listData = [];
            this._listData.push(this.titleData1);
            let cfg = CfgArena.pvp_skin;
            let unlockList: CfgArenaSkin[] = [];
            let lockList: CfgArenaSkin[] = [];
            cfg.forEach(skin => {
                let state = ArenaData.Inst().GetSkinState(skin);
                if (state == 1) {
                    unlockList.push(skin);
                    this._listData.push(skin);
                } else {
                    lockList.push(skin);
                }
            });
            this._listData.push(this.titleData2);
            lockList.forEach(skin => {
                this._listData.push(skin);
            })
        }
        return this._listData;
    }

    InitData() {
        this.viewNode.CloseBtn.onClick(this.closeView, this);
        this.viewNode.BGEffect.PlayEff(1208110);
        this.viewNode.List.itemProvider = this.GetListItemResource.bind(this);
        this.viewNode.List.setVirtual();

        this.AddSmartDataCare(ArenaData.Inst().smdData, this.FlushList.bind(this), "skinInfo");
        this.AddSmartDataCare(ArenaData.Inst().smdData, this.FlushList.bind(this), "mainInfo");
    }

    OpenCallBack() {
        this.FlushList();
    }

    CloseCallBack() {
    }

    FlushList() {
        this._listData = [];
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = this.listData.length;
    }

    private itemRenderer(index: number, item: ArenaSkinItem) {
        item.SetData(this.listData[index]);
    }

    private GetListItemResource(index: number) {
        let data = this.listData[index];
        if (data.title != null) {
            return fgui.UIPackage.getItemURL("ArenaSkin", "Title");
        } else {
            return fgui.UIPackage.getItemURL("ArenaSkin", "SkinItem");
        }
    }
}

export interface IArenaSkinViewTitleData {
    title: string;
}

export class ArenaSkinViewTitle extends BaseItem {
    protected _data: IArenaSkinViewTitleData;
    protected viewNode = {
        title: <fgui.GTextField>null,
    };
    public SetData(data: IArenaSkinViewTitleData): void {
        UH.SetText(this.viewNode.title, data.title);
    }
}


export class ArenaSkinItem extends BaseItem {
    protected _data: CfgArenaSkin;

    protected viewNode = {
        Icon: <EGLoader>null,
        Name: <fgui.GTextField>null,
        LockDesc: <fgui.GTextField>null,
        Desc: <fgui.GTextField>null,
        timer: <TimeMeter>null,
        BuyBtn: <fgui.GButton>null,
        Flag: <fgui.GObject>null,
    };

    private stateCtrl: fgui.Controller;
    private showTimeStateCtrl: fgui.Controller;
    private useFlagStateCtrl: fgui.Controller;

    protected onConstruct(): void {
        super.onConstruct();
        this.stateCtrl = this.getController("state");
        this.showTimeStateCtrl = this.getController("show_time");
        this.useFlagStateCtrl = this.getController("use_flag");
        this.viewNode.BuyBtn.onClick(this.OnBuyClick, this);
        this.onClick(this.OnSelfClick, this);
        this.viewNode.timer.SetCallBack(() => {
            if (this.viewNode.timer.visible) {
                ArenaCtrl.Inst().SendReq(ArenaReq.Info);
            }
        });
    }

    get state(): number {
        return ArenaData.Inst().GetSkinState(this._data);
    }

    get useFlagState(): number {
        if (this._data.seq == ArenaData.Inst().skinSeq) {
            return 1;
        }
        return 0;
    }

    private _key_check_buy: string;

    public SetData(data: CfgArenaSkin): void {
        super.SetData(data);
        let scene_cfg = BattleData.Inst().GetSceneArenaBGCfg(data.stage_res_id);
        UH.SetIcon(this.viewNode.Icon, scene_cfg.show_res_id, ICON_TYPE.ARENA_SKIN);
        UH.SetText(this.viewNode.Name, data.skin_name);
        if (data.gain_des != null && data.gain_des != "") {
            UH.SetText(this.viewNode.Desc, data.gain_des);
        } else {
            UH.SetText(this.viewNode.Desc, Language.Arena.tips12);
        }


        let state = this.state;
        this.stateCtrl.setSelectedIndex(state);
        this.viewNode.BuyBtn.visible = state == 0 && data.index >= 0;
        this._key_check_buy = "ArenaSkinItem_" + data.seq;
        if (state == 0) {
            if (this.viewNode.BuyBtn.visible || data.unlock_type == null || data.unlock_type == "") {
                UH.SetText(this.viewNode.LockDesc, "");
            } else {
                UH.SetText(this.viewNode.LockDesc, data.unlock_type);
            }
            if (data.index >= 0) {
                let shopCfg = ShopData.Inst().GetRMBShopCfg(data.index);
                let btnStr = OrderCtrl.PrefixByGold(shopCfg.price);
                OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BuyBtn, btnStr);
            }
        }

        this.viewNode.Flag.visible = data.have_time == 0;

        let skinTime = ArenaData.Inst().GetSkinTime(data);
        this.showTimeStateCtrl.selectedIndex = skinTime > 0 ? 1 : 0;
        if (skinTime > 0) {
            this.viewNode.timer.CloseCountDownTime();
            this.viewNode.timer.StampTime(skinTime, TimeFormatType.TYPE_TIME_4, Language.Arena.Time2)
        }

        let useState = this.useFlagState;
        this.useFlagStateCtrl.setSelectedIndex(useState);
    }

    private isBuyClick = false;
    OnBuyClick() {
        if (this._data.index >= 0) {
            let cfg = ShopData.Inst().GetRMBShopCfg(this._data.index);
            let order_data = Order_Data.initOrder(cfg.index, RechargeType.BUY_TYPE_ARENA_SKIN, cfg.price, cfg.price, this._data.skin_name);
            OrderCtrl.generateOrder(order_data);
            this.isBuyClick = true;
        }
    }

    OnSelfClick() {
        if (this.isBuyClick) {
            this.isBuyClick = false;
            return
        }
        if (this.stateCtrl.selectedIndex == 1) {
            ArenaCtrl.Inst().SendReq(ArenaReq.SetSkin, [this._data.seq]);
            if (this._data.gain_des && this._data.gain_des != "") {
                PublicPopupCtrl.Inst().Center(this._data.gain_des);
            }
        } else {
            PublicPopupCtrl.Inst().Center(Language.Arena.tips11);
        }
        AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick)
    }
}
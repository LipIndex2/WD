import { ICON_TYPE, ITEM_SHOW_TYPE } from 'modules/common/CommonEnum';
import { HeroData } from 'modules/hero/HeroData';
import { GetCfgValue } from "config/CfgCommon";
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data, RechargeType } from "modules/recharge/OrderCtrl";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { SevenDayHeroCtrl } from "./SevenDayHeroCtrl";
import { SevenDayHeroData } from "./SevenDayHeroData";
import { SevenDayHeroRewardView } from "./SevenDayHeroRewardView";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";

@BaseView.registView
export class SevenDayHeroView extends BaseView {
    private sp_show: UISpineShow = undefined;

    protected viewRegcfg = {
        UIPackName: "SevenDayHero",
        ViewName: "SevenDayHeroView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        Board: <CommonBoard3>null,

        BtnClose: <fgui.GButton>null,
        BtnReward: <SevenDayHeroViewRewardButton>null,
        BtnBuy: <fgui.GButton>null,
        BtnGet: <fgui.GButton>null,

        GpNotActive: <fgui.GGroup>null,

        CoinNum: <fgui.GTextField>null,

        ShowList: <fgui.GList>null,
        HeadShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: SevenDayHeroViewShowItem },
        { ResName: "ButtonReward", ExtendsClass: SevenDayHeroViewRewardButton },
        { ResName: "HeroHeadItem", ExtendsClass: SevenDayHeroViewHeroHeadItem },
    ]
    private _key_check_buy: string;
    listData: { index: number; val: number; }[];
    listData2: number[];
    InitData() {
        this.viewNode.Board.SetBtnCloseVisible(false)

        this.viewNode.BtnClose.onClick(this.OnClickClose, this);
        this.viewNode.BtnReward.onClick(this.OnClickReward, this);
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
        this.viewNode.BtnGet.onClick(this.OnClickGet, this);

        this.AddSmartDataCare(SevenDayHeroData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo");
        this.AddSmartDataCare(SevenDayHeroData.Inst().FlushData, this.FlushSel.bind(this), "SelSeq");

        this._key_check_buy = Mod.SevenDayHero.View + "-1";
        SevenDayHeroData.Inst().FlushData.SelSeq = -1

        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.Spine("qiri/qiri"), true, (obj: any) => {
            obj.setPosition(400, -500);
            this.view._container.insertChild(obj, 1);
        });
    }

    InitUI() {
        this.FlushShow()
        this.FlushInfo()
        this.FlushSel()
    }

    CloseCallBack(): void {
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
        }
    }

    FlushShow() {
        UH.SetText(this.viewNode.CoinNum, SevenDayHeroData.Inst().CfgSupplyCardSupplyCardPayPayItemNum())
        let list = [{ index: 1, val: SevenDayHeroData.Inst().CfgSupplyCardSupplyCardSpeed() }, { index: 2, val: SevenDayHeroData.Inst().CfgSupplyCardSupplyCardAttack() }, { index: 3, val: SevenDayHeroData.Inst().CfgSupplyCardSupplyCardAttackSpeed() }]
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = list;
        this.viewNode.ShowList.numItems = list.length;
        // this.viewNode.BtnBuy.title = `¥ ${SevenDayHeroData.Inst().CfgSupplyCardSupplyCardPayPrice() / 10}`

        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, `¥ ${SevenDayHeroData.Inst().CfgSupplyCardSupplyCardPayPrice() / 10}`);
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    private itemRendererHero(index: number, item: any) {
        item.SetData(this.listData2[index])
    }

    FlushInfo() {
        let is_buy = SevenDayHeroData.Inst().IsBuy
        this.viewNode.BtnGet.visible = is_buy
        this.viewNode.BtnGet.grayed = 1 == SevenDayHeroData.Inst().InfoFetchRewardTimes
        this.viewNode.GpNotActive.visible = !is_buy

        this.listData2 = SevenDayHeroData.Inst().InfoHeroId as number[];
        this.viewNode.HeadShowList.itemRenderer = this.itemRendererHero.bind(this);
        this.viewNode.HeadShowList.numItems = (SevenDayHeroData.Inst().InfoHeroId as number[]).length;
        this.viewNode.HeadShowList.visible = is_buy
    }


    FlushSel() {
        this.viewNode.BtnReward.FlushShow()
    }


    OnClickReward() {
        let is_buy = SevenDayHeroData.Inst().IsBuy
        if (!is_buy) {
            PublicPopupCtrl.Inst().Center(Language.SevenDayHero.BuyTips)
            return
        }
        ViewManager.Inst().OpenView(SevenDayHeroRewardView)
    }

    OnClickClose() {
        ViewManager.Inst().CloseView(SevenDayHeroView)
    }

    OnClickBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let cfg_word = SettingUsertServeData.Inst().GetWordDes(12);//夏日盛典礼包
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(0, RechargeType.BUY_TYPE_SEVEN_DAY_HERO, SevenDayHeroData.Inst().CfgSupplyCardSupplyCardPayPrice(), SevenDayHeroData.Inst().CfgSupplyCardSupplyCardPayPrice(), name);
        OrderCtrl.generateOrder(order_data);
    }

    OnClickGet() {
        if (1 == SevenDayHeroData.Inst().InfoFetchRewardTimes) {
            PublicPopupCtrl.Inst().Center(Language.SevenDayHero.FetchTips)
            return
        }
        if (SevenDayHeroData.Inst().FlushData.SelSeq < 0) {
            PublicPopupCtrl.Inst().Center(Language.SevenDayHero.FetchSelTips)
            return
        }
        SevenDayHeroCtrl.Inst().SendSevenDayHeroReqFetch(SevenDayHeroData.Inst().FlushData.SelSeq)
    }
}

export class SevenDayHeroViewShowItem extends BaseItem {
    protected viewNode = {
        BgSp: <fgui.GLoader>null,
        BgISp: <fgui.GLoader>null,
        IconSp: <fgui.GLoader>null,
        ArrowShow: <fgui.GImage>null,
        NumShow: <fgui.GTextField>null,
        DescShow: <fgui.GTextField>null,
    };


    SetData(data: { index: number, val: number }) {
        super.SetData(data)

        UH.SpriteName(this.viewNode.BgSp, "SevenDayHero", `bg${data.index}`)
        UH.SpriteName(this.viewNode.BgISp, "SevenDayHero", `bgi${data.index}`)
        UH.SpriteName(this.viewNode.IconSp, "SevenDayHero", `icon${data.index}`)
        this.viewNode.ArrowShow.visible = 1 == data.index
        UH.SetText(this.viewNode.NumShow, 1 == data.index ? `${data.val}` : `+${data.val}%`)
        UH.SetText(this.viewNode.DescShow, TextHelper.Format(GetCfgValue(Language.SevenDayHero.DescShow, data.index), data.val))
    }
}

export class SevenDayHeroViewRewardButton extends BaseItemGB {
    private spShow: UISpineShow = undefined;

    protected viewNode = {
        CellShow: <ItemCell>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`1208024`), true, (obj: any) => {
            obj.setPosition(55, -55);
            this._container.insertChild(obj, 2);
        });
    }

    FlushShow() {
        let sel_seq = SevenDayHeroData.Inst().SelSeq
        this.viewNode.CellShow.visible = sel_seq >= 0
        if (sel_seq >= 0) {
            let co = SevenDayHeroData.Inst().GetRewardShowInfoBySeq(sel_seq)
            if (co) {
                this.viewNode.CellShow.SetData(Item.Create({ itemId: co.item_id, num: co.item_id_num }, { is_num: true, is_click: false }))
            }
        }
    }

    protected onDestroy(): void {
        super.onDestroy()
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }

    }
}

export class SevenDayHeroViewHeroHeadItem extends BaseItem {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
    };

    SetData(data: number) {
        let id = HeroData.Inst().GetDebrisHeroId(data);
        UH.SetIcon(this.viewNode.Icon, id, ICON_TYPE.HEROSMALL)
    }
}
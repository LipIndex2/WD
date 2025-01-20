
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ActivityData } from 'modules/activity/ActivityData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { AudioTag } from 'modules/audio/AudioManager';
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { AdType } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { BoardData } from 'modules/common_board/BoardData';
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { TimeFormatType, TimeMeter } from 'modules/extends/TimeMeter';
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { OrderCtrl, Order_Data } from "modules/recharge/OrderCtrl";
import { RoleData } from "modules/role/RoleData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { SettingUsertServeData } from "modules/setting/SettingUsertServeData";
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { ResPath } from "utils/ResPath";
import { TextHelper } from '../../helpers/TextHelper';
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent, GameToChannel } from "../../proload/ChannelAgent";
import { DeepCeleData } from './DeepCeleData';

@BaseView.registView
export class DeepCeleGiftView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "DeepCeleGift",
        ViewName: "DeepCeleGiftView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        TitleShow: <fgui.GTextField>null,

        TimeShow: <TimeMeter>null,
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ShowItem", ExtendsClass: DeepCeleGiftViewShowItem },
        { ResName: "RewardItem", ExtendsClass: DeepCeleGiftViewRewardItem },
    ]
    listData: any[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(DeepCeleGiftView));
        UH.SetText(this.viewNode.TitleShow, DeepCeleData.Inst().CfgCeremonyGiftOtherItemName())

        this.viewNode.ShowList.setVirtual();

        this.AddSmartDataCare(DeepCeleData.Inst().FlushData, this.FlushBuyInfo.bind(this), "FlushItemBuyInfo");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushBuyInfo.bind(this), "FlushAdInfo");
    }

    InitUI() {
        this.FlushBuyInfo()
        this.FlushTimeShow()
    }

    CloseCallBack() {
        this.viewNode.TimeShow.CloseCountDownTime()
    }


    FlushBuyInfo() {
        let list = DeepCeleData.Inst().GetGiftShowList(true)
        let data = [];
        if (!RoleData.Inst().IsCanAD(AdType.deep_cele_gift)) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].seq == 0 && !RoleData.Inst().IsCanAD(AdType.deep_cele_gift)) {
                    continue;
                }
                data.push(list[i])
            }
        } else {
            data = list;
        }
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data;
        this.viewNode.ShowList.numItems = data.length;
    }

    private itemRenderer(index: number, item: DeepCeleGiftViewShowItem) {
        item.SetData(this.listData[index]);
    }

    private FlushTimeShow() {
        let end_time = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DeepCeleGift) - TimeCtrl.Inst().ServerTime;
        this.viewNode.TimeShow.visible = end_time > 0
        this.viewNode.TimeShow.CloseCountDownTime()
        if (end_time > 0) {
            this.viewNode.TimeShow.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.TimeShow.TotalTime(end_time, TimeFormatType.TYPE_TIME_4);
        }
    }
}

export class DeepCeleGiftViewShowItem extends BaseItem {
    private _key_check_buy: string;
    private sp_show: UISpineShow = undefined;
    private sp_obj: any = undefined;

    protected viewNode = {
        TimesShow: <fgui.GTextField>null,
        BtnAd: <fgui.GButton>null,
        BtnBuy: <fgui.GButton>null,
        RewardList: <fgui.GList>null,
    };
    listData: Item[];

    onConstruct() {
        super.onConstruct()
        this.viewNode.BtnAd.onClick(this.OnClickAd.bind(this));
        this.viewNode.BtnBuy.onClick(this.OnClickBuy.bind(this));

        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208078"), true, (obj: any) => {
            this.sp_obj = obj
            obj.setPosition(342, -93);
            this._container.insertChild(obj, 1);
            this.FlushSpObjShow()
        });
    }

    SetData(data: any) {
        super.SetData(data)

        let rewards = []
        for (let element of data.item) {
            rewards.push(Item.Create({
                itemId: element.item_id,
                num: element.num
            }, { is_num: false }))
        }

        this.viewNode.BtnAd.visible = 0 == data.seq
        this.viewNode.BtnBuy.visible = 0 != data.seq

        let count = data.limit_num - DeepCeleData.Inst().GetGiftItemBuyCount(data.seq)
        UH.SetText(this.viewNode.TimesShow, TextHelper.Format(Language.DeepCele.TimesShow, count))
        this.viewNode.RewardList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = rewards;
        this.viewNode.RewardList.numItems = rewards.length;
        this._key_check_buy = Mod.DeepCeleGift.View + "-" + data.seq;

        this.viewNode.BtnBuy.grayed = 0 == count
        this.viewNode.BtnBuy.touchable = count > 0
        this.viewNode.BtnAd.grayed = 0 == count
        this.viewNode.BtnAd.touchable = count > 0

        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (data.price / 10),
            () => {
                return 0 == (data.limit_num - DeepCeleData.Inst().GetGiftItemBuyCount(this._data.seq))
            });

        this.FlushSpObjShow()
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    FlushSpObjShow() {
        if (this.sp_obj && this._data) {
            this.sp_obj.active = this._data.price >= 300
        }
    }

    OnClickBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let data = this.GetData();
        if (Item.IsGeneBagMax(data.item)) return
        let cfg_word = SettingUsertServeData.Inst().GetWordDes(13);//夏日盛典礼包
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(this._data.seq, ACTIVITY_TYPE.DeepCeleGift, this._data.price, this._data.price, name);
        OrderCtrl.generateOrder(order_data);
    }

    OnClickAd() {
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.deep_cele_gift), "");
    }

    protected onDestroy() {
        super.onDestroy()
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
        }
    }
}

export class DeepCeleGiftViewRewardItem extends BaseItem {
    TwShow: fgui.GTweener = null;

    protected viewNode = {
        CellShow: <ItemCell>null,
        NumShow: <fgui.GTextField>null,
    };

    SetData(data: any) {
        this.viewNode.CellShow.SetData(data)
        UH.SetText(this.viewNode.NumShow, data.num)
    }
}

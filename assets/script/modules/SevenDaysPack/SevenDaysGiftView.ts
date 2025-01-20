import { TextHelper } from './../../helpers/TextHelper';
import * as fgui from "fairygui-cc";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { ItemCell } from "modules/extends/ItemCell";
import { UH } from "../../helpers/UIHelper";
import { Mod } from 'modules/common/ModuleDefine';
import { OrderCtrl, Order_Data } from 'modules/recharge/OrderCtrl';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { SettingUsertServeData } from 'modules/setting/SettingUsertServeData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { AudioTag } from 'modules/audio/AudioManager';
import { SevenDaysPackData } from './SevenDaysPackData';
import { ObjectPool } from 'core/ObjectPool';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';
import { ViewManager } from 'manager/ViewManager';
import { SevenDaysGiftRewardView } from './SevenDaysGiftRewardView';

@BaseView.registView
export class SevenDaysGiftView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "SevenDaysGift",
        ViewName: "SevenDaysGiftView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Name: <fgui.GTextField>null,
        List: <fgui.GList>null,
        BtnBuy: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
        BtnReward: <SevenDaysGiftRewardButton>null,
        Spine: <UISpineShow>null,
    };

    protected extendsCfg = [
        { ResName: "GiftCell", ExtendsClass: SevenDaysGiftCell },
        { ResName: "ButtonReward", ExtendsClass: SevenDaysGiftRewardButton },
    ];
    private _key_check_buy: string;
    private data: any;
    listData: any;
    InitData(param: any) {
        this.data = param;

        let sel_index = (param.start_day % 7) == 0 ? 1 : 0;
        this.view.getController("GiftState").selectedIndex = sel_index;

        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);
        this.viewNode.BtnReward.onClick(this.OnClickReward, this);
        this.viewNode.BtnClose.onClick(this.closeView, this);

        this.AddSmartDataCare(SevenDaysPackData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");
        this.AddSmartDataCare(SevenDaysPackData.Inst().FlushData, this.FlushSel.bind(this), "SelSeq");

        this.viewNode.Spine.LoadSpine(ResPath.Spine("qirishishi/qirishishi_tc"), true);

        SevenDaysPackData.Inst().FlushData.SelSeq = -1

        UH.SetText(this.viewNode.Name, TextHelper.Format(Language.SevenDaysGift.day, param.start_day % 7 == 0 ? 7 : param.start_day % 7));

        this.viewNode.List.width = Math.min(737, param.pack_gift1.length * 177 + (param.pack_gift1.length - 1) * 20)
        this.viewNode.List.setVirtual();
        this.listData = param.pack_gift1;
        this.viewNode.List.itemRenderer  =this.itemRenderer.bind(this);
        this.viewNode.List.numItems = param.pack_gift1.length;

        this._key_check_buy = Mod.SevenDaysPack.View + "-1" + this.data.seq;

        this.FlushData();
        this.FlushSel();
    }

    private itemRenderer(index: number, item: any){
        item.SetData(this.listData[index])
    }

    FlushSel() {
        this.viewNode.BtnReward.FlushShow(this.data.pack_gift2)
    }

    private FlushData() {

        // let day = SevenDaysPackData.Inst().GetDay() + 1
        let isFetch = SevenDaysPackData.Inst().InfoFetch[this.data.seq]
        let text = isFetch ? Language.ActCommon.YiLingQu : Language.Recharge.GoldType[0] + (this.data.recharge / 10)
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, text, ()=>{
            return SevenDaysPackData.Inst().InfoFetch[this.data.seq];
        });
        this.viewNode.BtnBuy.grayed = isFetch
    }


    private OnClickBuy() {
        if (SevenDaysPackData.Inst().InfoFetch[this.data.seq]) {
            return
        }
        // let day = SevenDaysPackData.Inst().GetDay()
        // if (this.data.start_day > day) {
        //     PublicPopupCtrl.Inst().Center(Language.SevenDaysGift.tip1)
        //     return
        // }
        let day = (this.data.start_day % 7);
        if (day != 1 && !SevenDaysPackData.Inst().InfoFetch[this.data.seq - 1]) {
            PublicPopupCtrl.Inst().Center(Language.SevenDaysGift.tip2)
            return
        }
        let index = 0
        if (day == 0) {
            if(SevenDaysPackData.Inst().SelSeq == -1){
                return;
            }else{
                index = SevenDaysPackData.Inst().SelSeq;
            }
        }
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }

        let cfg_word = SettingUsertServeData.Inst().GetWordDes(21);
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;
        let order_data = Order_Data.initOrder(this.data.seq, ACTIVITY_TYPE.SevenDaysPack, this.data.recharge, this.data.recharge, name, index);
        OrderCtrl.generateOrder(order_data);
    }

    OnClickReward() {
        ViewManager.Inst().OpenView(SevenDaysGiftRewardView, this.data.pack_gift2)
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

class SevenDaysGiftRewardButton extends BaseItemGB {
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

    FlushShow(data: any) {
        let sel_seq = SevenDaysPackData.Inst().SelSeq
        this.viewNode.CellShow.visible = sel_seq >= 0
        if (sel_seq >= 0) {
            let co = data[sel_seq]
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

class SevenDaysGiftCell extends BaseItem {
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
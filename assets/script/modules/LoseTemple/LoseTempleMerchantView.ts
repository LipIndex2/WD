import { Color } from 'cc';
import * as fgui from "fairygui-cc";
import { ViewManager } from 'manager/ViewManager';
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { CurrencyShow, ExpShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { HeroCell } from "modules/extends/HeroCell";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { HeroData } from 'modules/hero/HeroData';
import { CocHighPerfList } from '../../ccomponent/CocHighPerfList';
import { UH } from "../../helpers/UIHelper";
import { LoseTempleCtrl } from './LoseTempleCtrl';
import { LoseTempleData } from "./LoseTempleData";
import { ItemCell } from 'modules/extends/ItemCell';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
//商店
@BaseView.registView
export class LoseTempleMerchantView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "LoseTempleMerchant",
        ViewName: "LoseTempleMerchantView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
    };

    protected viewNode = {
        list: <fgui.GList>null,
        BtnClose: <fgui.GButton>null,
        Name: <fgui.GTextField>null,
        bg: <EGLoader>null,
        timer: <TimeMeter>null,
        ExpShow: <ExpShow>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,
    };

    protected extendsCfg = [
        { ResName: "MerchantItem", ExtendsClass: MerchantItem }
    ];
    type: number;
    index: number
    private ListData: any[];

    InitData(type: number) {
        this.type = type;
        this.viewNode.list._container.addComponent(CocHighPerfList);
        this.viewNode.BtnClose.onClick(this.onCloseView, this);

        this.AddSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo", "FlushShopInfo");

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.TempleIntegral);
        this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        // this.viewNode.Currency2.BtnAddShow(true);

        this.viewNode.list.itemRenderer = this.renderListItem.bind(this);
        // this.viewNode.list.setVirtual();

        this.viewNode.timer.SetCallBack(this.FlushFlushTime.bind(this));

        this.FlushData();
        this.FlushFlushTime();
    }

    FlushData() {
        if (this.type == 1) {
            this.ListData = LoseTempleData.Inst().GetTempleShopCfg();
            this.ListData.sort((a, b) => {
                let leftNumA = a.buy_times - LoseTempleData.Inst().GetTempleShopNum(a.seq);
                let leftNumB = b.buy_times - LoseTempleData.Inst().GetTempleShopNum(b.seq);
                if (leftNumA <= 0 && leftNumB > 0) {
                    return 1;
                }
                else if (leftNumA > 0 && leftNumB <= 0) {
                    return -1;
                }
                return a.seq - b.seq;
            });
        } else {
            let isClose = true;
            this.ListData = [];
            let eventId = LoseTempleData.Inst().GetMysteriousShopEventId();
            let cfg = LoseTempleData.Inst().GetMysteriousShopCfg(eventId);
            for (let i = 0; i < cfg.length; i++) {
                (<any>cfg[i]).seq = i;
                this.ListData.push(cfg[i]);
            }
            for (let i = 0; i < this.ListData.length; i++) {
                let num = LoseTempleData.Inst().GetMysteriousNum(this.ListData[i].seq);
                let maxNum = this.ListData[i].buy_times;
                if (num < maxNum) {
                    isClose = false
                    break;
                }
            }
            this.ListData.sort((a, b) => {
                let leftNumA = a.buy_times - LoseTempleData.Inst().GetMysteriousNum(a.seq);
                let leftNumB = b.buy_times - LoseTempleData.Inst().GetMysteriousNum(b.seq);
                if (leftNumA <= 0 && leftNumB > 0) {
                    return 1;
                }
                else if (leftNumA > 0 && leftNumB <= 0) {
                    return -1;
                }
                return a.seq - b.seq;
            })
            if (isClose) {
                this.onCloseView();
                return;
            }
        }
        this.viewNode.list.numItems = this.ListData.length;
    }

    private renderListItem(index: number, item: MerchantItem) {
        item.ItemIndex(index, this.type);
        item.SetData(this.ListData[index]);
    }

    private FlushFlushTime() {
        let time = 0;
        if (this.type == 1) {
            time = LoseTempleData.Inst().getEndTime();
        } else {
            time = LoseTempleData.Inst().getShopListEndTime();
        }
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        } else {
            this.onCloseView();
        }
    }

    InitUI() {
        if (this.type == 1) {
            UH.SetText(this.viewNode.Name, Language.LoseTemple.shopName)
        } else {
            UH.SetText(this.viewNode.Name, Language.LoseTemple.shopName1)
        }
    }

    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.bg.SetIcon("loader/LoseTemple/Merchant" + this.type, () => {
            waitHandle.complete = true;
            this.refreshBgSize(this.viewNode.bg)
        })
    }

    onCloseView() {
        AudioManager.Inst().PlaySceneAudio(AudioTag.TongYongClick, 0);
        ViewManager.Inst().CloseView(LoseTempleMerchantView)
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        this.viewNode.timer.CloseCountDownTime();
    }
}

export class MerchantItem extends BaseItem {
    protected viewNode = {
        bg: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        Name: <fgui.GTextField>null,
        Count: <fgui.GTextField>null,
        Num: <fgui.GTextField>null,
        HeroNum: <fgui.GTextField>null,
        BtnBuy: <fgui.GButton>null,
        BuyShow: <fgui.GGroup>null,
        HeroCell: <HeroCell>null,
        ItemCell: <ItemCell>null,
    };

    private get itemIndex(): number {
        return this.data?.seq
    }

    private type: number
    public SetData(data: any) {
        super.SetData(data)
        this.data = data;
        let item = Item.GetConfig(data.item[0].item_id);
        let num = 0;
        if (item.item_type == 3) {
            let id = HeroData.Inst().GetDebrisHeroId(data.item[0].item_id)
            this.viewNode.HeroCell.SetData(id)
            UH.SetText(this.viewNode.HeroNum, "x" + data.item[0].num);
            UH.SpriteName(this.viewNode.bg, "LoseTempleMerchant", "GouMaiYingXiongDi")
        } else {
            UH.SpriteName(this.viewNode.bg, "LoseTempleMerchant", "GouMaiJinBiDi")
            UH.SetText(this.viewNode.Num, data.item[0].num);
          
            // UH.SetIcon(this.viewNode.Icon, item.icon_id, ICON_TYPE.ITEM)

            this.viewNode.ItemCell.SetData(Item.Create(data.item[0]));
        }
        if (this.type == 1) {
            num = data.buy_times - LoseTempleData.Inst().GetTempleShopNum(this.itemIndex);
        } else {
            num = data.buy_times - LoseTempleData.Inst().GetMysteriousNum(this.itemIndex)
        }

        this.viewNode.BtnBuy.onClick(this.onClickBuy, this);
        if (item.name.length > 5) {
            this.viewNode.Name.fontSize = 24;
        } else {
            this.viewNode.Name.fontSize = 36;
        }

        if (item.color == 3) {
            this.viewNode.Name.color = new Color(244, 160, 255);
        } else if (item.color == 2) {
            this.viewNode.Name.color = new Color(104, 231, 251);
        } else {
            this.viewNode.Name.color = new Color(182, 252, 135);
        }

        UH.SetText(this.viewNode.Name, item.name);
        UH.SetText(this.viewNode.Count, Language.LoseTemple.CountNum + num);
        this.viewNode.BuyShow.visible = num == 0;
        this.viewNode.BtnBuy.visible = num > 0;
        this.viewNode.BtnBuy.title = data.price_item[0].num
        this.viewNode.BtnBuy.icon = fgui.UIPackage.getItemURL("CommonCurrency", `Big${data.price_item[0].item_id}`);
        // this.viewNode.Icon.visible = item.item_type != 3
        this.viewNode.Num.visible = item.item_type != 3
        this.viewNode.HeroCell.visible = item.item_type == 3
        this.viewNode.HeroNum.visible = item.item_type == 3
    }
    onClickBuy() {
        let data = this.GetData();
        if (Item.IsGeneBagMax(data.item)) return
        if (this.type == 1) {
            LoseTempleCtrl.Inst().SendLoseTempleShopBuy(this.data.seq, 1);
        } else {
            let index = LoseTempleData.Inst().GetMysteriousShopIndex();
            LoseTempleCtrl.Inst().SendLoseMysteriousShop(index, this.itemIndex);
        }
        AudioManager.Inst().PlaySceneAudio(AudioTag.TongYongClick, 0);
    }
    ItemIndex(index: number, type: number) {
        // this.itemIndex = index;
        this.type = type;
    }
}
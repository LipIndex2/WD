import { RoleData } from 'modules/role/RoleData';
import { ShopData } from 'modules/shop/ShopData';
import { NewPackData } from './../NewPack/NewPackData';

import * as fgui from "fairygui-cc";
import { FunOpen } from 'modules/FunUnlock/FunOpen';
import { GrowUpGiftData } from 'modules/GrowUpGift/GrowUpGiftData';
import { ACTIVITY_TYPE } from 'modules/activity/ActivityEnum';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';
import { Item } from 'modules/bag/ItemData';
import { BaseItemCare } from "modules/common/BaseItem";
import { BasePanel } from 'modules/common/BasePanel';
import { COLORS } from 'modules/common/ColorEnum';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { Language } from 'modules/common/Language';
import { Mod } from 'modules/common/ModuleDefine';
import { ItemCell } from 'modules/extends/ItemCell';
import { TimeFormatType, TimeMeter } from 'modules/extends/TimeMeter';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { OrderCtrl, Order_Data, RechargeType } from 'modules/recharge/OrderCtrl';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { TextHelper } from '../../helpers/TextHelper';
import { UH } from '../../helpers/UIHelper';
import { AdFreeData } from 'modules/AdFree/AdFreeData';
import { SettingUsertServeData } from 'modules/setting/SettingUsertServeData';
import { CfgWord } from 'config/CfgWordDes';
import { GeneOrientationData } from 'modules/GeneOrientation/GeneOrientationData';
import { HeroData } from 'modules/hero/HeroData';
import { GeneGiftData } from 'modules/GeneGift/GeneGiftData';

export enum SHOP_GIFT_TYPE {
    Barrier,   // 章节
    NewPack, //新手礼包
    GrowUp,   //成长
    AdFree,   //免广告特权
    GenePack,  //基因
    GeneOrientation,  //基因定向
}

export class ShopViewSalePanel extends BasePanel {
    protected viewNode = {
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ShopSale0", ExtendsClass: ShopViewSalePanelItem },
        // { ResName: "ShopSale1", ExtendsClass: ShopViewSalePanel1 },
        // { ResName: "ShopSale2", ExtendsClass: ShopViewSalePanel2 },
        { ResName: "ShopSaleItem", ExtendsClass: ShopSaleItem },
    ];
    private showPanel: number[];
    InitPanelData() {
        this.AddSmartDataCare(ShopData.Inst().FlushData, this.InitPanel.bind(this), "FlushPackInfo");
        this.AddSmartDataCare(NewPackData.Inst().FlushData, this.InitPanel.bind(this), "FlushInfo");
        this.AddSmartDataCare(GrowUpGiftData.Inst().FlushData, this.InitPanel.bind(this), "FlushInfo");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.InitPanel.bind(this), "FlushRoleInfo");
        this.AddSmartDataCare(AdFreeData.Inst().FlushData, this.InitPanel.bind(this), "FlushInfo");
        this.AddSmartDataCare(GeneOrientationData.Inst().FlushData, this.InitPanel.bind(this), "FlushInfo");
        this.AddSmartDataCare(GeneGiftData.Inst().FlushData, this.InitPanel.bind(this), "FlushInfo");
        this.viewNode.ShowList.setVirtual();
        // this.viewNode.ShowList.itemProvider = this.GetListItemResource.bind(this);
    }

    InitPanel() {
        this.showPanel = [];
        if (FunOpen.Inst().checkAudit(1)) {
            let Level = RoleData.Inst().InfoMainSceneLevel;
            let BarrierPack = ShopData.Inst().GetBarrierPack();
            let newPack = NewPackData.Inst().GetIsActiveOver();
            let GrowUpGift = GrowUpGiftData.Inst().getGiftNum();
            let AdFree = AdFreeData.Inst().GetIsAdFreeOpen();
            let GeneOrientation = GeneOrientationData.Inst().GetIsGeneOrientationOpen();
            let GenePack = GeneGiftData.Inst().GetIsActiveOver();
            if (Level > 1 && BarrierPack.length > 0) {
                this.showPanel.push(SHOP_GIFT_TYPE.Barrier)
            }
            if (newPack) {
                this.showPanel.push(SHOP_GIFT_TYPE.NewPack)
            }
            if (GrowUpGift) {
                this.showPanel.push(SHOP_GIFT_TYPE.GrowUp)
            }
            if (AdFree) {
                this.showPanel.push(SHOP_GIFT_TYPE.AdFree)
            }
            if (GeneOrientation) {
                this.showPanel.push(SHOP_GIFT_TYPE.GeneOrientation)
            }
            if (GenePack) {
                this.showPanel.push(SHOP_GIFT_TYPE.GenePack)
            }
        }
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = this.showPanel.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.showPanel[index]);
    }

    // private GetListItemResource(index: number) {
    //     return fgui.UIPackage.getItemURL("Shop", "ShopSale0");
    // }
}

export class ShopSaleItem extends BaseItemCare {
    protected viewNode = {
        ItemCell: <ItemCell>null,
        Num: <fgui.GTextField>null,
    };
    SetData(data: any) {
        this.viewNode.ItemCell.SetData(Item.Create(data));
        UH.SetText(this.viewNode.Num, data.num);
    }
}


export class ShopViewSalePanelItem extends BaseItemCare {
    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        OriginalCost: <fgui.GTextField>null,
        DiscountShow: <fgui.GTextField>null,
        BtnLeft: <fgui.GButton>null,
        BtnRight: <fgui.GButton>null,
        BtnBuy: <fgui.GButton>null,
        List: <fgui.GList>null,
        BgSp: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        Icon2: <fgui.GLoader>null,
        timer: <TimeMeter>null,
        TimeShow: <fgui.GGroup>null,
        OriginalShow: <fgui.GGroup>null,
        NameBg2: <fgui.GImage>null,
        NameBg1: <fgui.GImage>null,
        deco: <fgui.GImage>null,
        Limitation: <fgui.GTextField>null,
    };

    private index: number = 0;
    private maxNum: number = 0;
    private _key_check_buy: string;
    private pack_gift: any[];
    private type: number;
    private cache_timer: number;

    SetData(type: number) {
        this.type = type;
        this.viewNode.BtnLeft.onClick(this.OnClickLeft, this);
        this.viewNode.BtnRight.onClick(this.OnClickRight, this);
        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);

        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.setVirtual();

        /**todo 暂时处理 */
        this.index = 0;
        this.viewNode.Icon.visible = true;
        /**todo 暂时处理 */

        this.maxNum = 0;
        if (type == SHOP_GIFT_TYPE.Barrier) {
            let BarrierPack = ShopData.Inst().GetBarrierPack();
            this.maxNum = BarrierPack.length - 1;
            this.index = BarrierPack.length - 1
        } else if (type == SHOP_GIFT_TYPE.GrowUp) {
            this.maxNum = GrowUpGiftData.Inst().getGiftNum() - 1
        } else if (type == SHOP_GIFT_TYPE.GeneOrientation) {
            this.maxNum = GeneOrientationData.Inst().getGiftNum() - 1;
            this.index = GeneOrientationData.Inst().getGiftNum() - 1;
        } else {
            this.maxNum = 0;
        }

        this.viewNode.OriginalShow.visible = false;
        this.viewNode.TimeShow.visible = false;

        this.FlushData();
        this.NameBgShow(type == 0);
    }

    FlushData() {

        if (this.type == SHOP_GIFT_TYPE.Barrier) {
            this.FlushBarrierPackShow();
        } else if (this.type == SHOP_GIFT_TYPE.NewPack) {
            this.FlushNewPackShow();
        } else if (this.type == SHOP_GIFT_TYPE.GrowUp) {
            this.FlushGrowUpGiftShow();
        } else if (this.type == SHOP_GIFT_TYPE.AdFree) {
            this.FlushAdFreeShow();
        } else if (this.type == SHOP_GIFT_TYPE.GeneOrientation) {
            this.FlushGeneOrientationShow();
        } else if (this.type == SHOP_GIFT_TYPE.GenePack) {
            this.FlushGeneGiftShow();
        }

        this.aroundBtnShow();
    }

    FlushBarrierPackShow() {
        // let Level = this.index;
        let BarrierPack = ShopData.Inst().GetBarrierPack();
        let Level = BarrierPack[this.index];
        this.data = ShopData.Inst().CfgBarrierPack(Level);
        UH.SetText(this.viewNode.NameShow, TextHelper.Format(Language.Shop.BarrierPack, this.data.unlock_barrier));
        UH.SetText(this.viewNode.OriginalCost, TextHelper.Format(Language.Shop.ShopMainCard.PricePre, this.data.fake_price));
        UH.SetText(this.viewNode.DiscountShow, this.data.discount + "%")
        UH.SetIcon(this.viewNode.Icon, this.data.res_id1, ICON_TYPE.SHOPGIFT)
        UH.SetIcon(this.viewNode.BgSp, this.data.res_id2, ICON_TYPE.SHOPGIFT)
        this.viewNode.OriginalShow.visible = true;
        this.pack_gift = this.data.pack_gift;
        this.viewNode.List.numItems = this.data.pack_gift.length;
        this._key_check_buy = Mod.Shop.SaleGift + "-" + ACTIVITY_TYPE.BarrierPack;
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (this.data.price / 10));
    }
    FlushNewPackShow() {
        let seq = NewPackData.Inst().getGiftInfo();
        this.data = NewPackData.Inst().GetGiftCfg(seq);
        this.pack_gift = this.data.pack_gift;
        this.viewNode.List.numItems = this.data.pack_gift.length;
        UH.SetIcon(this.viewNode.Icon, "barriericon_6", ICON_TYPE.SHOPGIFT)
        UH.SetIcon(this.viewNode.BgSp, "barrierbg_1", ICON_TYPE.SHOPGIFT)
        UH.SetText(this.viewNode.NameShow, Language.Shop.NewPack);
        UH.SetText(this.viewNode.DiscountShow, this.data.discount + "%")
        this._key_check_buy = Mod.Shop.SaleGift + "-" + ACTIVITY_TYPE.NewPack
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (this.data.price / 10));
    }
    FlushGrowUpGiftShow() {
        let info = GrowUpGiftData.Inst().getGiftInfo(this.index);
        this.data = GrowUpGiftData.Inst().GetGiftCfg(info.seq);
        this.cache_timer = info.endTime;
        this.pack_gift = this.data.reward_item;
        this.viewNode.List.numItems = this.data.reward_item.length
        this.viewNode.Icon.visible = false;
        UH.SetIcon(this.viewNode.BgSp, this.data.res_id1, ICON_TYPE.SHOPGIFT)
        UH.SetText(this.viewNode.NameShow, Language.Shop.GrowUpGift);
        UH.SetText(this.viewNode.DiscountShow, this.data.discount + "%")
        this._key_check_buy = Mod.Shop.SaleGift + "-" + ACTIVITY_TYPE.GrowGift;
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (this.data.price / 10));
        this.FlushFlushTime();
    }
    FlushGeneGiftShow() {
        let seq = GeneGiftData.Inst().getGiftInfo();
        this.data = GeneGiftData.Inst().GetGiftCfg(seq);
        this.pack_gift = this.data.pack_gift;
        this.viewNode.List.numItems = this.data.pack_gift.length;
        this.viewNode.Icon.visible = false;
        // UH.SetIcon(this.viewNode.Icon, "barriericon_6", ICON_TYPE.SHOPGIFT)
        UH.SetIcon(this.viewNode.BgSp, "gene_gift", ICON_TYPE.SHOPGIFT)
        UH.SetText(this.viewNode.NameShow, Language.Shop.GenePack);
        UH.SetText(this.viewNode.DiscountShow, this.data.discount + "%")
        this._key_check_buy = Mod.Shop.SaleGift + "-" + ACTIVITY_TYPE.GeneGift
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (this.data.price / 10));
    }
    FlushAdFreeShow() {
        this.data = AdFreeData.Inst().GetPrivilegeCfg();
        this.viewNode.Icon.visible = false;
        UH.SetIcon(this.viewNode.Icon2, "adfreebg", ICON_TYPE.SHOPGIFT)
        UH.SetIcon(this.viewNode.BgSp, "barrierbg_5", ICON_TYPE.SHOPGIFT)
        UH.SetText(this.viewNode.NameShow, Language.Shop.AdFree);
        this.pack_gift = this.data.item;
        this.viewNode.List.numItems = this.pack_gift.length
        this.viewNode.DiscountShow.visible = false;
        this.viewNode.deco.visible = false;
        this._key_check_buy = Mod.Shop.SaleGift + "-" + RechargeType.BUY_TYPE_AD_PASS;
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (this.data.price / 10));
    }
    FlushGeneOrientationShow() {
        let hero_id = GeneOrientationData.Inst().GetShopGiftHeroId(this.index);
        this.data = GeneOrientationData.Inst().GetGiftCfg(hero_id);
        this.data.seq = GeneOrientationData.Inst().getIndex(hero_id);
        this.viewNode.Icon.setScale(1.4, 1.4);
        UH.SetIcon(this.viewNode.Icon, this.data.res_id2, ICON_TYPE.HEROSMAIN)
        UH.SetIcon(this.viewNode.BgSp, this.data.res_id1, ICON_TYPE.SHOPGIFT)
        UH.SetText(this.viewNode.NameShow, Language.Shop.GeneGift);
        this.pack_gift = this.data.item;
        this.viewNode.List.numItems = this.pack_gift.length
        UH.SetText(this.viewNode.DiscountShow, this.data.discount + "%")
        this.viewNode.Limitation.visible = false;
        this._key_check_buy = Mod.Shop.SaleGift + "-" + RechargeType.BUY_TYPE_GENE_GIFT;
        OrderCtrl.Inst().CheckMaiButton(this._key_check_buy, this.viewNode.BtnBuy, Language.Recharge.GoldType[0] + (this.data.price / 10));
    }

    OnClickBuy() {
        if (!OrderCtrl.Inst().CheckMaiButtonClick(this._key_check_buy)) {
            PublicPopupCtrl.Inst().Center(Language.Common.payWait)
            return
        }
        let rechargeType;
        let cfg_word: CfgWord;
        if (this.type == SHOP_GIFT_TYPE.Barrier) {
            rechargeType = ACTIVITY_TYPE.BarrierPack
            cfg_word = SettingUsertServeData.Inst().GetWordDes(16);//章节礼包
        } else if (this.type == SHOP_GIFT_TYPE.NewPack) {
            rechargeType = ACTIVITY_TYPE.NewPack
            cfg_word = SettingUsertServeData.Inst().GetWordDes(15);//新手礼包
        } else if (this.type == SHOP_GIFT_TYPE.GrowUp) {
            rechargeType = ACTIVITY_TYPE.GrowGift
            cfg_word = SettingUsertServeData.Inst().GetWordDes(9);//成长礼包
        } else if (this.type == SHOP_GIFT_TYPE.AdFree) {
            rechargeType = RechargeType.BUY_TYPE_AD_PASS
            cfg_word = SettingUsertServeData.Inst().GetWordDes(17);//广告特权
        } else if (this.type == SHOP_GIFT_TYPE.GeneOrientation) {
            rechargeType = ACTIVITY_TYPE.GeneOrientation
            cfg_word = SettingUsertServeData.Inst().GetWordDes(21);//基因礼包
        } else if (this.type == SHOP_GIFT_TYPE.GenePack) {
            rechargeType = ACTIVITY_TYPE.GeneGift
            cfg_word = SettingUsertServeData.Inst().GetWordDes(15);//基因新手礼包
        }
        let name = (cfg_word && cfg_word.name) ? cfg_word.name : Language.Recharge.Diamond;

        let order_data = Order_Data.initOrder(this.data.seq, rechargeType, this.data.price, this.data.price, name);
        OrderCtrl.generateOrder(order_data);
    }
    //左右按钮显示
    private aroundBtnShow() {
        this.viewNode.BtnLeft.visible = this.index != 0;
        this.viewNode.BtnRight.visible = this.index != this.maxNum;
    }

    //左右按钮显示
    private NameBgShow(visible: boolean) {
        this.viewNode.NameBg1.visible = visible;
        this.viewNode.NameBg2.visible = !visible;
    }

    private FlushFlushTime() {
        let time = this.cache_timer - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.TimeShow.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_0);
        }
    }

    private renderListItem(index: number, item: ShopSaleItem) {
        item.SetData(this.pack_gift[index]);
    }

    OnClickLeft() {
        this.index--;
        this.FlushData();
        AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
    }

    OnClickRight() {
        this.index++;
        this.FlushData();
        AudioManager.Inst().PlayUIAudio(AudioTag.TongYongClick);
    }
    protected onDestroy(): void {
        super.onDestroy();
        this.viewNode.timer.CloseCountDownTime();
    }
}

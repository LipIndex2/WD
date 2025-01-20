
import * as fgui from "fairygui-cc";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { TrafficPermitData } from "modules/TrafficPermit/TrafficPermitData";
import { BasePanel } from 'modules/common/BasePanel';
import { Mod } from "modules/common/ModuleDefine";
import { RoleData } from "modules/role/RoleData";
import { ShopData } from "./ShopData";
import { ShopViewMainPanelBox, ShopViewMainPanelBoxButton, ShopViewMainPanelBoxProgress } from "./ShopViewMainPanelBox";
import { ShopViewMainPanelCard, ShopViewMainPanelCardButton } from "./ShopViewMainPanelCard";
import { ShopViewMainPanelDiamond, ShopViewMainPanelDiamondItem } from "./ShopViewMainPanelDiamond";
import { ShopViewMainPanelDiscount, ShopViewMainPanelDiscountFlushButton, ShopViewMainPanelDiscountHeroItem, ShopViewMainPanelDiscountItem } from "./ShopViewMainPanelDiscount";
import { ShopViewMainPanelGift, ShopViewMainPanelGiftItem } from "./ShopViewMainPanelGift";
import { ShopViewMainPanelGold, ShopViewMainPanelGoldItem } from "./ShopViewMainPanelGold";

export class ShopViewMainPanel extends BasePanel {
    protected viewNode = {
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ShopMain0", ExtendsClass: ShopViewMainPanelCard },
        { ResName: "ShopMain1", ExtendsClass: ShopViewMainPanelBox },
        { ResName: "ShopMain2", ExtendsClass: ShopViewMainPanelDiscount },
        { ResName: "ShopMain3", ExtendsClass: ShopViewMainPanelDiamond },
        { ResName: "ShopMain4", ExtendsClass: ShopViewMainPanelGold },
        { ResName: "ShopMain5", ExtendsClass: ShopViewMainPanelGift },

        { ResName: "ProgressBox", ExtendsClass: ShopViewMainPanelBoxProgress },
        { ResName: "ButtonMainDiscount", ExtendsClass: ShopViewMainPanelDiscountItem },
        { ResName: "ButtonMainDiamond", ExtendsClass: ShopViewMainPanelDiamondItem },
        { ResName: "ButtonMainGold", ExtendsClass: ShopViewMainPanelGoldItem },
        { ResName: "ItemDiscountHero", ExtendsClass: ShopViewMainPanelDiscountHeroItem },
        { ResName: "ButtonMainCard", ExtendsClass: ShopViewMainPanelCardButton },
        { ResName: "ButtonPreferenceGifr", ExtendsClass: ShopViewMainPanelGiftItem },

        { ResName: "ButtonMainBox1", ExtendsClass: ShopViewMainPanelBoxButton },
        { ResName: "ButtonMainBox2", ExtendsClass: ShopViewMainPanelBoxButton },
        { ResName: "ButtonMainBox3", ExtendsClass: ShopViewMainPanelBoxButton },
        { ResName: "ButtonMainDiscountFlush", ExtendsClass: ShopViewMainPanelDiscountFlushButton },
    ];
    showPanel: number[] = [];
    InitPanelData() {
        // this.viewNode.ShowList.setVirtual();
        this.viewNode.ShowList.itemProvider = this.GetListItemResource.bind(this);

        this.AddSmartDataCare(ShopData.Inst().FlushData, this.FlushMainlList.bind(this), "FlushMainlList");
        this.AddSmartDataCare(ShopData.Inst().FlushData, this.FlushMainlList.bind(this), "FlushMainlList");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.InitPanel.bind(this), "FlushRoleInfo");
        this.AddSmartDataCare(TrafficPermitData.Inst().FlushData, this.InitPanel.bind(this), "FlushInfo");
    }

    InitPanel() {
        this.showPanel = [1, 3, 4];
        // if (FunOpen.Inst().checkAudit(1)) {
        //     let is_funOpen = FunOpen.Inst().GetFunIsOpen(Mod.TrafficPermit.View);
        //     let isactive = TrafficPermitData.Inst().GetIsActive();
        //     if (is_funOpen.is_open && !isactive) {
        //         this.showPanel.push(0)
        //     }
        //     let isShopGiftActive = ShopData.Inst().GetShopGift();
        //     if (isShopGiftActive.length > 0) {
        //         this.showPanel.push(5)
        //     }
        // }
        // this.showPanel.push(1, 2, 3, 4)
        // if (!FunOpen.Inst().checkAudit(1)) {
        //     let index = this.showPanel.indexOf(3);
        //     if (index !== -1) {
        //         this.showPanel.splice(index, 1);
        //     }
        // }
        this.viewNode.ShowList.numItems = 0
        this.viewNode.ShowList.itemRenderer = this.rendererItem.bind(this);
        this.viewNode.ShowList.numItems = this.showPanel.length;
    }

    private rendererItem(index: number, item: any) {
        item.SetData(this.showPanel[index]);
    }

    private GetListItemResource(index: number) {
        return fgui.UIPackage.getItemURL("Shop", "ShopMain" + this.showPanel[index]);
    }

    FlushMainlList() {
        // this.viewNode.ShowList.refreshVirtualList()
    }

}

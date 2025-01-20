import { HeroData } from 'modules/hero/HeroData';

import { ObjectPool } from 'core/ObjectPool';
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BagData } from "modules/bag/BagData";
import { Item } from 'modules/bag/ItemData';
import { BaseItemCare, BaseItemGB, BaseItemGP } from "modules/common/BaseItem";
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { Language } from 'modules/common/Language';
import { EGLoader } from 'modules/extends/EGLoader';
import { RedPoint } from 'modules/extends/RedPoint';
import { GuideCtrl } from 'modules/guide/GuideCtrl';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';
import { UH } from "../../helpers/UIHelper";
import { ShopBoxRewardView } from "./ShopBoxRewardView";
import { ShopData } from "./ShopData";
import { ShopTreasureBoxView } from "./ShopTreasureBoxView";

export class ShopViewMainPanelBox extends BaseItemCare {
    protected viewNode = {
        BtnTips: <fgui.GButton>null,
        BtnBox1: <ShopViewMainPanelBoxButton>null,
        BtnBox2: <ShopViewMainPanelBoxButton>null,
        BtnBox3: <ShopViewMainPanelBoxButton>null,
        bg: <fgui.GImage>null,

        LevelShow: <fgui.GTextField>null,
        ProgressBox: <ShopViewMainPanelBoxProgress>null,
    };

    InitData() {
        this.viewNode.BtnTips.onClick(this.OnClickTips, this);
        this.viewNode.BtnBox1.onClick(this.OnClickBox.bind(this, 0));
        this.viewNode.BtnBox2.onClick(this.OnClickBox.bind(this, 1));
        this.viewNode.BtnBox3.onClick(this.OnClickBox.bind(this, 2));


        // this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);

        this.AddSmartDataCare(ShopData.Inst().FlushData, this.FlushBoxInfo.bind(this), "FlushBoxInfo");

        GuideCtrl.Inst().AddGuideUi("ShopViewBoxBtnBox1", this.viewNode.BtnBox1);
    }

    InitUI() {
        this.FlushBoxInfo()
    }

    protected onDestroy() {
        super.onDestroy()
        GuideCtrl.Inst().ClearGuideUi("ShopViewBoxBtnBox1");
    }

    FlushBoxInfo() {
        if (!ShopData.Inst().BoxInfo) {
            return
        }
        let boxShow = HeroData.Inst().GetHeroColorDebrisLock(3) > 0;
        this.viewNode.BtnBox3.visible = boxShow;
        this.viewNode.bg.height = boxShow ? 760 : 522;
        this.height = boxShow ? 862 : 624

        ShopData.Inst().FlushMainlList()

        UH.SetText(this.viewNode.LevelShow, `等级.${ShopData.Inst().BoxInfoBoxLevel}`);
        this.viewNode.ProgressBox.FlushShow();

        this.viewNode.BtnBox1.FlushShow(0)
        this.viewNode.BtnBox2.FlushShow(1)
        this.viewNode.BtnBox3.FlushShow(2)
    }

    OnClickBox(index: number) {
        ViewManager.Inst().OpenView(ShopTreasureBoxView, index)
    }

    OnClickTips() {
        ViewManager.Inst().OpenView(ShopBoxRewardView)
    }
}

export class ShopViewMainPanelBoxProgress extends BaseItemGP {
    private sp_show: UISpineShow = undefined;
    private sp_obj: any = undefined;

    protected viewNode = {
        ProgressShow: <fgui.GTextField>null,
    };

    FlushShow() {

        if (undefined == this.sp_show) {
            this.sp_show = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1203001"), true, (obj: any) => {
                this.sp_obj = obj
                this.sp_obj.setPosition(231, -17);
                this._container.insertChild(this.sp_obj, 2);
                this.FlushEff()
            });
        }
        let co = ShopData.Inst().CfgShopBoxLevel(ShopData.Inst().BoxInfoBoxLevel);
        let up_need_exp = co ? co.up_need_exp : 0;
        this.value = ShopData.Inst().BoxInfoBoxExp;
        this.max = up_need_exp;
        UH.SetText(this.viewNode.ProgressShow, `${ShopData.Inst().BoxInfoBoxExp}/${up_need_exp}`)
        this.FlushEff()
    }

    FlushEff() {
        if (this.sp_obj) {
            this.sp_obj.setScale(this.value / this.max, 1)
            this.sp_obj.setPosition(231 * (this.value / this.max), -17);
        }
    }

    onDestroy() {
        super.onDestroy();
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
        }
    }
}

export class ShopViewMainPanelBoxButton extends BaseItemGB {
    protected viewNode = {
        MustShow: <fgui.GTextField>null,
        redPoint: <RedPoint>null,
    };
    FlushShow(data: any) {
        let co = ShopData.Inst().CfgShopBoxPrice(data)
        let have_num = BagData.Inst().GetItemNum(co.buy_item_id2)
        this.viewNode.redPoint.SetNum(have_num >= co.buy_item_num2 ? 1 : 0);
        if (have_num >= co.buy_item_num2) {
            this.icon = EGLoader.IconGeterFuncs[ICON_TYPE.ITEM](Item.GetIconId(co.buy_item_id2));
            // btn.icon = fgui.UIPackage.getItemURL("CommonCurrency", `YaoShi${box_type + 1}`);
        } else {
            this.icon = fgui.UIPackage.getItemURL("CommonCurrency", `Big${co.buy_item_id1}`);
        }
        this.title = have_num > 0 ? `${have_num}/${co.buy_item_num2}` : `${co.buy_item_num1}`
        UH.SetText(this.viewNode.MustShow, Language.Shop.TreasureBox.MustShow[data])
    }
}

import { MainData } from './../main/MainData';
import { FirstChargeCtrl } from 'modules/FirstCharge/FirstChargeCtrl';
import { ShopView } from 'modules/shop/ShopView';
import { FirstChargeData } from './FirstChargeData';
import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { UH } from '../../helpers/UIHelper';
import { ViewManager } from 'manager/ViewManager';
import { AudioTag } from 'modules/audio/AudioManager';
import { Mod } from 'modules/common/ModuleDefine';
import { Item } from 'modules/bag/ItemData';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { HeroData } from 'modules/hero/HeroData';
import { TextHelper } from '../../helpers/TextHelper';
import { ItemCell } from 'modules/extends/ItemCell';

@BaseView.registView
export class FirstChargeView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FirstCharge",
        ViewName: "FirstChargeView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Desc: <fgui.GTextField>null,
        List: <fgui.GList>null,
        BtnShop: <fgui.GButton>null,
        BtnAward: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "FirstChargeitem", ExtendsClass: FirstChargeitem }
    ];
    listData: import("d:/ccs/wjszm-c/assets/script/config/CfgCommon").CfgItem[];

    InitData() {
        this.AddSmartDataCare(FirstChargeData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");
        this.viewNode.BtnClose.onClick(this.onClickCloseView, this);
        this.viewNode.BtnShop.onClick(this.onCickOpenShop, this);
        this.viewNode.BtnAward.onClick(this.onCickAward, this);

        let cfg = FirstChargeData.Inst().GetFirstChargeCfg();
        UH.SetText(this.viewNode.Desc, cfg.desc);
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = cfg.reward_item;
        this.viewNode.List.numItems = cfg.reward_item.length;
        this.FlushData();
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    FlushData() {
        let isActive = FirstChargeData.Inst().GetInfoActive();
        this.viewNode.BtnShop.visible = !isActive;
        this.viewNode.BtnAward.visible = isActive;
    }

    onCickOpenShop() {
        ViewManager.Inst().OpenView(ShopView);
        MainData.Inst().FlushMainMenu();
        this.onClickCloseView();
    }

    onCickAward() {
        FirstChargeCtrl.Inst().SendFirstChargeReq();
        this.onClickCloseView();
    }

    onClickCloseView() {
        ViewManager.Inst().CloseView(FirstChargeView);
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


export class FirstChargeitem extends BaseItem {
    protected viewNode = {
        Num: <fgui.GTextField>null,
        HeroNum: <fgui.GTextField>null,
        HeroShow: <fgui.GGroup>null,
        Icon: <fgui.GLoader>null,
        ItemCell: <ItemCell>null,
    };
    public SetData(data: any) {

        let item_call = Item.Create(data);
        this.viewNode.ItemCell.SetData(item_call);

        let cfg = Item.GetConfig(data.item_id);
        let isHero = cfg.item_type == 3
        // this.viewNode.HeroShow.visible = isHero;
        if (isHero) {
            UH.SetText(this.viewNode.Num, cfg.name);
            this.viewNode.Num.fontSize = 37;
            UH.SetText(this.viewNode.HeroNum, "x" + data.num);
            let img = HeroData.Inst().GetDebrisHeroIcon(data.item_id, 1)
            UH.SetIcon(this.viewNode.Icon, img, ICON_TYPE.ROLE);
        } else {
            UH.SetText(this.viewNode.Num, data.num);
            this.viewNode.Num.fontSize = 40;
            UH.SetIcon(this.viewNode.Icon, data.item_id, ICON_TYPE.ITEM);
            UH.SetText(this.viewNode.HeroNum, "");
        }

    }
}

import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UH } from "../../helpers/UIHelper";
import { ShopBoxLevelUpView } from "./ShopBoxLevelUpView";
import { ShopData } from "./ShopData";

@BaseView.registView
export class ShopBoxRewardView extends BaseView {
    static selLevel: number

    protected viewRegcfg = {
        UIPackName: "ShopBoxReward",
        ViewName: "ShopBoxRewardView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnLeft: <fgui.GButton>null,
        BtnRight: <fgui.GButton>null,

        LevelShow: <fgui.GTextField>null,
        TipsShow: <fgui.GTextField>null,
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: ShopBoxRewardViewShowItem },
        { ResName: "ItemAdd", ExtendsClass: ShopBoxRewardViewAddItem }
    ];
    listData: any[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(ShopBoxRewardView));

        this.viewNode.BtnLeft.onClick(this.OnClickLeft, this);
        this.viewNode.BtnRight.onClick(this.OnClickRight, this);

        ShopBoxRewardView.selLevel = ShopData.Inst().BoxInfoBoxLevel
    }

    InitUI() {
        this.FlushShow()
    }

    FlushShow() {
        let sl = ShopBoxRewardView.selLevel > 1
        let sr = ShopBoxRewardView.selLevel < ShopData.Inst().CfgShopBoxMaxLevel()
        this.viewNode.BtnLeft.touchable = sl
        this.viewNode.BtnLeft.grayed = !sl
        this.viewNode.BtnRight.touchable = sr
        this.viewNode.BtnRight.grayed = !sr

        let show_list = ShopData.Inst().GetShopBoxRewardShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = show_list;
        this.viewNode.ShowList.numItems = show_list.length;
        UH.SetText(this.viewNode.LevelShow, `等级.${ShopBoxRewardView.selLevel}`)
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    OnClickLeft() {
        ShopBoxRewardView.selLevel--;
        this.FlushShow();
    }

    OnClickRight() {
        ShopBoxRewardView.selLevel++;
        this.FlushShow();
    }
}

export class ShopBoxRewardViewShowItem extends BaseItem {
    protected viewNode = {
        BgSp: <fgui.GLoader>null,
        IconSp: <fgui.GLoader>null,
        NoAddShow: <fgui.GTextField>null,
        ShowList: <fgui.GList>null,
    };
    listData: any[];

    SetData(data: any) {
        let selLevel = ShopBoxRewardView.selLevel || ShopBoxLevelUpView.selLevel
        UH.SpriteName(this.viewNode.BgSp, "ShopBoxReward", `Di${data.box_type}`)
        UH.SpriteName(this.viewNode.IconSp, "ShopBoxReward", `XiangZi${data.box_type}`)

        this.viewNode.NoAddShow.visible = 1 == selLevel
        if (1 == selLevel) {
            this.listData = [];
            this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
            this.viewNode.ShowList.numItems = 0;
        } else {
            let co_l1 = ShopData.Inst().CfgShopBoxShopBox(data.box_type, 1)
            let co_ls = ShopData.Inst().CfgShopBoxShopBox(data.box_type, selLevel)
            let list = []
            if (0 == data.box_type) {
                list.push({ itemId: ShopData.Inst().CfgShopBoxOtherColor1Item(), num: co_ls.color1_num - co_l1.color1_num })
                if ((co_ls.color2_num - co_l1.color2_num) > 0) {
                    list.push({ itemId: ShopData.Inst().CfgShopBoxOtherColor2Item(), num: co_ls.color2_num - co_l1.color2_num })
                }
            } else {
                list.push({ itemId: ShopData.Inst().CfgShopBoxOtherColor2Item(), num: co_ls.color2_num - co_l1.color2_num })
                if ((co_ls.color3_num - co_l1.color3_num) > 0) {
                    co_ls.color3_num - co_l1.color3_num
                    list.push({ itemId: ShopData.Inst().CfgShopBoxOtherColor3Item(), num: co_ls.color3_num - co_l1.color3_num })
                }
            }
            this.listData = list
            this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
            this.viewNode.ShowList.numItems = list.length;
        }
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }
}

export class ShopBoxRewardViewAddItem extends BaseItem {
    protected viewNode = {
        NumShow: <fgui.GTextField>null,
        CellShow: <ItemCell>null,
        UIEffectShow: <UIEffectShow>null,
    };

    SetData(data: any) {
        UH.SetText(this.viewNode.NumShow, `+${data.num}`)
        this.viewNode.CellShow.SetData(Item.Create(data, { is_click: false }))
        this.viewNode.UIEffectShow.StopEff(1009000)
        this.viewNode.UIEffectShow.PlayEff(1009000)
    }
}
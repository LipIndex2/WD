
import * as fgui from "fairygui-cc";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { EGLoader } from "modules/extends/EGLoader";
import { ItemCell } from "modules/extends/ItemCell";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UH } from "../../helpers/UIHelper";
import { ShopData } from "./ShopData";
import { ObjectPool } from "core/ObjectPool";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { CommonBoard4 } from "modules/common_board/CommonBoard4";

@BaseView.registView
export class ShopBoxLevelUpView extends BaseView {
    static selLevel: number
    private spShow: UISpineShow = undefined;
    protected viewRegcfg = {
        UIPackName: "ShopBoxLevelUp",
        ViewName: "ShopBoxLevelUpView",
        LayerType: ViewLayer.Normal,
        // ViewMask: ViewMask.BgBlockClose,
        // ShowAnim: true
    };

    protected viewNode = {
        BtnOnGo: <fgui.GButton>null,
        LevelShow: <fgui.GTextField>null,
        ShowList: <fgui.GList>null,
        // UIEffectShow: <UIEffectShow>null,
        // bg: <EGLoader>null,
        Board: <CommonBoard4>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: ShopBoxRewardViewShowItem },
        { ResName: "ItemAdd", ExtendsClass: ShopBoxRewardViewAddItem }
    ];
    listData: any[];

    InitData() {
        this.viewNode.BtnOnGo.onClick(this.closeView.bind(this));
        ShopBoxLevelUpView.selLevel = ShopData.Inst().BoxInfoBoxLevel;
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208027"), true, (obj: any) => {
            obj.setPosition(400, -800);
            this.view._container.insertChild(obj, 9);
        });
    }

    // WindowSizeChange() {
    //     this.refreshBgSize(this.viewNode.bg)
    // }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.Board.FlushShow(() => {
            waitHandle.complete = true;
        })
    }

    InitUI() {
        this.FlushShow()
    }

    FlushShow() {
        let show_list = ShopData.Inst().GetShopBoxRewardShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = show_list;
        this.viewNode.ShowList.numItems = show_list.length;
        UH.SetText(this.viewNode.LevelShow, `等级.${ShopBoxLevelUpView.selLevel}`)
    }
    CloseCallBack() {
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
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
        let selLevel = ShopBoxLevelUpView.selLevel
        UH.SpriteName(this.viewNode.BgSp, "ShopBoxLevelUp", `Di${data.box_type}`)
        UH.SpriteName(this.viewNode.IconSp, "ShopBoxLevelUp", `XiangZi${data.box_type}`)
        this.viewNode.NoAddShow.visible = 1 == selLevel
        if (1 == selLevel) {
            this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
            this.listData = [];
            this.viewNode.ShowList.numItems = this.listData.length;
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
            this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
            this.listData = list;
            this.viewNode.ShowList.numItems = this.listData.length;
        }
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
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
        // this.viewNode.UIEffectShow.StopEff(1009000)
        // this.viewNode.UIEffectShow.PlayEff(1009000)
    }
}

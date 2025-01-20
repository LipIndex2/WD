import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { EGLoader } from "modules/extends/EGLoader";
import { ItemCell } from "modules/extends/ItemCell";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RewardGetBoxView } from "modules/reward_get/RewardGetBoxView";
import { UH } from "../../helpers/UIHelper";
import { ShopCtrl } from "./ShopCtrl";
import { ShopData } from "./ShopData";
import { ConstValue } from "modules/common/ConstValue";
import { DBDNet } from "../../DBDataManager/DBDNet";
import { ActivityCombatData } from "modules/ActivityCombat/ActivityCombatData";
import { RoleData } from "modules/role/RoleData";
import { ViewManager } from "manager/ViewManager";

@BaseView.registView
export class ShopTreasureBoxView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ShopTreasureBox",
        ViewName: "ShopTreasureBoxView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        Icon: <fgui.GLoader>null,
        List: <fgui.GList>null,
        BtnBuy: <fgui.GButton>null,
        txCount: <fgui.GTextField>null,
    };

    private index: number;
    private prizeItem: any[];
    InitData(index: number) {
        this.index = index;
        this.viewNode.Board.SetData(new BoardData(ShopTreasureBoxView));
        this.viewNode.BtnBuy.onClick(this.OnClickBox.bind(this, index));

        this.FlushBoxInfo();
        this.FlushListInfo();

        this.viewNode.Board.SetTitle(Language.Shop.TreasureBox.NameShow[this.index])

        GuideCtrl.Inst().AddGuideUi("ShopTreasureBoxViewBtnBuy", this.viewNode.BtnBuy);

        // 初始化次数
        this.viewNode.txCount.text = ShopData.Inst().getBoxOpenTimes(index) + "/" + ConstValue.OpenTreasureMaxTimes;
        this.viewNode.BtnBuy.grayed = ShopData.Inst().getBoxOpenTimes(index) <= 0;
    }

    InitUI() {
        UH.SpriteName(this.viewNode.Icon, "ShopTreasureBox", "XiangZi" + (this.index));
    }

    OnClickBox(index: number) {
        if (ShopData.Inst().getBoxOpenTimes(index) <= 0) {
            PublicPopupCtrl.Inst().Center(Language.Shop.OpenBox);
            return;
        }

        RewardGetBoxView.boxType = index
        let co = ShopData.Inst().CfgShopBoxPrice(index)
        if ((BagData.Inst().GetItemNum(co.buy_item_id2) < co.buy_item_num2) && (BagData.Inst().GetItemNum(co.buy_item_id1) < co.buy_item_num1)) {
            PublicPopupCtrl.Inst().ItemNotEnoughNotice(co.buy_item_id1)
        } else {
            ShopCtrl.Inst().SendShopBoxReqOpen(index);
            const curTime = Date.now();
            let shop_box_info = { time: curTime, openBoxTimes: ShopData.Inst().boxOpenTimes };
            shop_box_info.openBoxTimes[index] = Math.max(shop_box_info.openBoxTimes[index] - 1, 0);
            DBDNet.Inst().setSignature({ uid: RoleData.Inst().InfoRoleInfo.roleId, zombie_info: ActivityCombatData.Inst().ResultData.ZombieInfo, shop_box_info: shop_box_info, payMoneyInfo: ShopData.Inst().payMoneyInfo }, () => {
                ShopData.Inst().onBoxOpenTimes(shop_box_info.openBoxTimes);
            });
            this.closeView()
        }
    }

    FlushListInfo() {
        let level = ShopData.Inst().BoxInfoBoxLevel
        let info = ShopData.Inst().CfgShopBoxShopBox(this.index, level)
        let data = [];
        if (info.box_item[0] && info.box_item[0].num > 0) {
            data.push(info.box_item[0])
        }
        if (info.color1_num > 0) {
            data.push({ item_id: ShopData.Inst().CfgShopBoxOtherColor1Item(), num: info.color1_num })
        }
        if (info.color2_num > 0) {
            data.push({ item_id: ShopData.Inst().CfgShopBoxOtherColor2Item(), num: info.color2_num })
        }
        if (info.color3_num > 0) {
            data.push({ item_id: ShopData.Inst().CfgShopBoxOtherColor3Item(), num: info.color3_num })
        }

        this.prizeItem = data
        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.numItems = data.length;
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(Item.Create(this.prizeItem[index], { is_num: true }));
    }

    FlushBoxInfo() {
        if (!ShopData.Inst().BoxInfo) {
            return
        }

        let co = ShopData.Inst().CfgShopBoxPrice(this.index)
        let have_num = BagData.Inst().GetItemNum(co.buy_item_id2)
        if (have_num >= co.buy_item_num2) {
            this.viewNode.BtnBuy.icon = EGLoader.IconGeterFuncs[ICON_TYPE.ITEM](Item.GetIconId(co.buy_item_id2));
            // this.viewNode.BtnBuy.icon = fgui.UIPackage.getItemURL("CommonCurrency", `YaoShi${this.index + 1}`);
        } else {
            this.viewNode.BtnBuy.icon = fgui.UIPackage.getItemURL("CommonCurrency", `Big${co.buy_item_id1}`);
        }
        this.viewNode.BtnBuy.title = have_num > 0 ? `${have_num}/${co.buy_item_num2}` : `${co.buy_item_num1}`
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        GuideCtrl.Inst().ClearGuideUi("ShopTreasureBoxViewBtnBuy");
    }
}

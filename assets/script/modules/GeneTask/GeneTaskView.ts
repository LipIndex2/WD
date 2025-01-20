import * as fgui from "fairygui-cc";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { ExpShow, CurrencyShow } from "modules/extends/Currency";
import { ItemCell } from "modules/extends/ItemCell";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { UH } from "../../helpers/UIHelper";
import { CommonBoard4 } from "modules/common_board/CommonBoard4";
import { GeneTaskData } from "./GeneTaskData";
import { GeneTaskCtrl } from "./GeneTaskCtrl";

@BaseView.registView
export class GeneTaskView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "GeneTask",
        ViewName: "GeneTaskView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        // liuhaiscreen: <fgui.GComponent>null,
        list: <fgui.GList>null,
        Board: <CommonBoard4>null,
        // ExpShow: <ExpShow>null,
        // Currency1: <CurrencyShow>null,
        // Currency2: <CurrencyShow>null,
        // Currency3: <CurrencyShow>null,
        BtnClose: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "TaskItem", ExtendsClass: GeneTaskViewTaskItem },
    ];

    InitData() {

        this.viewNode.BtnClose.onClick(this.closeView, this);

        this.AddSmartDataCare(GeneTaskData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");

        // this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        // this.viewNode.Currency2.SetCurrency(CommonId.Energy);
        // this.viewNode.Currency3.SetCurrency(CommonId.Diamond);
        // this.viewNode.Currency2.BtnAddShow(true);

        this.viewNode.list.setVirtual();

        this.FlushData();
    }

    FlushData() {
        let taskList = GeneTaskData.Inst().GetTask();
        this.viewNode.list.itemRenderer = this.itemRnederer.bind(this);
        this.viewNode.list.numItems = taskList.length;
    }

    private itemRnederer(index: number, item: any) {
        item.SetData(GeneTaskData.Inst().GetTask()[index]);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.Board.FlushShow(() => {
            waitHandle.complete = true;
        }, false)
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

export class GeneTaskViewTaskItem extends BaseItem {
    protected viewNode = {
        // IconShow: <fgui.GLoader>null,
        DescShow: <fgui.GTextField>null,
        ItemNum: <fgui.GTextField>null,
        BtnGet: <fgui.GButton>null,
        ProgressShow: <fgui.GProgressBar>null,
        MaskShow: <fgui.GGroup>null,
        ItemCell: <ItemCell>null,
    };
    SetData(data: any) {
        super.SetData(data)
        this.data = data;
        let item0 = data.cfg.suc[0]

        this.viewNode.ItemCell.SetData(Item.Create(item0, { is_num: true }));

        this.viewNode.BtnGet.onClick(this.OnClickGet, this);

        // UH.SetIcon(this.viewNode.IconShow, Item.GetIconId(item0.item_id), ICON_TYPE.ITEM)
        UH.SetText(this.viewNode.ItemNum, item0.num)
        UH.SetText(this.viewNode.DescShow, data.cfg.describe)

        let value = data.value ?? 0
        this.viewNode.ProgressShow.value = value;
        this.viewNode.ProgressShow.max = data.cfg.pram1;
        this.viewNode.MaskShow.visible = data.isFetch;
        this.viewNode.BtnGet.grayed = value < data.cfg.pram1
        this.viewNode.BtnGet.visible = !data.isFetch
    }

    OnClickGet() {
        if (this.data.value < this.data.cfg.pram1) {
            PublicPopupCtrl.Inst().Center(Language.ServiceSevenDay.TaskTip);
            return
        } else if (this.data.isFetch) {
            PublicPopupCtrl.Inst().Center(Language.ServiceSevenDay.TaskFetchTip);
            return
        }
        GeneTaskCtrl.Inst().SendGeneTask(this.data.cfg.seq)
    }
}
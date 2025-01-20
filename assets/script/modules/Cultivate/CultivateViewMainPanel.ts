import { BaseItemGB } from './../common/BaseItem';
import * as fgui from "fairygui-cc";
import { BagData } from "modules/bag/BagData";
import { BasePanel } from "modules/common/BasePanel";
import { UH } from "../../helpers/UIHelper";
import { CultivateData } from "./CultivateData";
import { BaseItem, BaseItemGP } from "modules/common/BaseItem";
import { ItemCell } from "modules/extends/ItemCell";
import { Item } from "modules/bag/ItemData";
import { CultivateCtrl } from './CultivateCtrl';
import { ViewManager } from 'manager/ViewManager';
import { MainTaskRewardView } from 'modules/main/MainTaskRewardView';
import { UIEffectShow } from 'modules/scene_obj_spine/UIEffectShow';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';
import { Timer } from 'modules/time/Timer';
import { RewardGetView } from 'modules/reward_get/RewardGetView';
import { RedPoint } from 'modules/extends/RedPoint';
import { Language } from 'modules/common/Language';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';

export class CultivateViewMainPanel extends BasePanel {
    protected viewNode = {
        CultivateList: <fgui.GList>null,
        ItemShowList1: <fgui.GList>null,
        ItemShowList2: <fgui.GList>null,
        ItemNum: <fgui.GTextField>null,
        Count: <fgui.GTextField>null,
        Desc: <fgui.GTextField>null,
        ButtonCultivate: <fgui.GButton>null,
        ProgressBarBox: <ProgressBarBox>null,
    };

    protected extendsCfg = [
        { ResName: "CultivateItem", ExtendsClass: CultivateItem },
        { ResName: "RewardItem", ExtendsClass: RewardItem },
        { ResName: "ProgressBarBox", ExtendsClass: ProgressBarBox },
    ];

    private timer_show: any = null;
    private isPlayAni: boolean = false;
    listData1: any[];
    listData2: any[];
    listData3: any[];

    InitPanelData() {
        this.AddSmartDataCare(CultivateData.Inst().FlushData, this.FlushCellAni.bind(this), "FlushCellAni");
        this.AddSmartDataCare(CultivateData.Inst().FlushData, this.FlushView.bind(this), "FlushInfo");
        this.viewNode.ButtonCultivate.onClick(this.OnClickCultivate, this);

        this.viewNode.ItemShowList1.setVirtual()
        this.viewNode.ItemShowList2.setVirtual()

        this.FlushView();
        this.FlushShowList();
    }

    FlushView() {
        const other = CultivateData.Inst().GetOther();
        this.viewNode.ProgressBarBox.max = other.progress_bar_times
        this.viewNode.ProgressBarBox.value = CultivateData.Inst().CellCount;
        this.viewNode.ProgressBarBox.redPointShow();

        const itemNum = BagData.Inst().GetItemNum(other.cultivate_item_id);
        UH.SetText(this.viewNode.ItemNum, itemNum);
        UH.SetText(this.viewNode.Count, itemNum);
        UH.SetText(this.viewNode.Desc, other.cultivate_des);

    }

    FlushShowList() {
        const cultivatelist = CultivateData.Inst().GetCultivateCfg();
        this.viewNode.CultivateList.itemRenderer = this.itemRenderer1.bind(this);
        this.listData1 = cultivatelist;
        this.viewNode.CultivateList.numItems = cultivatelist.length;


        const rewardlist = CultivateData.Inst().GetCultivateRewardCfg();
        this.listData2 = rewardlist.slice(0, 7)
        this.listData3 = rewardlist.slice(7).reverse()
        this.viewNode.ItemShowList1.itemRenderer = this.itemRenderer2.bind(this);
        this.viewNode.ItemShowList2.itemRenderer = this.itemRenderer3.bind(this);
        this.viewNode.ItemShowList1.numItems = this.listData2.length;
        this.viewNode.ItemShowList2.numItems = this.listData3.length;
    }

    private itemRenderer1(index: number, item: CultivateItem) {
        item.SetData(this.listData1[index])
    }

    private itemRenderer2(index: number, item: RewardItem) {
        item.SetData(this.listData2[index])
    }
    private itemRenderer3(index: number, item: RewardItem) {
        item.SetData(this.listData3[index])
    }

    FlushCellAni() {
        if (this.isPlayAni) return
        this.isPlayAni = true;
        const index = CultivateData.Inst().CellIndexAni ?? 0;
        const itemList = CultivateData.Inst().itemList;
        const item = <CultivateItem>this.viewNode.CultivateList.getChildAt(index)
        if (item) {
            item.EffShow()
        }
        Timer.Inst().CancelTimer(this.timer_show)
        this.timer_show = Timer.Inst().AddRunTimer(() => {
            this.FlushShowList();
            if (item) {
                ViewManager.Inst().OpenView(RewardGetView, { reward_data: itemList, call_back: null })
                CultivateData.Inst().IsOpenCell = false;
                this.isPlayAni = false;
            }
        }, 0.9, 1, false)
    }

    OnClickCultivate() {
        if (this.isPlayAni) return
        CultivateData.Inst().IsOpenCell = true;
        CultivateCtrl.Inst().SendOpenCell()
    }

    ClosePanel() {
        Timer.Inst().CancelTimer(this.timer_show)
        CultivateData.Inst().IsOpenCell = false;
    }
}

class CultivateItem extends BaseItem {
    protected viewNode = {
        Mask: <fgui.GImage>null,
        ItemCell: <ItemCell>null,
        EffectShow: <UIEffectShow>null,
        SpineShow: <UISpineShow>null,
    };
    public SetData(data: any) {
        super.SetData(data);
        this.data = data;
        const isFetch = CultivateData.Inst().CellList[data.seq];
        this.viewNode.ItemCell.SetData(Item.Create(data.item[0], { is_num: true, is_click: isFetch }))
        this.viewNode.EffectShow.PlayEff(1208111)
        this.viewNode.SpineShow.LoadSpine(ResPath.UIEffect(1208112), false)

        this.viewNode.Mask.visible = !isFetch
        this.viewNode.ItemCell.visible = isFetch
        this.viewNode.EffectShow.visible = false
        this.viewNode.SpineShow.visible = false
        this.viewNode.SpineShow.onDestroy()
    }

    EffShow() {
        this.viewNode.EffectShow.visible = true
        this.viewNode.SpineShow.visible = true
        this.viewNode.SpineShow.LoadSpine(ResPath.UIEffect(1208112), true)
    }
}

class RewardItem extends BaseItemGB {
    protected viewNode = {
        Lock: <fgui.GImage>null,
        Gou: <fgui.GImage>null,
        ItemCell: <ItemCell>null,
    };
    public SetData(data: any) {
        super.SetData(data);
        const isFetch = CultivateData.Inst().lineRewardFlag[data.gift_seq];
        this.viewNode.Gou.visible = isFetch;
        this.viewNode.Lock.visible = !isFetch;
        this.viewNode.ItemCell.SetData(Item.Create(data.item[0], { is_num: true }))
    }
}

class ProgressBarBox extends BaseItemGP {
    protected viewNode = {
        ButtonBox: <fgui.GButton>null,
        redPoint: <RedPoint>null,
        UISpineShow: <UISpineShow>null,
    };
    onConstruct() {
        super.onConstruct();
        this.viewNode.ButtonBox.onClick(this.OnClickBox, this);
    }
    redPointShow() {
        const isFetch = CultivateData.Inst().CellCountIsFetch;
        const num = this.value >= this.max && !isFetch ? 1 : 0
        this.viewNode.redPoint.SetNum(num);
        const img = isFetch ? "BaoXiangDaKai" : "BaoXiang";
        this.viewNode.ButtonBox.icon = fgui.UIPackage.getItemURL("Cultivate", img);
        this.viewNode.UISpineShow.visible = this.value >= this.max && !isFetch;
        this.viewNode.UISpineShow.LoadSpine(ResPath.UIEffect(1208122), false)
    }
    OnClickBox() {
        const isFetch = CultivateData.Inst().CellCountIsFetch;
        if (isFetch) {
            PublicPopupCtrl.Inst().Center(Language.ActCommon.JiangLiYiLingQu);
            return
        }
        if (this.value >= this.max) {
            CultivateCtrl.Inst().SendFetchBox()
        } else {
            const other = CultivateData.Inst().GetOther();
            const pos = this.viewNode.ButtonBox.node.worldPosition;
            ViewManager.Inst().OpenView(MainTaskRewardView, { x: pos.x - 40, y: 1600 - pos.y - 150, rewards: other.bar_item });
        }
    }
}

import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB, BaseItemGP } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { Language } from "modules/common/Language";
import { EGLoader } from "modules/extends/EGLoader";
import { ItemCell } from "modules/extends/ItemCell";
import { RedPoint } from "modules/extends/RedPoint";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";

@BaseView.registView
export class FishHandbookView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishHandbook",
        ViewName: "FishHandbookView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        bg: <EGLoader>null,

        BtnClose: <fgui.GButton>null,
        BtnType: <fgui.GButton>null,

        BgType: <fgui.GImage>null,
        ProgressShow: <FishHandbookViewShowProgress>null,
        TypeList: <fgui.GList>null,
        ShowList: <fgui.GList>null,
        RedPointShow: <RedPoint>null,
    };

    protected extendsCfg = [
        { ResName: "ShowItem", ExtendsClass: FishHandbookViewShowItem },
        { ResName: "ButtonShow", ExtendsClass: FishHandbookViewShowButton },
        { ResName: "ItemFish", ExtendsClass: FishHandbookViewFishItem },
        { ResName: "ProgressShow", ExtendsClass: FishHandbookViewShowProgress },
    ]

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.bg.SetIcon("loader/fish/DiBan", () => {
            waitHandle.complete = true;
            this.refreshBgSize(this.viewNode.bg)
        })
    }

    InitData() {
        this.viewNode.BtnClose.onClick(this.OnClickClose, this);
        this.viewNode.BtnType.onClick(this.OnClickType, this);

        this.viewNode.ShowList.setVirtual()

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo", "FlushBookRewardInfo", "SelMapId");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushMapSel.bind(this), "SelMapId");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushShow.bind(this));
    }

    InitUI() {
        this.FlushInfo()
        this.FlushShow()
    }

    FlushShow() {
        let type_list = FishData.Inst().GetMapShowList()
        this.viewNode.TypeList.itemRenderer = this.itemRenderer2.bind(this);
        this.viewNode.TypeList.numItems = type_list.length;
        this.viewNode.RedPointShow.SetNum(FishData.Inst().GetRedNumHandbook())
    }

    private itemRenderer2(index: number, item: any) {
        item.SetData(FishData.Inst().GetMapShowList()[index]);
    }

    FlushInfo() {
        let co_map = FishData.Inst().CfgIslandInfoByIslandId()
        if (co_map) {
            this.viewNode.BtnType.title = co_map.island_name
        }
        let show_list = FishData.Inst().GetHandbookShowList()
        let progress_info = FishData.Inst().GetHandbookProgressInfo(show_list)
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = show_list.length;
        this.viewNode.ProgressShow.value = progress_info.value
        this.viewNode.ProgressShow.max = progress_info.max
        this.viewNode.ProgressShow.FlushShow()
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(FishData.Inst().GetHandbookShowList()[index])
    }

    FlushMapSel() {
        if (this.viewNode.BtnType.selected) {
            this.viewNode.BtnType.selected = false
            this.OnClickType()
        }
    }

    OnClickClose() {
        ViewManager.Inst().CloseView(FishHandbookView)
    }

    OnClickType() {
        this.viewNode.BgType.visible = this.viewNode.BtnType.selected
        this.viewNode.TypeList.visible = this.viewNode.BtnType.selected
    }
}

export class FishHandbookViewShowItem extends BaseItem {
    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        Actived: <fgui.GTextField>null,
        BtnActive: <fgui.GButton>null,
        RewardCell: <ItemCell>null,
        ShowList: <fgui.GList>null,
        RedPointShow: <RedPoint>null,
    };
    showListData: { id: number; actived: boolean; }[];

    protected onConstruct() {
        super.onConstruct()

        this.viewNode.BtnActive.onClick(this.OnClickActive, this);
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.showListData[index])
    }

    SetData(data: any) {
        super.SetData(data)

        let list = FishData.Inst().GetHandbookFishList(data.group_content)
        let fetch = FishData.Inst().GetHandbookFetchBySeq(data.seq)
        UH.SetText(this.viewNode.NameShow, data.group_name)
        this.viewNode.RewardCell.SetData(Item.Create(data.reward[0], { is_num: true }))
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.showListData = list;
        this.viewNode.ShowList.numItems = list.length;
        this.viewNode.Actived.visible = fetch
        this.viewNode.BtnActive.visible = !fetch

        if (!fetch) {
            let actived = true
            for (let element of list) {
                actived = actived && element.actived
            }
            this.viewNode.BtnActive.grayed = !actived
            this.viewNode.BtnActive.touchable = actived
            this.viewNode.RedPointShow.SetNum(actived ? 1 : 0)
        } else {
            this.viewNode.RedPointShow.SetNum(0)
        }
    }

    OnClickActive() {
        FishCtrl.Inst().SendRoleFishReqFectchHandbook(this._data.seq)
    }
}

export class FishHandbookViewShowButton extends BaseItemGB {
    protected viewNode = {
        title: <fgui.GTextField>null,
        RedPointShow: <RedPoint>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.onClick(this.OnClickType, this);
    }

    SetData(data: any) {
        super.SetData(data)
        UH.SetText(this.viewNode.title, data.island_name)

        this.viewNode.RedPointShow.SetNum(FishData.Inst().GetRedNumHandbook(FishData.Inst().CfgTuJianByPage(data.island_id)))
    }

    OnClickType() {
        FishData.Inst().SelMapId = this._data.island_id
    }
}

export class FishHandbookViewFishItem extends BaseItem {
    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        CellShow: <ItemCell>null,
    };

    SetData(data: any) {
        let co = FishData.Inst().CfgFishInfoByFishId(data.id)
        if (co) {
            UH.SetText(this.viewNode.NameShow, co.name)
            this.viewNode.CellShow.SetData(Item.Create({ itemId: co.item_id }, { is_num: false, is_gray: !data.actived }))
        }
    }
}

export class FishHandbookViewShowProgress extends BaseItemGP {
    protected viewNode = {
        ProgressShow: <fgui.GTextField>null,
    };

    FlushShow() {
        UH.SetText(this.viewNode.ProgressShow, TextHelper.Format(Language.Fish.Handbook.ProgressShow, this.value, this.max))
    }
}



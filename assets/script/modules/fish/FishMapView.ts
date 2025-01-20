
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { Language } from "modules/common/Language";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";

@BaseView.registView
export class FishMapView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FishMap",
        ViewName: "FishMapView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        BtnReturn: <fgui.GButton>null,

        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ShowItemTop", ExtendsClass: FishMapViewShowItemTop },
        { ResName: "ShowItem0", ExtendsClass: FishMapViewShowItem },
        { ResName: "ShowItem1", ExtendsClass: FishMapViewShowItem },
    ]
    listData: any[];

    InitData() {
        this.viewNode.BtnReturn.onClick(this.OnClickReturn, this);

        this.viewNode.ShowList.itemProvider = this.GetListItemResource.bind(this);

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo");

        FishData.Inst().MapRedNum = 0
    }

    InitUI() {
        this.FlushInfo()
    }

    FlushInfo() {
        let show_list = FishData.Inst().GetMapShowList()
        show_list.unshift(0)
        this.listData = show_list;
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = show_list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    private GetListItemResource(index: number) {
        if (0 == index) {
            return fgui.UIPackage.getItemURL("FishMap", "ShowItemTop");
        } else {
            return fgui.UIPackage.getItemURL("FishMap", `ShowItem${index % 2}`);
        }
    }

    OnClickReturn() {
        ViewManager.Inst().CloseView(FishMapView)
    }
}

export class FishMapViewShowItemTop extends BaseItem {
}

export class FishMapViewShowItem extends BaseItemGB {
    protected viewNode = {
        LockShow: <fgui.GImage>null,
        SelShow: <fgui.GTextField>null,
        NameShow: <fgui.GTextField>null,
        DescShow: <fgui.GTextField>null,
        MapIcon: <fgui.GLoader>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.onClick(this.OnClickItem, this);
    }

    SetData(data: any) {
        super.SetData(data)

        let is_lock = FishData.Inst().InfoLevel < data.unlock_level
        UH.SetText(this.viewNode.NameShow, data.island_name)
        this.viewNode.LockShow.visible = is_lock
        this.viewNode.SelShow.visible = FishData.Inst().InfoAreaId == data.island_id
        this.grayed = is_lock

        if (is_lock) {
            UH.SetText(this.viewNode.DescShow, TextHelper.Format(Language.Fish.Map.LockShow, data.unlock_level))
        } else {
            let show_list = FishData.Inst().CfgTuJianByPage(data.island_id)
            let progress_info = FishData.Inst().GetHandbookProgressInfo(show_list)
            UH.SetText(this.viewNode.DescShow, TextHelper.Format(Language.Fish.Map.CollectShow, progress_info.value, progress_info.max))
        }

        UH.SpriteName(this.viewNode.MapIcon, "FishMap", `Map${data.island_id}`)
    }

    OnClickItem() {
        let is_lock = FishData.Inst().InfoLevel < this._data.unlock_level
        if (is_lock) {
            PublicPopupCtrl.Inst().Center(TextHelper.Format(Language.Fish.Map.LockShow, this._data.unlock_level))
        } else {
            ViewManager.Inst().CloseView(FishMapView)
            FishCtrl.Inst().SendRoleFishReqEnterMap(this._data.island_id)
        }
    }
}


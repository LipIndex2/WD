
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { AvatarData } from "modules/extends/AvatarCell";
import { HeadItem } from "modules/extends/HeadItem";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { DataHelper } from "../../helpers/DataHelper";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { TerritoryCtrl } from "./TerritoryCtrl";
import { TerritoryData } from "./TerritoryData";

@BaseView.registView
export class TerritoryNeighbourView extends BaseView {
    showList: any[] = [];

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "TerritoryNeighbourNew",
        ViewName: "TerritoryNeighbourNewView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,

        BtnFlush: <fgui.GButton>null,
        TimeShow: <TimeMeter>null,

        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: TerritoryNeighbourViewShowItem },
        { ResName: "ItemTitle", ExtendsClass: TerritoryNeighbourViewTitleItem },
        { ResName: "ItemEmpty", ExtendsClass: TerritoryNeighbourViewEmptyItem },
        { ResName: "ItemRes", ExtendsClass: TerritoryNeighbourViewResItem },
    ]

    InitData() {
        this.viewNode.Board.SetData(new BoardData(TerritoryNeighbourView));

        this.viewNode.BtnFlush.onClick(this.OnClickFlush, this);

        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ShowList.itemProvider = this.GetListItemResource.bind(this);

        this.AddSmartDataCare(TerritoryData.Inst().FlushData, this.FlushNeighbourInfo.bind(this), "FlushNeighbourInfo");

        TerritoryCtrl.Inst().SendTerritoryReqNeighbour()
    }

    InitUI() {
        this.FlushTimeShow()
    }

    CloseCallBack() {
        this.viewNode.TimeShow.CloseCountDownTime()
    }

    FlushNeighbourInfo() {
        this.showList = TerritoryData.Inst().GetNeighbourShowList()
        this.viewNode.ShowList.numItems = this.showList.length

        this.FlushTimeShow()
    }

    FlushTimeShow() {
        this.viewNode.TimeShow.CloseCountDownTime()
        if ((TerritoryData.Inst().NeighbourInfoNeighbourTime + TerritoryData.Inst().CfgOtherOtherTerritoryRefresh) > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.TimeShow.StampTime(TerritoryData.Inst().NeighbourInfoNeighbourTime + TerritoryData.Inst().CfgOtherOtherTerritoryRefresh, TimeFormatType.TYPE_TIME_0)
            this.viewNode.TimeShow.SetCallBack(this.FlushTimeShow.bind(this))
        }
        else {
            this.viewNode.TimeShow.SetTime("")
        }
    }

    private renderListItem(index: number, item: any) {
        if (item instanceof TerritoryNeighbourViewShowItem) {
            item.ItemIndex(index);
        }
        item.SetData(this.showList[index]);
    }

    private GetListItemResource(index: number) {
        if ("number" == typeof (this.showList[index])) {
            return fgui.UIPackage.getItemURL("TerritoryNeighbourNew", this.showList[index] < 0 ? "ItemEmpty" : "ItemTitle");
        } else {
            return fgui.UIPackage.getItemURL("TerritoryNeighbourNew", "ItemShow");
        }
    }

    OnClickFlush() {
        if ((TerritoryData.Inst().NeighbourInfoNeighbourTime + TerritoryData.Inst().CfgOtherOtherTerritoryRefresh) > TimeCtrl.Inst().ServerTime) {
            PublicPopupCtrl.Inst().Center(Language.Territory.Neighbour.ColdTime)
            return
        }
        TerritoryCtrl.Inst().SendTerritoryReqRefreshNeighbour()
    }
}

export class TerritoryNeighbourViewShowItem extends BaseItem {
    private itemIndex: number

    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        BtnGo: <fgui.GButton>null,
        HeadShow: <HeadItem>null,
        ShowList: <fgui.GList>null,
    };
    listData: number[];

    protected onConstruct() {
        super.onConstruct()

        this.viewNode.BtnGo.onClick(this.OnClickGo, this);
    }

    SetData(data: IPB_SCTerritoryNeighbourRole) {
        super.SetData(data)

        UH.SetText(this.viewNode.NameShow, TextHelper.Format(Language.Territory.Neighbour.NameShow, DataHelper.BytesToString(data.roleInfo.name)))
        this.viewNode.HeadShow.SetData(new AvatarData(data.roleInfo.headPicId, data.roleInfo.level, data.roleInfo.headChar, data.roleInfo.headFrame))
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data.itemSeq;
        this.viewNode.ShowList.numItems = data.itemSeq.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    protected onDestroy() {
        super.onDestroy()
        GuideCtrl.Inst().ClearGuideUi(`TerritoryNeighbourViewBtnGo${this.itemIndex}`);
    }

    ItemIndex(index: number) {
        this.itemIndex = index;
        GuideCtrl.Inst().AddGuideUi(`TerritoryNeighbourViewBtnGo${this.itemIndex}`, this.viewNode.BtnGo);
    }

    OnClickGo() {
        TerritoryCtrl.Inst().SendTerritoryReqInfo(this._data.roleInfo.roleId)
        ViewManager.Inst().CloseView(TerritoryNeighbourView)
    }
}

export class TerritoryNeighbourViewEmptyItem extends BaseItem {
    protected viewNode = {
        EmptyShow: <fgui.GTextField>null,
    };

    SetData(data: number) {
        super.SetData(data)

        UH.SetText(this.viewNode.EmptyShow, Language.Territory.Neighbour.EmptyShow[data + 2])
    }
}

export class TerritoryNeighbourViewTitleItem extends BaseItem {
    protected viewNode = {
        TitleShow: <fgui.GTextField>null,
    };

    SetData(data: number) {
        super.SetData(data)

        UH.SetText(this.viewNode.TitleShow, Language.Territory.Neighbour.TitleShow[data])
    }
}

export class TerritoryNeighbourViewResItem extends BaseItem {
    protected viewNode = {
        IconSp: <fgui.GLoader>null,
        LevelShow: <fgui.GTextField>null,
    };

    SetData(data: number) {
        super.SetData(data)

        let co = TerritoryData.Inst().GetItemInfoBySeq(data)
        if (co) {
            UH.SetIcon(this.viewNode.IconSp, co.icon, ICON_TYPE.ITEM)
            UH.SetText(this.viewNode.LevelShow, `等级.${co.item_level}`)
        }
    }
}
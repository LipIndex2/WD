import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { CommonId } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { CurrencyShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { HeadItem } from "modules/extends/HeadItem";
import { FarmData } from "./FarmData";
import { AvatarData } from "modules/extends/AvatarCell";
import { RoleData } from "modules/role/RoleData";
import { DataHelper } from "../../helpers/DataHelper";
import { UH } from "../../helpers/UIHelper";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { EventTouch, Input, Vec2, Vec3 } from "cc";
import { ViewManager } from "manager/ViewManager";
import { FarmFitmentView } from "./FarmFitmentView";
import { FarmNeighbourView } from "./FarmNeighbourView";
import { FarmShopView } from "./FarmShopView";
import { CfgGreenhouse } from "config/CfgFarm";
import { FarmRewardView } from "./FarmRewardView";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";

enum FarmItemId {
    Manure = 0,  //施肥
    Herbicide = 1,   //  除草
    Kettle = 2,    //浇水
    Sickle = 3,    //收割
    Hoe = 4,    //锄地
}
let FarmItemEffectid: { [key: number]: number } = {
    [FarmItemId.Manure]: 1208115,
    [FarmItemId.Herbicide]: 1208116,
    [FarmItemId.Kettle]: 1208117,
    [FarmItemId.Sickle]: 1208118,
    [FarmItemId.Hoe]: 1208119,
}

@BaseView.registView
export class FarmView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Farm",
        ViewName: "FarmView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Name: <fgui.GTextField>null,
        HeadItem: <HeadItem>null,
        ShowList: <fgui.GList>null,
        BtnArrows1: <fgui.GButton>null,
        BtnArrows2: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
        BtnManure: <fgui.GButton>null,
        BtnHerbicide: <fgui.GButton>null,
        BtnKettle: <fgui.GButton>null,
        BtnSickle: <fgui.GButton>null,
        BtnHoe: <fgui.GButton>null,
        BtnShop: <fgui.GButton>null,
        BtnCallOn: <fgui.GButton>null,
        BtnFriend: <FlowerpotItem>null,

        parent: <fgui.GLabel>null,
    };

    protected extendsCfg = [
        { ResName: "Botany", ExtendsClass: Botany },
        { ResName: "FlowerpotItem", ExtendsClass: FlowerpotItem },
        { ResName: "ListCell", ExtendsClass: ListCell },
        // { ResName: "BtnFriend", ExtendsClass: BtnFriend },
    ];
    private stateCtrler: fgui.Controller
    private page: number = 0;
    private maxPageNum: number = 0;
    private offsetPos: Vec2;
    listData: CfgGreenhouse[][];

    InitData() {
        this.AddSmartDataCare(FarmData.Inst().FlushData, this.FlushView.bind(this), "FlushInfo");
        this.stateCtrler = this.view.getController("StateShow");

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.Diamond);

        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnArrows1.onClick(this.OnClickLeft, this);
        this.viewNode.BtnArrows2.onClick(this.OnClickRight, this);
        this.viewNode.BtnFriend.onClick(this.OnClickFriend, this);
        this.viewNode.BtnShop.onClick(this.OnClicShop, this);
        this.viewNode.BtnCallOn.onClick(this.OnClickCallOn, this);

        this.OnOpenEvent(this.viewNode.BtnManure, FarmItemId.Manure)
        this.OnOpenEvent(this.viewNode.BtnHerbicide, FarmItemId.Herbicide)
        this.OnOpenEvent(this.viewNode.BtnKettle, FarmItemId.Kettle)
        this.OnOpenEvent(this.viewNode.BtnSickle, FarmItemId.Sickle)
        this.OnOpenEvent(this.viewNode.BtnHoe, FarmItemId.Hoe)

        this.maxPageNum = FarmData.Inst().GetGreenhouseMaxPage()

        this.FlushView();
    }

    FlushView() {

        const role_info = FarmData.Inst().InfoRoleInfo
        if (role_info) {
            UH.SetText(this.viewNode.Name, DataHelper.BytesToString(role_info.name))
            this.viewNode.HeadItem.SetData(new AvatarData(role_info.headPicId, role_info.level, role_info.headChar, role_info.headFrame))
            this.stateCtrler.selectedIndex = RoleData.Inst().InfoRoleId == role_info.roleId ? 0 : 1
        }

        this.FlushListShow();
    }

    FlushListShow() {
        const list = FarmData.Inst().GetGreenhouseListCfg(this.page)
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = list;
        this.viewNode.ShowList.numItems = list.length;

        this.aroundBtnShow();
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    //左右按钮显示
    private aroundBtnShow() {
        this.viewNode.BtnArrows1.visible = this.page != 0;
        this.viewNode.BtnArrows2.visible = this.page != this.maxPageNum;
    }

    OnClickLeft() {
        this.page--;
        this.FlushListShow();
    }

    OnClickRight() {
        this.page++;
        this.FlushListShow();
    }

    OnTouchDown(type: number, event: EventTouch) {
        const selfPos = event.currentTarget.getWorldPosition();
        const mouse_pos = event.getUILocation();
        this.offsetPos = mouse_pos.subtract(new Vec2(selfPos.x, selfPos.y));
        this.viewNode.parent.node.setWorldPosition(selfPos)
        this.viewNode.parent.icon = fgui.UIPackage.getItemURL("Farm", `DaoJu${type}`);
        this.viewNode.parent.visible = true;
    }

    OnTouchMove(event: EventTouch) {
        let mouse_pos = event.getUILocation();
        mouse_pos = mouse_pos.subtract(this.offsetPos);
        const movePos = new Vec3(mouse_pos.x, mouse_pos.y, 0);
        this.viewNode.parent.node.setWorldPosition(movePos)
    }

    OnTouchEnd(type: number, event: fgui.Event) {
        this.viewNode.parent.visible = false;

        const parentPos = this.viewNode.parent.node.getWorldPosition();
        const infoPos = FarmData.Inst().GetItemInfoByPos(parentPos.x, parentPos.y, this.viewNode.ShowList.node.worldPosition.y);
        if (infoPos.i >= 0 && infoPos.j >= 0) {
            const cellList = <ListCell>this.viewNode.ShowList.getChildAt(infoPos.i);
            if (!cellList) return
            const item = cellList.GetChildItem(infoPos.j);
            if (!item) return
            item.EffectShow(type);
        }
    }

    OnOpenEvent(node: fgui.GButton, type: number) {
        node.on(Input.EventType.TOUCH_START, this.OnTouchDown.bind(this, type))
        node.on(Input.EventType.TOUCH_MOVE, this.OnTouchMove, this)
        node.on(fgui.Event.TOUCH_END, this.OnTouchEnd.bind(this, type))
    }

    OnClickFriend() {
        ViewManager.Inst().OpenView(FarmRewardView)
    }

    OnClicShop() {
        ViewManager.Inst().OpenView(FarmShopView)
    }

    OnClickCallOn() {
        ViewManager.Inst().OpenView(FarmNeighbourView)
    }

    CloseCallBack() {
    }
}

class Botany extends BaseItem {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
    };
    public SetData(data: any) {
        super.SetData(data);
    }
}

class FlowerpotItem extends BaseItem {
    protected viewNode = {
        Botany: <Botany>null,
        SpineShow: <UISpineShow>null,
    };
    protected onConstruct() {
        super.onConstruct();
    }
    public SetData(data: CfgGreenhouse) {
        super.SetData(data);
    }
    EffectShow(type: number) {
        this.viewNode.SpineShow.onDestroy()
        this.viewNode.SpineShow.LoadSpine(ResPath.UIEffect(FarmItemEffectid[type]), true)
    }

}

class ListCell extends BaseItem {
    protected viewNode = {
        Pipeline: <fgui.GGroup>null,
        Sprinkler: <fgui.GGroup>null,
        Weeding: <fgui.GImage>null,
        BtnFitment: <fgui.GButton>null,
        ShowList: <fgui.GList>null,
    };
    listData: CfgGreenhouse[];
    protected onConstruct() {
        super.onConstruct();
        this.viewNode.BtnFitment.onClick(this.onClickFitment, this)
    }
    public SetData(data: CfgGreenhouse[]) {
        super.SetData(data);
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data;
        this.viewNode.ShowList.numItems = data.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    GetChildItem(index: number) {
        if (index < 0) return
        return <FlowerpotItem>this.viewNode.ShowList.getChildAt(index);
    }

    onClickFitment() {
        ViewManager.Inst().OpenView(FarmFitmentView)
    }
}

// class BtnFriend extends BaseItemGB {
//     protected viewNode = {
//         GpMask: <fgui.GGroup>null,
//     };
//     public SetData(data: any) {
//         super.SetData(data);
//     }
// }

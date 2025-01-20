import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { UH } from "../../helpers/UIHelper";
import { Item } from "modules/bag/ItemData";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { HeroData } from "modules/hero/HeroData";
import { AudioTag } from "modules/audio/AudioManager";
import { ViewManager } from "manager/ViewManager";
import { CardDebrisView } from "modules/CardDebris/CardDebrisView";

@BaseView.registView
export class BoxPreviewView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "OpenServiceSevenDay",
        ViewName: "BoxPreviewView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BlockClose,
        ShowAnim: true,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Preview: <fgui.GGroup>null,
        Num: <fgui.GTextField>null,
        ItemIcon: <fgui.GLoader>null,
    };

    private item_id: number;
    InitData(param: any) {

        this.item_id = param.data.stage[0].item_id;
        // this.viewNode.Preview.node.setWorldPosition(param.pos.x, param.pos.y, 0);
        this.viewNode.Preview.x = param.pos.x - 50;
        this.viewNode.Preview.y = 1600 - param.pos.y - 150;

        UH.SetText(this.viewNode.Num, param.data.stage[0].num);
        let item = Item.GetConfig(param.data.stage[0].item_id);
        if (item && item.item_type == 3) {
            let img = HeroData.Inst().GetDebrisHeroIcon(param.datastage[0].item_id, 1)
            UH.SetIcon(this.viewNode.ItemIcon, img, ICON_TYPE.ROLE);
        } else {
            UH.SetIcon(this.viewNode.ItemIcon, item.icon_id, ICON_TYPE.ITEM);
        }
        if (item && item.item_type == 2) {
            this.viewNode.ItemIcon.onClick(this.onClickOpenView, this);
        }

    }

    InitUI() {
    }

    onClickOpenView() {
        ViewManager.Inst().OpenView(CardDebrisView, this.item_id);
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}
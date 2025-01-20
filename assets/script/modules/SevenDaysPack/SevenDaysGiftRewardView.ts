import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ItemCell } from "modules/extends/ItemCell";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { SevenDaysPackData } from "./SevenDaysPackData";

@BaseView.registView
export class SevenDaysGiftRewardView extends BaseView {
    protected viewRegcfg = {
        UIPackName: "SevenDayHeroReward",
        ViewName: "SevenDayHeroRewardView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnConfirm: <fgui.GButton>null,
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ButtonReward", ExtendsClass: SevenDayHeroRewardViewRewardButton },
        { ResName: "EffectItem", ExtendsClass: SevenDayHeroRewardViewEffectItem },
    ]
    data: any;
    InitData(param: any) {
        this.data = param;
        this.viewNode.Board.SetData(new BoardData(SevenDaysGiftRewardView));

        this.viewNode.BtnConfirm.onClick(this.OnClickConfirm, this);

        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ShowList.setVirtual();
        this.viewNode.ShowList.numItems = param.length
    }

    private renderListItem(index: number, item: SevenDayHeroRewardViewRewardButton) {
        item.ItemIndex(index)
        item.SetData(this.data[index]);
    }

    InitUI() {
    }

    OnClickConfirm() {
        ViewManager.Inst().CloseView(SevenDaysGiftRewardView)
    }
}

export class SevenDayHeroRewardViewRewardButton extends BaseItemGB {
    protected viewNode = {
        CellShow: <ItemCell>null,
        EffectShow: <SevenDayHeroRewardViewEffectItem>null,
    };

    itemIndex: number
    protected onConstruct() {
        super.onConstruct()
        this.onClick(this.OnClickItem, this);
    }

    ItemIndex(index: number) {
        this.itemIndex = index
    }

    public SetData(data: any) {
        super.SetData(data)
        this.viewNode.CellShow.SetData(Item.Create({ itemId: data.item_id, num: data.item_id_num }, { is_num: true, is_click: false }))
        this.viewNode.EffectShow.SetData(data)
    }

    OnClickItem() {
        SevenDaysPackData.Inst().SelSeq = this.itemIndex
    }
}

export class SevenDayHeroRewardViewEffectItem extends BaseItem {
    private sp_show: UISpineShow = undefined;

    public SetData(data: any) {
        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208024"), true, (obj: any) => {
            obj.setPosition(60, -60);
            this._container.insertChild(obj, 0);
        });
    }

    protected onDestroy(): void {
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
        }
    }
}


import { HeroData } from 'modules/hero/HeroData';
import { Language } from 'modules/common/Language';
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

@BaseView.registView
export class FarmRewardView extends BaseView {
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
        { ResName: "ButtonReward", ExtendsClass: FarmRewardViewRewardButton },
        { ResName: "EffectItem", ExtendsClass: FarmRewardViewEffectItem },
    ]
    data: any;
    InitData() {
        this.viewNode.Board.SetData(new BoardData(this, Language.Farm.helpHeroTitle));

        this.viewNode.BtnConfirm.onClick(this.OnClickConfirm, this);

        this.data = HeroData.Inst().HeroList;
        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ShowList.setVirtual();
        this.viewNode.ShowList.numItems = this.data.length
    }

    private renderListItem(index: number, item: FarmRewardViewRewardButton) {
        item.ItemIndex(index)
        item.SetData(this.data[index]);
    }

    InitUI() {
    }

    OnClickConfirm() {
        ViewManager.Inst().CloseView(FarmRewardView)
    }
}

class FarmRewardViewRewardButton extends BaseItemGB {
    protected viewNode = {
        CellShow: <ItemCell>null,
        EffectShow: <FarmRewardViewEffectItem>null,
    };

    itemIndex: number
    protected onConstruct() {
        super.onConstruct()
        this.onClick(this.OnClickItem, this);
    }

    ItemIndex(index: number) {
        this.itemIndex = index
    }

    public SetData(data: IPB_HeroNode) {
        super.SetData(data)
        const cfg = HeroData.Inst().GetHeroBaseCfg(data.heroId)
        this.viewNode.CellShow.SetData(Item.Create({ itemId: cfg.jihuo[0].item_id, num: 1 }, { is_click: false }))
        this.viewNode.EffectShow.SetData(data)
    }

    OnClickItem() {
        // SevenDaysPackData.Inst().SelSeq = this.itemIndex
    }
}

class FarmRewardViewEffectItem extends BaseItem {
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


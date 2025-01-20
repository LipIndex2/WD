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
import { HeroData } from "modules/hero/HeroData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { SevenDayHeroData } from "./SevenDayHeroData";

@BaseView.registView
export class SevenDayHeroRewardView extends BaseView {
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

    InitData() {
        this.viewNode.Board.SetData(new BoardData(SevenDayHeroRewardView));

        this.viewNode.BtnConfirm.onClick(this.OnClickConfirm, this);

    }

    InitUI() {
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this)

        this.viewNode.ShowList.numItems = SevenDayHeroData.Inst().GetRewardShowList().length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(SevenDayHeroData.Inst().GetRewardShowList()[index]);
    }

    OnClickConfirm() {
        ViewManager.Inst().CloseView(SevenDayHeroRewardView)
    }
}

export class SevenDayHeroRewardViewRewardButton extends BaseItemGB {
    private isLock: boolean
    protected viewNode = {
        CellShow: <ItemCell>null,
        EffectShow: <SevenDayHeroRewardViewEffectItem>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.onClick(this.OnClickItem, this);
    }

    public SetData(data: any) {
        super.SetData(data)
        let hero_id = HeroData.Inst().GetDebrisHeroId(data.item_id)
        this.isLock = HeroData.Inst().IsHeroLock(hero_id)
        this.viewNode.CellShow.SetData(Item.Create({ itemId: data.item_id, num: data.item_id_num }, { is_num: true, is_click: false, is_gray: !this.isLock }))
        if (this.isLock) {
            this.viewNode.EffectShow.SetData(data)
        }
    }

    OnClickItem() {
        SevenDayHeroData.Inst().SelSeq = this.isLock ? this._data.seq : -1
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


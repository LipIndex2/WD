import { HeroData } from 'modules/hero/HeroData';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { UH } from "../../helpers/UIHelper";
import { ItemCell } from 'modules/extends/ItemCell';
import { BaseItem } from 'modules/common/BaseItem';

@BaseView.registView
export class CardDebrisView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "CardDebris",
        ViewName: "CardDebrisView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        BtnClose: <fgui.GButton>null,
        List: <fgui.GList>null,
        Icon: <fgui.GLoader>null,
    };

    protected extendsCfg = [
        { ResName: "CardDebrisItem", ExtendsClass: CardDebrisItem }
    ];

    private prizeData: any;

    InitData(item_id: number) {
        let cfg = Item.GetConfig(item_id);
        this.viewNode.Board.SetData(new BoardData(CardDebrisView, cfg.name));
        this.viewNode.BtnClose.onClick(this.closeView, this);
        UH.SetIcon(this.viewNode.Icon, item_id, ICON_TYPE.ITEM);

        this.prizeData = HeroData.Inst().GetHeroColorDebris(cfg.color);
        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        let totalLen = this.prizeData.filter((v: any) => v.isLock).length;
        for (let value of this.prizeData) {
            if (!value.isLock) {
                value.chacne = 0;
            } else {
                value.chacne = 1 / totalLen;
            }
        }
        this.viewNode.List.numItems = this.prizeData.length;
    }

    private renderListItem(index: number, item: CardDebrisItem) {
        item.SetData(this.prizeData[index]);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

export class CardDebrisItem extends BaseItem {
    protected viewNode = {
        ItemCell: <ItemCell>null,
        title: <fgui.GTextField>null,
    };
    public SetData(data: any) {
        this.viewNode.ItemCell.SetData(Item.Create(data.item));
        this.viewNode.ItemCell.grayed = !data.isLock;
        UH.SetText(this.viewNode.title, Math.floor(data.chacne * 100) + "%");
    }
}
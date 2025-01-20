import { BaseItem } from 'modules/common/BaseItem';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { EGLoader } from "modules/extends/EGLoader";
import { FarmData } from './FarmData';
import { UH } from '../../helpers/UIHelper';

@BaseView.registView
export class FarmFitmentView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FarmFitment",
        ViewName: "FarmFitmentView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "FitmentItem", ExtendsClass: FitmentItem }
    ];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(this));

        const list = FarmData.Inst().GetRenovationListCfg()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(FarmData.Inst().GetRenovationListCfg()[index]);
    }

    InitUI() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

class FitmentItem extends BaseItem {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
        BtnBuy: <fgui.GButton>null,
        Name: <fgui.GTextField>null,
    };
    protected onConstruct() {
        super.onConstruct();
        this.viewNode.BtnBuy.onClick(this.onClickBuy, this)
    }
    public SetData(data: any) {
        super.SetData(data);
        UH.SpriteName(this.viewNode.Icon, "FarmFitment", "TuBiao" + data.seq)
        UH.SetText(this.viewNode.Name, Language.Farm.Fitment[data.seq]);
        this.viewNode.BtnBuy.title = data.item[0].num
    }
    onClickBuy() {

    }
}

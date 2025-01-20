import { TextHelper } from './../../helpers/TextHelper';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { HeroData, HeroDataModel } from "./HeroData";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { UH } from "../../helpers/UIHelper";

@BaseView.registView
export class HeroCompoundViewView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroCompound",
        ViewName: "HeroCompoundView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        List: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "CompoundItem", ExtendsClass: HeroViewCompoundItem }
    ];
    listData: { stage: number; resId: string | number; harm: number; mulriple: number; }[];

    InitData(heroMode: HeroDataModel) {
        this.viewNode.Board.SetData(new BoardData(HeroCompoundViewView));

        this.viewNode.List.setVirtual();
        this.listData = HeroData.Inst().GetHeroBattleInfoCfg(heroMode.hero_id, heroMode.GetLevelCfg().att);
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.List.numItems = this.listData.length;
    }
    itemRenderer(index: number, item: any): void {
        item.SetData(this.listData[index]);
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


class HeroViewCompoundItem extends BaseItem {
    protected viewNode = {
        bg: <fgui.GImage>null,
        Arrows: <fgui.GImage>null,
        Icon: <fgui.GLoader>null,
        Times: <fgui.GTextField>null,
        Attr: <fgui.GTextField>null,
    };
    public SetData(data: any) {

        UH.SetText(this.viewNode.Times, TextHelper.Format(Language.Hero.multiple, data.mulriple))
        UH.SetText(this.viewNode.Attr, Language.Hero.attHarm + data.harm)
        UH.SetIcon(this.viewNode.Icon, data.resId, ICON_TYPE.ROLE, null, true);
        this.viewNode.bg.visible = data.stage % 2 == 1
        this.viewNode.Arrows.visible = data.stage != 0 && data.stage != 1
        this.viewNode.Times.visible = data.stage != 0 && data.stage != 1
    }
}
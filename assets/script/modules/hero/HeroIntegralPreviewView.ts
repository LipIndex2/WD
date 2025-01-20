import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { HeroData } from "./HeroData";
import { UH } from "../../helpers/UIHelper";
import { TextHelper } from "../../helpers/TextHelper";
import { AudioTag } from "modules/audio/AudioManager";
import { Color } from "cc";

@BaseView.registView
export class HeroIntegralPreviewView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroIntegralPreview",
        ViewName: "HeroIntegralPreviewView",
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
        { ResName: "IntegralPreviewItem", ExtendsClass: IntegralPreviewItem }
    ];
    listData: any[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(HeroIntegralPreviewView));

        let list = HeroData.Inst().GetHeroIntegralCfg(1);
        list.unshift(null);
        this.viewNode.List.setVirtual();
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this)
        this.listData = list;
        this.viewNode.List.numItems = list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
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

class IntegralPreviewItem extends BaseItem {
    protected viewNode = {
        bg: <fgui.GImage>null,
        Lv: <fgui.GTextField>null,
        General: <fgui.GTextField>null,
        Rare: <fgui.GTextField>null,
        Epic: <fgui.GTextField>null,
        Color: <fgui.GGroup>null,
        Integral: <fgui.GGroup>null,
    };
    public SetData(data: any) {
        this.viewNode.Color.visible = !data;
        this.viewNode.Integral.visible = data;
        if (!data) {
            this.viewNode.bg.visible = true
            return
        }
        let Rareintegral = HeroData.Inst().GetHeroIntegralLevelCfg(2, data.level);
        let EpicIntegral = HeroData.Inst().GetHeroIntegralLevelCfg(3, data.level);
        UH.SetText(this.viewNode.Lv, TextHelper.Format(Language.Hero.lv, data.level))
        UH.SetText(this.viewNode.General, data.hero_integral)
        UH.SetText(this.viewNode.Rare, Rareintegral.hero_integral)
        UH.SetText(this.viewNode.Epic, EpicIntegral.hero_integral)
        this.viewNode.bg.visible = data.level % 2 == 0

    }
}
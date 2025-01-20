import { GetCfgValue } from "config/CfgCommon";
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { UH } from "../../helpers/UIHelper";
import { HeroData, HeroDataModel } from "./HeroData";
import { Item } from "modules/bag/ItemData";

@BaseView.registView
export class GeneAdditionView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "GeneAddition",
        ViewName: "GeneAdditionView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        list: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "AdditionItem", ExtendsClass: GeneAdditionItem }
    ];
    static heroMode: HeroDataModel;
    listData: number[];
    InitData(param: HeroDataModel) {
        GeneAdditionView.heroMode = param
        this.viewNode.Board.SetData(new BoardData(GeneAdditionView));

        this.viewNode.list.setVirtual();
        this.listData = [1, 2, 3, 4, 5]
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.list.numItems = this.listData.length;
    }

    private itemRenderer(index: number, item: GeneAdditionItem) {
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

export class GeneAdditionItem extends BaseItem {
    protected viewNode = {
        Name: <fgui.GTextField>null,
        Attr1: <fgui.GTextField>null,
        Attr2: <fgui.GTextField>null,
    };
    public SetData(type: number) {
        UH.SetText(this.viewNode.Name, GetCfgValue(Language.Hero.fixedType, type) + ":");
        let cfg = HeroData.Inst().GetHeroLevelCfg(GeneAdditionView.heroMode.hero_id, GeneAdditionView.heroMode.level);
        if (type == 1) {
            UH.SetText(this.viewNode.Attr1, cfg.att);
        } else if (type == 2) {
            UH.SetText(this.viewNode.Attr1, cfg.att_speed);
        } else {
            UH.SetText(this.viewNode.Attr1, 0);
        }
        let info = HeroData.Inst().GetHeroInfo(GeneAdditionView.heroMode.hero_id);
        let geneArr = (info && info.geneId) || []
        let num = 0;
        for (let i = 0; i < geneArr.length; i++) {
            if (geneArr[i] == 0) continue;
            let data = HeroData.Inst().GEtGeneInfo(geneArr[i]);
            let item = Item.GetConfig(data.geneId);
            if (type == data.randAttr) {
                let att = item.fixed_att.split("|");
                num += (att[data.randAttr - 1] * 1)
            }
            if (type == item.unfixed_type) {
                num += item.unfixed_att
            }
        }
        if (type == 1) {
            UH.SetText(this.viewNode.Attr2, "+" + num);
        } else {
            UH.SetText(this.viewNode.Attr2, `+${num / 100}%`);
        }

    }

}
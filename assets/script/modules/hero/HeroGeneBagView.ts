import { Color } from 'cc';
import * as fgui from "fairygui-cc";
import { ViewManager } from 'manager/ViewManager';
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from 'modules/bag/BagData';
import { Item } from 'modules/bag/ItemData';
import { BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from 'modules/common/ColorEnum';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { RedPoint } from 'modules/extends/RedPoint';
import { HeroData } from 'modules/hero/HeroData';
import { UH } from '../../helpers/UIHelper';
import { HeroGeneInfoView } from './HeroGeneInfoView';
import { HeroInfoView } from './HeroInfoView';

@BaseView.registView
export class HeroGeneBagView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroGeneBag",
        ViewName: "HeroGeneBagView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        List: <fgui.GList>null,
        NoGet: <fgui.GGroup>null,

        // TabList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ButtonGene", ExtendsClass: ButtonGene },
        // { ResName: "ButtonTab", ExtendsClass: ButtonTab },
    ];
    index: number;
    geneIndex: number;
    static PutOnGeneArr: number[]
    listData: IPB_GeneNode[];
    InitData(param: any) {

        this.index = param.type
        this.geneIndex = param.geneIndex

        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FulshData.bind(this), "heroInfoFlush", "geneInfoFlush");
        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FulshData.bind(this), "GeneChange")

        this.viewNode.Board.SetData(new BoardData(HeroGeneBagView, Language.DataHelper.DaXie[param.type] + Language.Hero.Place1));
        this.viewNode.List.setVirtual();
        this.viewNode.List.on(fgui.Event.CLICK_ITEM, this.OnClickGeneInfo, this)
        // this.viewNode.TabList.setVirtual();
        // this.viewNode.TabList.SetData([0, 1, 2]);
        // this.viewNode.TabList.on(fgui.Event.CLICK_ITEM, this.OnClickListItem, this);
        // this.viewNode.TabList.visible = param == -1;
        // this.viewNode.TabList.selectedIndex = 0;
        this.FulshData();
    }

    FulshData() {
        HeroGeneBagView.PutOnGeneArr = HeroData.Inst().GetPutOnGeneIndex()

        let data = HeroData.Inst().GetGeneBagList(this.index);
        let info = HeroData.Inst().GetHeroInfo(HeroInfoView.hero_id);
        let geneArr = (info && info.geneId) || []
        if (geneArr[this.index - 1]) {
            let info = HeroData.Inst().GEtGeneInfo(geneArr[this.index - 1]);
            data.unshift(info);
        }
        this.listData = data;
        this.viewNode.List.itemRenderer = this.itemRnederer.bind(this);
        this.viewNode.List.numItems = data.length;
        this.viewNode.List.visible = data.length > 0;
        this.viewNode.NoGet.visible = data.length == 0;
    }

    private itemRnederer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    InitUI() {

    }

    OnClickGeneInfo(item: ButtonGene) {
        ViewManager.Inst().OpenView(HeroGeneInfoView, { geneIndex: item.data.geneIndex, index: this.index - 1 });
    }
    // OnClickListItem() {
    //     this.index = this.viewNode.TabList.selectedIndex;
    //     this.FulshData();
    // }
    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

export class ButtonGene extends BaseItemGB {
    protected viewNode = {
        Lv: <fgui.GTextField>null,
        Name: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
        AttrIcon: <fgui.GLoader>null,
        Bg: <fgui.GLoader>null,
        putOn: <fgui.GGroup>null,
        redPoint: <RedPoint>null,
    };
    public SetData(data: any) {
        this.data = data;
        let item = Item.GetConfig(data.geneId);
        let gene = HeroData.Inst().GetGeneCfg(data.geneId)
        let red = HeroData.Inst().GetGeneUpRed(data.geneId);
        this.viewNode.redPoint.SetNum(red);
        if (item.item_level > 1) {
            this.viewNode.Lv.color = new Color(229, 255, 185);
            this.viewNode.Lv.strokeColor = COLORS.Brown
            this.viewNode.Lv.stroke = 3
        } else {
            this.viewNode.Lv.color = new Color(255, 255, 255);
            this.viewNode.Lv.stroke = 0
        }
        if (HeroInfoView.hero_id == gene.hero_id) {
            this.viewNode.Name.color = new Color(32, 132, 62);
        } else {
            this.viewNode.Name.color = COLORS.Brown
        }
        UH.SetText(this.viewNode.Lv, "Lv." + item.item_level)
        UH.SetText(this.viewNode.Name, item.name)
        UH.SpriteName(this.viewNode.Bg, "CommonAtlas", "TuBiaoDi" + item.color)
        if (gene.hero_id) {
            UH.SetIcon(this.viewNode.AttrIcon, gene.hero_id, ICON_TYPE.HEROSMALL);
        } else {
            UH.SpriteName(this.viewNode.AttrIcon, "CommonAtlas", "HeroAttr" + 1)
        }
        UH.SetIcon(this.viewNode.Icon, item.icon_id, ICON_TYPE.ITEM);

        this.viewNode.putOn.visible = HeroGeneBagView.PutOnGeneArr.indexOf(data.geneIndex) != -1
    }

}

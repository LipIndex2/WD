import { Language } from './../common/Language';
import * as fgui from "fairygui-cc";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { HeroData, HeroDataModel } from "./HeroData";
import { HandleCollector } from "core/HandleCollector";
import { SMDHandle } from "data/HandleCollectorCfg";
import { ViewManager } from "manager/ViewManager";
import { HeroGeneBagView } from "./HeroGeneBagView";
import { UH } from "../../helpers/UIHelper";
import { BattleData } from 'modules/Battle/BattleData';
import { TextHelper } from '../../helpers/TextHelper';
import { Item } from 'modules/bag/ItemData';
import { COLORS, COLORSTR } from 'modules/common/ColorEnum';
import { BagData } from 'modules/bag/BagData';
import { GetCfgValue } from 'config/CfgCommon';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { HeroGeneSuitView } from './HeroGeneSuitView';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';
import { GeneAdditionView } from './GeneAdditionView';
import { GeneCompoundView } from './GeneCompoundView';
import { RedPoint } from 'modules/extends/RedPoint';
import { GeneBtnShowView } from './GeneBtnShowView';

export class HeroInfoViewGeneShow extends BaseItem {
    protected viewNode = {
        BtnGene1: <ButtonGene>null,
        BtnGene2: <ButtonGene>null,
        BtnGene3: <ButtonGene>null,
        BtnGene4: <ButtonGene>null,
        BtnGene5: <ButtonGene>null,
        Name: <fgui.GTextField>null,
        redPoint: <RedPoint>null,

        MaterialsNum1: <fgui.GTextField>null,
        MaterialsNum2: <fgui.GTextField>null,
        MaterialsNum3: <fgui.GTextField>null,
        IconMaterials1: <fgui.GLoader>null,
        IconMaterials2: <fgui.GLoader>null,
        IconMaterials3: <fgui.GLoader>null,

        BtnCompound: <fgui.GButton>null,
        BtnAddition: <fgui.GButton>null,

        Icon: <fgui.GLoader>null,
        BtnInherit1: <BtnInherit>null,
        BtnInherit2: <BtnInherit>null,
        BtnInherit3: <BtnInherit>null,
        HeroUISpineShow: <UISpineShow>null,
        WireSpine1: <UISpineShow>null,
        WireSpine2: <UISpineShow>null,
        WireSpine3: <UISpineShow>null,
        WireSpine4: <UISpineShow>null,
        WireSpine5: <UISpineShow>null,
        WireSpine6: <UISpineShow>null,
        WireSpine7: <UISpineShow>null,
        WireSpine8: <UISpineShow>null,
    };
    handleCollector: any;
    suitNum: number
    private heroMode: HeroDataModel;
    private HeroAnim: fgui.Transition;
    static geneIndex: number;
    static geneType: number;

    public SetData(data: HeroDataModel) {
        super.SetData(data)
        this.heroMode = data;
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }
        this.addSmartDataCare(HeroData.Inst().ResultData, this.FulshData.bind(this), "geneInfoFlush", "heroInfoFlush");
        this.addSmartDataCare(BagData.Inst().BagItemData, this.FulshMaterials.bind(this), "OtherChange")
        this.HeroAnim = this.getTransition("HeroAni");

        this.viewNode.BtnCompound.onClick(this.OnClickCompoundOpen, this);
        this.viewNode.BtnAddition.onClick(this.OnClickAddition, this);

        this.FulshData();
        this.FulshMaterials();
        this.initUI();
        this.PlaySpineShow();
    }
    PlaySpineShow() {
        this.viewNode.HeroUISpineShow.LoadSpine(ResPath.UIEffect(1208070), true);
        this.HeroAnim.stop();
        this.HeroAnim.play(null, -1);
    }

    FulshMaterials() {
        let red = HeroData.Inst().GetGeneCompoundRed();
        this.viewNode.redPoint.SetNum(red);

        UH.SetIcon(this.viewNode.IconMaterials1, 40053, ICON_TYPE.ITEM)
        UH.SetIcon(this.viewNode.IconMaterials2, 40052, ICON_TYPE.ITEM)
        UH.SetIcon(this.viewNode.IconMaterials3, 40047, ICON_TYPE.ITEM)
        UH.SetText(this.viewNode.MaterialsNum1, BagData.Inst().GetItemNum(40053));
        UH.SetText(this.viewNode.MaterialsNum2, BagData.Inst().GetItemNum(40052));
        UH.SetText(this.viewNode.MaterialsNum3, BagData.Inst().GetItemNum(40047));
    }

    initUI() {

        let skill = HeroData.Inst().GetGeneSuitCfg(this.heroMode.hero_id)
        if (!skill) return
        UH.SetText(this.viewNode.Name, skill.suit_name);
        UH.SetIcon(this.viewNode.Icon, skill.res_id, ICON_TYPE.HERODRAWING)
    }

    FulshData() {
        let info = HeroData.Inst().GetHeroInfo(this.heroMode.hero_id);
        let geneArr = (info && info.geneId) || []
        this.viewNode.BtnGene1.FlushShow(geneArr[0], 1)
        this.viewNode.BtnGene2.FlushShow(geneArr[1], 2)
        this.viewNode.BtnGene3.FlushShow(geneArr[2], 3)
        this.viewNode.BtnGene4.FlushShow(geneArr[3], 4)
        this.viewNode.BtnGene5.FlushShow(geneArr[4], 5)

        let num = 0;
        let index = [];
        for (let i = 0; i < geneArr.length; i++) {
            if (!info.geneId[i]) continue;
            let data = HeroData.Inst().GEtGeneInfo(info.geneId[i]);
            let gene = HeroData.Inst().GetGeneCfg(data.geneId)
            if (gene.hero_id == this.heroMode.hero_id) {
                index.push(i);
                num++;
            }
        }
        this.viewNode.BtnInherit1.FlushShow(num >= 2, num, 1)
        this.viewNode.BtnInherit2.FlushShow(num >= 4, num, 2)
        this.viewNode.BtnInherit3.FlushShow(num >= 5, num, 3)

        this.suitNum = num

        this.EffShow(index);

        if (geneArr[HeroInfoViewGeneShow.geneType - 1] > 0 && HeroInfoViewGeneShow.geneIndex != geneArr[HeroInfoViewGeneShow.geneType - 1]) {
            this.GeneApparelEffShow();
        }
    }

    EffShow(index: number[]) {
        if (index.indexOf(0) != -1 && index.indexOf(1) != -1) {
            this.viewNode.WireSpine1.LoadSpine(ResPath.UIEffect(1208073), true);
        } else {
            this.viewNode.WireSpine1.onDestroy();
        }
        if (index.indexOf(2) != -1 && index.indexOf(0) != -1) {
            this.viewNode.WireSpine2.LoadSpine(ResPath.UIEffect(1208073), true);
        } else {
            this.viewNode.WireSpine2.onDestroy();
        }
        if (index.indexOf(2) != -1 && index.indexOf(1) != -1) {
            this.viewNode.WireSpine3.LoadSpine(ResPath.UIEffect(1208073), true);
        } else {
            this.viewNode.WireSpine3.onDestroy();
        }
        if (index.indexOf(2) != -1 && index.indexOf(3) != -1) {
            this.viewNode.WireSpine4.LoadSpine(ResPath.UIEffect(1208073), true);
        } else {
            this.viewNode.WireSpine4.onDestroy();
        }
        if (index.indexOf(2) != -1 && index.indexOf(4) != -1) {
            this.viewNode.WireSpine5.LoadSpine(ResPath.UIEffect(1208073), true);
        } else {
            this.viewNode.WireSpine5.onDestroy();
        }
        if (index.indexOf(0) != -1 && index.indexOf(3) != -1) {
            this.viewNode.WireSpine6.LoadSpine(ResPath.UIEffect(1208073), true);
        } else {
            this.viewNode.WireSpine6.onDestroy();
        }
        if (index.indexOf(1) != -1 && index.indexOf(4) != -1) {
            this.viewNode.WireSpine8.LoadSpine(ResPath.UIEffect(1208073), true);
        } else {
            this.viewNode.WireSpine8.onDestroy();
        }
        if (index.indexOf(3) != -1 && index.indexOf(4) != -1) {
            this.viewNode.WireSpine7.LoadSpine(ResPath.UIEffect(1208073), true);
        } else {
            this.viewNode.WireSpine7.onDestroy();
        }
    }

    OnClickCompoundOpen() {
        ViewManager.Inst().OpenView(GeneCompoundView);
    }

    OnClickAddition() {
        ViewManager.Inst().OpenView(GeneAdditionView, this.heroMode);
    }

    GeneApparelEffShow() {
        let type = HeroInfoViewGeneShow.geneType;
        let node = GetCfgValue(this.viewNode, "BtnGene" + type)
        if (node) {
            node.apparelEffShow()
        }
    }

    private addSmartDataCare(smdata: any, callback: Function, ...keys: string[]) {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
    };

    protected onDestroy(): void {
        super.onDestroy();
        if (this.handleCollector) {
            HandleCollector.Destory(this.handleCollector);
            this.handleCollector = null;
        }
    }
}

export class ButtonGene extends BaseItemGB {
    protected viewNode = {
        Place: <fgui.GTextField>null,
        Lv: <fgui.GTextField>null,
        Name: <fgui.GTextField>null,
        AttrNum1: <fgui.GTextField>null,
        AttrNum2: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
        AttrIcon: <fgui.GLoader>null,
        Bg: <fgui.GLoader>null,
        UISpineShow: <UISpineShow>null,
        apparelSpine: <UISpineShow>null,
        redPoint: <RedPoint>null,
    };
    type: number
    geneIndex: number
    private stateCtrler: fgui.Controller
    private GeneAni1: fgui.Transition;
    private GeneAni2: fgui.Transition;
    private GeneAni3: fgui.Transition;
    private GeneAni4: fgui.Transition;
    private GeneAni5: fgui.Transition;
    protected onConstruct() {
        this.onClick(this.OnClickGene, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public FlushShow(geneIndex: number, type: number) {
        this.type = type;
        this.geneIndex = geneIndex;
        this.stateCtrler = this.getController("GeneState");
        let data = HeroData.Inst().GEtGeneInfo(geneIndex);
        if (geneIndex && data) {
            this.stateCtrler.selectedIndex = 1
        } else {
            this.stateCtrler.selectedIndex = 0
            UH.SpriteName(this.viewNode.Bg, "HeroInfo", "TuBiaoDiWu")
            UH.SetText(this.viewNode.Place, Language.DataHelper.DaXie[type] + Language.Hero.Place);
            this.viewNode.UISpineShow.onDestroy();
            let list = HeroData.Inst().GetGeneBagList(this.type)
            let red = list.length > 0 ? 1 : 0;
            this.viewNode.redPoint.SetNum(red);
            return;
        }
        let red = HeroData.Inst().GetGeneUpRed(data.geneId)
        this.viewNode.redPoint.SetNum(red);
        this.GeneAni1 = this.getTransition("GeneAni1");
        this.GeneAni2 = this.getTransition("GeneAni2");
        this.GeneAni3 = this.getTransition("GeneAni3");
        this.GeneAni4 = this.getTransition("GeneAni4");
        this.GeneAni5 = this.getTransition("GeneAni5");

        let item = Item.GetConfig(data.geneId);
        let gene = HeroData.Inst().GetGeneCfg(data.geneId)
        UH.SetText(this.viewNode.Lv, "Lv." + item.item_level)
        UH.SetText(this.viewNode.Name, item.name)
        UH.SpriteName(this.viewNode.Bg, "CommonAtlas", "TuBiaoDi" + item.color)
        if (gene.hero_id) {
            UH.SetIcon(this.viewNode.AttrIcon, gene.hero_id, ICON_TYPE.HEROSMALL);
        } else {
            UH.SpriteName(this.viewNode.AttrIcon, "CommonAtlas", "HeroAttr" + 1)
        }
        UH.SetIcon(this.viewNode.Icon, item.icon_id, ICON_TYPE.ITEM);

        let attrName1 = GetCfgValue(Language.Hero.fixedType, data.randAttr) + "：";
        let attrName2 = GetCfgValue(Language.Hero.fixedType, item.unfixed_type) + "：";

        let att = item.fixed_att.split("|");
        if (item.unfixed_type == 1) {
            UH.SetText(this.viewNode.AttrNum1, `${attrName2}${item.unfixed_att}`)
        } else {
            UH.SetText(this.viewNode.AttrNum1, `${attrName2}${(item.unfixed_att / 100)}%`)
        }
        if (data.randAttr == 1) {
            UH.SetText(this.viewNode.AttrNum2, `${attrName1}${att[0]}`)
        } else {
            UH.SetText(this.viewNode.AttrNum2, `${attrName1}${(+att[data.randAttr - 1] / 100)}%`)
        }
        if (item.color == 3) {
            this.viewNode.UISpineShow.LoadSpine(ResPath.UIEffect(1208072), true);
        } else {
            this.viewNode.UISpineShow.LoadSpine(ResPath.UIEffect(1208071), true);
        }
        this.EffShow();
    }

    apparelEffShow() {
        this.viewNode.apparelSpine.onDestroy();
        if (!this.geneIndex) return
        let data = HeroData.Inst().GEtGeneInfo(this.geneIndex);
        let item = Item.GetConfig(data.geneId);
        if (item.color == 3) {
            this.viewNode.apparelSpine.LoadSpine(ResPath.UIEffect(1208080), true);
        } else {
            this.viewNode.apparelSpine.LoadSpine(ResPath.UIEffect(1208079), true);
        }
    }

    EffShow() {
        this.GeneAni1.stop();
        this.GeneAni2.stop();
        this.GeneAni3.stop();
        this.GeneAni4.stop();
        this.GeneAni5.stop();
        if (this.type == 1) {
            this.GeneAni1.play(null, -1);
        } else if (this.type == 2) {
            this.GeneAni2.play(null, -1);
        } else if (this.type == 3) {
            this.GeneAni3.play(null, -1);
        } else if (this.type == 4) {
            this.GeneAni4.play(null, -1);
        } else if (this.type == 5) {
            this.GeneAni5.play(null, -1);
        }
    }

    OnClickGene() {
        HeroInfoViewGeneShow.geneType = this.type;
        HeroInfoViewGeneShow.geneIndex = this.geneIndex;
        if (this.geneIndex) {
            ViewManager.Inst().OpenView(GeneBtnShowView, { type: this.type, geneIndex: this.geneIndex, pos: this.node.worldPosition });
        } else {
            ViewManager.Inst().OpenView(HeroGeneBagView, { type: this.type, geneIndex: this.geneIndex ?? 0 });
        }
    }
}

export class BtnInherit extends BaseItemGB {
    public itemNum: number
    public itemType: number
    protected viewNode = {
        icon: <fgui.GLoader>null,
        Bar: <fgui.GLoader>null,
    };
    protected onConstruct() {
        this.onClick(this.OnClickGeneSuit, this);
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }
    public FlushShow(visible: boolean, num: number, type: number) {
        this.viewNode.icon.visible = visible
        this.viewNode.Bar.visible = visible
        this.itemNum = num;
        this.itemType = type;
    }
    OnClickGeneSuit() {
        ViewManager.Inst().OpenView(HeroGeneSuitView, { pos: this.node.worldPosition, num: this.itemNum, type: this.itemType });
    }
}
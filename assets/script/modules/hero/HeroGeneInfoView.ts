import { HeroInfoView } from 'modules/hero/HeroInfoView';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { HeroCtrl } from "./HeroCtrl";
import { ViewManager } from 'manager/ViewManager';
import { HeroData } from './HeroData';
import { HeroGeneResolveHintView } from './HeroGeneResolveHintView';
import { Item } from 'modules/bag/ItemData';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { UH } from '../../helpers/UIHelper';
import { TextHelper } from '../../helpers/TextHelper';
import { GetCfgValue } from 'config/CfgCommon';
import { HeroGeneBagView } from './HeroGeneBagView';
import { HeroInfoViewGeneShow } from './HeroInfoViewGeneShow';
import { BagData } from 'modules/bag/BagData';
import { BattleData } from 'modules/Battle/BattleData';
import { BaseItem } from 'modules/common/BaseItem';
import { HeroSkillCell } from 'modules/common_item/HeroSkillCellItem';

@BaseView.registView
export class HeroGeneInfoView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroGeneInfo",
        ViewName: "HeroGeneInfoView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        Bg: <fgui.GLoader>null,
        AttrIcon: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        AttrNum: <fgui.GTextField>null,
        Effect: <fgui.GTextField>null,
        Level: <fgui.GTextField>null,
        NextLevel: <fgui.GTextField>null,
        LevelAttr: <fgui.GTextField>null,
        Lv: <fgui.GTextField>null,
        IconMaterials: <fgui.GLoader>null,
        MaterialsNum: <fgui.GTextField>null,
        List: <fgui.GList>null,
        // UISpineShow: <UISpineShow>null,

        BtnWear: <fgui.GButton>null,
        BtnResolve: <fgui.GButton>null,
        BtnUpgrade: <fgui.GButton>null,
    };
    protected extendsCfg = [
        { ResName: "Inherit", ExtendsClass: Inherit }
    ];
    // private spShow: UISpineShow = undefined;
    data: any
    listData: { skillId: number; type: number; maxNum: number; num: number; }[];
    InitData(param: any) {
        this.data = param;
        this.viewNode.Board.SetData(new BoardData(HeroGeneInfoView));

        HeroCtrl.Inst().SendOpenGeneInfoUi();

        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FulshUpData.bind(this), "geneInfoFlush");
        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FulshMaterials.bind(this), "OtherChange")

        this.viewNode.BtnWear.onClick(this.OnClickWear, this);
        this.viewNode.BtnResolve.onClick(this.OnClickResolve, this);
        this.viewNode.BtnUpgrade.onClick(this.OnClickLevelUp, this);

        this.FulshData();
        this.FulshMaterials();
    }

    FulshUpData() {
        // this.EffShow();
        this.FulshData();
    }

    InitUI() {

    }

    FulshData() {
        let info = HeroData.Inst().GetHeroInfo(HeroInfoView.hero_id);
        if (info.geneId[this.data.index] == this.data.geneIndex) {
            this.viewNode.BtnWear.title = Language.Hero.tip5
            this.viewNode.BtnResolve.visible = false
        } else {
            this.viewNode.BtnResolve.visible = true
            this.viewNode.BtnWear.title = Language.Hero.tip4
        }
        let geneInfo = HeroData.Inst().GEtGeneInfo(this.data.geneIndex);
        let geneCfg = HeroData.Inst().GetGeneCfg(geneInfo.geneId)
        let item = Item.GetConfig(geneInfo.geneId);
        let item2 = Item.GetConfig(item.level_up_id)
        let suit = HeroData.Inst().GetGeneSuitCfg(geneCfg.hero_id)

        this.viewNode.BtnUpgrade.visible = item.level_up_id != 0
        if (suit) {
            let num = HeroData.Inst().GetGeneSuitNum(HeroInfoView.hero_id)
            UH.SetText(this.viewNode.Effect, suit.suit_name);
            this.listData = [
                { skillId: suit.skill_2, type: 1, maxNum: 2, num: num },
                { skillId: suit.skill_4, type: 2, maxNum: 4, num: num },
                { skillId: suit.skill_5, type: 3, maxNum: 5, num: num }];
            this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
            this.viewNode.List.numItems = this.listData.length;
        }
        UH.SetText(this.viewNode.Level, `Lv${item.item_level}:`)
        UH.SetText(this.viewNode.Lv, `等级.${item.item_level}`)
        UH.SetIcon(this.viewNode.Icon, item.icon_id, ICON_TYPE.ITEM);
        if (geneCfg.hero_id) {
            UH.SetIcon(this.viewNode.AttrIcon, geneCfg.hero_id, ICON_TYPE.HEROSMALL);
        } else {
            UH.SpriteName(this.viewNode.AttrIcon, "CommonAtlas", "HeroAttr" + 1)
        }
        UH.SpriteName(this.viewNode.Bg, "CommonAtlas", "TuBiaoDi" + item.color)

        let attrName1 = GetCfgValue(Language.Hero.fixedType, geneInfo.randAttr);
        let attrName2 = GetCfgValue(Language.Hero.fixedType, item.unfixed_type);

        let att = item.fixed_att.split("|");
        if (item.unfixed_type == 1) {
            UH.SetText(this.viewNode.AttrNum, `${attrName2}：${item.unfixed_att}`)
        } else {
            UH.SetText(this.viewNode.AttrNum, `${attrName2}：${(item.unfixed_att / 100)}%`)
        }
        if (geneInfo.randAttr == 1) {
            UH.SetText(this.viewNode.LevelAttr, `${attrName1}：${att[0]}`)
        } else {
            UH.SetText(this.viewNode.LevelAttr, `${attrName1}：${(+att[geneInfo.randAttr - 1] / 100)}%`)
        }
        if (item2) {
            let NextAtt = item2.fixed_att.split("|");
            if (geneInfo.randAttr == 1) {
                UH.SetText(this.viewNode.NextLevel, TextHelper.Format(Language.Hero.tip6, NextAtt[0]))
            } else {
                UH.SetText(this.viewNode.NextLevel, TextHelper.Format(Language.Hero.tip6, (+NextAtt[geneInfo.randAttr - 1] / 100) + "%"))
            }
        }
    }

    private itemRenderer(index: number, item: any): void {
        item.SetData(this.listData[index]);
    }
    // EffShow() {
    //     this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(1208074), true, (obj: any) => {
    //         obj.setPosition(400, -800);
    //         this.view._container.insertChild(obj, 2);
    //     });
    //     this.viewNode.UISpineShow.LoadSpine(ResPath.UIEffect(1208074), true);
    // }

    OnClickResolve() {
        let geneInfo = HeroData.Inst().GEtGeneInfo(this.data.geneIndex);
        let num = HeroData.Inst().GetSellNumCfg(geneInfo.geneId);
        ViewManager.Inst().OpenView(HeroGeneResolveHintView, {
            content: Language.Hero.tip8,
            type: 0,
            num1: num,
            num2: 0,
            confirmFunc: () => {
                HeroCtrl.Inst().SendHeroGeneDEC(this.data.geneIndex);
                if (ViewManager.Inst().IsOpen(HeroGeneInfoView)) {
                    ViewManager.Inst().CloseView(HeroGeneInfoView)
                }
            }
        });
    }

    OnClickWear() {
        let info = HeroData.Inst().GetHeroInfo(HeroInfoView.hero_id);
        if (info.geneId[this.data.index] == this.data.geneIndex) {
            HeroCtrl.Inst().SendHeroGeneRemove(HeroInfoView.hero_id, this.data.index);
            HeroInfoViewGeneShow.geneIndex = 0;
        } else {
            HeroCtrl.Inst().SendHeroGeneWear(HeroInfoView.hero_id, this.data.index, this.data.geneIndex);
            if (ViewManager.Inst().IsOpen(HeroGeneBagView)) {
                ViewManager.Inst().CloseView(HeroGeneBagView)
            }
        }
        ViewManager.Inst().CloseView(HeroGeneInfoView)
    }

    OnClickLevelUp() {
        let geneInfo = HeroData.Inst().GEtGeneInfo(this.data.geneIndex);
        let geneCfg = HeroData.Inst().GetGeneCfg(geneInfo.geneId)
        ViewManager.Inst().OpenView(HeroGeneResolveHintView, {
            content: Language.Hero.tip7,
            type: 1,
            num1: geneCfg.up[0].num,
            num2: geneCfg.up[1].num,
            confirmFunc: () => {
                HeroCtrl.Inst().SendHeroGeneUp(this.data.geneIndex);
            }
        });
    }

    FulshMaterials() {

        UH.SetIcon(this.viewNode.IconMaterials, 40047, ICON_TYPE.ITEM)
        UH.SetText(this.viewNode.MaterialsNum, BagData.Inst().GetItemNum(40047));
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        // if (this.spShow) {
        //     ObjectPool.Push(this.spShow);
        //     this.spShow = null
        // }
    }
}


class Inherit extends BaseItem {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
        Name: <fgui.GTextField>null,
        Lock: <fgui.GTextField>null,
        Word: <fgui.GRichTextField>null,
    };
    public SetData(data: any) {
        if (data.num >= data.maxNum) {
            UH.SpriteName(this.viewNode.Icon, "HeroGeneInfo", "ChuanCheng" + data.type)
        } else {
            UH.SpriteName(this.viewNode.Icon, "HeroGeneInfo", "ChuanChengAn" + data.type)
        }
        let skill = BattleData.Inst().GetSkillCfg(data.skillId);
        let str = HeroSkillCell.GetDesc(skill);
        let title = str.replace(/#036b16/g, "#449a35")
        UH.SetText(this.viewNode.Word, title);

        let NameStr = data.num >= data.maxNum ? "" : TextHelper.Format(Language.Hero.suit, data.maxNum)
        UH.SetText(this.viewNode.Name, GetCfgValue(Language.Hero, "Inherit" + data.type) + NameStr);

        // this.viewNode.Lock.visible = data.num < data.maxNum
    }
}
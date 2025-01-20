import { HeroCtrl } from 'modules/hero/HeroCtrl';
import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { HeroData } from "./HeroData";
import { UH } from "../../helpers/UIHelper";
import { GetCfgValue } from "config/CfgCommon";
import { BattleData } from "modules/Battle/BattleData";
import { TextHelper } from "../../helpers/TextHelper";
import { AudioTag } from "modules/audio/AudioManager";
import { HeroInfoView } from "./HeroInfoView";
import { HeroSkillCell } from 'modules/common_item/HeroSkillCellItem';

@BaseView.registView
export class HeroGeneSuitView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroGeneSuit",
        ViewName: "HeroGeneSuitView",
        LayerType: ViewLayer.Normal,
        ShowAnim: true,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Name: <fgui.GTextField>null,
        list: <fgui.GList>null,
        BtnClose: <fgui.GLoader>null,
        GpInherit: <fgui.GGroup>null,
        Bg: <fgui.GImage>null,
    };

    protected extendsCfg = [
        { ResName: "Inherit", ExtendsClass: Inherit }
    ];
    data: any;
    listData: { num: any; skillId: number; type: number; maxNum: number; }[];
    InitData(param: any) {
        this.data = param;
        if (param.type == 3) {
            this.viewNode.Bg.setScale(-1, -1);
            this.viewNode.GpInherit.x = param.pos.x - 300;
        } else {
            this.viewNode.GpInherit.x = param.pos.x - 150;
        }
        this.viewNode.GpInherit.y = 1600 - param.pos.y + 30;

        this.viewNode.BtnClose.onClick(this.closeView.bind(this));

        HeroCtrl.Inst().SendOpenGeneSuit();

        let skill = HeroData.Inst().GetGeneSuitCfg(HeroInfoView.hero_id)
        if (!skill) return
        UH.SetText(this.viewNode.Name, skill.suit_name);
        this.listData = [
            { num: param.num, skillId: skill.skill_2, type: 1, maxNum: 2 },
            { num: param.num, skillId: skill.skill_4, type: 2, maxNum: 4 },
            { num: param.num, skillId: skill.skill_5, type: 3, maxNum: 5 }];
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.list.numItems = this.listData.length;
    }

    private itemRenderer(index: number, item: any) {
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

class Inherit extends BaseItem {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
        Name: <fgui.GTextField>null,
        Lock: <fgui.GTextField>null,
        Word: <fgui.GRichTextField>null,
    };
    public SetData(data: any) {
        if (data.num >= data.maxNum) {
            UH.SpriteName(this.viewNode.Icon, "HeroGeneSuit", "ChuanCheng" + data.type)
        } else {
            UH.SpriteName(this.viewNode.Icon, "HeroGeneSuit", "ChuanChengAn" + data.type)
        }
        let skill = BattleData.Inst().GetSkillCfg(data.skillId);
        let str = HeroSkillCell.GetDesc(skill);
        let title = str.replace(/#036b16/g, "#aeff91")
        UH.SetText(this.viewNode.Word, title);
        UH.SetText(this.viewNode.Lock, TextHelper.Format(Language.Hero.suit, data.maxNum));
        UH.SetText(this.viewNode.Name, GetCfgValue(Language.Hero, "Inherit" + data.type));

        this.viewNode.Lock.visible = data.num < data.maxNum
    }

}
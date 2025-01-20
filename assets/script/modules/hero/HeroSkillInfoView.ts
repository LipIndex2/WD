import { Vec2 } from "cc";
import * as fgui from "fairygui-cc";
import { BattleData } from "modules/Battle/BattleData";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { UH } from "../../helpers/UIHelper";
import { Language } from "modules/common/Language";
import { TextHelper } from "../../helpers/TextHelper";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { HeroSkillCell } from "modules/common_item/HeroSkillCellItem";

@BaseView.registView
export class HeroSkillInfoView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroSkillInfo",
        ViewName: "HeroSkillInfoView",
        LayerType: ViewLayer.Normal,
        // ViewMask: ViewMask.BlockClose,
        ShowAnim: true,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {

        SkillInfoItem: <SkillInfoItem>null,
        BtnClose: <fgui.GLoader>null,
    };

    protected extendsCfg = [
        { ResName: "SkillInfoItem", ExtendsClass: SkillInfoItem },
        { ResName: "HeadItem", ExtendsClass: HeroSmallHeadItem },
    ];

    InitData(param: any) {
        this.viewNode.SkillInfoItem.SetData(param.data);
        this.viewNode.SkillInfoItem.x = param.pos.x - 115
        this.viewNode.SkillInfoItem.y = 1600 - param.pos.y - 315
        // this.viewNode.SkillInfoItem.node.setWorldPosition(param.pos.x, param.pos.y - 1600, 0)


        this.viewNode.BtnClose.onClick(this.closeView.bind(this));
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

export class SkillInfoItem extends BaseItem {
    protected viewNode = {
        Bg: <fgui.GImage>null,
        Name: <fgui.GTextField>null,
        Title: <fgui.GRichTextField>null,
        List: <fgui.GList>null,
    };
    listData: string[];
    public SetData(data: any) {

        let skill = BattleData.Inst().GetSkillCfg(data.skillid);
        UH.SetText(this.viewNode.Name, TextHelper.Format(Language.Hero.SkillLevel, data.skillLv))

        let str = HeroSkillCell.GetDesc(skill);
        let title = str.replace(/#036b16/g, "#aeff91")
        UH.SetText(this.viewNode.Title, title);

        if (skill.hero_link) {
            let HeadData = skill.hero_link.toString().split("|");
            this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
            this.listData = HeadData;
            this.viewNode.List.numItems = HeadData.length;
            let ListHeight = Math.ceil(HeadData.length / 5) * 40;
            this.viewNode.List.height = ListHeight
            this.viewNode.Bg.height += ListHeight
        }

    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }
}

export class HeroSmallHeadItem extends BaseItem {
    protected viewNode = {
        icon: <fgui.GLoader>null,
    };
    public SetData(data: string) {
        UH.SetIcon(this.viewNode.icon, data, ICON_TYPE.HEROSMALL);
    }
}
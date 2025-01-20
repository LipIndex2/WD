import { TextHelper } from './../../helpers/TextHelper';
import { HeroData } from 'modules/hero/HeroData';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { UH } from '../../helpers/UIHelper';
import { GetCfgValue } from 'config/CfgCommon';

export enum Hero_Preview_Type {
    att,   // 攻击力
    integral,//积分
}

@BaseView.registView
export class HeroLvPreviewView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroLvPreview",
        ViewName: "HeroLvPreviewView",
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
        { ResName: "AttShowItem", ExtendsClass: HeroLvPreviewAttShowItem }
    ];
    type: number
    heroid: number
    private list_data: any[];
    InitData(param: { heroid: number, type: number }) {
        this.heroid = param.heroid;
        this.type = param.type ? param.type : Hero_Preview_Type.att

        this.viewNode.Board.SetData(new BoardData(HeroLvPreviewView, GetCfgValue(Language.Hero.HeroLvPreview, "title" + this.type)));

        this.list_data = HeroData.Inst().GetHeroPreviewList(this.type, this.heroid)
        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.setVirtual();
        this.viewNode.List.numItems = this.list_data.length;
    }

    private renderListItem(index: number, item: HeroLvPreviewAttShowItem) {
        item.ItemType(this.type)
        item.SetData(this.list_data[index]);
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

class HeroLvPreviewAttShowItem extends BaseItem {
    protected viewNode = {
        Level: <fgui.GTextField>null,
        Attr: <fgui.GTextField>null,
        Icon: <fgui.GLoader>null,
    };
    itemtype: number;
    public SetData(data: any) {
        if (Hero_Preview_Type.att == this.itemtype) {
            UH.SpriteName(this.viewNode.Icon, "HeroLvPreview", "GongJiLi")
            UH.SetText(this.viewNode.Level, TextHelper.Format(Language.Hero.lv2, data.hero_level))
            UH.SetText(this.viewNode.Attr, `${Language.Hero.fixedType[1]}:${data.att}`)
        } else if (Hero_Preview_Type.integral == this.itemtype) {
            UH.SpriteName(this.viewNode.Icon, "HeroLvPreview", "integral")
            UH.SetText(this.viewNode.Level, TextHelper.Format(Language.Hero.lv2, data.level))
            UH.SetText(this.viewNode.Attr, `${Language.Hero.integral}${data.hero_integral}`)
        }
    }
    ItemType(type: number) {
        this.itemtype = type;
    }
}
import { CommonBoard3 } from 'modules/common_board/CommonBoard3';
import { UH } from '../../helpers/UIHelper';
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { DrawCardData } from './DrawCardData';
import { BaseItem } from 'modules/common/BaseItem';
import { BoardData } from 'modules/common_board/BoardData';
import { HeroData } from 'modules/hero/HeroData';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { AudioTag } from 'modules/audio/AudioManager';

@BaseView.registView
export class DrawCardChanceView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "DrawCardChance",
        ViewName: "DrawCardChanceView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        ShowList: <fgui.GList>null,
        HeroCell2: <HeroCell>null,
        HeroCell1: <HeroCell>null,
    };

    protected extendsCfg = [
        { ResName: "HeroCell", ExtendsClass: HeroCell }
    ];
    listData: any[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(this));

        const UpHero = DrawCardData.Inst().GetJackpotUpCfg(1);
        this.viewNode.HeroCell1.SetData(UpHero[0])
        this.viewNode.HeroCell2.SetData(UpHero[1])

        const NoUpHero = DrawCardData.Inst().GetJackpotUpCfg(0);
        this.listData = NoUpHero;
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = NoUpHero.length;
    }

    private itemRenderer(index: number, item: HeroCell) {
        item.SetData(this.listData[index]);
    }
}

class HeroCell extends BaseItem {
    protected viewNode = {
        Chance: <fgui.GTextField>null,
        Name: <fgui.GTextField>null,
        bg: <fgui.GLoader>null,
        HeroIcon: <fgui.GLoader>null,
        RaceIcon: <fgui.GLoader>null,
    };
    public SetData(data: any) {
        let hero = HeroData.Inst().GetDebrisHeroCfg(data.itme_id);
        let LevelHero = HeroData.Inst().GetHeroLevelCfg(hero.hero_id, 1);
        UH.SetText(this.viewNode.Chance, `${data.rate / 100}%`);
        UH.SetText(this.viewNode.Name, hero.hero_name);
        UH.SetIcon(this.viewNode.HeroIcon, LevelHero.res_id, ICON_TYPE.ROLE);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + hero.hero_race);
        UH.SpriteName(this.viewNode.bg, "CommonAtlas", "HeroBgPinZhi" + hero.hero_color);

    }
}


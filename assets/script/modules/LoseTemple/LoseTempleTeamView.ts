import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { LoseTempleHeroitem } from "./LoseTempleHeroitem";
import { LoseTempleData } from "./LoseTempleData";
import { HeroData } from "modules/hero/HeroData";
import { CocHighPerfList } from "../../ccomponent/CocHighPerfList";
import { BaseItem } from "modules/common/BaseItem";
//英雄
@BaseView.registView
export class LoseTempleTeamView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "LoseTempleTeam",
        ViewName: "LoseTempleTeamView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        list: <fgui.GList>null,
        HeroList: <fgui.GList>null,
        BattleClose: <fgui.GLoader>null,

        HeroItem1: <LoseTempleHeroitem>null,
        HeroItem2: <LoseTempleHeroitem>null,
        HeroItem3: <LoseTempleHeroitem>null,
        HeroItem4: <LoseTempleHeroitem>null,
    };

    protected extendsCfg = [
        { ResName: "HeroTeamListCell", ExtendsClass: HeroTeamListCell },
    ];

    private HeroItemAnim: fgui.Transition;
    private hero_data: any;
    listData: any[];
    InitData() {
        this.viewNode.Board.SetData(new BoardData(LoseTempleTeamView));

        this.AddSmartDataCare(LoseTempleData.Inst().FlushData, this.FulshListData.bind(this), "FlushInfo");
        this.AddSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushEffShow.bind(this), "heroBattle");
        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FulshListData.bind(this), "heroInfoFlush");

        this.viewNode.BattleClose.onClick(this.onCllickBattleClose, this);

        this.HeroItemAnim = this.view.getTransition("HeroItemAnim");

        // this.viewNode.list._container.addComponent(CocHighPerfList);
        // this.viewNode.list.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.list.setVirtual();
        this.FulshListData();
        this.viewNode.list.scrollPane.posY = 0;
    }

    private FulshListData() {
        let battleHero = LoseTempleData.Inst().GetInBattleHeros()
        this.viewNode.HeroItem1.TypeShow(true)
        this.viewNode.HeroItem2.TypeShow(true)
        this.viewNode.HeroItem3.TypeShow(true)
        this.viewNode.HeroItem4.TypeShow(true)
        this.viewNode.HeroItem1.SetData(battleHero[0]);
        this.viewNode.HeroItem2.SetData(battleHero[1]);
        this.viewNode.HeroItem3.SetData(battleHero[2]);
        this.viewNode.HeroItem4.SetData(battleHero[3]);

        this.hero_data = LoseTempleData.Inst().GetHeroListData();
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.listData = [this.hero_data];
        this.viewNode.list.numItems = [this.hero_data].length;
        // this.viewNode.list.numItems = this.hero_data.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    // private renderListItem(index: number, item: LoseTempleHeroitem) {
    //     item.TypeShow(true)
    //     item.SetData(this.hero_data[index].heroId);
    // }

    private FlushEffShow() {
        let selecBattletHeroId = LoseTempleData.Inst().heroBattleid;
        this.viewNode.BattleClose.visible = selecBattletHeroId > 0;
        this.HeroItemAnim.stop();
        if (selecBattletHeroId <= 0) return;
        this.HeroItemAnim.play(() => {
            this.FlushEffShow();
        });
    }

    private onCllickBattleClose() {
        LoseTempleData.Inst().heroBattleid = -1;
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

export class HeroTeamListCell extends BaseItem {
    protected viewNode = {
        list: <fgui.GList>null,
    };
    protected onConstruct(): void {
        super.onConstruct();
        this.viewNode.list._container.addComponent(CocHighPerfList);
    }
    private hero_data: any[];
    private renderListItem(index: number, item: LoseTempleHeroitem) {
        item.TypeShow(true)
        item.SetData(this.hero_data[index].heroId);
    }
    public SetData(data: any) {
        this.hero_data = data;
        let row = Math.ceil(data.length / 4)
        this.height = 310 * row + 80;
        this.viewNode.list.height = 300 * row + 80;
        this.viewNode.list.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.list.setVirtual();
        this.viewNode.list.numItems = data.length;
    }
}
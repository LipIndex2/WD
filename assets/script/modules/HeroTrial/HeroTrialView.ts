import { HeroData } from 'modules/hero/HeroData';
import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { CommonBoard4 } from "modules/common_board/CommonBoard4";
import { HeroTrialData } from "./HeroTrialData";
import { BaseItem } from "modules/common/BaseItem";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { UH } from "../../helpers/UIHelper";
import { Item } from 'modules/bag/ItemData';
import { ItemCell } from 'modules/extends/ItemCell';
import { BattleCtrl } from 'modules/Battle/BattleCtrl';
import { SceneType } from 'modules/Battle/BattleConfig';
import { AudioManager, AudioTag } from 'modules/audio/AudioManager';

@BaseView.registView
export class HeroTrialView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroTrial",
        ViewName: "HeroTrialView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        liuhaiscreen: <fgui.GComponent>null,

        Board: <CommonBoard4>null,
        Name: <fgui.GTextField>null,
        BtnClose: <fgui.GButton>null,
        list: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "TrialItem", ExtendsClass: HeroTrialItem }
    ];
    listData: any[];

    InitData() {
        this.AddSmartDataCare(HeroTrialData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");
        this.viewNode.BtnClose.onClick(this.closeView, this);

        this.viewNode.list.setVirtual();
        this.FlushData();
    }

    FlushData() {
        let list = HeroTrialData.Inst().GetTrialList()
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.listData = list;
        this.viewNode.list.numItems = list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.Board.FlushShow(() => {
            waitHandle.complete = true;
        }, false)
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

class HeroTrialItem extends BaseItem {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
        Bg: <fgui.GLoader>null,
        Name: <fgui.GTextField>null,
        List: <fgui.GList>null,
        BtnTrial: <fgui.GButton>null,
    };
    public SetData(data: any) {
        this.data = data;
        let isFetch = HeroTrialData.Inst().IsFetch(data.seq);
        this.getController("TrialState").selectedIndex = isFetch ? 1 : 0;
        this.viewNode.BtnTrial.onClick(this.onClickTrial, this);

        this.viewNode.List.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.List.setVirtual();
        this.viewNode.List.numItems = data.win.length;
        UH.SetIcon(this.viewNode.Bg, data.res_id, ICON_TYPE.HERO_TRIAL, null, true)
        UH.SetIcon(this.viewNode.Icon, data.hero_id, ICON_TYPE.HEROSBIG, null, true)

        let hero = HeroData.Inst().GetHeroBaseCfg(data.hero_id);
        UH.SetText(this.viewNode.Name, hero.hero_name);
    }

    onClickTrial() {
        AudioManager.Inst().Play(AudioTag.TongYongClick);
        let isFetch = HeroTrialData.Inst().IsFetch(this.data.seq);
        if (isFetch) {
            return
        }
        BattleCtrl.Inst().EnterBattle(this.data.barrier_id, SceneType.Virtual)
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(Item.Create(this.data.win[index], { is_num: true }));
    }
}
import { HeroCell } from './../extends/HeroCell';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { HeroDataModel } from "modules/hero/HeroData";

@BaseView.registView
export class MainLevelTeamView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "MainLevelTeam",
        ViewName: "MainLevelTeamView",
        LayerType: ViewLayer.Normal,
        // ViewMask: ViewMask.BlockClose,
        ShowAnim: true,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        list: <fgui.GList>null,
        bg: <fgui.GImage>null,
        GpTeam: <fgui.GGroup>null,
        BtnClose: <fgui.GLoader>null,
    };

    private heroListData: any[];
    private data: any;
    InitData(param: any) {
        this.data = param;
        this.viewNode.GpTeam.x = param.x;
        this.viewNode.GpTeam.y = param.y;

        this.viewNode.bg.scaleX = param.scaleX ? param.scaleX : 1;
        this.viewNode.bg.scaleY = param.scaleY ? param.scaleY : 1;

        this.viewNode.list.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.list.setVirtual();

        this.viewNode.BtnClose.onClick(this.closeView.bind(this));

        this.FlushHeroListInfo();
        this.BgShow();
    }

    FlushHeroListInfo() {
        let list = []
        for (let i = 0; i < 4; i++) {
            list.push(new HeroDataModel(this.data.heroId[i], (this.data.heroLevel[i]), true))
        }
        this.heroListData = list;
        this.viewNode.list.numItems = this.heroListData.length
    }

    private renderListItem(index: number, item: HeroCell) {
        item.SetData(this.heroListData[index]);
        item.LendShow();
    }

    BgShow() {
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
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { MainFBCtrl } from "modules/main_fb/MainFBCtrl";
import { MainFBData } from "modules/main_fb/MainFBData";
import { MainLevelInfoData } from "./MainLevelInfoData";
import { PlayerItem } from "./MainLevelInfoView";
import { MainLevelPlayerPanel } from "./MainLevelPlayerPanel";

@BaseView.registView
export class MainPlayerInfoView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "MainLevelInfo",
        ViewName: "MainPlayerInfoView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        board: <CommonBoard2>null,
        list: <fgui.GList>null,
        NoData: <fgui.GTextField>null,
    };

    protected extendsCfg = [
        { ResName: "PlayerItem", ExtendsClass: PlayerItem },
    ];
    listData: IPB_MainFBPassNode[];

    InitData() {
        MainFBCtrl.Inst().SendMainFBOperPassInfo(MainFBData.Inst().SelId)
        let cfg = MainLevelInfoData.Inst().CfgBarrierInfoMainInfo(MainFBData.Inst().SelId)
        this.viewNode.board.SetData(new BoardData(MainPlayerInfoView, cfg.barrier_name));

        this.viewNode.list.setVirtual();

        this.AddSmartDataCare(MainLevelInfoData.Inst().FlushData, this.FlushShowList.bind(this), "FlushInfo");
    }


    OpenCallBack() {
        this.FlushShowList()
    }

    CloseCallBack() {
    }

    FlushShowList() {
        let listData = MainLevelInfoData.Inst().InfoList;
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.listData = listData;
        this.viewNode.list.numItems = listData.length;

        this.viewNode.NoData.visible = listData.length == 0
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }
}
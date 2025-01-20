import { CommonBoard1 } from 'modules/common_board/CommonBoard1';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { Mod } from "modules/common/ModuleDefine";
import { MainLevelBossPanel } from "./MainLevelBossPanel";
import { MainLevelPlayerPanel } from "./MainLevelPlayerPanel";
import { BoardData } from 'modules/common_board/BoardData';
import { BaseItem } from 'modules/common/BaseItem';
import { MainLevelInfoData } from './MainLevelInfoData';
import { MainFBData } from 'modules/main_fb/MainFBData';
import { UH } from '../../helpers/UIHelper';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { ResPath } from 'utils/ResPath';
import { ViewManager } from 'manager/ViewManager';
import { MainLevelTeamView } from './MainLevelTeamView';
import { MainFBCtrl } from 'modules/main_fb/MainFBCtrl';
import { HeadItem } from 'modules/extends/HeadItem';
import { assetManager, ImageAsset, SpriteFrame } from 'cc';
import { AvatarData } from 'modules/extends/AvatarCell';
import { DataHelper } from '../../helpers/DataHelper';

@BaseView.registView
export class MainLevelInfoView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "MainLevelInfo",
        ViewName: "MainLevelInfoView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected boardCfg = {
        TabberCfg: [
            { panel: MainLevelBossPanel, viewName: "MainLevelBossPanel", titleName: Language.MainLevelInfo.Tab1, modKey: Mod.MainLevelInfo.Boss },
            { panel: MainLevelPlayerPanel, viewName: "MainLevelPlayerPanel", titleName: Language.MainLevelInfo.Tab2, modKey: Mod.MainLevelInfo.Player },
        ]
    };

    protected viewNode = {
        board: <CommonBoard1>null,
    };

    protected extendsCfg = [
        { ResName: "AttributeIcon", ExtendsClass: AttributeIcon },
        { ResName: "BossInfoItem", ExtendsClass: BossInfoItem },
        { ResName: "PlayerItem", ExtendsClass: PlayerItem }
    ];

    InitData() {
        MainFBCtrl.Inst().SendMainFBOperPassInfo(MainFBData.Inst().SelId)
        let cfg = MainLevelInfoData.Inst().CfgBarrierInfoMainInfo(MainFBData.Inst().SelId)
        this.viewNode.board.setName(cfg.barrier_name);
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

export class BossInfoItem extends BaseItem {
    protected viewNode = {
        Desc: <fgui.GTextField>null,
        NoData: <fgui.GTextField>null,
        list: <fgui.GList>null,
        SpineShow: <UISpineShow>null,
    };
    listData: any[][];
    SetData(data: any) {
        this.viewNode.list.setVirtual();
        let listData = MainLevelInfoData.Inst().AttributeResistance(data);
        this.viewNode.list.itemRenderer = this.itemRenderer.bind(this);
        this.listData = listData;
        this.viewNode.list.numItems = listData.length;
        this.viewNode.NoData.visible = listData.length == 0
        UH.SetText(this.viewNode.Desc, data.monster_word)
        this.viewNode.SpineShow.LoadSpine(ResPath.Monster(data.res_id), true);
    }

    private itemRenderer(index: number, item: any){
        item.SetData(this.listData[index])
    }
}

export class PlayerItem extends BaseItem {
    protected viewNode = {
        Name: <fgui.GTextField>null,
        BtnTeam: <fgui.GButton>null,
        HeadItem: <HeadItem>null,
    };
    SetData(data: any) {
        this.data = data;
        this.viewNode.BtnTeam.onClick(this.onClickTeam, this);
        let roleInfo = data.roleInfo;
        UH.SetText(this.viewNode.Name, DataHelper.BytesToString(roleInfo.name))
        this.viewNode.HeadItem.SetData(new AvatarData(roleInfo.headPicId, roleInfo.level, roleInfo.headChar, roleInfo.headFrame));

    }
    onClickTeam() {
        let pos = this.node.worldPosition;
        ViewManager.Inst().OpenView(MainLevelTeamView, { x: pos.x - 25, y: 1600 - pos.y - 180, heroId: this.data.heroId, heroLevel: this.data.heroLevel });
    }
}

export class AttributeIcon extends BaseItem {
    protected viewNode = {
        icon: <fgui.GLoader>null,
        Num: <fgui.GTextField>null,
    };
    SetData(data: number[]) {
        UH.SpriteName(this.viewNode.icon, "CommonAtlas", "HeroAttr" + data[0]);
        UH.SetText(this.viewNode.Num, (data[1] / 100) + "%")
    }
}
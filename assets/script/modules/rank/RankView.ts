
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from "modules/common/Language";
import { AvatarData } from "modules/extends/AvatarCell";
import { HeadItem } from "modules/extends/HeadItem";
import { RoleData } from "modules/role/RoleData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TYPE_TIMER, Timer } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";
import { DataHelper } from "../../helpers/DataHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent, GameToChannel } from "../../proload/ChannelAgent";
import { RankCtrl } from "./RankCtrl";
import { RANK_TYPE, RankData, RankNoBtnListShow } from "./RankData";
import { MainLevelTeamView } from "modules/MainLevelInfo/MainLevelTeamView";
import { ArenaData } from "modules/Arena/ArenaData";
import { ICON_TYPE } from "modules/common/CommonEnum";

@BaseView.registView
export class RankView extends BaseView {
    private sp_show: UISpineShow = undefined;

    protected viewRegcfg = {
        UIPackName: "Rank",
        ViewName: "RankView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        OpenAudio: AudioTag.TanChuJieMian,
    };

    protected viewNode: { [key: string]: any } = {
        fullscreen: <fgui.GComponent>null,

        parent: <fgui.GComponent>null,
        TitleShow: <fgui.GTextField>null,
        title: <fgui.GTextField>null,
        bg: <fgui.GLoader>null,
        bg_t: <fgui.GLoader>null,

        BtnClose: <fgui.GButton>null,

        BtnList: <fgui.GList>null,
        RankList: <fgui.GList>null,
        RankMe: <RankViewRankItem>null,
        RankItem0: <RankViewRankItemT>null,
        RankItem1: <RankViewRankItemT>null,
        RankItem2: <RankViewRankItemT>null,
        RewardBtn: <fgui.GButton>null,
        EmptyState: <fgui.GObject>null,
    };

    protected extendsCfg = [
        { ResName: "RankItem", ExtendsClass: RankViewRankItem },
        { ResName: "RankItemM", ExtendsClass: RankViewRankItem },
        { ResName: "RankItem0", ExtendsClass: RankViewRankItemT },
        { ResName: "RankItem1", ExtendsClass: RankViewRankItemT },
        { ResName: "RankItem2", ExtendsClass: RankViewRankItemT },
        { ResName: "ButtonMod", ExtendsClass: RankViewButtonMod },
    ]

    private RankAct = [
        // { type: RANK_TYPE.Zombie, icon: "FenYeJiangShiTuBiao", name: Language.Rank.Zombie },
        { type: RANK_TYPE.Main, icon: "ZhuXianZhangJieTuBiao", name: Language.Rank.Main },
        // { type: RANK_TYPE.Hero, icon: "YingXiong", name: Language.Rank.Hero },
        //{ type: RANK_TYPE.DefenseHome, icon: "HouYuan", name: Language.Rank.DefenseHome },
        //{ type: RANK_TYPE.Arena, icon: "HouYuan", name: Language.Rank.Arena },
        // { type: RANK_TYPE.Fish, icon: "HouYuan", name: Language.Rank.Fish},
    ]

    private rewardFunc: Function;
    listData: any;

    InitData(param: any) {
        this.viewNode.BtnClose.onClick(this.OnClickClose.bind(this));
        this.viewNode.RankItem0.onClick(this.onClickRankItemT.bind(this, 0))
        this.viewNode.RankItem1.onClick(this.onClickRankItemT.bind(this, 1))
        this.viewNode.RankItem2.onClick(this.onClickRankItemT.bind(this, 2))
        this.viewNode.RewardBtn.onClick(this.OnClickReward.bind(this))

        RankData.Inst().CurRankType = (param && param.type) ? param.type : RANK_TYPE.Main
        if (param) {
            this.rewardFunc = param.rewardFunc;
        }
        this.viewNode.RewardBtn.visible = this.rewardFunc != null;

        this.viewNode.BtnList.setVirtual();
        this.viewNode.BtnList.on(fgui.Event.CLICK_ITEM, this.onClickBtnModListItem, this);

        this.viewNode.RankList.setVirtual();
        this.viewNode.RankList.on(fgui.Event.SCROLL_END, this.OnScrollEnd, this);
        this.viewNode.RankList.on(fgui.Event.CLICK_ITEM, this.onClickListItem, this);
        this.viewNode.RankList.itemRenderer = this.renderListItem.bind(this);

        this.AddSmartDataCare(RankData.Inst().FlushData, this.FlushMainFBRank.bind(this), "FlushMainFBRank", "FlushRankListInfo");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushRoleAvater.bind(this), "FlushRoleAvater");

        RankCtrl.Inst().SendRankReq(RankData.Inst().CurRankType)

        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208075"), true, (obj: any) => {
            this.viewNode.parent._container.insertChild(obj, 0);
        });

        ChannelAgent.Inst().OnMessage(GameToChannel.WxUser);

    }

    InitUI() {
        this.FlushMainFBRank()
        this.FlushBtnShow()
    }

    FlushBtnShow() {
        if (!RankNoBtnListShow[RankData.Inst().CurRankType]) {
            let list = RankData.Inst().GetBtnList(this.RankAct);
            this.viewNode.BtnList.itemRenderer = this.itemRenderer.bind(this);
            this.listData = list;
            this.viewNode.BtnList.numItems = list.length;
            this.viewNode.BtnList.selectedIndex = RankData.Inst().GetBtnListIndex(this.RankAct, RankData.Inst().CurRankType);
        }
        this.viewNode.BtnList.visible = !RankNoBtnListShow[RankData.Inst().CurRankType];
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index])
    }

    CloseCallBack() {
        RankData.Inst().ClearRankData();
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
            this.sp_show = undefined;
        }
        if (this._ht) {
            Timer.Inst().CancelTimer(this._ht);
            this._ht = undefined;
        }
    }

    private rankList: any[]
    private _ht: TYPE_TIMER
    FlushRoleAvater() {
        if (this._ht) {
            Timer.Inst().CancelTimer(this._ht);
            this._ht = undefined;
        }
        this._ht = Timer.Inst().AddRunTimer(() => {
            RankCtrl.Inst().SendRankReq(RankData.Inst().CurRankType, 0, false)
        }, 1, 1, false)
    }
    FlushMainFBRank() {
        let listData = RankData.Inst().GetRankList(RankData.Inst().CurRankType);
        let rankListTop = listData.slice(0, 3)
        this.rankList = listData.slice(3)
        for (let i = 0; i < 3; i++) {
            this.viewNode["RankItem" + i].SetData(rankListTop[i])
        }
        this.viewNode.RankMe.RankIndex(RankData.Inst().GetMyRank(RankData.Inst().CurRankType))
        this.viewNode.RankMe.SetData(RankData.Inst().GetMyRankInfo(RankData.Inst().CurRankType))
        this.viewNode.RankList.numItems = this.rankList.length
        this.viewNode.EmptyState.visible = this.rankList.length < 1

        let bgIcon = RankData.Inst().GetBgIcon(RankData.Inst().CurRankType)
        UH.SpriteName(this.viewNode.bg, "Rank", bgIcon.bg)
        UH.SpriteName(this.viewNode.bg_t, "Rank", bgIcon.titleBg)
        UH.SetText(this.viewNode.title, RankData.Inst().GetTitle(RankData.Inst().CurRankType))
    }

    private renderListItem(index: number, item: RankViewRankItem) {
        item.RankIndex(index + 4);
        item.SetData(this.rankList[index]);
    }

    onClickBtnModListItem(item: RankViewButtonMod) {
        RankData.Inst().CurRankType = item.data.type;
        let list = RankData.Inst().GetRankList(item.data.type)
        if (!list || (list && list.length == 0)) {
            RankCtrl.Inst().SendRankReq(RankData.Inst().CurRankType)
        } else {
            this.FlushMainFBRank();
        }
    }

    OnScrollEnd() {
        RankCtrl.Inst().SendRankReq(RankData.Inst().CurRankType)
    }

    onClickListItem(item: RankViewRankItem) {
        // let pos = item.node.worldPosition;
        // ViewManager.Inst().OpenView(MainLevelTeamView, { x: pos.x + 50, y: 1600 - pos.y - 180, heroId: item.data.roleInfo.heroId, heroLevel: item.data.roleInfo.heroLevel, scaleX: -1 });
    }

    onClickRankItemT(index: number) {
        let data = RankData.Inst().GetRankList(RankData.Inst().CurRankType)[index]
        if (data) {
            // let pos = this.viewNode.RankItem1.node.worldPosition;
            // ViewManager.Inst().OpenView(MainLevelTeamView, {
            //     x: pos.x - 50, y: 1600 - pos.y + 180, heroId: data.roleInfo.heroId,
            //     heroLevel: data.roleInfo.heroLevel, scaleX: (index == 1 ? -1 : 1), scaleY: -1
            // });
        }
    }

    OnClickClose() {
        ViewManager.Inst().CloseView(RankView)
    }

    OnClickReward() {
        if (this.rewardFunc != null) {
            this.rewardFunc();
        }
    }
}

export class RankViewRankItem extends BaseItem {
    private rankIndex: number

    protected viewNode = {
        RankShow: <fgui.GTextField>null,
        NameShow: <fgui.GTextField>null,
        ValShow: <fgui.GTextField>null,
        HeadShow: <HeadItem>null,
        deco: <fgui.GLoader>null,
    };

    SetData(data: { roleInfo: IPB_RoleInfo, rankLevel: number }) {
        if (!data) {
            return
        }
        this.data = data;
        let name = DataHelper.BytesToString(data.roleInfo.name);
        if (name.indexOf("杀手") != -1) {
            name = name.replaceAll("杀手", "少侠");
        }
        UH.SetText(this.viewNode.NameShow, name)
        UH.SetText(this.viewNode.RankShow, 0 == this.rankIndex ? Language.Rank.NoRank : this.rankIndex)

        this.viewNode.HeadShow.SetData(new AvatarData(data.roleInfo.headPicId, data.roleInfo.level, data.roleInfo.headChar, data.roleInfo.headFrame))

        if (RankData.Inst().CurRankType == RANK_TYPE.Arena) {
            let value = <number>data.rankLevel;
            let rank = Math.floor(value / 100);
            let rank_order = value % 100;
            let cfg = ArenaData.Inst().GetRankCfg(rank, rank_order);
            UH.SetIcon(this.viewNode.deco, cfg.rank_icon, ICON_TYPE.ARENA_RANK_SAMLL);
            UH.SetText(this.viewNode.ValShow, cfg.rank_describe);
            this.viewNode.deco.setScale(0.8, 0.8);
        } else {
            UH.SpriteName(this.viewNode.deco, "Rank", "TuBiao" + RankData.Inst().CurRankType)
            UH.SetText(this.viewNode.ValShow, data.rankLevel)
        }
    }

    RankIndex(index: number) {
        this.rankIndex = index;
    }
}

export class RankViewRankItemT extends BaseItem {

    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        ValShow: <fgui.GTextField>null,
        deco: <fgui.GLoader>null,
        HeadShow: <HeadItem>null,
    };

    SetData(data: { roleInfo: IPB_RoleInfo, rankLevel: number }) {
        this.visible = !!data
        this.data = data;
        if (data) {
            let name = DataHelper.BytesToString(data.roleInfo.name)
            if (name.indexOf("杀手") != -1) {
                name = name.replaceAll("杀手", "少侠");
            }
            UH.SetText(this.viewNode.NameShow, name)
            this.viewNode.NameShow.align = name.length > 10 ? 0 : 1
            this.viewNode.HeadShow.SetData(new AvatarData(data.roleInfo.headPicId, data.roleInfo.level, data.roleInfo.headChar, data.roleInfo.headFrame))

            if (RankData.Inst().CurRankType == RANK_TYPE.Arena) {
                let value = <number>data.rankLevel;
                let rank = Math.floor(value / 100);
                let rank_order = value % 100;
                let cfg = ArenaData.Inst().GetRankCfg(rank, rank_order);
                UH.SetIcon(this.viewNode.deco, cfg.rank_icon, ICON_TYPE.ARENA_RANK_SAMLL);
                UH.SetText(this.viewNode.ValShow, cfg.rank_describe);
            } else {
                UH.SpriteName(this.viewNode.deco, "Rank", "TuBiao" + RankData.Inst().CurRankType)
                UH.SetText(this.viewNode.ValShow, data.rankLevel)
            }
            this.SetShow();
        }
    }

    private isShowed = false;
    SetShow() {
        if (this.isShowed) {
            return;
        }
        this.isShowed = true;
        if (RankData.Inst().CurRankType == RANK_TYPE.Arena) {
            this.viewNode.ValShow.fontSize = 22;
            this.viewNode.deco.setScale(0.6, 0.6);
            this.viewNode.deco.x = this.viewNode.deco.x - 20;
            this.viewNode.deco.y = this.viewNode.deco.y - 5;
            this.viewNode.ValShow.x = this.viewNode.ValShow.x - 7;
        }
    }
}
class RankViewButtonMod extends BaseItemGB {
    SetData(data: any) {
        this.data = data;
        this.icon = fgui.UIPackage.getItemURL("Rank", data.icon);
        this.title = data.name
    }
}
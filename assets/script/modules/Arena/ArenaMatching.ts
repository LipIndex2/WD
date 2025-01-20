import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ArenaCtrl, ArenaReq } from "./ArenaCtrl";
import { ArenaData } from "./ArenaData";
import { BattleDefSelectHeroItem } from "modules/Battle/View/BattleDefView";
import { ViewManager } from "manager/ViewManager";
import { HeadItem } from "modules/extends/HeadItem";
import { EGLoader } from "modules/extends/EGLoader";
import { AvatarData } from "modules/extends/AvatarCell";
import { UH } from "../../helpers/UIHelper";
import { DataHelper } from "../../helpers/DataHelper";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { RoleData } from "modules/role/RoleData";
import { BattleCtrl } from "modules/Battle/BattleCtrl";
import { SceneType } from "modules/Battle/BattleConfig";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { HeroData } from "modules/hero/HeroData";
import { HeroItem } from "modules/extends/HeroCell";

@BaseView.registView
export class ArenaMatching extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ArenaOther",
        ViewName: "ArenaMatching",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };


    protected viewNode = {
        BGEffect: <UIEffectShow>null,
        CloseBtn: <fgui.GButton>null,
        UISpineShow: <UISpineShow>null,
        MatchingGroup: <fgui.GGroup>null,
        MatchInfo: <ArenaMatchInfo>null,
    };

    protected extendsCfg = [
        { ResName: "MatchInfo", ExtendsClass: ArenaMatchInfo },
        { ResName: "HeroItem", ExtendsClass: BattleArenaHeroItem }
    ];

    private timeHt: any;
    InitData() {
        ArenaData.Inst().matchInfo = null;
        this.viewNode.CloseBtn.onClick(this.closeView, this);
        this.viewNode.BGEffect.PlayEff(1208110);
        this.viewNode.UISpineShow.LoadSpine("spine/PVP/PVP_pipei", true);
        AudioManager.Inst().PlayUIAudio(AudioTag.pipeizhong);

        this.AddSmartDataCare(ArenaData.Inst().smdData, this.FlushPanel.bind(this), "matchInfo");
        this.timeHt = setTimeout(() => {
            this.timeHt = null;
            this.FlushPanel();
        }, 1500)
    }

    OpenCallBack() {
        ArenaCtrl.Inst().SendReq(ArenaReq.Match);
        this.FlushPanel();
    }

    CloseCallBack() {
        if (this.timeHt) {
            clearTimeout(this.timeHt);
            this.timeHt = null;
        }
    }

    FlushPanel() {
        let matchInfo = ArenaData.Inst().matchInfo;
        this.viewNode.MatchingGroup.visible = matchInfo == null || this.timeHt != null;
        this.viewNode.MatchInfo.visible = matchInfo != null && this.timeHt == null;
        if (matchInfo != null && this.timeHt == null) {
            this.viewNode.MatchInfo.SetInfo(matchInfo);
            AudioManager.Inst().PlayUIAudio(AudioTag.pipeidao);
        }
    }
}


export class ArenaMatchInfo extends fgui.GComponent {

    private info: PB_SCArenaTargetInfo;

    protected viewNode = {
        HeadA: <HeadItem>null,
        NameA: <fgui.GTextField>null,
        NameVsA: <fgui.GTextField>null,
        RankIconA: <EGLoader>null,
        RankTextA: <fgui.GTextField>null,
        ListA: <fgui.GList>null,

        HeadB: <HeadItem>null,
        NameB: <fgui.GTextField>null,
        RankIconB: <EGLoader>null,
        RankTextB: <fgui.GTextField>null,
        ListB: <fgui.GList>null,
        NameVsB: <fgui.GTextField>null,
        UISpineShow: <UISpineShow>null,
    };

    private listData: any[] = [];
    private listDataB: any[] = [];

    protected onConstruct(): void {
        ViewManager.Inst().RegNodeInfo(this.viewNode, this);
    }

    SetSelfInfo() {
        let roleInfo = RoleData.Inst().ResultData.RoleInfo.roleinfo;
        let awatar = new AvatarData(roleInfo.headPicId, roleInfo.level, roleInfo.headChar, roleInfo.headFrame);
        this.viewNode.HeadA.SetData(awatar);
        let roleName = DataHelper.BytesToString(roleInfo.name);
        UH.SetText(this.viewNode.NameA, roleName);
        UH.SetText(this.viewNode.NameVsA, roleName);

        let rankCfg = ArenaData.Inst().GetCurRankCfg();
        UH.SetIcon(this.viewNode.RankIconA, rankCfg.rank_icon, ICON_TYPE.ARENA_RANK_SAMLL, null, true);
        UH.SetText(this.viewNode.RankTextA, rankCfg.rank_describe);

        let list = ArenaData.Inst().GetSelfHeroNode(8);
        this.listData = list;
        this.viewNode.ListA.itemRenderer = this.renderListItemA.bind(this);
        this.viewNode.ListA.numItems = list.length;
    }

    private renderListItemA(index: number, item: HeroItem) {
        item.SetData(this.listData[index]);
    }

    private renderListItemB(index: number, item: HeroItem) {
        item.SetData(this.listDataB[index]);
    }

    SetInfo(info: PB_SCArenaTargetInfo) {
        if (this.info) {
            return;
        }
        this.info = info;
        this.SetSelfInfo();
        let roleInfo = info.roleInfo;
        let awatar = new AvatarData(roleInfo.headPicId, roleInfo.level, roleInfo.headChar, roleInfo.headFrame);
        this.viewNode.HeadB.SetData(awatar);
        let roleName = DataHelper.BytesToString(roleInfo.name);
        UH.SetText(this.viewNode.NameB, roleName);
        UH.SetText(this.viewNode.NameVsB, roleName);

        let rankCfg = ArenaData.Inst().GetRankCfg(info.rank, info.rankOrder);
        UH.SetIcon(this.viewNode.RankIconB, rankCfg.rank_icon, ICON_TYPE.ARENA_RANK_SAMLL, null, true);
        UH.SetText(this.viewNode.RankTextB, rankCfg.rank_describe);

        let list = ArenaData.Inst().ConvertToHeroNode2(info.heroList, 8);

        this.viewNode.ListB.itemRenderer = this.renderListItemB.bind(this);
        this.listDataB = list;
        this.viewNode.ListB.numItems = list.length;
        this.viewNode.UISpineShow.LoadSpine("spine/PVP/PVP-pipeidao", true);
        this.getTransition("vs").play(() => {
            //ViewManager.Inst().CloseView(ArenaMatching);
            BattleCtrl.Inst().EnterBattle(1, SceneType.Arena);
        });
    }
}

export class BattleArenaHeroItem extends BaseItem {
    protected viewNode = {
        BG: <EGLoader>null,
        Level: <fgui.GTextField>null,
        HeroIcon: <EGLoader>null,
        RaceIcon: <EGLoader>null,
    };

    protected onConstruct(): void {
        super.onConstruct();
    }

    public SetData(data: IPB_HeroNode): void {
        this._data = data;
        let cfg = HeroData.Inst().GetHeroBaseCfg(data.heroId);

        let level = data.heroLevel;
        if (level == 0) {
            level = ArenaData.Inst().GetFreeHeroLevel(data.heroId);
        }

        let levelCfg = HeroData.Inst().GetHeroLevelCfg(data.heroId, level);
        if (!levelCfg) {
            return;
        }
        let color = cfg.hero_color;
        UH.SpriteName(this.viewNode.BG, "CommonAtlas", "HeroBgPinZhi" + color);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + cfg.hero_race);
        UH.SetIcon(this.viewNode.HeroIcon, levelCfg.res_id, ICON_TYPE.ROLE, null, true);
        UH.SetText(this.viewNode.Level, Language.Arena.Level + level);
    }
}

import { GetCfgValue } from 'config/CfgCommon';
import { ObjectPool } from 'core/ObjectPool';
import * as fgui from "fairygui-cc";
import { AudioTag } from 'modules/audio/AudioManager';
import { BaseItemGB } from 'modules/common/BaseItem';
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from 'modules/common/ColorEnum';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { Language } from 'modules/common/Language';
import { BoardData } from 'modules/common_board/BoardData';
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { TimeFormatType, TimeMeter } from 'modules/extends/TimeMeter';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { ResPath } from 'utils/ResPath';
import { TextHelper } from '../../helpers/TextHelper';
import { UH } from '../../helpers/UIHelper';
import { HeroData } from './HeroData';
import { ViewManager } from 'manager/ViewManager';
import { HeroInfoView } from './HeroInfoView';

@BaseView.registView
export class TodayGainView extends BaseView {
    private sp_show: UISpineShow = undefined;

    protected viewRegcfg = {
        UIPackName: "TodayGain",
        ViewName: "TodayGainView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        ParentArrow: <fgui.GComponent>null,
        RaceIcon: <fgui.GLoader>null,
        RaceName: <fgui.GTextField>null,
        DescShow: <fgui.GTextField>null,
        TimeShow: <TimeMeter>null,
        HeroList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "HeroItem", ExtendsClass: TodayGainViewHeroItem },
        //{ ResName: "RewardItem", ExtendsClass: DeepCeleGiftViewRewardItem },
    ]
    listData: import("d:/ccs/wjszm-c/assets/script/config/CfgHero").CfgHeroJiHuo[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(TodayGainView));

        //this.viewNode.ShowList.setVirtual();

        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FlushTodayGain.bind(this), "todayGainFlush");
    }

    InitUI() {
        //this.FulshEffectShow()
        this.FlushTimeShow()
        this.FlushTodayGain()
    }

    FulshEffectShow() {
        this.sp_show = ObjectPool.Get(UISpineShow, ResPath.Spine("jiantou_TB/jiantou_TB"), true, (obj: any) => {
            this.viewNode.ParentArrow._container.insertChild(obj, 0);
        });
    }

    FlushTodayGain() {
        let info = HeroData.Inst().TodayGainInfo
        if (info) {
            let co = HeroData.Inst().GetTodayGainInfoBySeq(info.seq)
            if (co) {
                UH.SetText(this.viewNode.DescShow, TextHelper.Format(Language.Hero.TodayGain.DescShow, GetCfgValue(Language.Hero.fixedType, co.gain_type), info.param[0] / 100))
                UH.SetText(this.viewNode.RaceName, GetCfgValue(Language.Hero.Race, co.hero_race))
                this.viewNode.RaceName.color = GetCfgValue(COLORS, `HeroRace${co.hero_race}`)
                UH.SpriteName(this.viewNode.RaceIcon, "TodayGain", `HeroAttr${co.hero_race}`);

                let hero_list = HeroData.Inst().GetHeroListByRace(co.hero_race)
                this.viewNode.HeroList.itemRenderer = this.itemRenderer.bind(this)
                this.listData = hero_list;
                this.viewNode.HeroList.numItems = hero_list.length;
            }
        }

    }
    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    CloseCallBack() {
        this.viewNode.TimeShow.CloseCountDownTime()

        // if (this.sp_show) {
        //     ObjectPool.Push(this.sp_show);
        // }
    }

    FlushTimeShow() {
        this.viewNode.TimeShow.CloseCountDownTime()
        if (TimeCtrl.Inst().tomorrowStarTime > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.TimeShow.StampTime(TimeCtrl.Inst().tomorrowStarTime, TimeFormatType.TYPE_TIME_0, Language.Hero.TodayGain.TimeShow)
            this.viewNode.TimeShow.SetCallBack(this.FlushTimeShow.bind(this))
        }
        else {
            this.viewNode.TimeShow.SetTime("")
        }
    }
}

export class TodayGainViewHeroItem extends BaseItemGB {
    protected viewNode = {
        icon: <fgui.GLoader>null,
    };

    protected onConstruct() {
        super.onConstruct();
        this.onClick(this.OnClickItem, this)
    };

    SetData(data: any) {
        this.data = data;
        UH.SetIcon(this.viewNode.icon, data.hero_id, ICON_TYPE.HEROSBIG);
    }

    OnClickItem() {
        ViewManager.Inst().OpenView(HeroInfoView, this.data.hero_id);
    }
}

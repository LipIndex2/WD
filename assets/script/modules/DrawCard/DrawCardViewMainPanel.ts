import { Item } from 'modules/bag/ItemData';
import { ICON_TYPE } from 'modules/common/CommonEnum';
import { BagData } from 'modules/bag/BagData';
import { HeroDataModel } from 'modules/hero/HeroData';
import { HeroInfoView } from 'modules/hero/HeroInfoView';
import { ViewManager } from 'manager/ViewManager';
import { HeroData } from 'modules/hero/HeroData';
import { Language } from 'modules/common/Language';
import * as fgui from "fairygui-cc";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { BasePanel } from "modules/common/BasePanel";
import { TimeMeter, TimeFormatType } from "modules/extends/TimeMeter";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { DrawCardData } from "./DrawCardData";
import { BaseItem } from "modules/common/BaseItem";
import { UH } from "../../helpers/UIHelper";
import { TextHelper } from '../../helpers/TextHelper';
import { DrawCardCtrl } from './DrawCardCtrl';
import { DrawCardChanceView } from './DrawCardChanceView';
import { PublicPopupCtrl } from 'modules/public_popup/PublicPopupCtrl';
import { DialogTipsToggle, DialogTipsToggleKey } from 'modules/public_popup/PublicPopupData';
import { RedPoint } from 'modules/extends/RedPoint';
import { GetCfgValue } from 'config/CfgCommon';
import { Color } from 'cc';

export class DrawCardViewMainPanel extends BasePanel {
    protected viewNode = {
        CostIcon1: <fgui.GLoader>null,
        CostIcon2: <fgui.GLoader>null,
        CostTxt1: <fgui.GTextField>null,
        CostTxt2: <fgui.GTextField>null,
        Title: <fgui.GTextField>null,
        DrawCount: <fgui.GTextField>null,
        ButtonTips: <fgui.GButton>null,
        BtnChance: <fgui.GButton>null,
        BtnDraw1: <fgui.GButton>null,
        BtnDraw2: <fgui.GButton>null,
        DrawUp1: <DrawUp>null,
        DrawUp2: <DrawUp>null,
        timer: <TimeMeter>null,
        redPoint1: <RedPoint>null,
        redPoint2: <RedPoint>null,
    };

    protected extendsCfg = [
        { ResName: "DrawUp1", ExtendsClass: DrawUp },
        { ResName: "DrawUp2", ExtendsClass: DrawUp },
    ];

    InitPanelData() {
        this.AddSmartDataCare(DrawCardData.Inst().FlushData, this.FlushView.bind(this), "FlushInfo");

        this.viewNode.BtnDraw1.onClick(this.onClickDraw.bind(this, 1));
        this.viewNode.BtnDraw2.onClick(this.onClickDraw.bind(this, 10));
        this.viewNode.ButtonTips.onClick(this.onClickChance, this);

        const stampCfg = DrawCardData.Inst().GetTimeStamp();
        UH.SetText(this.viewNode.Title, stampCfg.activity_name);

        const UpHero = DrawCardData.Inst().GetJackpotUpCfg(1);
        this.viewNode.DrawUp1.FlushView(UpHero[0].itme_id)
        this.viewNode.DrawUp2.FlushView(UpHero[1].itme_id)

        this.FlushView();
        this.FlushTime();
    }

    FlushView() {
        const otherCfg = DrawCardData.Inst().GetOtherCfg();
        const count = DrawCardData.Inst().DrawCount
        const itemid1 = otherCfg.extract_item2[0].item_id
        const itemNum1 = BagData.Inst().GetItemNum(itemid1)
        // const itemid2 = otherCfg.ten_extract_item2[0].item_id
        // const itemNum2 = BagData.Inst().GetItemNum(itemid2)
        this.viewNode.redPoint1.SetNum(itemNum1 >= otherCfg.extract_item2[0].num ? 1 : 0)
        this.viewNode.redPoint2.SetNum(itemNum1 >= otherCfg.ten_extract_item2[0].num ? 1 : 0)
        UH.SetIcon(this.viewNode.CostIcon1, Item.GetIconId(itemid1), ICON_TYPE.ITEM);
        UH.SetIcon(this.viewNode.CostIcon2, Item.GetIconId(itemid1), ICON_TYPE.ITEM);
        UH.SetText(this.viewNode.CostTxt1, `${itemNum1}/${otherCfg.extract_item2[0].num}`);
        UH.SetText(this.viewNode.CostTxt2, `${itemNum1}/${otherCfg.ten_extract_item2[0].num}`);
        UH.SetText(this.viewNode.DrawCount, TextHelper.Format(Language.DrawCard.DrawCount, otherCfg.guarantees_min_num - count, otherCfg.guarantees_min_num));
    }

    onClickDraw(num: number) {
        const otherCfg = DrawCardData.Inst().GetOtherCfg();
        let icon = TextHelper.RichTextImg("CommonCurrency", "Small40163")
        let str = TextHelper.RichTextOutLine("x" + otherCfg.extract_item2[0].num * num, "491914", 3)
        let tips = TextHelper.Format(Language.DrawCard.DrawTips, icon, str, num);
        PublicPopupCtrl.Inst().DialogTips(tips, () => {
            DrawCardCtrl.Inst().SendDrawCard(num)
        }, null, null, null, null, DialogTipsToggle.CreateDay(DialogTipsToggleKey.DrawCard), true);
    }

    onClickChance() {
        ViewManager.Inst().OpenView(DrawCardChanceView)
    }

    private FlushTime() {
        let time = ActivityData.Inst().GetEndStampTime(ACTIVITY_TYPE.DrawCard) - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
    }
}

class DrawUp extends BaseItem {
    protected viewNode = {
        BtnTips: <fgui.GButton>null,
        HeroColor: <fgui.GTextField>null,
        Name: <fgui.GTextField>null,
        Bg: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        RaceIcon: <fgui.GLoader>null,
    };
    protected onConstruct() {
        super.onConstruct()
        this.viewNode.BtnTips.onClick(this.onClickTips, this);
    }
    heroData: any
    FlushView(itemId: number) {
        const hero = HeroData.Inst().GetDebrisHeroCfg(itemId)
        this.heroData = hero;
        UH.SetText(this.viewNode.Name, hero.hero_name);
        UH.SetText(this.viewNode.HeroColor, GetCfgValue(Language.Hero.quality, hero.hero_color) + Language.DrawCard.hero);
        this.viewNode.HeroColor.color = hero.hero_color == 3 ? new Color(255, 158, 247) : new Color(83, 255, 253);
        UH.SpriteName(this.viewNode.RaceIcon, "CommonAtlas", "HeroAttr" + hero.hero_race);
        UH.SetIcon(this.viewNode.Icon, "icon_" + hero.hero_id, ICON_TYPE.DrawCard);
        UH.SetIcon(this.viewNode.Bg, "bg_" + hero.hero_id, ICON_TYPE.DrawCard);
    }
    onClickTips() {
        ViewManager.Inst().OpenView(HeroInfoView, new HeroDataModel(this.heroData.hero_id, this.heroData.level_max, true))
    }
}
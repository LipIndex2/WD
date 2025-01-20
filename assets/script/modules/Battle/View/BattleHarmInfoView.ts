import { Vec2 } from "cc";
import * as fgui from "fairygui-cc";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { EGLoader } from "modules/extends/EGLoader";
import { HeroData } from "modules/hero/HeroData";
import { DataHelper } from "../../../helpers/DataHelper";
import { UH } from "../../../helpers/UIHelper";
import { BattleData } from "../BattleData";
import { IBattleAttackInfoItemData } from "../BattleFinishView";

@BaseView.registView
export class BattleHarmInfoView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleHarmInfo",
        ViewName: "BattleHarmInfoView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.None,
    };

    protected viewNode = {
        Info: <fgui.GComponent>null,
        Pos: <fgui.GObject>null,
    };

    protected extendsCfg = [
        { ResName: "HeroInfo", ExtendsClass: BattleHarmInfoItem },
        { ResName: "ProgressBar", ExtendsClass: BattleHarmInfoProgress }
    ];

    private gList: fgui.GList;
    InitData(param: { pos: Vec2 }) {
        if (param && param.pos) {
            this.viewNode.Pos.setPosition(param.pos.x, param.pos.y)
        }
        this.gList = this.viewNode.Info.getChild("List");
        this.AddSmartDataCare(BattleData.Inst().battleInfo, this.FlushPanel.bind(this), "attackValueRecord")
    }

    OpenCallBack() {
        this.ReSetWindowSize();
        this.FlushPanel();
    }

    CloseCallBack() {
    }

    private listData: IBattleAttackInfoItemData[] = []
    FlushPanel() {
        BattleData.Inst().GetHarmInfoList(this.listData);
        this.viewNode.Info.height = this.listData.length * 56 + 16;
        //this.gList.height = this.listData.length * 40;
        this.gList.itemRenderer = this.itemRenderer.bind(this);
        this.gList.numItems = this.listData.length;
    }

    private itemRenderer(index: number, item: BattleHarmInfoItem) {
        item.SetData(this.listData[index]);
    }
}


class BattleHarmInfoItem extends BaseItem {
    protected viewNode = {
        Qua: <fgui.GLoader>null,
        Icon: <EGLoader>null,
        Progerss: <BattleHarmInfoProgress>null,
    };
    public SetData(data: IBattleAttackInfoItemData): void {
        this._data = data;
        let heroLevel = BattleData.Inst().GetHeroLevel(data.heroId);
        let heroCfg = HeroData.Inst().GetHeroLevelCfg(data.heroId, heroLevel);
        let heroBaseCfg = HeroData.Inst().GetHeroBaseCfg(data.heroId);
        UH.SetIcon(this.viewNode.Icon, heroCfg.res_id, ICON_TYPE.ROLE);
        UH.SpriteName(this.viewNode.Qua, "BattleHarmInfo", "Qua" + heroBaseCfg.hero_color);
        this.viewNode.Progerss.SetIcon("Type" + heroBaseCfg.hero_race);
        this.viewNode.Progerss.SetData(data);
    }
}

class BattleHarmInfoProgress extends BaseItem {
    protected viewNode = {
        icon: <fgui.GLoader>null,
        title: <fgui.GTextField>null,
    };

    public SetIcon(spriteName: string) {
        UH.SpriteName(this.viewNode.icon, "BattleHarmInfo", spriteName)
    }

    public SetData(data: IBattleAttackInfoItemData): void {
        this._data = data;
        UH.SetText(this.viewNode.title, DataHelper.ConverNum(data.value));
        if (data.sumValue == 0) {
            this.viewNode.icon.width = 34
        } else {
            this.viewNode.icon.width = 260 * data.value / data.sumValue;
        }
    }
}
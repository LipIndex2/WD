import * as fgui from "fairygui-cc";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { EGLoader } from "modules/extends/EGLoader";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { UH } from "../../helpers/UIHelper";
import { HeroData } from "./HeroData";
import { GetCfgValue } from "config/CfgCommon";
import { ResPath } from "utils/ResPath";
import { Timer } from "modules/time/Timer";

@BaseView.registView
export class GeneLevelUpView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "GeneLevelUp",
        ViewName: "GeneLevelUpView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        bg: <EGLoader>null,
        bg2: <fgui.GImage>null,
        GpAttr: <fgui.GGroup>null,
        Level1: <fgui.GTextField>null,
        Level2: <fgui.GTextField>null,
        Attr1: <fgui.GTextField>null,
        Attr2: <fgui.GTextField>null,
        ButtonContinue: <fgui.GButton>null,
        GeneLevelItem: <GeneLevelItem>null,
        wordSpine: <UISpineShow>null,
        cardSpine: <UISpineShow>null,
        colouredSpine: <UISpineShow>null,
        starSpine: <UISpineShow>null,
        lightSpine: <UISpineShow>null,
    };

    protected extendsCfg = [
        { ResName: "GeneLevelItem", ExtendsClass: GeneLevelItem }
    ];
    private timer_ani: any = null;
    private timer_ani1: any = null;
    private timer_ani2: any = null;

    InitData(param: IPB_GeneNode[]) {
        this.viewNode.bg2.visible = false;
        this.viewNode.GeneLevelItem.visible = false;

        this.viewNode.ButtonContinue.onClick(this.closeView, this);
        this.viewNode.GeneLevelItem.FlushShow(param[1]);

        let item = Item.GetConfig(param[0].geneId);
        let NextItem = Item.GetConfig(param[1].geneId);
        let attrName = GetCfgValue(Language.Hero.fixedType, param[0].randAttr)
        UH.SetText(this.viewNode.Level1, "Lv." + item.item_level)
        UH.SetText(this.viewNode.Level2, "Lv." + NextItem.item_level)
        let att1 = item.fixed_att.split("|");
        let att2 = NextItem.fixed_att.split("|");
        if (param[0].randAttr == 1) {
            UH.SetText(this.viewNode.Attr1, `${attrName}：${att1[0]}`)
            UH.SetText(this.viewNode.Attr2, `${attrName}：${att2[0]}`)
        } else {
            UH.SetText(this.viewNode.Attr1, `${attrName}：${(+att1[param[0].randAttr - 1] / 100)}%`)
            UH.SetText(this.viewNode.Attr2, `${attrName}：${(+att2[param[0].randAttr - 1] / 100)}%`)
        }

        this.PlaySpineShow(item.color);
    }

    PlaySpineShow(color: number) {
        this.viewNode.wordSpine.LoadSpine(ResPath.UIEffect(1208083), true);
        this.viewNode.starSpine.LoadSpine(ResPath.UIEffect(1208050), true);
        this.viewNode.lightSpine.LoadSpine(ResPath.UIEffect(1208042), true);
        if (color == 2) {
            this.viewNode.cardSpine.LoadSpine(ResPath.UIEffect(1208084), true);
        } else {
            this.viewNode.cardSpine.LoadSpine(ResPath.UIEffect(1208086), true);
        }
        Timer.Inst().CancelTimer(this.timer_ani1);
        this.timer_ani1 = Timer.Inst().AddRunTimer(() => {
            this.viewNode.colouredSpine.LoadSpine(ResPath.UIEffect(1208085), true);
            this.viewNode.bg2.visible = true;
        }, 1, 1, false)

        // Timer.Inst().CancelTimer(this.timer_ani1);
        // this.timer_ani1 = Timer.Inst().AddRunTimer(() => {
        // }, 1, 1, false)

        Timer.Inst().CancelTimer(this.timer_ani2);
        this.timer_ani2 = Timer.Inst().AddRunTimer(() => {
            this.viewNode.GpAttr.visible = true
            this.viewNode.GeneLevelItem.visible = true;
            this.view.getTransition("GeneUpAni").play();
        }, 1.2, 1, false)
    }

    InitUI() {
    }

    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.bg.SetIcon("loader/gene/GeneBg", () => {
            waitHandle.complete = true;
            this.refreshBgSize(this.viewNode.bg)
        })
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        Timer.Inst().CancelTimer(this.timer_ani);
        Timer.Inst().CancelTimer(this.timer_ani1);
        Timer.Inst().CancelTimer(this.timer_ani2);
    }
}

export class GeneLevelItem extends BaseItem {
    protected viewNode = {
        Icon: <fgui.GLoader>null,
        AttrIcon: <fgui.GLoader>null,
        Bg: <fgui.GLoader>null,
        Lv: <fgui.GTextField>null,
    };
    public FlushShow(data: IPB_GeneNode) {
        let info = data
        let gene = HeroData.Inst().GetGeneCfg(info.geneId)
        let item = Item.GetConfig(info.geneId);
        UH.SetText(this.viewNode.Lv, "Lv." + item.item_level)
        UH.SpriteName(this.viewNode.Bg, "CommonAtlas", "TuBiaoDi" + item.color)
        if (gene.hero_id) {
            UH.SetIcon(this.viewNode.AttrIcon, gene.hero_id, ICON_TYPE.HEROSMALL);
        } else {
            UH.SpriteName(this.viewNode.AttrIcon, "CommonAtlas", "HeroAttr" + 1)
        }
        UH.SetIcon(this.viewNode.Icon, item.icon_id, ICON_TYPE.ITEM);

    }
}
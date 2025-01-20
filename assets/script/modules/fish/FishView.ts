
import { GetCfgValue } from "config/CfgCommon";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { FishPassData } from "modules/FishPass/FishPassData";
import { FishPassView } from "modules/FishPass/FishPassView";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseItem, BaseItemCare, BaseItemGB, BaseItemGBCare, BaseItemGP } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { COLORS } from "modules/common/ColorEnum";
import { AdType, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { CurrencyShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { RedPoint } from "modules/extends/RedPoint";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RankView } from "modules/rank/RankView";
import { RoleData } from "modules/role/RoleData";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { ReportManager, ReportType } from "../../proload/ReportManager";
import { FishAttrView } from "./FishAttrView";
import { FishBaitView } from "./FishBaitView";
import { FishBoxView } from "./FishBoxView";
import { FishBreadView } from "./FishBreadView";
import { FishCardView } from "./FishCardView";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";
import { FishGetView } from "./FishGetView";
import { FishHandbookView } from "./FishHandbookView";
import { FishLevelView } from "./FishLevelView";
import { FishMapView } from "./FishMapView";
import { FishOrderView } from "./FishOrderView";
import { FishSettingView } from "./FishSettingView";
import { FishShopView } from "./FishShopView";
import { FishToolView } from "./FishToolView";
import { FishViewFishPanel } from "./FishViewFishPanel";

@BaseView.registView
export class FishView extends BaseView {
    private sp_show: UISpineShow = undefined;
    private per_eff: number

    protected viewRegcfg = {
        UIPackName: "Fish",
        ViewName: "FishView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        ShowAnim: false,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        bg: <EGLoader>null,

        BtnPass: <FishViewModButton>null,
        BtnRank: <fgui.GButton>null,
        BtnReturn: <fgui.GButton>null,
        BtnBread: <fgui.GButton>null,
        BtnCard: <FishViewModButton>null,
        BtnSetting: <fgui.GButton>null,
        BtnHandbook: <FishViewModButton>null,
        BtnShop: <fgui.GButton>null,
        BtnMap: <FishViewModButton>null,
        BtnOrder: <FishViewOrderButton>null,
        BtnBox: <FishViewBoxButton>null,
        BtnLevel: <fgui.GButton>null,

        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,

        UIEffectShow: <UIEffectShow>null,
        ProgressLevel: <FishViewLevelProgress>null,
    };

    protected extendsCfg = [
        { ResName: "FishViewFishPanel", ExtendsClass: FishViewFishPanel },
        { ResName: "ItemTool", ExtendsClass: FishViewToolItem },
        { ResName: "ButtonOrder", ExtendsClass: FishViewOrderButton },
        { ResName: "ItemOrder", ExtendsClass: FishViewOrderItem },
        { ResName: "ProgressLevel", ExtendsClass: FishViewLevelProgress },
        { ResName: "ButtonRod", ExtendsClass: FishViewRodButton },
        { ResName: "ButtonTool", ExtendsClass: FishViewToolButton },
        { ResName: "ButtonBait", ExtendsClass: FishViewBaitButton },
        { ResName: "ButtonBox", ExtendsClass: FishViewBoxButton },
        { ResName: "ButtonMod", ExtendsClass: FishViewModButton },
    ]

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.FlushBgShow(waitHandle);
    }

    InitData() {
        this.viewNode.BtnReturn.onClick(this.OnClickReturn, this);
        this.viewNode.BtnBread.onClick(this.OnClickBread, this);
        this.viewNode.BtnCard.onClick(this.OnClickCard, this);
        this.viewNode.BtnSetting.onClick(this.OnClickSetting, this);
        this.viewNode.BtnHandbook.onClick(this.OnClickHandbook, this);
        this.viewNode.BtnShop.onClick(this.OnClickShop, this);
        this.viewNode.BtnMap.onClick(this.OnClickMap, this);
        this.viewNode.BtnOrder.onClick(this.OnClickOrder, this);
        this.viewNode.BtnBox.onClick(this.OnClickBox, this);
        this.viewNode.BtnLevel.onClick(this.OnClickLevel, this);
        this.viewNode.BtnPass.onClick(this.OnClickPass, this);
        this.viewNode.BtnRank.onClick(this.OnClickRank, this);

        this.viewNode.Currency1.SetCurrency(FishData.Inst().CfgOtherFishCoin);
        this.viewNode.Currency2.SetCurrency(FishData.Inst().CfgOtherBreadId);

        this.AddSmartDataCare(FishPassData.Inst().FlushData, this.FlushRedNum.bind(this), "FlushInfo");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushScore.bind(this), "FlushFishListInfo");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushBread.bind(this), "FlushPowerInfo");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushCommonInfo.bind(this), "FlushCommonInfo");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushLevel.bind(this), "FlushLevelInfo");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushRedNum.bind(this));

        this.viewNode.BtnPass.visible = FunOpen.Inst().checkAudit(1) && ActivityData.Inst().IsOpen(ACTIVITY_TYPE.FishPass);

        FishCtrl.Inst().SendRoleFishReqInfo()
    }

    InitUI() {
        this.FlushShow()
        this.FlushInfo()
        this.FlushBread()
        this.FlushCommonInfo()
        this.FlushRedNum()
    }
    OpenCallBack(): void {
        ReportManager.Inst().sendPoint(ReportType.gameModelInfo, [Mod.Fish.View, 0, 0, RoleData.Inst().InfoRoleId], "mod-" + Mod.Fish.View)
    }

    FlushShow() {
        let ica = RoleData.Inst().IsCanAD(AdType.fish_bread, false)
        this.viewNode.BtnBread.visible = ica
        if (!ica) {
            this.viewNode.BtnPass.y = this.viewNode.BtnBread.y
        }
    }

    FlushBgShow(waitHandle?: any) {
        let id = FishData.Inst().InfoAreaId
        this.viewNode.bg.SetIcon(`loader/fish/BeiJing${id}`, () => {
            if (undefined != waitHandle) {
                // AudioManager.Inst().PlayBg(AudioTag.WaBaoBg);
                waitHandle.complete = true;
            }
        })

        if (this.per_eff) {
            this.viewNode.UIEffectShow.StopEff(this.per_eff)
        }
        let eff = 1 == id ? 1009009 : (1009000 + id)
        this.viewNode.UIEffectShow.PlayEff(eff)
        this.per_eff = eff
    }

    FlushInfo() {
        this.FlushLevel()
        this.FlushScore()
    }

    FlushLevel() {
        let co_level = FishData.Inst().CfgFisherLevelByLevel()
        this.viewNode.BtnLevel.title = TextHelper.Format(Language.Fish.Main.LevelShow, FishData.Inst().InfoLevel)
        this.viewNode.ProgressLevel.value = FishData.Inst().InfoExp
        this.viewNode.ProgressLevel.max = co_level ? co_level.exp : 0
        this.viewNode.ProgressLevel.FlushShow()
    }

    FlushScore() {
        this.viewNode.BtnBox.title = TextHelper.Format(Language.Fish.Main.ScoreShow, FishData.Inst().GetBoxInfoTotalScore())
    }

    FlushBread() {
        this.viewNode.Currency2.SetCurrency(FishData.Inst().CfgOtherBreadId);
    }

    FlushCommonInfo() {
        this.FlushBgShow()

        this.viewNode.BtnSetting.grayed = TimeCtrl.Inst().ServerTime > FishData.Inst().InfoFishCardTime
    }

    FlushRedNum() {
        this.viewNode.BtnCard.FlushRedNum(FishData.Inst().GetRedNumCard())
        this.viewNode.BtnHandbook.FlushRedNum(FishData.Inst().GetRedNumHandbook())
        this.viewNode.BtnMap.FlushRedNum(FishData.Inst().GetRedNumMap())
        this.viewNode.BtnPass.FlushRedNum(FishPassData.Inst().GetAllRed())
        this.viewNode.BtnBox.FlushRedNum(FishData.Inst().BoxRedNum)
    }

    OnClickPass() {
        ViewManager.Inst().OpenView(FishPassView)
    }

    OnClickRank() {
        ViewManager.Inst().OpenView(RankView, { type: 6 })
    }

    OnClickReturn() {
        ViewManager.Inst().CloseView(FishView)
    }

    OnClickBread() {
        ViewManager.Inst().OpenView(FishBreadView)
    }

    OnClickCard() {
        ViewManager.Inst().OpenView(FishCardView)
    }

    OnClickSetting() {
        if (TimeCtrl.Inst().ServerTime > FishData.Inst().InfoFishCardTime) {
            PublicPopupCtrl.Inst().Center(Language.Fish.Main.CardTips)
            return
        }
        ViewManager.Inst().OpenView(FishSettingView)
    }

    OnClickHandbook() {
        ViewManager.Inst().OpenView(FishHandbookView);
    }

    OnClickShop() {
        ViewManager.Inst().OpenView(FishShopView)
    }

    OnClickMap() {
        ViewManager.Inst().OpenView(FishMapView)
    }

    OnClickOrder() {
        ViewManager.Inst().OpenView(FishOrderView);
    }

    OnClickBox() {
        ViewManager.Inst().OpenView(FishBoxView);
    }

    OnClickLevel() {
        ViewManager.Inst().OpenView(FishLevelView);
    }
}

export class FishViewOrderButton extends BaseItemGBCare {
    protected viewNode = {
        ShowList: <fgui.GList>null,
        RedPointShow: <RedPoint>null
    };

    InitData() {
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo", "FlushTaskInfo");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushRedNum.bind(this));
    }

    InitUI() {
        this.FlushInfo()
        this.FlushRedNum()
    }

    FlushInfo() {
        let show_list = FishData.Inst().GetOrderShowList()
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = show_list.length;
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(FishData.Inst().GetOrderShowList()[index]);
    }

    FlushRedNum() {
        this.viewNode.RedPointShow.SetNum(FishData.Inst().GetRedNumOrder())
    }
}

export class FishViewToolItem extends BaseItemCare {
    protected viewNode: { [key: string]: any } = {
        BtnAttr: <fgui.GButton>null,
        BtnBait: <FishViewBaitButton>null,
        BtnTool1: <FishViewRodButton>null,
        BtnTool2: <FishViewToolButton>null,
        BtnTool3: <FishViewToolButton>null,
        BtnTool4: <FishViewToolButton>null,
    };

    InitData() {
        this.viewNode.BtnAttr.onClick(this.OnClickAttr, this);

        this.viewNode.BtnBait.onClick(this.OnClickBait, this);
        this.viewNode.BtnTool1.onClick(this.OnClickTool.bind(this, 1));
        this.viewNode.BtnTool2.onClick(this.OnClickTool.bind(this, 2));
        this.viewNode.BtnTool3.onClick(this.OnClickTool.bind(this, 3));
        this.viewNode.BtnTool4.onClick(this.OnClickTool.bind(this, 4));

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushTool.bind(this), "FlushToolInfo");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushBait.bind(this), "FlushCommonInfo");
        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FlushBait.bind(this), "OtherChange")
        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FlushRedNum.bind(this), "OtherChange")
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushRedNum.bind(this))
    }

    InitUI() {
        this.FlushInfo()
        this.FlushRedNum()

        let fish = FishData.Inst().InfoFish
        if (!ViewManager.Inst().IsOpen(FishGetView) && fish && fish.fishId > 0 && !FishData.Inst().IsAutoFish) {
            ViewManager.Inst().OpenView(FishGetView)
        }
    }

    FlushInfo() {
        this.FlushTool()
        this.FlushBait()
    }

    FlushTool() {
        for (let [key, value] of FishData.Inst().InfoToolInfo.entries()) {
            this.viewNode[`BtnTool${key + 1}`].FlushShow(value, key + 1)
        }
    }

    FlushBait() {
        this.viewNode.BtnBait.FlushShow(FishData.Inst().InfoBaitId)
    }

    FlushRedNum() {
        this.viewNode.BtnTool1.FlushRedNum(1)
        this.viewNode.BtnTool2.FlushRedNum(2)
        this.viewNode.BtnTool3.FlushRedNum(3)
        this.viewNode.BtnTool4.FlushRedNum(4)
    }

    OnClickAttr() {
        ViewManager.Inst().OpenView(FishAttrView);
    }

    OnClickBait() {
        ViewManager.Inst().OpenView(FishBaitView);
    }

    OnClickTool(tool_type: number) {
        FishData.Inst().SelToolType = tool_type
        ViewManager.Inst().OpenView(FishToolView);
    }
}

export class FishViewRodButton extends BaseItemGB {
    protected viewNode = {
        QuaIcon: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        RbTxt: <fgui.GTextField>null,
        RedPointShow: <RedPoint>null,
    };

    FlushShow(info: any, id: number) {
        if (info) {
            if (info.huanHuaId > 0) {
                let co_image = FishData.Inst().CfgToolImageByImageId(info.huanHuaId)
                if (co_image) {
                    UH.SpriteName(this.viewNode.QuaIcon, "Fish", `PinZhi${Item.GetColor(co_image.show_item)}`);
                    UH.SetIcon(this.viewNode.Icon, Item.GetIconId(co_image.show_item), ICON_TYPE.ITEM);
                }
            } else {
                let co_tool = FishData.Inst().CfgToolInfoByIdLevel(id, info.level)
                if (co_tool) {
                    UH.SpriteName(this.viewNode.QuaIcon, "Fish", `PinZhi${Item.GetColor(co_tool.show_item)}`);
                    UH.SetIcon(this.viewNode.Icon, Item.GetIconId(co_tool.show_item), ICON_TYPE.ITEM);
                }
            }
            UH.SetText(this.viewNode.RbTxt, TextHelper.Format(Language.Fish.Tool.LevelShow, info.level))
        }
    }

    FlushRedNum(tool_type: number) {
        this.viewNode.RedPointShow.SetNum(FishData.Inst().GetRedNumToolType(tool_type))
    }
}

export class FishViewToolButton extends BaseItemGB {
    protected viewNode = {
        QuaIcon: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        RbTxt: <fgui.GTextField>null,
        RedPointShow: <RedPoint>null,
    };

    FlushShow(info: any, id: number) {
        if (info) {
            if (info.huanHuaId > 0) {
                let co_image = FishData.Inst().CfgToolImageByImageId(info.huanHuaId)
                if (co_image) {
                    UH.SpriteName(this.viewNode.QuaIcon, "Fish", `PinZhi${Item.GetColor(co_image.show_item)}`);
                    UH.SetIcon(this.viewNode.Icon, Item.GetIconId(co_image.show_item), ICON_TYPE.ITEM);
                }
            } else {
                let co_tool = FishData.Inst().CfgToolInfoByIdLevel(id, info.level)
                if (co_tool) {
                    UH.SpriteName(this.viewNode.QuaIcon, "Fish", `PinZhi${Item.GetColor(co_tool.show_item)}`);
                    UH.SetIcon(this.viewNode.Icon, Item.GetIconId(co_tool.show_item), ICON_TYPE.ITEM);
                }
            }
            UH.SetText(this.viewNode.RbTxt, TextHelper.Format(Language.Fish.Tool.LevelShow, info.level))
        }
    }

    FlushRedNum(tool_type: number) {
        this.viewNode.RedPointShow.SetNum(FishData.Inst().GetRedNumToolType(tool_type))
    }
}

export class FishViewBaitButton extends BaseItemGB {
    protected viewNode = {
        QuaIcon: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        RbTxt: <fgui.GTextField>null,
    };

    FlushShow(bait_id: number) {
        let co_bait = FishData.Inst().CfgBaitInfoByBaitId(bait_id)
        if (co_bait) {
            UH.SpriteName(this.viewNode.QuaIcon, "Fish", `PinZhi${Item.GetColor(co_bait.item_id)}`);
            UH.SetIcon(this.viewNode.Icon, Item.GetIconId(co_bait.item_id), ICON_TYPE.ITEM);
            UH.SetText(this.viewNode.RbTxt, 0 == bait_id ? Language.Fish.Tool.Infinite : BagData.Inst().GetItemNum(co_bait.item_id))
        }
    }
}

export class FishViewBoxButton extends BaseItemGB {
    protected viewNode = {
        UIEffectShow: <UIEffectShow>null,
        RedPointShow: <RedPoint>null,
    };

    protected onConstruct(): void {
        super.onConstruct()

        this.viewNode.UIEffectShow.PlayEff(1208131)
    }

    FlushRedNum(value: number) {
        this.viewNode.RedPointShow.SetNum(value)
    }
}

export class FishViewModButton extends BaseItemGB {
    protected viewNode = {
        RedPointShow: <RedPoint>null,
    };

    FlushRedNum(value: number) {
        this.viewNode.RedPointShow.SetNum(value)
    }
}

export class FishViewOrderItem extends BaseItem {
    protected viewNode = {
        NameShow: <fgui.GTextField>null,
        ProgressShow: <fgui.GTextField>null,
        Gou: <fgui.GImage>null,
        UIEffectShow: <UIEffectShow>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.viewNode.UIEffectShow.PlayEff(1208132)
    }

    SetData(data: any) {
        let co = data.co
        let info = data.info
        if (co) {
            UH.SetText(this.viewNode.NameShow, co.order_name)
            this.viewNode.NameShow.color = GetCfgValue(COLORS, `FishQua${co.order_star}`)
            this.viewNode.Gou.visible = 1 == info.isFetch
            UH.SetText(this.viewNode.ProgressShow, 1 == info.isFetch ? "" : TextHelper.Format(Language.Fish.Order.ProgressShow, info.processNum, co.parm1))
            this.viewNode.UIEffectShow.visible = 0 == info.isFetch && info.processNum >= co.parm1
        }
    }
}

export class FishViewLevelProgress extends BaseItemGP {
    protected viewNode = {
        ProgressShow: <fgui.GTextField>null,
    };

    FlushShow() {
        UH.SetText(this.viewNode.ProgressShow, TextHelper.Format(Language.Fish.Main.LevelProgress, this.value, this.max))
    }
}



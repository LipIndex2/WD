
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { InstituteData } from "modules/Institute/InstituteCtrl";
import { MiningData } from "modules/Mining/MiningData";
import { BagData } from "modules/bag/BagData";
import { BaseItemGL } from "modules/common/BaseItem";
import { BaseView, ViewLayer, viewRegcfg } from 'modules/common/BaseView';
import { Language } from "modules/common/Language";
import { Mod } from "modules/common/ModuleDefine";
import { EGLoader } from 'modules/extends/EGLoader';
import { RedPoint } from "modules/extends/RedPoint";
import { FishData } from "modules/fish/FishData";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { TerritoryData } from "./TerritoryData";
import { TerritoryViewMainPanel, TerritoryViewMainPanelShowItem } from "./TerritoryViewMainPanel";
import { ReportManager, ReportType } from "../../proload/ReportManager";

@BaseView.registView
export class TerritoryView extends BaseView {

    private sp_show_farm: UISpineShow = undefined;
    private sp_show_research: UISpineShow = undefined;
    private sp_show_treasure: UISpineShow = undefined;
    private sp_show_fish: UISpineShow = undefined;
    private sp_show1: UISpineShow = undefined;
    private sp_show2: UISpineShow = undefined;
    private sp_obj1: any = undefined;
    private sp_obj2: any = undefined;

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "Territory",
        ViewName: "TerritoryView",
        LayerType: ViewLayer.ButtomMain,
        ViewCache: true,
    };

    protected viewNode = {
        bg: <EGLoader>null,

        BtnFarm: <fgui.GButton>null,
        BtnResearch: <fgui.GButton>null,
        BtnTreasure: <fgui.GButton>null,
        BtnFish: <fgui.GButton>null,

        NameTreasure: <TerritoryViewMainPanelNameLabel>null,
        NameFarm: <TerritoryViewMainPanelNameLabel>null,
        NameResearch: <TerritoryViewMainPanelNameLabel>null,
        NameFish: <TerritoryViewMainPanelNameLabel>null,

        GpMods: <fgui.GGroup>null,
    };

    protected extendsCfg = [
        { ResName: "TerritoryViewMainPanel", ExtendsClass: TerritoryViewMainPanel },
        { ResName: "ItemShow", ExtendsClass: TerritoryViewMainPanelShowItem },
        { ResName: "LabelName", ExtendsClass: TerritoryViewMainPanelNameLabel },
    ]

    // WindowSizeChange() {
    //     this.refreshBgSize(this.viewNode.bg)
    // }

    DoOpenWaitHandle() {
        this.viewNode.bg.SetIcon("loader/territory/BeiJing")
        this.sp_show_farm = ObjectPool.Get(UISpineShow, ResPath.Spine("huayuan/nongchang_out"), true, (obj: any) => {
            obj.setPosition(0, -463);
            this.viewNode.BtnFarm._container.insertChild(obj, 0);
        });
        this.sp_show_research = ObjectPool.Get(UISpineShow, ResPath.Spine("huayuan/yanjiusuo_out"), true, (obj: any) => {
            obj.setPosition(305, -577);
            this.viewNode.BtnResearch._container.insertChild(obj, 0);
        });
        this.sp_show_treasure = ObjectPool.Get(UISpineShow, ResPath.Spine("huayuan/kuangdong_out"), true, (obj: any) => {
            obj.setPosition(199, -316);
            this.viewNode.BtnTreasure._container.insertChild(obj, 0);
        });
        this.sp_show_fish = ObjectPool.Get(UISpineShow, ResPath.Spine("huayuan/diaoyu_out"), true, (obj: any) => {
            obj.setPosition(313, -529);
            this.viewNode.BtnFish._container.insertChild(obj, 0);
        });
    }

    OpenCallBack() {
        this.viewNode.bg.setSize(this["screenShowSize"].x, this["screenShowSize"].y);
        ReportManager.Inst().sendPoint(ReportType.gameModelInfo, [Mod.Territory.View, 0, 0, RoleData.Inst().InfoRoleId], "mod-" + Mod.Territory.View)
        if (RoleData.Inst().IsGuideNum(7)) {
            GuideCtrl.Inst().Start(7);
            return;
        }
    }

    InitData() {
        this.viewNode.BtnFarm.onClick(this.OnClickFarm, this);
        this.viewNode.BtnResearch.onClick(this.OnClickResearch, this);
        this.viewNode.BtnTreasure.onClick(this.OnClickTreasure, this);
        this.viewNode.BtnFish.onClick(this.OnClickFish, this);

        this.AddSmartDataCare(TerritoryData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo");
        this.AddSmartDataCare(RoleData.Inst().FlushData, this.FlushRoleInfo.bind(this), "FlushRoleInfo");
        this.AddSmartDataCare(BagData.Inst().ItemData, this.FlushResearchRed.bind(this), "OtherChange");
        this.AddSmartDataCare(BagData.Inst().ItemData, this.FlushFishRed.bind(this), "OtherChange");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushFishRed.bind(this));
    }

    InitUI() {
        this.FlushInfo()
        this.FlushRoleInfo()
        this.FlushResearchRed()
        this.FlushFishRed()
    }

    FlushInfo() {
        let is_my_territory = TerritoryData.Inst().IsMyTerritory
        this.viewNode.GpMods.visible = false;

        this.FlushSpObjsShow()
    }

    FlushRoleInfo() {
        this.viewNode.NameTreasure.MaskShow(!FunOpen.Inst().GetFunIsOpen(Mod.Mining.View).is_open)
        // this.viewNode.NameFarm.MaskShow(!FunOpen.Inst().GetFunIsOpen(Mod.Farm.View).is_open)
        this.viewNode.NameFarm.MaskShow(true)
        this.viewNode.NameResearch.MaskShow(!FunOpen.Inst().GetFunIsOpen(Mod.Institute.View).is_open)
        this.viewNode.NameFish.MaskShow(!FunOpen.Inst().GetFunIsOpen(Mod.Fish.View).is_open)
    }

    FlushResearchRed() {
        this.viewNode.NameResearch.RedPoint(InstituteData.Inst().GetRemindNum())
        this.viewNode.NameTreasure.RedPoint(MiningData.Inst().GetRemindNum())
    }

    FlushFishRed() {
        this.viewNode.NameFish.RedPoint(FishData.Inst().GetRedNum())
    }

    FlushSpObjsShow() {
        let is_my_territory = TerritoryData.Inst().IsMyTerritory

        if (!is_my_territory) {
            if (this.sp_obj1) {
                this.sp_obj1.active = !is_my_territory
            } else if (undefined == this.sp_obj1) {
                this.sp_obj1 = 0
                this.sp_show1 = ObjectPool.Get(UISpineShow, ResPath.Spine("huayuan/taren_youxia"), true, (obj: any) => {
                    this.sp_obj1 = obj
                    obj.setPosition(800, -1560);
                    this.view._container.insertChild(obj, 1);
                    this.FlushSpObjsShow()
                });
            }
            if (this.sp_obj2) {
                this.sp_obj2.active = !is_my_territory
            } else if (undefined == this.sp_obj2) {
                this.sp_obj2 = 0
                this.sp_show2 = ObjectPool.Get(UISpineShow, ResPath.Spine("huayuan/taren_shang"), true, (obj: any) => {
                    this.sp_obj2 = obj
                    obj.setPosition(375, 0);
                    this.view._container.insertChild(obj, 1);
                    this.FlushSpObjsShow()
                });
            }
        } else {
            if (this.sp_obj1) {
                this.sp_obj1.active = !is_my_territory
            }
            if (this.sp_obj2) {
                this.sp_obj2.active = !is_my_territory
            }
        }
    }

    OnClickFarm() {
        PublicPopupCtrl.Inst().Center(Language.Common.NotOpenTips2)
        // ViewManager.Inst().OpenViewByKey(Mod.Farm.View)
    }

    OnClickResearch() {
        ViewManager.Inst().OpenViewByKey(Mod.Institute.View)
    }

    OnClickTreasure() {
        ViewManager.Inst().OpenViewByKey(Mod.Mining.View)
    }

    OnClickFish() {
        let isFishtOpen = FunOpen.Inst().GetFunIsOpen(Mod.Fish.View);
        let co = FunOpen.Inst().GetFunOpenModCfg(Mod.Fish.View);
        if (!isFishtOpen.is_open) {
            PublicPopupCtrl.Inst().Center(TextHelper.Format(Language.MainFB.LockShow, co.open_barrier))
            return
        }
        ViewManager.Inst().OpenViewByKey(Mod.Fish.View)
    }
}

class TerritoryViewMainPanelNameLabel extends BaseItemGL {
    protected viewNode = {
        GpMask: <fgui.GGroup>null,
        RedPointShow: <RedPoint>null,
    };

    public MaskShow(visible: boolean) {
        this.viewNode.GpMask.visible = visible
    }

    public RedPoint(num: number) {
        this.viewNode.RedPointShow.SetNum(num)
    }
}
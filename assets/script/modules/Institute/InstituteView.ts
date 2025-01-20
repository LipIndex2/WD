import { CfgInstitute } from "config/CfgInstitute";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { MiningCtrl, MiningReqType } from "modules/Mining/MiningCtrl";
import { AudioTag } from "modules/audio/AudioManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { AdType, CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { Mod } from "modules/common/ModuleDefine";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { EGLoader } from "modules/extends/EGLoader";
import { RedPoint } from "modules/extends/RedPoint";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { DataHelper } from "../../helpers/DataHelper";
import { Format } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { ReportManager, ReportType } from "../../proload/ReportManager";
import { InstituteData, InstituteItemData, InstituteLineData } from "./InstituteCtrl";
import { InstituteFinishView } from "./InstituteFinishView";

@BaseView.registView
export class InstituteView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Institute",
        ViewName: "InstituteView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        List: <fgui.GList>null,
        Instituting: <Instituting>null,
        UpLevelBtn: <fgui.GButton>null,
        SelItemInfo: <InstituteItem>null,
        ItemIcon1: <EGLoader>null,
        ItemNum1: <fgui.GTextField>null,
        ItemIcon2: <EGLoader>null,
        ItemNum2: <fgui.GTextField>null,
        redPoint: <RedPoint>null,

        CurDescLabel: <fgui.GLabel>null,
        NextDescLabel: <fgui.GLabel>null,
        SkillDescLabel: <fgui.GLabel>null,
        UpLevelInfo: <fgui.GGroup>null,
        NextFlag: <fgui.GObject>null,
        UpTimeDesc: <fgui.GTextField>null,
        UpShuZiDi: <fgui.GObject>null,
        SpineShow: <UISpineShow>null,
    };

    protected extendsCfg = [
        { ResName: "InstituteItem", ExtendsClass: InstituteItem },
        { ResName: "InstituteLineItem", ExtendsClass: InstituteLineItem },
        { ResName: "Instituting", ExtendsClass: Instituting }
    ];
    listData: InstituteLineData[];

    InitData() {
        MiningCtrl.Inst().SendReq(MiningReqType.InstituteInfo);
        this.viewNode.SelItemInfo.isShowLine = false;

        this.AddSmartDataCare(InstituteData.Inst().dataInfo, this.FlushPanel.bind(this), "info");
        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FlushInstitute.bind(this), "OtherChange");
        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FlushItemInfo.bind(this), "OtherChange");

        this.viewNode.Board.SetData(new BoardData(this, Language.Institute.Title));

        this.viewNode.UpLevelBtn.onClick(this.OnUpLevelClick, this);

        GuideCtrl.Inst().AddGuideUi("InstituteUpBtn", this.viewNode.UpLevelBtn);
    }

    OpenCallBack() {
        ReportManager.Inst().sendPoint(ReportType.gameModelInfo, [Mod.Institute.View, 0, 0, RoleData.Inst().InfoRoleId], "mod-" + Mod.Institute.View)
        let insId = InstituteData.Inst().GetInstitutingId();
        InstituteData.Inst().SetSelData(InstituteData.Inst().GetItemData(insId));

        this.viewNode.SpineShow.LoadSpine("spine/huayuan/yanjiusuo_in", true);
        this.FlushPanel();

        //this.FlushItemInfo();

        if (RoleData.Inst().IsGuideNum(6)) {
            GuideCtrl.Inst().Start(6);
        }
    }

    CloseCallBack() {
        GuideCtrl.Inst().ClearGuideUi("InstituteUpBtn");
    }

    //检查弹窗
    private lastData: PB_SCInstituteInfo;
    CheckFinishDialog() {
        let curData = InstituteData.Inst().dataInfo.info;
        if (this.lastData == null) {
            this.lastData = curData;
            return;
        }
        if (<number>this.lastData.upTalentTime > 0 && curData.upTalentTime == 0) {
            let data = InstituteData.Inst().GetItemData(this.lastData.upTalentId);
            if (data && data.IsActive()) {
                ViewManager.Inst().OpenView(InstituteFinishView, data.LevelCfg());
            }
        }
        this.lastData = curData;
    }

    FlushPanel() {
        this.CheckFinishDialog();

        this.FlushList();

        let instituteTime = InstituteData.Inst().GetTimestamp();
        this.viewNode.UpLevelInfo.visible = instituteTime == 0;
        this.viewNode.UpLevelBtn.visible = instituteTime == 0;
        this.viewNode.Instituting.visible = instituteTime > 0;
        if (instituteTime == 0) {
            let seldata = InstituteData.Inst().GetSelData();
            this.viewNode.SelItemInfo.SetData(seldata);

            this.viewNode.CurDescLabel.visible = seldata.vo.talent_type != 0;
            this.viewNode.NextDescLabel.visible = seldata.vo.talent_type != 0;
            this.viewNode.SkillDescLabel.visible = seldata.vo.talent_type == 0;
            this.viewNode.NextFlag.visible = seldata.vo.talent_type != 0;

            if (seldata.vo.talent_type == 0) {
                UH.SetText(this.viewNode.SkillDescLabel, seldata.GetCurDesc());
            } else {
                UH.SetText(this.viewNode.CurDescLabel, seldata.GetCurDesc());
                UH.SetText(this.viewNode.NextDescLabel, seldata.GetNextDesc());
            }

            let isFull = seldata.IsFullLevel();
            let isCanCtrl = seldata.IsCanCtrl();
            this.viewNode.UpLevelBtn.visible = !isFull && isCanCtrl;
            this.viewNode.ItemNum2.visible = !isFull && isCanCtrl;
            this.viewNode.ItemIcon2.visible = !isFull && isCanCtrl;
            this.viewNode.UpShuZiDi.visible = !isFull && isCanCtrl;

            UH.SetText(this.viewNode.UpTimeDesc, seldata.GetTimeDesc());
        } else {
            this.FlushInstitute();
        }

        this.FlushItemInfo();

    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    FlushList() {
        let listData = InstituteData.Inst().listItemData;
        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = listData;
        this.viewNode.List.numItems = listData.length;

        let selData = InstituteData.Inst().GetSelData();
        for (let i = 0; i < listData.length; i++) {
            let v = listData[i];
            for (let data of v.datas) {
                if (data.id == selData.id) {
                    this.viewNode.List.scrollToView(i);
                    break;
                }
            }
        }
    }

    FlushInstitute() {
        let time = InstituteData.Inst().GetTimestamp();
        if (time > 0) {
            let id = InstituteData.Inst().GetInstitutingId();
            let data = InstituteData.Inst().GetItemData(id);
            this.viewNode.Instituting.SetData(data);
        }

    }

    FlushItemInfo() {
        let itemNum1 = Item.GetNum(CommonId.RedGem);
        UH.SetText(this.viewNode.ItemNum1, DataHelper.ConverMoney(itemNum1));
        UH.SetIcon(this.viewNode.ItemIcon1, Item.GetIconId(CommonId.RedGem), ICON_TYPE.ITEM);

        let selData = InstituteData.Inst().GetSelData();
        let redNum = 0;
        if (selData) {
            UH.SetText(this.viewNode.ItemNum2, selData.NextLevelCfg().up_item[0].num);
            UH.SetIcon(this.viewNode.ItemIcon2, Item.GetIconId(selData.vo.up_item[0].item_id), ICON_TYPE.ITEM);

            let time = InstituteData.Inst().GetTimestamp();
            if (time < 1 && selData.IsCanCtrl()) {
                let state = InstituteData.Inst().GetStuffState(selData);
                redNum = state > 0 ? 1 : 0;
            }

        }
        this.viewNode.redPoint.SetNum(redNum);
        this.viewNode.redPoint.sortingOrder = 100;
        this.viewNode.UpLevelBtn.grayed = redNum <= 0;
    }

    OnUpLevelClick() {
        let selData = InstituteData.Inst().GetSelData();
        if (selData) {
            let stuffState = InstituteData.Inst().GetStuffState(selData);
            if (stuffState == 0) {
                let itemName = Item.GetName(selData.NextLevelCfg().up_item[0].item_id);
                PublicPopupCtrl.Inst().Center(itemName + Language.Mining.ItemNotTip);
                return
            }
            MiningCtrl.Inst().SendReq(MiningReqType.InstituteUpLevel, selData.id);
        }
    }
}

export class InstituteLineItem extends BaseItem {
    protected _data: InstituteLineData;
    protected viewNode = {
        List: <fgui.GList>null,
    };
    listData: InstituteItemData[];

    public SetData(data: InstituteLineData): void {
        this._data = data;

        this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
        this.listData = data.datas;
        this.viewNode.List.numItems = data.datas.length;
    }
    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }
}


export class InstituteItem extends BaseItem {
    protected _data: InstituteItemData;

    isShowLine: boolean = true;

    protected viewNode = {
        LineL: <fgui.GLoader>null,
        LineR: <fgui.GLoader>null,
        Line: <fgui.GLoader>null,
        Qua: <fgui.GLoader>null,
        Icon: <EGLoader>null,
        SelImg: <fgui.GObject>null,
        MaxImg: <fgui.GObject>null,
        Progress: <fgui.GProgressBar>null,
    };

    protected onConstruct() {
        super.onConstruct();
        this.viewNode.Progress.min = 0;
        this.onClick(this.OnItemClick, this);
    }

    public SetData(data: InstituteItemData): void {
        this._data = data;
        if (this.isShowLine) {
            this.ShowLine();
        }

        UH.SpriteName(this.viewNode.Qua, "CommonAtlas", `PinZhi${data.vo.color}`);
        UH.SetIcon(this.viewNode.Icon, data.vo.res_id, ICON_TYPE.SKILL);
        this.viewNode.MaxImg.visible = data.IsFullLevel();
        this.viewNode.SelImg.visible = this.isShowLine && data == InstituteData.Inst().GetSelData();
        this.viewNode.Progress.max = data.fullLevel;
        this.viewNode.Progress.value = data.level;

        this.grayed = !data.IsCanCtrl();
    }

    ShowLine() {
        let leftLineState = this._data.LeftLine();
        this.viewNode.LineL.visible = leftLineState != null;
        if (this.viewNode.LineL.visible) {
            UH.SpriteName(this.viewNode.LineL, "Institute", leftLineState);
        }

        let rightLineState = this._data.RightLine();
        this.viewNode.LineR.visible = rightLineState != null;
        if (this.viewNode.LineR.visible) {
            UH.SpriteName(this.viewNode.LineR, "Institute", rightLineState);
        }

        let LineState = this._data.Line();
        this.viewNode.Line.visible = LineState != null;
        if (this.viewNode.Line.visible) {
            UH.SpriteName(this.viewNode.Line, "Institute", LineState);
        }
    }

    OnItemClick() {
        if (!this.isShowLine) {
            return;
        }
        if (InstituteData.Inst().GetTimestamp() > 0) {
            PublicPopupCtrl.Inst().Center(Language.Institute.Tip1);
            return;
        }
        // if(!this._data.IsCanCtrl()){
        //     PublicPopupCtrl.Inst().Center(Language.Institute.Tip2);
        //     return;
        // }
        InstituteData.Inst().SetSelData(this._data);
        InstituteData.Inst().FlushInfo();
    }
}


//研究信息
export class Instituting extends BaseItem {
    protected _data: InstituteItemData;

    protected viewNode = {
        Timer: <TimeMeter>null,
        AdBtn: <fgui.GButton>null,
        JumpBtn: <fgui.GButton>null,
        AdNum: <fgui.GTextField>null,
        ItemNum: <fgui.GTextField>null,
        ItemIcon: <EGLoader>null,
        AdTimer: <TimeMeter>null,
    };

    protected onConstruct() {
        super.onConstruct();
        this.viewNode.Timer.SetCallBack(() => {
            MiningCtrl.Inst().SendReq(MiningReqType.InstituteEnd);
        });
        this.viewNode.AdBtn.onClick(this.OnAdClick, this);
        this.viewNode.JumpBtn.onClick(this.OnJumpClick, this);
        this.viewNode.AdTimer.SetCallBack(this.TimeCallback.bind(this));
    }

    public SetData(data: InstituteItemData): void {
        this._data = data;
        this.viewNode.Timer.CloseCountDownTime();
        this.viewNode.Timer.StampTime(InstituteData.Inst().GetTimestamp(), TimeFormatType.TYPE_TIME_0);

        let levelCfg = data.NextLevelCfg();
        UH.SetText(this.viewNode.ItemNum, levelCfg.end_item[0].num);
        UH.SetIcon(this.viewNode.ItemIcon, Item.GetIconId(levelCfg.end_item[0].item_id), ICON_TYPE.ITEM);

        let isCanAD = RoleData.Inst().IsCanAD(AdType.Institute, false);
        this.getController("ad_state").setSelectedIndex(isCanAD ? 1 : 0)

        let adCfg = RoleData.Inst().CfgAdTypeSeq(AdType.Institute);
        let count = adCfg.ad_param - RoleData.Inst().GetTodayAdCount(AdType.Institute);
        UH.SetText(this.viewNode.AdNum, count + "/" + adCfg.ad_param);
        let adTime = RoleData.Inst().GetAdNextFetchTime(AdType.Institute);
        let serverTime = TimeCtrl.Inst().ServerTime;
        this.viewNode.AdTimer.visible = adTime > serverTime;
        if (adTime > serverTime) {
            this.viewNode.AdBtn.title = ""
            this.viewNode.AdTimer.CloseCountDownTime();
            this.viewNode.AdTimer.StampTime(adTime, TimeFormatType.TYPE_TIME_0);
            this.viewNode.AdBtn.grayed = true;
        } else {
            this.viewNode.AdBtn.title = Format(Language.Institute.Text1, CfgInstitute.other[0].ad_end_time)
            this.viewNode.AdBtn.grayed = count <= 0;
        }
    }

    private TimeCallback() {
        MiningCtrl.Inst().SendReq(MiningReqType.InstituteInfo);
    }

    private OnAdClick() {
        if (!RoleData.Inst().IsCanAD(AdType.Institute)) {
            return;
        }
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.Institute), "");
    }

    private OnJumpClick() {
        let levelCfg = this._data.NextLevelCfg();
        let itemId = levelCfg.end_item[0].item_id;
        let num = Item.GetNum(itemId);
        if (num < levelCfg.end_item[0].num) {
            let itemName = Item.GetName(itemId);
            PublicPopupCtrl.Inst().Center(itemName + Language.Mining.ItemNotTip);
            return;
        }

        MiningCtrl.Inst().SendReq(MiningReqType.InstituteJump, this._data.id);
    }
}
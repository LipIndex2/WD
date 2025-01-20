
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { BaseItem, BaseItemCare } from "modules/common/BaseItem";
import { COLORS } from "modules/common/ColorEnum";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { AvatarData } from "modules/extends/AvatarCell";
import { EGLoader } from "modules/extends/EGLoader";
import { HeadItem } from "modules/extends/HeadItem";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RoleData } from "modules/role/RoleData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { Timer } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";
import { DataHelper } from "../../helpers/DataHelper";
import { TextHelper } from "../../helpers/TextHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { UH } from "../../helpers/UIHelper";
import { TerritoryCartView } from "./TerritoryCartView";
import { TerritoryConfig } from "./TerritoryConfig";
import { TerritoryCtrl } from "./TerritoryCtrl";
import { TerritoryData } from "./TerritoryData";
import { TerritoryModGiftView } from "./TerritoryModGiftView";
import { TerritoryNeighbourView } from "./TerritoryNeighbourView";
import { TerritoryRecordView } from "./TerritoryRecordView";
import { TerritoryRefreshView } from "./TerritoryRefreshView";
import { TerritoryRentView } from "./TerritoryRentView";
import { TerritoryResView } from "./TerritoryResView";
import { TerritoryView } from "./TerritoryView";

export class TerritoryViewMainPanel extends BaseItemCare {
    private stateCtrler: fgui.Controller
    private sp_show: UISpineShow = undefined;

    protected viewNode: { [key: string]: any } = {
        ItemShow0: <TerritoryViewMainPanelShowItem>null,
        ItemShow1: <TerritoryViewMainPanelShowItem>null,
        ItemShow2: <TerritoryViewMainPanelShowItem>null,
        ItemShow3: <TerritoryViewMainPanelShowItem>null,
        ItemShow4: <TerritoryViewMainPanelShowItem>null,

        NameShow: <fgui.GTextField>null,
        NumShow: <fgui.GTextField>null,
        HeadShow: <HeadItem>null,

        BtnAdd: <fgui.GButton>null,
        BtnRent: <fgui.GButton>null,
        BtnBack: <fgui.GButton>null,
        BtnNeighbour: <fgui.GButton>null,
        BtnCart: <fgui.GButton>null,
        BtnRecord: <fgui.GButton>null,
        BtnFresh: <fgui.GButton>null,
        BtnModGift: <fgui.GButton>null,
        TimeShow: <TimeMeter>null,
        UISpineShow: <UISpineShow>null,
    };

    InitData() {
        this.stateCtrler = this.getController("StateShow");

        this.viewNode.BtnAdd.onClick(this.OnClickAdd, this);
        this.viewNode.BtnRent.onClick(this.OnClickRent, this);
        this.viewNode.BtnBack.onClick(this.OnClickBack, this);
        this.viewNode.BtnNeighbour.onClick(this.OnClickNeighbour, this);
        this.viewNode.BtnCart.onClick(this.OnClickCart, this);
        this.viewNode.BtnRecord.onClick(this.OnClickRecord, this);
        this.viewNode.BtnFresh.onClick(this.OnClickFresh, this);
        this.viewNode.BtnModGift.onClick(this.OnClickModGift, this);

        this.AddSmartDataCare(TerritoryData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo");
        this.AddSmartDataCare(TerritoryData.Inst().FlushData, this.FlushGiftInfo.bind(this), "FlushGiftInfo");

        GuideCtrl.Inst().AddGuideUi("TerritoryViewBtnCart", this.viewNode.BtnCart);
        GuideCtrl.Inst().AddGuideUi("TerritoryViewBtnNeighbour", this.viewNode.BtnNeighbour);

    }
    InitUI() {
        TerritoryCtrl.Inst().SendTerritoryReqInfo()
        TerritoryCtrl.Inst().SendTerritoryReqOpenUi()

        if (TerritoryData.Inst().FetchReward) {
            TerritoryData.Inst().FetchReward = false
            TerritoryCtrl.Inst().SendTerritoryReqFetchReward()
        }

        this.FlushGiftInfo();

    }

    FlushGiftInfo() {
        let info = TerritoryData.Inst().GiftInfo;
        let config = TerritoryData.Inst().GetGiftCfg(info.giftSeq);
        if (!FunOpen.Inst().checkAudit(1) || !info || !config) {
            // this.viewNode.TimeShow.visible = false;
            this.viewNode.BtnModGift.visible = false;
            // this.viewNode.UISpineShow.onDestroy();
            return;
        }
        let beginTime = TerritoryData.Inst().GiftInfo.beginTime
        if (Number(beginTime) > TimeCtrl.Inst().ServerTime || Number(beginTime) == 0) {
            // this.viewNode.UISpineShow.onDestroy();
        } else {
            // this.viewNode.UISpineShow.LoadSpine(ResPath.Spine("huayuan/lijinglibao_TB"), true);
        }
        this.FlushTimeShow();
    }

    protected onDestroy() {
        super.onDestroy();
        GuideCtrl.Inst().ClearGuideUi("TerritoryViewBtnCart");
        GuideCtrl.Inst().ClearGuideUi("TerritoryViewBtnNeighbour");
    }

    FlushInfo() {
        let show_list = TerritoryData.Inst().InfoItemList

        for (let element of show_list) {
            let item = this.viewNode[`ItemShow${element.index}`]
            if (item) {
                item.SetData(element)
            }
        }

        let role_info = TerritoryData.Inst().InfoRoleInfo
        if (role_info) {
            UH.SetText(this.viewNode.NameShow, DataHelper.BytesToString(role_info.name))
            this.viewNode.HeadShow.SetData(new AvatarData(role_info.headPicId, role_info.level, role_info.headChar, role_info.headFrame))
            this.stateCtrler.selectedIndex = RoleData.Inst().InfoRoleId == role_info.roleId ? 0 : 1
        }
        UH.SetText(this.viewNode.NumShow, `${TerritoryData.Inst().InfoBotNum - TerritoryData.Inst().InfoBotRunNum}/${TerritoryData.Inst().InfoBotNum}`)
    }

    FlushTimeShow() {
        // this.viewNode.TimeShow.CloseCountDownTime()
        // let endtime = TerritoryData.Inst().GiftInfo.endTime
        // let beginTime = TerritoryData.Inst().GiftInfo.beginTime
        // if (Number(beginTime) < TimeCtrl.Inst().ServerTime && Number(endtime) > TimeCtrl.Inst().ServerTime) {
        //     this.viewNode.TimeShow.visible = true;
        //     this.viewNode.BtnModGift.visible = true;
        //     this.viewNode.TimeShow.SetOutline(true, COLORS.Black, 3)
        //     this.viewNode.TimeShow.StampTime(Number(endtime), TimeFormatType.TYPE_TIME_0)
        //     this.viewNode.TimeShow.SetCallBack(this.FlushTimeShow.bind(this))
        // }
        // else {
        //     this.viewNode.TimeShow.visible = false;
        //     this.viewNode.BtnModGift.visible = false;
        //     this.viewNode.TimeShow.SetTime("")
        //     // this.viewNode.UISpineShow.onDestroy();
        //     this.viewNode.TimeShow.CloseCountDownTime()
        // }
    }

    OnClickAdd() {
        ViewManager.Inst().OpenView(TerritoryCartView)
    }

    OnClickRent() {
        ViewManager.Inst().OpenView(TerritoryRentView)
    }

    OnClickBack() {
        TerritoryCtrl.Inst().SendTerritoryReqInfo()
    }

    OnClickNeighbour() {
        ViewManager.Inst().OpenView(TerritoryNeighbourView)
    }

    OnClickCart() {
        ViewManager.Inst().OpenView(TerritoryCartView)
    }

    OnClickRecord() {
        ViewManager.Inst().OpenView(TerritoryRecordView)
    }

    OnClickFresh() {
        ViewManager.Inst().OpenView(TerritoryRefreshView)
    }

    OnClickModGift() {
        // ViewManager.Inst().OpenView(TerritoryModGiftView)
    }
}

export class TerritoryViewMainPanelShowItem extends BaseItem {
    private timer_ct: any

    protected viewNode = {
        bg: <fgui.GImage>null,
        GpShow1: <fgui.GGroup>null,
        GpShow2: <fgui.GGroup>null,
        ArrowShow1: <fgui.GImage>null,
        ArrowShow2: <fgui.GImage>null,
        NumShow1: <fgui.GTextField>null,
        NumShow2: <fgui.GTextField>null,
        HeadShow1: <HeadItem>null,
        HeadShow2: <HeadItem>null,
        BtnRes: <fgui.GButton>null,
        TimeShow: <fgui.GTextField>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.viewNode.BtnRes.onClick(this.OnClickRes, this);
    }

    SetData(data: IPB_SCTerritoryItemNode) {
        super.SetData(data)

        let role_def = TerritoryData.Inst().InfoRoleInfo
        let role_attack = data.attackerInfo
        this.viewNode.GpShow1.visible = data.defenderNum > 0
        this.viewNode.GpShow2.visible = data.attackerNum > 0
        UH.SetText(this.viewNode.NumShow1, data.defenderNum)
        UH.SetText(this.viewNode.NumShow2, data.attackerNum)
        // this.viewNode.ArrowShow1.visible = data.defenderEfficiency > data.attackerEfficiency
        // this.viewNode.ArrowShow2.visible = data.defenderEfficiency < data.attackerEfficiency
        if (data.defenderNum > 0 && role_def) {
            this.viewNode.HeadShow1.SetData(new AvatarData(role_def.headPicId, role_def.level, role_def.headChar, role_def.headFrame))
        }
        if (data.attackerNum > 0 && role_attack) {
            this.viewNode.HeadShow2.SetData(new AvatarData(role_attack.headPicId, role_attack.level, role_attack.headChar, role_attack.headFrame))
        }
        let co = TerritoryData.Inst().GetItemInfoBySeq(data.seq)
        if (co) {
            this.viewNode.BtnRes.icon = EGLoader.IconGeterFuncs[ICON_TYPE.ITEM](co.icon)
            this.viewNode.BtnRes.title = `等级.${co.item_level}`
            this.viewNode.BtnRes.visible = true
            this.viewNode.bg.visible = true
        } else {
            this.viewNode.bg.visible = false
            this.viewNode.BtnRes.visible = false
        }
        this.FlushTimeShow()

        if (2 == data.index) {
            GuideCtrl.Inst().AddGuideUi("TerritoryViewBtnRes3", this.viewNode.BtnRes);
        }
    }

    protected onDestroy() {
        super.onDestroy()

        if (2 == this._data.index) {
            GuideCtrl.Inst().ClearGuideUi("TerritoryViewBtnRes3")
        }
    }

    FlushTimeShow(is_end = false) {
        let data = this._data
        Timer.Inst().CancelTimer(this.timer_ct)
        UH.SetText(this.viewNode.TimeShow, "")
        let fight_time = data.endTime - TimeCtrl.Inst().ServerTime
        let pass_time = 0
        let pos_def = TerritoryConfig.PosDef[data.index]
        let pos_attack = TerritoryConfig.PosAttack[data.index]
        let pos_from = [(pos_attack[0] - pos_def[0]) * data.pos / TerritoryData.Inst().CfgOtherGridMax + pos_def[0], (pos_attack[1] - pos_def[1]) * data.pos / TerritoryData.Inst().CfgOtherGridMax + + pos_def[1]]
        if (!is_end) {
            this.x = pos_from[0]
            this.y = pos_from[1]
        }
        if (fight_time > 0) {
            let pos_to = (data.defenderEfficiency ?? 0) > (data.attackerEfficiency ?? 0) ? pos_def : pos_attack
            this.timer_ct = Timer.Inst().AddCountDownCT(() => {
                let ft = TimeHelper.FormatDHMS(fight_time - pass_time);
                UH.SetText(this.viewNode.TimeShow, TextHelper.Format(Language.UiTimeMeter.TimeStr1, ft.hour, ft.minute, ft.second))
                this.x = pos_from[0] + (pos_to[0] - pos_from[0]) * (pass_time) / fight_time
                this.y = pos_from[1] + (pos_to[1] - pos_from[1]) * (pass_time) / fight_time
                pass_time++
            }, this.FlushTimeShow.bind(this, data, true), data.endTime, 1)
        } else if (is_end) {
            TerritoryCtrl.Inst().SendTerritoryReqInfo()
            if (ViewManager.Inst().IsOpen(TerritoryView)) {
                TerritoryCtrl.Inst().SendTerritoryReqFetchReward()
            } else {
                TerritoryData.Inst().FetchReward = true
            }
        }
    }

    OnClickRes() {
        let data = this._data
        if (data) {
            if (!TerritoryData.Inst().IsMyTerritory && data.attackerNum > 0) {
                let role_attack = data.attackerInfo
                if (role_attack && role_attack.roleId != RoleData.Inst().InfoRoleId) {
                    PublicPopupCtrl.Inst().Center(Language.Territory.Res.LootingTips)
                    return
                }
            }
            ViewManager.Inst().OpenView(TerritoryResView, this._data)
        }
    }
}
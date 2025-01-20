
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { ItemInfoView } from "modules/ItemInfo/ItemInfoView";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { AvatarData } from "modules/extends/AvatarCell";
import { EGLoader } from "modules/extends/EGLoader";
import { HeadItem } from "modules/extends/HeadItem";
import { TimeMeter } from "modules/extends/TimeMeter";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { RoleData } from "modules/role/RoleData";
import { Timer } from "modules/time/Timer";
import { TextHelper } from "../../helpers/TextHelper";
import { TimeHelper } from "../../helpers/TimeHelper";
import { UH } from "../../helpers/UIHelper";
import { TerritoryCartView } from "./TerritoryCartView";
import { TerritoryCtrl } from "./TerritoryCtrl";
import { TerritoryData } from "./TerritoryData";

@BaseView.registView
export class TerritoryResView extends BaseView {
    private res_info: IPB_SCTerritoryItemNode
    private cur_num: number
    private max_num: number
    private limit_num: number

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "TerritoryRes",
        ViewName: "TerritoryResView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,

        BtnGather: <fgui.GButton>null,
        BtnCart: <fgui.GButton>null,
        BtnAdd: <fgui.GButton>null,
        BtnSub: <fgui.GButton>null,
        BtnMax: <fgui.GButton>null,
        BtnMin: <fgui.GButton>null,

        IconSp: <fgui.GLoader>null,
        CurNum: <fgui.GTextField>null,
        ResNum: <fgui.GTextField>null,
        CartNum: <fgui.GTextField>null,
        EmptyNum: <fgui.GTextField>null,
        NumShow: <fgui.GTextField>null,

        GpTime: <fgui.GGroup>null,
        GpNum: <fgui.GGroup>null,
        TimeShow: <TimeMeter>null,

        ItemShow: <TerritoryResViewShowItem>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: TerritoryResViewShowItem },
    ]

    InitData(param: IPB_SCTerritoryItemNode) {
        this.viewNode.Board.SetData(new BoardData(TerritoryResView));

        this.viewNode.BtnGather.onClick(this.OnClickGather, this);
        this.viewNode.BtnCart.onClick(this.OnClickCart, this);
        this.viewNode.BtnAdd.onClick(this.OnClickAdd, this);
        this.viewNode.BtnSub.onClick(this.OnClickSub, this);
        this.viewNode.BtnMax.onClick(this.OnClickMax, this);
        this.viewNode.BtnMin.onClick(this.OnClickMin, this);
        this.viewNode.IconSp.onClick(this.OnClickIcon, this);

        this.res_info = param
        let is_my_territory = TerritoryData.Inst().IsMyTerritory
        this.cur_num = is_my_territory ? param.defenderNum : param.attackerNum
        this.max_num = TerritoryData.Inst().InfoBotNum - TerritoryData.Inst().InfoBotRunNum + this.cur_num
        this.limit_num = 0

        GuideCtrl.Inst().AddGuideUi("TerritoryResViewBtnGather", this.viewNode.BtnGather);
    }

    InitUI() {
        this.FlushShow()
        this.FlushNum()
    }

    CloseCallBack() {
        GuideCtrl.Inst().ClearGuideUi("TerritoryResViewBtnGather");

        if (RoleData.Inst().IsGuideNum(8)) {
            Timer.Inst().AddRunFrameTimer(() => {
                GuideCtrl.Inst().Start(8);
            }, 1, 1, false)
        }
    }

    FlushShow() {
        let co = TerritoryData.Inst().GetItemInfoBySeq(this.res_info.seq)
        if (co) {
            this.limit_num = co.max_monster
            this.max_num = Math.min(this.max_num, this.limit_num)
            if (this.max_num > 0) {
                this.cur_num = Math.max(1, this.cur_num)
            }
            this.viewNode.EmptyNum.visible = 0 == this.max_num
            this.viewNode.GpNum.visible = this.max_num > 0
            this.viewNode.BtnGather.title = this.max_num > 0 ? Language.Territory.Res.BtnGather : Language.Territory.Res.BtnConfirm
            UH.SetIcon(this.viewNode.IconSp, Item.GetIconId(co.item_id), ICON_TYPE.ITEM)
            UH.SetText(this.viewNode.ResNum, co.item_num)
            UH.SetText(this.viewNode.CartNum, TextHelper.Format(Language.Territory.Res.CartNum, this.limit_num))
        }
        UH.SetText(this.viewNode.NumShow, `${TerritoryData.Inst().InfoBotNum - TerritoryData.Inst().InfoBotRunNum}/${TerritoryData.Inst().InfoBotNum}`)
    }

    FlushNum() {
        UH.SetText(this.viewNode.CurNum, `${this.cur_num}/${this.max_num}`)
        this.viewNode.ItemShow.SetData(this.res_info, this.cur_num)

        if (this.cur_num > 0) {
            let co_item = TerritoryData.Inst().GetItemInfoBySeq(this.res_info.seq)
            let co_eff = TerritoryData.Inst().GetMonsterEfficiencyInfoByRewardCount()
            let final_speed = (co_item.speed + (this.cur_num - 1) * co_item.myself_decrease_time) * co_eff.efficiency / 100
            let dis = this.res_info.pos
            if (!TerritoryData.Inst().IsMyTerritory) {
                final_speed = (co_item.speed + (this.cur_num - 1) * co_item.enemy_decrease_time) * co_eff.efficiency / 100
                dis = TerritoryData.Inst().CfgOtherGridMax - dis
                this.viewNode.ItemShow.ArrowShow(-1)
            } else {
                this.viewNode.ItemShow.ArrowShow(1)
            }
            let time = dis / final_speed
            let time_t = TimeHelper.FormatDHMS(time);
            this.viewNode.TimeShow.SetTime(TextHelper.Format(Language.UiTimeMeter.TimeStr2, this.D2(time_t.hour + (time_t.day * 24)), this.D2(time_t.minute), this.D2(time_t.second)))

        }
        this.viewNode.GpTime.visible = this.cur_num > 0
    }

    private D2(value: number): string {
        return value < 10 ? "0" + value.toString() : value.toString();
    }

    OnClickGather() {
        ViewManager.Inst().CloseView(TerritoryResView)
        if (this.max_num > 0) {
            TerritoryCtrl.Inst().SendTerritoryReqFetchItem(TerritoryData.Inst().InfoRoleInfo.roleId, this.res_info.index, this.cur_num)
        }
    }

    OnClickAdd() {
        if (this.cur_num < this.max_num) {
            this.cur_num++
            this.FlushNum()
        }
    }

    OnClickSub() {
        if (this.cur_num > 0) {
            this.cur_num--
            this.FlushNum()
        }
    }

    OnClickMax() {
        this.cur_num = this.max_num
        this.FlushNum()
    }

    OnClickMin() {
        this.cur_num = 0
        this.FlushNum()
    }

    OnClickCart() {
        ViewManager.Inst().CloseView(TerritoryResView)
        ViewManager.Inst().OpenView(TerritoryCartView)
    }

    OnClickIcon() {
        let co = TerritoryData.Inst().GetItemInfoBySeq(this.res_info.seq)
        if (co) {
            ViewManager.Inst().OpenView(ItemInfoView, Item.Create({ itemId: co.item_id }, { is_num: false }));
        }
    }
}

export class TerritoryResViewShowItem extends BaseItem {
    protected viewNode = {
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
    }

    SetData(data: IPB_SCTerritoryItemNode, cur_num = 0) {
        super.SetData(data)
        let is_my_territory = TerritoryData.Inst().IsMyTerritory
        let defenderNum = is_my_territory ? cur_num : data.defenderNum
        let attackerNum = is_my_territory ? data.attackerNum : cur_num
        let role_def = TerritoryData.Inst().InfoRoleInfo
        let role_attack = is_my_territory ? RoleData.Inst().InfoRoleInfo : data.attackerInfo
        this.viewNode.GpShow1.visible = defenderNum > 0
        this.viewNode.GpShow2.visible = attackerNum > 0
        UH.SetText(this.viewNode.NumShow1, defenderNum)
        UH.SetText(this.viewNode.NumShow2, attackerNum)
        if (defenderNum > 0 && role_def) {
            this.viewNode.HeadShow1.SetData(new AvatarData(role_def.headPicId, role_def.level, role_def.headChar, role_def.headFrame))
        }
        if (attackerNum > 0 && role_attack) {
            this.viewNode.HeadShow2.SetData(new AvatarData(role_attack.headPicId, role_attack.level, role_attack.headChar, role_attack.headFrame))
        }
        let co = TerritoryData.Inst().GetItemInfoBySeq(data.seq)
        if (co) {
            this.viewNode.BtnRes.icon = EGLoader.IconGeterFuncs[ICON_TYPE.ITEM](co.icon)
            this.viewNode.BtnRes.title = `等级.${co.item_level}`
            this.viewNode.BtnRes.visible = true
        } else {
            this.viewNode.BtnRes.visible = false
        }
    }

    ArrowShow(state: number) {
        // this.viewNode.ArrowShow1.visible = state > 0
        // this.viewNode.ArrowShow2.visible = state < 0
    }
}

import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { AvatarData } from "modules/extends/AvatarCell";
import { CurrencyShow } from "modules/extends/Currency";
import { HeadItem } from "modules/extends/HeadItem";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { RoleData } from "modules/role/RoleData";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { DataHelper } from "../../helpers/DataHelper";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { TerritoryCtrl } from "./TerritoryCtrl";
import { TerritoryData } from "./TerritoryData";

@BaseView.registView
export class TerritoryCartView extends BaseView {
    showItem: any[] = [];

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "TerritoryCart",
        ViewName: "TerritoryCartView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode: { [key: string]: any } = {
        Board: <CommonBoard2>null,

        PowerShow: <fgui.GTextField>null,
        CartNum: <fgui.GTextField>null,
        ProgressShow: <fgui.GProgressBar>null,
        BtnBuy: <fgui.GButton>null,

        CostIcon: <fgui.GLoader>null,
        CostNum: <fgui.GRichTextField>null,

        CartState1: <fgui.GComponent>null,
        CartState2: <fgui.GComponent>null,
        CartState3: <fgui.GComponent>null,
        CartState4: <fgui.GComponent>null,

        CurrencyShow: <CurrencyShow>null,

        GpEmpty: <fgui.GGroup>null,
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: TerritoryCartViewShowItem },
    ]
    bot_list: IPB_SCTerritoryBotNode[];

    InitData() {
        this.viewNode.Board.SetData(new BoardData(TerritoryCartView));

        this.viewNode.BtnBuy.onClick(this.OnClickBuy, this);

        let co_item = TerritoryData.Inst().GetItemInfoByItemId(TerritoryData.Inst().CfgOtherBugMonsterItem)
        if (co_item) {
            this.viewNode.CurrencyShow.SetCurrency(TerritoryData.Inst().CfgOtherBugMonsterItem, true, co_item.icon);
        }

        this.AddSmartDataCare(TerritoryData.Inst().FlushData, this.FlushInfo.bind(this), "FlushInfo");
        this.AddSmartDataCare(TerritoryData.Inst().FlushData, this.FlushBotInfo.bind(this), "FlushBotInfo");

        TerritoryCtrl.Inst().SendTerritoryReqBotStatus()

        GuideCtrl.Inst().AddGuideUi("TerritoryCartViewBtnBuy", this.viewNode.BtnBuy);
    }

    InitUI() {
        this.FlushShow()
        this.FlushInfo()
        // this.FlushBotInfo()
    }

    CloseCallBack() {
        GuideCtrl.Inst().ClearGuideUi("TerritoryCartViewBtnBuy");

        if (RoleData.Inst().IsGuideNum(9)) {
            GuideCtrl.Inst().Start(9);
            return;
        }
    }

    FlushShow() {
        let eff_list = TerritoryData.Inst().GetMonsterEffList()
        let max_num = TerritoryData.Inst().CfgOtherMaxNum
        for (let element of eff_list) {
            if (this.viewNode[`CartState${element.seq}`]) {
                this.viewNode[`CartState${element.seq}`].x = 616 - (616 - 78) * (max_num - element.num) / max_num
            }
        }
    }

    FlushInfo() {
        let info = TerritoryData.Inst().Info
        if (info) {
            UH.SetText(this.viewNode.PowerShow, TextHelper.Format(Language.Territory.Cart.PowerShow, TerritoryData.Inst().InfoRewardCount, TerritoryData.Inst().CfgOtherMaxNum))
            UH.SetText(this.viewNode.CartNum, `${TerritoryData.Inst().InfoBotNum - TerritoryData.Inst().InfoBotRunNum}/${TerritoryData.Inst().InfoBotNum}`)

            this.viewNode.ProgressShow.value = TerritoryData.Inst().InfoRewardCount
            this.viewNode.ProgressShow.max = TerritoryData.Inst().CfgOtherMaxNum

            let co_item = TerritoryData.Inst().GetItemInfoByItemId(TerritoryData.Inst().CfgOtherBugMonsterItem)
            if (co_item) {
                UH.SetIcon(this.viewNode.CostIcon, co_item.icon, ICON_TYPE.ITEM)
            }
            let co_monster = TerritoryData.Inst().GetBuyMonsterInfo()
            if (co_monster) {
                UH.SetText(this.viewNode.CostNum, `x${co_monster.bug_price}`)
            }
        }
    }

    FlushBotInfo() {
        let bot_list = TerritoryData.Inst().BotInfoBotList
        let is_empty = 0 == bot_list.length
        this.viewNode.GpEmpty.visible = is_empty
        this.viewNode.ShowList.visible = !is_empty

        if (!is_empty) {
            this.bot_list = bot_list;
            this.viewNode.ShowList.itemRenderer = this.rendererItem.bind(this);
            this.viewNode.ShowList.numItems = bot_list.length;
        }
    }

    private rendererItem(index: number, item: TerritoryCartViewShowItem) {
        item.SetData(this.bot_list[index]);
    }

    OnClickBuy() {
        TerritoryCtrl.Inst().SendTerritoryReqBuy()
    }
}

export class TerritoryCartViewShowItem extends BaseItem {
    protected viewNode = {
        IconSp: <fgui.GLoader>null,
        LevelShow: <fgui.GTextField>null,
        NameShow: <fgui.GTextField>null,
        NumShow1: <fgui.GTextField>null,
        NumShow2: <fgui.GTextField>null,
        ArrowShow1: <fgui.GImage>null,
        ArrowShow2: <fgui.GImage>null,
        HeadShow1: <HeadItem>null,
        HeadShow2: <HeadItem>null,
        GpDef: <fgui.GGroup>null,
        GpAttack: <fgui.GGroup>null,
        BtnBack: <fgui.GButton>null,
        TimeShow: <TimeMeter>null,
    };

    protected onConstruct() {
        super.onConstruct()

        this.viewNode.BtnBack.onClick(this.OnClickBack, this);
        this.viewNode.TimeShow.SetOutline(true, COLORS.Brown, 3)
    }

    SetData(data: IPB_SCTerritoryBotNode) {
        super.SetData(data)

        let co = TerritoryData.Inst().GetItemInfoBySeq(data.itemSeq)
        if (co) {
            UH.SetIcon(this.viewNode.IconSp, co.icon, ICON_TYPE.ITEM)
            UH.SetText(this.viewNode.LevelShow, `等级.${co.item_level}`)
        }
        if (data.attackerInfo) {
        }
        this.viewNode.GpDef.visible = data.defenderNum > 0
        this.viewNode.GpAttack.visible = data.attackerNum > 0
        if (data.defenderNum > 0) {
            this.viewNode.HeadShow1.SetData(new AvatarData(data.defenderInfo.headPicId, data.defenderInfo.level, data.defenderInfo.headChar, data.defenderInfo.headFrame))
            UH.SetText(this.viewNode.NumShow1, data.defenderNum)
        }
        if (data.attackerNum > 0) {
            this.viewNode.HeadShow2.SetData(new AvatarData(data.attackerInfo.headPicId, data.attackerInfo.level, data.attackerInfo.headChar, data.attackerInfo.headFrame))
            UH.SetText(this.viewNode.NumShow2, data.attackerNum)
        }
        UH.SetText(this.viewNode.NameShow, TextHelper.Format(Language.Territory.Cart.NameShow, RoleData.Inst().InfoRoleId == data.defenderInfo.roleId ? Language.Territory.Cart.Me : DataHelper.BytesToString(data.defenderInfo.name)))
        // this.viewNode.ArrowShow1.visible = !data.isAttack
        // this.viewNode.ArrowShow2.visible = data.isAttack
        this.FlushTimeShow()
    }

    FlushTimeShow() {
        this.viewNode.TimeShow.CloseCountDownTime()
        if (this._data.endTime > TimeCtrl.Inst().ServerTime) {
            this.viewNode.TimeShow.StampTime(this._data.endTime, TimeFormatType.TYPE_TIME_0)
            this.viewNode.TimeShow.SetCallBack(() => {
                TerritoryCtrl.Inst().SendTerritoryReqBotStatus()
            })
        }
        else {
            this.viewNode.TimeShow.SetTime("")
        }
    }

    OnClickBack() {
        TerritoryCtrl.Inst().SendTerritoryReqFetchItem(this._data.defenderInfo.roleId, this._data.itemIndex, 0)
        TerritoryCtrl.Inst().SendTerritoryReqBotStatus()
    }

    protected onDestroy() {
        super.onDestroy()
        this.viewNode.TimeShow.CloseCountDownTime()
    }
}
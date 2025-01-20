import { WECHAT, DEBUG } from "cc/env";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseItem, BaseItemGB } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { CommonEvent } from "modules/common/CommonEvent";
import { EventCtrl } from "modules/common/EventCtrl";
import { Language } from 'modules/common/Language';
import { ChannelAgent } from "../../proload/ChannelAgent";
import { GameCircleCtrl } from "./GameCircleCtrl";
import { GameCircleData } from "./GameCircleData";
import { ItemCell } from "modules/extends/ItemCell";
import { Item } from "modules/bag/ItemData";
import { GetCfgValue } from "config/CfgCommon";
import { UH } from "../../helpers/UIHelper";
import { AudioTag } from "modules/audio/AudioManager";
import { RoleCtrl } from "modules/role/RoleCtrl";
import { TYPE_TIMER, Timer } from "modules/time/Timer";

@BaseView.registView
export class GameCircleView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "GameCircle",
        ViewName: "GameCircleView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    private tabList = [
        { titleName: Language.GameCircle.Title[0] },
        { titleName: Language.GameCircle.Title[1] },
        { titleName: Language.GameCircle.Title[2] },
    ]

    protected viewNode = {
        Name: <fgui.GTextField>null,
        ItemList: <fgui.GList>null,
        TabList: <fgui.GList>null,
        BtnReward: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
        BtnGame: <fgui.GButton>null,
        SignInPanel: <SignInPanel>null,
    };

    protected extendsCfg = [
        { ResName: "SignInPanel", ExtendsClass: SignInPanel },
        { ResName: "SignInItem", ExtendsClass: SignInItem },
        { ResName: "ButtonTab", ExtendsClass: ButtonTab },
    ];
    private stateCtrler: fgui.Controller
    private newItem: any
    InitData() {
        this.stateCtrler = this.view.getController("stateShow");

        this.AddSmartDataCare(GameCircleData.Inst().FlushData, this.FlushView.bind(this), "FlushInfo");
        EventCtrl.Inst().on(CommonEvent.TIME_ZERO, this.OnFulshTimeZero, this);
        EventCtrl.Inst().on(CommonEvent.ON_SHOW, this.onShow, this)

        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnGame.onClick(this.OnClickGame, this);
        this.viewNode.BtnReward.onClick(this.OnClickReward, this);

        this.viewNode.TabList.on(fgui.Event.CLICK_ITEM, this.OnClickListItem, this);
        this.viewNode.TabList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.TabList.numItems = this.tabList.length;
        this.viewNode.TabList.selectedIndex = 0;

        this.viewNode.ItemList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ItemList.setVirtual();
        this.OnFulshTimeZero();
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.tabList[index]);
    }

    private _ht_checkWxGameData: TYPE_TIMER;
    private onShow() {
        if (this._ht_checkWxGameData) {
            Timer.Inst().CancelTimer(this._ht_checkWxGameData);
            this._ht_checkWxGameData = undefined;
        }
        this._ht_checkWxGameData = Timer.Inst().AddRunTimer(() => {
            if (this._ht_checkWxGameData) {
                Timer.Inst().CancelTimer(this._ht_checkWxGameData);
                this._ht_checkWxGameData = undefined;
            }
            this.OnFulshTimeZero();
        }, 3, 1, false);
    }

    FlushView() {
        this.viewNode.SignInPanel.FlushView()

        const num = GameCircleData.Inst().InfoLikeCount
        this.viewNode.BtnReward.grayed = GameCircleData.Inst().InfoNewReward || num < 2
        this.viewNode.BtnReward.title = GameCircleData.Inst().InfoNewReward ? Language.ActCommon.YiLingQu : Language.ActCommon.LingQu;
    }

    InitUI() {
        this.newItem = GameCircleData.Inst().CfgNewItemCfg()
        this.viewNode.ItemList.numItems = this.newItem.length

        this.FlushView();
    }

    private renderListItem(index: number, item: ItemCell) {
        item.SetData(Item.Create(this.newItem[index], { is_num: true }));
    }

    OnFulshTimeZero() {
        GameCircleCtrl.Inst().SendGameCircleReqInfo();
    }

    OnClickReward() {
        if (GameCircleData.Inst().InfoNewReward) return
        const num = GameCircleData.Inst().InfoLikeCount
        if (num >= 2) {
            GameCircleCtrl.Inst().SendNewReward();
        }
    }

    OnClickListItem() {
        this.stateCtrler.selectedIndex = this.viewNode.TabList.selectedIndex;
    }

    /**微信游戏圈按钮 */
    private wx_gameGroup: { show: Function, destroy: Function, hide: Function, onTap: Function }
    OpenCallBack(): void {
        if (WECHAT && this.viewNode.BtnGame.visible && ChannelAgent.wx) {

        } else if (!DEBUG) {
            this.viewNode.BtnGame.visible = false;
        }

        RoleCtrl.Inst().checkWxGameData(1, Language.BreakLIne.tipGame);
    }

    protected onShowEnd(): void {
        if (WECHAT && this.viewNode.BtnGame.visible && ChannelAgent.wx) {
            let btn = this.wx_gameGroup = ChannelAgent.Inst().getWeChatGameHubBtn(this.viewNode.BtnGame);
            EventCtrl.Inst().on(CommonEvent.VIEW_OPEN, this.onCheckViewOpen, this, false);
            EventCtrl.Inst().on(CommonEvent.VIEW_CLOSE, this.onCheckViewClose, this, false);
            if (btn) {
                btn.onTap(() => {
                    RoleCtrl.Inst().checkWxGameData(0);
                })
                btn.show();
            }
        }
    }

    private onCheckViewOpen() {
        let btn = this.wx_gameGroup;
        if (!ViewManager.Inst().IsTopView(GameCircleView) && btn)
            btn.hide();
    }

    private onCheckViewClose() {
        let btn = this.wx_gameGroup;
        if (btn && ViewManager.Inst().IsTopView(GameCircleView))
            btn.show();
    }

    CloseCallBack(): void {
        EventCtrl.Inst().off(CommonEvent.VIEW_OPEN, this.onCheckViewOpen, this);
        EventCtrl.Inst().off(CommonEvent.VIEW_CLOSE, this.onCheckViewClose, this);
        EventCtrl.Inst().off(CommonEvent.ON_SHOW, this.onShow, this)

        if (this._ht_checkWxGameData) {
            Timer.Inst().CancelTimer(this._ht_checkWxGameData);
            this._ht_checkWxGameData = undefined;
        }
        if (this.wx_gameGroup) {
            this.wx_gameGroup.destroy();
            this.wx_gameGroup = undefined;
        }
    }

    OnClickGame() {

    }
}

class SignInPanel extends BaseItem {
    protected viewNode = {
        ShowList: <fgui.GList>null,
        ProgressBar4: <fgui.GProgressBar>null,
        ProgressBar3: <fgui.GProgressBar>null,
        ProgressBar2: <fgui.GProgressBar>null,
        ProgressBar1: <fgui.GProgressBar>null,
        BarMinDay: <fgui.GTextField>null,
        Day: <fgui.GTextField>null,
    };

    private itemRenderer(index: number, item: any) {
        item.SetData(GameCircleData.Inst().CfgSignInCfg()[index]);
    }

    FlushView() {
        const cfg = GameCircleData.Inst().CfgSignInCfg();
        const day = GameCircleData.Inst().InfoSignCount;
        this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
        this.viewNode.ShowList.numItems = cfg.length;

        UH.SetText(this.viewNode.BarMinDay, cfg[0].day)
        UH.SetText(this.viewNode.Day, Language.GameCircle.day + day)

        for (let i = 1; i <= 4; i++) {
            const node = GetCfgValue(this.viewNode, "ProgressBar" + i)
            node.max = cfg[i].day
            node.value = day
            node.min = (cfg[i - 1] && cfg[i - 1].day) || 0
        }
    }
}

class SignInItem extends BaseItem {
    protected viewNode = {
        ItemCell: <ItemCell>null,
        Day: <fgui.GTextField>null,
    };
    public SetData(data: any) {
        super.SetData(data);
        this.viewNode.ItemCell.SetData(Item.Create(data.item[0], { is_num: true }));
        UH.SetText(this.viewNode.Day, data.day)
    }
}

class ButtonTab extends BaseItemGB {
    protected viewNode = {
        TitleUp: <fgui.GTextField>null,
        TitleDown: <fgui.GTextField>null,
    };
    public SetData(data: any) {
        super.SetData(data);
        UH.SetText(this.viewNode.TitleUp, data.titleName)
        UH.SetText(this.viewNode.TitleDown, data.titleName)
    }
}
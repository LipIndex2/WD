import { Vec2, isValid } from 'cc';
import { HandleCollector } from 'core/HandleCollector';
import { ObjectPool } from 'core/ObjectPool';
import { RemindGroupMonitor, SMDHandle } from 'data/HandleCollectorCfg';
import * as fgui from "fairygui-cc";
import { ModManger } from 'manager/ModManger';
import { ViewManager } from "manager/ViewManager";
import { LoseTempleCtrl } from 'modules/LoseTemple/LoseTempleCtrl';
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { COLORS } from 'modules/common/ColorEnum';
import { CommonId } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { DevilWarOrderData } from 'modules/devil_warorder/DevilWarorderData';
import { DevilWarorderView } from 'modules/devil_warorder/DevilWarorderView';
import { CurrencyShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { RedPoint } from 'modules/extends/RedPoint';
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { HeroData } from 'modules/hero/HeroData';
import { RemindCtrl } from 'modules/remind/RemindCtrl';
import { UISpineShow } from 'modules/scene_obj_spine/UISpineShow';
import { TimeCtrl } from 'modules/time/TimeCtrl';
import { Timer } from 'modules/time/Timer';
import { ResPath } from 'utils/ResPath';
import { CocHighPerfList } from '../../ccomponent/CocHighPerfList';
import { TextHelper } from '../../helpers/TextHelper';
import { UH } from '../../helpers/UIHelper';
import { BaseItemGB } from './../common/BaseItem';
import { LoseTempleAchievementView } from "./LoseTempleAchievementView";
import { LoseTempleBonfireView } from './LoseTempleBonfireView';
import { LoseTempleCombatView } from './LoseTempleCombatView';
import { LoseTempleData, LostCellType } from './LoseTempleData';
import { LoseTempleMerchantView } from "./LoseTempleMerchantView";
import { LoseTempleRemainsBoxView } from './LoseTempleRemainsBoxView';
import { LoseTempleRemainsView } from "./LoseTempleRemainsView";
import { LoseTempleTavernView } from './LoseTempleTavernView';
import { LoseTempleTeamView } from "./LoseTempleTeamView";
import { UtilHelper } from '../../helpers/UtilHelper';

@BaseView.registView
export class LoseTempleView extends BaseView {

    private mysteriousBtnShowing = false;
    private timer_rt: any

    protected viewRegcfg = {
        UIPackName: "LoseTemple",
        ViewName: "LoseTempleView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        bg: <EGLoader>null,

        Currency1: <CurrencyShow>null,
        Currency2: <CurrencyShow>null,
        Currency3: <CurrencyShow>null,
        Currency4: <CurrencyShow>null,

        Energy: <fgui.GTextField>null,
        TierNum: <fgui.GTextField>null,
        timer: <TimeMeter>null,
        BtnList: <fgui.GList>null,
        HeroList: <fgui.GList>null,
        MapList: <fgui.GList>null,
        BtnTeam: <fgui.GButton>null,
        BtnRemains: <fgui.GButton>null,
        BtnClose: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "LoseTempleMap", ExtendsClass: LoseTempleMap },
        { ResName: "MapItem", ExtendsClass: MapItem },
        { ResName: "BtnItem", ExtendsClass: BtnItem },
    ];
    listDataMap: number[];
    listDataBtn: { type: number; index: number; endTime: number; mod_key: number; effect: string; }[];
    listDataHero: number[];

    InitData() {
        this.viewNode.MapList._container.addComponent(CocHighPerfList);
        this.viewNode.HeroList._container.addComponent(CocHighPerfList);
        this.viewNode.BtnTeam._container.addComponent(CocHighPerfList);

        this.viewNode.Currency1.SetCurrency(CommonId.Gold);
        this.viewNode.Currency2.SetCurrency(CommonId.Diamond);
        this.viewNode.Currency3.SetCurrency(CommonId.TempleIntegral);
        this.viewNode.Currency4.SetCurrency(CommonId.WeekIntegral);

        this.AddSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushData.bind(this), "FlushInfo");
        this.AddSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushSlideShow.bind(this), "slideShowFlush");
        this.AddSmartDataCare(DevilWarOrderData.Inst().FlushData, this.FlushData.bind(this), "act_status");
        this.AddSmartDataCare(HeroData.Inst().ResultData, this.FlushHeroListData.bind(this), "heroInfoFlush");

        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnTeam.onClick(this.OnClickTeam, this);
        this.viewNode.BtnRemains.onClick(this.OnClickRemains, this);

        this.viewNode.BtnList.on(fgui.Event.CLICK_ITEM, this.OnClickBtnItem, this)
        this.viewNode.MapList.setVirtual();

        this.FlushData(true);
        this.FlushFlushTime();
        this.slideShow();
        // this.viewNode.MapList.on(fgui.Event.SCROLL, this.slideShow, this);
    }

    slideShow() {
        let line = LoseTempleData.Inst().GetMyLine();
        let num = this.viewNode.MapList.scrollPane.contentHeight - (line * 155) - 1100
        this.timer_rt = Timer.Inst().AddRunFrameTimer(() => {
            this.viewNode.MapList.scrollPane.posY = num;
        }, 10, 1, false)
    }

    FlushSlideShow() {
        let line = LoseTempleData.Inst().GetMyLine();
        let num = this.viewNode.MapList.scrollPane.contentHeight - (line * 155) - 1100
        this.viewNode.MapList.scrollPane.posY = num;
    }

    FlushData(initFlush: boolean = false) {
        let energy = LoseTempleData.Inst().GetEnergyNum()
        UH.SetText(this.viewNode.Energy, energy);

        let info = LoseTempleData.Inst().Info;
        let storey = (info && info.nowStorey) || 1;
        let maxstorey = LoseTempleData.Inst().GetMaxStorey();
        UH.SetText(this.viewNode.TierNum, TextHelper.Format(Language.LoseTemple.TierNum, Language.DataHelper.DaXie[storey], Language.DataHelper.DaXie[maxstorey]));

        this.viewNode.MapList.itemRenderer = this.itemRendererMap.bind(this);
        this.listDataMap = [0];
        this.viewNode.MapList.numItems = [0].length;

        let BtnData = LoseTempleData.Inst().getActList();
        let hasMysterious = false;
        for (let i = 0; i != BtnData.length; ++i) {
            if (BtnData[i].type == 1) {
                hasMysterious = true
                break;
            }
        }
        if (hasMysterious != this.mysteriousBtnShowing) {
            this.mysteriousBtnShowing = hasMysterious;
            if (!initFlush && this.mysteriousBtnShowing) {
                ViewManager.Inst().OpenView(LoseTempleMerchantView, 2)
            }
        }

        this.viewNode.BtnList.itemRenderer = this.itemRendererBtn.bind(this);
        this.listDataBtn = BtnData;
        this.viewNode.BtnList.numItems = BtnData.length;

        this.FlushHeroListData();
    }

    private itemRendererMap(index: number, item: any) {
        item.SetData(this.listDataMap[index]);
    }

    private itemRendererBtn(index: number, item: any) {
        item.SetData(this.listDataBtn[index]);
    }

    private itemRendererHero(index: number, item: any) {
        item.SetData(this.listDataHero[index]);
    }

    FlushHeroListData() {
        let data = LoseTempleData.Inst().GetInBattleHeros()
        this.viewNode.HeroList.itemRenderer = this.itemRendererHero.bind(this);
        this.listDataHero = data;
        this.viewNode.HeroList.numItems = data.length;
    }

    private FlushFlushTime() {
        let time = LoseTempleData.Inst().getEndTime();;
        this.viewNode.timer.visible = time > 0
        this.viewNode.timer.CloseCountDownTime()
        if (time > 0) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7, Language.Common.Refresh + ":");
        }
    }

    InitUI() {
    }

    OnClickBtnItem(item: BtnItem) {
        let type = item.data.type;
        switch (type) {
            case 1://神秘商人
                ViewManager.Inst().OpenView(LoseTempleMerchantView, 2)
                break;
            case 2://神殿商店
                ViewManager.Inst().OpenView(LoseTempleMerchantView, 1)
                break;
            case 3://成就
                ViewManager.Inst().OpenView(LoseTempleAchievementView)
                break;
            case 4://魔王战令
                ViewManager.Inst().OpenView(DevilWarorderView);
                break;
        }
    }

    OnClickTeam() {
        ViewManager.Inst().OpenView(LoseTempleTeamView)
    }
    OnClickRemains() {
        ViewManager.Inst().OpenView(LoseTempleRemainsView)
    }

    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.bg.SetIcon("loader/LoseTemple/LoseTempleBg", () => {
            waitHandle.complete = true;
            this.refreshBgSize(this.viewNode.bg)
        })
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        Timer.Inst().CancelTimer(this.timer_rt)
        this.viewNode.timer.CloseCountDownTime();
    }
}


export class LoseTempleMap extends BaseItem {
    MapListItem: MapItem[][];
    handleCollector: any;
    static isViewOpen: boolean;
    isSlideShow: boolean = false;
    private TwShow: any
    private spShow: any

    protected viewNode = {
        RoleShow: <fgui.GComponent>null,
        parent: <fgui.GComponent>null,
    }

    protected onConstruct(): void {
        super.onConstruct()

        this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("qizi/qizi"), true, (obj: any) => {
            this.viewNode.RoleShow._container.insertChild(obj, 0);
        });
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.handleCollector) {
            HandleCollector.Destory(this.handleCollector);
            this.handleCollector = null;
        }
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }

        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
    }
    public SetData(d: any) {
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }
        this.addSmartDataCare(LoseTempleData.Inst().FlushData, this.FlushselecMapCellShow.bind(this), "selectMapFlush");

        let data = LoseTempleData.Inst().GetMapData();
        let pos_from, pos_to
        let move_block = LoseTempleData.Inst().MoveBlock
        let line_from = move_block.length - 1
        let block_from = move_block[line_from - 1]
        let my_item
        if (!this.MapListItem) {
            let num = 0;
            let hei = data.length * 155 + 900;
            let height = hei < 1500 ? 1500 : hei;
            this.MapListItem = [];
            this.height = height;
            for (let i = data.length - 1; i >= 0; i--) {
                this.MapListItem[i] = [];
                for (let j = 0; j < data[i].length; j++) {
                    if (!data[i][j]) continue;
                    let mapItem = this.createObjView();
                    mapItem.FlushShow(data[i][j])
                    let x
                    if (num % 2 == 0) {
                        x = (data[i][j].block - 1) * 230 + 175;
                    } else {
                        x = (data[i][j].block - 1) * 230 + 60;
                    }
                    let y = height - i * 155 - 700;
                    mapItem.setPosition(x, y)
                    this.viewNode.parent.addChild(mapItem);
                    this.MapListItem[i].push(mapItem);

                    let type = LoseTempleData.Inst().GetMapCellState(data[i][j].line, data[i][j].block);
                    if (type == LostCellType.My) {
                        if (LoseTempleData.Inst().RoleAnim && data[i][j].event_type == 1) {
                            pos_to = new Vec2(x, y)
                            my_item = mapItem
                        }
                    }
                    if (line_from == data[i][j].line && block_from == data[i][j].block) {
                        pos_from = new Vec2(x, y)
                    }
                }
                num++;
            }
            if (this.isSlideShow) {
                LoseTempleData.Inst().slideShowFlush();
                this.isSlideShow = false;

            }
        } else {
            for (let i = 0; i < this.MapListItem.length; i++) {
                for (let j = 0; j < this.MapListItem[i].length; j++) {
                    this.MapListItem[i][j].FlushShow(data[i][j]);

                    let type = LoseTempleData.Inst().GetMapCellState(data[i][j].line, data[i][j].block);
                    if (type == LostCellType.My) {
                        pos_to = new Vec2(this.MapListItem[i][j].x, this.MapListItem[i][j].y)
                        my_item = this.MapListItem[i][j]
                    }
                    if (line_from == data[i][j].line && block_from == data[i][j].block) {
                        pos_from = new Vec2(this.MapListItem[i][j].x, this.MapListItem[i][j].y)
                    }
                }
            }
        }
        let role_anim = (pos_from && pos_to && !this.TwShow) && (pos_from.x != pos_to.x || pos_from.y != pos_to.y)
        LoseTempleData.Inst().RoleAnim = false
        if (role_anim) {
            this.MoveAnim(pos_from, pos_to, my_item)
        }
        this.NextStorey();

    }

    public FlushselecMapCellShow() {
        LoseTempleMap.isViewOpen = false;
        let MapCell: any;
        let line = LoseTempleData.Inst().Info.nowLine ?? 0;
        let selectCell = LoseTempleData.Inst().SelecMapCell;
        for (let j = 0; j < this.MapListItem[line].length; j++) {
            let cell = this.MapListItem[line][j];
            if (cell.data.block == selectCell) {
                MapCell = cell
                break;
            }
        }
        let isCell = true;
        for (let i = 0; i < this.MapListItem[line].length; i++) {
            let cell = this.MapListItem[line][i];
            if (cell.data.block != selectCell) {
                cell.EffectShow(() => {
                    MapCell && MapCell.FlushOpenView();
                });
                isCell = false
            }
        }
        if (isCell) {
            MapCell && MapCell.FlushOpenView();
        }
    }

    public createObjView() {
        let mapItem = <MapItem>fgui.UIPackage.createObject("LoseTemple", "MapItem").asCom;
        this.viewNode.parent.addChild(mapItem);
        return mapItem;
    }

    private addSmartDataCare(smdata: any, callback: Function, ...keys: string[]) {
        var handle = SMDHandle.Create(smdata, callback, ...keys)
        this.handleCollector.Add(handle);
    };

    MoveAnim(pos_from: Vec2, pos_to: Vec2, my_item: MapItem) {
        this.touchable = false
        this.viewNode.RoleShow.visible = true
        if (my_item) {
            my_item.MapMyShow(false)
        }
        this.TwShow = fgui.GTween.to2(pos_from.x + 35 + 75, pos_from.y + 140, pos_to.x + 35 + 75, pos_to.y + 140, 1).onUpdate((tweener: fgui.GTweener) => {
            if (this.viewNode && this.viewNode.RoleShow) {
                this.viewNode.RoleShow.x = tweener.value.x
                this.viewNode.RoleShow.y = tweener.value.y
            }
        }).onComplete(() => {
            if (!this.viewNode) {
                return;
            }
            if (this.viewNode.RoleShow) {
                this.viewNode.RoleShow.visible = false
            }
            this.touchable = true
            this.TwShow = null
            if (my_item && isValid(my_item.node)) {
                my_item.MapMyShow(true)
            }
        })
    }
    NextStorey() {
        let isMaxStorey = LoseTempleData.Inst().IsMaxStorey()
        if (isMaxStorey) {
            return;
        }
        let line = LoseTempleData.Inst().GetMaxStoreyline();
        let myLine = LoseTempleData.Inst().GetMyLine()
        let pass = LoseTempleData.Inst().BlockPass;
        if (pass == 1 && line <= myLine) {
            LoseTempleCtrl.Inst().SendLoseNextStorey();
            for (let i = 0; i < this.MapListItem.length; i++) {
                for (let j = 0; j < this.MapListItem[i].length; j++) {
                    this.MapListItem[i][j].dispose()
                }
            }
            this.MapListItem = null
            this.isSlideShow = true
        }
    }
    protected onDisable(): void {
        if (this.TwShow) {
            UtilHelper.KillFGuiTweenr(this.TwShow);
            this.TwShow = null;
        }
    }
}

export class MapItem extends BaseItem {
    private spShow: any

    protected viewNode = {
        bg: <fgui.GLoader>null,
        BtnMapItem: <fgui.GButton>null,
        UISpineShow: <UISpineShow>null,
        stoneSpine: <UISpineShow>null,
        MyParent: <fgui.GComponent>null,
    };
    private timer_ani: any = null;
    private timer_send: any = null;
    private timer_send2: any = null;
    type: number

    public FlushShow(data: any) {
        this.data = data;
        let type = LoseTempleData.Inst().GetMapCellState(data.line, data.block);
        this.type = type;
        this.viewNode.BtnMapItem.onClick(this.OnClickItem, this)
        this.viewNode.UISpineShow.onDestroy();
        this.viewNode.stoneSpine.onDestroy();
        this.viewNode.BtnMapItem.visible = false;
        this.viewNode.MyParent.visible = type == LostCellType.My
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
        if (type == LostCellType.My) {
            this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine("qizi/qizi"), true, (obj: any) => {
                this.viewNode.MyParent._container.insertChild(obj, 0);
            });
            // this.viewNode.BtnMapItem.visible = true;
            this.viewNode.BtnMapItem.icon = fgui.UIPackage.getItemURL("LoseTemple", `ShiJian7`);
            UH.SpriteName(this.viewNode.bg, "LoseTemple", "DiBan2");
        } else if (type == LostCellType.Choosable) {
            this.viewNode.BtnMapItem.visible = true;
            this.viewNode.BtnMapItem.icon = fgui.UIPackage.getItemURL("LoseTemple", `ShiJian${data.event_type}`);
            this.viewNode.UISpineShow.LoadSpine(ResPath.UIEffect(1208052), true);
            UH.SpriteName(this.viewNode.bg, "LoseTemple", "DiBan2");
        } else if (type == LostCellType.Mist) {
            UH.SpriteName(this.viewNode.bg, "LoseTemple", "DiBan3");
            this.viewNode.BtnMapItem.icon = fgui.UIPackage.getItemURL("LoseTemple", `ShiJian${data.event_type}`);
        } else if (type == LostCellType.Selected) {
            UH.SpriteName(this.viewNode.bg, "LoseTemple", "DiBan2");
        } else if (type == LostCellType.Conceal) {
            this.visible = false;
        }

        if (data.event_type == 6) {
            let myLine = LoseTempleData.Inst().GetMyLine();
            this.visible = myLine + 1 >= data.line
        }
    }

    public FlushOpenView() {
        if (LoseTempleMap.isViewOpen) return
        LoseTempleMap.isViewOpen = true;
        if (LoseTempleData.Inst().BlockPass == 1) {
            LoseTempleCtrl.Inst().SendLoseMove(this.data.block)
        }
        let type = this.data.event_type;
        let id = this.data.event_id;
        switch (type) {
            case 1://战斗
                ViewManager.Inst().OpenView(LoseTempleCombatView, id)
                break;
            case 2://商店
                if (LoseTempleData.Inst().isMysteriousOpen()) {
                    ViewManager.Inst().OpenView(LoseTempleMerchantView, 2)
                }
                break;
            case 3://宝箱
                ViewManager.Inst().OpenView(LoseTempleRemainsBoxView, id)
                break;
            case 4://篝火
                ViewManager.Inst().OpenView(LoseTempleBonfireView, id)
                break;
            case 5://酒馆
                ViewManager.Inst().OpenView(LoseTempleTavernView, id)
                break;
            case 6://层底宝箱
                Timer.Inst().CancelTimer(this.timer_send2);
                this.timer_send2 = Timer.Inst().AddRunTimer(() => {
                    LoseTempleCtrl.Inst().SendLoseOpenEndBox();
                }, 0.5, 1, false)
                break;
        }
    }

    public EffectShow(callBack: Function) {
        this.viewNode.bg.visible = false;
        this.viewNode.BtnMapItem.visible = false;
        this.viewNode.UISpineShow.onDestroy();
        // this.viewNode.stoneSpine.onDestroy();
        this.viewNode.stoneSpine.LoadSpine(ResPath.UIEffect(1208053), true);
        Timer.Inst().CancelTimer(this.timer_send);
        this.timer_send = Timer.Inst().AddRunTimer(() => {
            this.visible = false;
            callBack && callBack();
        }, 0.5, 1, false)
    }

    OnClickItem() {
        if (this.type != LostCellType.Choosable) return;
        if (LoseTempleData.Inst().BlockPass == 1) {
            LoseTempleData.Inst().SelecMapCell = this.data.block
        } else {
            LoseTempleMap.isViewOpen = false;
            this.FlushOpenView();
        }
    }

    onDisable() {
        super.onDisable();
        Timer.Inst().CancelTimer(this.timer_ani);
        Timer.Inst().CancelTimer(this.timer_send);
        Timer.Inst().CancelTimer(this.timer_send2);
    }

    MapMyShow(visible: boolean) {
        if (this.viewNode && this.viewNode.MyParent && isValid(this.node) && isValid(this.viewNode.MyParent.node)) {
            this.viewNode.MyParent.visible = visible
        }
    }

    protected onDestroy(): void {
        super.onDestroy();
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
    }
}

export class BtnItem extends BaseItemGB {
    ItemIndex: number
    cache_timer: number
    private handleCollector: HandleCollector;
    private spShow: UISpineShow = undefined;
    protected viewNode = {
        timer: <TimeMeter>null,
        RedPointShow: <RedPoint>null,
        icon: <fgui.GLoader>null,
    };
    public SetData(data: any) {
        if (this.handleCollector) {
            this.handleCollector.RemoveAll()
        } else {
            this.handleCollector = HandleCollector.Create();
        }
        this.data = data;
        this.ItemIndex = data.index;
        if (data.type == 2) {
            this.title = Language.LoseTemple.shopName
            this.viewNode.timer.y = 112
        } else if (data.type == 3) {
            this.title = Language.LoseTemple.ActTip
            this.viewNode.timer.y = 112
        } else {
            this.title = ""
            this.viewNode.timer.y = 75
        }
        this.FlushFlushTime();
        if (data.mod_key) {
            let self = this;
            let group = ModManger.TabMod(data.mod_key);
            this.handleCollector.Add(RemindGroupMonitor.Create(group, self.freshRedPoint.bind(self, group, this.viewNode.RedPointShow)));
        } else {
            this.viewNode.RedPointShow.SetNum(0);
        }
        if (this.spShow) {
            this.spShow.onDestroy();
            this.spShow = null;
        }
        if (data.effect) {
            this.spShow = ObjectPool.Get(UISpineShow, ResPath.Spine(data.effect), true, (obj: any) => {
                obj.setPosition(55, -90);
                this._container.insertChild(obj, 2);
            });
            this.viewNode.icon.visible = false;
        } else {
            this.icon = fgui.UIPackage.getItemURL("LoseTemple", `TuBiao${data.type}`);
            this.viewNode.icon.visible = true;
        }
    }

    private freshRedPoint(group: any, obj: RedPoint) {
        obj.SetNum(RemindCtrl.Inst().GetGroupNum(group));
    }

    private FlushFlushTime() {
        let time = this.data.endTime - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        if (time > 0) {
            this.viewNode.timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
    }
    protected onDestroy(): void {
        super.onDestroy();
        this.viewNode.timer.CloseCountDownTime();
        if (this.handleCollector) {
            HandleCollector.Destory(this.handleCollector);
            this.handleCollector = null;
        }
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null;
        }
    }
}

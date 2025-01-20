import { game, Vec2 } from "cc";
import { CfgItem } from "config/CfgCommon";
import { CfgMining, CfgMiningMetersReward } from "config/CfgMining";
import { SmallObjPool } from "core/SmallObjPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BagData } from "modules/bag/BagData";
import { Item } from "modules/bag/ItemData";
import { BattleHelper } from "modules/Battle/BattleHelper";
import { CavePassData } from "modules/CavePass/CavePassData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { COLORS } from "modules/common/ColorEnum";
import { AdType, CommonId, ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from 'modules/common/Language';
import { Mod } from "modules/common/ModuleDefine";
import { CurrencyShow } from "modules/extends/Currency";
import { EGLoader } from "modules/extends/EGLoader";
import { RedPoint } from "modules/extends/RedPoint";
import { TimeFormatType, TimeMeter } from "modules/extends/TimeMeter";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { RewardGetView } from "modules/reward_get/RewardGetView";
import { RoleData } from "modules/role/RoleData";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { Timer, TYPE_TIMER } from "modules/time/Timer";
import { MathHelper } from "../../helpers/MathHelper";
import { UH } from "../../helpers/UIHelper";
import { ChannelAgent } from "../../proload/ChannelAgent";
import { MiningCtrl, MiningReqType } from "./MiningCtrl";
import { MiningBlockType, MiningData, MiningMapCol } from "./MiningData";
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { ActivityData } from "modules/activity/ActivityData";
import { ACTIVITY_TYPE } from "modules/activity/ActivityEnum";
import { LogError } from "core/Debugger";
import { UtilHelper } from "../../helpers/UtilHelper";
import { MiningRewardShow } from "./MiningRewardShow";
import { DataHelper } from "../../helpers/DataHelper";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { ReportManager, ReportType } from "../../proload/ReportManager";

export const MINING_CELL_WIDTH = 108
export const MINING_MAP_COL = 6;
export const MINING_MAP_ROW = 7; 

type PitItemPosInfo = {
    index:number,
    i:number,
    j:number,
    item:MiningPitItem,
    isShowEffect:boolean,
}
enum MiningTouchEffectType{
    WoGuaJinZhi = "1208090",    //倭瓜钻头禁止
    WoGua = "1208091",          //倭瓜钻头
    ZaDanJinZhi = "1208088",    //樱桃炸弹禁止
    ZaDan = "1208089",          //樱桃
    JinZhi = "1208093",         //挖掘禁止
    WaJue = "1208092",          //挖掘

    TieGaoAnim = "1208097",     //铁镐挖掘动画
    ZaDanAnim = "1208100",      //炸弹放置动画
    ZuanTouAnim = "1208103",    //钻头动画
}

enum MiningPititemEffect{
    TuKuai = "1208094",         //土块消失
    ShiKuai = "1208095",        //石块消失
    BaoZha = "1208096",         //通用爆炸
}

enum MiningRangeType{
    YiQuan = 1,     //周围一圈
    DiZuan = 2,     //地钻范围
    ZaDan = 3,      //炸弹范围
}

@BaseView.registView
export class MiningView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Mining",
        ViewName: "MiningView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        BlockContent: <MiningBlockContent>null,
        CloseBtn: <fgui.GButton>null,
        Prop1: <fgui.GLabel>null,
        Prop2: <fgui.GLabel>null,

        ExcavateNum: <fgui.GTextField>null,
        ExcavateNum2: <fgui.GTextField>null,
        GemNum: <fgui.GTextField>null,
        BitNum: <fgui.GTextField>null,
        BombNum: <fgui.GTextField>null,

        DepthValue:<fgui.GTextField>null,
        RewardLabel:<MiningRewardLabel>null,

        CurrGold:<CurrencyShow>null,
        CurrDiamond:<CurrencyShow>null,
        Timer: <TimeMeter>null,

        AdBtn:<fgui.GButton>null,
        PropAdBtn1:<fgui.GButton>null,
        PropAdBtn2:<fgui.GButton>null,

        TongXingZhengBtn: <fgui.GButton>null,
        UISpineShow: <UISpineShow>null,
        RedPoint: <RedPoint>null,

        ExcavateInfo2: <fgui.GGroup>null,

        ExIcon: <fgui.GObject>null,
        GemIcon: <fgui.GObject>null,
        BGLoader: <EGLoader>null,

        AdRewardTip1: <fgui.GLabel>null,
        AdRewardTip2: <fgui.GLabel>null,
        AdRewardTip3: <fgui.GLabel>null,

        Kuang1:<fgui.GObject>null,
        Kuang2:<fgui.GObject>null,
    };

    protected extendsCfg = [
        { ResName: "PitItem", ExtendsClass: MiningPitItem },
        { ResName: "BlockContent", ExtendsClass: MiningBlockContent },
        { ResName: "RewardLabel", ExtendsClass: MiningRewardLabel },
        { ResName: "GetShowTip", ExtendsClass: MiningGetShowTip },
        { ResName: "IconFlyItem", ExtendsClass: MiningIconFly }
    ];

    private itemShowTipPool: SmallObjPool<MiningGetShowTip>;
    private itemFiyPool: SmallObjPool<MiningIconFly>;

    private timerHtList: Set<TYPE_TIMER>; 

    private propPos:Vec2;
    private timeOutHt:any;
    private timeOutHt2:any;
    InitData() {
        GuideCtrl.Inst().AddGuideUi("MiningCloseBtn", this.viewNode.CloseBtn);

        MiningCtrl.Inst().ReqInfo();

        this.AddSmartDataCare(BagData.Inst().BagItemData, this.FlushItemInfo.bind(this), "OtherChange");
        this.AddSmartDataCare(MiningData.Inst().miningInfo, this.FlushSceneInfo.bind(this), "sceneInfo");
        this.AddSmartDataCare(CavePassData.Inst().FlushData, this.FlushRemind.bind(this), "FlushInfo");
        this.AddSmartDataCare(MiningData.Inst().miningInfo, this.FlushExcavateInfo.bind(this), "excavateInfo");

        this.viewNode.CurrGold.SetCurrency(CommonId.Gold, true);
        this.viewNode.CurrDiamond.SetCurrency(CommonId.Diamond, true);

        //this.viewNode.Prop1.draggable = true;
        this.viewNode.Prop1.on(fgui.Event.DRAG_END, this.OnDragEnd, this);
        this.viewNode.Prop1.on(fgui.Event.DRAG_MOVE, this.OnDragMove, this);
        this.viewNode.Prop1.on(fgui.Event.DRAG_START, this.OnDragStart, this);
        this.viewNode.Prop1.on(fgui.Event.TOUCH_BEGIN, ()=>{
            let item_id = MiningData.Inst().GetBitItemId();
            if(Item.GetNum(item_id) <= 0){
                let itemName = Item.GetName(item_id);
                PublicPopupCtrl.Inst().Center(itemName + Language.Mining.ItemNotTip);
            }
        })

        //this.viewNode.Prop2.draggable = true;
        this.viewNode.Prop2.on(fgui.Event.DRAG_END, this.OnDragEnd, this);
        this.viewNode.Prop2.on(fgui.Event.DRAG_MOVE, this.OnDragMove, this);
        this.viewNode.Prop2.on(fgui.Event.DRAG_START, this.OnDragStart, this);
        this.viewNode.Prop2.on(fgui.Event.TOUCH_BEGIN, ()=>{
            let item_id = MiningData.Inst().GetBombItemId();
            if(Item.GetNum(item_id) <= 0){
                let itemName = Item.GetName(item_id);
                PublicPopupCtrl.Inst().Center(itemName + Language.Mining.ItemNotTip);
            }
        })

        this.viewNode.CloseBtn.onClick(this.closeView, this);
        this.viewNode.AdBtn.onClick(this.OnAdExcavateClick, this);
        this.viewNode.PropAdBtn1.onClick(()=>{
            let iscanad = RoleData.Inst().IsCanAD(AdType.mining_bit);
            if(!iscanad){
                return;
            }
            ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.mining_bit), "");
        });
        this.viewNode.PropAdBtn2.onClick(()=>{
            let iscanad = RoleData.Inst().IsCanAD(AdType.mining_bomb);
            if(!iscanad){
                return;
            }
            ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.mining_bomb), "");
        });

        this.viewNode.TongXingZhengBtn.visible =FunOpen.Inst().checkAudit(1) &&  ActivityData.Inst().IsOpen(ACTIVITY_TYPE.CavePass);
        this.viewNode.TongXingZhengBtn.onClick(()=>{
            ViewManager.Inst().OpenViewByKey(Mod.CavePass.View);
        })

        this.viewNode.UISpineShow.LoadSpine("spine/kuangdongzhanling/kuangdongzhanling", true);

        this.itemShowTipPool = new SmallObjPool(undefined);
        this.itemShowTipPool.isNode = false;
        this.itemShowTipPool.SetCreateFunc(()=>{
            let pitItem = <MiningGetShowTip>fgui.UIPackage.createObject("Mining", "GetShowTip").asCom;
            this.view.addChild(pitItem);
            return pitItem;
        })
        this.itemShowTipPool.SetDestroyFunc((item: MiningGetShowTip) => {
            item.dispose();
            item = null;
        })

        this.timerHtList = new Set<TYPE_TIMER>();
        this.itemFiyPool = new SmallObjPool(undefined);
        this.itemFiyPool.isNode = false;
        this.itemFiyPool.SetCreateFunc(()=>{
            let Item = <MiningIconFly>fgui.UIPackage.createObject("Mining", "IconFlyItem").asCom;
            this.view.addChild(Item);
            return Item;
        })
        this.itemFiyPool.SetDestroyFunc((item: MiningIconFly) => {
            item.dispose();
            item = null;
        })

        this.FlushAdRewardLabel();
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadMiningBG");
        this.AddWaitHandle(waitHandle);
        this.viewNode.BGLoader.SetIcon("loader/ui_bg/mining_bg", () => {
            waitHandle.complete = true;
        })
    }

    OpenCallBack() {
        ReportManager.Inst().sendPoint(ReportType.gameModelInfo, [Mod.Mining.View,0,0,RoleData.Inst().InfoRoleId], "mod-" + Mod.Mining.View)

        this.FlushSceneInfo();
        this.FlushItemInfo();

        this.timeOutHt = setTimeout(() => {
            if(RoleData.Inst().IsGuideNum(4)) {
                GuideCtrl.Inst().Start(4);
            }
        }, 500);
    }

    FlushAdRewardLabel(){
        let adCfg1 = RoleData.Inst().CfgAdTypeSeq(AdType.mining_bit);
        UH.SetText(this.viewNode.AdRewardTip1, "x" + adCfg1.ad_award[0].num);
        let adCfg2 = RoleData.Inst().CfgAdTypeSeq(AdType.mining_excavate);
        UH.SetText(this.viewNode.AdRewardTip2, "x" + adCfg2.ad_award[0].num);
        let adCfg3 = RoleData.Inst().CfgAdTypeSeq(AdType.mining_bomb);
        UH.SetText(this.viewNode.AdRewardTip3, "x" + adCfg3.ad_award[0].num);
    }

    FlushSceneInfo(){
        this.FlushBlockList();
        this.FlushTime();
        this.FlushRemind();
        UH.SetText(this.viewNode.DepthValue, MiningData.Inst().GetDepthValue() + "m");

        let meterReward = MiningData.Inst().DepthReward();
        this.viewNode.RewardLabel.visible = meterReward != null;
        if(meterReward){
            this.viewNode.RewardLabel.SetData(meterReward);
        }
    }

    FlushExcavateInfo(){
        let info = MiningData.Inst().excavateInfo;
        if(info == null){
            return;
        }

        if(info.blockType == null && info.itemList && info.itemList.length > 0){
            ViewManager.Inst().OpenView(RewardGetView, { reward_data: info.itemList, call_back: null });
            info.Reset();
            return;
        }

        if(!info.GetIsShow()){
            return;
        }

        if(info.itemList.length == 1){
            if(info.blockType == MiningBlockType.BaoXiang){
                //ViewManager.Inst().OpenView(RewardGetView, { reward_data: info.itemList, call_back: null })
                let item = Item.Create(info.itemList[0], { is_num: true, is_click: false })
                ViewManager.Inst().OpenView(MiningRewardShow, item);
            }else{
                this.PlayItemGetShow(info.pos, info.itemList[0]);
                this.PlayFlyItem(info.pos, info.itemList[0]);
            }
        }else if(info.itemList.length > 1){
            ViewManager.Inst().OpenView(RewardGetView, { reward_data: info.itemList, call_back: null })
        }
        info.Reset();
    }

    private lastDepthValue:number;
    FlushBlockList(){
        if(this.viewNode.BlockContent.isMoveing){
            return;
        }
        let curDepthValue = MiningData.Inst().GetDepthValue();
        if(this.lastDepthValue == null || this.lastDepthValue == curDepthValue){
            let listData = MiningData.Inst().GetBlockList();
            this.viewNode.BlockContent.SetData(listData);
        }else{
            this.viewNode.BlockContent.MoveDown(curDepthValue - this.lastDepthValue, ()=>{
                let listData = MiningData.Inst().GetBlockList();
                this.viewNode.BlockContent.SetData(listData);
            });
        }
        this.lastDepthValue = curDepthValue;
    }

    FlushItemInfo(){
        let excavateNum = Item.GetNum(MiningData.Inst().GetExcavateItemId());
        let maxExcavate = MiningData.Inst().GetExcavateNumLimit();
        UH.SetText(this.viewNode.ExcavateNum, excavateNum + "/" + maxExcavate);

        if(this.viewNode.Timer.visible && excavateNum >= maxExcavate){
            this.viewNode.Timer.visible = false;
        }

        if(excavateNum == 0){
            let iscanad = RoleData.Inst().IsCanAD(AdType.mining_excavate, false);
            let adCfg = RoleData.Inst().CfgAdTypeSeq(AdType.mining_excavate);
            let count = adCfg.ad_param - RoleData.Inst().GetTodayAdCount(AdType.mining_excavate);
            this.viewNode.AdBtn.visible = iscanad;
            this.viewNode.AdBtn.title = count + "/" + adCfg.ad_param
            this.viewNode.ExcavateInfo2.visible = false;
            this.viewNode.AdRewardTip2.visible = iscanad && count > 0;
            this.viewNode.AdBtn.grayed = count <= 0;
        }else{
            this.viewNode.AdBtn.visible = false;
            this.viewNode.AdRewardTip2.visible = false;
            UH.SetText(this.viewNode.ExcavateNum2, excavateNum);
            this.viewNode.ExcavateInfo2.visible = true;
        }

        let gemNum = Item.GetNum(MiningData.Inst().GetGemItemId());
        UH.SetText(this.viewNode.GemNum, DataHelper.ConverMoney(gemNum));

        let bitNum = Item.GetNum(MiningData.Inst().GetBitItemId());
        this.viewNode.Prop1.draggable = bitNum > 0;

        if(bitNum == 0 ){
            let isBitcanAd = RoleData.Inst().IsCanAD(AdType.mining_bit, false);
            if(!isBitcanAd){
                this.viewNode.PropAdBtn1.visible = false;
                this.viewNode.AdRewardTip1.visible = false;
                UH.SetText(this.viewNode.BitNum, "0");
                this.viewNode.Prop1.visible = true;
            }else{
                let iscanad = RoleData.Inst().IsCanAD(AdType.mining_bit);
                let adCfg = RoleData.Inst().CfgAdTypeSeq(AdType.mining_bit);
                let count = adCfg.ad_param - RoleData.Inst().GetTodayAdCount(AdType.mining_bit);
                this.viewNode.PropAdBtn1.title = count + "/" + adCfg.ad_param
                this.viewNode.PropAdBtn1.visible = true;
                this.viewNode.PropAdBtn1.grayed = !iscanad
                UH.SetText(this.viewNode.BitNum, "");
                this.viewNode.AdRewardTip1.visible = iscanad;
                this.viewNode.Kuang1.grayed = !iscanad;
                this.viewNode.Prop1.visible = false;
            }
        }else{
            this.viewNode.PropAdBtn1.visible = false;
            this.viewNode.AdRewardTip1.visible = false;
            UH.SetText(this.viewNode.BitNum, bitNum);
            this.viewNode.Prop1.visible = true;
            this.viewNode.Kuang1.grayed = false;
        }

        let bombNum = Item.GetNum(MiningData.Inst().GetBombItemId());
        this.viewNode.Prop2.draggable = bombNum > 0;
        if(bombNum == 0){
            let isBombcanAd = RoleData.Inst().IsCanAD(AdType.mining_bomb, false);
            if(!isBombcanAd){
                this.viewNode.PropAdBtn2.visible = false;
                this.viewNode.AdRewardTip3.visible = false;
                UH.SetText(this.viewNode.BombNum, "0");
                this.viewNode.Prop2.visible = true;
            }else{
                let iscanad = RoleData.Inst().IsCanAD(AdType.mining_bomb);
                let adCfg = RoleData.Inst().CfgAdTypeSeq(AdType.mining_bomb);
                let count = adCfg.ad_param - RoleData.Inst().GetTodayAdCount(AdType.mining_bomb);
                this.viewNode.PropAdBtn2.title = count + "/" + adCfg.ad_param
                this.viewNode.PropAdBtn2.visible = true;
                this.viewNode.PropAdBtn2.grayed = !iscanad
                UH.SetText(this.viewNode.BombNum, "");
                this.viewNode.Prop2.visible = false;
                this.viewNode.AdRewardTip3.visible = iscanad;
                this.viewNode.Kuang2.grayed = !iscanad;
            }
        }else{
            this.viewNode.PropAdBtn2.visible = false;
            UH.SetText(this.viewNode.BombNum, bombNum);
            this.viewNode.Prop2.visible = true;
            this.viewNode.AdRewardTip3.visible = false;
            this.viewNode.Kuang2.grayed = false;
        }
    }

    FlushTime(){
        this.viewNode.Timer.CloseCountDownTime();
        let end_time = MiningData.Inst().GetExcavateFlushTime() + 1;
        this.viewNode.Timer.visible = end_time > 100000;
        // 这个时间是时间戳，所以这样判断
        if (end_time > 100000) {
            this.viewNode.Timer.SetOutline(true, COLORS.Brown, 3)
            this.viewNode.Timer.StampTime(end_time, TimeFormatType.TYPE_TIME_0);
            this.viewNode.Timer.SetCallBack(()=>{
                MiningCtrl.Inst().ReqInfo();
            });
        }
    }

    FlushRemind(){
        let redNum = CavePassData.Inst().GetAllRed();
        this.viewNode.RedPoint.SetNum(redNum);
    }

    CloseCallBack() {
        if (this.timer_handle) {
            Timer.Inst().CancelTimer(this.timer_handle);
            this.timer_handle = null;
        }
        if(this.timerHtList.size > 0){
            this.timerHtList.forEach(ht=>{
                Timer.Inst().CancelTimer(ht);
            })
            this.timerHtList.clear();
            this.timerHtList = null;
        }

        if (this.timeOutHt) {
            clearTimeout(this.timeOutHt);
            this.timeOutHt = null;
        }

        if (this.timeOutHt2) {
            clearTimeout(this.timeOutHt2);
            this.timeOutHt2 = null;
        }

        GuideCtrl.Inst().ClearGuideUi("MiningCloseBtn");
        GuideCtrl.Inst().ClearGuideUi("MiningPitItem3_3");
        //RoleData.Inst().IsGuideNum(5);
    }

    OnPropDragStart(evt: fgui.Event){
        var btn: fgui.GObject = evt.sender!;
        btn.stopDrag();//取消对原目标的拖动，换成一个替代品
        fgui.DragDropManager.inst.startDrag(btn, btn.icon, btn.icon);
    }


    private dragBtn:fgui.GLabel;
    OnDragStart(evt: fgui.Event){
        var btn: fgui.GLabel = <fgui.GLabel>evt.sender!;
        if(this.dragBtn || this.viewNode.BlockContent.isMoveing){
            btn.stopDrag();
            return;
        }
        this.dragBtn = btn;
        this.propPos = new Vec2(btn.x, btn.y);
    }

    OnDragMove(evt: fgui.Event){
        var btn: fgui.GLabel = <fgui.GLabel>evt.sender!;
        if(this.dragBtn && btn != this.dragBtn){
            return;
        }
        let globalPos = btn.localToGlobal();
        let info = this.viewNode.BlockContent.GetItemInfoByPos(globalPos.x, globalPos.y);
        let item = info.item
        let effectType:MiningTouchEffectType;
        if(item == null || item.GetData().coldType != MiningBlockType.None){
            let imgName = btn.name == "Prop1" ? "WeiGuaZuanTouJinZhi" : "YingTaoDaPaoJinZhi";
            effectType = btn.name == "Prop1" ? MiningTouchEffectType.WoGuaJinZhi : MiningTouchEffectType.ZaDanJinZhi;
            UH.SpriteName(btn, "Mining", imgName);
        }else{
            let imgName = btn.name == "Prop1" ? "WeiGuaZuanTou" : "YingTaoDaPao";
            effectType = btn.name == "Prop1" ? MiningTouchEffectType.WoGua : MiningTouchEffectType.ZaDan;
            UH.SpriteName(btn, "Mining", imgName);
        }

        if(info.isShowEffect && info.item){
            let effectGlobalPos:Vec2;
            if(btn.name == "Prop1"){
                effectGlobalPos = info.item.localToGlobal();
                let centerItem = this.viewNode.BlockContent.centerItem;
                effectGlobalPos.y = centerItem.localToGlobal().y;
            }else{
                effectGlobalPos = info.item.localToGlobal();
            }
            this.viewNode.BlockContent.PlayEff(effectType, effectGlobalPos);
        }else{
            this.viewNode.BlockContent.StopEff();
        }

        //console.log(info.i, info.j);
    }

    OnDragEnd(evt: fgui.Event){
        var btn: fgui.GLabel = <fgui.GLabel>evt.sender!;
        this.viewNode.BlockContent.StopEff();
        if(this.dragBtn && btn != this.dragBtn){
            return;
        }
        let imgName = btn.name == "Prop1" ? "WeiGuaZuanTou" : "YingTaoDaPao";
        UH.SpriteName(btn, "Mining", imgName);
        this.UseProp(btn);
        this.MoveObj(btn, this.propPos, ()=>{
            this.dragBtn = null;
        });
    }

    private tweener:fgui.GTweener;
    MoveObj(obj:fgui.GObject, pos:Vec2, finishFunc?:()=>any){
        this.tweener = fgui.GTween.to2(obj.x,obj.y, pos.x, pos.y,0.3);
        this.tweener.setEase(fgui.EaseType.QuadOut);
        this.tweener.onUpdate((tw:fgui.GTweener)=>{
            obj.x = tw.value.x;
            obj.y = tw.value.y;
        })
        this.tweener.onComplete(()=>{
            if(finishFunc){
                finishFunc();
            }
            this.tweener = null;
        });
    }

    // 使用道具
    private timer_handle: TYPE_TIMER;
    private useProping: boolean = false;
    UseProp(btn: fgui.GLabel):boolean{
        if(btn == null){
            return false;
        }

        if(this.useProping){
            return false;
        }

        if (this.timer_handle) {
            Timer.Inst().CancelTimer(this.timer_handle);
            this.timer_handle = null;
            return false;
        }

        let globalPos = btn.localToGlobal();
        let posInfo = this.viewNode.BlockContent.GetItemInfoByPos(globalPos.x, globalPos.y);
        let block = posInfo.item;
        if(block == null || block.GetData().coldType != MiningBlockType.None){
            return false
        }

        let btnName = btn.name;
        let item_id:number;
        let req_type:MiningReqType;
        let rangeType:MiningRangeType;
        let animaEffect:MiningTouchEffectType;
        if(btnName == "Prop1"){
            item_id = MiningData.Inst().GetBitItemId();
            req_type = MiningReqType.Drill;
            rangeType = MiningRangeType.DiZuan;
            animaEffect = MiningTouchEffectType.ZuanTouAnim;
        }else{
            item_id = MiningData.Inst().GetBombItemId();
            req_type = MiningReqType.Domb;
            rangeType = MiningRangeType.ZaDan;
            animaEffect = MiningTouchEffectType.ZaDanAnim;
        }
        let itemNum = Item.GetNum(item_id);
        if(itemNum <= 0){
            let itemName = Item.GetName(item_id);
            PublicPopupCtrl.Inst().Center(itemName + Language.Mining.ItemNotTip);
            return false;
        }

        this.useProping = true;

        let effectGlobalPos = posInfo.item.localToGlobal();
        this.viewNode.BlockContent.PlayAnim(animaEffect, effectGlobalPos);
        if(rangeType == MiningRangeType.ZaDan){
            AudioManager.Inst().PlayUIAudio(AudioTag.ZhaDan);
            this.timeOutHt2 = setTimeout(() => {
                this.DoUseProp(rangeType,posInfo.i,posInfo.j);
            }, 700);
        }else{
            AudioManager.Inst().PlayUIAudio(AudioTag.ZuanTou);
            this.DoUseProp(rangeType,posInfo.i,posInfo.j);
        }
    }

    DoUseProp(rangeType:MiningRangeType, posi:number, posj:number){
        let req_type = rangeType == MiningRangeType.ZaDan ? MiningReqType.Domb : MiningReqType.Drill;
        let rangeItems = this.viewNode.BlockContent.GetRangePitItems(rangeType, posi, posj);
        if(rangeItems.length == 0){
            MiningCtrl.Inst().SendReq(req_type, posi, posj);
            this.useProping = false;
        }else if(rangeType == MiningRangeType.DiZuan){
            let len = rangeItems.length;
            let times = len <= 3 ? 1 : len - 2
            this.timer_handle = Timer.Inst().AddRunTimer(() => {
                if(rangeItems.length > 0){
                    if (rangeItems.length <= 3) {
                        let is_send = true;
                        for(let _item of rangeItems){
                            if(_item.IsMask()){
                                _item.HideMask();
                            }
                            _item.HideProgress();
                            if(is_send){
                                _item.PlayEff(MiningPititemEffect.BaoZha, (item)=>{
                                    MiningCtrl.Inst().SendReq(req_type, posi, posj);
                                    Timer.Inst().CancelTimer(this.timer_handle);
                                    this.timer_handle = null;
                                    this.useProping = false;
                                });
                                is_send = false;
                            }else{
                                _item.PlayEff(MiningPititemEffect.BaoZha);
                            }
                        }
                        rangeItems.length = 0;
                    } else {
                        let _item = rangeItems.shift();
                        if(_item.IsMask()){
                            _item.HideMask();
                        }
                        _item.HideProgress();
                        _item.PlayEff(MiningPititemEffect.BaoZha);
                    }
                }
            }, 0.1, times, false)
        }else if(rangeType = MiningRangeType.ZaDan){
            let arr = [1,8,4]
            let index = 0;
            this.timer_handle = Timer.Inst().AddRunTimer(() => {
                for(let i = 0; index < arr.length && i < arr[index]; i++){
                    if(rangeItems.length > 0){
                        let _item = rangeItems.shift();
                        if(_item){
                            if(rangeItems.length == 0){
                                _item.PlayEff(MiningPititemEffect.BaoZha, (item)=>{
                                    MiningCtrl.Inst().SendReq(req_type, posi, posj);
                                    Timer.Inst().CancelTimer(this.timer_handle);
                                    this.timer_handle = null;
                                    this.useProping = false;
                                });
                            }else{
                                _item.PlayEff(MiningPititemEffect.BaoZha);
                            }
                            if(_item.IsMask()){
                                _item.HideMask();
                            }
                        }
                    }
                }
                index++;
            }, 0.1, 3, false)
        }
    }

    // 矿稿恢复广告按钮
    OnAdExcavateClick(){
        let iscanad = RoleData.Inst().IsCanAD(AdType.mining_excavate);
        if(!iscanad){
            return;
        }
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.mining_excavate), "");
    }

    PlayItemGetShow(worldPos:Vec2, data:IPB_ItemData){
        let item = this.itemShowTipPool.Get();
        let pos = this.view.globalToLocal(worldPos.x, worldPos.y);
        item.setPosition(pos.x, pos.y + 50);
        item.SetData(data);
        item.Play();
    }

    PlayFlyItem(worldPos:Vec2, data:IPB_ItemData){
        AudioManager.Inst().PlayUIAudio(AudioTag.WaJueHuoBi);
        let pos = this.view.globalToLocal(worldPos.x, worldPos.y);
        let ePos = this.GetIconPos(data.itemId);
        let time_ht = Timer.Inst().AddRunTimer(()=>{
            let item = this.itemFiyPool.Get();
            item.visible = true;
            item.SetData(data);
            let sX = MathHelper.GetRandomNum(-30,30);
            let sPos = new Vec2(pos.x + sX, pos.y);
            item.Play(sPos, ePos , this.OnFlyFinish.bind(this));
        }, 0.05, 10, false);
        this.timerHtList.add(time_ht);          
    }

    GetIconPos(itemId:number):Vec2{
        switch(itemId){
            case MiningData.Inst().GetGemItemId(): return new Vec2(this.viewNode.GemIcon.x + 4, this.viewNode.GemIcon.y + 10);
            case MiningData.Inst().GetExcavateItemId(): return new Vec2(this.viewNode.ExIcon.x + 11 , this.viewNode.ExIcon.y + 10);
            case CommonId.Gold: return new Vec2(this.viewNode.CurrGold.x - 16, this.viewNode.CurrGold.y);
            case CommonId.Diamond: return new Vec2(this.viewNode.CurrDiamond.x - 16, this.viewNode.CurrDiamond.y);
        }
        return new Vec2(0,0);
    }

    private OnFlyFinish(item: MiningIconFly){
        item.visible = false;
        this.itemFiyPool.Put(item);
    }
}

export interface IMiningPitItemData{
    seq: number;
    block_type: number;
}


export class MiningBlockContent extends BaseItem{
    protected viewNode = {
        Content:<fgui.GComponent>null,
        Effect1:<UIEffectShow>null,
        AnimationEffect: <UIEffectShow>null,
    };

    private tweener:fgui.GTweener;
    private itemPool: SmallObjPool<MiningPitItem>;
    private itemMap: Map<number, MiningPitItem>;

    private _isMoveing = false;
    get isMoveing():boolean{
        return this._isMoveing;
    }

    get centerItem():MiningPitItem{
        let index = BattleHelper.IJTonum2(3,2, MINING_MAP_COL);
        return this.itemMap.get(index);
    }

    protected onConstruct() {
        super.onConstruct();
        this.itemMap = new Map<number, MiningPitItem>();

        this.itemPool = new SmallObjPool(undefined, 100);
        this.itemPool.isNode = false;
        this.itemPool.SetCreateFunc(() => {
            let pitItem = <MiningPitItem>fgui.UIPackage.createObject("Mining", "PitItem").asCom;
            this.viewNode.Content.addChild(pitItem);
            return pitItem;
        })
        this.itemPool.SetDestroyFunc((item: MiningPitItem) => {
            item.dispose();
            item = null;
        })
    }

    
    private item_3_3_pos:Vec2;

    public SetData(data: IPB_SCMiningCaveCold[]): void {
        super.SetData(data);
        this.ClearItem();
        this.InitContentPos();
        data.forEach((v, index)=>{
            this.CreateItem(v, index);
        })
        this.touchTimeMark = null;

        // 注册指引
        let item = this.GetItemByIJ(2,2);
        if(item){
            GuideCtrl.Inst().AddGuideUi("MiningPitItem3_3", item);
            if(RoleData.Inst().IsGuideNum(4, false)){
                this.item_3_3_pos = item.localToGlobal();
            }
        }
    }

    GetPos(i: number, j: number): Vec2 {
        let pos = new Vec2();
        pos.x = j * MINING_CELL_WIDTH - j * 4;
        pos.y = i * MINING_CELL_WIDTH - i * 4;
        return pos;
    }


    CreateItem(data: IPB_SCMiningCaveCold, index: number){
        // if(data.coldType == MiningBlockType.None){
        //     return;
        // }
        let item = this.itemPool.Get();
        item.SetData(data);
        this.itemMap.set(index, item);

        let ij = BattleHelper.NumToIJ(index, MINING_MAP_COL);
        let pos = this.GetPos(ij.y, ij.x);
        item.setPosition(pos.x, pos.y);

        item.onClick(this.OnItemClick, this);
    }

    ClearItem(){
        this.itemMap.forEach((value, key)=>{
            this.itemPool.Put(value);
        });
        this.itemMap.clear();
    }

    private touchTimeMark:number;
    private timeOutHt:any;
    OnItemClick(evt: fgui.Event){
        // 防快速点击，等服务端刷新了才可点下一次
        if(this.touchTimeMark && game.totalTime - this.touchTimeMark < 2000){
            return;
        }
        if(this._isMoveing){
            return;
        }

        let item:MiningPitItem = <MiningPitItem>evt.sender!;

        if(item.coldType == MiningBlockType.None || item.isPlaying){
            return;
        }

        // if (!RoleData.Inst().IsGuideNum(4, false) && RoleData.Inst().IsGuideNum(5, false)){
        //     this.timeOutHt = setTimeout(() => {
        //         GuideCtrl.Inst().Start(5);
        //     }, 700);
        // } 

        let itemPos = this.item_3_3_pos ?? item.localToGlobal();
        this.item_3_3_pos = null;
        let effectPos = this.globalToLocal(itemPos.x, itemPos.y);
        this.viewNode.Effect1.setPosition(effectPos.x + MINING_CELL_WIDTH / 2, effectPos.y + MINING_CELL_WIDTH / 2);

        if(!MiningData.Inst().IsCanExcavate()){
            this.viewNode.Effect1.PlayEff(MiningTouchEffectType.JinZhi);
            PublicPopupCtrl.Inst().Center(Item.GetName(MiningData.Inst().GetExcavateItemId()) + Language.Mining.ItemNotTip);
            return;
        }

        if(item.IsMask()){
            this.viewNode.Effect1.PlayEff(MiningTouchEffectType.JinZhi);
            PublicPopupCtrl.Inst().Center(Language.Mining.ClickTip);
            return;
        }
        this.viewNode.AnimationEffect.setPosition(effectPos.x + MINING_CELL_WIDTH / 2, effectPos.y + MINING_CELL_WIDTH / 2);
        this.viewNode.AnimationEffect.PlayEff(MiningTouchEffectType.TieGaoAnim);

        let index = MiningData.Inst().GetSceneInfo().coldList.indexOf(item.GetData());
        let ij = BattleHelper.NumToIJ(index, MINING_MAP_COL);

        //MiningCtrl.Inst().SendReq(MiningReqType.Excvate, ij.y, ij.x);
        this.viewNode.Effect1.PlayEff(MiningTouchEffectType.WaJue);
        //if(item.coldType == MiningBlockType.ShiKuai || item.coldType == MiningBlockType.NiTuKuai){
            AudioManager.Inst().PlayUIAudio(AudioTag.WaJue);
        //}

        if(item.remainExcavateCount > 1){
            //console.log("当前矿稿数量", Item.GetNum(40062));
            MiningCtrl.Inst().SendReq(MiningReqType.Excvate, ij.y, ij.x);
            let eff = item.coldType == MiningBlockType.ShiKuai ? MiningPititemEffect.ShiKuai : MiningPititemEffect.TuKuai;
            item.PlayEff2(eff);
        }else{
            if(item.coldType == MiningBlockType.ShiKuai){
                item.PlayEff(MiningPititemEffect.ShiKuai, (item:MiningPitItem)=>{
                    //console.log("当前矿稿数量", Item.GetNum(40062));
                    MiningCtrl.Inst().SendReq(MiningReqType.Excvate, ij.y, ij.x);
                });
            }else{
                item.PlayEff(MiningPititemEffect.TuKuai, (item:MiningPitItem)=>{
                    //console.log("当前矿稿数量", Item.GetNum(40062));
                    MiningCtrl.Inst().SendReq(MiningReqType.Excvate, ij.y, ij.x);
                });
            }

            // let _data = <IPB_SCMiningCaveCold>item.GetData()
            // _data.coldType = MiningBlockType.None;
            // MiningData.Inst().AddRouteData(_data);

            let rangeItems = this.GetRangePitItems(MiningRangeType.YiQuan, ij.y, ij.x);
            rangeItems.forEach(_item=>{
                if(_item.IsMask()){
                    _item.HideMask();
                }
            })
        }

        this.touchTimeMark = game.totalTime;
        MiningData.Inst().excavateInfo.blockType = item.coldType;
        MiningData.Inst().excavateInfo.pos = itemPos;
        GuideCtrl.Inst().ClearGuideUi("MiningPitItem3_3");
    }

    //视角向下移动x格
    MoveDown(num: number, finishFunc?:()=>any){
        if(this._isMoveing){
            return;
        }
        this._isMoveing = true; 
        let time = 0.25 * num;
        let curY = this.viewNode.Content.y;
        this.tweener = fgui.GTween.to(curY,curY - MINING_CELL_WIDTH * num + (num - 1) * 4 + 4 ,time);
        this.tweener.setEase(fgui.EaseType.QuadOut);
        this.tweener.onUpdate((tw:fgui.GTweener)=>{
            this.viewNode.Content.y = tw.value.x;
        })
        this.tweener.onComplete(()=>{
            if(finishFunc){
                finishFunc();
            }
            this.tweener = null;
            this._isMoveing = false;
        });
    }

    InitContentPos(){
        this.viewNode.Content.y = 0;
    }

    //通过位置获取Item
    GetItemInfoByPos(x:number, y:number):PitItemPosInfo{
        let localPos = this.globalToLocal(x, y);
        let info = <PitItemPosInfo>{i:-1,j:-1};

        let maxY = 7 * MINING_CELL_WIDTH - 7 * 4;
        let maxX = 6 * MINING_CELL_WIDTH - 6 * 4;

        for(let i = 6; i >= 0; i--){
            let _y = i * MINING_CELL_WIDTH - i * 4;
            if(localPos.y >= _y && localPos.y < maxY){
                info.i = i;
                break;
            }
        }
        for(let j = 5; j >= 0; j--){
            let _x = j * MINING_CELL_WIDTH - j * 4;
            if(localPos.x >= _x && localPos.x < maxX){
                info.j = j
                break;
            }
        }

        if(info.i < 0 || info.j < 0){
            return info;
        }
        
        info.isShowEffect = true;
        let index = BattleHelper.IJTonum2(info.i,info.j, MINING_MAP_COL);
        let item = this.itemMap.get(index);
        info.index = index;
        info.item = item;
        return info;
    }

    GetItemByIJ(i:number, j:number): MiningPitItem{
        let index = BattleHelper.IJTonum2(i, j, MINING_MAP_COL);
        let item = this.itemMap.get(index);
        return item;
    }

    protected onDisable(): void {
        super.onDisable();
        if (this.tweener) {
            UtilHelper.KillFGuiTweenr(this.tweener);
            this.tweener = null;
        }

        if (this.timeOutHt) {
            clearTimeout(this.timeOutHt);
            this.timeOutHt = null;
        }
    }

    //获取范围内的格子
    GetRangePitItems(rangeType:MiningRangeType, i:number, j:number): MiningPitItem[]{
        let list: MiningPitItem[] = [];
        let indexList: number[] = [];
        if(rangeType == MiningRangeType.YiQuan){
            for(let n = -1; n <= 1; n++){
                if(n != 0){
                    let iv = i + n;
                    if(iv < MINING_MAP_ROW && iv >= 0){
                        indexList.push(BattleHelper.IJTonum2(iv, j, MINING_MAP_COL));
                    }
                    let jv = j + n;
                    if(jv < MINING_MAP_COL && jv >= 0){
                        indexList.push(BattleHelper.IJTonum2(i, jv, MINING_MAP_COL));
                    }
                }
            }
        }else if(rangeType == MiningRangeType.DiZuan){
            for(let n = 0; n < MINING_MAP_ROW; n++){
                indexList.push(BattleHelper.IJTonum2(n, j, MINING_MAP_COL));
            }
            if(j + 1 < MINING_MAP_COL){
                indexList.push(BattleHelper.IJTonum2(MINING_MAP_ROW - 1, j + 1, MINING_MAP_COL));
            }
            if(j - 1 >= 0){
                indexList.push(BattleHelper.IJTonum2(MINING_MAP_ROW - 1, j - 1, MINING_MAP_COL));
            }
        }else if(rangeType == MiningRangeType.ZaDan){
            indexList.push(BattleHelper.IJTonum2(i, j, MINING_MAP_COL));
            for(let n = -1; n <= 1; n++){
                if(n != 0){
                    let iv = i + n;
                    let jv = j + n;
                    if(iv < MINING_MAP_ROW && iv >= 0 && jv < MINING_MAP_COL && jv >= 0){
                        indexList.push(BattleHelper.IJTonum2(iv, jv, MINING_MAP_COL));
                    }
                }
            }
            for(let n = -1; n <= 1; n++){
                if(n != 0){
                    let iv = i - n;
                    let jv = j + n;
                    if(iv < MINING_MAP_ROW && iv >= 0 && jv < MINING_MAP_COL && jv >= 0){
                        indexList.push(BattleHelper.IJTonum2(iv, jv, MINING_MAP_COL));
                    }
                }
            }

            let func3 = function(n:number){
                if(n != 0){
                    let iv = i + n;
                    if(iv < MINING_MAP_ROW && iv >= 0){
                        indexList.push(BattleHelper.IJTonum2(iv, j, MINING_MAP_COL));
                    }
                    let jv = j + n;
                    if(jv < MINING_MAP_COL && jv >= 0){
                        indexList.push(BattleHelper.IJTonum2(i, jv, MINING_MAP_COL));
                    }
                }
            }
            func3(-1);
            func3(1);
            func3(2);
            func3(-2);            
        }

        indexList.forEach(index=>{
            let item = this.itemMap.get(index);
            // if(item && item.coldType != MiningBlockType.None){
            //     list.push(item);
            // }
            if(item || rangeType == MiningRangeType.ZaDan){
                list.push(item);
            }
        })

        return list;
    }

    //播放特效
    private _effectType: MiningTouchEffectType;
    PlayEff(effType:MiningTouchEffectType, globalPos:Vec2){
        if(this._effectType && this._effectType != effType){
            this.StopEff();
        }
        this._effectType = effType;
        let pos = this.globalToLocal(globalPos.x, globalPos.y);
        this.viewNode.Effect1.setPosition(pos.x + MINING_CELL_WIDTH / 2, pos.y + MINING_CELL_WIDTH / 2);
        this.viewNode.Effect1.PlayEff(effType);
    }
    StopEff(){
        //this.viewNode.Effect1.StopEff(this._effectType);
        this.viewNode.Effect1.StopAllEff();
    }

    PlayAnim(effType:MiningTouchEffectType, globalPos:Vec2){
        this.viewNode.AnimationEffect.StopAllEff();
        let pos = this.globalToLocal(globalPos.x, globalPos.y);
        this.viewNode.AnimationEffect.setPosition(pos.x + MINING_CELL_WIDTH / 2, pos.y + MINING_CELL_WIDTH / 2);
        this.viewNode.AnimationEffect.PlayEff(effType);
        if(effType == MiningTouchEffectType.ZuanTouAnim){
            this.PlayZuanTou(pos.x + MINING_CELL_WIDTH / 2);
        }
    }

    PlayZuanTou(x:number){
        this.viewNode.AnimationEffect.setPosition(x, 0);
        this.getTransition("zuantou").play(()=>{
            this.viewNode.AnimationEffect.StopEff(MiningTouchEffectType.ZuanTouAnim);
        });
    }
}


//格子
export class MiningPitItem extends BaseItem{
    protected _data: IPB_SCMiningCaveCold;

    protected viewNode = {
        Icon: <fgui.GLoader>null,
        Mask: <fgui.GObject>null,
        UIEffectShow: <UIEffectShow>null,
    };

    protected onConstruct() {
        super.onConstruct();
    }

    get coldType():number{
        return this._data.coldType;
    }

    //还要挖几次
    get remainExcavateCount():number{
        let num = this._data.excavateCount;
        let cfg = MiningData.Inst().GetBlockCfg(this.coldType);
        return cfg.excavations_num - num;
    }

    private _isPlaying = false;
    get isPlaying():boolean{
        return this._isPlaying;
    }

    private progress:fgui.GProgressBar;

    public SetData(data: IPB_SCMiningCaveCold): void {
        super.SetData(data);
        this.viewNode.Icon.visible = data.coldType != MiningBlockType.None;
        if(this.viewNode.Icon.visible){
            if(data.coldType == MiningBlockType.ShiKuai && data.excavateCount > 0){
                UH.SpriteName(this.viewNode.Icon, "Mining", "Kuai_2_2");
                if(this.progress == null){
                    this.progress = <fgui.GProgressBar>fgui.UIPackage.createObject("Mining", "ProgressBar").asCom;
                    this.addChild(this.progress);
                    this.progress.setPosition(14,78);
                }
                this.progress.visible = true;
                let cfg = MiningData.Inst().GetBlockCfg(this.coldType);
                this.progress.min = 0;
                this.progress.max = cfg.excavations_num;
                this.progress.value = data.excavateCount;
            }else{
                UH.SpriteName(this.viewNode.Icon, "Mining", "Kuai_" + data.coldType);
                if(this.progress){
                    this.progress.visible = false;
                }
            }
        }else{
            if(this.progress){
                this.progress.visible = false;
            }
        }
        let isMask = MiningData.Inst().IsMask(data);
        this.viewNode.Mask.visible = isMask;
    }

    IsMask():boolean{
        return this.viewNode.Mask.visible;
    }

    HideMask(){
        this.viewNode.Mask.visible = false;
    }

    HideProgress(){
        if(this.progress){
            this.progress.visible = false;
        }
    }

    //private effectType:MiningPititemEffect;
    PlayEff(effectType:MiningPititemEffect, finishFunc?:(item:MiningPitItem)=>any){
        this._isPlaying = true;
        this.StopEff();
        this.sortingOrder += 100;
        this.viewNode.UIEffectShow.PlayEff(effectType);
        if(this.coldType == MiningBlockType.None){
            this._isPlaying = false;
            if(finishFunc){
                finishFunc(this);
            }
            return;
        }

        this.getTransition("hide").play(()=>{
            this._isPlaying = false;
            if(finishFunc){
                finishFunc(this);
            }
        });

        this.HideProgress();
    }
    StopEff(){
        this.viewNode.UIEffectShow.StopAllEff();
    }

    //只播特效。。
    PlayEff2(effectType:MiningPititemEffect){
        this.viewNode.UIEffectShow.PlayEff(effectType);
    }
}

export class MiningRewardLabel extends BaseItem{
    protected _data: CfgMiningMetersReward;

    protected viewNode = {
        GIcon: <EGLoader>null,
        title: <fgui.GTextField>null,
    };

    public SetData(data: CfgMiningMetersReward): void {
        this._data = data;
        UH.SetText(this.viewNode.title, data.meters + "m");
        let iconId = Item.GetIconId(data.reward[0].item_id);
        UH.SetIcon(this.viewNode.GIcon, iconId, ICON_TYPE.ITEM);
    }
}


export class MiningGetShowTip extends BaseItem{
    protected _data: IPB_ItemData;

    protected viewNode = {
        icon: <EGLoader>null,
        title: <fgui.GTextField>null,
    };

    private moveAnim:fgui.Transition;
    protected onConstruct() {
        super.onConstruct();
        this.moveAnim = this.getTransition("move");
    }

    public SetData(data: IPB_ItemData): void {
        this._data = data;

        let icon_id = Item.GetIconId(data.itemId);
        UH.SetIcon(this.viewNode.icon, icon_id, ICON_TYPE.ITEM, null, true);
        UH.SetText(this.viewNode.title, "+" + data.num);
    }

    Play(){
        this.moveAnim.play();
    }
}

export class MiningIconFly extends BaseItem{
    protected _data: IPB_ItemData;
    protected viewNode = {
        icon: <EGLoader>null,
    };

    private TwShow: fgui.GTweener = null;

    protected onConstruct() {
        super.onConstruct();
    }

    public SetData(data: IPB_ItemData): void {
        this._data = data;

        let icon_id = Item.GetIconId(data.itemId);
        UH.SetIcon(this.viewNode.icon, icon_id, ICON_TYPE.ITEM, null, true);
    }

    
    Play(sPos:Vec2, ePos:Vec2, finishFunc?:(item:MiningIconFly)=>any){
        if(this.TwShow){
            return;
        }

        let tweener = fgui.GTween.to2(sPos.x, sPos.y, ePos.x, ePos.y, 1);
        this.TwShow = tweener;
        tweener.setEase(fgui.EaseType.QuadOut);
        tweener.onUpdate((tw:fgui.GTweener)=>{
            this.setPosition(tw.value.x, tw.value.y);
        })
        tweener.onComplete(()=>{
            if(finishFunc){
                finishFunc(this)
            }
            this.TwShow = null;
        });
    }

    protected onDisable(): void {
        super.onDisable();
        if (this.TwShow) {
            UtilHelper.KillFGuiTweenr(this.TwShow);
            this.TwShow = null;
        }
    }
}
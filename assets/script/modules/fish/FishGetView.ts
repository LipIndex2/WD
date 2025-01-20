
import { GetCfgValue } from "config/CfgCommon";
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { COLORS } from "modules/common/ColorEnum";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { Language } from "modules/common/Language";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { TextHelper } from "../../helpers/TextHelper";
import { UH } from "../../helpers/UIHelper";
import { FishConfig } from "./FishConfig";
import { FishCtrl } from "./FishCtrl";
import { FishData } from "./FishData";

@BaseView.registView
export class FishGetView extends BaseView {
    private sp_show1: UISpineShow = undefined;
    private sp_show2: UISpineShow = undefined;
    private sp_show: UISpineShow = undefined;

    protected viewRegcfg = {
        UIPackName: "FishGet",
        ViewName: "FishGetView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        BtnSell: <fgui.GButton>null,
        BtnBox: <fgui.GButton>null,
        BtnOrder: <fgui.GButton>null,
        GpSell: <fgui.GGroup>null,
        GpRecord: <fgui.GGroup>null,

        PriceSp: <fgui.GLoader>null,

        NameShow: <fgui.GTextField>null,
        DescShow: <fgui.GTextField>null,
        TpyeShow: <fgui.GTextField>null,
        LengthShow: <fgui.GTextField>null,
        ScoreShow: <fgui.GTextField>null,
        PriceShow: <fgui.GTextField>null,
    };

    DoOpenWaitHandle() {
        this.sp_show1 = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208123"), true, (obj: any) => {
            obj.setPosition(400, -700);
            this.view._container.insertChild(obj, 0);
        });
        let info = FishData.Inst().InfoFish
        let co_fish = FishData.Inst().CfgFishInfoByFishId(info.fishId)
        if (co_fish) {
            if (co_fish.quality > 2)
                this.sp_show2 = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208018"), true, (obj: any) => {
                    obj.setPosition(400, -800);
                    this.view._container.insertChild(obj, 0);
                });
        }
    }

    CloseCallBack(): void {
        if (this.sp_show) {
            ObjectPool.Push(this.sp_show);
        }
        if (this.sp_show1) {
            ObjectPool.Push(this.sp_show1);
        }
        if (this.sp_show2) {
            ObjectPool.Push(this.sp_show2);
        }
        FishData.Inst().FishState = FishConfig.FishState.idle
    }

    InitData() {
        this.viewNode.BtnSell.onClick(this.OnClickSell, this);
        this.viewNode.BtnBox.onClick(this.OnClickBox, this);
        this.viewNode.BtnOrder.onClick(this.OnClickOrder, this);
    }

    InitUI() {
        this.FlushShow()
    }

    FlushShow() {
        let info = FishData.Inst().InfoFish
        let co_fish = FishData.Inst().CfgFishInfoByFishId(info.fishId)
        if (co_fish) {
            let sell = FishData.Inst().GetBoxInfoLengthSell(co_fish, info.fishLen)
            UH.SetText(this.viewNode.NameShow, co_fish.name)
            this.viewNode.NameShow.color = GetCfgValue(COLORS, `FishQua${Item.GetColor(co_fish.item_id)}`)
            UH.SetText(this.viewNode.DescShow, Item.GetDesc(co_fish.item_id))
            UH.SetText(this.viewNode.TpyeShow, Language.Fish.TypeShow[co_fish.type])
            UH.SetText(this.viewNode.LengthShow, TextHelper.Format(Language.Fish.Get.LengthShow, info.fishLen / 100))
            UH.SetText(this.viewNode.ScoreShow, TextHelper.Format(Language.Fish.BoxInfo.ScoreShow, Math.floor(co_fish.score * info.fishLen / 10)))
            UH.SetText(this.viewNode.PriceShow, FishData.Inst().GetSellPrice(sell[0].num))
            // UH.SetIcon(this.viewNode.FishSp, Item.GetIconId(co_fish.item_id), ICON_TYPE.ITEM)
            UH.SetIcon(this.viewNode.PriceSp, sell[0].item_id, ICON_TYPE.ITEM)

            this.sp_show = ObjectPool.Get(UISpineShow, ResPath.Fish(co_fish.res_id), true, (obj: any) => {
                obj.setPosition(400, -700);
                obj.setScale(co_fish.scale, co_fish.scale);
                this.view._container.insertChild(obj, 2);
            });

            let ifl = FishData.Inst().InfoFishList
            let show_box = false
            let show_order = false
            if (info.fishLen > ifl[info.fishId].fishLen) {
                this.viewNode.BtnBox.visible = true
                this.viewNode.GpRecord.visible = true
                show_box = true
            }
            for (let element of FishData.Inst().InfoTaskInfo) {
                if (!show_order && element.taskId > 0) {
                    let co_order = FishData.Inst().CfgDailyOrderByOrderId(element.taskId)
                    if (0 == element.isFetch) {
                        if (element.processNum < co_order.parm1) {
                            switch (co_order.order_type) {
                                case 1:
                                    show_order = co_fish.type == co_order.parm2
                                    break;
                                case 2:
                                    show_order = co_fish.fish_id == co_order.parm2
                                    break;
                            }
                        }
                    }
                }
            }
            if (show_order) {
                this.viewNode.BtnOrder.x = show_box ? 78 : 252
                this.viewNode.BtnOrder.visible = true
            } else {
                this.viewNode.GpSell.x = show_box ? 78 : 252
                this.viewNode.GpSell.visible = true
            }
        }
    }

    OnClickSell() {
        ViewManager.Inst().CloseView(FishGetView)
        FishCtrl.Inst().SendRoleFishReqSell()
    }

    OnClickBox() {
        ViewManager.Inst().CloseView(FishGetView)
        let info = FishData.Inst().InfoFish
        let list = FishData.Inst().InfoFishList
        if (list[info.fishId].fishLen > 0) {
            // FishCtrl.Inst().SendRoleFishReqSellFish(info.fishId)
            let co_fish = FishData.Inst().CfgFishInfoByFishId(info.fishId)
            if (co_fish) {
                let sell = FishData.Inst().GetBoxInfoLengthSell(co_fish, info.fishLen)
                FishData.Inst().SellPrice = FishData.Inst().GetSellPrice(sell[0].num)
            }
        } else {
            FishData.Inst().BoxRedNum = 1
        }
        FishCtrl.Inst().SendRoleFishReqPut()
    }

    OnClickOrder() {
        ViewManager.Inst().CloseView(FishGetView)
        FishCtrl.Inst().SendRoleFishReqSubTask()
    }
}

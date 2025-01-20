
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { Item } from "modules/bag/ItemData";
import { BaseItemCare } from "modules/common/BaseItem";
import { Language } from "modules/common/Language";
import { FlyIcon } from "modules/extends/FlyIcon";
import { UISpinePlayData, UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ResPath } from "utils/ResPath";
import { FishConfig } from "./FishConfig";
import { FishData } from "./FishData";

export class FishViewFishPanel extends BaseItemCare {
    private spShow1: UISpineShow = undefined;
    private spShow2: UISpineShow = undefined;
    private toolLoad: boolean

    protected viewNode = {
        BtnFish: <fgui.GButton>null,
        BtnStart: <fgui.GButton>null,
        BtnStop: <fgui.GButton>null,

        FishTips: <fgui.GLabel>null,
    }

    InitData() {
        this.viewNode.BtnFish.onClick(this.OnClickFish, this);
        this.viewNode.BtnStart.onClick(this.OnClickAuto, this);
        this.viewNode.BtnStop.onClick(this.OnClickAuto, this);
        this.viewNode.FishTips.title = Language.Fish.Main.FishTips

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushState.bind(this), "FishState");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushFlyIcon.bind(this), "SellPrice");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FishSkin.bind(this), "FlushToolInfo");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FishSkinLine.bind(this), "LineShow");
        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushFish.bind(this), "FishShow");

        this.AddSmartDataCare(FishData.Inst().FlushData, this.FlushAuto.bind(this), "IsAutoFish", "FlushCommonInfo");

        this.spShow1 = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208125"), true, (obj: any) => {
            obj.setPosition(400, -600);
            this._container.insertChild(obj, 1);
            this.toolLoad = true
            this.FlushState()
            this.FishSkin()
            this.FlushFish()
        });
    }

    InitUI() {
        this.FlushState()
        this.FishSkin()
        this.FlushAuto()
    }

    FlushState() {
        let state = FishData.Inst().FishState
        this.viewNode.FishTips.visible = FishConfig.FishState.idle == state
        if (!this.toolLoad || !this.spShow1) {
            return
        }
        let playData = ObjectPool.Get(UISpinePlayData);
        playData.name = FishConfig.FishAnimName[state]
        playData.loop = FishConfig.FishAnimLoop[state];
        playData.timeScale = FishData.Inst().InfoFishCardTime > TimeCtrl.Inst().ServerTime ? 2 : 1
        this.spShow1.play(playData, true)
    }

    FishSkin() {
        if (!this.toolLoad || !this.spShow1) {
            return
        }
        FishData.Inst().FishSkin(this.spShow1)
    }

    FishSkinLine() {
        if (!this.toolLoad || !this.spShow1) {
            return
        }
        FishData.Inst().FishSkin(this.spShow1, undefined, true)
    }

    FlushFish() {
        if (this.spShow2) {
            ObjectPool.Push(this.spShow2);
            this.spShow2 = undefined
        }
        if (!this.toolLoad || !this.spShow1 || !FishData.Inst().FishShow) {
            return
        }
        let info = FishData.Inst().InfoFish
        let co_fish = FishData.Inst().CfgFishInfoByFishId(info.fishId)

        if (co_fish) {
            this.spShow2 = ObjectPool.Get(UISpineShow, ResPath.Fish(co_fish.res_id), true, (obj: any) => {
                obj.setScale(co_fish.scale, co_fish.scale);
                this.spShow1.addObj("fish", obj)
            });
        }
    }

    private _arr_coin: FlyIcon[] = [];
    FlushFlyIcon() {
        let price = FishData.Inst().SellPrice
        if (price > 0) {
            let d = Math.floor(price / 5)//
            d = d == 0 ? 1 : d
            for (let index = 1; index < 6; index++) {
                if (price > 0) {
                    let flyIcon = this._arr_coin[index];
                    if (!flyIcon) {
                        flyIcon = this._arr_coin[index] = <FlyIcon>fgui.UIPackage.createObject("CommonWidgets", "FlyIcon", FlyIcon)
                        flyIcon.scaleX = 1.5
                        flyIcon.scaleY = 1.5
                        this.addChild(flyIcon)
                    }
                    if (price - d < 0) {
                        flyIcon.PlayTween(price, 400, 1000, Item.GetIconId(FishData.Inst().CfgOtherFishCoin))
                    } else {
                        flyIcon.PlayTween(+d, 400, 1000, Item.GetIconId(FishData.Inst().CfgOtherFishCoin))
                    }
                    price = price - d
                }
            }
        }
    }

    FlushAuto() {
        let is_show = FishData.Inst().InfoFishCardTime > TimeCtrl.Inst().ServerTime
        this.viewNode.BtnStart.visible = is_show && !FishData.Inst().IsAutoFish
        this.viewNode.BtnStop.visible = is_show && FishData.Inst().IsAutoFish
    }

    OnClickFish() {
        FishData.Inst().FishStart()
    }

    OnClickAuto() {
        FishData.Inst().AutoFish()
    }

    protected onDisable(): void {
        super.onDisable()
        if (this.spShow1) {
            ObjectPool.Push(this.spShow1);
            this.spShow1 = undefined
        }
        if (this.spShow2) {
            ObjectPool.Push(this.spShow2);
            this.spShow2 = undefined
        }
    }
}

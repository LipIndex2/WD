import { Vec3, sys } from "cc";
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { Mod } from "modules/common/ModuleDefine";
import { RoleData } from "modules/role/RoleData";
import { UH } from "../../helpers/UIHelper";
import { ViewManager } from "manager/ViewManager";
import { ActivityData } from "modules/activity/ActivityData";
import { FunOpen } from "./FunOpen";

@BaseView.registView
export class FunUnlockView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "FunUnlock",
        ViewName: "FunUnlockView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        // ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Icon: <fgui.GLoader>null,
        Name: <fgui.GTextField>null,
        BtnClose: <fgui.GButton>null,
    };
    private data: any;
    private funAct: any;
    TwShow: fgui.GTweener = null;

    InitData(param: any) {

        for (let i = 0; i < FunAct.length; i++) {
            if (param.client_id == FunAct[i].mod_key) {
                this.funAct = FunAct[i];
                break;
            }
        }
        this.viewNode.BtnClose.onClick(this.CloseView, this);
        this.data = param;

        UH.SpriteName(this.viewNode.Icon, "FunUnlock", this.funAct.icon)
        UH.SetText(this.viewNode.Name, param.name + " " + Language.FunOpen.unlock)
    }

    private CloseView() {
        let rand_list = ActivityData.Inst().GetActBtnList(this.funAct.type);
        let index = -1;
        for (let i = 0; i < rand_list.length; i++) {
            if (rand_list[i].mod_key == this.data.client_id) {
                index = i;
                break;
            }
        }
        let close_func = () => {
            ViewManager.Inst().CloseView(FunUnlockView);
            ActivityData.Inst().CheckRandOpenData();
            FunOpen.Inst().OnFunOpenViewChange(this.data.client_id);
        }

        if (index == -1 && this.funAct.type != 3) {
            close_func();
        } else {
            this.view.pivotX = 0.5
            this.view.pivotY = 0.5
            this.view.node.scale = new Vec3(0.9, 0.9, 0);
            let start_real_x = this.view.node.position.x;
            let start_real_y = this.view.node.position.y;
            let end_x: number = 0;
            let end_y: number = 0;
            if (this.funAct.type == 1) {
                end_x = 720;
            } else if (this.funAct.type == 2) {
                end_x = 50;
            } else {
                end_x = 100;
            }
            if (this.funAct.type == 3) {
                end_y = -1500;
            } else {
                end_y = -300 - index * 120;
            }

            let start_x = 400;
            let start_y = -750;

            let dis_x = end_x - start_x
            let dis_y = end_y - start_y

            let show: Function = () => {
                this.TwShow = fgui.GTween.to(start_x, end_x, 0.3)
                    .setEase(fgui.EaseType.Linear)
                    .onUpdate((tweener: fgui.GTweener) => {
                        let bili = +((tweener.value.x - start_x) / dis_x).toFixed(2)
                        this.view.node.scale = new Vec3(1 - bili, 1 - bili, 0);
                        let x = start_real_x + bili * dis_x
                        let y = start_real_y + bili * dis_y;
                        this.view.node.position = new Vec3(x, y, 0);
                    }).onComplete(() => {
                        close_func();
                        this.TwShow = null
                    })
            }
            show();

        }
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }
    }
}

class FunActData {
    icon: string;
    mod_key: number;
    type: number;
}

let FunAct: FunActData[] = [
    { icon: "YouQianHua", mod_key: Mod.SavingPot.View, type: 1 },
    { icon: "RiQian", mod_key: Mod.OpenServiceSevenDay.View, type: 2 },
    { icon: "MiaoBiao", mod_key: Mod.PlaceReturns.View, type: 2 },
    { icon: "JiJinTuBiao", mod_key: Mod.GrowPass.View, type: 2 },
    { icon: "KaPai", mod_key: Mod.SevenDayHero.View, type: 2 },
    { icon: "ZhangJieLiBao", mod_key: Mod.Shop.SaleGift, type: 3 },
]

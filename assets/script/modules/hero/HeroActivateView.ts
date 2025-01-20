import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { HeroDataModel } from "./HeroData";
import { HeroCell } from "modules/extends/HeroCell";
import { UH } from "../../helpers/UIHelper";

import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { Timer } from "modules/time/Timer";
import { EGLoader } from "modules/extends/EGLoader";
import { ObjectPool } from "core/ObjectPool";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { CommonBoard4 } from "modules/common_board/CommonBoard4";
import { GrowUpGiftData } from "modules/GrowUpGift/GrowUpGiftData";

@BaseView.registView
export class HeroActivateView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "HeroLevelUp",
        ViewName: "HeroLevelUpView",
        LayerType: ViewLayer.Normal,
    };

    protected viewNode = {
        Name: <fgui.GTextField>null,
        BtnOnGo: <fgui.GButton>null,
        List: <fgui.GList>null,
        HeroCell: <HeroCell>null,
        DescShow: <fgui.GGroup>null,
        HeroDesc: <fgui.GTextField>null,
        // bg: <EGLoader>null,
        Board: <CommonBoard4>null,
    };

    private heroMode: HeroDataModel;
    private timer_ani: any = null;
    private timer_grayed: any = null;
    private spShow: UISpineShow = undefined;

    InitData(param: HeroDataModel) {
        this.heroMode = param;
        this.view.getController("StateShow").selectedIndex = 1
        this.viewNode.HeroCell.SetData(this.heroMode.hero_id);
        this.viewNode.BtnOnGo.onClick(this.closeView.bind(this));

        // this.viewNode.DescShow.visible = true;
        // this.viewNode.HeroCell.y = 500;
        UH.SetText(this.viewNode.HeroDesc, this.heroMode.data.hero_word)
        UH.SetText(this.viewNode.Name, this.heroMode.data.hero_name)

        AudioManager.Inst().PlayUIAudio(AudioTag.HeroLevelUp);
        // this.viewNode.HeroActivateEffect.PlayEff(1208014);
        // this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect("1208014"), true, (obj: any) => {
        //     obj.setPosition(400, -800);
        //     this.view._container.addChild(obj);
        // });
        Timer.Inst().CancelTimer(this.timer_ani);
        this.timer_ani = Timer.Inst().AddRunTimer(() => {
            this.view.getTransition("ActivateAni").play();
        }, 0.4, 1, false)
        Timer.Inst().CancelTimer(this.timer_grayed);
        this.timer_grayed = Timer.Inst().AddRunTimer(() => {
            this.viewNode.HeroCell.grayed = false;
        }, 1.4, 1, false)
    }

    InitUI() {
    }

    // WindowSizeChange() {
    //     this.refreshBgSize(this.viewNode.bg)
    // }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.Board.FlushShow(() => {
            waitHandle.complete = true;
        })
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
        Timer.Inst().CancelTimer(this.timer_ani);
        Timer.Inst().CancelTimer(this.timer_grayed);

        GrowUpGiftData.Inst().GiftViewShow()
    }
}



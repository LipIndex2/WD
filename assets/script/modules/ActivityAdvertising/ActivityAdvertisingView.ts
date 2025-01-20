import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ActivityAdvertisingData } from "./ActivityAdvertisingData";
import { UH } from "../../helpers/UIHelper";
import { TimeMeter, TimeFormatType } from "modules/extends/TimeMeter";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { ResPath } from "utils/ResPath";

@BaseView.registView
export class ActivityAdvertisingView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "ActivityAdvertising",
        ViewName: "ActivityAdvertisingView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Word: <fgui.GTextField>null,
        Title: <fgui.GTextField>null,
        BtnClose: <fgui.GButton>null,
        UISpineShow: <UISpineShow>null,
        InsideSpine: <UISpineShow>null,
        timer: <TimeMeter>null,
    };

    type: number

    InitData(param: number) {
        this.type = param;
        this.viewNode.BtnClose.onClick(this.closeView, this);
        let cfg = ActivityAdvertisingData.Inst().GetTimeStampData(param);
        UH.SetText(this.viewNode.Title, cfg.out_top_word)
        UH.SetText(this.viewNode.Word, cfg.out_down_word)

        if (cfg.out_res_id) {
            this.viewNode.UISpineShow.LoadSpine(ResPath.Spine(`xianshihuodong/${cfg.out_res_id}/${cfg.out_res_id}`), true);
        }
        // else {
        //     this.viewNode.UISpineShow.LoadSpine(ResPath.Spine("putaodan/putaodan"), true);
        // }

        // if (cfg.inside_res_id) {
        //     this.viewNode.UISpineShow.LoadSpine(ResPath.Spine(cfg.inside_res_id + "/" + cfg.inside_res_id), true);
        // }

        ActivityAdvertisingData.Inst().ClearFirstActivityTips(this.type)
        this.FlushFlushTime();
    }

    private FlushFlushTime() {
        let endTime = ActivityAdvertisingData.Inst().GetEndTime(this.type);
        let time = endTime - TimeCtrl.Inst().ServerTime;
        this.viewNode.timer.visible = time > 0
        if (time > 0) {
            this.viewNode.timer.TotalTime(time, TimeFormatType.TYPE_TIME_7);
        }
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
        ActivityAdvertisingData.Inst().TipOpenView()
    }
}
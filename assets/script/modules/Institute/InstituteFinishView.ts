import { CfgInstituteLevel } from "config/CfgInstitute";
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UH } from "../../helpers/UIHelper";
import { EGLoader } from "modules/extends/EGLoader";
import { ICON_TYPE } from "modules/common/CommonEnum";

var bgEffectId = 1208105;
var caidaiEffectId = 1208018;

@BaseView.registView
export class InstituteFinishView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "InstituteFinish",
        ViewName: "InstituteFinishView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        OkBtn: <fgui.GButton>null,
        Desc: <fgui.GRichTextField>null,
        CellQua: <fgui.GLoader>null,
        CellIcon: <EGLoader>null,
        Effect1: <UIEffectShow>null,
        Effect2: <UIEffectShow>null,
    };

    InitData(param?:CfgInstituteLevel) {
        this.viewNode.OkBtn.onClick(this.closeView, this);
        if(param == null){
            return;
        }

        UH.SetText(this.viewNode.Desc, param.describe);
        UH.SpriteName(this.viewNode.CellQua, "CommonAtlas", `PinZhi${param.color}`);
        UH.SetIcon(this.viewNode.CellIcon, param.res_id, ICON_TYPE.SKILL);

        this.viewNode.Effect1.PlayEff(bgEffectId);
        this.viewNode.Effect2.PlayEff(caidaiEffectId);
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}
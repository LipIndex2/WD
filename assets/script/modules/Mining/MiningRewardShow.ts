import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { ItemCell } from "modules/extends/ItemCell";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";

var bgEffectId = 1208105;
var caidaiEffectId = 1208018;

@BaseView.registView
export class MiningRewardShow extends BaseView {

    protected viewRegcfg = {
        UIPackName: "MiningRewardShow",
        ViewName: "MiningRewardShowView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        OkBtn: <fgui.GButton>null,
        Effect1: <UIEffectShow>null,
        Effect2: <UIEffectShow>null,
        ItemCell: <ItemCell>null,
    };

    InitData(param?:Item) {
        this.viewNode.OkBtn.onClick(this.closeView, this);
        if(param == null){
            return;
        }
        this.viewNode.Effect1.PlayEff(bgEffectId);
        this.viewNode.Effect2.PlayEff(caidaiEffectId);
        this.viewNode.ItemCell.SetData(param);
    }

    OpenCallBack() {
    }
}
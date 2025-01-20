import { LoseTempleCtrl } from 'modules/LoseTemple/LoseTempleCtrl';
import { LoseTempleData } from './LoseTempleData';
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { UH } from '../../helpers/UIHelper';
import { ViewManager } from 'manager/ViewManager';
//篝火
@BaseView.registView
export class LoseTempleBonfireView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "LoseTempleBonfire",
        ViewName: "LoseTempleBonfireView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard2>null,
        title1: <fgui.GTextField>null,
        title2: <fgui.GTextField>null,
        title3: <fgui.GTextField>null,
        BtnSelect1: <fgui.GButton>null,
        BtnSelect2: <fgui.GButton>null,
        BtnSelect3: <fgui.GButton>null,
    };
    eventId: number
    InitData(param: number) {
        this.viewNode.Board.SetData(new BoardData(LoseTempleBonfireView));
        this.eventId = param;

        this.viewNode.BtnSelect1.onClick(this.OnCliclSelectBonfire.bind(this, 0))
        this.viewNode.BtnSelect2.onClick(this.OnCliclSelectBonfire.bind(this, 1))
        this.viewNode.BtnSelect3.onClick(this.OnCliclSelectBonfire.bind(this, 2))
    }

    InitUI() {
        // let data = LoseTempleData.Inst().GetBonfireCfg(this.eventId);
        UH.SetText(this.viewNode.title1, Language.LoseTemple.replyTip1)
        UH.SetText(this.viewNode.title2, Language.LoseTemple.replyTip2)
        UH.SetText(this.viewNode.title3, Language.LoseTemple.replyTip3)
    }

    public OnCliclSelectBonfire(index: number) {
        LoseTempleCtrl.Inst().SendLoseSelectBonfire(index);
        ViewManager.Inst().CloseView(LoseTempleBonfireView)
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

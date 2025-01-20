import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { ChannelAgent } from "../../../proload/ChannelAgent";
import { RoleData } from "modules/role/RoleData";
import { AdType } from "modules/common/CommonEnum";

@BaseView.registView
export class BattleFreeSpeedView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleAD",
        ViewName: "BattleFreeSpeedView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };


    protected viewNode = {
        Btn: <fgui.GButton>null,
        Board: <CommonBoard3>null,
    };

    InitData() {
        this.viewNode.Board.SetData(new BoardData(BattleFreeSpeedView));
        this.viewNode.Btn.onClick(this.OnBtnClick, this);
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }

    OnBtnClick(){
        ChannelAgent.Inst().advert(RoleData.Inst().CfgAdTypeSeq(AdType.battle_speed), "");
        this.closeView();
    }
}
import { CfgSpeBlock } from "config/CfgScene";
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { Language } from 'modules/common/Language';
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { BattleCtrl } from "../BattleCtrl";
import { BattleSpCellInfoItem } from "./BattleSpCellInfoView1";

@BaseView.registView
export class BattleSpCellInfoView2 extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleShenDian",
        ViewName: "BattleSpCellInfo2",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        BG: <CommonBoard3>null,
        List: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "InfoItem", ExtendsClass: BattleSpCellInfoItem },
    ];
    listData: CfgSpeBlock[];

    InitData() {
        this.viewNode.BG.SetData(new BoardData(BattleSpCellInfoView2, Language.Battle.Title1));
    }

    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
        let scene = BattleCtrl.Inst().battleScene;
        if (scene) {
            let cfg = scene.data.spe_block;
            if (cfg && cfg.length > 0) {
                let list: CfgSpeBlock[] = [];
                cfg.forEach(v => {
                    if (v.view == 1) {
                        list.push(v);
                    }
                })
                this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
                this.listData = list;
                this.viewNode.List.numItems = list.length;
            }
        }
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    CloseCallBack() {
    }
}
import { CfgSpeBlock } from "config/CfgScene";
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { ICON_TYPE } from "modules/common/CommonEnum";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";
import { EGLoader } from "modules/extends/EGLoader";
import { UIEffectShow } from "modules/scene_obj_spine/UIEffectShow";
import { UH } from "../../../helpers/UIHelper";
import { CellSpType } from "../BattleConfig";
import { BattleCtrl } from "../BattleCtrl";

@BaseView.registView
export class BattleSpCellInfoView1 extends BaseView {

    protected viewRegcfg = {
        UIPackName: "BattleShenDian",
        ViewName: "BattleSpCellInfo1",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlockClose,
    };

    protected viewNode = {
        BG: <CommonBoard3>null,
        List: <fgui.GList>null,
        CloseBtn: <fgui.GButton>null,
        GuangEffect: <UIEffectShow>null,
    };

    protected extendsCfg = [
        { ResName: "InfoItem", ExtendsClass: BattleSpCellInfoItem },
    ];
    listData: CfgSpeBlock[];

    InitData() {
        this.viewNode.CloseBtn.onClick(this.OnCloseClick, this);
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
        this.viewNode.GuangEffect.PlayEff(1208050);
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }

    CloseCallBack() {
    }

    OnCloseClick() {
        ViewManager.Inst().CloseView(BattleSpCellInfoView1);
    }
}

export class BattleSpCellInfoItem extends BaseItem {

    protected viewNode = {
        title: <fgui.GTextField>null,
        icon: <EGLoader>null,
    };

    public SetData(data: CfgSpeBlock): void {
        UH.SetText(this.viewNode.title, data.describe);
        if (data.block_type == CellSpType.Property) {
            UH.SetIcon(this.viewNode.icon, "cell_race_" + data.pram, ICON_TYPE.SCENE_CELL)
        } else {
            UH.SetIcon(this.viewNode.icon, data.res_id, ICON_TYPE.SPICON);
        }
    }
}
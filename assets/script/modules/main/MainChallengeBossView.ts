
import { ObjectPool } from "core/ObjectPool";
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem, BaseItemGL } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from "modules/common/BaseView";
import { MainFBData } from "modules/main_fb/MainFBData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ResPath } from "utils/ResPath";
import { UH } from "../../helpers/UIHelper";

@BaseView.registView
export class MainChallengeBossView extends BaseView {

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "MainChallengeBoss",
        ViewName: "MainChallengeBossView",
        LayerType: ViewLayer.Normal,
        // ViewMask: ViewMask.BlockClose,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        bg: <fgui.GImage>null,
        ShowList: <fgui.GList>null,
        BtnClose: <fgui.GLoader>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: MainChallengeBossViewShowItem },
        { ResName: "ItemAttr", ExtendsClass: MainChallengeBossViewAttrItem },
    ];
    listData: import("d:/ccs/wjszm-c/assets/script/config/CfgMonster").CfgMonsterData[];

    InitData() {
        this.AddSmartDataCare(MainFBData.Inst().FlushData, this.FlushDailyChallengeInfo.bind(this), "DailyChallengeInfo");
        this.viewNode.BtnClose.onClick(this.closeView, this);
    }

    InitUI(): void {
        this.FlushDailyChallengeInfo()
    }

    FlushDailyChallengeInfo() {
        let co = MainFBData.Inst().CfgDailyChallengeDataChallengeBossInfo()
        if (co) {
            this.viewNode.bg.height = co.monster_id2 > 0 ? 401 : 216

            let list = []
            list.push(MainFBData.Inst().MonsterInfoById(co.monster_id1))
            if (co.monster_id2 > 0) {
                list.push(MainFBData.Inst().MonsterInfoById(co.monster_id2))
            }
            this.viewNode.ShowList.itemRenderer = this.itemRenderer.bind(this);
            this.listData = list;
            this.viewNode.ShowList.numItems = list.length;
        }
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }
}

export class MainChallengeBossViewShowItem extends BaseItem {
    private spShow: UISpineShow = undefined;

    protected viewNode = {
        DescShow: <fgui.GTextField>null,
        AttrShow1: <MainChallengeBossViewAttrItem>null,
        AttrShow2: <MainChallengeBossViewAttrItem>null,
    };

    SetData(data: any) {
        let attrs = MainFBData.Inst().GetMonsterDefType(data)
        this.viewNode.AttrShow1.SetData(attrs[0])
        this.viewNode.AttrShow2.SetData(attrs[1])
        UH.SetText(this.viewNode.DescShow, data.monster_word)

        this.spShow = ObjectPool.Get(UISpineShow, ResPath.Monster(data.res_id), true, (obj: any) => {
            obj.setPosition(70, -190);
            this._container.insertChild(obj, 1);
        });
    }

    protected onDestroy() {
        super.onDestroy()
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
    }
}

export class MainChallengeBossViewAttrItem extends BaseItemGL {
    SetData(data: { type: any, val: any }) {
        if (data) {
            this.title = `${data.val > 0 ? "-" : "+"}${data.val / 100}%`
            this.icon = fgui.UIPackage.getItemURL("CommonAtlas", `HeroAttr${data.type}`);
            this.visible = true
        } else {
            this.visible = false
        }
    }
}
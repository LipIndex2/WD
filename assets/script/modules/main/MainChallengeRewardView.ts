
import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask, viewRegcfg } from "modules/common/BaseView";
import { ICON_TYPE, ITEM_SHOW_TYPE } from "modules/common/CommonEnum";
import { UH } from "../../helpers/UIHelper";

@BaseView.registView
export class MainChallengeRewardView extends BaseView {

    protected viewRegcfg: viewRegcfg = {
        UIPackName: "MainChallengeReward",
        ViewName: "MainChallengeRewardView",
        LayerType: ViewLayer.Normal,
        // ViewMask: ViewMask.BlockClose,
        ShowAnim: true,
        //         OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        GpReward: <fgui.GGroup>null,
        BtnClose: <fgui.GLoader>null,
        TitleShow: <fgui.GTextField>null,
        RewardShow1: <MainChallengeRewardViewRewardItem>null,
        RewardShow2: <MainChallengeRewardViewRewardItem>null,
    };

    protected extendsCfg = [
        { ResName: "ItemReward", ExtendsClass: MainChallengeRewardViewRewardItem }
    ]

    InitData(param_t: { x: number, y: number, content: string, rewards: any[] }) {
        this.viewNode.GpReward.x = param_t.x
        this.viewNode.GpReward.y = param_t.y

        if (param_t.content) {
            UH.SetText(this.viewNode.TitleShow, param_t.content)
        }

        if (param_t.rewards) {
            if (param_t.rewards[0]) {
                this.viewNode.RewardShow1.SetData(param_t.rewards[0])
            }
            if (param_t.rewards[1]) {
                this.viewNode.RewardShow2.SetData(param_t.rewards[1])

            }
            this.viewNode.RewardShow1.x = param_t.x + (undefined != param_t.rewards[1] ? 17 : 71)
            this.viewNode.RewardShow2.visible = undefined != param_t.rewards[1]
        }

        this.viewNode.BtnClose.onClick(this.closeView, this);
    }
}

class MainChallengeRewardViewRewardItem extends BaseItem {
    protected viewNode = {
        QuaIcon: <fgui.GLoader>null,
        Icon: <fgui.GLoader>null,
        NumShow: <fgui.GTextField>null,
    };

    SetData(data: any) {
        UH.SpriteName(this.viewNode.QuaIcon, "CommonAtlas", `PinZhi${Item.GetColor(data.item_id)}`);
        let icon_id = Item.GetIconId(data.item_id) ?? 0;
        let scale = ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.item_id) ? 0.8 : 1
        UH.SetIcon(this.viewNode.Icon, icon_id, ITEM_SHOW_TYPE.HERO_PIECE == Item.GetShowType(data.item_id) ? ICON_TYPE.ROLE : ICON_TYPE.ITEM);
        this.viewNode.Icon.setScale(scale, scale)
        UH.SetText(this.viewNode.NumShow, data.num)
    }
}


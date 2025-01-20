
import * as fgui from "fairygui-cc";
import { ViewManager } from "manager/ViewManager";
import { FunOpen } from "modules/FunUnlock/FunOpen";
import { AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { CommonBoard4 } from "modules/common_board/CommonBoard4";
import { EGLoader } from "modules/extends/EGLoader";
import { ItemCell } from "modules/extends/ItemCell";
import { Timer } from "modules/time/Timer";
import { UH } from "../../helpers/UIHelper";
import { RoleData } from "./RoleData";

@BaseView.registView
export class RoleLevelUpView extends BaseView {
    private showList: any[]
    TwShow: fgui.GTweener = null;
    private timer_show: any = null;
    protected viewRegcfg = {
        UIPackName: "RoleLevelUp",
        ViewName: "RoleLevelUpView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        ShowAnim: true,
        NotHideAnim: true,
        OpenAudio: AudioTag.HuoDeDaoJu,
    };

    protected viewNode = {
        fullscreen: <fgui.GComponent>null,
        Board: <CommonBoard4>null,
        bg: <EGLoader>null,

        BtnGet: <fgui.GButton>null,
        LevelShow: <fgui.GTextField>null,
        ShowList: <fgui.GList>null,
    };

    protected extendsCfg = [
        { ResName: "ItemShow", ExtendsClass: RoleLevelUpViewShowItem },
    ];

    WindowSizeChange() {
        this.refreshBgSize(this.viewNode.bg)
    }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.Board.FlushShow(() => {
            this.viewNode.bg.SetIcon("loader/level_up/ZheZhao", () => {
                waitHandle.complete = true;
                this.refreshBgSize(this.viewNode.bg)
            })
        }, false, "mat_level_up_view")
    }

    InitData(param?: { level: number }) {
        this.viewNode.BtnGet.onClick(this.OnClickGet, this);

        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ShowList.touchable = false

        UH.SetText(this.viewNode.LevelShow, RoleData.Inst().InfoRoleLevel);

        let rewards = RoleData.Inst().GetLevelUpRewards(param.level)
        let count = rewards.length;
        let row = Math.floor(count / 5) + 1
        let col = 0 == (count % 5) ? 5 : (count % 5)
        this.viewNode.ShowList.width = count < 5 ? Math.min(640, col * 120 + (col - 1) * 10) : 640
        this.viewNode.ShowList.height = Math.min(380, row * 130)

        this.showList = rewards;
        this.viewNode.ShowList.numItems = this.showList.length;
    }

    InitUI() {
        this.EffectShow()
    }

    CloseCallBack() {
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }
        Timer.Inst().CancelTimer(this.timer_show)

        RoleData.Inst().ShowLevelUp = false
        if (RoleData.Inst().ShowFunOpen) {
            FunOpen.Inst().OnFunOpenViewShow();
        }
    }

    OnClickGet() {
        ViewManager.Inst().CloseView(RoleLevelUpView)
    }

    private renderListItem(index: number, item: RoleLevelUpViewShowItem) {
        item.SetData(this.showList[index]);
    }

    EffectShow() {
        let show: Function = () => {
            Timer.Inst().CancelTimer(this.timer_show)
            this.timer_show = Timer.Inst().AddRunTimer(() => {
                let item = <RoleLevelUpViewShowItem>this.viewNode.ShowList.getChildAt(cur_index)
                if (item) {
                    item.EffShow()
                }
                if (cur_index % 5 == 4 && cur_index > 0) {
                    if (cur_index > 4) {
                        this.viewNode.ShowList.scrollPane.scrollDown(130 / 25)
                    } else {
                        this.viewNode.ShowList.scrollPane.scrollDown(2)
                    }
                }
                cur_index++;
                if (cur_index < this.showList.length) {
                    show();
                } else {
                    //等动效播完在显示
                    Timer.Inst().CancelTimer(this.timer_show)
                    this.timer_show = Timer.Inst().AddRunTimer(() => {
                        this.viewNode.BtnGet.visible = true
                        this.viewNode.ShowList.touchable = true
                    }, 0.4, 1, false)

                }
            }, 0.15, 1, false)
        }
        let cur_index: number = 0
        show()
    }
}

export class RoleLevelUpViewShowItem extends BaseItem {
    TwShow: fgui.GTweener = null;

    protected viewNode = {
        GpShow: <fgui.GGroup>null,
        CellShow: <ItemCell>null,
    };

    SetData(data: any) {
        let item = Item.Create(data, { is_num: true })
        this.viewNode.CellShow.SetData(item)
    }

    EffShow() {
        let show: Function = () => {
            this.TwShow = fgui.GTween.to(0.8, 1.1, 0.12)
                .setEase(fgui.EaseType.QuartOut)
                .onUpdate((tweener: fgui.GTweener) => {
                    if (this.node) {
                        this.scaleX = tweener.value.x
                        this.scaleY = tweener.value.x
                    }
                }).onComplete(() => {
                    this.TwShow = fgui.GTween.to(1.1, 1, 0.12)
                        .setEase(fgui.EaseType.QuartOut)
                        .onUpdate((tweener: fgui.GTweener) => {
                            if (this.node) {
                                this.scaleX = tweener.value.x
                                this.scaleY = tweener.value.x
                            }
                        }).onComplete(() => {
                            this.TwShow = null
                        })
                })
        }
        this.viewNode.GpShow.visible = true
        show();
    }

    protected onDestroy() {
        super.onDestroy()
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }
    }
}

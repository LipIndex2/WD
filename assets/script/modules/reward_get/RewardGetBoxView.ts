import { ObjectPool } from "core/ObjectPool";
import { CountDownTTTimerHandle } from "data/HandleCollectorCfg";
import * as fgui from "fairygui-cc";
import { ViewManager } from 'manager/ViewManager';
import { AudioManager, AudioTag } from "modules/audio/AudioManager";
import { Item } from "modules/bag/ItemData";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer } from 'modules/common/BaseView';
import { CommonId } from "modules/common/CommonEnum";
import { CommonBoard4 } from "modules/common_board/CommonBoard4";
import { HeroItem } from "modules/extends/HeroCell";
import { GuideCtrl } from "modules/guide/GuideCtrl";
import { HeroData } from 'modules/hero/HeroData';
import { RoleData } from "modules/role/RoleData";
import { UISpineShow } from "modules/scene_obj_spine/UISpineShow";
import { ShopBoxLevelUpView } from 'modules/shop/ShopBoxLevelUpView';
import { ShopConfig } from "modules/shop/ShopConfig";
import { ShopData } from 'modules/shop/ShopData';
import { Timer } from "modules/time/Timer";
import { ResPath } from "utils/ResPath";
import { UH } from "../../helpers/UIHelper";
import { RewardGetViewShowItem } from "./RewardGetView";
import { ConstValue } from "modules/common/ConstValue";

@BaseView.registView
export class RewardGetBoxView extends BaseView {

    private spShow1: UISpineShow = undefined;
    private spShow2: UISpineShow = undefined;
    static boxType: number = 0
    static needClickOpen = true;   //设置为true的话该界面会直接显示打开宝箱不需要玩家点击开启，单次设置生效
    private showList: any[]
    TwShow1: fgui.GTweener = null;
    private timer_show: any = null;
    private isShow: boolean = false;

    protected viewRegcfg = {
        UIPackName: "RewardGetBox",
        ViewName: "RewardGetBoxView",
        LayerType: ViewLayer.Normal,
        OpenAudio: AudioTag.HuoDeDaoJu,
    };

    protected viewNode = {
        Board: <CommonBoard4>null,
        BtnContinue: <fgui.GButton>null,
        ShowList: <fgui.GList>null,
        BtnBox: <fgui.GButton>null,
        BtnOpen: <fgui.GButton>null,
        BtnOpen2: <fgui.GButton>null,
        ButtonShow: <fgui.GButton>null,
        AchieveShow: <fgui.GGroup>null,
        OpenBoxShow: <fgui.GGroup>null,
        // bg: <EGLoader>null,
        curNum: <fgui.GTextField>null,
        GGCur: <fgui.GGroup>null,
    };

    protected extendsCfg = [
        { ResName: "HeroItemShow", ExtendsClass: HeroItemShow },
    ];

    InitData(param?: { reward_data: IPB_ItemData[] }) {
        this.viewNode.BtnContinue.onClick(this.OnClickContinue, this);
        this.viewNode.BtnBox.onClick(this.OnClickOpen, this);
        this.viewNode.BtnOpen2.onClick(this.OnClickOpen, this);
        this.viewNode.BtnOpen.onClick(this.OnClickOpen, this);
        this.viewNode.ButtonShow.onClick(this.OnClickShow, this);

        this.viewNode.ShowList.itemRenderer = this.renderListItem.bind(this);
        this.viewNode.ShowList.touchable = false

        let data = [];
        let showCur = false;
        for (let i = 0; i < param.reward_data.length; i++) {
            let item_data = Item.GetConfig(param.reward_data[i].itemId);
            if (param.reward_data[i].itemId == CommonId.Gold) {
                UH.SetText(this.viewNode.curNum, param.reward_data[i].num.toString());
                showCur = true;
            } else {
                if (item_data.item_type == 3 && ConstValue.LegalHeroArr.includes(item_data.id)) {
                    data.push(param.reward_data[i])
                }
            }
        }
        if (!showCur) {
            this.viewNode.GGCur.visible = false;
        }


        this.showList = data;

        let count = this.showList.length;
        let row = Math.ceil(count / 3)
        this.viewNode.ShowList.height = Math.min(900, row * 260 + 100)
        this.viewNode.ShowList.numItems = this.showList.length;

        this.spShow1 = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`1208025`), true, (obj: any) => {
            obj.setPosition(400, -1115);
            this.view._container.insertChild(obj, 2);
        });
        this.viewNode.BtnBox.icon = fgui.UIPackage.getItemURL("RewardGetBox", `BaoXiang${RewardGetBoxView.boxType}`);
        if (!RewardGetBoxView.needClickOpen) {
            RewardGetBoxView.needClickOpen = true;
            this.OnClickOpen();
        }
    }

    InitUI() {

    }

    OnClickShow() {
        this.isShow = true;
        Timer.Inst().CancelTimer(this.timer_show)
        for (let i = 0; i < this.showList.length; i++) {
            let item = <HeroItemShow>this.viewNode.ShowList.getChildAt(i)
            if (item) {
                item.SetGpShowVisible(true);
            }
        }
        this.viewNode.BtnContinue.visible = true
        this.viewNode.ShowList.touchable = true
    }

    // WindowSizeChange() {
    //     this.refreshBgSize(this.viewNode.bg)
    // }

    DoOpenWaitHandle() {
        let waitHandle = this.createWaitHandle("loadBG")
        this.AddWaitHandle(waitHandle);
        this.viewNode.Board.FlushShow(() => {
            waitHandle.complete = true;
        })
    }

    private renderListItem(index: number, item: RewardGetViewShowItem) {
        item.SetData(this.showList[index]);
    }

    OnClickOpen() {
        if (this.spShow1) {
            ObjectPool.Push(this.spShow1);
            this.spShow1 = null
        }
        // this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`core_crisis_box${RewardGetBoxView.boxType}`), (obj: any) => {
        this.viewNode.OpenBoxShow.visible = false;
        this.spShow2 = ObjectPool.Get(UISpineShow, ResPath.UIEffect(ShopConfig.BoxGetSpine[RewardGetBoxView.boxType]), true, (obj: any) => {
            obj.setPosition(400, -1115);
            this.view._container.insertChild(obj, 2);
            this.handleCollector.KeyAdd("WaitBoxOpen", CountDownTTTimerHandle.Create(() => { }, () => {
                this.viewNode.AchieveShow.visible = true;
                this.EffectShow()
            }, 0.3));
        });
    }

    OnClickContinue() {
        ViewManager.Inst().CloseView(RewardGetBoxView)
    }

    EffectShow() {
        let show: Function = () => {
            Timer.Inst().CancelTimer(this.timer_show)
            this.timer_show = Timer.Inst().AddRunTimer(() => {
                let item = <HeroItemShow>this.viewNode.ShowList.getChildAt(cur_index)
                if (item) {
                    AudioManager.Inst().PlaySceneAudio(AudioTag.baoxiangdan, 0);
                    item.EffShow()
                }
                if (cur_index % 3 == 2 && cur_index > 0) {
                    if (cur_index > 2) {
                        this.viewNode.ShowList.scrollPane.scrollDown(10)
                    } else {
                        // this.viewNode.ShowList.scrollPane.scrollDown(5)
                    }
                }
                if (this.isShow) {
                    return;
                }
                cur_index++;
                if (cur_index < this.showList.length) {
                    show();
                } else {
                    this.viewNode.BtnContinue.visible = true
                    this.viewNode.ShowList.touchable = true
                }
            }, 0 == cur_index ? 0 : 0.3, 1, false)
        }
        let cur_index: number = 0
        show()
    }

    CloseCallBack() {
        super.CloseCallBack()
        if (this.spShow1) {
            ObjectPool.Push(this.spShow1);
            this.spShow1 = null
        }
        if (this.spShow2) {
            ObjectPool.Push(this.spShow2);
            this.spShow2 = null
        }
        if (this.TwShow1) {
            this.TwShow1.kill();
            this.TwShow1 = null
        }
        Timer.Inst().CancelTimer(this.timer_show)

        let isUp = ShopData.Inst().GetIsBoxLevelUp();
        if (isUp) {
            ViewManager.Inst().OpenView(ShopBoxLevelUpView)
        }

        if (!RoleData.Inst().IsGuideNum(2, false) && RoleData.Inst().IsGuideNum(3)) {
            GuideCtrl.Inst().Start(3);
            return;
        }
    }
}

export class HeroItemShow extends BaseItem {
    private spShow: UISpineShow = undefined;
    TwShow: fgui.GTweener = null;

    protected viewNode = {
        GpShow: <fgui.GGroup>null,
        HeroItem: <HeroItem>null,
        Num: <fgui.GTextField>null,
    };
    SetData(data: { itemId: number, num: number }) {
        let id = HeroData.Inst().GetDebrisHeroId(data.itemId);
        this.viewNode.HeroItem.SetData(id);
        UH.SetText(this.viewNode.Num, "X" + data.num)
    }
    EffShow() {
        this.viewNode.GpShow.visible = true
        this.spShow = ObjectPool.Get(UISpineShow, ResPath.UIEffect(`1208026`), true, (obj: any) => {
            obj.setPosition(187, -223);
            this._container.insertChild(obj, 2);
            let show: Function = () => {
                this.TwShow = fgui.GTween.to(0, 1.6, 0.12)
                    .setEase(fgui.EaseType.QuartOut)
                    .onUpdate((tweener: fgui.GTweener) => {
                        if (this.node) {
                            this.scaleX = tweener.value.x
                            this.scaleY = tweener.value.x
                        }
                    }).onComplete(() => {
                        this.TwShow = fgui.GTween.to(1.6, 0.9, 0.12)
                            .setEase(fgui.EaseType.QuartOut)
                            .onUpdate((tweener: fgui.GTweener) => {
                                if (this._node) {
                                    this.scaleX = tweener.value.x
                                    this.scaleY = tweener.value.x
                                }
                            }).onComplete(() => {
                                this.TwShow = fgui.GTween.to(0.9, 1, 0.12)
                                    .setEase(fgui.EaseType.QuartOut)
                                    .onUpdate((tweener: fgui.GTweener) => {
                                        if (this.node) {
                                            this.scaleX = tweener.value.x
                                            this.scaleY = tweener.value.x
                                        }
                                    })
                            })
                    })
            }
            show();
        });
    }

    SetGpShowVisible(visible: boolean) {
        this.viewNode.GpShow.visible = visible;
    }

    protected onDestroy() {
        super.onDestroy()
        if (this.spShow) {
            ObjectPool.Push(this.spShow);
            this.spShow = null
        }
        if (this.TwShow) {
            this.TwShow.kill();
            this.TwShow = null
        }
    }
}

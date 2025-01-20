import * as fgui from "fairygui-cc";
import { AudioTag } from "modules/audio/AudioManager";
import { BaseItem } from "modules/common/BaseItem";
import { BaseView, ViewLayer, ViewMask } from "modules/common/BaseView";
import { BoardData } from "modules/common_board/BoardData";
import { CommonBoard2 } from "modules/common_board/CommonBoard2";
import { UH } from "../../helpers/UIHelper";
import { SettingUsertServeData } from "./SettingUsertServeData";
import { HTTP } from "../../helpers/HttpHelper";
import { PackageData } from "preload/PkgData";
import { LoginData } from "modules/login/LoginData";
import { CommonBoard3 } from "modules/common_board/CommonBoard3";

export enum ENUM_UserServe {
    SETTING = 0,
    DIALOG = 1
}

@BaseView.registView
export class SettingUsertServeView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "SettingUsertServe",
        ViewName: "SettingUsertServeView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
    };

    protected viewNode = {
        Board: <CommonBoard3>null,
        List: <fgui.GList>null,
        BtnClose: <fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "WordCell", ExtendsClass: WordCell }
    ];
    private param: { type: ENUM_UserServe, param: number | { param: { title: string, content: string } }, closeCb?: () => void, btnName?: string };
    listData: string[];
    InitData(param: { type: ENUM_UserServe, param: any, closeCb?: () => void, btnName?: string }) {
        this.param = param;
        this.viewNode.List.setVirtual();
        this.viewNode.BtnClose.onClick(this.closeView, this);
        let str = "";
        if (param.type == ENUM_UserServe.DIALOG) {
            if (this.param.param) {
                str = this.param.param.title
            }
        } else {
            let cfg = SettingUsertServeData.Inst().GetWordDes(param.param);
            str = cfg.name;
            this.AddSmartDataCare(SettingUsertServeData.Inst().FlushlData, this.FulshData.bind(this), "user_protocol_change");
        }
        this.viewNode.Board.SetData(new BoardData(SettingUsertServeView, str));
        this.viewNode.BtnClose.title = this.param.btnName || "确定";
        this.FulshData();
    }

    FulshData() {
        let str = ""
        if (this.param.type == ENUM_UserServe.DIALOG) {
            if (this.param.param) {
                str = this.param.param.content
            }
        } else {
            str = SettingUsertServeData.Inst().GetLoginUserProtocol(this.param.param);
        }
        if (str) {
            let cont = [];
            let x = 0
            while (x < str.length) {
                let now = x;
                x += 500;
                cont.push(str.slice(now, x))
            }

            this.viewNode.List.itemRenderer = this.itemRenderer.bind(this);
            this.listData = cont;
            this.viewNode.List.numItems = cont.length;
        }
        this.viewNode.List._container.setPosition(0, 0)
    }

    private itemRenderer(index: number, item: any) {
        item.SetData(this.listData[index]);
    }
    InitUI() {
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {

    }

    CloseCallBack() {
        this.param && this.param.closeCb && this.param.closeCb();
    }
}

export class WordCell extends BaseItem {
    protected viewNode = {
        title: <fgui.GTextField>null,
    };
    public SetData(data: string) {
        UH.SetText(this.viewNode.title, data);
    }
}
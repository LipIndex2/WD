import * as fgui from "fairygui-cc";
import { BaseView, ViewLayer, ViewMask } from 'modules/common/BaseView';
import { AudioTag } from 'modules/audio/AudioManager';
import { BaseItemGB } from "modules/common/BaseItem";
import { UH } from "../../helpers/UIHelper";
import { ICON_TYPE } from "modules/common/CommonEnum";
import { BannedWordFilter } from "modules/sensitiveWords/BannedWordFilter";
import { ChatFilter } from "modules/role/chat_filter";
import { Language } from "modules/common/Language";
import { PublicPopupCtrl } from "modules/public_popup/PublicPopupCtrl";
import { fromString } from "long";
import { Format } from "../../helpers/TextHelper";
import { NetManager } from "manager/NetManager";
import { RoleCtrl } from "modules/role/RoleCtrl";
import { RoleData } from "modules/role/RoleData";
import { NetChatLoginOptions, NetChatMsgOptions, NetConnectOptions } from "core/net/NetNode";
import { EventCtrl } from "modules/common/EventCtrl";
import { CommonEvent } from "modules/common/CommonEvent";
import { ConstValue } from "modules/common/ConstValue";
import { ChatCtrl, MsgData } from "./ctrl/ChatCtrl";
@BaseView.registView
export class ChatView extends BaseView {

    protected viewRegcfg = {
        UIPackName: "Chat",
        ViewName: "ChatView",
        LayerType: ViewLayer.Normal,
        ViewMask: ViewMask.BgBlock,
        ShowAnim: true,
        OpenAudio: AudioTag.TanChuJieMian,
        CloseAudio: AudioTag.TongYongClick,
        ViewCache: true,
    };

    protected viewNode = {
        BtnClose: <fgui.GButton>null,
        list:<fgui.GList>null,
        InputText:<fgui.GTextInput>null,
        BtnSend:<fgui.GButton>null,
    };

    protected extendsCfg = [
        { ResName: "ComLeftChat", ExtendsClass: ComChat },
        { ResName: "ComRightChat", ExtendsClass: ComChat },
    ];

    type: number = 0;
    selectId: number;//选择头像框
    selectHeadId: number;//选择头像

    lastSendTime:number = 0;

    InitData() {
        this.viewNode.BtnClose.onClick(this.closeView, this);
        this.viewNode.BtnSend.onClick(this.OnClickSend, this);  

        this.viewNode.list.setVirtual();
        this.viewNode.list.itemProvider = this.getListItemResource.bind(this);
        this.viewNode.list.itemRenderer = <fgui.ListItemRenderer>this.renderListItem.bind(this);
        this.viewNode.list.numItems = ChatCtrl.Inst().listData.length;

        this.viewNode.BtnSend.onClick(this.onSubmit, this);
        // this.viewNode.InputText.promptText = "";

        EventCtrl.Inst().on(CommonEvent.CHAT_MSG, (data: NetChatMsgOptions)=>{
            this.addMsg(data.name, data.head, data.headFrame, data.msg, data.isMe);
        }, this);

        this.FulshData();
    }

    private renderListItem(index: number, item: ComChat){
        let data = ChatCtrl.Inst().listData[index];
        item.SetData(data);
    }

    private getListItemResource(index: number): string {
        let mgs = ChatCtrl.Inst().listData[index];
        if (!mgs.isMe)
            return fgui.UIPackage.getItemURL("Chat", "ComLeftChat");
        else
            return fgui.UIPackage.getItemURL("Chat", "ComRightChat");
    }

    addMsg(name: string, head: number, headFrame:number, msg: string, isMe: boolean){
        // 内容检查敏感词
        let filterData = BannedWordFilter.ins.filterWord(msg)
        if (filterData.has || ChatFilter.Inst().IsIllegal(msg)) {
            PublicPopupCtrl.Inst().Center(Language.RoleInfo.IllegalContent)
            return false;
        }

        if(isMe){
            let curTime = Date.now();
            if(curTime - this.lastSendTime <= 15 *1000){
                // 冒字15秒冷却
                PublicPopupCtrl.Inst().Center(Format(Language.Chat.Cd, (15- (curTime - this.lastSendTime)/ 1000).toFixed(0)));
                return false;
            }
            this.lastSendTime = curTime;
        }

        if(ChatCtrl.Inst().listData.length >= 50){
            ChatCtrl.Inst().listData.pop();
        }

        isMe && ChatCtrl.Inst().listData.push({ name: name, head: head, headFrame: headFrame, msg: msg, time: Date.now(), isMe: isMe });
        this.viewNode.list.numItems = ChatCtrl.Inst().listData.length;
        this.viewNode.list.scrollPane.scrollBottom();

        return true;
    }

    onSubmit(){
        let msg = this.viewNode.InputText.text;
        if (!msg)
            return;
        const roleInfo = RoleData.Inst().InfoRoleInfo;
        let sendData = {"action": 2, uid: roleInfo.roleId, "payload":{"msg": msg, "name":RoleData.Inst().InfoRoleName, head: roleInfo.headPicId, headFrame: roleInfo.headFrame }};
        // let loginData = {"action": 1, uid: RoleData.Inst().InfoRoleId};
        // NetManager.Inst().SendProtoBufByChat(loginData);
    
        // 自己添加上
        let result = this.addMsg(sendData.payload.name, sendData.payload.head, sendData.payload.headFrame, sendData.payload.msg, true);
        if(result){
            // 发给服务器
            NetManager.Inst().sendSocket(sendData);
            this.viewNode.InputText.text = "";
        }
    }

    OnClickSend(){
        // 发送给服务器
    }

    InitUI(): void {
    }

    FulshData() {
        
    }

    DoOpenWaitHandle() {
    }

    OpenCallBack() {
    }

    CloseCallBack() {
    }
}

class ComChat extends BaseItemGB {
    protected viewNode = {
        ComHead: <fgui.GComponent>null,
        txName: <fgui.GTextField>null,
        title: <fgui.GTextField>null,
    };
    SetData(data: MsgData) {
        this.data = data;

        // 显示名称
        this.viewNode.txName.text = data.name;

        // 显示头像
        let head = this.viewNode.ComHead.getChild("Head") as fgui.GLoader;
        let headFrame = this.viewNode.ComHead.getChild("HeadFrame") as fgui.GLoader;

        let cfg = RoleData.Inst().CfgRoleHeadFrame(this.data.headFrame > 0 ? this.data.headFrame : 1);
        UH.SetIcon(headFrame, cfg.res_id, ICON_TYPE.HEADFRAME);

        let headCfg = RoleData.Inst().CfgRoleHeadIcon(this.data.head);
        if (headCfg) {
            UH.SetIcon(head, headCfg.head_id, ICON_TYPE.HEADICON)
        } else {
            UH.SpriteName(head, ConstValue.PKGNAME.CommonItem, "TouXiangDaXiao")
        }

        // 显示对话
        this.viewNode.title.text = data.msg;
    }
}
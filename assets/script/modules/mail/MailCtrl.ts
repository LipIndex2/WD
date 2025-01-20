import { LogError } from 'core/Debugger';
import { RemindRegister } from 'data/HandleCollectorCfg';
import { BaseCtrl, regMsg } from 'modules/common/BaseCtrl';
import { Mod } from 'modules/common/ModuleDefine';
import { MailConfig } from './MailConfig';
import { MailData } from './MailData';

export class MailCtrl extends BaseCtrl {
    MsgCfg(): regMsg[] {
        return [
            { msgType: PB_SCMailDeleteAck, func: this.OnMailDeleteAck },
            { msgType: PB_SCMailListAck, func: this.OnMailListAck },
            { msgType: PB_SCMailDetail, func: this.OnMailDetail },
            { msgType: PB_SCFetchMailAck, func: this.OnFetchMailAck },
        ]
    }

    protected initCtrl() {
        this.handleCollector.Add(RemindRegister.Create(Mod.MainOther.Mail, MailData.Inst().FlushData, MailData.Inst().GetAllRed.bind(MailData.Inst())));
    }

    public OnMailDeleteAck(protocol: PB_SCMailDeleteAck) {
        LogError("OnMailDeleteAck", protocol)
        MailData.Inst().SetMailDeleteAck(protocol);
    }

    public OnMailListAck(protocol: PB_SCMailListAck) {
        LogError("OnMailListAck", protocol)
        MailData.Inst().SetMailListAck(protocol);
    }

    public OnMailDetail(protocol: PB_SCMailDetail) {
        LogError("OnMailDetail", protocol)
        MailData.Inst().SetMailDetail(protocol);
    }

    public OnFetchMailAck(protocol: PB_SCFetchMailAck) {
        LogError("OnFetchMailAck", protocol)
        MailData.Inst().SetFetchMailAck(protocol);
    }

    public SendMailReq(type: number, param: number[] = []) {
        let protocol = this.GetProtocol(PB_CSMailReq);
        protocol.type = type;
        protocol.p_1 = param[0] ?? 0;
        protocol.p_2 = param[1] ?? 0;
        this.SendToServer(protocol);
    }

    public SendMailReqDelete(mail_type: number, mail_index: number) {
        this.SendMailReq(MailConfig.ReqType.delete, [mail_type, mail_index]);
    }

    public SendMailReqBrief(mail_type: number) {
        this.SendMailReq(MailConfig.ReqType.brief, [mail_type]);
    }

    public SendMailReqDetail(mail_type: number, mail_index: number) {
        this.SendMailReq(MailConfig.ReqType.detail, [mail_type, mail_index]);
    }

    public SendMailReqFetch(mail_type: number, mail_index: number) {
        this.SendMailReq(MailConfig.ReqType.fetch, [mail_type, mail_index]);
    }

    public SendMailReqDeleteAll(mail_type: number) {
        this.SendMailReq(MailConfig.ReqType.delete_all, [mail_type]);
    }

    public SendMailReqFetchAll(mail_type: number) {
        this.SendMailReq(MailConfig.ReqType.fetch_all, [mail_type]);
    }
}
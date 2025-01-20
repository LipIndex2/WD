import { DataBase } from "data/DataBase";
import { CreateSMD, smartdata } from "data/SmartData";
import { Mod } from "modules/common/ModuleDefine";
import { TimeCtrl } from "modules/time/TimeCtrl";
import { DataHelper } from "../../helpers/DataHelper";
import { MailConfig } from "./MailConfig";


export class MailResultData {
    MailList: PB_SCMailListAck
    MailDetail: PB_SCMailDetail
}

export class MailFlushData {
    @smartdata
    FlushMailList: boolean = false;

    @smartdata
    FlushMailDetail: boolean = false;
}

export class MailData extends DataBase {

    public ResultData: MailResultData;
    public FlushData: MailFlushData;

    constructor() {
        super();
        this.createSmartData();
    }

    private createSmartData() {
        this.FlushData = CreateSMD(MailFlushData);
        this.ResultData = new MailResultData()
    }

    public SetMailDeleteAck(protocol: PB_SCMailDeleteAck) {
        for (let element of protocol.askInfo) {
            let index = this.ResultData.MailList.mailBriefData.findIndex(cfg => cfg.mailType == element.mailType && cfg.mailIndex == element.mailIndex)
            if (-1 != index) {
                this.ResultData.MailList.mailBriefData.splice(index, 1)
            }
        }
        this.FlushData.FlushMailList = !this.FlushData.FlushMailList
    }

    public SetMailListAck(protocol: PB_SCMailListAck) {
        if (0 == protocol.sendType) {
            this.ResultData.MailList = protocol
        } else {
            for (let element of protocol.mailBriefData) {
                let index = this.ResultData.MailList.mailBriefData.findIndex(cfg => cfg.mailType == element.mailType && cfg.mailIndex == element.mailIndex)
                if (-1 == index) {
                    this.ResultData.MailList.mailBriefData.push(element)
                } else {
                    this.ResultData.MailList.mailBriefData[index] = element
                }
            }
        }

        this.FlushData.FlushMailList = !this.FlushData.FlushMailList
    }

    public SetMailDetail(protocol: PB_SCMailDetail) {
        this.ResultData.MailDetail = protocol
        this.FlushData.FlushMailDetail = !this.FlushData.FlushMailDetail

        let index = this.ResultData.MailList.mailBriefData.findIndex(cfg => cfg.mailType == protocol.mailType && cfg.mailIndex == protocol.mailIndex)
        if (-1 != index) {
            this.ResultData.MailList.mailBriefData[index].isRead = 1
            this.FlushData.FlushMailList = !this.FlushData.FlushMailList
        }
    }

    public SetFetchMailAck(protocol: PB_SCFetchMailAck) {
        for (let element of protocol.askInfo) {
            let index = this.ResultData.MailList.mailBriefData.findIndex(cfg => cfg.mailType == element.mailType && cfg.mailIndex == element.mailIndex)
            if (-1 != index) {
                this.ResultData.MailList.mailBriefData[index].isFetch = 1
            }
        }
        this.FlushData.FlushMailList = !this.FlushData.FlushMailList
    }

    public get MailDetail() {
        return this.ResultData.MailDetail
    }

    public get MailDetailSubject() {
        return this.ResultData.MailDetail ? DataHelper.BytesToString(this.ResultData.MailDetail.subject) : ""
    }

    public get MailDetailContentTxt() {
        return this.ResultData.MailDetail ? DataHelper.BytesToString(this.ResultData.MailDetail.contenttxt) : ""
    }

    public get MailDetailItemData() {
        return this.ResultData.MailDetail ? this.ResultData.MailDetail.itemData : []
    }

    public get MailDetailIsFetch() {
        let is_fetch = false
        if (this.ResultData.MailDetail) {
            let index = this.ResultData.MailList.mailBriefData.findIndex(cfg => cfg.mailType == this.ResultData.MailDetail.mailType && cfg.mailIndex == this.ResultData.MailDetail.mailIndex)
            if (-1 != index) {
                is_fetch = 1 == this.ResultData.MailList.mailBriefData[index].isFetch
            }
        }
        return is_fetch
    }

    public FlushMailList() {
        this.FlushData.FlushMailList = !this.FlushData.FlushMailList
    }

    public GetMailSystemList(sort = true) {
        let server_time = TimeCtrl.Inst().ServerTime
        let list = this.ResultData.MailList ? this.ResultData.MailList.mailBriefData.filter(cfg => cfg.mailType == MailConfig.MailType.system && (0 == cfg.expirationTime || cfg.expirationTime > server_time)) : []
        return sort ? this.MailListSort(list) : list
    }

    public GetMailNormalList(sort = true) {
        let server_time = TimeCtrl.Inst().ServerTime
        let list = this.ResultData.MailList ? this.ResultData.MailList.mailBriefData.filter(cfg => cfg.mailType == MailConfig.MailType.normal && (0 == cfg.expirationTime || cfg.expirationTime > server_time)) : []
        return sort ? this.MailListSort(list) : list
    }

    public MailListSort(list: IPB_MailBriefData[]) {
        list.sort((a: IPB_MailBriefData, b: IPB_MailBriefData) => {
            return b.recvTime - a.recvTime
        });
        return list
    }

    //总红点
    public GetAllRed() {
        if (this.ResultData.MailList) {
            let data = this.ResultData.MailList.mailBriefData;
            for (let i = 0; i < data.length; i++) {
                if (data[i].isRead == 0) {
                    return 1
                }
            }
        }
        return 0;
    }

    AutoMail() {
        let list1 = this.GetMailSystemList(false)
        for (let i = 0; i < list1.length; i++) {
            if (list1[i].isRead == 0) {
                return Mod.Mail.View
            }
        }
        let list2 = this.GetMailNormalList(false)
        for (let i = 0; i < list2.length; i++) {
            if (list2[i].isRead == 0) {
                return Mod.Mail.Normal
            }
        }
        return Mod.Mail.View
    }
}
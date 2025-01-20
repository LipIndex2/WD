
export var MailConfig = {
    MailType: {
        normal: 1,
        system: 2,
    },

    ReqType: {
        delete: 1,      // 删除邮件 p1:邮件类型 p2:邮件位置
        brief: 2,       // 获取摘要列表 p1:邮件类型
        detail: 3,      // 获取邮件内容 p1:邮件类型 p2:邮件位置
        fetch: 4,       // 领取邮件附件 p1:邮件类型 p2:邮件位置
        delete_all: 5,  // 一键删除已领 p1:邮件类型     
        fetch_all: 6,   // 一键领取邮件附件 p2:邮件类型     
    }
}
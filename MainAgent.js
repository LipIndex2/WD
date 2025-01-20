var MainAgent = {}
var changAgent;
MainAgent.init = function (changAgent) {
    this.changAgent = changAgent
    return false;
}
MainAgent.OnInit = function (result) {
    let data = { result: false }
    this.changAgent.OnInit(data)
}

MainAgent.login = function () {
    return false;
}

MainAgent.OnLogin = function (result) {
    let data = { account: "", token: "" }
    this.changAgent.OnLogin(data)
}

MainAgent.Mai = function (orderInfo) {

}

MainAgent.Behaveious = function (type) {
    let userInfo = this.changAgent.GetUserInfo()
}

MainAgent.OnMessage = function (type, msg, msg1) {

}

MainAgent.Message = function (type, msg) {
    this.changAgent.Message(type, msg)
}

MainAgent.CheckContent = function (type, msg, cb) {

}

MainAgent.wxModal = function  (title, content, confirm_func, cancel_func, showCancel, confirmText, cancelText) {

}

MainAgent.exitMiniProgram = function  () {

}

window['MainAgent'] = MainAgent;
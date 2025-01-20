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

MainAgent.OnMessage = function (type, msg, msg1, msg2, msg3, msg4) {
  console.log(type);
  switch(type){
    case ChannelOnMessageType.arouseShare:
      wx.shareAppMessage({
        imageUrl: '',
        title:"无限贝拉",
        query:"msg="+msg
      })
      this.Message(OnChannelOnMessageType.arouseShareSuc,msg)
      break;
    case ChannelOnMessageType.arouseShareCheck:
      let info = wx.getEnterOptionsSync()
      let query = info.query
      if (query.msg && query.msg != "") {
        this.Message(OnChannelOnMessageType.bearouseShareSuc,query.msg)
      }
    break;
  }
}

MainAgent.Message = function (type, msg) {
    this.changAgent.Message(type, msg)
}

MainAgent.CheckContent = function (type, msg, cb) {

}

MainAgent.CopyText = function (text) {
    wx.setClipboardData({
        data: text,
    })
}

MainAgent.wxModal = function (title, content, confirm_func, cancel_func, showCancel, confirmText, cancelText) {
  wx.showModal({
    title: title ? JSON.stringify(title) : '提示',
    content: content ? JSON.stringify(content) : '这是一个模态弹窗',
    showCancel: showCancel ?? true,
    confirmText: confirmText ? JSON.stringify(confirmText) : '确定',
    cancelText: cancelText ? JSON.stringify(cancelText) : '取消',
    success (res) {
      if (res.confirm) {
        confirm_func && confirm_func();
      } else if (res.cancel) {
        cancel_func && cancel_func();
      }
    }
  })
}

MainAgent.exitMiniProgram = function (){
  wx.exitMiniProgram()
}

window['MainAgent'] = MainAgent;
let spid = "ys1";
let httploginData = { 
  "spid": spid, 
  "isOut": true,
  "version":"1.1.0",
  "pkg":"1.1.0",
  "hotUpdate":true
};
window['httploginData'] = httploginData
// httploginData['queryUrl'] = `https:cls.tt02.bluegames.cn/${spid}/${spid}-query-h02.php`;  //内网测试地址
httploginData['queryUrl'] = `https://cls-ylh02.huanyuantech.com/${spid}/query.php`;    //外网地址
// httploginData['queryUrl'] = "http://192.168.11.17:98/query.json";   //地址调试地址

let ChannelOnMessageType = {
    KeFu: "KeFu",
    /**分享 */
    arouseShare: "arouseShare",
    /**激励视频 */
    advert: "advert",
        /**检查是否被邀请 */
        arouseShareCheck: "arouseShareChceck",
}
let OnChannelOnMessageType = {
    /**激励视频成功 */
    advertSuc: "advert-1",
    /**绑定手机成功 */
    bindPhoneSuc: "bindPhone-1",
    /**提示 */
    tip: "tip",
    /**主菜单分享 */
    menuShareSuc: "menuShare-1",
    /**分享成功 */
    arouseShareSuc: "arouseShare-1",
    /**被邀请人进游戏 */
    bearouseShareSuc: "arouseShare-2",
}

window['SetRemoteBundleInfo'] = function(url,bundleVers){
  if(url){
    console.log(`SetDownloadURL====${url}`);
    cc.assetManager.downloader['_remoteServerAddress'] = url;
  }
  if(bundleVers){
    if(!cc.assetManager.downloader.remoteBundleVers){
      cc.assetManager.downloader.remoteBundleVers = {};
    }
    for(var key in bundleVers){
      if(bundleVers[key]){
        console.log(`SetRemoteBundleVer====${key}=${bundleVers[key]}`);
        cc.assetManager.downloader.remoteBundleVers[key] = bundleVers[key];
      }
    }
  }
}
/*
 * @Description:
 * @Date: 2021-05-10 15:29:07
 */

window.sdkHelper = {
  start() {
    console.log("start");
  },

  loadPhoneInfo: function (cb) {
    let ret = {
      model: "browser",
      os: "browser",
      platform: "web",
      deviceId: this.generateDevId(),
    };
    cb(ret);
  },

  getNetType: function (cb) {
    cb("wifi");
  },

  init: function (params, cb) {
    let ret = { code: 1 };
    cb(ret);
  },

  login: function (params, cb) {
    let ret = { code: 0 };
    cb(ret);
  },

  logout: function (cb) {
    let ret = { code: 1 };
    cb(ret);
  },

  pay: function (params, cb) {
    let ret = { code: 1 };
    cb(ret);
  },

  submit: function (tag, params) {
    switch (tag) {
      case 0:
        break;

      default:
        break;
    }
  },

  checkMsg(msg, cb) {
    let ret = { code: 1 };
    cb(ret);
  },

  sharedApp(params, cb) {
    let ret = { code: 1 };
    cb(ret);
  },

  subscribe(tmpId, cb) {
    let ret = { code: 1 };
    cb(ret);
  },

  //------------------------------平台相关------------------------------
  /**息屏 */
  setKeepScreenOn() { },

  /**gc */
  triggerGC() { },

  /**检查更新 */
  checkUpdate() { },

  checkShortcut(cb) {
    //0 无此功能  1 显示按钮  2 已添加 检查奖励
    let ret = { code: 0 };
    cb(ret);
  },

  addShortcut(cb) { },

  /**复制到剪切板 */
  setClipboardData(content) {
    var input = content + "";
    const el = document.createElement("textarea");
    el.value = input;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    el.style.fontSize = "12pt";
    const selection = getSelection();
    var originalRange = null;
    if (selection.rangeCount > 0) {
      originalRange = selection.getRangeAt(0);
    }
    document.body.appendChild(el);
    el.select();
    el.selectionStart = 0;
    el.selectionEnd = input.length;
    var success = false;
    success = document.execCommand("copy");
    document.body.removeChild(el);
    if (originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
  },

  generateDevId: function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  },

  //------------------------------开放域相关------------------------------
  //发送消息到开发域
  sendMsgToOpen(data) { },

  setOpenData(key, data) { },
};

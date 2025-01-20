/**登录参数 */

globalThis.LoginParam = {
  platform: "anonymous",
  language: "zh-CN",
  gmUrl: `https://gm-api-demo.chuxinhudong.com`,
  gmInitPlatform: "chuxin", //固定为chuxin
  gmAppId: "wjszm", //固定为wjszm
  sdkInfo: {
    gameId: "wjszm", //游戏标识
    platform: "chuxin", //平台标识
    apiSecretId: "9gFYAW1R5SsV", //id
    apiSecretKey: "vj6RuoLxNHt0u4yUICh3", //key
    packageName: "com.wangong.wjszm.banshu", //包名
  },

  gameInfo: {
    name: "",
    company: "",
    address: "",
    email: "",
    vc: "",
  },
  // isAppleAd: true,    // 是否提iOS提审状态
  // // 开发服
  // dev: {
  //   switcher: "",
  //   gate: "wss://game-xb.chuxinhd.com:24008/",
  //   report: "",
  //   server_range: [21, 21]
  // },
  // // 正式服
  // zs: {
  //   switcher: "", //unused
  //   gate: `wss://game-xb.chuxinhd.com:24004/`, //网关地址(线上服需拼gateId {0})
  //   report: "", //unused
  // },

  // // 测试服
  // ts: {
  //   switcher: "", //unused
  //   gate: `wss://game-xb.chuxinhd.com:24004/`, //网关地址
  //   report: "", //unused
  //   server_range: [1, 10]
  // },

  // // 体验服
  // ty: {
  //   switcher: "", //unused
  //   gate: `wss://game-xb.chuxinhd.com:24006/`, //网关地址
  //   report: "", //unused
  //   server_range: [11, 11]
  // },
  // yimKey: "",
  // showUpdateTips: true,
  // openZdAct: true,
};

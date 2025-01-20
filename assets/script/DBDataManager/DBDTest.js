fetch(
  "https://gm-api-demo.chuxinhudong.com/v1/public/init?platform=chuxin&os=android&version=1.0.3&buildTime=1711961990&packageName=xxxx&language=zh-CN&appid=wjszm&nonce=999999&ts=&request_id=xxxxxx",
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // 根据你的需求设置
    },
  }
).then((data) => {
  console.log(data);
});

const crypto = require("crypto");

function generateSign(queryParams, fixedKey, timestamp) {
  const sortedKeys = Object.keys(queryParams).sort();
  const sortedParams = sortedKeys
    .map((key) => `${key}=${queryParams[key]}`)
    .join("&");
  const signString = `${sortedParams}&ts=${timestamp}&key=${fixedKey}`;
  const sign = crypto.createHash("md5").update(signString).digest("hex");
  return sign;
}

async function sendSignature() {
  const queryParams = { uid: "45457454" };
  const fixedKey = "BnoeCfV3s40rA5PKenbzdmLA8KswhJa7";
  const timestamp = Math.floor(new Date().getTime() / 1000); // 替换为实际时间戳
  console.log("timestamp", timestamp);
  const signature = generateSign(queryParams, fixedKey, timestamp);
  let url = `http://192.168.100.53:8080/activity?`;
  for (let key in queryParams) {
    url += `${key}=${queryParams[key]}&`;
  }

  fetch(url, {
    method: "GET", // GET 或者 'POST'，根据需要选择
    headers: {
      sign: signature,
      timestamp: timestamp,
      "Content-Type": "application/json", // 根据你的需求设置
    },
    // body: JSON.stringify(queryParams),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("成功:", data);
    })
    .catch((error) => {
      console.error("错误:", error);
    });
}

sendSignature();

var fs = require("fs");
var path = require("path");
const { isString } = require("util");
const ExcelJS = require("exceljs");

var ExcelPath =
  __dirname.split("tools")[0] + "assets\\resources" + "\\excel_config";

// 创建一个新的工作簿对象
const workbook = new ExcelJS.Workbook();

// 读取关卡数据
function readToJson(path) {
  const jsonString = fs.readFileSync(path, "utf8");
  if (jsonString.charCodeAt(0) === 0xfeff) {
    // Remove BOM from the jsonString
    return JSON.parse(jsonString.slice(1));
  }
  return JSON.parse(jsonString);
}

// 写入对应路径
function writeToJson(path, data) {
  const jsonStr = !isString(data) ? JSON.stringify(data) : data;

  // 添加 UTF-8 BOM
  const bom = Buffer.from("\uFEFF", "utf8");
  const dataWithBom = Buffer.concat([bom, Buffer.from(jsonStr, "utf8")]);

  // 写入文件
  fs.writeFileSync(path, dataWithBom);
}

function tryCollectExcel(dirPath, wirtePath) {
  return new Promise(async (resolve, reject) => {
    const files = fs.readdirSync(dirPath); // 读取目录下的所有文件和文件夹

    for (let file of files) {
      const filePath = path.join(dirPath, file); // 文件的完整路径
      const stats = fs.statSync(filePath); // 获取文件信息

      // 如果是文件，则进行处理
      if (stats.isFile()) {
        // meta文件不处理
        if (filePath.indexOf(".meta") !== -1) continue;
        // 读取对应文本
        await new Promise((resolve2, reject2) => {
          let cb = (coding) => {
            fs.readFile(filePath, coding, async (err, data) => {
              if (err) {
                consoleError(err);

                // 如果当前是utf16le格式，那就不用再试了
                if (coding === "utf8") {
                  cb("utf-16le");
                  return;
                } else {
                  return resolve2(false);
                }
              }

              if (!data) {
                resolve2(false);
                return;
              }

              // {"funopen": {['number', 'string'], ['id', 'guid'], ['编号', '资源'], [1, 'xbguidexx'], [2, 'xbguidexx22']}}
              let collectData = {};

              let isChange = true;

              // 递归遍历
              let repCb = (forData) => {
                // a = {"new":[{"id":1}, {"id":2}], "new2": [{"id": 1}]}
                for (let sheetKey in forData) {
                  // fileData = [{"id":1}] sheetKey = "new"
                  const fileData = forData[sheetKey];
                  collectData[sheetKey] = [];

                  // 第一个类型定义
                  collectData[sheetKey].push([]);

                  // 第二个字段名
                  collectData[sheetKey].push([]);

                  // 第三个备注
                  collectData[sheetKey].push(["编号"]);

                  collectData[sheetKey][0].push("number");

                  var isIterable = (obj) => {
                    return (
                      obj != null && typeof obj[Symbol.iterator] === "function"
                    );
                  };
                  if (!isIterable(fileData)) {
                    console.log(filePath + " 转excel失败");
                    resolve2(false);
                    isChange = false;
                    return;
                  }

                  if (Array.isArray(fileData)) {
                    // 类型判定
                    for (let fileJson1 of fileData) {
                      // fileJson = {"id": 1}
                      let count = 1;
                      for (let title in fileJson1) {
                        // title = "id";
                        const config = fileJson1[title];

                        if (!collectData[sheetKey][1].includes("id")) {
                          collectData[sheetKey][1].push("id");
                        }

                        // 字段名添加
                        if (!collectData[sheetKey][1].includes(title)) {
                          collectData[sheetKey][1].push(title);
                        }

                        // 先识别config的类型
                        if (typeof config === "number") {
                          // number表示添加
                          if (!collectData[sheetKey][0][count]) {
                            collectData[sheetKey][0].push("number");
                          }
                        } else {
                          // 全部转成string
                          if (!collectData[sheetKey][0][count]) {
                            collectData[sheetKey][0].push("string");
                          }
                        }
                        count += 1;
                      }
                    }

                    // 存一下内容
                    let index = 1;
                    for (let fileJson2 of fileData) {
                      // fileJson = {"id": 1}
                      let arr = [];
                      arr.push(index);
                      index += 1;
                      for (let title in fileJson2) {
                        // title = "id";
                        const config = fileJson2[title];

                        // 先识别config的类型
                        if (typeof config === "number") {
                          arr.push(config);
                        } else if (typeof config === "string") {
                          arr.push(config);
                        } else {
                          arr.push(config ? JSON.stringify(config) : "");
                        }
                      }
                      collectData[sheetKey].push(arr);
                    }
                  } else {
                    console.log(file + " 转excel失败");
                  }
                }
              };

              let inputData;
              if (data.charCodeAt(0) === 0xfeff) {
                // Remove BOM from the jsonString
                inputData = JSON.parse(data.slice(1));
              } else {
                try {
                  inputData = JSON.parse(data);
                } catch (err) {
                  cb("utf-16le");
                  return;
                }
              }

              repCb(inputData);
              if (collectData && isChange) {
                workbook.eachSheet((worksheet, sheetId) => {
                  workbook.removeWorksheet(sheetId);
                });
                const excelPathReal =
                  wirtePath + "\\" + file.split(".json")[0] + ".xlsx";
                for (let sheetName in collectData) {
                  if (fs.existsSync(excelPathReal)) {
                  } else {
                    // 没有这个路径的excel，新建一个
                    try {
                      const worksheet = workbook.addWorksheet(sheetName);
                      for (let info of collectData[sheetName]) {
                        worksheet.addRow(info);
                      }
                    } catch {
                      console.log("error");
                    }
                  }
                }

                // 写入
                workbook.xlsx
                  .writeFile(excelPathReal)
                  .then(() => {
                    resolve2(true);
                  })
                  .catch((error) => {
                    console.error("Error creating file:", error);
                    resolve2(true);
                  });
              } else {
                resolve2(true);
              }
            });
          };

          // 先试试utf8
          try {
            cb("utf8");
          } catch (err) {
            cb("utf-16le");
          }
        });
      } else if (stats.isDirectory()) {
        // 如果是文件夹，则递归调用函数继续读取文件夹内的文件
        let filesName = filePath.split(
          __dirname.split("tools")[0] + "assets\\resources\\config"
        )[1];
        var directoryPath =
          __dirname.split("tools")[0] +
          "assets\\resources" +
          "\\excel_config" +
          filesName;
        if (!fs.existsSync(directoryPath)) {
          fs.mkdir(directoryPath, async (err) => {
            if (err) {
              console.error("Error creating directory:", err);
            }
            await tryCollectExcel(filePath, directoryPath);
          });
        } else {
          await tryCollectExcel(filePath, directoryPath);
        }
      }
    }
    resolve(true);
  });
}

function tryToJson(dirPath) {
  return new Promise(async (resolve, reject) => {
    const files = fs.readdirSync(dirPath); // 读取目录下的所有文件和文件夹

    for (let file of files) {
      const filePath = path.join(dirPath, file); // 文件的完整路径
      const stats = fs.statSync(filePath); // 获取文件信息

      // 如果是文件，则进行处理
      if (stats.isFile()) {
        // meta文件不处理
        if (filePath.indexOf(".meta") !== -1) continue;
        // 读取对应文本
        await new Promise((resolve2, reject2) => {
          // 读取 Excel 文件
          workbook.xlsx
            .readFile(filePath)
            .then(async () => {
              // 是否有Language_多语言表
              if (!fs.existsSync(filePath)) {
                console.error("Error reading file 1:" + filePath);
                resolve2(false);
                return;
              }

              let writeJson = {};

              workbook.eachSheet((worksheet, sheetId) => {
                writeJson[worksheet.name] = [];

                // 开始读取
                const rowArr = worksheet.getRow(1).values;
                let curTime = Date.now();

                worksheet.eachRow((row, rowNumber) => {
                  if (rowNumber === 1 || rowNumber === 2 || rowNumber === 3) {
                    return;
                  }
                  let jsonData = {};
                  let values2 = worksheet.getRow(2).values;
                  for (let i = 2; i < values2.length; i++) {
                    jsonData[values2[i]] = null;
                  }
                  let arr = [];
                  for (let i = 2; i < row.values.length; i++) {
                    if (rowArr[i] === "number") {
                      arr.push(row.values[i]);
                    } else {
                      if (
                        typeof row.values[i] == "string" &&
                        row.values[i][0] == "{"
                      ) {
                        arr.push(JSON.parse(row.values[i]));
                      } else {
                        arr.push(row.values[i]);
                      }
                    }
                  }

                  let indexLog = 0;
                  for (let rowKey in jsonData) {
                    jsonData[rowKey] = arr[indexLog];
                    indexLog += 1;
                  }
                  writeJson[worksheet.name].push(jsonData);
                });
                // console.log("endTime：" + (Date.now() - curTime)/ 1000);
              });

              const writeFilePath =
                __dirname.split("tools")[0] +
                "assets\\resources" +
                "\\config" +
                filePath.split(dirPath)[1].split("\\" + file)[0] +
                "\\" +
                file.split(".xlsx")[0] +
                ".json";
              const jsonStr = !isString(writeJson)
                ? JSON.stringify(writeJson)
                : writeJson;

              // 添加 UTF-8 BOM
              const bom = Buffer.from("\uFEFF", "utf8");
              const dataWithBom = Buffer.concat([
                bom,
                Buffer.from(jsonStr, "utf8"),
              ]);

              console.log(filePath);

              // 文件写入
              fs.writeFile(writeFilePath, dataWithBom, (err) => {
                if (err) {
                  console.error(err);
                  resolve2(false);
                  return;
                }
                resolve2(true);
              });
            })
            .catch((err) => {
              // 处理读取文件时出现的错误
              console.error("Error reading file 2:" + err);
            });
        });
      } else if (stats.isDirectory()) {
        await tryToJson(filePath);
      }
    }
    resolve(true);
  });
}

// 开始解析
async function run() {
  try {
    let curTime = Date.now();
    var checkPath =
      __dirname.split("tools")[0] + "assets\\resources" + "\\excel_config";
    if (!fs.existsSync(checkPath)) {
      // 创建一个文件
      fs.mkdir(checkPath, async (err) => {
        if (err) {
          console.error("Error creating directory:", err);
          return;
        }
        await tryCollectExcel(
          __dirname.split("tools")[0] + "assets\\resources" + "\\config",
          ExcelPath
        );
        console.log("endTime：" + (Date.now() - curTime) / 1000);
      });
    } else {
      await tryCollectExcel(
        __dirname.split("tools")[0] + "assets\\resources" + "\\config",
        ExcelPath
      );
      console.log("endTime：" + (Date.now() - curTime) / 1000);
    }

    // var checkPath = __dirname.split("tools")[0] + "assets\\resources" + "\\excel_config";

    // if (!fs.existsSync(checkPath)) {
    //   // 创建一个文件
    //   fs.mkdir(checkPath, async (err) => {
    //     if (err) {
    //       console.error("Error creating directory:", err);
    //       return;
    //     }
    //     await tryToJson(checkPath);
    //   });
    // } else {
    //   await tryToJson(checkPath);
    // }
  } catch (error) {
    console.error(error);
  }
}

run();

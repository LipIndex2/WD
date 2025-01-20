"use strict";

var Fs = require("fs");
var Path = require("path");

var inject_script = `
(function () {
    // localPackageVersion 本地安装版本号
    // packageVersionStr 打包版本号字符串
    // localResVersion 本地资源版本号

    if (typeof window.jsb === "object") {
      //打包版本号，打包工具替换
      var packageVersionStr = "10203,1.2.3,1234567890";
      localStorage.setItem("packageVersionStr", packageVersionStr);
      var hotUpdateSearchPaths = localStorage.getItem("HotUpdateSearchPaths");

      //清空旧版本内容
      var localPackageVersion = localStorage.getItem("localPackageVersion");
      var packageVersion = packageVersionStr.split(",")[1];
      if (
        localPackageVersion == null ||
        localPackageVersion == "undefined" ||
        parseFloat(localPackageVersion) != parseFloat(packageVersion)
      ) {
        var storagePath =
          (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") +
          "xibu-remote-assets-dev";
        if (storagePath) {
          console.log("app install remove Directory: " + storagePath);
          jsb.fileUtils.removeDirectory(storagePath);
        }
        if (hotUpdateSearchPaths) {
          console.log(
            "app install remove localStorage:" + hotUpdateSearchPaths
          );
          localStorage.removeItem(hotUpdateSearchPaths);
        }
        localStorage.setItem("localPackageVersion", packageVersion);
        localStorage.setItem("localResVersion", packageVersion);
      }

      //清理temp目录
      if (hotUpdateSearchPaths) {
        var paths = JSON.parse(hotUpdateSearchPaths);
        jsb.fileUtils.setSearchPaths(paths);

        var fileList = [];
        var storagePath = paths[0] || "";
        var tempPath = storagePath + "_temp/";
        var baseOffset = tempPath.length;

        if (
          jsb.fileUtils.isDirectoryExist(tempPath) &&
          !jsb.fileUtils.isFileExist(tempPath + "project.manifest.temp")
        ) {
          jsb.fileUtils.listFilesRecursively(tempPath, fileList);
          fileList.forEach((srcPath) => {
            var relativePath = srcPath.substr(baseOffset);
            var dstPath = storagePath + relativePath;

            if (srcPath[srcPath.length] == "/") {
              jsb.fileUtils.createDirectory(dstPath);
            } else {
              if (jsb.fileUtils.isFileExist(dstPath)) {
                jsb.fileUtils.removeFile(dstPath);
              }
              jsb.fileUtils.renameFile(srcPath, dstPath);
            }
          });
          jsb.fileUtils.removeDirectory(tempPath);
        }
      }
    }
})();
`;

exports.onAfterBuild = function (options, result) {
  var url = Path.join(result.dest, "data", "main.js");

  if (!Fs.existsSync(url)) {
    url = Path.join(result.dest, "assets", "main.js");
  }

  Fs.readFile(url, "utf8", function (err, data) {
    if (err) {
      throw err;
    }

    var newStr = inject_script + data;
    Fs.writeFile(url, newStr, function (error) {
      if (err) {
        throw err;
      }
      console.warn("SearchPath updated in built main.js for hot update");
    });
  });
};

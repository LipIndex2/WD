"use strict";
//FYI: https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDestroy = exports.onPublish = void 0;
const csharp_1 = require("csharp");
const ClientTools_1 = require("./ClientTools");
const pag_view = csharp_1.FairyEditor.App.libView.contextMenu;
pag_view.AddItem("客户端工具", "clientTool", 0, true, () => {
    let menu = pag_view.GetSubMenu("clientTool");
    menu.ClearItems();
    menu.AddItem("初始化View(剪切板)", "initView", () => {
        ClientTools_1.ClientTool.InitView();
    });
    menu.AddItem("初始化Panel(剪切板)", "initPanel", () => {
        ClientTools_1.ClientTool.InitPanel();
    });
    menu.AddItem("初始化Item(剪切板)", "initItem", () => {
        ClientTools_1.ClientTool.InitItem();
    });
    menu.AddItem("中文转拼音", "initItem", () => {
        ClientTools_1.ClientTool.Rename();
    });
    menu.AddItem("检查字体设置", "initItem", () => {
        ClientTools_1.ClientTool.CheckFont();
    });
});
function onPublish(handler) {
}
exports.onPublish = onPublish;
function onDestroy() {
    pag_view.RemoveItem("clientTool");
}
exports.onDestroy = onDestroy;

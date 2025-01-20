//FYI: https://github.com/Tencent/puerts/blob/master/doc/unity/manual.md

import { FairyEditor } from 'csharp';
import { ClientTool } from './ClientTools';

const pag_view = FairyEditor.App.libView.contextMenu
pag_view.AddItem("客户端工具", "clientTool", 0, true, () => {
    let menu = pag_view.GetSubMenu("clientTool");
    menu.ClearItems();
    menu.AddItem("初始化View(剪切板)", "initView", () => {
        ClientTool.InitView();
    });
    menu.AddItem("初始化Panel(剪切板)", "initPanel", () => {
        ClientTool.InitPanel();
    });
    menu.AddItem("初始化Item(剪切板)", "initItem", () => {
        ClientTool.InitItem();
    });
    menu.AddItem("中文转拼音", "initItem", () => {
        ClientTool.Rename();
    });
    menu.AddItem("检查字体设置", "initItem", () => {
        ClientTool.CheckFont();
    });
})

function onPublish(handler: FairyEditor.PublishHandler) {
}

function onDestroy() {
    pag_view.RemoveItem("clientTool");
}

export { onPublish, onDestroy };
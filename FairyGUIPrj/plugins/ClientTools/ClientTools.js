"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientTool = void 0;
const csharp_1 = require("csharp");
const pinyin_1 = require("./pinyin");
class CodeWriter {
    showStr = "";
    blockNum = 0;
    write(show_str, block = 0) {
        if (block == -1) {
            this.endBock();
        }
        let prefix = "";
        for (let i = 0; i < this.blockNum; i++) {
            prefix += "\t";
        }
        this.towrite(prefix + show_str, 1);
        if (block == 1) {
            this.startBlock();
        }
        return this;
    }
    towrite(text, pos) {
        if (pos == -1) {
            this.showStr = text + "\n" + this.showStr;
        }
        else if (pos == 1) {
            this.showStr = this.showStr + text + "\n";
        }
    }
    fromList = [];
    addImport(from_path) {
        if (this.fromList.findIndex(from => from == from_path) == -1) {
            this.fromList.push(from_path);
        }
    }
    writeImport() {
        //头文件排序方式，按路径排序，路径小的排在前
        let from_str = "";
        this.fromList.sort((a, b) => {
            let a_path = "";
            a.replace(/\"(.*)\"/, (match, ...args) => { a_path = match; return match; });
            let b_path = "";
            b.replace(/\"(.*)\"/, (match, ...args) => { b_path = match; return match; });
            let a_split = a_path.split("/");
            let b_split = b_path.split("/");
            if (a_split.length != b_split.length) {
                return a_split.length - b_split.length;
            }
            for (let i = 0; i < a_split.length; i++) {
                if (a_split[i] != b_split[i]) {
                    return a_split[i] > b_split[i] ? 1 : -1;
                }
            }
            return 1;
        });
        this.fromList.forEach(str => {
            from_str = from_str + str + "\n";
        });
        this.towrite(from_str, -1);
    }
    btnList = [];
    addBtn(btnName) {
        this.btnList.push(btnName);
    }
    writeBtn() {
        this.btnList.forEach(name => {
            let func_name = `onClick${name.replace(/(btn|Btn)/, "")}`;
            this.write(`this.viewNode.${name}.onClick(this.${func_name}.bind(this));`);
        });
    }
    writeBtnFunc() {
        this.btnList.forEach(name => {
            let func_name = `onClick${name.replace(/(btn|Btn)/, "")}`;
            this.write(`private ${func_name}(){`, 1);
            this.write(`}`, -1);
            this.writeLine();
        });
    }
    startBlock() {
        this.blockNum += 1;
        return this;
    }
    endBock() {
        this.blockNum = Math.max(this.blockNum - 1, 0);
        return this;
    }
    writeLine() {
        this.showStr += "\n";
        return this;
    }
    reset() {
        this.showStr = "";
        this.blockNum = 0;
    }
    toString() {
        return this.showStr;
    }
    copy() {
        csharp_1.FairyEditor.Clipboard.SetText(this.toString());
    }
}
//type:组件名字  from:是否需要引入  button:是否按钮(加click事件)
var componentMod = {
    //CommonButton
    "k50sc": { type: "CommonButton", from: `import { CommonButton } from "modules/extends/CommonButton";`, button: true },
    "e5bmi": { type: "CommonButton", from: `import { CommonButton } from "modules/extends/CommonButton";`, button: true },
    "e5bmg": { type: "CommonButton", from: `import { CommonButton } from "modules/extends/CommonButton";`, button: true },
    "e5bmh": { type: "CommonButton", from: `import { CommonButton } from "modules/extends/CommonButton";`, button: true },
    //CommonItem
    "i45bv": { type: "ItemCell", from: `import { ItemCell } from "modules/extends/ItemCell";` },
    //CommonWidgets
    "khuz22": { type: "BoardScore", from: `import { BoardScore } from "modules/extends/BoardScore";` },
    "jcaj0": { type: "RedPoint", from: `import { RedPoint } from "modules/extends/RedPoint";` },
    //CommonTips
    "e5bm0": { type: "EmptyTip", from: `import { EmptyTip } from "modules/extends/EmptyTip";` },
};
class NodeType {
    static Format(node, link_str) {
        return `${node.GetAttribute("name")}: ${link_str},`;
    }
    //是否组件
    static IsCommponent(node, code) {
        if (node.name != "component") {
            return false;
        }
        if (!node.HasAttribute('src')) {
            return false;
        }
        let src = node.GetAttribute("src");
        let name = node.GetAttribute("name");
        //有注册组件，算按钮
        if (componentMod[src]) {
            let cfg = componentMod[src];
            code.write(NodeType.Format(node, `<${cfg.type}>null`));
            if (cfg.from) {
                code.addImport(cfg.from);
            }
            if (cfg.button) {
                code.addBtn(name);
                console.error(`加入按钮了 ${name}`);
            }
            return true;
        }
        //如果名字带btn的,算按钮，加点击
        if (name.startsWith("btn") || name.startsWith("Btn")) {
            code.write(NodeType.Format(node, `<fgui.GButton>null`));
            code.addBtn(name);
            return true;
        }
        return false;
    }
    //是否文本
    static IsText(node, code) {
        let name = node.GetAttribute("name");
        if (node.name == "text") {
            if (name.startsWith("lbl") || name.startsWith("Lbl")) {
                code.write(NodeType.Format(node, "<fgui.GTextField>null"));
                return true;
            }
        }
        return false;
    }
    //是否富文本
    static IsRichText(node, code) {
        let name = node.GetAttribute("name");
        if (node.name == "richtext") {
            if (name.startsWith("lbl") || name.startsWith("Lbl")) {
                code.write(NodeType.Format(node, "<fgui.GRichTextField>null"));
                return true;
            }
        }
        return false;
    }
    static IsList(node, code) {
        if (node.name == "list") {
            code.write(NodeType.Format(node, "<fgui.GList>null"));
            return true;
        }
        return false;
    }
    static IsLoader(node, code) {
        if (node.name == "loader") {
            code.write(NodeType.Format(node, "<fgui.GLoader>null"));
            return false;
        }
        return false;
    }
}
class ClientTool {
    static isXml() {
        let lib_view = csharp_1.FairyEditor.App.libView;
        const select = lib_view.GetSelectedResource();
        if (select && select.fileName.endsWith(".xml")) {
            if (select.fileName == "package.xml") {
                return null;
            }
            return select;
        }
        return null;
    }
    static InitView() {
        let select = this.isXml();
        if (select == null) {
            return;
        }
        let com_asset = new csharp_1.FairyEditor.ComponentAsset(select);
        let dis_node = com_asset.xml.GetNode("displayList");
        if (dis_node == null) {
            return;
        }
        let elemets = dis_node.Elements();
        //#region 初始化xml列表
        let obj_list = [];
        for (let i = 0; i < elemets.Count; i++) {
            let x_node = elemets.get_Item(i);
            let name = x_node.GetAttribute("name");
            //排除掉默认名字
            if (name.match(/^n\d+$/)) {
                continue;
            }
            //组大部分时候不需要，暂时就不考虑了
            if (x_node.name == "group") {
                continue;
            }
            obj_list.push(x_node);
        }
        //#endregion
        let writer = new CodeWriter();
        writer.addImport(`import * as fgui from "fairygui-cc";`);
        writer.addImport(`import { BaseView, boardCfg, ViewLayer, ViewMask, viewRegcfg } from "modules/common/BaseView";`);
        writer.addImport(`import { Language } from "modules/common/Language";`);
        writer.addImport(`import { Mod } from "modules/common/ModuleDefine";`);
        writer.writeLine();
        writer.write(`export class Temp extends BaseView {`, 1);
        {
            let hasBoard = obj_list.find(node => node.GetAttribute("name") == "board");
            let boards = {
                one: "k50s0",
                two: "k50s1"
            };
            //#region viewRegcfg
            writer.writeLine();
            writer.write("protected viewRegcfg: viewRegcfg = {", 1);
            {
                writer.write(`UIPackName: "Temp",`);
                writer.write(`ViewName: "PetView",`);
                writer.write(`LayerType: ViewLayer.Normal,`);
                if (hasBoard && hasBoard.GetAttribute("src") == boards.two) {
                    writer.write(`ViewMask: ViewMask.BgBlockClose`);
                }
            }
            writer.write(`};`, -1);
            //#endregion
            //#region boardCfg
            if (hasBoard) {
                //背景1
                if (hasBoard.GetAttribute("src") == boards.one) {
                    writer.write("protected boardCfg: boardCfg = {", 1);
                    writer.write("TabberCfg: [", 1);
                    {
                        writer.write(`{ panel: PetAttrPanel, viewName: "AttrPanel", titleName: Language.Pet.TabPet, modKey: Mod.Pet.Attr, NotShow: true },`);
                        writer.write(`{ panel: PetTunShiPanel, viewName: "TunShiPanel", titleName: Language.Pet.TabTunShi, modkey: Mod.Pet.TunShi, NotShow: true },`);
                        writer.write(`{ panel: PetSkillPanel, viewName: "SkillPanel", titleName: Language.Pet.TabSkill, modkey: Mod.Pet.Skill, NotShow: true }`);
                    }
                    writer.write("]", -1);
                    writer.write(`};`, -1);
                }
                //背景2
                if (hasBoard.GetAttribute("src") == boards.two) {
                    writer.write("protected boardCfg: boardCfg = {", 1);
                    writer.write(`BoardTitle: Language.Pet.Temp`);
                    writer.write(`};`, -1);
                }
            }
            //#endregion
            //#region viewNode
            writer.writeLine();
            writer.write(`protected viewNode = {`, 1);
            {
                obj_list.forEach(node => {
                    if (!NodeType.IsCommponent(node, writer)) {
                        if (!NodeType.IsList(node, writer)) {
                            if (!NodeType.IsText(node, writer)) {
                                if (!NodeType.IsRichText(node, writer)) {
                                }
                            }
                        }
                    }
                });
            }
            writer.write(`}`, -1);
            //#endregion
            //#region extendsCfg
            writer.writeLine();
            writer.write(`protected extendsCfg = [`, 1);
            writer.write(`{ ResName: "PetNameItem", ExtendsClass: PetNameItem },`);
            writer.write(`];`, -1);
            //#endregion
            //#region InitData
            writer.writeLine();
            writer.write(`InitData() {`, 1);
            writer.writeBtn();
            writer.write(`}`, -1);
            //#endregion
            //InitPanel
            writer.writeLine();
            writer.write(`InitUI() {`, 1);
            writer.write(`}`, -1);
            writer.writeLine();
            writer.write(`DoOpenWaitHandle() {`, 1);
            writer.write(`}`, -1);
            writer.writeLine();
            writer.write(`OpenCallBack() {`, 1);
            writer.write(`}`, -1);
            writer.writeLine();
            writer.write(`CloseCallBack() {`, 1);
            writer.write(`}`, -1);
            //注册按钮点击事件
            writer.writeLine();
            writer.writeBtnFunc();
        }
        writer.write(`}`, -1);
        //头文件排序方式，按路径排序，路径小的排在前
        //注册引入
        writer.writeImport();
        writer.copy();
        console.log("成功---------------..");
    }
    static InitPanel() {
        let select = this.isXml();
        if (select == null) {
            return;
        }
        let com_asset = new csharp_1.FairyEditor.ComponentAsset(select);
        let dis_node = com_asset.xml.GetNode("displayList");
        let elemets = dis_node.Elements();
        //#region 初始化xml列表
        let obj_list = [];
        for (let i = 0; i < elemets.Count; i++) {
            let x_node = elemets.get_Item(i);
            let name = x_node.GetAttribute("name");
            //排除掉默认名字
            if (name.match(/^n\d+$/)) {
                continue;
            }
            //组大部分时候不需要，暂时就不考虑了
            if (x_node.name == "group") {
                continue;
            }
            obj_list.push(x_node);
        }
        //#endregion
        let writer = new CodeWriter();
        writer.addImport(`import * as fgui from "fairygui-cc";`);
        writer.addImport(`import { BasePanel } from "modules/common/BasePanel";`);
        writer.writeLine();
        writer.write(`export class null viewName extends BasePanel {`, 1);
        {
            //#region viewNode
            writer.writeLine();
            writer.write("protected viewNode = {", 1);
            {
                obj_list.forEach(node => {
                    if (!NodeType.IsCommponent(node, writer)) {
                        if (!NodeType.IsList(node, writer)) {
                            if (!NodeType.IsText(node, writer)) {
                                if (!NodeType.IsRichText(node, writer)) {
                                }
                            }
                        }
                    }
                });
            }
            writer.write(`}`, -1);
            //#endregion
            //#region InitPanelData
            writer.writeLine();
            writer.write(`InitPanelData() {`, 1);
            writer.writeBtn();
            writer.write(`}`, -1);
            //#endregion
            //InitPanel
            writer.writeLine();
            writer.write(`InitPanel() {`, 1);
            writer.write(`}`, -1);
            //注册按钮点击事件
            writer.writeLine();
            writer.writeBtnFunc();
        }
        writer.write(`}`, -1);
        //头文件排序方式，按路径排序，路径小的排在前
        //注册引入
        writer.writeImport();
        writer.copy();
        console.log("成功---------------..");
    }
    static InitItem() {
        let select = this.isXml();
        if (select == null) {
            return;
        }
        let com_asset = new csharp_1.FairyEditor.ComponentAsset(select);
        let dis_node = com_asset.xml.GetNode("displayList");
        let elemets = dis_node.Elements();
        //#region 初始化xml列表
        let obj_list = [];
        for (let i = 0; i < elemets.Count; i++) {
            let x_node = elemets.get_Item(i);
            let name = x_node.GetAttribute("name");
            //排除掉默认名字
            if (name.match(/^n\d+$/)) {
                continue;
            }
            //组大部分时候不需要，暂时就不考虑了
            if (x_node.name == "group") {
                continue;
            }
            obj_list.push(x_node);
        }
        //#endregion
        let writer = new CodeWriter();
        writer.write(`class PetMiniSkill extends fgui.GComponent {`, 1);
        {
            //#region viewNode
            writer.writeLine();
            writer.write("private viewNode = {", 1);
            {
                obj_list.forEach(node => {
                    if (!NodeType.IsCommponent(node, writer)) {
                        if (!NodeType.IsList(node, writer)) {
                            if (!NodeType.IsText(node, writer)) {
                                if (!NodeType.IsRichText(node, writer)) {
                                }
                            }
                        }
                    }
                });
            }
            writer.write(`}`, -1);
            //#endregion
            //#region onConstruct
            writer.writeLine();
            writer.write(`protected onConstruct(): void {`, 1);
            writer.write(`ViewManager.Inst().RegNodeIofo(this.viewNode, this);`);
            writer.writeBtn();
            writer.write(`}`, -1);
            //#endregion
            //InitPanel
            writer.writeLine();
            writer.write(`public SetData(data: any) {`, 1);
            writer.write(`this.data = data`);
            writer.write(`}`, -1);
            //注册按钮点击事件
            writer.writeLine();
            writer.writeBtnFunc();
        }
        writer.write(`}`, -1);
        //头文件排序方式，按路径排序，路径小的排在前
        //注册引入
        writer.copy();
        console.log("成功---------------..");
    }
    //中文转英文
    static Rename() {
        let pinyin = new pinyin_1.Pinyin({ charCase: 0, checkPolyphone: true });
        let lib_view = csharp_1.FairyEditor.App.libView;
        const select_list = lib_view.GetSelectedResources(false);
        select_list.ForEach(pkg_item => {
            if (pkg_item.fileName.endsWith(".png")) {
                let base_name = pkg_item.name;
                let new_name = pinyin.getFullChars(base_name);
                pkg_item.owner.RenameItem(pkg_item, new_name);
                // pkg_item.owner.Save();
            }
        });
    }
    //检测是否为设置字体
    static CheckFont() {
        let lib_view = csharp_1.FairyEditor.App.libView;
        const select_list = lib_view.GetSelectedResources(false);
        select_list.ForEach(pkg_item => {
            if (pkg_item.fileName.endsWith(".xml")) {
                let com_asset = new csharp_1.FairyEditor.ComponentAsset(pkg_item);
                let dis_node = com_asset.xml.GetNode("displayList");
                if (dis_node == null) {
                    return;
                }
                let elemets = dis_node.Elements();
                let obj_list = [];
                for (let i = 0; i < elemets.Count; i++) {
                    let x_node = elemets.get_Item(i);
                    if (x_node.name == "text" || x_node.name == "richtext") {
                        if (!x_node.HasAttribute("font")) {
                            console.error(`${pkg_item.name} 中 ${x_node.GetAttribute("name")} 未设置字体`);
                        }
                    }
                }
            }
        });
        console.log("检查字体完毕............");
    }
}
exports.ClientTool = ClientTool;

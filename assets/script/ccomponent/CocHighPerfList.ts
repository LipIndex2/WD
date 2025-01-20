import { Component, HtmlTextParser, Node, NodeEventType, _decorator } from "cc";
import { Event, GComponent, GObject } from "fairygui-cc";
import { CommonEvent } from "modules/common/CommonEvent";
import { EventCtrl } from "modules/common/EventCtrl";
import { TYPE_TIMER } from "modules/time/Timer";

const { ccclass, property } = _decorator;

@ccclass("CocHighPerfList")
export class CocHighPerfList extends Component {
    private p: Node;
    private _ht: TYPE_TIMER;
    private _comps: GComponent[]
    static emit(node: Node) {
        if (node) {
            let co: Node = node.cochp
            if (co) {
                co.emit(CommonEvent.NODE_CHILDREN_LIST);
            }
        }
    }
    onLoad() {
        let t = this;
        // const _owner: GComponent = <GComponent>GObject.cast(t.node);
        t.node.on(Node.EventType.CHILD_ADDED, t.reList, t);
        t.node.on(Node.EventType.CHILD_REMOVED, t.reList, t);
        t.node.on(CommonEvent.NODE_CHILDREN_LIST, t.reList, t);
        // t.node.on(NodeEventType.SIBLING_ORDER_CHANGED, t.reList, t);
        let p = t.node
        if (t.node.name == "Container") {
            p = t.node.parent;
            while (p && p.name != "GList") {
                p = p.parent;
            }
        }

        if (p) {
            t.p = p;
            p.on(Event.SCROLL, t.reList, t);
            p.on(Event.SETDATA, t.reList, t);
        }
    }

    onEnable() {
        this.reList(true);
    }

    onDestroy() {
        let t = this;
        t.node.off(Node.EventType.CHILD_ADDED, t.reList, t);
        t.node.off(Node.EventType.CHILD_REMOVED, t.reList, t);
        t.node.off(CommonEvent.NODE_CHILDREN_LIST, t.reList, t);
        // t.node.off(NodeEventType.SIBLING_ORDER_CHANGED, t.reList, t);
        if (t.p) {
            t.p.off(Event.SCROLL, t.reList, t);
            t.p.off(Event.SETDATA, t.reList, t);
        }
        let node = t.node;
        if (node.children2) {
            node.children2.forEach(element => {
                element && (element.cochp = undefined);
            });
            node.children2 = undefined;
        }
        this._comps = undefined;
        this._children = undefined;
    }

    public setComp(...comps: GComponent[]) {
        this._comps = comps;
    }
    private _children = [];
    private reList(isInit = true) {
        let t = this;
        let node = t.node;


        let levels: Node[][] = [];
        let level = 0;
        let fun_reList = t.reList;
        let fun = function fun(node: Node) {
            let lvs = levels[level] = levels[level] || [];
            if (node) {
                if (node.name != "Container") {
                    lvs.push(node);
                    node.cochp = t.node;
                    if (isInit && (node.name == "UIEffectShow" || node.name == "GRichTextField" || node.name == "UISpineShow")) {
                        node.once(Node.EventType.CHILD_ADDED, fun_reList, t);
                    }
                };
                node.children.forEach(function (element) {
                    level += 1;
                    fun(element);
                });
            }
        };

        this._children.length = 0;

        if (!t._comps || t._comps.length == 0) {
            let c: readonly Node[] = node.children;
            c.forEach(function (element) {
                fun(element);
                level = 0;
            });
        } else {
            // for (let index = 0; index < t._comps.length; index++) {
            //     const element = t._comps[index];
            //     this._children.
            // }
            t._comps.forEach(function (element) {
                fun(element._container);
                level = 0;
                // element.node.children2 = [];
            });
        }
        node.children2 = [].concat(...levels);
    }
}
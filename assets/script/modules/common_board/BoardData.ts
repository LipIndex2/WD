export class BoardData {
   view: any;
   help_key?: number | string;
   title?: string;
   constructor(view: any, title?: string, help_key?: number | string,) {
      this.view = view;
      this.title = title;
      this.help_key = help_key;
   }
}

export type tabberInfo = {
   panel: any,                //panel class
   viewName: string,          //View资源名字 
   titleName: string,         //panel name
   modKey?: number,           //panel modkey
   isRemind?: boolean,        //是否添加modeKey红点组
   NotShow?: boolean,         //是否显示地板背景图
   index?: number,            //用于区分可不填
   param?: any,               //任意用于传递
   guide?: string,            //用于指引
}
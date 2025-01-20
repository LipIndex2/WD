import { BATTLE_ATTR } from "./CommonEnum";

export type AttrItem = { attr_type: number; attr_value: number };

export type AttrContItem = { attr_type: number; attr_value: number, new_value: number };

export type KeyFunction = { [key: string]: Function };

export type AccordionType = {
    [x: string]: any;
    index?: number;
    name: string;
}

export type AccordionData = {
    data: AccordionType;
    child: AccordionType[];
};

export type AccordionThreeData = {
    data: AccordionType;
    child: AccordionData[];
};

// 表示行列，i:行，j:列
export type MapIJ = {
    i:number;
    j:number;
}

// export type AttData = {
//     att_type: BATTLE_ATTR;
//     num: number;
// }


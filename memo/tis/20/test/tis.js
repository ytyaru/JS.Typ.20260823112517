import { describe, test, expect } from "bun:test";
import { tis } from "../src/tis.js";
import { Fn, Cls } from "../src/is/fn.js";
import { Obj, Des, Ins, } from "../src/is/obj.js";
import { baseTypeCases, numSubCases } from "./test-data.js";
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from "./test-data-type.js";
const data = {
top: [
    {key:'und', name:'Undefined', value: undefined},
    {key:'nul', name:'Null', value: null},
    {key:'bln', name:'Boolean', value: false},
    {key:'big', name:'BigInt', value: 0n},
    {key:'str', name:'String', value: ''},
    {key:'sym', name:'Symbol', value: Symbol()},
]
}
describe('tis', () => {
    describe('(v)', () => {
        test('defined', () => expect(tis).toBeDefined());
        test('function', () => expect('function'===typeof tis).toBe(true));
        test('run', ()=>{
            const e = tis(undefined);
            console.log(e);
        });
        test.each(data.top)('$name', ({ value, key }) => {
            const res = tis(value);
            for (const k of Object.keys(res)) {
                if (k === key) {
                    expect(res[k]).toBe(true);
                    expect(tis[k](value)).toBe(true);
                } else {
                    expect(res[k]).toBe(false);
                    expect(tis[k](value)).toBe(false);
                }
            }
        });
        /*
        test.each(baseTypeCases)("top-level keys exclusivity for $name", ({ value, expectedKey }) => {
            const res = tis(value);
            for (const key of Object.keys(res)) {
                if (key === expectedKey) {
                    expect(res[key]).toBe(true);
                    expect(tis[key](value)).toBe(true);
                } else {
                    expect(res[key]).toBe(false);
                    expect(tis[key](value)).toBe(false);
                }
            }
        });
        */
    });
});
import { describe, test, expect } from "bun:test";
import { tis } from "../src/tis.js";

const data = {
    top: [
        { key: 'und', name: 'Undefined', value: undefined, danger: true },
        { key: 'nul', name: 'Null',      value: null,      danger: true },
        { key: 'bln', name: 'Boolean',   value: false,     danger: false },
        { key: 'big', name: 'BigInt',    value: 0n,        danger: false },
        { key: 'str', name: 'String',    value: '',        danger: false },
        { key: 'sym', name: 'Symbol',    value: Symbol(),  danger: false },
    ]
};

describe('tis', () => {
    describe('(v)', () => {
        test('defined', () => expect(tis).toBeDefined());
        test('function', () => expect('function' === typeof tis).toBe(true));

        test.each(data.top)('$name', ({ value, key, danger }) => {
            const res = tis(value);
            
            for (const k of Object.keys(res)) {
                // 自動で true になるべき条件を判定
                let shouldBeTrue = false;
                if (k === key) shouldBeTrue = true;     // 1. 自分自身は必ず true
                if (k === 'g') shouldBeTrue = true;     // 2. g は必ず true
                if (k === 'd' && danger) shouldBeTrue = true; // 3. d は danger が true のときだけ

                expect(res[k]).toBe(shouldBeTrue);
                expect(tis[k](value)).toBe(shouldBeTrue);
            }
        });
    });
});

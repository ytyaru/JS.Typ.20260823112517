import { describe, test, expect } from "bun:test";
import { tis } from "../src/tis.js";
import { Fn, Cls } from "../src/is/fn.js";
import { Obj, Des, Ins, } from "../src/is/obj.js";
import { baseTypeCases, numSubCases } from "./test-data.js";
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from "./test-data-type.js";
const data = {
    top: [
        { key: 'und', name: 'Undefined', value: undefined, extra: ['d'] },
        { key: 'nul', name: 'Null',      value: null,      extra: ['d'] },
        { key: 'bln', name: 'Boolean',   value: false,     extra: [] },
        { key: 'big', name: 'BigInt',    value: 0n,        extra: [] },
        { key: 'str', name: 'String',    value: '',        extra: [] },
        { key: 'sym', name: 'Symbol',    value: Symbol(),  extra: [] },
        { key: 'int', name: 'Integer',   value: 42,        extra: ['fin'] },
        { key: 'fin', name: 'Finite',    value: 3.14,      extra: ['d'] },
        { key: 'obj', name: 'Object',    value: {},        extra: [] },
        { key: 'ary', name: 'Array',     value: [],        extra: [] },
        { key: 'run', name: 'Function',  value: () => {},  extra: [] },
        { key: 'cls', name: 'Class',     value: class A {},extra: [] },
        { key: 'ins', name: 'Instance',  value: new (class A {})(), extra: [] },
        { key: 'des', name: 'Descriptor',value: { value: 1 }, extra: [] },
        { key: 'd',   name: 'Danger(NaN)',value: NaN,      extra: [] },
        { key: 'g',   name: 'Group',     value: 0,         extra: ['int','fin'] },
    ]
};

describe('tis', () => {
    describe('(v)', () => {
        test('defined', () => expect(tis).toBeDefined());
        test('function', () => expect('function' === typeof tis).toBe(true));
        test.each(data.top)('$name', ({ name, value, key, extra }) => {
            const res = tis(value);
            for (const k of Object.keys(res)) {
                let shouldBeTrue = false;
                if (k === key) shouldBeTrue = true;
                if (k === 'g') shouldBeTrue = true;
                if (extra.includes(k)) shouldBeTrue = true;
                expect(res[k]).toBe(shouldBeTrue);
                expect(tis[k](value)).toBe(shouldBeTrue);
            }
        });
    });
});

import { describe, test, expect } from "bun:test";
import { tis } from "../src/tis.js";
import { Fn, Cls } from "../src/is/fn.js";
import { Obj, Des, Ins, } from "../src/is/obj.js";
import { baseTypeCases, numSubCases } from "./test-data.js";
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from "./test-data-type.js";
describe('tis', () => {
    describe('(v)', () => {
        test('defined', () => expect(tis).toBeDefined());
        test('function', () => expect('function'===typeof tis).toBe(true));
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
    });
});


import { describe, test, expect } from "bun:test";
import { tal,tet } from "../src/tal.js";
import { tis } from "../src/tis.js";
import { tow } from "../src/tow.js";
import { baseTypeCases, numSubCases } from "./test-data.js";
describe('tet', () => {
    test.each([['is'],['ow']])('has API(%p)',(n)=>{
        expect(tet).toHaveProperty(n);
        expect('function'===typeof tet[n]).toBe(true);
    });
    test('bin', ()=>expect(tet.is('bln')).toBe(tis.bln));
    test('num.inf.p', ()=>expect(tet.is('num.inf.p')).toBe(tis.num.inf.p));
});
describe('tal', () => {
    test.each([['is'],['ow']])('has API(%p)',(n)=>{
        expect(tal).toHaveProperty(n);
        expect('function'===typeof tal[n]).toBe(true);
    });
    test('bin', ()=>expect(tet.ow('bln')).toBe(tow.bln));
    test('num.inf.p', ()=>expect(tet.ow('num.inf.p')).toBe(tow.num.inf.p));
});
/*
describe("tet exhaustive test suite", () => {
    test.each(baseTypeCases)(
        "top-level keys exclusivity for $name",
        ({ value, expectedKey }) => {
            const res = tet(value);
            for (const key of Object.keys(res)) {
                if (key === expectedKey) {
                    expect(res[key]).toBe(true);
                    expect(tet[key](value)).toBe(true);
                } else {
                    expect(res[key]).toBe(false);
                    expect(tet[key](value)).toBe(false);
                }
            }
        }
    );

    test.each(numSubCases)("num details: $desc ($val)", ({ val, checks }) => {
        if ("int" in checks) expect(tet.num.int(val)).toBe(checks.int);
        //if ("fin" in checks) expect(tet.num.fin(val)).toBe(checks.fin);
        if ("bin" in checks) expect(tet.num.bin(val)).toBe(checks.bin);
        if ("nan" in checks) expect(tet.num.nan(val)).toBe(checks.nan);
        if ("inf" in checks) expect(tet.num.inf(val)).toBe(checks.inf);
        if ("p" in checks) expect(tet.num.inf.p(val)).toBe(checks.p);
        if ("n" in checks) expect(tet.num.inf.n(val)).toBe(checks.n);
        //if ("over" in checks) expect(tet.num.over(val)).toBe(checks.over);
        if ("over" in checks) expect(tet.num.bin.over(val)).toBe(checks.over);
    });

    test.each(baseTypeCases)(
        "tet(v) returns full object structure correctly for $name",
        ({ value, expectedKey }) => {
            const result = tet(value);
            const keys = Object.keys(result);
            
            for (const key of keys) {
                if (key === expectedKey) {
                    expect(result[key]).toBe(true);
                } else {
                    expect(result[key]).toBe(false);
                }
            }
        }
    );

    test('num.bin', ()=>{
        expect(tet.num.bin(Number.MAX_SAFE_INTEGER+1)).toBe(true);
        expect(tet.num.bin(Number.MIN_SAFE_INTEGER-1)).toBe(true);
        expect(tet.num.bin(Number.MAX_VALUE)).toBe(true);
        expect(tet.num.bin(Number.MAX_VALUE*-1)).toBe(true);
        expect(tet.num.bin(0)).toBe(false);
        expect(tet.num.bin(0.1)).toBe(true);
        expect(tet.num.bin(0.5)).toBe(true);
    });
    test('num.bin.over', ()=>{
        expect(tet.num.bin.over(Number.MAX_SAFE_INTEGER+1)).toBe(true);
        expect(tet.num.bin.over(Number.MIN_SAFE_INTEGER-1)).toBe(true);
        expect(tet.num.bin.over(Number.MAX_VALUE)).toBe(true);
        expect(tet.num.bin.over(Number.MAX_VALUE*-1)).toBe(true);
        expect(tet.num.bin.over(0)).toBe(false);
        expect(tet.num.bin.over(0.1)).toBe(false);
        expect(tet.num.bin.over(0.5)).toBe(false);
    });
    test('num.bin.flt', ()=>{
        expect(tet.num.bin.flt(Number.MAX_SAFE_INTEGER+1)).toBe(false);
        expect(tet.num.bin.flt(Number.MIN_SAFE_INTEGER-1)).toBe(false);
        expect(tet.num.bin.flt(Number.MAX_VALUE)).toBe(false);
        expect(tet.num.bin.flt(Number.MAX_VALUE*-1)).toBe(false);
        expect(tet.num.bin.flt(0)).toBe(true); // intだがfltでも真になる
        expect(tet.num.bin.flt(0.1)).toBe(true);
        expect(tet.num.bin.flt(0.5)).toBe(true);
    });
});
*/

import { describe, test, expect } from "bun:test";
import { Ag } from "../../src/is/ag.js";
import { baseTypeCases, numSubCases } from "../test-data.js";

const fn = function(){};
const bound = fn.bind(null);
const native = [].map;
const arrow = {s:v=>0, a:async()=>0};
describe('Ag', () => {
    describe('getFlag', () => {
        describe('fn', () => {
            test('bound', () => {
                const f = Ag.getFlag(bound);
                expect(f.s).toBe(true);
                expect(f.a).toBe(false);
                expect(f.g).toBe(false);
                expect(f.ag).toBe(false);
            });
            test('native', () => {
                const f = Ag.getFlag(native);
                expect(f.s).toBe(true);
                expect(f.a).toBe(false);
                expect(f.g).toBe(false);
                expect(f.ag).toBe(false);
            });
            describe('arrow', () => {
                test('', () => {
                    const f = Ag.getFlag(native);
                    expect(f.s).toBe(true);
                    expect(f.a).toBe(false);
                    expect(f.g).toBe(false);
                    expect(f.ag).toBe(false);
                });
                test('', () => {
                    const f = Ag.getFlag(native);
                    expect(f.s).toBe(true);
                    expect(f.a).toBe(false);
                    expect(f.g).toBe(false);
                    expect(f.ag).toBe(false);
                });


            });

            test('fn', () => {

            });
            test('md', () => {

            });
        });
        describe('cls', () => {

        });
    });
    describe('getName', () => {

    });
    describe('N', () => {
        test.each([['a','Async'],['g','Generator'],['s','Sync'],['f','Function'],['m','Method']])('(%s,%s)', (i,n)=>{
            expect(Ag.N[i]).toBe(n);
        });
    });

});
/*
describe("tis exhaustive test suite", () => {
    test.each(baseTypeCases)(
        "top-level keys exclusivity for $name",
        ({ value, expectedKey }) => {
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
        }
    );

    test.each(numSubCases)("num details: $desc ($val)", ({ val, checks }) => {
        if ("int" in checks) expect(tis.num.int(val)).toBe(checks.int);
        //if ("fin" in checks) expect(tis.num.fin(val)).toBe(checks.fin);
        if ("bin" in checks) expect(tis.num.bin(val)).toBe(checks.bin);
        if ("nan" in checks) expect(tis.num.nan(val)).toBe(checks.nan);
        if ("inf" in checks) expect(tis.num.inf(val)).toBe(checks.inf);
        if ("p" in checks) expect(tis.num.inf.p(val)).toBe(checks.p);
        if ("n" in checks) expect(tis.num.inf.n(val)).toBe(checks.n);
        //if ("over" in checks) expect(tis.num.over(val)).toBe(checks.over);
        if ("over" in checks) expect(tis.num.bin.over(val)).toBe(checks.over);
    });

    test.each(baseTypeCases)(
        "tis(v) returns full object structure correctly for $name",
        ({ value, expectedKey }) => {
            const result = tis(value);
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
        expect(tis.num.bin(Number.MAX_SAFE_INTEGER+1)).toBe(true);
        expect(tis.num.bin(Number.MIN_SAFE_INTEGER-1)).toBe(true);
        expect(tis.num.bin(Number.MAX_VALUE)).toBe(true);
        expect(tis.num.bin(Number.MAX_VALUE*-1)).toBe(true);
        expect(tis.num.bin(0)).toBe(false);
        expect(tis.num.bin(0.1)).toBe(true);
        expect(tis.num.bin(0.5)).toBe(true);
    });
    test('num.bin.over', ()=>{
        expect(tis.num.bin.over(Number.MAX_SAFE_INTEGER+1)).toBe(true);
        expect(tis.num.bin.over(Number.MIN_SAFE_INTEGER-1)).toBe(true);
        expect(tis.num.bin.over(Number.MAX_VALUE)).toBe(true);
        expect(tis.num.bin.over(Number.MAX_VALUE*-1)).toBe(true);
        expect(tis.num.bin.over(0)).toBe(false);
        expect(tis.num.bin.over(0.1)).toBe(false);
        expect(tis.num.bin.over(0.5)).toBe(false);
    });
    test('num.bin.flt', ()=>{
        expect(tis.num.bin.flt(Number.MAX_SAFE_INTEGER+1)).toBe(false);
        expect(tis.num.bin.flt(Number.MIN_SAFE_INTEGER-1)).toBe(false);
        expect(tis.num.bin.flt(Number.MAX_VALUE)).toBe(false);
        expect(tis.num.bin.flt(Number.MAX_VALUE*-1)).toBe(false);
        expect(tis.num.bin.flt(0)).toBe(true); // intだがfltでも真になる
        expect(tis.num.bin.flt(0.1)).toBe(true);
        expect(tis.num.bin.flt(0.5)).toBe(true);
    });
});
*/

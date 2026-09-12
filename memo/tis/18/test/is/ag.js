import { describe, test, expect } from "bun:test";
import { Ag } from "../../src/is/ag.js";
import { baseTypeCases, numSubCases } from "../test-data.js";

const fn = function(){};
const bound = fn.bind(null);
const native = [].map;
const arrow = {s:v=>0, a:async()=>0};
const es5 = {
    s: {n:function fn(){}, a:function(){}},
    a: async function(){},
    g: function*(){},
    ag: async function*(){},
};
class C {
    static sm() {}
    static *sgm() {}
    static async sam() {}
    static async *sagm() {}
    im() {}
    *igm() {}
    async iam() {}
    async *iagm() {}
}
const c = new C();
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
                test('s', () => {
                    const f = Ag.getFlag(arrow.s);
                    expect(f.s).toBe(true);
                    expect(f.a).toBe(false);
                    expect(f.g).toBe(false);
                    expect(f.ag).toBe(false);
                });
                test('a', () => {
                    const f = Ag.getFlag(arrow.a);
                    expect(f.s).toBe(false);
                    expect(f.a).toBe(true);
                    expect(f.g).toBe(false);
                    expect(f.ag).toBe(false);
                });
            });
            describe('es5', () => {
                describe('s', () => {
                    test('n', () => {
                        const f = Ag.getFlag(es5.s.n);
                        expect(f.s).toBe(true);
                        expect(f.a).toBe(false);
                        expect(f.g).toBe(false);
                        expect(f.ag).toBe(false);
                    });
                    test('a', () => {// Anonymous
                        const f = Ag.getFlag(es5.s.a);
                        expect(f.s).toBe(true);
                        expect(f.a).toBe(false);
                        expect(f.g).toBe(false);
                        expect(f.ag).toBe(false);
                    });
                });
                test('a', () => {
                    const f = Ag.getFlag(es5.a);
                    expect(f.s).toBe(false);
                    expect(f.a).toBe(true);
                    expect(f.g).toBe(false);
                    expect(f.ag).toBe(false);
                });
                test('g', () => {
                    const f = Ag.getFlag(es5.g);
                    expect(f.s).toBe(false);
                    expect(f.a).toBe(false);
                    expect(f.g).toBe(true);
                    expect(f.ag).toBe(false);
                });
                test('ag', () => {
                    const f = Ag.getFlag(es5.ag);
                    expect(f.s).toBe(false);
                    expect(f.a).toBe(false);
                    expect(f.g).toBe(false);
                    expect(f.ag).toBe(true);
                });
            });
            describe('md', () => {
                describe('static', () => {
                    test('s', () => {
                        const f = Ag.getFlag(C.sm);
                        expect(f.s).toBe(true);
                        expect(f.a).toBe(false);
                        expect(f.g).toBe(false);
                        expect(f.ag).toBe(false);
                    });
                    test('a', () => {
                        const f = Ag.getFlag(C.sam);
                        expect(f.s).toBe(false);
                        expect(f.a).toBe(true);
                        expect(f.g).toBe(false);
                        expect(f.ag).toBe(false);
                    });
                    test('g', () => {
                        const f = Ag.getFlag(C.sgm);
                        expect(f.s).toBe(false);
                        expect(f.a).toBe(false);
                        expect(f.g).toBe(true);
                        expect(f.ag).toBe(false);
                    });
                    test('ag', () => {
                        const f = Ag.getFlag(C.sagm);
                        expect(f.s).toBe(false);
                        expect(f.a).toBe(false);
                        expect(f.g).toBe(false);
                        expect(f.ag).toBe(true);
                    });
                });
                describe('instance', () => {
                    test('s', () => {
                        const f = Ag.getFlag(c.im);
                        expect(f.s).toBe(true);
                        expect(f.a).toBe(false);
                        expect(f.g).toBe(false);
                        expect(f.ag).toBe(false);
                    });
                    test('a', () => {
                        const f = Ag.getFlag(c.iam);
                        expect(f.s).toBe(false);
                        expect(f.a).toBe(true);
                        expect(f.g).toBe(false);
                        expect(f.ag).toBe(false);
                    });
                    test('g', () => {
                        const f = Ag.getFlag(c.igm);
                        expect(f.s).toBe(false);
                        expect(f.a).toBe(false);
                        expect(f.g).toBe(true);
                        expect(f.ag).toBe(false);
                    });
                    test('ag', () => {
                        const f = Ag.getFlag(c.iagm);
                        expect(f.s).toBe(false);
                        expect(f.a).toBe(false);
                        expect(f.g).toBe(false);
                        expect(f.ag).toBe(true);
                    });
                });
            });
        });
        describe('cls', () => {
            test('s', () => {
                const f = Ag.getFlag(C);
                expect(f.s).toBe(true);
                expect(f.a).toBe(false);
                expect(f.g).toBe(false);
                expect(f.ag).toBe(false);
            });
        });
    });
    describe('getName', () => {
        describe('Sync', () => {
            test.each([[es5.s.n],[es5.s.a],[arrow.s],[C.sm],[c.im]])('%p', v=>{
                expect(Ag.getName(Ag.getFlag(v),false)).toBe('Sync');
                expect(Ag.getName(Ag.getFlag(v),true)).toBe('');
            });
        });
        describe('Async', () => {
            test.each([[es5.a],[arrow.a],[C.sam],[c.iam]])('%p', v=>{
                expect(Ag.getName(Ag.getFlag(v))).toBe('Async');
            });
        });
        describe('Generator', () => {
            test.each([[es5.g],[C.sgm],[c.igm]])('%p', v=>{
                expect(Ag.getName(Ag.getFlag(v))).toBe('Generator');
            });
        });
        describe('AsyncGenerator', () => {
            test.each([[es5.ag],[C.sagm],[c.iagm]])('%p', v=>{
                expect(Ag.getName(Ag.getFlag(v))).toBe('AsyncGenerator');
            });
        });
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

import { describe, test, expect } from "bun:test";
import { Ag } from "../../src/is/ag.js";
import { Fn } from "../../src/is/fn.js";
import { baseTypeCases, numSubCases } from "../test-data.js";

const es5 = {
//    s: {n:function fn(){}, a:function(){}},
    s: {n:function fn(){}, a:eval('(function(){})')},
    a: async function(){},
    g: function*(){},
    ag: async function*(){},
};
const bound = es5.s.a.bind(null);
const native = [].map;
const arrow = {s:v=>0, a:async()=>0};
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
function Es5Cls(){this.x=1;}
const es5Cls = new Es5Cls();
describe('Fn', () => {
    describe('getFlag', () => {
        describe('is', () => {
            describe('false', () => {
                test.each([undefined,null,NaN,0,0n,false,'',Symbol(),{},[],c].map(x=>[x]))('%p', v=>{
                    expect(Fn.getFlag(v).is).toBe(false);
                });
            });
            describe('true', () => {
                test.each([C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Fn.getFlag(v).is).toBe(true);
                });
            });
        });
        describe('cls', () => {
            describe('is', () => {
                describe('true', () => {
                    test.each([C,Es5Cls,Date,Map,URL,RegExp,Uint8Array].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).cls.is).toBe(true);
                    });
                });
                describe('false', () => {
                    test.each([bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).cls.is).toBe(false);
                    });
                });
            });
            describe('es6', () => {
                describe('true', () => {
                    test.each([C].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).cls.es6).toBe(true);
                    });
                });
                describe('false', () => {
                    test.each([Es5Cls,Date,Map,URL,RegExp,Uint8Array].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).cls.es6).toBe(false);
                    });
                });
            });
            describe('es5', () => {
                describe('true', () => {
                    test.each([Es5Cls].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).cls.es5).toBe(true);
                    });
                });
                describe('false', () => {
                    test.each([C,Date,Map,URL,RegExp,Uint8Array].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).cls.es5).toBe(false);
                    });
                });
            });
            describe('native', () => {
                describe('true', () => {
                    test.each([Date,Map,URL,RegExp,Uint8Array].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).cls.native).toBe(true);
                    });
                });
                describe('false', () => {
                    test.each([C,Es5Cls].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).cls.native).toBe(false);
                    });
                });
            });
        });
        describe('fn', () => {
            describe('is', () => {
                describe('true', () => {
                    test.each([bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).fn.is).toBe(true);
                    });
                });
                describe('false', () => {
                    test.each([C,undefined,null,NaN,0,0n,false,'',Symbol(),{},[],c].map(x=>[x]))('%p', v=>{
//                        console.log(Fn.getFlag(v));
                        expect(Fn.getFlag(v).fn.is).toBe(false);
                    });
                });
            });
            describe('bound', () => {
                describe('true', () => {
                    test.each([bound].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).fn.bound).toBe(true);
                    });
                });
                describe('false', () => {
                    test.each([native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag,C,undefined,null,NaN,0,0n,false,'',Symbol(),{},[],c].map(x=>[x]))('%p', v=>{
//                        console.log(Fn.getFlag(v));
                        expect(Fn.getFlag(v).fn.bound).toBe(false);
                    });
                });
            });
            describe('native', () => {
                describe('true', () => {
                    test.each([native].map(x=>[x]))('%p', v=>{
                        expect(Fn.getFlag(v).fn.native).toBe(true);
                    });
                });
                describe('false', () => {
                    test.each([bound,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag,C,undefined,null,NaN,0,0n,false,'',Symbol(),{},[],c].map(x=>[x]))('%p', v=>{
//                        console.log(Fn.getFlag(v));
                        expect(Fn.getFlag(v).fn.native).toBe(false);
                    });
                });
            });
            describe('arrow', () => {
                describe('is', () => {
                    describe('true', () => {
                        test.each([arrow.s,arrow.a].map(x=>[x]))('%p', v=>{
                            expect(Fn.getFlag(v).fn.arrow.is).toBe(true);
                        });
                    });
                    describe('false', () => {
                        test.each([bound,native,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag,C,undefined,null,NaN,0,0n,false,'',Symbol(),{},[],c].map(x=>[x]))('%p', v=>{
                            expect(Fn.getFlag(v).fn.arrow.is).toBe(false);
                        });
                    });
                });
                describe('s', () => {
                    describe('true', () => {
                        test.each([arrow.s].map(x=>[x]))('%p', v=>{
                            expect(Fn.getFlag(v).fn.arrow.s).toBe(true);
                        });
                    });
                    describe('false', () => {
                        test.each([arrow.a].map(x=>[x]))('%p', v=>{
                            expect(Fn.getFlag(v).fn.arrow.s).toBe(false);
                        });
                    });
                });
                describe('a', () => {
                    describe('true', () => {
                        test.each([arrow.a].map(x=>[x]))('%p', v=>{
                            expect(Fn.getFlag(v).fn.arrow.a).toBe(true);
                        });
                    });
                    describe('false', () => {
                        test.each([arrow.s].map(x=>[x]))('%p', v=>{
                            expect(Fn.getFlag(v).fn.arrow.a).toBe(false);
                        });
                    });
                });
            });
            describe('es5', () => {
                describe('is', () => {
                    describe('true', () => {
                        test.each([es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                            expect(Fn.getFlag(v).fn.es5.is).toBe(true);
                        });
                    });
                    describe('false', () => {
                        test.each([bound,native,arrow.s,arrow.a,C,undefined,null,NaN,0,0n,false,'',Symbol(),{},[],c].map(x=>[x]))('%p', v=>{
                            expect(Fn.getFlag(v).fn.es5.is).toBe(false);
                        });
                    });
                });
                describe('s', () => {
                    describe('n', () => {
                        describe('true', () => {
                            test.each([es5.s.n].map(x=>[x]))('%p', v=>{
                                expect(Fn.getFlag(v).fn.es5.s.n).toBe(true);
                            });
                        });
                        describe('false', () => {
                            test.each([bound,native,arrow.s,arrow.a,es5.s.a,es5.a,es5.g,es5.ag,C,undefined,null,NaN,0,0n,false,'',Symbol(),{},[],c].map(x=>[x]))('%p', v=>{
                                expect(Fn.getFlag(v).fn.es5.s.n).toBe(false);
                            });
                        });
                    });
                    describe('a', () => {
                        describe('true', () => {
                            test.each([es5.s.a].map(x=>[x]))('%p', v=>{
                                expect(Fn.getFlag(v).fn.es5.s.a).toBe(true);
                            });
                        });
                        describe('false', () => {
                            test.each([bound,native,arrow.s,arrow.a,es5.s.n,es5.a,es5.g,es5.ag,C,undefined,null,NaN,0,0n,false,'',Symbol(),{},[],c].map(x=>[x]))('%p', v=>{
                                expect(Fn.getFlag(v).fn.es5.s.a).toBe(false);
                            });
                        });
                    });
                });
            });

            describe('', () => {

            });


        });
    });
});

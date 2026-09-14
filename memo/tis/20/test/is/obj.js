import { describe, test, expect } from "bun:test";
import { Ag } from "../../src/is/ag.js";
import { Fn } from "../../src/is/fn.js";
import { Obj } from "../../src/is/obj.js";
import { baseTypeCases, numSubCases } from "../test-data.js";

const es5 = {
    s: {n:function fn(){}, a:eval('(function(){})')},
    a: async function(){},
    g: function*(){},
    ag: async function*(){},
};
const bound = es5.s.a.bind(null);
const native = [].map;
const arrow = {s:v=>0, a:async()=>0};
class C {
    static sm() {
/*async*/
//async *
'async *'
"async *"
`async *`
(/async */g)
1*2
const a = async()=>{}
const A = async function*fn(){}
}
    static *sgm() {}
    static async sam() {}
    static async *sagm() {}
    im() {
/*async*/
//async *
'async *'
"async *"
`async *`
(/async */g)
1*2
const a = async()=>{}
const A = async function*fn(){}
    }
    *igm() {}
    async iam() {}
    async *iagm() {}

    static get sg() {}
    static set ss(x) {}
    static get sgs() {}
    static set sgs(x) {}
    get ig() {}
    set is(x) {}
    get igs() {}
    set igs(x) {}
}
const c = new C();
function Es5Cls(){this.x=1;}
const es5Cls = new Es5Cls();
const getDes = (o,d)=>Object.getOwnPropertyDescriptor(Object.defineProperty(o, 'd', d), 'd');
//const _obj = {m(){}, *gm(){}, async am(){}, async *agm(){}};
// , ['m'].map(n=>[desObj,n])]
const ownObj = {
    im() {
/*async*/
//async *
'async *'
"async *"
`async *`
(/async */g)
1*2
const a = async()=>{}
const A = async function*fn(){}
    },
    *igm() {},
    async iam() {},
    async *iagm() {},
    get ig() {},
    set is(x) {},
    get igs() {},
    set igs(x) {},
};
const des = {
    o: [[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]),
    c: [[C,'sg'],[C,'ss'],[C,'sgs']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]),
    i: [[c,'ig'],[c,'is'],[c,'igs']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]),
};
describe('Obj', () => {
    describe('getFlag', () => {
        describe('is', () => {
            describe('false', () => {
                test.each([undefined,null,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).is).toBe(false);
                });
            });
            describe('true', () => {
                test.each([{},[],c,es5Cls,new Number(),new Date(),Object.create(null),Object.create({})].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).is).toBe(true);
                });
            });
        });
        /*
        describe('nul', () => {
            describe('true', () => {
                test.each([null].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).nul).toBe(true);
                });
            });
            describe('false', () => {
                test.each([{},[],c,es5Cls,new Number(),new Date(),Object.create(null),Object.create({}),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).nul).toBe(false);
                });
            });
        });
        */
        describe('plain', () => {
            describe('true', () => {
                test.each([{}].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).plain).toBe(true);
                });
            });
            describe('false', () => {
                test.each([null,[],c,es5Cls,new Number(),new Date(),Object.create(null),Object.create({}),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).plain).toBe(false);
                });
            });
        });
        describe('none', () => {
            describe('true', () => {
                test.each([Object.create(null)].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).none).toBe(true);
                });
            });
            describe('false', () => {
                test.each([null,[],{},c,es5Cls,new Number(),new Date(),Object.create({}),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).none).toBe(false);
                });
            });
        });
        describe('proto', () => {
            describe('true', () => {
                test.each([Object.create({})].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).proto).toBe(true);
                });
            });
            describe('false', () => {
                test.each([null,[],{},c,es5Cls,new Number(),new Date(),Object.create(null),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).proto).toBe(false);
                });
            });
        });
        describe('boxed', () => {
            describe('true', () => {
                test.each([new Number()].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).boxed.is).toBe(true);
                });
            });
            describe('false', () => {
                test.each([null,[],{},c,es5Cls,Object.create({}),new Date(),Object.create(null),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).boxed.is).toBe(false);
                });
            });
        });
        describe('ins', () => {
            describe('true', () => {
                test.each([c,es5Cls,new Date()].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).ins.is).toBe(true);
                });
            });
            describe('false', () => {
                test.each([null,[],{},new Number(),Object.create({}),Object.create(null),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).ins.is).toBe(false);
                });
            });
        });
        describe('des', () => {
            describe('is', () => {
                describe('true', () => {
                    test.each([...des.o, ...des.c, ...des.i].map(x=>x))('%p', v=>{
                        expect(Obj.getFlag(v).des.is).toBe(true);
                    });
                });
                describe('false', () => {
                    test.each([c,es5Cls,new Date(),null,[],{},new Number(),Object.create({}),Object.create(null),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                        expect(Obj.getFlag(v).des.is).toBe(false);
                    });
                });
            });
            describe('d', () => {
                describe('is', () => {
                    describe('true', () => {
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.d.is).toBe(true);
                            });
                        });
                    });
                    describe('false', () => {
                        test.each([c,es5Cls,new Date(),null,[],{},new Number(),Object.create({}),Object.create(null),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                            expect(Obj.getFlag(v).des.d.is).toBe(false);
                        });
                    });
                });
                describe('v', () => {
                    describe('true', () => {
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.d.v).toBe(true);
                            });
                        });
                    });
                    describe('false', () => {
                        test.each([[{}, {value(){}}]].map(x=>[getDes(...x)]))('%p', v=>{
                            expect(Obj.getFlag(v).des.d.v).toBe(false);
                        });
                    });
                });
                describe('m', () => {
                    describe('true', () => {
                        describe(`Obj系`, ()=>{
                            test.each([[{}, {value(){}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.d.m).toBe(true);
                            });
                        });
                    });
                    describe('false', () => {
                        test.each([[{}, {value:0}]].map(x=>[getDes(...x)]))('%p', v=>{
                            expect(Obj.getFlag(v).des.d.m).toBe(false);
                        });
                    });
                });

            });
            describe('a', () => {
                describe('is', () => {
                    describe('true', () => {
                        describe(`Obj系`, ()=>{// false: [{}, {value:0}], [{}, {value(){}}], 
                            test.each([[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.is).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.is).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.is).toBe(true);
                            });
                        });
                    });
                    describe('false', () => {
                        describe(`Obj系`, ()=>{
                            test.each([[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.is).toBe(false);
                            });
                        });
                    });
                });
                describe('g', () => {
                    describe('true', () => {
                        describe(`Obj系`, ()=>{// false: [{}, {value:0}], [{}, {value(){}}], 
                            test.each([[{_d:0}, {get(){return this._d}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.g).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each([[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.g).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each([[c,'ig']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.g).toBe(true);
                            });
                        });
                    });
                    describe('false', () => {
                        describe(`Obj系`, ()=>{
                            test.each([[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.g).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each([[C,'ss'],[C,'sgs']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.g).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each([[c,'is'],[c,'igs']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.g).toBe(false);
                            });
                        });
                    });
                });
                describe('s', () => {
                    describe('true', () => {
                        describe(`Obj系`, ()=>{// false: [{}, {value:0}], [{}, {value(){}}], 
                            test.each([[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.s).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each([[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.s).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each([[c,'is']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.s).toBe(true);
                            });
                        });
                    });
                    describe('false', () => {
                        describe(`Obj系`, ()=>{
                            test.each([[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.s).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each([[C,'sg'],[C,'sgs']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.s).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each([[c,'ig'],[c,'igs']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.s).toBe(false);
                            });
                        });
                    });
                });
                describe('gs', () => {
                    describe('true', () => {
                        describe(`Obj系`, ()=>{// false: [{}, {value:0}], [{}, {value(){}}], 
                            test.each([[{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.gs).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each([[C,'sgs']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.gs).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each([[c,'igs']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.gs).toBe(true);
                            });
                        });
                    });
                    describe('false', () => {
                        describe(`Obj系`, ()=>{
                            test.each([[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.gs).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each([[C,'sg'],[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.gs).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each([[c,'ig'],[c,'is']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.gs).toBe(false);
                            });
                        });
                    });
                });
                describe('hasG', () => {
                    describe('true', () => {
                        describe(`Obj系`, ()=>{// false: [{}, {value:0}], [{}, {value(){}}], 
                            test.each([[{_d:0}, {get(){return this._d}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.hasG).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each([[C,'sg'],[C,'sgs']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.hasG).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each([[c,'ig'],[c,'igs']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.hasG).toBe(true);
                            });
                        });
                    });
                    describe('false', () => {
                        describe(`Obj系`, ()=>{
                            test.each([[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.hasG).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each([[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.hasG).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each([[c,'is']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))(`(%p)`, (v)=>{
                                expect(Obj.getFlag(v).des.a.hasG).toBe(false);
                            });
                        });
                    });

                });
                describe('hasS', () => {

                });

            });
        });
    });
});

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
    describe('und', () => {
        describe('true', () => {
            test('undefined',()=>expect(tis.und(undefined)).toBe(true));
        });
        describe('false', () => {
            test.each([null,true,0,0.1,NaN,Infinity,0n,'',Symbol(),{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.und(v)).toBe(false));
        });
    });
    describe('nul', () => {
        describe('true', () => {
            test('null',()=>expect(tis.nul(null)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,true,0,0.1,NaN,Infinity,0n,'',Symbol(),{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.nul(v)).toBe(false));
        });
    });
    describe('bln', () => {
        describe('true', () => {
            test('true',()=>expect(tis.bln(true)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,0,0.1,NaN,Infinity,0n,'',Symbol(),{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.bln(v)).toBe(false));
        });
    });
    describe('big', () => {
        describe('true', () => {
            test('0n',()=>expect(tis.big(0n)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,true,0,0.1,NaN,Infinity,'',Symbol(),{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.big(v)).toBe(false));
        });
    });
    describe('str', () => {
        describe('true', () => {
            test(`''`,()=>expect(tis.str('')).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.str(v)).toBe(false));
        });
    });
    describe('sym', () => {
        describe('true', () => {
            test('Symbol()',()=>expect(tis.sym(Symbol())).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,true,0,0.1,NaN,Infinity,0n,'',{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.sym(v)).toBe(false));
        });
    });
    describe('int', () => {
        describe('true', () => {
            test('0',()=>expect(tis.int(0)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,true,0.1,NaN,Infinity,0n,Symbol(),'',{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.int(v)).toBe(false));
        });
    });
    describe('fin', () => {
        describe('true', () => {
            test.each([0,0.1].map(x=>[x]))('%p',v=>expect(tis.fin(v)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,true,NaN,Infinity,0n,Symbol(),'',{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.fin(v)).toBe(false));
        });
    });
    describe('ary', () => {
        describe('(v)', () => {
            describe('true', () => {
                test.each([[],[0],[''],[0,'',[]]].map(x=>[x]))('%p',v=>expect(tis.ary(v)).toBe(true));
            });
            describe('false', () => {
                test.each([undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),'',{},new Number()].map(x=>[x]))('%p',v=>expect(tis.ary(v)).toBe(false));
            });
        });
        describe('empty', () => {
            describe('true', () => {
                test.each([[]].map(x=>[x]))('%p',v=>expect(tis.ary.empty(v)).toBe(true));
            });
            describe('false', () => {
                test.each([[0],undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),'',{},new Number()].map(x=>[x]))('%p',v=>expect(tis.ary.empty(v)).toBe(false));
            });

        });
        describe('filled', () => {
            describe('(v)', () => {
                describe('true', () => {
                    test.each([[0]].map(x=>[x]))('%p',v=>expect(tis.ary.filled(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[],undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),'',{},new Number()].map(x=>[x]))('%p',v=>expect(tis.ary.filled(v)).toBe(false));
                });
            });
            describe('(v,C)', () => {
                describe('true', () => {
                    test.each([[0],[0,-9]].map(x=>[x]))('%p',v=>expect(tis.ary.filled(v,tis.int)).toBe(true));
                });
                describe('false', () => {
                    test.each([[],[''],[0,''],['',0],['',0n],[0,0n]].map(x=>[x]))('%p',v=>expect(tis.ary.filled(v,tis.int)).toBe(false));
                });
            });
        });
        describe('gen', () => {
            describe('(v)', () => {
                describe('true', () => {
                    test.each([[],[0],[0,-9]].map(x=>[x]))('%p',v=>expect(tis.ary.gen(v,tis.int)).toBe(true));
                });
                describe('false', () => {
                    test.each([[''],[0,''],['',0],['',0n],[0,0n]].map(x=>[x]))('%p',v=>expect(tis.ary.gen(v,tis.int)).toBe(false));
                });
            });
            describe('(v,C)', () => {
                describe('true', () => {
                    test.each([[],[0],[0,-9]].map(x=>[x]))('%p',v=>expect(tis.ary.gen(v,tis.int)).toBe(true));
                });
                describe('false', () => {
                    test.each([[''],[0,''],['',0],['',0n],[0,0n]].map(x=>[x]))('%p',v=>expect(tis.ary.gen(v,tis.int)).toBe(false));
                });
                test('TypeError', () => {
                    assertThrow(TypeError,'tis.ary.gen requires a validation function as the second argument.',()=>tis.ary.gen([0]));
                });
            });
        });
    });
    describe('obj', () => {
        describe('true', () => {
            test.each([{}].map(x=>[x]))('%p',v=>expect(tis.obj(v)).toBe(true));
        });
        describe('false', () => {
            test.each([C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.obj(v)).toBe(false));
            test.each([...des.c, ...des.i, ...des.o])('%p',v=>expect(tis.obj(v)).toBe(false));
        });
    });
    describe('run', () => {
        describe('(v)', () => {
            describe('true', () => {
                test.each([...cal.fn, ...cal.md])('%p',v=>expect(tis.run(v)).toBe(true));
            });
            describe('false', () => {
                test.each([C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.obj(v)).toBe(false));
                test.each(des.c)('%p',v=>expect(tis.run(v)).toBe(false));
                test.each(des.i)('%p',v=>expect(tis.run(v)).toBe(false));
                test.each(des.o)('%p',v=>expect(tis.run(v)).toBe(false));
                test.each(prims)('%p',v=>expect(tis.run(v)).toBe(false));
//                test.each(objs)('%p',v=>expect(tis.run(v)).toBe(false));
                test.each(dangers)('%p',v=>expect(tis.run(v)).toBe(false));
                test.each(cls.es6)('%p',v=>expect(tis.run(v)).toBe(false));
                test.each(cls.es5)('%p',v=>expect(tis.run(v)).toBe(false));
                test.each(cls.native)('%p',v=>expect(tis.run(v)).toBe(false));
                test.each(ins.es6)('%p',v=>expect(tis.run(v)).toBe(false));
                test.each(ins.es5)('%p',v=>expect(tis.run(v)).toBe(false));
                test.each(ins.native)('%p',v=>expect(tis.run(v)).toBe(false));
            });
        });
        describe('fn', () => {
            describe('(v)', () => {
                describe('true', () => {
                    test.each(cal.fn)('%p',v=>expect(tis.run.fn(v)).toBe(true));
                });
                describe('false', () => {
                    test.each(cal.md)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each([C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.obj(v)).toBe(false));
                    test.each(des.c)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(des.i)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(des.o)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(prims)('%p',v=>expect(tis.run.fn(v)).toBe(false));
    //                test.each(objs)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(dangers)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(cls.es6)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(cls.es5)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(cls.native)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(ins.es6)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(ins.es5)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(ins.native)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                });
            });
            describe('bound', () => {
                describe('true', () => {
                    test.each([[(function(){}).bind(null)],[[].map.bind(null)]])('%p',v=>expect(tis.run.fn.bound(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.bound(v)).toBe(false));
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[[].map],[function f(){1*2}],[function f(){async()=>{}}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.bound(v)).toBe(false));
                    for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.run.fn.bound(v)).toBe(false));
                    }
                    /*
                    test.each(cal.md)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(des.c)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(des.i)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(des.o)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(prims)('%p',v=>expect(tis.run.fn(v)).toBe(false));
    //                test.each(objs)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(dangers)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(cls.es6)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(cls.es5)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(cls.native)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(ins.es6)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(ins.es5)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    test.each(ins.native)('%p',v=>expect(tis.run.fn(v)).toBe(false));
                    */
                    /*
                    */
                });
            });
            describe('native', () => {
                describe('true', () => {
                    test.each([[[].map]])('%p',v=>expect(tis.run.fn.native(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.native(v)).toBe(false));
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[(function(){}).bind(null)],[function f(){1*2}],[function f(){async()=>{}}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.native(v)).toBe(false));
                    for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.run.fn.native(v)).toBe(false));
                    }
                });
            });
            describe('arrow', () => {
                describe('(v)', () => {
                    describe('true', () => {
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.arrow(v)).toBe(true));
                    });
                    describe('false', () => {
                        test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.arrow(v)).toBe(false));
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[(function(){}).bind(null)],[[].map],[function f(){1*2}],[function f(){async()=>{}}]])('%p',v=>expect(tis.run.fn.arrow(v)).toBe(false));
                        for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                            test.each(x)('%p',v=>expect(tis.run.fn.arrow(v)).toBe(false));
                        }
                    });
                });
                describe('s', () => {
                    describe('true', () => {
                        test.each([[arrFn],[()=>{}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.arrow.s(v)).toBe(true));
                    });
                    describe('false', () => {
                        test.each([[aarrFn],,[async()=>{}]])('%p',v=>expect(tis.run.fn.arrow.s(v)).toBe(false));
                        test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.arrow.s(v)).toBe(false));
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[(function(){}).bind(null)],[[].map],[function f(){1*2}],[function f(){async()=>{}}]])('%p',v=>expect(tis.run.fn.arrow.s(v)).toBe(false));
                        for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                            test.each(x)('%p',v=>expect(tis.run.fn.arrow.s(v)).toBe(false));
                        }
                    });
                });
                describe('a', () => {
                    describe('true', () => {
                        test.each([[aarrFn],[async()=>{}]])('%p',v=>expect(tis.run.fn.arrow.a(v)).toBe(true));
                    });
                    describe('false', () => {
                        test.each([[arrFn],[()=>{}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.arrow.a(v)).toBe(false));
                        test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.arrow.a(v)).toBe(false));
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[(function(){}).bind(null)],[[].map],[function f(){1*2}],[function f(){async()=>{}}]])('%p',v=>expect(tis.run.fn.arrow.a(v)).toBe(false));
                        for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                            test.each(x)('%p',v=>expect(tis.run.fn.arrow.a(v)).toBe(false));
                        }
                    });
                });
            });
            describe('es5', () => {
                describe('(v)', () => {
                    describe('true', () => {
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[function f(){1*2}],[function f(){async()=>{}}]])('%p',v=>expect(tis.run.fn.es5(v)).toBe(true));
                    });
                    describe('false', () => {
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.es5(v)).toBe(false));
                        test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.es5(v)).toBe(false));
                        test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.fn.es5(v)).toBe(false));
                        for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                            test.each(x)('%p',v=>expect(tis.run.fn.es5(v)).toBe(false));
                        }
                    });
                });
                describe('s', () => {
                    describe('(v)', () => {
                        describe('true', () => {
                            test.each([[fn],[function(){}],[function f(){1*2}],[function f(){async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.s(v)).toBe(true));
                        });
                        describe('false', () => {
                            test.each([[gfn],[afn],[agfn],[function*(){}],[async function(){}],[async function*(){}]])('%p',v=>expect(tis.run.fn.es5.s(v)).toBe(false));
                            test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.s(v)).toBe(false));
                            test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.es5.s(v)).toBe(false));
                            test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.fn.es5.s(v)).toBe(false));
                            for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                                test.each(x)('%p',v=>expect(tis.run.fn.es5.s(v)).toBe(false));
                            }
                        });
                    });
                    describe('n', () => {
                        describe('true', () => {
                            test.each([[fn],[function f(){1*2}],[function f(){async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.s.n(v)).toBe(true));
                        });
                        describe('false', () => {
                            test.each([[function(){}],[gfn],[afn],[agfn],[function*(){}],[async function(){}],[async function*(){}]])('%p',v=>expect(tis.run.fn.es5.s.n(v)).toBe(false));
                            test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.s.n(v)).toBe(false));
                            test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.es5.s.n(v)).toBe(false));
                            test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.fn.es5.s.n(v)).toBe(false));
                            for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                                test.each(x)('%p',v=>expect(tis.run.fn.es5.s.n(v)).toBe(false));
                            }
                        });
                    });
                    describe('a', () => {
                        describe('true', () => {
                            test.each([[function(){}]])('%p',v=>expect(tis.run.fn.es5.s.a(v)).toBe(true));
                        });
                        describe('false', () => {
                            test.each([[fn],[function f(){1*2}],[function f(){async()=>{}}],[gfn],[afn],[agfn],[function*(){}],[async function(){}],[async function*(){}]])('%p',v=>expect(tis.run.fn.es5.s.a(v)).toBe(false));
                            test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.s.a(v)).toBe(false));
                            test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.es5.s.a(v)).toBe(false));
                            test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.fn.es5.s.a(v)).toBe(false));
                            for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                                test.each(x)('%p',v=>expect(tis.run.fn.es5.s.a(v)).toBe(false));
                            }
                        });

                    });
                });
                describe('a', () => {
                    describe('true', () => {
                        test.each([[afn],[async function(){}]])('%p',v=>expect(tis.run.fn.es5.a(v)).toBe(true));
                        //test.each([[gfn],[afn],[agfn],[function*(){}],[async function(){}],[async function*(){}]])('%p',v=>expect(tis.run.fn.es5.a(v)).toBe(true));
                    });
                    describe('false', () => {
                        test.each([[gfn],[agfn],[function*(){}],[async function*(){}]])('%p',v=>expect(tis.run.fn.es5.a(v)).toBe(false));
                        test.each([[fn],[function(){}],[function f(){1*2}],[function f(){async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.a(v)).toBe(false));
                        //test.each([[gfn],[afn],[agfn],[function*(){}],[async function(){}],[async function*(){}]])('%p',v=>expect(tis.run.fn.es5.a(v)).toBe(false));
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.a(v)).toBe(false));
                        test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.es5.a(v)).toBe(false));
                        test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.fn.es5.a(v)).toBe(false));
                        for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                            test.each(x)('%p',v=>expect(tis.run.fn.es5.a(v)).toBe(false));
                        }
                    });

                });
                describe('g', () => {
                    describe('true', () => {
                        test.each([[gfn],[function*(){}]])('%p',v=>expect(tis.run.fn.es5.g(v)).toBe(true));
                    });
                    describe('false', () => {
                        test.each([[afn],[async function(){}],[agfn],[async function*(){}]])('%p',v=>expect(tis.run.fn.es5.g(v)).toBe(false));
                        test.each([[fn],[function(){}],[function f(){1*2}],[function f(){async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.g(v)).toBe(false));
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.g(v)).toBe(false));
                        test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.es5.g(v)).toBe(false));
                        test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.fn.es5.g(v)).toBe(false));
                        for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                            test.each(x)('%p',v=>expect(tis.run.fn.es5.g(v)).toBe(false));
                        }
                    });
                });
                describe('ag', () => {
                    describe('true', () => {
                        test.each([[agfn],[async function*(){}]])('%p',v=>expect(tis.run.fn.es5.ag(v)).toBe(true));
                    });
                    describe('false', () => {
                        test.each([[afn],[async function(){}],[gfn],[function*(){}]])('%p',v=>expect(tis.run.fn.es5.ag(v)).toBe(false));
                        test.each([[fn],[function(){}],[function f(){1*2}],[function f(){async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.ag(v)).toBe(false));
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}],[()=>1*2],[()=>{async()=>{}}]])('%p',v=>expect(tis.run.fn.es5.ag(v)).toBe(false));
                        test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.fn.es5.ag(v)).toBe(false));
                        test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.fn.es5.ag(v)).toBe(false));
                        for (let x of [cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                            test.each(x)('%p',v=>expect(tis.run.fn.es5.ag(v)).toBe(false));
                        }
                    });
                });
            });
        });
        describe('md', () => {
            describe('(v)', () => {
                describe('true', () => {
                    test.each(cal.md)('%p',v=>expect(tis.run.md(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.md(v)).toBe(false));
                    test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.md(v)).toBe(false));
                    for (let x of [cal.fn,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.run.md(v)).toBe(false));
                    }
                });
            });
            describe('s', () => {
                describe('true', () => {
                    test.each([[_obj.m],[C.sm],[c.m]])('%p',v=>expect(tis.run.md.s(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[_obj.gm],[_obj.am],[_obj.agm],[C.sgm],[C.sam],[C.sagm],[c.gm],[c.am],[c.agm]])('%p',v=>expect(tis.run.md.s(v)).toBe(false));
                    test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.md.s(v)).toBe(false));
                    test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.md.s(v)).toBe(false));
                    for (let x of [cal.fn,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.run.md.s(v)).toBe(false));
                    }
                });
            });
            describe('a', () => {
                describe('true', () => {
                    test.each([[_obj.am],[C.sam],[c.am]])('%p',v=>expect(tis.run.md.a(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[_obj.m],[C.sm],[c.m],[_obj.gm],[_obj.agm],[C.sgm],[C.sagm],[c.gm],[c.agm]])('%p',v=>expect(tis.run.md.a(v)).toBe(false));
                    test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.md.a(v)).toBe(false));
                    test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.md.a(v)).toBe(false));
                    for (let x of [cal.fn,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.run.md.a(v)).toBe(false));
                    }
                });
            });
            describe('g', () => {
                describe('true', () => {
                    test.each([[_obj.gm],[C.sgm],[c.gm]])('%p',v=>expect(tis.run.md.g(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[_obj.am],[C.sam],[c.am],[_obj.m],[C.sm],[c.m],[_obj.agm],[C.sagm],[c.agm]])('%p',v=>expect(tis.run.md.g(v)).toBe(false));
                    test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.md.g(v)).toBe(false));
                    test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.md.g(v)).toBe(false));
                    for (let x of [cal.fn,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.run.md.g(v)).toBe(false));
                    }
                });
            });
            describe('ag', () => {
                describe('true', () => {
                    test.each([[_obj.agm],[C.sagm],[c.agm]])('%p',v=>expect(tis.run.md.ag(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[_obj.am],[C.sam],[c.am],[_obj.m],[C.sm],[c.m],[_obj.gm],[C.sgm],[c.gm]])('%p',v=>expect(tis.run.md.ag(v)).toBe(false));
                    test.each([Date,C,c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.run.md.ag(v)).toBe(false));
                    test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.md.ag(v)).toBe(false));
                    for (let x of [cal.fn,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.run.md.ag(v)).toBe(false));
                    }
                });
            });
        });
    });
    describe('cls', () => {
        describe('(v)', () => {
            describe('true', () => {
//                test.each([[C],[(function Fn(){})],[Date]])('%p',v=>expect(tis.cls(v)).toBe(true));
                test.each(cls.es6)('%p',v=>expect(tis.cls(v)).toBe(true));
                test.each(cls.es5)('%p',v=>expect(tis.cls(v)).toBe(true));
                test.each(cls.native)('%p',v=>expect(tis.cls(v)).toBe(true));
            });
            describe('false', () => {
//                test.each([c,(new (function(){})()),new Date(),Object.create(null),Object.create({}),[],new Number(),undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),''].map(x=>[x]))('%p',v=>expect(tis.cls(v)).toBe(false));
//                test.each([[(function(){}).bind(null)],[[].map]])('%p',v=>expect(tis.run.md(v)).toBe(false));
                for (let x of [cal.fn,cal.md,des.c,des.i,des.o,prims,dangers,ins.es6,ins.es5,ins.native]) {
                    test.each(x)('%p',v=>expect(tis.cls(v)).toBe(false));
                }
                /*
                for (let x of [cal.fn,cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                    test.each(x)('%p',v=>expect(tis.run.md(v)).toBe(false));
                }
                */
            });

        });
        describe('es6', () => {
            describe('true', () => {
                test.each(cls.es6)('%p',v=>expect(tis.cls.es6(v)).toBe(true));
            });
            describe('false', () => {
                test.each(cls.es5)('%p',v=>expect(tis.cls.es6(v)).toBe(false));
                test.each(cls.native)('%p',v=>expect(tis.cls.es6(v)).toBe(false));
                for (let x of [cal.fn,cal.md,des.c,des.i,des.o,prims,dangers,ins.es6,ins.es5,ins.native]) {
                    test.each(x)('%p',v=>expect(tis.cls.es6(v)).toBe(false));
                }
            });
        });
        describe('es5', () => {
            describe('true', () => {
                test.each(cls.es5)('%p',v=>expect(tis.cls.es5(v)).toBe(true));
            });
            describe('false', () => {
                test.each(cls.es6)('%p',v=>expect(tis.cls.es5(v)).toBe(false));
                test.each(cls.native)('%p',v=>expect(tis.cls.es5(v)).toBe(false));
                for (let x of [cal.fn,cal.md,des.c,des.i,des.o,prims,dangers,ins.es6,ins.es5,ins.native]) {
                    test.each(x)('%p',v=>expect(tis.cls.es5(v)).toBe(false));
                }
            });
        });
        describe('native', () => {
            describe('true', () => {
                test.each(cls.native)('%p',v=>expect(tis.cls.native(v)).toBe(true));
            });
            describe('false', () => {
                test.each(cls.es6)('%p',v=>expect(tis.cls.native(v)).toBe(false));
                test.each(cls.es5)('%p',v=>expect(tis.cls.native(v)).toBe(false));
                for (let x of [cal.fn,cal.md,des.c,des.i,des.o,prims,dangers,ins.es6,ins.es5,ins.native]) {
                    test.each(x)('%p',v=>expect(tis.cls.native(v)).toBe(false));
                }
            });
        });
    });
    describe('ins', () => {
        describe('(v)', () => {
            describe('true', () => {
                test.each(ins.es6)('%p',v=>expect(tis.ins(v)).toBe(true));
                test.each(ins.es5)('%p',v=>expect(tis.ins(v)).toBe(true));
                test.each(ins.native)('%p',v=>expect(tis.ins(v)).toBe(true));
            });
            describe('false', () => {
                for (let x of [cal.fn,cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native]) {
                    test.each(x)('%p',v=>expect(tis.ins(v)).toBe(false));
                }
            });
        });
        describe('es6', () => {
            describe('true', () => {
                test.each(ins.es6)('%p',v=>expect(tis.ins.es6(v)).toBe(true));
            });
            describe('false', () => {
                test.each(ins.es5)('%p',v=>expect(tis.ins.es6(v)).toBe(false));
                test.each(ins.native)('%p',v=>expect(tis.ins.es6(v)).toBe(false));
                for (let x of [cal.fn,cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native]) {
                    test.each(x)('%p',v=>expect(tis.ins.es6(v)).toBe(false));
                }
            });
        });
        describe('es5', () => {
            describe('true', () => {
                test.each(ins.es5)('%p',v=>expect(tis.ins.es5(v)).toBe(true));
            });
            describe('false', () => {
                test.each(ins.es6)('%p',v=>expect(tis.ins.es5(v)).toBe(false));
                test.each(ins.native)('%p',v=>expect(tis.ins.es5(v)).toBe(false));
                for (let x of [cal.fn,cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native]) {
                    test.each(x)('%p',v=>expect(tis.ins.es5(v)).toBe(false));
                }
            });
        });
        describe('native', () => {
            describe('true', () => {
                test.each(ins.native)('%p',v=>expect(tis.ins.native(v)).toBe(true));
            });
            describe('false', () => {
                test.each(ins.es6)('%p',v=>expect(tis.ins.native(v)).toBe(false));
                test.each(ins.es5)('%p',v=>expect(tis.ins.native(v)).toBe(false));
                for (let x of [cal.fn,cal.md,des.c,des.i,des.o,prims,dangers,cls.es6,cls.es5,cls.native]) {
                    test.each(x)('%p',v=>expect(tis.ins.native(v)).toBe(false));
                }
            });
        });
    });
    describe('des', () => {
        describe('(v)', () => {
            describe('true', () => {
//                test.each(des.c)('%p',v=>expect(tis.des(v)).toBe(true));
//                test.each(des.i)('%p',v=>expect(tis.des(v)).toBe(true));
//                test.each(des.o)('%p',v=>expect(tis.des(v)).toBe(true));
                for (let x of [des.c, des.i, des.o]) {
                    test.each(x)('%p',v=>expect(tis.des(v)).toBe(true));
                }
            });
            describe('false', () => {
                for (let x of [cal.fn,cal.md,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                    test.each(x)('%p',v=>expect(tis.des(v)).toBe(false));
                }
            });
        });
        describe('d', () => {
            describe('(v)', () => {
                describe('true', () => {
                    test.each([[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.d(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.d(v)).toBe(false));
                    for (let x of [des.c, des.i, cal.fn,cal.md,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.des.d(v)).toBe(false));
                    }
                });
            });
            describe('v', () => {
                describe('true', () => {
                    test.each([[{}, {value:0}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.d.v(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[{}, {value(){}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.d.v(v)).toBe(false));
                    test.each([[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.d.v(v)).toBe(false));
                    for (let x of [des.c, des.i, cal.fn,cal.md,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.des.d.v(v)).toBe(false));
                    }
                });
            });
            describe('m', () => {
                describe('true', () => {
                    test.each([[{}, {value(){}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.d.m(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[{}, {value:0}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.d.m(v)).toBe(false));
                    test.each([[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.d.m(v)).toBe(false));
                    for (let x of [des.c, des.i, cal.fn,cal.md,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.des.d.m(v)).toBe(false));
                    }
                });
            });
        });
        describe('a', () => {
            describe('(v)', () => {
                describe('true', () => {
                    test.each([[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a(v)).toBe(true));
                    for (let x of [des.c, des.i]) {
                        test.each(x)('%p',v=>expect(tis.des.a(v)).toBe(true));
                    }
                });
                describe('false', () => {
                    test.each([[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a(v)).toBe(false));
                    for (let x of [cal.fn,cal.md,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.des.a(v)).toBe(false));
                    }
                });
            });

            describe('g', () => {
                describe('true', () => {
                    test.each([[{_d:0}, {get(){return this._d}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.g(v)).toBe(true));
                    test.each([[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))('%p',v=>expect(tis.des.a.g(v)).toBe(true));
                    test.each([[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))('%p',v=>expect(tis.des.a.g(v)).toBe(true));
//                    for (let x of [des.c, des.i]) {
//                        test.each(x)('%p',v=>expect(tis.des.a.g(v)).toBe(true));
//                    }
                });
                describe('false', () => {
                    test.each([[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))('%p',v=>expect(tis.des.a.g(v)).toBe(false));
                    test.each([[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))('%p',v=>expect(tis.des.a.g(v)).toBe(false));
                    test.each([[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.g(v)).toBe(false));
                    test.each([[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.g(v)).toBe(false));
                    for (let x of [cal.fn,cal.md,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.des.a.g(v)).toBe(false));
                    }
                });
            });
            describe('s', () => {
                describe('true', () => {
                    test.each([[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.s(v)).toBe(true));
                    test.each([[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))('%p',v=>expect(tis.des.a.s(v)).toBe(true));
                    test.each([[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))('%p',v=>expect(tis.des.a.s(v)).toBe(true));
//                    for (let x of [des.c, des.i]) {
//                        test.each(x)('%p',v=>expect(tis.des.a.s(v)).toBe(true));
//                    }
                });
                describe('false', () => {
                    test.each([[{_d:0}, {get(){return this._d}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.s(v)).toBe(false));
                    test.each([[C,'sg'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))('%p',v=>expect(tis.des.a.s(v)).toBe(false));
                    test.each([[c,'g'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))('%p',v=>expect(tis.des.a.s(v)).toBe(false));
                    test.each([[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.s(v)).toBe(false));
                    for (let x of [cal.fn,cal.md,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.des.a.s(v)).toBe(false));
                    }
                });

            });
            describe('gs', () => {
                describe('true', () => {
                    test.each([[{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.gs(v)).toBe(true));
                    test.each([[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))('%p',v=>expect(tis.des.a.gs(v)).toBe(true));
                    test.each([[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))('%p',v=>expect(tis.des.a.gs(v)).toBe(true));
//                    for (let x of [des.c, des.i]) {
//                        test.each(x)('%p',v=>expect(tis.des.a.gs(v)).toBe(true));
//                    }
                });
                describe('false', () => {
                    test.each([[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.gs(v)).toBe(false));
                    test.each([[C,'sg'],[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))('%p',v=>expect(tis.des.a.gs(v)).toBe(false));
                    test.each([[c,'g'],[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))('%p',v=>expect(tis.des.a.gs(v)).toBe(false));
                    test.each([[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.gs(v)).toBe(false));
                    for (let x of [cal.fn,cal.md,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.des.a.gs(v)).toBe(false));
                    }
                });

            });
            describe('hasG', () => {
                describe('true', () => {
                    test.each([[{_d:0}, {get(){return this._d}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.hasG(v)).toBe(true));
                    test.each([[C,'sg'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))('%p',v=>expect(tis.des.a.hasG(v)).toBe(true));
                    test.each([[c,'g'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))('%p',v=>expect(tis.des.a.hasG(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.hasG(v)).toBe(false));
                    test.each([[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))('%p',v=>expect(tis.des.a.hasG(v)).toBe(false));
                    test.each([[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))('%p',v=>expect(tis.des.a.hasG(v)).toBe(false));
                    test.each([[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.hasG(v)).toBe(false));
                    for (let x of [cal.fn,cal.md,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.des.a.hasG(v)).toBe(false));
                    }
                });

            });
            describe('hasS', () => {
                describe('true', () => {
                    test.each([[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.hasS(v)).toBe(true));
                    test.each([[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))('%p',v=>expect(tis.des.a.hasS(v)).toBe(true));
                    test.each([[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))('%p',v=>expect(tis.des.a.hasS(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[{_d:0}, {get(){return this._d}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.hasS(v)).toBe(false));
                    test.each([[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]))('%p',v=>expect(tis.des.a.hasS(v)).toBe(false));
                    test.each([[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]))('%p',v=>expect(tis.des.a.hasS(v)).toBe(false));
                    test.each([[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)]))('%p',v=>expect(tis.des.a.hasS(v)).toBe(false));
                    for (let x of [cal.fn,cal.md,prims,dangers,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native]) {
                        test.each(x)('%p',v=>expect(tis.des.a.hasS(v)).toBe(false));
                    }
                });
            });
        });
    });
    describe('d', () => {
        describe('(v)', () => {
            describe('true', () => {
                test.each(dangers)('%p',v=>expect(tis.d(v)).toBe(true));
                test.each([[0.1]])('%p',v=>expect(tis.d(v)).toBe(true));
            });
            describe('false', () => {
                test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()]])('%p',v=>expect(tis.d(v)).toBe(false));
                for (let x of [cal.fn,cal.md,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native,des.c,des.i,des.o]) {
                    test.each(x)('%p',v=>expect(tis.d(v)).toBe(false));
                }
            });
        });
        describe('num', () => {
            describe('(v)', () => {
                describe('true', () => {
//                    test.each(dangers)('%p',v=>expect(tis.d(v)).toBe(true));
                    test.each([[0.1],[NaN],[Infinity],[-Infinity]])('%p',v=>expect(tis.d.num(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[undefined],[null],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])('%p',v=>expect(tis.d.num(v)).toBe(false));
                    test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()]])('%p',v=>expect(tis.d.num(v)).toBe(false));
                    for (let x of [cal.fn,cal.md,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native,des.c,des.i,des.o]) {
                        test.each(x)('%p',v=>expect(tis.d.num(v)).toBe(false));
                    }
                });

            });
            describe('nan', () => {
                describe('true', () => {
                    test.each([[NaN]])('%p',v=>expect(tis.d.num.nan(v)).toBe(true));
                });
                describe('false', () => {
                    test.each([[0.1],[Infinity],[-Infinity]])('%p',v=>expect(tis.d.num.nan(v)).toBe(false));
                    test.each([[undefined],[null],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])('%p',v=>expect(tis.d.num.nan(v)).toBe(false));
                    test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()]])('%p',v=>expect(tis.d.num.nan(v)).toBe(false));
                    for (let x of [cal.fn,cal.md,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native,des.c,des.i,des.o]) {
                        test.each(x)('%p',v=>expect(tis.d.num.nan(v)).toBe(false));
                    }
                });

            });
            describe('inf', () => {
                describe('(v)', () => {
                    describe('true', () => {
                        test.each([[Infinity],[-Infinity]])('%p',v=>expect(tis.d.num.inf(v)).toBe(true));
                    });
                    describe('false', () => {
                        test.each([[NaN],[0.1]])('%p',v=>expect(tis.d.num.inf(v)).toBe(false));
                        test.each([[undefined],[null],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])('%p',v=>expect(tis.d.num.inf(v)).toBe(false));
                        test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()]])('%p',v=>expect(tis.d.num.inf(v)).toBe(false));
                        for (let x of [cal.fn,cal.md,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native,des.c,des.i,des.o]) {
                            test.each(x)('%p',v=>expect(tis.d.num.inf(v)).toBe(false));
                        }
                    });

                });

                describe('p', () => {
                    describe('true', () => {
                        test.each([[Infinity]])('%p',v=>expect(tis.d.num.inf.p(v)).toBe(true));
                    });
                    describe('false', () => {
                        test.each([[-Infinity],[NaN],[0.1]])('%p',v=>expect(tis.d.num.inf.p(v)).toBe(false));
                        test.each([[undefined],[null],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])('%p',v=>expect(tis.d.num.inf.p(v)).toBe(false));
                        test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()]])('%p',v=>expect(tis.d.num.inf.p(v)).toBe(false));
                        for (let x of [cal.fn,cal.md,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native,des.c,des.i,des.o]) {
                            test.each(x)('%p',v=>expect(tis.d.num.inf.p(v)).toBe(false));
                        }
                    });
                });
                describe('n', () => {
                    describe('true', () => {
                        test.each([[-Infinity]])('%p',v=>expect(tis.d.num.inf.n(v)).toBe(true));
                    });
                    describe('false', () => {
                        test.each([[Infinity],[NaN],[0.1]])('%p',v=>expect(tis.d.num.inf.n(v)).toBe(false));
                        test.each([[undefined],[null],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])('%p',v=>expect(tis.d.num.inf.n(v)).toBe(false));
                        test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()]])('%p',v=>expect(tis.d.num.inf.n(v)).toBe(false));
                        for (let x of [cal.fn,cal.md,cls.es6,cls.es5,cls.native,ins.es6,ins.es5,ins.native,des.c,des.i,des.o]) {
                            test.each(x)('%p',v=>expect(tis.d.num.inf.n(v)).toBe(false));
                        }
                    });
                });
            });
            describe('flt', () => {
            });
            describe('over', () => {
            });

        });
        describe('obj', () => {
            describe('(v)', () => {
            });
            describe('none', () => {
            });

            describe('proto', () => {
            });

            describe('boxed', () => {
                describe('(v)', () => {
                });
                describe('bln', () => {
                });
                describe('num', () => {
                });
                describe('str', () => {
                });
            });
        });
    });
    describe('g', () => {
        describe('(v)', () => {
        });
        describe('nun', () => {
        });
        describe('p', () => {
        });
        describe('o', () => {
            describe('(v)', () => {
            });
            describe('cr', () => {
            });
            describe('ctn', () => {
            });
        });
    });
});

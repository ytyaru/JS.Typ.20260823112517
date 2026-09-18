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
                });
                describe('s', () => {
                });
                describe('a', () => {
                });
            });
            describe('es5', () => {
                describe('(v)', () => {
                });
                describe('s', () => {
                    describe('(v)', () => {
                    });

                    describe('n', () => {

                    });
                    describe('a', () => {

                    });
                });
                describe('a', () => {

                });
                describe('g', () => {

                });
                describe('ag', () => {

                });
            });
        });
        describe('md', () => {
            describe('(v)', () => {
            });

            describe('s', () => {
            });
            describe('a', () => {

            });
            describe('g', () => {

            });
            describe('ag', () => {

            });

        });

    });
    describe('cls', () => {
        describe('(v)', () => {
        });
        describe('es6', () => {
        });
        describe('es5', () => {
        });
        describe('native', () => {
        });

    });
    describe('ins', () => {
        describe('(v)', () => {
        });
        describe('es6', () => {
        });
        describe('es5', () => {
        });
        describe('native', () => {
        });

    });
    describe('des', () => {
        describe('(v)', () => {
        });
        describe('d', () => {
            describe('(v)', () => {
            });
            describe('v', () => {
            });
            describe('m', () => {
            });

        });
        describe('a', () => {
            describe('(v)', () => {
            });

            describe('g', () => {
            });
            describe('s', () => {
            });
            describe('gs', () => {
            });
            describe('hasG', () => {
            });
            describe('hasS', () => {
            });
        });
    });
    describe('d', () => {
        describe('(v)', () => {
        });
        describe('num', () => {
            describe('(v)', () => {
            });
            describe('nan', () => {
            });
            describe('inf', () => {
                describe('p', () => {
                });
                describe('n', () => {
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

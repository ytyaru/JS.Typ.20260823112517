import { expect, test, describe } from "bun:test";
import {isT,owT,tof} from '../src/main.js';
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from './test-data.js';
describe(`isT`, ()=>{
//    test(`()`, ()=>assertThrow(TypeError, `isT is not a function`, ()=>isT()));
//    test(`new ()`, ()=>assertThrow(TypeError, `isT is not a constructor`, ()=>new isT()));
    test(`()`, ()=>assertThrow(TypeError, `isT is not a function. (In 'isT()', 'isT' is an instance of Object)`, ()=>isT()));
    test(`new ()`, ()=>assertThrow(TypeError, `Object is not a constructor (evaluating 'new isT')`, ()=>new isT()));
    describe(`p`, ()=>{
        describe(`()`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                    expect(isT.p(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p(v)).toBe(true);
                });
            });
        });
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                    expect(isT.p.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.some(v)).toBe(true);
                });
            });
        });
        describe(`bln`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.bln(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false]])(`(%p)`, (v)=>{
                    expect(isT.p.bln(v)).toBe(true);
                });
            });
        });
        describe(`int`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.int(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(isT.p.int(v)).toBe(true);
                });
            });
        });
        describe(`finite`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.fin(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[1.0],[0.1],[-12.3],[45.6789],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[Number.MAX_SAFE_INTEGER-0.1],[Number.MIN_SAFE_INTEGER+0.1]])(`(%p)`, (v)=>{
                    expect(isT.p.fin(v)).toBe(true);
                });
            });
        });
        /*
        describe(`float`, ()=>{
            describe(`false`, ()=>{
                test.each([[0],[1.0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.flt(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0.1],[-12.3],[45.6789],[999999999999999-0.1],[-999999999999999+0.1]])(`(%p)`, (v)=>{
                    expect(isT.p.flt(v)).toBe(true);
                });
            });
        });
        */
        describe(`big`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.big(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0n],[BigInt(Number.MAX_SAFE_INTEGER) + 1n],[BigInt(Number.MIN_SAFE_INTEGER) - 1n]])(`(%p)`, (v)=>{
                    expect(isT.p.big(v)).toBe(true);
                });
            });
        });
        describe(`str`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.str(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[''],[' '],['\n'],['a'],['あ']])(`(%p)`, (v)=>{
                    expect(isT.p.str(v)).toBe(true);
                });
            });
        });
        describe(`sym`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],['']])(`(%p)`, (v)=>{
                    expect(isT.p.sym(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[Symbol()],[Symbol('a')],[Symbol.for('a')]])(`(%p)`, (v)=>{
                    expect(isT.p.sym(v)).toBe(true);
                });
            });
        });
    });
    describe(`o`, ()=>{
        describe(`()`, ()=>{
            test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.o()));
            describe(`false`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    expect(isT.o(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(isT.o(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(isT.o(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(isT.o(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(isT.o(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    test.each(cal.fn)(`(%p)`, (v)=>expect(isT.o(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    test.each(cal.md)(`(%p)`, (v)=>expect(isT.o(v)).toBe(true));
                });
            });
        });
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    expect(isT.o.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(isT.o.some(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(isT.o.some(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(isT.o.some(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(isT.o.some(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    test.each(cal.fn)(`(%p)`, (v)=>expect(isT.o.some(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    test.each(cal.md)(`(%p)`, (v)=>expect(isT.o.some(v)).toBe(true));
                });
            });
        });
        describe(`obj`, ()=>{
            describe(`false`, ()=>{
                test.each([[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(isT.o.obj(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[{}]])(`(%p)`, (v)=>{
                    expect(isT.o.obj(v)).toBe(true);
                });
            });
        });
        describe(`ary`, ()=>{
            describe(`false`, ()=>{
                test.each([[{}],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(isT.o.ary(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[[]],[[1,2,'a']]])(`(%p)`, (v)=>{
                    expect(isT.o.ary(v)).toBe(true);
                });
            });
        });
        describe(`cls`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.o.cls()));
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.cls(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.cls(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.cls.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.cls.some(v)).toBe(true);
                    });
                });
            });
            describe(`es6`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cls.es5, ...cls.native, [{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.cls.es6(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6])(`(%p)`, (v)=>{
                        expect(isT.o.cls.es6(v)).toBe(true);
                    });
                });
            });
            describe(`es5`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cls.es6, ...cls.native, [{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.cls.es5(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es5])(`(%p)`, (v)=>{
                        expect(isT.o.cls.es5(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cls.es5, ...cls.es6, [{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.cls.native(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.cls.native(v)).toBe(true);
                    });
                });
            });
        });
        describe(`ins`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.o.ins()));
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.ins(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        expect(isT.o.ins(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.ins.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        expect(isT.o.ins.some(v)).toBe(true);
                    });
                });
            });
            describe(`es6`, ()=>{
                describe(`false`, ()=>{
                    test.each([...ins.es5, ...ins.native, [{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.ins.es6(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    class MyObj extends Object {}
                    test.each([...ins.es6, [new MyObj()]])(`(%p)`, (v)=>{
                        expect(isT.o.ins.es6(v)).toBe(true);
                    });
                });
            });
            describe(`es5`, ()=>{
                describe(`false`, ()=>{
                    test.each([...ins.es6, ...ins.native, [{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.ins.es5(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es5])(`(%p)`, (v)=>{
                        expect(isT.o.ins.es5(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`false`, ()=>{
                    test.each([...ins.es5, ...ins.es6, [{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.ins.native(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.native])(`(%p)`, (v)=>{
                        expect(isT.o.ins.native(v)).toBe(true);
                    });
                });
            });
        });
        describe(`des`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.o.des()));
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.des(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(isT.o.des(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.des.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(isT.o.des.some(v)).toBe(true);
                    });
                });
            });
            describe(`d`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.o.des.d()));
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.d(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(isT.o.des.d(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(isT.o.des.d(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.d(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.some(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.some(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.some(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.some(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`v`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.v(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.v(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.v(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.v(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`m`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.m(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.m(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.m(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.d.m(v)).toBe(true);
                            });
                        });
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.o.des.a()));
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(v){return this._d}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(isT.o.des.a(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(isT.o.des.a(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.some(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(v){return this._d}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.some(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.some(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.some(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`g`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.g(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.g(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.g(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.g(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.g(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.g(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`s`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0},{get(){return this._d}}],[{_d:0},{get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.s(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa'],[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.s(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a'],[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.s(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.s(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.s(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.s(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`a`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0},{get(){return this._d}}],[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.a(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg'],[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.a(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g'],[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.a(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0},{get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.a(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.a(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(isT.o.des.a.a(v)).toBe(true);
                            });
                        });
                    });
                });
            });
        });
        describe(`fn`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.o.fn()));
                describe(`false`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.fn(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        expect(isT.o.fn(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.fn.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        expect(isT.o.fn.some(v)).toBe(true);
                    });
                });
            });
            describe(`bound`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.fn.bound(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[fn.bind(null)]])(`(%p)`, (v)=>{
                        expect(isT.o.fn.bound(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.fn.native(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[[].map]])(`(%p)`, (v)=>{
                        expect(isT.o.fn.native(v)).toBe(true);
                    });
                });
            });
            describe(`arrow`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.o.fn.arrow()));
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(isT.o.fn.arrow(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(isT.o.fn.arrow(v)).toBe(true);
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(isT.o.fn.arrow.some(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(isT.o.fn.arrow.some(v)).toBe(true);
                        });
                    });
                });

                describe(`a`, ()=>{
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[arrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(isT.o.fn.arrow.a(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[aarrFn],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(isT.o.fn.arrow.a(v)).toBe(true);
                        });
                    });
                });
                describe(`s`, ()=>{
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(isT.o.fn.arrow.s(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[()=>{}]])(`(%p)`, (v)=>{
                            expect(isT.o.fn.arrow.s(v)).toBe(true);
                        });
                    });
                });
            });
            describe(`anonymous`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.fn.anonymous(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[function(){}]])(`(%p)`, (v)=>{
                        expect(isT.o.fn.anonymous(v)).toBe(true);
                    });
                });
            });

            describe(`s`, ()=>{
                describe(`false`, ()=>{
                    test.each([[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.fn.s(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{//,[function(){const a=0;}]
                    test.each([[fn],[function fn(){const a=0;}]])(`(%p)`, (v)=>{
                        console.log(`name:`, tof(v));
                        expect(isT.o.fn.s(v)).toBe(true);
                    });
                });
            });
            describe(`g`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.fn.g(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[gfn],[function*(){}]])(`(%p)`, (v)=>{
                        expect(isT.o.fn.g(v)).toBe(true);
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[agfn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[function*(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.fn.a(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[afn],[async function(){}]])(`(%p)`, (v)=>{
                        expect(isT.o.fn.a(v)).toBe(true);
                    });
                });
            });
            describe(`ag`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[function*(){}],[async function(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.fn.ag(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{//,[function(){const a=0;}]
                    test.each([[agfn],[async function*(){}]])(`(%p)`, (v)=>{
                        expect(isT.o.fn.ag(v)).toBe(true);
                    });
                });
            });
        });
        describe(`md`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.o.md()));
                describe(`false`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.md(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.md(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.md.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        expect(isT.o.md.some(v)).toBe(true);
                    });
                });
            });
            describe(`s`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.gm],[_obj.am],[_obj.agm],[C.sgm],[C.sam],[C.sagm],[c.gm],[c.am],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.md.s(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{//,[function(){const a=0;}]
                    test.each([[_obj.m],[C.sm],[c.m]])(`(%p)`, (v)=>{
                        expect(isT.o.md.s(v)).toBe(true);
                    });
                });
            });
            describe(`g`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.m],[_obj.am],[_obj.agm],[C.sm],[C.sam],[C.sagm],[c.m],[c.am],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.md.g(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.gm],[C.sgm],[c.gm]])(`(%p)`, (v)=>{
                        expect(isT.o.md.g(v)).toBe(true);
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.m],[_obj.gm],[_obj.agm],[C.sm],[C.sgm],[C.sagm],[c.m],[c.gm],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.md.a(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.am],[C.sam],[c.am]])(`(%p)`, (v)=>{
                        expect(isT.o.md.a(v)).toBe(true);
                    });
                });
            });
            describe(`ag`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.m],[_obj.gm],[_obj.am],[C.sm],[C.sgm],[C.sam],[c.m],[c.gm],[c.am], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(isT.o.md.ag(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.agm],[C.sagm],[c.agm]])(`(%p)`, (v)=>{
                        expect(isT.o.md.ag(v)).toBe(true);
                    });
                });
            });
        });
    });
    describe(`d`, ()=>{
        describe(`()`, ()=>{
            test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.d()));
            describe(`false`, ()=>{
                test.each([[true],[false],[0],[0.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(isT.d(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                    expect(isT.d(v)).toBe(true);
                });
            });
        });
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[true],[false],[0],[0.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(isT.d.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                    expect(isT.d.some(v)).toBe(true);
                });
            });
        });
        describe(`und`, ()=>{
            describe(`false`, ()=>{
                test.each([[null],[0],[0.1],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(isT.d.und(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[undefined]])(`(%p)`, (v)=>{
                    expect(isT.d.und(v)).toBe(true);
                });
            });
        });
        describe(`nul`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[0],[0.1],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(isT.d.nul(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[null]])(`(%p)`, (v)=>{
                    expect(isT.d.nul(v)).toBe(true);
                });
            });
        });
        describe(`num`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.d.num()));
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.num(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[NaN],[Infinity],[-Infinity]])(`(%p)`, (v)=>{
                        expect(isT.d.num(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.num.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[NaN],[Infinity],[-Infinity]])(`(%p)`, (v)=>{
                        expect(isT.d.num.some(v)).toBe(true);
                    });
                });
            });
            describe(`nan`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[Infinity],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.num.nan(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[NaN]])(`(%p)`, (v)=>{
                        expect(isT.d.num.nan(v)).toBe(true);
                    });
                });
            });
            describe(`inf`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.num.inf(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Infinity],[-Infinity]])(`(%p)`, (v)=>{
                        expect(isT.d.num.inf(v)).toBe(true);
                    });
                });
            });
            describe(`pinf`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.num.pinf(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Infinity]])(`(%p)`, (v)=>{
                        expect(isT.d.num.pinf(v)).toBe(true);
                    });
                });
            });
            describe(`ninf`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.num.ninf(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[-Infinity]])(`(%p)`, (v)=>{
                        expect(isT.d.num.ninf(v)).toBe(true);
                    });
                });
            });
            describe(`oint`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.num.oint(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1]])(`(%p)`, (v)=>{
                        expect(isT.d.num.oint(v)).toBe(true);
                    });
                });
            });
            describe(`ofin`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.num.oint(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1]])(`(%p)`, (v)=>{
                        expect(isT.d.num.oint(v)).toBe(true);
                    });
                });
            });
            /*
            describe(`err`, ()=>{
            });
            describe(`flt`, ()=>{
                describe(`false`, ()=>{
                    test.each([[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099+0.1],[-900719925474099-0.1],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                        expect(isT.d.num.flt(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{// 整数も真になる。Typ.is.int()と重複してしまうが仕様。逆に1.0は偽で1.1は真では扱い辛い
                    test.each([[0],[1.0],[0.1],[-12.3],[45.6789],[900719925474099-0.1],[-900719925474099+0.1]])(`(%p)`, (v)=>{
                        expect(isT.d.num.flt(v)).toBe(true);
                    });
                });
            });
            */
        });
        describe(`obj`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.d.obj()));
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.obj(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                        expect(isT.d.obj(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.obj.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                        expect(isT.d.obj.some(v)).toBe(true);
                    });
                });
            });
            describe(`boxed`, ()=>{
                describe(`false`, ()=>{
                    test.each([[Object.create(null)],[Object.create({})],[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.obj.boxed(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()]])(`(%p)`, (v)=>{
                        expect(isT.d.obj.boxed(v)).toBe(true);
                    });
                });
            });
            describe(`hasNotProto`, ()=>{
                describe(`false`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create({})],[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.obj.hasNotProto(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Object.create(null)]])(`(%p)`, (v)=>{
                        expect(isT.d.obj.hasNotProto(v)).toBe(true);
                    });
                });
            });
            describe(`prototyped`, ()=>{
                describe(`false`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create(null)],[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.obj.prototyped(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Object.create({})]])(`(%p)`, (v)=>{
                        expect(isT.d.obj.prototyped(v)).toBe(true);
                    });
                });
            });
        });
    });
});
describe(`owT`, ()=>{
    describe(`p`, ()=>{
        describe(`()`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: a value that makes 'isT.p.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.p(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(owT.p(v)).toBe(true);
                });
            });
        });
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)]])(`(%p)`, (v)=>{
                    //assertThrow(TypeError, `Expected: a value that makes 'Typis.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.p.some(v));
                    assertThrow(TypeError, `Expected: a value that makes 'isT.p.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.p.some(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(owT.p.some(v)).toBe(true);
                });
            });
        });
        describe(`bln`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.p.bln.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.p.bln(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false]])(`(%p)`, (v)=>{
                    expect(owT.p.bln(v)).toBe(true);
                });
            });
        });
        describe(`int`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.p.int.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.p.int(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(owT.p.int(v)).toBe(true);
                });
            });
        });
        describe(`finite`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    //expect(isT.p.fin(v)).toBe(false);
                    assertThrow(TypeError, `Expected: '${isT.p.fin.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.p.fin(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0.1],[-12.3],[45.6789],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(owT.p.fin(v)).toBe(true);
                });
            });
        });
        describe(`big`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.p.big.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.p.big(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0n],[BigInt(Number.MAX_SAFE_INTEGER) + 1n],[BigInt(Number.MIN_SAFE_INTEGER) - 1n]])(`(%p)`, (v)=>{
                    expect(owT.p.big(v)).toBe(true);
                });
            });
        });
        describe(`str`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.p.str.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.p.str(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[''],[' '],['\n'],['a'],['あ']])(`(%p)`, (v)=>{
                    expect(owT.p.str(v)).toBe(true);
                });
            });
        });
        describe(`sym`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],['']])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.p.sym.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.p.sym(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[Symbol()],[Symbol('a')],[Symbol.for('a')]])(`(%p)`, (v)=>{
                    expect(owT.p.sym(v)).toBe(true);
                });
            });
        });
    });
    describe(`o`, ()=>{
        describe(`()`, ()=>{
            test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new owT.o()));
            describe(`TypeError`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: a value that makes 'isT.o.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o(v));
//                    assertThrow(TypeError, `Expected: a value that makes 'isT.o(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o(v));
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(owT.o(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(owT.o(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(owT.o(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(owT.o(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    test.each(cal.fn)(`(%p)`, (v)=>expect(owT.o(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    test.each(cal.md)(`(%p)`, (v)=>expect(owT.o(v)).toBe(true));
                });
            });
        });
        describe(`some`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: a value that makes 'isT.o.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.some(v));
//                    assertThrow(TypeError, `Expected: a value that makes 'isT.o(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.some(v));
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(owT.o.some(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(owT.o.some(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(owT.o.some(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(owT.o.some(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    test.each(cal.fn)(`(%p)`, (v)=>expect(owT.o.some(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    test.each(cal.md)(`(%p)`, (v)=>expect(owT.o.some(v)).toBe(true));
                });
            });
        });
        describe(`obj`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.o.obj.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.obj(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[{}]])(`(%p)`, (v)=>{
                    expect(owT.o.obj(v)).toBe(true);
                });
            });
        });
        describe(`ary`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[{}], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.o.ary.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.ary(v));
                });
            });
            describe(`true`, ()=>{
                class MyAry extends Array {}
                test.each([[[]],[[1,2,'a']],[new MyAry()]])(`(%p)`, (v)=>{
                    expect(owT.o.ary(v)).toBe(true);
                });
            });
        });
        describe(`cls`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new owT.o.cls()));
                describe(`TypeError`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.o.cls.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.cls(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(owT.o.cls(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.o.cls.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.cls.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(owT.o.cls.some(v)).toBe(true);
                    });
                });
            });
            describe(`es6`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.cls.es6.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.cls.es6(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6])(`(%p)`, (v)=>{
                        expect(owT.o.cls.es6(v)).toBe(true);
                    });
                });
            });
            describe(`es5`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cls.es6, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.cls.es5.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.cls.es5(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es5])(`(%p)`, (v)=>{
                        expect(owT.o.cls.es5(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cls.es5, ...cls.es6, ...ins.es6, ...ins.es5, ...ins.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.cls.native.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.cls.native(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.native])(`(%p)`, (v)=>{
                        expect(owT.o.cls.native(v)).toBe(true);
                    });
                });
            });
        });
        describe(`ins`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new owT.o.ins()));
                describe(`TypeError`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.o.ins.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.ins(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        expect(owT.o.ins(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.o.ins.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.ins.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        expect(owT.o.ins.some(v)).toBe(true);
                    });
                });
            });
            describe(`es6`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...ins.es5, ...ins.native, ...cls.es6, ...cls.es5, ...cls.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.ins.es6.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.ins.es6(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6])(`(%p)`, (v)=>{
                        expect(owT.o.ins.es6(v)).toBe(true);
                    });
                });
            });
            describe(`es5`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...ins.es6, ...ins.native, ...cls.es6, ...cls.es5, ...cls.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.ins.es5.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.ins.es5(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es5])(`(%p)`, (v)=>{
                        expect(owT.o.ins.es5(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...cls.es5, ...cls.es6, ...cls.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.ins.native.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.ins.native(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.native])(`(%p)`, (v)=>{
                        expect(owT.o.ins.native(v)).toBe(true);
                    });
                });
            });
        });
        describe(`des`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new owT.o.des()));
                describe(`TypeError`, ()=>{
                    test.each([[{}],[[]],[C], ...dangers, ...prims, ...cal.fn, ...cal.md, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.o.des.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.des(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(owT.o.des(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[{}],[[]],[C], ...dangers, ...prims, ...cal.fn, ...cal.md, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.o.des.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.des.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(owT.o.des.some(v)).toBe(true);
                    });
                });
            });
            describe(`d`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new owT.o.des.d()));
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: a value that makes 'isT.o.des.d.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.des.d(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                //expect(owT.o.des.d(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'isT.o.des.d.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.des.d(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                //expect(owT.o.des.d(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'isT.o.des.d.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.des.d(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.d(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: a value that makes 'isT.o.des.d.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.des.d.some(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                //expect(owT.o.des.d.some(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'isT.o.des.d.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.des.d.some(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                //expect(owT.o.des.d.some(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'isT.o.des.d.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.des.d.some(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.d.some(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`v`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.d.v.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.d.v(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.d.v.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.d.v(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.d.v.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.d.v(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.d.v(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`m`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.d.m.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.d.m(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.d.m.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.d.m(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.d.m.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.d.m(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.d.m(v)).toBe(true);
                            });
                        });
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new owT.o.des.a()));
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(owT.o.des.a(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'isT.o.des.a.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.des.a(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(v){return this._d}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(owT.o.des.a(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(owT.o.des.a(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(owT.o.des.a.some(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'isT.o.des.a.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.des.a.some(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(v){return this._d}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.some(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.some(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.some(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`g`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(owT.o.des.a.g(v)).toBe(false);
                                assertThrow(TypeError, `Expected: '${isT.o.des.a.g.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.a.g(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(owT.o.des.a.g(v)).toBe(false);
                                assertThrow(TypeError, `Expected: '${isT.o.des.a.g.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.a.g(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(owT.o.des.a.g(v)).toBe(false);
                                assertThrow(TypeError, `Expected: '${isT.o.des.a.g.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.a.g(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.g(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.g(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.g(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`s`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0},{get(){return this._d}}],[{_d:0},{get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.a.s.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.a.s(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa'],[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.a.s.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.a.s(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a'],[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.a.s.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.a.s(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.s(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.s(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.s(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`a`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0},{get(){return this._d}}],[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(owT.o.des.a.a(v)).toBe(false);
                                assertThrow(TypeError, `Expected: '${isT.o.des.a.a.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.a.a(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg'],[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.a.a.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.a.a(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g'],[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${isT.o.des.a.a.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.des.a.a(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0},{get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.a(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.a(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(owT.o.des.a.a(v)).toBe(true);
                            });
                        });
                    });
                });
            });
        });
        describe(`fn`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new owT.o.fn()));
                describe(`TypeError`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.o.fn.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.fn(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        expect(owT.o.fn(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.o.fn.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.fn.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        expect(owT.o.fn.some(v)).toBe(true);
                    });
                });
            });
            describe(`bound`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.fn.bound.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.fn.bound(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[fn.bind(null)]])(`(%p)`, (v)=>{
                        expect(owT.o.fn.bound(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.fn.native.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.fn.native(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[[].map]])(`(%p)`, (v)=>{
                        expect(owT.o.fn.native(v)).toBe(true);
                    });
                });
            });
            describe(`arrow`, ()=>{
                describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new owT.o.fn.arrow()));
                    describe(`TypeError`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                            assertThrow(TypeError, `Expected: a value that makes 'isT.o.fn.arrow.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.fn.arrow(v));
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(owT.o.fn.arrow(v)).toBe(true);
                        });
                    });

                });
                describe(`some`, ()=>{
                    describe(`TypeError`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                            assertThrow(TypeError, `Expected: a value that makes 'isT.o.fn.arrow.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.fn.arrow.some(v));
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(owT.o.fn.arrow.some(v)).toBe(true);
                        });
                    });

                });
                describe(`a`, ()=>{
                    describe(`TypeError`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[arrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                            assertThrow(TypeError, `Expected: '${isT.o.fn.arrow.a.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.fn.arrow.a(v));
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[aarrFn],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(owT.o.fn.arrow.a(v)).toBe(true);
                        });
                    });

                });
                describe(`s`, ()=>{
                    describe(`TypeError`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                            assertThrow(TypeError, `Expected: '${isT.o.fn.arrow.s.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.fn.arrow.s(v));
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[()=>{}]])(`(%p)`, (v)=>{
                            expect(owT.o.fn.arrow.s(v)).toBe(true);
                        });
                    });
                });
            });
            describe(`anonymous`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.fn.anonymous.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.fn.anonymous(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[function(){}],[function(){let x=0;/*this.x=0;*/}]])(`(%p)`, (v)=>{
                        expect(owT.o.fn.anonymous(v)).toBe(true);
                    });
                });

            });
            describe(`s`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.fn.s.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.fn.s(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[fn]])(`(%p)`, (v)=>{
                        expect(owT.o.fn.s(v)).toBe(true);
                    });
                });
            });
            describe(`g`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.fn.g.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.fn.g(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[gfn],[function*(){}]])(`(%p)`, (v)=>{
                        expect(owT.o.fn.g(v)).toBe(true);
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[gfn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.fn.a.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.fn.a(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[afn],[async function(){}]])(`(%p)`, (v)=>{
                        expect(owT.o.fn.a(v)).toBe(true);
                    });
                });
            });
            describe(`ag`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[afn],[gfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.fn.ag.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.fn.ag(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[agfn],[async function*(){}]])(`(%p)`, (v)=>{
                        expect(owT.o.fn.ag(v)).toBe(true);
                    });
                });
            });
        });
        describe(`md`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new owT.o.md()));
                describe(`TypeError`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.o.md.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.md(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        expect(owT.o.md(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.o.md.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.o.md.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        expect(owT.o.md.some(v)).toBe(true);
                    });
                });
            });
            describe(`s`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[_obj.gm],[_obj.am],[_obj.agm],[C.sgm],[C.sam],[C.sagm],[c.gm],[c.am],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.md.s.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.md.s(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.m],[C.sm],[c.m]])(`(%p)`, (v)=>{
                        expect(owT.o.md.s(v)).toBe(true);
                    });
                });
            });
            describe(`g`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[_obj.m],[_obj.am],[_obj.agm],[C.sm],[C.sam],[C.sagm],[c.m],[c.am],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.md.g.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.md.g(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.gm],[C.sgm],[c.gm]])(`(%p)`, (v)=>{
                        expect(owT.o.md.g(v)).toBe(true);
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[_obj.m],[_obj.gm],[_obj.agm],[C.sm],[C.sgm],[C.sagm],[c.m],[c.gm],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.md.a.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.md.a(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.am],[C.sam],[c.am]])(`(%p)`, (v)=>{
                        expect(owT.o.md.a(v)).toBe(true);
                    });
                });
            });
            describe(`ag`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[_obj.m],[_obj.gm],[_obj.am],[C.sm],[C.sgm],[C.sam],[c.m],[c.gm],[c.am], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.o.md.ag.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.o.md.ag(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.agm],[C.sagm],[c.agm]])(`(%p)`, (v)=>{
                        expect(owT.o.md.ag(v)).toBe(true);
                    });
                });
            });
        });
    });
    describe(`d`, ()=>{
        describe(`()`, ()=>{
            test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.d()));
            describe(`TypeError`, ()=>{
                test.each([[true],[false],[0],[0.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: a value that makes 'isT.d.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.d(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                    expect(isT.d(v)).toBe(true);
                });
            });
        });
        describe(`some`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[true],[false],[0],[0.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: a value that makes 'isT.d.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.d.some(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                    expect(isT.d.some(v)).toBe(true);
                });
            });
        });
        describe(`und`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[null],[0],[0.1],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.d.und.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.und(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[undefined]])(`(%p)`, (v)=>{
                    expect(isT.d.und(v)).toBe(true);
                });
            });
        });
        describe(`nul`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[0],[0.1],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.d.nul.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.nul(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[null]])(`(%p)`, (v)=>{
                    expect(isT.d.nul(v)).toBe(true);
                });
            });
        });
        describe(`num`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.d.num()));
                describe(`TypeError`, ()=>{
                    test.each([[undefined],[null],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.d.num.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.d.num(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[NaN],[Infinity],[-Infinity]])(`(%p)`, (v)=>{
                        expect(isT.d.num(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[undefined],[null],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.d.num.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.d.num.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[NaN],[Infinity],[-Infinity]])(`(%p)`, (v)=>{
                        expect(isT.d.num.some(v)).toBe(true);
                    });
                });
            });
            describe(`nan`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[undefined],[null],[Infinity],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.d.num.nan.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.num.nan(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[NaN]])(`(%p)`, (v)=>{
                        expect(isT.d.num.nan(v)).toBe(true);
                    });
                });
            });
            describe(`inf`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[undefined],[null],[NaN],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.d.num.inf.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.num.inf(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Infinity],[-Infinity]])(`(%p)`, (v)=>{
                        expect(isT.d.num.inf(v)).toBe(true);
                    });
                });
            });
            describe(`pinf`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[undefined],[null],[NaN],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.d.num.pinf.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.num.pinf(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Infinity]])(`(%p)`, (v)=>{
                        expect(isT.d.num.pinf(v)).toBe(true);
                    });
                });
            });
            describe(`ninf`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.d.num.ninf.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.num.ninf(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[-Infinity]])(`(%p)`, (v)=>{
                        expect(isT.d.num.ninf(v)).toBe(true);
                    });
                });
            });
            describe(`oint`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(isT.d.num.oint(v)).toBe(false);
                        assertThrow(TypeError, `Expected: '${isT.d.num.oint.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.num.oint(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1]])(`(%p)`, (v)=>{
                        expect(isT.d.num.oint(v)).toBe(true);
                    });
                });
            });
            describe(`ofin`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.d.num.ofin.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.num.ofin(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1]])(`(%p)`, (v)=>{
                        expect(isT.d.num.oint(v)).toBe(true);
                    });
                });
            });
            /*
            describe(`err`, ()=>{
            });
            describe(`flt`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099+0.1],[-900719925474099-0.1],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                        expect(isT.d.num.flt(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{// 整数も真になる。Typ.is.int()と重複してしまうが仕様。逆に1.0は偽で1.1は真では扱い辛い
                    test.each([[0],[1.0],[0.1],[-12.3],[45.6789],[900719925474099-0.1],[-900719925474099+0.1]])(`(%p)`, (v)=>{
                        expect(isT.d.num.flt(v)).toBe(true);
                    });
                });
            });
            */
        });
        describe(`obj`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new isT.d.obj()));
                describe(`TypeError`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.d.obj.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.d.obj(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                        expect(isT.d.obj(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'isT.d.obj.some(v)' return true.\nActual: ${tof(v)}`, ()=>owT.d.obj.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                        expect(isT.d.obj.some(v)).toBe(true);
                    });
                });
            });
            describe(`boxed`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[Object.create(null)],[Object.create({})],[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.d.obj.boxed.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.obj.boxed(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()]])(`(%p)`, (v)=>{
                        expect(isT.d.obj.boxed(v)).toBe(true);
                    });
                });
            });
            describe(`hasNotProto`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create({})],[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.d.obj.hasNotProto.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.obj.hasNotProto(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Object.create(null)]])(`(%p)`, (v)=>{
                        expect(isT.d.obj.hasNotProto(v)).toBe(true);
                    });
                });
            });
            describe(`prototyped`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create(null)],[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${isT.d.obj.prototyped.toString()}' like value.\nActual: ${tof(v)}`, ()=>owT.d.obj.prototyped(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Object.create({})]])(`(%p)`, (v)=>{
                        expect(isT.d.obj.prototyped(v)).toBe(true);
                    });
                });
            });
        });
    });});

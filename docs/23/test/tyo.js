import { expect, test, describe } from "bun:test";
import {Tyo} from '../src/tyo.js';
import {Tys} from '../src/tys.js';
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from './test-data.js';
describe(`Tyo`, ()=>{
    describe(`is`, ()=>{
        describe(`()`, ()=>{
            test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.is()));
            describe(`false`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    expect(Tyo.is(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(Tyo.is(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(Tyo.is(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(Tyo.is(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(Tyo.is(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    test.each(cal.fn)(`(%p)`, (v)=>expect(Tyo.is(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    test.each(cal.md)(`(%p)`, (v)=>expect(Tyo.is(v)).toBe(true));
                });
            });
        });
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    expect(Tyo.is.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(Tyo.is.some(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    test.each(cal.fn)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    test.each(cal.md)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                });
            });
        });
        describe(`obj`, ()=>{
            describe(`false`, ()=>{
                test.each([[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(Tyo.is.obj(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[{}]])(`(%p)`, (v)=>{
                    expect(Tyo.is.obj(v)).toBe(true);
                });
            });
        });
        describe(`ary`, ()=>{
            describe(`false`, ()=>{
                test.each([[{}],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(Tyo.is.ary(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[[]],[[1,2,'a']]])(`(%p)`, (v)=>{
                    expect(Tyo.is.ary(v)).toBe(true);
                });
            });
        });
        describe(`cls`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.is.cls()));
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.cls(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.cls(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.cls.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.cls.some(v)).toBe(true);
                    });
                });
            });
            describe(`es6`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cls.es5, ...cls.native, [{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.cls.es6(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6])(`(%p)`, (v)=>{
                        expect(Tyo.is.cls.es6(v)).toBe(true);
                    });
                });
            });
            describe(`es5`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cls.es6, ...cls.native, [{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.cls.es5(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es5])(`(%p)`, (v)=>{
                        expect(Tyo.is.cls.es5(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cls.es5, ...cls.es6, [{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.cls.native(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.cls.native(v)).toBe(true);
                    });
                });
            });
        });
        describe(`ins`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.is.ins()));
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.ins(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.ins(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.ins.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.ins.some(v)).toBe(true);
                    });
                });
            });
            describe(`es6`, ()=>{
                describe(`false`, ()=>{
                    test.each([...ins.es5, ...ins.native, [{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.ins.es6(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    class MyObj extends Object {}
                    test.each([...ins.es6, [new MyObj()]])(`(%p)`, (v)=>{
                        expect(Tyo.is.ins.es6(v)).toBe(true);
                    });
                });
            });
            describe(`es5`, ()=>{
                describe(`false`, ()=>{
                    test.each([...ins.es6, ...ins.native, [{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.ins.es5(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es5])(`(%p)`, (v)=>{
                        expect(Tyo.is.ins.es5(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`false`, ()=>{
                    test.each([...ins.es5, ...ins.es6, [{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.ins.native(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.ins.native(v)).toBe(true);
                    });
                });
            });
        });
        describe(`des`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.is.des()));
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.des(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(Tyo.is.des(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.des.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(Tyo.is.des.some(v)).toBe(true);
                    });
                });
            });
            describe(`d`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.is.des.d()));
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.some(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.some(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.some(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.some(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`v`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.v(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.v(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.v(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.v(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`m`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.m(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.m(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.m(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.d.m(v)).toBe(true);
                            });
                        });
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.is.des.a()));
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(v){return this._d}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.some(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(v){return this._d}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.some(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.some(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.some(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`g`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.g(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.g(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.g(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.g(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.g(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.g(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`s`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0},{get(){return this._d}}],[{_d:0},{get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.s(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa'],[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.s(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a'],[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.s(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.s(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.s(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.s(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`a`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0},{get(){return this._d}}],[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.a(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg'],[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.a(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g'],[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.a(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0},{get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.a(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.a(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.is.des.a.a(v)).toBe(true);
                            });
                        });
                    });
                });
            });
        });
        describe(`fn`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.is.fn()));
                describe(`false`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.some(v)).toBe(true);
                    });
                });
            });
            describe(`bound`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.bound(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[fn.bind(null)]])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.bound(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.native(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[[].map]])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.native(v)).toBe(true);
                    });
                });
            });
            describe(`arrow`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.is.fn.arrow()));
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(Tyo.is.fn.arrow(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyo.is.fn.arrow(v)).toBe(true);
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(Tyo.is.fn.arrow.some(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyo.is.fn.arrow.some(v)).toBe(true);
                        });
                    });
                });

                describe(`a`, ()=>{
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[arrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(Tyo.is.fn.arrow.a(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[aarrFn],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyo.is.fn.arrow.a(v)).toBe(true);
                        });
                    });
                });
                describe(`s`, ()=>{
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(Tyo.is.fn.arrow.s(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyo.is.fn.arrow.s(v)).toBe(true);
                        });
                    });
                });
            });
            describe(`anonymous`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.anonymous(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[function(){}]])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.anonymous(v)).toBe(true);
                    });
                });
            });

            describe(`s`, ()=>{
                describe(`false`, ()=>{
                    test.each([[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.s(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{//,[function(){const a=0;}]
                    test.each([[fn],[function fn(){const a=0;}]])(`(%p)`, (v)=>{
                        console.log(`name:`, Tys.name(v));
                        expect(Tyo.is.fn.s(v)).toBe(true);
                    });
                });
            });
            describe(`g`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.g(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[gfn],[function*(){}]])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.g(v)).toBe(true);
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[agfn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[function*(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.a(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[afn],[async function(){}]])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.a(v)).toBe(true);
                    });
                });
            });
            describe(`ag`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[function*(){}],[async function(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.ag(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{//,[function(){const a=0;}]
                    test.each([[agfn],[async function*(){}]])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.ag(v)).toBe(true);
                    });
                });
            });
        });
        describe(`md`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.is.md()));
                describe(`false`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.md(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.md(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.some(v)).toBe(true);
                    });
                });
            });
            describe(`s`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.gm],[_obj.am],[_obj.agm],[C.sgm],[C.sam],[C.sagm],[c.gm],[c.am],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.s(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{//,[function(){const a=0;}]
                    test.each([[_obj.m],[C.sm],[c.m]])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.s(v)).toBe(true);
                    });
                });
            });
            describe(`g`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.m],[_obj.am],[_obj.agm],[C.sm],[C.sam],[C.sagm],[c.m],[c.am],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.g(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.gm],[C.sgm],[c.gm]])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.g(v)).toBe(true);
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.m],[_obj.gm],[_obj.agm],[C.sm],[C.sgm],[C.sagm],[c.m],[c.gm],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.a(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.am],[C.sam],[c.am]])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.a(v)).toBe(true);
                    });
                });
            });
            describe(`ag`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.m],[_obj.gm],[_obj.am],[C.sm],[C.sgm],[C.sam],[c.m],[c.gm],[c.am], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.ag(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.agm],[C.sagm],[c.agm]])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.ag(v)).toBe(true);
                    });
                });
            });
        });
    });
    describe(`er`, ()=>{
        describe(`()`, ()=>{
            test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.er()));
            describe(`TypeError`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er(v));
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(Tyo.er(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(Tyo.er(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(Tyo.er(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(Tyo.er(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    test.each(cal.fn)(`(%p)`, (v)=>expect(Tyo.er(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    test.each(cal.md)(`(%p)`, (v)=>expect(Tyo.er(v)).toBe(true));
                });
            });
        });
        describe(`some`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.some(v));
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(Tyo.er.some(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(Tyo.er.some(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(Tyo.er.some(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(Tyo.er.some(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    test.each(cal.fn)(`(%p)`, (v)=>expect(Tyo.er.some(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    test.each(cal.md)(`(%p)`, (v)=>expect(Tyo.er.some(v)).toBe(true));
                });
            });
        });
        describe(`obj`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${Tyo.is.obj.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.obj(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[{}]])(`(%p)`, (v)=>{
                    expect(Tyo.er.obj(v)).toBe(true);
                });
            });
        });
        describe(`ary`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[{}], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${Tyo.is.ary.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.ary(v));
                });
            });
            describe(`true`, ()=>{
                class MyAry extends Array {}
                test.each([[[]],[[1,2,'a']],[new MyAry()]])(`(%p)`, (v)=>{
                    expect(Tyo.er.ary(v)).toBe(true);
                });
            });
        });
        describe(`cls`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.er.cls()));
                describe(`TypeError`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.cls.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.cls(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.er.cls(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.cls.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.cls.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.er.cls.some(v)).toBe(true);
                    });
                });
            });
            describe(`es6`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.cls.es6.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.cls.es6(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6])(`(%p)`, (v)=>{
                        expect(Tyo.er.cls.es6(v)).toBe(true);
                    });
                });
            });
            describe(`es5`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cls.es6, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.cls.es5.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.cls.es5(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es5])(`(%p)`, (v)=>{
                        expect(Tyo.er.cls.es5(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cls.es5, ...cls.es6, ...ins.es6, ...ins.es5, ...ins.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.cls.native.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.cls.native(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.er.cls.native(v)).toBe(true);
                    });
                });
            });
        });
        describe(`ins`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.er.ins()));
                describe(`TypeError`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.ins.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.ins(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        expect(Tyo.er.ins(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.ins.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.ins.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        expect(Tyo.er.ins.some(v)).toBe(true);
                    });
                });
            });
            describe(`es6`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...ins.es5, ...ins.native, ...cls.es6, ...cls.es5, ...cls.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.ins.es6.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.ins.es6(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6])(`(%p)`, (v)=>{
                        expect(Tyo.er.ins.es6(v)).toBe(true);
                    });
                });
            });
            describe(`es5`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...ins.es6, ...ins.native, ...cls.es6, ...cls.es5, ...cls.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.ins.es5.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.ins.es5(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es5])(`(%p)`, (v)=>{
                        expect(Tyo.er.ins.es5(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...cls.es5, ...cls.es6, ...cls.native, [{}],[[]], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.ins.native.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.ins.native(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.native])(`(%p)`, (v)=>{
                        expect(Tyo.er.ins.native(v)).toBe(true);
                    });
                });
            });
        });
        describe(`des`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.er.des()));
                describe(`TypeError`, ()=>{
                    test.each([[{}],[[]],[C], ...dangers, ...prims, ...cal.fn, ...cal.md, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.des.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(Tyo.er.des(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[{}],[[]],[C], ...dangers, ...prims, ...cal.fn, ...cal.md, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.des.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(Tyo.er.des.some(v)).toBe(true);
                    });
                });
            });
            describe(`d`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.er.des.d()));
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.des.d.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.des.d.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.des.d.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.d(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.des.d.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.some(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d.some(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.des.d.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.some(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d.some(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.des.d.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.some(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.d.some(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`v`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.d.v.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.v(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.d.v.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.v(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.d.v.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.v(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.d.v(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`m`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.d.m.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.m(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.d.m.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.m(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.d.m.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.m(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.d.m(v)).toBe(true);
                            });
                        });
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.er.des.a()));
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.des.a.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(v){return this._d}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.some(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.des.a.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.some(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(v){return this._d}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.some(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.some(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.some(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`g`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.g(v)).toBe(false);
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.a.g.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.g(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.g(v)).toBe(false);
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.a.g.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.g(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.g(v)).toBe(false);
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.a.g.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.g(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.g(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.g(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.g(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`s`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0},{get(){return this._d}}],[{_d:0},{get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.a.s.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.s(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa'],[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.a.s.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.s(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a'],[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.a.s.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.s(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.s(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.s(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.s(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`a`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0},{get(){return this._d}}],[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.a(v)).toBe(false);
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.a.a.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.a(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg'],[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.a.a.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.a(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g'],[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                assertThrow(TypeError, `Expected: '${Tyo.is.des.a.a.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.a(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0},{get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.a(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.a(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyo.er.des.a.a(v)).toBe(true);
                            });
                        });
                    });
                });
            });
        });
        describe(`fn`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.er.fn()));
                describe(`TypeError`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.fn.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        expect(Tyo.er.fn(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.fn.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        expect(Tyo.er.fn.some(v)).toBe(true);
                    });
                });
            });
            describe(`bound`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.fn.bound.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.bound(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[fn.bind(null)]])(`(%p)`, (v)=>{
                        expect(Tyo.er.fn.bound(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.fn.native.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.native(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[[].map]])(`(%p)`, (v)=>{
                        expect(Tyo.er.fn.native(v)).toBe(true);
                    });
                });
            });
            describe(`arrow`, ()=>{
                describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.er.fn.arrow()));
                    describe(`TypeError`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                            assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.fn.arrow.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.arrow(v));
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyo.er.fn.arrow(v)).toBe(true);
                        });
                    });

                });
                describe(`some`, ()=>{
                    describe(`TypeError`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                            assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.fn.arrow.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.arrow.some(v));
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyo.er.fn.arrow.some(v)).toBe(true);
                        });
                    });

                });
                describe(`a`, ()=>{
                    describe(`TypeError`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[arrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                            assertThrow(TypeError, `Expected: '${Tyo.is.fn.arrow.a.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.arrow.a(v));
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[aarrFn],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyo.er.fn.arrow.a(v)).toBe(true);
                        });
                    });

                });
                describe(`s`, ()=>{
                    describe(`TypeError`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                            assertThrow(TypeError, `Expected: '${Tyo.is.fn.arrow.s.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.arrow.s(v));
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyo.er.fn.arrow.s(v)).toBe(true);
                        });
                    });
                });
            });
            describe(`anonymous`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.fn.anonymous.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.anonymous(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[function(){}],[function(){let x=0;/*this.x=0;*/}]])(`(%p)`, (v)=>{
                        expect(Tyo.er.fn.anonymous(v)).toBe(true);
                    });
                });

            });
            describe(`s`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.fn.s.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.s(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[fn]])(`(%p)`, (v)=>{
                        expect(Tyo.er.fn.s(v)).toBe(true);
                    });
                });
            });
            describe(`g`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.fn.g.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.g(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[gfn],[function*(){}]])(`(%p)`, (v)=>{
                        expect(Tyo.er.fn.g(v)).toBe(true);
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[gfn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.fn.a.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.a(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[afn],[async function(){}]])(`(%p)`, (v)=>{
                        expect(Tyo.er.fn.a(v)).toBe(true);
                    });
                });
            });
            describe(`ag`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[fn],[afn],[gfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.fn.ag.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.ag(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[agfn],[async function*(){}]])(`(%p)`, (v)=>{
                        expect(Tyo.er.fn.ag(v)).toBe(true);
                    });
                });
            });
        });
        describe(`md`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyo.er.md()));
                describe(`TypeError`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.md.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.md(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.er.md(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native, ...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: a value that makes 'Tyo.is.md.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.md.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        expect(Tyo.er.md.some(v)).toBe(true);
                    });
                });
            });
            describe(`s`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[_obj.gm],[_obj.am],[_obj.agm],[C.sgm],[C.sam],[C.sagm],[c.gm],[c.am],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.md.s.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.md.s(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.m],[C.sm],[c.m]])(`(%p)`, (v)=>{
                        expect(Tyo.er.md.s(v)).toBe(true);
                    });
                });
            });
            describe(`g`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[_obj.m],[_obj.am],[_obj.agm],[C.sm],[C.sam],[C.sagm],[c.m],[c.am],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.md.g.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.md.g(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.gm],[C.sgm],[c.gm]])(`(%p)`, (v)=>{
                        expect(Tyo.er.md.g(v)).toBe(true);
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[_obj.m],[_obj.gm],[_obj.agm],[C.sm],[C.sgm],[C.sagm],[c.m],[c.gm],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.md.a.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.md.a(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.am],[C.sam],[c.am]])(`(%p)`, (v)=>{
                        expect(Tyo.er.md.a(v)).toBe(true);
                    });
                });
            });
            describe(`ag`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[_obj.m],[_obj.gm],[_obj.am],[C.sm],[C.sgm],[C.sam],[c.m],[c.gm],[c.am], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        assertThrow(TypeError, `Expected: '${Tyo.is.md.ag.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.md.ag(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.agm],[C.sagm],[c.agm]])(`(%p)`, (v)=>{
                        expect(Tyo.er.md.ag(v)).toBe(true);
                    });
                });
            });
        });
    });
});

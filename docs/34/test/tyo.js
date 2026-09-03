import { expect, test, describe } from "bun:test";
import {Tyois} from '../src/tyo.js';
import {Tys} from '../src/tys.js';
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from './test-data.js';
describe(`Tyo`, ()=>{
    describe(`is`, ()=>{
        describe(`()`, ()=>{
            test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyois()));
            describe(`false`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    expect(Tyois(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(Tyois(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(Tyois(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(Tyois(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(Tyois(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    test.each(cal.fn)(`(%p)`, (v)=>expect(Tyois(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    test.each(cal.md)(`(%p)`, (v)=>expect(Tyois(v)).toBe(true));
                });
            });
        });
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    expect(Tyois.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(Tyois.some(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(Tyois.some(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(Tyois.some(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(Tyois.some(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    test.each(cal.fn)(`(%p)`, (v)=>expect(Tyois.some(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    test.each(cal.md)(`(%p)`, (v)=>expect(Tyois.some(v)).toBe(true));
                });
            });
        });
        describe(`obj`, ()=>{
            describe(`false`, ()=>{
                test.each([[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(Tyois.obj(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[{}]])(`(%p)`, (v)=>{
                    expect(Tyois.obj(v)).toBe(true);
                });
            });
        });
        describe(`ary`, ()=>{
            describe(`false`, ()=>{
                test.each([[{}],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(Tyois.ary(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[[]],[[1,2,'a']]])(`(%p)`, (v)=>{
                    expect(Tyois.ary(v)).toBe(true);
                });
            });
        });
        describe(`cls`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyois.cls()));
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.cls(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.cls(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.cls.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.cls.some(v)).toBe(true);
                    });
                });
            });
            describe(`es6`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cls.es5, ...cls.native, [{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.cls.es6(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es6])(`(%p)`, (v)=>{
                        expect(Tyois.cls.es6(v)).toBe(true);
                    });
                });
            });
            describe(`es5`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cls.es6, ...cls.native, [{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.cls.es5(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.es5])(`(%p)`, (v)=>{
                        expect(Tyois.cls.es5(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cls.es5, ...cls.es6, [{}],[[]],[function(){}],[function fn(){}], ...ins.es6, ...ins.es5, ...ins.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.cls.native(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.cls.native(v)).toBe(true);
                    });
                });
            });
        });
        describe(`ins`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyois.ins()));
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.ins(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        expect(Tyois.ins(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.ins.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es6, ...ins.es5, ...ins.native])(`(%p)`, (v)=>{
                        expect(Tyois.ins.some(v)).toBe(true);
                    });
                });
            });
            describe(`es6`, ()=>{
                describe(`false`, ()=>{
                    test.each([...ins.es5, ...ins.native, [{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.ins.es6(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    class MyObj extends Object {}
                    test.each([...ins.es6, [new MyObj()]])(`(%p)`, (v)=>{
                        expect(Tyois.ins.es6(v)).toBe(true);
                    });
                });
            });
            describe(`es5`, ()=>{
                describe(`false`, ()=>{
                    test.each([...ins.es6, ...ins.native, [{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.ins.es5(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.es5])(`(%p)`, (v)=>{
                        expect(Tyois.ins.es5(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`false`, ()=>{
                    test.each([...ins.es5, ...ins.es6, [{}],[[]],[function(){}],[function fn(){}], ...cls.es6, ...cls.es5, ...cls.native, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.ins.native(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...ins.native])(`(%p)`, (v)=>{
                        expect(Tyois.ins.native(v)).toBe(true);
                    });
                });
            });
        });
        describe(`des`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyois.des()));
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.des(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(Tyois.des(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.des.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(Tyois.des.some(v)).toBe(true);
                    });
                });
            });
            describe(`d`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyois.des.d()));
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.d(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyois.des.d(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyois.des.d(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.d(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.some(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.some(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.some(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.some(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`v`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.v(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.v(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.v(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.v(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`m`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.m(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.m(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.m(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.d.m(v)).toBe(true);
                            });
                        });
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyois.des.a()));
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(v){return this._d}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyois.des.a(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyois.des.a(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.some(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(v){return this._d}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.some(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.some(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.some(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`g`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.g(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.g(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.g(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.g(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.g(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.g(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`s`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0},{get(){return this._d}}],[{_d:0},{get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.s(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa'],[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.s(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a'],[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.s(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.s(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.s(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.s(v)).toBe(true);
                            });
                        });
                    });
                });
                describe(`a`, ()=>{
                    describe(`false`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}],[{_d:0},{get(){return this._d}}],[{_d:0}, {set(v){this._d=v;}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.a(v)).toBe(false);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg'],[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.a(v)).toBe(false);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g'],[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.a(v)).toBe(false);
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0},{get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.a(v)).toBe(true);
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.a(v)).toBe(true);
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                expect(Tyois.des.a.a(v)).toBe(true);
                            });
                        });
                    });
                });
            });
        });
        describe(`fn`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyois.fn()));
                describe(`false`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.fn(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        expect(Tyois.fn(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.fn.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        expect(Tyois.fn.some(v)).toBe(true);
                    });
                });
            });
            describe(`bound`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.fn.bound(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[fn.bind(null)]])(`(%p)`, (v)=>{
                        expect(Tyois.fn.bound(v)).toBe(true);
                    });
                });
            });
            describe(`native`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.fn.native(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[[].map]])(`(%p)`, (v)=>{
                        expect(Tyois.fn.native(v)).toBe(true);
                    });
                });
            });
            describe(`arrow`, ()=>{
                describe(`()`, ()=>{
                    test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyois.fn.arrow()));
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(Tyois.fn.arrow(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyois.fn.arrow(v)).toBe(true);
                        });
                    });
                });
                describe(`some`, ()=>{
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(Tyois.fn.arrow.some(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[aarrFn],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyois.fn.arrow.some(v)).toBe(true);
                        });
                    });
                });

                describe(`a`, ()=>{
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[arrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(Tyois.fn.arrow.a(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[aarrFn],[async()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyois.fn.arrow.a(v)).toBe(true);
                        });
                    });
                });
                describe(`s`, ()=>{
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                            expect(Tyois.fn.arrow.s(v)).toBe(false);
                        });
                    });
                    describe(`true`, ()=>{
                        test.each([[arrFn],[()=>{}]])(`(%p)`, (v)=>{
                            expect(Tyois.fn.arrow.s(v)).toBe(true);
                        });
                    });
                });
            });
            describe(`anonymous`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.fn.anonymous(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[function(){}]])(`(%p)`, (v)=>{
                        expect(Tyois.fn.anonymous(v)).toBe(true);
                    });
                });
            });

            describe(`s`, ()=>{
                describe(`false`, ()=>{
                    test.each([[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.fn.s(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{//,[function(){const a=0;}]
                    test.each([[fn],[function fn(){const a=0;}]])(`(%p)`, (v)=>{
                        console.log(`name:`, Tys.name(v));
                        expect(Tyois.fn.s(v)).toBe(true);
                    });
                });
            });
            describe(`g`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.fn.g(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[gfn],[function*(){}]])(`(%p)`, (v)=>{
                        expect(Tyois.fn.g(v)).toBe(true);
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[agfn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[function*(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.fn.a(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[afn],[async function(){}]])(`(%p)`, (v)=>{
                        expect(Tyois.fn.a(v)).toBe(true);
                    });
                });
            });
            describe(`ag`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[arrFn],[aarrFn],[function(){}],[function(){const a=0;}],[function*(){}],[async function(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.fn.ag(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{//,[function(){const a=0;}]
                    test.each([[agfn],[async function*(){}]])(`(%p)`, (v)=>{
                        expect(Tyois.fn.ag(v)).toBe(true);
                    });
                });
            });
        });
        describe(`md`, ()=>{
            describe(`()`, ()=>{
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyois.md()));
                describe(`false`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.md(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.md(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.md.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        expect(Tyois.md.some(v)).toBe(true);
                    });
                });
            });
            describe(`s`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.gm],[_obj.am],[_obj.agm],[C.sgm],[C.sam],[C.sagm],[c.gm],[c.am],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.md.s(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{//,[function(){const a=0;}]
                    test.each([[_obj.m],[C.sm],[c.m]])(`(%p)`, (v)=>{
                        expect(Tyois.md.s(v)).toBe(true);
                    });
                });
            });
            describe(`g`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.m],[_obj.am],[_obj.agm],[C.sm],[C.sam],[C.sagm],[c.m],[c.am],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.md.g(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.gm],[C.sgm],[c.gm]])(`(%p)`, (v)=>{
                        expect(Tyois.md.g(v)).toBe(true);
                    });
                });
            });
            describe(`a`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.m],[_obj.gm],[_obj.agm],[C.sm],[C.sgm],[C.sagm],[c.m],[c.gm],[c.agm], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.md.a(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.am],[C.sam],[c.am]])(`(%p)`, (v)=>{
                        expect(Tyois.md.a(v)).toBe(true);
                    });
                });
            });
            describe(`ag`, ()=>{
                describe(`false`, ()=>{
                    test.each([[_obj.m],[_obj.gm],[_obj.am],[C.sm],[C.sgm],[C.sam],[c.m],[c.gm],[c.am], ...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyois.md.ag(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[_obj.agm],[C.sagm],[c.agm]])(`(%p)`, (v)=>{
                        expect(Tyois.md.ag(v)).toBe(true);
                    });
                });
            });
        });
    });
});

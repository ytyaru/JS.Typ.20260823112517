import { expect, test, describe } from "bun:test";
import {Tyo} from '../src/tyo.js';
import {Tys} from '../src/tys.js';
/**
 * 指定した関数を実行し、期待する例外型とメッセージが完全に一致してスローされるか検証する
 * @param fn 検証対象の関数
 * @param expectedErrorClass 期待する例外のコンストラクタ（例: TyoeError, CustomError など）
 * @param expectedMessage 期待する完全一致のエラーメッセージ
 */
function assertThrow(Err, msg, fn) {
    let err = null;
    try {fn();} catch (error) {err = error;}
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Err);
    expect(err.message).toBe(msg);
}
// テストデータ
class C {
    static get sg() {}
    static set ss(v) {}
    static get sa() {}
    static set sa(v) {}
    get g() {}
    set s(v) {}
    get a() {}
    set a(v) {}
    static sm(){}
    static *sgm(){}
    static async sam(){}
    static async *sagm(){}
    m(){}
    *gm(){}
    async am(){}
    async *agm(){}
}
const c = new C();
function fn(){}
function *gfn(){}
async function afn(){}
async function *agfn(){}
const arrFn = ()=>{};
const aarrFn = async()=>{};
const getDes = (o,d)=>Object.getOwnPropertyDescriptor(Object.defineProperty(o, 'd', d), 'd');
const _obj = {m(){}};
const des = {
    o: [[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]),
    c: [[C,'sg'],[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]),
    i: [[c,'g'],[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]),
};
const cal = {
    fn: [[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map]],
    md: [[_obj.m],[C.sm],[C.sgm],[C.sam],[C.sagm],[c.m],[c.gm],[c.am],[c.agm]],
}
const prims = [[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]];
const objs = [[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md];
//const dangers = [[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create(null)],[new fn()]];
//const dangers = [[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create(null)],[function(){}]];
const dangers = [[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create(null)]];
const cls = {
    es6: [[C],[class{}],[class C{}]],
    // 匿名かつthisに何もセットしてないと関数。先頭文字が大文字なら疑似クラス。
    es5: [[function Fn(){}],[function fn(){this.x=0}],[function(){this.x=0}]], 
    native: [[Map],[Uint8Array],[Blob]],
};
const ins = {
    es6: [[C],[class{}],[class C{}]].map(v=>[new (v[0])()]),
    // 匿名かつthisに何もセットしてなくともnewされたら擬似クラスのインスタンスと判定する。
    es5: [[function(){}],[function Fn(){}],[function fn(){this.x=0}],[function(){this.x=0}]].map(v=>[new (v[0])()]),
    native: [[Map],[Uint8Array],[Blob]].map(v=>[new (v[0])()]),
};
describe(`Tyo`, ()=>{
    describe(`is`, ()=>{
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
                    test.each([...ins.es6])(`(%p)`, (v)=>{
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
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
//                        console.log(`name:`, Tys.name(v));
                        expect(Tyo.is.fn.some(v)).toBe(true);
                    });
                });
            });
            describe(`bound`, ()=>{
// fn: [[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map]],
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
//                        console.log(`name: ${Tyo.is.fn.bound(v)}: ${Tys.name(v)}`);
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
//                        console.log(`name: ${Tyo.is.fn.native(v)}: ${Tys.name(v)}`);
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
                describe(`a`, ()=>{
                    describe(`false`, ()=>{
                        test.each([[fn],[gfn],[afn],[agfn],[arrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
//                            console.log(`name: ${Tyo.is.fn.arrow(v)}: ${Tys.name(v)}`);
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
//                            console.log(`name: ${Tyo.is.fn.s(v)}: ${Tys.name(v)}`); //  : ${Object.prototype.toString.call(v)}
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
            /*
            describe(`anonymousBlank`, ()=>{
                describe(`false`, ()=>{
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[fn.bind(null)],[[].map], ...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.anonymousBlank(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[function(){}]])(`(%p)`, (v)=>{
                        expect(Tyo.is.fn.anonymousBlank(v)).toBe(true);
                    });
                });
            });
            */
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
                        console.log(`name: ${Tyo.is.fn.s(v)}: ${Tys.name(v)}`); //: ${Object.prototype.toString.call(v)}
                        expect(Tyo.is.fn.s(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{//,[function(){const a=0;}]
                    test.each([[fn]])(`(%p)`, (v)=>{
//                        console.log(`name: ${Tyo.is.fn.s(v)}: ${Tys.name(v)}`); //: ${Object.prototype.toString.call(v)}
                        expect(Tyo.is.fn.s(v)).toBe(true);
                    });
                });
            });
        });
        describe(`md`, ()=>{
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cls.es6, ...cls.es5, ...cls.native])(`(%p)`, (v)=>{
                        expect(Tyo.is.md.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
//                        console.log(`name:`, Tys.name(v));
                        expect(Tyo.is.md.some(v)).toBe(true);
                    });
                });
            });
        });
    });
    /*
    describe(`er`, ()=>{
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: a value that makes 'Tyois.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.some(v));
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(Tyo.er.some(v)).toBe(true);
                });
            });
        });
    });
    */
    describe(`er`, ()=>{
        describe(`some`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([...prims, ...dangers])(`(%p)`, (v)=>{
                    //expect(Tyo.er.some(v)).toBe(false);
                    assertThrow(TypeError, `Expected: a value that makes 'Tyois.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.some(v));
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
        /*
        describe(`obj`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    //expect(Tyo.er.obj(v)).toBe(false);
                    assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.obj.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.obj(v));
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
                test.each([[{}],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    //expect(Tyo.er.ary(v)).toBe(false);
                    assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.ary.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.ary(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[[]],[[1,2,'a']]])(`(%p)`, (v)=>{
                    expect(Tyo.er.ary(v)).toBe(true);
                });
            });
        });
        describe(`cls`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[{}],[[]],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    //expect(Tyo.er.cls(v)).toBe(false);
                    assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.cls.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.cls(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[C],[class{}],[class C{}]])(`(%p)`, (v)=>{
                    expect(Tyo.er.cls(v)).toBe(true);
                });
            });
        });
        describe(`ins`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[{}],[[]],[C],[class{}],[class C{}], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    //expect(Tyo.er.ins(v)).toBe(false);
                    assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.ins.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.ins(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[new C()],[new (class{})],[new (class C{})]])(`(%p)`, (v)=>{
                    expect(Tyo.er.ins(v)).toBe(true);
                });
            });
        });
        describe(`des`, ()=>{
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
//                        expect(Tyo.er.des.some(v)).toBe(false);
                        assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.some.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each(...des.o, ...des.c, ...des.i)(`(%p)`, (v)=>{
                        expect(Tyo.er.des.some(v)).toBe(true);
                    });
                });
            });
            describe(`d`, ()=>{
                describe(`some`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
//                                expect(Tyo.er.des.d.some(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.d.some.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.some(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d.some(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.d.some.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.some(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d.some(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.d.some.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.some(v));
                            });
                        });
                    });
                    describe(`true`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}], [{}, {value(){}}]].map(x=>[getDes(...x)])
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d.some(v)).toBe(true);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.d.some.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.some(v));
                            });
                        });
                    });
                });
                describe(`v`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d.v(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.d.v.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.v(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d.v(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.d.v.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.v(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d.v(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.d.v.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.v(v));
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
                                //expect(Tyo.er.des.d.m(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.d.m.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.m(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            test.each(des.c)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d.m(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.d.m.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.m(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            test.each(des.i)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.d.m(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.d.m.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.d.m(v));
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
                describe(`some`, ()=>{
                    describe(`TypeError`, ()=>{
                        describe(`Obj系`, ()=>{
                            const data = [[{}, {value:0}],[{}, {value(){}}]].map(x=>[getDes(...x)]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.some(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.a.some.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.some(v));
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
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.a.g.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.g(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.g(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.a.g.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.g(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.g(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.a.g.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.g(v));
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
                                //expect(Tyo.er.des.a.s(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.a.s.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.s(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sa'],[C,'sg']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.s(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.a.s.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.s(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'a'],[c,'g']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.s(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.a.s.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.s(v));
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
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.a.a.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.a(v));
                            });
                        });
                        describe(`Cls系`, ()=>{
                            const data = [[C,'sg'],[C,'ss']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.a(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.a.a.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.a(v));
                            });
                        });
                        describe(`Ins系`, ()=>{
                            const data = [[c,'g'],[c,'s']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                            test.each(data)(`(%p)`, (v)=>{
                                //expect(Tyo.er.des.a.a(v)).toBe(false);
                                assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.des.a.a.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.des.a.a(v));
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
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        //expect(Tyo.er.fn.some(v)).toBe(false);
                        assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.fn.some.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        console.log(`name:`, Tys.name(v));
                        expect(Tyo.er.fn.some(v)).toBe(true);
                    });
                });
            });
            describe(`bound`, ()=>{
// fn: [[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}]],
                describe(`TypeError`, ()=>{
                    test.each([...cal.md, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        //expect(Tyo.er.fn.some(v)).toBe(false);
                        assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.fn.bound.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.fn.bound.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.fn])(`(%p)`, (v)=>{
                        console.log(`name:`, Tys.name(v));
                        expect(Tyo.er.fn.some(v)).toBe(true);
                    });
                });
            });
        });
        describe(`md`, ()=>{
            describe(`some`, ()=>{
                describe(`TypeError`, ()=>{
                    test.each([...cal.fn, ...dangers, ...prims, ...des.o, ...des.c, ...des.i])(`(%p)`, (v)=>{
                        //expect(Tyo.er.md.some(v)).toBe(false);
                        assertThrow(TypeError, `Expected: a value that makes '${Tyo.is.md.some.toString()}' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.md.some(v));
                    });
                });
                describe(`true`, ()=>{
                    test.each([...cal.md])(`(%p)`, (v)=>{
                        console.log(`name:`, Tys.name(v));
                        expect(Tyo.er.md.some(v)).toBe(true);
                    });
                });
            });
        });
        */
    });
});

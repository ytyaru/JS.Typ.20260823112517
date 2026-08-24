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
const des = {
    o: [[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]),
    c: [[C,'sg'],[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]),
    i: [[c,'g'],[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]),
};
const cal = {
    fn: [[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}]],
    md: [[C.sm],[C.sgm],[C.sam],[C.sagm],[c.m],[c.gm],[c.am],[c.agm]],
}
//const prims = [[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]];
const prims = [[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]];
const objs = [[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md];
const dangers = [[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create(null)],[new fn()]];
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
            describe(`false`, ()=>{
                test.each([[{}],[[]],[new C()],[new (class{})],[new (class C{})], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(Tyo.is.cls(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[C],[class{}],[class C{}]])(`(%p)`, (v)=>{
                    expect(Tyo.is.cls(v)).toBe(true);
                });
            });
        });
        describe(`ins`, ()=>{
            describe(`false`, ()=>{
                test.each([[{}],[[]],[C],[class{}],[class C{}], ...dangers, ...prims, ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(Tyo.is.ins(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[new C()],[new (class{})],[new (class C{})]])(`(%p)`, (v)=>{
                    expect(Tyo.is.ins(v)).toBe(true);
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

/*
const getDes = (o,d)=>Object.getOwnPropertyDescriptor(Object.defineProperty(o, 'd', d), 'd');
const des = {
    o: [[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]),
    c: [[C,'sg'],[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]),
    i: [[c,'g'],[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]),
};
*/
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
            describe(`false`, ()=>{
            });
            describe(`true`, ()=>{
            });
        });
        describe(`md`, ()=>{
            describe(`false`, ()=>{
            });
            describe(`true`, ()=>{
            });
        });
    });
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
});

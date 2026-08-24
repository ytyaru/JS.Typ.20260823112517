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
const prims = [[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]];
const objs = [[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})], ...des.o, ...des.c, ...des.i, ...cal.fn, ...cal.md];
describe(`Tyo`, ()=>{
    describe(`is`, ()=>{
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                //test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                test.each(prims)(`(%p)`, (v)=>{
                    expect(Tyo.is.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each(objs)(`(%p)`, (v)=>{
                    expect(Tyo.is.some(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    describe(`Obj系`, ()=>{
//                        const getDes = (o,d)=>Object.getOwnPropertyDescriptor(Object.defineProperty(o, 'd', d), 'd');
//                        test.each([[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                        test.each(des.o)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
//                        const data = [[C,'sg'],[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
//                        test.each(data)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));;
                        test.each(des.c)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
//                        const c = new C();
//                        const data = [[c,'g'],[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
//                        test.each(data)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));;
                        test.each(des.i)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    //test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    test.each(cal.fn)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    const c = new C();
                    //test.each([[C.sm],[C.sgm],[C.sam],[C.sagm],[c.m],[c.gm],[c.am],[c.agm]])(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    test.each(cal.md)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                });
            });
        });
        describe(`obj`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Tyo.is.obj(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
            });
        });
        describe(`ary`, ()=>{
            describe(`false`, ()=>{
            });
            describe(`true`, ()=>{
            });
        });
        describe(`cls`, ()=>{
            describe(`false`, ()=>{
            });
            describe(`true`, ()=>{
            });
        });
        describe(`ins`, ()=>{
            describe(`false`, ()=>{
            });
            describe(`true`, ()=>{
            });
        });
        describe(`des`, ()=>{
            describe(`false`, ()=>{
            });
            describe(`true`, ()=>{
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
                test.each(prims)(`(%p)`, (v)=>{
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

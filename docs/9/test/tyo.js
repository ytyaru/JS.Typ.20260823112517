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
class C {}
describe(`Tyo`, ()=>{
    describe(`is`, ()=>{
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Tyo.is.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[{}],[[]],[C],[class{}],[class C{}],[new C()],[new (class{})],[new (class C{})]])(`(%p)`, (v)=>{
                    expect(Tyo.is.some(v)).toBe(true);
                });
                describe(`Descriptor系`, ()=>{
                    /*
                    const getDes = o=>Object.getOwnPropertyDescriptor(o, 'd');
                    test.each([
                        {o:{}, d:{value:0}},
                        {o:{}, d:{value:()=>0}}, 
                        {o:{_d:0}, d:{get(){return this._d}}}, 
                        {o:{_d:0}, d:{set(v){this._d=v;}}}, 
                        {o:{_d:0}, d:{get(){return this._d},set(v){this._d=v;}}}
                    ].map(x=>[getDes(Object.defineProperty(x.o, 'd', x.d))]))(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    */
                    /*
                    const getDes = o=>Object.getOwnPropertyDescriptor(o, 'd');
                    const v = getDes(Object.defineProperty({}, 'd', {value:0}));
                    const m = getDes(Object.defineProperty({}, 'd', {value:()=>0}));
                    const g = getDes(Object.defineProperty({_d:0}, 'd', {get(){return this._d}}));
                    const s = getDes(Object.defineProperty({_d:0}, 'd', {set(v){this._d=v;}}));
                    const a = getDes(Object.defineProperty({_d:0}, 'd', {get(){return this._d}, set(v){this._d=v}}));
                    test.each([[v],[m],[g],[s],[a]])(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    */
                    /*
                    const getDes = (o,d)=>Object.getOwnPropertyDescriptor(Object.defineProperty(o, 'd', d), 'd');
                    const v = getDes({}, {value:0});
                    const m = getDes({}, {value:()=>0});
                    const g = getDes({_d:0}, {get(){return this._d}});
                    const s = getDes({_d:0}, {set(v){this._d=v;}});
                    const a = getDes({_d:0}, {get(){return this._d}, set(v){this._d=v}});
                    test.each([[v],[m],[g],[s],[a]])(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    */
                    /*
                    const getDes = (o,d)=>Object.getOwnPropertyDescriptor(Object.defineProperty(o, 'd', d), 'd');
                    const data = [[{}, {value:0}], [{}, {value:()=>0}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]);
                    test.each(data)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    */
                    /*
                    const getDes = (o,d)=>Object.getOwnPropertyDescriptor(Object.defineProperty(o, 'd', d), 'd');
                    test.each([[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    */
                    const getDes = (o,d)=>Object.getOwnPropertyDescriptor(Object.defineProperty(o, 'd', d), 'd');
                    describe(`Obj系`, ()=>{
                        test.each([[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]))(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        class C {
                            static get sg() {}
                            static set ss(v) {}
                            static get sa() {}
                            static set sa(v) {}
                        }
                        const data = [[C,'sg'],[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]);
                        test.each(data)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));;
                    });
                    describe(`Ins系`, ()=>{
                        class C {
                            get g() {}
                            set s(v) {}
                            get a() {}
                            set a(v) {}
                        }
                        const c = new C();
                        const data = [[c,'g'],[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]);
                        test.each(data)(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));;
                     });
                });
                describe(`Fn系`, ()=>{
                    function fn(){}
                    function *gfn(){}
                    async function afn(){}
                    async function *agfn(){}
                    const arrFn = ()=>{};
                    const aarrFn = async()=>{};
//                    expect(Tyo.is.some(v)).toBe(true);
//                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}],[C.sm],[C.sgm],[C.sam],[C.sagm],[c.m],[c.gm],[c.am],[c.agm]])(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                    test.each([[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}]])(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                });
                describe(`Method系`, ()=>{
                    class C {
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
                    test.each([[C.sm],[C.sgm],[C.sam],[C.sagm],[c.m],[c.gm],[c.am],[c.agm]])(`(%p)`, (v)=>expect(Tyo.is.some(v)).toBe(true));
                });
            });
        });
    });
    describe(`er`, ()=>{
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: a value that makes 'Tyois.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyo.er.some(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[{}],[[]],[C],[class{}],[class C{}]])(`(%p)`, (v)=>{
                    expect(Tyo.er.some(v)).toBe(true);
                });
            });
        });
    });
});

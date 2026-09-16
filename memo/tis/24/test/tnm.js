import { expect, test, describe } from "bun:test";
import {tnm} from '../src/tnm.js';
//import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from './test-data-type.js';
import {C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from './test-data-type.js';
/**
 * 指定した関数を実行し、期待する例外型とメッセージが完全に一致してスローされるか検証する
 * @param fn 検証対象の関数
 * @param expectedErrorClass 期待する例外のコンストラクタ（例: TypeError, CustomError など）
 * @param expectedMessage 期待する完全一致のエラーメッセージ
 */
function assertThrow(Err, msg, fn) {
    let err = null;
    try {fn();} catch (error) {err = error;}
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Err);
    expect(err.message).toBe(msg);
}
describe(`tnm`, ()=>{
    describe(`正常系`, ()=>{
        test('空',()=>expect(tnm()).toBe('Undefined'));
        test('undefined',()=>expect(tnm(undefined)).toBe('Undefined'));
        test('null',()=>expect(tnm(null)).toBe('Null'));
        test('Array',()=>expect(tnm([])).toBe('Array'));
        describe(`Number系`, ()=>{
            test('NaN',()=>expect(tnm(NaN)).toBe('NaN'));
            test('Infinity',()=>expect(tnm(Infinity)).toBe('Infinity'));
            test('-Infinity',()=>expect(tnm(-Infinity)).toBe('-Infinity'));
            test('Integer(0)',()=>expect(tnm(0)).toBe('Integer'));
            test('Integer(MAX)',()=>expect(tnm(Number.MAX_SAFE_INTEGER)).toBe('Integer'));
            test('Integer(MIN)',()=>expect(tnm(Number.MIN_SAFE_INTEGER)).toBe('Integer'));
            test('Finite(MAX+1)',()=>expect(tnm(Number.MAX_SAFE_INTEGER+1)).toBe('Finite'));
            test('Finite(MIN-1)',()=>expect(tnm(Number.MIN_SAFE_INTEGER-1)).toBe('Finite'));
            test('Finite(0.1)',()=>expect(tnm(0.1)).toBe('Finite'));
            test('Finite(-0.1)',()=>expect(tnm(-0.1)).toBe('Finite'));

        });
        describe(`Object系`, ()=>{
            test('NonePrototypeObject',()=>expect(tnm(Object.create(null))).toBe('NonePrototypeObject'));
            test('PlainObject',()=>expect(tnm({})).toBe('PlainObject'));
            describe(`PrototypedObject系`, ()=>{
                test('Object.create({})',()=>expect(tnm(Object.create({}))).toBe('PrototypedObject'));
            });
            describe(`組込疑似クラスインスタンス系`, ()=>{
                test('(new Map())',()=>expect(tnm(new Map())).toBe('NativeInstance<Map>'));
                test('(new Uint8Array())',()=>expect(tnm(new Uint8Array())).toBe('NativeInstance<Uint8Array>'));
            });
            describe(`ES5疑似クラスインスタンス`, ()=>{//FunctionInstance
                function MyEs5Cls(){}
                test('new (function Es5Cls(){})',()=>expect(tnm(new MyEs5Cls())).toBe('ES5.Instance<MyEs5Cls>'));
            });
            // 意地悪テストケース
            describe(`匿名ES5疑似クラスインスタンス`, ()=>{//FunctionInstance
                const AnonymousCtor = function() {};
                Object.defineProperty(AnonymousCtor, 'name', { value: '' }); // 名前を消す
                const obj = new AnonymousCtor();
                test('new (function(){})',()=>expect(tnm(obj)).toBe('ES5.Instance<(Anonymous)>'));
            });
            // 意地悪テストケース
            describe(`コンストラクタ無し匿名関数オブジェクト`, ()=>{
                const obj = Object.create(function() {});
                test('Object.create(function() {})',()=>expect(tnm(obj)).toBe('PrototypedObject'));
            });
            describe(`BoxedPrimitive系`, ()=>{
                test('Boolean',()=>expect(tnm(new Boolean())).toBe('BoxedPrimitive<Boolean>'));
                test('Number',()=>expect(tnm(new Number())).toBe('BoxedPrimitive<Number>'));
                test('String',()=>expect(tnm(new String())).toBe('BoxedPrimitive<String>'));
            });
            describe(`Descriptor系`, ()=>{
                /*
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
                */
//                    const getDes = o=>Object.getOwnPropertyDescriptor(o, 'd');
                const getDes = (o,d)=>Object.getOwnPropertyDescriptor(Object.defineProperty(o, 'd', d), 'd');
                const des = {
                    o: [[{}, {value:0}], [{}, {value(){}}], [{_d:0}, {get(){return this._d}}], [{_d:0}, {set(v){this._d=v;}}], [{_d:0}, {get(){return this._d}, set(v){this._d=v}}]].map(x=>[getDes(...x)]),
                    c: [[C,'sg'],[C,'ss'],[C,'sa']].map(x=>[Object.getOwnPropertyDescriptor(x[0], x[1])]),
                    i: [[c,'g'],[c,'s'],[c,'a']].map(x=>[Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x[0]), x[1])]),
                };
                function fn(){}
                function *gfn(){}
                async function afn(){}
                async function *agfn(){}
                const arrFn = ()=>{};
                const aarrFn = async()=>{};
                const cal = {
                    fn: [[fn],[gfn],[afn],[agfn],[arrFn],[aarrFn],[function(){}],[function*(){}],[async function(){}],[async function*(){}],[()=>{}],[async()=>{}]],
                    md: [[C.sm],[C.sgm],[C.sam],[C.sagm],[c.m],[c.gm],[c.am],[c.agm]],
                }
                describe(`Obj系`, ()=>{
                    const getDes = o=>Object.getOwnPropertyDescriptor(o, 'd');
                    const v = getDes(Object.defineProperty({}, 'd', {value:0}));
                    const m = getDes(Object.defineProperty({}, 'd', {value(){}}));
                    const g = getDes(Object.defineProperty({_d:0}, 'd', {get(){return this._d}}));
                    const s = getDes(Object.defineProperty({_d:0}, 'd', {set(v){this._d=v;}}));
                    const a = getDes(Object.defineProperty({_d:0}, 'd', {get(){return this._d}, set(v){this._d=v}}));
//                        test('Value',()=>expect(tnm(v)).toBe('Descriptor.Data.Value'));
//                        test('Method',()=>expect(tnm(m)).toBe('Descriptor.Data.Method'));
//                        test('Getter',()=>expect(tnm(g)).toBe('Descriptor.Access.Get'));
//                        test('Setter',()=>expect(tnm(s)).toBe('Descriptor.Access.Set'));
//                        test('Accessor',()=>expect(tnm(a)).toBe('Descriptor.Access.GetSet'));
                    test('Value',()=>expect(tnm(v)).toBe('Descriptor<Value>'));
                    test('Method',()=>expect(tnm(m)).toBe('Descriptor<Method>'));
                    test('Getter',()=>expect(tnm(g)).toBe('Descriptor<Getter>'));
                    test('Setter',()=>expect(tnm(s)).toBe('Descriptor<Setter>'));
                    test('Accessor',()=>expect(tnm(a)).toBe('Descriptor<Accessor>'));
                });
//                    const PTN = /^Descriptor\.(Data|Access)\.(Value|Method|Get|Set|GetSet)/;
                //const PTN = /^(Descriptor.Data.\.(Value|Method)|Descriptor.Data.Access)\.(Get|Set|GetSet))$/;
                describe(`Obj系`, ()=>{
                    test.each(des.o)(`(%p)`, (v)=>expect(tnm(v).startsWith('Descriptor<')).toBe(true));
//                        test.each(des.o)(`(%p)`, (v)=>expect(PTN.test(tnm(v))).toBe(true));
                });
                describe(`Cls系`, ()=>{
                    test.each(des.c)(`(%p)`, (v)=>expect(tnm(v).startsWith('Descriptor<')).toBe(true));
//                        test.each(des.c)(`(%p)`, (v)=>expect(PTN.test(tnm(v))).toBe(true));
                });
                describe(`Ins系`, ()=>{
                    test.each(des.i)(`(%p)`, (v)=>expect(tnm(v).startsWith('Descriptor<')).toBe(true));
//                        test.each(des.i)(`(%p)`, (v)=>expect(PTN.test(tnm(v))).toBe(true));
                });
            });
            describe(`ES6クラスインスタンス系`, ()=>{
                class MyClass {}
                test('MyClass',()=>expect(tnm(new MyClass())).toBe('Instance<MyClass>'));
//                    test('MyClass',()=>expect(tnm(new MyClass())).toBe('ES6.Instance<MyClass>'));
            });
            describe(`匿名ES6クラスインスタンス系`, ()=>{
                test('new (class {})',()=>expect(tnm(new (class {}))).toBe('Instance<(Anonymous)>'));
//                    test('new (class {})',()=>expect(tnm(new (class {}))).toBe('ES6.Instance<(Anonymous)>'));
            });
        });
        describe(`Function系`, ()=>{
            describe(`ES6クラス系`, ()=>{
                class MyClass {}
                test('MyClass',()=>expect(tnm(MyClass)).toBe('Class<MyClass>'));
//                    test('MyClass',()=>expect(tnm(MyClass)).toBe('ES6.Class<MyClass>'));
            });
            describe(`匿名ES6クラス系`, ()=>{
                test('class{}',()=>expect(tnm(class{})).toBe('Class<(Anonymous)>'));
//                    test('class{}',()=>expect(tnm(class{})).toBe('ES6.Class<(Anonymous)>'));
            });
            describe(`ES5疑似クラス系`, ()=>{
                function MyEs5Cls(){}
                test('MyEs5Cls',()=>expect(tnm(MyEs5Cls)).toBe('ES5.Class<MyEs5Cls>'));
            });
            describe(`匿名ES5疑似クラス系`, ()=>{
                test('function(){this.x=0;}',()=>expect(tnm(function(){this.x=0;})).toBe('ES5.Class<(Anonymous)>'));
                test('function(){this.m=()=>{};}',()=>expect(tnm(function(){this.m=()=>{};})).toBe('ES5.Class<(Anonymous)>'));
            });
            describe(`匿名関数(匿名関数／匿名ES5疑似クラスの区別不能)`, ()=>{
                //test('function(){}',()=>expect(tnm(function(){})).toBe('AnonymousBlankFunction'));
                test('function(){}',()=>expect(tnm(function(){})).toBe('AnonymousFunction'));
                test('function(){/**/}',()=>expect(tnm(function(){/**/})).toBe('AnonymousFunction'));
                test('function(){let a=0;}',()=>expect(tnm(function(){let a=0;})).toBe('AnonymousFunction'));
                test('function(){/*this.x=0*/}',()=>expect(tnm(function(){/*this.x=0*/})).toBe('AnonymousFunction'));
                test('function(){\\n// this.x=0\\n}',()=>expect(tnm(function(){
// this.x=0
})).toBe('AnonymousFunction'));
                test("function(){'this.x=0'}",()=>expect(tnm(function(){'this.x=0'})).toBe('AnonymousFunction'));
                test('function(){"this.x=0"}',()=>expect(tnm(function(){"this.x=0"})).toBe('AnonymousFunction'));
                test('function(){`this.x=0`}',()=>expect(tnm(function(){`this.x=0`})).toBe('AnonymousFunction'));
                test('function(){/this.x=0/}',()=>expect(tnm(function(){/this.x=0/})).toBe('AnonymousFunction'));
                test('function(){`${this.x=0}`}',()=>expect(tnm(function(){`${this.x=0}`})).toBe('AnonymousFunction'));
                test('function(){`${this.x=0}`等全部載せ}',()=>expect(tnm(function(){
                    let a=0;
                    /*this.x=0*/
                    // this.x=0
                    'this.x=0';
                    "this.x=0";
                    `this.x=0`;
                    /this.x=0/;
                    `${this.x=0}`;
                })).toBe('AnonymousFunction'));
            });
            describe(`組込疑似クラス系`, ()=>{
                test('Map',()=>expect(tnm(Map)).toBe('NativeClass<Map>'));
                test('Uint8Array',()=>expect(tnm(Uint8Array)).toBe('NativeClass<Uint8Array>'));
            });
            describe(`組込関数系`, ()=>{
                test('[].map',()=>expect(tnm([].map)).toBe('NativeFunction<map>'));
                test("''.toLowerCase",()=>expect(tnm(''.toLowerCase)).toBe('NativeFunction<toLowerCase>'));
            });
            describe(`Bound系`, ()=>{
                function fn(){}
                test('fn.bind(null)',()=>expect(tnm(fn.bind(null))).toBe('BoundFunction<fn>'));
            });
            describe(`Arrow系`, ()=>{
                const named = ()=>{};
                const aNamed = async()=>{};
                test('named',()=>expect(tnm(named)).toBe('ArrowFunction'));
                test('no-named',()=>expect(tnm(()=>{})).toBe('ArrowFunction'));
                test('async named',()=>expect(tnm(aNamed)).toBe('AsyncArrowFunction'));
                test('async no-named',()=>expect(tnm(async()=>{})).toBe('AsyncArrowFunction'));
            });
            describe(`Method系`, ()=>{
                class MyClass {
                    im(){}
                    static sm() {}
                    async aim() {}
                    *gim() {}
                    async *agim() {}
                }
                const ins = new MyClass();
                test('Instance',()=>expect(tnm(ins.im)).toBe('Method'));
                test('AsyncInstance',()=>expect(tnm(ins.aim)).toBe('AsyncMethod'));
                test('GeneratorInstance',()=>expect(tnm(ins.gim)).toBe('GeneratorMethod'));
                test('AsyncGeneratorInstance',()=>expect(tnm(ins.agim)).toBe('AsyncGeneratorMethod'));
                test('Static',()=>expect(tnm(MyClass.sm)).toBe('Method'));
            });
            describe(`通常系`, ()=>{
                function myFn(){}
                function *GFn(){}
                async function AFn(){}
                async function *AGFn(){}
                test('function myFn(){}',()=>expect(tnm(myFn)).toBe('Function'));
                test('function *GFn(){}',()=>expect(tnm(GFn)).toBe('GeneratorFunction'));
                test('async function AFn(){}',()=>expect(tnm(AFn)).toBe('AsyncFunction'));
                test('async function *AGFn(){}',()=>expect(tnm(AGFn)).toBe('AsyncGeneratorFunction'));
            });
            describe(`匿名Async/Generator系(通常系と同じ。Anonymousは付かない)`, ()=>{
                test('function*(){/*this.x=0*/}',()=>expect(tnm(function*(){/*this.x=0*/})).toBe('GeneratorFunction'));
                test('async function(){/*this.x=0*/}',()=>expect(tnm(async function(){/*this.x=0*/})).toBe('AsyncFunction'));
                test('async function*(){/*this.x=0*/}',()=>expect(tnm(async function*(){/*this.x=0*/})).toBe('AsyncGeneratorFunction'));
            });
        });
    });
});

import { expect, test, describe } from "bun:test";
import {Tys} from '../src/tys.js';
/**
 * 指定した関数を実行し、期待する例外型とメッセージが完全に一致してスローされるか検証する
 * @param fn 検証対象の関数
 * @param expectedErrorClass 期待する例外のコンストラクタ（例: TyseError, CustomError など）
 * @param expectedMessage 期待する完全一致のエラーメッセージ
 */
function assertThrow(Err, msg, fn) {
    let err = null;
    try {fn();} catch (error) {err = error;}
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Err);
    expect(err.message).toBe(msg);
}
describe(`Tys`, ()=>{
    describe(`name`, ()=>{
        describe(`正常系`, ()=>{
            test('空',()=>expect(Tys.name()).toBe('Undefined'));
            test('undefined',()=>expect(Tys.name(undefined)).toBe('Undefined'));
            test('null',()=>expect(Tys.name(null)).toBe('Null'));
            test('Array',()=>expect(Tys.name([])).toBe('Array'));
            describe(`Number系`, ()=>{
                test('NaN',()=>expect(Tys.name(NaN)).toBe('NaN'));
                test('Infinity',()=>expect(Tys.name(Infinity)).toBe('Infinity'));
                test('-Infinity',()=>expect(Tys.name(-Infinity)).toBe('-Infinity'));
                test('Integer(0)',()=>expect(Tys.name(0)).toBe('Integer'));
                test('Integer(MAX)',()=>expect(Tys.name(Number.MAX_SAFE_INTEGER)).toBe('Integer'));
                test('Integer(MIN)',()=>expect(Tys.name(Number.MIN_SAFE_INTEGER)).toBe('Integer'));
                test('Finite(MAX+1)',()=>expect(Tys.name(Number.MAX_SAFE_INTEGER+1)).toBe('Finite'));
                test('Finite(MIN-1)',()=>expect(Tys.name(Number.MIN_SAFE_INTEGER-1)).toBe('Finite'));
                test('Finite(0.1)',()=>expect(Tys.name(0.1)).toBe('Finite'));
                test('Finite(-0.1)',()=>expect(Tys.name(-0.1)).toBe('Finite'));

            });
            describe(`Object系`, ()=>{
                test('HasNotPrototypeObject',()=>expect(Tys.name(Object.create(null))).toBe('HasNotPrototypeObject'));
                test('PlainObject',()=>expect(Tys.name({})).toBe('PlainObject'));
                describe(`PrototypedObject系`, ()=>{
                    test('Object.create({})',()=>expect(Tys.name(Object.create({}))).toBe('PrototypedObject'));
                });
                describe(`組込疑似クラスインスタンス系`, ()=>{
                    test('(new Map())',()=>expect(Tys.name(new Map())).toBe('NativeInstance<Map>'));
                    test('(new Uint8Array())',()=>expect(Tys.name(new Uint8Array())).toBe('NativeInstance<Uint8Array>'));
//                    test('(new Map())',()=>expect(Tys.name(new Map())).toBe('NativeObject<Map>'));
//                    test('(new Uint8Array())',()=>expect(Tys.name(new Uint8Array())).toBe('NativeObject<Uint8Array>'));
//                    test('(new Map())',()=>expect(Tys.name(new Map())).toBe('BuiltinObject<Map>'));
//                    test('(new Uint8Array())',()=>expect(Tys.name(new Uint8Array())).toBe('BuiltinObject<Uint8Array>'));
                });
                describe(`ES5疑似クラスインスタンス`, ()=>{//FunctionInstance
                    function MyEs5Cls(){}
                    test('new (function Es5Cls(){})',()=>expect(Tys.name(new MyEs5Cls())).toBe('ES5.Instance<MyEs5Cls>'));
                });
                // 意地悪テストケース
                describe(`匿名ES5疑似クラスインスタンス`, ()=>{//FunctionInstance
                    const AnonymousCtor = function() {};
                    Object.defineProperty(AnonymousCtor, 'name', { value: '' }); // 名前を消す
                    const obj = new AnonymousCtor();
                    test('new (function(){})',()=>expect(Tys.name(obj)).toBe('ES5.Instance<(Anonymous)>'));
                });
                // 意地悪テストケース
                describe(`コンストラクタ無し匿名関数オブジェクト`, ()=>{
                    const obj = Object.create(function() {});
                    test('Object.create(function() {})',()=>expect(Tys.name(obj)).toBe('PrototypedObject'));
                });
                describe(`BoxedPrimitive系`, ()=>{
                    test('Boolean',()=>expect(Tys.name(new Boolean())).toBe('BoxedPrimitive<Boolean>'));
                    test('Number',()=>expect(Tys.name(new Number())).toBe('BoxedPrimitive<Number>'));
                    test('String',()=>expect(Tys.name(new String())).toBe('BoxedPrimitive<String>'));
                });
                describe(`Descriptor系`, ()=>{
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
                        test('Value',()=>expect(Tys.name(v)).toBe('Descriptor<Value>'));
                        test('Method',()=>expect(Tys.name(m)).toBe('Descriptor<Method>'));
                        test('Getter',()=>expect(Tys.name(g)).toBe('Descriptor<Getter>'));
                        test('Setter',()=>expect(Tys.name(s)).toBe('Descriptor<Setter>'));
                        test('Accessor',()=>expect(Tys.name(a)).toBe('Descriptor<Accessor>'));
                    });
                    describe(`Obj系`, ()=>{
                        test.each(des.o)(`(%p)`, (v)=>expect(Tys.name(v).startsWith('Descriptor<')).toBe(true));
                    });
                    describe(`Cls系`, ()=>{
                        test.each(des.c)(`(%p)`, (v)=>expect(Tys.name(v).startsWith('Descriptor<')).toBe(true));
                    });
                    describe(`Ins系`, ()=>{
                        test.each(des.i)(`(%p)`, (v)=>expect(Tys.name(v).startsWith('Descriptor<')).toBe(true));
                    });
                });
                describe(`ES6クラスインスタンス系`, ()=>{
                    class MyClass {}
                    test('MyClass',()=>expect(Tys.name(new MyClass())).toBe('Instance<MyClass>'));
                });
                describe(`匿名ES6クラスインスタンス系`, ()=>{
                    test('new (class {})',()=>expect(Tys.name(new (class {}))).toBe('Instance<(Anonymous)>'));
                });
            });
            describe(`Function系`, ()=>{
                describe(`ES6クラス系`, ()=>{
                    class MyClass {}
                    test('MyClass',()=>expect(Tys.name(MyClass)).toBe('Class<MyClass>'));
                });
                describe(`匿名ES6クラス系`, ()=>{
                    test('class{}',()=>expect(Tys.name(class{})).toBe('Class<(Anonymous)>'));
                });
                describe(`ES5疑似クラス系`, ()=>{
                    function MyEs5Cls(){}
                    test('MyEs5Cls',()=>expect(Tys.name(MyEs5Cls)).toBe('ES5.Class<MyEs5Cls>'));
                });
                describe(`匿名ES5疑似クラス系`, ()=>{
                    test('function(){this.x=0;}',()=>expect(Tys.name(function(){this.x=0;})).toBe('ES5.Class<(Anonymous)>'));
                    test('function(){this.m=()=>{};}',()=>expect(Tys.name(function(){this.m=()=>{};})).toBe('ES5.Class<(Anonymous)>'));
                });
                describe(`匿名関数(匿名関数／匿名ES5疑似クラスの区別不能)`, ()=>{
                    //test('function(){}',()=>expect(Tys.name(function(){})).toBe('AnonymousBlankFunction'));
                    test('function(){}',()=>expect(Tys.name(function(){})).toBe('AnonymousFunction'));
                    test('function(){/**/}',()=>expect(Tys.name(function(){/**/})).toBe('AnonymousFunction'));
                    test('function(){let a=0;}',()=>expect(Tys.name(function(){let a=0;})).toBe('AnonymousFunction'));
                    test('function(){/*this.x=0*/}',()=>expect(Tys.name(function(){/*this.x=0*/})).toBe('AnonymousFunction'));
                    test('function(){\\n// this.x=0\\n}',()=>expect(Tys.name(function(){
// this.x=0
})).toBe('AnonymousFunction'));
                    test("function(){'this.x=0'}",()=>expect(Tys.name(function(){'this.x=0'})).toBe('AnonymousFunction'));
                    test('function(){"this.x=0"}',()=>expect(Tys.name(function(){"this.x=0"})).toBe('AnonymousFunction'));
                    test('function(){`this.x=0`}',()=>expect(Tys.name(function(){`this.x=0`})).toBe('AnonymousFunction'));
                    test('function(){/this.x=0/}',()=>expect(Tys.name(function(){/this.x=0/})).toBe('AnonymousFunction'));
                    test('function(){`${this.x=0}`}',()=>expect(Tys.name(function(){`${this.x=0}`})).toBe('AnonymousFunction'));
                    test('function(){`${this.x=0}`等全部載せ}',()=>expect(Tys.name(function(){
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
                    test('Map',()=>expect(Tys.name(Map)).toBe('NativeClass<Map>'));
                    test('Uint8Array',()=>expect(Tys.name(Uint8Array)).toBe('NativeClass<Uint8Array>'));
                });
                describe(`組込関数系`, ()=>{
                    test('[].map',()=>expect(Tys.name([].map)).toBe('NativeFunction<map>'));
                    test("''.toLowerCase",()=>expect(Tys.name(''.toLowerCase)).toBe('NativeFunction<toLowerCase>'));
                });
                describe(`Bound系`, ()=>{
                    function fn(){}
                    test('fn.bind(null)',()=>expect(Tys.name(fn.bind(null))).toBe('BoundFunction<fn>'));
                });
                describe(`Arrow系`, ()=>{
                    const named = ()=>{};
                    const aNamed = async()=>{};
                    test('named',()=>expect(Tys.name(named)).toBe('ArrowFunction'));
                    test('no-named',()=>expect(Tys.name(()=>{})).toBe('ArrowFunction'));
                    test('async named',()=>expect(Tys.name(aNamed)).toBe('AsyncArrowFunction'));
                    test('async no-named',()=>expect(Tys.name(async()=>{})).toBe('AsyncArrowFunction'));
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
                    test('Instance',()=>expect(Tys.name(ins.im)).toBe('Method'));
                    test('AsyncInstance',()=>expect(Tys.name(ins.aim)).toBe('AsyncMethod'));
                    test('GeneratorInstance',()=>expect(Tys.name(ins.gim)).toBe('GeneratorMethod'));
                    test('AsyncGeneratorInstance',()=>expect(Tys.name(ins.agim)).toBe('AsyncGeneratorMethod'));
                    test('Static',()=>expect(Tys.name(MyClass.sm)).toBe('Method'));
                });
                describe(`通常系`, ()=>{
                    function myFn(){}
                    function *GFn(){}
                    async function AFn(){}
                    async function *AGFn(){}
                    test('function myFn(){}',()=>expect(Tys.name(myFn)).toBe('Function'));
                    test('function *GFn(){}',()=>expect(Tys.name(GFn)).toBe('GeneratorFunction'));
                    test('async function AFn(){}',()=>expect(Tys.name(AFn)).toBe('AsyncFunction'));
                    test('async function *AGFn(){}',()=>expect(Tys.name(AGFn)).toBe('AsyncGeneratorFunction'));
                });
                describe(`匿名Async/Generator系(通常系と同じ。Anonymousは付かない)`, ()=>{
                    test('function*(){/*this.x=0*/}',()=>expect(Tys.name(function*(){/*this.x=0*/})).toBe('GeneratorFunction'));
                    test('async function(){/*this.x=0*/}',()=>expect(Tys.name(async function(){/*this.x=0*/})).toBe('AsyncFunction'));
                    test('async function*(){/*this.x=0*/}',()=>expect(Tys.name(async function*(){/*this.x=0*/})).toBe('AsyncGeneratorFunction'));
                });
            });
        });
    });
});

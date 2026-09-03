import { expect, test, describe } from "bun:test";
//import {Typ} from '../src/typ.js';
import {tof} from '../src/tof.js';
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from './test-data.js';
describe(`tof`, ()=>{
    describe(`正常系`, ()=>{
        test('空',()=>expect(tof()).toBe('Undefined'));
        test('undefined',()=>expect(tof(undefined)).toBe('Undefined'));
        test('null',()=>expect(tof(null)).toBe('Null'));
        test('Array',()=>expect(tof([])).toBe('Array'));
        describe(`Number系`, ()=>{
            test('NaN',()=>expect(tof(NaN)).toBe('NaN'));
            test('Infinity',()=>expect(tof(Infinity)).toBe('Infinity'));
            test('-Infinity',()=>expect(tof(-Infinity)).toBe('-Infinity'));
            test('Integer(0)',()=>expect(tof(0)).toBe('Integer'));
            test('Integer(MAX)',()=>expect(tof(Number.MAX_SAFE_INTEGER)).toBe('Integer'));
            test('Integer(MIN)',()=>expect(tof(Number.MIN_SAFE_INTEGER)).toBe('Integer'));
            test('Finite(MAX+1)',()=>expect(tof(Number.MAX_SAFE_INTEGER+1)).toBe('Finite'));
            test('Finite(MIN-1)',()=>expect(tof(Number.MIN_SAFE_INTEGER-1)).toBe('Finite'));
            test('Finite(0.1)',()=>expect(tof(0.1)).toBe('Finite'));
            test('Finite(-0.1)',()=>expect(tof(-0.1)).toBe('Finite'));

        });
        describe(`Object系`, ()=>{
            test('HasNotPrototypeObject',()=>expect(tof(Object.create(null))).toBe('HasNotPrototypeObject'));
            test('PlainObject',()=>expect(tof({})).toBe('PlainObject'));
            describe(`PrototypedObject系`, ()=>{
                test('Object.create({})',()=>expect(tof(Object.create({}))).toBe('PrototypedObject'));
            });
            describe(`組込疑似クラスインスタンス系`, ()=>{
                test('(new Map())',()=>expect(tof(new Map())).toBe('NativeInstance<Map>'));
                test('(new Uint8Array())',()=>expect(tof(new Uint8Array())).toBe('NativeInstance<Uint8Array>'));
//                    test('(new Map())',()=>expect(tof(new Map())).toBe('NativeObject<Map>'));
//                    test('(new Uint8Array())',()=>expect(tof(new Uint8Array())).toBe('NativeObject<Uint8Array>'));
//                    test('(new Map())',()=>expect(tof(new Map())).toBe('BuiltinObject<Map>'));
//                    test('(new Uint8Array())',()=>expect(tof(new Uint8Array())).toBe('BuiltinObject<Uint8Array>'));
            });
            describe(`ES5疑似クラスインスタンス`, ()=>{//FunctionInstance
                function MyEs5Cls(){}
                test('new (function Es5Cls(){})',()=>expect(tof(new MyEs5Cls())).toBe('ES5.Instance<MyEs5Cls>'));
            });
            // 意地悪テストケース
            describe(`匿名ES5疑似クラスインスタンス`, ()=>{//FunctionInstance
                const AnonymousCtor = function() {};
                Object.defineProperty(AnonymousCtor, 'name', { value: '' }); // 名前を消す
                const obj = new AnonymousCtor();
                test('new (function(){})',()=>expect(tof(obj)).toBe('ES5.Instance<(Anonymous)>'));
            });
            // 意地悪テストケース
            describe(`コンストラクタ無し匿名関数オブジェクト`, ()=>{
                const obj = Object.create(function() {});
                test('Object.create(function() {})',()=>expect(tof(obj)).toBe('PrototypedObject'));
            });
            describe(`BoxedPrimitive系`, ()=>{
                test('Boolean',()=>expect(tof(new Boolean())).toBe('BoxedPrimitive<Boolean>'));
                test('Number',()=>expect(tof(new Number())).toBe('BoxedPrimitive<Number>'));
                test('String',()=>expect(tof(new String())).toBe('BoxedPrimitive<String>'));
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
                    test('Value',()=>expect(tof(v)).toBe('Descriptor<Value>'));
                    test('Method',()=>expect(tof(m)).toBe('Descriptor<Method>'));
                    test('Getter',()=>expect(tof(g)).toBe('Descriptor<Getter>'));
                    test('Setter',()=>expect(tof(s)).toBe('Descriptor<Setter>'));
                    test('Accessor',()=>expect(tof(a)).toBe('Descriptor<Accessor>'));
                });
                describe(`Obj系`, ()=>{
                    test.each(des.o)(`(%p)`, (v)=>expect(tof(v).startsWith('Descriptor<')).toBe(true));
                });
                describe(`Cls系`, ()=>{
                    test.each(des.c)(`(%p)`, (v)=>expect(tof(v).startsWith('Descriptor<')).toBe(true));
                });
                describe(`Ins系`, ()=>{
                    test.each(des.i)(`(%p)`, (v)=>expect(tof(v).startsWith('Descriptor<')).toBe(true));
                });
            });
            describe(`ES6クラスインスタンス系`, ()=>{
                class MyClass {}
                test('MyClass',()=>expect(tof(new MyClass())).toBe('Instance<MyClass>'));
            });
            describe(`匿名ES6クラスインスタンス系`, ()=>{
                test('new (class {})',()=>expect(tof(new (class {}))).toBe('Instance<(Anonymous)>'));
            });
        });
        describe(`Function系`, ()=>{
            describe(`ES6クラス系`, ()=>{
                class MyClass {}
                test('MyClass',()=>expect(tof(MyClass)).toBe('Class<MyClass>'));
            });
            describe(`匿名ES6クラス系`, ()=>{
                test('class{}',()=>expect(tof(class{})).toBe('Class<(Anonymous)>'));
            });
            describe(`ES5疑似クラス系`, ()=>{
                function MyEs5Cls(){}
                test('MyEs5Cls',()=>expect(tof(MyEs5Cls)).toBe('ES5.Class<MyEs5Cls>'));
            });
            describe(`匿名ES5疑似クラス系`, ()=>{
                test('function(){this.x=0;}',()=>expect(tof(function(){this.x=0;})).toBe('ES5.Class<(Anonymous)>'));
                test('function(){this.m=()=>{};}',()=>expect(tof(function(){this.m=()=>{};})).toBe('ES5.Class<(Anonymous)>'));
            });
            describe(`匿名関数(匿名関数／匿名ES5疑似クラスの区別不能)`, ()=>{
                //test('function(){}',()=>expect(tof(function(){})).toBe('AnonymousBlankFunction'));
                test('function(){}',()=>expect(tof(function(){})).toBe('AnonymousFunction'));
                test('function(){/**/}',()=>expect(tof(function(){/**/})).toBe('AnonymousFunction'));
                test('function(){let a=0;}',()=>expect(tof(function(){let a=0;})).toBe('AnonymousFunction'));
                test('function(){/*this.x=0*/}',()=>expect(tof(function(){/*this.x=0*/})).toBe('AnonymousFunction'));
                test('function(){\\n// this.x=0\\n}',()=>expect(tof(function(){
// this.x=0
})).toBe('AnonymousFunction'));
                test("function(){'this.x=0'}",()=>expect(tof(function(){'this.x=0'})).toBe('AnonymousFunction'));
                test('function(){"this.x=0"}',()=>expect(tof(function(){"this.x=0"})).toBe('AnonymousFunction'));
                test('function(){`this.x=0`}',()=>expect(tof(function(){`this.x=0`})).toBe('AnonymousFunction'));
                test('function(){/this.x=0/}',()=>expect(tof(function(){/this.x=0/})).toBe('AnonymousFunction'));
                test('function(){`${this.x=0}`}',()=>expect(tof(function(){`${this.x=0}`})).toBe('AnonymousFunction'));
                test('function(){`${this.x=0}`等全部載せ}',()=>expect(tof(function(){
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
                test('Map',()=>expect(tof(Map)).toBe('NativeClass<Map>'));
                test('Uint8Array',()=>expect(tof(Uint8Array)).toBe('NativeClass<Uint8Array>'));
            });
            describe(`組込関数系`, ()=>{
                test('[].map',()=>expect(tof([].map)).toBe('NativeFunction<map>'));
                test("''.toLowerCase",()=>expect(tof(''.toLowerCase)).toBe('NativeFunction<toLowerCase>'));
            });
            describe(`Bound系`, ()=>{
                function fn(){}
                test('fn.bind(null)',()=>expect(tof(fn.bind(null))).toBe('BoundFunction<fn>'));
            });
            describe(`Arrow系`, ()=>{
                const named = ()=>{};
                const aNamed = async()=>{};
                test('named',()=>expect(tof(named)).toBe('ArrowFunction'));
                test('no-named',()=>expect(tof(()=>{})).toBe('ArrowFunction'));
                test('async named',()=>expect(tof(aNamed)).toBe('AsyncArrowFunction'));
                test('async no-named',()=>expect(tof(async()=>{})).toBe('AsyncArrowFunction'));
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
                test('Instance',()=>expect(tof(ins.im)).toBe('Method'));
                test('AsyncInstance',()=>expect(tof(ins.aim)).toBe('AsyncMethod'));
                test('GeneratorInstance',()=>expect(tof(ins.gim)).toBe('GeneratorMethod'));
                test('AsyncGeneratorInstance',()=>expect(tof(ins.agim)).toBe('AsyncGeneratorMethod'));
                test('Static',()=>expect(tof(MyClass.sm)).toBe('Method'));
            });
            describe(`通常系`, ()=>{
                function myFn(){}
                function *GFn(){}
                async function AFn(){}
                async function *AGFn(){}
                test('function myFn(){}',()=>expect(tof(myFn)).toBe('Function'));
                test('function *GFn(){}',()=>expect(tof(GFn)).toBe('GeneratorFunction'));
                test('async function AFn(){}',()=>expect(tof(AFn)).toBe('AsyncFunction'));
                test('async function *AGFn(){}',()=>expect(tof(AGFn)).toBe('AsyncGeneratorFunction'));
            });
            describe(`匿名Async/Generator系(通常系と同じ。Anonymousは付かない)`, ()=>{
                test('function*(){/*this.x=0*/}',()=>expect(tof(function*(){/*this.x=0*/})).toBe('GeneratorFunction'));
                test('async function(){/*this.x=0*/}',()=>expect(tof(async function(){/*this.x=0*/})).toBe('AsyncFunction'));
                test('async function*(){/*this.x=0*/}',()=>expect(tof(async function*(){/*this.x=0*/})).toBe('AsyncGeneratorFunction'));
            });
        });
    });
});

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
                describe(`組込疑似クラスインスタンス系`, ()=>{
                    test('(new Map())',()=>expect(Tys.name(new Map())).toBe('BuiltinObject<Map>'));
                    test('(new Uint8Array())',()=>expect(Tys.name(new Uint8Array())).toBe('BuiltinObject<Uint8Array>'));
                });
                describe(`PrototypedObject系`, ()=>{
                    test('Object.create({})',()=>expect(Tys.name(Object.create({}))).toBe('PrototypedObject'));
                    function Es5Cls(){}
                    test('ES5疑似クラスインスタンス',()=>expect(Tys.name(new Es5Cls())).toBe('PrototypedObject'));
                });
                describe(`BoxedPrimitive系`, ()=>{
                    test('Boolean',()=>expect(Tys.name(new Boolean())).toBe('BoxedPrimitive<Boolean>'));
                    test('Number',()=>expect(Tys.name(new Number())).toBe('BoxedPrimitive<Number>'));
                    test('String',()=>expect(Tys.name(new String())).toBe('BoxedPrimitive<String>'));
                });
                describe(`Descriptor系`, ()=>{
                    const getDes = o=>Object.getOwnPropertyDescriptor(o, 'd');
                    const v = getDes(Object.defineProperty({}, 'd', {value:0}));
                    const m = getDes(Object.defineProperty({}, 'd', {value:()=>0}));
                    const g = getDes(Object.defineProperty({_d:0}, 'd', {get(){return this._d}}));
                    const s = getDes(Object.defineProperty({_d:0}, 'd', {set(v){this._d=v;}}));
                    const a = getDes(Object.defineProperty({_d:0}, 'd', {get(){return this._d}, set(v){this._d=v}}));
                    test('Value',()=>expect(Tys.name(v)).toBe('Descriptor<Value>'));
                    test('Method',()=>expect(Tys.name(m)).toBe('Descriptor<Method>'));
                    test('Getter',()=>expect(Tys.name(g)).toBe('Descriptor<Getter>'));
                    test('Setter',()=>expect(Tys.name(s)).toBe('Descriptor<Setter>'));
                    test('Accessor',()=>expect(Tys.name(a)).toBe('Descriptor<Accessor>'));
                });
                describe(`ES6クラスインスタンス系`, ()=>{
                    class MyClass {}
                    test('MyClass',()=>expect(Tys.name(new MyClass())).toBe('Instance<MyClass>'));
                });

            });
        });
    });
});

import { expect, test, describe } from "bun:test";
import {Typ} from '../src/typ.js';
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
describe(`Typ`, ()=>{
    describe(`is`, ()=>{
        describe(`bln`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Typ.is.bln(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false]])(`(%p)`, (v)=>{
                    expect(Typ.is.bln(v)).toBe(true);
                });
            });
//            test(`(0)`, () =>{
//                expect(Typ.is.bln(0)).toBe(false);
//            });
        });
    });
    describe(`er`, ()=>{
        describe(`bln`, ()=>{
            test(`(0)`, () =>{
                const actual = 0;
                assertThrow(TypeError, `Expected: '${Typ.is.bln.toString()}' like value.\nActual: ${actual}, typeof: ${typeof actual}`, ()=>Typ.er.bln(actual));
            });
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
//                    expect(Typ.is.bln(v)).toBe(false);
                    assertThrow(TypeError, `Expected: '${Typ.is.bln.toString()}' like value.\nActual: ${v}, typeof: ${typeof v}`, ()=>Typ.er.bln(v));
                });
            });

            describe(`true`, ()=>{
                test.each([[true],[false]])(`(%p)`, (v)=>{
                    expect(Typ.er.bln(v)).toBe(true);
                });
            });

        });
    });
});

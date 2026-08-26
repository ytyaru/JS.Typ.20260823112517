import { expect, test, describe } from "bun:test";
import {Tyd} from '../src/tyd.js';
import {Tys} from '../src/tys.js';
/**
 * 指定した関数を実行し、期待する例外型とメッセージが完全に一致してスローされるか検証する
 * @param fn 検証対象の関数
 * @param expectedErrorClass 期待する例外のコンストラクタ（例: TydeError, CustomError など）
 * @param expectedMessage 期待する完全一致のエラーメッセージ
 */
function assertThrow(Err, msg, fn) {
    let err = null;
    try {fn();} catch (error) {err = error;}
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Err);
    expect(err.message).toBe(msg);
}
describe(`Tyd`, ()=>{
    describe(`is`, ()=>{
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Tyd.is.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[0.1],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)]])(`(%p)`, (v)=>{
                    expect(Tyd.is.some(v)).toBe(true);
                });
            });
        });
        /*
        describe(`bln`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Tyd.is.bln(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false]])(`(%p)`, (v)=>{
                    expect(Tyd.is.bln(v)).toBe(true);
                });
            });
        });
        describe(`int`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Tyd.is.int(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(Tyd.is.int(v)).toBe(true);
                });
            });
        });
        describe(`finite`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Tyd.is.fin(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[1.0],[0.1],[-12.3],[45.6789],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[Number.MAX_SAFE_INTEGER-0.1],[Number.MIN_SAFE_INTEGER+0.1]])(`(%p)`, (v)=>{
                    expect(Tyd.is.fin(v)).toBe(true);
                });
            });
        });
        */
        describe(`float`, ()=>{
            describe(`false`, ()=>{
                test.each([[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099+0.1],[-900719925474099-0.1],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Tyd.is.num.flt(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{// 整数も真になる。Typ.is.int()と重複してしまうが仕様。逆に1.0は偽で1.1は真では扱い辛い
                test.each([[0],[1.0],[0.1],[-12.3],[45.6789],[900719925474099-0.1],[-900719925474099+0.1]])(`(%p)`, (v)=>{
                    expect(Tyd.is.num.flt(v)).toBe(true);
                });
            });
        });
        /*
        describe(`big`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Tyd.is.big(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0n],[BigInt(Number.MAX_SAFE_INTEGER) + 1n],[BigInt(Number.MIN_SAFE_INTEGER) - 1n]])(`(%p)`, (v)=>{
                    expect(Tyd.is.big(v)).toBe(true);
                });
            });
        });
        describe(`str`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Tyd.is.str(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[''],[' '],['\n'],['a'],['あ']])(`(%p)`, (v)=>{
                    expect(Tyd.is.str(v)).toBe(true);
                });
            });
        });
        describe(`sym`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],['']])(`(%p)`, (v)=>{
                    expect(Tyd.is.sym(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[Symbol()],[Symbol('a')],[Symbol.for('a')]])(`(%p)`, (v)=>{
                    expect(Tyd.is.sym(v)).toBe(true);
                });
            });
        });
    });
    describe(`er`, ()=>{
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)]])(`(%p)`, (v)=>{
                    assertThrow(TydeError, `Expected: a value that makes 'Tydis.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Tyd.er.some(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Tyd.er.some(v)).toBe(true);
                });
            });
        });
        describe(`bln`, ()=>{
            describe(`TydeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TydeError, `Expected: '${Tyd.is.bln.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyd.er.bln(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false]])(`(%p)`, (v)=>{
                    expect(Tyd.er.bln(v)).toBe(true);
                });
            });
        });
        describe(`int`, ()=>{
            describe(`TydeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TydeError, `Expected: '${Tyd.is.int.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyd.er.int(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(Tyd.er.int(v)).toBe(true);
                });
            });
        });
        describe(`finite`, ()=>{
            describe(`TydeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    //expect(Tyd.is.fin(v)).toBe(false);
                    assertThrow(TydeError, `Expected: '${Tyd.is.fin.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyd.er.fin(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0.1],[-12.3],[45.6789],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(Tyd.er.fin(v)).toBe(true);
                });
            });
        });
        describe(`big`, ()=>{
            describe(`TydeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TydeError, `Expected: '${Tyd.is.big.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyd.er.big(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0n],[BigInt(Number.MAX_SAFE_INTEGER) + 1n],[BigInt(Number.MIN_SAFE_INTEGER) - 1n]])(`(%p)`, (v)=>{
                    expect(Tyd.er.big(v)).toBe(true);
                });
            });
        });
        describe(`str`, ()=>{
            describe(`TydeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TydeError, `Expected: '${Tyd.is.str.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyd.er.str(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[''],[' '],['\n'],['a'],['あ']])(`(%p)`, (v)=>{
                    expect(Tyd.er.str(v)).toBe(true);
                });
            });
        });
        describe(`sym`, ()=>{
            describe(`TydeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],['']])(`(%p)`, (v)=>{
                    assertThrow(TydeError, `Expected: '${Tyd.is.sym.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Tyd.er.sym(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[Symbol()],[Symbol('a')],[Symbol.for('a')]])(`(%p)`, (v)=>{
                    expect(Tyd.er.sym(v)).toBe(true);
                });
            });
        });
        */
    });
});

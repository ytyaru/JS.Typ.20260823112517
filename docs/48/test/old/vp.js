import { expect, test, describe } from "bun:test";
import {Vp} from '../src/vp.js';
import {Tys} from '../src/tys.js';
/**
 * 指定した関数を実行し、期待する例外型とメッセージが完全に一致してスローされるか検証する
 * @param fn 検証対象の関数
 * @param expectedErrorClass 期待する例外のコンストラクタ（例: VpeError, CustomError など）
 * @param expectedMessage 期待する完全一致のエラーメッセージ
 */
function assertThrow(Err, msg, fn) {
    let err = null;
    try {fn();} catch (error) {err = error;}
    expect(err).not.toBeNull();
    expect(err).toBeInstanceOf(Err);
    expect(err.message).toBe(msg);
}
describe(`Vp`, ()=>{
    describe(`is`, ()=>{
        describe(`bln`, ()=>{
            describe(`t`, ()=>{
                describe(`false`, ()=>{
                    test.each([[false],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                        expect(Vp.is.bln.t(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[true]])(`(%p)`, (v)=>{
                        expect(Vp.is.bln.t(v)).toBe(true);
                    });
                });
            });
            describe(`f`, ()=>{
                describe(`false`, ()=>{
                    test.each([[true],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                        expect(Vp.is.bln.f(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[false]])(`(%p)`, (v)=>{
                        expect(Vp.is.bln.f(v)).toBe(true);
                    });
                });
            });
        });
        describe(`num`, ()=>{
            describe(`flt`, ()=>{
                describe(`false`, ()=>{
                    test.each([[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                        expect(Vp.is.num.flt(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[0],[1.0],[0.1],[-12.3],[45.6789],[900719925474099-0.1],[-900719925474099+0.1]])(`(%p)`, (v)=>{
                        expect(Vp.is.num.flt(v)).toBe(true);
                    });
                });

            });
            describe(`u8`, ()=>{
                describe(`false`, ()=>{
                    test.each([[0.1],[-12.3],[45.6789],[900719925474099-0.1],[-900719925474099+0.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                        expect(Vp.is.num.u8(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[0],[1.0]])(`(%p)`, (v)=>{
                        expect(Vp.is.num.u8(v)).toBe(true);
                    });
                });

            });
        });
        /*
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                    expect(Vp.is.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Vp.is.some(v)).toBe(true);
                });
            });
        });
        describe(`finite`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Vp.is.fin(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[1.0],[0.1],[-12.3],[45.6789],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[Number.MAX_SAFE_INTEGER-0.1],[Number.MIN_SAFE_INTEGER+0.1]])(`(%p)`, (v)=>{
                    expect(Vp.is.fin(v)).toBe(true);
                });
            });
        });
        */
        /*
        describe(`float`, ()=>{
            describe(`false`, ()=>{
                test.each([[0],[1.0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Vp.is.flt(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0.1],[-12.3],[45.6789],[999999999999999-0.1],[-999999999999999+0.1]])(`(%p)`, (v)=>{
                    expect(Vp.is.flt(v)).toBe(true);
                });
            });
        });
        */
        describe(`big`, ()=>{
            /*
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Vp.is.big(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0n],[BigInt(Number.MAX_SAFE_INTEGER) + 1n],[BigInt(Number.MIN_SAFE_INTEGER) - 1n]])(`(%p)`, (v)=>{
                    expect(Vp.is.big(v)).toBe(true);
                });
            });
            */
        });
    });
    describe(`er`, ()=>{
        /*
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)]])(`(%p)`, (v)=>{
                    assertThrow(VpeError, `Expected: a value that makes 'Vpis.some(v)' return true.\nActual: ${Tys.name(v)}`, ()=>Vp.er.some(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(Vp.er.some(v)).toBe(true);
                });
            });
        });
        describe(`bln`, ()=>{
            describe(`VpeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(VpeError, `Expected: '${Vp.is.bln.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Vp.er.bln(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false]])(`(%p)`, (v)=>{
                    expect(Vp.er.bln(v)).toBe(true);
                });
            });
        });
        describe(`int`, ()=>{
            describe(`VpeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(VpeError, `Expected: '${Vp.is.int.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Vp.er.int(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(Vp.er.int(v)).toBe(true);
                });
            });
        });
        describe(`finite`, ()=>{
            describe(`VpeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    //expect(Vp.is.fin(v)).toBe(false);
                    assertThrow(VpeError, `Expected: '${Vp.is.fin.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Vp.er.fin(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0.1],[-12.3],[45.6789],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(Vp.er.fin(v)).toBe(true);
                });
            });
        });
        describe(`big`, ()=>{
            describe(`VpeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(VpeError, `Expected: '${Vp.is.big.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Vp.er.big(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0n],[BigInt(Number.MAX_SAFE_INTEGER) + 1n],[BigInt(Number.MIN_SAFE_INTEGER) - 1n]])(`(%p)`, (v)=>{
                    expect(Vp.er.big(v)).toBe(true);
                });
            });
        });
        describe(`str`, ()=>{
            describe(`VpeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(VpeError, `Expected: '${Vp.is.str.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Vp.er.str(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[''],[' '],['\n'],['a'],['あ']])(`(%p)`, (v)=>{
                    expect(Vp.er.str(v)).toBe(true);
                });
            });
        });
        describe(`sym`, ()=>{
            describe(`VpeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],['']])(`(%p)`, (v)=>{
                    assertThrow(VpeError, `Expected: '${Vp.is.sym.toString()}' like value.\nActual: ${Tys.name(v)}`, ()=>Vp.er.sym(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[Symbol()],[Symbol('a')],[Symbol.for('a')]])(`(%p)`, (v)=>{
                    expect(Vp.er.sym(v)).toBe(true);
                });
            });
        });
        */
    });
});

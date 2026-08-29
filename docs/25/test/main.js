import { expect, test, describe } from "bun:test";
import {isT,owT,ofT} from '../src/main.js';
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from './test-data.js';
describe(`isT`, ()=>{
    describe(`p`, ()=>{
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                    expect(isT.p.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.some(v)).toBe(true);
                });
            });
        });
        describe(`bln`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.bln(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false]])(`(%p)`, (v)=>{
                    expect(isT.p.bln(v)).toBe(true);
                });
            });
        });
        describe(`int`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.int(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(isT.p.int(v)).toBe(true);
                });
            });
        });
        describe(`finite`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.fin(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[1.0],[0.1],[-12.3],[45.6789],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[Number.MAX_SAFE_INTEGER-0.1],[Number.MIN_SAFE_INTEGER+0.1]])(`(%p)`, (v)=>{
                    expect(isT.p.fin(v)).toBe(true);
                });
            });
        });
        /*
        describe(`float`, ()=>{
            describe(`false`, ()=>{
                test.each([[0],[1.0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.flt(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0.1],[-12.3],[45.6789],[999999999999999-0.1],[-999999999999999+0.1]])(`(%p)`, (v)=>{
                    expect(isT.p.flt(v)).toBe(true);
                });
            });
        });
        */
        describe(`big`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.big(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[0n],[BigInt(Number.MAX_SAFE_INTEGER) + 1n],[BigInt(Number.MIN_SAFE_INTEGER) - 1n]])(`(%p)`, (v)=>{
                    expect(isT.p.big(v)).toBe(true);
                });
            });
        });
        describe(`str`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],[Symbol()]])(`(%p)`, (v)=>{
                    expect(isT.p.str(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[''],[' '],['\n'],['a'],['あ']])(`(%p)`, (v)=>{
                    expect(isT.p.str(v)).toBe(true);
                });
            });
        });
        describe(`sym`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],['']])(`(%p)`, (v)=>{
                    expect(isT.p.sym(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[Symbol()],[Symbol('a')],[Symbol.for('a')]])(`(%p)`, (v)=>{
                    expect(isT.p.sym(v)).toBe(true);
                });
            });
        });
    });
    describe(`er`, ()=>{
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: a value that makes 'Typis.some(v)' return true.\nActual: ${ofT(v)}`, ()=>owT.p.some(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false],[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    expect(owT.p.some(v)).toBe(true);
                });
            });
        });
        describe(`bln`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.p.bln.toString()}' like value.\nActual: ${ofT(v)}`, ()=>owT.p.bln(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[true],[false]])(`(%p)`, (v)=>{
                    expect(owT.p.bln(v)).toBe(true);
                });
            });
        });
        describe(`int`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.p.int.toString()}' like value.\nActual: ${ofT(v)}`, ()=>owT.p.int(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(owT.p.int(v)).toBe(true);
                });
            });
        });
        describe(`finite`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0n],[''],[Symbol()]])(`(%p)`, (v)=>{
                    //expect(isT.p.fin(v)).toBe(false);
                    assertThrow(TypeError, `Expected: '${isT.p.fin.toString()}' like value.\nActual: ${ofT(v)}`, ()=>owT.p.fin(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0.1],[-12.3],[45.6789],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER]])(`(%p)`, (v)=>{
                    expect(owT.p.fin(v)).toBe(true);
                });
            });
        });
        describe(`big`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[''],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.p.big.toString()}' like value.\nActual: ${ofT(v)}`, ()=>owT.p.big(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[0n],[BigInt(Number.MAX_SAFE_INTEGER) + 1n],[BigInt(Number.MIN_SAFE_INTEGER) - 1n]])(`(%p)`, (v)=>{
                    expect(owT.p.big(v)).toBe(true);
                });
            });
        });
        describe(`str`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],[Symbol()]])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.p.str.toString()}' like value.\nActual: ${ofT(v)}`, ()=>owT.p.str(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[''],[' '],['\n'],['a'],['あ']])(`(%p)`, (v)=>{
                    expect(owT.p.str(v)).toBe(true);
                });
            });
        });
        describe(`sym`, ()=>{
            describe(`TypeError`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[0.1],[0],[0n],['']])(`(%p)`, (v)=>{
                    assertThrow(TypeError, `Expected: '${isT.p.sym.toString()}' like value.\nActual: ${ofT(v)}`, ()=>owT.p.sym(v));
                });
            });
            describe(`true`, ()=>{
                test.each([[Symbol()],[Symbol('a')],[Symbol.for('a')]])(`(%p)`, (v)=>{
                    expect(owT.p.sym(v)).toBe(true);
                });
            });
        });
    });
});

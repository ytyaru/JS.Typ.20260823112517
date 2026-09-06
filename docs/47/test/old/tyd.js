import { expect, test, describe } from "bun:test";
import {Tyd} from '../src/tyd.js';
import {Tys} from '../src/tys.js';
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins} from './test-data.js';
describe(`Tyd`, ()=>{
    describe(`is`, ()=>{
        describe(`()`, ()=>{
//            test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyd.is()));
            test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyd.is()));
            describe(`false`, ()=>{
                test.each([[true],[false],[0],[0.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(Tyd.is(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                    expect(Tyd.is(v)).toBe(true);
                });
            });
        });
        describe(`some`, ()=>{
            describe(`false`, ()=>{
                test.each([[true],[false],[0],[0.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(Tyd.is.some(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                    expect(Tyd.is.some(v)).toBe(true);
                });
            });
        });
        describe(`und`, ()=>{
            describe(`false`, ()=>{
                test.each([[null],[0],[0.1],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(Tyd.is.und(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[undefined]])(`(%p)`, (v)=>{
                    expect(Tyd.is.und(v)).toBe(true);
                });
            });
        });
        describe(`nul`, ()=>{
            describe(`false`, ()=>{
                test.each([[undefined],[0],[0.1],[NaN],[Infinity],[-Infinity],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                    expect(Tyd.is.nul(v)).toBe(false);
                });
            });
            describe(`true`, ()=>{
                test.each([[null]])(`(%p)`, (v)=>{
                    expect(Tyd.is.nul(v)).toBe(true);
                });
            });
        });
        describe(`num`, ()=>{
            describe(`()`, ()=>{
//                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyd.is.num()));
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyd.is.num()));

                describe(`false`, ()=>{
                    test.each([[undefined],[null],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.num(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[NaN],[Infinity],[-Infinity]])(`(%p)`, (v)=>{
                        expect(Tyd.is.num(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[NaN],[Infinity],[-Infinity]])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.some(v)).toBe(true);
                    });
                });
            });
            describe(`nan`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[Infinity],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.nan(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[NaN]])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.nan(v)).toBe(true);
                    });
                });
            });
            describe(`inf`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.inf(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Infinity],[-Infinity]])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.inf(v)).toBe(true);
                    });
                });
            });
            describe(`pinf`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.pinf(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Infinity]])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.pinf(v)).toBe(true);
                    });
                });
            });
            describe(`ninf`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.ninf(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[-Infinity]])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.ninf(v)).toBe(true);
                    });
                });
            });
            describe(`oint`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.oint(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Number.MAX_SAFE_INTEGER+1],[Number.MIN_SAFE_INTEGER-1]])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.oint(v)).toBe(true);
                    });
                });
            });
            describe(`ofin`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})],[true],[false],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.oint(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1]])(`(%p)`, (v)=>{
                        expect(Tyd.is.num.oint(v)).toBe(true);
                    });
                });
            });
            /*
            describe(`err`, ()=>{
            });
            describe(`flt`, ()=>{
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
            */
        });
        describe(`obj`, ()=>{
            describe(`()`, ()=>{
//                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `コンストラクタ生成禁止です。`, ()=>new Tyd.is.obj()));
                test(`ReferenceError`, ()=>assertThrow(ReferenceError, `Constructors are not allowed.`, ()=>new Tyd.is.obj()));
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.obj(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                        expect(Tyd.is.obj(v)).toBe(true);
                    });
                });
            });
            describe(`some`, ()=>{
                describe(`false`, ()=>{
                    test.each([[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.obj.some(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create(null)],[Object.create({})]])(`(%p)`, (v)=>{
                        expect(Tyd.is.obj.some(v)).toBe(true);
                    });
                });
            });
            describe(`boxed`, ()=>{
                describe(`false`, ()=>{
                    test.each([[Object.create(null)],[Object.create({})],[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.obj.boxed(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()]])(`(%p)`, (v)=>{
                        expect(Tyd.is.obj.boxed(v)).toBe(true);
                    });
                });
            });
            describe(`hasNotProto`, ()=>{
                describe(`false`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create({})],[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.obj.hasNotProto(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Object.create(null)]])(`(%p)`, (v)=>{
                        expect(Tyd.is.obj.hasNotProto(v)).toBe(true);
                    });
                });
            });
            describe(`prototyped`, ()=>{
                describe(`false`, ()=>{
                    test.each([[new Boolean()],[new Number()],[new String()],[Object.create(null)],[undefined],[null],[NaN],[Infinity],[-Infinity],[0],[0.1],[Number.MAX_SAFE_INTEGER+1.1],[Number.MIN_SAFE_INTEGER-1.1],[Number.MAX_SAFE_INTEGER],[Number.MIN_SAFE_INTEGER],[900719925474099-0.1],[-900719925474099+0.1],[true],[false],[0n],[''],[Symbol()], ...objs, ...des.o, ...des.c, ...des.i, ...cls.es6, cls.es5, cls.native, ...ins.es6, ins.es5, ins.native, ...cal.fn, ...cal.md])(`(%p)`, (v)=>{
                        expect(Tyd.is.obj.prototyped(v)).toBe(false);
                    });
                });
                describe(`true`, ()=>{
                    test.each([[Object.create({})]])(`(%p)`, (v)=>{
                        expect(Tyd.is.obj.prototyped(v)).toBe(true);
                    });
                });
            });
        });
    });
});

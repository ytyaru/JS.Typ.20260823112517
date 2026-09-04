import { expect, test, describe } from "bun:test";
import {isT,owT,tof} from '../src/main.js';
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from './test-data.js';

describe(`owT`, ()=>{
    describe(`Primitive系`, ()=>{
        test(`owT.p(null)`, ()=>assertThrow(TypeError, `Expected: Primitive\nActual: ${tof(null)}`, ()=>owT.p(null)));
        test(`owT.p.some(null)`, ()=>assertThrow(TypeError, `Expected: Primitive\nActual: ${tof(null)}`, ()=>owT.p.some(null)));
        test(`owT.p.bln(null)`, ()=>assertThrow(TypeError, `Expected: Boolean\nActual: ${tof(null)}`, ()=>owT.p.bln(null)));
        test(`owT.p.int(null)`, ()=>assertThrow(TypeError, `Expected: Integer\nActual: ${tof(null)}`, ()=>owT.p.int(null)));
        test(`owT.p.fin(null)`, ()=>assertThrow(TypeError, `Expected: Finite\nActual: ${tof(null)}`, ()=>owT.p.fin(null)));
        test(`owT.p.big(null)`, ()=>assertThrow(TypeError, `Expected: BigInt\nActual: ${tof(null)}`, ()=>owT.p.big(null)));
        test(`owT.p.str(null)`, ()=>assertThrow(TypeError, `Expected: String\nActual: ${tof(null)}`, ()=>owT.p.str(null)));
        test(`owT.p.sym(null)`, ()=>assertThrow(TypeError, `Expected: Symbol\nActual: ${tof(null)}`, ()=>owT.p.sym(null)));
    });
    describe(`Danger系`, ()=>{
        test(`owT.d(0)`, ()=>assertThrow(TypeError, `Expected: Danger\nActual: ${tof(0)}`, ()=>owT.d(0)));
        test(`owT.d.some(0)`, ()=>assertThrow(TypeError, `Expected: Danger\nActual: ${tof(0)}`, ()=>owT.d.some(0)));
        test(`owT.d.und(0)`, ()=>assertThrow(TypeError, `Expected: Undefined\nActual: ${tof(0)}`, ()=>owT.d.und(0)));
        test(`owT.d.nul(0)`, ()=>assertThrow(TypeError, `Expected: Null\nActual: ${tof(0)}`, ()=>owT.d.nul(0)));
        test(`owT.d.num(0)`, ()=>assertThrow(TypeError, `Expected: DangerNumber\nActual: ${tof(0)}`, ()=>owT.d.num(0)));
        test(`owT.d.num.some(0)`, ()=>assertThrow(TypeError, `Expected: DangerNumber\nActual: ${tof(0)}`, ()=>owT.d.num.some(0)));
        test(`owT.d.num.nan(0)`, ()=>assertThrow(TypeError, `Expected: NaN\nActual: ${tof(0)}`, ()=>owT.d.num.nan(0)));
        test(`owT.d.num.inf(0)`, ()=>assertThrow(TypeError, `Expected: Infinity\nActual: ${tof(0)}`, ()=>owT.d.num.inf(0)));
        test(`owT.d.num.pinf(0)`, ()=>assertThrow(TypeError, `Expected: PositiveInfinity\nActual: ${tof(0)}`, ()=>owT.d.num.pinf(0)));
        test(`owT.d.num.ninf(0)`, ()=>assertThrow(TypeError, `Expected: NegativeInfinity\nActual: ${tof(0)}`, ()=>owT.d.num.ninf(0)));
        test(`owT.d.num.oint(0)`, ()=>assertThrow(TypeError, `Expected: OverInteger\nActual: ${tof(0)}`, ()=>owT.d.num.oint(0)));
        test(`owT.d.num.ofin(0)`, ()=>assertThrow(TypeError, `Expected: OverFinite\nActual: ${tof(0)}`, ()=>owT.d.num.ofin(0)));
        test(`owT.d.obj(0)`, ()=>assertThrow(TypeError, `Expected: DangerObject\nActual: ${tof(0)}`, ()=>owT.d.obj(0)));
        test(`owT.d.obj.some(0)`, ()=>assertThrow(TypeError, `Expected: DangerObject\nActual: ${tof(0)}`, ()=>owT.d.obj.some(0)));
        test(`owT.d.obj.boxed(0)`, ()=>assertThrow(TypeError, `Expected: BoxedPrimitive\nActual: ${tof(0)}`, ()=>owT.d.obj.boxed(0)));
        test(`owT.d.obj.noneProto(0)`, ()=>assertThrow(TypeError, `Expected: NonePrototypeObject\nActual: ${tof(0)}`, ()=>owT.d.obj.noneProto(0)));
        test(`owT.d.obj.prototyped(0)`, ()=>assertThrow(TypeError, `Expected: PrototypedObject\nActual: ${tof(0)}`, ()=>owT.d.obj.prototyped(0)));
    });
    describe(`Object系`, ()=>{
        test(`owT.o(0)`, ()=>assertThrow(TypeError, `Expected: Object\nActual: ${tof(0)}`, ()=>owT.o(0)));
        test(`owT.o.some(0)`, ()=>assertThrow(TypeError, `Expected: Object\nActual: ${tof(0)}`, ()=>owT.o.some(0)));
        test(`owT.o.obj(0)`, ()=>assertThrow(TypeError, `Expected: PlainObject\nActual: ${tof(0)}`, ()=>owT.o.obj(0)));
        test(`owT.o.ary(0)`, ()=>assertThrow(TypeError, `Expected: Array\nActual: ${tof(0)}`, ()=>owT.o.ary(0)));
        describe(`Descriptor系`, ()=>{
            test(`owT.o.des(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor\nActual: ${tof(0)}`, ()=>owT.o.des(0)));
            test(`owT.o.des.some(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor\nActual: ${tof(0)}`, ()=>owT.o.des.some(0)));
            describe(`Data系`, ()=>{
                test(`owT.o.des.d(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor.Data\nActual: ${tof(0)}`, ()=>owT.o.des.d(0)));
                test(`owT.o.des.d.some(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor.Data\nActual: ${tof(0)}`, ()=>owT.o.des.d.some(0)));
                test(`owT.o.des.d.v(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor.Data.Value\nActual: ${tof(0)}`, ()=>owT.o.des.d.v(0)));
                test(`owT.o.des.d.m(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor.Data.Method\nActual: ${tof(0)}`, ()=>owT.o.des.d.m(0)));
            });
            describe(`Access系`, ()=>{
                test(`owT.o.des.a(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor.Access\nActual: ${tof(0)}`, ()=>owT.o.des.a(0)));
                test(`owT.o.des.a.some(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor.Access\nActual: ${tof(0)}`, ()=>owT.o.des.a.some(0)));
                test(`owT.o.des.a.g(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor.Access.Get\nActual: ${tof(0)}`, ()=>owT.o.des.a.g(0)));
                test(`owT.o.des.a.s(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor.Access.Set\nActual: ${tof(0)}`, ()=>owT.o.des.a.s(0)));
                test(`owT.o.des.a.gs(0)`, ()=>assertThrow(TypeError, `Expected: Descriptor.Access.GetSet\nActual: ${tof(0)}`, ()=>owT.o.des.a.gs(0)));
            });
        });
        describe(`Instance系`, ()=>{
            test(`owT.o.ins(0)`, ()=>assertThrow(TypeError, `Expected: Instance\nActual: ${tof(0)}`, ()=>owT.o.ins(0)));
            test(`owT.o.ins.es6(0)`, ()=>assertThrow(TypeError, `Expected: ES6.Instance\nActual: ${tof(0)}`, ()=>owT.o.ins.es6(0)));
            test(`owT.o.ins.es5(0)`, ()=>assertThrow(TypeError, `Expected: ES5.Instance\nActual: ${tof(0)}`, ()=>owT.o.ins.es5(0)));
            test(`owT.o.ins.native(0)`, ()=>assertThrow(TypeError, `Expected: NativeInstance\nActual: ${tof(0)}`, ()=>owT.o.ins.native(0)));
            test(`owT.o.ins.es6(0,C)`, ()=>assertThrow(TypeError, `Expected: ES6.Instance<C>\nActual: ${tof(0)}`, ()=>owT.o.ins.es6(0,C)));
            function MyFnCls(){}
            test(`owT.o.ins.es5(0,C)`, ()=>assertThrow(TypeError, `Expected: ES5.Instance<MyFnCls>\nActual: ${tof(0)}`, ()=>owT.o.ins.es5(0,MyFnCls)));
            test(`owT.o.ins.native(0,C)`, ()=>assertThrow(TypeError, `Expected: NativeInstance<Map>\nActual: ${tof(0)}`, ()=>owT.o.ins.native(0,Map)));
        });
        describe(`Class系`, ()=>{
        });
        describe(`Function系`, ()=>{
        });
        describe(`Method系`, ()=>{
        });
    });


});

// tof.test.js
import { describe, test, expect } from "bun:test";
import { tof, getAbbr, getFull, isTypeTreeNode } from "../src/tof.js";
import { tis } from "../src/tis.js";
//import { leafTypeCases } from "./test-data.js";
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from "./test-data-type.js";
/*
const leafTypeCases = [
    {node:tis.und, v:undefined, abbr:'und', full:'Undefined'},
    {node:tis.nul, v:null, abbr:'nul', full:'Null'},
    {node:tis.bln, v:true, abbr:'bln', full:'Boolean'},
    {node:tis.big, v:0n, abbr:'big', full:'BigInt'},
    {node:tis.str, v:'', abbr:'str', full:'String'},
    {node:tis.sym, v:Symbol(), abbr:'sym', full:'Symbol'},
    {node:tis.int, v:0, abbr:'int', full:'Integer'},
    {node:tis.fin, v:0.1, abbr:'fin', full:'Finite'},
    {node:tis.obj, v:{}, abbr:'obj', full:'PlainObject'},
    {node:tis.ary, v:[], abbr:'ary.empty', full:'Array.Empty'},
    {node:tis.ary, v:[0], abbr:'ary.filled', full:'Array.Filled'},
    {node:tis.ary, v:[0,1], abbr:'ary.gen', full:'Array.Generics'},
    {node:tis.cls.es6, v:C, abbr:'cls.es6', full:'Class.ES6'},
];
*/
function MyES5Cls(){}
const leafTypeCases = [
    {node:tis.und, args:[undefined], abbr:'und', full:'Undefined'},
    {node:tis.nul, args:[null], abbr:'nul', full:'Null'},
    {node:tis.bln, args:[true], abbr:'bln', full:'Boolean'},
    {node:tis.big, args:[0n], abbr:'big', full:'BigInt'},
    {node:tis.str, args:[''], abbr:'str', full:'String'},
    {node:tis.sym, args:[Symbol()], abbr:'sym', full:'Symbol'},
    {node:tis.int, args:[0], abbr:'int', full:'Integer'},
    {node:tis.fin, args:[0.1], abbr:'fin', full:'Finite'},
    {node:tis.obj, args:[{}], abbr:'obj', full:'PlainObject'},
    {node:tis.ary, args:[[]], abbr:'ary.empty', full:'Array.Empty'},
    {node:tis.ary, args:[[0]], abbr:'ary.filled', full:'Array.Filled'},
//    {node:tis.ary, args:[[0,1]], abbr:'ary.gen', full:'Array.Generics'},
    {node:tis.ary, args:[[0,1],tis.int], abbr:'ary.gen<int>', full:'Array.Generics<Integer>'},
//    {node:tis.cls.es6, args:[C], abbr:'cls.es6', full:'Class.ES6'},
    // (v)
    {node:tis.cls.es6, args:[C], abbr:'cls.es6<C>', full:'Class.ES6<C>'},
    {node:tis.cls.es5, args:[MyES5Cls], abbr:'cls.es5<MyES5Cls>', full:'Class.ES5<MyES5Cls>'},
    {node:tis.cls.native, args:[Date], abbr:'cls.native<Date>', full:'Class.Native<Date>'},
    {node:tis.ins.es6, args:[c], abbr:'ins.es6<C>', full:'Instance.ES6<C>'},
    {node:tis.ins.es5, args:[new MyES5Cls()], abbr:'ins.es5<MyES5Cls>', full:'Instance.ES5<MyES5Cls>'},
    {node:tis.ins.native, args:[new Date()], abbr:'ins.native<Date>', full:'Instance.Native<Date>'},
    // (v,C)
    {node:tis.cls.es6, args:[C,C], abbr:'cls.es6<C>', full:'Class.ES6<C>'},
    {node:tis.cls.es5, args:[MyES5Cls, MyES5Cls], abbr:'cls.es5<MyES5Cls>', full:'Class.ES5<MyES5Cls>'},
    {node:tis.cls.native, args:[Date,Date], abbr:'cls.native<Date>', full:'Class.Native<Date>'},
    {node:tis.ins.es6, args:[c,C], abbr:'ins.es6<C>', full:'Instance.ES6<C>'},
    {node:tis.ins.es5, args:[new MyES5Cls(),MyES5Cls], abbr:'ins.es5<MyES5Cls>', full:'Instance.ES5<MyES5Cls>'},
    {node:tis.ins.native, args:[new Date(),Date], abbr:'ins.native<Date>', full:'Instance.Native<Date>'},
    // Descriptor
    {node:tis.des.d.v, args:[des.o[0][0]], abbr:'des.d.v', full:'Descriptor.Data.Value'},
    {node:tis.des.d.m, args:[des.o[1][0]], abbr:'des.d.m', full:'Descriptor.Data.Method'},
    {node:tis.des.a.g, args:[des.c[0][0]], abbr:'des.a.g', full:'Descriptor.Access.Get'},
    {node:tis.des.a.s, args:[des.c[1][0]], abbr:'des.a.s', full:'Descriptor.Access.Set'},
    {node:tis.des.a.g, args:[des.c[2][0]], abbr:'des.a.gs', full:'Descriptor.Access.GetSet'},
];
describe('tof', () => {
    describe('(value)', () => {
        test.each(leafTypeCases)('$abbr',({node,args,abbr,full})=>{
            const R = tof(...args);
            expect(R.abbr).toBe(abbr);
            expect(R.full).toBe(full);
        });
    });
    describe('(value)', () => {
        test('0', ()=>{
            const R = tof(0);
            expect(R.abbr).toBe('int');
            expect(R.full).toBe('Integer');
        })
        test('C', ()=>{
            const R = tof(C);
            console.log('tis.cls(C):', tis.cls(C));
            expect(R.abbr).toBe('cls.es6');
            expect(R.full).toBe('Class.ES6');
            //expect(R.full).toBe('Class.ES6.C');
        })

    });
    describe('(TypeTreeNode)', () => {

    });
    describe('abbr', () => {

    });
    describe('full', () => {

    });

});


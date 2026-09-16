import { describe, test, expect } from "bun:test";
import { tis } from "../src/tis.js";
//import { Fn, Cls } from "../src/is/fn.js";
//import { Obj, Des, Ins, } from "../src/is/obj.js";
//import { baseTypeCases, numSubCases } from "./test-data.js";
//import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from "./test-data-type.js";
const data = {
    top: [
        { key: 'und', name: 'Undefined', value: undefined, extra: ['d'] },
        { key: 'nul', name: 'Null',      value: null,      extra: ['d'] },
        { key: 'bln', name: 'Boolean',   value: false,     extra: [] },
        { key: 'big', name: 'BigInt',    value: 0n,        extra: [] },
        { key: 'str', name: 'String',    value: '',        extra: [] },
        { key: 'sym', name: 'Symbol',    value: Symbol(),  extra: [] },
        { key: 'int', name: 'Integer',   value: 42,        extra: ['fin'] },
        { key: 'fin', name: 'Finite',    value: 3.14,      extra: ['d'] },
        { key: 'obj', name: 'Object',    value: {},        extra: [] },
        { key: 'ary', name: 'Array',     value: [],        extra: [] },
        { key: 'run', name: 'Function',  value: () => {},  extra: [] },
        { key: 'cls', name: 'Class',     value: class A {},extra: [] },
        { key: 'ins', name: 'Instance',  value: new (class A {})(), extra: [] },
        { key: 'des', name: 'Descriptor',value: {value:1}, extra: [] },
        { key: 'd',   name: 'Danger',    value: NaN,       extra: [] },
        { key: 'g',   name: 'Group',     value: 0,         extra: ['int','fin'] },
    ]
};
describe('tis', () => {
    describe('(v)', () => {
        test('defined', () => expect(tis).toBeDefined());
        test('function', () => expect('function' === typeof tis).toBe(true));
        test.each(data.top)('$name', ({ name, value, key, extra }) => {
            const res = tis(value);
            for (const k of Object.keys(res)) {
                let shouldBeTrue = false;
                if (k === key) shouldBeTrue = true;
                if (k === 'g') shouldBeTrue = true;
                if (extra.includes(k)) shouldBeTrue = true;
                expect(res[k]).toBe(shouldBeTrue);
                expect(tis[k](value)).toBe(shouldBeTrue);
            }
        });
    });
    describe('und', () => {
        describe('true', () => {
            test('undefined',()=>expect(tis.und(undefined)).toBe(true));
        });
        describe('false', () => {
            test.each([null,true,0,0.1,NaN,Infinity,0n,'',Symbol(),{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.und(v)).toBe(false));
        });
    });
    describe('nul', () => {
        describe('true', () => {
            test('null',()=>expect(tis.nul(null)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,true,0,0.1,NaN,Infinity,0n,'',Symbol(),{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.nul(v)).toBe(false));
        });
    });
    describe('bln', () => {
        describe('true', () => {
            test('true',()=>expect(tis.bln(true)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,0,0.1,NaN,Infinity,0n,'',Symbol(),{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.bln(v)).toBe(false));
        });
    });
    describe('big', () => {
        describe('true', () => {
            test('0n',()=>expect(tis.big(0n)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,true,0,0.1,NaN,Infinity,'',Symbol(),{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.big(v)).toBe(false));
        });
    });
    describe('str', () => {
        describe('true', () => {
            test(`''`,()=>expect(tis.str('')).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.str(v)).toBe(false));
        });
    });
    describe('sym', () => {
        describe('true', () => {
            test('Symbol()',()=>expect(tis.sym(Symbol())).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,true,0,0.1,NaN,Infinity,0n,'',{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.sym(v)).toBe(false));
        });
    });
    describe('int', () => {
        describe('true', () => {
            test('0',()=>expect(tis.int(0)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,true,0.1,NaN,Infinity,0n,Symbol(),'',{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.int(v)).toBe(false));
        });
    });
    describe('fin', () => {
        describe('true', () => {
            test.each([0,0.1].map(x=>[x]))('%p',v=>expect(tis.fin(v)).toBe(true));
        });
        describe('false', () => {
            test.each([undefined,null,true,NaN,Infinity,0n,Symbol(),'',{},[],new Number()].map(x=>[x]))('%p',v=>expect(tis.fin(v)).toBe(false));
        });
    });
    describe('ary', () => {
        describe('(v)', () => {
            describe('true', () => {
                test.each([[]].map(x=>[x]))('%p',v=>expect(tis.ary(v)).toBe(true));
            });
            describe('false', () => {
                test.each([undefined,null,true,0,0.1,NaN,Infinity,0n,Symbol(),'',{},new Number()].map(x=>[x]))('%p',v=>expect(tis.ary(v)).toBe(false));
            });
        });
        describe('(v,C)', () => {
            describe('true', () => {
                test.each([[0],[0,-9]].map(x=>[x]))('%p',v=>expect(tis.ary(v,tis.int)).toBe(true));
            });
            describe('false', () => {
                test.each([[],[''],[0,''],['',0],['',0n],[0,0n]].map(x=>[x]))('%p',v=>expect(tis.ary(v,tis.int)).toBe(false));
            });
        });
    });
    describe('obj', () => {

    });
    describe('run', () => {

    });
    describe('cls', () => {

    });
    describe('ins', () => {

    });
    describe('des', () => {

    });
    describe('d', () => {

    });
    describe('g', () => {

    });
});

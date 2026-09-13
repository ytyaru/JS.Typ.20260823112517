import { describe, test, expect } from "bun:test";
import { Ag } from "../../src/is/ag.js";
import { Fn } from "../../src/is/fn.js";
import { Obj } from "../../src/is/obj.js";
import { baseTypeCases, numSubCases } from "../test-data.js";

const es5 = {
    s: {n:function fn(){}, a:eval('(function(){})')},
    a: async function(){},
    g: function*(){},
    ag: async function*(){},
};
const bound = es5.s.a.bind(null);
const native = [].map;
const arrow = {s:v=>0, a:async()=>0};
class C {
    static sm() {
/*async*/
//async *
'async *'
"async *"
`async *`
(/async */g)
1*2
const a = async()=>{}
const A = async function*fn(){}
}
    static *sgm() {}
    static async sam() {}
    static async *sagm() {}
    im() {
/*async*/
//async *
'async *'
"async *"
`async *`
(/async */g)
1*2
const a = async()=>{}
const A = async function*fn(){}
    }
    *igm() {}
    async iam() {}
    async *iagm() {}

    static get sg() {}
    static set ss(x) {}
    static get sgs() {}
    static set sgs(x) {}
    get ig() {}
    set is(x) {}
    get igs() {}
    set igs(x) {}
}
const c = new C();
function Es5Cls(){this.x=1;}
const es5Cls = new Es5Cls();
describe('Obj', () => {
    describe('getFlag', () => {
        describe('is', () => {
            describe('false', () => {
                test.each([undefined,null,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).is).toBe(false);
                });
            });
            describe('true', () => {
                test.each([{},[],c,es5Cls,new Number(),new Date(),Object.create(null),Object.create({})].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).is).toBe(true);
                });
            });
        });
        /*
        describe('nul', () => {
            describe('true', () => {
                test.each([null].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).nul).toBe(true);
                });
            });
            describe('false', () => {
                test.each([{},[],c,es5Cls,new Number(),new Date(),Object.create(null),Object.create({}),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).nul).toBe(false);
                });
            });
        });
        */
        describe('plain', () => {
            describe('true', () => {
                test.each([{}].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).plain).toBe(true);
                });
            });
            describe('false', () => {
                test.each([null,[],c,es5Cls,new Number(),new Date(),Object.create(null),Object.create({}),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).plain).toBe(false);
                });
            });
        });
        describe('none', () => {
            describe('true', () => {
                test.each([Object.create(null)].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).none).toBe(true);
                });
            });
            describe('false', () => {
                test.each([null,[],{},c,es5Cls,new Number(),new Date(),Object.create({}),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).none).toBe(false);
                });
            });
        });
        describe('proto', () => {
            describe('true', () => {
                test.each([Object.create({})].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).proto).toBe(true);
                });
            });
            describe('false', () => {
                test.each([null,[],{},c,es5Cls,new Number(),new Date(),Object.create(null),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).proto).toBe(false);
                });
            });
        });
        describe('boxed', () => {
            describe('true', () => {
                test.each([new Number()].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).boxed.is).toBe(true);
                });
            });
            describe('false', () => {
                test.each([null,[],{},c,es5Cls,Object.create({}),new Date(),Object.create(null),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).boxed.is).toBe(false);
                });
            });
        });
        describe('ins', () => {
            describe('true', () => {
                test.each([c,es5Cls,new Date()].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).ins.is).toBe(true);
                });
            });
            describe('false', () => {
                test.each([null,[],{},new Number(),Object.create({}),Object.create(null),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                    expect(Obj.getFlag(v).ins.is).toBe(false);
                });
            });
        });
        describe('des', () => {
            describe('is', () => {
                describe('true', () => {
                    test.each([c,es5Cls,new Date()].map(x=>[x]))('%p', v=>{
                        expect(Obj.getFlag(v).ins.is).toBe(true);
                    });
                });
                describe('false', () => {
                    test.each([null,[],{},new Number(),Object.create({}),Object.create(null),undefined,NaN,0,0n,false,'',Symbol(),C,bound,native,arrow.s,arrow.a,es5.s.n,es5.s.a,es5.a,es5.g,es5.ag].map(x=>[x]))('%p', v=>{
                        expect(Obj.getFlag(v).ins.is).toBe(false);
                    });
                });

            });
            describe('d', () => {

            });
            describe('a', () => {

            });
        });
    });
});

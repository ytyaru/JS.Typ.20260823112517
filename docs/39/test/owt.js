import { expect, test, describe } from "bun:test";
import {isT,owT,tof} from '../src/main.js';
import {assertThrow,C,c,fn,gfn,afn,agfn,arrFn,aarrFn,des,cal,prims,objs,dangers,cls,ins,_obj,getDes} from './test-data.js';

describe(`owT`, ()=>{
    test(`owT.p(null)`, ()=>assertThrow(TypeError, `Expected: Primitive\nActual: ${tof(null)}`, ()=>owT.p(null)));
    test(`owT.p.int(null)`, ()=>assertThrow(TypeError, `Expected: Integer\nActual: ${tof(null)}`, ()=>owT.p.int(null)));
});

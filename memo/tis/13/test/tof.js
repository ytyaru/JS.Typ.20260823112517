// tof.test.js
import { describe, test, expect } from "bun:test";
import { tof, getAbbr, getFull, isTypeTreeNode } from "../src/tof.js";
import { tis } from "../src/tis.js";
import { leafTypeCases } from "./test-data.js";

describe("tof", () => {
    describe("(value)", () => {
        test.each(leafTypeCases)("tof($name) returns exact leaf path object", ({ value, tofPath }) => {
            const result = tof(value);
            const expectedAbbr = tofPath;
            // tofPath (e.g. "num.int") から期待される full path を組み立てる
            // 例: "Number.Integer", "String", など
            expect(result.abbr).toBe(expectedAbbr);
        });
    });
    describe("(TypeTreeNode)", () => {
        test.each([
            [tis.und,'und','Undefined'],[tis.nul,'nul','Null'],[tis.bln,'bln','Boolean'],
            [tis.big,'big','BigInt'],[tis.str,'str','String'],[tis.sym,'sym','Symbol'],
            [tis.fn,'fn','Function'],[tis.obj,'obj','Object'],[tis.num,'num','Number'],
            [tis.num.int,'num.int','Number.Integer'],[tis.num.fin,'num.fin','Number.Finite'],
            [tis.num.nan,'num.nan','Number.NaN'],[tis.num.inf,'num.inf','Number.Infinity'],
            [tis.num.inf.p,'num.inf.p','Number.Infinity.Positive'],[tis.num.inf.n,'num.inf.n','Number.Infinity.Negative'],
            [tis.num.over,'num.over','Number.Overflow']])('', (node, abbr, full)=>{
            const o = tof(node);
            expect(isTypeTreeNode(node)).toBe(true);
            expect(o.abbr).toBe(abbr);
            expect(o.full).toBe(full);
            expect(tof.abbr(node)).toBe(o.abbr);
            expect(tof.full(node)).toBe(o.full);
        });
    });
});


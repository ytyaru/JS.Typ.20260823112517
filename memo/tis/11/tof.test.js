// tof.test.js
import { describe, test, expect } from "bun:test";
import { tof, getAbbr, getFull, isTypeTreeNode } from "./tof.js";
import { tis } from "./tis.js";
import { leafTypeCases } from "./test-data.js";

describe("tof exhaustive test suite", () => {
    test.each(leafTypeCases)("tof($name) returns exact leaf path object", ({ value, tofPath }) => {
        const result = tof(value);
        const expectedAbbr = tofPath;
        // tofPath (e.g. "num.int") から期待される full path を組み立てる
        // 例: "Number.Integer", "String", など
        expect(result.abbr).toBe(expectedAbbr);
    });

    test("tof supports direct TypeTreeNode input", () => {
        const node = tis.num.int;
        expect(isTypeTreeNode(node)).toBe(true);
        expect(tof(node).abbr).toBe("num.int");
        expect(tof.abbr(node)).toBe("num.int");
        expect(tof.full(node)).toBe("Number.Integer");
    });
});

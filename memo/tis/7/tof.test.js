import { describe, test, expect } from "bun:test";
import { tof } from "./tof.js";

describe("tof test suite", () => {
    const tofCases = [
        { val: undefined, expected: "und" },
        { val: true, expected: "bln" },
        { val: 10n, expected: "big" },
        { val: "text", expected: "str" },
        { val: Symbol(), expected: "sym" },
        { val: () => {}, expected: "fn" },
        { val: {}, expected: "obj" },
        { val: null, expected: "nul" },
        { val: 100, expected: "num.int" },
        { val: 100.5, expected: "num.fin" },
        { val: NaN, expected: "num.nan" },
        { val: Infinity, expected: "num.inf.p" },
        { val: -Infinity, expected: "num.inf.n" },
        { val: Number.MAX_SAFE_INTEGER + 1, expected: "num.over" },
    ];

    test.each(tofCases)("tof($val) returns $expected", ({ val, expected }) => {
        expect(tof(val)).toBe(expected);
    });
});

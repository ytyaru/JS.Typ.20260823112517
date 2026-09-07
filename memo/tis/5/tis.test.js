import { describe, test, expect } from "bun:test";
import { tis } from "./tis.js";

describe("tis exhaustive test suite", () => {
    const baseTypeCases = [
        { name: "undefined", value: undefined, expectedKey: "und" },
        { name: "boolean", value: true, expectedKey: "bln" },
        { name: "bigint", value: 10n, expectedKey: "big" },
        { name: "string", value: "text", expectedKey: "str" },
        { name: "symbol", value: Symbol(), expectedKey: "sym" },
        { name: "function", value: () => {}, expectedKey: "fn" },
        { name: "object", value: {}, expectedKey: "obj" },
        { name: "null", value: null, expectedKey: "nul" },
        { name: "number", value: 42, expectedKey: "num" },
    ];

    test.each(baseTypeCases)(
        "top-level keys exclusivity for $name",
        ({ value, expectedKey }) => {
            const res = tis(value);
            for (const key of Object.keys(res)) {
                if (key === expectedKey) {
                    expect(res[key]).toBe(true);
                    expect(tis[key](value)).toBe(true);
                } else {
                    expect(res[key]).toBe(false);
                    expect(tis[key](value)).toBe(false);
                }
            }
        }
    );

    const numSubCases = [
        { desc: "safe integer", val: 100, checks: { int: true, fin: true, nan: false, inf: false, over: false } },
        { desc: "MAX_SAFE_INTEGER", val: Number.MAX_SAFE_INTEGER, checks: { int: true, fin: true, nan: false, inf: false, over: false } },
        { desc: "MIN_SAFE_INTEGER", val: Number.MIN_SAFE_INTEGER, checks: { int: true, fin: true, nan: false, inf: false, over: false } },
        { desc: "safe float / decimal", val: 100.5, checks: { int: false, fin: true, nan: false, inf: false, over: false } },
        { desc: "NaN", val: NaN, checks: { int: false, fin: false, nan: true, inf: false, over: false } },
        { desc: "positive Infinity", val: Infinity, checks: { int: false, fin: false, nan: false, inf: true, over: false, p: true, n: false } },
        { desc: "negative Infinity", val: -Infinity, checks: { int: false, fin: false, nan: false, inf: true, over: false, p: false, n: true } },
        { desc: "overflow int (MAX + 1)", val: Number.MAX_SAFE_INTEGER + 1, checks: { int: false, fin: false, nan: false, inf: false, over: true, overInt: true, overFin: true } },
        { desc: "overflow int (MIN - 1)", val: Number.MIN_SAFE_INTEGER - 1, checks: { int: false, fin: false, nan: false, inf: false, over: true, overInt: true, overFin: true } },
        { desc: "overflow float / non-integer", val: Number.MAX_SAFE_INTEGER + 1.5, checks: { int: false, fin: false, nan: false, inf: false, over: true, overInt: false, overFin: true } },
    ];

    test.each(numSubCases)("num details: $desc ($val)", ({ val, checks }) => {
        if ("int" in checks) expect(tis.num.int(val)).toBe(checks.int);
        if ("fin" in checks) expect(tis.num.fin(val)).toBe(checks.fin);
        if ("nan" in checks) expect(tis.num.nan(val)).toBe(checks.nan);
        if ("inf" in checks) expect(tis.num.inf(val)).toBe(checks.inf);
        if ("p" in checks) expect(tis.num.inf.p(val)).toBe(checks.p);
        if ("n" in checks) expect(tis.num.inf.n(val)).toBe(checks.n);
        if ("over" in checks) expect(tis.num.over(val)).toBe(checks.over);
        if ("overInt" in checks) expect(tis.num.over.int(val)).toBe(checks.overInt);
        if ("overFin" in checks) expect(tis.num.over.fin(val)).toBe(checks.overFin);
    });

    test.each(baseTypeCases)(
        "tis(v) returns full object structure correctly for $name",
        ({ value, expectedKey }) => {
            const result = tis(value);
            const keys = Object.keys(result);
            
            for (const key of keys) {
                if (key === expectedKey) {
                    expect(result[key]).toBe(true);
                } else {
                    expect(result[key]).toBe(false);
                }
            }
        }
    );
});

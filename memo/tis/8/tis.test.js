import { describe, test, expect } from "bun:test";
import { tis } from "./tis.js";
import { baseTypeCases, numSubCases } from "./test-data.js";

describe("tis exhaustive test suite", () => {
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

    test.each(numSubCases)("num details: $desc ($val)", ({ val, checks }) => {
        if ("int" in checks) expect(tis.num.int(val)).toBe(checks.int);
        if ("fin" in checks) expect(tis.num.fin(val)).toBe(checks.fin);
        if ("nan" in checks) expect(tis.num.nan(val)).toBe(checks.nan);
        if ("inf" in checks) expect(tis.num.inf(val)).toBe(checks.inf);
        if ("p" in checks) expect(tis.num.inf.p(val)).toBe(checks.p);
        if ("n" in checks) expect(tis.num.inf.n(val)).toBe(checks.n);
        if ("over" in checks) expect(tis.num.over(val)).toBe(checks.over);
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

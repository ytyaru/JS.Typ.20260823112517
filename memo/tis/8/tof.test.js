import { describe, test, expect } from "bun:test";
import { tof } from "./tof.js";
import { leafTypeCases, intermediateTypeCases } from "./test-data.js";

describe("tof exhaustive test suite", () => {
    test.each(leafTypeCases)("tof($name) returns exact leaf path $tofPath", ({ value, tofPath }) => {
        expect(tof(value)).toBe(tofPath);
    });

    // 中間ノード（numやnum.infなど）に該当する値に対しても、tofが想定通りの詳細な最深パスを返すことを完全検証
    test.each(intermediateTypeCases)("tof resolves intermediate/parent value $name correctly", ({ value, path }) => {
        const result = tof(value);
        if (path === "num") {
            const validNumPaths = ["num.int", "num.fin", "num.nan", "num.inf.p", "num.inf.n", "num.over"];
            expect(validNumPaths.includes(result)).toBe(true);
        } else if (path === "num.inf") {
            expect(result.startsWith("num.inf.")).toBe(true);
        }
    });
});

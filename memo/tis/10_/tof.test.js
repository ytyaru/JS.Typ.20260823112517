import { describe, test, expect } from "bun:test";
import { tof } from "./tof.js";
import { leafTypeCases, intermediateTypeCases } from "./test-data.js";

describe("tof exhaustive test suite", () => {
    test.each(leafTypeCases)("tof($name) returns exact leaf path $tofPath", ({ value, tofPath }) => {
        expect(tof(value)).toBe(tofPath);
    });
});

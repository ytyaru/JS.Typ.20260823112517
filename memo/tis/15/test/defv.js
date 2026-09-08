import { describe, test, expect } from "bun:test";
import { defV, tis } from "../src/tis.js";

describe("defV exhaustive test suite for all nodes", () => {
    test("top-level nodes default values", () => {
        expect(defV(tis.und)).toBe(undefined);
        expect(defV(tis.bln)).toBe(false);
        expect(defV(tis.big)).toBe(0n);
        expect(defV(tis.str)).toBe("");
        expect(typeof defV(tis.sym)).toBe("symbol");
        expect(typeof defV(tis.fn)).toBe("function");
        expect(defV(tis.obj)).toEqual({});
        expect(defV(tis.nul)).toBe(null);
        expect(defV(tis.num)).toBe(0);
    });

    test("number child nodes default values and parent fallbacks", () => {
        // num children lacking explicit default should fallback to num's default (0)
        expect(defV(tis.num.int)).toBe(0);
        //expect(defV(tis.num.fin)).toBe(0);
        expect(defV(tis.num.bin)).toBe(0.5);

        // explicit defaults in num children
        expect(Object.is(defV(tis.num.nan), NaN)).toBe(true);
        expect(defV(tis.num.inf)).toBe(Infinity);
        //expect(defV(tis.num.over)).toBe(Number.MAX_SAFE_INTEGER + 1);
        expect(defV(tis.num.bin.over)).toBe(Number.MAX_SAFE_INTEGER + 1);

        // num.inf children falling back to num.inf's default (Infinity)
        expect(defV(tis.num.inf.p)).toBe(Infinity);
        expect(defV(tis.num.inf.n)).toBe(-Infinity);
    });
});

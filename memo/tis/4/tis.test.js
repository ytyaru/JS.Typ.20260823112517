import { describe, test, expect } from "bun:test";
import { tis } from "./tis.js";

describe("tis complete test suite (all patterns & nested APIs)", () => {
    test("basic types (und, bln, big, str, sym, fn)", () => {
        expect(tis(undefined).und).toBe(true);
        expect(tis.und(undefined)).toBe(true);
        expect(tis.und(null)).toBe(false);

        expect(tis(true).bln).toBe(true);
        expect(tis.bln(false)).toBe(true);
        expect(tis.bln(1)).toBe(false);

        expect(tis(10n).big).toBe(true);
        expect(tis.big(10n)).toBe(true);
        expect(tis.big(10)).toBe(false);

        expect(tis("text").str).toBe(true);
        expect(tis.str("text")).toBe(true);
        expect(tis.str(123)).toBe(false);

        const sym = Symbol();
        expect(tis(sym).sym).toBe(true);
        expect(tis.sym(sym)).toBe(true);
        expect(tis.sym("sym")).toBe(false);

        const fn = () => {};
        expect(tis(fn).fn).toBe(true);
        expect(tis.fn(fn)).toBe(true);
        expect(tis.fn({})).toBe(false);
    });

    test("object and null (obj, nul)", () => {
        expect(tis({}).obj).toBe(true);
        expect(tis([]).obj).toBe(true);
        expect(tis.obj({})).toBe(true);
        expect(tis.obj(null)).toBe(false);

        expect(tis(null).nul).toBe(true);
        expect(tis.nul(null)).toBe(true);
        expect(tis.nul({})).toBe(false);
    });

    test("number base checks (num, num.int, num.fin, num.nan)", () => {
        expect(tis(123).num).toBe(true);
        expect(tis.num(123)).toBe(true);
        expect(tis.num("123")).toBe(false);

        expect(tis.num.int(100)).toBe(true);
        expect(tis.num.int(Number.MAX_SAFE_INTEGER)).toBe(true);
        expect(tis.num.int(Number.MIN_SAFE_INTEGER)).toBe(true);
        expect(tis.num.int(100.5)).toBe(false);
        expect(tis.num.int(Number.MAX_SAFE_INTEGER + 1)).toBe(false);

        expect(tis.num.fin(100)).toBe(true);
        expect(tis.num.fin(Infinity)).toBe(false);
        expect(tis.num.fin(NaN)).toBe(false);

        expect(tis.num.nan(NaN)).toBe(true);
        expect(tis.num.nan(123)).toBe(false);
    });

    test("number infinity and nested sub-checks (num.inf, num.inf.p, num.inf.n)", () => {
        expect(tis.num.inf(Infinity)).toBe(true);
        expect(tis.num.inf(-Infinity)).toBe(true);
        expect(tis.num.inf(123)).toBe(false);

        // num.inf 実行により、その関数自身に付与される p, n プロパティの検証
        expect(typeof tis.num.inf.p).toBe("function");
        expect(typeof tis.num.inf.n).toBe("function");

        expect(tis.num.inf.p(Infinity)).toBe(true);
        expect(tis.num.inf.p(-Infinity)).toBe(false);
        expect(tis.num.inf.p(123)).toBe(false);

        expect(tis.num.inf.n(-Infinity)).toBe(true);
        expect(tis.num.inf.n(Infinity)).toBe(false);
        expect(tis.num.inf.n(123)).toBe(false);
    });

    test("number overflow and nested sub-checks (num.over, num.over.int, num.over.fin)", () => {
        const unsafeNum = Number.MAX_SAFE_INTEGER + 1;
        expect(tis.num.over(unsafeNum)).toBe(true);
        expect(tis.num.over(100)).toBe(false);

        // num.over 実行により、その関数自身に付与される int, fin プロパティの検証
        expect(typeof tis.num.over.int).toBe("function");
        expect(typeof tis.num.over.fin).toBe("function");

        expect(tis.num.over.int(unsafeNum)).toBe(true);
        expect(tis.num.over.int(Number.MIN_SAFE_INTEGER - 1)).toBe(true);
        expect(tis.num.over.int(100)).toBe(false);
        expect(tis.num.int(100)).toBe(true); // 元の num.int は独立して安全な範囲を維持していること

        expect(tis.num.over.fin(unsafeNum)).toBe(true);
        expect(tis.num.over.fin(Infinity)).toBe(false);
        expect(tis.num.over.fin(100)).toBe(false);
        expect(tis.num.fin(100)).toBe(true); // 元の num.fin も独立していること
    });

    test("batch tis execution structure", () => {
        const result = tis(42);
        expect(result).toEqual({
            und: false,
            bln: false,
            big: false,
            str: false,
            sym: false,
            fn: false,
            obj: false,
            nul: false,
            num: true,
        });
    });
});

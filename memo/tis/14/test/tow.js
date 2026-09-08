// tow.test.js
import { describe, test, expect } from "bun:test";
import { tow } from "../src/tow.js";
import { tof } from "../src/tof.js";
import { tis } from "../src/tis.js";
import { baseTypeCases, leafTypeCases, intermediateTypeCases } from "./test-data.js";

class TestError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestError";
    }
}

// ヘルパー：アブブリブーションパスから該当する TypeTreeNode を取得する
const getNodeByPath = (path) => {
    const segments = path.split('.');
    let current = tis;
    for (const seg of segments) {
        current = current[seg];
    }
    return current;
};

function assertThrowsTypeError(fn, expectedAbbrPath, actualValue) {
    let thrown = false;
    try {
        fn();
    } catch (e) {
        thrown = true;
        if (!(e instanceof TypeError)) {
            throw new TestError(`[Type Mismatch] Expected TypeError, but got ${e.constructor.name}`);
        }
        const expectedNode = getNodeByPath(expectedAbbrPath);
        const expectedFull = tof.full(expectedNode);
        const actualFull = tof.full(actualValue);
        const actualAbbr = tof.abbr(actualValue);

        const expectedMessage = `Expected: ${expectedFull} (${expectedAbbrPath})\nActual: ${actualFull} (${actualAbbr})`;
        if (e.message !== expectedMessage) {
            throw new TestError(`[Message Mismatch]\n  Expected: ${JSON.stringify(expectedMessage)}\n  Actual:   ${JSON.stringify(e.message)}`);
        }
    }
    if (!thrown) {
        throw new TestError(`[No Exception] Expected TypeError to be thrown for path '${expectedAbbrPath}', but nothing was thrown.`);
    }
}

describe("tow exhaustive test suite", () => {
    test.each(baseTypeCases)("tow success for top-level $name", ({ value, expectedKey }) => {
        expect(tow[expectedKey](value)).toBe(true);
    });

    test.each(leafTypeCases)("tow success for leaf path $tofPath", ({ value, tofPath }) => {
        const pathSegments = tofPath.split('.');
        let current = tow;
        for (const seg of pathSegments) {
            current = current[seg];
        }
        expect(current(value)).toBe(true);
    });

    test.each(intermediateTypeCases)("tow success for intermediate path $path with $name", ({ value, path }) => {
        const pathSegments = path.split('.');
        let current = tow;
        for (const seg of pathSegments) {
            current = current[seg];
        }
        expect(current(value)).toBe(true);
    });

    test("tow exhaustive failure patterns and exact error messages", () => {
        assertThrowsTypeError(() => tow.und(123), "und", 123);
        assertThrowsTypeError(() => tow.bln(123), "bln", 123);
        assertThrowsTypeError(() => tow.big(123), "big", 123);
        assertThrowsTypeError(() => tow.str(123), "str", 123);
        assertThrowsTypeError(() => tow.sym(123), "sym", 123);
        assertThrowsTypeError(() => tow.fn(123), "fn", 123);
        assertThrowsTypeError(() => tow.obj(null), "obj", null);
        assertThrowsTypeError(() => tow.nul({}), "nul", {});
        assertThrowsTypeError(() => tow.num("123"), "num", "123");

        assertThrowsTypeError(() => tow.num.int(100.5), "num.int", 100.5);
        assertThrowsTypeError(() => tow.num.int(NaN), "num.int", NaN);
        assertThrowsTypeError(() => tow.num.int(Infinity), "num.int", Infinity);
        assertThrowsTypeError(() => tow.num.int(Number.MAX_SAFE_INTEGER + 1), "num.int", Number.MAX_SAFE_INTEGER + 1);
        assertThrowsTypeError(() => tow.num.int(Number.MIN_SAFE_INTEGER - 1), "num.int", Number.MIN_SAFE_INTEGER - 1);

        //assertThrowsTypeError(() => tow.num.fin(NaN), "num.fin", NaN);
//        assertThrowsTypeError(() => tow.num.fin(Infinity), "num.fin", Infinity);
        assertThrowsTypeError(() => tow.num.bin(NaN), "num.bin", NaN);
        assertThrowsTypeError(() => tow.num.bin.flt(NaN), "num.bin.flt", NaN);

        assertThrowsTypeError(() => tow.num.nan(100), "num.nan", 100);
        assertThrowsTypeError(() => tow.num.nan(Infinity), "num.nan", Infinity);

        assertThrowsTypeError(() => tow.num.inf(100), "num.inf", 100);
        assertThrowsTypeError(() => tow.num.inf(NaN), "num.inf", NaN);

        assertThrowsTypeError(() => tow.num.inf.p(-Infinity), "num.inf.p", -Infinity);
        assertThrowsTypeError(() => tow.num.inf.p(100), "num.inf.p", 100);
        assertThrowsTypeError(() => tow.num.inf.p(NaN), "num.inf.p", NaN);

        assertThrowsTypeError(() => tow.num.inf.n(Infinity), "num.inf.n", Infinity);
        assertThrowsTypeError(() => tow.num.inf.n(100), "num.inf.n", 100);
        assertThrowsTypeError(() => tow.num.inf.n(NaN), "num.inf.n", NaN);

        assertThrowsTypeError(() => tow.num.bin.over(100), "num.bin.over", 100);
        assertThrowsTypeError(() => tow.num.bin.over(Infinity), "num.bin.over", Infinity);
        assertThrowsTypeError(() => tow.num.bin.over(NaN), "num.bin.over", NaN);
//        assertThrowsTypeError(() => tow.num.over(100), "num.over", 100);
//        assertThrowsTypeError(() => tow.num.over(Infinity), "num.over", Infinity);
//        assertThrowsTypeError(() => tow.num.over(NaN), "num.over", NaN);
    });
});

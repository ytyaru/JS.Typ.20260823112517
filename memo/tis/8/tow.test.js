import { describe, test, expect } from "bun:test";
import { tow } from "./tow.js";
import { baseTypeCases, leafTypeCases, intermediateTypeCases } from "./test-data.js";

class TestError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestError";
    }
}

function assertThrowsTypeError(fn, expectedPath, actualType) {
    let thrown = false;
    try {
        fn();
    } catch (e) {
        thrown = true;
        if (!(e instanceof TypeError)) {
            throw new TestError(`[Type Mismatch] Expected TypeError, but got ${e.constructor.name}`);
        }
        const expectedMessage = `Expected: ${expectedPath}\nActual: ${actualType}`;
        if (e.message !== expectedMessage) {
            throw new TestError(`[Message Mismatch]\n  Expected: ${JSON.stringify(expectedMessage)}\n  Actual:   ${JSON.stringify(e.message)}`);
        }
    }
    if (!thrown) {
        throw new TestError(`[No Exception] Expected TypeError to be thrown for path '${expectedPath}', but nothing was thrown.`);
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
        assertThrowsTypeError(() => tow.und(123), "und", "num.int");
        assertThrowsTypeError(() => tow.bln(123), "bln", "num.int");
        assertThrowsTypeError(() => tow.big(123), "big", "num.int");
        assertThrowsTypeError(() => tow.str(123), "str", "num.int");
        assertThrowsTypeError(() => tow.sym(123), "sym", "num.int");
        assertThrowsTypeError(() => tow.fn(123), "fn", "num.int");
        assertThrowsTypeError(() => tow.obj(null), "obj", "nul");
        assertThrowsTypeError(() => tow.nul({}), "nul", "obj");
        assertThrowsTypeError(() => tow.num("123"), "num", "str");

        assertThrowsTypeError(() => tow.num.int(100.5), "num.int", "num.fin");
        assertThrowsTypeError(() => tow.num.int(NaN), "num.int", "num.nan");
        assertThrowsTypeError(() => tow.num.int(Infinity), "num.int", "num.inf.p");
        assertThrowsTypeError(() => tow.num.int(Number.MAX_SAFE_INTEGER + 1), "num.int", "num.over");
        assertThrowsTypeError(() => tow.num.int(Number.MIN_SAFE_INTEGER - 1), "num.int", "num.over");

        assertThrowsTypeError(() => tow.num.fin(NaN), "num.fin", "num.nan");
        assertThrowsTypeError(() => tow.num.fin(Infinity), "num.fin", "num.inf.p");

        assertThrowsTypeError(() => tow.num.nan(100), "num.nan", "num.int");
        assertThrowsTypeError(() => tow.num.nan(Infinity), "num.nan", "num.inf.p");

        assertThrowsTypeError(() => tow.num.inf(100), "num.inf", "num.int");
        assertThrowsTypeError(() => tow.num.inf(NaN), "num.inf", "num.nan");

        assertThrowsTypeError(() => tow.num.inf.p(-Infinity), "num.inf.p", "num.inf.n");
        assertThrowsTypeError(() => tow.num.inf.p(100), "num.inf.p", "num.int");
        assertThrowsTypeError(() => tow.num.inf.p(NaN), "num.inf.p", "num.nan");

        assertThrowsTypeError(() => tow.num.inf.n(Infinity), "num.inf.n", "num.inf.p");
        assertThrowsTypeError(() => tow.num.inf.n(100), "num.inf.n", "num.int");
        assertThrowsTypeError(() => tow.num.inf.n(NaN), "num.inf.n", "num.nan");

        assertThrowsTypeError(() => tow.num.over(100), "num.over", "num.int");
        assertThrowsTypeError(() => tow.num.over(Infinity), "num.over", "num.inf.p");
        assertThrowsTypeError(() => tow.num.over(NaN), "num.over", "num.nan");
    });
});

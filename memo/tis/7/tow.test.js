import { describe, test, expect } from "bun:test";
import { tow } from "./tow.js";

// 三者の原因を区別して明示するための専用エラー
class TestError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestError";
    }
}

// 例外検証をDRYにするヘルパー関数
function assertThrowsTypeError(fn, expectedPath, actualType) {
    let thrown = false;
    try {
        fn();
    } catch (e) {
        thrown = true;
        // 1. 例外の型が完全一致すること (TypeError)
        if (!(e instanceof TypeError)) {
            throw new TestError(`[Type Mismatch] Expected TypeError, but got ${e.constructor.name}`);
        }
        // 2. メッセージが一字一句完全一致すること
        const expectedMessage = `Expected: ${expectedPath}\nActual: ${actualType}`;
        if (e.message !== expectedMessage) {
            throw new TestError(`[Message Mismatch]\n  Expected: JSON.stringify(${JSON.stringify(expectedMessage)})\n  Actual:   JSON.stringify(${JSON.stringify(e.message)})`);
        }
    }
    // 3. 例外が発生していること
    if (!thrown) {
        throw new TestError(`[No Exception] Expected TypeError to be thrown for path '${expectedPath}', but nothing was thrown.`);
    }
}

describe("tow test suite", () => {
    test("tow success patterns (no exception thrown)", () => {
        expect(tow.und(undefined)).toBe(true);
        expect(tow.bln(false)).toBe(true);
        expect(tow.num.int(100)).toBe(true);
        expect(tow.num.inf.p(Infinity)).toBe(true);
    });

    test("tow failure patterns with strict verification helper", () => {
        // 例1: stringに123を渡す -> Expected: str, Actual: num.int
        assertThrowsTypeError(() => tow.str(123), "str", "num.int");

        // 例2: num.intに100.5を渡す -> Expected: num.int, Actual: num.fin
        assertThrowsTypeError(() => tow.num.int(100.5), "num.int", "num.fin");

        // 例3: num.inf.pに-Infinityを渡す -> Expected: num.inf.p, Actual: num.inf.n
        assertThrowsTypeError(() => tow.num.inf.p(-Infinity), "num.inf.p", "num.inf.n");
    });
});

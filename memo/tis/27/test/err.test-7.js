import { describe, test, expect } from "bun:test";
import { Err, Ass } from "./err.js";

class CustomTestError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomTestError";
    }
}
class PseudoTestError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomTestError";
    }
}
class TotallyDifferentError extends Error {
    constructor(message) {
        super(message);
        this.name = "TotallyDifferentError";
    }
}

describe("自作アサーションクラス Ass の厳格なテスト", () => {
    
    test("【正常系】Bunの標準APIを用いた型（クラス）とメッセージの『酷く冗長な』完全検証の証明", () => {
        const fn = () => { throw new CustomTestError("エラーメッセージ"); };
        
        expect(() => {
            let err = null;
            try { fn(); } catch (e) { err = e; }
            
            expect(err).not.toBeNull();
            expect(err).toBeInstanceOf(CustomTestError); 
            expect(err.message).toBe("エラーメッセージ"); 
        }).not.toThrow();
    });

    test("【型判定の検証】手作りの name 偽装エラー（PseudoTestError）に対する各APIの挙動判定", () => {
        const fn = () => { throw new PseudoTestError("メッセージ"); };
        
        let errSame = null;
        try {
            Ass.same(fn, CustomTestError, "メッセージ");
        } catch (e) {
            errSame = e;
        }
        expect(errSame).not.toBeNull();
        expect(errSame.constructor?.name).toBe("TestFailureError"); 
        expect(errSame.message).toBe(`型判定に失敗しました。Realmが異なるか、別の型です。
期待値: CustomTestError
実際値: PseudoTestError`);

        expect(() => { Ass.test(fn, CustomTestError, "メッセージ"); }).not.toThrow();
        expect(() => { Ass.realm(fn, CustomTestError, "メッセージ"); }).not.toThrow();
    });

    test("【型判定の検証】型も名前も完全に異なるエラーに対する Ass.test の挙動判定", () => {
        const fn = () => { throw new TotallyDifferentError("メッセージ"); };

        let errTest = null;
        try {
            Ass.test(fn, CustomTestError, "メッセージ");
        } catch (e) {
            errTest = e;
        }
        expect(errTest).not.toBeNull();
        expect(errTest.constructor?.name).toBe("TestFailureError"); 
        expect(errTest.message).toBe(`エラーの型または名前が一致しません。
期待値: Class [CustomTestError] (name: "CustomTestError")
実際値: Class [TotallyDifferentError] (name: "TotallyDifferentError")`);
    });

    test("【異常系：共通】例外自体が発生しなかった場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const noThrowFn = () => {};
        
        let errT = null;
        try { Ass.test(noThrowFn, CustomTestError, "メッセージ"); } catch (e) { errT = e; }
        expect(errT).not.toBeNull();
        expect(errT.constructor?.name).toBe("TestFailureError");
        expect(errT.message).toBe("例外発生が期待された所で発生しませんでした。: CustomTestError");

        let errS = null;
        try { Ass.same(noThrowFn, CustomTestError, "メッセージ"); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS.constructor?.name).toBe("TestFailureError");
        expect(errS.message).toBe("例外発生が期待された所で発生しませんでした。: CustomTestError");

        let errR = null;
        try { Ass.realm(noThrowFn, CustomTestError, "メッセージ"); } catch (e) { errR = e; }
        expect(errR).not.toBeNull();
        expect(errR.constructor?.name).toBe("TestFailureError");
        expect(errR.message).toBe("例外発生が期待された所で発生しませんでした。: CustomTestError");
    });

    test("【異常系：共通】メッセージが不一致の場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const fn = () => { throw new CustomTestError("実際のメッセージ"); };
        
        let errT = null;
        try { Ass.test(fn, CustomTestError, "期待するメッセージ"); } catch (e) { errT = e; }
        expect(errT).not.toBeNull();
        expect(errT.constructor?.name).toBe("TestFailureError");
        expect(errT.message).toBe(`エラーメッセージが一致しません。
期待値: 期待するメッセージ
実際値: 実際のメッセージ`);

        let errS = null;
        try { Ass.same(fn, CustomTestError, "期待するメッセージ"); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS.constructor?.name).toBe("TestFailureError");
        expect(errS.message).toBe(`エラーメッセージが一致しません。
期待値: 期待するメッセージ
実際値: 実際のメッセージ`);

        let errR = null;
        try { Ass.realm(fn, CustomTestError, "期待するメッセージ"); } catch (e) { errR = e; }
        expect(errR).not.toBeNull();
        expect(errR.constructor?.name).toBe("TestFailureError");
        // 💡 修正：タイポ（.`）から（`。`）へ修正
        expect(errR.message).toBe(`エラーメッセージが一致しません。
期待値: 期待するメッセージ
実際値: 実際のメッセージ`);
    });

    test("【正常系：共通】動的メッセージ（関数形式）および正規表現が正しく評価されること", () => {
        const fn = (v) => { throw new CustomTestError(`値 ${v} のエラー`); };
        expect(() => { Ass.test(() => fn(99), CustomTestError, (v) => `値 ${v} のエラー`, 99); }).not.toThrow();
        expect(() => { Ass.same(() => fn(99), CustomTestError, (v) => `値 ${v} のエラー`, 99); }).not.toThrow();
        expect(() => { Ass.realm(() => fn(99), CustomTestError, (v) => `値 ${v} のエラー`, 99); }).not.toThrow();
        expect(() => { Ass.test(() => fn(99), CustomTestError, /値 \d+ のエラー/); }).not.toThrow();
        expect(() => { Ass.same(() => fn(99), CustomTestError, /値 \d+ のエラー/); }).not.toThrow();
        expect(() => { Ass.realm(() => fn(99), CustomTestError, /値 \d+ のエラー/); }).not.toThrow();
    });

    test("【異常系：共通】メッセージが正規表現にマッチしない場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const fn = () => { throw new CustomTestError("ミスマッチなメッセージ"); };
        const pattern = /期待するパターン/;

        let errT = null;
        try { Ass.test(fn, CustomTestError, pattern); } catch (e) { errT = e; }
        expect(errT).not.toBeNull();
        expect(errT.constructor?.name).toBe("TestFailureError");
        expect(errT.message).toBe(`エラーメッセージが正規表現にマッチしません。
期待値: ${pattern}
実際値: ミスマッチなメッセージ`);

        let errS = null;
        try { Ass.same(fn, CustomTestError, pattern); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS.constructor?.name).toBe("TestFailureError");
        expect(errS.message).toBe(`エラーメッセージが正規表現にマッチしません。
期待値: ${pattern}
実際値: ミスマッチなメッセージ`);

        let errR = null;
        try { Ass.realm(fn, CustomTestError, pattern); } catch (e) { errR = e; }
        expect(errR).not.toBeNull();
        expect(errR.constructor?.name).toBe("TestFailureError");
        expect(errR.message).toBe(`エラーメッセージが正規表現にマッチしません。
期待値: ${pattern}
実際値: ミスマッチなメッセージ`);
    });
});

// ──────────────────────────────────────────────────
// 🧪 テスト対象となる動的例外発生ダミー関数
// ──────────────────────────────────────────────────
function dummyFunc(...args) {
    if (args.length === 0) throw new TypeError("引数がありません");
    // 💡 修正：完全にデグレを修正し、配列から最初の引数を正しく抽出する
    const first = args[0];
    if (typeof first === "number") throw new TypeError(`数値 ${first} は無効です`);
    if (first && typeof first === "object") throw new TypeError(`オブジェクトのエラー: ${first.msg}`);
    if (first === "") throw new TypeError("空文字は無効です");
}

// ──────────────────────────────────────────────────
// 🧪 Errクラスの全メソッドの駆動検証
// ──────────────────────────────────────────────────
describe("Err クラスの全API正常系実戦駆動テスト", () => {
    
    // 1. Err.test の網羅検証
    Err.test("Err.test - 単発", () => dummyFunc(), TypeError, "引数がありません");
    Err.test("Err.test - 二次元配列", (v) => dummyFunc(v), TypeError, (v) => `数値 ${v} は無効です`, [[0], [100]]);
    // 💡 修正：期待値のデータ構造を、テスト用のオブジェクト（エラーA, エラーB）に完全一致させる
    Err.test("Err.test - オブジェクト配列", (item) => dummyFunc(item), TypeError, (item) => `オブジェクトのエラー: ${item.msg}`, [{ msg: "エラーA" }, { msg: "エラーB" }]);
    Err.test("Err.test - プリミティブ配列", (v) => dummyFunc(v), TypeError, "空文字は無効です", [""]);

    // 2. Err.same の網羅検証
    Err.same("Err.same - 単発", () => dummyFunc(), TypeError, "引数がありません");
    Err.same("Err.same - 二次元配列", (v) => dummyFunc(v), TypeError, (v) => `数値 ${v} は無効です`, [[0], [100]]);
    Err.same("Err.same - オブジェクト配列", (item) => dummyFunc(item), TypeError, (item) => `オブジェクトのエラー: ${item.msg}`, [{ msg: "エラーA" }, { msg: "エラーB" }]);
    Err.same("Err.same - プリミティブ配列", (v) => dummyFunc(v), TypeError, "空文字は無効です", [""]);

    // 3. Err.realm の網羅検証
    Err.realm("Err.realm - 単発", () => dummyFunc(), TypeError, "引数がありません");
    Err.realm("Err.realm - 二次元配列", (v) => dummyFunc(v), TypeError, (v) => `数値 ${v} は無効です`, [[0], [100]]);
    Err.realm("Err.realm - オブジェクト配列", (item) => dummyFunc(item), TypeError, (item) => `オブジェクトのエラー: ${item.msg}`, [{ msg: "エラーA" }, { msg: "エラーB" }]);
    Err.realm("Err.realm - プリミティブ配列", (v) => dummyFunc(v), TypeError, "空文字は無効です", [""]);
});

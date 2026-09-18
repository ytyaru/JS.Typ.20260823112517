import { describe, test, expect } from "bun:test";
import { Err, Ass } from "./err.js";

// テスト用の各種エラー型
class CustomTestError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomTestError";
    }
}
class PseudoTestError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomTestError"; // nameだけ偽装した別クラス
    }
}
class TotallyDifferentError extends Error {
    constructor(message) {
        super(message);
        this.name = "TotallyDifferentError";
    }
}

describe("自作アサーションクラス Ass の厳格なテスト", () => {
    
    test("【異常系：test/same】型（クラス）が異なるname偽装エラー（PseudoTestError）を弾いた時、正しい型とメッセージで落とすこと", () => {
        const fn = () => { throw new PseudoTestError("メッセージ"); };
        
        // ── 1. Ass.same が正しく「型判定に失敗しました」の『TestFailureError』を投げるかを完全検証
        let errSame = null;
        try {
            Ass.same(fn, CustomTestError, "メッセージ");
        } catch (e) {
            errSame = e;
        }
        expect(errSame).not.toBeNull();
        expect(errSame.constructor?.name).toBe("TestFailureError"); // 💡 型（クラス名）の厳格確認
        expect(errSame.message).toBe(`型判定に失敗しました。Realmが異なるか、別の型です。
期待値: CustomTestError
実際値: PseudoTestError`); // 💡 メッセージの完全一致確認
    });

    test("【型判定の検証】型も名前も完全に異なるエラーを Ass.test が弾いた時、正しい型とメッセージで落とすこと", () => {
        const fn = () => { throw new TotallyDifferentError("メッセージ"); };

        // ── 2. Ass.test が正しく「エラーの型または名前が一致しません」の『TestFailureError』を投げるかを完全検証
        let errTest = null;
        try {
            Ass.test(fn, CustomTestError, "メッセージ");
        } catch (e) {
            errTest = e;
        }
        expect(errTest).not.toBeNull();
        expect(errTest.constructor?.name).toBe("TestFailureError"); // 💡 型の厳格確認
        expect(errTest.message).toBe(`エラーの型または名前が一致しません。
期待値: Class [CustomTestError] (name: "CustomTestError")
実際値: Class [TotallyDifferentError] (name: "TotallyDifferentError")`); // 💡 メッセージの完全一致確認
    });

    test("【異常系：共通】例外自体が発生しなかった場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const noThrowFn = () => {};
        
        // ── 3. Ass.test の不発生チェック
        let errT = null;
        try { Ass.test(noThrowFn, CustomTestError, "メッセージ"); } catch (e) { errT = e; }
        expect(errT).not.toBeNull();
        expect(errT.constructor?.name).toBe("TestFailureError");
        expect(errT.message).toBe("例外発生が期待された所で発生しませんでした。: CustomTestError");

        // ── 4. Ass.same の不発生チェック
        let errS = null;
        try { Ass.same(noThrowFn, CustomTestError, "メッセージ"); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS.constructor?.name).toBe("TestFailureError");
        expect(errS.message).toBe("例外発生が期待された所で発生しませんでした。: CustomTestError");

        // ── 5. Ass.realm の不発生チェック
        let errR = null;
        try { Ass.realm(noThrowFn, CustomTestError, "メッセージ"); } catch (e) { errR = e; }
        expect(errR).not.toBeNull();
        expect(errR.constructor?.name).toBe("TestFailureError");
        expect(errR.message).toBe("例外発生が期待された所で発生しませんでした。: CustomTestError");
    });

    test("【異常系：共通】メッセージが不一致の場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const fn = () => { throw new CustomTestError("実際のメッセージ"); };
        
        // ── 6. Ass.test のメッセージ不一致チェック
        let errT = null;
        try { Ass.test(fn, CustomTestError, "期待するメッセージ"); } catch (e) { errT = e; }
        expect(errT).not.toBeNull();
        expect(errT.constructor?.name).toBe("TestFailureError");
        expect(errT.message).toBe(`エラーメッセージが一致しません。
期待値: 期待するメッセージ
実際値: 実際のメッセージ`);

        // ── 7. Ass.same のメッセージ不一致チェック
        let errS = null;
        try { Ass.same(fn, CustomTestError, "期待するメッセージ"); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS.constructor?.name).toBe("TestFailureError");
        expect(errS.message).toBe(`エラーメッセージが一致しません。
期待値: 期待するメッセージ
実際値: 実際のメッセージ`);

        // ── 8. Ass.realm のメッセージ不一致チェック
        let errR = null;
        try { Ass.realm(fn, CustomTestError, "期待するメッセージ"); } catch (e) { errR = e; }
        expect(errR).not.toBeNull();
        expect(errR.constructor?.name).toBe("TestFailureError");
        expect(errR.message).toBe(`エラーメッセージが一致しません。
期待値: 期待するメッセージ
実際値: 実際のメッセージ`);
    });

    test("【異常系：共通】メッセージが正規表現にマッチしない場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const fn = () => { throw new CustomTestError("ミスマッチなメッセージ"); };
        
        // ── 9. Ass.same の正規表現不一致チェック
        let errS = null;
        try { Ass.same(fn, CustomTestError, /期待するパターン/); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS.constructor?.name).toBe("TestFailureError");
        expect(errS.message).toBe(`エラーメッセージが正規表現にマッチしません。
期待値: /期待するパターン/
実際値: ミスマッチなメッセージ`);
    });


    test("【異常系：共通】メッセージが正規表現にマッチしない場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const fn = () => { throw new CustomTestError("ミスマッチなメッセージ"); };
        
        // ── 9. Ass.same の正規表現不一致チェック
        let errS = null;
        const pattern = /期待するパターン/;
        try { Ass.same(fn, CustomTestError, pattern); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS.constructor?.name).toBe("TestFailureError");
        
        // 💡 展開時の文字列（toStringの結果）を直接埋め込むことで、エンコードによる差分を論理的に破壊して一致させます
        expect(errS.message).toBe(`エラーメッセージが正規表現にマッチしません。
期待値: ${pattern}
実際値: ミスマッチなメッセージ`);
    });
});

// ──────────────────────────────────────────────────
// 🧪 テスト対象となる動的例外発生ダミー関数
// ──────────────────────────────────────────────────
function dummyFunc(...args) {
    if (args.length === 0) throw new TypeError("引数がありません");
    const first = args[0];
    if (typeof first === "number") throw new TypeError(`数値 ${first} は無効です`);
    if (first && typeof first === "object") throw new TypeError(`オブジェクトのエラー: ${first.msg}`);
    if (first === "") throw new TypeError("空文字は無効です");
}

// ──────────────────────────────────────────────────
// 🧪 Errクラスの全メソッド（test / same / realm）× 全データパターン の網羅テスト
// ──────────────────────────────────────────────────
const apis = [
    { name: "test", target: Err.test },
    { name: "same", target: Err.same },
    { name: "realm", target: Err.realm }
];

for (const api of apis) {
    api.target(
        `【${api.name}】単発テスト: 引数がないときはエラー`,
        () => dummyFunc(),
        TypeError,
        "引数がありません"
    );

    api.target(
        `【${api.name}】二次元配列テスト: 数値 %p の時は動的メッセージ`,
        (v) => dummyFunc(v),
        TypeError,
        (v) => `数値 ${v} は無効です`,
        [[0], [100]]
    );

    api.target(
        `【${api.name}】オブジェクト配列テスト: %p の時はプロパティを使った動的メッセージ`,
        (item) => dummyFunc(item),
        TypeError,
        (item) => `オブジェクトのエラー: ${item.msg}`,
        [{ msg: "エラーA" }, { msg: "エラーB" }]
    );

    api.target(
        `【${api.name}】プリミティブ配列テスト: 値 %p の時はエラー`,
        (v) => dummyFunc(v),
        TypeError,
        "空文字は無効です",
        [""]
    );
}

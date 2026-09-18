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
        
        expect(() => {
            Ass.same(fn, CustomTestError, "メッセージ");
        }).toThrow(/型判定に失敗しました。/);

        expect(() => {
            Ass.test(fn, CustomTestError, "メッセージ");
        }).not.toThrow();

        expect(() => {
            Ass.realm(fn, CustomTestError, "メッセージ");
        }).not.toThrow();
    });

    test("【型判定の検証】型も名前も完全に異なるエラーに対する Ass.test の挙動判定", () => {
        const fn = () => { throw new TotallyDifferentError("メッセージ"); };

        expect(() => {
            Ass.test(fn, CustomTestError, "メッセージ");
        }).toThrow(/エラーの型または名前が一致しません。/);
    });

    test("【異常系：共通】例外自体が発生しなかった場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const noThrowFn = () => {};
        const patterns = [Ass.test, Ass.same, Ass.realm];
        
        for (const assMethod of patterns) {
            let err = null;
            try { assMethod(noThrowFn, CustomTestError, "メッセージ"); } catch (e) { err = e; }
            expect(err).not.toBeNull();
            expect(err.constructor?.name).toBe("TestFailureError");
            expect(err.message).toBe("例外発生が期待された所で発生しませんでした。: CustomTestError");
        }
    });

    test("【異常系：共通】メッセージが不一致の場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const fn = () => { throw new CustomTestError("実際のメッセージ"); };
        const patterns = [Ass.test, Ass.same, Ass.realm];
        
        for (const assMethod of patterns) {
            let err = null;
            try { assMethod(fn, CustomTestError, "期待するメッセージ"); } catch (e) { err = e; }
            expect(err).not.toBeNull();
            expect(err.constructor?.name).toBe("TestFailureError");
            expect(err.message).toBe(`エラーメッセージが一致しません。
期待値: 期待するメッセージ
実際値: 実際のメッセージ`);
        }
    });

    test("【正常系：共通】動的メッセージ（関数形式）および正規表現が正しく評価されること", () => {
        const fn = (v) => { throw new CustomTestError(`値 ${v} のエラー`); };
        const patterns = [Ass.test, Ass.same, Ass.realm];
        
        for (const assMethod of patterns) {
            expect(() => {
                assMethod(() => fn(99), CustomTestError, (v) => `値 ${v} のエラー`, 99);
            }).not.toThrow();

            expect(() => {
                assMethod(() => fn(99), CustomTestError, /値 \d+ のエラー/);
            }).not.toThrow();
        }
    });

    test("【異常系：共通】メッセージが正規表現にマッチしない場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const fn = () => { throw new CustomTestError("ミスマッチなメッセージ"); };
        const pattern = /期待するパターン/;

        // 1. Ass.test
        let errT = null;
        try { Ass.test(fn, CustomTestError, pattern); } catch (e) { errT = e; }
        expect(errT).not.toBeNull();
        expect(errT.constructor?.name).toBe("TestFailureError");
        expect(errT.message).toBe(`エラーメッセージが正規表現にマッチしません。
期待値: ${pattern}
実際値: ミスマッチなメッセージ`);

        // 2. Ass.same
        let errS = null;
        try { Ass.same(fn, CustomTestError, pattern); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS.constructor?.name).toBe("TestFailureError");
        expect(errS.message).toBe(`エラーメッセージが正規表現にマッチしません。
期待値: ${pattern}
実際値: ミスマッチなメッセージ`);

        // 3. Ass.realm
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
    // 💡 決定的な修正：配列そのものではなく、最初の要素を正しく抽出する
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
        [[0], [100]] // 💡 修正：前回の再出力時に [,] と削られていたデータを正常なネスト配列に戻す
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

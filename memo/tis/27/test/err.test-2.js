import { describe, test, expect } from "bun:test";
import { Err, Ass } from "./err.js";

// テスト用のダミーエラー（Realm問題を模した、nameだけ同じ別型も用意）
class CustomTestError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomTestError";
    }
}
class PseudoTestError extends Error {
    constructor(message) {
        super(message);
        this.name = "CustomTestError"; // 💡 nameだけ偽装した別クラス（Realm差異やバグの模倣）
    }
}

describe("自作アサーションクラス Ass の厳格なテスト", () => {
    
    test("【正常系】Bunの標準APIを用いた型（クラス）とメッセージの『酷く冗長な』完全検証の証明", () => {
        const fn = () => { throw new CustomTestError("エラーメッセージ"); };
        
        // ── Bunの標準APIだけで厳格に縛ろうとすると、このように個別に例外をトラップして書かざるを得ない
        expect(() => {
            let err = null;
            try { fn(); } catch (e) { err = e; }
            
            expect(err).not.toBeNull();
            expect(err).toBeInstanceOf(CustomTestError); // 厳格な型（クラスプロトタイプ）の確認
            expect(err.message).toBe("エラーメッセージ"); // メッセージの完全一致確認
        }).not.toThrow();
    });

    test("【異常系：test/same】型（クラス）が異なる場合、手作りの name 偽装エラー（PseudoTestError）を確実に型判定で弾くこと", () => {
        const fn = () => { throw new PseudoTestError("メッセージ"); };
        
        // 1. Ass.same は厳格に instanceof を見るので、nameが同じ（CustomTestError）でもクラスが違えば確実に弾く
        expect(() => {
            Ass.same(fn, CustomTestError, "メッセージ");
        }).toThrow(/型判定に失敗しました。/);

        // 2. Ass.test も基本は厳格判定なので、これも偽装を弾く
        expect(() => {
            Ass.test(fn, CustomTestError, "メッセージ");
        }).toThrow(/エラーの型も名前も一致しません。/);
    });

    test("【正常系：realm】Realm差異用APIは、クラス型（プロトタイプ）が違っても name 文字列とメッセージが合致すれば救済すること", () => {
        const fn = () => { throw new PseudoTestError("メッセージ"); };
        
        // Ass.realm はプロトタイプを無視し、name文字列（"CustomTestError"）の一致で救済（合格）とする
        expect(() => {
            Ass.realm(fn, CustomTestError, "メッセージ");
        }).not.toThrow();
    });

    test("【異常系：共通】例外自体が発生しなかった場合、TestFailureErrorを投げること", () => {
        const noThrowFn = () => {};
        const patterns = [Ass.test, Ass.same, Ass.realm];
        
        for (const assMethod of patterns) {
            expect(() => {
                assMethod(noThrowFn, CustomTestError, "メッセージ");
            }).toThrow(/例外発生が期待された所で発生しませんでした。: CustomTestError/);
        }
    });

    test("【異常系：共通】メッセージが不一致の場合、全APIがTestFailureErrorを投げること", () => {
        const fn = () => { throw new CustomTestError("実際のメッセージ"); };
        const patterns = [Ass.test, Ass.same, Ass.realm];
        
        for (const assMethod of patterns) {
            expect(() => {
                assMethod(fn, CustomTestError, "期待するメッセージ");
            }).toThrow(/エラーメッセージが一致しません。/);
        }
    });

    test("【正常系：共通】動的メッセージ（関数形式）および正規表現が正しく評価されること", () => {
        const fn = (v) => { throw new CustomTestError(`値 ${v} のエラー`); };
        const patterns = [Ass.test, Ass.same, Ass.realm];
        
        for (const assMethod of patterns) {
            // 関数形式での検証
            expect(() => {
                assMethod(() => fn(99), CustomTestError, (v) => `値 ${v} のエラー`, 99);
            }).not.toThrow();

            // 正規表現での検証
            expect(() => {
                assMethod(() => fn(99), CustomTestError, /値 \d+ のエラー/);
            }).not.toThrow();
        }
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
    { name: "test", target: Err.test.bind(Err) },
    { name: "same", target: Err.same.bind(Err) },
    { name: "realm", target: Err.realm.bind(Err) }
];

// すべてのAPI（test, same, realm）に対して、全く同じ4パターンの記述がいかに短く書けるかを実証する
for (const api of apis) {
    
    // 1. 単発テストの検証
    api.target(
        `【${api.name}】単発テスト: 引数がないときはエラー`,
        () => dummyFunc(),
        TypeError,
        "引数がありません"
    );

    // 2. 二次元（ネスト）配列の検証 [ [], [] ]
    api.target(
        `【${api.name}】二次元配列テスト: 数値 %p の時は動的メッセージ`,
        (v) => dummyFunc(v),
        TypeError,
        (v) => `数値 ${v} は無効です`,
        [[0], [100]]
    );

    // 3. オブジェクト配列の検証 [ {}, {} ]
    api.target(
        `【${api.name}】オブジェクト配列テスト: %p の時はプロパティを使った動的メッセージ`,
        (item) => dummyFunc(item),
        TypeError,
        (item) => `オブジェクトのエラー: ${item.msg}`,
        [{ msg: "エラーA" }, { msg: "エラーB" }]
    );

    // 4. プリミティブ（1次元）配列の検証 [ '', '' ]
    api.target(
        `【${api.name}】プリミティブ配列テスト: 値 %p の時はエラー`,
        (v) => dummyFunc(v),
        TypeError,
        "空文字は無効です",
        [""]
    );
}


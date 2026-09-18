import { describe, test, expect } from "bun:test";
import { Err,Ass } from "./err.js"; // 自作API

describe("自作アサーションクラス Ass の厳格なテスト", () => {
    
    test("【正常系】期待した型とメッセージが一致すれば、例外を投げずに通過すること", () => {
        const fn = () => { throw new TypeError("エラーメッセージ"); };
        
        // 例外が発生しなければパス
        expect(() => {
            Ass.same(fn, TypeError, "エラーメッセージ");
        }).not.toThrow();
    });

    test("【異常系】例外自体が発生しなかった場合、TestFailureErrorを投げること", () => {
        const noThrowFn = () => { /* 何もしない */ };
        
        expect(() => {
            Ass.same(noThrowFn, TypeError, "エラーメッセージ");
        }).toThrow(/例外発生が期待された所で発生しませんでした。: TypeError/);
    });

    test("【異常系】型（クラス）が異なる場合、厳格な型判定(same)でTestFailureErrorを投げること", () => {
        const fn = () => { throw new RangeError("メッセージ"); };
        
        expect(() => {
            Ass.same(fn, TypeError, "メッセージ");
        }).toThrow(/型判定に失敗しました。/);
    });

    test("【異常系】型は合っているがメッセージが不一致の場合、TestFailureErrorを投げること", () => {
        const fn = () => { throw new TypeError("実際のメッセージ"); };
        
        expect(() => {
            Ass.same(fn, TypeError, "期待するメッセージ");
        }).toThrow(/エラーメッセージが一致しません。/);
    });

    test("【正常系】動的メッセージ（関数形式）が正しく評価されること", () => {
        const fn = (v) => { throw new TypeError(`値 ${v} のエラー`); };
        
        expect(() => {
            // 引数 99 をシミュレートして検証
            Ass.same(() => fn(99), TypeError, (v) => `値 ${v} のエラー`, 99);
        }).not.toThrow();
    });
});


// テスト対象のダミー関数（引数によって動的にエラーを投げる）
function dummyFunc(...args) {
    if (args.length === 0) {
        throw new TypeError("引数がありません");
    }
    
    const first = args[0];
    
    // パターン1: ネスト配列 [0] などのケース
    if (typeof first === "number") {
        throw new TypeError(`数値 ${first} は無効です`);
    }
    
    // パターン2: オブジェクト配列 [{ val: '' }] などのケース
    if (first && typeof first === "object") {
        throw new TypeError(`オブジェクトのエラー: ${first.msg}`);
    }
    
    // パターン3: プリミティブ配列 [''] などのケース
    if (first === "") {
        throw new TypeError("空文字は無効です");
    }
}

// ──────────────────────────────────────────────────
// 🧪 このテストAPI自身をテストする
// ──────────────────────────────────────────────────

// 1. 単発テストの検証
Err.same(
    "単発テスト: 引数がないときはエラー",
    () => dummyFunc(),
    TypeError,
    "引数がありません"
);

// 2. 二次元（ネスト）配列の検証 [ [], [] ]
Err.same(
    "二次元配列テスト: 数値 %p の時は動的メッセージ",
    (v) => dummyFunc(v),
    TypeError,
    (v) => `数値 ${v} は無効です`,
    [[0], [100]] // 内部で fn(0), fn(100) としてバラされて実行される
);

// 3. オブジェクト配列の検証 [ {}, {} ]
Err.same(
    "オブジェクト配列テスト: %p の時はプロパティを使った動的メッセージ",
    (item) => dummyFunc(item),
    TypeError,
    (item) => `オブジェクトのエラー: ${item.msg}`,
    [
        { msg: "エラーA" },
        { msg: "エラーB" }
    ] // 内部で要素が丸ごと1引数として fn(item) に渡る
);

// 4. プリミティブ（1次元）配列の検証 [ '', '' ]
Err.same(
    "プリミティブ配列テスト: 値 %p の時はエラー",
    (v) => dummyFunc(v),
    TypeError,
    "空文字は無効です",
    [""] // 内部で fn("") として渡る
);


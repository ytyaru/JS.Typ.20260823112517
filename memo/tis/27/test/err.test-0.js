import { Err } from "./err.js"; // 上記のファイルをインポート

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


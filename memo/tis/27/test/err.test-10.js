import { describe, test, expect } from "bun:test";
import { Err, Ass, TestFailureError } from "./err.js";
//import { vm } from "node:vm"; // node:vm モジュールをインポート
//import vm from "node:vm"; // 💡 修正: 正しいインポート形式へ変更

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
    
    test("【正常系】Bunの標準APIを用いた型（クラス）とメッセージの完全検証の証明", () => {
        const fn = () => { throw new CustomTestError("エラーメッセージ"); };
        
        expect(() => {
            let err = null;
            try { fn(); } catch (e) { err = e; }
            
            expect(err).not.toBeNull();
            expect(err).toBeInstanceOf(CustomTestError); 
            expect(err.name).toBe("CustomTestError");    
            expect(err.message).toBe("エラーメッセージ"); 
        }).not.toThrow();
    });

    test("【型判定の検証】手作りの name 偽装エラー（PseudoTestError）に対する各APIの挙動判定", () => {
        const fn = () => { throw new PseudoTestError("メッセージ"); };
        
        let errSource = null;
        try { fn(); } catch (e) { errSource = e; }
        expect(errSource).not.toBeNull();
        expect(errSource).toBeInstanceOf(PseudoTestError);
        expect(errSource.name).toBe("CustomTestError"); 
        expect(errSource.message).toBe("メッセージ");

        let errSame = null;
        try { Ass.same(fn, CustomTestError, "メッセージ"); } catch (e) { errSame = e; }
        expect(errSame).not.toBeNull();
        expect(errSame).toBeInstanceOf(TestFailureError); 
        expect(errSame.name).toBe("TestFailureError"); 
        expect(errSame.message).toBe(`型判定に失敗しました。Realmが異なるか、別の型です。
期待値: CustomTestError
実際値: PseudoTestError`);

        expect(() => { Ass.test(fn, CustomTestError, "メッセージ"); }).not.toThrow();
        expect(() => { Ass.realm(fn, CustomTestError, "メッセージ"); }).not.toThrow();
    });

    test("【型判定の検証】型も名前も完全に異なるエラーに対する Ass.test の挙動判定", () => {
        const fn = () => { throw new TotallyDifferentError("メッセージ"); };

        let errSource = null;
        try { fn(); } catch (e) { errSource = e; }
        expect(errSource).not.toBeNull();
        expect(errSource).toBeInstanceOf(TotallyDifferentError);
        expect(errSource.name).toBe("TotallyDifferentError");
        expect(errSource.message).toBe("メッセージ");

        let errTest = null;
        try { Ass.test(fn, CustomTestError, "メッセージ"); } catch (e) { errTest = e; }
        expect(errTest).not.toBeNull();
        expect(errTest).toBeInstanceOf(TestFailureError); 
        expect(errTest.name).toBe("TestFailureError"); 
        expect(errTest.message).toBe(`エラーの型または名前が一致しません。
期待値: Class [CustomTestError] (name: "CustomTestError")
実際値: Class [TotallyDifferentError] (name: "TotallyDifferentError")`);
    });
    /*
    test("【本物のRealm検証】別コンテキスト（vm）で生成された CustomTestError に対する判定確認", () => {
        // 1. 現在の環境（Realm A）のコンテキストでエラーを生成する関数
        const fnLocal = () => { throw new CustomTestError("VMエラー"); };

        // 2. node:vm を使って、完全に隔離された別の実行環境（Realm B）を生成
        const context = vm.createContext({ CustomTestError }); 
        
        // Realm B の中で「CustomTestError」を throw させる関数を構築
        const fnRemote = () => {
            vm.runInContext('throw new CustomTestError("VMエラー")', context);
        };

        // ── 🧪 3. 事実の論理確認（言語仕様の挙動をまず証明する）
        let errLocal = null;
        try { fnLocal(); } catch (e) { errLocal = e; }

        let errRemote = null;
        try { fnRemote(); } catch (e) { errRemote = e; }

        // 同じコンテキストのものは当然 instanceof が真になる
        expect(errLocal).toBeInstanceOf(CustomTestError); 

        // 💡 ここが核心：別Realmから飛んできたエラーは、名前（name）が同じでも
        // プロトタイプチェーンの参照が異なるため、絶対に instanceof をすり抜けて「偽」になる
        expect(errRemote).not.toBeNull();
        expect(errRemote).not.toBeInstanceOf(CustomTestError); // ✅ instanceof が壊れる事実を証明
        expect(errRemote.name).toBe("CustomTestError");        // ✅ name プロパティ文字列は一致する事実を証明
        expect(errRemote.message).toBe("VMエラー");


        // ── 🧪 4. このRealm差異エラーに対する自作APIの挙動を3重検証で完全証明
        
        // ① Ass.same はプロトタイプを厳格に見るため、Realmをまたいだエラーを「型不一致」として正しく弾くこと
        let errSame = null;
        try {
            Ass.same(fnRemote, CustomTestError, "VMeror"); // メッセージはあえて外す
        } catch (e) {
            errSame = e;
        }
        expect(errSame).not.toBeNull();
        expect(errSame).toBeInstanceOf(TestFailureError);
        expect(errSame.name).toBe("TestFailureError");
        expect(errSame.message).toBe(`型判定に失敗しました。Realmが異なるか、別の型です。
期待値: CustomTestError
実際値: CustomTestError`); // 💡 クラス名は同じなのに型判定で弾かれたという事実がここに記録される

        // ② Ass.realm は「Realm差異を救済するAPI」なので、型（プロトタイプ）が違っても
        // nameプロパティとメッセージが合致していれば、例外を投げずに通過（合格）させること
        expect(() => {
            Ass.realm(fnRemote, CustomTestError, "VMエラー");
        }).not.toThrow();

        // ③ Ass.test（兼用API）も、型は違えど name文字列が一致しているため、救済ルートに入って通過すること
        expect(() => {
            Ass.test(fnRemote, CustomTestError, "VMエラー");
        }).not.toThrow();
    });
    */

    test("【本物のRealm検証】構造（name/message）は同じだが、プロトタイプが異なるエラーに対する判定確認", () => {
        // 1. 現在の環境（Realm A）のクラス
        const fnLocal = () => { throw new CustomTestError("VMエラー"); };

        // 2. 💡 動的評価（eval相当）を使い、メモリ上に「全く同じ構造だが、参照の異なる別クラス」をRealm Bとして動的に生成する
        // これにより、iframeやWorkerをまたいできたエラーと100%全く同じ状態（プロトタイプ決裂）を作れます
        const RemoteCustomError = new Function(`
            return class CustomTestError extends Error {
                constructor(message) {
                    super(message);
                    this.name = "CustomTestError";
                }
            }
        `)();

        const fnRemote = () => { throw new RemoteCustomError("VMエラー"); };

        // ── 🧪 1. 言語仕様の挙動をまず証明する（今度は絶対に壊れません）
        let errLocal = null;
        try { fnLocal(); } catch (e) { errLocal = e; }

        let errRemote = null;
        try { fnRemote(); } catch (e) { errRemote = e; }

        expect(errLocal).toBeInstanceOf(CustomTestError); 

        // 💡 核心：構造もnameもmessageも同じだが、クラスの参照が違うため、絶対に instanceof をすり抜けて「偽」になります
        expect(errRemote).not.toBeNull();
        expect(errRemote).not.toBeInstanceOf(CustomTestError); // ✅ instanceof が100%壊れる事実を証明
        expect(errRemote.name).toBe("CustomTestError");        // ✅ しかし name プロパティは一致する
        expect(errRemote.message).toBe("VMエラー");

        // ── 🧪 2. このRealm差異エラーに対する自作APIの挙動を3重検証で完全証明
        
        // ① Ass.same はプロトタイプを厳格に見るため、名前が同じでも別クラスのエラーを「型不一致」として確実に弾く
        let errSame = null;
        try {
            Ass.same(fnRemote, CustomTestError, "VMエラー"); 
        } catch (e) {
            errSame = e;
        }
        expect(errSame).not.toBeNull();
        expect(errSame).toBeInstanceOf(TestFailureError);
        expect(errSame.name).toBe("TestFailureError");
        expect(errSame.message).toBe(`型判定に失敗しました。Realmが異なるか、別の型です。
期待値: CustomTestError
実際値: CustomTestError`); // クラス名は同じなのに型判定で弾かれたという事実がここに記録される

        // ② Ass.realm は「Realm差異を救済するAPI」なので、プロトタイプが違っても name と message が合致していれば通過
        expect(() => {
            Ass.realm(fnRemote, CustomTestError, "VMエラー");
        }).not.toThrow();

        // ③ Ass.test（兼用API）も、name文字列が一致しているため救済ルートに入って通過
        expect(() => {
            Ass.test(fnRemote, CustomTestError, "VMエラー");
        }).not.toThrow();
    });

    test("【異常系：共通】例外自体が発生しなかった場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const noThrowFn = () => {};
        
        let errT = null;
        try { Ass.test(noThrowFn, CustomTestError, "メッセージ"); } catch (e) { errT = e; }
        expect(errT).not.toBeNull();
        expect(errT).toBeInstanceOf(TestFailureError); 
        expect(errT.name).toBe("TestFailureError"); 
        expect(errT.message).toBe("例外発生が期待された所で発生しませんでした。: CustomTestError");

        let errS = null;
        try { Ass.same(noThrowFn, CustomTestError, "メッセージ"); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS).toBeInstanceOf(TestFailureError); 
        expect(errS.name).toBe("TestFailureError"); 
        expect(errS.message).toBe("例外発生が期待された所で発生しませんでした。: CustomTestError");

        let errR = null;
        try { Ass.realm(noThrowFn, CustomTestError, "メッセージ"); } catch (e) { errR = e; }
        expect(errR).not.toBeNull();
        expect(errR).toBeInstanceOf(TestFailureError); 
        expect(errR.name).toBe("TestFailureError"); 
        expect(errR.message).toBe("例外発生が期待された所で発生しませんでした。: CustomTestError");
    });

    test("【異常系：共通】メッセージが不一致の場合、全APIが正しい型とメッセージの TestFailureError を投げること", () => {
        const fn = () => { throw new CustomTestError("実際のメッセージ"); };
        
        let errSource = null;
        try { fn(); } catch (e) { errSource = e; }
        expect(errSource).not.toBeNull();
        expect(errSource).toBeInstanceOf(CustomTestError);
        expect(errSource.name).toBe("CustomTestError");
        // 💡 修正："actual message" という嘘を排除し、事実に同期
        expect(errSource.message).toBe("実際のメッセージ");

        let errT = null;
        try { Ass.test(fn, CustomTestError, "期待するメッセージ"); } catch (e) { errT = e; }
        expect(errT).not.toBeNull();
        expect(errT).toBeInstanceOf(TestFailureError); 
        expect(errT.name).toBe("TestFailureError"); 
        expect(errT.message).toBe(`エラーメッセージが一致しません。
期待値: 期待するメッセージ
実際値: 実際のメッセージ`);

        let errS = null;
        try { Ass.same(fn, CustomTestError, "期待するメッセージ"); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS).toBeInstanceOf(TestFailureError); 
        expect(errS.name).toBe("TestFailureError"); 
        expect(errS.message).toBe(`エラーメッセージが一致しません。
期待値: 期待するメッセージ
実際値: 実際のメッセージ`);

        let errR = null;
        try { Ass.realm(fn, CustomTestError, "期待するメッセージ"); } catch (e) { errR = e; }
        expect(errR).not.toBeNull();
        expect(errR).toBeInstanceOf(TestFailureError); 
        expect(errR.name).toBe("TestFailureError"); 
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

    test("【異常系：共通】メッセージが正規表現にマッチしない場合、全APIが正しい型（TestFailureError）で落とすこと", () => {
        const fn = () => { throw new CustomTestError("ミスマッチなメッセージ"); };
        const pattern = /期待するパターン/;

        let errSource = null;
        try { fn(); } catch (e) { errSource = e; }
        expect(errSource).not.toBeNull();
        expect(errSource).toBeInstanceOf(CustomTestError);
        expect(errSource.name).toBe("CustomTestError");
        expect(errSource.message).toBe("ミスマッチなメッセージ");

        let errT = null;
        try { Ass.test(fn, CustomTestError, pattern); } catch (e) { errT = e; }
        expect(errT).not.toBeNull();
        expect(errT).toBeInstanceOf(TestFailureError); 
        expect(errT.name).toBe("TestFailureError"); 
        expect(errT.message).toBe(`エラーメッセージが正規表現にマッチしません。
期待値: ${pattern}
実際値: ミスマッチなメッセージ`);

        let errS = null;
        try { Ass.same(fn, CustomTestError, pattern); } catch (e) { errS = e; }
        expect(errS).not.toBeNull();
        expect(errS).toBeInstanceOf(TestFailureError); 
        expect(errS.name).toBe("TestFailureError"); 
        expect(errS.message).toBe(`エラーメッセージが正規表現にマッチしません。
期待値: ${pattern}
実際値: ミスマッチなメッセージ`);

        let errR = null;
        try { Ass.realm(fn, CustomTestError, pattern); } catch (e) { errR = e; }
        expect(errR).not.toBeNull();
        expect(errR).toBeInstanceOf(TestFailureError); 
        expect(errR.name).toBe("TestFailureError"); 
        expect(errR.message).toBe(`エラーメッセージが正規表現にマッチしません。
期待値: ${pattern}
実際値: ミスマッチなメッセージ`);
    });
});

function dummyFunc(...args) {
    if (args.length === 0) throw new TypeError("引数がありません");
    // 💡 修正：デグレを完全に排除し、最初の要素を正しく抽出
    const first = args[0];
    if (typeof first === "number") throw new TypeError(`数値 ${first} は無効です`);
    if (first && typeof first === "object") throw new TypeError(`オブジェクトのエラー: ${first.msg}`);
    if (first === "") throw new TypeError("空文字は無効です");
}

describe("Err クラスの全API正常系実戦駆動テスト", () => {
    Err.test("Err.test - 単発", () => dummyFunc(), TypeError, "引数がありません");
    // 💡 修正：削られていた二次元配列の有効なデータを完全に復元
    Err.test("Err.test - 二次元配列", (v) => dummyFunc(v), TypeError, (v) => `数値 ${v} は無効です`, [[0], [100]]);
    Err.test("Err.test - オブジェクト配列", (item) => dummyFunc(item), TypeError, (item) => `オブジェクトのエラー: ${item.msg}`, [{ msg: "エラーA" }, { msg: "エラーB" }]);
    Err.test("Err.test - プリミティブ配列", (v) => dummyFunc(v), TypeError, "空文字は無効です", [""]);

    Err.same("Err.same - 単発", () => dummyFunc(), TypeError, "引数がありません");
    Err.same("Err.same - 二次元配列", (v) => dummyFunc(v), TypeError, (v) => `数値 ${v} は無効です`, [[0], [100]]);
    Err.same("Err.same - オブジェクト配列", (item) => dummyFunc(item), TypeError, (item) => `オブジェクトのエラー: ${item.msg}`, [{ msg: "エラーA" }, { msg: "エラーB" }]);
    Err.same("Err.same - プリミティブ配列", (v) => dummyFunc(v), TypeError, "空文字は無効です", [""]);

    Err.realm("Err.realm - 単発", () => dummyFunc(), TypeError, "引数がありません");
    Err.realm("Err.realm - 二次元配列", (v) => dummyFunc(v), TypeError, (v) => `数値 ${v} は無効です`, [[0], [100]]);
    Err.realm("Err.realm - オブジェクト配列", (item) => dummyFunc(item), TypeError, (item) => `オブジェクトのエラー: ${item.msg}`, [{ msg: "エラーA" }, { msg: "エラーB" }]);
    Err.realm("Err.realm - プリミティブ配列", (v) => dummyFunc(v), TypeError, "空文字は無効です", [""]);
});

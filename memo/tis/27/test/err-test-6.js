import { test } from "bun:test";

class TestFailureError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestFailureError";
    }
}

/**
 * 純粋な例外検証（アサーション）を行うクラス
 */
export class Ass {
    static test(fn, ExpectedError, expectedMessage, ...args) {
        const err = this.#run(fn);
        this.#failThrow(err, ExpectedError);
        const expectedName = new ExpectedError().name;

        if (!(err instanceof ExpectedError) && err.name !== expectedName) {
            throw new TestFailureError(`エラーの型も名前も一致しません。
期待値: Class [${ExpectedError.name}] (name: "${expectedName}")
実際値: Class [${err.constructor?.name}] (name: "${err.name}")`);
        }
        this.#failMessage(err, expectedMessage, args);
    }

    static same(fn, ExpectedError, expectedMessage, ...args) {
        const err = this.#run(fn);
        this.#failThrow(err, ExpectedError);

        if (!(err instanceof ExpectedError)) {
            throw new TestFailureError(`型判定に失敗しました。Realmが異なるか、別の型です。
期待値: ${ExpectedError.name}
実際値: ${err.constructor?.name || "Unknown"}`);
        }
        this.#failMessage(err, expectedMessage, args);
    }

    static realm(fn, ExpectedError, expectedMessage, ...args) {
        const err = this.#run(fn);
        this.#failThrow(err, ExpectedError);
        const expectedName = new ExpectedError().name;

        if (err.name !== expectedName) {
            throw new TestFailureError(`Realmをまたいだ名前比較に失敗しました。
期待値: ${expectedName}
実際値: ${err.name}`);
        }
        this.#failMessage(err, expectedMessage, args);
    }

    static #run(fn) {
        let err = null;
        try { fn(); } catch (error) { err = error; }
        return err;
    }

    static #failThrow(err, ExpectedError) {
        if (err === null) {
            throw new TestFailureError(`例外発生が期待された所で発生しませんでした。: ${ExpectedError.name}`);
        }
    }

    static #failMessage(err, expectedMessage, args) {
        // ── 拡張: 期待値が関数の場合、テスト引数を渡して動的にメッセージを生成
        let targetExpect = expectedMessage;
        if (typeof expectedMessage === "function") {
            targetExpect = expectedMessage(...args);
        }

        if (targetExpect instanceof RegExp) {
            if (!targetExpect.test(err.message)) {
                throw new TestFailureError(`エラーメッセージが正規表現にマッチしません。
期待値: ${targetExpect}
実際値: ${err.message}`);
            }
        } else {
            if (err.message !== targetExpect) {
                throw new TestFailureError(`エラーメッセージが一致しません。
期待値: ${targetExpect}
実際値: ${err.message}`);
            }
        }
    }
}

/**
 * テスト宣言まで一括で行うクラス（単発・複数データ駆動の自動判別）
 */
export class Err {
    static test(title, fn, ExpectedError, expectedMessage, cases = null) {
        this.#execute(test.test, title, fn, ExpectedError, expectedMessage, cases);
    }

    static same(title, fn, ExpectedError, expectedMessage, cases = null) {
        this.#execute(test.same, title, fn, ExpectedError, expectedMessage, cases);
    }

    static realm(title, fn, ExpectedError, expectedMessage, cases = null) {
        this.#execute(test.realm, title, fn, ExpectedError, expectedMessage, cases);
    }

    // ── 内部で単発（test）と複数データ（test.each）を完全に自動切替 ──
    static #execute(assMethod, title, fn, ExpectedError, expectedMessage, cases) {
        // cases が配列であれば、中身が配列・オブジェクト・プリミティブに関わらず test.each で処理
        if (Array.isArray(cases)) {
            test.each(cases)(title, (...args) => {
                // 💡 引数の型（ケース）によって、fn へのデータの渡し方を最適化する
                const isNestedArray = Array.isArray(cases[0]);
                
                // ネスト配列 [ [], [] ] なら展開して渡す。
                // オブジェクト配列 [ {}, {} ] やプリミティブ配列 [ 1, 2 ] なら、
                // コールバックの第1引数（args[0]）にその要素が丸ごと入っているので、それをそのまま渡す。
                const targetFn = isNestedArray ? () => fn(...args) : () => fn(args[0]);

                assMethod(targetFn, ExpectedError, expectedMessage, ...args);
            });
        } else {
            // 通常の単発テスト
            test(title, () => assMethod(fn, ExpectedError, expectedMessage));
        }
    }
}


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

    // ── 内部で単発（test）と複数データ（test.each）をエレガントに自動切替 ──
    static #execute(assMethod, title, fn, ExpectedError, expectedMessage, cases) {
        // cases がネスト配列（[ [], [] ]）であれば test.each として処理
        if (Array.isArray(cases) && cases.every(Array.isArray)) {
            test.each(cases)(title, (...args) => {
                // テスト対象の関数（fn）にデータを流し込みつつ、アサーションへも args を伝播
                assMethod(() => fn(...args), ExpectedError, expectedMessage, ...args);
            });
        } else {
            // 通常の単発テスト
            test(title, () => assMethod(fn, ExpectedError, expectedMessage));
        }
    }
}


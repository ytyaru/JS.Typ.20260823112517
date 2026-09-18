import { test } from "bun:test";

class TestFailureError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestFailureError";
    }
}

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

export class Err {
    static test(title, fn, ExpectedError, expectedMessage, cases = null) {
        this.#execute(Ass.test.bind(Ass), title, fn, ExpectedError, expectedMessage, cases);
    }

    static same(title, fn, ExpectedError, expectedMessage, cases = null) {
        this.#execute(Ass.same.bind(Ass), title, fn, ExpectedError, expectedMessage, cases);
    }

    static realm(title, fn, ExpectedError, expectedMessage, cases = null) {
        this.#execute(Ass.realm.bind(Ass), title, fn, ExpectedError, expectedMessage, cases);
    }

    static #execute(assMethod, title, fn, ExpectedError, expectedMessage, cases) {
        if (cases !== null) {
            // ── 丁寧なエラーハンドリング: 渡されたデータが配列でない場合 ──
            if (!Array.isArray(cases)) {
                throw new Error("Err APIの引数エラー: casesには配列を渡す必要があります。");
            }
            // ── 丁寧なエラーハンドリング: 配列が空 [ ] の場合 ──
            if (cases.length === 0) {
                throw new Error("Err APIの引数エラー: cases配列が空です。テストデータが1件もありません。");
            }

            // 安全に最初の要素の型をチェックできる
            const isNestedArray = Array.isArray(cases[0]);

            // 二次元配列の場合の、中身の空チェックもケア
            if (isNestedArray && cases.some(c => c.length === 0)) {
                throw new Error("Err APIの引数エラー: cases内のネスト配列に空のもの（テストデータがない要素）が含まれています。");
            }

            test.each(cases)(title, (...args) => {
                const targetFn = isNestedArray ? () => fn(...args) : () => fn(args);
                assMethod(targetFn, ExpectedError, expectedMessage, ...args);
            });
        } else {
            test(title, () => assMethod(fn, ExpectedError, expectedMessage));
        }
    }
}


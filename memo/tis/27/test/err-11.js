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
    // 💡 cases = null から 未指定（undefined）での判定へ変更
    static test(title, fn, ExpectedError, expectedMessage, cases) {
        this.#execute(Ass.test.bind(Ass), title, fn, ExpectedError, expectedMessage, cases);
    }

    static same(title, fn, ExpectedError, expectedMessage, cases) {
        this.#execute(Ass.same.bind(Ass), title, fn, ExpectedError, expectedMessage, cases);
    }

    static realm(title, fn, ExpectedError, expectedMessage, cases) {
        this.#execute(Ass.realm.bind(Ass), title, fn, ExpectedError, expectedMessage, cases);
    }

    static #execute(assMethod, title, fn, ExpectedError, expectedMessage, cases) {
        // 💡 undefined でない（＝データが渡されている）場合
        if (cases !== undefined) {
            if (!Array.isArray(cases)) {
                throw new Error(`[Err API 不正利用] "${title}": casesには配列を渡す必要があります。`);
            }
            if (cases.length === 0) {
                throw new Error(`[Err API 不正利用] "${title}": cases配列が空です。テストデータが1件もありません。`);
            }

            // 二次元配列の場合の、中身が配列であるかどうかの境界値バリデーション
            // ※「最初の要素が配列であるか」で判定し、二次元配列であると確定した場合のみチェック
            if (Array.isArray(cases[0]) && cases.some(c => !Array.isArray(c) || c.length === 0)) {
                throw new Error(`[Err API 不正利用] "${title}": cases内のネスト配列に空、または配列でない要素が含まれています。`);
            }

            // ── 【データ駆動テスト実行】 ──
            test.each(cases)(title, (...args) => {
                // 💡 複雑な場合分け（推測）をすべて排除。
                // test.each から渡ってくる引数 (...args) を、そのまま fn と assMethod に直通させるだけで、
                // 二次元配列・オブジェクト配列・プリミティブ配列すべてが完全に論理的整合します。
                assMethod(() => fn(...args), ExpectedError, expectedMessage, ...args);
            });
        } else {
            // 通常の単発テスト
            test(title, () => assMethod(fn, ExpectedError, expectedMessage));
        }
    }
}


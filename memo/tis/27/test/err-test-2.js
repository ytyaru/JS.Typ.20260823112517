import { test, expect } from "bun:test";

// テスト失敗を明示するためのカスタムエラー
class TestFailureError extends Error {
    constructor(message) {
        super(message);
        this.name = "TestFailureError"; // JSの欠陥対策としてnameを手動セット
    }
}

export class Err {
    /**
     * 1. 兼用API (基本は型チェック、Realm差異の可能性があれば救済)
     */
    static test(title, fn, ExpectedError, expectedMessage) {
        test(title, () => {
            const err = this.#run(fn);
            this.#failThrow(err, ExpectedError);
            const expectedName = new ExpectedError().name;
            if (!(err instanceof ExpectedError) && err.name !== expectedName) {
                throw new TestFailureError(`エラーの型も名前も一致しません。
期待値: Class [${ExpectedError.name}] (name: "${expectedName}")
実際値: Class [${err.constructor?.name}] (name: "${err.name}")`);
                /*
                throw new TestFailureError(
                    `エラーの型も名前も一致しません。\n` +
                    `期待値: Class [${ExpectedError.name}] (name: "${expectedName}")\n` +
                    `実際値: Class [${err.constructor?.name}] (name: "${err.name}")`
                );
                */
            }
            this.#failMessage(err, expectedMessage);
        });
    }

    /**
     * 2. Realm同一用API (プロトタイプチェーンまで厳格に型判定)
     */
    static same(title, fn, ExpectedError, expectedMessage) {
        test(title, () => {
            const err = this.#run(fn);
            this.#failThrow(err, ExpectedError);
            if (!(err instanceof ExpectedError)) {// 名前が同じなのに別の型と判定された時はReam差異のせい。
                throw new TestFailureError(`型判定に失敗しました。Realmが異なるか、別の型です。
期待値: ${ExpectedError.name}
実際値: ${err.constructor?.name || "Unknown"}`);
                /*
                throw new TestFailureError(
                    `型判定に失敗しました。Realmが異なるか、別の型です。\n` +
                    `期待値: ${ExpectedError.name}\n` +
                    `実際値: ${err.constructor?.name || "Unknown"}`
                );
                */
            }
            this.#failMessage(err, expectedMessage);
        });
    }

    /**
     * 3. Realm差異用API (型を無視し、name文字列とメッセージだけで判定)
     */
    static realm(title, fn, ExpectedError, expectedMessage) {
        test(title, () => {
            const err = this.#run(fn);
            this.#failThrow(err, ExpectedError);
            const expectedName = new ExpectedError().name;
            // 型は無視して、nameプロパティの文字列だけで判定（偶然の一致リスクを許容）
            if (err.name !== expectedName) {
                throw new TestFailureError(`Realmをまたいだ名前比較に失敗しました。
期待値: ${expectedName}
実際値: ${err.name}`);
            }
            this.#failMessage(err, expectedMessage);
        });
    }
    static #run(fn) {
        let err = null;
        try { fn(); } catch (error) { err = error; }
        return err;
    }
    static #failThrow(err, ExpectedError) {
        if (err === null) {
            // 「期待された例外が発生しませんでした」だと期待がどこにかかっているか勘違いされかねない。型の情報を詳細に出していることから、さも型が違ったことが問題であるかのように受け取られかねない表現になっている。例外の型が期待したものと違うという意味に捉えることも可能な表現だ。あくまで期待しているのは発生であり型ではない。誤解なきよう表現を調整した。
            //throw new TestFailureError(`期待された例外 [${ExpectedError.name}] が発生しませんでした。`);
            //throw new TestFailureError(`期待された例外が発生しませんでした。: ${ExpectedError.name}`);
            throw new TestFailureError(`例外発生が期待された所で発生しませんでした。: ${ExpectedError.name}`);
        }
    }
    static #failMessage(err, expectedMessage) {
        if (err.message !== expectedMessage) {
            throw new TestFailureError(`エラーメッセージが一致しません。
期待値: ${expectedMessage}
実際値: ${err.message}`);
            /*
            throw new TestFailureError(
                `エラーメッセージが一致しません。\n` +
                `期待値: "${expectedMessage}"\n` +
                `実際値: "${err.message}"`
            );
            */
        }
    }
}

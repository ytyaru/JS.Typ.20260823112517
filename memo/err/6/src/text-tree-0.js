export class TextTree {
    static parse(text) {
        if (typeof text !== "string") {
            throw new TypeError("TextTree.parse requires a string input.");
        }

        const lines = text.split("\n")
            .map(line => line.replace(/#.*$/, "")) // コメント行（#以降）を除外
            .filter(line => line.trim() !== "");

        const root = {};
        const stack = [{ indent: -1, obj: root }];

        for (const rawLine of lines) {
            // インデント幅（先頭のスペース・タブの数）を測定
            const indentMatch = rawLine.match(/^[\s\t]*/);
            const indent = indentMatch ? indentMatch[0].length : 0;
            const lineContent = rawLine.trim();

            if (!lineContent) continue;

            // タブやスペースで区切られた最初の単語をキー、残りを args とする
            const parts = lineContent.split(/[\s\t]+/);
            const key = parts[0];
            const args = parts.slice(1);

            // キー名に '$' が使われている場合は予約語のためエラー
            if (key === "$") {
                throw new Error("'$' is a reserved property name and cannot be used as a node key.");
            }

            // インデントの階層に応じてスタックを調整
            while (stack.length > 0 && stack[stack.length - 1].indent >= indent) {
                stack.pop();
            }

            const parentNode = stack[stack.length - 1].obj;

            // 新しい子ノード（プレーンオブジェクト）を作成
            const newNode = {};

            // メタデータを格納する '$' プロパティを定義 (enumerable: true でスプレッド構文に対応)
            const meta = {
                args: args,
                parent: parentNode === root ? null : parentNode,
                get entries() {
                    return Object.entries(newNode).filter(([k]) => k !== "$");
                },
                get keys() {
                    return Object.keys(newNode).filter(k => k !== "$");
                },
                get values() {
                    return Object.entries(newNode)
                        .filter(([k]) => k !== "$")
                        .map(([, v]) => v);
                }
            };

            Object.defineProperty(newNode, "$", {
                value: meta,
                writable: false,
                enumerable: true, // スプレッド構文での消失を防ぐため true
                configurable: false
            });

            // 不変（Immutable）にするために freeze
            Object.freeze(newNode);

            parentNode[key] = newNode;
            stack.push({ indent, obj: newNode });
        }

        return Object.freeze(root);
    }
}

export class TextTree {
    static Indent = Object.freeze({
        infer: "infer",
        tab: "\t",
        space2: "  ",
        space4: "    ",
        space8: "        "
    });

    /**
     * インデントテキストをパースしてツリー構造のオブジェクトに変換する
     * @param {string} text 
     * @param {string} indentMode 
     * @returns {Object}
     */
    static parse(text, indentMode = TextTree.Indent.infer) {
        if (typeof text !== "string") {
            throw new TypeError("TextTree.parse requires a string input.");
        }

        const rawLines = this.#cleanLines(text);
        const { parsedLines } = this.#parseIndentation(rawLines, indentMode);
        const tokens = this.#tokenizeLines(parsedLines);
        return this.#buildHierarchy(tokens);
    }

    /**
     * 責務: コメント行や空行の排除、CRLFの正規化
     */
    static #cleanLines(text) {
        return text.split("\n")
            .map(line => line.replace(/#.*$/, ""))
            .map(line => line.replace(/\r$/, ""))
            .filter(line => line.trim() !== "");
    }

    /**
     * 責務: インデントの検出（inferの場合は最初に出現した有効なインデントでロック、デフォルトはタブ）
     */
    static #parseIndentation(rawLines, indentMode) {
        let lockedUnit = null;

        if (indentMode !== TextTree.Indent.infer) {
            lockedUnit = indentMode;
        }

        const parsed = [];

        for (const line of rawLines) {
            const match = line.match(/^([ \t]*)(.*)$/);
            const leading = match[1];
            const content = match[2];

            if (!leading) {
                parsed.push({ depth: 0, content });
                continue;
            }

            if (lockedUnit === null) {
                if (leading.startsWith("\t")) {
                    if (!/^[\t]+$/.test(leading)) {
                        throw new Error(`Indentation error: Mixed or invalid indentation in line: "${line}"`);
                    }
                    lockedUnit = "\t";
                } else {
                    const len = leading.length;
                    if (len % 2 !== 0 && len !== 4 && len !== 8) {
                        throw new Error(`Indentation error: Invalid space indentation width (${len}) in line: "${line}"`);
                    }
                    lockedUnit = " ".repeat(len);
                }
            }

            let depth = 0;
            if (lockedUnit === "\t") {
                if (!leading.startsWith(lockedUnit)) {
                    throw new Error(`Indentation error: Expected tab indentation in line: "${line}"`);
                }
                depth = leading.length;
            } else {
                if (leading.length % lockedUnit.length !== 0) {
                    throw new Error(`Indentation error: Inconsistent indentation width in line: "${line}"`);
                }
                depth = leading.length / lockedUnit.length;
            }

            parsed.push({ depth, content });
        }

        // インデントが一度も現れなかった場合のデフォルトはハードタブ
        const finalParsed = parsed.length === 0 && rawLines.length > 0
            ? rawLines.map(content => ({ depth: 0, content }))
            : parsed;

        return { parsedLines: finalParsed };
    }

    /**
     * 責務: 行コンテンツを最初の空白文字で分割し、キーと引数を抽出する
     */
    static #tokenizeLines(parsedLines) {
        return parsedLines.map(({ depth, content }) => {
            const firstSpaceIndex = content.search(/[\s\t]/);
            
            let key, args;
            if (firstSpaceIndex === -1) {
                key = content.trim();
                args = [];
            } else {
                key = content.slice(0, firstSpaceIndex).trim();
                const remainder = content.slice(firstSpaceIndex).trim();
                args = remainder ? [remainder] : [];
            }

            return { depth, key, args };
        });
    }

    /**
     * 責務: 深度とスタックを用いて純粋な階層オブジェクトを構築する
     */
    static #buildHierarchy(tokens) {
        const root = {};
        const stack = [{ depth: -1, obj: root }];

        for (const token of tokens) {
            while (stack.length > 0 && stack[stack.length - 1].depth >= token.depth) {
                stack.pop();
            }

            const parentNode = stack[stack.length - 1].obj;
            const newNode = {};

            // 純粋なツリー構造として保持（args等のメタデータ構造が必要な場合は上位レイヤーで拡張する）
            parentNode[token.key] = newNode;
            stack.push({ depth: token.depth, obj: newNode });
        }

        return Object.freeze(root);
    }
}

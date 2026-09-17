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
     * オブジェクトツリーをインデントテキストに逆変換する
     * @param {Object} rootObj 
     * @param {string} [indentChar="\t"] 
     * @returns {string}
     */
    static stringify(rootObj, indentChar = "\t") {
        if (!rootObj || typeof rootObj !== "object") {
            throw new TypeError("TextTree.stringify requires an object input.");
        }

        const lines = [];

        const traverse = (nodeObj, depth) => {
            for (const [key, childNode] of Object.entries(nodeObj)) {
                if (key === "$") continue;

                const args = childNode.$ && Array.isArray(childNode.$.args) ? childNode.$.args : [];
                const lineContent = args.length > 0 ? `${key} ${args.join(" ")}` : key;
                const indent = indentChar.repeat(depth);

                lines.push(indent + lineContent);

                if (childNode && typeof childNode === "object") {
                    traverse(childNode, depth + 1);
                }
            }
        };

        traverse(rootObj, 0);
        return lines.join("\n");
    }

    static #cleanLines(text) {
        return text.split("\n")
            .map(line => line.replace(/#.*$/, ""))
            .map(line => line.replace(/\r$/, ""))
            .filter(line => line.trim() !== "");
    }

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
                    if (![2, 4, 8].includes(len)) {
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

        return { parsedLines: parsed };
    }

    static #tokenizeLines(parsedLines) {
        return parsedLines.map(({ depth, content }) => {
            const spaceIdx = content.search(/[\s\t]/);

            let key, args;
            if (spaceIdx === -1) {
                key = content.trim();
                args = [];
            } else {
                key = content.slice(0, spaceIdx).trim();
                const remainder = content.slice(spaceIdx).trim();
                args = remainder ? [remainder] : [];
            }

            if (key === "$") {
                throw new Error("'$' is a reserved property name and cannot be used as a node key.");
            }

            return { depth, key, args };
        });
    }

    static #buildHierarchy(tokens) {
        const root = {};
        const stack = [{ depth: -1, obj: root }];

        for (const token of tokens) {
            while (stack.length > 0 && stack[stack.length - 1].depth >= token.depth) {
                stack.pop();
            }

            const parentNode = stack[stack.length - 1].obj;
            const newNode = {};
            const parentRef = parentNode === root ? null : parentNode;

            this.#enrichNode(newNode, token.args, parentRef);

            parentNode[token.key] = newNode;
            stack.push({ depth: token.depth, obj: newNode });
        }

        return Object.freeze(root);
    }

    static #enrichNode(node, args, parent) {
        const meta = {
            args: args,
            parent: parent,
            get entries() {
                return Object.entries(node).filter(([k]) => k !== "$");
            },
            get keys() {
                return Object.keys(node).filter(k => k !== "$");
            },
            get values() {
                return Object.entries(node)
                    .filter(([k]) => k !== "$")
                    .map(([, v]) => v);
            }
        };

        Object.defineProperty(node, "$", {
            value: meta,
            writable: false,
            enumerable: true,
            configurable: false
        });

        Object.freeze(node);
    }
}

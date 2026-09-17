import { TextTree } from "./text-tree.js";
const CUSTOM = Symbol();

export class Err {
    static #getNames(arg) {
        if ('string' !== typeof arg) {
            throw new TypeError(`Arguments must be strings like 'TypeName' or 'TypeName BaseTypeName'`);
        }
        const [one, two] = arg.split(' ');
        return [one, two ? two : 'Error'];
    }

    static #makeClass(name, S) {
        const Cls = class extends S {
            constructor(message, causeOrOptions) {
                // causeがErrorインスタンスなら { cause } に包む。
                // すでにオプションオブジェクト（または別物）ならそのまま渡すことで多重ラップを防ぐ
                const options = causeOrOptions instanceof Error 
                    ? { cause: causeOrOptions } 
                    : causeOrOptions;
                
                super(message, options);
                this.name = name;
            }
        };

        Object.defineProperty(Cls, 'name', { value: name });
        Object.defineProperty(Cls, '_custom', {
            value: CUSTOM,
            writable: false,
            enumerable: false,
            configurable: false
        });

        return Cls;
    }

    static regist(...args) {
        const registry = new Map();

        for (const arg of args) {
            const [name, baseClsNm] = this.#getNames(arg);
            
            // 同時登録（同一regist内）の親クラスも考慮して探索する
            const S = registry.get(baseClsNm) || globalThis[baseClsNm];

            this.#validate(registry, name, S);
            registry.set(name, this.#makeClass(name, S));
        }

        for (const [name, Cls] of registry.entries()) {
            globalThis[name] = Cls;
        }

        return registry.values();
    }

    static #validate(registry, name, baseCls) {
        if (registry.has(name)) {
            throw new Error(`Duplicate error class name: ${name}`);
        }
        if (globalThis[name] !== undefined) {
            throw new Error(`Error class already exists: ${name}`);
        }
        if (!this.#isValidBaseClass(baseCls)) {
            throw new Error(`Base class must be an Error type: ${baseCls?.name || baseCls}`);
        }
    }

    static #isValidBaseClass(B) {
        return ('function' === typeof B) && (B.prototype instanceof Error || B === Error || this.isCls(B));
    }

    static get(name) {
        const cls = globalThis[name];
        return this.isCls(cls) ? cls : undefined;
    }

    static has(name) {
        return this.isCls(globalThis[name]);
    }

    static is(v) {
        return this.isIns(v) || this.isCls(v);
    }

    static isCls(C) {
        return typeof C === 'function' && C._custom === CUSTOM;
    }

    static isIns(e) {
        return e instanceof Error && this.isCls(e.constructor);
    }

    static get items() {
        const list = [];
        for (const key of Object.getOwnPropertyNames(globalThis)) {
            const val = globalThis[key];
            if (this.isCls(val)) {
                list.push(val);
            }
        }
        return list;
    }

    /**
     * テキストツリーから例外クラス群を階層構造（親子関係）を維持して一括登録する
     * @param {string | Object} textOrTree 
     * @param {string} [indentMode=TextTree.Indent.infer] 
     */
    static registTree(textOrTree, indentMode = TextTree.Indent.infer) {
        const tree = typeof textOrTree === "string" 
            ? TextTree.parse(textOrTree, indentMode) 
            : textOrTree;

        // 再帰的にツリーを走査して登録する内部関数
        const traverseNode = (nodeObj, currentParentClsName = null, isRoot = true) => {
            for (const key of nodeObj.$.keys) {
                const childNode = nodeObj[key];
                
                let parentToUse;
                if (isRoot) {
                    // ルート層のみ、2列目に指定があればそれを親とする（なければ標準の "Error"）
                    const explicitParent = childNode.$.args[0];
                    parentToUse = explicitParent !== undefined ? explicitParent : "Error";
                } else {
                    // 子孫層はインデントの構造（直上の親クラス名）に厳格に従う
                    parentToUse = currentParentClsName;
                }

                // 例外クラスの動的登録を実行
                // 例: Err.regist(key, parentToUse);
                // ※ ここは既存の Err.regist の仕様（名前, 親クラス名など）に合わせて呼び出す
                this.regist(key, parentToUse);

                // 子ノードをさらに再帰処理（次の親として現在のキーを渡す）
                traverseNode(childNode, key, false);
            }
        };

        traverseNode(tree, null, true);
    }
}

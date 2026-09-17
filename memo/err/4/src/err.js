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
            constructor(message, cause) {
                super(message, cause instanceof Error ? { cause } : undefined);
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
    static #isCustomErrorClass(cls) {return typeof cls === 'function' && cls._custom === CUSTOM;}
    static regist(...args) {
        const registry = new Map();

        for (const arg of args) {
            const [name, baseClsNm] = this.#getNames(arg);
            const S = globalThis[baseClsNm];

            // 責任分離されたバリデーション
            this.#validate(registry, name, S);

            // クラス生成して一時マップに格納
            registry.set(name, this.#makeClass(name, S));
        }

        // 一括でグローバルに登録
        for (const [name, Cls] of registry.entries()) {
            globalThis[name] = Cls;
        }

        return registry.values();
    }

    static #validate(registry, name, baseCls) {
        // 1. 引数リスト内での重複チェック
        if (registry.has(name)) {
            throw new Error(`Duplicate error class name: ${name}`);
        }
        // 2. グローバル上の既存チェック
        if (globalThis[name] !== undefined) {
            throw new Error(`Error class already exists: ${name}`);
        }
        // 3. 基底クラスの妥当性チェック
        if (!this.#isValidBaseClass(baseCls)) {
            throw new Error(`Base class must be an Error type: ${baseCls?.name || baseCls}`);
        }
    }

    static #isValidBaseClass(B) {
        return ('function' === typeof B) && (B.prototype instanceof Error || B === Error || this.#isCustomErrorClass(B));
    }

    static get(name) {
        const cls = globalThis[name];
        return this.#isCustomErrorClass(cls) ? cls : undefined;
    }

    static has(name) {
        return this.#isCustomErrorClass(globalThis[name]);
    }

    static is(e) {
        return e instanceof Error && this.#isCustomErrorClass(e.constructor);
    }

    static get items() {
        const list = [];
        for (const key of Object.getOwnPropertyNames(globalThis)) {
            const val = globalThis[key];
            if (this.#isCustomErrorClass(val)) {
                list.push(val);
            }
        }
        return list;
    }
}

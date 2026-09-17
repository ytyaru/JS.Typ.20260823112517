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
}

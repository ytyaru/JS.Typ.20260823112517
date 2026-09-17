const mkCode = (name, S) => `
return class ${name} extends ${S} {
    constructor(message, cause) {
        super(message, cause instanceof Error ? { cause } : undefined);
        this.name = '${name}';
    }
}`;

export class Err {
    static #items = new Map();

    static #make(name, superClsNm) {
        const S = globalThis[superClsNm];
        if ('function' !== typeof S || !(S.prototype instanceof Error || S === Error)) {
            throw new Error(`Base class must be an Error type: ${superClsNm}`);
        }
        if (this.#items.has(name)) {
            throw new Error(`Error class already exists: ${name}`);
        }
        return new Function(mkCode(name, superClsNm))();
    }

    static #regist(n, c) {
        this.#items.set(n, c);
        globalThis[n] = c;
    }

    static #getNames(arg) {
        if ('string' !== typeof arg) {
            throw new TypeError(`Arguments must be strings like 'TypeName' or 'TypeName SuperTypeName'`);
        }
        const [one, two] = arg.split(' ');
        return [one, two ? two : 'Error'];
    }

    static regist(...args) {
        const clss = new Map();
        for (let arg of args) {
            const [name, superClsNm] = this.#getNames(arg);
            if (clss.has(name) || this.#items.has(name)) {
                throw new Error(`Duplicate error class name: ${name}`);
            }
            clss.set(name, this.#make(name, superClsNm));
        }

        for (let [n, c] of clss.entries()) {
            this.#regist(n, c);
        }
        return clss.values();
    }

    static get(name) { return this.#items.get(name); }
    static has(name) { return this.#items.has(name); }
}

// --- 使用例 ---
// Err.regist('MyError', 'MyTypeError TypeError');
// try {...} catch(e) {if (e instanceof MyError) {}}

const mkCode = (name,S) => `
return class ${name} extends ${S} {
    constructor(message, cause) {
        super(message, cause instanceof Error ? {cause} : undefined);
        this.name = '${name}';
    }
}`;
export class Err {
    static #items = new Map();
//    static #make(name, superClsNm) {
//        if (!(globalThis[superClsNm] instanceof Error)) {throw new Error(`既定型はError系のみ有効です。:${superClsNm}`)}
//        if (this.items.has(name)) {throw new Error(`既存です。未在な名前のみ有効です。:${name}`)}
//        return Function(`return ${mkCode(name, superClsNm)}`);
//    }
    static #make(name, superClsNm) {
        const S = globalThis[superClsNm];
        if ('function' !== typeof S || !(S.prototype instanceof Error || S === Error)) {throw new Error(`既定型はError系のみ有効です。:${superClsNm}`);}
        if (this.#items.has(name)) {throw new Error(`既存です。未在な名前のみ有効です。:${name}`);}
        return new Function(mkCode(name, superClsNm))();
    }
//    static #regist(c) {this.#items.set(c.name,c); globalThis[c.name]=c;}
    static #regist(n,c) {this.#items.set(n,c); globalThis[n]=c;}
    static #getNames(arg) {
        if ('string'!==typeof arg) {throw new TypeError(`引数は'型名'や'型名 継承型名'のような文字列のみ有効です。`)}
        const [one, two] = arg.split(' '); // もし二個目がなければ'Error'をセットしたい
        return [one, two ? two : 'Error'];
    }
    static regist(...args) {
        const clss = new Map();
        for (let arg of args) {// 一個でもエラーがあれば登録は全て中断されるべき（ロールバック）
            const [name, superClsNm] = this.#getNames(arg);
            if (clss.has(name)) {throw new Error(`重複しています。異なる名前のみ有効です。:${name}`)}
            clss.set(name, this.#make(name, superClsNm));
        }
//        for (let c of clss.entries()) {this.#regist(c)}
        for (let [n,c] of clss.entries()) {this.#regist(n,c)}
        return clss.values();
    }
//    static get map() {return this.#items}
    static get(name) {return this.#items.get(name)}
    static has(name) {return this.#items.has(name)}
}
// Err.regist('MyError', 'MyTypeError TypeError');
// try {...} catch(e) {if (e instanceof MyError) {}}


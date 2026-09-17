// src/err.js
var mkCode = (name, S) => `
return class ${name} extends ${S} {
    constructor(message, cause) {
        super(message, cause instanceof Error ? {cause} : undefined);
        this.name = '${name}';
    }
}`;

class Err {
  static #items = new Map;
  static #make(name, superClsNm) {
    const S = globalThis[superClsNm];
    if (typeof S !== "function" || !(S.prototype instanceof Error || S === Error)) {
      throw new Error(`既定型はError系のみ有効です。:${superClsNm}`);
    }
    if (this.#items.has(name)) {
      throw new Error(`既存です。未在な名前のみ有効です。:${name}`);
    }
    return new Function(mkCode(name, superClsNm))();
  }
  static #regist(n, c) {
    this.#items.set(n, c);
    globalThis[n] = c;
  }
  static #getNames(arg) {
    if (typeof arg !== "string") {
      throw new TypeError(`引数は'型名'や'型名 継承型名'のような文字列のみ有効です。`);
    }
    const [one, two] = arg.split(" ");
    return [one, two ? two : "Error"];
  }
  static regist(...args) {
    const clss = new Map;
    for (let arg of args) {
      const [name, superClsNm] = this.#getNames(arg);
      if (clss.has(name)) {
        throw new Error(`重複しています。異なる名前のみ有効です。:${name}`);
      }
      clss.set(name, this.#make(name, superClsNm));
    }
    for (let [n, c] of clss.entries()) {
      this.#regist(n, c);
    }
    return clss.values();
  }
  static get(name) {
    return this.#items.get(name);
  }
  static has(name) {
    return this.#items.has(name);
  }
}
export {
  Err
};

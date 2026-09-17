// @bun
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
      throw new Error(`\u65E2\u5B9A\u578B\u306FError\u7CFB\u306E\u307F\u6709\u52B9\u3067\u3059\u3002:${superClsNm}`);
    }
    if (this.#items.has(name)) {
      throw new Error(`\u65E2\u5B58\u3067\u3059\u3002\u672A\u5728\u306A\u540D\u524D\u306E\u307F\u6709\u52B9\u3067\u3059\u3002:${name}`);
    }
    return new Function(mkCode(name, superClsNm))();
  }
  static #regist(n, c) {
    this.#items.set(n, c);
    globalThis[n] = c;
  }
  static #getNames(arg) {
    if (typeof arg !== "string") {
      throw new TypeError(`\u5F15\u6570\u306F'\u578B\u540D'\u3084'\u578B\u540D \u7D99\u627F\u578B\u540D'\u306E\u3088\u3046\u306A\u6587\u5B57\u5217\u306E\u307F\u6709\u52B9\u3067\u3059\u3002`);
    }
    const [one, two] = arg.split(" ");
    return [one, two ? two : "Error"];
  }
  static regist(...args) {
    const clss = new Map;
    for (let arg of args) {
      const [name, superClsNm] = this.#getNames(arg);
      if (clss.has(name)) {
        throw new Error(`\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002\u7570\u306A\u308B\u540D\u524D\u306E\u307F\u6709\u52B9\u3067\u3059\u3002:${name}`);
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

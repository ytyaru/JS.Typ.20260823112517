var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toCommonJS = (from) => {
  var entry = (__moduleCache ??= new WeakMap).get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function") {
    for (var key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(entry, key))
        __defProp(entry, key, {
          get: __accessProp.bind(from, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  __moduleCache.set(from, entry);
  return entry;
};
var __moduleCache;
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};

// src/main.js
var exports_main = {};
__export(exports_main, {
  Err: () => Err
});
module.exports = __toCommonJS(exports_main);

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

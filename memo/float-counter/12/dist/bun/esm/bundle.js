// @bun
// src/float.js
class Range {
  #min;
  #max;
  constructor(e, scale, min, max) {
    const MIN = Number.MIN_SAFE_INTEGER / scale;
    const MAX = Number.MAX_SAFE_INTEGER / scale;
    this.#valid(min, "min");
    this.#valid(max, "max");
    if (max <= min) {
      throw new RangeError(`min,max\u306F1\u4EE5\u4E0A\u306E\u5DEE\u304C\u3042\u308B\u5C0F\u5927\u95A2\u4FC2\u3067\u3042\u308B\u3079\u304D\u3067\u3059\u3002`);
    }
    this.#range("min", e, min, MIN);
    this.#range("max", e, max, MAX);
    this.#min = min === -Infinity ? MIN : min;
    this.#max = max === Infinity ? MAX : max;
  }
  #valid(v, n) {
    if (typeof v !== "number" || Number.isNaN(v)) {
      throw new TypeError(`${n}\u306FNaN\u4EE5\u5916\u306ENumber\u3067\u3042\u308B\u3079\u304D\u3067\u3059\u3002`);
    }
  }
  #range(n, e, v, M) {
    const { c, m, l, o, s } = this.#msg(n, v, M);
    if (Number.isFinite(v) && c) {
      throw new RangeError(`${n}\u304C${l}\u9650\u5024\u3092\u8D85\u904E\u3057\u3066\u3044\u307E\u3059\u3002\u5206\u89E3\u80FD\u6307\u6570e\u304C${e}\u306E\u6642${n}\u306E${m}\u5024\u306F${M}\u3067\u3059\u3002\u3053\u308C$\u4EE5{o}\u306E\u6570\u5024\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002${l}\u9650\u5024\u3092\u6307\u5B9A\u3057\u305F\u3044\u6642\u306F${s}Infinity\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002`);
    }
  }
  #msg(n, v, M) {
    return n === "min" ? { c: v < M, m: "\u5C0F", l: "\u4E0B", o: "\u4E0A", s: "-" } : { c: M < v, m: "\u5927", l: "\u4E0A", o: "\u4E0B", s: "" };
  }
  within(v) {
    return this.#min <= v && v <= this.#max;
  }
  get min() {
    return this.#min;
  }
  get max() {
    return this.#max;
  }
}

class SafeFloat {
  #isThrowNotUnit;
  static Overflow = Object.freeze({
    throw: (self, isDown, nextV) => {
      throw new RangeError(`\u5024\u7BC4\u56F2\u8D85\u904E\u3002\u671F\u5F85\u5024: ${self.min}\u301C${self.max} \u5B9F\u969B\u5024:${nextV}`);
    },
    ignore: (self, isDown, nextV) => self._.v,
    stop: (self, isDown, nextV) => isDown ? self.rng.min : self.rng.max,
    zero: (self, isDown, nextV) => 0,
    reverse: (self, isDown, nextV) => isDown ? self.rng.max : self.rng.min
  });
  constructor(isThrowNotUnit = false, e, over = SafeFloat.Overflow.throw, v = undefined, min = -Infinity, max = Infinity) {
    this.#isThrowNotUnit = isThrowNotUnit;
    if (!(Number.isSafeInteger(e) && (1 <= e && e <= 52))) {
      throw new RangeError(`e\u306F1\u301C52\u307E\u3067\u306E\u6574\u6570\u5024\u3067\u3042\u308B\u3079\u304D\u3067\u3059\u3002\u6307\u5B9A\u5024: ${e}`);
    }
    if (!Object.values(SafeFloat.Overflow).includes(over)) {
      throw new Error(`over\u306FSafeFloat.Overflow\u306E\u3044\u305A\u308C\u304B\u3067\u3042\u308B\u3079\u304D\u3067\u3059\u3002`);
    }
    const scale = 2 ** e;
    this._ = {
      e,
      scale,
      resolution: 1 / scale,
      v: 0,
      rng: new Range(e, scale, min, max),
      over
    };
    this.#setInitValue(v);
  }
  #setInitValue(v) {
    this._.v = v === undefined ? this._.rng.within(0) ? 0 : this._.rng.min : this.#validInitValue(v);
  }
  #validInitValue(v) {
    this.#validResolutionUnit(v);
    return this._.rng.within(v) ? v : this._.over(this, false, v);
  }
  #validResolutionUnit(x) {
    if (this.#isThrowNotUnit && !Number.isInteger(x * this._.scale)) {
      throw new TypeError(`\u4EE3\u5165\u5024 ${x} \u306F\u3001\u73FE\u5728\u306E\u5206\u89E3\u80FD (1 / 2**${this._.e} = ${this.resolution}) \u306E\u5358\u4F4D\u306B\u5408\u81F4\u3057\u307E\u305B\u3093\u3002`);
    }
  }
  get rng() {
    return this._.rng;
  }
  get resolution() {
    return this._.resolution;
  }
  get v() {
    return this._.v;
  }
  set v(x) {
    if (!Number.isFinite(x)) {
      throw new TypeError(`\u4EE3\u5165\u5024\u306FNumber.isFinite(x)\u304C\u771F\u3092\u8FD4\u3059\u5024\u306E\u307F\u6709\u52B9\u3067\u3059\u3002`);
    }
    this.#validResolutionUnit(x);
    this.#set(x, x < this._.v);
  }
  count(n = 1) {
    return this.#count(true, n < 0, Math.abs(n));
  }
  up(n = 1) {
    return this.#count(false, false, n);
  }
  down(n = 1) {
    return this.#count(false, true, n);
  }
  #count(isCount, isDown = false, n = 1) {
    this.#validateN(n, isCount);
    return this.#set(this._.v + this._.resolution * (isDown ? -n : n), isDown);
  }
  #validateN(n, isCount = false) {
    if (!Number.isSafeInteger(n) || (isCount ? n === 0 : n < 1)) {
      const { t, s } = this.#msg(isCount);
      throw new TypeError(`n\u306F${t}\u306E\u5B89\u5168\u306A\u6574\u6570\u3067\u3042\u308B\u3079\u304D\u3067\u3059\u3002${s}`);
    }
  }
  #msg(isCount) {
    return isCount ? { t: "0\u4EE5\u5916", s: "\uFF08\u6B63\u6570\u306A\u3089up, \u8CA0\u6570\u306A\u3089down\u3067\u3059\uFF09" } : { t: "1\u4EE5\u4E0A", s: "" };
  }
  #set(nextV, isDown) {
    return this._.v = this._.rng.within(nextV) ? nextV : this._.over(this, isDown, nextV);
  }
}

class StepFloat extends SafeFloat {
  constructor(e, over = SafeFloat.Overflow.throw, v = undefined, min = -Infinity, max = Infinity) {
    super(true, e, over, v, min, max);
  }
}

class RoundFloat extends SafeFloat {
  static Method = Object.freeze({
    ...Object.fromEntries(["floor", "trunc", "ceil", "round"].map((name) => [
      name,
      (self) => Math[name](self._.v * self._.scale) / self._.scale
    ])),
    even: (self) => {
      const scaled = self._.v * self._.scale;
      const t = Math.trunc(scaled);
      const diff = scaled - t;
      if (Math.abs(diff) === 0.5) {
        return (t % 2 === 0 ? t : t + Math.sign(scaled)) / self._.scale;
      }
      return Math.round(scaled) / self._.scale;
    }
  });
  constructor(e, method = RoundFloat.Method.round, over = SafeFloat.Overflow.throw, v = undefined, min = -Infinity, max = Infinity) {
    super(false, e, over, v, min, max);
    if (!Object.values(RoundFloat.Method).includes(method)) {
      throw new Error(`method\u306FRoundFloat.Method\u306E\u3044\u305A\u308C\u304B\u3067\u3042\u308B\u3079\u304D\u3067\u3059\u3002`);
    }
    this._.method = method;
  }
  get raw() {
    return super.v;
  }
  set raw(v) {
    super.v = v;
  }
  get v() {
    return this._.method(this);
  }
  set v(v) {
    throw new TypeError(`\u4EE3\u5165\u306Fraw\u306B\u5BFE\u3057\u3066\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002raw\u306F\u4EFB\u610F\u5024\u3067\u3042\u308A\u3001\u305D\u308C\u3092\u5185\u90E8\u3067\u4E38\u3081\u305F\u7D50\u679C\u3092v\u3067\u53D6\u5F97\u3057\u307E\u3059\u3002`);
  }
}
var createOverflowMethods = (factoryFn) => {
  const obj = {};
  for (const [key, overFn] of Object.entries(SafeFloat.Overflow)) {
    obj[key] = (e, v, min, max) => factoryFn(e, overFn, v, min, max);
  }
  return obj;
};
var createFloatInterface = () => {
  const stepFn = (e, v, min, max) => new StepFloat(e, SafeFloat.Overflow.throw, v, min, max);
  const stepObj = Object.assign(stepFn, createOverflowMethods((e, over, v, min, max) => new StepFloat(e, over, v, min, max)));
  const interfaceObj = { step: stepObj };
  for (const [methodName, methodFunc] of Object.entries(RoundFloat.Method)) {
    const defaultOver = SafeFloat.Overflow.throw;
    const defaultMethod = methodFunc;
    const roundFn = (e, v, min, max) => new RoundFloat(e, defaultMethod, defaultOver, v, min, max);
    const roundObj = Object.assign(roundFn, createOverflowMethods((e, over, v, min, max) => new RoundFloat(e, defaultMethod, over, v, min, max)));
    interfaceObj[methodName] = roundObj;
  }
  return interfaceObj;
};
var float = createFloatInterface();
export {
  float,
  StepFloat,
  RoundFloat
};

// src/tof.js
var tof = (v) => {
  if (v === null)
    return "Null";
  if (v === undefined)
    return "Undefined";
  if (Array.isArray(v))
    return "Array";
  const to = typeof v;
  if (to === "function")
    return FnTys.name(v);
  const name = Object.prototype.toString.call(v).slice(8, -1);
  return to === "object" ? ObjTys.name(v, name) : name === "Number" ? isNum(v, name) : name;
};
var getCode = (v) => Function.prototype.toString.call(v).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").trim();
var isNum = (v, name) => Number.isNaN(v) ? "NaN" : v === Infinity ? "Infinity" : v === -Infinity ? "-Infinity" : Number.isSafeInteger(v) ? "Integer" : Number.isFinite(v) ? "Finite" : name;

class ObjTys {
  static name(v, name) {
    const proto = Object.getPrototypeOf(v);
    if (proto === null)
      return "NonePrototypeObject";
    if ([Boolean, Number, String].some((C) => v instanceof C)) {
      return `BoxedPrimitive<${v.constructor.name}>`;
    }
    const des = DesTys.name(v);
    if (des)
      return des;
    const isPlain = Object.prototype === proto;
    if (isPlain)
      return `PlainObject`;
    const ctor = proto.constructor;
    const isEs6Ins = this.#isEs6Ins(proto, ctor);
    const isEs5Ins = this.#isEs5Ins(proto, ctor);
    if (!isPlain && name !== "Object" && !isEs6Ins && !isEs5Ins)
      return `NativeInstance<${name}>`;
    if (isEs6Ins || isEs5Ins)
      return `${isEs5Ins ? "ES5." : ""}Instance<${ctor.name || "(Anonymous)"}>`;
    return "PrototypedObject";
  }
  static #isEs6Ins(proto, ctor) {
    return typeof ctor !== "function" ? false : FnTys._isEs6Cls(ctor, getCode(ctor));
  }
  static #isEs5Ins(proto, ctor) {
    return typeof ctor !== "function" || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor) || FnTys._isNative(ctor, getCode(ctor))) ? false : FnTys._isEs5Cls(ctor) || proto !== Object.prototype && proto !== Function.prototype;
  }
}

class DesTys {
  static name(v) {
    const keys = Object.getOwnPropertyNames(v);
    if (keys.length === 0)
      return false;
    const allowedKeys = ["value", "writable", "get", "set", "configurable", "enumerable"];
    if (!keys.every((key) => allowedKeys.includes(key)))
      return false;
    const hasValue = keys.includes("value");
    const hasWritable = keys.includes("writable");
    const hasGet = keys.includes("get") && v.get !== undefined;
    const hasSet = keys.includes("set") && v.set !== undefined;
    return (hasValue || hasWritable) && (hasGet || hasSet) || hasGet && typeof v.get !== "function" && v.get !== undefined || hasSet && typeof v.set !== "function" && v.set !== undefined || !hasValue && !hasWritable && !hasGet && !hasSet ? "" : `Descriptor<${this.#naming(v, hasValue, hasGet, hasSet)}>`;
  }
  static #naming(v, hasValue, hasGet, hasSet) {
    return hasGet || hasSet ? hasGet && hasSet ? "Accessor" : hasGet ? "Getter" : "Setter" : hasValue && typeof v.value === "function" ? "Method" : "Value";
  }
}

class FnTys {
  static name(v) {
    const s = getCode(v);
    const [isEs6, isEs5] = [this._isEs6Cls(v, s), this._isEs5Cls(v, s)];
    if (isEs6 || isEs5)
      return `${isEs5 ? "ES5." : ""}Class<${v.name || "(Anonymous)"}>`;
    if (this.#isBound(v, s))
      return `BoundFunction<${v.name.replace(/bound /, "")}>`;
    if (this._isNative(v, s))
      return `Native${this.#isNativeClass(v) ? "Class" : "Function"}<${v.name}>`;
    if (this.#isArrow(v, s))
      return `${FnAgTys.name(v, s)}ArrowFunction`;
    if (this.#isMethod(v, s))
      return `${FnAgTys.name(v, s)}Method`;
    const ag = FnAgTys.name(v, s);
    return `${!ag && !v.name ? "Anonymous" : ag}Function`;
  }
  static _isEs6Cls(v, s) {
    if (!s)
      s = Function.prototype.toString.call(v);
    return /^\s*class\b/.test(s);
  }
  static _isEs5Cls(v, s) {
    if (!s)
      s = Function.prototype.toString.call(v);
    if (this._isEs6Cls(v, s) || this._isNative(v, s) || this.#isArrow(v, s))
      return false;
    const proto = v.prototype;
    if (!proto || typeof proto !== "object")
      return false;
    const isCtorSelf = proto.constructor === v;
    if (!isCtorSelf)
      return false;
    const keys = Object.getOwnPropertyNames(proto);
    const hasCustomProps = keys.length > 1 || keys.length === 1 && keys[0] !== "constructor";
    const cleanS = s.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""').replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, "//");
    if (hasCustomProps || /\bthis\./.test(cleanS))
      return true;
    const name = v.name || "";
    return /^[A-Z]/.test(name);
  }
  static _isNative(v, s) {
    return s.includes("[native code]");
  }
  static #isNativeClass(v) {
    return v.prototype !== undefined && typeof v.prototype === "object";
  }
  static #isBound(v, s) {
    return v.name.startsWith("bound ");
  }
  static #isArrow(v, s) {
    return !v.hasOwnProperty("prototype") && s.includes("=>");
  }
  static #isMethod(v, s) {
    return /\bfunction\b/.test(s) ? false : !s.includes("=>");
  }
}

class FnAgTys {
  static name(v, s) {
    const cName = v.constructor?.name;
    if (cName === "AsyncGeneratorFunction")
      return "AsyncGenerator";
    if (cName === "GeneratorFunction")
      return "Generator";
    if (cName === "AsyncFunction")
      return "Async";
    const isAsync = /^\s*(?:static\s+)?async\b/.test(s);
    const isGenerator = /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s);
    return isAsync && isGenerator ? "AsyncGenerator" : isGenerator ? "Generator" : isAsync ? "Async" : "";
  }
}

// src/fn-obj.js
var mkFO = (someFn, mds = {}) => {
  const fn = function(v, ...args) {
    if (new.target)
      throw new ReferenceError("Constructors are not allowed.");
    return someFn(v, ...args);
  };
  fn.some = someFn;
  for (const [k, v] of Object.entries(mds)) {
    fn[k] = v;
  }
  return fn;
};
var mkErFO = (fo, pathStr) => {
  const someFn = (v, ...args) => {
    if (fo.some(v, ...args))
      return true;
    throw new TypeError(`Expected: a value that makes '${pathStr}(v)' return true.
Actual: ${tof(v)}`);
  };
  const props = {};
  for (const key of Object.getOwnPropertyNames(fo)) {
    if (["some", "length", "name", "prototype", "caller", "arguments"].includes(key))
      continue;
    const val = fo[key];
    if (typeof val === "function") {
      const subKeys = Object.getOwnPropertyNames(val).filter((k) => !["some", "length", "name", "prototype", "caller", "arguments"].includes(k));
      if (subKeys.length > 0 || typeof val.some === "function") {
        const subPathStr = pathStr.replace(/\.some$/, `.${key}.some`);
        props[key] = mkErFO(val, subPathStr);
      } else {
        props[key] = (v, ...args) => {
          if (val(v, ...args))
            return true;
          throw new TypeError(`Expected: '${val.toString()}' like value.
Actual: ${tof(v)}`);
        };
      }
    }
  }
  return mkFO(someFn, props);
};

// src/ist.js
var isFn = (N) => N.endsWith("Function") || `Bound Native`.split(" ").some((n) => N.startsWith(n + "Function<"));
var p = mkFO((v) => "bln int fin big str sym".split(" ").some((n) => p[n](v)), {
  bln: (v) => typeof v === "boolean",
  int: (v) => Number.isSafeInteger(v),
  fin: (v) => Number.isFinite(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v,
  big: (v) => typeof v === "bigint",
  str: (v) => typeof v === "string",
  sym: (v) => typeof v === "symbol"
});
var d = mkFO((v) => "und nul".split(" ").some((n) => d[n](v)) || "num obj".split(" ").some((n) => d[n].some(v)), {
  und: (v) => v === undefined,
  nul: (v) => v === null
});
var o = mkFO((v) => {
  const N = tof(v);
  return isFn(N) || N.endsWith("Method") || ["PlainObject", "Array"].some((n) => n === N) || ["Descriptor", "Class", "Instance"].some((n) => N.startsWith(n + "<"));
}, {
  obj: (v) => tof(v) === "PlainObject",
  ary: (v) => Array.isArray(v)
});
o.cls = mkFO((v) => ["", "ES5.", "Native"].some((n) => tof(v).startsWith(`${n}Class<`)), {
  es6: (v) => tof(v).startsWith("Class<"),
  es5: (v) => tof(v).startsWith("ES5.Class<"),
  native: (v) => tof(v).startsWith("NativeClass<")
});
o.ins = mkFO((v, C) => {
  const N = tof(v);
  return ["", "ES5.", "Native"].some((n) => N.startsWith(`${n}Instance<`)) && (C ? v instanceof C : true);
}, {
  es6: (v, C) => tof(v).startsWith("Instance<") && (C ? v instanceof C : true),
  es5: (v, C) => tof(v).startsWith("ES5.Instance<") && (C ? v instanceof C : true),
  native: (v, C) => tof(v).startsWith("NativeInstance<") && (C ? v instanceof C : true)
});
o.des = mkFO((v) => tof(v).startsWith("Descriptor<"));
var isDes = (N, ns) => ns.some((n) => N === `Descriptor<${n}>`);
o.des.d = mkFO((v) => isDes(tof(v), ["Value", "Method"]), {
  v: (v) => tof(v) === "Descriptor<Value>",
  m: (v) => tof(v) === "Descriptor<Method>"
});
o.des.a = mkFO((v) => isDes(tof(v), ["Getter", "Setter", "Accessor"]), {
  g: (v) => tof(v) === "Descriptor<Getter>",
  s: (v) => tof(v) === "Descriptor<Setter>",
  a: (v) => tof(v) === "Descriptor<Accessor>"
});
o.fn = mkFO((v) => isFn(tof(v)), {
  bound: (v) => tof(v).startsWith(`BoundFunction<`),
  native: (v) => tof(v).startsWith(`NativeFunction<`),
  a: (v) => tof(v) === "AsyncFunction",
  g: (v) => tof(v) === "GeneratorFunction",
  ag: (v) => tof(v) === "AsyncGeneratorFunction",
  s: (v) => tof(v) === "Function",
  anonymous: (v) => tof(v) === "AnonymousFunction"
});
o.fn.arrow = mkFO((v) => tof(v).endsWith("ArrowFunction"), {
  a: (v) => tof(v) === "AsyncArrowFunction",
  s: (v) => tof(v) === "ArrowFunction"
});
o.md = mkFO((v) => tof(v).endsWith("Method"), {
  s: (v) => tof(v) === "Method",
  a: (v) => tof(v) === "AsyncMethod",
  g: (v) => tof(v) === "GeneratorMethod",
  ag: (v) => tof(v) === "AsyncGeneratorMethod"
});
d.num = mkFO((v) => "nan inf ofin".split(" ").some((n) => d.num[n](v)), {
  nan: (v) => Number.isNaN(v),
  inf: (v) => [Infinity, -Infinity].some((x) => x === v),
  pinf: (v) => v === Infinity,
  ninf: (v) => v === -Infinity,
  oint: (v) => Number.isInteger(v) && !Number.isSafeInteger(v),
  ofin: (v) => Number.isFinite(v) && (Number.MAX_SAFE_INTEGER < v || v < Number.MIN_SAFE_INTEGER)
});
d.obj = mkFO((v) => {
  const N = tof(v);
  return N.startsWith(`BoxedPrimitive<`) || "NonePrototypeObject PrototypedObject".split(" ").some((n) => n === N);
}, {
  boxed: (v) => tof(v).startsWith(`BoxedPrimitive<`),
  noneProto: (v) => tof(v) === "NonePrototypeObject",
  prototyped: (v) => tof(v) === "PrototypedObject"
});
var isT = { p, d, o };

// src/owt.js
var owT = "p d o".split(" ").map((n) => ({ n, o: mkErFO(isT[n], `isT.${n}.some`) })).reduce((o2, v) => {
  o2[v.n] = v.o;
  return o2;
}, {});
export {
  tof,
  owT,
  isT
};

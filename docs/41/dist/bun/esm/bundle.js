// @bun
// src/tys.js
class Tys {
  static name(v) {
    if (v === null)
      return "Null";
    if (v === undefined)
      return "Undefined";
    if (Array.isArray(v))
      return "Array";
    const to = typeof v;
    if (to === "function")
      return FnTys.name(v);
    const name = this._name(v);
    return to === "object" ? this._obj(v, name) : name === "Number" ? this._num(v, name) : name;
  }
  static _name(v) {
    return Object.prototype.toString.call(v).slice(8, -1);
  }
  static _num(v, name) {
    return Number.isNaN(v) ? "NaN" : v === Infinity ? "Infinity" : v === -Infinity ? "-Infinity" : Number.isSafeInteger(v) ? "Integer" : Number.isFinite(v) ? "Finite" : name;
  }
  static _obj(v, name) {
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
    const isEs6Ins = this._isEs6Ins(proto, ctor);
    const isEs5Ins = this._isEs5Ins(v, proto, ctor);
    if (!isPlain && name !== "Object" && !isEs6Ins && !isEs5Ins)
      return `NativeInstance<${name}>`;
    if (isEs6Ins || isEs5Ins)
      return `ES${isEs5Ins ? "5" : "6"}.Instance<${ctor.name || "(Anonymous)"}>`;
    return "PrototypedObject";
  }
  static _isEs6Ins(proto, ctor) {
    if (typeof ctor !== "function")
      return false;
    return FnTys._isEs6Cls(ctor);
  }
  static _isEs5Ins(v, proto, ctor) {
    return typeof ctor !== "function" || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor) || FnTys._isNative(ctor, Function.prototype.toString.call(ctor))) ? false : FnTys._isEs5Cls(ctor) || proto !== Object.prototype && proto !== Function.prototype;
  }
}

class DesTys {
  static is(v) {
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
    return (hasValue || hasWritable) && (hasGet || hasSet) || hasGet && typeof v.get !== "function" && v.get !== undefined || hasSet && typeof v.set !== "function" && v.set !== undefined || !hasValue && !hasWritable && !hasGet && !hasSet ? false : this._naming(v, hasValue, hasGet, hasSet);
  }
  static _naming(v, hasValue, hasGet, hasSet) {
    return hasGet || hasSet ? this._acc(hasGet, hasSet) : this._dat(v, hasValue);
  }
  static _acc(hasGet, hasSet) {
    return "Access." + (hasGet && hasSet ? "GetSet" : hasGet ? "Get" : "Set");
  }
  static _dat(v, hasValue) {
    return "Data." + (hasValue && typeof v.value === "function" ? "Method" : "Value");
  }
  static name(v) {
    const type = this.is(v);
    return type ? `Descriptor.${type}` : "";
  }
}

class FnTys {
  static name(v) {
    const s = this._removeComments(Function.prototype.toString.call(v)).trim();
    const [isEs6, isEs5] = [this._isEs6Cls(v, s), this._isEs5Cls(v, s)];
    if (isEs6 || isEs5)
      return `ES${isEs5 ? "5" : "6"}.Class<${v.name || "(Anonymous)"}>`;
    if (this._isBound(v, s))
      return `BoundFunction<${v.name.replace(/bound /, "")}>`;
    if (this._isNative(v, s))
      return `Native${this._isNativeClass(v) ? "Class" : "Function"}<${v.name}>`;
    if (this._isArrow(v, s))
      return `${FnAgTys.name(v, s)}ArrowFunction`;
    if (this._isMethod(v, s))
      return `${FnAgTys.name(v, s)}Method`;
    const ag = FnAgTys.name(v, s);
    return `${!ag && !v.name ? "Anonymous" : ag}Function`;
  }
  static _removeComments(s) {
    return s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
  }
  static _isEs6Cls(v, s) {
    if (!s)
      s = Function.prototype.toString.call(v);
    return /^\s*class\b/.test(s);
  }
  static _isEs5Cls(v, s) {
    if (!s)
      s = Function.prototype.toString.call(v);
    if (this._isEs6Cls(v, s) || this._isNative(v, s) || this._isArrow(v, s))
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
  static _isNativeClass(v) {
    return v.prototype !== undefined && typeof v.prototype === "object";
  }
  static _isBound(v, s) {
    return v.name.startsWith("bound ");
  }
  static _isArrow(v, s) {
    return !v.hasOwnProperty("prototype") && s.includes("=>");
  }
  static _isMethod(v, s) {
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

// src/type-names.js
var ANO = "Anonymous";
var NTV = "Native";
var FN = "Function";
var MD = "Method";
var CLS = "Class";
var INS = "Instance";
var ARW = "Arrow";
var AS = "Async";
var SY = "Sync";
var GEN = "Generator";
var DES = "Descriptor";
var O = "Object";
var P = "Primitive";
var DGR = "Danger";
var PT = "rototype";
var CINm = (i, k, C) => i + k + (C ? `<${C.name || "(" + ANO + ")"}>` : "");
var CNm = (n, C) => CINm(n, CLS, C);
var INm = (n, C) => CINm(n, INS, C);
var DNm = (k, i = "") => DES + `${k}${i}`;
var DDNm = (i) => DNm(".Data", i);
var DANm = (i) => DNm(".Access", i);
var TYPE_NAMES = {
  Boolean: { name: "Boolean", path: "p.bln" },
  Integer: { name: "Integer", path: "p.int" },
  Finite: { name: "Finite", path: "p.fin" },
  BigInt: { name: "BigInt", path: "p.big" },
  String: { name: "String", path: "p.str" },
  Symbol: { name: "Symbol", path: "p.sym" },
  Primitive: { name: P, path: "p" },
  PlainObject: { name: "Plain" + O, path: "o.obj" },
  Array: { name: "Array", path: "o.ary" },
  AsyncArrowFn: { name: AS + ARW + FN, path: "o.fn.arrow.a" },
  SyncArrowFn: { name: SY + ARW + FN, path: "o.fn.arrow.s" },
  ArrowFn: { name: ARW + FN, path: "o.fn.arrow" },
  BoundFn: { name: "Bound" + FN, path: "o.fn.bound" },
  NativeFn: { name: NTV + FN, path: "o.fn.native" },
  AsyncFn: { name: AS + FN, path: "o.fn.a" },
  GenFn: { name: GEN + FN, path: "o.fn.g" },
  AsyncGenFn: { name: AS + GEN + FN, path: "o.fn.ag" },
  SyncFn: { name: SY + FN, path: "o.fn.s" },
  AnonFn: { name: ANO + FN, path: "o.fn.anonymous" },
  Function: { name: FN, path: "o.fn" },
  ES6Class: { name: (v, C) => CNm("ES6.", C), path: "o.cls.es6" },
  ES5Class: { name: (v, C) => CNm("ES5.", C), path: "o.cls.es5" },
  NativeClass: { name: (v, C) => CNm(NTV, C), path: "o.cls.native" },
  Class: { name: CLS, path: "o.cls" },
  ES6Inst: { name: (v, C) => INm("ES6.", C), path: "o.ins.es6" },
  ES5Inst: { name: (v, C) => INm("ES5.", C), path: "o.ins.es5" },
  NativeInst: { name: (v, C) => INm(NTV, C), path: "o.ins.native" },
  Instance: { name: INS, path: "o.ins" },
  DesDataVal: { name: DDNm(".Value"), path: "o.des.d.v" },
  DesDataMeth: { name: DDNm(".Method"), path: "o.des.d.m" },
  DesData: { name: DDNm(), path: "o.des.d" },
  DesAccGet: { name: DANm(".Get"), path: "o.des.a.g" },
  DesAccSet: { name: DANm(".Set"), path: "o.des.a.s" },
  DesAccGetSet: { name: DANm(".GetSet"), path: "o.des.a.gs" },
  DesAccess: { name: DANm(), path: "o.des.a" },
  Descriptor: { name: DES, path: "o.des" },
  AsyncMethod: { name: AS + MD, path: "o.md.a" },
  GenMethod: { name: GEN + MD, path: "o.md.g" },
  AsyncGenMeth: { name: AS + GEN + MD, path: "o.md.ag" },
  SyncMethod: { name: SY + MD, path: "o.md.s" },
  Method: { name: MD, path: "o.md" },
  Object: { name: O, path: "o" },
  Undefined: { name: "Undefined", path: "d.und" },
  Null: { name: "Null", path: "d.nul" },
  NaNVal: { name: "NaN", path: "d.num.nan" },
  InfinityVal: { name: "Infinity", path: "d.num.inf" },
  PosInfinity: { name: "PositiveInfinity", path: "d.num.pinf" },
  NegInfinity: { name: "NegativeInfinity", path: "d.num.ninf" },
  OverInteger: { name: "OverInteger", path: "d.num.oint" },
  OverFinite: { name: "OverFinite", path: "d.num.ofin" },
  DangerNum: { name: DGR + "Number", path: "d.num" },
  BoxedPrim: { name: "Boxed" + P, path: "d.obj.boxed" },
  NoneProtoObj: { name: "NoneP" + PT + O, path: "d.obj.noneProto" },
  PrototypedObj: { name: "P" + PT + "d" + O, path: "d.obj.prototyped" },
  DangerObj: { name: DGR + O, path: "d.obj" },
  Danger: { name: DGR, path: "d" }
};

// src/fn-obj.js
var PATH_MAP = Object.create(null);
for (const key in TYPE_NAMES) {
  const item = TYPE_NAMES[key];
  PATH_MAP[item.path] = item;
}
function resolveTypeName(rawPath, v, ...args) {
  const item = PATH_MAP[rawPath];
  if (!item)
    return rawPath;
  return typeof item.name === "function" ? item.name(v, ...args) : item.name;
}

class FnObj {
  static mk(someFn, { getters = {}, methods = {} } = {}) {
    const fn = function(...args) {
      if (new.target)
        throw new ReferenceError("Constructors are not allowed.");
      return someFn(...args);
    };
    fn.some = fn;
    for (const [key, val] of Object.entries(methods)) {
      fn[key] = val;
    }
    for (const [key, val] of Object.entries(getters)) {
      Object.defineProperty(fn, key, { get: () => val });
    }
    return fn;
  }
  static mkEr(isObj, pathStr, rawPath = null) {
    if (rawPath === null) {
      const m = pathStr.match(/\.([pod])\./);
      rawPath = m ? m[1] : "";
    }
    const someFn = (v, ...args) => {
      if (isObj(v, ...args))
        return true;
      const exp = resolveTypeName(rawPath, v, ...args);
      throw new TypeError(`Expected: ${exp}
Actual: ${Tys.name(v)}`);
    };
    const methods = {};
    const getters = {};
    for (const key of Object.getOwnPropertyNames(isObj)) {
      if (["some", "_some", "_", "length", "name", "prototype", "caller", "arguments"].includes(key))
        continue;
      const val = isObj[key];
      if (typeof val === "function") {
        const subKeys = Object.getOwnPropertyNames(val).filter((k) => !["length", "name", "prototype", "caller", "arguments"].includes(k));
        const nextRawPath = rawPath ? `${rawPath}.${key}` : key;
        if (subKeys.length > 0) {
          const subPathStr = pathStr.replace(/\.some\(v\)$/, `.${key}.some(v)`);
          getters[key] = FnObj.mkEr(val, subPathStr, nextRawPath);
        } else {
          methods[key] = (v, ...args) => {
            if (val(v, ...args))
              return true;
            const exp = resolveTypeName(nextRawPath, v, ...args);
            throw new TypeError(`Expected: ${exp}
Actual: ${Tys.name(v)}`);
          };
        }
      }
    }
    if (typeof isObj._ === "function") {
      methods._ = (n, v, ...args) => {
        if (isObj[n](v, ...args))
          return true;
        const nextRawPath = rawPath ? `${rawPath}.${n}` : n;
        const exp = resolveTypeName(nextRawPath, v, ...args);
        throw new TypeError(`Expected: ${exp}
Actual: ${Tys.name(v)}`);
      };
    }
    return this.mk(someFn, { getters, methods });
  }
}

// src/typ.js
var Typis = FnObj.mk((v) => "bln int fin big str sym".split(" ").some((n) => Typis[n](v)), {
  methods: {
    bln: (v) => typeof v === "boolean",
    int: (v) => Number.isSafeInteger(v),
    fin: (v) => Number.isFinite(v) && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v,
    big: (v) => typeof v === "bigint",
    str: (v) => typeof v === "string",
    sym: (v) => typeof v === "symbol"
  }
});

// src/tyo.js
var TyoisArrFn = FnObj.mk((v) => Tys.name(v).endsWith("ArrowFunction"), {
  methods: {
    a: (v) => Tys.name(v) === "AsyncArrowFunction",
    s: (v) => Tys.name(v) === "ArrowFunction"
  }
});
var TyoisFn = FnObj.mk((v) => {
  const N = Tys.name(v);
  return N.endsWith("Function") || `Bound Native`.split(" ").some((n) => N.startsWith(n + "Function<"));
}, {
  getters: { arrow: TyoisArrFn },
  methods: {
    bound: (v) => Tys.name(v).startsWith(`BoundFunction<`),
    native: (v) => Tys.name(v).startsWith(`NativeFunction<`),
    a: (v) => Tys.name(v) === "AsyncFunction",
    g: (v) => Tys.name(v) === "GeneratorFunction",
    ag: (v) => Tys.name(v) === "AsyncGeneratorFunction",
    s: (v) => Tys.name(v) === "SyncFunction",
    anonymous: (v) => Tys.name(v) === "AnonymousFunction",
    _some: (N) => N.endsWith("Function") || `Bound Native`.split(" ").some((n) => N.startsWith(n + "Function<"))
  }
});
var TyoisCls = FnObj.mk((v) => ["", "ES5.", "Native"].some((n) => Tys.name(v).startsWith(`${n}Class<`)), {
  methods: {
    es6: (v) => Tys.name(v).startsWith("Class<"),
    es5: (v) => Tys.name(v).startsWith("ES5.Class<"),
    native: (v) => Tys.name(v).startsWith("NativeClass<")
  }
});
var TyoisIns = FnObj.mk((v, C) => ["", "ES5.", "Native"].some((n) => Tys.name(v).startsWith(`${n}Instance<`)) && (C ? v instanceof C : true), {
  methods: {
    es6: (v, C) => Tys.name(v).startsWith("Instance<") && (C ? v instanceof C : true),
    es5: (v, C) => Tys.name(v).startsWith("ES5.Instance<") && (C ? v instanceof C : true),
    native: (v, C) => Tys.name(v).startsWith("NativeInstance<") && (C ? v instanceof C : true)
  }
});
var TyoisDesDA = (v, names) => names.map((n) => `Descriptor<${n}>`).some((n) => n === Tys.name(v));
var TyoisDesD = FnObj.mk((v) => TyoisDesDA(v, "Value Method".split(" ")), {
  methods: {
    v: (v) => Tys.name(v) === "Descriptor<Value>",
    m: (v) => Tys.name(v) === "Descriptor<Method>"
  }
});
var TyoisDesA = FnObj.mk((v) => TyoisDesDA(v, "Getter Setter Accessor".split(" ")), {
  methods: {
    g: (v) => Tys.name(v) === "Descriptor<Getter>",
    s: (v) => Tys.name(v) === "Descriptor<Setter>",
    gs: (v) => Tys.name(v) === "Descriptor<Accessor>"
  }
});
var TyoisDes = FnObj.mk((v) => Tys.name(v).startsWith("Descriptor<"), {
  getters: { d: TyoisDesD, a: TyoisDesA }
});
var TyoisMd = FnObj.mk((v) => Tys.name(v).endsWith("Method"), {
  methods: {
    a: (v) => Tys.name(v) === "AsyncMethod",
    g: (v) => Tys.name(v) === "GeneratorMethod",
    ag: (v) => Tys.name(v) === "AsyncGeneratorMethod",
    s: (v) => Tys.name(v) === "Method"
  }
});
var Tyois = FnObj.mk((v) => {
  const N = Tys.name(v);
  return TyoisFn._some(N) || ["Method"].some((n) => N.endsWith(n)) || ["PlainObject", "Array"].some((n) => n === N) || ["Descriptor", "Class", "Instance"].some((n) => N.startsWith(n + "<"));
}, {
  getters: { cls: TyoisCls, ins: TyoisIns, des: TyoisDes, fn: TyoisFn, md: TyoisMd },
  methods: {
    obj: (v) => Tys.name(v) === "PlainObject",
    ary: (v) => Array.isArray(v)
  }
});

// src/tyd.js
var TydisNum = FnObj.mk((v) => "nan inf ofin".split(" ").some((n) => TydisNum[n](v)), {
  methods: {
    nan: (v) => Number.isNaN(v),
    inf: (v) => [Infinity, -Infinity].some((x) => x === v),
    pinf: (v) => v === Infinity,
    ninf: (v) => v === -Infinity,
    oint: (v) => Number.isInteger(v) && !Number.isSafeInteger(v),
    ofin: (v) => Number.isFinite(v) && (Number.MAX_SAFE_INTEGER < v || v < Number.MIN_SAFE_INTEGER)
  }
});
var TydisObj = FnObj.mk((v) => {
  const N = Tys.name(v);
  return N.startsWith(`BoxedPrimitive<`) || "HasNotPrototypeObject PrototypedObject".split(" ").some((n) => n === N);
}, {
  methods: {
    boxed: (v) => Tys.name(v).startsWith(`BoxedPrimitive<`),
    noneProto: (v) => Tys.name(v) === "NonePrototypeObject",
    prototyped: (v) => Tys.name(v) === "PrototypedObject"
  }
});
var Tydis = FnObj.mk((v) => "und nul".split(" ").some((n) => Tydis[n](v)) || "num obj".split(" ").some((n) => Tydis[n].some(v)), {
  getters: { num: TydisNum, obj: TydisObj },
  methods: {
    und: (v) => v === undefined,
    nul: (v) => v === null
  }
});

// src/main.js
var owTp = FnObj.mkEr(Typis, "isT.p.some(v)");
var owTo = FnObj.mkEr(Tyois, "isT.o.some(v)");
var owTd = FnObj.mkEr(Tydis, "isT.d.some(v)");
var isT = Object.freeze({
  get p() {
    return Typis;
  },
  get o() {
    return Tyois;
  },
  get d() {
    return Tydis;
  }
});
var owT = Object.freeze({
  get p() {
    return owTp;
  },
  get o() {
    return owTo;
  },
  get d() {
    return owTd;
  }
});
var tof = (v) => Tys.name(v);
export {
  tof,
  owT,
  isT
};

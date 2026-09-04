(() => {
  // ../../../../typ-build-lqeie3djv3/wrapped.js
  (function() {
    var module = { exports: {} };
    var exports = module.exports;
    var __defProp = Object.defineProperty;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    function __accessProp(key2) {
      return this[key2];
    }
    var __toCommonJS = (from) => {
      var entry = (__moduleCache ??= new WeakMap).get(from), desc;
      if (entry)
        return entry;
      entry = __defProp({}, "__esModule", { value: true });
      if (from && typeof from === "object" || typeof from === "function") {
        for (var key2 of __getOwnPropNames(from))
          if (!__hasOwnProp.call(entry, key2))
            __defProp(entry, key2, {
              get: __accessProp.bind(from, key2),
              enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable
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
    var exports_main = {};
    __export(exports_main, {
      tof: () => tof,
      owT: () => owT,
      isT: () => isT
    });
    module.exports = __toCommonJS(exports_main);

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
          return `HasNotPrototypeObject`;
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
          return `${isEs5Ins ? "ES5." : ""}Instance<${ctor.name || "(Anonymous)"}>`;
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
        if (!keys.every((key2) => allowedKeys.includes(key2)))
          return false;
        const hasValue = keys.includes("value");
        const hasWritable = keys.includes("writable");
        const hasGet = keys.includes("get") && v.get !== undefined;
        const hasSet = keys.includes("set") && v.set !== undefined;
        return (hasValue || hasWritable) && (hasGet || hasSet) || hasGet && typeof v.get !== "function" && v.get !== undefined || hasSet && typeof v.set !== "function" && v.set !== undefined || !hasValue && !hasWritable && !hasGet && !hasSet ? false : this._naming(v, hasValue, hasGet, hasSet);
      }
      static _naming(v, hasValue, hasGet, hasSet) {
        return hasGet || hasSet ? hasGet && hasSet ? "Accessor" : hasGet ? "Getter" : "Setter" : hasValue && typeof v.value === "function" ? "Method" : "Value";
      }
      static name(v) {
        const type = this.is(v);
        return type ? `Descriptor<${type}>` : "";
      }
    }

    class FnTys {
      static name(v) {
        const s = this._removeComments(Function.prototype.toString.call(v)).trim();
        const [isEs6, isEs5] = [this._isEs6Cls(v, s), this._isEs5Cls(v, s)];
        if (isEs6 || isEs5)
          return `${isEs5 ? "ES5." : ""}Class<${v.name || "(Anonymous)"}>`;
        if (this._isBound(v, s))
          return `BoundFunction<${v.name.replace(/bound /, "")}>`;
        if (this._isNative(v, s))
          return `Native${this._isNativeClass(v) ? "Class" : "Function"}<${v.name}>`;
        if (this._isArrow(v, s))
          return `${FnAgTys.name(v, s)}ArrowFunction`;
        if (this._isMethod(v, s))
          return `${FnAgTys.name(v, s)}Method`;
        const ag = FnAgTys.name(v, s);
        return !ag && !v.name ? "AnonymousFunction" : `${ag}Function`;
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
    var PT = "rototype";
    var CINm = (i, k, C) => i + k + (C ? `<${C.name || "(" + ANO + ")"}>` : "");
    var CNm = (n, C) => CINm(n, CLS);
    var INm = (n, C) => CINm(n, INS);
    var DNm = (k, i = "") => DES + `${k}${i}`;
    var DDNm = (i) => DNm(".Data", i);
    var DANm = (i) => DNm(".Access", i);
    var TYPE_MAP = {
      "p.bln": "Boolean",
      "p.int": "Integer",
      "p.fin": "Finite",
      "p.big": "BigInt",
      "p.str": "String",
      "p.sym": "Symbol",
      p: P,
      "o.obj": "Plain" + O,
      "o.ary": "Array",
      "o.fn.arrow.a": AS + ARW + FN,
      "o.fn.arrow.s": SY + ARW + FN,
      "o.fn.arrow": ARW + FN,
      "o.fn.bound": "Bound" + FN,
      "o.fn.native": NTV + FN,
      "o.fn.a": AS + FN,
      "o.fn.g": GEN + FN,
      "o.fn.ag": AS + GEN + FN,
      "o.fn.s": FN,
      "o.fn.anonymous": ANO + FN,
      "o.fn": FN,
      "o.cls.es6": (v, C) => CNm("ES6.", C),
      "o.cls.es5": (v, C) => CNm("ES5.", C),
      "o.cls.native": (v, C) => CNm(NTV, C),
      "o.cls": CLS,
      "o.ins.es6": (v, C) => INm("ES6.", C),
      "o.ins.es5": (v, C) => INm("ES5.", C),
      "o.ins.native": (v, C) => INm(NTV, C),
      "o.ins": INS,
      "o.des.d.v": DDNm(".Value"),
      "o.des.d.m": DDNm(".Method"),
      "o.des.d": DDNm(),
      "o.des.a.g": DANm(".Get"),
      "o.des.a.s": DANm(".Set"),
      "o.des.a.a": DANm(".GetSet"),
      "o.des.a": DANm(),
      "o.des": DES,
      "o.md.a": AS + MD,
      "o.md.g": GEN + MD,
      "o.md.ag": AS + GEN + MD,
      "o.md.s": SY + MD,
      "o.md": MD,
      o: O,
      "d.und": "Undefined",
      "d.nul": "Null",
      "d.num.nan": "NaN",
      "d.num.inf": "Infinity",
      "d.num.pinf": "Infinity",
      "d.num.ninf": "-Infinity",
      "d.num.oint": "Finite",
      "d.num.ofin": "Finite",
      "d.num": "Number",
      "d.obj.boxed": "Boxed" + P,
      "d.obj.hasNotProto": "HasNotP" + PT + O,
      "d.obj.prototyped": "P" + PT + "d" + O,
      "d.obj": O,
      d: "Data"
    };

    class FnObj {
      static mk(someFn, { getters = {}, methods = {} } = {}) {
        const fn = function(...args) {
          if (new.target)
            throw new ReferenceError("Constructors are not allowed.");
          return someFn(...args);
        };
        fn.some = fn;
        for (const [key2, val] of Object.entries(methods)) {
          fn[key2] = val;
        }
        for (const [key2, val] of Object.entries(getters)) {
          Object.defineProperty(fn, key2, { get: () => val });
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
          const resolver = TYPE_MAP[rawPath];
          const exp = typeof resolver === "function" ? resolver(v, ...args) : resolver || pathStr;
          throw new TypeError(`Expected: ${exp}
Actual: ${Tys.name(v)}`);
        };
        const methods = {};
        const getters = {};
        for (const key2 of Object.getOwnPropertyNames(isObj)) {
          if (["some", "_some", "_", "length", "name", "prototype", "caller", "arguments"].includes(key2))
            continue;
          const val = isObj[key2];
          if (typeof val === "function") {
            const subKeys = Object.getOwnPropertyNames(val).filter((k) => !["length", "name", "prototype", "caller", "arguments"].includes(k));
            const nextRawPath = rawPath ? `${rawPath}.${key2}` : key2;
            if (subKeys.length > 0) {
              const subPathStr = pathStr.replace(/\.some\(v\)$/, `.${key2}.some(v)`);
              getters[key2] = FnObj.mkEr(val, subPathStr, nextRawPath);
            } else {
              methods[key2] = (v, ...args) => {
                if (val(v, ...args))
                  return true;
                const resolver = TYPE_MAP[nextRawPath];
                const exp = typeof resolver === "function" ? resolver(v, ...args) : resolver || val.toString();
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
            const resolver = TYPE_MAP[nextRawPath];
            const exp = typeof resolver === "function" ? resolver(v, ...args) : resolver || isObj[n].toString();
            throw new TypeError(`Expected: ${exp}
Actual: ${Tys.name(v)}`);
          };
        }
        return this.mk(someFn, { getters, methods });
      }
    }
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
        s: (v) => Tys.name(v) === "Function",
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
        a: (v) => Tys.name(v) === "Descriptor<Accessor>"
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
        hasNotProto: (v) => Tys.name(v) === "HasNotPrototypeObject",
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
    var exported = module.exports;
    var targetGlobal = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : null;
    if (targetGlobal) {
      for (var key in exported) {
        if (Object.prototype.hasOwnProperty.call(exported, key)) {
          targetGlobal[key] = exported[key];
        }
      }
    }
  })();
})();

(() => {
  // ../../../../typ-build-x3z2f1uwki/wrapped.js
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
      tof: () => tof2,
      owT: () => owT,
      isT: () => isT
    });
    module.exports = __toCommonJS(exports_main);
    var getTag = (v) => Object.prototype.toString.call(v).slice(8, -1);

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
          return FnTys2.name(v);
        const tag = this._tag(v);
        return to === "object" ? ObjTys2.is(v, tag) : tag === "Number" ? this._num(v, tag) : tag;
      }
      static _tag(v) {
        return Object.prototype.toString.call(v).slice(8, -1);
      }
      static _num(v, name) {
        return Number.isNaN(v) ? "NaN" : v === Infinity ? "Infinity" : v === -Infinity ? "-Infinity" : Number.isSafeInteger(v) ? "Integer" : Number.isFinite(v) ? "Finite" : name;
      }
    }

    class ObjTys2 {
      static is(v, tag) {
        const proto = Object.getPrototypeOf(v);
        if (proto === null)
          return `HasNotPrototypeObject`;
        if ([Boolean, Number, String].some((C) => v instanceof C)) {
          return `BoxedPrimitive<${v.constructor.name}>`;
        }
        const des = DesTys.name(v);
        if (des)
          return des;
        const isPlain2 = Object.prototype === proto;
        if (isPlain2)
          return `PlainObject`;
        const ctor = proto.constructor;
        const isEs6Ins = this._isInsEs6(proto, ctor);
        const isEs5Ins = this._isInsEs5(v, proto, ctor);
        if (!isPlain2 && tag !== "Object" && !isEs6Ins && !isEs5Ins)
          return `NativeInstance<${tag}>`;
        if (isEs6Ins || isEs5Ins)
          return `${isEs5Ins ? "ES5." : ""}Instance<${ctor.name || "(Anonymous)"}>`;
        return "PrototypedObject";
      }
      static _isInsEs6(proto, ctor) {
        if (typeof ctor !== "function")
          return false;
        return FnTys2._isEs6Cls(ctor);
      }
      static _isInsEs5(v, proto, ctor) {
        return typeof ctor !== "function" || (ctor === Object || ctor === Function) || (FnTys2._isEs6Cls(ctor) || FnTys2._isNative(ctor, Function.prototype.toString.call(ctor))) ? false : FnTys2._isEs5Cls(ctor) || proto !== Object.prototype && proto !== Function.prototype;
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

    class FnTys2 {
      static name(v) {
        const s = Function.prototype.toString.call(v);
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
      static _isEs6Cls(v, s) {
        if (!s)
          s = Function.prototype.toString.call(v);
        return /^\s*(?:\/\*[\s\S]*?\*\/\s*)*class\b/.test(s);
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
        const cleanS = s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""').replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, "//");
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
        return /\bfunction\b/.test(s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "")) ? false : !s.includes("=>");
      }
    }

    class FnAgTys {
      static name(v, s) {
        if (typeof v !== "function")
          return "";
        const cName = v.constructor?.name;
        if (cName === "AsyncGeneratorFunction")
          return "AsyncGenerator";
        if (cName === "GeneratorFunction")
          return "Generator";
        if (cName === "AsyncFunction")
          return "Async";
        if (!s)
          s = Function.prototype.toString.call(v);
        const cleanStr = s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").trim();
        const isAsync = cleanStr.startsWith("async") || cleanStr.includes("async ");
        const isGenerator = s.includes("*");
        return isAsync && isGenerator ? "AsyncGenerator" : isGenerator ? "Generator" : isAsync ? "Async" : "";
      }
    }

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
      static mkEr(isObj, pathStr) {
        const someFn = (v, ...args) => {
          if (isObj(v, ...args))
            return true;
          throw new TypeError(`Expected: a value that makes '${pathStr}' return true.
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
            if (subKeys.length > 0) {
              const subPathStr = pathStr.replace(/\.some\(v\)$/, `.${key2}.some(v)`);
              getters[key2] = FnObj.mkEr(val, subPathStr);
            } else {
              methods[key2] = (v, ...args) => {
                if (val(v, ...args))
                  return true;
                throw new TypeError(`Expected: '${val.toString()}' like value.
Actual: ${Tys.name(v)}`);
              };
            }
          }
        }
        if (typeof isObj._ === "function") {
          methods._ = (n, v, ...args) => {
            if (isObj[n](v, ...args))
              return true;
            throw new TypeError(`Expected: '${isObj[n].toString()}' like value.
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
    var getBody = (v) => Function.prototype.toString.call(v);
    var rmCmt = (s) => s.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    var isNtv = (v, s) => s.includes("[native code]");
    var isNtvCls = (v, s) => v.prototype !== undefined && typeof v.prototype === "object";
    var isBnd = (v, s) => v.name.startsWith("bound ");
    var isArw = (v, s) => !v.hasOwnProperty("prototype") && s.includes("=>");
    var isMd = (v, s) => /\bfunction\b/.test(rmCmt(s)) ? false : !s.includes("=>");
    var isEs6Cls = (v, s) => /^\s*class\b/.test(rmCmt(s || getBody(v)));
    var isEs5Cls = (v, s) => isEs5ClsSub(v, s || getBody(v), v.prototype);
    var isEs5ClsSub = (v, s, proto) => isEs6Cls(v, s) || isNtv(v, s) || isArw(v, s) || (!proto || typeof proto !== "object") || proto.constructor !== v ? false : isEs5ClsCustom(v, s, proto);
    var isEs5ClsCustom = (v, s, proto) => isEs5ClsKeys(v, s, proto, Object.getOwnPropertyNames(proto));
    var isEs5ClsKeys = (v, s, proto, keys) => isEs5ClsEnd(v.name, rmCmt(s).replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""').replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, "//"), keys.length > 1 || keys.length === 1 && keys[0] !== "constructor");
    var isEs5ClsEnd = (name, s, hasCustomProps) => hasCustomProps || /\bthis\./.test(s) ? true : /^[A-Z]/.test(name || "");
    var getEsClsNm = (v, s) => getEsClsNmSub(v, isEs6Cls(v, s), isEs5Cls(v, s));
    var getEsClsNmSub = (v, is6, is5) => is6 || is5 ? `${is5 ? "ES5." : ""}Class<${v.name || "(Anonymous)"}>` : null;
    var getBndNm = (v, s) => isBnd(v, s) ? `BoundFunction<${v.name.replace(/bound /, "")}>` : null;
    var getNtvNm = (v, s) => isNtv(v, s) ? `Native${isNtvCls(v) ? "Class" : "Function"}<${v.name}>` : null;
    var getArwNm = (v, s, ag) => isArw(v, s) ? `${ag}ArrowFunction` : null;
    var getMdNm = (v, s, ag) => isMd(v, s) ? `${ag}Method` : null;
    var getFnNm = (v, ag) => !ag && !v.name ? "AnonymousFunction" : `${ag}Function`;
    var getAgNm = (v, s) => isAgCtor(v.constructor?.name) ? v.constructor?.name.replace(/Function$/, "") : getAgNmS(v, rmCmt(s).trim());
    var isAgCtor = (n) => n === "AsyncGeneratorFunction" || n === "GeneratorFunction" || n === "AsyncFunction";
    var getAgNmS = (v, s) => getAgNmS2(/^\s*(?:static\s+)?async\b/.test(s), /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s));
    var getAgNmS2 = (isA, isG) => isA && isG ? "AsyncGenerator" : isG ? "Generator" : isA ? "Async" : "";
    var getAgLikeNm = (v, s, ag) => isArw(v, s) ? getArwNm(v, s, ag) : isMd(v, s, ag) ? getMdNm(v, s, ag) : getFnNm(v, ag);
    var getNameSub = (v, s) => isEs6Cls(v, s) || isEs5Cls(v, s) ? getEsClsNm(v, s) : isBnd(v, s) ? getBndNm(v, s) : isNtv(v, s) ? getNtvNm(v, s) : getAgLikeNm(v, s, getAgNm(v, s));
    var FnTys3 = {
      name: (v) => getNameSub(v, getBody(v)),
      _isEs6Cls: (v) => isEs6Cls(v),
      _isEs5Cls: (v) => isEs5Cls(v),
      _isNative: (v) => getBody(v).includes("[native code]")
    };
    var A = ["value", "writable", "get", "set", "configurable", "enumerable"];
    var getKeys = (v) => Object.getOwnPropertyNames(v);
    var isValidKeys = (k) => k.length && k.every((x) => A.includes(x));
    var getN = (v, l, w, g, s) => g && s ? "Accessor" : g ? "Getter" : s ? "Setter" : l && typeof v.value == "function" ? "Method" : "Value";
    var parseDes = (v, k, l = k.includes("value"), w = k.includes("writable"), g = k.includes("get") && v.get !== undefined, s = k.includes("set") && v.set !== undefined) => !((l || w) && (g || s) || g && typeof v.get != "function" || s && typeof v.set != "function" || !l && !w && !g && !s) && `Descriptor<${getN(v, l, w, g, s)}>`;
    var evalDes = (v, k) => isValidKeys(k) && parseDes(v, k);
    var DesTys2 = { name: (v) => evalDes(v, getKeys(v)) || "" };
    var nNm = (v) => Number.isNaN(v) ? "NaN" : v === Infinity ? "Infinity" : v === -Infinity ? "-Infinity" : Number.isSafeInteger(v) ? "Integer" : Number.isFinite(v) ? "Finite" : false;
    var getBoxedName = (v) => [Boolean, Number, String].some((C) => v instanceof C) ? `BoxedPrimitive<${v.constructor.name}>` : null;
    var isInsEs62 = (proto, ctor) => typeof ctor !== "function" ? false : FnTys3._isEs6Cls(ctor);
    var isInsEs52 = (proto, ctor) => typeof ctor !== "function" || (ctor === Object || ctor === Function) || (FnTys3._isEs6Cls(ctor) || FnTys3._isNative(ctor)) ? false : FnTys3._isEs5Cls(ctor) || proto !== Object.prototype && proto !== Function.prototype;
    var getInstanceName = (v, proto, ctor, tag) => {
      const isEs6 = isInsEs62(proto, ctor);
      const isEs5 = isInsEs52(proto, ctor);
      return isEs6 || isEs5 ? `${isEs5 ? "ES5." : ""}Instance<${ctor.name || "(Anonymous)"}>` : tag !== "Object" ? `NativeInstance<${tag}>` : null;
    };
    var getHasObjNm = (v, tag, proto, boxed, des, inst) => boxed ? boxed : des ? des : proto === Object.prototype ? "PlainObject" : inst ? inst : "PrototypedObject";
    var oNm = (v, tag, proto) => proto === null ? "HasNotPrototypeObject" : getHasObjNm(v, tag, proto, getBoxedName(v), DesTys2.name(v), getInstanceName(v, proto, proto.constructor, tag));
    var onNm = (v, to, tag) => to === "object" ? oNm(v, tag, Object.getPrototypeOf(v)) : tag === "Number" ? nNm(v, tag) : tag;
    var foNm = (v, to, tag) => to === "function" ? FnTys3.name(v) : onNm(v, to, getTag(v));
    var tof = (v) => v === null ? "Null" : v === undefined ? "Undefined" : Array.isArray(v) ? "Array" : foNm(v, typeof v);
    var TyoisArrFn = FnObj.mk((v) => tof(v).endsWith("ArrowFunction"), {
      methods: {
        a: (v) => tof(v) === "AsyncArrowFunction",
        s: (v) => tof(v) === "ArrowFunction"
      }
    });
    var TyoisFn = FnObj.mk((v) => {
      const N = tof(v);
      return N.endsWith("Function") || `Bound Native`.split(" ").some((n) => N.startsWith(n + "Function<"));
    }, {
      getters: { arrow: TyoisArrFn },
      methods: {
        bound: (v) => tof(v).startsWith(`BoundFunction<`),
        native: (v) => tof(v).startsWith(`NativeFunction<`),
        a: (v) => tof(v) === "AsyncFunction",
        g: (v) => tof(v) === "GeneratorFunction",
        ag: (v) => tof(v) === "AsyncGeneratorFunction",
        s: (v) => tof(v) === "Function",
        anonymous: (v) => tof(v) === "AnonymousFunction",
        _some: (N) => N.endsWith("Function") || `Bound Native`.split(" ").some((n) => N.startsWith(n + "Function<"))
      }
    });
    var TyoisCls = FnObj.mk((v) => ["", "ES5.", "Native"].some((n) => tof(v).startsWith(`${n}Class<`)), {
      methods: {
        es6: (v) => tof(v).startsWith("Class<"),
        es5: (v) => tof(v).startsWith("ES5.Class<"),
        native: (v) => tof(v).startsWith("NativeClass<")
      }
    });
    var TyoisIns = FnObj.mk((v, C) => ["", "ES5.", "Native"].some((n) => tof(v).startsWith(`${n}Instance<`)) && (C ? v instanceof C : true), {
      methods: {
        es6: (v, C) => tof(v).startsWith("Instance<") && (C ? v instanceof C : true),
        es5: (v, C) => tof(v).startsWith("ES5.Instance<") && (C ? v instanceof C : true),
        native: (v, C) => tof(v).startsWith("NativeInstance<") && (C ? v instanceof C : true)
      }
    });
    var TyoisDesDA = (v, names) => names.map((n) => `Descriptor<${n}>`).some((n) => n === tof(v));
    var TyoisDesD = FnObj.mk((v) => TyoisDesDA(v, "Value Method".split(" ")), {
      methods: {
        v: (v) => tof(v) === "Descriptor<Value>",
        m: (v) => tof(v) === "Descriptor<Method>"
      }
    });
    var TyoisDesA = FnObj.mk((v) => TyoisDesDA(v, "Getter Setter Accessor".split(" ")), {
      methods: {
        g: (v) => tof(v) === "Descriptor<Getter>",
        s: (v) => tof(v) === "Descriptor<Setter>",
        a: (v) => tof(v) === "Descriptor<Accessor>"
      }
    });
    var TyoisDes = FnObj.mk((v) => tof(v).startsWith("Descriptor<"), {
      getters: { d: TyoisDesD, a: TyoisDesA }
    });
    var TyoisMd = FnObj.mk((v) => tof(v).endsWith("Method"), {
      methods: {
        a: (v) => tof(v) === "AsyncMethod",
        g: (v) => tof(v) === "GeneratorMethod",
        ag: (v) => tof(v) === "AsyncGeneratorMethod",
        s: (v) => tof(v) === "Method"
      }
    });
    var Tyois = FnObj.mk((v) => {
      const N = tof(v);
      return TyoisFn._some(N) || ["Method"].some((n) => N.endsWith(n)) || ["PlainObject", "Array"].some((n) => n === N) || ["Descriptor", "Class", "Instance"].some((n) => N.startsWith(n + "<"));
    }, {
      getters: { cls: TyoisCls, ins: TyoisIns, des: TyoisDes, fn: TyoisFn, md: TyoisMd },
      methods: {
        obj: (v) => tof(v) === "PlainObject",
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
      const N = tof(v);
      return N.startsWith(`BoxedPrimitive<`) || "HasNotPrototypeObject PrototypedObject".split(" ").some((n) => n === N);
    }, {
      methods: {
        boxed: (v) => tof(v).startsWith(`BoxedPrimitive<`),
        hasNotProto: (v) => tof(v) === "HasNotPrototypeObject",
        prototyped: (v) => tof(v) === "PrototypedObject"
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
    var tof2 = (v) => Tys.name(v);
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

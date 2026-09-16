(() => {
  // ../../../../../typ-build-0ecnjuiz0l1/wrapped.js
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
      tow: () => tow,
      tof: () => tof,
      tis: () => tis,
      isTypeTreeNode: () => isTypeTreeNode,
      getTag: () => getTag,
      defV: () => defV
    });
    module.exports = __toCommonJS(exports_main);
    var N = {
      t: { o: "object", f: "function" },
      o: "Object",
      f: "Function",
      n: "Native",
      es6: "ES6",
      es5: "ES5",
      c: "Class",
      i: "Instance",
      m: "Method",
      s: "Sync",
      a: "Async",
      g: "Generator",
      ag: "AsyncGenerator",
      A: "Anonymous",
      N: {
        i: "Integer",
        f: "Finite",
        I: "Infinity",
        n: "NaN"
      },
      d: "Descriptor",
      D: {
        v: "Value",
        a: "Accessor",
        g: "Getter",
        s: "Setter"
      }
    };
    var tnm = (v) => {
      const t = typeof v;
      const tag = Object.prototype.toString.call(v).slice(8, -1);
      if ([null, undefined].some((x) => x === v) || Array.isArray(v))
        return tag;
      return [null, undefined].some((x) => x === v) || Array.isArray(v) ? tag : t === "function" ? FnTys.name(v) : t === "object" ? ObjTys.name(v, tag) : Number.isNaN(v) ? "NaN" : v === Infinity ? "Infinity" : v === -Infinity ? "-Infinity" : Number.isSafeInteger(v) ? "Integer" : Number.isFinite(v) ? "Finite" : tag;
    };
    var getCode = (v) => Function.prototype.toString.call(v).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""').replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, "//").trim();

    class ObjTys {
      static name(v, tag) {
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
        if (!isPlain && tag !== "Object" && !isEs6Ins && !isEs5Ins)
          return `NativeInstance<${tag}>`;
        if (isEs6Ins || isEs5Ins)
          return `${isEs5Ins ? "ES5." : ""}Instance<${ctor.name || "(Anonymous)"}>`;
        return "PrototypedObject";
      }
      static #isEs6Ins(proto, ctor) {
        return typeof ctor !== "function" ? false : FnTys._isEs6Cls(ctor, getCode(ctor));
      }
      static #isEs5Ins(proto, ctor) {
        const f = typeof ctor === "function";
        const s = f ? getCode(ctor) : "";
        return !f || (ctor === Object || ctor === Function) || (FnTys._isEs6Cls(ctor, s) || FnTys._isNative(ctor, s)) ? false : FnTys._isEs5Cls(ctor, s) || proto !== Object.prototype && proto !== Function.prototype;
      }
    }

    class DesTys {
      static name(v) {
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
        return (hasValue || hasWritable) && (hasGet || hasSet) || hasGet && typeof v.get !== "function" && v.get !== undefined || hasSet && typeof v.set !== "function" && v.set !== undefined || !hasValue && !hasWritable && !hasGet && !hasSet ? "" : `Descriptor<${this.#naming(v, hasValue, hasGet, hasSet)}>`;
      }
      static #naming(v, hasValue, hasGet, hasSet) {
        return hasGet || hasSet ? hasGet && hasSet ? "Accessor" : hasGet ? "Getter" : "Setter" : hasValue && typeof v.value === "function" ? "Method" : "Value";
      }
    }

    class FnTys {
      static name(v) {
        const s = getCode(v);
        const isEs6 = this._isEs6Cls(v, s);
        const isEs5 = this._isEs5Cls(v, s);
        return isEs6 || isEs5 ? `${isEs5 ? "ES5." : ""}Class<${v.name || "(Anonymous)"}>` : this.#isBound(v, s) ? `BoundFunction<${v.name.replace(/bound /, "")}>` : this._isNative(v, s) ? `Native${this.#isNativeClass(v) ? "Class" : "Function"}<${v.name}>` : this.#isArrow(v, s) ? `${FnAgTys.name(v, s)}ArrowFunction` : this.#isMethod(v, s) ? `${FnAgTys.name(v, s)}Method` : this.#getFnNm(v, FnAgTys.name(v, s));
      }
      static #getFnNm(v, ag) {
        return `${!ag && !v.name ? "Anonymous" : ag}Function`;
      }
      static _isEs6Cls(v, s) {
        return /^\s*class\b/.test(s);
      }
      static _isEs5Cls(v, s) {
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
        if (hasCustomProps || /\bthis\./.test(s))
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
        if (["AsyncGenerator", "Generator", "Async"].some((n) => `${n}Function` === cName))
          return cName.replace(/Function$/, "");
        const isAsync = /^\s*(?:static\s+)?async\b/.test(s);
        const isGenerator = /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s);
        return isAsync && isGenerator ? "AsyncGenerator" : isGenerator ? "Generator" : isAsync ? "Async" : "";
      }
    }
    var getTag = (v) => Object.prototype.toString.call(v).slice(8, -1);
    var isSafeNum = (v) => typeof v === "number" && v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;
    var dObj = (v) => {
      const N2 = tnm(v);
      return N2.startsWith("BoxedPrimitive<") || ["NonePrototype", "Prototyped"].some((n) => N2 === `${n}Object`);
    };
    var MAP = {
      und: { fn: (v) => v === undefined, default: undefined },
      bln: { fn: (v) => typeof v === "boolean", default: false },
      big: { fn: (v) => typeof v === "bigint", default: 0n },
      str: { fn: (v) => typeof v === "string", default: "" },
      sym: { fn: (v) => typeof v === "symbol", default: Symbol() },
      int: { fn: (v) => Number.isSafeInteger(v), full: "Integer", default: 0 },
      fin: { fn: (v) => Number.isFinite(v) && isSafeNum(v), full: "Finite", default: 0 },
      nul: { fn: (v) => v === null, default: null },
      ary: {
        fn: (v) => Array.isArray(v),
        default: [],
        children: {
          empty: { fn: (v) => Array.isArray(v) && v.length === 0, full: "Empty" },
          filled: { fn: (v, T) => Array.isArray(v) && 0 < v.length && (typeof T === "function" ? v.every((x) => T(x)) : true), full: "Filled" },
          gen: { fn: (v, T) => {
            if (typeof T !== "function") {
              throw new TypeError(`tis.ary.gen requires a validation function as the second argument.`);
            }
            return Array.isArray(v) && (v.length === 0 ? true : v.every((x) => T(x)));
          }, full: "Generics" }
        }
      },
      obj: { fn: (v) => tnm(v) === "PlainObject", full: "PlainObject", default: {} },
      run: {
        fn: (v) => {
          const T = tnm(v);
          return ["Function", "Method"].some((n) => T.endsWith(n));
        },
        full: "Run",
        default: null,
        children: {
          fn: {
            fn: (v) => tnm(v).endsWith("Function"),
            default: null,
            full: "Function",
            bound: { fn: (v) => tnm(v) === "BoundFunction", full: "Bound" },
            native: { fn: (v) => tnm(v) === "NativeFunction", full: "Native" },
            arrow: {
              fn: (v) => tnm(v).endsWith("ArrowFunction"),
              full: "Arrow",
              children: {
                s: { fn: (v) => tnm(v) === "ArrowFunction", full: "Sync" },
                a: { fn: (v) => tnm(v) === "AsyncArrowFunction", full: "Async" }
              }
            },
            es5: {
              fn: (v) => tnm(v).endsWith("Function") && !["Bound", "Native", "Arrow"].some((n) => v.startsWith(n)),
              full: "ES5",
              default: null,
              s: { fn: (v) => tnm(v) === "Function", full: "Sync", children: {
                n: { fn: (v) => tnm(v) === "Function", full: "Named" },
                a: { fn: (v) => tnm(v) === "AnonymousFunction", full: "Anonymous" }
              } },
              a: { fn: (v) => tnm(v) === "AsyncFunction", full: "Async" },
              g: { fn: (v) => tnm(v) === "GeneratorFunction", full: "Generator" },
              ag: { fn: (v) => tnm(v) === "AsyncGeneratorFunction", full: "AsyncGenerator" }
            }
          },
          md: {
            fn: (v) => tnm(v).endsWith("Method"),
            default: null,
            full: "Method",
            s: { fn: (v) => tnm(v) === "Method", full: "Sync" },
            a: { fn: (v) => tnm(v) === "AsyncMethod", full: "Async" },
            g: { fn: (v) => tnm(v) === "GeneratorMethod", full: "Generator" },
            ag: { fn: (v) => tnm(v) === "AsyncGeneratorMethod", full: "AsyncGenerator" }
          }
        }
      },
      cls: { fn: (v, P2) => tnm(v).includes("Class<") && (P2 ? v.prototype instanceof P2 : true), full: N.c, default: null, children: {
        es6: { fn: (v, P2) => v.startsWith("Class<") && (P2 ? v.prototype instanceof P2 : true), full: N.es6 },
        es5: { fn: (v, P2) => v.startsWith("ES5.Class<") && (P2 ? v.prototype instanceof P2 : true), full: N.es5 },
        native: { fn: (v, P2) => v.startsWith(`NativeClass<`) && (P2 ? v.prototype instanceof P2 : true), full: N.n }
      } },
      ins: { fn: (v, P2) => tnm(v).includes("Instance<") && (P2 ? v instanceof P2 : true), full: N.i, default: null, children: {
        es6: { fn: (v, P2) => v.startsWith("Instance<") && (P2 ? v instanceof P2 : true), full: N.es6 },
        es5: { fn: (v, P2) => v.startsWith("ES5.Instance<") && (P2 ? v instanceof P2 : true), full: N.es5 },
        native: { fn: (v) => v.startsWith("NativeInstance<") && (P ? v instanceof P : true), full: N.n }
      } },
      des: { fn: (v) => tnm(v).startsWith(`${N.d}<`), full: N.d, default: null, children: {
        d: {
          fn: (v) => {
            const N2 = tnm(v);
            return ["Value", "Method"].some((n) => `${N2.d}<${n}>` === N2);
          },
          full: "Data",
          v: { fn: (v) => `${N.d}<${N.D.v}>` === tnm(v), full: N.D.v },
          m: { fn: (v) => `${N.d}<${N.m}>` === tnm(v), full: N.D.m }
        },
        a: {
          fn: (v) => {
            const N2 = tnm(v);
            return [N2.D.g, N2.D.s, N2.D.a].some((n) => `${N2.d}<${n}>` === N2);
          },
          full: "Access",
          children: {
            g: { fn: (v) => `${N.d}<${N.D.g}>` === tnm(v), full: "Get" },
            s: { fn: (v) => `${N.d}<${N.D.s}>` === tnm(v), full: "Set" },
            gs: { fn: (v) => `${N.d}<${N.D.a}>` === tnm(v), full: "GetSet" },
            hasG: { fn: (v) => {
              const N2 = tnm(v);
              return [N2.D.g, N2.D.a].some((n) => `${N2.d}<${n}>` === N2);
            }, full: "HasGet" },
            hasS: { fn: (v) => {
              const N2 = tnm(v);
              return [N2.D.s, N2.D.a].some((n) => `${N2.d}<${n}>` === N2);
            }, full: "HasSet" }
          }
        }
      } },
      d: {
        fn: (v) => [undefined, null, Infinity, -Infinity].some((x) => x === v) || Number.isNaN(v) || Number.isFinite(v) && (!Number.isSafeInteger(v) || !isSafeNum(v)) || dObj(v),
        full: "Danger",
        num: { fn: (v) => typeof v === "number", full: "Number", default: 0, children: {
          nan: { fn: (v) => Number.isNaN(v), full: "NaN", default: NaN },
          inf: { fn: (v) => typeof v === "number" && !Number.isFinite(v) && !Number.isNaN(v), full: "Infinity", default: Infinity, children: {
            p: { fn: (v) => v === Infinity, full: "Positive", default: Infinity },
            n: { fn: (v) => v === -Infinity, full: "Negative", default: -Infinity }
          } },
          flt: { fn: (v) => Number.isFinite(v) && isSafeNum(v) && !Number.isSafeInteger(v), full: "Float", default: 0 },
          over: { fn: (v) => Number.isFinite(v) && !isSafeNum(v), full: "Over", default: Number.MAX_SAFE_INTEGER + 1 }
        } },
        obj: { fn: dObj, full: "Object", children: {
          none: { fn: (v) => tnm(v) === "NonePrototypeObject", full: "NonePrototype" },
          proto: { fn: (v) => tnm(v) === "PrototypedObject", full: "Prototyped" },
          boxed: { fn: (v) => tnm(v).startsWith("BoxedPrimitive<"), full: "BoxedPrimitive", children: {
            bln: { fn: (v) => tnm(v) === `BoxedPrimitive<Boolean>`, full: "Boolean" },
            num: { fn: (v) => tnm(v) === `BoxedPrimitive<Number>`, full: "Number" },
            str: { fn: (v) => tnm(v) === `BoxedPrimitive<String>`, full: "String" }
          } }
        } }
      },
      g: { fn: (v) => true, default: 0, full: "Group", children: {
        nun: { fn: (v) => Number.isNaN(v) || [null, undefined].some((x) => x === v), full: "NullUndefinedNaN" },
        p: {
          full: "Primitive",
          default: null,
          fn: (v) => {
            const t = typeof v;
            return [null, undefined].some((x) => x === v) || "boolean number string bigint symbol".split(" ").some((n) => n === t);
          }
        },
        o: {
          full: "Object",
          default: null,
          fn: (v) => {
            const t = typeof v;
            return v !== null && "object function".split(" ").some((n) => n === t);
          },
          children: {
            cr: { fn: (v) => typeof v === "funtion", full: "ClassOrRun" },
            ctn: { fn: (v) => typeof v === "object" || tis.cls(v), full: "Container" }
          }
        }
      } }
    };
    var defV = (node) => {
      let curr = node;
      while (curr) {
        if (curr._ && Object.hasOwn(curr._, "default")) {
          return curr._.default;
        }
        curr = curr._.parent;
      }
      return;
    };
    var buildNodes = (defMap, parentNode = null) => {
      const nodes = {};
      for (const [abbr, def] of Object.entries(defMap)) {
        const typeTreeNode = function(...args) {
          return def.fn(...args);
        };
        typeTreeNode._ = {
          name: {
            abbr,
            full: def.full || null
          },
          parent: parentNode,
          fn: def.fn
        };
        if (Object.hasOwn(def, "default")) {
          typeTreeNode._.default = def.default;
        }
        if (def.children) {
          const children = buildNodes(def.children, typeTreeNode);
          Object.assign(typeTreeNode, children);
        }
        nodes[abbr] = typeTreeNode;
      }
      return nodes;
    };
    var rootNodes = buildNodes(MAP);
    var tis = function(v) {
      const result = {};
      for (const [abbr, node] of Object.entries(rootNodes)) {
        result[abbr] = node(v);
      }
      return result;
    };
    Object.assign(tis, rootNodes);
    var isTypeTreeNode = (v) => {
      if (typeof v !== "function" || !v._ || typeof v._ !== "object")
        return false;
      const meta = v._;
      return meta.name && typeof meta.name === "object" && typeof meta.name.abbr === "string" && (meta.name.full === null || typeof meta.name.full === "string") && (meta.parent === null || isTypeTreeNode(meta.parent)) && typeof meta.fn === "function";
    };
    var getPath = (typeTreeNode, key2, v) => {
      const segments = [];
      let curr = typeTreeNode;
      while (curr) {
        segments.unshift(key2 === "abbr" ? curr._.name.abbr : curr._.name.full || getTag(v !== undefined ? v : defV(curr)));
        curr = curr._.parent;
      }
      return segments.join(".");
    };
    var getAbbr = (typeTreeNode) => getPath(typeTreeNode, "abbr");
    var getFull = (typeTreeNode, v) => getPath(typeTreeNode, "full", v);
    var search = (typeTreeNode, v) => {
      if (!typeTreeNode(v))
        return null;
      for (const child of Object.values(typeTreeNode)) {
        if (isTypeTreeNode(child)) {
          const deeper = search(child, v);
          if (deeper)
            return deeper;
        }
      }
      return typeTreeNode;
    };
    var findTypeTreeNode = (v) => {
      for (const rootNode of Object.values(tis)) {
        const matched = search(rootNode, v);
        if (matched)
          return matched;
      }
      throw new TypeError(`Value does not match any defined type: ${v}`);
    };
    var resolveTarget = (input) => isTypeTreeNode(input) ? input : findTypeTreeNode(input);
    var tof = (v) => {
      const typeTreeNode = resolveTarget(v);
      return {
        full: getFull(typeTreeNode, isTypeTreeNode(v) ? undefined : v),
        abbr: getAbbr(typeTreeNode)
      };
    };
    tof.full = (v) => {
      const typeTreeNode = resolveTarget(v);
      return getFull(typeTreeNode, isTypeTreeNode(v) ? undefined : v);
    };
    tof.abbr = (v) => getAbbr(resolveTarget(v));
    var createAssertNode = (typeTreeNode) => {
      const assertFn = (v) => {
        if (!typeTreeNode(v)) {
          const expectedAbbr = getAbbr(typeTreeNode);
          const expectedFull = getFull(typeTreeNode);
          const actualAbbr = tof.abbr(v);
          const actualFull = tof.full(v);
          throw new TypeError(`Expected: ${expectedFull} (${expectedAbbr})
Actual: ${actualFull} (${actualAbbr})`);
        }
        return true;
      };
      assertFn._ = typeTreeNode._;
      for (const [key2, child] of Object.entries(typeTreeNode)) {
        if (isTypeTreeNode(child)) {
          assertFn[key2] = createAssertNode(child);
        }
      }
      return assertFn;
    };
    var assertM = {};
    for (const [key2, typeTreeNode] of Object.entries(tis)) {
      assertM[key2] = createAssertNode(typeTreeNode);
    }
    var tow = assertM;
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

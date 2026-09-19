(() => {
  // ../../../../../typ-build-bmw4fkc4nlo/wrapped.js
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
    var a = "Async";
    var g = "Generator";

    class Ag {
      static N = Object.freeze({
        a,
        g,
        ag: a + g,
        s: "Sync",
        f: "Function",
        m: "Method"
      });
      static getName(f, isSyncOff) {
        return f.ag ? Ag.N.a + Ag.N.g : f.s ? isSyncOff ? "" : Ag.N.s : f.a ? Ag.N.a : Ag.N.g;
      }
      static getFlag(v, s2) {
        const n = v?.constructor?.name;
        return Ag.N.a + Ag.N.g + Ag.N.f === n ? this.#flg(true, true) : Ag.N.g + Ag.N.f === n ? this.#flg(false, true) : Ag.N.a + Ag.N.f === n ? this.#flg(true, false) : this.#isAgC(s2);
      }
      static #isAgC(s2) {
        const a2 = /^\s*(?:static\s+)?async\b/.test(s2);
        const g22 = /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s2);
        return this.#flg(a2, g22);
      }
      static #flg(a2, g22) {
        return { a: a2 && !(a2 && g22), g: g22 && !(a2 && g22), s: !a2 && !g22, ag: a2 && g22 };
      }
    }
    var getCode = (v) => typeof v === "function" ? Function.prototype.toString.call(v).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").trim().replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""').replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, "//") : "";

    class Cls {
      static getFlag(is, v, s2) {
        const es6 = is && this.isEs6(v, s2);
        const es5 = is && this.isEs5(v, s2);
        const native = is && Fn.isNative(v, s2) && this.isNative(v);
        return { is: es6 || es5 || native, es6, es5, native };
      }
      static isEs6(v, s2) {
        return /^\s*class\b/.test(s2);
      }
      static isEs5(v, s2) {
        if (Cls.isEs6(v, s2) || Fn.isNative(v, s2) || Fn.isArrow(v, s2))
          return false;
        const proto = v.prototype;
        if (!proto || typeof proto !== "object")
          return false;
        const isCtorSelf = proto.constructor === v;
        if (!isCtorSelf)
          return false;
        const keys = Object.getOwnPropertyNames(proto);
        const hasCustomProps = keys.length > 1 || keys.length === 1 && keys[0] !== "constructor";
        if (hasCustomProps || /\bthis\./.test(s2))
          return true;
        const name = v.name || "";
        return /^[A-Z]/.test(name);
      }
      static isNative(v) {
        return v.prototype !== undefined && typeof v.prototype === "object";
      }
    }

    class Fn {
      static N = Object.freeze({
        a: "Arrow",
        A: "Anonymouse",
        b: "Bound",
        c: "Class",
        i: "Instance",
        n: "Native",
        f: "Function",
        m: "Method",
        es5: "ES5",
        es6: "ES6"
      });
      static getCode(v) {
        return getCode(v);
      }
      static getFlag(v) {
        const is = typeof v === "function";
        const s2 = getCode(v);
        const cls = Cls.getFlag(is, v, s2);
        if (!is)
          return { is, cls, ...this.#getFnMd(v, false, cls, false, false, false, false, false, false) };
        const bound = !cls.is && v.name?.startsWith("bound ");
        const native = !cls.is && !bound && s2.includes("[native code]");
        const arrow = !cls.is && !bound && !native && !v.hasOwnProperty("prototype") && s2.includes("=>");
        const md = !cls.is && !bound && !native && !arrow && !s2.includes("=>") && !/\bfunction\b/.test(s2);
        const es5 = !cls.is && !native && !bound && !arrow && !md;
        const ag = Ag.getFlag(v);
        return { is: is && !cls.is, cls, ...this.#getFnMd(v, is && !cls.is, cls, bound, native, arrow, es5, md, ag) };
      }
      static #getFnMd(v, is, cls, bound, native, arrow, es5, md, ag) {
        return {
          fn: this.#getFn(v, is, cls, bound, native, arrow, es5, md, ag),
          md: this.#getMd(v, is, cls, bound, native, arrow, es5, md, ag)
        };
      }
      static #getFn(v, is, cls, bound, native, arrow, es5, md, ag) {
        return {
          is: is && !cls.is && !md || (bound || native || arrow || es5),
          bound,
          native,
          arrow: {
            is: arrow,
            a: arrow && ag.a,
            s: arrow && !ag.a
          },
          es5: {
            is: es5,
            s: {
              is: es5 && ag.s,
              n: es5 && !!v.name && ag.s,
              a: es5 && !v.name && ag.s
            },
            a: es5 && ag.a,
            g: es5 && ag.g,
            ag: es5 && ag.ag
          }
        };
      }
      static #getMd(v, is, cls, bound, native, arrow, es5, md, ag) {
        return {
          is: md,
          s: md && ag.s,
          a: md && ag.a,
          g: md && ag.g,
          ag: md && ag.ag
        };
      }
      static isNative(v, s2) {
        return s2.includes("[native code]");
      }
      static isArrow(v, s2) {
        return !v.hasOwnProperty("prototype") && s2.includes("=>");
      }
    }

    class Obj {
      static getTag(v) {
        return Object.prototype.toString.call(v).slice(8, -1);
      }
      static getFlag(v) {
        const is = v !== null && typeof v === "object";
        const ary = Array.isArray(v);
        const proto = is ? Object.getPrototypeOf(v) : null;
        const plain = is && Object.prototype === proto;
        const none = is && proto === null;
        const boxed = this.#boxed(v, is);
        const des = Des.getFlag(v, is);
        const ins = Ins.getFlag(v, is, proto, plain, this.getTag(v), ary, boxed);
        return this.#get(v, is, ary, is && Object.prototype === proto && !none && !boxed.is && !des.is && !ins.is, none, boxed, des, ins);
      }
      static #get(v, is, ary, plain, none, boxed, des, ins) {
        return {
          is,
          ary,
          plain,
          none,
          proto: is && !ary && !plain && !none && !boxed.is && !des.is && !ins.is,
          boxed,
          des,
          ins
        };
      }
      static #boxed(v, is) {
        return {
          is: is && [Boolean, Number, String].some((C) => v instanceof C),
          bln: is && v instanceof Boolean,
          num: is && v instanceof Number,
          str: is && v instanceof String
        };
      }
    }
    var g2 = "Get";
    var s = "Set";

    class Des {
      static N = Object.freeze({
        D: "Descriptor",
        v: "Value",
        m: Fn.N.m,
        d: "Data",
        a: "Access",
        g: g2,
        s,
        gs: g2 + s
      });
      static getFlag(v, is) {
        const keys = is ? Object.getOwnPropertyNames(v) : [];
        const allowedKeys = ["value", "writable", "get", "set", "configurable", "enumerable"];
        const hasValue = keys.includes("value");
        const hasWritable = keys.includes("writable");
        const hasGet = keys.includes("get") && v.get !== undefined;
        const hasSet = keys.includes("set") && v.set !== undefined;
        const i = !is || keys.length === 0 || !keys.every((key2) => allowedKeys.includes(key2)) ? false : true;
        const isData = (hasValue || hasWritable) && !hasGet && !hasSet;
        const isAccess = (hasGet || hasSet) && !hasValue && !hasWritable;
        const isEmpty = !hasValue && !hasWritable && !hasGet && !hasSet;
        return this.#get(v, i && (isData || isAccess || isEmpty || hasGet && typeof v.get !== "function" && v.get !== undefined || hasSet && typeof v.set !== "function" && v.set !== undefined), hasValue, hasGet, hasSet);
      }
      static #get(v, is, hasValue, hasGet, hasSet) {
        return {
          is,
          d: {
            is: is && !(hasGet || hasSet),
            v: is && hasValue && typeof v.value !== "function",
            m: is && hasValue && typeof v.value === "function"
          },
          a: {
            is: is && (hasGet || hasSet),
            hasG: is && hasGet,
            hasS: is && hasSet,
            g: is && hasGet && !hasSet,
            s: is && hasSet && !hasGet,
            gs: is && (hasGet && hasSet)
          }
        };
      }
    }

    class Ins {
      static getFlag(v, is, proto, plain, tag, ary, boxed) {
        const ctor = proto?.constructor;
        const s2 = Fn.getCode(ctor);
        const es6 = is && this.#isEs6(proto, ctor, s2);
        const es5 = is && this.#isEs5(proto, ctor, s2);
        const native = is && !plain && !ary && !boxed.is && tag !== "Object" && !es6 && !es5;
        return { is: es6 || es5 || native, es6, es5, native };
      }
      static #isEs6(proto, ctor, s2) {
        return typeof ctor !== "function" ? false : Cls.isEs6(ctor, s2);
      }
      static #isEs5(proto, ctor, s2) {
        return typeof ctor !== "function" || (ctor === Object || ctor === Function) || (Cls.isEs6(ctor, s2) || Fn.isNative(ctor, s2)) ? false : Cls.isEs5(ctor, s2) || proto !== Object.prototype && proto !== Function.prototype;
      }
    }
    var getTag = (v) => Object.prototype.toString.call(v).slice(8, -1);
    var isSafeNum = (v) => v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;
    var dObj = (v) => {
      const o = Obj.getFlag(v);
      return !o.nul && o.is && (o.none || o.proto || o.boxed.is);
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
      obj: { fn: (v) => Obj.getFlag(v).plain, full: "PlainObject", default: {} },
      ary: { fn: (v) => Array.isArray(v), default: [], children: {
        empty: { fn: (v) => Array.isArray(v) && v.length === 0, full: "Empty" },
        filled: { fn: (v, T) => {
          const t = Fn.getFlag(T).is;
          if (T !== undefined && !t) {
            throw new TypeError(`tis.ary.filled requires a validation function as the second argument.`);
          }
          return Array.isArray(v) && 0 < v.length && (t ? v.every((x) => T(x)) : true);
        }, full: "Filled" },
        gen: { fn: (v, T) => {
          if (!Fn.getFlag(T).is) {
            throw new TypeError(`tis.ary.gen requires a validation function as the second argument.`);
          }
          return Array.isArray(v) && (v.length === 0 ? true : v.every((x) => T(x)));
        }, full: "Generics" }
      } },
      cls: { fn: (v) => Fn.getFlag(v, Fn.getCode(v)).cls.is, full: Fn.N.c, default: null, children: {
        es6: { fn: (v) => Fn.getFlag(v, Fn.getCode(v)).cls.es6, full: Fn.N.es6 },
        es5: { fn: (v) => Fn.getFlag(v, Fn.getCode(v)).cls.es5, full: Fn.N.es5 },
        native: { fn: (v) => Fn.getFlag(v, Fn.getCode(v)).cls.native, full: Fn.N.n }
      } },
      ins: { fn: (v) => Obj.getFlag(v).ins.is, full: Fn.i, default: null, children: {
        es6: { fn: (v) => Obj.getFlag(v).ins.es6, full: Fn.N.es6 },
        es5: { fn: (v) => Obj.getFlag(v).ins.es5, full: Fn.N.es5 },
        native: { fn: (v) => Obj.getFlag(v).ins.native, full: Fn.N.n }
      } },
      des: { fn: (v) => Obj.getFlag(v).des.is, full: Des.N.D, default: null, children: {
        d: { fn: (v) => Obj.getFlag(v).des.d.is, full: Des.N.d, children: {
          v: { fn: (v) => Obj.getFlag(v).des.d.v, full: Des.N.v },
          m: { fn: (v) => Obj.getFlag(v).des.d.m, full: Des.N.m }
        } },
        a: { fn: (v) => Obj.getFlag(v).des.a.is, full: Des.N.a, children: {
          g: { fn: (v) => Obj.getFlag(v).des.a.g, full: Des.N.g },
          s: { fn: (v) => Obj.getFlag(v).des.a.s, full: Des.N.s },
          gs: { fn: (v) => Obj.getFlag(v).des.a.gs, full: Des.N.gs },
          hasG: { fn: (v) => Obj.getFlag(v).des.a.hasG, full: "HasG" },
          hasS: { fn: (v) => Obj.getFlag(v).des.a.hasS, full: "HasS" }
        } }
      } },
      run: { fn: (v) => Fn.getFlag(v).is, default: null, full: "Run", children: {
        fn: { fn: (v) => Fn.getFlag(v).fn.is, default: null, full: "Function", children: {
          bound: { fn: (v) => Fn.getFlag(v).fn.bound, full: Fn.N.b },
          native: { fn: (v) => Fn.getFlag(v).fn.native, full: Fn.N.n },
          arrow: { fn: (v) => Fn.getFlag(v).fn.arrow.is, default: null, full: Fn.N.a, children: {
            s: { fn: (v) => Fn.getFlag(v).fn.arrow.s, full: Ag.N.s },
            a: { fn: (v) => Fn.getFlag(v).fn.arrow.a, full: Ag.N.a }
          } },
          es5: { fn: (v) => Fn.getFlag(v).fn.es5.is, default: null, full: Fn.N.f, children: {
            s: { fn: (v) => Fn.getFlag(v).fn.es5.s.is, full: Ag.N.s, children: {
              n: { fn: (v) => Fn.getFlag(v).fn.es5.s.n, full: Fn.N.f },
              a: { fn: (v) => Fn.getFlag(v).fn.es5.s.a, full: Ag.N.A }
            } },
            a: { fn: (v) => Fn.getFlag(v).fn.es5.a, full: Ag.N.a },
            g: { fn: (v) => Fn.getFlag(v).fn.es5.g, full: Ag.N.g },
            ag: { fn: (v) => Fn.getFlag(v).fn.es5.ag, full: Ag.N.ag }
          } }
        } },
        md: { fn: (v) => Fn.getFlag(v).md.is, default: null, full: Fn.N.m, children: {
          s: { fn: (v) => Fn.getFlag(v).md.s, full: Ag.N.s },
          a: { fn: (v) => Fn.getFlag(v).md.a, full: Ag.N.a },
          g: { fn: (v) => Fn.getFlag(v).md.g, full: Ag.N.g },
          ag: { fn: (v) => Fn.getFlag(v).md.ag, full: Ag.N.ag }
        } }
      } },
      d: { fn: (v) => [undefined, null, Infinity, -Infinity].some((x) => x === v) || Number.isNaN(v) || Number.isFinite(v) && (!Number.isSafeInteger(v) || !isSafeNum(v)) || dObj(v), full: Des.N.a, children: {
        num: { fn: (v) => typeof v === "number" && (!Number.isSafeInteger(v) || !isSafeNum(v)), full: "Number", default: 0, children: {
          nan: { fn: (v) => Number.isNaN(v), full: "NaN", default: NaN },
          inf: { fn: (v) => [Infinity, -Infinity].some((x) => x === v), full: "Infinity", default: Infinity, children: {
            p: { fn: (v) => v === Infinity, full: "Positive", default: Infinity },
            n: { fn: (v) => v === -Infinity, full: "Negative", default: -Infinity }
          } },
          flt: { fn: (v) => Number.isFinite(v) && isSafeNum(v) && !Number.isSafeInteger(v), full: "Float", default: 0 },
          over: { fn: (v) => Number.isFinite(v) && !isSafeNum(v), full: "Over", default: Number.MAX_SAFE_INTEGER + 1 }
        } },
        obj: { fn: dObj, full: "Object", children: {
          none: { fn: (v) => Obj.getFlag(v).none, full: "NonePrototype" },
          proto: { fn: (v) => Obj.getFlag(v).proto, full: "Prototyped" },
          boxed: { fn: (v) => Obj.getFlag(v).boxed.is, full: "BoxedPrimitive", children: {
            bln: { fn: (v) => Obj.getFlag(v).boxed.bln, full: "Boolean" },
            num: { fn: (v) => Obj.getFlag(v).boxed.num, full: "Number" },
            str: { fn: (v) => Obj.getFlag(v).boxed.str, full: "String" }
          } }
        } }
      } },
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
            cr: { fn: (v) => typeof v === "function", full: "ClassOrRun" },
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
        if (false) {}
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
      for (const [rootKey, rootNode] of Object.entries(tis)) {
        const matched = search(rootNode, v);
        if (matched) {
          console.log(`Matched root: ${rootKey}`, matched);
          return matched;
        }
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

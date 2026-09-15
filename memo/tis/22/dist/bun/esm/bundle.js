// @bun
// src/is/ag.js
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
  static getFlag(v, s) {
    const n = v?.constructor?.name;
    return Ag.N.a + Ag.N.g + Ag.N.f === n ? this.#flg(true, true) : Ag.N.g + Ag.N.f === n ? this.#flg(false, true) : Ag.N.a + Ag.N.f === n ? this.#flg(true, false) : this.#isAgC(s);
  }
  static #isAgC(s) {
    const a2 = /^\s*(?:static\s+)?async\b/.test(s);
    const g2 = /(?:function\s*\*|\*\s*[a-zA-Z_$])/.test(s);
    return this.#flg(a2, g2);
  }
  static #flg(a2, g2) {
    return { a: a2 && !(a2 && g2), g: g2 && !(a2 && g2), s: !a2 && !g2, ag: a2 && g2 };
  }
}

// src/is/fn.js
class Cls2 {
  static getFlag(is, v, s) {
    const es6 = is && this.isEs6(v, s);
    const es5 = is && this.isEs5(v, s);
    const native = is && Fn.isNative(v, s) && this.isNative(v);
    return { is: es6 || es5 || native, es6, es5, native };
  }
  static isEs6(v, s) {
    if (!s)
      s = Function.prototype.toString.call(v);
    return /^\s*class\b/.test(s);
  }
  static isEs5(v, s) {
    if (!s)
      s = Function.prototype.toString.call(v);
    if (Cls2.isEs6(v, s) || Fn.isNative(v, s) || Fn.isArrow(v, s))
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
    return typeof v === "function" ? Function.prototype.toString.call(v).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "").trim().replace(/(["'`])(?:(?!\1)[^\\]|\\.)*?\1/g, '""').replace(/\/([^\/\n\\]|\\.)+\/[gimsuy]*/g, "//") : "";
  }
  static getFlag(v) {
    const is = typeof v === "function";
    const s = is ? this.getCode(v) : "";
    const cls = Cls2.getFlag(is, v, s);
    if (!is)
      return { is, cls, ...this.#getFnMd(v, false, cls, false, false, false, false, false, false) };
    const bound = !cls.is && v.name?.startsWith("bound ");
    const native = !cls.is && !bound && s.includes("[native code]");
    const arrow = !cls.is && !bound && !native && !v.hasOwnProperty("prototype") && s.includes("=>");
    const md = !cls.is && !bound && !native && !arrow && /\bfunction\b/.test(s) ? false : !s.includes("=>");
    const es5 = !cls.is && !native && !bound && !arrow && !md;
    const ag = Ag.getFlag(v);
    return { is: is && !cls.is, cls, ...this.#getFnMd(v, is && !cls.is, cls, bound, native, arrow, es5, md, ag) };
  }
  static #getFnMd(v, is, cls, bound, native, arrow, es5, md, ag) {
    return {
      fn: this.#getFn(v, is, cls, bound, native, arrow, es5, ag),
      md: this.#getMd(md, ag)
    };
  }
  static #getFn(v, is, cls, bound, native, arrow, es5, ag) {
    return {
      is: is && !cls.is,
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
        ag: es5 && ag.a && ag.g
      }
    };
  }
  static #getMd(md, ag) {
    return {
      is: md,
      s: md && ag.s,
      a: md && ag.a,
      g: md && ag.g,
      ag: md && ag.ag
    };
  }
  static isNative(v, s) {
    return s.includes("[native code]");
  }
  static isArrow(v, s) {
    return !v.hasOwnProperty("prototype") && s.includes("=>");
  }
}

// src/is/obj.js
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
    const i = !is || keys.length === 0 || !keys.every((key) => allowedKeys.includes(key)) ? false : true;
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
    const es6 = is && this.isEs6(proto, proto?.constructor);
    const es5 = is && this.isEs5(proto, proto?.constructor);
    const native = is && !plain && !ary && !boxed.is && tag !== "Object" && !es6 && !es5;
    return { is: es6 || es5 || native, es6, es5, native };
  }
  static isEs6(proto, ctor) {
    return typeof ctor !== "function" ? false : Cls2.isEs6(ctor, Fn.getCode(ctor));
  }
  static isEs5(proto, ctor) {
    return typeof ctor !== "function" || (ctor === Object || ctor === Function) || (Cls2.isEs6(ctor) || Fn.isNative(ctor, Fn.getCode(ctor))) ? false : Cls2.isEs5(ctor) || proto !== Object.prototype && proto !== Function.prototype;
  }
}

// src/tis.js
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
  ary: { fn: (v) => Array.isArray(v), default: [] },
  run: { fn: (v) => Fn.getFlag(v).is, default: null, full: "Run", children: {
    fn: {
      bound: { fn: (v) => Fn.getFlag(v).fn.bound, full: Fn.N.b },
      native: { fn: (v) => Fn.getFlag(v).fn.native, full: Fn.N.n },
      arrow: {
        fn: (v) => Fn.getFlag(v).fn.arrow,
        default: null,
        full: Fn.N.a,
        children: {
          s: { fn: (v) => Fn.getFlag(v).fn.arrow.s, full: Ag.N.s },
          a: { fn: (v) => Fn.getFlag(v).fn.arrow.a, full: Ag.N.a }
        }
      },
      es5: {
        fn: (v) => !Cls.getFlag(v, Fn.getCode(v)).fn.is,
        default: null,
        full: Fn.N.f,
        s: { fn: (v) => Fn.getFlag(v).fn.s.n, full: Ag.N.s, children: {
          n: { fn: (v) => Fn.getFlag(v).fn.s.n, full: Fn.N.f },
          a: { fn: (v) => Fn.getFlag(v).fn.s.a, full: Ag.N.A }
        } },
        a: { fn: (v) => Fn.getFlag(v).fn.a, full: Ag.N.a },
        g: { fn: (v) => Fn.getFlag(v).fn.g, full: Ag.N.g },
        ag: { fn: (v) => Fn.getFlag(v).fn.ag, full: Ag.N.ag }
      }
    },
    md: {
      fn: (v) => Fn.getFlag(v).md.is,
      default: null,
      full: Fn.N.m,
      s: { fn: (v) => Fn.getFlag(v).method.s, full: Ag.N.s },
      a: { fn: (v) => Fn.getFlag(v).method.a, full: Ag.N.a },
      g: { fn: (v) => Fn.getFlag(v).method.g, full: Ag.N.g },
      ag: { fn: (v) => Fn.getFlag(v).method.ag, full: Ag.N.ag }
    }
  } },
  cls: { fn: (v) => Fn.getFlag(v, Fn.getCode(v)).cls.is, default: null, children: {
    es6: { fn: (v) => Fn.getFlag(v, Fn.getCode(v)).cls.es6, full: Fn.N.es6 },
    es5: { fn: (v) => Fn.getFlag(v, Fn.getCode(v)).cls.es5, full: Fn.N.es5 },
    native: { fn: (v) => Fn.getFlag(v, Fn.getCode(v)).cls.native, full: Fn.N.n }
  } },
  ins: { fn: (v) => Obj.getFlag(v).ins.is, default: null, children: {
    es6: { fn: (v) => Obj.getFlag(v).ins.es6, full: Fn.N.es6 },
    es5: { fn: (v) => Obj.getFlag(v).ins.es5, full: Fn.N.es5 },
    native: { fn: (v) => Obj.getFlag(v).ins.native, full: Fn.N.n }
  } },
  des: { fn: (v) => Obj.getFlag(v).des.is, full: Des.N.D, default: null, children: {
    d: {
      fn: (v) => Obj.getFlag(v).des.d,
      full: Des.N.d,
      is: { fn: (v) => Obj.getFlag(v).des.d, full: Des.N.d },
      v: { fn: (v) => Obj.getFlag(v).des.d.v, full: Des.N.v },
      m: { fn: (v) => Obj.getFlag(v).des.d.m, full: Des.N.m }
    },
    a: {
      fn: (v) => Obj.getFlag(v).des.a,
      full: Des.N.a,
      is: { fn: (v) => Obj.getFlag(v).des.a, full: Des.N.a },
      g: { fn: (v) => Obj.getFlag(v).des.a.g, full: Des.N.g },
      s: { fn: (v) => Obj.getFlag(v).des.a.s, full: Des.N.s },
      gs: { fn: (v) => Obj.getFlag(v).des.a.gs, full: Des.N.gs }
    }
  } },
  d: {
    fn: (v) => [undefined, null, Infinity, -Infinity].some((x) => x === v) || Number.isNaN(v) || Number.isFinite(v) && (!Number.isSafeInteger(v) || !isSafeNum(v)) || dObj(v),
    full: Des.N.a,
    num: { fn: (v) => typeof v === "number", full: "Danger", default: 0, children: {
      int: { fn: (v) => Number.isSafeInteger(v), full: "Integer" },
      nan: { fn: (v) => Number.isNaN(v), full: "NaN", default: NaN },
      inf: { fn: (v) => !Number.isFinite(v) && !Number.isNaN(v), full: "Infinity", default: Infinity, children: {
        p: { fn: (v) => v === Infinity, full: "Positive", default: Infinity },
        n: { fn: (v) => v === -Infinity, full: "Negative", default: -Infinity }
      } },
      flt: { fn: (v) => Number.isFinite(v) && isSafeNum(v) && !Number.isSafeInteger(v), full: "Float", default: 0 },
      over: { fn: (v) => Number.isFinite(v) && !isSafeNum(v), full: "Over", default: Number.MAX_SAFE_INTEGER + 1 }
    } },
    obj: { fn: dObj, full: "Object", children: {
      none: { fn: (v) => Obj.getFlag(v).none, full: "NonePrototype" },
      proto: { fn: (v) => Obj.getFlag(v).proto, full: "Prototyped" },
      boxed: {
        fn: (v) => Obj.getFlag(v).boxed.is,
        full: "BoxedPrimitive",
        children: {
          bln: { fn: (v) => Obj.getFlag(v).boxed.bln, full: "Boolean" },
          num: { fn: (v) => Obj.getFlag(v).boxed.num, full: "Number" },
          str: { fn: (v) => Obj.getFlag(v).boxed.str, full: "String" }
        }
      }
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
    const typeTreeNode = function(v) {
      return def.fn(v);
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

// src/tof.js
var isTypeTreeNode = (v) => {
  if (typeof v !== "function" || !v._ || typeof v._ !== "object")
    return false;
  const meta = v._;
  return meta.name && typeof meta.name === "object" && typeof meta.name.abbr === "string" && (meta.name.full === null || typeof meta.name.full === "string") && (meta.parent === null || isTypeTreeNode(meta.parent)) && typeof meta.fn === "function";
};
var getPath = (typeTreeNode, key, v) => {
  const segments = [];
  let curr = typeTreeNode;
  while (curr) {
    segments.unshift(key === "abbr" ? curr._.name.abbr : curr._.name.full || getTag(v !== undefined ? v : defV(curr)));
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

// src/tow.js
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
  for (const [key, child] of Object.entries(typeTreeNode)) {
    if (isTypeTreeNode(child)) {
      assertFn[key] = createAssertNode(child);
    }
  }
  return assertFn;
};
var assertM = {};
for (const [key, typeTreeNode] of Object.entries(tis)) {
  assertM[key] = createAssertNode(typeTreeNode);
}
var tow = assertM;
export {
  tow,
  tof,
  tis,
  isTypeTreeNode,
  getTag,
  defV
};

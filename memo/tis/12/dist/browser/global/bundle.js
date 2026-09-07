(() => {
  // ../../../../../typ-build-brsxrs6huc/wrapped.js
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
    var getTag = (v) => Object.prototype.toString.call(v).slice(8, -1);
    var isSafeNum = (v) => v <= Number.MAX_SAFE_INTEGER && Number.MIN_SAFE_INTEGER <= v;
    var MAP = {
      und: { fn: (v) => v === undefined, default: undefined },
      bln: { fn: (v) => typeof v === "boolean", default: false },
      big: { fn: (v) => typeof v === "bigint", default: 0n },
      str: { fn: (v) => typeof v === "string", default: "" },
      sym: { fn: (v) => typeof v === "symbol", default: Symbol() },
      fn: { fn: (v) => typeof v === "function", default: function() {} },
      obj: { fn: (v) => v !== null && typeof v === "object", default: {} },
      nul: { fn: (v) => v === null, default: null },
      num: {
        fn: (v) => typeof v === "number",
        default: 0,
        children: {
          int: { fn: (v) => Number.isSafeInteger(v), full: "Integer" },
          fin: { fn: (v) => Number.isFinite(v) && isSafeNum(v), full: "Finite" },
          nan: { fn: (v) => Number.isNaN(v), full: "NaN", default: NaN },
          inf: {
            fn: (v) => !Number.isFinite(v) && !Number.isNaN(v),
            full: "Infinity",
            default: Infinity,
            children: {
              p: { fn: (v) => v === Infinity, full: "Positive", default: Infinity },
              n: { fn: (v) => v === -Infinity, full: "Negative", default: -Infinity }
            }
          },
          over: { fn: (v) => Number.isFinite(v) && !isSafeNum(v), full: "Overflow", default: Number.MAX_SAFE_INTEGER + 1 }
        }
      }
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

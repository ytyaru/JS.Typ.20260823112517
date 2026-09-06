import { test, expect, describe } from "bun:test";
import { tis } from "./tis.js"; // 対象のファイルパスに合わせて変更してください

describe("tis utility tests", () => {
  const testCases = [
    { name: "undefined", val: undefined, expectedKey: "und" },
    { name: "boolean (true)", val: true, expectedKey: "bln" },
    { name: "boolean (false)", val: false, expectedKey: "bln" },
    { name: "number", val: 42, expectedKey: "num" },
    { name: "number (NaN)", val: NaN, expectedKey: "num" },
    { name: "number (Infinity)", val: Infinity, expectedKey: "num" },
    { name: "bigint", val: 10n, expectedKey: "big" },
    { name: "string", val: "hello", expectedKey: "str" },
    { name: "symbol", val: Symbol("test"), expectedKey: "sym" },
    { name: "function (arrow)", val: () => {}, expectedKey: "fn" },
    { name: "function (regular)", val: function() {}, expectedKey: "fn" },
    { name: "object (plain)", val: {}, expectedKey: "obj" },
    { name: "object (array)", val: [], expectedKey: "obj" },
    { name: "object (date)", val: new Date(), expectedKey: "obj" },
    { name: "null", val: null, expectedKey: "nul" },
  ];

  test("tis(v) returns correct flags object for all types", () => {
    for (const { val, expectedKey } of testCases) {
      const result = tis(val);
      for (const key of Object.keys(result)) {
        if (key === expectedKey) {
          expect(result[key]).toBe(true);
        } else {
          expect(result[key]).toBe(false);
        }
      }
    }
  });

  describe("individual property functions", () => {
    test("tis.und", () => {
      expect(tis.und(undefined)).toBe(true);
      expect(tis.und(null)).toBe(false);
      expect(tis.und(0)).toBe(false);
    });

    test("tis.bln", () => {
      expect(tis.bln(true)).toBe(true);
      expect(tis.bln(false)).toBe(true);
      expect(tis.bln(0)).toBe(false);
      expect(tis.bln("true")).toBe(false);
    });

    test("tis.num", () => {
      expect(tis.num(123)).toBe(true);
      expect(tis.num(NaN)).toBe(true);
      expect(tis.num("123")).toBe(false);
    });

    test("tis.big", () => {
      expect(tis.big(9999n)).toBe(true);
      expect(tis.big(9999)).toBe(false);
    });

    test("tis.str", () => {
      expect(tis.str("text")).toBe(true);
      expect(tis.str(String("text"))).toBe(true);
      expect(tis.str(123)).toBe(false);
    });

    test("tis.sym", () => {
      expect(tis.sym(Symbol())).toBe(true);
      expect(tis.sym("symbol")).toBe(false);
    });

    test("tis.fn", () => {
      expect(tis.fn(() => {})).toBe(true);
      expect(tis.fn(function() {})).toBe(true);
      expect(tis.fn(class {})).toBe(true);
      expect(tis.fn({})).toBe(false);
    });

    test("tis.obj (excluding null)", () => {
      expect(tis.obj({})).toBe(true);
      expect(tis.obj([])).toBe(true);
      expect(tis.obj(new Map())).toBe(true);
      expect(tis.obj(null)).toBe(false); // JavaScriptの typeof null === 'object' の対策確認
      expect(tis.obj(123)).toBe(false);
    });

    test("tis.nul", () => {
      expect(tis.nul(null)).toBe(true);
      expect(tis.nul(undefined)).toBe(false);
      expect(tis.nul({})).toBe(false);
    });
  });
});

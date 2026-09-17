import { test, describe, expect } from "bun:test";
import { TextTree } from "../src/text-tree.js";

describe("TextTree Module Tests", () => {
    test("parse and stringify basic tree with args", () => {
        const input = `
MyApp BaseError
	SubError1
		SubError2
		# comment line
	SubError3 ExtraArg
        `.trim();

        const tree = TextTree.parse(input, TextTree.Indent.tab);
        
        expect(tree.MyApp.$.args[0]).toBe("BaseError");
        expect(tree.MyApp.SubError1.$.parent).toBe(tree.MyApp);
        expect(tree.MyApp.SubError1.SubError2.$.args.length).toBe(0);
        expect(tree.MyApp.SubError3.$.args[0]).toBe("ExtraArg");

        const serialized = TextTree.stringify(tree, "\t");
        expect(serialized).toContain("MyApp BaseError");
        expect(serialized).toContain("\tSubError1");
        expect(serialized).toContain("\t\tSubError2");
        expect(serialized).toContain("\tSubError3 ExtraArg");
    });

    test("strict indentation validation (infer mode & mixed check)", () => {
        const validSpace2 = `
Root
  Child1
    Child2
        `.trim();
        const tree = TextTree.parse(validSpace2, TextTree.Indent.infer);
        expect(tree.Root.Child1.Child2).toBeDefined();

        const mixedIndentation = `
Root
\tChild1
  Child2
        `.trim();
        
        expect(() => {
            TextTree.parse(mixedIndentation, TextTree.Indent.infer);
        }).toThrow();
    });
});

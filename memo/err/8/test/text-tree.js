import { test, describe, expect } from "bun:test";
import { TextTree } from "../src/text-tree.js";

describe("TextTreeモジュールの厳格なバリデーションと全パターン網羅テスト", () => {
    describe("正常系: パースおよびシリアライズの動作確認", () => {
        test("タブインデント、複数ルート、および2列目引数の処理", () => {
            const input = `
Root1 Base1
	Sub1
		Deep1
Root2
	Sub2 ArgA ArgB
            `.trim();

            const tree = TextTree.parse(input, TextTree.Indent.tab);
            
            // 複数ルートの検証
            expect(tree.Root1).toBeDefined();
            expect(tree.Root2).toBeDefined();
            expect(tree.Root1.$.args[0]).toBe("Base1");
            expect(tree.Root2.$.args.length).toBe(0);
            expect(tree.Root2.Sub2.$.args).toEqual(["ArgA", "ArgB"]);
            expect(tree.Root1.Sub1.Deep1.$.parent).toBe(tree.Root1.Sub1);

            // 逆変換（stringify）による復元テスト
            const output = TextTree.stringify(tree, "\t");
            expect(output).toContain("Root1 Base1");
            expect(output).toContain("\tSub1");
            expect(output).toContain("\t\tDeep1");
            expect(output).toContain("Root2");
            expect(output).toContain("\tSub2 ArgA ArgB");
        });

        test("各種スペースインデントモード（2, 4, 8スペース）の指定", () => {
            const space4Text = `
Top
    Sub
        Deep
            `.trim();
            const tree = TextTree.parse(space4Text, TextTree.Indent.space4);
            expect(tree.Top.Sub.Deep).toBeDefined();
        });

        test("インデント自動推論（infer）モードの動作", () => {
            const inferText = `
AutoRoot
    AutoSub
        AutoDeep
            `.trim();
            const tree = TextTree.parse(inferText, TextTree.Indent.infer);
            expect(tree.AutoRoot.AutoSub.AutoDeep).toBeDefined();
        });

        test("コメント行および空行が完全にスキップされること", () => {
            const textWithComments = `
# 先頭のコメント行
Root
	# 内部のコメント行
	Sub

            `.trim();
            const tree = TextTree.parse(textWithComments, TextTree.Indent.tab);
            expect(tree.Root.Sub).toBeDefined();
            expect(Object.keys(tree.Root).length).toBe(1);
        });
    });

    describe("異常系: 厳格なインデントおよび構文バリデーション", () => {
        test("ルート行の行頭にインデントが入っている場合にエラーを送出する", () => {
            const indentedRoot = `
    IndentedRoot
        Sub
            `.trim();
            expect(() => TextTree.parse(indentedRoot, TextTree.Indent.tab)).toThrow();
        });

        test("タブとスペースが混在している場合にエラーを送出する", () => {
            const mixed = `
Root
\tTabChild
  SpaceChild
            `.trim();
            expect(() => TextTree.parse(mixed, TextTree.Indent.infer)).toThrow();
        });

        test("指定されたインデント幅に違反する不自然なスペース数の場合にエラーを送出する", () => {
            const oddSpaces = `
Root
   Sub # 3 spaces
            `.trim();
            expect(() => TextTree.parse(oddSpaces, TextTree.Indent.space4)).toThrow();
        });

        test("予約語 '$' がノードキーとして使用された場合にエラーを送出する", () => {
            const invalidKey = `
Root
	$ InvalidKey
            `.trim();
            expect(() => TextTree.parse(invalidKey, TextTree.Indent.tab)).toThrow();
        });
    });
});

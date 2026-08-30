import { join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

const builds = [
    { target: 'browser', formats: ['esm', 'iife'] },
    { target: 'bun',     formats: ['esm'] },
    { target: 'node',    formats: ['esm', 'cjs', 'iife'] },
] as const;

const variants = [
    { minify: false, naming: 'bundle.js' },
    { minify: true,  naming: 'bundle.min.js' },
] as const;

const entrypoint = './src/main.js';
const rootDir = process.cwd();

async function main() {
    console.log('🚀 Building bundles with generalized IIFE automation...');

    for (const { target, formats } of builds) {
        for (const format of formats) {
            const outdir = join(rootDir, 'dist', target, format);
            const isIife = format === 'iife';

            // iife の場合はCJS形式をベースにして安全にビルド
            const buildFormat = isIife ? 'cjs' : format;

            for (const { minify, naming } of variants) {
                const filePath = join(outdir, naming);

                await Bun.build({
                    entrypoints: [entrypoint],
                    outdir,
                    target,
                    format: buildFormat,
                    minify,
                    naming,
                });

                if (isIife) {
                    const code = readFileSync(filePath, 'utf-8');
                    
                    // 【完全自動化されたIIFEラッパー】
                    // module.exports に代入されたすべてのキーを動的に検出してグローバルへぶら下げる
                    const wrappedCode = `(function() {
    var module = { exports: {} };
    var exports = module.exports;
    
    // --- CJS Bundled Code ---
    ${code}
    // ------------------------

    // module.exports からエクスポートされたものを動的に全取得してグローバルへ展開
    var exported = module.exports;
    var targetGlobal = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
    
    if (targetGlobal) {
        for (var key in exported) {
            if (Object.prototype.hasOwnProperty.call(exported, key)) {
                targetGlobal[key] = exported[key];
            }
        }
    }
})();
`;
                    writeFileSync(filePath, wrappedCode, 'utf-8');
                }
            }

            console.log(`  ✔ target: ${target.padEnd(8)} | format: ${format.padEnd(4)} -> dist/${target}/${format}/`);
        }
    }

    console.log('✨ All builds completed successfully!');
}

main().catch((err) => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});

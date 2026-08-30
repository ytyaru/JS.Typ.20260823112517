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
    console.log('🚀 Building bundles safely...');

    for (const { target, formats } of builds) {
        for (const format of formats) {
            const outdir = join(rootDir, 'dist', target, format);
            const isIife = format === 'iife';

            // iife の場合は、exportの混入する esm ではなく cjs をベースにする
            // cjs なら export文ではなく require/module.exports になるため誤爆のリスクがゼロになる
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
                    
                    // CJSの出力を安全に包み込み、グローバルへ露出させるIIFEラッパー
                    // （export文が存在しないため、構文エラーも誤爆も起きない）
                    const wrappedCode = `(function() {
    var module = { exports: {} };
    var exports = module.exports;
    
    // --- Bundled Code (CJS format) ---
    ${code}
    // ----------------------------------

    // エクスポートされたオブジェクトをグローバルへ安全に紐付け
    var exported = module.exports;
    if (typeof window !== 'undefined') {
        window.isT = exported.isT;
        window.owT = exported.owT;
        window.tof = exported.tof;
    } else if (typeof globalThis !== 'undefined') {
        globalThis.isT = exported.isT;
        globalThis.owT = exported.owT;
        globalThis.tof = exported.tof;
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

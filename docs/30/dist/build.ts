import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const builds = [
    { target: 'browser', formats: ['esm', 'global'] },
    { target: 'bun',     formats: ['esm'] },
    { target: 'node',    formats: ['esm', 'cjs', 'global'] },
] as const;

const variants = [
    { minify: false, naming: 'bundle.js' },
    { minify: true,  naming: 'bundle.min.js' },
] as const;

const entrypoint = './src/main.js';
const rootDir = process.cwd();

/**
 * 責務1: CJSの出力コードを安全なグローバルIIFE形式へカプセル化する
 */
function encapsulateAsGlobal(bundledCode: string): string {
    return `(function() {
    var module = { exports: {} };
    var exports = module.exports;
    
    ${bundledCode}

    var exported = module.exports;
    var targetGlobal = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
    
    if (targetGlobal) {
        for (var key in exported) {
            if (Object.prototype.hasOwnProperty.call(exported, key)) {
                targetGlobal[key] = exported[key];
            }
        }
    }
})();`;
}

/**
 * 責務2: 指定された設定でBunによるバンドル＆ミニファイを実行する
 */
async function bundleCode(entry: string, outdir: string, target: any, format: any, minify: boolean, naming: string) {
    const result = await Bun.build({
        entrypoints: [entry],
        outdir,
        target,
        format,
        minify,
        naming,
    });

    if (!result.success) {
        throw new Error(`Build failed: ${result.logs}`);
    }
}

async function main() {
    console.log('🚀 Building bundles with a clean, single-responsibility pipeline...');

    for (const { target, formats } of builds) {
        for (const format of formats) {
            const outdir = join(rootDir, 'dist', target, format);
            mkdirSync(outdir, { recursive: true });

            for (const { minify, naming } of variants) {
                const isGlobal = format === 'global';

                if (isGlobal) {
                    // グローバル形式の場合:
                    // Step A: 依存関係を解決するために一時的にCJSとしてメモリ上でバンドルする
                    const tempBuild = await Bun.build({
                        entrypoints: [entrypoint],
                        target,
                        format: 'cjs',
                        minify,
                    });

                    if (!tempBuild.success) {
                        throw new Error(`Global intermediate build failed: ${tempBuild.logs}`);
                    }

                    const rawCode = await tempBuild.outputs[0].text();
                    
                    // Step B: カプセル化されたコードを組み立て、最終的な成果物として出力する
                    const wrappedCode = encapsulateAsGlobal(rawCode);
                    const filePath = join(outdir, naming);
                    writeFileSync(filePath, wrappedCode, 'utf-8');

                } else {
                    // 通常形式 (esm, cjs) の場合:
                    await bundleCode(entrypoint, outdir, target, format, minify, naming);
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

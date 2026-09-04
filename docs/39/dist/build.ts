import { join } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

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
 * 【責務】Bun.build の共通ラッパー（実行の単一化）
 */
async function executeBuild(options: {
    entrypoints: string[];
    outdir: string;
    target: any;
    format: any;
    minify: boolean;
    naming: string;
}) {
    const result = await Bun.build(options);
    if (!result.success) {
        throw new Error(`Build failed for ${options.target}/${options.format}/${options.naming}: ${result.logs}`);
    }
}

/**
 * 【責務】CJSコードをグローバル（クラシックScript）用のIIFEラッパーで包み込む
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
 * 【責務】グローバル形式（2段階ビルドが必要な形式）のビルドを安全に遂行する
 * （※一時ファイルは必ずOSのテンポラリ領域を使い、dist/ を絶対に汚染しない）
 */
async function buildGlobalFormat(params: {
    target: any;
    minify: boolean;
    naming: string;
    outdir: string;
}) {
    const { target, minify, naming, outdir } = params;
    const tempWorkDir = join(tmpdir(), `typ-build-${Math.random().toString(36).slice(2)}`);
    mkdirSync(tempWorkDir, { recursive: true });

    try {
        const tempCjsName = 'intermediate.cjs.js';
        
        // Step 1: OSのテンポラリ領域でCJSとして一度バンドル
        await executeBuild({
            entrypoints: [entrypoint],
            outdir: tempWorkDir,
            target,
            format: 'cjs',
            minify,
            naming: tempCjsName,
        });

        const rawCode = readFileSync(join(tempWorkDir, tempCjsName), 'utf-8');
        
        // Step 2: ラッパーでカプセル化
        const wrappedCode = encapsulateAsGlobal(rawCode);
        const wrappedInputPath = join(tempWorkDir, 'wrapped.js');
        writeFileSync(wrappedInputPath, wrappedCode, 'utf-8');

        // Step 3: 最終的な出力先へ iife 形式でビルド＆完全ミニファイ
        await executeBuild({
            entrypoints: [wrappedInputPath],
            outdir,
            target,
            format: 'iife',
            minify,
            naming,
        });
    } finally {
        // OSテンポラリ領域のクリーンアップ（dist/には一切影響させない）
        try {
            rmSync(tempWorkDir, { recursive: true, force: true });
        } catch {}
    }
}

async function main() {
    console.log('🚀 Building bundles with strict SRP and zero dist pollution...');

    for (const { target, formats } of builds) {
        for (const format of formats) {
            const outdir = join(rootDir, 'dist', target, format);
            mkdirSync(outdir, { recursive: true });

            for (const { minify, naming } of variants) {
                if (format === 'global') {
                    // グローバル形式のビルド責務を専用関数に完全に委譲
                    await buildGlobalFormat({ target, minify, naming, outdir });
                } else {
                    // 通常形式 (esm, cjs) のビルド責務
                    await executeBuild({
                        entrypoints: [entrypoint],
                        outdir,
                        target,
                        format,
                        minify,
                        naming,
                    });
                }
            }

            console.log(`  ✔ target: ${target.padEnd(8)} | format: ${format.padEnd(4)} -> dist/${target}/${format}/`);
        }
    }

    console.log('✨ All builds completed successfully without any junk files!');
}

main().catch((err) => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});

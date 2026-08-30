#!/bin/bash
# スクリプトが存在するディレクトリ（build/）の絶対パスを取得
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# プロジェクトルート（1つ上の階層）に移動
cd "$HERE"

bun build --minify --target=bun --format=esm --outfile=a.min.js ./a.js
bun build --minify --target=bun --format=esm --outfile=b.min.js ./b.js

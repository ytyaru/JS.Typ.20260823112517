#!/bin/bash
set -e

# スクリプトが存在するディレクトリ（build/）の絶対パスを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# プロジェクトルート（1つ上の階層）に移動
cd "$SCRIPT_DIR/.."

# build.ts を絶対パスで指定して実行
bun run "$SCRIPT_DIR/build.ts"

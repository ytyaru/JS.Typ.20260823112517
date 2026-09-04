#!/bin/bash
cd "$(dirname "$0")"
bun build --minify --target=browser --format=esm --outfile=type-names.min.js type-names.js
bun build --minify --target=browser --format=esm --outfile=type-names-dry.min.js type-names-dry.js
wc -c type-names.min.js
wc -c type-names-dry.min.js

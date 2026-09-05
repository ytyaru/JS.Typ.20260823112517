#!/bin/bash
cd "$(dirname "$0")"
for name in csp cs ci o
do
  N=$name.js
  M=$name.min.js
  bun build --minify --target=browser --format=esm --outfile=$M $N
  wc -c $M
done

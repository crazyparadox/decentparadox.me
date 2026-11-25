#!/bin/sh
# Renders the social preview: public/static/og.png (still) and public/static/og.mp4 (3-second loop).
# Needs Google Chrome and ffmpeg.   sh scripts/og/build.sh
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=../../public/static; TMP=$(mktemp -d); N=45
shot() { "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --user-data-dir="$TMP/p" --window-size=1200,630 --virtual-time-budget=3000 --screenshot="$2" "file://$PWD/og.html?f=$1" >/dev/null 2>&1; }
shot 0.62 "$OUT/og.png"
i=0; while [ $i -lt $N ]; do shot "$(echo "$i $N" | awk '{printf "%.4f", $1/$2}')" "$TMP/$(printf %03d $i).png"; i=$((i+1)); done
ffmpeg -y -loglevel error -framerate 15 -i "$TMP/%03d.png" -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart -vf "scale=1200:630" "$OUT/og.mp4"
rm -rf "$TMP"; ls -la "$OUT/og.png" "$OUT/og.mp4"
